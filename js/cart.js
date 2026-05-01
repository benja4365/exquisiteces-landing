// 🛒 CARRITO — Exquisiteces
import { REGLAS, DATOS_PAGO } from './config.js';
import { crearPedido } from './supabase-client.js';

const KEY = 'exq_cart_v1';
const HISTORY_KEY = 'exq_cart_history_v1';
const PEDIDO_ACTIVO_KEY = 'exq_pedido_activo';

let listeners = [];
const formatPrice = n => '$' + n.toLocaleString('es-AR');

// ── ESTADO ──────────────────────────────────
function leerCarrito() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function guardarCarrito(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  notificar();
}
function pushHistory(items) {
  const h = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  h.push(items);
  if (h.length > 10) h.shift();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
}
function popHistory() {
  const h = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  const last = h.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
  return last;
}

// ── API ────────────────────────────────────
export const cart = {
  items: () => leerCarrito(),
  count: () => leerCarrito().reduce((s, i) => s + i.cantidad, 0),
  totales() {
    const items = leerCarrito();
    const totalUnits = items.reduce((s, i) => s + i.cantidad, 0);
    const subtotalBruto = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const usaDescuentoMonto = subtotalBruto >= REGLAS.descuento_monto_minimo;
    const usaDescuentoUnidades = totalUnits >= REGLAS.desde_descuento;
    const usaDescuento = usaDescuentoMonto || usaDescuentoUnidades;
    let subtotal;
    if (usaDescuentoMonto) {
      subtotal = Math.round(subtotalBruto * (1 - REGLAS.descuento_porcentaje));
    } else if (usaDescuentoUnidades) {
      subtotal = items.reduce((s, i) => s + (i.precio_30 || i.precio) * i.cantidad, 0);
    } else {
      subtotal = subtotalBruto;
    }
    return { totalUnits, usaDescuento, usaDescuentoMonto, usaDescuentoUnidades, subtotalBruto, subtotal, total: subtotal, alcanzaMinimo: totalUnits >= REGLAS.minimo_unidades };
  },
  agregar(producto, cantidad = 1) {
    const items = leerCarrito();
    pushHistory([...items]);
    const idx = items.findIndex(i => i.id === producto.id);
    if (idx >= 0) items[idx].cantidad += cantidad;
    else items.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, precio_30: producto.precio_30, imagen: producto.imagen, cantidad });
    guardarCarrito(items);
    flashCart();
  },
  setCantidad(id, cantidad) {
    const items = leerCarrito();
    pushHistory([...items]);
    const idx = items.findIndex(i => i.id === id);
    if (idx < 0) return;
    if (cantidad <= 0) items.splice(idx, 1);
    else items[idx].cantidad = cantidad;
    guardarCarrito(items);
  },
  remover(id) { this.setCantidad(id, 0); },
  vaciar() {
    pushHistory(leerCarrito());
    guardarCarrito([]);
  },
  deshacer() {
    const last = popHistory();
    if (last) { localStorage.setItem(KEY, JSON.stringify(last)); notificar(); return true; }
    return false;
  },
  onChange(fn) { listeners.push(fn); return () => listeners = listeners.filter(l => l !== fn); }
};

function notificar() { listeners.forEach(fn => fn(leerCarrito())); }

function flashCart() {
  const btn = document.getElementById('cart-fab');
  if (!btn) return;
  btn.classList.add('cart-pulse');
  setTimeout(() => btn.classList.remove('cart-pulse'), 600);
}

// ── PEDIDO ACTIVO ──────────────────────────
export const pedidoActivo = {
  set(id) { localStorage.setItem(PEDIDO_ACTIVO_KEY, id); },
  get() { return localStorage.getItem(PEDIDO_ACTIVO_KEY); },
  clear() { localStorage.removeItem(PEDIDO_ACTIVO_KEY); }
};

// ── UI ────────────────────────────────────
export function montarCarritoUI() {
  if (document.getElementById('cart-fab')) return;

  const fab = document.createElement('div');
  fab.className = 'cart-fab-wrap';
  fab.innerHTML = `
    <button id="cart-undo" class="cart-undo" aria-label="Deshacer última acción" title="Deshacer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 7v6h6"/><path d="M3 13a9 9 0 1 0 3-7"/>
      </svg>
    </button>
    <button id="cart-fab" class="cart-fab" aria-label="Abrir carrito">
      <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="cart-icon">
        <path d="M10 18 Q10 16 13 16 L48 16 Q51 16 50 19 L45 40 Q44 43 41 43 L18 43 Q15 43 14 40 Z" />
        <circle cx="22" cy="50" r="3"/>
        <circle cx="40" cy="50" r="3"/>
        <path d="M14 16 L10 8 L4 8" />
      </svg>
      <span class="cart-bubble" id="cart-count">0</span>
    </button>
    <a href="https://api.whatsapp.com/send/?phone=5493512051505&text=Hola!+Tengo+una+consulta" target="_blank" rel="noopener" id="wa-fab" class="cart-fab" style="background:#25D366; color:white; border:none; box-shadow:0 6px 16px rgba(37,211,102,.3);" aria-label="WhatsApp Responder Consultas" title="Responder consultas">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="30" height="30" style="margin: 0 auto; display: block; margin-top: 17px;">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </a>`;
  document.body.appendChild(fab);

  document.getElementById('cart-fab').addEventListener('click', abrirCarrito);
  document.getElementById('cart-undo').addEventListener('click', () => {
    if (cart.deshacer()) toast('Acción deshecha');
  });

  const drawer = document.createElement('aside');
  drawer.id = 'cart-drawer';
  drawer.className = 'cart-drawer';
  drawer.setAttribute('aria-hidden', 'true');
  drawer.innerHTML = `
    <div class="cart-backdrop" data-close></div>
    <div class="cart-panel" role="dialog" aria-label="Carrito de compras">
      <header class="cart-head">
        <h3>Tu pedido</h3>
        <button class="cart-x" data-close aria-label="Cerrar">×</button>
      </header>
      <div class="cart-body" id="cart-body"></div>
      <footer class="cart-foot" id="cart-foot"></footer>
    </div>`;
  document.body.appendChild(drawer);
  drawer.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', cerrarCarrito));

  cart.onChange(renderCarrito);
  renderCarrito();
}

export function abrirCarrito() {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
export function cerrarCarrito() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.body.style.overflow = '';
}

function renderCarrito() {
  const items = cart.items();
  const counter = document.getElementById('cart-count');
  if (counter) {
    const n = cart.count();
    counter.textContent = n;
    counter.classList.toggle('cart-bubble-empty', n === 0);
  }

  const body = document.getElementById('cart-body');
  const foot = document.getElementById('cart-foot');
  if (!body || !foot) return;

  if (!items.length) {
    body.innerHTML = `<div class="cart-empty">
      <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M18 28 L62 28 L56 56 L24 56 Z" stroke-dasharray="4 4"/>
        <path d="M28 38 Q40 32 52 38" opacity="0.5"/>
      </svg>
      <p>Tu carrito está vacío</p>
    </div>`;
    foot.innerHTML = '';
    return;
  }

  const t = cart.totales();
  body.innerHTML = items.map(it => `
    <article class="cart-item">
      <img src="${it.imagen || ''}" alt="" onerror="this.style.visibility='hidden'"/>
      <div class="cart-item-body">
        <h4>${it.nombre}</h4>
        <span class="cart-precio">${formatPrice((t.usaDescuento && it.precio_30 ? it.precio_30 : it.precio) * it.cantidad)}</span>
      </div>
      <div class="qty">
        <button data-id="${it.id}" data-act="-" aria-label="Restar">−</button>
        <span>${it.cantidad}</span>
        <button data-id="${it.id}" data-act="+" aria-label="Sumar">+</button>
      </div>
      <button class="cart-trash" data-id="${it.id}" data-act="x" aria-label="Eliminar">×</button>
    </article>`).join('');

  body.querySelectorAll('button[data-act]').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.dataset.id;
      const act = b.dataset.act;
      const it = cart.items().find(i => i.id === id);
      if (!it) return;
      if (act === '+') cart.setCantidad(id, it.cantidad + 1);
      if (act === '-') cart.setCantidad(id, it.cantidad - 1);
      if (act === 'x') cart.remover(id);
    });
  });

  const faltaMonto = REGLAS.descuento_monto_minimo - t.subtotalBruto;
  foot.innerHTML = `
    ${t.usaDescuentoMonto
      ? `<div class="cart-ok">¡10% de descuento aplicado por superar $${REGLAS.descuento_monto_minimo.toLocaleString('es-AR')}!</div>`
      : t.usaDescuentoUnidades
        ? `<div class="cart-ok">¡Descuento mayorista aplicado por +${REGLAS.desde_descuento} unidades!</div>`
        : `<div class="cart-info">Agregá ${formatPrice(faltaMonto)} más y obtené 10% off.</div>`}
    <div class="cart-totales">
      <span>Total · ${t.totalUnits} unid.</span>
      <strong>${formatPrice(t.total)}</strong>
    </div>
    <button id="cart-checkout" class="cart-cta">
      Finalizar compra →
    </button>`;

  document.getElementById('cart-checkout')?.addEventListener('click', () => {
    cerrarCarrito();
    abrirCheckout();
  });
}

// ── CHECKOUT ──────────────────────────────
export function abrirCheckout() {
  if (document.getElementById('checkout-modal')) document.getElementById('checkout-modal').remove();

  const modal = document.createElement('div');
  modal.id = 'checkout-modal';
  modal.className = 'checkout-modal open';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-label', 'Finalizar compra');

  const t = cart.totales();
  const items = cart.items();

  modal.innerHTML = `
    <div class="ck-backdrop" data-close></div>
    <div class="ck-panel">
      <header class="ck-head">
        <h2>Finalizá tu pedido</h2>
        <button class="ck-x" data-close aria-label="Cerrar">×</button>
      </header>
      <div class="ck-body">
        <section class="ck-resumen">
          <h3>Resumen</h3>
          <ul>
            ${items.map(i => `<li><span>${i.nombre} ×${i.cantidad}</span><b>${formatPrice((t.usaDescuento && i.precio_30 ? i.precio_30 : i.precio) * i.cantidad)}</b></li>`).join('')}
          </ul>
          <div class="ck-total"><span>Total</span><strong>${formatPrice(t.total)}</strong></div>
          ${t.usaDescuento ? `<small class="ck-desc">✓ Descuento +${REGLAS.desde_descuento} unidades aplicado</small>` : ''}
        </section>

        <form id="ck-form" class="ck-form" novalidate>
          <fieldset>
            <legend>Datos de contacto</legend>
            <label>Nombre completo<input type="text" name="nombre" required minlength="3"/></label>
            <label>Teléfono<input type="tel" name="telefono" required pattern="[0-9 +-]{6,}"/></label>
            <label>Email<input type="email" name="email" required/></label>
          </fieldset>

          <fieldset>
            <legend>Entrega</legend>
            <div class="ck-radio">
              <label><input type="radio" name="entrega" value="retiro" checked/> Retiro en local</label>
              <label><input type="radio" name="entrega" value="repartidor"/> Envío con repartidor propio</label>
            </div>
            <p style="font-size:.8rem;color:var(--ink-m);margin-top:10px;line-height:1.5;">No realizamos envíos. Sin embargo, podés enviar un repartidor a retirar tu pedido en nuestro local.</p>
          </fieldset>

          <fieldset>
            <legend>Pago por transferencia</legend>
            <div class="ck-pago">
              <p><b>Titular:</b> ${DATOS_PAGO.titular}</p>
              <p><b>Banco:</b> ${DATOS_PAGO.banco}</p>
              <p><b>CBU:</b> <code>${DATOS_PAGO.cbu}</code> <button type="button" class="ck-copy" data-copy="${DATOS_PAGO.cbu}">copiar</button></p>
              <p><b>Alias:</b> <code>${DATOS_PAGO.alias}</code> <button type="button" class="ck-copy" data-copy="${DATOS_PAGO.alias}">copiar</button></p>
              <p><b>CUIL:</b> ${DATOS_PAGO.cuil}</p>
              <p class="ck-monto">A transferir: <strong>${formatPrice(t.total)}</strong></p>
            </div>
            <label class="ck-file">
              Subí el comprobante (obligatorio)
              <input type="file" name="comprobante" accept="image/*,.pdf" required/>
            </label>
          </fieldset>

          <button type="submit" class="ck-submit">Confirmar pedido →</button>
          <p class="ck-aviso" id="ck-aviso"></p>
        </form>
      </div>
    </div>`;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', () => {
    modal.remove();
    document.body.style.overflow = '';
  }));

  modal.querySelectorAll('input[name="entrega"]').forEach(r => r.addEventListener('change', e => {
    modal.querySelector('.ck-direccion').style.display = e.target.value === 'envio' ? 'block' : 'none';
    modal.querySelector('input[name="direccion"]').required = e.target.value === 'envio';
  }));

  modal.querySelectorAll('.ck-copy').forEach(b => b.addEventListener('click', async () => {
    await navigator.clipboard.writeText(b.dataset.copy);
    const old = b.textContent;
    b.textContent = '¡copiado!';
    setTimeout(() => b.textContent = old, 1400);
  }));

  modal.querySelector('#ck-form').addEventListener('submit', async ev => {
    ev.preventDefault();
    const form = ev.target;
    const aviso = document.getElementById('ck-aviso');
    const submit = form.querySelector('.ck-submit');

    if (!form.checkValidity()) { form.reportValidity(); return; }

    submit.disabled = true;
    submit.textContent = 'Subiendo comprobante...';
    aviso.textContent = '';
    aviso.className = 'ck-aviso';

    const fd = new FormData(form);
    const file = fd.get('comprobante');
    const t2 = cart.totales();

    const pedido = {
      cliente_nombre: fd.get('nombre'),
      cliente_telefono: fd.get('telefono'),
      cliente_email: fd.get('email'),
      entrega: fd.get('entrega'),
      direccion: fd.get('direccion') || null,
      items: cart.items(),
      subtotal: t2.subtotal,
      descuento: t2.usaDescuento ? 1 : 0,
      total: t2.total
    };

    try {
      const data = await crearPedido(pedido, file);
      pedidoActivo.set(data.id);
      cart.vaciar();
      window.location.href = `estado.html?id=${data.id}`;
    } catch (err) {
      console.error(err);
      aviso.textContent = '⚠️ Hubo un problema al guardar el pedido. ' + (err.message || '');
      aviso.classList.add('err');
      submit.disabled = false;
      submit.textContent = 'Confirmar pedido →';
    }
  });
}

// ── BANNER PEDIDO EN CURSO ────────────────
export function montarBannerPedido() {
  const id = pedidoActivo.get();
  if (!id) return;
  if (document.getElementById('pedido-banner')) return;
  const b = document.createElement('a');
  b.id = 'pedido-banner';
  b.href = `estado.html?id=${id}`;
  b.innerHTML = `<span>⏳</span><span>Tenés un pedido en curso · <u>Ver estado</u></span><button aria-label="Ocultar" onclick="event.preventDefault();this.parentNode.remove();">×</button>`;
  document.body.prepend(b);
  document.body.classList.add('with-banner');
}

// ── TOAST ─────────────────────────────────
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'cart-toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 1800);
}
