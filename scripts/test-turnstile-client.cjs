const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// 运行实际hook的状态与生命周期；隔离模拟官方组件，不使用生产验证码或令牌。
const source = fs.readFileSync('components/Comments.js', 'utf8');
const hook = source.slice(source.indexOf('function useTurnstile('), source.indexOf('\nfunction CommentItem('));
function setup({ loaded = true, narrow = false } = {}) {
  const slots = [], timers = new Map(), widgets = [], removed = [], scripts = [];
  let cursor = 0, deps, cleanup, pending;
  const window = {
    matchMedia: () => ({ matches: narrow }),
  };
  const official = {
    render: (_, options) => { widgets.push(options); return widgets.length; },
    remove: id => removed.push(id),
    getResponse: () => '',
  };
  if (loaded) window.turnstile = official;
  const context = {
    window, TURNSTILE_SITE_KEY: 'isolated-test-key', TURNSTILE_SCRIPT: 'isolated-test-script',
    document: {
      querySelector: () => scripts.find(s => !s.removed) || null,
      createElement: () => ({ dataset: {}, listeners: {}, addEventListener(k, fn) { this.listeners[k] = fn; }, removeEventListener(k) { delete this.listeners[k]; }, remove() { this.removed = true; } }),
      head: { appendChild: s => scripts.push(s) },
    },
    setTimeout: fn => { const id = Symbol(); timers.set(id, fn); return id; },
    clearTimeout: id => timers.delete(id),
    useRef: initial => { const i = cursor++; return slots[i] ||= { current: initial }; },
    useState: initial => {
      const i = cursor++;
      if (!(i in slots)) slots[i] = initial;
      return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }];
    },
    useCallback: fn => fn,
    useEffect: (fn, next) => {
      if (!deps || next.some((v, i) => v !== deps[i])) {
        pending = () => { cleanup?.(); cleanup = fn(); };
        deps = next;
      }
    },
  };
  vm.runInNewContext(hook + '\nthis.useHook = useTurnstile;', context);
  const container = { current: {} };
  function render() { cursor = 0; const result = context.useHook(container, true); const effect = pending; pending = null; effect?.(); return effect ? render() : result; }
  render();
  return { render, widgets, removed, scripts, timers, window, official, unmount: () => cleanup?.() };
}

const normal = setup();
assert.equal(normal.render().status, 'loading', '渲染组件不等于验证通过');
assert.equal(normal.render().getToken(), '', '无有效响应时不生成令牌');
assert.equal(normal.widgets[0]['error-callback']('300030'), true);
assert.equal(normal.render().status, 'failed', '错误必须结束等待');
normal.render().reset();
assert.equal(normal.render().status, 'loading');
assert.equal(normal.widgets.length, 2, '重试必须重新请求官方验证');
assert.deepEqual(normal.removed, [1]);
normal.widgets[0].callback();
assert.equal(normal.render().status, 'loading', '旧验证回调不可覆盖新验证');
normal.widgets[1].callback();
assert.equal(normal.render().status, 'ready');
assert.equal(normal.timers.size, 0, '通过后清除超时');
normal.widgets[1]['expired-callback']();
assert.equal(normal.render().status, 'expired');
normal.unmount();
assert.deepEqual(normal.removed, [1, 2]);

const stalled = setup({ narrow: true });
assert.equal(stalled.widgets[0].size, 'compact', '窄屏使用不会撑破表单的验证组件');
for (const callback of [...stalled.timers.values()]) callback();
assert.equal(stalled.render().status, 'failed', '网络阻塞不可无限等待');

const interactive = setup();
interactive.widgets[0]['before-interactive-callback']();
assert.equal(interactive.render().status, 'interaction');
assert.equal(interactive.timers.size, 0, '等待用户手动验证不冒充网络超时');
interactive.widgets[0].callback();
assert.equal(interactive.render().status, 'ready');

const blocked = setup({ loaded: false });
blocked.scripts[0].listeners.error();
assert.equal(blocked.render().status, 'failed');
blocked.render().reset();
blocked.render();
assert.equal(blocked.scripts[0].removed, true);
assert.equal(blocked.scripts.length, 2, '脚本失败后可以重新加载，不复用死脚本');
blocked.window.turnstile = blocked.official;
blocked.scripts[1].listeners.load();
blocked.widgets[0].callback();
assert.equal(blocked.render().status, 'ready');
blocked.unmount();
assert.equal(blocked.timers.size, 0);

const hanging = setup({ loaded: false });
for (const callback of [...hanging.timers.values()]) callback();
assert.equal(hanging.render().status, 'failed');
hanging.render().reset();
hanging.render();
assert.equal(hanging.scripts[0].removed, true, '脚本一直无响应时重试也必须重新加载');
assert.equal(hanging.scripts.length, 2);
assert(source.includes('turnstileToken: token'), '提交继续携带官方令牌，服务端鉴权不变');
console.log('✅ 验证码客户端回归通过：失败、超时、过期、脚本阻塞、真实重试、旧回调隔离与窄屏');
