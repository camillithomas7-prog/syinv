const A = window.INV_A || '';

(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const mobile = matchMedia('(max-width:700px)').matches;
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

/* marquee temi e buste */
const T = [['amalfi','Terrazza di Amalfi'],['chiesa','Navata in chiesa'],['sicilia','Terrazza in Sicilia'],['como','Villa sul Lago'],['toscana','Castello in Toscana'],['vigneto','Cena nel vigneto'],['giardino',"Giardino all'italiana"],['glicine','Pergola di glicine'],['puglia','Masseria in Puglia'],['mare','Altare sul mare'],['capri','Capri in barca'],['boho','Boho al tramonto'],['venezia','Palazzo a Venezia'],['serra','Serra di cristallo'],['dolomiti','Chalet nelle Dolomiti'],['inverno','Inverno incantato'],['parigi','Balcone a Parigi'],['santorini','Cupole di Santorini'],['lavanda','Lavanda in Provenza'],['marrakech','Riad a Marrakech'],['bosco','Bosco fatato'],['roma','Terrazza su Roma'],['ciliegi','Giardino dei ciliegi'],['reggia','Salone della Reggia']];
const E = [['ricamo','Ricamo di fiori'],['salvia','Salvia ed eucalipto'],['notte','Notte stellata'],['amalfi','Limoni di Amalfi'],['peonie','Peonie cipria'],['pizzo','Pizzo chantilly'],['marmo','Marmo e oro'],['glicine','Glicine'],['bordeaux','Velluto bordeaux'],['uliveto','Uliveto'],['riviera','Riviera'],['pampas','Boho pampas'],['rose-bianche','Rose bianche'],['vigneto','Colline toscane'],['inverno',"Giardino d'inverno"],['art-deco','Art déco']];
const fig = (p, [id, n]) => `<figure><img src="${A}${p}-${id}.webp" alt="${n}" loading="lazy"><figcaption>${n}</figcaption></figure>`;
$('#mq1').innerHTML = (T.map(t => fig('t', t)).join('')).repeat(2);
$('#mq2').innerHTML = (E.map(e => fig('e', e)).join('')).repeat(2);
$('#mq2').querySelectorAll('figure').forEach(f => f.style.aspectRatio = '1/1');

/* acquisto diretto */
$$('[data-checkout]').forEach(a => a.addEventListener('click', e => {
  const f = document.getElementById('inv-atc'); if (!f) return;
  e.preventDefault(); a.classList.add('busy'); f.submit();
}));
/* header */
addEventListener('scroll', () => {
  $('#hdr').classList.toggle('sc', scrollY > 10);
  const pr = $('#prezzo').getBoundingClientRect();
  $('#sticky').classList.toggle('show', scrollY > 700 && !(pr.top < innerHeight && pr.bottom > 0));
}, { passive: true });

/* scena 3D hero: scala intera la composizione 640x600 sulla larghezza disponibile */
const sb = $('#stageBox');
const fit = () => sb.style.setProperty('--s', Math.min(1, sb.clientWidth / (innerWidth > 1020 ? 640 : 720)));
fit(); addEventListener('resize', fit);
/* scena 3D hero: segue il mouse (o il giroscopio) */
const scene = $('#scene');
let tx = 0, ty = 0, cx = 0, cy = 0;
addEventListener('pointermove', e => { tx = (e.clientX / innerWidth - .5); ty = (e.clientY / innerHeight - .5); });
addEventListener('deviceorientation', e => { if (e.gamma != null) { tx = Math.max(-.5, Math.min(.5, e.gamma / 60)); ty = Math.max(-.5, Math.min(.5, (e.beta - 45) / 60)); } });
(function loop() {
  cx += (tx - cx) * .06; cy += (ty - cy) * .06;
  const s = Math.min(scrollY / 700, 1);
  scene.style.transform = `rotateY(${cx * 14 - s * 8}deg) rotateX(${-cy * 10 + s * 10}deg) translateY(${s * 40}px)`;
  requestAnimationFrame(loop);
})();

/* petali e luci dorate nella hero */
const cv = $('#petals'), ctx = cv.getContext('2d');
const dpr = Math.min(devicePixelRatio || 1, 1.5);
let W, H, P = [];
function size() { W = cv.offsetWidth; H = cv.offsetHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
size(); addEventListener('resize', size);
const spr = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,236,190,1)'); r.addColorStop(.3, 'rgba(214,180,110,.55)'); r.addColorStop(1, 'rgba(214,180,110,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64); return c; })();
const pet = (() => { const c = document.createElement('canvas'); c.width = 40; c.height = 40; const g = c.getContext('2d');
  g.translate(20, 20); g.fillStyle = '#e9b9bf'; g.beginPath(); g.moveTo(0, -16); g.bezierCurveTo(14, -10, 12, 10, 0, 16); g.bezierCurveTo(-12, 10, -14, -10, 0, -16); g.fill();
  g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(-3, -4, 3, 8, .3, 0, 7); g.fill(); return c; })();
for (let i = 0; i < (mobile ? 22 : 46); i++) P.push({ x: Math.random(), y: Math.random(), z: Math.random(), t: Math.random() * 6, k: Math.random() < .45 ? 'p' : 'g' });
function draw(ts) {
  ctx.clearRect(0, 0, W, H);
  for (const p of P) {
    p.t += .01; p.y += (p.k === 'p' ? .0009 : -.0003) * (0.5 + p.z);
    p.x += Math.sin(p.t) * .0006;
    if (p.y > 1.05) p.y = -.05; if (p.y < -.05) p.y = 1.05;
    const x = p.x * W + cx * 40 * p.z, y = p.y * H + cy * 30 * p.z;
    if (p.k === 'g') { const s = 10 + p.z * 26; ctx.globalAlpha = .4 + .4 * Math.sin(p.t * 2) ** 2; ctx.drawImage(spr, x - s / 2, y - s / 2, s, s); }
    else { const s = 8 + p.z * 12; ctx.globalAlpha = .55 + p.z * .3; ctx.save(); ctx.translate(x, y); ctx.rotate(p.t); ctx.scale(1, Math.abs(Math.cos(p.t * 1.3)) * .8 + .2); ctx.drawImage(pet, -s / 2, -s / 2, s, s); ctx.restore(); }
  }
  ctx.globalAlpha = 1;
  if (!reduce) requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

/* busta interattiva */
const vid = $('#envVid'), envL = $('#envLayer'), tap = $('#tapBtn');
let cur = 'riviera';
function openEnv() {
  tap.style.display = 'none';
  vid.currentTime = 0; vid.playbackRate = 1.2; vid.play().catch(() => {});
  const done = () => envL.classList.add('hide');
  vid.onended = done; setTimeout(() => { if (!envL.classList.contains('hide')) done(); }, 4200);
}
function resetEnv(e) {
  cur = e; vid.src = `${A}env-${e}.mp4`; vid.poster = `${A}e-${e}.webp`;
  envL.classList.remove('hide'); tap.style.display = '';
}
tap.onclick = openEnv; envL.onclick = e => { if (e.target !== tap && tap.style.display !== 'none') openEnv(); };
$('#envPick').onclick = e => { const b = e.target.closest('button'); if (!b) return;
  $$('#envPick button').forEach(x => x.classList.toggle('on', x === b)); resetEnv(b.dataset.e); setTimeout(openEnv, 300); };

/* showcase schede */
const S = [
  ['theme', 'Tema', 'Scegliete il vostro video', '24 ambientazioni cinematografiche, da Amalfi alla Reggia. Passate sopra una card per vederla muoversi.'],
  ['envelope', 'Busta', "L'apertura della busta", "16 buste pronte con video di apertura, o la vostra busta personalizzata con iniziali e sigillo in ceralacca."],
  ['details', 'Dettagli', 'Nomi, data e stile', 'Scrivete i vostri nomi e trascinateli nel punto del video dove si leggono meglio.'],
  ['blocks', 'Blocchi', 'Costruite il vostro invito', 'Storia, countdown, luogo, programma, galleria, lista nozze: 16 blocchi da accendere, spegnere e riordinare.'],
  ['guests', 'Ospiti e RSVP', 'Chi viene, in quanti, cosa mangia', 'Ogni risposta arriva da sola: persone, allergie, messaggi e canzoni. Invio e promemoria su WhatsApp con un tocco.'],
  ['languages', 'Lingue', "57 lingue per gli ospiti dall'estero", "Testi, date e modulo RSVP tradotti in automatico. L'ospite sceglie la lingua in alto a destra."],
  ['tools', 'Pianificazione', 'Budget, checklist e tavoli', "Il budget con il grafico delle spese, la checklist mese per mese e la disposizione dei tavoli da stampare."],
  ['album', 'Album foto', 'Tutte le foto della festa', 'Stampate il cartoncino col QR: gli ospiti caricano foto e video e voi li trovate tutti in un unico archivio.'],
];
const M = { theme: 'm-theme', envelope: 'm-envelope', details: 'm-details', blocks: 'm-blocks', guests: 'm-guests2', languages: 'm-languages', tools: 'm-tools', album: 'm-album' };
$('#tabs').innerHTML = S.map(([k, l], i) => `<button type="button" data-k="${k}" class="${i ? '' : 'on'}">${l}</button>`).join('');
$('#bView').innerHTML = S.map(([k], i) => `<img src="${A}d-${k}.webp" data-k="${k}" class="${i ? '' : 'on'}" alt="Scheda ${k} del pannello" loading="lazy">`).join('');
$('#pView').innerHTML = [...new Set(Object.values(M))].map(m => `<img src="${A}${m}.webp" data-m="${m}" alt="" loading="lazy">`).join('');
let si = 0, sTimer;
function showTab(i, user) {
  si = i; const [k, , h, p] = S[i];
  $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.k === k));
  $$('#bView img').forEach(im => im.classList.toggle('on', im.dataset.k === k));
  $$('#pView img').forEach(im => im.classList.toggle('on', im.dataset.m === M[k]));
  $('#sDesc h3').textContent = h; $('#sDesc p').textContent = p;
  clearInterval(sTimer); sTimer = setInterval(() => showTab((si + 1) % S.length), user ? 9000 : 4500);
}
$('#tabs').onclick = e => { const b = e.target.closest('button'); if (b) showTab(S.findIndex(s => s[0] === b.dataset.k), true); };
showTab(0);

/* tilt 3D su card */
if (!mobile) $$('.fc,.pcard').forEach(el => {
  el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`; });
  el.addEventListener('pointerleave', () => el.style.transform = '');
});

if (!window.gsap) { $$('.rv').forEach(e => e.style.cssText = 'opacity:1;transform:none'); return; }
gsap.registerPlugin(ScrollTrigger);

/* entrata hero */
gsap.from('.hero h1 .l span', { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: .12, delay: .1 });
gsap.from('.h-in', { y: 24, opacity: 0, duration: .9, ease: 'power3.out', stagger: .1, delay: .35 });
gsap.from('.laptop', { opacity: 0, y: 80, rotateX: 30, duration: 1.4, ease: 'power3.out', delay: .2 });
gsap.from('.ph-a', { opacity: 0, y: 140, duration: 1.3, ease: 'power3.out', delay: .5 });
gsap.from('.ph-b', { opacity: 0, x: 80, duration: 1.3, ease: 'power3.out', delay: .65 });
gsap.from('.seal3d,.hero .badge3d', { opacity: 0, scale: .6, duration: .9, ease: 'back.out(1.8)', stagger: .15, delay: 1 });

/* reveal */
$$('.rv').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));

/* contatori */
$$('[data-n]').forEach(el => { const n = +el.dataset.n, o = { v: 0 };
  ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: n, duration: 1.8, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v) }) }); });

/* tre schermi: sezione fissata, i dispositivi si trasformano scorrendo */
const dv = $$('.dv'), s3 = $$('.s3');
gsap.set(dv[0], { opacity: 1 });
gsap.set(dv[1], { rotateY: 70, z: -300 }); gsap.set(dv[2], { rotateY: 70, z: -300 });
const tl = gsap.timeline({ scrollTrigger: { trigger: '#pin3', start: mobile ? 'top 70px' : 'center center', end: '+=2400', pin: true, scrub: .8,
  onUpdate: st => { const p = st.progress, i = p < .36 ? 0 : p < .7 ? 1 : 2;
    s3.forEach((s, k) => { s.classList.toggle('on', k === i); s.querySelector('.bar i').style.width = (k < i ? 100 : k > i ? 0 : ((p - [0, .36, .7][i]) / [.36, .34, .3][i]) * 100) + '%'; }); } } });
tl.to(dv[0], { rotateY: -70, z: -300, opacity: 0, duration: 1, ease: 'power2.in' }, 1)
  .to(dv[1], { rotateY: 0, z: 0, opacity: 1, duration: 1, ease: 'power2.out' }, 1.6)
  .to(dv[1], { rotateY: -70, z: -300, opacity: 0, duration: 1, ease: 'power2.in' }, 3)
  .to(dv[2], { rotateY: 0, z: 0, opacity: 1, duration: 1, ease: 'power2.out' }, 3.6)
  .to('.dv.d3 .splash', { clipPath: 'circle(150% at 37% 31%)', duration: .7, ease: 'power2.in' }, 4.7)
  .to('.dv.d3 .appview', { opacity: 1, duration: .5 }, 5.5)
  .to({}, { duration: .6 });
s3.forEach((s, k) => s.onclick = () => { const st = tl.scrollTrigger; scrollTo({ top: st.start + (st.end - st.start) * [.05, .5, .97][k], behavior: 'smooth' }); });

/* parallasse showcase */
gsap.fromTo('.browser', { rotateX: 18, y: 60 }, { rotateX: 0, y: 0, ease: 'none', scrollTrigger: { trigger: '.show-stage', start: 'top bottom', end: 'center center', scrub: true } });

/* busta: si apre da sola la prima volta che entra a schermo */
ScrollTrigger.create({ trigger: '#envPh', start: 'top 55%', once: true, onEnter: () => setTimeout(openEnv, 600) });
})();
