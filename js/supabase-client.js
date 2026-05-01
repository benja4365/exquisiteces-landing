// 🔌 SUPABASE CLIENT — Exquisiteces
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { PRODUCTOS as PRODUCTOS_FALLBACK } from './productos-data.js';

const isConfigured = !SUPABASE_URL.includes('TU-PROYECTO') && !SUPABASE_ANON_KEY.includes('TU-ANON-KEY');

// Importación dinámica: si esm.sh no está disponible, se usa el fallback local
let sb = null;
export let supabaseReady = false;

if (isConfigured) {
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    supabaseReady = true;
  } catch (e) {
    console.warn('[supabase] No se pudo conectar al CDN de Supabase — usando datos locales.', e.message);
  }
}

export { sb };

// ── PRODUCTOS ───────────────────────────────
export async function getProductos() {
  if (!sb) return PRODUCTOS_FALLBACK;
  const { data, error } = await sb.from('productos').select('*').order('orden', { ascending: true });
  if (error || !data?.length) {
    console.warn('[supabase] usando fallback local', error?.message);
    return PRODUCTOS_FALLBACK;
  }
  return data;
}

export function suscribirProductos(callback) {
  if (!sb) return () => {};
  const ch = sb.channel('productos-stock')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'productos' }, payload => {
      callback(payload.new);
    })
    .subscribe();
  return () => sb.removeChannel(ch);
}

export async function actualizarStock(id, conStock) {
  if (!sb) throw new Error('Supabase no configurado');
  const { error } = await sb.from('productos').update({ con_stock: conStock }).eq('id', id);
  if (error) throw error;
}

// ── PEDIDOS ───────────────────────────────
export async function crearPedido(pedido, comprobanteFile) {
  if (!sb) throw new Error('Supabase no configurado. Configurá las credenciales en js/config.js');

  const ext = comprobanteFile.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;

  const { error: upErr } = await sb.storage.from('comprobantes').upload(path, comprobanteFile, {
    cacheControl: '3600', upsert: false
  });
  if (upErr) throw upErr;

  const { data: { publicUrl } } = sb.storage.from('comprobantes').getPublicUrl(path);

  const { data, error } = await sb.from('pedidos').insert({
    ...pedido,
    comprobante_url: publicUrl,
    estado: 'pendiente'
  }).select().single();

  if (error) throw error;
  return data;
}

export async function getPedidoPorId(id) {
  if (!sb) return null;
  const { data, error } = await sb.from('pedidos').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export function suscribirPedido(id, callback) {
  if (!sb) return () => {};
  const ch = sb.channel(`pedido-${id}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'pedidos', filter: `id=eq.${id}` }, payload => {
      callback(payload.new);
    })
    .subscribe();
  return () => sb.removeChannel(ch);
}

export async function getPedidosActivos() {
  if (!sb) return [];
  const { data, error } = await sb.from('pedidos')
    .select('*')
    .in('estado', ['pendiente','confirmado','en_camino'])
    .order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}

export function suscribirPedidos(callback) {
  if (!sb) return () => {};
  const ch = sb.channel('pedidos-todos')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, () => callback())
    .subscribe();
  return () => sb.removeChannel(ch);
}

export async function actualizarEstadoPedido(id, estado, extra = {}) {
  if (!sb) throw new Error('Supabase no configurado');
  const { error } = await sb.from('pedidos').update({ estado, updated_at: new Date().toISOString(), ...extra }).eq('id', id);
  if (error) throw error;
}

export async function subirCapturaEnvio(pedidoId, file, repartidor) {
  if (!sb) throw new Error('Supabase no configurado');
  const ext = file.name.split('.').pop();
  const path = `${pedidoId}-${Date.now()}.${ext}`;
  const { error: upErr } = await sb.storage.from('envios').upload(path, file);
  if (upErr) throw upErr;
  const { data: { publicUrl } } = sb.storage.from('envios').getPublicUrl(path);
  await actualizarEstadoPedido(pedidoId, 'en_camino', { envio_captura_url: publicUrl, envio_repartidor: repartidor });
  return publicUrl;
}
