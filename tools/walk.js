// Walk every ADTMC protocol in a real browser and fail on any JavaScript error or broken note.
// Recorre cada protocolo en un navegador real y falla si hay un error de JavaScript o una nota rota.
// Needs Playwright:  npm i playwright && npx playwright install chromium   then:  node tools/walk.js
'use strict';
const path = require('path');
const { chromium } = require('playwright');
const URL = 'file://' + path.join(__dirname, '..', 'index.html');
(async () => {
  const b = await chromium.launch();
  const errs = [];
  let p;
  const open = async () => {
    if (p) await p.close();
    p = await b.newPage();
    p.on('pageerror', e => errs.push('pageerror: ' + e.message));
    await p.goto(URL);
    await p.waitForTimeout(600);
    await p.evaluate(() => { try { wnDone(); } catch (e) {} try { const l = document.getElementById('lock'); if (l) l.style.display = 'none'; } catch (e) {} });
  };
  await open();
  const ids = await p.evaluate(() => PR.map(x => x.id));
  let walks = 0;
  for (let k = 0; k < ids.length; k++) {
    if (k % 12 === 0) await open();
    const r = await p.evaluate(id => {
      const P = getP(id), bad = []; let n = 0;
      const dpIdx = P.flow.map((s, i) => s.items ? i : -1).filter(i => i >= 0);
      // Paths: all "None", then YES on each item of each decision point (one at a time), each with M and F.
      const paths = [{ dp: -1, it: -1 }];
      dpIdx.forEach(i => P.flow[i].items.forEach((_, j) => paths.push({ dp: i, it: j })));
      for (const sex of ['M', 'F']) for (const pa of paths) {
        try {
          resetAll(); tabGo('adtmc'); adOpen(id); gfSex(sex); adRfAll();
          for (const i of dpIdx) {
            if (i === pa.dp) { adDPTog(i, pa.it); const st = P.flow[i]; if (st.yes && st.yes.out) adOut(i, 0); break; }
            adDPNone(i, true);
          }
          P.flow.forEach((st, i) => { if (st.ex !== undefined && st.out && st.out.length && ad.out['x' + i] === undefined) { ad.out['x' + i] = 0; } });
          renderMain(); renderNote();
          const tx = document.getElementById('note').textContent;
          n++;
          if (/undefined|NaN|\[object/.test(tx)) bad.push(id + ' ' + sex + ' dp' + pa.dp + '/' + pa.it + ': ' + tx.slice(0, 160));
        } catch (e) { bad.push(id + ' ' + sex + ' dp' + pa.dp + '/' + pa.it + ' ERROR ' + e.message); }
      }
      return { n, bad };
    }, ids[k]);
    walks += r.n; errs.push(...r.bad);
  }
  // Reload with a saved case must not blank the app.
  await p.evaluate(() => { resetAll(); adOpen('C-7'); adDPNone(0); adDPNone(1); adDPTog(2, 0); renderNote(); });
  await p.reload(); await p.waitForTimeout(600);
  const ok = await p.evaluate(() => document.getElementById('main').innerHTML.length > 200);
  if (!ok) errs.push('reload with saved C-7 case left a blank screen');
  await b.close();
  errs.forEach(e => console.log('ERROR ' + e));
  console.log(errs.length ? '\n' + errs.length + ' problem(s) in ' + walks + ' walks' : 'Walked ' + ids.length + ' protocols, ' + walks + ' paths — no errors.');
  process.exit(errs.length ? 1 : 0);
})();
