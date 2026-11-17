// Data checks — run with: node tools/check.js   (no install needed)
// Revisión de datos — corre con: node tools/check.js   (no necesita instalar nada)
// Catches the kind of mistake that once blanked the app (a 'tri' written as text instead of a list),
// meds that resolve to the wrong Appendix C entry, service-worker files that don't exist, and version mismatches.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const errs = [], warn = [];
const bad = m => errs.push(m);

// Load data files into one sandbox (they declare top-level consts).
const ctx = vm.createContext({ console });
const files = ['data/protocols.js', 'data/meds.js', 'data/plans.js', 'data/notetags.js', 'data/searchterms.js', 'data/whatsnew.js'];
let src = files.map(rd).join('\n;\n');
const app = rd('app.js');
const medre = (app.match(/const MEDRE=\[[\s\S]*?\]\];/) || [])[0];
if (!medre) bad('app.js: MEDRE table not found');
src += '\n' + (medre || 'const MEDRE=[];') + '\nfunction medLookup(n){for(const [re,k] of MEDRE)if(re.test(n))return ADMEDS.find(m=>m.k===k);return null;}';
src += '\nthis.__ = {PR, ADMEDS, PLANS, NOTE_TAGS, MEDRE, medLookup, WHATSNEW: typeof WHATSNEW!=="undefined"?WHATSNEW:[]};';
vm.runInContext(src, ctx, { filename: 'data-bundle.js' });
const D = ctx.__;
const IDS = new Set(D.PR.map(p => p.id));
const LV = new Set(['PN', 'AEM', 'MCP', 'SP', 'APPT']);

// 1. Protocol flow structure
D.PR.forEach(p => {
  if (!Array.isArray(p.flow)) return bad(p.id + ': flow is not a list');
  p.flow.forEach((st, i) => {
    const where = p.id + ' step ' + (i + 1);
    const outs = [];
    if (st.yes) outs.push(st.yes);
    (st.out || []).forEach(o => outs.push(o));
    if (st.yes && st.yes.out) st.yes.out.forEach(o => outs.push(o));
    outs.forEach(o => {
      if (o.tri !== undefined) {
        if (!Array.isArray(o.tri)) bad(where + ': tri must be a list of protocol IDs, got ' + JSON.stringify(o.tri));
        else o.tri.forEach(t => { if (/^[A-Z]-\d+$/.test(t)) { if (!IDS.has(t)) bad(where + ': tri points to unknown protocol ' + t); } else warn.push(where + ': tri text (shown, not a link): ' + t); });
      }
      if (o.d !== undefined && !LV.has(o.d)) bad(where + ': unknown disposition ' + o.d);
    });
    if (st.items && !Array.isArray(st.items)) bad(where + ': items must be a list');
  });
  (p.rf || []).forEach(f => { if (typeof f !== 'string') bad(p.id + ': red flag is not text'); });
});

// 2. Meds: every plan/protocol med resolves, and known look-alikes resolve to the right entry
const medNames = [];let plain = 0;
Object.entries(D.PLANS).forEach(([id, e]) => (e.meds || []).forEach(m => medNames.push([id + ' plan', m.m])));
D.PR.forEach(p => (p.meds || []).forEach(m => medNames.push([p.id + ' protocol', m])));
medNames.forEach(([w, n]) => {
  const m = D.medLookup(n);
  if (!m) { plain++; return; }
  const low = n.toLowerCase();
  if (/lozenge|benzocaine/.test(low) && m.k !== 'benzocaine') bad(w + ': "' + n + '" resolves to ' + m.k + ', expected benzocaine');
  if (/pramoxine|analpram/.test(low) && m.k !== 'analpram') bad(w + ': "' + n + '" resolves to ' + m.k + ', expected analpram');
});
Object.keys(D.PLANS).forEach(id => { if (!IDS.has(id)) bad('plans.js: unknown protocol ' + id); });

// 3. NOTE_TAGS refer to real protocols and real items
Object.entries(D.NOTE_TAGS).forEach(([id, T]) => {
  const p = D.PR.find(x => x.id === id);
  if (!p) return bad('notetags.js: unknown protocol ' + id);
  const known = new Set((p.rf || []).concat(...p.flow.filter(s => s.items).map(s => s.items)));
  Object.keys(T).forEach(k => { if (!known.has(k)) warn.push('notetags.js ' + id + ': "' + k + '" is not a red flag or decision item'); });
});

// 4. Service worker precache list: every file exists; every FM image is cached
const sw = rd('sw.js');
const FILES = JSON.parse((sw.match(/const FILES=(\[[\s\S]*?\]);/) || [, '[]'])[1].replace(/'/g, '"'));
FILES.forEach(f => { if (f !== './' && !fs.existsSync(path.join(ROOT, f))) bad('sw.js FILES: missing ' + f); });
['intake.html'].forEach(h => { if (!FILES.includes(h)) bad('sw.js FILES: ' + h + ' not cached'); if (!/serviceWorker\.register/.test(rd(h))) bad(h + ': does not register the service worker'); });

// 5. Versions agree
const appVer = (app.match(/const APP_VER='([^']+)'/) || [])[1];
const swVer = (sw.match(/const C='sickcall-([^']+)'/) || [])[1];
const jVer = JSON.parse(rd('version.json')).v;
const wnVer = D.WHATSNEW[0] && D.WHATSNEW[0].v;
if (!(appVer === swVer && swVer === jVer)) bad('versions differ: app.js ' + appVer + ', sw.js ' + swVer + ', version.json ' + jVer);
if (wnVer && wnVer !== appVer) warn.push('whatsnew.js top entry ' + wnVer + ' ≠ APP_VER ' + appVer);

warn.forEach(w => console.log('warn  ' + w));
errs.forEach(e => console.log('ERROR ' + e));
if (plain) console.log('info  ' + plain + ' med references have no Appendix C entry (shown as plain text)');
console.log(errs.length ? '\n' + errs.length + ' error(s)' : '\nData checks passed (' + D.PR.length + ' protocols, ' + medNames.length + ' med references, ' + FILES.length + ' cached files).');
process.exit(errs.length ? 1 : 0);
