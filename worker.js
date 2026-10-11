// منصة تعليمية متكاملة على Cloudflare Workers
// D1 (قاعدة البيانات) + R2 (الفيديوهات والملفات) + بوت تيليجرام
// الاعداد في wrangler.toml والشرح في README.md

const VER = '1791699615263';
const ASSETS = {
  css: `:root{
  --paper:#f5f0e4;--paper2:#ece5d3;--card:#fbf8f0;--ink:#1b2422;--ink2:#52605c;--mute:#85908b;
  --line:#d9cfb9;--green:#1e4b43;--green2:#2b6459;--deep:#143530;--ochre:#b5702b;--rust:#a4472b;--gold:#b9953f;
  --ok:#2e6b4a;--bad:#9c3a2c;--r:6px;
  --fd:'Amiri','Noto Naskh Arabic','Traditional Arabic',serif;
  --fb:'IBM Plex Sans Arabic','Segoe UI',Tahoma,Arial,sans-serif;
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;color:var(--ink);font:400 16px/1.8 var(--fb);
  background-color:var(--paper);
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cpath d='M36 6l7 15 15-7-7 15 15 7-15 7 7 15-15-7-7 15-7-15-15 7 7-15-15-7 15-7-7-15 15 7z' fill='none' stroke='%231e4b43' stroke-opacity='.06'/%3E%3C/svg%3E");}
h1,h2,h3,h4{font-family:var(--fd);font-weight:700;line-height:1.35;margin:0 0 .5em;color:var(--deep)}
h1{font-size:2.1rem}h2{font-size:1.6rem}h3{font-size:1.3rem}
a{color:var(--green2)}
button,input,select,textarea{font:inherit;color:inherit}
.hide{display:none!important}
.muted{color:var(--ink2)}.small{font-size:.86rem}.mute{color:var(--mute)}
.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.sp{flex:1}
.grid{display:grid;gap:18px}
.g2{grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}
.g3{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
.stack>*+*{margin-top:14px}

.card{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:20px}
.orn{display:flex;align-items:center;gap:12px;color:var(--gold);margin:6px 0 18px}
.orn:before,.orn:after{content:"";flex:1;height:1px;background:var(--line)}
.orn i{width:8px;height:8px;background:var(--gold);transform:rotate(45deg)}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid var(--green);background:var(--green);color:var(--paper);
  padding:9px 18px;border-radius:var(--r);cursor:pointer;text-decoration:none;font-weight:500;line-height:1.4;transition:background .15s}
.btn:hover{background:var(--green2)}
.btn[disabled]{opacity:.55;cursor:default}
.btn.ghost{background:transparent;color:var(--green)}
.btn.ghost:hover{background:rgba(30,75,67,.08)}
.btn.warn{background:var(--rust);border-color:var(--rust)}
.btn.danger{background:transparent;border-color:var(--bad);color:var(--bad)}
.btn.danger:hover{background:rgba(156,58,44,.08)}
.btn.sm{padding:4px 11px;font-size:.88rem}
.btn.block{display:flex;width:100%}

label.f{display:block;margin-bottom:14px}
label.f>span{display:block;font-size:.9rem;color:var(--ink2);margin-bottom:4px}
input[type=text],input[type=password],input[type=search],input[type=number],input[type=url],select,textarea{
  width:100%;padding:9px 12px;background:#fffdf7;border:1px solid var(--line);border-radius:var(--r);outline:none}
input:focus,select:focus,textarea:focus{border-color:var(--green2);box-shadow:0 0 0 2px rgba(43,100,89,.15)}
textarea{min-height:110px;resize:vertical}
.ltr{direction:ltr;text-align:left}
.check{display:flex;gap:8px;align-items:center;cursor:pointer}
.check input{width:18px;height:18px;accent-color:var(--green)}

.tag{display:inline-block;font-size:.78rem;padding:1px 9px;border:1px solid var(--line);border-radius:3px;color:var(--ink2);background:var(--paper)}
.tag.ok{color:var(--ok);border-color:#b9d3c3;background:#eef5ef}
.tag.bad{color:var(--bad);border-color:#e0bfb8;background:#f8ece9}
.tag.warn{color:#8a5a14;border-color:#e4cf9f;background:#faf3e0}

.bar{height:6px;background:var(--paper2);border-radius:3px;overflow:hidden}
.bar>i{display:block;height:100%;background:var(--green2)}

table.t{width:100%;border-collapse:collapse;font-size:.95rem}
table.t th{text-align:right;font-weight:500;color:var(--mute);font-size:.82rem;padding:8px 10px;border-bottom:1px solid var(--line);white-space:nowrap}
table.t td{padding:10px;border-bottom:1px solid var(--line);vertical-align:middle}
table.t tr:hover td{background:rgba(255,255,255,.5)}
.scroll{overflow-x:auto}

.toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:var(--deep);color:var(--paper);padding:10px 20px;border-radius:var(--r);z-index:99;max-width:90vw;box-shadow:0 6px 24px rgba(0,0,0,.2)}
.toast.bad{background:var(--bad)}

.ovl{position:fixed;inset:0;background:rgba(20,30,28,.55);display:flex;align-items:flex-start;justify-content:center;padding:4vh 12px;overflow:auto;z-index:50}
.modal{background:var(--card);border-radius:var(--r);width:100%;max-width:680px;border:1px solid var(--line)}
.modal.wide{max-width:900px}
.modal>header{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--line)}
.modal>header h3{margin:0}
.modal .x{background:none;border:0;font-size:1.6rem;line-height:1;cursor:pointer;color:var(--mute)}
.modal .bd{padding:20px}
.modal>footer{padding:14px 20px;border-top:1px solid var(--line);display:flex;gap:10px;justify-content:flex-start;flex-wrap:wrap}

.codebox{font:600 1.5rem/1.4 ui-monospace,Consolas,monospace;letter-spacing:.12em;direction:ltr;text-align:center;background:var(--paper);border:1px dashed var(--gold);padding:14px;border-radius:var(--r);user-select:all}

/* ---------- الطالب ---------- */
.top{background:var(--deep);color:var(--paper);border-bottom:3px solid var(--gold)}
.top .in{max-width:1080px;margin:0 auto;padding:12px 18px;display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.brand{font:700 1.5rem/1.2 var(--fd);color:var(--paper);text-decoration:none}
.brand small{display:block;font:400 .78rem var(--fb);color:#b9c7c2}
.top nav{display:flex;gap:4px;margin-inline-start:auto;flex-wrap:wrap}
.top nav a{color:#d6e0dc;text-decoration:none;padding:6px 12px;border-radius:var(--r);font-size:.95rem}
.top nav a.on,.top nav a:hover{background:rgba(255,255,255,.1);color:#fff}
.wrap{max-width:1080px;margin:0 auto;padding:26px 18px 60px}
.foot{text-align:center;color:var(--mute);font-size:.85rem;padding:20px}

.login{max-width:430px;margin:9vh auto 0;text-align:center;position:relative}
.login:before{content:"";position:absolute;inset:6px;border:1px solid var(--line);border-radius:3px;pointer-events:none}
.login h1{margin-bottom:.2em}
.login input.code{font:600 1.4rem ui-monospace,Consolas,monospace;letter-spacing:.15em;text-align:center;direction:ltr;text-transform:uppercase}
.errbox{background:#f8ece9;border:1px solid #e0bfb8;color:var(--bad);padding:10px 14px;border-radius:var(--r);margin:12px 0;text-align:right}
.infobox{background:#eef5ef;border:1px solid #b9d3c3;color:var(--ok);padding:10px 14px;border-radius:var(--r);margin:12px 0;text-align:right}

.hello{margin-bottom:22px}
.course{display:flex;flex-direction:column;padding:0;overflow:hidden;text-decoration:none;color:inherit;transition:border-color .15s,transform .15s}
.course:hover{border-color:var(--green2);transform:translateY(-2px)}
.cover{aspect-ratio:16/8;background:var(--green) center/cover no-repeat;display:flex;align-items:center;justify-content:center;color:rgba(245,240,228,.9);font:700 3.4rem var(--fd);position:relative}
.cover.pat{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cpath d='M36 6l7 15 15-7-7 15 15 7-15 7 7 15-15-7-7 15-7-15-15 7 7-15-15-7 15-7-7-15 15 7z' fill='none' stroke='%23f5f0e4' stroke-opacity='.16'/%3E%3C/svg%3E")}
.course .bd{padding:16px 18px 18px}
.course h3{margin-bottom:.2em}
.course p{margin:0 0 12px;color:var(--ink2);font-size:.94rem}

.crumb{font-size:.9rem;color:var(--ink2);margin-bottom:12px}
.crumb a{text-decoration:none}
.lessons{list-style:none;margin:0;padding:0}
.lessons li{border-bottom:1px solid var(--line)}
.lessons li:last-child{border:0}
.lessons a{display:flex;gap:14px;align-items:center;padding:13px 4px;text-decoration:none;color:inherit}
.lessons a:hover{background:rgba(255,255,255,.55)}
.num{width:32px;height:32px;border:1px solid var(--line);border-radius:50%;display:grid;place-items:center;font-size:.88rem;color:var(--ink2);flex:none;background:var(--paper)}
.num.done{background:var(--green);border-color:var(--green);color:var(--paper)}
.num.done:after{content:"";width:9px;height:5px;border:solid var(--paper);border-width:0 0 2px 2px;transform:rotate(-45deg) translate(1px,-1px)}
.num.done span{display:none}

.lesson-head{margin-bottom:16px}
.player{position:relative;background:#000;border-radius:var(--r);overflow:hidden;aspect-ratio:16/9;user-select:none;-webkit-user-select:none}
.player video,.player iframe{width:100%;height:100%;display:block;border:0;background:#000}
.player:fullscreen{aspect-ratio:auto;border-radius:0}
.wm{position:absolute;color:#fff;opacity:.2;font-size:15px;pointer-events:none;white-space:nowrap;text-shadow:0 0 3px #000;transition:top 2.5s ease,left 2.5s ease;z-index:3}
.ctl{position:absolute;left:0;right:0;bottom:0;z-index:4;display:flex;gap:10px;align-items:center;padding:20px 12px 8px;direction:ltr;color:#fff;
  background:linear-gradient(transparent,rgba(0,0,0,.72));transition:opacity .25s}
.ctl button{background:none;border:0;color:#fff;cursor:pointer;padding:4px 8px;font-size:.9rem}
.ctl input[type=range]{flex:1;accent-color:#d9b25a;height:4px}
.ctl select{width:auto;background:rgba(0,0,0,.4);color:#fff;border:1px solid rgba(255,255,255,.3);padding:2px 4px;font-size:.82rem}
.ctl .tm{font-size:.82rem;min-width:84px;text-align:center;font-variant-numeric:tabular-nums}
.player.idle .ctl{opacity:0}
.player.pfs{position:fixed;inset:0;z-index:60;aspect-ratio:auto;border-radius:0}
.fsb{position:absolute;top:8px;left:8px;z-index:5;opacity:.85}
.filecard{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.prose p{margin:0 0 1em}
.prose h3,.prose h4{margin-top:1.2em}
.prose ul{padding-inline-start:1.4em}
.prose blockquote{margin:1em 0;padding:.4em 1em;border-inline-start:3px solid var(--gold);background:var(--paper);color:var(--ink2)}
.quiz .qq{margin-bottom:20px}
.quiz .qq h4{font-family:var(--fb);font-size:1.02rem;color:var(--ink)}
.opt{display:flex;gap:10px;align-items:flex-start;padding:9px 12px;border:1px solid var(--line);border-radius:var(--r);margin-bottom:6px;cursor:pointer;background:#fffdf7}
.opt input{margin-top:7px;accent-color:var(--green)}
.opt.right{border-color:#8fbf9f;background:#eef5ef}
.opt.wrong{border-color:#e0a99f;background:#f8ece9}
.pager{display:flex;justify-content:space-between;gap:10px;margin-top:22px;flex-wrap:wrap}
.ann{padding:16px 0;border-bottom:1px solid var(--line)}
.ann:last-child{border:0}
.ann h3{margin:0 0 .2em}

/* ---------- لوحة التحكم ---------- */
.adm{display:grid;grid-template-columns:230px 1fr;min-height:100vh}
.side{background:var(--deep);color:#d6e0dc;padding:20px 0;position:sticky;top:0;height:100vh;overflow:auto}
.side .brand{display:block;padding:0 20px 18px;border-bottom:1px solid rgba(255,255,255,.1);margin-bottom:12px}
.side a.nl{display:block;color:#c3d1cc;text-decoration:none;padding:10px 20px;border-inline-start:3px solid transparent}
.side a.nl:hover{background:rgba(255,255,255,.06)}
.side a.nl.on{background:rgba(255,255,255,.1);color:#fff;border-inline-start-color:var(--gold)}
.side .bt{padding:14px 20px}
.main{padding:28px 30px 70px;min-width:0}
.main>h2{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:14px;margin-bottom:24px}
.stat{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:14px 16px}
.stat b{display:block;font:700 2rem/1.2 var(--fd);color:var(--deep)}
.stat span{color:var(--ink2);font-size:.9rem}
.stat.alert b{color:var(--bad)}
.tools{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;align-items:center}
.tools input[type=search]{max-width:260px}
.tools select{width:auto}
.thumb{width:64px;height:40px;border-radius:4px;background:var(--green) center/cover;flex:none}
.qb{border:1px solid var(--line);border-radius:var(--r);padding:12px;margin-bottom:12px;background:#fffdf7}
.qb .opts>div{display:flex;gap:8px;align-items:center;margin-top:6px}
.qb .opts input[type=text]{flex:1}
.prog{height:12px;background:var(--paper2);border-radius:3px;overflow:hidden;margin-top:8px}
.prog>i{display:block;height:100%;background:var(--green2);width:0;transition:width .2s}
.pick{max-height:300px;overflow:auto;border:1px solid var(--line);border-radius:var(--r);padding:8px 12px;background:#fffdf7}
.pick .check{padding:3px 0}
.login.adm-login{margin-top:12vh}

@media(max-width:860px){
  .adm{display:block}
  .side{position:static;height:auto;padding:10px 0}
  .side .brand{padding:0 14px 10px;margin-bottom:6px}
  .side nav{display:flex;overflow-x:auto}
  .side a.nl{white-space:nowrap;padding:8px 14px;border-inline-start:0;border-bottom:3px solid transparent}
  .side a.nl.on{border-bottom-color:var(--gold)}
  .side .bt{display:none}
  .main{padding:20px 14px 60px}
  h1{font-size:1.7rem}
}
.main>h2 .btn{font:500 .95rem/1.4 var(--fb)}
.main>h2 .row{gap:8px}
`,
  student: `'use strict';
const $app = document.getElementById('app');

function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'value' || k === 'checked' || k === 'disabled' || k === 'selected') el[k] = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
  }
  for (const c of kids.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
}
// replaceChildren / append تقبلان مصفوفات و null مثل h()
['replaceChildren', 'append'].forEach((name) => {
  const orig = Element.prototype[name];
  Element.prototype[name] = function (...kids) {
    return orig.apply(this, kids.flat(Infinity).filter((c) => c != null && c !== false).map((c) => (c.nodeType ? c : document.createTextNode(String(c)))));
  };
});
const $ = (sel, root) => (root || document).querySelector(sel);
const mount = (el) => { $app.replaceChildren(el); window.scrollTo(0, 0); };

async function api(path, opts) {
  opts = opts || {};
  const o = { method: opts.method || 'GET', headers: { 'x-req': '1' }, credentials: 'same-origin' };
  if (opts.body !== undefined) { o.headers['content-type'] = 'application/json'; o.body = JSON.stringify(opts.body); }
  let r;
  try { r = await fetch(path, o); } catch (e) { throw new Error('تعذر الاتصال بالخادم'); }
  let d = null;
  try { d = await r.json(); } catch (e) {}
  if (!r.ok) { const e = new Error((d && d.error) || 'حدث خطأ'); e.status = r.status; e.data = d; throw e; }
  return d;
}

let toastTimer;
function toast(msg, bad) {
  const old = $('.toast'); if (old) old.remove();
  const t = h('div', { class: 'toast' + (bad ? ' bad' : '') }, msg);
  document.body.append(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), 3500);
}

function fmtDate(ts, withTime) {
  if (!ts) return '-';
  const d = new Date(ts * 1000);
  const o = withTime ? { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' } : { year: 'numeric', month: 'numeric', day: 'numeric' };
  return d.toLocaleString('ar-u-nu-latn', o);
}
function ago(ts) {
  if (!ts) return 'لم يدخل';
  const s = Math.floor(Date.now() / 1000) - ts;
  if (s < 90) return 'الان';
  if (s < 3600) return Math.floor(s / 60) + ' دقيقة';
  if (s < 86400) return Math.floor(s / 3600) + ' ساعة';
  return Math.floor(s / 86400) + ' يوم';
}

function modal(title, body, footer, opts) {
  opts = opts || {};
  const close = () => ovl.remove();
  const ovl = h('div', { class: 'ovl', onmousedown: (e) => { if (e.target === ovl && !opts.sticky) close(); } },
    h('div', { class: 'modal' + (opts.wide ? ' wide' : '') },
      h('header', null, h('h3', null, title), h('button', { class: 'x', type: 'button', onclick: close, 'aria-label': 'اغلاق' }, '×')),
      h('div', { class: 'bd' }, body),
      footer ? h('footer', null, footer) : null));
  document.body.append(ovl);
  return { close, el: ovl };
}

function confirmBox(text, okLabel) {
  return new Promise((res) => {
    const m = modal('تاكيد', h('p', null, text), [
      h('button', { class: 'btn warn', onclick: () => { m.close(); res(true); } }, okLabel || 'تاكيد'),
      h('button', { class: 'btn ghost', onclick: () => { m.close(); res(false); } }, 'الغاء'),
    ], { sticky: true });
  });
}

function field(label, input) { return h('label', { class: 'f' }, h('span', null, label), input); }

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast('تم النسخ'); }
  catch (e) {
    const ta = h('textarea', { value: text, style: 'position:fixed;opacity:0' });
    document.body.append(ta); ta.select();
    try { document.execCommand('copy'); toast('تم النسخ'); } catch (e2) { toast('تعذر النسخ', true); }
    ta.remove();
  }
}

// عرض نص بسيط: عناوين # و ## وقوائم - واقتباس > وخط عريض **
function inlineMd(s) {
  const out = [];
  s.split(/(\\*\\*[^*]+\\*\\*)/).forEach((part) => {
    if (/^\\*\\*[^*]+\\*\\*$/.test(part)) out.push(h('strong', null, part.slice(2, -2)));
    else if (part) out.push(part);
  });
  return out;
}
function mdView(text) {
  const box = h('div', { class: 'prose' });
  String(text || '').split(/\\n{2,}/).forEach((blk) => {
    const lines = blk.split('\\n');
    if (/^#{1,2}\\s/.test(lines[0])) box.append(h(lines[0].startsWith('##') ? 'h4' : 'h3', null, inlineMd(lines[0].replace(/^#+\\s*/, ''))));
    else if (lines.every((l) => /^[-*]\\s/.test(l))) box.append(h('ul', null, lines.map((l) => h('li', null, inlineMd(l.slice(2))))));
    else if (lines.every((l) => /^>\\s?/.test(l))) box.append(h('blockquote', null, inlineMd(lines.map((l) => l.replace(/^>\\s?/, '')).join(' '))));
    else box.append(h('p', null, lines.map((l, i) => [i ? h('br') : null, inlineMd(l)])));
  });
  return box;
}

// ======================= واجهة الطالب =======================
let ME = null, INFO = null, ROUTING = false;

function shell(active, content) {
  const lk = (href, text, key) => h('a', { href, class: active === key ? 'on' : '' }, text);
  return h('div', null,
    h('div', { class: 'top' }, h('div', { class: 'in' },
      h('a', { class: 'brand', href: '#/' }, INFO.site_name, INFO.teacher_name ? h('small', null, INFO.teacher_name) : null),
      h('nav', null, lk('#/', 'كورساتي', 'courses'), lk('#/ann', 'الاعلانات', 'ann'), lk('#/me', 'حسابي', 'me')))),
    h('div', { class: 'wrap' }, content),
    INFO.footer ? h('div', { class: 'foot' }, INFO.footer) : null);
}
function page(active) {
  const box = h('div', null, h('p', { class: 'muted' }, 'جار التحميل ...'));
  mount(shell(active, box));
  return box;
}
async function guard(fn) {
  try { await fn(); } catch (e) {
    if (e.status === 401) { ME = null; viewLogin(); return; }
    mount(shell('', h('div', { class: 'errbox' }, e.message)));
  }
}

async function boot() {
  INFO = INFO || await api('/api/info');
  document.title = INFO.site_name;
  try { ME = await api('/api/me'); } catch (e) { ME = null; }
  if (!ME) return viewLogin();
  if (!ROUTING) { window.addEventListener('hashchange', route); ROUTING = true; }
  route();
}
function route() {
  const hs = location.hash || '#/';
  let m;
  if ((m = hs.match(/^#\\/c\\/(\\d+)/))) return guard(() => viewCourse(+m[1]));
  if ((m = hs.match(/^#\\/l\\/(\\d+)/))) return guard(() => viewLesson(+m[1]));
  if (hs === '#/ann') return guard(viewAnn);
  if (hs === '#/me') return guard(viewMe);
  return guard(viewCourses);
}

// ------------------------------------------------ الدخول
function viewLogin() {
  const card = h('div', { class: 'card login' });
  const st = { step: 'code', code: '', pin: '', otp: '', msg: null, info: false, canOtp: false, busy: false };

  function fmt(v) {
    v = v.toUpperCase().replace(/[^A-Z0-9٠-٩]/g, '').slice(0, 12);
    return v.replace(/(.{4})(?=.)/g, '$1-');
  }
  async function login(e) {
    e.preventDefault();
    if (st.busy) return;
    st.busy = true; st.msg = null; draw();
    try {
      const r = await api('/api/login', { method: 'POST', body: { code: st.code, pin: st.pin } });
      if (r.need_pin) { st.step = 'pin'; st.busy = false; return draw(); }
      st.busy = false;
      return boot();
    } catch (err) {
      st.busy = false;
      if (err.data && err.data.code === 'other_device') { st.step = 'other'; st.canOtp = err.data.can_otp; }
      st.msg = err.message; st.info = false;
      draw();
    }
  }
  async function sendOtp() {
    st.busy = true; st.msg = null; draw();
    try {
      await api('/api/otp/request', { method: 'POST', body: { code: st.code } });
      st.step = 'otp'; st.msg = 'ارسلنا رمزا من 6 ارقام الى بوت تيليجرام المرتبط بحسابك.'; st.info = true;
    } catch (err) { st.msg = err.message; st.info = false; }
    st.busy = false; draw();
  }
  async function verifyOtp(e) {
    e.preventDefault();
    st.busy = true; st.msg = null; draw();
    try {
      await api('/api/otp/verify', { method: 'POST', body: { code: st.code, otp: st.otp } });
      st.busy = false;
      return boot();
    } catch (err) { st.busy = false; st.msg = err.message; st.info = false; draw(); }
  }

  function draw() {
    card.replaceChildren(
      h('h1', null, INFO.site_name),
      INFO.teacher_name ? h('p', { class: 'muted' }, INFO.teacher_name) : null,
      h('div', { class: 'orn' }, h('i')),
      st.step === 'code' || st.step === 'pin' ? h('p', { class: 'muted' }, INFO.welcome) : null,
      st.msg ? h('div', { class: st.info ? 'infobox' : 'errbox' }, st.msg) : null);

    if (st.step === 'code' || st.step === 'pin') {
      const code = h('input', { type: 'text', class: 'code', value: st.code, placeholder: 'XXXX-XXXX-XXXX', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', dir: 'ltr',
        oninput: (e) => { st.code = fmt(e.target.value); e.target.value = st.code; } });
      const pin = st.step === 'pin' ? h('label', { class: 'f' }, h('span', null, 'الرقم السري الثاني (اعطته لك المعلمة)'),
        h('input', { type: 'password', inputmode: 'numeric', autocomplete: 'off', value: st.pin, oninput: (e) => { st.pin = e.target.value; } })) : null;
      card.append(h('form', { onsubmit: login },
        h('label', { class: 'f' }, h('span', null, 'كود الدخول'), code), pin,
        h('button', { class: 'btn block', disabled: st.busy }, st.busy ? 'لحظة ...' : 'دخول')));
      setTimeout(() => (st.step === 'pin' ? card.querySelector('input[type=password]') : code).focus(), 0);
    } else if (st.step === 'other') {
      card.append(
        h('p', { class: 'muted', style: 'text-align:right' }, 'كل كود يعمل لطالب واحد وعلى جهاز واحد. اذا كان هذا حسابك وغيرت جهازك فيمكنك نقله بالتحقق عبر تيليجرام.'),
        st.canOtp ? h('button', { class: 'btn block', disabled: st.busy, onclick: sendOtp }, 'ارسال رمز تحقق الى تيليجرام') : h('p', { class: 'muted' }, 'حسابك غير مرتبط بتيليجرام. تواصل مع المعلمة لنقله الى جهازك الجديد.'),
        h('p', null, h('a', { href: '#', onclick: (e) => { e.preventDefault(); st.step = 'code'; st.msg = null; draw(); } }, 'رجوع')));
    } else if (st.step === 'otp') {
      card.append(h('form', { onsubmit: verifyOtp },
        h('label', { class: 'f' }, h('span', null, 'رمز التحقق'),
          h('input', { type: 'text', class: 'code', inputmode: 'numeric', maxlength: 6, autocomplete: 'one-time-code', dir: 'ltr', oninput: (e) => { st.otp = e.target.value; } })),
        h('button', { class: 'btn block', disabled: st.busy }, 'تاكيد ونقل الحساب'),
        h('p', null, h('a', { href: '#', onclick: (e) => { e.preventDefault(); sendOtp(); } }, 'اعادة ارسال الرمز'))));
    }
  }
  draw();
  mount(h('div', { class: 'wrap' }, card));
}

// ------------------------------------------------ الكورسات
async function viewCourses() {
  const box = page('courses');
  const d = await api('/api/courses');
  box.replaceChildren(
    h('div', { class: 'hello' }, h('h2', null, 'اهلا ' + ME.name), h('div', { class: 'orn' }, h('i'))),
    d.courses.length ? h('div', { class: 'grid g3' }, d.courses.map(courseCard)) : h('div', { class: 'card' }, 'لم يتم تسجيلك في كورسات بعد. تواصل مع المعلمة.'));
}
function courseCard(c) {
  const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
  return h('a', { class: 'card course', href: '#/c/' + c.id },
    h('div', { class: 'cover' + (c.cover ? '' : ' pat'), style: c.cover ? \`background-image:url(/cover/\${encodeURIComponent(c.cover)})\` : '' }, c.cover ? null : c.title.trim().charAt(0)),
    h('div', { class: 'bd' },
      h('h3', null, c.title),
      c.description ? h('p', null, c.description.length > 110 ? c.description.slice(0, 110) + ' ...' : c.description) : null,
      h('div', { class: 'bar' }, h('i', { style: 'width:' + pct + '%' })),
      h('div', { class: 'small muted', style: 'margin-top:6px' }, c.done + ' من ' + c.total + ' درس')));
}

const KINDS = { video: 'فيديو', file: 'ملف', text: 'نص', quiz: 'اختبار' };

async function viewCourse(id) {
  const box = page('courses');
  const d = await api('/api/courses/' + id);
  const done = d.lessons.filter((l) => l.done).length;
  box.replaceChildren(
    h('div', { class: 'crumb' }, h('a', { href: '#/' }, 'كورساتي'), ' / ', d.course.title),
    h('h2', null, d.course.title),
    d.course.description ? h('p', { class: 'muted' }, d.course.description) : null,
    h('div', { class: 'row small muted', style: 'margin:10px 0 4px' }, done + ' من ' + d.lessons.length + ' درس'),
    h('div', { class: 'bar', style: 'margin-bottom:18px' }, h('i', { style: 'width:' + (d.lessons.length ? Math.round((done / d.lessons.length) * 100) : 0) + '%' })),
    h('div', { class: 'card' }, d.lessons.length
      ? h('ul', { class: 'lessons' }, d.lessons.map((l, i) => h('li', null, h('a', { href: '#/l/' + l.id },
        h('span', { class: 'num' + (l.done ? ' done' : '') }, h('span', null, i + 1)),
        h('span', null, l.title),
        h('span', { class: 'sp' }),
        l.kind === 'quiz' && l.score >= 0 ? h('span', { class: 'tag ok' }, l.score + '%') : null,
        h('span', { class: 'tag' }, KINDS[l.kind])))))
      : 'لا توجد دروس بعد.'));
}

// ------------------------------------------------ الدرس
function buildPlayer(d) {
  const box = h('div', { class: 'player', oncontextmenu: (e) => e.preventDefault() });
  const wm = h('div', { class: 'wm' }, d.watermark);
  const place = () => { wm.style.top = 6 + Math.random() * 80 + '%'; wm.style.left = 4 + Math.random() * 62 + '%'; };
  place();
  const t = setInterval(() => { if (!box.isConnected) clearInterval(t); else place(); }, 7000);

  const toggleFs = () => {
    if (box.requestFullscreen) { if (document.fullscreenElement) document.exitFullscreen(); else box.requestFullscreen(); }
    else box.classList.toggle('pfs');
  };

  if (!d.media) {
    if (!d.embed) { box.append(h('div', { class: 'card' }, 'رابط الفيديو غير صالح')); return box; }
    box.append(h('iframe', { src: d.embed, allow: 'accelerometer; encrypted-media; picture-in-picture', referrerpolicy: 'strict-origin-when-cross-origin' }), wm,
      h('button', { class: 'btn sm fsb', type: 'button', onclick: toggleFs }, 'ملء الشاشة'));
    return box;
  }

  const v = h('video', { src: '/media/' + d.id, playsinline: true, preload: 'metadata', disablepictureinpicture: true });
  const play = h('button', { type: 'button' }, 'تشغيل');
  const seek = h('input', { type: 'range', min: 0, max: 1000, value: 0, step: 1 });
  const tm = h('span', { class: 'tm' }, '0:00 / 0:00');
  const speed = h('select', { 'aria-label': 'السرعة' }, [0.75, 1, 1.25, 1.5, 2].map((s) => h('option', { value: s, selected: s === 1 }, s + 'x')));
  const mute = h('button', { type: 'button' }, 'صوت');
  const fs = h('button', { type: 'button' }, 'ملء الشاشة');
  const f = (s) => { s = Math.floor(s || 0); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  let drag = false;
  const toggle = () => { if (v.paused) v.play(); else v.pause(); };
  v.addEventListener('click', toggle);
  play.addEventListener('click', toggle);
  v.addEventListener('play', () => { play.textContent = 'ايقاف'; });
  v.addEventListener('pause', () => { play.textContent = 'تشغيل'; box.classList.remove('idle'); });
  v.addEventListener('timeupdate', () => {
    if (!drag && v.duration) seek.value = Math.round((v.currentTime / v.duration) * 1000);
    tm.textContent = f(v.currentTime) + ' / ' + f(v.duration);
  });
  v.addEventListener('loadedmetadata', () => { tm.textContent = '0:00 / ' + f(v.duration); });
  v.addEventListener('error', () => { tm.textContent = 'تعذر تشغيل الفيديو'; });
  seek.addEventListener('input', () => { drag = true; if (v.duration) v.currentTime = (seek.value / 1000) * v.duration; });
  seek.addEventListener('change', () => { drag = false; });
  speed.addEventListener('change', () => { v.playbackRate = +speed.value; });
  mute.addEventListener('click', () => { v.muted = !v.muted; mute.textContent = v.muted ? 'مكتوم' : 'صوت'; });
  fs.addEventListener('click', toggleFs);
  let idleT;
  const wake = () => { box.classList.remove('idle'); clearTimeout(idleT); if (!v.paused) idleT = setTimeout(() => box.classList.add('idle'), 2600); };
  ['mousemove', 'touchstart', 'keydown'].forEach((ev) => box.addEventListener(ev, wake, { passive: true }));
  box.append(v, wm, h('div', { class: 'ctl' }, play, seek, tm, speed, mute, fs));
  return box;
}

function quizView(d, onDone) {
  const answers = new Array(d.questions.length).fill(-1);
  const box = h('div', { class: 'quiz card' });
  const result = h('div');
  const qs = d.questions.map((qq, i) => {
    const opts = qq.options.map((o, j) => h('label', { class: 'opt' },
      h('input', { type: 'radio', name: 'q' + i, onchange: () => { answers[i] = j; } }), h('span', null, o)));
    return { opts, el: h('div', { class: 'qq' }, h('h4', null, (i + 1) + '. ' + qq.q), opts) };
  });
  const btn = h('button', { class: 'btn', type: 'button', onclick: async () => {
    if (answers.includes(-1)) return toast('اجيبي على كل الاسئلة اولا', true);
    btn.disabled = true;
    try {
      const r = await api('/api/lessons/' + d.id + '/quiz', { method: 'POST', body: { answers } });
      qs.forEach((q, i) => q.opts.forEach((o, j) => {
        o.classList.remove('right', 'wrong');
        if (j === r.answers[i]) o.classList.add('right'); else if (j === answers[i]) o.classList.add('wrong');
        o.querySelector('input').disabled = true;
      }));
      result.replaceChildren(h('div', { class: r.score >= 50 ? 'infobox' : 'errbox' }, 'درجتك: ' + r.score + '%  (' + r.correct.filter(Boolean).length + ' من ' + r.correct.length + ')'),
        h('button', { class: 'btn ghost', onclick: () => viewLesson(d.id) }, 'اعادة المحاولة'));
      btn.classList.add('hide');
      onDone();
    } catch (e) { toast(e.message, true); btn.disabled = false; }
  } }, 'تسليم الاجابات');
  box.replaceChildren(...[d.score >= 0 ? h('p', { class: 'small muted' }, 'افضل درجة سابقة: ' + d.score + '%') : null, ...qs.map((q) => q.el), btn, result].filter(Boolean));
  return box;
}

async function viewLesson(id) {
  const box = page('courses');
  const d = await api('/api/lessons/' + id);
  let done = !!d.done;
  const doneBtn = h('button', { class: 'btn ' + (done ? 'ghost' : ''), onclick: async () => {
    done = !done;
    await api('/api/lessons/' + id + '/done', { method: 'POST', body: { done } });
    doneBtn.textContent = done ? 'تم الاكمال (الغاء)' : 'تم، اكملت الدرس';
    doneBtn.className = 'btn ' + (done ? 'ghost' : '');
  } }, done ? 'تم الاكمال (الغاء)' : 'تم، اكملت الدرس');

  let content;
  if (d.kind === 'video') content = [buildPlayer(d), d.body ? h('div', { class: 'card', style: 'margin-top:16px' }, mdView(d.body)) : null];
  else if (d.kind === 'file') content = h('div', { class: 'card stack' },
    h('div', { class: 'filecard' }, h('div', null, h('h3', { style: 'margin:0' }, d.media ? d.media.name : d.title), h('div', { class: 'small muted' }, 'ملف مرفق')),
      h('span', { class: 'sp' }),
      h('a', { class: 'btn ghost', href: '/media/' + id, target: '_blank', rel: 'noopener' }, 'فتح'),
      h('a', { class: 'btn', href: '/media/' + id + '?dl=1' }, 'تحميل')),
    d.body ? mdView(d.body) : null);
  else if (d.kind === 'quiz') content = quizView(d, () => { done = true; });
  else content = h('div', { class: 'card' }, mdView(d.body));

  box.replaceChildren(
    h('div', { class: 'crumb' }, h('a', { href: '#/' }, 'كورساتي'), ' / ', h('a', { href: '#/c/' + d.course_id }, d.course_title)),
    h('div', { class: 'lesson-head' }, h('h2', null, d.title)),
    content,
    h('div', { class: 'pager' },
      d.prev ? h('a', { class: 'btn ghost', href: '#/l/' + d.prev }, 'الدرس السابق') : h('span'),
      d.kind !== 'quiz' ? doneBtn : null,
      d.next ? h('a', { class: 'btn', href: '#/l/' + d.next }, 'الدرس التالي') : h('a', { class: 'btn ghost', href: '#/c/' + d.course_id }, 'فهرس الكورس')));
}

// ------------------------------------------------ الاعلانات وحسابي
async function viewAnn() {
  const box = page('ann');
  const d = await api('/api/announcements');
  box.replaceChildren(h('h2', null, 'الاعلانات'), h('div', { class: 'orn' }, h('i')),
    h('div', { class: 'card' }, d.items.length ? d.items.map((a) => h('div', { class: 'ann' },
      h('h3', null, a.title, a.pinned ? h('span', { class: 'tag warn', style: 'margin-inline-start:8px' }, 'مثبت') : null),
      h('div', { class: 'small mute' }, fmtDate(a.created_at) + (a.course ? ' - ' + a.course : '')),
      mdView(a.body))) : 'لا توجد اعلانات.'));
}

async function viewMe() {
  const box = page('me');
  ME = await api('/api/me');
  const link = async () => {
    try {
      const r = await api('/api/me/tglink', { method: 'POST' });
      modal('ربط تيليجرام', h('div', { class: 'stack' },
        h('p', null, 'افتح البوت وارسل له الرسالة التالية خلال 10 دقائق:'),
        h('div', { class: 'codebox' }, 'ربط ' + r.token),
        r.bot ? h('a', { class: 'btn block', href: 'https://t.me/' + r.bot + '?start=' + r.token, target: '_blank', rel: 'noopener' }, 'فتح البوت وربط الحساب') : null,
        h('p', { class: 'small muted' }, 'بعد الربط تستطيع نقل حسابك الى جهاز جديد بنفسك عبر رمز يصل الى تيليجرام.')));
    } catch (e) { toast(e.message, true); }
  };
  box.replaceChildren(h('h2', null, 'حسابي'), h('div', { class: 'orn' }, h('i')),
    h('div', { class: 'card stack' },
      h('div', null, h('div', { class: 'small mute' }, 'الاسم'), h('b', null, ME.name), ME.grp ? h('span', { class: 'tag', style: 'margin-inline-start:8px' }, ME.grp) : null),
      h('div', null, h('div', { class: 'small mute' }, 'تاريخ تفعيل الحساب على هذا الجهاز'), fmtDate(ME.claimed_at, true)),
      h('p', { class: 'small muted' }, 'حسابك مربوط بهذا الجهاز فقط. لا يمكن لاي شخص اخر استخدام الكود الخاص بك.'),
      h('div', null, h('div', { class: 'small mute' }, 'تيليجرام'),
        ME.tg_linked ? h('span', { class: 'tag ok' }, 'مرتبط ' + (ME.tg_name || '')) : h('div', { class: 'row' }, h('span', { class: 'tag warn' }, 'غير مرتبط'),
          h('button', { class: 'btn sm', onclick: link }, 'ربط الان'), h('span', { class: 'small muted' }, 'موصى به لنقل الحساب عند تغيير الجهاز'))),
      h('div', null, h('button', { class: 'btn danger', onclick: async () => { await api('/api/logout', { method: 'POST' }); location.hash = ''; ME = null; viewLogin(); } }, 'تسجيل الخروج'))));
}

boot().catch((e) => { $app.replaceChildren(h('div', { class: 'wrap' }, h('div', { class: 'errbox' }, e.message))); });
`,
  admin: `'use strict';
const $app = document.getElementById('app');

function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'value' || k === 'checked' || k === 'disabled' || k === 'selected') el[k] = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
  }
  for (const c of kids.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
}
// replaceChildren / append تقبلان مصفوفات و null مثل h()
['replaceChildren', 'append'].forEach((name) => {
  const orig = Element.prototype[name];
  Element.prototype[name] = function (...kids) {
    return orig.apply(this, kids.flat(Infinity).filter((c) => c != null && c !== false).map((c) => (c.nodeType ? c : document.createTextNode(String(c)))));
  };
});
const $ = (sel, root) => (root || document).querySelector(sel);
const mount = (el) => { $app.replaceChildren(el); window.scrollTo(0, 0); };

async function api(path, opts) {
  opts = opts || {};
  const o = { method: opts.method || 'GET', headers: { 'x-req': '1' }, credentials: 'same-origin' };
  if (opts.body !== undefined) { o.headers['content-type'] = 'application/json'; o.body = JSON.stringify(opts.body); }
  let r;
  try { r = await fetch(path, o); } catch (e) { throw new Error('تعذر الاتصال بالخادم'); }
  let d = null;
  try { d = await r.json(); } catch (e) {}
  if (!r.ok) { const e = new Error((d && d.error) || 'حدث خطأ'); e.status = r.status; e.data = d; throw e; }
  return d;
}

let toastTimer;
function toast(msg, bad) {
  const old = $('.toast'); if (old) old.remove();
  const t = h('div', { class: 'toast' + (bad ? ' bad' : '') }, msg);
  document.body.append(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), 3500);
}

function fmtDate(ts, withTime) {
  if (!ts) return '-';
  const d = new Date(ts * 1000);
  const o = withTime ? { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' } : { year: 'numeric', month: 'numeric', day: 'numeric' };
  return d.toLocaleString('ar-u-nu-latn', o);
}
function ago(ts) {
  if (!ts) return 'لم يدخل';
  const s = Math.floor(Date.now() / 1000) - ts;
  if (s < 90) return 'الان';
  if (s < 3600) return Math.floor(s / 60) + ' دقيقة';
  if (s < 86400) return Math.floor(s / 3600) + ' ساعة';
  return Math.floor(s / 86400) + ' يوم';
}

function modal(title, body, footer, opts) {
  opts = opts || {};
  const close = () => ovl.remove();
  const ovl = h('div', { class: 'ovl', onmousedown: (e) => { if (e.target === ovl && !opts.sticky) close(); } },
    h('div', { class: 'modal' + (opts.wide ? ' wide' : '') },
      h('header', null, h('h3', null, title), h('button', { class: 'x', type: 'button', onclick: close, 'aria-label': 'اغلاق' }, '×')),
      h('div', { class: 'bd' }, body),
      footer ? h('footer', null, footer) : null));
  document.body.append(ovl);
  return { close, el: ovl };
}

function confirmBox(text, okLabel) {
  return new Promise((res) => {
    const m = modal('تاكيد', h('p', null, text), [
      h('button', { class: 'btn warn', onclick: () => { m.close(); res(true); } }, okLabel || 'تاكيد'),
      h('button', { class: 'btn ghost', onclick: () => { m.close(); res(false); } }, 'الغاء'),
    ], { sticky: true });
  });
}

function field(label, input) { return h('label', { class: 'f' }, h('span', null, label), input); }

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast('تم النسخ'); }
  catch (e) {
    const ta = h('textarea', { value: text, style: 'position:fixed;opacity:0' });
    document.body.append(ta); ta.select();
    try { document.execCommand('copy'); toast('تم النسخ'); } catch (e2) { toast('تعذر النسخ', true); }
    ta.remove();
  }
}

// عرض نص بسيط: عناوين # و ## وقوائم - واقتباس > وخط عريض **
function inlineMd(s) {
  const out = [];
  s.split(/(\\*\\*[^*]+\\*\\*)/).forEach((part) => {
    if (/^\\*\\*[^*]+\\*\\*$/.test(part)) out.push(h('strong', null, part.slice(2, -2)));
    else if (part) out.push(part);
  });
  return out;
}
function mdView(text) {
  const box = h('div', { class: 'prose' });
  String(text || '').split(/\\n{2,}/).forEach((blk) => {
    const lines = blk.split('\\n');
    if (/^#{1,2}\\s/.test(lines[0])) box.append(h(lines[0].startsWith('##') ? 'h4' : 'h3', null, inlineMd(lines[0].replace(/^#+\\s*/, ''))));
    else if (lines.every((l) => /^[-*]\\s/.test(l))) box.append(h('ul', null, lines.map((l) => h('li', null, inlineMd(l.slice(2))))));
    else if (lines.every((l) => /^>\\s?/.test(l))) box.append(h('blockquote', null, inlineMd(lines.map((l) => l.replace(/^>\\s?/, '')).join(' '))));
    else box.append(h('p', null, lines.map((l, i) => [i ? h('br') : null, inlineMd(l)])));
  });
  return box;
}

// ======================= لوحة تحكم المعلمة =======================
let SESSION = null, ROUTING = false;
let COURSES = [];

const EV = {
  admin_login: ['دخول الادارة', ''], claim: ['تفعيل حساب', 'warn'], blocked: ['محاولة مرفوضة', 'bad'], login: ['دخول', ''], bad_code: ['كود خاطئ', 'bad'], bad_pin: ['رقم سري خاطئ', 'bad'],
  rebind: ['نقل جهاز', 'warn'], reset: ['اعادة تعيين', ''], otp_sent: ['ارسال رمز', ''], tg_link: ['ربط تيليجرام', 'ok'], admin_bad_login: ['دخول ادارة فاشل', 'bad'],
};
const evTag = (k) => h('span', { class: 'tag ' + ((EV[k] || [])[1] || '') }, (EV[k] || [k])[0]);
const KIND_AR = { video: 'فيديو', file: 'ملف', text: 'نص', quiz: 'اختبار' };

async function guard(fn) {
  try { await fn(); } catch (e) {
    if (e.status === 401) return viewLogin();
    mount(shell('', h('div', { class: 'errbox' }, e.message)));
  }
}
const act = (fn) => async (...a) => {
  try { await fn(...a); } catch (e) { if (e.status === 401) viewLogin(); else toast(e.message, true); }
};

async function boot() {
  try { SESSION = await api('/api/admin/me'); } catch (e) { return viewLogin(); }
  document.title = 'لوحة التحكم - ' + SESSION.site_name;
  if (!ROUTING) { window.addEventListener('hashchange', route); ROUTING = true; }
  route();
}
function route() {
  const hs = location.hash || '#/';
  let m;
  if ((m = hs.match(/^#\\/courses\\/(\\d+)/))) return guard(() => viewCourseManager(+m[1]));
  if (hs === '#/students') return guard(viewStudents);
  if (hs === '#/courses') return guard(viewCourses);
  if (hs === '#/ann') return guard(viewAnn);
  if (hs === '#/events') return guard(viewEvents);
  if (hs === '#/settings') return guard(viewSettings);
  return guard(viewHome);
}

async function viewLogin(msg) {
  let auth = { password: false, telegram: false, bot: '' };
  try { auth = await api('/api/admin/auth'); } catch (e) {}
  const errBox = h('div', { class: 'errbox' + (msg ? '' : ' hide') }, msg || '');
  const fail = (er) => { errBox.textContent = er.message; errBox.classList.remove('hide'); };
  const code = h('input', { type: 'text', class: 'code ltr', placeholder: 'XXXXXXXX', autocomplete: 'off', style: 'font:600 1.3rem ui-monospace,Consolas,monospace;letter-spacing:.2em;text-align:center;text-transform:uppercase' });
  const tgForm = h('form', { onsubmit: async (e) => {
    e.preventDefault();
    try { await api('/api/admin/login', { method: 'POST', body: { code: code.value } }); boot(); } catch (er) { fail(er); }
  } },
    h('p', { class: 'muted' }, 'ارسلي كلمة ', h('b', null, 'لوحة'), ' الى البوت' + (auth.bot ? ' @' + auth.bot : '') + ' من حساب المالك، ثم ادخلي الرمز الذي يصلك.'),
    field('رمز الدخول', code), h('button', { class: 'btn block' }, 'دخول'));
  const user = h('input', { type: 'text', class: 'ltr', autocomplete: 'username' });
  const pass = h('input', { type: 'password', class: 'ltr', autocomplete: 'current-password' });
  const pwForm = h('form', { onsubmit: async (e) => {
    e.preventDefault();
    try { await api('/api/admin/login', { method: 'POST', body: { user: user.value, pass: pass.value } }); boot(); } catch (er) { fail(er); }
  } }, field('اسم المستخدم', user), field('كلمة المرور', pass), h('button', { class: 'btn block' }, 'دخول'));
  const kids = [h('h1', null, 'لوحة التحكم'), h('div', { class: 'orn' }, h('i')), errBox];
  if (auth.telegram) kids.push(tgForm);
  if (auth.password) kids.push(auth.telegram ? h('details', { style: 'margin-top:18px;text-align:right' }, h('summary', { class: 'muted' }, 'الدخول بكلمة المرور'), h('div', { style: 'margin-top:12px' }, pwForm)) : pwForm);
  if (!auth.telegram && !auth.password) kids.push(h('div', { class: 'errbox' }, 'لم يتم ضبط طريقة دخول. اضبطي BOT_TOKEN و TG_SECRET و ADMIN_TG_IDS (او ADMIN_PASSWORD).'));
  mount(h('div', { class: 'wrap' }, h('div', { class: 'card login adm-login' }, kids)));
  setTimeout(() => (auth.telegram ? code : user).focus(), 0);
}

function shell(active, content) {
  const nl = (href, t, key) => h('a', { class: 'nl' + (active === key ? ' on' : ''), href }, t);
  const ghost = 'color:#d6e0dc;border-color:rgba(255,255,255,.3)';
  return h('div', { class: 'adm' },
    h('aside', { class: 'side' },
      h('a', { class: 'brand', href: '#/' }, SESSION ? SESSION.site_name : '', h('small', null, 'لوحة التحكم')),
      h('nav', null, nl('#/', 'نظرة عامة', 'home'), nl('#/students', 'الطلاب', 'students'), nl('#/courses', 'الكورسات', 'courses'),
        nl('#/ann', 'الاعلانات', 'ann'), nl('#/events', 'السجل الامني', 'events'), nl('#/settings', 'الاعدادات', 'settings')),
      h('div', { class: 'bt stack' },
        h('a', { class: 'btn ghost sm block', style: ghost, href: '/', target: '_blank', rel: 'noopener' }, 'موقع الطلاب'),
        h('button', { class: 'btn ghost sm block', style: ghost, onclick: async () => { await api('/api/admin/logout', { method: 'POST' }); viewLogin(); } }, 'خروج'))),
    h('main', { class: 'main' }, content));
}
function page(active, title, tools) {
  const box = h('div', null, h('p', { class: 'muted' }, 'جار التحميل ...'));
  const head = h('h2', null, title, h('span', { class: 'sp' }), tools || null);
  mount(shell(active, [head, box]));
  return box;
}
async function loadCourses() { COURSES = (await api('/api/admin/courses')).courses; return COURSES; }

function courseChecks(selected) {
  const sel = new Set(selected || []);
  const boxes = COURSES.map((c) => ({ c, input: h('input', { type: 'checkbox', checked: sel.has(c.id) }) }));
  const el = boxes.length ? h('div', { class: 'pick' }, boxes.map((b) => h('label', { class: 'check' }, b.input, b.c.title + (b.c.published ? '' : ' (غير منشور)')))) : h('p', { class: 'small muted' }, 'لا توجد كورسات بعد');
  return { el, get: () => boxes.filter((b) => b.input.checked).map((b) => b.c.id) };
}

// ------------------------------------------------ نظرة عامة
async function viewHome() {
  const box = page('home', 'نظرة عامة');
  const [d, tg] = await Promise.all([api('/api/admin/stats'), api('/api/admin/tg/status')]);
  const s = d.students;
  const st = (n, label, cls) => h('div', { class: 'stat' + (cls ? ' ' + cls : '') }, h('b', null, n), h('span', null, label));
  box.replaceChildren(
    h('div', { class: 'stats' },
      st(s.total, 'الطلاب'), st(s.active, 'الحسابات الفعالة'), st(s.claimed, 'فعّلوا حساباتهم'), st(s.today, 'دخلوا اخر 24 ساعة'),
      st(d.courses.n, 'الكورسات (' + d.courses.pub + ' منشور)'), st(d.lessons, 'الدروس'), st(s.linked, 'مرتبطون بتيليجرام'),
      st(d.blocked_week, 'محاولات مرفوضة هذا الاسبوع', d.blocked_week ? 'alert' : '')),
    !tg.configured ? h('div', { class: 'card', style: 'margin-bottom:18px' }, 'بوت تيليجرام غير مفعل بعد. من صفحة الاعدادات تجدين خطوات التفعيل (اختياري، لكنه يمنح اشعارات فورية ونقل الحساب بين الاجهزة).') : null,
    h('div', { class: 'card' }, h('h3', null, 'اخر الاحداث المهمة'),
      d.events.length ? eventsTable(d.events) : h('p', { class: 'muted' }, 'لا توجد احداث بعد.')));
}
function eventsTable(rows) {
  return h('div', { class: 'scroll' }, h('table', { class: 't' }, h('thead', null, h('tr', null, ['الوقت', 'الحدث', 'الطالب', 'التفاصيل'].map((x) => h('th', null, x)))),
    h('tbody', null, rows.map((e) => h('tr', null, h('td', { class: 'small' }, fmtDate(e.ts, true)), h('td', null, evTag(e.kind)), h('td', null, e.student || '-'), h('td', { class: 'small muted ltr' }, e.detail || ''))))));
}

// ------------------------------------------------ الطلاب
function shareMessage(name, code, pin) {
  return \`اهلا \${name}\\nكود الدخول الخاص بك: \${code}\\nرابط المنصة: \${location.origin}\\n\` + (pin ? \`الرقم السري الثاني: \${pin}\\n\` : '') +
    'ملاحظة: الكود لك وحدك ويعمل على جهاز واحد فقط، لا تشاركه مع احد.';
}
function showCode(title, name, code, pin) {
  const msg = shareMessage(name, code, pin);
  const ta = h('textarea', { class: '', value: msg, style: 'min-height:150px' });
  return modal(title, h('div', { class: 'stack' },
    h('p', { class: 'small muted' }, 'يظهر الكود هذه المرة فقط ولا يمكن استرجاعه لاحقا (يمكنك اصدار كود جديد في اي وقت).'),
    h('div', { class: 'codebox' }, code), pin ? h('p', null, 'الرقم السري الثاني: ', h('b', null, pin)) : null,
    h('label', { class: 'f' }, h('span', null, 'رسالة جاهزة للارسال للطالب'), ta)),
  [h('button', { class: 'btn', onclick: () => copyText(ta.value) }, 'نسخ الرسالة'), h('button', { class: 'btn ghost', onclick: () => copyText(code) }, 'نسخ الكود فقط')], { sticky: true });
}

async function viewStudents() {
  const box = page('students', 'الطلاب', h('div', { class: 'row' },
    h('button', { class: 'btn', onclick: act(() => studentForm()) }, 'اضافة طالب'),
    h('button', { class: 'btn ghost', onclick: act(() => bulkForm()) }, 'اضافة عدة طلاب'),
    h('button', { class: 'btn ghost', onclick: act(() => enrollGroupForm()) }, 'تسجيل مجموعة في كورس')));
  await loadCourses();
  const state = { q: '', grp: '' };
  const tableBox = h('div');
  const search = h('input', { type: 'search', placeholder: 'بحث بالاسم او الهاتف' });
  const grpSel = h('select', null, h('option', { value: '' }, 'كل المجموعات'));
  let timer;
  async function load() {
    const d = await api('/api/admin/students?q=' + encodeURIComponent(state.q) + '&grp=' + encodeURIComponent(state.grp));
    if (grpSel.options.length === 1) d.groups.forEach((g) => grpSel.append(h('option', { value: g }, g)));
    const exp = Math.floor(Date.now() / 1000);
    tableBox.replaceChildren(d.students.length ? h('div', { class: 'card scroll' }, h('table', { class: 't' },
      h('thead', null, h('tr', null, ['الاسم', 'المجموعة', 'الحساب', 'تيليجرام', 'كورسات', 'اخر ظهور', ''].map((x) => h('th', null, x)))),
      h('tbody', null, d.students.map((s) => h('tr', null,
        h('td', null, h('b', null, s.name), h('div', { class: 'small mute' }, '#' + s.id + (s.phone ? ' - ' + s.phone : ''))),
        h('td', null, s.grp || '-'),
        h('td', null, s.status !== 'active' ? h('span', { class: 'tag bad' }, 'موقوف')
          : s.claimed ? h('span', { class: 'tag ok' }, 'مفعل') : (s.code_expires && s.code_expires < exp ? h('span', { class: 'tag bad' }, 'كود منتهي') : h('span', { class: 'tag warn' }, 'لم يفعل'))),
        h('td', null, s.linked ? h('span', { class: 'tag ok' }, s.tg_name || 'مرتبط') : h('span', { class: 'mute small' }, '-')),
        h('td', null, s.courses),
        h('td', { class: 'small muted' }, ago(s.last_seen)),
        h('td', null, h('button', { class: 'btn sm ghost', onclick: act(() => studentDetail(s.id, load)) }, 'تفاصيل'))))))) : h('div', { class: 'card' }, 'لا يوجد طلاب. اضيفي اول طالب من الزر في الاعلى.'));
  }
  search.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { state.q = search.value.trim(); act(load)(); }, 300); });
  grpSel.addEventListener('change', () => { state.grp = grpSel.value; act(load)(); });
  box.replaceChildren(h('div', { class: 'tools' }, search, grpSel), tableBox);
  await load();
  window.__reloadStudents = load;
}
const reloadStudents = () => { if (location.hash === '#/students' && window.__reloadStudents) return window.__reloadStudents(); };

async function studentForm() {
  await loadCourses();
  const name = h('input', { type: 'text' }), phone = h('input', { type: 'text', class: 'ltr' }), grp = h('input', { type: 'text' }), note = h('input', { type: 'text' }), pin = h('input', { type: 'text', class: 'ltr', placeholder: 'اتركيه فارغا لاستخدام اخر 4 ارقام من الهاتف' });
  const cc = courseChecks([]);
  const m = modal('اضافة طالب', h('div', null,
    field('اسم الطالب', name), h('div', { class: 'grid g2' }, field('رقم الهاتف (اختياري)', phone), field('المجموعة / الصف', grp)),
    field('ملاحظة (تظهر لك فقط)', note),
    field('الرقم السري الثاني (يمنع من استلم الكود وحده من التفعيل)', pin),
    h('div', { class: 'f' }, h('span', { class: 'small muted' }, 'تسجيل الطالب في الكورسات'), cc.el)),
  h('button', { class: 'btn', onclick: act(async () => {
    const r = await api('/api/admin/students', { method: 'POST', body: { name: name.value, phone: phone.value, grp: grp.value, note: note.value, pin: pin.value, courses: cc.get() } });
    m.close(); showCode('تم انشاء الحساب', r.name, r.code, r.pin); reloadStudents();
  }) }, 'انشاء واصدار كود'));
  setTimeout(() => name.focus(), 0);
}

async function bulkForm() {
  await loadCourses();
  const lines = h('textarea', { style: 'min-height:170px', placeholder: 'كل طالب في سطر:\\nاحمد علي، 07701234567، الصف الخامس\\nسارة حسن، 07809876543' });
  const grp = h('input', { type: 'text', placeholder: 'مجموعة افتراضية للاسطر التي بلا مجموعة' });
  const cc = courseChecks([]);
  const m = modal('اضافة عدة طلاب', h('div', null, field('الطلاب (الاسم، الهاتف، المجموعة)', lines), field('المجموعة الافتراضية', grp),
    h('div', { class: 'f' }, h('span', { class: 'small muted' }, 'تسجيلهم في الكورسات'), cc.el)),
  h('button', { class: 'btn', onclick: act(async () => {
    const r = await api('/api/admin/students/bulk', { method: 'POST', body: { lines: lines.value, grp: grp.value, courses: cc.get() } });
    m.close(); bulkResult(r.students); reloadStudents();
  }) }, 'انشاء الحسابات'), { wide: true });
}
function bulkResult(list) {
  const text = list.map((s) => \`\${s.name}\\t\${s.code}\\t\${s.pin || ''}\`).join('\\n');
  const csv = '﻿الاسم,الكود,الرقم السري\\n' + list.map((s) => \`"\${s.name.replace(/"/g, '""')}",\${s.code},\${s.pin || ''}\`).join('\\n');
  modal('تم انشاء ' + list.length + ' حساب', h('div', { class: 'stack' }, h('p', { class: 'small muted' }, 'احفظي القائمة الان، لن تظهر الاكواد مرة اخرى.'),
    h('div', { class: 'scroll' }, h('table', { class: 't' }, h('thead', null, h('tr', null, ['الاسم', 'الكود', 'الرقم السري'].map((x) => h('th', null, x)))),
      h('tbody', null, list.map((s) => h('tr', null, h('td', null, s.name), h('td', { class: 'ltr' }, s.code), h('td', { class: 'ltr' }, s.pin || '-'))))))),
  [h('button', { class: 'btn', onclick: () => copyText(text) }, 'نسخ القائمة'),
    h('button', { class: 'btn ghost', onclick: () => { const a = h('a', { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: 'students.csv' }); document.body.append(a); a.click(); a.remove(); } }, 'تنزيل CSV')], { wide: true, sticky: true });
}

async function enrollGroupForm() {
  await loadCourses();
  const d = await api('/api/admin/students');
  const grp = h('select', null, h('option', { value: '' }, 'كل الطلاب الفعالين'), d.groups.map((g) => h('option', { value: g }, g)));
  const course = h('select', null, COURSES.map((c) => h('option', { value: c.id }, c.title)));
  const m = modal('تسجيل جماعي في كورس', h('div', null, field('المجموعة', grp), field('الكورس', course)), [
    h('button', { class: 'btn', onclick: act(async () => { const r = await api('/api/admin/enroll', { method: 'POST', body: { grp: grp.value, course_id: course.value, action: 'add' } }); m.close(); toast('تم تسجيل ' + r.count + ' طالب'); }) }, 'تسجيل'),
    h('button', { class: 'btn danger', onclick: act(async () => { const r = await api('/api/admin/enroll', { method: 'POST', body: { grp: grp.value, course_id: course.value, action: 'remove' } }); m.close(); toast('تم الغاء تسجيل ' + r.count + ' طالب'); }) }, 'الغاء التسجيل')]);
}

async function studentDetail(id, after) {
  await loadCourses();
  const d = await api('/api/admin/students/' + id);
  const s = d.student;
  const name = h('input', { type: 'text', value: s.name }), phone = h('input', { type: 'text', class: 'ltr', value: s.phone }), grp = h('input', { type: 'text', value: s.grp }), note = h('input', { type: 'text', value: s.note });
  const pin = h('input', { type: 'text', class: 'ltr', placeholder: s.has_pin ? 'يوجد رقم سري (اكتبي جديدا لتغييره)' : 'لا يوجد' });
  const cc = courseChecks(d.enrolled);
  let m;
  const refresh = () => { m.close(); if (after) after(); };
  const body = h('div', { class: 'stack' },
    h('div', { class: 'row' },
      s.status === 'active' ? h('span', { class: 'tag ok' }, 'فعال') : h('span', { class: 'tag bad' }, 'موقوف'),
      s.claimed ? h('span', { class: 'tag ok' }, 'فُعّل ' + fmtDate(s.claimed_at, true)) : h('span', { class: 'tag warn' }, 'لم يفعل بعد'),
      s.linked ? h('span', { class: 'tag ok' }, 'تيليجرام: ' + (s.tg_name || 'مرتبط')) : h('span', { class: 'tag' }, 'غير مرتبط بتيليجرام')),
    s.claimed && s.device_info ? h('div', { class: 'small muted ltr' }, s.device_info) : null,
    h('div', { class: 'grid g2' }, field('الاسم', name), field('الهاتف', phone), field('المجموعة', grp), field('ملاحظة', note)),
    field('الرقم السري الثاني (اكتبي __clear__ لحذفه)', pin),
    h('div', null, h('button', { class: 'btn', onclick: act(async () => { await api('/api/admin/students/' + id, { method: 'PUT', body: { name: name.value, phone: phone.value, grp: grp.value, note: note.value, pin: pin.value } }); toast('تم الحفظ'); if (after) after(); }) }, 'حفظ البيانات')),
    h('div', { class: 'card' }, h('h4', null, 'الكورسات المسجل بها'), cc.el,
      h('div', { style: 'margin-top:10px' }, h('button', { class: 'btn sm', onclick: act(async () => { await api('/api/admin/students/' + id + '/courses', { method: 'POST', body: { courses: cc.get() } }); toast('تم حفظ التسجيل'); if (after) after(); }) }, 'حفظ التسجيل'))),
    d.progress.length ? h('div', { class: 'card' }, h('h4', null, 'التقدم'), d.progress.map((p) => h('div', { style: 'margin-bottom:10px' },
      h('div', { class: 'row small' }, p.title, h('span', { class: 'sp' }), p.done + ' / ' + p.total), h('div', { class: 'bar' }, h('i', { style: 'width:' + (p.total ? Math.round(p.done / p.total * 100) : 0) + '%' })))) ) : null,
    h('div', { class: 'card' }, h('h4', null, 'اخر النشاط'), d.events.length ? eventsTable(d.events.map((e) => ({ ...e, student: '' }))) : h('p', { class: 'muted small' }, 'لا يوجد')));
  const foot = [
    h('button', { class: 'btn warn', onclick: act(async () => {
      if (!(await confirmBox('سيتم فصل الجهاز الحالي واصدار كود جديد. هل تريدين المتابعة؟', 'نعم، اصدار كود جديد'))) return;
      const r = await api('/api/admin/students/' + id + '/reset', { method: 'POST' });
      refresh(); showCode('كود جديد', s.name, r.code, '');
    }) }, 'اعادة تعيين الجهاز واصدار كود'),
    h('button', { class: 'btn ghost', onclick: act(async () => { await api('/api/admin/students/' + id + '/status', { method: 'POST', body: { status: s.status === 'active' ? 'suspended' : 'active' } }); refresh(); }) }, s.status === 'active' ? 'ايقاف الحساب' : 'تفعيل الحساب'),
    s.linked ? h('button', { class: 'btn ghost', onclick: act(async () => { await api('/api/admin/students/' + id + '/unlink', { method: 'POST' }); refresh(); }) }, 'فك ربط تيليجرام') : null,
    h('button', { class: 'btn danger', onclick: act(async () => { if (await confirmBox('حذف الطالب وكل تقدمه نهائيا؟', 'حذف')) { await api('/api/admin/students/' + id, { method: 'DELETE' }); refresh(); } }) }, 'حذف')];
  m = modal(s.name, body, foot, { wide: true });
}

// ------------------------------------------------ الكورسات
async function viewCourses() {
  const box = page('courses', 'الكورسات', h('button', { class: 'btn', onclick: act(() => courseForm(null)) }, 'كورس جديد'));
  const rows = await loadCourses();
  const mv = (id, dir) => act(async () => { await api('/api/admin/courses/' + id + '/move', { method: 'POST', body: { dir } }); route(); });
  box.replaceChildren(rows.length ? h('div', { class: 'card scroll' }, h('table', { class: 't' },
    h('tbody', null, rows.map((c) => h('tr', null,
      h('td', { style: 'width:80px' }, h('div', { class: 'thumb', style: c.cover ? \`background-image:url(/cover/\${encodeURIComponent(c.cover)})\` : '' })),
      h('td', null, h('b', null, c.title), h('div', { class: 'small mute' }, c.lessons + ' درس - ' + c.students + ' طالب')),
      h('td', null, c.published ? h('span', { class: 'tag ok' }, 'منشور') : h('span', { class: 'tag warn' }, 'مسودة')),
      h('td', null, h('div', { class: 'row' },
        h('a', { class: 'btn sm', href: '#/courses/' + c.id }, 'الدروس'),
        h('button', { class: 'btn sm ghost', onclick: act(() => courseStudents(c)) }, 'الطلاب'),
        h('button', { class: 'btn sm ghost', onclick: act(() => courseForm(c)) }, 'تعديل'),
        h('button', { class: 'btn sm ghost', onclick: mv(c.id, -1), title: 'للاعلى' }, 'اعلى'),
        h('button', { class: 'btn sm ghost', onclick: mv(c.id, 1), title: 'للاسفل' }, 'اسفل'),
        h('button', { class: 'btn sm danger', onclick: act(async () => { if (await confirmBox('حذف الكورس وجميع دروسه وملفاته نهائيا؟', 'حذف')) { await api('/api/admin/courses/' + c.id, { method: 'DELETE' }); route(); } }) }, 'حذف')))))))) : h('div', { class: 'card' }, 'لا توجد كورسات بعد.'));
}

function courseForm(c) {
  const title = h('input', { type: 'text', value: c ? c.title : '' });
  const desc = h('textarea', { value: c ? c.description : '', style: 'min-height:90px' });
  const pub = h('input', { type: 'checkbox', checked: c ? !!c.published : false });
  let cover = c ? c.cover : '';
  const prev = h('div', { class: 'cover pat', style: 'max-width:300px;border-radius:6px' }, 'ع');
  const setPrev = () => { prev.style.backgroundImage = cover ? \`url(/cover/\${encodeURIComponent(cover)})\` : ''; prev.classList.toggle('pat', !cover); prev.textContent = cover ? '' : 'ع'; };
  setPrev();
  const file = h('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', onchange: act(async () => {
    const f = file.files[0]; if (!f) return;
    const r = await fetch('/api/admin/cover', { method: 'PUT', headers: { 'content-type': f.type, 'x-req': '1' }, body: f, credentials: 'same-origin' });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error);
    cover = j.cover; setPrev();
  }) });
  const m = modal(c ? 'تعديل الكورس' : 'كورس جديد', h('div', null, field('عنوان الكورس', title), field('الوصف', desc),
    h('div', { class: 'f' }, h('span', { class: 'small muted' }, 'صورة الغلاف (اختيارية)'), prev, file),
    h('label', { class: 'check' }, pub, 'منشور (يظهر للطلاب المسجلين)')),
  h('button', { class: 'btn', onclick: act(async () => {
    const body = { title: title.value, description: desc.value, cover, published: pub.checked };
    await api('/api/admin/courses' + (c ? '/' + c.id : ''), { method: c ? 'PUT' : 'POST', body });
    m.close(); route();
  }) }, 'حفظ'));
}

async function courseStudents(c) {
  const d = await api('/api/admin/courses/' + c.id + '/enrolled');
  const sel = new Set(d.ids);
  const items = d.students.map((s) => ({ s, input: h('input', { type: 'checkbox', checked: sel.has(s.id) }) }));
  const all = h('input', { type: 'checkbox', onchange: () => items.forEach((i) => { i.input.checked = all.checked; }) });
  const m = modal('طلاب كورس: ' + c.title, h('div', null,
    h('label', { class: 'check', style: 'margin-bottom:8px' }, all, h('b', null, 'تحديد الكل')),
    items.length ? h('div', { class: 'pick' }, items.map((i) => h('label', { class: 'check' }, i.input, i.s.name, i.s.grp ? h('span', { class: 'tag' }, i.s.grp) : null))) : 'لا يوجد طلاب فعالون'),
  h('button', { class: 'btn', onclick: act(async () => { await api('/api/admin/courses/' + c.id + '/enrolled', { method: 'POST', body: { ids: items.filter((i) => i.input.checked).map((i) => i.s.id) } }); m.close(); toast('تم الحفظ'); route(); }) }, 'حفظ'));
}

// ------------------------------------------------ الدروس
async function viewCourseManager(cid) {
  const box = page('courses', 'ادارة الدروس');
  const d = await api('/api/admin/courses/' + cid + '/lessons');
  const mv = (id, dir) => act(async () => { await api('/api/admin/lessons/' + id + '/move', { method: 'POST', body: { dir } }); route(); });
  box.replaceChildren(
    h('div', { class: 'crumb' }, h('a', { href: '#/courses' }, 'الكورسات'), ' / ', d.course ? d.course.title : ''),
    h('div', { class: 'tools' }, h('button', { class: 'btn', onclick: act(() => lessonForm(cid, null)) }, 'اضافة درس')),
    d.lessons.length ? h('div', { class: 'card scroll' }, h('table', { class: 't' }, h('tbody', null, d.lessons.map((l, i) => h('tr', null,
      h('td', { style: 'width:36px' }, i + 1),
      h('td', null, h('b', null, l.title), l.media_name ? h('div', { class: 'small mute' }, l.media_name) : (l.url ? h('div', { class: 'small mute ltr' }, l.url) : null)),
      h('td', null, h('span', { class: 'tag' }, KIND_AR[l.kind])),
      h('td', null, l.published ? h('span', { class: 'tag ok' }, 'ظاهر') : h('span', { class: 'tag warn' }, 'مخفي')),
      h('td', null, h('div', { class: 'row' },
        l.media_key ? h('a', { class: 'btn sm ghost', href: '/media/' + l.id, target: '_blank', rel: 'noopener' }, 'معاينة') : null,
        h('button', { class: 'btn sm ghost', onclick: act(() => lessonForm(cid, l.id)) }, 'تعديل'),
        h('button', { class: 'btn sm ghost', onclick: mv(l.id, -1) }, 'اعلى'), h('button', { class: 'btn sm ghost', onclick: mv(l.id, 1) }, 'اسفل'),
        h('button', { class: 'btn sm danger', onclick: act(async () => { if (await confirmBox('حذف الدرس وملفه؟', 'حذف')) { await api('/api/admin/lessons/' + l.id, { method: 'DELETE' }); route(); } }) }, 'حذف')))))))) : h('div', { class: 'card' }, 'لا توجد دروس. اضيفي اول درس.'));
}

const MIME = { mp4: 'video/mp4', m4v: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', mp3: 'audio/mpeg', m4a: 'audio/mp4', pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };
async function uploadFile(file, onProgress) {
  const type = file.type || MIME[(file.name.split('.').pop() || '').toLowerCase()] || 'application/octet-stream';
  const start = await api('/api/admin/upload/start', { method: 'POST', body: { name: file.name, type } });
  const CH = 8 * 1024 * 1024, n = Math.max(1, Math.ceil(file.size / CH)), parts = [];
  try {
    for (let i = 0; i < n; i++) {
      const blob = file.slice(i * CH, (i + 1) * CH);
      let res = null, tries = 0;
      while (!res) {
        try {
          const r = await fetch('/api/admin/upload/part?key=' + encodeURIComponent(start.key) + '&uploadId=' + encodeURIComponent(start.uploadId) + '&n=' + (i + 1), { method: 'PUT', headers: { 'x-req': '1' }, body: blob, credentials: 'same-origin' });
          if (!r.ok) throw new Error('part');
          res = await r.json();
        } catch (e) { if (++tries >= 3) throw new Error('فشل رفع الملف، تحققي من الاتصال وحاولي مجددا'); await new Promise((ok) => setTimeout(ok, 1500 * tries)); }
      }
      parts.push({ partNumber: res.partNumber, etag: res.etag });
      onProgress((i + 1) / n);
    }
    await api('/api/admin/upload/complete', { method: 'POST', body: { key: start.key, uploadId: start.uploadId, parts } });
    return { key: start.key, name: file.name, type };
  } catch (e) {
    api('/api/admin/upload/abort', { method: 'POST', body: { key: start.key, uploadId: start.uploadId } }).catch(() => {});
    throw e;
  }
}

function quizBuilder(initial) {
  const qs = initial && initial.length ? initial.map((x) => ({ q: x.q, options: x.options.slice(), answer: x.answer })) : [{ q: '', options: ['', ''], answer: 0 }];
  const wrap = h('div');
  function draw() {
    wrap.replaceChildren(...qs.map((qq, qi) => h('div', { class: 'qb' },
      h('div', { class: 'row' }, h('b', null, 'السؤال ' + (qi + 1)), h('span', { class: 'sp' }), qs.length > 1 ? h('button', { type: 'button', class: 'btn sm danger', onclick: () => { qs.splice(qi, 1); draw(); } }, 'حذف السؤال') : null),
      h('input', { type: 'text', value: qq.q, placeholder: 'نص السؤال', oninput: (e) => { qq.q = e.target.value; } }),
      h('div', { class: 'opts' }, qq.options.map((o, oi) => h('div', null,
        h('input', { type: 'radio', name: 'ans' + qi, checked: qq.answer === oi, title: 'الاجابة الصحيحة', onchange: () => { qq.answer = oi; } }),
        h('input', { type: 'text', value: o, placeholder: 'خيار ' + (oi + 1), oninput: (e) => { qq.options[oi] = e.target.value; } }),
        qq.options.length > 2 ? h('button', { type: 'button', class: 'btn sm ghost', onclick: () => { qq.options.splice(oi, 1); if (qq.answer >= qq.options.length) qq.answer = 0; else if (qq.answer > oi) qq.answer--; draw(); } }, 'x') : null))),
      h('div', { style: 'margin-top:8px' }, h('button', { type: 'button', class: 'btn sm ghost', onclick: () => { qq.options.push(''); draw(); } }, 'اضافة خيار')),
      h('div', { class: 'small mute' }, 'حددي الدائرة بجانب الاجابة الصحيحة'))),
    h('button', { type: 'button', class: 'btn ghost', onclick: () => { qs.push({ q: '', options: ['', ''], answer: 0 }); draw(); } }, 'اضافة سؤال'));
  }
  draw();
  const get = () => qs.map((qq) => {
    const keep = []; let ans = 0;
    qq.options.forEach((o, i) => { if (o.trim()) { if (i === qq.answer) ans = keep.length; keep.push(o.trim()); } });
    return { q: qq.q.trim(), options: keep, answer: ans };
  });
  return { el: wrap, get };
}

async function lessonForm(cid, id) {
  const L = id ? (await api('/api/admin/lessons/' + id)).lesson : { title: '', kind: 'video', body: '', url: '', media_key: '', media_name: '', media_type: '', published: 1 };
  const title = h('input', { type: 'text', value: L.title });
  const kind = h('select', null, Object.entries(KIND_AR).map(([k, v]) => h('option', { value: k, selected: L.kind === k }, v)));
  const pub = h('input', { type: 'checkbox', checked: !!L.published });
  const area = h('div');
  let uploading = false, quiz = null, notes, url, bodyText, mediaInfo, progBar, mode = L.media_key || !L.url ? 'upload' : 'link';

  function drawMedia(accept) {
    mediaInfo = h('div', { class: 'small muted' }, L.media_key ? 'الملف الحالي: ' + L.media_name : 'لم يتم رفع ملف');
    progBar = h('div', { class: 'prog hide' }, h('i'));
    const file = h('input', { type: 'file', accept, onchange: async () => {
      const f = file.files[0]; if (!f) return;
      uploading = true; progBar.classList.remove('hide'); mediaInfo.textContent = 'جار الرفع ...';
      try {
        const r = await uploadFile(f, (p) => { progBar.firstChild.style.width = Math.round(p * 100) + '%'; });
        L.media_key = r.key; L.media_name = r.name; L.media_type = r.type;
        mediaInfo.textContent = 'تم الرفع: ' + r.name;
      } catch (e) { mediaInfo.textContent = e.message; toast(e.message, true); }
      uploading = false;
    } });
    return h('div', { class: 'f' }, h('span', { class: 'small muted' }, 'الملف'), file, progBar, mediaInfo);
  }

  function draw() {
    L.kind = kind.value;
    quiz = null;
    if (L.kind === 'video') {
      const rU = h('input', { type: 'radio', name: 'src', checked: mode === 'upload', onchange: () => { mode = 'upload'; draw(); } });
      const rL = h('input', { type: 'radio', name: 'src', checked: mode === 'link', onchange: () => { mode = 'link'; draw(); } });
      url = h('input', { type: 'text', class: 'ltr', value: L.url, placeholder: 'https://www.youtube.com/watch?v=...' });
      notes = h('textarea', { value: L.body, style: 'min-height:80px' });
      area.replaceChildren(h('div', { class: 'row', style: 'margin-bottom:10px' }, h('label', { class: 'check' }, rU, 'رفع فيديو'), h('label', { class: 'check' }, rL, 'رابط يوتيوب او فيمو')),
        mode === 'upload' ? drawMedia('video/*') : field('رابط الفيديو', url), field('ملاحظات تحت الفيديو (اختياري)', notes));
    } else if (L.kind === 'file') {
      notes = h('textarea', { value: L.body, style: 'min-height:80px' });
      area.replaceChildren(drawMedia('.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,image/*,audio/*'), field('وصف الملف (اختياري)', notes));
    } else if (L.kind === 'text') {
      bodyText = h('textarea', { value: L.body, style: 'min-height:220px' });
      area.replaceChildren(field('محتوى الدرس', bodyText), h('p', { class: 'small mute' }, 'للتنسيق: # عنوان كبير، ## عنوان فرعي، - نقاط، > اقتباس، **نص عريض**. اترك سطرا فارغا بين الفقرات.'));
    } else {
      let init = [];
      try { init = JSON.parse(L.body); } catch (e) {}
      quiz = quizBuilder(Array.isArray(init) ? init : []);
      area.replaceChildren(quiz.el);
    }
  }
  kind.addEventListener('change', () => { if (L.kind === 'video' || L.kind === 'file') {} draw(); });
  draw();

  const m = modal(id ? 'تعديل الدرس' : 'درس جديد', h('div', null, field('عنوان الدرس', title), field('نوع الدرس', kind), area, h('label', { class: 'check' }, pub, 'ظاهر للطلاب')),
    h('button', { class: 'btn', onclick: act(async () => {
      if (uploading) return toast('انتظري اكتمال الرفع', true);
      const body = { title: title.value, kind: kind.value, published: pub.checked ? 1 : 0, media_key: '', media_name: '', media_type: '', url: '', body: '' };
      if (kind.value === 'video') { if (mode === 'upload') Object.assign(body, { media_key: L.media_key, media_name: L.media_name, media_type: L.media_type }); else body.url = url.value; body.body = notes.value; }
      else if (kind.value === 'file') Object.assign(body, { media_key: L.media_key, media_name: L.media_name, media_type: L.media_type, body: notes.value });
      else if (kind.value === 'text') body.body = bodyText.value;
      else body.body = JSON.stringify(quiz.get());
      await api(id ? '/api/admin/lessons/' + id : '/api/admin/courses/' + cid + '/lessons', { method: id ? 'PUT' : 'POST', body });
      m.close(); route();
    }) }, 'حفظ'), { wide: true, sticky: true });
}

// ------------------------------------------------ الاعلانات
async function viewAnn() {
  const box = page('ann', 'الاعلانات');
  await loadCourses();
  const d = await api('/api/admin/announcements');
  const title = h('input', { type: 'text' }), body = h('textarea'), pinned = h('input', { type: 'checkbox' }), tgc = h('input', { type: 'checkbox' });
  const course = h('select', null, h('option', { value: 0 }, 'لكل الطلاب'), COURSES.map((c) => h('option', { value: c.id }, 'طلاب: ' + c.title)));
  box.replaceChildren(
    h('div', { class: 'card', style: 'margin-bottom:18px' }, h('h3', null, 'اعلان جديد'), field('العنوان', title), field('النص', body), field('الجهة', course),
      h('div', { class: 'row', style: 'margin-bottom:12px' }, h('label', { class: 'check' }, pinned, 'تثبيت في الاعلى'), SESSION.bot ? h('label', { class: 'check' }, tgc, 'ارساله ايضا عبر تيليجرام') : null),
      h('button', { class: 'btn', onclick: act(async () => { const r = await api('/api/admin/announcements', { method: 'POST', body: { title: title.value, body: body.value, course_id: course.value, pinned: pinned.checked, telegram: tgc.checked } }); toast(r.sent ? 'تم النشر وارسال ' + r.sent + ' رسالة' : 'تم النشر'); route(); }) }, 'نشر')),
    h('div', { class: 'card' }, d.items.length ? d.items.map((a) => h('div', { class: 'ann' }, h('div', { class: 'row' }, h('h3', { style: 'margin:0' }, a.title), a.pinned ? h('span', { class: 'tag warn' }, 'مثبت') : null, h('span', { class: 'tag' }, a.course || 'الجميع'), h('span', { class: 'sp' }),
      h('button', { class: 'btn sm danger', onclick: act(async () => { await api('/api/admin/announcements/' + a.id, { method: 'DELETE' }); route(); }) }, 'حذف')),
      h('div', { class: 'small mute' }, fmtDate(a.created_at, true)), mdView(a.body))) : 'لا توجد اعلانات.'));
}

// ------------------------------------------------ السجل
async function viewEvents() {
  const box = page('events', 'السجل الامني');
  const sel = h('select', null, h('option', { value: '' }, 'كل الاحداث'), Object.entries(EV).map(([k, v]) => h('option', { value: k }, v[0])));
  const out = h('div');
  const load = async () => { const d = await api('/api/admin/events?kind=' + sel.value); out.replaceChildren(h('div', { class: 'card' }, d.events.length ? eventsTable(d.events) : 'لا توجد احداث.')); };
  sel.addEventListener('change', act(load));
  box.replaceChildren(h('div', { class: 'tools' }, sel), out);
  await load();
}

// ------------------------------------------------ الاعدادات
async function viewSettings() {
  const box = page('settings', 'الاعدادات');
  const [{ settings: s }, tg] = await Promise.all([api('/api/admin/settings'), api('/api/admin/tg/status')]);
  const f = {};
  const inp = (k, label, type) => { f[k] = h(type === 'area' ? 'textarea' : 'input', type === 'area' ? { value: s[k], style: 'min-height:80px' } : { type: type || 'text', value: s[k] }); return field(label, f[k]); };
  box.replaceChildren(
    h('div', { class: 'card', style: 'margin-bottom:18px' }, h('h3', null, 'بيانات المنصة'),
      h('div', { class: 'grid g2' }, inp('site_name', 'اسم المنصة'), inp('teacher_name', 'اسم المعلمة (يظهر تحت الاسم)')),
      inp('welcome', 'رسالة صفحة الدخول', 'area'), inp('footer', 'نص اسفل الصفحات'),
      h('div', { class: 'grid g2' }, inp('code_days', 'عدد ايام صلاحية الكود قبل التفعيل', 'number'), inp('max_rebinds', 'اقصى عدد لنقل الحساب بين الاجهزة في الاسبوع', 'number')),
      h('button', { class: 'btn', onclick: act(async () => { const b = {}; for (const k in f) b[k] = f[k].value; await api('/api/admin/settings', { method: 'PUT', body: b }); toast('تم الحفظ'); }) }, 'حفظ')),
    h('div', { class: 'card', style: 'margin-bottom:18px' }, h('h3', null, 'بوت تيليجرام'),
      !tg.configured ? h('div', { class: 'stack' }, h('p', null, 'غير مفعل. الخطوات:'),
        h('ol', null, h('li', null, 'انشئي بوتا من BotFather وخذي التوكن.'), h('li', null, 'ضعي BOT_TOKEN و TG_SECRET كاسرار في Cloudflare، و ADMIN_TG_IDS و BOT_USERNAME في wrangler.toml.'), h('li', null, 'افتحي /tg/setup?key=قيمة_TG_SECRET مرة واحدة.')))
        : h('div', { class: 'stack' },
          h('div', { class: 'row' }, h('span', { class: 'tag ' + (tg.webhook ? 'ok' : 'warn') }, tg.webhook ? 'الويب هوك مفعل' : 'الويب هوك غير مفعل'), h('span', { class: 'tag' }, 'عدد المعلمين المسجلين: ' + tg.admins)),
          tg.error ? h('div', { class: 'errbox' }, 'اخر خطأ من تيليجرام: ' + tg.error) : null,
          h('button', { class: 'btn', onclick: act(async () => { await api('/api/admin/tg/setup', { method: 'POST' }); toast('تم تفعيل الويب هوك'); route(); }) }, 'تفعيل / تحديث الويب هوك'),
          h('p', { class: 'small muted' }, 'اوامر المعلمة في البوت: طلاب، بحث، اضافة، كود، ايقاف، تفعيل، سجل، اعلان، بث. اكتبي مساعدة داخل البوت لعرضها.'))),
    h('div', { class: 'card' }, h('h3', null, 'كيف تضمن المنصة ان الكود لطالب واحد؟'), h('ol', { class: 'small' },
      h('li', null, 'اول جهاز يفعل الكود يربط الحساب به بشكل دائم عبر مفتاح سري مخزن في المتصفح، واي جهاز اخر يستخدم نفس الكود يُرفض ويصلك تنبيه.'),
      h('li', null, 'الرقم السري الثاني (اخر 4 ارقام من هاتف الطالب افتراضيا) يمنع من حصل على الكود وحده من تفعيله قبل صاحبه.'),
      h('li', null, 'نقل الحساب لجهاز جديد يتم فقط برمز يصل الى تيليجرام الطالب المرتبط، او بقرارك من زر اعادة التعيين الذي يصدر كودا جديدا ويلغي القديم.'),
      h('li', null, 'الفيديو يُبث فقط لحساب مسجل في الكورس، وعليه علامة مائية متحركة باسم الطالب لردع تصويره او مشاركته.'))));
}

boot();
`,
};

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const MAX_TG_PER_ACCOUNT = 3;
const DEFAULTS = {
  site_name: 'منصة اللغة العربية',
  teacher_name: '',
  welcome: 'اهلا بكم. ادخلوا الكود الخاص بكم الذي زودتكم به المعلمة.',
  footer: '',
  code_days: '14',
  max_rebinds: '2',
};

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS settings(k TEXT PRIMARY KEY, v TEXT)`,
  `CREATE TABLE IF NOT EXISTS students(
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT DEFAULT '', grp TEXT DEFAULT '', note TEXT DEFAULT '',
    code_hash TEXT UNIQUE, code_expires INTEGER DEFAULT 0, pin_hash TEXT DEFAULT '',
    status TEXT DEFAULT 'active', device_hash TEXT DEFAULT '', device_info TEXT DEFAULT '', claimed_at INTEGER DEFAULT 0,
    sess_ver INTEGER DEFAULT 1, tg_id TEXT DEFAULT '', tg_name TEXT DEFAULT '', created_at INTEGER, last_seen INTEGER DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS courses(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT DEFAULT '', cover TEXT DEFAULT '', published INTEGER DEFAULT 0, sort INTEGER DEFAULT 0, created_at INTEGER)`,
  `CREATE TABLE IF NOT EXISTS lessons(id INTEGER PRIMARY KEY AUTOINCREMENT, course_id INTEGER NOT NULL, title TEXT NOT NULL, kind TEXT NOT NULL, body TEXT DEFAULT '', url TEXT DEFAULT '', media_key TEXT DEFAULT '', media_name TEXT DEFAULT '', media_type TEXT DEFAULT '', sort INTEGER DEFAULT 0, published INTEGER DEFAULT 1, created_at INTEGER)`,
  `CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id, sort)`,
  `CREATE TABLE IF NOT EXISTS enrollments(student_id INTEGER, course_id INTEGER, PRIMARY KEY(student_id, course_id))`,
  `CREATE TABLE IF NOT EXISTS progress(student_id INTEGER, lesson_id INTEGER, done INTEGER DEFAULT 0, score INTEGER DEFAULT -1, updated_at INTEGER, PRIMARY KEY(student_id, lesson_id))`,
  `CREATE TABLE IF NOT EXISTS announcements(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, course_id INTEGER DEFAULT 0, pinned INTEGER DEFAULT 0, created_at INTEGER)`,
  `CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER, kind TEXT, student_id INTEGER DEFAULT 0, detail TEXT DEFAULT '', ip TEXT DEFAULT '')`,
  `CREATE INDEX IF NOT EXISTS idx_events_ts ON events(ts DESC)`,
  `CREATE TABLE IF NOT EXISTS otps(student_id INTEGER PRIMARY KEY, otp_hash TEXT, expires INTEGER, tries INTEGER DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS linktokens(token_hash TEXT PRIMARY KEY, student_id INTEGER, expires INTEGER)`,
  `CREATE TABLE IF NOT EXISTS rl(k TEXT PRIMARY KEY, n INTEGER, reset INTEGER)`,
];

let schemaReady = false;
async function ensureSchema(env) {
  if (schemaReady) return;
  await env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s)));
  schemaReady = true;
}

// ---------------------------------------------------------------- ادوات
const enc = new TextEncoder();
const now = () => Math.floor(Date.now() / 1000);
const hex = (b) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
const rand = (n = 32) => hex(crypto.getRandomValues(new Uint8Array(n)));
const sha256 = async (s) => hex(await crypto.subtle.digest('SHA-256', enc.encode(s)));
async function hmac(secret, msg) {
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', k, enc.encode(msg)));
}
function safeEq(a, b) {
  a = String(a); b = String(b);
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
const toLatin = (s) => String(s || '').replace(/[\u0660-\u0669]/g, (d) => d.charCodeAt(0) - 0x660).replace(/[\u06F0-\u06F9]/g, (d) => d.charCodeAt(0) - 0x6f0);
const normAr = (s) => String(s || '').replace(/[\u064B-\u0652\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').toLowerCase();
const clip = (s, n) => String(s == null ? '' : s).trim().slice(0, n);

const q = (env, sql, ...b) => env.DB.prepare(sql).bind(...b);
const all = async (env, sql, ...b) => (await q(env, sql, ...b).all()).results || [];
const first = (env, sql, ...b) => q(env, sql, ...b).first();
const run = (env, sql, ...b) => q(env, sql, ...b).run();

function respond(data, status = 200, cookies = [], extra = {}) {
  const h = new Headers({ 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra });
  for (const c of cookies) h.append('set-cookie', c);
  return new Response(JSON.stringify(data), { status, headers: h });
}
const err = (m, s = 400, extra = {}) => respond({ error: m, ...extra }, s);

function parseCookies(req) {
  const o = {};
  (req.headers.get('cookie') || '').split(/;\s*/).forEach((p) => {
    const i = p.indexOf('=');
    if (i > 0) { try { o[p.slice(0, i)] = decodeURIComponent(p.slice(i + 1)); } catch (e) {} }
  });
  return o;
}
function mkCookie(c, name, val, { maxAge = 0, strict = false } = {}) {
  const secure = c.url.protocol === 'https:';
  return `${name}=${encodeURIComponent(val)}; Path=/; HttpOnly; ${secure ? 'Secure; ' : ''}SameSite=${strict ? 'Strict' : 'Lax'}; Max-Age=${maxAge}`;
}

async function getSettings(env) {
  const s = { ...DEFAULTS };
  if (env.SITE_NAME) s.site_name = env.SITE_NAME;
  if (env.TEACHER_NAME) s.teacher_name = env.TEACHER_NAME;
  for (const r of await all(env, 'SELECT k,v FROM settings')) s[r.k] = r.v;
  return s;
}

async function limit(env, key, max, windowSec) {
  const t = now();
  const r = await first(env, 'SELECT n,reset FROM rl WHERE k=?', key);
  if (!r || r.reset < t) {
    await run(env, 'INSERT OR REPLACE INTO rl(k,n,reset) VALUES(?,1,?)', key, t + windowSec);
    return true;
  }
  if (r.n >= max) return false;
  await run(env, 'UPDATE rl SET n=n+1 WHERE k=?', key);
  return true;
}

async function logEvent(env, kind, studentId, detail, ip) {
  await run(env, 'INSERT INTO events(ts,kind,student_id,detail,ip) VALUES(?,?,?,?,?)', now(), kind, studentId || 0, clip(detail, 300), ip || '');
  if (Math.random() < 0.01) {
    await run(env, 'DELETE FROM events WHERE ts<?', now() - 180 * 86400);
    await run(env, 'DELETE FROM rl WHERE reset<?', now());
  }
}

// ---------------------------------------------------------------- الكود والرقم السري
function genCode() {
  const a = crypto.getRandomValues(new Uint8Array(12));
  let s = '';
  for (const b of a) s += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return s;
}
const normCode = (s) => toLatin(s).toUpperCase().replace(/[^A-Z0-9]/g, '');
const fmtCode = (c) => c.match(/.{4}/g).join('-');
const codeHash = (env, code) => hmac(env.SESSION_SECRET, 'code:' + code);
const pinHash = (env, pin) => hmac(env.SESSION_SECRET, 'pin:' + toLatin(pin).trim());
const last4 = (phone) => { const d = toLatin(phone).replace(/\D/g, ''); return d.length >= 4 ? d.slice(-4) : ''; };

async function newCodeFor(env, st) {
  const s = await getSettings(env);
  for (let i = 0; i < 6; i++) {
    const code = genCode();
    const h = await codeHash(env, code);
    if (!(await first(env, 'SELECT id FROM students WHERE code_hash=?', h))) {
      return { code, hash: h, expires: now() + (parseInt(s.code_days, 10) || 14) * 86400 };
    }
  }
  throw new Error('تعذر توليد كود');
}

async function createStudent(env, b) {
  const name = clip(b.name, 120);
  if (!name) throw new Error('اكتبي اسم الطالب');
  const phone = clip(toLatin(b.phone), 30);
  const grp = clip(b.grp, 60);
  const pin = clip(toLatin(b.pin), 20) || last4(phone);
  const pinH = pin ? await pinHash(env, pin) : '';
  const nc = await newCodeFor(env);
  const r = await run(env, 'INSERT INTO students(name,phone,grp,note,code_hash,code_expires,pin_hash,created_at) VALUES(?,?,?,?,?,?,?,?)',
    name, phone, grp, clip(b.note, 300), nc.hash, nc.expires, pinH, now());
  const id = r.meta.last_row_id;
  const courses = (b.courses || []).map(Number).filter(Boolean);
  if (courses.length) await env.DB.batch(courses.map((cid) => q(env, 'INSERT OR IGNORE INTO enrollments(student_id,course_id) VALUES(?,?)', id, cid)));
  return { id, name, code: fmtCode(nc.code), pin: pin || '' };
}

// ---------------------------------------------------------------- الجلسات
function devInfo(req) {
  const cf = req.cf || {};
  return clip(`${cf.city || ''} ${cf.country || ''} | ${req.headers.get('user-agent') || ''}`, 220);
}
const clientIp = (req) => req.headers.get('cf-connecting-ip') || '';

async function sessionCookie(c, studentId, ver) {
  const exp = now() + 30 * 86400;
  const payload = `${studentId}:${exp}:${ver}`;
  const sig = await hmac(c.env.SESSION_SECRET, 's:' + payload);
  return mkCookie(c, 'sid', payload + '.' + sig, { maxAge: 30 * 86400 });
}

async function studentFrom(c) {
  const ck = parseCookies(c.req);
  const sid = ck.sid;
  if (!sid) return null;
  const dot = sid.lastIndexOf('.');
  if (dot < 0) return null;
  const payload = sid.slice(0, dot);
  if (!safeEq(await hmac(c.env.SESSION_SECRET, 's:' + payload), sid.slice(dot + 1))) return null;
  const [id, exp, ver] = payload.split(':').map(Number);
  if (!id || exp < now()) return null;
  const st = await first(c.env, 'SELECT * FROM students WHERE id=?', id);
  if (!st || st.status !== 'active' || st.sess_ver !== ver || !st.device_hash) return null;
  const dv = ck['dv' + id];
  if (!dv || !safeEq(await sha256(dv), st.device_hash)) return null;
  if (now() - st.last_seen > 300) await run(c.env, 'UPDATE students SET last_seen=? WHERE id=?', now(), id);
  return st;
}

async function isAdmin(c) {
  const { env, req } = c;
  const v = parseCookies(req).adm;
  if (!v) return false;
  const [exp, sig] = v.split('.');
  if (!(+exp > now())) return false;
  return safeEq(await hmac(env.SESSION_SECRET, 'a:' + exp), sig || '');
}

// ---------------------------------------------------------------- تيليجرام
async function tgCall(env, method, params) {
  if (!env.BOT_TOKEN) return { ok: false, description: 'BOT_TOKEN غير مضبوط' };
  try {
    const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(params || {}),
    });
    return await r.json();
  } catch (e) { return { ok: false, description: String(e) }; }
}
const tgSend = (env, chat, text) => tgCall(env, 'sendMessage', { chat_id: chat, text, disable_web_page_preview: true });
const adminIds = (env) => (env.ADMIN_TG_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);
async function notifyAdmin(env, text) {
  await Promise.all(adminIds(env).map((id) => tgSend(env, id, text)));
}
async function broadcast(env, rows, text) {
  for (const r of rows) {
    await tgSend(env, r.tg_id, text);
    await new Promise((ok) => setTimeout(ok, 60));
  }
}

// ---------------------------------------------------------------- مساعدات المحتوى
function embedUrl(u) {
  try {
    const x = new URL(u);
    const host = x.hostname.replace(/^www\./, '');
    let id = '';
    if (host === 'youtu.be') id = x.pathname.slice(1);
    else if (host.endsWith('youtube.com')) id = x.searchParams.get('v') || ((x.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/) || [])[1] || '');
    if (/^[\w-]{11}$/.test(id)) return 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&modestbranding=1&playsinline=1';
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const m = x.pathname.match(/(\d{6,})/);
      if (m) return 'https://player.vimeo.com/video/' + m[1];
    }
  } catch (e) {}
  return null;
}

function parseQuiz(body) {
  let qs;
  try { qs = JSON.parse(body); } catch (e) { throw new Error('صيغة الاختبار غير صحيحة'); }
  if (!Array.isArray(qs) || !qs.length) throw new Error('اضيفي سؤالا واحدا على الاقل');
  return qs.map((x) => {
    const options = (x.options || []).map((o) => clip(o, 200)).filter(Boolean);
    const answer = Number(x.answer);
    if (!clip(x.q, 400) || options.length < 2 || !(answer >= 0 && answer < options.length)) throw new Error('كل سؤال يحتاج نصا وخيارين على الاقل وجوابا صحيحا');
    return { q: clip(x.q, 400), options, answer };
  });
}

function cleanLesson(b) {
  const kind = ['video', 'file', 'text', 'quiz'].includes(b.kind) ? b.kind : 'text';
  const title = clip(b.title, 200);
  if (!title) throw new Error('اكتبي عنوان الدرس');
  const out = { kind, title, body: String(b.body || '').slice(0, 60000), url: clip(b.url, 500), media_key: clip(b.media_key, 300), media_name: clip(b.media_name, 200), media_type: clip(b.media_type, 100), published: b.published === 0 || b.published === false ? 0 : 1 };
  if (kind === 'video') {
    if (!out.media_key) {
      if (!out.url || !embedUrl(out.url)) throw new Error('ارفعي ملف فيديو او ضعي رابط يوتيوب او فيمو صحيحا');
    } else out.url = '';
  } else if (kind === 'file') {
    if (!out.media_key) throw new Error('ارفعي الملف');
    out.url = '';
  } else if (kind === 'text') {
    if (!out.body.trim()) throw new Error('اكتبي محتوى الدرس');
    out.url = ''; out.media_key = ''; out.media_name = ''; out.media_type = '';
  } else {
    out.body = JSON.stringify(parseQuiz(out.body));
    out.url = ''; out.media_key = ''; out.media_name = ''; out.media_type = '';
  }
  return out;
}

async function moveItem(env, table, id, dir, where, ...val) {
  const rows = await all(env, `SELECT id FROM ${table} ${where} ORDER BY sort,id`, ...val);
  const i = rows.findIndex((r) => r.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= rows.length) return;
  [rows[i], rows[j]] = [rows[j], rows[i]];
  await env.DB.batch(rows.map((r, k) => q(env, `UPDATE ${table} SET sort=? WHERE id=?`, (k + 1) * 10, r.id)));
}

// ---------------------------------------------------------------- صفحات HTML
const SEC_HEADERS = {
  'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:; media-src 'self' blob:; frame-src https://www.youtube-nocookie.com https://player.vimeo.com; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'same-origin',
  'x-frame-options': 'DENY',
};
const ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%231e4b43'/%3E%3Ctext x='32' y='46' font-size='40' text-anchor='middle' fill='%23f5f0e4' font-family='serif'%3E%D8%B9%3C/text%3E%3C/svg%3E";

function pageHtml(title, script) {
  const t = String(title).replace(/[<>&"]/g, '');
  return new Response(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#143530"><title>${t}</title><link rel="icon" href="${ICON}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap"><link rel="stylesheet" href="/assets/app.css?v=${VER}"></head><body><div id="app"></div><script src="/assets/${script}.js?v=${VER}"></script></body></html>`, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', ...SEC_HEADERS },
  });
}

function assetResponse(p) {
  const map = { '/assets/app.css': ['css', 'text/css'], '/assets/student.js': ['student', 'text/javascript'], '/assets/admin.js': ['admin', 'text/javascript'] };
  const m = map[p];
  if (!m) return new Response('Not found', { status: 404 });
  return new Response(ASSETS[m[0]], { headers: { 'content-type': m[1] + '; charset=utf-8', 'cache-control': 'public, max-age=300', 'x-content-type-options': 'nosniff' } });
}

async function serveCover(env, name) {
  if (!/^[\w.-]{6,80}$/.test(name)) return new Response('Not found', { status: 404 });
  const o = await env.BUCKET.get('covers/' + name);
  if (!o) return new Response('Not found', { status: 404 });
  return new Response(o.body, { headers: { 'content-type': o.httpMetadata?.contentType || 'image/jpeg', 'cache-control': 'public, max-age=86400', 'x-content-type-options': 'nosniff' } });
}

// ---------------------------------------------------------------- بث الوسائط (فيديو وملفات)
async function serveMedia(c, lessonId) {
  const { env, req, url } = c;
  const admin = await isAdmin(c);
  let l;
  if (admin) {
    l = await first(env, 'SELECT * FROM lessons WHERE id=?', lessonId);
  } else {
    const st = await studentFrom(c);
    if (!st) return new Response('غير مصرح', { status: 401 });
    l = await first(env, `SELECT l.* FROM lessons l JOIN courses co ON co.id=l.course_id JOIN enrollments e ON e.course_id=co.id AND e.student_id=?
      WHERE l.id=? AND l.published=1 AND co.published=1`, st.id, lessonId);
  }
  if (!l || !l.media_key) return new Response('Not found', { status: 404 });
  const range = req.headers.get('range');
  const o = await env.BUCKET.get(l.media_key, range ? { range: req.headers } : undefined);
  if (!o) return new Response('Not found', { status: 404 });
  const h = new Headers();
  const type = l.media_type || o.httpMetadata?.contentType || 'application/octet-stream';
  const inlineOk = /^(video|audio)\//.test(type) || type === 'application/pdf' || /^image\//.test(type);
  h.set('content-type', inlineOk ? type : 'application/octet-stream');
  h.set('accept-ranges', 'bytes');
  h.set('cache-control', 'private, no-store');
  h.set('x-content-type-options', 'nosniff');
  h.set('content-security-policy', 'sandbox');
  const dl = url.searchParams.get('dl') === '1' || !inlineOk;
  h.set('content-disposition', `${dl ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(l.media_name || 'file')}`);
  if (range && o.range) {
    const off = o.range.offset || 0;
    const len = o.range.length == null ? o.size - off : o.range.length;
    h.set('content-range', `bytes ${off}-${off + len - 1}/${o.size}`);
    h.set('content-length', String(len));
    return new Response(o.body, { status: 206, headers: h });
  }
  h.set('content-length', String(o.size));
  return new Response(o.body, { status: 200, headers: h });
}

// ---------------------------------------------------------------- واجهة الطالب
async function studentApi(c) {
  const { env, req, url } = c;
  const p = url.pathname, m = req.method;
  let mm;

  if (p === '/api/info' && m === 'GET') {
    const s = await getSettings(env);
    return respond({ site_name: s.site_name, teacher_name: s.teacher_name, welcome: s.welcome, footer: s.footer, bot: env.BOT_USERNAME || '' });
  }

  if (p === '/api/login' && m === 'POST') return apiLogin(c);
  if (p === '/api/otp/request' && m === 'POST') return apiOtpRequest(c);
  if (p === '/api/otp/verify' && m === 'POST') return apiOtpVerify(c);
  if (p === '/api/logout' && m === 'POST') return respond({ ok: true }, 200, [mkCookie(c, 'sid', '', { maxAge: 0 })]);

  if ((mm = p.match(/^\/media\/(\d+)$/)) && m === 'GET') return serveMedia(c, +mm[1]);

  const st = await studentFrom(c);
  if (!st) return err('غير مصرح', 401);

  if (p === '/api/me' && m === 'GET') {
    const s = await getSettings(env);
    return respond({
      id: st.id, name: st.name, grp: st.grp, claimed_at: st.claimed_at, device_info: st.device_info,
      tg_linked: !!st.tg_id, tg_name: st.tg_name, bot: env.BOT_USERNAME || '',
      site_name: s.site_name, teacher_name: s.teacher_name, footer: s.footer,
    });
  }

  if (p === '/api/me/tglink' && m === 'POST') {
    if (!env.BOT_TOKEN) return err('بوت تيليجرام غير مفعل', 400);
    if (!(await limit(env, 'tgl:' + st.id, 6, 3600))) return err('محاولات كثيرة', 429);
    const token = genCode().slice(0, 8);
    await run(env, 'DELETE FROM linktokens WHERE student_id=?', st.id);
    await run(env, 'INSERT INTO linktokens(token_hash,student_id,expires) VALUES(?,?,?)', await sha256('lt:' + token), st.id, now() + 600);
    return respond({ token, bot: env.BOT_USERNAME || '' });
  }

  if (p === '/api/courses' && m === 'GET') {
    const rows = await all(env, `SELECT c.id,c.title,c.description,c.cover,
      (SELECT COUNT(*) FROM lessons l WHERE l.course_id=c.id AND l.published=1) AS total,
      (SELECT COUNT(*) FROM progress p JOIN lessons l ON l.id=p.lesson_id WHERE l.course_id=c.id AND l.published=1 AND p.student_id=? AND p.done=1) AS done
      FROM courses c JOIN enrollments e ON e.course_id=c.id AND e.student_id=? WHERE c.published=1 ORDER BY c.sort,c.id`, st.id, st.id);
    return respond({ courses: rows });
  }

  if ((mm = p.match(/^\/api\/courses\/(\d+)$/)) && m === 'GET') {
    const course = await first(env, `SELECT c.id,c.title,c.description,c.cover FROM courses c JOIN enrollments e ON e.course_id=c.id AND e.student_id=? WHERE c.id=? AND c.published=1`, st.id, +mm[1]);
    if (!course) return err('الكورس غير متاح', 404);
    const lessons = await all(env, `SELECT l.id,l.title,l.kind,COALESCE(p.done,0) AS done,COALESCE(p.score,-1) AS score FROM lessons l
      LEFT JOIN progress p ON p.lesson_id=l.id AND p.student_id=? WHERE l.course_id=? AND l.published=1 ORDER BY l.sort,l.id`, st.id, course.id);
    return respond({ course, lessons });
  }

  if ((mm = p.match(/^\/api\/lessons\/(\d+)$/)) && m === 'GET') {
    const l = await lessonFor(env, st.id, +mm[1]);
    if (!l) return err('الدرس غير متاح', 404);
    const sibs = await all(env, 'SELECT id FROM lessons WHERE course_id=? AND published=1 ORDER BY sort,id', l.course_id);
    const i = sibs.findIndex((x) => x.id === l.id);
    const pr = await first(env, 'SELECT done,score FROM progress WHERE student_id=? AND lesson_id=?', st.id, l.id);
    const out = {
      id: l.id, course_id: l.course_id, course_title: l.course_title, title: l.title, kind: l.kind,
      done: pr ? pr.done : 0, score: pr ? pr.score : -1,
      prev: i > 0 ? sibs[i - 1].id : null, next: i >= 0 && i < sibs.length - 1 ? sibs[i + 1].id : null,
      watermark: `${st.name} - ${st.id}`,
    };
    if (l.kind === 'quiz') out.questions = JSON.parse(l.body).map((x) => ({ q: x.q, options: x.options }));
    else out.body = l.body;
    if (l.media_key) { out.media = { name: l.media_name, type: l.media_type }; }
    if (l.kind === 'video' && !l.media_key) out.embed = embedUrl(l.url);
    return respond(out);
  }

  if ((mm = p.match(/^\/api\/lessons\/(\d+)\/done$/)) && m === 'POST') {
    const l = await lessonFor(env, st.id, +mm[1]);
    if (!l) return err('الدرس غير متاح', 404);
    const b = await req.json().catch(() => ({}));
    await run(env, `INSERT INTO progress(student_id,lesson_id,done,updated_at) VALUES(?,?,?,?)
      ON CONFLICT(student_id,lesson_id) DO UPDATE SET done=excluded.done, updated_at=excluded.updated_at`, st.id, l.id, b.done ? 1 : 0, now());
    return respond({ ok: true });
  }

  if ((mm = p.match(/^\/api\/lessons\/(\d+)\/quiz$/)) && m === 'POST') {
    const l = await lessonFor(env, st.id, +mm[1]);
    if (!l || l.kind !== 'quiz') return err('الاختبار غير متاح', 404);
    const b = await req.json().catch(() => ({}));
    const qs = JSON.parse(l.body);
    const ans = Array.isArray(b.answers) ? b.answers : [];
    const correct = qs.map((x, i) => Number(ans[i]) === x.answer);
    const score = Math.round((correct.filter(Boolean).length / qs.length) * 100);
    await run(env, `INSERT INTO progress(student_id,lesson_id,done,score,updated_at) VALUES(?,?,1,?,?)
      ON CONFLICT(student_id,lesson_id) DO UPDATE SET done=1, score=MAX(progress.score, excluded.score), updated_at=excluded.updated_at`, st.id, l.id, score, now());
    return respond({ score, correct, answers: qs.map((x) => x.answer) });
  }

  if (p === '/api/announcements' && m === 'GET') {
    const rows = await all(env, `SELECT a.id,a.title,a.body,a.pinned,a.created_at,COALESCE(c.title,'') AS course FROM announcements a LEFT JOIN courses c ON c.id=a.course_id
      WHERE a.course_id=0 OR a.course_id IN (SELECT course_id FROM enrollments WHERE student_id=?) ORDER BY a.pinned DESC, a.id DESC LIMIT 50`, st.id);
    return respond({ items: rows });
  }

  return err('غير موجود', 404);
}

function lessonFor(env, studentId, lessonId) {
  return first(env, `SELECT l.*, co.title AS course_title FROM lessons l JOIN courses co ON co.id=l.course_id
    JOIN enrollments e ON e.course_id=co.id AND e.student_id=? WHERE l.id=? AND l.published=1 AND co.published=1`, studentId, lessonId);
}

// ---------------------------------------------------------------- الدخول وربط الكود بطالب وجهاز واحد
async function apiLogin(c) {
  const { env, req } = c;
  const ip = clientIp(req);
  if (!(await limit(env, 'login:' + ip, 20, 900))) return err('محاولات كثيرة، حاولي بعد قليل', 429);
  const b = await req.json().catch(() => ({}));
  const code = normCode(b.code);
  if (code.length !== 12) return err('الكود غير صحيح', 400);
  const st = await first(env, 'SELECT * FROM students WHERE code_hash=?', await codeHash(env, code));
  if (!st) {
    await logEvent(env, 'bad_code', 0, 'كود غير موجود', ip);
    return err('الكود غير صحيح', 401);
  }
  if (st.status !== 'active') return err('هذا الحساب موقوف، تواصل مع المعلمة', 403);

  const dv = parseCookies(req)['dv' + st.id];
  const sameDevice = !!(dv && st.device_hash && safeEq(await sha256(dv), st.device_hash));

  if (st.device_hash) {
    if (!sameDevice) return blockedResponse(c, st, ip);
    await logEvent(env, 'login', st.id, devInfo(req), ip);
    return respond({ ok: true }, 200, [await sessionCookie(c, st.id, st.sess_ver)]);
  }

  // الحساب لم يفعل بعد
  if (st.code_expires && st.code_expires < now()) return err('انتهت صلاحية الكود. اطلبي من المعلمة كودا جديدا', 403);
  if (st.pin_hash) {
    if (!b.pin) return respond({ need_pin: true });
    if (!(await limit(env, 'pin:' + st.id, 5, 900))) {
      await logEvent(env, 'blocked', st.id, 'محاولات رقم سري كثيرة', ip);
      await notifyAdmin(env, `[ تنبيه ]\nمحاولات رقم سري خاطئة كثيرة على حساب: ${st.name}`);
      return err('محاولات كثيرة، تواصل مع المعلمة', 429);
    }
    if (!safeEq(await pinHash(env, b.pin), st.pin_hash)) {
      await logEvent(env, 'bad_pin', st.id, devInfo(req), ip);
      return err('الرقم السري غير صحيح', 401);
    }
  }
  const newDv = rand(32);
  const r = await run(env, "UPDATE students SET device_hash=?, device_info=?, claimed_at=?, last_seen=? WHERE id=? AND device_hash=''", await sha256(newDv), devInfo(req), now(), now(), st.id);
  if (!r.meta.changes) return blockedResponse(c, st, ip); // سبقه جهاز اخر في نفس اللحظة
  await logEvent(env, 'claim', st.id, devInfo(req), ip);
  await notifyAdmin(env, `[ تفعيل حساب ]\nالطالب: ${st.name}\nالجهاز: ${devInfo(req)}\nاذا لم يكن هذا الطالب نفسه ارسلي: كود ${st.id}`);
  return respond({ ok: true }, 200, [mkCookie(c, 'dv' + st.id, newDv, { maxAge: 400 * 86400 }), await sessionCookie(c, st.id, st.sess_ver)]);
}

async function blockedResponse(c, st, ip) {
  const { env, req } = c;
  await logEvent(env, 'blocked', st.id, devInfo(req), ip);
  if (await limit(env, 'nb:' + st.id, 1, 600)) {
    await notifyAdmin(env, `[ محاولة دخول مرفوضة ]\nالحساب: ${st.name}\nالكود مفعل على جهاز اخر.\nالجهاز المحاول: ${devInfo(req)}`);
  }
  return respond({ error: 'هذا الكود مفعل على جهاز اخر ولا يمكن استخدامه هنا.', code: 'other_device', can_otp: !!(st.tg_id && env.BOT_TOKEN) }, 403);
}

async function apiOtpRequest(c) {
  const { env, req } = c;
  const ip = clientIp(req);
  if (!(await limit(env, 'otpip:' + ip, 10, 3600))) return err('محاولات كثيرة', 429);
  const b = await req.json().catch(() => ({}));
  const st = await first(env, 'SELECT * FROM students WHERE code_hash=?', await codeHash(env, normCode(b.code)));
  if (!st || st.status !== 'active') return err('الكود غير صحيح', 401);
  if (!st.tg_id || !env.BOT_TOKEN) return err('هذا الحساب غير مرتبط بتيليجرام. تواصل مع المعلمة لنقله.', 400);
  if (!(await limit(env, 'otp:' + st.id, 3, 3600))) return err('تجاوزت عدد الرموز المسموح بها، حاولي لاحقا', 429);
  const otp = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, '0');
  await run(env, 'INSERT OR REPLACE INTO otps(student_id,otp_hash,expires,tries) VALUES(?,?,?,0)', st.id, await sha256('otp:' + st.id + ':' + otp), now() + 300);
  await tgSend(env, st.tg_id, `[ رمز التحقق ]\n${otp}\n\nصالح لمدة 5 دقائق. استعماله ينقل حسابك الى الجهاز الجديد ويوقف القديم.\nاذا لم تطلبه انت لا تعطه لاحد.`);
  await logEvent(env, 'otp_sent', st.id, devInfo(req), ip);
  return respond({ ok: true });
}

async function apiOtpVerify(c) {
  const { env, req } = c;
  const ip = clientIp(req);
  if (!(await limit(env, 'otpv:' + ip, 15, 3600))) return err('محاولات كثيرة', 429);
  const b = await req.json().catch(() => ({}));
  const st = await first(env, 'SELECT * FROM students WHERE code_hash=?', await codeHash(env, normCode(b.code)));
  if (!st || st.status !== 'active') return err('الكود غير صحيح', 401);
  const o = await first(env, 'SELECT * FROM otps WHERE student_id=?', st.id);
  if (!o || o.expires < now() || o.tries >= 5) return err('الرمز منتهي او غير موجود، اطلبي رمزا جديدا', 400);
  await run(env, 'UPDATE otps SET tries=tries+1 WHERE student_id=?', st.id);
  if (!safeEq(await sha256('otp:' + st.id + ':' + toLatin(b.otp).trim()), o.otp_hash)) return err('الرمز غير صحيح', 401);

  const s = await getSettings(env);
  const used = await first(env, "SELECT COUNT(*) n FROM events WHERE kind='rebind' AND student_id=? AND ts>?", st.id, now() - 7 * 86400);
  if (used.n >= (parseInt(s.max_rebinds, 10) || 2)) {
    await notifyAdmin(env, `[ تنبيه ]\nالطالب ${st.name} تجاوز عدد مرات نقل الحساب هذا الاسبوع.`);
    return err('تجاوزت عدد مرات نقل الحساب هذا الاسبوع، تواصل مع المعلمة', 403);
  }
  const newDv = rand(32);
  await run(env, 'UPDATE students SET device_hash=?, device_info=?, claimed_at=?, sess_ver=sess_ver+1, last_seen=? WHERE id=?', await sha256(newDv), devInfo(req), now(), now(), st.id);
  await run(env, 'DELETE FROM otps WHERE student_id=?', st.id);
  const fresh = await first(env, 'SELECT sess_ver FROM students WHERE id=?', st.id);
  await logEvent(env, 'rebind', st.id, devInfo(req), ip);
  await notifyAdmin(env, `[ نقل حساب ]\nالطالب: ${st.name}\nنقل الى جهاز جديد عبر تيليجرام.\nالجهاز: ${devInfo(req)}`);
  return respond({ ok: true }, 200, [mkCookie(c, 'dv' + st.id, newDv, { maxAge: 400 * 86400 }), await sessionCookie(c, st.id, fresh.sess_ver)]);
}

// ---------------------------------------------------------------- لوحة تحكم المعلمة
async function adminApi(c) {
  const { env, req, url } = c;
  const p = url.pathname, m = req.method;
  let mm;
  const body = () => req.json().catch(() => ({}));

  if (p === '/api/admin/auth' && m === 'GET') {
    return respond({ password: !!env.ADMIN_PASSWORD, telegram: !!(env.BOT_TOKEN && adminIds(env).length), bot: env.BOT_USERNAME || '' });
  }
  if (p === '/api/admin/login' && m === 'POST') {
    if (!(await limit(env, 'adm:' + clientIp(req), 8, 900))) return err('محاولات كثيرة، حاولي بعد 15 دقيقة', 429);
    const b = await body();
    let good = false, via = '';
    if (b.code) {
      // دخول برمز يصل الى حساب المالك على تيليجرام (رمز لمرة واحدة)
      const row = await first(env, 'SELECT token_hash FROM linktokens WHERE token_hash=? AND student_id=-1 AND expires>?', await sha256('adm:' + normCode(b.code)), now());
      if (row) { await run(env, 'DELETE FROM linktokens WHERE token_hash=?', row.token_hash); good = true; via = 'تيليجرام'; }
    } else if (env.ADMIN_PASSWORD) {
      const okUser = safeEq(await sha256(String(b.user || '')), await sha256(env.ADMIN_USER || 'admin'));
      const okPass = safeEq(await sha256(String(b.pass || '')), await sha256(env.ADMIN_PASSWORD));
      if (okUser && okPass) { good = true; via = 'كلمة مرور'; }
    } else return err('اطلبي رمز الدخول من البوت: ارسلي له كلمة لوحة', 400);
    if (!good) { await logEvent(env, 'admin_bad_login', 0, devInfo(req), clientIp(req)); return err('بيانات الدخول غير صحيحة او منتهية', 401); }
    await logEvent(env, 'admin_login', 0, via + ' | ' + devInfo(req), clientIp(req));
    if (via === 'تيليجرام') c.ctx.waitUntil(notifyAdmin(env, `[ دخول لوحة التحكم ]\nتم الدخول بالرمز.\nالجهاز: ${devInfo(req)}\nاذا لم تكن انت: غيري BOT_TOKEN فورا.`));
    const exp = now() + 12 * 3600;
    const sig = await hmac(env.SESSION_SECRET, 'a:' + exp);
    return respond({ ok: true }, 200, [mkCookie(c, 'adm', exp + '.' + sig, { maxAge: 12 * 3600, strict: true })]);
  }
  if (p === '/api/admin/logout' && m === 'POST') return respond({ ok: true }, 200, [mkCookie(c, 'adm', '', { maxAge: 0, strict: true })]);
  if (!(await isAdmin(c))) return err('غير مصرح', 401);

  try {
    if (p === '/api/admin/me') {
      const s = await getSettings(env);
      return respond({ ok: true, site_name: s.site_name, origin: url.origin, bot: !!env.BOT_TOKEN, bot_username: env.BOT_USERNAME || '' });
    }

    if (p === '/api/admin/stats') {
      const st = await first(env, "SELECT COUNT(*) total, COALESCE(SUM(status='active'),0) active, COALESCE(SUM(device_hash!=''),0) claimed, COALESCE(SUM(tg_id!=''),0) linked, COALESCE(SUM(last_seen>?),0) today FROM students", now() - 86400);
      const co = await first(env, 'SELECT COUNT(*) n, COALESCE(SUM(published),0) pub FROM courses');
      const le = await first(env, 'SELECT COUNT(*) n FROM lessons');
      const bl = await first(env, "SELECT COUNT(*) n FROM events WHERE kind='blocked' AND ts>?", now() - 7 * 86400);
      const ev = await all(env, `SELECT e.id,e.ts,e.kind,e.detail,e.ip,COALESCE(s.name,'') AS student FROM events e LEFT JOIN students s ON s.id=e.student_id
        WHERE e.kind IN ('claim','blocked','rebind','bad_pin','tg_link','reset') ORDER BY e.id DESC LIMIT 8`);
      return respond({ students: st, courses: co, lessons: le.n, blocked_week: bl.n, events: ev });
    }

    // ---------- الطلاب
    if (p === '/api/admin/students' && m === 'GET') {
      const qs = clip(url.searchParams.get('q'), 60), grp = clip(url.searchParams.get('grp'), 60);
      const rows = await all(env, `SELECT id,name,phone,grp,status,(device_hash!='') AS claimed,claimed_at,(tg_id!='') AS linked,tg_name,last_seen,code_expires,created_at,
        (SELECT COUNT(*) FROM enrollments e WHERE e.student_id=students.id) AS courses FROM students
        WHERE (?1='' OR name LIKE '%'||?1||'%' OR phone LIKE '%'||?1||'%') AND (?2='' OR grp=?2) ORDER BY id DESC LIMIT 600`, qs, grp);
      const groups = (await all(env, "SELECT DISTINCT grp FROM students WHERE grp!='' ORDER BY grp")).map((r) => r.grp);
      return respond({ students: rows, groups });
    }
    if (p === '/api/admin/students' && m === 'POST') return respond(await createStudent(env, await body()));
    if (p === '/api/admin/students/bulk' && m === 'POST') {
      const b = await body();
      const lines = String(b.lines || '').split(/\r?\n/).map((x) => x.trim()).filter(Boolean).slice(0, 300);
      const out = [];
      for (const ln of lines) {
        const [name, phone, g] = ln.split(/[,،\t]/).map((x) => x.trim());
        out.push(await createStudent(env, { name, phone, grp: g || b.grp, courses: b.courses }));
      }
      return respond({ students: out });
    }
    if ((mm = p.match(/^\/api\/admin\/students\/(\d+)$/))) {
      const id = +mm[1];
      if (m === 'GET') {
        const s = await first(env, `SELECT id,name,phone,grp,note,status,(device_hash!='') AS claimed,device_info,claimed_at,(tg_id!='') AS linked,tg_name,last_seen,code_expires,created_at,(pin_hash!='') AS has_pin FROM students WHERE id=?`, id);
        if (!s) return err('غير موجود', 404);
        const enrolled = (await all(env, 'SELECT course_id FROM enrollments WHERE student_id=?', id)).map((r) => r.course_id);
        const events = await all(env, 'SELECT ts,kind,detail,ip FROM events WHERE student_id=? ORDER BY id DESC LIMIT 25', id);
        const prog = await all(env, `SELECT c.id,c.title,(SELECT COUNT(*) FROM lessons l WHERE l.course_id=c.id AND l.published=1) AS total,
          (SELECT COUNT(*) FROM progress p JOIN lessons l ON l.id=p.lesson_id WHERE l.course_id=c.id AND p.student_id=? AND p.done=1) AS done
          FROM courses c JOIN enrollments e ON e.course_id=c.id AND e.student_id=? ORDER BY c.sort,c.id`, id, id);
        return respond({ student: s, enrolled, events, progress: prog });
      }
      if (m === 'PUT') {
        const b = await body();
        const name = clip(b.name, 120);
        if (!name) return err('اكتبي الاسم');
        await run(env, 'UPDATE students SET name=?, phone=?, grp=?, note=? WHERE id=?', name, clip(toLatin(b.phone), 30), clip(b.grp, 60), clip(b.note, 300), id);
        if (b.pin === '__clear__') await run(env, "UPDATE students SET pin_hash='' WHERE id=?", id);
        else if (clip(b.pin, 20)) await run(env, 'UPDATE students SET pin_hash=? WHERE id=?', await pinHash(env, b.pin), id);
        return respond({ ok: true });
      }
      if (m === 'DELETE') {
        await env.DB.batch([q(env, 'DELETE FROM enrollments WHERE student_id=?', id), q(env, 'DELETE FROM progress WHERE student_id=?', id), q(env, 'DELETE FROM otps WHERE student_id=?', id), q(env, 'DELETE FROM linktokens WHERE student_id=?', id), q(env, 'DELETE FROM students WHERE id=?', id)]);
        return respond({ ok: true });
      }
    }
    if ((mm = p.match(/^\/api\/admin\/students\/(\d+)\/reset$/)) && m === 'POST') {
      const id = +mm[1];
      const nc = await newCodeFor(env);
      await run(env, "UPDATE students SET device_hash='', device_info='', claimed_at=0, sess_ver=sess_ver+1, code_hash=?, code_expires=? WHERE id=?", nc.hash, nc.expires, id);
      await run(env, 'DELETE FROM otps WHERE student_id=?', id);
      await logEvent(env, 'reset', id, 'اعادة تعيين من المعلمة', clientIp(req));
      return respond({ code: fmtCode(nc.code) });
    }
    if ((mm = p.match(/^\/api\/admin\/students\/(\d+)\/status$/)) && m === 'POST') {
      const b = await body();
      await run(env, 'UPDATE students SET status=?, sess_ver=sess_ver+1 WHERE id=?', b.status === 'suspended' ? 'suspended' : 'active', +mm[1]);
      return respond({ ok: true });
    }
    if ((mm = p.match(/^\/api\/admin\/students\/(\d+)\/unlink$/)) && m === 'POST') {
      await run(env, "UPDATE students SET tg_id='', tg_name='' WHERE id=?", +mm[1]);
      return respond({ ok: true });
    }
    if ((mm = p.match(/^\/api\/admin\/students\/(\d+)\/courses$/)) && m === 'POST') {
      const id = +mm[1];
      const ids = ((await body()).courses || []).map(Number).filter(Boolean);
      await env.DB.batch([q(env, 'DELETE FROM enrollments WHERE student_id=?', id), ...ids.map((cid) => q(env, 'INSERT OR IGNORE INTO enrollments(student_id,course_id) VALUES(?,?)', id, cid))]);
      return respond({ ok: true });
    }
    if (p === '/api/admin/enroll' && m === 'POST') {
      const b = await body();
      const cid = Number(b.course_id);
      const grp = clip(b.grp, 60);
      const ids = (await all(env, "SELECT id FROM students WHERE (?1='' OR grp=?1) AND status='active'", grp)).map((r) => r.id);
      if (b.action === 'remove') await env.DB.batch(ids.map((id) => q(env, 'DELETE FROM enrollments WHERE student_id=? AND course_id=?', id, cid)));
      else await env.DB.batch(ids.map((id) => q(env, 'INSERT OR IGNORE INTO enrollments(student_id,course_id) VALUES(?,?)', id, cid)));
      return respond({ count: ids.length });
    }

    // ---------- الكورسات
    if (p === '/api/admin/courses' && m === 'GET') {
      const rows = await all(env, `SELECT c.*,(SELECT COUNT(*) FROM lessons l WHERE l.course_id=c.id) AS lessons,(SELECT COUNT(*) FROM enrollments e WHERE e.course_id=c.id) AS students
        FROM courses c ORDER BY c.sort,c.id`);
      return respond({ courses: rows });
    }
    if (p === '/api/admin/courses' && m === 'POST') {
      const b = await body();
      const title = clip(b.title, 150);
      if (!title) return err('اكتبي عنوان الكورس');
      const mx = await first(env, 'SELECT COALESCE(MAX(sort),0)+10 AS s FROM courses');
      const r = await run(env, 'INSERT INTO courses(title,description,cover,published,sort,created_at) VALUES(?,?,?,?,?,?)', title, clip(b.description, 2000), clip(b.cover, 120), b.published ? 1 : 0, mx.s, now());
      return respond({ id: r.meta.last_row_id });
    }
    if ((mm = p.match(/^\/api\/admin\/courses\/(\d+)$/))) {
      const id = +mm[1];
      if (m === 'PUT') {
        const b = await body();
        const title = clip(b.title, 150);
        if (!title) return err('اكتبي عنوان الكورس');
        const old = await first(env, 'SELECT cover FROM courses WHERE id=?', id);
        await run(env, 'UPDATE courses SET title=?, description=?, cover=?, published=? WHERE id=?', title, clip(b.description, 2000), clip(b.cover, 120), b.published ? 1 : 0, id);
        if (old && old.cover && old.cover !== clip(b.cover, 120)) await env.BUCKET.delete('covers/' + old.cover);
        return respond({ ok: true });
      }
      if (m === 'DELETE') {
        const ls = await all(env, "SELECT media_key FROM lessons WHERE course_id=? AND media_key!=''", id);
        const co = await first(env, 'SELECT cover FROM courses WHERE id=?', id);
        const keys = ls.map((l) => l.media_key);
        if (co && co.cover) keys.push('covers/' + co.cover);
        for (let i = 0; i < keys.length; i += 500) await env.BUCKET.delete(keys.slice(i, i + 500));
        await env.DB.batch([
          q(env, 'DELETE FROM progress WHERE lesson_id IN (SELECT id FROM lessons WHERE course_id=?)', id),
          q(env, 'DELETE FROM lessons WHERE course_id=?', id), q(env, 'DELETE FROM enrollments WHERE course_id=?', id),
          q(env, 'DELETE FROM announcements WHERE course_id=?', id), q(env, 'DELETE FROM courses WHERE id=?', id),
        ]);
        return respond({ ok: true });
      }
    }
    if ((mm = p.match(/^\/api\/admin\/courses\/(\d+)\/move$/)) && m === 'POST') {
      await moveItem(env, 'courses', +mm[1], (await body()).dir < 0 ? -1 : 1, '');
      return respond({ ok: true });
    }
    if ((mm = p.match(/^\/api\/admin\/courses\/(\d+)\/enrolled$/))) {
      const id = +mm[1];
      if (m === 'GET') {
        const ids = (await all(env, 'SELECT student_id FROM enrollments WHERE course_id=?', id)).map((r) => r.student_id);
        const students = await all(env, "SELECT id,name,grp FROM students WHERE status='active' ORDER BY grp,name LIMIT 800");
        return respond({ ids, students });
      }
      if (m === 'POST') {
        const ids = ((await body()).ids || []).map(Number).filter(Boolean);
        await env.DB.batch([q(env, 'DELETE FROM enrollments WHERE course_id=?', id), ...ids.map((sid) => q(env, 'INSERT OR IGNORE INTO enrollments(student_id,course_id) VALUES(?,?)', sid, id))]);
        return respond({ ok: true });
      }
    }

    // ---------- الدروس
    if ((mm = p.match(/^\/api\/admin\/courses\/(\d+)\/lessons$/))) {
      const cid = +mm[1];
      if (m === 'GET') {
        const rows = await all(env, 'SELECT id,title,kind,url,media_key,media_name,media_type,published,sort FROM lessons WHERE course_id=? ORDER BY sort,id', cid);
        const course = await first(env, 'SELECT id,title FROM courses WHERE id=?', cid);
        return respond({ course, lessons: rows });
      }
      if (m === 'POST') {
        const l = cleanLesson(await body());
        const mx = await first(env, 'SELECT COALESCE(MAX(sort),0)+10 AS s FROM lessons WHERE course_id=?', cid);
        const r = await run(env, 'INSERT INTO lessons(course_id,title,kind,body,url,media_key,media_name,media_type,sort,published,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
          cid, l.title, l.kind, l.body, l.url, l.media_key, l.media_name, l.media_type, mx.s, l.published, now());
        return respond({ id: r.meta.last_row_id });
      }
    }
    if ((mm = p.match(/^\/api\/admin\/lessons\/(\d+)$/))) {
      const id = +mm[1];
      if (m === 'GET') {
        const l = await first(env, 'SELECT * FROM lessons WHERE id=?', id);
        return l ? respond({ lesson: l }) : err('غير موجود', 404);
      }
      if (m === 'PUT') {
        const old = await first(env, 'SELECT media_key FROM lessons WHERE id=?', id);
        if (!old) return err('غير موجود', 404);
        const l = cleanLesson(await body());
        await run(env, 'UPDATE lessons SET title=?, kind=?, body=?, url=?, media_key=?, media_name=?, media_type=?, published=? WHERE id=?', l.title, l.kind, l.body, l.url, l.media_key, l.media_name, l.media_type, l.published, id);
        if (old.media_key && old.media_key !== l.media_key) await env.BUCKET.delete(old.media_key);
        return respond({ ok: true });
      }
      if (m === 'DELETE') {
        const old = await first(env, 'SELECT media_key FROM lessons WHERE id=?', id);
        if (old && old.media_key) await env.BUCKET.delete(old.media_key);
        await env.DB.batch([q(env, 'DELETE FROM progress WHERE lesson_id=?', id), q(env, 'DELETE FROM lessons WHERE id=?', id)]);
        return respond({ ok: true });
      }
    }
    if ((mm = p.match(/^\/api\/admin\/lessons\/(\d+)\/move$/)) && m === 'POST') {
      const l = await first(env, 'SELECT course_id FROM lessons WHERE id=?', +mm[1]);
      if (l) await moveItem(env, 'lessons', +mm[1], (await body()).dir < 0 ? -1 : 1, 'WHERE course_id=?', l.course_id);
      return respond({ ok: true });
    }

    // ---------- الرفع (متعدد الاجزاء للملفات الكبيرة)
    if (p === '/api/admin/upload/start' && m === 'POST') {
      const b = await body();
      const name = clip(b.name, 120).replace(/[^\w.\u0600-\u06FF -]/g, '_') || 'file';
      const key = `media/${rand(8)}-${name}`;
      const mp = await env.BUCKET.createMultipartUpload(key, { httpMetadata: { contentType: clip(b.type, 100) || 'application/octet-stream' } });
      return respond({ key, uploadId: mp.uploadId });
    }
    if (p === '/api/admin/upload/part' && m === 'PUT') {
      const key = url.searchParams.get('key') || '', uploadId = url.searchParams.get('uploadId') || '', n = +url.searchParams.get('n');
      if (!key.startsWith('media/') || !n) return err('طلب غير صالح');
      const part = await env.BUCKET.resumeMultipartUpload(key, uploadId).uploadPart(n, await req.arrayBuffer());
      return respond({ partNumber: part.partNumber, etag: part.etag });
    }
    if (p === '/api/admin/upload/complete' && m === 'POST') {
      const b = await body();
      if (!String(b.key).startsWith('media/')) return err('طلب غير صالح');
      const o = await env.BUCKET.resumeMultipartUpload(b.key, b.uploadId).complete(b.parts || []);
      return respond({ key: b.key, size: o.size });
    }
    if (p === '/api/admin/upload/abort' && m === 'POST') {
      const b = await body();
      if (String(b.key).startsWith('media/')) { try { await env.BUCKET.resumeMultipartUpload(b.key, b.uploadId).abort(); } catch (e) {} }
      return respond({ ok: true });
    }
    if (p === '/api/admin/cover' && m === 'PUT') {
      const type = (req.headers.get('content-type') || '').split(';')[0];
      const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[type];
      if (!ext) return err('الصور المسموحة: jpg او png او webp');
      const buf = await req.arrayBuffer();
      if (buf.byteLength > 6 * 1024 * 1024) return err('حجم الصورة اكبر من 6 ميجا');
      const name = rand(10) + '.' + ext;
      await env.BUCKET.put('covers/' + name, buf, { httpMetadata: { contentType: type } });
      return respond({ cover: name });
    }

    // ---------- الاعلانات
    if (p === '/api/admin/announcements' && m === 'GET') {
      return respond({ items: await all(env, "SELECT a.*,COALESCE(c.title,'') AS course FROM announcements a LEFT JOIN courses c ON c.id=a.course_id ORDER BY a.pinned DESC,a.id DESC LIMIT 100") });
    }
    if (p === '/api/admin/announcements' && m === 'POST') {
      const b = await body();
      const title = clip(b.title, 150), text = String(b.body || '').slice(0, 4000);
      if (!title) return err('اكتبي عنوان الاعلان');
      const cid = Number(b.course_id) || 0;
      await run(env, 'INSERT INTO announcements(title,body,course_id,pinned,created_at) VALUES(?,?,?,?,?)', title, text, cid, b.pinned ? 1 : 0, now());
      let sent = 0;
      if (b.telegram && env.BOT_TOKEN) {
        const rows = cid
          ? await all(env, "SELECT s.tg_id FROM students s JOIN enrollments e ON e.student_id=s.id AND e.course_id=? WHERE s.tg_id!='' AND s.status='active'", cid)
          : await all(env, "SELECT tg_id FROM students WHERE tg_id!='' AND status='active'");
        sent = rows.length;
        c.ctx.waitUntil(broadcast(env, rows, `[ اعلان ]\n${title}\n\n${text}`));
      }
      return respond({ ok: true, sent });
    }
    if ((mm = p.match(/^\/api\/admin\/announcements\/(\d+)$/)) && m === 'DELETE') {
      await run(env, 'DELETE FROM announcements WHERE id=?', +mm[1]);
      return respond({ ok: true });
    }

    // ---------- السجل
    if (p === '/api/admin/events' && m === 'GET') {
      const kind = clip(url.searchParams.get('kind'), 30);
      const rows = await all(env, `SELECT e.id,e.ts,e.kind,e.detail,e.ip,COALESCE(s.name,'') AS student FROM events e LEFT JOIN students s ON s.id=e.student_id
        WHERE (?1='' OR e.kind=?1) ORDER BY e.id DESC LIMIT 200`, kind);
      return respond({ events: rows });
    }

    // ---------- الاعدادات وتيليجرام
    if (p === '/api/admin/settings' && m === 'GET') return respond({ settings: await getSettings(env) });
    if (p === '/api/admin/settings' && m === 'PUT') {
      const b = await body();
      const stmts = [];
      for (const k of Object.keys(DEFAULTS)) if (b[k] !== undefined) stmts.push(q(env, 'INSERT OR REPLACE INTO settings(k,v) VALUES(?,?)', k, clip(b[k], 600)));
      if (stmts.length) await env.DB.batch(stmts);
      return respond({ ok: true });
    }
    if (p === '/api/admin/tg/status' && m === 'GET') {
      if (!env.BOT_TOKEN) return respond({ configured: false });
      const info = await tgCall(env, 'getWebhookInfo');
      return respond({ configured: true, webhook: info.result ? info.result.url : '', error: info.result ? info.result.last_error_message || '' : info.description, admins: adminIds(env).length });
    }
    if (p === '/api/admin/tg/setup' && m === 'POST') {
      if (!env.BOT_TOKEN || !env.TG_SECRET) return err('اضبطي BOT_TOKEN و TG_SECRET اولا', 400);
      const r = await tgCall(env, 'setWebhook', { url: url.origin + '/tg', secret_token: env.TG_SECRET, allowed_updates: ['message'] });
      return r.ok ? respond({ ok: true }) : err(r.description || 'فشل', 400);
    }
  } catch (e) {
    return err(e.message || 'خطأ', 400);
  }
  return err('غير موجود', 404);
}

// ---------------------------------------------------------------- بوت تيليجرام (اوامر عربية بدون شرطة مائلة)
const STUDENT_HELP = [
  '[ اوامر الطالب ]', '',
  '[ ربط ] الرمز   ربط حسابك بتيليجرام (الرمز يظهر في صفحة حسابي بالموقع)',
  '[ حسابي ]   عرض بيانات حسابك',
].join('\n');
const ADMIN_HELP = [
  '[ اوامر المعلمة ]', '',
  '[ لوحة ]   رمز دخول لمرة واحدة للوحة التحكم في الموقع',
  '[ طلاب ]   ملخص الارقام',
  '[ بحث ] اسم   البحث عن طالب',
  '[ اضافة ] الاسم | الهاتف | المجموعة   اضافة طالب واصدار كود',
  '[ كود ] رقم   اعادة تعيين الجهاز واصدار كود جديد',
  '[ ايقاف ] رقم   ايقاف حساب',
  '[ تفعيل ] رقم   اعادة تفعيل حساب',
  '[ سجل ]   اخر الاحداث الامنية',
  '[ اعلان ] العنوان | النص   نشر اعلان وارساله للطلاب المرتبطين',
  '[ بث ] نص   رسالة لكل الطلاب المرتبطين',
].join('\n');
const TG_CMDS = { ربط: 'link', حسابي: 'me', مساعدة: 'help', اوامر: 'help', طلاب: 'stats', بحث: 'find', اضافة: 'add', كود: 'code', ايقاف: 'stop', تفعيل: 'start', سجل: 'log', اعلان: 'ann', بث: 'cast', لوحة: 'panel', دخول: 'panel' };

async function tgWebhook(c) {
  const { env, req } = c;
  if (!env.TG_SECRET || !safeEq(req.headers.get('x-telegram-bot-api-secret-token') || '', env.TG_SECRET)) return new Response('forbidden', { status: 403 });
  const upd = await req.json().catch(() => null);
  if (!upd || !upd.message || !upd.message.text) return new Response('ok');
  if (!(await limit(env, 'u:' + upd.update_id, 1, 600))) return new Response('ok');
  try { await tgHandle(c, upd.message); } catch (e) { console.error(e); }
  return new Response('ok');
}

async function tgHandle(c, msg) {
  const { env } = c;
  if (msg.chat.type !== 'private') return;
  const chat = msg.chat.id, uid = String(msg.from.id);
  const text = msg.text.trim();
  const isAdminUser = adminIds(env).includes(uid);
  let cmd, arg;

  const start = text.match(/^\/start(?:\s+(\S+))?$/i);
  if (start) { if (start[1]) { cmd = 'link'; arg = start[1]; } else return tgSend(env, chat, (isAdminUser ? ADMIN_HELP + '\n\n' : '') + STUDENT_HELP); }
  else {
    const parts = text.split(/\s+/);
    cmd = TG_CMDS[normAr(parts[0])];
    arg = text.slice(parts[0].length).trim();
  }
  if (!cmd) return;
  const say = (t) => tgSend(env, chat, t);

  if (cmd === 'help') return say((isAdminUser ? ADMIN_HELP + '\n\n' : '') + STUDENT_HELP);

  if (cmd === 'link') {
    if (!(await limit(env, 'tglink:' + uid, 8, 3600))) return say('[ محاولات كثيرة، حاول لاحقا ]');
    const tok = normCode(arg).slice(0, 8);
    const row = tok.length === 8 ? await first(env, 'SELECT * FROM linktokens WHERE token_hash=? AND expires>?', await sha256('lt:' + tok), now()) : null;
    if (!row) return say('[ الرمز غير صحيح او منتهي ]\nافتح صفحة حسابي في الموقع واطلب رمز ربط جديدا.');
    const n = await first(env, "SELECT COUNT(*) n FROM students WHERE tg_id=? AND id!=?", uid, row.student_id);
    if (n.n >= MAX_TG_PER_ACCOUNT) {
      await notifyAdmin(env, `[ تنبيه ]\nحساب تيليجرام ${msg.from.first_name || ''} يحاول ربط اكثر من ${MAX_TG_PER_ACCOUNT} حسابات طلاب.`);
      return say('[ لا يمكن ربط هذا الحساب بطلاب اضافيين ]');
    }
    const name = (msg.from.username ? '@' + msg.from.username : '') || msg.from.first_name || '';
    await run(env, 'UPDATE students SET tg_id=?, tg_name=? WHERE id=?', uid, clip(name, 80), row.student_id);
    await run(env, 'DELETE FROM linktokens WHERE token_hash=?', row.token_hash);
    const st = await first(env, 'SELECT name FROM students WHERE id=?', row.student_id);
    await logEvent(env, 'tg_link', row.student_id, name, '');
    await notifyAdmin(env, `[ ربط تيليجرام ]\n${st.name} ربط حسابه بـ ${name}`);
    return say(`[ تم الربط ]\nاهلا ${st.name}. يمكنك الان استلام رمز التحقق هنا عند تغيير الجهاز.`);
  }

  if (cmd === 'me') {
    const rows = await all(env, 'SELECT name,grp,status FROM students WHERE tg_id=?', uid);
    if (!rows.length) return say('[ لا يوجد حساب مرتبط ]');
    return say('[ حسابك ]\n' + rows.map((r) => `${r.name}${r.grp ? ' - ' + r.grp : ''} (${r.status === 'active' ? 'فعال' : 'موقوف'})`).join('\n'));
  }

  if (!isAdminUser) return say('[ هذا الامر للمعلمة فقط ]');

  if (cmd === 'panel') {
    if (!(await limit(env, 'panel:' + uid, 5, 600))) return say('[ محاولات كثيرة، انتظر قليلا ]');
    const code = genCode().slice(0, 8);
    await run(env, 'DELETE FROM linktokens WHERE student_id=-1');
    await run(env, 'INSERT INTO linktokens(token_hash,student_id,expires) VALUES(?,-1,?)', await sha256('adm:' + code), now() + 300);
    return say(`[ رمز دخول لوحة التحكم ]\n${code}\n\nافتح صفحة /admin في الموقع وادخل الرمز. صالح 5 دقائق ويعمل مرة واحدة.`);
  }

  if (cmd === 'stats') {
    const s = await first(env, "SELECT COUNT(*) t, COALESCE(SUM(status='active'),0) a, COALESCE(SUM(device_hash!=''),0) c, COALESCE(SUM(tg_id!=''),0) l FROM students");
    const co = await first(env, 'SELECT COUNT(*) n FROM courses');
    return say(`[ ملخص ]\nالطلاب: ${s.t}\nالفعالون: ${s.a}\nفعلوا الحساب: ${s.c}\nمرتبطون بتيليجرام: ${s.l}\nالكورسات: ${co.n}`);
  }
  if (cmd === 'find') {
    if (!arg) return say('[ اكتب الاسم بعد الامر ]');
    const rows = await all(env, "SELECT id,name,grp,status,(device_hash!='') AS c FROM students WHERE name LIKE '%'||?||'%' ORDER BY id DESC LIMIT 10", arg);
    return say(rows.length ? '[ النتائج ]\n' + rows.map((r) => `#${r.id} ${r.name}${r.grp ? ' [' + r.grp + ']' : ''} ${r.status === 'active' ? '' : '(موقوف) '}${r.c ? '(مفعل)' : '(لم يفعل)'}`).join('\n') : '[ لا توجد نتائج ]');
  }
  if (cmd === 'add') {
    const [name, phone, grp] = arg.split('|').map((x) => x.trim());
    if (!name) return say('[ الصيغة: اضافة الاسم | الهاتف | المجموعة ]');
    const r = await createStudent(env, { name, phone, grp });
    return say(`[ تمت الاضافة ]\n${r.name} (#${r.id})\nالكود: ${r.code}${r.pin ? '\nالرقم السري الثاني: ' + r.pin : ''}`);
  }
  if (cmd === 'code') {
    const id = parseInt(arg, 10);
    const st = id && (await first(env, 'SELECT id,name FROM students WHERE id=?', id));
    if (!st) return say('[ اكتب رقم الطالب بعد الامر ]');
    const nc = await newCodeFor(env);
    await run(env, "UPDATE students SET device_hash='', device_info='', claimed_at=0, sess_ver=sess_ver+1, code_hash=?, code_expires=? WHERE id=?", nc.hash, nc.expires, id);
    await logEvent(env, 'reset', id, 'اعادة تعيين من البوت', '');
    return say(`[ كود جديد ]\n${st.name}\n${fmtCode(nc.code)}`);
  }
  if (cmd === 'stop' || cmd === 'start') {
    const id = parseInt(arg, 10);
    if (!id) return say('[ اكتب رقم الطالب بعد الامر ]');
    await run(env, 'UPDATE students SET status=?, sess_ver=sess_ver+1 WHERE id=?', cmd === 'stop' ? 'suspended' : 'active', id);
    return say(cmd === 'stop' ? '[ تم ايقاف الحساب ]' : '[ تم تفعيل الحساب ]');
  }
  if (cmd === 'log') {
    const rows = await all(env, `SELECT e.ts,e.kind,e.detail,COALESCE(s.name,'') AS n FROM events e LEFT JOIN students s ON s.id=e.student_id WHERE e.kind IN ('blocked','bad_pin','rebind','claim','reset') ORDER BY e.id DESC LIMIT 10`);
    const label = { blocked: 'محاولة مرفوضة', bad_pin: 'رقم سري خاطئ', rebind: 'نقل جهاز', claim: 'تفعيل', reset: 'اعادة تعيين' };
    return say(rows.length ? '[ اخر الاحداث ]\n' + rows.map((r) => `${new Date(r.ts * 1000).toISOString().slice(5, 16).replace('T', ' ')}  ${label[r.kind]}  ${r.n}`).join('\n') : '[ لا توجد احداث ]');
  }
  if (cmd === 'ann') {
    const [title, body] = arg.split('|').map((x) => x.trim());
    if (!title) return say('[ الصيغة: اعلان العنوان | النص ]');
    await run(env, 'INSERT INTO announcements(title,body,course_id,pinned,created_at) VALUES(?,?,0,0,?)', title, body || '', now());
    const rows = await all(env, "SELECT tg_id FROM students WHERE tg_id!='' AND status='active'");
    c.ctx.waitUntil(broadcast(env, rows, `[ اعلان ]\n${title}\n\n${body || ''}`));
    return say(`[ تم النشر ] وارسال الاعلان الى ${rows.length} طالب`);
  }
  if (cmd === 'cast') {
    if (!arg) return say('[ اكتب الرسالة بعد الامر ]');
    const rows = await all(env, "SELECT tg_id FROM students WHERE tg_id!='' AND status='active'");
    c.ctx.waitUntil(broadcast(env, rows, arg));
    return say(`[ تم الارسال الى ${rows.length} طالب ]`);
  }
}

// ---------------------------------------------------------------- نقطة الدخول
export default {
  async fetch(req, env, ctx) {
    try {
      return await route(req, env, ctx);
    } catch (e) {
      console.error(e);
      return respond({ error: 'خطأ في الخادم' }, 500);
    }
  },
};

async function route(req, env, ctx) {
  const url = new URL(req.url);
  const p = url.pathname, m = req.method;
  if (!env.DB || !env.BUCKET) return new Response('اربطي قاعدة البيانات DB و R2 BUCKET في wrangler.toml', { status: 500 });
  if (!env.SESSION_SECRET) return new Response('اضيفي السر SESSION_SECRET (wrangler secret put SESSION_SECRET)', { status: 500 });
  await ensureSchema(env);
  const c = { req, env, ctx, url };

  if (m === 'GET') {
    if (p === '/') { const s = await getSettings(env); return pageHtml(s.site_name, 'student'); }
    if (p === '/admin') { const s = await getSettings(env); return pageHtml('لوحة التحكم - ' + s.site_name, 'admin'); }
    if (p.startsWith('/assets/')) return assetResponse(p);
    if (p.startsWith('/cover/')) return serveCover(env, p.slice(7));
    // تفعيل الويب هوك مرة واحدة: افتحي /tg/setup?key=TG_SECRET
    if (p === '/tg/setup') {
      if (!env.TG_SECRET || !safeEq(url.searchParams.get('key') || '', env.TG_SECRET)) return new Response('forbidden', { status: 403 });
      const r = await tgCall(env, 'setWebhook', { url: url.origin + '/tg', secret_token: env.TG_SECRET, allowed_updates: ['message'] });
      return new Response(r.ok ? 'تم تفعيل البوت. ارسلي له كلمة: لوحة' : 'فشل: ' + (r.description || ''), { status: r.ok ? 200 : 400, headers: { 'content-type': 'text/plain; charset=utf-8' } });
    }
  }

  if (!['GET', 'HEAD', 'OPTIONS'].includes(m)) {
    const o = req.headers.get('origin');
    if (o && new URL(o).host !== url.host) return err('forbidden', 403);
    if (p !== '/tg' && req.headers.get('x-req') !== '1') return err('forbidden', 403);
  }

  if (p === '/tg' && m === 'POST') return tgWebhook(c);
  if (p.startsWith('/api/admin/')) return adminApi(c);
  if (p.startsWith('/api/') || p.startsWith('/media/')) return studentApi(c);
  return new Response('Not found', { status: 404 });
}
