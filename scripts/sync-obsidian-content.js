#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const matter = require('gray-matter');

const scriptRoot = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = {
    projectRoot: process.cwd(),
    contentDir: process.env.BLOG_CONTENT_DIR || '',
    assetRoot: process.env.BLOG_ASSET_ROOT || '',
    exportDir: process.env.BLOG_EXPORT_DIR || '',
    publicAssetDir: process.env.BLOG_PUBLIC_ASSET_DIR || '',
  };
  const options = {
    '--project-root': 'projectRoot',
    '--content-dir': 'contentDir',
    '--asset-root': 'assetRoot',
    '--export-dir': 'exportDir',
    '--public-asset-dir': 'publicAssetDir',
  };
  for (let index = 0; index < argv.length; index += 1) {
    const key = options[argv[index]];
    if (!key) throw new Error(`未知参数：${argv[index]}`);
    const value = argv[index + 1];
    if (!value) throw new Error(`${argv[index]} 缺少值`);
    args[key] = value;
    index += 1;
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const projectRoot = path.resolve(args.projectRoot);
const sourceRoot = path.resolve(args.contentDir || path.join(projectRoot, '..', 'blog-content'));
const sourceAssetRoot = path.resolve(
  args.assetRoot || '/Volumes/BigDisk/通用素材/图片素材/blog-content'
);
const exportRoot = path.resolve(args.exportDir || path.join(projectRoot, 'content-export'));
const publicAssetRoot = path.resolve(
  args.publicAssetDir || path.join(projectRoot, 'public', 'obsidian-assets')
);

function ensureInside(root, target, label) {
  const relative = path.relative(root, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`${label} 不在允许目录内：${target}`);
  }
  return relative;
}

function ensureManagedTarget(target) {
  ensureInside(projectRoot, target, '受管目标');
}

function ensureDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function hashBuffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function hashFile(filePath) {
  return hashBuffer(fs.readFileSync(filePath));
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(absolutePath));
    else if (entry.isFile()) files.push(absolutePath);
  }
  return files.sort((left, right) => left.localeCompare(right, 'zh-CN'));
}

function validateContent() {
  const result = spawnSync(
    process.execPath,
    [path.join(scriptRoot, 'scripts', 'validate-content.js'), '--content-dir', sourceRoot],
    { cwd: scriptRoot, encoding: 'utf8' }
  );
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  if (result.status !== 0) throw new Error('内容库校验未通过，拒绝生成公开快照');
}

function publishedPosts() {
  const postsDir = path.join(sourceRoot, 'posts');
  return walkFiles(postsDir)
    .filter(
      (filePath) =>
        /\.md(?:own)?$/i.test(filePath) &&
        !/\.(?:bak|backup)\.md(?:own)?$/i.test(filePath)
    )
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(raw);
      return { filePath, raw, data: parsed.data || {} };
    })
    .filter((post) => String(post.data.status || '').toLowerCase() === 'published');
}

function copyFile(sourcePath, targetPath) {
  ensureDirectory(path.dirname(targetPath));
  fs.copyFileSync(sourcePath, targetPath);
}

function rewritePreviewReferences(raw) {
  return String(raw).replace(
    /(?:\.\.\/)?preview-assets\/([^\s)"'<>\]]+)/g,
    (_match, relativePath) => `/obsidian-assets/${relativePath}`
  );
}

function prepareSnapshot(posts, temporaryRoot) {
  const snapshotRoot = path.join(temporaryRoot, 'content-export');
  ensureDirectory(path.join(snapshotRoot, 'posts'));
  ensureDirectory(path.join(snapshotRoot, 'config'));

  const manifestPosts = [];
  for (const post of posts) {
    const relativePath = ensureInside(
      path.join(sourceRoot, 'posts'),
      post.filePath,
      '文章源文件'
    );
    const normalizedRelative = relativePath.split(path.sep).join('/');
    const exportedRaw = rewritePreviewReferences(post.raw);
    const exportedPath = path.join(snapshotRoot, 'posts', relativePath);
    ensureDirectory(path.dirname(exportedPath));
    fs.writeFileSync(exportedPath, exportedRaw, 'utf8');
    manifestPosts.push({
      file: `posts/${normalizedRelative}`,
      slug: String(post.data.slug || ''),
      legacy_paths: Array.isArray(post.data.legacy_paths)
        ? post.data.legacy_paths.map((value) => String(value))
        : [],
      notion_id: String(post.data.notion_id || ''),
      sha256: hashBuffer(Buffer.from(exportedRaw)),
    });
  }

  const configEntries = [];
  for (const fileName of ['notices.yml', 'submenus.yml']) {
    const sourcePath = path.join(sourceRoot, 'config', fileName);
    if (!fs.existsSync(sourcePath)) throw new Error(`缺少站点配置：config/${fileName}`);
    copyFile(sourcePath, path.join(snapshotRoot, 'config', fileName));
    configEntries.push({ file: `config/${fileName}`, sha256: hashFile(sourcePath) });
  }

  const contentHash = hashBuffer(
    Buffer.from(JSON.stringify({ posts: manifestPosts, config: configEntries }))
  );
  const manifest = {
    schema_version: 1,
    source: 'private-obsidian-vault',
    content_sha256: contentHash,
    published_post_count: manifestPosts.length,
    posts: manifestPosts,
    config: configEntries,
  };
  fs.writeFileSync(
    path.join(snapshotRoot, 'publish-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8'
  );
  fs.writeFileSync(
    path.join(snapshotRoot, 'README.md'),
    '# 自动生成的公开内容快照\n\n此目录由 `scripts/sync-obsidian-content.js` 从私有 Obsidian 发布库生成，只包含 `status: published` 的文章。请勿手工编辑。\n',
    'utf8'
  );
  return { snapshotRoot, manifest };
}

function decodeAssetReference(rawReference) {
  const withoutQuery = rawReference.replace(/[?#].*$/, '');
  let decoded;
  try {
    decoded = decodeURIComponent(withoutQuery);
  } catch (error) {
    throw new Error(`素材地址编码无效：${rawReference}`);
  }
  if (!decoded || decoded.includes('\\') || decoded.includes('\0')) {
    throw new Error(`素材相对路径无效：${rawReference}`);
  }
  const normalized = path.posix.normalize(decoded.replace(/^\/+/, ''));
  if (!normalized || normalized === '.' || normalized === '..' || normalized.startsWith('../')) {
    throw new Error(`素材路径越界：${rawReference}`);
  }
  return normalized;
}

function collectAssetReferences(posts) {
  const sources = posts.map((post) => ({
    name: path.basename(post.filePath),
    raw: rewritePreviewReferences(post.raw),
  }));
  for (const fileName of ['notices.yml', 'submenus.yml']) {
    const filePath = path.join(sourceRoot, 'config', fileName);
    sources.push({ name: `config/${fileName}`, raw: fs.readFileSync(filePath, 'utf8') });
  }

  const references = new Map();
  const pattern = /(?:https:\/\/hyphentech\.top)?\/obsidian-assets\/([^\s)"'<>\]]+)/g;
  for (const source of sources) {
    for (const match of source.raw.matchAll(pattern)) {
      const relativePath = decodeAssetReference(match[1]);
      if (!references.has(relativePath)) references.set(relativePath, []);
      references.get(relativePath).push(source.name);
    }
  }
  return references;
}

function preparePublicAssets(posts, temporaryRoot) {
  const assetRoot = path.join(temporaryRoot, 'obsidian-assets');
  ensureDirectory(assetRoot);
  const references = collectAssetReferences(posts);
  const copied = new Set();
  const manifestDirectories = new Set();

  for (const [relativePath, owners] of references.entries()) {
    const sourcePath = path.resolve(sourceAssetRoot, relativePath);
    ensureInside(sourceAssetRoot, sourcePath, '素材源文件');
    if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
      throw new Error(`公开素材缺失：${owners.join(', ')} -> ${relativePath}`);
    }
    copyFile(sourcePath, path.join(assetRoot, ...relativePath.split('/')));
    copied.add(relativePath);
    const firstSegment = relativePath.split('/')[0];
    if (firstSegment) manifestDirectories.add(firstSegment);
  }

  for (const directory of manifestDirectories) {
    const manifestSource = path.join(sourceAssetRoot, directory, 'source-manifest.json');
    if (!fs.existsSync(manifestSource)) continue;
    const relativePath = `${directory}/source-manifest.json`;
    copyFile(manifestSource, path.join(assetRoot, directory, 'source-manifest.json'));
    copied.add(relativePath);
  }

  for (const relativePath of references.keys()) {
    if (!fs.existsSync(path.join(assetRoot, ...relativePath.split('/')))) {
      throw new Error(`临时公开素材树缺失：${relativePath}`);
    }
  }
  return { assetRoot, references, copied };
}

function treeFingerprint(directory) {
  return walkFiles(directory).map((filePath) => ({
    file: path.relative(directory, filePath).split(path.sep).join('/'),
    sha256: hashFile(filePath),
  }));
}

function sameTree(left, right) {
  if (!fs.existsSync(left) || !fs.existsSync(right)) return false;
  return JSON.stringify(treeFingerprint(left)) === JSON.stringify(treeFingerprint(right));
}

function applyTransaction(replacements, transactionRoot) {
  const applied = [];
  try {
    for (const replacement of replacements) {
      ensureManagedTarget(replacement.target);
      const backup = path.join(transactionRoot, 'previous', replacement.name);
      const record = { ...replacement, backup, backedUp: false, installed: false };
      applied.push(record);
      if (fs.existsSync(replacement.target)) {
        ensureDirectory(path.dirname(backup));
        fs.renameSync(replacement.target, backup);
        record.backedUp = true;
      }
      ensureDirectory(path.dirname(replacement.target));
      fs.renameSync(replacement.temporary, replacement.target);
      record.installed = true;
    }
  } catch (error) {
    for (const replacement of applied.reverse()) {
      if (replacement.installed) {
        fs.rmSync(replacement.target, { recursive: true, force: true });
      }
      if (replacement.backedUp && fs.existsSync(replacement.backup)) {
        ensureDirectory(path.dirname(replacement.target));
        fs.renameSync(replacement.backup, replacement.target);
      }
    }
    throw error;
  }
}

function main() {
  ensureManagedTarget(exportRoot);
  ensureManagedTarget(publicAssetRoot);
  validateContent();
  const posts = publishedPosts();
  ensureDirectory(projectRoot);
  const temporaryRoot = fs.mkdtempSync(path.join(projectRoot, '.content-sync-'));
  try {
    const { snapshotRoot, manifest } = prepareSnapshot(posts, temporaryRoot);
    const { assetRoot, references, copied } = preparePublicAssets(posts, temporaryRoot);
    const replacements = [];
    if (!sameTree(snapshotRoot, exportRoot)) {
      replacements.push({ name: 'content-export', temporary: snapshotRoot, target: exportRoot });
    }
    if (!sameTree(assetRoot, publicAssetRoot)) {
      replacements.push({ name: 'obsidian-assets', temporary: assetRoot, target: publicAssetRoot });
    }
    if (replacements.length) applyTransaction(replacements, temporaryRoot);
    console.log(
      `✅ Obsidian 发布快照完成：${manifest.published_post_count} 篇文章，` +
        `${references.size} 个正文素材引用，${copied.size} 个公开文件，` +
        `${replacements.length ? `更新 ${replacements.map((item) => item.name).join('、')}` : '内容无变化'}`
    );
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

try {
  main();
} catch (error) {
  console.error(`❌ Obsidian 发布快照失败：${error.message}`);
  process.exit(1);
}
