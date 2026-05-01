// --------------------------
// UI Interactivity (extracted)
// --------------------------

document.body.classList.remove('no-js');

// PRELOADER
function initUI() {
  setTimeout(() => {
    const pre = document.getElementById('pre');
    if (pre) pre.classList.add('hide');
    if (typeof startTW === 'function') startTW();
    if (typeof spawnPts === 'function') spawnPts();
    if (typeof triggerCounters === 'function') triggerCounters();
  }, 1200);
}

if (document.readyState === 'complete') {
  initUI();
} else {
  window.addEventListener('load', initUI);
}

// CURSOR
const cur = document.getElementById('cur'), curT = document.getElementById('cur-t');
let mx = -100, my = -100, tx = -100, ty = -100;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});
(function tr() { tx += (mx-tx)*.11; ty += (my-ty)*.11; curT.style.left = tx+'px'; curT.style.top = ty+'px'; requestAnimationFrame(tr); })();
document.querySelectorAll('a,button,.pcard,.fb').forEach(el => {
  el.addEventListener('mouseenter', () => cur.classList.add('big'));
  el.addEventListener('mouseleave', () => cur.classList.remove('big'));
});

// PROGRESS
window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  document.getElementById('prog').style.width = (scrollY / h * 100) + '%';
});

// NAV
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('s', scrollY > 80));
const tog = document.querySelector('.nav-tog'), menu = document.getElementById('nav-menu');
tog.addEventListener('click', () => {
  const open = tog.getAttribute('aria-expanded') === 'true';
  tog.setAttribute('aria-expanded', !open); menu.classList.toggle('open', !open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  tog.setAttribute('aria-expanded','false'); menu.classList.remove('open');
}));



// TYPEWRITER
function startTW() {
  const el = document.getElementById('tw-txt');
  const phrases = ['cuida.','enamora.','sana.','nutre.','sorprende.'];
  let pi=0,ci=0,del=false;
  function tick() {
    const w = phrases[pi];
    del ? (el.textContent = w.slice(0,--ci)) : (el.textContent = w.slice(0,++ci));
    if (!del && ci===w.length) { del=true; setTimeout(tick,1700); return; }
    if (del && ci===0) { del=false; pi=(pi+1)%phrases.length; setTimeout(tick,380); return; }
    setTimeout(tick, del ? 55 : 95);
  }
  tick();
}

// PARTICLES
function spawnPts() {
  const c = document.getElementById('particles');
  const cols = ['rgba(200,24,90,.12)','rgba(224,165,69,.1)','rgba(85,133,100,.08)','rgba(200,24,90,.06)'];
  for(let i=0;i<16;i++){
    const d=document.createElement('div');
    const s=Math.random()*9+3;
    d.className='pt';
    d.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;background:${cols[Math.floor(Math.random()*cols.length)]};animation-duration:${Math.random()*14+8}s;animation-delay:${Math.random()*12}s`;
    c.appendChild(d);
  }
}

// PARALLAX — (removed: hero-r no longer exists, Laura is in her own section)

// COUNTERS
function triggerCounters() {
  document.querySelectorAll('.cnt').forEach(el => {
    const t = +el.dataset.t;
    if(t===0){el.textContent='0';return;}
    let s=0; const dur=1800;
    (function step(ts){if(!s)s=ts;const p=Math.min((ts-s)/dur,1);el.textContent=Math.floor(p*t);if(p<1)requestAnimationFrame(step);else el.textContent=t;})(performance.now());
  });
}
const statsEl = document.querySelector('.stats');
if(statsEl){new IntersectionObserver((en)=>{if(en[0].isIntersecting)triggerCounters();},{threshold:.5}).observe(statsEl);}

// REVEAL
const rvObs = new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');});},{threshold:.08});
document.querySelectorAll('.rv,.rv-sc').forEach(el=>rvObs.observe(el));

// FILTERS
const quinasSubBar = document.getElementById('quinas-sub-filters');
let activeSubFilter = 'all';

function applyFilters(cat, sub) {
  document.querySelectorAll('.pcard').forEach(c => {
    const cardCat = c.dataset.c || '';
    const cardSub = c.dataset.sub || '';
    const catMatch = cat === 'all' || cardCat.includes(cat);
    const subMatch = sub === 'all' || cardSub === sub;
    const show = catMatch && subMatch;
    c.style.transition = 'opacity .35s,transform .35s';
    if (show) { c.style.display=''; requestAnimationFrame(()=>{ c.style.opacity='1'; c.style.transform=''; }); }
    else { c.style.opacity='0'; c.style.transform='scale(.93)'; setTimeout(()=>{ c.style.display='none'; },340); }
  });
}

document.querySelectorAll('.fb:not(.fb-sub)').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fb:not(.fb-sub)').forEach(b=>b.classList.remove('on'));
    btn.classList.add('on');
    const f = btn.dataset.f;
    if (quinasSubBar) {
      quinasSubBar.style.display = f === 'quinas' ? 'flex' : 'none';
      if (f !== 'quinas') activeSubFilter = 'all';
    }
    applyFilters(f, activeSubFilter);
  });
});

if (quinasSubBar) {
  quinasSubBar.querySelectorAll('.fb-sub').forEach(btn => {
    btn.addEventListener('click', () => {
      quinasSubBar.querySelectorAll('.fb-sub').forEach(b=>b.classList.remove('on'));
      btn.classList.add('on');
      activeSubFilter = btn.dataset.sub;
      applyFilters('quinas', activeSubFilter);
    });
  });
}

// 3D TILT
document.querySelectorAll('.tilt').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r=c.getBoundingClientRect(), x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
    c.style.transform=`perspective(900px) rotateY(${x/r.width*10}deg) rotateX(${-y/r.height*10}deg) translateY(-10px)`;
  });
  c.addEventListener('mouseleave', ()=>{ c.style.transform=''; c.style.transition='transform .5s cubic-bezier(0.16,1,0.3,1)'; });
});

// PRODUCTO MODAL — abre con dataset, integra con carrito vía window.__addToCart
const pModal = document.getElementById('prod-modal');
let pmActiveId = null;
function openPModal(card) {
  const d = card.dataset;
  pmActiveId = d.id || null;
  document.getElementById('pm-name').textContent = d.n || '';
  document.getElementById('pm-desc').textContent = d.desc || '';
  document.getElementById('pm-units').textContent = d.units || '—';
  document.getElementById('pm-price').textContent = d.price || 'Consultar';
  document.getElementById('pm-tag').textContent = card.querySelector('.pcard-tag')?.textContent || 'Exquisiteces';
  const img = card.querySelector('.pcard-img img');
  const pmImg = document.getElementById('pm-img');
  if(img && img.src && !img.src.includes('gif')){ pmImg.src = img.src; pmImg.alt = d.n||''; pmImg.style.display='block'; }
  else { pmImg.style.display='none'; }
  const chips = document.getElementById('pm-chips');
  chips.innerHTML = '';
  (d.ing||'').split('|').filter(Boolean).forEach(i=>{ const s=document.createElement('span'); s.className='pm-chip'; s.textContent=i.trim(); chips.appendChild(s); });
  document.getElementById('pm-qty-val').textContent = '1';
  const addBtn = document.getElementById('pm-add');
  addBtn.disabled = card.classList.contains('sin-stock');
  addBtn.textContent = '';
  addBtn.innerHTML = card.classList.contains('sin-stock')
    ? 'Sin stock'
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18l-2 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L3 7Z"/><path d="M16 11a4 4 0 0 1-8 0"/></svg> Sumar al carrito`;
  pModal.classList.add('on'); document.body.style.overflow='hidden';
}
document.getElementById('pm-close').addEventListener('click', closePModal);
pModal.addEventListener('click', e=>{ if(e.target===pModal) closePModal(); });
function closePModal(){ pModal.classList.remove('on'); document.body.style.overflow=''; }

// Selector de cantidad del modal
const pmQtyVal = document.getElementById('pm-qty-val');
document.querySelectorAll('#pm-qty button').forEach(b=>{
  b.addEventListener('click',()=>{
    let n = parseInt(pmQtyVal.textContent,10) || 1;
    n = b.dataset.act==='+' ? n+1 : Math.max(1, n-1);
    pmQtyVal.textContent = n;
  });
});
document.getElementById('pm-add').addEventListener('click', ()=>{
  if (!pmActiveId || !window.__addToCart) return;
  const n = parseInt(pmQtyVal.textContent,10) || 1;
  window.__addToCart(pmActiveId, n);
  closePModal();
});

// LIGHTBOX
const lb=document.getElementById('lb'), lbImg=document.getElementById('lb-img'), lbCap=document.getElementById('lb-cap');
document.querySelectorAll('.pcard').forEach(c=>{
  c.addEventListener('click', e=>{
    if(e.target.closest('.btn-vmi')) return; // modal handled separately
    const img=c.querySelector('.pcard-img img'), name=c.dataset.n;
    if(!img||!img.src||img.src.includes('gif'))return;
    lbImg.src=img.src; lbImg.alt=name||''; lbCap.textContent=name||'';
    lb.classList.add('on'); document.body.style.overflow='hidden';
  });
});
document.getElementById('lb-x').addEventListener('click', closeLb);
lb.addEventListener('click', e=>{ if(e.target===lb)closeLb(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeLb(); closeXP(); closePModal(); } });
function closeLb(){ lb.classList.remove('on'); document.body.style.overflow=''; }

// MAGNETIC BTNS
document.querySelectorAll('.btn-p,.nav-cta').forEach(b=>{
  b.addEventListener('mousemove',e=>{
    const r=b.getBoundingClientRect();
    b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.22}px) translateY(-2px)`;
  });
  b.addEventListener('mouseleave',()=>b.style.transform='');
});

// EXIT POPUP
let xpShown=false;
document.addEventListener('mouseleave',e=>{
  if(e.clientY<10&&!xpShown&&!sessionStorage.getItem('xp')){
    xpShown=true; sessionStorage.setItem('xp','1');
    document.getElementById('xp').classList.add('on'); document.body.style.overflow='hidden';
  }
});
document.getElementById('xp-x').addEventListener('click', closeXP);
document.getElementById('xp').addEventListener('click',e=>{ if(e.target===document.getElementById('xp'))closeXP(); });
function closeXP(){ document.getElementById('xp').classList.remove('on'); document.body.style.overflow=''; }

// (QUICK ORDER → WhatsApp eliminado en v3 e-commerce)

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href')); if(!t)return; e.preventDefault();
    window.scrollTo({top:t.getBoundingClientRect().top+scrollY-80,behavior:'smooth'});
  });
});


// --------------------------
// E-Commerce Logic (extracted)
// --------------------------

import { getProductos, suscribirProductos, supabaseReady } from './supabase-client.js';
import { cart, montarCarritoUI, montarBannerPedido } from './cart.js';
import { FOTO_PROXIMAMENTE } from './productos-data.js';

const fmt = n => '$' + n.toLocaleString('es-AR');
const grid = document.getElementById('pgrid');
let productos = [];

function tagProducto(p){
  if (p.destacado) return p.categoria==='quinas' ? 'Distribuidora' : 'Favorito';
  if (p.categoria==='quinas') return p.subcategoria || 'Las Quinas';
  return '';
}

function renderGrid(){
  if (!grid) return;
  const enStock = productos.filter(p => p.con_stock);
  const sinStockList = productos.filter(p => !p.con_stock);

  grid.innerHTML = enStock.map((p,i)=>{
    const img = p.imagen || FOTO_PROXIMAMENTE;
    const tag = tagProducto(p);
    return `
      <div class="pcard tilt rv${i<3?'':' d'+(i%3)}"
           data-id="${p.id}"
           data-c="${p.categoria}"
           data-sub="${p.subcategoria||''}"
           data-n="${p.nombre}"
           data-i="${img}"
           data-units="${p.presentacion||''}"
           data-ing="${(p.ingredientes||'').split(',').map(s=>s.trim()).join('|')}"
           data-price="${fmt(p.precio)}"
           data-desc="${p.ingredientes||''}">
        <div class="pcard-img">
          <img src="${img}" alt="${p.nombre}" loading="lazy" onerror="this.src='${FOTO_PROXIMAMENTE}'">
          <div class="pcard-ov"><span class="pcard-ov-t">Ver detalle</span></div>
          ${tag ? `<span class="pcard-tag">${tag}</span>` : ''}
        </div>
        <div class="pcard-body">
          <h3 class="pcard-name">${p.nombre}</h3>
          <p class="pcard-desc">${p.presentacion || ''}</p>
          <div class="pcard-precio">
            <strong>${fmt(p.precio)}</strong>
            ${p.precio_30 ? `<small>desde 30u · ${fmt(p.precio_30)}</small>` : ''}
          </div>
          <div class="qty-card" data-id="${p.id}">
            <button type="button" data-act="-" aria-label="Restar">−</button>
            <span data-qty="${p.id}">1</span>
            <button type="button" data-act="+" aria-label="Sumar">+</button>
          </div>
          <button class="add-to-cart" data-id="${p.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18l-2 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L3 7Z"/><path d="M16 11a4 4 0 0 1-8 0"/></svg>
            Sumar al carrito
          </button>
          <button class="btn-vmi" type="button">Ver más información ↗</button>
        </div>
      </div>`;
  }).join('');

  // Próximamente disponibles (out of stock)
  if (sinStockList.length > 0) {
    grid.innerHTML += `
      <div style="grid-column:1/-1;margin-top:32px;">
        <details style="background:var(--cream-d);border-radius:var(--r-lg);overflow:hidden;border:1px solid rgba(42,19,32,.06);">
          <summary style="padding:18px 24px;cursor:pointer;font-family:var(--ff-d);font-size:1.1rem;font-weight:400;font-style:italic;color:var(--ink-m);list-style:none;display:flex;align-items:center;gap:10px;">
            <span style="font-size:.7rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;font-family:var(--ff-b);font-style:normal;color:var(--canela);">⏳ Próximamente disponibles</span>
            <span style="margin-left:auto;font-size:.75rem;color:var(--ink-f);">${sinStockList.length} producto${sinStockList.length>1?'s':''}</span>
          </summary>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:0 20px 20px;">
            ${sinStockList.map(p => {
              const img = p.imagen || FOTO_PROXIMAMENTE;
              return `
                <div class="pcard sin-stock" style="pointer-events:none;opacity:.55;filter:grayscale(.4);">
                  <div class="pcard-img">
                    <img src="${img}" alt="${p.nombre}" loading="lazy" onerror="this.src='${FOTO_PROXIMAMENTE}'">
                    <span class="sin-stock-tag" style="background:var(--canela);">Pronto disponible</span>
                  </div>
                  <div class="pcard-body">
                    <h3 class="pcard-name">${p.nombre}</h3>
                    <p class="pcard-desc">${p.presentacion || ''}</p>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </details>
      </div>`;
  }

  // Bind ver más
  grid.querySelectorAll('.btn-vmi').forEach(b=>b.addEventListener('click',e=>{
    e.stopPropagation();
    const card = b.closest('.pcard');
    if (card && window.openPModal) window.openPModal(card);
  }));

  // Lightbox al click en imagen
  grid.querySelectorAll('.pcard-img').forEach(im=>im.addEventListener('click',e=>{
    const card = im.closest('.pcard');
    const img = im.querySelector('img');
    const lb = document.getElementById('lb');
    if (!lb || !img) return;
    document.getElementById('lb-img').src = img.src;
    document.getElementById('lb-cap').textContent = card.dataset.n;
    lb.classList.add('on'); document.body.style.overflow='hidden';
  }));

  // qty +/-
  grid.querySelectorAll('.qty-card button').forEach(b=>b.addEventListener('click',()=>{
    const wrap = b.closest('.qty-card');
    const span = wrap.querySelector('span');
    let n = parseInt(span.textContent,10)||1;
    n = b.dataset.act==='+' ? n+1 : Math.max(1, n-1);
    span.textContent = n;
  }));

  // sumar al carrito
  grid.querySelectorAll('.add-to-cart').forEach(b=>b.addEventListener('click',()=>{
    if (b.disabled) return;
    const id = b.dataset.id;
    const span = grid.querySelector(`[data-qty="${id}"]`);
    const n = parseInt(span?.textContent||'1',10);
    window.__addToCart(id, n);
    span && (span.textContent = '1');
  }));

  // Activar reveal observer si existe
  if (window.__rvObserver) {
    grid.querySelectorAll('.rv').forEach(el=>window.__rvObserver.observe(el));
  } else {
    grid.querySelectorAll('.rv').forEach(el=>el.classList.add('in'));
  }

  reaplicarFiltro();
}

window.__addToCart = (id, cantidad) => {
  const p = productos.find(x => x.id===id);
  if (!p) return;
  cart.agregar(p, cantidad);
};

// Filtros y Paginación
let filtroActivo = 'dulce';
let maxVisible = 6;

function reaplicarFiltro(){
  let countInCat = 0;
  let shownInCat = 0;
  
  grid.querySelectorAll('.pcard').forEach(c=>{
    const cat = c.dataset.c;
    if (cat === filtroActivo || (cat && cat.includes(filtroActivo))) {
      countInCat++;
      if (shownInCat < maxVisible) {
        c.style.display = '';
        shownInCat++;
      } else {
        c.style.display = 'none';
      }
    } else {
      c.style.display = 'none';
    }
  });
  
  // Botón "Ver más"
  const btnContainer = document.querySelector('#productos .pdv-more');
  if (btnContainer) {
    if (countInCat > maxVisible) {
      btnContainer.innerHTML = `<button class="btn-dark" id="btn-ver-mas" style="background:var(--paper); color:var(--ink); border:1px solid rgba(42,19,32,.1) !important; box-shadow:0 4px 14px rgba(0,0,0,.05);">Ver más productos ↓</button>`;
      document.getElementById('btn-ver-mas').addEventListener('click', () => {
        maxVisible += 6;
        reaplicarFiltro();
      });
    } else {
      btnContainer.innerHTML = '';
    }
  }
}
document.querySelectorAll('.filters .fb').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.filters .fb').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');
  filtroActivo = b.dataset.f;
  maxVisible = 6; // Reset on filter change
  reaplicarFiltro();
}));

// Carga inicial
(async () => {
  productos = await getProductos();
  renderGrid();
  montarCarritoUI();
  montarBannerPedido();

  // Realtime stock (si Supabase está configurado)
  if (supabaseReady) {
    suscribirProductos(actualizado => {
      const idx = productos.findIndex(p => p.id===actualizado.id);
      if (idx>=0) {
        productos[idx] = actualizado;
        renderGrid();
      }
    });
  } else {
    console.info('[exq] Supabase no configurado — usando catálogo local. Configurá js/config.js para activar pedidos.');
  }
})();

// Expose openPModal a global (ya estaba en script clásico arriba)
window.openPModal = window.openPModal || openPModal;

// --------------------------
// INSTAGRAM FEED API
// --------------------------
function loadInstagramFeed() {
  const container = document.getElementById('instafeed');
  if (!container) return;

  // En un entorno real, aquí se usaría un Access Token de la API Básica de Instagram:
  // fetch(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink&access_token=${IG_TOKEN}`)
  
  // Como no hay token de backend configurado, simulamos la respuesta de la API en tiempo real
  // usando las imágenes del catálogo como fallback visual para mantener el diseño impecable.
  setTimeout(() => {
    const mockData = [
      { id: '1', media_url: 'assets/Productos%20dulces/alfajor-almendras.jpg', permalink: 'https://instagram.com/exquisiteces.lau' },
      { id: '2', media_url: 'assets/Productos%20dulces/brownie.png', permalink: 'https://instagram.com/exquisiteces.lau' },
      { id: '3', media_url: 'assets/Productos%20dulces/pepas.png', permalink: 'https://instagram.com/exquisiteces.lau' },
      { id: '4', media_url: 'assets/Productos%20dulces/pistacho-crunchy.jpg', permalink: 'https://instagram.com/exquisiteces.lau' },
      { id: '5', media_url: 'assets/Productos%20dulces/budin-patagonico.jpg', permalink: 'https://instagram.com/exquisiteces.lau' }
    ];
    
    container.innerHTML = mockData.map(post => `
      <a href="${post.permalink}" target="_blank" rel="noopener" style="flex:0 0 240px; aspect-ratio:1; display:block; border-radius:var(--r-lg); overflow:hidden; position:relative;" class="ig-post">
        <div style="position:absolute;inset:0;background:url('${post.media_url}') center/cover; filter:saturate(1.2); transition:transform 0.4s var(--ease-out);"></div>
        <div style="position:absolute;inset:0;background:rgba(42,19,32,0.4);opacity:0;transition:opacity 0.3s;display:flex;align-items:center;justify-content:center;color:white;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
        </div>
      </a>
    `).join('');
    
    // Hover effects
    container.querySelectorAll('.ig-post').forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.children[0].style.transform = 'scale(1.05)';
        el.children[1].style.opacity = '1';
      });
      el.addEventListener('mouseleave', () => {
        el.children[0].style.transform = 'scale(1)';
        el.children[1].style.opacity = '0';
      });
    });
  }, 1500); // Simulamos latencia de red
}

document.addEventListener('DOMContentLoaded', loadInstagramFeed);
if(document.readyState === 'complete') loadInstagramFeed();
