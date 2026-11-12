const COOKIE = '__Host-ksb_session';
const SESSION_SECONDS = 60 * 60 * 24 * 30;
const FREE_SHIPPING = 70000;
const SHIPPING_FEE = 10000;
const APPROVED_OWNER_PHONES = new Set(['6289504150803','6281292971153']);
const PRODUCT_NAMES = {
  obor: 'Kerupuk Pangsit', rante: 'Kerupuk Rante', mawarputih: 'Kerupuk Mawar Putih (Rafael)',
  mawarwarna: 'Kerupuk Mawar Warna', bintang: 'Kerupuk Bintang', spiral: 'Makaroni Spiral',
  bawangwarna: 'Kerupuk Bawang Warna', jengkol: 'Kerupuk Jengkol Asbes', pipa: 'Makaroni Bantat / Pipa'
};
const INGREDIENT_IDS = new Set(['atom','kencur','aida','rawit','bawang-goreng','daun-jeruk','bbq','jagung-bakar','balado','keju']);
const SIGNATURE_IDS = new Set(['original','pedas','jeruk','bbq','jagung','balado']);
const DEFAULT_SETTINGS = {
  pricePer100g:11900,hppPer100g:0,pouchCost:0,shippingFee:SHIPPING_FEE,freeShippingSubtotal:FREE_SHIPPING,
  maxPackagesDay:30,initialCash:0,payee:'Trio Seblak',whatsapp:'',qrisImage:'',heroImage:'',brandLogo:'',
  flavorImages:{},ingredientImages:{},productImages:{},
  paymentNote:'Scan QRIS dan unggah bukti pembayaran. Pesanan menunggu verifikasi pemilik.'
};

const json = (data, status=200, headers={}) => new Response(JSON.stringify(data), {
  status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}
});
const fail = (message, status=400) => json({error:message},status);
const nowIso = () => new Date().toISOString();
const normalizePhone = value => {
  let phone=String(value||'').replace(/\D/g,'');
  if(phone.startsWith('0')) phone='62'+phone.slice(1);
  else if(phone.startsWith('8')) phone='62'+phone;
  return phone;
};
const validPhone = value => /^\d{8,15}$/.test(value);
const randomHex = size => {
  const bytes = new Uint8Array(size); crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2,'0')).join('');
};
const digestHex = async value => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2,'0')).join('');
};
const parseJson = async request => {
  const length = Number(request.headers.get('content-length')||0);
  if(length > 8_000_000) throw new Error('Ukuran kiriman terlalu besar.');
  const raw=await request.text();
  if(raw.length>8_000_000) throw new Error('Ukuran kiriman terlalu besar.');
  return JSON.parse(raw);
};
const parseCookie = (request, name) => {
  const row = (request.headers.get('cookie')||'').split(';').map(part=>part.trim()).find(part=>part.startsWith(name+'='));
  return row ? decodeURIComponent(row.slice(name.length+1)) : '';
};
const normalizePin = value => /^\d{6}$/.test(String(value||''));

function hasPinPepper(env) {
  return typeof env.PIN_PEPPER==='string'&&env.PIN_PEPPER.length>=32;
}
async function pinKey(env) {
  return await crypto.subtle.importKey('raw',new TextEncoder().encode(env.PIN_PEPPER),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
}
function pinMessage(pin,salt) {
  return new TextEncoder().encode(`${salt}:${String(pin)}`);
}
async function hashPin(pin,salt,env) {
  const signature=await crypto.subtle.sign('HMAC',await pinKey(env),pinMessage(pin,salt));
  return Array.from(new Uint8Array(signature),b=>b.toString(16).padStart(2,'0')).join('');
}
function fromHex(value) {
  if(typeof value!=='string'||value.length%2||!/^[0-9a-f]+$/i.test(value)) return new Uint8Array();
  return Uint8Array.from(value.match(/.{2}/g)||[],part=>parseInt(part,16));
}
async function verifyPin(pin,salt,storedHash,env) {
  const signature=fromHex(storedHash);
  if(signature.length!==32) return false;
  return await crypto.subtle.verify('HMAC',await pinKey(env),signature,pinMessage(pin,salt));
}
async function readSession(request, env) {
  const token = parseCookie(request,COOKIE);
  if(!token) return null;
  const tokenHash = await digestHex(token), now = Math.floor(Date.now()/1000);
  const row = await env.DB.prepare('SELECT s.phone,a.role,a.name,a.addresses_json FROM sessions s JOIN accounts a ON a.phone=s.phone WHERE s.token_hash=? AND s.expires_at>?').bind(tokenHash,now).first();
  if(!row) return null;
  return {phone:row.phone,role:row.role,name:row.name,addresses:JSON.parse(row.addresses_json||'[]'),tokenHash};
}
async function requireRole(request, env, role) {
  const session = await readSession(request,env);
  return session?.role===role ? session : null;
}
async function setSession(env, phone) {
  const token = randomHex(32), tokenHash = await digestHex(token), expires = Math.floor(Date.now()/1000)+SESSION_SECONDS;
  await env.DB.prepare('INSERT INTO sessions(token_hash,phone,expires_at) VALUES(?,?,?)').bind(tokenHash,phone,expires).run();
  return {token,header:`${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`};
}
async function ensureState(env) {
  const current = await env.DB.prepare('SELECT id FROM site_state WHERE id=1').first();
  if(current) return;
  const stock = Object.fromEntries(Object.keys(PRODUCT_NAMES).map(id=>[id,50000]));
  await env.DB.prepare('INSERT OR IGNORE INTO site_state(id,settings_json,stock_json,ledger_json,updated_at) VALUES(1,?,?,?,?)')
    .bind(JSON.stringify(DEFAULT_SETTINGS),JSON.stringify(stock),'[]',nowIso()).run();
}
async function getState(env) {
  await ensureState(env);
  const row = await env.DB.prepare('SELECT settings_json,stock_json,ledger_json FROM site_state WHERE id=1').first();
  return {settings:{...DEFAULT_SETTINGS,...JSON.parse(row.settings_json||'{}')},stock:JSON.parse(row.stock_json||'{}'),ledger:JSON.parse(row.ledger_json||'[]'),rawStockJson:row.stock_json};
}
function publicSettings(settings) {
  const copy = structuredClone(settings);
  delete copy.hppPer100g; delete copy.pouchCost; delete copy.initialCash;
  return copy;
}
function mediaKeyFor(group,id) { return `${group}/${id}`; }
function isDataImage(value) { return typeof value==='string' && /^data:image\/(png|jpeg|webp|gif);base64,/i.test(value); }
async function saveSettingsAndMedia(env, settings) {
  const next = structuredClone(settings||{}), changed = [];
  const fields = [['qrisImage','payment'],['heroImage','hero'],['brandLogo','brand']];
  for(const [field,key] of fields) if(isDataImage(next[field])) { changed.push([key,next[field]]); next[field]=`/api/media/${key}`; }
  for(const [field,group] of [['productImages','product'],['flavorImages','signature'],['ingredientImages','ingredient']]) {
    next[field]=next[field]||{};
    for(const [id,value] of Object.entries(next[field])) if(isDataImage(value)) { const key=mediaKeyFor(group,id); changed.push([key,value]); next[field][id]=`/api/media/${key}`; }
  }
  const statements=changed.map(([key,value])=>{
    if(value.length>1_850_000) throw new Error('Salah satu foto masih terlalu besar. Kompres foto sebelum mengunggah.');
    return env.DB.prepare('INSERT INTO media(media_key,data_url,updated_at) VALUES(?,?,?) ON CONFLICT(media_key) DO UPDATE SET data_url=excluded.data_url,updated_at=excluded.updated_at').bind(key,value,nowIso());
  });
  return {settings:next,statements};
}
async function getOrders(env, phone=null) {
  const query = phone ? env.DB.prepare('SELECT data_json FROM orders WHERE phone=? ORDER BY created_at DESC').bind(phone) : env.DB.prepare('SELECT data_json FROM orders ORDER BY created_at DESC');
  const rows = await query.all();
  return (rows.results||[]).map(row=>JSON.parse(row.data_json));
}
async function getAccount(env, phone) {
  return await env.DB.prepare('SELECT phone,role,name,addresses_json,created_at FROM accounts WHERE phone=?').bind(phone).first();
}
async function createAccount(env,{phone,name,pin,role,address=''}) {
  if(!validPhone(phone)||!normalizePin(pin)||!String(name||'').trim()) return fail('Isi nama, nomor WhatsApp, dan PIN 6 digit dengan benar.');
  if(!hasPinPepper(env)) return fail('Rahasia PIN belum disetel. Tambahkan Secret PIN_PEPPER di Cloudflare.',503);
  if(role==='owner') {
    if(!APPROVED_OWNER_PHONES.has(phone)) return fail('Akun pemilik hanya bisa memakai nomor WhatsApp admin usaha.');
    if(typeof env.OWNER_SETUP_CODE!=='string'||env.OWNER_SETUP_CODE.length<32) return fail('Kode aktivasi pemilik belum disetel dengan aman di Cloudflare.',503);
    const owner = await env.DB.prepare("SELECT phone FROM accounts WHERE role='owner' LIMIT 1").first();
    if(owner) return fail('Akun pemilik sudah dibuat. Silakan masuk.',409);
  }
  const salt=randomHex(16), pinHash=await hashPin(pin,salt,env), addresses=address?[String(address).trim()]:[];
  try {
    await env.DB.prepare('INSERT INTO accounts(phone,role,name,pin_salt,pin_hash,addresses_json,created_at) VALUES(?,?,?,?,?,?,?)')
      .bind(phone,role,String(name).trim().slice(0,80),salt,pinHash,JSON.stringify(addresses),nowIso()).run();
  } catch(error) {
    if(String(error).includes('UNIQUE')) return fail('Nomor ini sudah memiliki akun.',409);
    throw error;
  }
  const session=await setSession(env,phone);
  return json({user:{phone,role,name:String(name).trim(),addresses}},201,{'set-cookie':session.header});
}
async function rateLimit(env,request,phone) {
  const ip=request.headers.get('CF-Connecting-IP')||'unknown', key=await digestHex(`${ip}:${phone}`), now=Math.floor(Date.now()/1000);
  const row=await env.DB.prepare('SELECT window_started,attempts,locked_until FROM auth_attempts WHERE attempt_key=?').bind(key).first();
  if(row&&Number(row.locked_until)>now) return false;
  if(!row||now-Number(row.window_started)>900) await env.DB.prepare('INSERT INTO auth_attempts(attempt_key,window_started,attempts,locked_until) VALUES(?,?,0,0) ON CONFLICT(attempt_key) DO UPDATE SET window_started=excluded.window_started,attempts=0,locked_until=0').bind(key,now).run();
  return true;
}
async function failedLogin(env,request,phone) {
  const ip=request.headers.get('CF-Connecting-IP')||'unknown',key=await digestHex(`${ip}:${phone}`),now=Math.floor(Date.now()/1000);
  const row=await env.DB.prepare('SELECT window_started,attempts FROM auth_attempts WHERE attempt_key=?').bind(key).first();
  const attempts=row&&now-Number(row.window_started)<=900?Number(row.attempts)+1:1;
  await env.DB.prepare('INSERT INTO auth_attempts(attempt_key,window_started,attempts,locked_until) VALUES(?,?,?,?) ON CONFLICT(attempt_key) DO UPDATE SET window_started=excluded.window_started,attempts=excluded.attempts,locked_until=excluded.locked_until')
    .bind(key,attempts===1?now:Number(row?.window_started||now),attempts,attempts>=8?now+900:0).run();
}
async function clearFailedLogin(env,request,phone) {
  const ip=request.headers.get('CF-Connecting-IP')||'unknown',key=await digestHex(`${ip}:${phone}`);
  await env.DB.prepare('DELETE FROM auth_attempts WHERE attempt_key=?').bind(key).run();
}
async function login(request,env) {
  const body=await parseJson(request),phone=normalizePhone(body.phone),pin=String(body.pin||'');
  if(!validPhone(phone)||!normalizePin(pin)) return fail('Nomor WhatsApp atau PIN tidak cocok.',401);
  if(!hasPinPepper(env)) return fail('Rahasia PIN belum disetel. Tambahkan Secret PIN_PEPPER di Cloudflare.',503);
  if(!await rateLimit(env,request,phone)) return fail('Terlalu banyak percobaan. Coba lagi 15 menit lagi.',429);
  const account=await env.DB.prepare('SELECT phone,role,name,pin_salt,pin_hash,addresses_json FROM accounts WHERE phone=?').bind(phone).first();
  if(!account||!await verifyPin(pin,account.pin_salt,account.pin_hash,env)) { await failedLogin(env,request,phone); return fail('Nomor WhatsApp atau PIN tidak cocok.',401); }
  await clearFailedLogin(env,request,phone);
  const session=await setSession(env,phone), user={phone,role:account.role,name:account.name,addresses:JSON.parse(account.addresses_json||'[]')};
  return json({user},200,{'set-cookie':session.header});
}
function validImageData(value) { return isDataImage(value) && value.length<=1_850_000; }
async function createOrder(request,env,session) {
  const body=await parseJson(request),{settings,stock}=await getState(env);
  const owner=await env.DB.prepare("SELECT phone FROM accounts WHERE role='owner' LIMIT 1").first();
  if(!owner||!settings.qrisImage||!String(settings.payee||'').trim()) return fail('Toko belum siap menerima pesanan. Pemilik perlu membuat akun dan mengatur QRIS pembayaran terlebih dahulu.',503);
  const phone=session?.role==='customer'?session.phone:normalizePhone(body.phone);
  const name=String(body.name||session?.name||'').trim().slice(0,80),address=String(body.address||'').trim().slice(0,1000),note=String(body.note||'').trim().slice(0,500);
  if(!validPhone(phone)||!name||!address) return fail('Nama, nomor WhatsApp, dan alamat lengkap wajib diisi.');
  if(!Array.isArray(body.items)||!body.items.length||body.items.length>50) return fail('Isi tas pesanan tidak valid.');
  const items=[];
  for(const raw of body.items) {
    const weight=Number(raw.weight),qty=Number(raw.qty);
    if(![100,200,300].includes(weight)||!Number.isInteger(qty)||qty<1||qty>99||!Array.isArray(raw.mix)||!raw.mix.length) return fail('Racikan pesanan tidak valid.');
    const mix=[];
    for(const part of raw.mix) {
      const id=String(part.id||''),grams=Number(part.grams);
      if(!PRODUCT_NAMES[id]||!Number.isFinite(grams)||grams<=0) return fail('Jenis kerupuk atau berat tidak valid.');
      mix.push({id,name:PRODUCT_NAMES[id],grams});
    }
    if(Math.abs(mix.reduce((sum,row)=>sum+row.grams,0)-weight)>1) return fail('Jumlah gram campuran tidak sama dengan berat pouch.');
    const seasoningMode=raw.seasoningMode==='custom'?'custom':'signature';
    const seasonings=(Array.isArray(raw.seasonings)?raw.seasonings:[]).slice(0,10).filter(s=>INGREDIENT_IDS.has(String(s.id))&&Number(s.spoons)>0&&Number(s.spoons)<=5).map(s=>({id:String(s.id),spoons:Number(s.spoons)}));
    if(!seasonings.length) return fail('Pilih bumbu sebelum memesan.');
    const unitPrice=Math.round((Number(settings.pricePer100g)||0)*weight/100);
    items.push({...raw,id:String(raw.id||crypto.randomUUID()).slice(0,80),weight,qty,mix,seasonings,seasoningMode,
      flavor:SIGNATURE_IDS.has(raw.flavor)?raw.flavor:'original',signatureId:SIGNATURE_IDS.has(raw.signatureId)?raw.signatureId:null,
      price:unitPrice,unitCost:Math.round((Number(settings.hppPer100g)||0)*weight/100+(Number(settings.pouchCost)||0))});
  }
  const packages=items.reduce((sum,item)=>sum+item.qty,0),subtotal=items.reduce((sum,item)=>sum+item.price*item.qty,0),shipping=subtotal>=FREE_SHIPPING?0:SHIPPING_FEE,total=subtotal+shipping;
  const used={};
  for(const item of items) for(const part of item.mix) used[part.id]=(used[part.id]||0)+part.grams*item.qty;
  for(const [id,grams] of Object.entries(used)) if((Number(stock[id])||0)<grams) return fail(`Stok ${PRODUCT_NAMES[id]} tidak cukup.`,409);
  const dateIso=d=>{
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);
    const fields=Object.fromEntries(parts.map(part=>[part.type,part.value]));return `${fields.year}-${fields.month}-${fields.day}`;
  };
  const tomorrow=new Date(Date.now()+24*60*60*1000);
  while(dateIso(tomorrow)===dateIso(new Date())) tomorrow.setTime(tomorrow.getTime()+60*60*1000);
  const tomorrowIso=dateIso(tomorrow),capacity=Math.max(1,Number(settings.maxPackagesDay)||30);
  const tomorrowRows=await env.DB.prepare("SELECT data_json FROM orders WHERE delivery_date=? AND status NOT IN ('Dibatalkan','Selesai')").bind(tomorrowIso).all();
  const tomorrowCount=(tomorrowRows.results||[]).reduce((sum,row)=>sum+(JSON.parse(row.data_json).packages||0),0);
  if(tomorrowCount+packages>capacity) tomorrow.setDate(tomorrow.getDate()+1);
  const now=nowIso(),id=`KSB-${dateIso(new Date()).replace(/-/g,'')}-${randomHex(5).toUpperCase()}`;
  const order={id,createdAt:now,paidAt:null,customerName:name,customerPhone:phone,address,note,items,packages,subtotal,shipping,total,deliveryDate:dateIso(tomorrow),status:'Menunggu pembayaran',paymentStatus:'Belum dibayar',payerName:'',proof:'',courierActualCost:null,ownerNote:''};
  for(const [productId,grams] of Object.entries(used)) stock[productId]=Math.max(0,(Number(stock[productId])||0)-grams);
  const update=env.DB.prepare('UPDATE site_state SET stock_json=?,updated_at=? WHERE id=1 AND stock_json=?').bind(JSON.stringify(stock),now,(await getState(env)).rawStockJson);
  const insert=env.DB.prepare('INSERT INTO orders(id,phone,delivery_date,status,created_at,data_json) SELECT ?,?,?,?,?,? WHERE changes()>0').bind(id,phone,order.deliveryDate,order.status,now,JSON.stringify(order));
  const results=await env.DB.batch([update,insert]);
  if(!results[0]?.meta?.changes) return fail('Stok baru saja berubah. Muat ulang halaman lalu coba lagi.',409);
  if(session?.role==='customer'&&body.saveAddress) {
    const account=await getAccount(env,phone),addresses=JSON.parse(account?.addresses_json||'[]');
    if(!addresses.includes(address)) addresses.unshift(address);
    await env.DB.prepare('UPDATE accounts SET name=?,addresses_json=? WHERE phone=?').bind(name,JSON.stringify(addresses.slice(0,10)),phone).run();
  }
  return json({order,stock},201);
}
async function getOwnerState(env,session) {
  const state=await getState(env),orders=await getOrders(env),account=await getAccount(env,session.phone);
  return json({settings:state.settings,stock:state.stock,ledger:state.ledger,orders,owner:{phone:account.phone,name:account.name}});
}
async function saveOwnerState(request,env) {
  const body=await parseJson(request),old=await getState(env),settings={...old.settings,...(body.settings||{})},stock={...old.stock,...(body.stock||{})};
  settings.shippingFee=SHIPPING_FEE;settings.freeShippingSubtotal=FREE_SHIPPING;
  for(const id of Object.keys(PRODUCT_NAMES)) stock[id]=Math.max(0,Math.round(Number(stock[id])||0));
  const media=await saveSettingsAndMedia(env,settings),ledger=Array.isArray(body.ledger)?body.ledger.slice(-500):old.ledger;
  const stmt=env.DB.prepare('UPDATE site_state SET settings_json=?,stock_json=?,ledger_json=?,updated_at=? WHERE id=1')
    .bind(JSON.stringify(media.settings),JSON.stringify(stock),JSON.stringify(ledger),nowIso());
  await env.DB.batch([...media.statements,stmt]);
  return json({settings:media.settings,stock,ledger});
}
async function updateOwnerOrder(request,env,id) {
  const orderRow=await env.DB.prepare('SELECT data_json FROM orders WHERE id=?').bind(id).first();
  if(!orderRow) return fail('Pesanan tidak ditemukan.',404);
  const body=await parseJson(request),order=JSON.parse(orderRow.data_json),allowed=['status','paymentStatus','paidAt','deliveredAt','courierActualCost','ownerNote','excludedFromFinance','financeExclusionReason','financeExcludedAt'];
  const statuses=new Set(['Menunggu pembayaran','Menunggu verifikasi pembayaran','Pembayaran diverifikasi','Disiapkan','Dalam pengiriman','Selesai','Dibatalkan']);
  if(body.status!==undefined&&!statuses.has(body.status)) return fail('Status pesanan tidak valid.');
  for(const key of allowed) if(body[key]!==undefined) order[key]=body[key];
  if(order.status==='Selesai'&&!order.deliveredAt) order.deliveredAt=nowIso();
  await env.DB.prepare('UPDATE orders SET status=?,data_json=? WHERE id=?').bind(order.status,JSON.stringify(order),id).run();
  return json({order});
}
async function updatePayment(request,env,id,session) {
  const row=await env.DB.prepare('SELECT phone,data_json FROM orders WHERE id=?').bind(id).first();
  if(!row) return fail('Pesanan tidak ditemukan.',404);
  const body=await parseJson(request),provided=normalizePhone(body.phone||session?.phone);
  if(session?.role!=='owner'&&provided!==row.phone) return fail('Nomor WhatsApp tidak cocok dengan pesanan ini.',403);
  const order=JSON.parse(row.data_json),payerName=String(body.payerName||'').trim().slice(0,80);
  if(!payerName) return fail('Isi nama pada pembayaran.');
  if(body.proof!==undefined) {
    if(!validImageData(body.proof)) return fail('Foto bukti tidak valid atau terlalu besar.');
    order.proof=body.proof;
  }
  if(!order.proof) return fail('Pilih foto bukti pembayaran.');
  order.payerName=payerName;order.paymentStatus='Menunggu verifikasi';order.status='Menunggu verifikasi pembayaran';
  await env.DB.prepare('UPDATE orders SET status=?,data_json=? WHERE id=?').bind(order.status,JSON.stringify(order),id).run();
  return json({order});
}
async function ownerProfile(request,env,session) {
  const body=await parseJson(request),phone=normalizePhone(body.phone),name=String(body.name||'').trim().slice(0,80),pin=String(body.pin||'');
  if(!validPhone(phone)||!name) return fail('Isi nama dan nomor WhatsApp yang valid.');
  if(!APPROVED_OWNER_PHONES.has(phone)) return fail('Nomor akun pemilik harus salah satu nomor admin usaha.');
  const account=await getAccount(env,session.phone);
  if(!account||account.role!=='owner') return fail('Sesi pemilik tidak ditemukan.',401);
  try {
    if(pin) {
      if(!normalizePin(pin)) return fail('PIN baru harus terdiri dari 6 angka.');
      if(!hasPinPepper(env)) return fail('Rahasia PIN belum disetel. Tambahkan Secret PIN_PEPPER di Cloudflare.',503);
      const salt=randomHex(16),hash=await hashPin(pin,salt,env);
      await env.DB.prepare('UPDATE accounts SET phone=?,name=?,pin_salt=?,pin_hash=? WHERE phone=?').bind(phone,name,salt,hash,session.phone).run();
    } else await env.DB.prepare('UPDATE accounts SET phone=?,name=? WHERE phone=?').bind(phone,name,session.phone).run();
    await env.DB.prepare('UPDATE sessions SET phone=? WHERE token_hash=?').bind(phone,session.tokenHash).run();
  } catch(error) { if(String(error).includes('UNIQUE')) return fail('Nomor WhatsApp sudah dipakai akun lain.',409); throw error; }
  return json({owner:{phone,name}});
}
async function dispatch(request,env) {
  if(!env.DB) return fail('Database D1 belum dihubungkan dengan binding bernama DB.',503);
  const url=new URL(request.url),path=url.pathname,method=request.method;
  if(path==='/api/bootstrap'&&method==='GET') {
    const state=await getState(env),owner=await env.DB.prepare("SELECT phone FROM accounts WHERE role='owner' LIMIT 1").first();
    return json({settings:publicSettings(state.settings),stock:state.stock,ownerExists:Boolean(owner)});
  }
  if(path==='/api/auth/customer/register'&&method==='POST') {
    const body=await parseJson(request);return await createAccount(env,{phone:normalizePhone(body.phone),name:body.name,pin:body.pin,role:'customer',address:body.address});
  }
  if(path==='/api/auth/owner/register'&&method==='POST') {
    const body=await parseJson(request);
    if(typeof env.OWNER_SETUP_CODE!=='string'||env.OWNER_SETUP_CODE.length<32) return fail('Kode aktivasi pemilik belum disetel dengan aman di Cloudflare.',503);
    if(typeof body.setupCode!=='string'||body.setupCode!==env.OWNER_SETUP_CODE) return fail('Kode aktivasi pemilik tidak cocok.',403);
    const created=await createAccount(env,{phone:normalizePhone(body.phone),name:body.name,pin:body.pin,role:'owner'});
    if(created.status===201) await env.DB.prepare("UPDATE site_state SET updated_at=? WHERE id=1").bind(nowIso()).run();
    return created;
  }
  if(path==='/api/auth/login'&&method==='POST') return await login(request,env);
  if(path==='/api/auth/logout'&&method==='POST') {
    const token=parseCookie(request,COOKIE);if(token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await digestHex(token)).run();
    return json({ok:true},200,{'set-cookie':`${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`});
  }
  if(path==='/api/session'&&method==='GET') {
    const session=await readSession(request,env);if(!session) return json({user:null});
    if(session.role==='owner') return json({user:{phone:session.phone,role:'owner',name:session.name}});
    const orders=await getOrders(env,session.phone);
    return json({user:{phone:session.phone,role:'customer',name:session.name,addresses:session.addresses,orders}});
  }
  if(path==='/api/owner/state'&&method==='GET') {
    const session=await requireRole(request,env,'owner');if(!session) return fail('Masuk sebagai pemilik untuk membuka data ini.',401);
    return await getOwnerState(env,session);
  }
  if(path==='/api/owner/state'&&method==='PUT') {
    const session=await requireRole(request,env,'owner');if(!session) return fail('Sesi pemilik berakhir. Masuk lagi.',401);
    return await saveOwnerState(request,env);
  }
  if(path==='/api/owner/profile'&&method==='PUT') {
    const session=await requireRole(request,env,'owner');if(!session) return fail('Sesi pemilik berakhir. Masuk lagi.',401);
    return await ownerProfile(request,env,session);
  }
  const ownerOrder=path.match(/^\/api\/owner\/orders\/([^/]+)$/);
  if(ownerOrder&&method==='PATCH') {
    if(!await requireRole(request,env,'owner')) return fail('Masuk sebagai pemilik untuk mengubah pesanan.',401);
    return await updateOwnerOrder(request,env,decodeURIComponent(ownerOrder[1]));
  }
  const ledgerDelete=path.match(/^\/api\/owner\/ledger\/([^/]+)$/);
  if(ledgerDelete&&method==='DELETE') {
    if(!await requireRole(request,env,'owner')) return fail('Masuk sebagai pemilik untuk mengubah laporan.',401);
    const state=await getState(env),id=decodeURIComponent(ledgerDelete[1]);
    const ledger=state.ledger.filter(item=>item.id!==id);
    await env.DB.prepare('UPDATE site_state SET ledger_json=?,updated_at=? WHERE id=1').bind(JSON.stringify(ledger),nowIso()).run();
    return json({ledger});
  }
  if(path==='/api/owner/ledger'&&method==='POST') {
    if(!await requireRole(request,env,'owner')) return fail('Masuk sebagai pemilik untuk mencatat biaya.',401);
    const body=await parseJson(request),entry=body.entry;
    if(!entry||!entry.id||!Number(entry.amount)||Number(entry.amount)<1) return fail('Catatan biaya tidak valid.');
    const state=await getState(env),ledger=[entry,...state.ledger.filter(item=>item.id!==entry.id)].slice(0,500);
    await env.DB.prepare('UPDATE site_state SET ledger_json=?,updated_at=? WHERE id=1').bind(JSON.stringify(ledger),nowIso()).run();
    return json({entry,ledger},201);
  }
  if(path==='/api/orders'&&method==='POST') {
    const session=await readSession(request,env);return await createOrder(request,env,session);
  }
  const payment=path.match(/^\/api\/orders\/([^/]+)\/payment$/);
  if(payment&&method==='POST') return await updatePayment(request,env,decodeURIComponent(payment[1]),await readSession(request,env));
  const orderPath=path.match(/^\/api\/orders\/([^/]+)$/);
  if(orderPath&&method==='GET') {
    const id=decodeURIComponent(orderPath[1]),row=await env.DB.prepare('SELECT phone,data_json FROM orders WHERE id=?').bind(id).first();
    if(!row) return fail('Nomor pesanan tidak ditemukan.',404);
    const session=await readSession(request,env),phone=normalizePhone(url.searchParams.get('phone')||session?.phone);
    if(session?.role!=='owner'&&phone!==row.phone) return fail('Masukkan nomor WhatsApp pemesan untuk melihat struk.',403);
    return json({order:JSON.parse(row.data_json)});
  }
  const media=path.match(/^\/api\/media\/([a-z0-9_-]+(?:\/[a-z0-9_-]+)?)$/i);
  if(media&&method==='GET') {
    const row=await env.DB.prepare('SELECT data_url FROM media WHERE media_key=?').bind(media[1]).first();
    if(!row) return fail('Gambar tidak ditemukan.',404);
    const match=row.data_url.match(/^data:(image\/(?:png|jpeg|webp|gif));base64,([\s\S]+)$/i);
    if(!match) return fail('Format media tidak didukung.',415);
    const binary=atob(match[2]),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    return new Response(bytes,{headers:{'content-type':match[1],'cache-control':'public, max-age=86400'}});
  }
  if(path==='/api/account/addresses'&&method==='PUT') {
    const session=await requireRole(request,env,'customer');if(!session) return fail('Masuk sebagai pelanggan untuk mengubah alamat.',401);
    const body=await parseJson(request),addresses=Array.isArray(body.addresses)?body.addresses.map(v=>String(v).trim().slice(0,1000)).filter(Boolean).slice(0,10):[];
    await env.DB.prepare('UPDATE accounts SET addresses_json=? WHERE phone=?').bind(JSON.stringify(addresses),session.phone).run();
    return json({addresses});
  }
  return fail('Alamat API tidak ditemukan.',404);
}

export default {
  async fetch(request,env) {
    const url=new URL(request.url);
    if(url.pathname.startsWith('/api/')) {
      try { return await dispatch(request,env); }
      catch(error) { return fail(error?.message||'Terjadi kesalahan pada server.',500); }
    }
    return env.ASSETS.fetch(request);
  }
};
