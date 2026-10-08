/* Carrello Invitelle: pannello (drawer / bottom sheet) + pagina /cart, entrambi disegnati da qui.
   Su Shopify usa /cart.js, /cart/add.js, /cart/change.js. In locale (localhost) usa un carrello finto. */
window.InvCart = (() => {
  const A = window.INV_A || 'img/';
  const ROOT = (window.Shopify && Shopify.routes && Shopify.routes.root) || '/';
  const MOCK = !window.Shopify && /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const $ = (s, r = document) => r.querySelector(s);

  /* ---------- API ---------- */
  const MP = { id: 1, title: 'Invitelle · Pacchetto completo invito di nozze digitale', price: 2999, image: A + 'product-invitelle.jpg' };
  const mockGet = () => { try { return JSON.parse(sessionStorage.getItem('inv-mock-cart')) || []; } catch (e) { return []; } };
  const mockSet = l => { try { sessionStorage.setItem('inv-mock-cart', JSON.stringify(l)); } catch (e) {} };
  const mockCart = () => {
    const items = mockGet().map(i => ({ key: 'k' + i.id, id: i.id, quantity: i.quantity, product_title: MP.title, title: MP.title, image: MP.image, url: '#',
      final_price: MP.price, final_line_price: MP.price * i.quantity, original_line_price: MP.price * i.quantity }));
    const total = items.reduce((s, i) => s + i.final_line_price, 0);
    return { items, item_count: items.reduce((s, i) => s + i.quantity, 0), total_price: total, original_total_price: total, total_discount: 0, currency: 'EUR' };
  };
  const json = (url, body) => fetch(ROOT.replace(/\/$/, '') + url, body ? { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) } : { headers: { Accept: 'application/json' } })
    .then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e)));
  const api = {
    get: () => MOCK ? Promise.resolve(mockCart()) : json('/cart.js'),
    add: (id, q = 1) => {
      if (MOCK) { const l = mockGet(); const it = l.find(i => i.id === MP.id); it ? it.quantity += q : l.push({ id: MP.id, quantity: q }); mockSet(l); return Promise.resolve(); }
      return json('/cart/add.js', { items: [{ id: +id, quantity: q }] });
    },
    change: (key, q) => {
      if (MOCK) { mockSet(mockGet().map(i => 'k' + i.id === key ? { ...i, quantity: q } : i).filter(i => i.quantity > 0)); return Promise.resolve(mockCart()); }
      return json('/cart/change.js', { id: key, quantity: q });
    },
  };

  /* ---------- formattazione ---------- */
  let cur = 'EUR';
  const money = c => new Intl.NumberFormat('it-IT', { style: 'currency', currency: cur }).format(c / 100);
  const img = (src, w) => !src ? A + 'product-invitelle.jpg' : (MOCK || !/cdn\.shopify|\/cdn\/shop/.test(src) ? src : src.replace(/(\.[a-z]+)(\?|$)/i, `_${w}x${w}_crop_center$1$2`));
  const I = {
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    infinity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18.2 8.2a5 5 0 1 1 0 7.6L12 12l-6.2-3.8a5 5 0 1 0 0 7.6L12 12z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" opacity=".35"/><path class="ck" d="M7.5 12.5l3 3 6-6.5"/></svg>',
  };
  const INC = ['24 temi video e 16 buste animate', 'RSVP con allergie e canzoni', 'Ospiti e invio su WhatsApp', '57 lingue', 'Budget, checklist e tavoli', 'Album foto con QR', 'Computer, telefono e app', 'Modifiche illimitate'];

  const payIcons = () => {
    const p = $('#inv-pay');
    if (p && p.children.length) return p.innerHTML;
    return ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay'].map(n => `<i>${n}</i>`).join('');
  };
  const itemHTML = it => `
    <div class="ic-item" data-key="${it.key}">
      <img src="${img(it.image, 240)}" alt="" width="120" height="120" loading="lazy">
      <div>
        <div class="t">${it.product_title}</div>
        <div class="s">${I.bolt}Prodotto digitale · niente spedizione</div>
        <div class="row">
          <div class="ic-qty"><button type="button" data-q="-1" aria-label="Diminuisci">${I.minus}</button><span>${it.quantity}</span><button type="button" data-q="1" aria-label="Aumenta">${I.plus}</button></div>
          <div class="pr">${it.original_line_price > it.final_line_price ? `<s>${money(it.original_line_price)}</s>` : ''}${money(it.final_line_price)}</div>
        </div>
      </div>
      <button type="button" class="ic-rm" data-rm aria-label="Rimuovi">${I.trash}</button>
    </div>`;
  const incHTML = () => `<div class="ic-box"><h4>Incluso nel pacchetto</h4><ul class="ic-inc">${INC.map(t => `<li>${I.check}${t}</li>`).join('')}</ul></div>`;
  const delivHTML = () => `<div class="ic-box ic-deliv"><span class="ico">${I.mail}</span><div><b>Consegna via email</b><span>Dopo il pagamento ricevete il vostro codice personale per entrare nel pannello.</span></div></div>`;
  const sumHTML = (c, noTot) => `
    <div class="ic-sum">
      <div class="l"><span>Subtotale</span><span>${money(c.original_total_price || c.total_price)}</span></div>
      ${c.total_discount ? `<div class="l free"><span>Sconto</span><b>−${money(c.total_discount)}</b></div>` : ''}
      <div class="l free"><span>Spedizione</span><b>Non serve</b></div>
      ${noTot ? '' : `<div class="tot"><span>Totale</span><b>${money(c.total_price)}<small>IVA inclusa · pagamento unico</small></b></div>`}
    </div>`;
  const trustHTML = () => `<div class="ic-trust"><span>${I.lock}Pagamento sicuro SSL</span><span>${I.shield}Dati protetti</span><span>${I.infinity}Nessun abbonamento</span></div><div class="ic-pay">${payIcons()}</div>`;
  const emptyHTML = btn => `<div class="ic-empty"><img class="seal" src="${A}rosso.png" alt=""><h3>Il carrello è vuoto</h3><p>Il vostro invito di nozze digitale vi aspetta: temi video, busta con ceralacca, RSVP e ospiti su WhatsApp.</p>${btn}</div>`;
  const checkoutBtn = (label = 'Vai al pagamento sicuro') => `<button type="button" class="ic-btn" data-go>${I.lock}<span>${label}</span></button>`;

  /* ---------- azioni comuni ---------- */
  let cart = null, busy = false;
  const toast = t => { let el = $('.ic-toast'); if (!el) { el = document.createElement('div'); el.className = 'ic-toast'; document.body.appendChild(el); }
    el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 2600); };
  function go(btn) {
    btn && btn.classList.add('busy');
    if (MOCK) { setTimeout(() => { btn && btn.classList.remove('busy'); toast('Anteprima locale: qui si apre il checkout Shopify'); }, 700); return; }
    location.href = ROOT.replace(/\/$/, '') + '/checkout';
  }
  function bind(root, after) {
    root.addEventListener('click', e => {
      const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]'), g = e.target.closest('[data-go]');
      if (g) return go(g);
      if (!(q || rm) || busy) return;
      const row = e.target.closest('.ic-item'), key = row.dataset.key;
      const it = cart.items.find(i => i.key === key);
      const nq = rm ? 0 : Math.max(0, it.quantity + +q.dataset.q);
      busy = true; row.classList.add('out');
      api.change(key, nq).then(c => { cart = c; busy = false; after(); badge(); }).catch(() => { busy = false; row.classList.remove('out'); toast('Qualcosa è andato storto, riprova'); });
    });
  }
  function badge() {
    document.querySelectorAll('[data-cart-count]').forEach(b => { b.textContent = cart ? cart.item_count : 0; b.hidden = !cart || !cart.item_count; });
  }

  /* ---------- pannello ---------- */
  let dr, justAdded = false;
  function ensureDrawer() {
    if (dr) return dr;
    const w = document.createElement('div');
    w.className = 'ic'; w.id = 'ic-drawer';
    w.innerHTML = `<div class="ic-ov" data-close></div><aside class="ic-dr" role="dialog" aria-modal="true" aria-label="Carrello"><span class="grab"></span>
      <div class="hd"><h2>Il tuo carrello</h2><span class="n"></span><button type="button" class="x" data-close aria-label="Chiudi">${I.x}</button></div>
      <div class="bd"></div><div class="ft"></div></aside>`;
    document.body.appendChild(w);
    w.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    bind(w, drawRender);
    // su telefono: trascina in basso per chiudere
    const sheet = $('.ic-dr', w); let y0 = null, dy = 0;
    sheet.addEventListener('touchstart', e => { if ($('.bd', w).scrollTop > 0 && !e.target.closest('.hd,.grab')) return; y0 = e.touches[0].clientY; dy = 0; }, { passive: true });
    sheet.addEventListener('touchmove', e => { if (y0 == null) return; dy = Math.max(0, e.touches[0].clientY - y0); if (dy > 0 && innerWidth <= 640) { sheet.style.transition = 'none'; sheet.style.transform = `translateY(${dy}px)`; } }, { passive: true });
    sheet.addEventListener('touchend', () => { if (y0 == null) return; sheet.style.transition = ''; sheet.style.transform = ''; if (dy > 110 && innerWidth <= 640) close(); y0 = null; });
    return dr = w;
  }
  function drawRender() {
    const w = ensureDrawer(), c = cart;
    $('.n', w).textContent = c.item_count ? `${c.item_count} ${c.item_count === 1 ? 'articolo' : 'articoli'}` : '';
    if (!c.item_count) {
      $('.bd', w).innerHTML = emptyHTML('<button type="button" class="ic-btn" data-close><span>Scopri Invitelle</span></button>');
      $('.ft', w).innerHTML = ''; $('.ft', w).hidden = true; return;
    }
    $('.ft', w).hidden = false;
    $('.bd', w).innerHTML = (justAdded ? `<div class="ic-added">${I.ok}Aggiunto al carrello</div>` : '') + c.items.map(itemHTML).join('') + delivHTML()
      + `<div class="ic-box">${sumHTML(c, true)}</div>` + incHTML() + trustHTML() + `<button type="button" class="ic-link cont" data-close>Continua a guardare</button>`;
    $('.ft', w).innerHTML = `<div class="ft-tot"><span>Totale</span><b>${money(c.total_price)}</b></div>` + checkoutBtn() + `<div class="ft-note">${I.lock}Pagamento sicuro · codice via email</div>`;
    justAdded = false;
  }
  function open() {
    ensureDrawer();
    const show = () => { drawRender(); requestAnimationFrame(() => { dr.classList.add('ic-open'); document.body.classList.add('ic-lock'); }); };
    cart ? show() : api.get().then(c => { cart = c; cur = c.currency || cur; show(); });
  }
  function close() { if (!dr) return; dr.classList.remove('ic-open'); document.body.classList.remove('ic-lock'); }
  function add(id, btn) {
    btn && btn.classList.add('busy');
    return api.add(id, 1).then(api.get).then(c => { cart = c; cur = c.currency || cur; justAdded = true; badge(); open(); })
      .catch(e => toast((e && e.description) || 'Non è stato possibile aggiungere al carrello'))
      .finally(() => btn && btn.classList.remove('busy'));
  }

  /* ---------- pagina /cart ---------- */
  function page(el) {
    const back = el.dataset.home || ROOT;
    const render = () => {
      const c = cart;
      if (!c.item_count) { el.innerHTML = `<div class="icp-main">${emptyHTML(`<a class="ic-btn" href="${back}#prezzo"><span>Scopri Invitelle</span></a>`)}</div>`; return; }
      el.innerHTML = `<div class="icp-main">
        <a class="icp-back" href="${back}">${I.back}Continua a guardare</a>
        <div class="icp-title"><h2>Il tuo carrello</h2><span>${c.item_count} ${c.item_count === 1 ? 'articolo' : 'articoli'}</span></div>
        <div class="icp-steps"><span class="st on"><i>1</i><b>Carrello</b></span><span class="ln"></span><span class="st"><i>2</i><b>Pagamento</b></span><span class="ln"></span><span class="st"><i>3</i><b>Codice via email</b></span></div>
        <div class="icp-grid">
          <div class="icp-left">
            ${c.items.map(itemHTML).join('')}
            <div class="icp-next">
              <div><em>01</em><b>Pagamento sicuro</b><span>Carta, Apple Pay o Google Pay, in un minuto.</span></div>
              <div><em>02</em><b>Codice via email</b><span>Ricevete il vostro codice personale per entrare nel pannello.</span></div>
              <div><em>03</em><b>Create l'invito</b><span>Da computer, telefono o come app, con modifiche illimitate.</span></div>
            </div>
            ${incHTML()}
          </div>
          <aside class="icp-card">
            <h3>Riepilogo</h3>
            ${sumHTML(c)}
            <div style="margin-top:18px">${checkoutBtn()}</div>
            ${trustHTML()}
            <div class="icp-help">Domande? Scriveteci a <a href="mailto:invitellesupport@gmail.com">invitellesupport@gmail.com</a></div>
          </aside>
        </div>
      </div>
      <div class="icp-bar"><div class="tt">Totale<b>${money(c.total_price)}</b></div>${checkoutBtn('Vai al pagamento')}</div>`;
    };
    bind(el, render);
    const pre = $('#inv-cart-data');
    const start = c => { cart = c; cur = c.currency || cur; render(); badge(); };
    if (pre && !MOCK) { try { return start(JSON.parse(pre.textContent)); } catch (e) {} }
    api.get().then(start);
  }

  /* ---------- avvio ---------- */
  document.addEventListener('click', e => { const o = e.target.closest('[data-cart-open]'); if (o) { e.preventDefault(); open(); } });
  document.addEventListener('DOMContentLoaded', () => {
    const p = $('#inv-cart-page'); if (p) return page(p);
    api.get().then(c => { cart = c; cur = c.currency || cur; badge(); }).catch(() => {});
  });
  return { add, open, close };
})();
