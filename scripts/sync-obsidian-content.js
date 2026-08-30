#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const matter = require('gray-matter');

const projectRoot = process.cwd();
const sourceRoot = path.resolve(
  process.env.BLOG_CONTENT_DIR || path.join(projectRoot, '..', 'blog-content')
);
const sourceAssetRoot = path.resolve(
  process.env.BLOG_ASSET_ROOT || '/Volumes/BigDisk/通用素材/图片素材/blog-content'
);
const exportRoot = path.join(projectRoot, 'content-export');
const publicAssetRoot = path.join(projectRoot, 'public', 'obsidian-assets');

function ensureInsideProject(target) {
  const relative = path.relative(projectRoot, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`受管目标不在 Blog 项目内：${target}`);
  }
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
  return files.sort();
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function validateContent() {
  const result = spawnSync(
    process.execPath,
    [path.join(projectRoot, 'scripts', 'validate-content.js'), '--content-dir', sourceRoot],
    { cwd: projectRoot, encoding: 'utf8' }
  );
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  if (result.status !== 0) throw new Error('内容库校验未通过，拒绝生成公开快照');
}

function publishedPosts() {
  const postsDir = path.join(sourceRoot, 'posts');
  return walkFiles(postsDir)
    .filter((filePath) => /\.md(?:own)?$/i.test(filePath))
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(raw);
      return {
        filePath,
        raw,
        data: parsed.data || {},
      };
    })
    .filter((post) => String(post.data.status || '').toLowerCase() === 'published');
}

function prepareSnapshot(posts) {
  ensureInsideProject(exportRoot);
  const temporaryRoot = path.join(projectRoot, `.content-export-tmp-${process.pid}`);
  ensureInsideProject(temporaryRoot);
  if (fs.existsSync(temporaryRoot)) fs.rmSync(temporaryRoot, { recursive: true, force: true });
  ensureDirectory(path.join(temporaryRoot, 'posts'));
  ensureDirectory(path.join(temporaryRoot, 'config'));

  const manifestPosts = [];
  for (const post of posts) {
    const fileName = path.basename(post.filePath);
    const targetPath = path.join(temporaryRoot, 'posts', fileName);
    fs.writeFileSync(targetPath, post.raw, 'utf8');
    manifestPosts.push({
      file: `posts/${fileName}`,
      slug: String(post.data.slug || ''),
      notion_id: String(post.data.notion_id || ''),
      sha256: hashBuffer(Buffer.from(post.raw)),
    });
  }

  for (const fileName of ['notices.yml', 'submenus.yml']) {
    const sourcePath = path.join(sourceRoot, 'config', fileName);
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, path.join(temporaryRoot, 'config', fileName));
    }
  }

  const manifest = {
    generated_at: new Date().toISOString(),
    source: 'private-obsidian-vault',
    published_post_count: manifestPosts.length,
    posts: manifestPosts,
  };
  fs.writeFileSync(
    path.join(temporaryRoot, 'publish-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8'
  );
  fs.writeFileSync(
    path.join(temporaryRoot, 'README.md'),
    '# 自动生成的公开内容快照\n\n此目录由 `scripts/sync-obsidian-content.js` 从私有 Obsidian 发布库生成，只包含 `status: published` 的文章。请勿手工编辑。\n',
    'utf8'
  );

  if (fs.existsSync(exportRoot)) {
    const backupRoot = path.join(projectRoot, 'backups', `content-export-${timestamp()}`);
    ensureDirectory(path.dirname(backupRoot));
    fs.renameSync(exportRoot, backupRoot);
  }
  fs.renameSync(temporaryRoot, exportRoot);
  return manifest;
}

function syncPublicAssets() {
  ensureInsideProject(publicAssetRoot);
  ensureDirectory(publicAssetRoot);
  const changed = [];
  const backupRoot = path.join(projectRoot, 'backups', `published-assets-${timestamp()}`);

  for (const sourcePath of walkFiles(sourceAssetRoot)) {
    const relativePath = path.relative(sourceAssetRoot, sourcePath);
    const targetPath = path.join(publicAssetRoot, relativePath);
    ensureInsideProject(targetPath);
    const sourceHash = hashFile(sourcePath);
    const targetHash = fs.existsSync(targetPath) ? hashFile(targetPath) : '';
    if (sourceHash === targetHash) continue;

    if (fs.existsSync(targetPath)) {
      const backupPath = path.join(backupRoot, relativePath);
      ensureDirectory(path.dirname(backupPath));
      fs.copyFileSync(targetPath, backupPath);
    }
    ensureDirectory(path.dirname(targetPath));
    fs.copyFileSync(sourcePath, targetPath);
    changed.push(relativePath);
  }
  return changed;
}

function verifyPublishedAssetReferences(posts) {
  const failures = [];
  const pattern = /https:\/\/hyphentech\.top\/obsidian-assets\/([^\s)"']+)/g;
  for (const post of posts) {
    for (const match of post.raw.matchAll(pattern)) {
      const relativePath = decodeURIComponent(match[1]);
      const targetPath = path.join(publicAssetRoot, relativePath);
      if (!fs.existsSync(targetPath)) {
        failures.push(`${path.basename(post.filePath)} -> ${relativePath}`);
      }
    }
  }
  if (failures.length) {
    throw new Error(`公开素材缺失：\n${failures.map((item) => `  - ${item}`).join('\n')}`);
  }
}

function main() {
  validateContent();
  const posts = publishedPosts();
  const changedAssets = syncPublicAssets();
  verifyPublishedAssetReferences(posts);
  const manifest = prepareSnapshot(posts);
  console.log(
    `✅ Obsidian 发布快照完成：${manifest.published_post_count} 篇文章，${changedAssets.length} 个素材更新`
  );
}

try {
  main();
} catch (error) {
  console.error(`❌ Obsidian 发布快照失败：${error.message}`);
  process.exit(1);
}
