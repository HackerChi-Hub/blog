#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const { COMMENTS_API } = require('../lib/comments-config.cjs');
const { fetchWithTimeout, withRetry } = require('./verify-live');
const origin = 'https://hyphentech.top';

async function check() {
  for (const slug of ['teahouse','localbrain-local-ai-box']) {
    const response = await fetchWithTimeout(COMMENTS_API + '?slug=' + slug, 15000, { headers:{ origin } });
    assert.equal(response.status,200,'留言列表不可读');
    assert.equal(response.headers.get('access-control-allow-origin'),origin,'缺少精确来源头');
    assert.equal(response.headers.get('cache-control'),'no-store','留言不可缓存');
    const data = JSON.parse(await response.text());
    assert.equal(data.slug,slug); assert(Array.isArray(data.comments));
    for (const comment of data.comments) {
      assert(!('ip_hash' in comment) && !('ua' in comment) && !('status' in comment),'公开列表不得泄露管理字段');
    }
  }
  const options = await fetchWithTimeout(COMMENTS_API,15000,{method:'OPTIONS',headers:{origin,'access-control-request-method':'POST','access-control-request-headers':'content-type'}});
  assert.equal(options.status,204); assert.equal(options.headers.get('access-control-allow-origin'),origin);
  const blocked = await fetchWithTimeout(COMMENTS_API,15000,{headers:{origin:'https://untrusted.invalid'}});
  assert.equal(blocked.status,403); assert(!blocked.headers.get('access-control-allow-origin'));
  const admin = await fetchWithTimeout(COMMENTS_API + '/admin/stats',15000,{headers:{origin}});
  assert.equal(admin.status,401,'管理接口必须拒绝无凭据访问');
  // 缺少验证码的负向请求必须被拒绝；不完成验证、不产生公开测试留言。
  const invalid = await fetchWithTimeout(COMMENTS_API,15000,{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({slug:'teahouse',nickname:'迁移验收',content:'缺少验证不得写入'})});
  assert.equal(invalid.status,403,'缺少验证码必须拒绝写入');
  assert.equal(invalid.headers.get('access-control-allow-origin'),origin);
}
withRetry(check,{deadlineMs:60000,gapMs:3000}).then(()=>console.log('✅ 独立留言接口线上验收：茶馆与文章列表、精确跨域、预检、隐私字段及无验证拒绝写入')).catch(error=>{console.error('❌ 留言迁移验收失败：'+error.message);process.exitCode=1;});
