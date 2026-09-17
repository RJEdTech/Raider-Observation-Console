(function () {
'use strict';
var ID = 'rjObsConsole';
var q = function (s, r) { return (r || document).querySelector(s); };
var qa = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
var t = function (e) { return e ? (e.innerText || e.textContent || '').replace(/\s+/g, ' ').trim() : ''; };

/* ---------- toggle off ---------- */
function teardown() {
if (typeof sweepOverlays !== 'function') { /* defined below via hoisting */ }
var w = document.getElementById(ID); if (w) w.remove();
var c = document.getElementById(ID + 'Css'); if (c) c.remove();
document.body.classList.remove('rjoc-on');
qa('.rjoc-hide').forEach(function (x) { x.classList.remove('rjoc-hide'); });
qa('.rjoc-jump').forEach(function (x) { x.remove(); });
qa('.rjoc-rub').forEach(function (x) { x.remove(); });
sweepOverlays();
}
if (document.getElementById(ID)) { teardown(); return; }

/* ---------- guard ---------- */
var cards = qa('.category-lookfor');
var onForm = !!cards.length;
if (!onForm && !/ieobservation\.com/i.test(location.hostname)) {
var n = document.createElement('div');
n.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483000;background:#8c2f2f;color:#fff;padding:12px 16px;font:14px -apple-system,Segoe UI,Roboto,sans-serif';
n.textContent = 'Observation Console: open this on iObservation — a Conduct an Observation screen for the element tools, or any iObservation page for What I have done.';
document.body.appendChild(n); setTimeout(function () { n.remove(); }, 6000); return;
}

/* ---------- index the form ---------- */
var PRESETS = { chair: [1, 6, 10, 15, 17, 19, 22, 26], walk: [4, 9, 12, 14, 15, 25, 26, 28, 37] };
var KEY = 'rjoc_sel_v1';
var segs = qa('h2.category-title');
var dqs = qa('h3.category-title').filter(function (h) { return !h.closest('.category-lookfor'); });
function nearest(list, node) { var b = null; list.forEach(function (x) { if (x.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING) b = x; }); return b ? t(b) : ''; }
var els = [];
cards.forEach(function (c) {
var h = q('.category-title h3', c) || q('h3', c); var name = t(h); if (!name) return;
var m = name.match(/^(\d+)\.\s*(.*)$/);
els.push({ card: c, num: m ? +m[1] : null, title: m ? m[2] : name, raw: name, interview: !m, seg: nearest(segs, c), dq: nearest(dqs, c) });
});
var numbered = els.filter(function (e) { return e.num; });

/* iObservation's own left-hand navigator — same elements, its own list */
var tl = qa('nav.observation-timeline li.timeline-lookfor').map(function (li) {
var title = t(q('.timeline-item-title', li)) || t(li);
var m = title.match(/^(\d+)\./);
return { li: li, num: m ? +m[1] : null, interview: !m };
});
function applyTimeline() {
tl.forEach(function (x) {
var on = x.interview ? showInt : sel.indexOf(x.num) > -1;
x.li.classList.toggle('rjoc-hide', !on);
});
qa('nav.observation-timeline li.timeline-subcategory, nav.observation-timeline li.timeline-category').forEach(function (li) {
var live = qa('li.timeline-lookfor', li).filter(function (n) { return !n.classList.contains('rjoc-hide'); });
li.classList.toggle('rjoc-hide', !live.length);
});
}

/* ---------- state ---------- */
var sel = null; try { sel = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
if (!sel || !sel.length) sel = PRESETS.chair.slice();
var showInt = false;
function save() { try { localStorage.setItem(KEY, JSON.stringify(sel)); } catch (e) {} }

function apply() {
els.forEach(function (e) {
var on = e.interview ? showInt : sel.indexOf(e.num) > -1;
e.card.classList.toggle('rjoc-hide', !on);
});
document.body.classList.add('rjoc-on');
applyTimeline(); paintList(); paintStatus();
}

/* ---------- form-level selects ---------- */
function selects() { return qa('p-select').filter(function (s) { return !s.closest('.ql-toolbar'); }); }
function typeSel() { return selects()[1]; }
function evalSel() { return selects()[2]; }
function setSelect(s, want) {
if (!s) return;
var c = q('[role="combobox"],.p-select-label', s) || s; c.click();
waitFor(function () { var p = qa('.p-select-overlay,.p-select-panel,.p-overlay').pop(); return p && qa('li,[role="option"]', p).length ? p : null; }, 4000, function (p) {
if (!p) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return; }
var o = qa('li,[role="option"]', p).filter(function (x) { return t(x) === want; })[0];
if (o) o.click(); else document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
setTimeout(paintStatus, 400);
});
}

/* ---------- wait helper ---------- */
function waitFor(test, ms, done) {
var t0 = Date.now();
var iv = setInterval(function () {
var v = null; try { v = test(); } catch (e) {}
if (v) { clearInterval(iv); done(v); }
else if (Date.now() - t0 > ms) { clearInterval(iv); done(null); }
}, 150);
}

/* ---------- the vendor's drawer sometimes leaves its mask behind ----------
   A p-overlay-mask stuck in leave-active covers the whole page with
   pointer-events:auto, so every click afterwards lands on nothing. Only ever
   removes overlays with no open drawer behind them. */
function sweepOverlays() {
if (q('.p-drawer-open')) return false;
var gone = 0;
qa('.p-overlay-mask, .p-drawer-mask').forEach(function (m) { m.remove(); gone++; });
qa('.p-drawer').forEach(function (d) { if (!d.classList.contains('p-drawer-open')) { d.remove(); gone++; } });
if (gone) { document.body.style.overflow = ''; document.documentElement.style.overflow = ''; }
return !!gone;
}
function closeDrawer(done) {
var cb = qa('.p-drawer button').filter(function (b) { return /close/i.test(b.getAttribute('aria-label') || ''); })[0] || qa('.p-drawer button')[0];
if (cb) cb.click();
document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
waitFor(function () { return q('.p-drawer-open') ? null : true; }, 3000, function () {
setTimeout(function () { sweepOverlays(); if (done) done(); }, 450);
});
}

/* ---------- rubric, read out of the View Scale drawer ---------- */
function rubric(e, btn) {
var open = q('.rjoc-rub', e.card);
if (open) { open.remove(); btn.textContent = 'Show rubric'; return; }
var vs = qa('button', e.card).filter(function (b) { return /View Scale/i.test(t(b)); })[0];
if (!vs) { btn.textContent = 'no scale'; return; }
btn.textContent = 'loading…'; vs.click();
waitFor(function () { var d = q('.iob-scale-resource-drawer'); return d && q('table', d) ? d : null; }, 12000, function (d) {
if (!d) { btn.textContent = 'Show rubric'; return; }
var tb = q('table', d);
var heads = qa('th', tb).map(t), cells = qa('td', tb).map(t), levels = [];
heads.forEach(function (h, i) { levels.push([h, cells[i] || '']); });
/* let the open animation finish before asking it to close — interrupting it
   is what wedges the mask */
setTimeout(function () { closeDrawer(); }, 550);
var box = document.createElement('div'); box.className = 'rjoc-rub';
box.innerHTML = '<div class="rjoc-rubhead">What the rubric actually says</div>' +
levels.map(function (l) {
var key = /Applying|Developing/i.test(l[0]);
return '<div class="rjoc-rl' + (key ? ' rjoc-rl-key' : '') + '"><b>' + esc(l[0]) + '</b><span>' + esc(l[1]) + '</span></div>';
}).join('') +
'<div class="rjoc-rubfoot">Applying and Developing are the same strategy. The only difference is whether you saw the teacher check that it landed. Beginning is the level for faulty execution — not Developing.</div>';
var anchor = q('.lookfor-scale-options', e.card) || q('.lookfor-scale-header', e.card);
if (anchor && anchor.parentElement) anchor.parentElement.insertBefore(box, anchor.nextSibling);
btn.textContent = 'Hide rubric';
});
}
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

/* ---------- what I have done — from the observer's own history ----------
   /iob/api/observations/search is scoped to the signed-in observer: it returns
   only observations they conducted. An observation counts as finished once it
   carries a dateCompleted; the rest are still open drafts. */
var WORK = null;
function fetchWork(done) {
if (WORK) { done(WORK); return; }
fetch('/iob/api/observations/search?page=0&size=500', { headers: { Accept: 'application/json' }, credentials: 'same-origin' })
.then(function (r) { return r.ok ? r.text() : null; })
.then(function (txt) {
if (!txt) { done(null); return; }
var j; try { j = JSON.parse(txt.replace(/^while\(1\);/, '')); } catch (e) { done(null); return; }
WORK = (j.content || []).map(function (o) {
var l = o.learner || {};
return {
name: [l.lastName, l.firstName].filter(Boolean).join(', ') || 'Unknown',
started: (o.dateStarted || '').slice(0, 10),
done: (o.dateCompleted || '').slice(0, 10),
id: o.id
};
});
done(WORK);
})
.catch(function () { done(null); });
}
function yearStart() { var n = new Date(), y = n.getFullYear(); return (n.getMonth() >= 7 ? y : y - 1) + '-08-01'; }
function ageDays(iso) { return Math.max(0, Math.round((Date.now() - Date.parse(iso + 'T00:00:00')) / 864e5)); }
function renderWork(rows) {
var body = q('.rjoc-workbody', wrap);
if (!rows) {
body.innerHTML = '<p class="rjoc-wnote">Could not read your history. Open <strong>Observations &rsaquo; Conduct Observation &rsaquo; Completed Observations</strong> instead.</p>';
return;
}
var ys = yearStart();
var drafts = rows.filter(function (r) { return !r.done; });
var fin = rows.filter(function (r) { return r.done; });
var thisYear = fin.filter(function (r) { return r.done >= ys; });
var byT = {};
fin.forEach(function (r) {
if (!byT[r.name]) byT[r.name] = { n: 0, last: '', year: 0 };
var x = byT[r.name]; x.n++; if (r.done > x.last) x.last = r.done; if (r.done >= ys) x.year++;
});
var names = Object.keys(byT).sort(function (a, b) { return byT[b].last.localeCompare(byT[a].last); });
var months = {};
thisYear.forEach(function (r) { months[r.done.slice(0, 7)] = (months[r.done.slice(0, 7)] || 0) + 1; });
var mk = Object.keys(months).sort();
var peak = Math.max.apply(null, mk.map(function (k) { return months[k]; }).concat([1]));
var html = '<div class="rjoc-wstat"><b>' + thisYear.length + '</b> finished since 1 August &middot; <b>' +
names.filter(function (n) { return byT[n].year; }).length + '</b> teachers this year &middot; <b>' + fin.length + '</b> all time</div>';
if (drafts.length) {
html += '<div class="rjoc-wsec">Still open</div>';
drafts.sort(function (a, b) { return a.started.localeCompare(b.started); }).forEach(function (r) {
var a = ageDays(r.started);
html += '<div class="rjoc-wrow"><span class="rjoc-wname">' + esc(r.name) + '</span>' +
'<span class="rjoc-wage' + (a > 7 ? ' rjoc-wold' : '') + '">' + a + ' day' + (a === 1 ? '' : 's') + '</span>' +
'<a class="rjoc-wgo" href="/app/observations/' + esc(r.id) + '/conduct">continue</a></div>';
});
}
if (mk.length) {
html += '<div class="rjoc-wsec">By month, this year</div><div class="rjoc-wbars">';
mk.forEach(function (k) {
html += '<div class="rjoc-wbar"><i style="height:' + Math.round(months[k] / peak * 46 + 4) + 'px"></i><u>' + k.slice(5) + '</u><b>' + months[k] + '</b></div>';
});
html += '</div>';
}
html += '<div class="rjoc-wsec">Teachers you have seen &mdash; most recent first</div>';
names.forEach(function (n) {
var x = byT[n];
html += '<div class="rjoc-wrow"><span class="rjoc-wname">' + esc(n) + '</span>' +
'<span class="rjoc-wmeta">' + x.last + (x.n > 1 ? ' &middot; ' + x.n + ' visits' : '') + (x.year ? '' : ' &middot; not this year') + '</span>' +
'<button type="button" class="rjoc-wgo" data-find="' + esc(n) + '">find</button></div>';
});
html += '<p class="rjoc-wnote">Only observations <strong>you</strong> conducted. <em>find</em> copies the name and opens Completed Observations &mdash; paste it into <em>Search user or ID</em>.</p>';
body.innerHTML = html;
}

/* ---------- UI ---------- */
var wrap = document.createElement('div'); wrap.id = ID;
wrap.innerHTML =
'<div class="rjoc-bar">' +
'<span class="rjoc-brand">Observation Console</span>' +
(onForm ? '<button type="button" class="rjoc-b" data-a="panel">Elements</button>' +
'<button type="button" class="rjoc-b" data-a="next">Next unscored</button>' : '') +
'<button type="button" class="rjoc-b" data-a="work">What I have done</button>' +
'<span class="rjoc-chip" data-a="type"></span><span class="rjoc-chip" data-a="eval"></span>' +
'<span class="rjoc-prog"></span><span class="rjoc-sp"></span>' +
(onForm ? '<button type="button" class="rjoc-b rjoc-g" data-a="save">Save</button>' +
'<button type="button" class="rjoc-b rjoc-g" data-a="review">Review</button>' : '') +
'<button type="button" class="rjoc-b rjoc-g" data-a="close">Close</button>' +
'</div>' +
'<div class="rjoc-panel" hidden>' +
'<div class="rjoc-prow">' +
'<input class="rjoc-search" placeholder="Search the 41 elements">' +
'<button type="button" class="rjoc-b rjoc-s" data-a="p-chair">Chair 8</button>' +
'<button type="button" class="rjoc-b rjoc-s" data-a="p-walk">Walkthrough 9</button>' +
'<button type="button" class="rjoc-b rjoc-s" data-a="p-all">All 41</button>' +
'<button type="button" class="rjoc-b rjoc-s" data-a="p-none">None</button></div>' +
'<label class="rjoc-int"><input type="checkbox" class="rjoc-intbox"> show student interview blocks</label>' +
'<div class="rjoc-list"></div>' +
'<p class="rjoc-foot">This also filters iObservation\'s own element list on the left. Your selection is remembered on this computer. Nothing here is saved to the observation until you press Save.</p>' +
'</div>' +
'<div class="rjoc-panel rjoc-work" hidden><div class="rjoc-workbody"><p class="rjoc-wnote">Reading your history&hellip;</p></div></div>';

var css = document.createElement('style'); css.id = ID + 'Css';
css.textContent = [
'body.rjoc-on{padding-top:56px}',
'body.rjoc-on .category-lookfor.rjoc-hide{display:none!important}',
'body.rjoc-on nav.observation-timeline li.rjoc-hide{display:none!important}',
'body.rjoc-on .ql-editor{min-height:170px}',
'body.rjoc-on .category-lookfor{scroll-margin-top:64px}',
'#' + ID + '{position:fixed;top:0;left:0;right:0;z-index:2147483000;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}',
'#' + ID + ' *{box-sizing:border-box}',
'#' + ID + ' .rjoc-bar{display:flex;align-items:center;gap:8px;padding:9px 14px;background:#0f2a1f;color:#fff;box-shadow:0 2px 10px rgba(0,0,0,.35);flex-wrap:wrap}',
'#' + ID + ' .rjoc-brand{font-weight:700;font-size:14px;letter-spacing:.02em}',
'#' + ID + ' .rjoc-sp{flex:1}',
'#' + ID + ' .rjoc-b{font:inherit;font-size:13px;font-weight:600;padding:6px 12px;border-radius:7px;border:1px solid transparent;background:#f2c14e;color:#1a1a1a;cursor:pointer}',
'#' + ID + ' .rjoc-b:hover{filter:brightness(1.06)}',
'#' + ID + ' .rjoc-g{background:transparent;color:#fff;border-color:rgba(255,255,255,.45)}',
'#' + ID + ' .rjoc-s{font-size:12px;padding:5px 9px}',
'#' + ID + ' .rjoc-chip{font-size:12px;font-weight:600;padding:5px 10px;border-radius:20px;background:#1e4636;color:#cfe3d8;cursor:pointer;white-space:nowrap}',
'#' + ID + ' .rjoc-chip:hover{filter:brightness(1.15)}',
'#' + ID + ' .rjoc-chip.rjoc-warn{background:#8c2f2f;color:#fff}',
'#' + ID + ' .rjoc-prog{font-size:12px;color:#cfe3d8}',
'#' + ID + ' .rjoc-panel{position:absolute;top:56px;left:14px;width:400px;max-width:calc(100vw - 28px);max-height:56vh;overflow:auto;background:#fff;color:#1a1a1a;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.28);padding:12px 14px 6px}',
'#' + ID + ' .rjoc-prow{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}',
'#' + ID + ' .rjoc-search{flex:1 1 150px;font:inherit;font-size:13px;padding:6px 9px;border:1px solid #d8d8d2;border-radius:7px;color:#1a1a1a;background:#fff}',
'#' + ID + ' .rjoc-int{display:block;font-size:12px;color:#5a5a55;margin:2px 0 8px}',
'#' + ID + ' .rjoc-seg{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#7a7a72;margin:12px 0 4px;padding-bottom:4px;border-bottom:1px solid #eceae4}',
'#' + ID + ' .rjoc-row{display:flex;align-items:flex-start;gap:8px;padding:4px 6px;border-radius:6px}',
'#' + ID + ' .rjoc-row:hover{background:#f4f4f2}',
'#' + ID + ' .rjoc-row b{font-weight:700;min-width:22px;color:#0f2a1f}',
'#' + ID + ' .rjoc-row span[data-j]{flex:1;font-size:13px;cursor:pointer}',
'#' + ID + ' .rjoc-star{color:#8a7430;font-size:10.5px;text-transform:uppercase;letter-spacing:.06em}',
'#' + ID + ' .rjoc-foot{font-size:11.5px;color:#8a8a82;margin:10px 0 6px}',
'#' + ID + ' .rjoc-work{width:470px}',
'#' + ID + ' .rjoc-wstat{font-size:13.5px;color:#1a1a1a;background:#f0f5f2;border-left:3px solid #0f2a1f;border-radius:6px;padding:9px 12px}',
'#' + ID + ' .rjoc-wstat b{font-size:15px;color:#0f2a1f}',
'#' + ID + ' .rjoc-wsec{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#7a7a72;margin:14px 0 4px;padding-bottom:4px;border-bottom:1px solid #eceae4}',
'#' + ID + ' .rjoc-wrow{display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:6px;font-size:13px}',
'#' + ID + ' .rjoc-wrow:hover{background:#f4f4f2}',
'#' + ID + ' .rjoc-wname{flex:1;font-weight:600;color:#14241d}',
'#' + ID + ' .rjoc-wmeta,#' + ID + ' .rjoc-wage{font-size:12px;color:#7a7a72;white-space:nowrap}',
'#' + ID + ' .rjoc-wold{color:#8c2f2f;font-weight:700}',
'#' + ID + ' .rjoc-wgo{font:inherit;font-size:11.5px;font-weight:600;padding:3px 9px;border-radius:6px;border:1px solid #cfcfc8;background:#fff;color:#1a1a1a;cursor:pointer;text-decoration:none}',
'#' + ID + ' .rjoc-wgo:hover{background:#f2c14e;border-color:#f2c14e}',
'#' + ID + ' .rjoc-wbars{display:flex;align-items:flex-end;gap:7px;padding:6px 2px 0}',
'#' + ID + ' .rjoc-wbar{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10.5px;color:#7a7a72}',
'#' + ID + ' .rjoc-wbar i{display:block;width:20px;background:#0f2a1f;border-radius:3px 3px 0 0}',
'#' + ID + ' .rjoc-wbar b{font-size:11px;color:#0f2a1f}',
'#' + ID + ' .rjoc-wbar u{text-decoration:none}',
'#' + ID + ' .rjoc-wnote{font-size:11.5px;color:#8a8a82;margin:10px 0 6px;line-height:1.5}',
'.rjoc-rub{margin:10px 0 0;background:#fbf7ea;border-left:3px solid #f2c14e;border-radius:6px;padding:10px 14px}',
'.rjoc-rubhead{font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:#8a7430;font-weight:700;margin-bottom:6px}',
'.rjoc-rl{display:flex;gap:10px;font-size:13px;line-height:1.45;margin:5px 0;opacity:.6}',
'.rjoc-rl-key{opacity:1}',
'.rjoc-rl b{min-width:90px;color:#0f2a1f}',
'.rjoc-rubfoot{font-size:12px;color:#6a6a63;margin-top:8px;font-style:italic}',
'.rjoc-jump{font:inherit;font-size:11px;font-weight:600;padding:3px 9px;margin-left:8px;border-radius:6px;border:1px solid #cfcfc8;background:#fff;color:#1a1a1a;cursor:pointer;vertical-align:middle}',
'.rjoc-jump:hover{background:#f2c14e;border-color:#f2c14e}',
'.rjoc-dupe{display:inline-block;margin-left:8px;font-size:11px;font-weight:700;color:#8c2f2f}'
].join('');
document.head.appendChild(css); document.body.appendChild(wrap);
var panel = q('.rjoc-panel', wrap), list = q('.rjoc-list', wrap), work = q('.rjoc-work', wrap);

function scoredCount(e) { return qa('.lookfor-scale-option .p-checkbox-checked', e.card).length; }
function paintStatus0() {
q('.rjoc-prog', wrap).textContent = '';
['type', 'eval'].forEach(function (k) { var c = q('[data-a="' + k + '"]', wrap); if (c) c.remove(); });
}
function paintStatus() {
if (!onForm) return;
var ts = t(typeSel()), es = t(evalSel());
var tc = q('[data-a="type"]', wrap), ec = q('[data-a="eval"]', wrap);
var unset = /Select Type/i.test(ts) || !ts;
tc.textContent = 'Type: ' + (unset ? 'not set — click to set Formal' : ts);
tc.classList.toggle('rjoc-warn', unset);
ec.textContent = 'Counts toward evaluation: ' + (es || '?');
ec.classList.toggle('rjoc-warn', /yes/i.test(es));
var chosen = numbered.filter(function (e) { return sel.indexOf(e.num) > -1; });
var done = chosen.filter(function (e) { return scoredCount(e); }).length;
q('.rjoc-prog', wrap).textContent = done + ' of ' + chosen.length + ' scored';
chosen.forEach(function (e) {
var flag = q('.rjoc-dupe', e.card);
if (scoredCount(e) > 1) {
if (!flag) { flag = document.createElement('span'); flag.className = 'rjoc-dupe'; flag.textContent = 'two levels ticked'; (q('.category-title', e.card) || e.card).appendChild(flag); }
} else if (flag) flag.remove();
});
}
function paintList() {
var term = (q('.rjoc-search', wrap).value || '').toLowerCase(), html = '', seg = '';
numbered.forEach(function (e) {
if (term && e.raw.toLowerCase().indexOf(term) < 0) return;
if (e.seg !== seg) { seg = e.seg; html += '<div class="rjoc-seg">' + esc(seg) + '</div>'; }
html += '<div class="rjoc-row"><input type="checkbox" data-n="' + e.num + '"' + (sel.indexOf(e.num) > -1 ? ' checked' : '') +
'><b>' + e.num + '</b><span data-j="' + e.num + '">' + esc(e.title) +
(PRESETS.chair.indexOf(e.num) > -1 ? ' <span class="rjoc-star">chair</span>' : '') + '</span></div>';
});
list.innerHTML = html || '<p style="font-size:13px;color:#7a7a72">Nothing matches.</p>';
}
function addCardTools() {
numbered.forEach(function (e) {
if (q('.rjoc-jump', e.card)) return;
var h = q('.category-title', e.card); if (!h) return;
var r = document.createElement('button'); r.type = 'button'; r.className = 'rjoc-jump'; r.textContent = 'Show rubric';
r.addEventListener('click', function (ev) { ev.preventDefault(); ev.stopPropagation(); rubric(e, r); });
var c = document.createElement('button'); c.type = 'button'; c.className = 'rjoc-jump'; c.textContent = 'Comment';
c.addEventListener('click', function (ev) {
ev.preventDefault(); ev.stopPropagation();
var ed = q('.ql-editor', e.card); if (ed) { ed.scrollIntoView({ block: 'center' }); ed.focus(); }
});
h.appendChild(r); h.appendChild(c);
});
}
function goTo(num) {
var e = numbered.filter(function (x) { return x.num === +num; })[0]; if (!e) return;
if (sel.indexOf(+num) < 0) { sel.push(+num); save(); apply(); }
e.card.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

wrap.addEventListener('click', function (ev) {
var find = ev.target.getAttribute && ev.target.getAttribute('data-find');
if (find) { try { navigator.clipboard.writeText(find); } catch (e) {} location.href = '/app/observations#completed'; return; }
var j = ev.target.getAttribute && ev.target.getAttribute('data-j');
if (j) { goTo(j); panel.hidden = true; return; }
if (ev.target.type === 'checkbox' && ev.target.hasAttribute('data-n')) {
var v = +ev.target.getAttribute('data-n'), i = sel.indexOf(v);
if (ev.target.checked && i < 0) sel.push(v);
if (!ev.target.checked && i > -1) sel.splice(i, 1);
save(); apply(); return;
}
var el = ev.target.closest('[data-a]'); if (!el) return;
var a = el.getAttribute('data-a');
if (a === 'panel') { work.hidden = true; panel.hidden = !panel.hidden; if (!panel.hidden) { paintList(); q('.rjoc-search', wrap).focus(); } }
else if (a === 'work') { panel.hidden = true; work.hidden = !work.hidden; if (!work.hidden) fetchWork(renderWork); }
else if (a === 'close') teardown();
else if (a === 'type') setSelect(typeSel(), 'Formal');
else if (a === 'eval') setSelect(evalSel(), 'No');
else if (a === 'save' || a === 'review') {
var want = a === 'save' ? 'Save' : 'Review';
var b = qa('.conduct-header button').filter(function (x) { return t(x) === want; })[0];
if (b) b.click();
}
else if (a === 'next') {
var nxt = numbered.filter(function (e) { return sel.indexOf(e.num) > -1 && !scoredCount(e); })[0];
if (nxt) nxt.card.scrollIntoView({ block: 'start', behavior: 'smooth' });
else q('.rjoc-prog', wrap).textContent = 'all selected elements scored';
}
else if (a === 'p-chair') { sel = PRESETS.chair.slice(); save(); apply(); panel.hidden = true; }
else if (a === 'p-walk') { sel = PRESETS.walk.slice(); save(); apply(); panel.hidden = true; }
else if (a === 'p-all') { sel = numbered.map(function (e) { return e.num; panel.hidden = true; }); save(); apply(); }
else if (a === 'p-none') { sel = []; save(); apply(); panel.hidden = true; }
});
q('.rjoc-search', wrap).addEventListener('input', paintList);
q('.rjoc-intbox', wrap).addEventListener('change', function () { showInt = this.checked; apply(); });
document.addEventListener('change', function (ev) { if (!wrap.contains(ev.target)) setTimeout(paintStatus, 60); }, true);
document.addEventListener('keydown', function (ev) {
if (ev.key === 'Escape') { panel.hidden = true; work.hidden = true; }
});
document.addEventListener('click', function (ev) {
if (!wrap.contains(ev.target)) { panel.hidden = true; work.hidden = true; }
}, true);
if (onForm) { addCardTools(); apply(); } else { document.body.classList.add('rjoc-on'); paintStatus0(); }
})();
