(() => {
  'use strict';

  const STORE = 'ksb-site-v2';
  const OWNER_STORE = 'ksb-owner-account-v2';
  const OWNER_SESSION = 'ksb-owner-session-v2';
  const CUSTOMER_SESSION = 'ksb-customer-phone-v2';
  const WEIGHT_OPTIONS = [100, 200, 300];
  const PRODUCTS = [
    {id:'obor',name:'Kerupuk Pangsit',desc:'Lembaran pangsit goreng yang tipis dan renyah untuk racikan seblak.',art:'pangsit'},
    {id:'rante',name:'Kerupuk Rante',desc:'Bentuk bertaut yang kriuk dan seru dicampur.',art:'rante'},
    {id:'mawarputih',name:'Kerupuk Mawar Putih (Rafael)',desc:'Bentuk bunga berwarna putih, cocok untuk seblak.',art:'mawarputih'},
    {id:'mawarwarna',name:'Kerupuk Mawar Warna',desc:'Kerupuk warna-warni dengan bentuk bunga.',image:'https://upload.wikimedia.org/wikipedia/commons/1/16/Kerupuk_Bawang_warna_Warni.jpg',credit:'SATELITBM · CC BY-SA 4.0'},
    {id:'bintang',name:'Kerupuk Bintang',desc:'Bentuk bintang kecil dengan tekstur renyah.',art:'bintang'},
    {id:'spiral',name:'Makaroni Spiral',desc:'Makaroni berpilin yang menyerap bumbu.',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Fusilli_and_Penne_Pasta.jpg?width=1100',credit:'Rubel Das · CC0'},
    {id:'bawangwarna',name:'Kerupuk Bawang Warna',desc:'Cita rasa bawang dengan warna yang ceria.',image:'https://upload.wikimedia.org/wikipedia/commons/7/70/Kerepek_Bawang.jpg',credit:'Mdsheth1986 · CC BY-SA 4.0'},
    {id:'jengkol',name:'Kerupuk Jengkol Asbes',desc:'Aroma jengkol khas untuk campuran yang berani.',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Kerupuk_Jengkol_dan_Beras.jpg?width=1100',credit:'Ruswandi1971 · CC BY-SA 4.0'},
    {id:'pipa',name:'Makaroni Bantat / Pipa',desc:'Bentuk pipa yang padat dan kriuk berbumbu.',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Macaroni.png?width=1100',credit:'Jerimee · CC0'}
  ];
  const INGREDIENTS = [
    {id:'atom',name:'Bumbu Atom Bulan',mark:'✦',color:'#9a682e'},
    {id:'kencur',name:'Kencur bubuk',mark:'✿',color:'#71804d'},
    {id:'aida',name:'Cabai bubuk Aida',mark:'♨',color:'#ad3828'},
    {id:'rawit',name:'Cabai rawit kering giling',mark:'🌶',color:'#bd3d2d'},
    {id:'bawang-goreng',name:'Bawang putih goreng halus',mark:'✷',color:'#ad8650'},
    {id:'daun-jeruk',name:'Bumbu daun jeruk',mark:'❋',color:'#54784b'},
    {id:'bbq',name:'Bumbu BBQ',mark:'✹',color:'#81523b'},
    {id:'jagung-bakar',name:'Bumbu Jagung Bakar',mark:'✹',color:'#b17a26'},
    {id:'balado',name:'Bumbu Balado Pedas Manis',mark:'●',color:'#9b292d'},
    {id:'keju',name:'Bumbu keju',mark:'✧',color:'#d2a33e'}
  ];
  const SIGNATURES = [
    {id:'original',name:'Bandung Signature',mark:'✦',color:'#9a682e',recipe:[{id:'atom',min:1,max:1,note:'peres'},{id:'kencur',min:.5,max:.5},{id:'aida',min:.5,max:.75},{id:'bawang-goreng',min:.25,max:1/3}]},
    {id:'pedas',name:'Cikur Jeletot',mark:'♨',color:'#ad3828',recipe:[{id:'atom',min:1,max:1},{id:'kencur',min:.75,max:.75},{id:'aida',min:1,max:1},{id:'rawit',min:.75,max:1,note:'BonCabe, giling kasar'}]},
    {id:'jeruk',name:'Bandung Jeruk',mark:'✿',color:'#54784b',recipe:[{id:'atom',min:1,max:1,note:'peres'},{id:'kencur',min:.5,max:.5},{id:'aida',min:.5,max:.75},{id:'daun-jeruk',min:.75,max:1}]},
    {id:'bbq',name:'BBQ Bandung Fusion',mark:'✷',color:'#81523b',recipe:[{id:'atom',min:.5,max:.75},{id:'kencur',min:.25,max:1/3},{id:'aida',min:.5,max:.5},{id:'bbq',min:1.5,max:1.5}]},
    {id:'jagung',name:'Jagung Bakar Bandung',mark:'✹',color:'#b17a26',recipe:[{id:'atom',min:.5,max:.75},{id:'kencur',min:.25,max:1/3},{id:'aida',min:.25,max:1/3},{id:'jagung-bakar',min:1.5,max:1.5}]},
    {id:'balado',name:'Balado Daun Jeruk',mark:'●',color:'#9b292d',recipe:[{id:'atom',min:.5,max:.75},{id:'kencur',min:.125,max:.125,note:'sejumput'},{id:'aida',min:.25,max:1/3},{id:'balado',min:1.25,max:1.25},{id:'daun-jeruk',min:.5,max:.75}]}
  ];
  const LEGACY_INGREDIENT_IDS={original:'atom',pedas:'aida',jeruk:'daun-jeruk',bbq:'bbq',jagung:'jagung-bakar',balado:'balado'};
  const SPOONS = [
    {value:.125,label:'1/8 sdt · sejumput'},
    {value:.25,label:'1/4 sdt'},
    {value:1/3,label:'1/3 sdt'},
    {value:.5,label:'1/2 sdt'},
    {value:2/3,label:'2/3 sdt'},
    {value:.75,label:'3/4 sdt'},
    {value:1,label:'1 sdt'},
    {value:1.25,label:'1 1/4 sdt'},
    {value:1.5,label:'1 1/2 sdt'},
    {value:2,label:'2 sdt'}
  ];
  const BASE = {
    settings:{pricePer100g:11900,hppPer100g:0,pouchCost:0,shippingFee:10000,freeShippingSubtotal:70000,maxPackagesDay:30,initialCash:0,payee:'Trio Seblak',whatsapp:'',qrisImage:'',heroImage:'',brandLogo:'',flavorImages:{},ingredientImages:{},productImages:{},paymentNote:'Scan QRIS dan unggah bukti pembayaran. Pesanan menunggu verifikasi pemilik.'},
    stock:Object.fromEntries(PRODUCTS.map(item=>[item.id,50000])),orders:[],customers:[],ledger:[],cart:[],
    builder:{selected:[],weight:100,mode:'signature',flavor:'original',spoons:1,seasonings:{},quantity:1}
  };
  function clone(value){return JSON.parse(JSON.stringify(value));}
  function readState(){
    const base=clone(BASE);
    try{
      const saved=JSON.parse(localStorage.getItem(STORE)||'null');if(!saved)return base;
      const builder={...base.builder,...(saved.builder||{})};
      if(!builder.mode)builder.mode='signature';
      if(!SIGNATURES.some(item=>item.id===builder.flavor))builder.flavor='original';
      const previousSeasonings=builder.seasonings||{};builder.seasonings={};
      Object.entries(previousSeasonings).forEach(([id,amount])=>{const ingredientId=LEGACY_INGREDIENT_IDS[id]||id;if(INGREDIENTS.some(item=>item.id===ingredientId)&&Number(amount)>0)builder.seasonings[ingredientId]=Number(amount);});
      const settings={...base.settings,...(saved.settings||{}),shippingFee:10000,freeShippingSubtotal:70000,pricePer100g:Number((saved.settings||{}).pricePer100g)||base.settings.pricePer100g,brandLogo:(saved.settings||{}).brandLogo||'',flavorImages:{...base.settings.flavorImages,...((saved.settings||{}).flavorImages||{})},ingredientImages:{...base.settings.ingredientImages,...((saved.settings||{}).ingredientImages||{})},productImages:{...base.settings.productImages,...((saved.settings||{}).productImages||{})}};
      delete settings.minSubtotal;delete settings.shippingTiers;delete settings.distanceLabels;delete settings.origin;
      const orders=Array.isArray(saved.orders)?saved.orders:[],cart=Array.isArray(saved.cart)?saved.cart:[];
      [...orders,...cart].forEach(record=>(record.items||[]).forEach(item=>(item.mix||[]).forEach(part=>{if(part.id==='obor')part.name='Kerupuk Pangsit';})));
      cart.forEach(item=>(item.mix||[]).forEach(part=>{if(part.id==='obor')part.name='Kerupuk Pangsit';}));
      return {...base,...saved,settings,stock:{...base.stock,...(saved.stock||{})},builder,orders,customers:Array.isArray(saved.customers)?saved.customers:[],ledger:Array.isArray(saved.ledger)?saved.ledger:[],cart};
    }catch(_){return base;}
  }
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const money=value=>'Rp'+Math.max(0,Math.round(Number(value)||0)).toLocaleString('id-ID');
  const fmtNumber=value=>new Intl.NumberFormat('id-ID',{maximumFractionDigits:1}).format(Number(value)||0);
  const escapeHTML=value=>String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const localDate=value=>{const d=value instanceof Date?value:new Date(value);if(isNaN(d))return todayISO();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
  const todayISO=()=>localDate(new Date());
  const monthStart=()=>todayISO().slice(0,7)+'-01';
  const dateLabel=value=>new Date(String(value).slice(0,10)+'T12:00:00').toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const CLOUD=window.KSBCloud;
  let state=readState(),toastTimer=null,activeStep='login',activeAdminTab='orders',activeLedgerTab='operational',dateStart=monthStart(),dateEnd=todayISO();
  let cloudMode=false,cloudReady=false,cloudRole=null,cloudUser=null,cloudOwnerExists=false;
  function persist(){
    try{localStorage.setItem(STORE,JSON.stringify(state));}catch(_){toast('Penyimpanan browser penuh.');return false;}
    return true;
  }
  function applyCloudData(user,ownerData=null){
    cloudMode=true;cloudReady=true;cloudRole=user?.role||null;cloudUser=user||null;cloudOwnerExists=CLOUD.ownerExists;
    if(ownerData){
      state.settings={...BASE.settings,...ownerData.settings};state.stock={...BASE.stock,...ownerData.stock};state.orders=ownerData.orders||[];state.ledger=ownerData.ledger||[];state.owner=ownerData.owner;
      state.customers=[];
    }else if(user?.role==='customer'){
      state.customers=[{phone:user.phone,name:user.name,addresses:user.addresses||[]}];state.orders=user.orders||[];state.ledger=[];
    }else{
      state.settings={...BASE.settings,...(CLOUD.bootstrapSettings||{})};state.stock={...BASE.stock,...(CLOUD.bootstrapStock||{})};state.orders=[];state.ledger=[];state.customers=[];delete state.owner;
    }
    state.settings.shippingFee=10000;state.settings.freeShippingSubtotal=70000;
    try{localStorage.setItem(STORE,JSON.stringify(state));}catch(_){}
    renderBrandImages();if(state.settings.heroImage)$('.hero-visual>img').src=state.settings.heroImage;
    renderBuilder();updateCartUi();
  }
  async function refreshCloudOwner(){
    if(!cloudMode||cloudRole!=='owner')return;
    const snapshot=await CLOUD.loadOwnerState();applyCloudData(cloudUser,snapshot);
    renderAdmin(activeAdminTab);
  }
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200);}
  function showModal(html,wide=false){$('.modal-panel').classList.toggle('wide',wide);$('#modalBody').innerHTML=html;$('#modalBackdrop').hidden=false;document.body.style.overflow='hidden';const first=$('#modalBody').querySelector('input:not([type=file]),button,textarea,select');if(first)setTimeout(()=>first.focus(),30);}
  function closeModal(){ $('#modalBackdrop').hidden=true;$('#modalBody').innerHTML='';document.body.style.overflow=''; }
  function spoonAmount(value){const number=Number(value)||0,known=[[.125,'1/8'],[.25,'1/4'],[1/3,'1/3'],[.5,'1/2'],[2/3,'2/3'],[.75,'3/4'],[1,'1'],[1.25,'1 1/4'],[1.5,'1 1/2'],[2,'2']].find(([amount])=>Math.abs(number-amount)<.001);return known?known[1]:fmtNumber(number);}
  function spoonRange(row){const min=Number(row.min??row.spoons)||0,max=Number(row.max??row.spoons)||0;return Math.abs(min-max)<.001?spoonAmount(min):spoonAmount(min)+'–'+spoonAmount(max);}
  function productName(id){return PRODUCTS.find(item=>item.id===id)?.name||id;}
  function ingredientId(id){return LEGACY_INGREDIENT_IDS[id]||id;}
  function ingredientName(id){return INGREDIENTS.find(item=>item.id===ingredientId(id))?.name||id;}
  function flavorName(id){return ingredientName(id);}
  function brandImage(){return state.settings.brandLogo||'assets/brand-mark.png';}
  function renderBrandImages(){const src=brandImage();$$('[data-brand-logo]').forEach(img=>{img.src=src;});const favicon=$('#siteFavicon');if(favicon)favicon.href=src;}
  function flavorIcon(item,ingredient=false){const src=(ingredient?state.settings.ingredientImages:state.settings.flavorImages)?.[item.id];return src?'<img class="flavor-image" src="'+escapeHTML(src)+'" alt="">':item.mark;}
  function builderSeasonings(){
    if(state.builder.mode==='signature'){
      const signature=SIGNATURES.find(item=>item.id===state.builder.flavor)||SIGNATURES[0];
      return signature.recipe.map(row=>({...row,spoons:(Number(row.min)+Number(row.max))/2}));
    }
    return INGREDIENTS.filter(item=>Number(state.builder.seasonings?.[item.id])>0).map(item=>({id:item.id,spoons:Number(state.builder.seasonings[item.id])}));
  }
  function itemSeasonings(item){
    if(item.seasoningMode==='signature'||item.signatureId){
      const signature=SIGNATURES.find(row=>row.id===(item.signatureId||item.flavor));
      if(signature)return signature.recipe.map(row=>({...row,spoons:(Number(row.min)+Number(row.max))/2}));
    }
    if(Array.isArray(item.seasonings)&&item.seasonings.length)return item.seasonings.map(row=>({...row,id:ingredientId(row.id)}));
    return [{id:ingredientId(item.flavor||'original'),spoons:Number(item.spoons)||1}];
  }
  function signatureFormula(signature){return signature.recipe.map(row=>ingredientName(row.id)+' '+spoonRange(row)+' sdt'+(row.note?' ('+row.note+')':'')).join(' · ');}
  function seasoningLabel(item){
    if(item.seasoningMode==='signature'||item.signatureId){const signature=SIGNATURES.find(row=>row.id===(item.signatureId||item.flavor))||SIGNATURES[0];return signature.name+': '+signatureFormula(signature)+' / 100 g';}
    return itemSeasonings(item).map(row=>ingredientName(row.id)+' '+spoonAmount(row.spoons)+' sdt/100 g').join(' + ');
  }
  function totalSeasoningLabel(weight,seasonings){const factor=Number(weight||0)/100,min=seasonings.reduce((sum,row)=>sum+Number(row.min??row.spoons??0),0)*factor,max=seasonings.reduce((sum,row)=>sum+Number(row.max??row.spoons??0),0)*factor;return Math.abs(min-max)<.001?spoonAmount(min)+' sdt total per bungkus':spoonAmount(min)+'–'+spoonAmount(max)+' sdt total per bungkus';}
  function priceFor(weight){return Math.round((Number(state.settings.pricePer100g)||0)*(Number(weight)||0)/100);}
  function stockGrams(id){return Math.max(0,Number(state.stock[id])||0);}
  function selectedCrackers(){return state.builder.selected.map(id=>PRODUCTS.find(item=>item.id===id)).filter(Boolean);}
  function gramsPerType(weight,count){return count?weight/count:0;}
  function renderCrackers(){
    $('#crackerGrid').innerHTML=PRODUCTS.map(item=>{
      const selected=state.builder.selected.includes(item.id),customImage=state.settings.productImages?.[item.id],imageUrl=customImage||item.image,visual=imageUrl?'<img src="'+imageUrl+'" alt="'+(customImage?'Foto produk ':'Foto rujukan ')+escapeHTML(item.name)+'" loading="lazy"><span class="image-caption">'+(customImage?'FOTO PRODUK':'FOTO RUJUKAN · '+escapeHTML(item.credit||'Wikimedia Commons'))+'</span>':'<div class="cracker-illustration">'+shapeArt(item.art)+'</div>';
      return '<label class="cracker-card '+(selected?'selected':'')+'"><input type="checkbox" data-cracker="'+item.id+'" '+(selected?'checked':'')+'><div class="cracker-photo">'+visual+'</div><div class="cracker-card-body"><h3>'+escapeHTML(item.name)+'</h3><p>'+escapeHTML(item.desc)+'</p><span class="check-label"><i>'+(selected?'✓':'+')+'</i> '+(selected?'Terpilih':'Pilih kerupuk')+'</span></div></label>';
    }).join('');
    updateMixSummary();
  }
  function shapeArt(type){
    if(type==='rante')return '<svg viewBox="0 0 180 130" role="img" aria-label="Ilustrasi kerupuk rantai"><g fill="none" stroke="#a7352e" stroke-width="17" stroke-linecap="round"><path d="M35 29c-15 0-22 10-22 22s7 22 22 22h24c15 0 22 10 22 22s-7 22-22 22H35"/><path d="M85 20c-15 0-22 10-22 22s7 22 22 22h24c15 0 22 10 22 22s-7 22-22 22H85"/><path d="M133 29c-15 0-22 10-22 22s7 22 22 22h24"/></g><g fill="none" stroke="#f1d39c" stroke-width="3"><path d="M35 29c-15 0-22 10-22 22s7 22 22 22h24c15 0 22 10 22 22s-7 22-22 22H35"/><path d="M85 20c-15 0-22 10-22 22s7 22 22 22h24c15 0 22 10 22 22s-7 22-22 22H85"/></g></svg>';
    if(type==='mawarputih')return '<svg viewBox="0 0 180 130" role="img" aria-label="Ilustrasi kerupuk mawar putih"><g fill="#fffaf0" stroke="#c6a97b" stroke-width="2"><path d="M90 22c16-25 39-5 25 15 30-4 31 24 5 30 23 16 5 38-17 22 0 28-29 28-28 0-22 16-40-6-17-22-27-6-26-34 4-30-14-20 9-40 28-15z"/><circle cx="90" cy="65" r="16"/><path d="M45 98c10-15 21-16 31-4M104 38c13-11 21-8 28 2" fill="none"/></g></svg>';
    if(type==='pangsit')return '<svg viewBox="0 0 180 130" role="img" aria-label="Ilustrasi kerupuk pangsit"><g fill="#e9bd79" stroke="#9b542f" stroke-width="3" stroke-linejoin="round"><path d="M22 93 55 27l44 62-31 22z"/><path d="m75 95 35-69 49 62-38 23z"/><path d="m46 55 27 38-32 21-23-20z"/></g><g fill="none" stroke="#f9e6bd" stroke-width="3" stroke-linecap="round"><path d="m56 34 27 51M112 37l32 43M39 88l23-16M91 100l22-14"/></g></svg>';
    return '<svg viewBox="0 0 180 130" role="img" aria-label="Ilustrasi kerupuk bintang"><g fill="#f7e7bf" stroke="#b67d3c" stroke-width="3" stroke-linejoin="round"><path d="M37 24l13 24 27-4-17 21 13 25-26-11-19 19 3-28-25-13 27-5z"/><path d="M117 17l10 19 21-3-13 16 10 19-20-8-15 15 2-22-19-10 21-4z"/><path d="M104 78l8 14 16-2-10 12 7 15-15-6-11 11 1-16-14-7 16-3z"/></g></svg>';
  }
  function renderWeightOptions(){
    $('#weightGrid').innerHTML=WEIGHT_OPTIONS.map(weight=>'<label class="weight-option '+(Number(state.builder.weight)===weight?'selected':'')+'"><input type="radio" name="weight" value="'+weight+'" '+(Number(state.builder.weight)===weight?'checked':'')+'><strong>'+weight+' g</strong><small>'+money(priceFor(weight))+'</small></label>').join('');
  }
  function renderFlavors(){
    const custom=state.builder.mode==='custom',flavorGrid=$('#flavorGrid'),spoonGrid=$('#spoonGrid');
    $('#seasoningBox').dataset.mode=custom?'custom':'signature';
    $$('[data-action="seasoning-mode"]').forEach(button=>button.classList.toggle('active',button.dataset.mode===state.builder.mode));
    flavorGrid.hidden=custom;
    if(custom){
      flavorGrid.innerHTML='';
      spoonGrid.classList.add('seasoning-custom');
      spoonGrid.innerHTML=INGREDIENTS.map(item=>{const amount=Number(state.builder.seasonings?.[item.id])||0,selected=amount>0;return '<div class="seasoning-row '+(selected?'selected':'')+'"><label><input type="checkbox" name="seasoning" value="'+item.id+'" '+(selected?'checked':'')+'><i class="flavor-dot" style="--flavor-bg:'+item.color+'20;--flavor-color:'+item.color+'">'+flavorIcon(item,true)+'</i><strong>'+escapeHTML(item.name)+'</strong></label><select data-seasoning-spoons="'+item.id+'" '+(selected?'':'disabled')+'>'+SPOONS.map(option=>'<option value="'+option.value+'" '+(Math.abs(amount-option.value)<.001?'selected':'')+'>'+option.label+' / 100 g</option>').join('')+'</select></div>';}).join('');
    }else{
      spoonGrid.classList.remove('seasoning-custom');
      flavorGrid.innerHTML=SIGNATURES.map(item=>'<label class="flavor-option signature-option '+(state.builder.flavor===item.id?'selected':'')+'"><input type="radio" name="flavor" value="'+item.id+'" '+(state.builder.flavor===item.id?'checked':'')+'><i class="flavor-dot" style="--flavor-bg:'+item.color+'20;--flavor-color:'+item.color+'">'+flavorIcon(item)+'</i><span><strong>'+escapeHTML(item.name)+'</strong><small>'+escapeHTML(signatureFormula(item))+' / 100 g</small></span></label>').join('');
      const chosen=SIGNATURES.find(item=>item.id===state.builder.flavor)||SIGNATURES[0];
      spoonGrid.innerHTML='<div class="signature-note"><span>✦</span><div><strong>Signature Trio · '+escapeHTML(chosen.name)+'</strong><small>Takaran racikan per 100 g: '+escapeHTML(signatureFormula(chosen))+'. Untuk menentukan jumlah sendiri, pilih “Racik sendiri”.</small></div></div>';
    }
  }
  function updateMixSummary(){
    const count=state.builder.selected.length,weight=Number(state.builder.weight)||100;
    if(!count){$('#mixSummary').innerHTML='<span class="mix-summary-mark">✳</span><span><strong>Pilih kerupuk dulu</strong><small>Contoh: 3 jenis dipilih untuk 100 g → masing-masing 33,3 g</small></span><button data-action="clear-crackers">Reset pilihan</button>';$('#mixCalculation').innerHTML='Pilih jenis kerupuk di atas untuk melihat pembagian berat.';}
    else{
      const per=gramsPerType(weight,count),rows=state.builder.selected.map(id=>'<span>'+escapeHTML(productName(id))+' <strong>'+fmtNumber(per)+' g</strong></span>').join(' · ');
      $('#mixSummary').innerHTML='<span class="mix-summary-mark">✓</span><span><strong>'+count+' jenis dipilih · dibagi rata</strong><small>'+weight+' g ÷ '+count+' = '+fmtNumber(per)+' g per jenis</small></span><button data-action="clear-crackers">Reset pilihan</button>';
      $('#mixCalculation').innerHTML='<strong>Isi per pouch:</strong> '+rows+'. Berat akan disesuaikan ke total '+weight+' g.';
    }
    updateSummary();
  }
  function updateSummary(){
    const weight=Number(state.builder.weight)||100,quantity=Number(state.builder.quantity)||1,price=priceFor(weight),count=state.builder.selected.length,seasonings=builderSeasonings();
    $('#spoonTotal').textContent=seasonings.length?'Takaran '+totalSeasoningLabel(weight,seasonings)+'.':'Pilih satu atau lebih bumbu untuk racikan sendiri.';
    $('#unitPrice').textContent=money(price)+' / pouch';$('#summaryPrice').textContent=money(price*quantity);
    $('#summaryName').textContent=count?count+' jenis · '+weight+' g':'Kerupuk Seblak Racik Sendiri';
    const mix=count?state.builder.selected.map(id=>productName(id)+' '+fmtNumber(gramsPerType(weight,count))+' g').join('<br>'):'Belum pilih jenis kerupuk';
    $('#summaryDetails').innerHTML='<div class="summary-detail"><span>Kerupuk campur</span><span>'+count+' jenis</span></div><div class="summary-detail"><span>Racikan bumbu</span><span>'+escapeHTML(state.builder.mode==='signature'?'Signature Trio':'Racik sendiri')+'</span></div><div class="summary-detail seasoning-summary"><span>Bumbu</span><span>'+escapeHTML(seasonings.length?seasonings.map(row=>ingredientName(row.id)+' '+spoonRange(row)+' sdt').join(' + '):'Belum dipilih')+'</span></div><div class="summary-detail"><span>Berat tiap jenis</span><span>'+(count?fmtNumber(gramsPerType(weight,count))+' g':'—')+'</span></div><div class="summary-detail"><span>Jumlah</span><span>'+quantity+' pouch</span></div><div class="summary-mix">'+mix+'</div>';
    updateCartUi();persist();
  }
  function renderBuilder(){renderCrackers();renderWeightOptions();renderFlavors();$('#builderQuantity').textContent=String(state.builder.quantity);updateSummary();}
  function itemTotal(item){return Number(item.price||0)*Number(item.qty||0);}
  function cartSubtotal(){return state.cart.reduce((sum,item)=>sum+itemTotal(item),0);}
  function cartPackages(){return state.cart.reduce((sum,item)=>sum+Number(item.qty||0),0);}
  function updateCartUi(){
    const count=cartPackages();$('#cartCount').textContent=String(count);$('#dockCount').textContent=count+' pouch';$('#dockSubtotal').textContent=money(cartSubtotal());$('#cartDock').hidden=!count;
  }
  function addToCart(){
    if(!state.builder.selected.length){toast('Pilih minimal satu jenis kerupuk.');document.querySelector('#pilih-kerupuk').scrollIntoView({behavior:'smooth'});return;}
    const weight=Number(state.builder.weight),quantity=Math.max(1,Number(state.builder.quantity)||1),price=priceFor(weight);
    if(!price){toast('Harga ukuran ini belum diatur pemilik.');return;}
    const mix=state.builder.selected.map(id=>({id,name:productName(id),grams:gramsPerType(weight,state.builder.selected.length)}));
    const seasonings=builderSeasonings();if(!seasonings.length){toast('Pilih setidaknya satu bumbu.');return;}
    const flavor=state.builder.mode==='signature'?state.builder.flavor:seasonings[0].id;
    const seasoningKey=JSON.stringify(seasonings),existing=state.cart.find(item=>item.weight===weight&&item.seasoningMode===state.builder.mode&&JSON.stringify(itemSeasonings(item))===seasoningKey&&JSON.stringify(item.mix.map(x=>x.id))===JSON.stringify(mix.map(x=>x.id)));
    if(existing)existing.qty+=quantity;else state.cart.push({id:'item-'+Date.now().toString(36),weight,flavor,signatureId:state.builder.mode==='signature'?state.builder.flavor:null,spoons:seasonings[0].spoons,seasonings,seasoningMode:state.builder.mode,mix,qty:quantity,price});
    persist();updateCartUi();toast('Racikan ditambahkan ke tas.');
  }
  function shippingEstimate(_tierIndex,subtotal){return subtotal>=70000?0:(Number(state.settings.shippingFee)||10000);}
  function addDays(date,days){const d=new Date(String(date).slice(0,10)+'T12:00:00');d.setDate(d.getDate()+days);return localDate(d);}
  function packageCountForDate(date){return state.orders.filter(order=>order.deliveryDate===date&&!['Dibatalkan','Selesai'].includes(order.status)).reduce((sum,order)=>sum+Number(order.packages||order.items?.reduce((s,item)=>s+Number(item.qty||0),0)||0),0);}
  function estimateDelivery(packages){const tomorrow=addDays(todayISO(),1),cap=Math.max(1,Number(state.settings.maxPackagesDay)||30);return packageCountForDate(tomorrow)+packages>cap?addDays(tomorrow,1):tomorrow;}
  function totalHpp(item){const per100=Number(state.settings.hppPer100g)||0,bag=Number(state.settings.pouchCost)||0;return Math.round(per100*Number(item.weight||0)/100+bag);}
  function normalizedPhone(value){let phone=String(value||'').replace(/[^0-9]/g,'');if(phone.startsWith('0'))phone='62'+phone.slice(1);else if(phone.startsWith('8'))phone='62'+phone;return phone;}
  function currentCustomer(){
    if(cloudMode)return cloudRole==='customer'?state.customers.find(item=>item.phone===cloudUser?.phone)||null:null;
    const phone=sessionStorage.getItem(CUSTOMER_SESSION);return state.customers.find(item=>item.phone===phone)||null;
  }
  function ownerAuthorized(){return cloudMode?cloudRole==='owner':sessionStorage.getItem(OWNER_SESSION)==='active';}
  function openCart(){
    const rows=state.cart.map((item,index)=>'<article class="cart-line"><div><strong>'+item.weight+' g · '+escapeHTML(item.seasoningMode==='custom'?'Racik sendiri':'Signature Trio · rekomendasi owner')+'</strong><small>'+item.mix.map(row=>escapeHTML(row.name)+' '+fmtNumber(row.grams)+' g').join('<br>')+'<br>'+escapeHTML(seasoningLabel(item))+'<br>'+escapeHTML(totalSeasoningLabel(item.weight,itemSeasonings(item)))+' · '+item.qty+' pouch</small></div><div class="cart-line-actions"><b>'+money(itemTotal(item))+'</b><div><button class="small-button" data-action="cart-qty" data-index="'+index+'" data-delta="-1">−</button> '+item.qty+' <button class="small-button" data-action="cart-qty" data-index="'+index+'" data-delta="1">+</button></div><button class="link-button" data-action="remove-cart" data-index="'+index+'">Hapus</button></div></article>').join('');
    const free=cartSubtotal()>=70000,shipping=shippingEstimate(0,cartSubtotal());
    showModal('<div class="modal-eyebrow">RACIKANMU</div><h2 class="modal-title" id="modalTitle">Tas pesanan</h2><p class="modal-lead">Tidak ada minimum belanja. Ongkir Rp10.000 untuk semua jarak dan gratis jika subtotal produk mencapai Rp70.000.</p>'+(rows||'<div class="admin-empty">Tas masih kosong.</div>')+'<div class="modal-summary"><div class="summary-row"><span>Subtotal produk</span><b>'+money(cartSubtotal())+'</b></div><div class="summary-row"><span>Ongkir</span><b>'+(free?'Gratis':money(shipping))+'</b></div><div class="summary-row total"><span>Total</span><b>'+money(cartSubtotal()+shipping)+'</b></div></div><div class="modal-actions"><button class="button button-quiet" data-action="close">Lanjut pilih</button><button class="button button-gold" data-action="checkout" '+(!state.cart.length?'disabled':'')+'>Isi data & lanjut ↗</button></div>');
  }
  function checkoutForm(){
    if(!state.cart.length){openCart();return;}
    const customer=currentCustomer(),address=customer?.addresses?.[0]||'';
    const packages=cartPackages(),delivery=estimateDelivery(packages),ship=shippingEstimate(0,cartSubtotal()),total=cartSubtotal()+ship;
    showModal('<div class="modal-eyebrow">OPEN ORDER · '+escapeHTML(dateLabel(todayISO()))+'</div><h2 class="modal-title" id="modalTitle">Data pengantaran</h2><p class="modal-lead">Pesan tanpa akun, atau masuk dengan WhatsApp + PIN untuk memakai alamat tersimpan. Tidak ada minimum belanja. Ongkir tetap Rp10.000 dan gratis jika subtotal produk mencapai Rp70.000.</p><form id="checkoutForm"><div class="form-grid"><div class="field"><label for="customerName">Nama penerima *</label><input id="customerName" name="name" required maxlength="80" value="'+escapeHTML(customer?.name||'')+'"></div><div class="field"><label for="customerWa">Nomor WhatsApp *</label><input id="customerWa" name="phone" inputmode="tel" required maxlength="20" value="'+escapeHTML(customer?.phone||'')+'" placeholder="08xxxxxxxxxx"></div><div class="field full"><label for="customerAddress">Alamat lengkap *</label><textarea id="customerAddress" name="address" required rows="3" placeholder="Nama jalan, nomor rumah, kelurahan, kecamatan">'+escapeHTML(address)+'</textarea></div><div class="field"><label>Ongkos kirim</label><input value="'+(ship===0?'Gratis':'Rp10.000 · flat')+'" readonly><small>Gratis jika subtotal produk mencapai Rp70.000.</small></div><div class="field"><label>Estimasi pengantaran</label><input value="'+escapeHTML(dateLabel(delivery))+'" readonly></div><div class="field full"><label for="orderNote">Catatan untuk kurir / racikan</label><textarea id="orderNote" name="note" rows="2"></textarea></div></div><label class="checkbox-row"><input type="checkbox" name="saveAddress" '+(customer?'checked':'')+'><span>Simpan alamat ini ke profil pelanggan</span></label><div class="modal-summary"><div class="summary-row"><span>Subtotal produk</span><b>'+money(cartSubtotal())+'</b></div><div class="summary-row"><span>Ongkir</span><b id="checkoutShipping">'+(ship===0?'Gratis':money(ship))+'</b></div><div class="summary-row total"><span>Total pembayaran</span><b id="checkoutTotal">'+money(total)+'</b></div></div><div class="warning-note">Pengantaran paling cepat besok. Jika antrean padat, sistem menjadwalkan lusa.</div><div class="modal-actions"><button type="button" class="button button-quiet" data-action="cart">← Kembali ke tas</button><button class="button button-gold" type="submit">Buat pesanan ↗</button></div></form>');
  }
  function openAccount(){
    const customer=currentCustomer();if(customer){renderCustomerProfile(customer);return;}
    if(ownerAuthorized()){renderAdmin(activeAdminTab);return;}
    const isRegister=activeStep==='register';
    showModal('<div class="modal-eyebrow">AKUN · OPSIONAL</div><h2 class="modal-title" id="modalTitle">'+(isRegister?'Buat profil pelanggan':'Masuk dengan WhatsApp')+'</h2><p class="modal-lead">Gunakan nomor WhatsApp dan PIN untuk menyimpan alamat serta riwayat. Pemesanan tamu tetap bisa.</p><div class="tab-row"><button data-action="account-tab" data-tab="login" class="'+(!isRegister?'active':'')+'">Masuk</button><button data-action="account-tab" data-tab="register" class="'+(isRegister?'active':'')+'">Daftar</button></div><form id="customerForm">'+(isRegister?'<div class="field"><label for="profileName">Nama lengkap</label><input id="profileName" name="name" required maxlength="80"></div>':'')+'<div class="field"><label for="profileWa">Nomor WhatsApp</label><input id="profileWa" name="phone" inputmode="tel" required placeholder="08xxxxxxxxxx"></div><div class="field"><label for="profilePin">PIN 6 digit</label><input id="profilePin" name="pin" type="password" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" required autocomplete="current-password"></div>'+(isRegister?'<div class="field"><label for="profileAddress">Alamat utama (opsional)</label><textarea id="profileAddress" name="address" rows="2"></textarea></div>':'')+'<button class="button button-gold" type="submit">'+(isRegister?'Buat akun':'Masuk')+' ↗</button></form><div class="warning-note">'+(cloudReady?'Akun dan alamat tersimpan online, bisa dibuka di perangkat lain.':'Akun hanya dapat digunakan setelah server tersambung.')+'</div>');
  }
  function renderCustomerProfile(customer){
    const addresses=(customer.addresses||[]).map((address,index)=>'<div class="account-address"><p>'+escapeHTML(address)+'</p><button data-action="remove-address" data-index="'+index+'">Hapus</button></div>').join('')||'<p class="admin-empty">Belum ada alamat tersimpan.</p>';
    const orders=state.orders.filter(order=>normalizedPhone(order.customerPhone)===customer.phone).map(order=>'<article class="account-order"><div class="account-order-head"><span>'+escapeHTML(order.id)+'</span><span>'+escapeHTML(order.status)+'</span></div><p>'+escapeHTML(dateLabel(order.createdAt))+' · '+money(order.total)+'<br>'+order.items.map(item=>item.weight+' g × '+item.qty+' pouch · '+escapeHTML(seasoningLabel(item))).join('<br>')+'</p><div class="admin-order-actions"><button class="small-button" data-action="receipt" data-id="'+escapeHTML(order.id)+'">Lihat struk</button><button class="small-button" data-action="payment" data-id="'+escapeHTML(order.id)+'">Pembayaran</button></div></article>').join('')||'<p class="admin-empty">Belum ada pesanan dengan profil ini.</p>';
    showModal('<div class="modal-eyebrow">AKUN PELANGGAN</div><h2 class="modal-title" id="modalTitle">Halo, '+escapeHTML(customer.name)+'</h2><p class="modal-lead">WhatsApp: '+escapeHTML(customer.phone)+'</p><div class="tab-row"><button class="active">Alamat tersimpan</button><button>Riwayat pesanan</button></div><form id="addAddressForm"><div class="field"><label for="newAddress">Tambah alamat</label><textarea id="newAddress" name="address" rows="2" required></textarea></div><button class="small-button primary" type="submit">Simpan alamat</button></form><div style="display:grid;gap:7px;margin:12px 0">'+addresses+'</div><h3 style="color:#6f1824;font-family:Georgia,serif">Pesanan saya</h3>'+orders+'<div class="modal-actions"><button class="small-button" data-action="logout-customer">Keluar akun</button><button class="button button-quiet" data-action="close">Tutup</button></div>');
  }

  function randomSalt(){
    const bytes=new Uint8Array(16);
    if(globalThis.crypto?.getRandomValues)globalThis.crypto.getRandomValues(bytes);
    else for(let i=0;i<bytes.length;i++)bytes[i]=Math.floor(Math.random()*256);
    return Array.from(bytes).map(x=>x.toString(16).padStart(2,'0')).join('');
  }
  async function hashPin(pin,salt){
    const input=salt+':'+pin;
    if(globalThis.crypto?.subtle?.digest){
      const bytes=await globalThis.crypto.subtle.digest('SHA-256',new TextEncoder().encode(input));
      return Array.from(new Uint8Array(bytes)).map(x=>x.toString(16).padStart(2,'0')).join('');
    }
    // Local preview fallback only; this is not suitable for production authentication.
    let output='';
    for(let round=0;round<4;round++){
      let hash=2166136261;
      for(const char of input+':'+round){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}
      output+=(hash>>>0).toString(16).padStart(8,'0');
    }
    return output;
  }
  async function handleCustomerForm(form){
    const data=new FormData(form),phone=normalizedPhone(data.get('phone')),pin=String(data.get('pin')||'');
    if(phone.length<8||phone.length>15){toast('Periksa nomor WhatsApp.');return;}
    if(CLOUD.enabled&&!cloudReady){toast('Server belum tersambung. Coba lagi setelah koneksi pulih.');return;}
    if(cloudReady){
      try{
        if(activeStep==='register'){
          const user=await CLOUD.registerCustomer({phone,pin,name:String(data.get('name')||'').trim(),address:String(data.get('address')||'').trim()});
          applyCloudData(user);closeModal();toast('Akun tersimpan online dan bisa dibuka di perangkat lain.');return;
        }
        const result=await CLOUD.login({phone,pin});
        if(result.user.role==='owner'){
          applyCloudData(result.user,result.ownerData);activeAdminTab='orders';renderAdmin('orders');toast('Berhasil masuk ke dashboard pemilik.');return;
        }
        applyCloudData(result.user);closeModal();toast('Berhasil masuk. Alamat dan riwayat tersimpan online.');return;
      }catch(error){toast(error.message);return;}
    }
    let customer=state.customers.find(item=>item.phone===phone);
    if(activeStep==='register'){
      if(customer){toast('Nomor ini sudah terdaftar. Silakan masuk.');activeStep='login';openAccount();return;}
      const salt=randomSalt(),name=String(data.get('name')||'').trim(),address=String(data.get('address')||'').trim();
      customer={phone,name,salt,pinHash:await hashPin(pin,salt),addresses:address?[address]:[],createdAt:new Date().toISOString()};state.customers.push(customer);persist();sessionStorage.setItem(CUSTOMER_SESSION,phone);closeModal();toast('Akun pelanggan tersimpan di browser ini.');return;
    }
    const owner=ownerAccount();
    if(owner&&phone===owner.phone&&await hashPin(pin,owner.salt)===owner.pinHash){sessionStorage.setItem(OWNER_SESSION,'active');activeAdminTab='orders';renderAdmin('orders');toast('Berhasil masuk ke akun pemilik.');return;}
    if(!customer||await hashPin(pin,customer.salt)!==customer.pinHash){toast('Nomor WhatsApp atau PIN tidak cocok.');return;}
    sessionStorage.setItem(CUSTOMER_SESSION,phone);closeModal();toast('Berhasil masuk. Alamat tersimpan siap digunakan.');
  }
  function ownerAccount(){
    if(cloudMode)return cloudRole==='owner'?(state.owner||cloudUser):null;
    try{return JSON.parse(localStorage.getItem(OWNER_STORE)||'null');}catch(_){return null;}
  }
  function openOwner(){
    if(ownerAuthorized()){renderAdmin(activeAdminTab);return;}
    if(CLOUD.enabled&&!cloudReady){showModal('<div class="modal-eyebrow">AKUN PEMILIK</div><h2 class="modal-title" id="modalTitle">Server belum siap</h2><p class="modal-lead">Hubungkan D1 ke Worker terlebih dahulu. Akun pemilik belum dapat dibuat sebelum server tersambung.</p><button class="button button-quiet" data-action="close">Tutup</button>');return;}
    const account=ownerAccount();
    if(cloudMode&&!cloudOwnerExists){
      showModal('<div class="modal-eyebrow">AKUN PEMILIK KHUSUS</div><h2 class="modal-title" id="modalTitle">Daftarkan akun pemilik</h2><p class="modal-lead">Buat satu akun dengan nomor WhatsApp admin dan PIN 6 digit. Pendaftaran hanya tersedia sekali dan perlu kode aktivasi sekali pakai dari pengaturan Cloudflare.</p><form id="ownerSetupForm"><div class="field"><label for="ownerName">Nama pemilik</label><input id="ownerName" name="name" required maxlength="80"></div><div class="field"><label for="ownerPhone">WhatsApp pemilik</label><input id="ownerPhone" name="phone" inputmode="tel" required placeholder="08xxxxxxxxxx"></div><div class="field"><label for="ownerPin">PIN pemilik · 6 digit</label><input id="ownerPin" name="pin" type="password" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" required autocomplete="new-password"></div><div class="field"><label for="ownerPinConfirm">Ulangi PIN</label><input id="ownerPinConfirm" name="confirm" type="password" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" required></div><div class="field"><label for="ownerSetupCode">Kode aktivasi sekali pakai</label><input id="ownerSetupCode" name="setupCode" type="password" required autocomplete="off"></div><button class="button button-gold" type="submit">Simpan akun pemilik ↗</button></form><div class="warning-note">Kode ini hanya untuk pendaftaran pertama. Sesudah akun dibuat, masuk berikutnya cukup dengan WhatsApp dan PIN.</div>');return;
    }
    if(!account&&!cloudMode){
      showModal('<div class="modal-eyebrow">AKUN PEMILIK KHUSUS</div><h2 class="modal-title" id="modalTitle">Buat akun pemilik</h2><p class="modal-lead">Akun ini untuk pesanan, stok, konten, dan laporan keuangan. Daftarkan WhatsApp pemilik dan PIN 6 digit.</p><form id="ownerSetupForm"><div class="field"><label for="ownerName">Nama pemilik</label><input id="ownerName" name="name" required maxlength="80"></div><div class="field"><label for="ownerPhone">WhatsApp pemilik</label><input id="ownerPhone" name="phone" inputmode="tel" required placeholder="08xxxxxxxxxx"></div><div class="field"><label for="ownerPin">PIN pemilik · 6 digit</label><input id="ownerPin" name="pin" type="password" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" required autocomplete="new-password"></div><div class="field"><label for="ownerPinConfirm">Ulangi PIN</label><input id="ownerPinConfirm" name="confirm" type="password" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" required></div><button class="button button-gold" type="submit">Simpan akun pemilik ↗</button></form><div class="warning-note">Akun demo tersimpan di browser ini saja.</div>');return;
    }
    showModal('<div class="modal-eyebrow">AKUN PEMILIK</div><h2 class="modal-title" id="modalTitle">Masuk ke dashboard</h2><p class="modal-lead">Masuk dengan nomor WhatsApp dan PIN pemilik.</p><form id="ownerLoginForm"><div class="field"><label for="ownerPhone">Nomor WhatsApp</label><input id="ownerPhone" name="phone" inputmode="tel" required value="'+escapeHTML(account?.phone||'')+'"></div><div class="field"><label for="ownerPin">PIN pemilik</label><input id="ownerPin" name="pin" type="password" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" required autocomplete="current-password"></div><button class="button button-gold" type="submit">Masuk ke dashboard ↗</button></form><div class="warning-note">Data pesanan dan laporan hanya tampil setelah pemilik masuk.</div>');
  }
  async function handleOwnerSetup(form){
    const data=new FormData(form),phone=normalizedPhone(data.get('phone')),pin=String(data.get('pin')||'');
    if(phone.length<8||phone.length>15||pin.length!==6){toast('Isi WhatsApp valid dan PIN 6 digit.');return;}
    if(pin!==String(data.get('confirm')||'')){toast('PIN belum sama.');return;}
    if(CLOUD.enabled&&!cloudReady){toast('Server belum tersambung. Akun tidak disimpan. Coba lagi nanti.');return;}
    if(cloudReady){
      try{const ownerData=await CLOUD.registerOwner({name:String(data.get('name')||'Pemilik').trim(),phone,pin,setupCode:String(data.get('setupCode')||'')});applyCloudData(CLOUD.user,ownerData);activeAdminTab='orders';renderAdmin('orders');toast('Akun pemilik dan dashboard tersimpan online. Hapus kode aktivasi di Cloudflare sekarang.');}
      catch(error){toast(error.message);}return;
    }
    if(ownerAccount()){toast('Akun pemilik sudah dibuat di browser ini.');return;}
    const salt=randomSalt(),account={name:String(data.get('name')||'Pemilik').trim(),phone,salt,pinHash:await hashPin(pin,salt)};
    localStorage.setItem(OWNER_STORE,JSON.stringify(account));sessionStorage.setItem(OWNER_SESSION,'active');closeModal();renderAdmin('orders');toast('Akun pemilik demo berhasil dibuat.');
  }
  async function handleOwnerLogin(form){
    const data=new FormData(form),account=ownerAccount(),phone=normalizedPhone(data.get('phone')),pin=String(data.get('pin')||'');
    if(CLOUD.enabled&&!cloudReady){toast('Server belum tersambung. Coba masuk lagi nanti.');return;}
    if(cloudReady){
      try{const result=await CLOUD.login({phone,pin});if(result.user.role!=='owner'){await CLOUD.logout();toast('Nomor tersebut bukan akun pemilik.');return;}applyCloudData(result.user,result.ownerData);activeAdminTab='orders';renderAdmin('orders');toast('Berhasil masuk ke dashboard pemilik.');}
      catch(error){toast(error.message);}return;
    }
    if(!account||phone!==account.phone||await hashPin(pin,account.salt)!==account.pinHash){toast('WhatsApp atau PIN pemilik tidak cocok.');return;}
    sessionStorage.setItem(OWNER_SESSION,'active');activeAdminTab='orders';renderAdmin('orders');toast('Berhasil masuk ke dashboard pemilik.');
  }
  function itemCopy(item){return {...item,mix:item.mix.map(row=>({...row}))};}
  async function submitOrder(form){
    const data=new FormData(form),customer=currentCustomer(),packages=cartPackages(),deliveryDate=estimateDelivery(packages);
    const address=String(data.get('address')||'').trim(),name=String(data.get('name')||'').trim(),phone=normalizedPhone(data.get('phone'));
    if(!address||!name||phone.length<8){toast('Isi nama, WhatsApp, dan alamat lengkap.');return;}
    if(CLOUD.enabled&&!cloudReady){toast('Server belum tersambung. Pesanan belum dikirim; coba lagi setelah beberapa saat.');return;}
    if(cloudReady){
      try{
        const saved=await CLOUD.placeOrder({name,phone,address,note:String(data.get('note')||'').trim(),saveAddress:Boolean(customer&&data.get('saveAddress')),items:state.cart});
        const order=saved.order;state.stock=saved.stock;state.orders.unshift(order);
        if(customer&&data.get('saveAddress')){customer.name=name;if(!customer.addresses.includes(address))customer.addresses.unshift(address);}
        state.cart=[];try{localStorage.setItem(STORE,JSON.stringify(state));}catch(_){}
        updateCartUi();renderCrackers();closeModal();openPayment(order.id);return;
      }catch(error){toast(error.message);return;}
    }
    const subtotal=cartSubtotal(),shipping=shippingEstimate(0,subtotal),id='KSB-'+todayISO().replace(/-/g,'')+'-'+Math.random().toString(36).slice(2,6).toUpperCase(),now=new Date();
    const items=state.cart.map(item=>({...itemCopy(item),unitCost:totalHpp(item)}));
    for(const item of items){for(const part of item.mix){const used=part.grams*item.qty;if(stockGrams(part.id)<used){toast('Stok '+part.name+' kurang. Pemilik perlu memperbarui stok.');return;}}}
    for(const item of items)for(const part of item.mix)state.stock[part.id]=Math.max(0,stockGrams(part.id)-part.grams*item.qty);
    const order={id,createdAt:now.toISOString(),paidAt:null,customerName:name,customerPhone:phone,address,note:String(data.get('note')||'').trim(),items,packages,subtotal,shipping,total:subtotal+shipping,deliveryDate,status:'Menunggu pembayaran',paymentStatus:'Belum dibayar',payerName:'',proof:'',courierActualCost:null,ownerNote:''};
    state.orders.unshift(order);
    if(customer&&data.get('saveAddress')){customer.name=name;if(!customer.addresses.includes(address))customer.addresses.unshift(address);}
    state.cart=[];persist();updateCartUi();renderCrackers();closeModal();openPayment(id);
  }
  function compressImage(file,max=1100,quality=.76){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{const scale=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',quality));};img.src=reader.result;};reader.readAsDataURL(file);});}
  function qrisHtml(){return state.settings.qrisImage?'<img src="'+state.settings.qrisImage+'" alt="QRIS pembayaran">':'<div class="admin-empty"><b>QRIS belum dimasukkan</b><br>Pemilik unggah QRIS pada Pengaturan.</div>';}
  function openPayment(id){
    const order=state.orders.find(item=>item.id===id);if(!order)return;
    showModal('<div class="modal-eyebrow">PESANAN '+escapeHTML(order.id)+'</div><h2 class="modal-title" id="modalTitle">Satu langkah lagi</h2><p class="modal-lead">Estimasi pengantaran: '+escapeHTML(dateLabel(order.deliveryDate))+'. Setelah bayar, unggah bukti untuk menunggu konfirmasi.</p><div class="payment-layout"><div><div class="qr-box">'+qrisHtml()+'</div><div class="payee-card"><small>Atas nama pembayaran</small><strong>'+escapeHTML(state.settings.payee||'Belum diatur pemilik')+'</strong></div></div><div><div class="payment-total">'+money(order.total)+'</div><div class="field"><label for="payerName">Nama pada pembayaran</label><input id="payerName" value="'+escapeHTML(order.payerName||'')+'" maxlength="80"></div><div class="field"><label for="proofFile">Foto bukti pembayaran</label><input id="proofFile" type="file" accept="image/*"><small>'+escapeHTML(state.settings.paymentNote)+'</small></div>'+(order.proof?'<img class="proof-preview" src="'+order.proof+'" alt="Bukti pembayaran">':'')+'<button class="button button-gold" data-action="upload-proof" data-id="'+escapeHTML(id)+'">Kirim bukti pembayaran</button></div></div><div class="receipt-actions"><button class="small-button" data-action="receipt" data-id="'+escapeHTML(id)+'">Lihat / cetak struk</button><button class="small-button" data-action="track">Cek status</button></div><p class="warning-note">Pembayaran belum dianggap berhasil sampai diverifikasi pemilik. Kode pesanan: <b>'+escapeHTML(order.id)+'</b></p>');
  }
  async function uploadProof(id){
    const order=state.orders.find(item=>item.id===id),file=$('#proofFile')?.files?.[0],payer=String($('#payerName')?.value||'').trim();if(!order)return;
    if(!payer){toast('Isi nama pengirim pembayaran.');$('#payerName').focus();return;}
    if(!file&&!order.proof){toast('Pilih foto bukti pembayaran.');return;}
    if(CLOUD.enabled&&!cloudReady){toast('Server belum tersambung. Bukti belum dikirim; coba lagi setelah koneksi pulih.');return;}
    let proof=order.proof;
    if(file){if(!file.type.startsWith('image/')){toast('Bukti pembayaran harus berupa gambar.');return;}try{proof=await compressImage(file,900,.68);}catch(_){toast('Foto bukti tidak dapat dibaca.');return;}}
    if(cloudReady){
      try{const saved=await CLOUD.submitPayment(id,{phone:order.customerPhone,payerName:payer,proof});Object.assign(order,saved.order);try{localStorage.setItem(STORE,JSON.stringify(state));}catch(_){}openPayment(id);toast('Bukti pembayaran tersimpan online.');}
      catch(error){toast(error.message);}return;
    }
    order.payerName=payer;order.proof=proof;
    order.paymentStatus='Menunggu verifikasi';order.status='Menunggu verifikasi pembayaran';persist();openPayment(id);toast('Bukti tersimpan di browser demo.');
  }
  function openReceipt(id){
    const order=state.orders.find(item=>item.id===id);if(!order){toast('Pesanan tidak ditemukan.');return;}
    const itemRows=order.items.map(item=>'<tr><td>'+item.weight+' g · '+escapeHTML(item.seasoningMode==='custom'?'Racik sendiri':'Signature Trio · rekomendasi owner')+'<small>'+item.mix.map(row=>escapeHTML(row.name)+' '+fmtNumber(row.grams)+' g').join('<br>')+'<br>'+escapeHTML(seasoningLabel(item))+'<br>'+escapeHTML(totalSeasoningLabel(item.weight,itemSeasonings(item)))+'</small></td><td>'+item.qty+' pouch</td><td>'+money(item.price)+'</td><td>'+money(itemTotal(item))+'</td></tr>').join('');
    showModal('<div class="receipt-head"><img src="'+escapeHTML(brandImage())+'" alt="Logo usaha"><div><strong>KERUPUK SEBLAK BANDUNG PREMIUM</strong><small>Kriuk Bandung · Semangat untuk mandiri</small></div></div><h2 class="modal-title" id="modalTitle" style="margin-top:18px">Struk pesanan</h2><div class="receipt-meta"><span>'+escapeHTML(new Date(order.createdAt).toLocaleString('id-ID'))+'</span><b>'+escapeHTML(order.id)+'</b></div><div class="receipt-box"><b>Pengantaran:</b> '+escapeHTML(dateLabel(order.deliveryDate))+'<br><b>Penerima:</b> '+escapeHTML(order.customerName)+'<br><b>WhatsApp:</b> '+escapeHTML(order.customerPhone)+'<br><b>Alamat:</b> '+escapeHTML(order.address)+'</div><div class="finance-table-wrap"><table class="finance-table"><thead><tr><th>Racikan</th><th>Jumlah</th><th>Harga</th><th>Total</th></tr></thead><tbody>'+itemRows+'</tbody></table></div><div class="modal-summary"><div class="summary-row"><span>Subtotal produk</span><b>'+money(order.subtotal)+'</b></div><div class="summary-row"><span>Ongkir</span><b>'+(order.shipping?money(order.shipping):'Gratis')+'</b></div><div class="summary-row total"><span>Total</span><b>'+money(order.total)+'</b></div></div><div class="receipt-status">Pembayaran: '+escapeHTML(order.paymentStatus)+'<br>Status: '+escapeHTML(order.status)+'</div><div class="receipt-actions"><button class="button button-gold" data-action="print">Cetak / simpan PDF</button><button class="button button-quiet" data-action="payment" data-id="'+escapeHTML(id)+'">Pembayaran</button></div><p class="field-hint">'+(cloudReady?'Nomor struk ini dapat dicek kembali di website dari perangkat lain.':'Struk demo tersimpan pada browser tempat pesanan dibuat.')+'</p>');
  }
  function openTrack(){const customer=currentCustomer();showModal('<div class="modal-eyebrow">CEK PESANAN</div><h2 class="modal-title" id="modalTitle">Pesananmu sampai mana?</h2><p class="modal-lead">Masukkan nomor pesanan dari struk. Untuk pesanan tanpa akun, isi juga nomor WhatsApp yang dipakai saat memesan.</p><form id="trackForm"><div class="field"><label for="trackId">Nomor pesanan</label><input id="trackId" name="id" placeholder="KSB-20261112-ABC123" required></div>'+(customer?'':'<div class="field"><label for="trackPhone">Nomor WhatsApp pemesan</label><input id="trackPhone" name="phone" inputmode="tel" required placeholder="08xxxxxxxxxx"></div>')+'<button class="button button-gold" type="submit">Cari pesanan ↗</button></form>');}
  async function showTrackResult(id,phone=''){
    let order=state.orders.find(item=>item.id.toLowerCase()===String(id).trim().toLowerCase());
    if(cloudReady){try{const result=await CLOUD.lookupOrder(String(id).trim(),phone||currentCustomer()?.phone||'');order=result.order;if(!state.orders.some(item=>item.id===order.id))state.orders.unshift(order);}catch(error){toast(error.message);return;}}
    if(!order){toast('Nomor pesanan tidak ditemukan.');return;}
    showModal('<div class="modal-eyebrow">STATUS PESANAN</div><h2 class="modal-title" id="modalTitle">'+escapeHTML(order.id)+'</h2><div class="receipt-status">'+escapeHTML(order.status)+'<br>Pembayaran: '+escapeHTML(order.paymentStatus)+'<br>Estimasi antar: '+escapeHTML(dateLabel(order.deliveryDate))+'</div><div class="modal-actions"><button class="small-button" data-action="receipt" data-id="'+escapeHTML(order.id)+'">Lihat struk</button><button class="small-button" data-action="payment" data-id="'+escapeHTML(order.id)+'">Pembayaran</button><button class="button button-quiet" data-action="close">Tutup</button></div>');
  }

  function adminStats(){const paid=state.orders.filter(order=>order.paymentStatus==='Lunas terkonfirmasi'&&!order.excludedFromFinance);return {orders:state.orders.length,pending:state.orders.filter(order=>order.paymentStatus!=='Lunas terkonfirmasi'&&order.status!=='Dibatalkan').length,revenue:paid.reduce((s,o)=>s+Number(o.subtotal||0),0),packages:paid.reduce((s,o)=>s+Number(o.packages||0),0)};}
  function renderAdmin(tab='orders'){
    if(!ownerAuthorized()){openOwner();return;}activeAdminTab=tab;
    const tabs=[['orders','Pesanan'],['finance','Keuangan'],['settings','Pengaturan']].map(([key,label])=>'<button data-action="admin-tab" data-tab="'+key+'" class="'+(tab===key?'active':'')+'">'+label+'</button>').join(''),stats=adminStats();
    const overview='<div class="admin-kpis"><div class="admin-kpi"><small>Total pesanan</small><strong>'+stats.orders+'</strong></div><div class="admin-kpi"><small>Menunggu verifikasi</small><strong>'+stats.pending+'</strong></div><div class="admin-kpi"><small>Omzet produk lunas</small><strong>'+money(stats.revenue)+'</strong></div><div class="admin-kpi"><small>Pouch terjual</small><strong>'+stats.packages+'</strong></div></div>';
    const body=tab==='orders'?renderAdminOrders():tab==='finance'?renderFinance():renderSettings();
    showModal('<div class="modal-eyebrow">DASHBOARD PEMILIK · '+escapeHTML(ownerAccount()?.name||'Pemilik')+'</div><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h2 class="modal-title" id="modalTitle">Ruang pemilik</h2><button class="small-button" data-action="owner-logout">Keluar akun</button></div>'+overview+'<div class="tab-row">'+tabs+'</div><div class="admin-content">'+body+'</div><div class="warning-note">'+(cloudReady?'Data pesanan dan laporan tersimpan bersama di Cloudflare D1.':'Data demo hanya tersimpan di browser ini.')+'</div>',true);
  }
  function renderAdminOrders(){
    if(!state.orders.length)return '<div class="admin-empty">Belum ada pesanan. Pesanan pelanggan demo akan muncul di sini.</div>';
    return state.orders.map(order=>{const options=['Menunggu pembayaran','Menunggu verifikasi pembayaran','Pembayaran diverifikasi','Disiapkan','Dalam pengiriman','Selesai','Dibatalkan'].map(status=>'<option '+(order.status===status?'selected':'')+'>'+status+'</option>').join(''),lines=order.items.map(item=>item.weight+' g · '+escapeHTML(item.seasoningMode==='custom'?'Racik sendiri':'Signature Trio · rekomendasi owner')+' × '+item.qty+' pouch · '+escapeHTML(seasoningLabel(item))+' · '+item.mix.map(row=>escapeHTML(row.name)+' '+fmtNumber(row.grams)+' g').join(', ')).join('<br>');
      return '<article class="admin-order"><div class="admin-order-head"><div><h4>'+escapeHTML(order.id)+' · '+escapeHTML(order.customerName)+'</h4><small>'+escapeHTML(order.customerPhone)+' · '+escapeHTML(dateLabel(order.createdAt))+'</small></div><b>'+money(order.total)+'</b></div><p>'+lines+'<br><br><b>Antar '+escapeHTML(dateLabel(order.deliveryDate))+'</b><br>'+escapeHTML(order.address)+'<br>Ongkir '+(order.shipping?money(order.shipping):'Gratis')+' · Pembayaran '+escapeHTML(order.paymentStatus)+(order.payerName?'<br>Nama pengirim: '+escapeHTML(order.payerName):'')+'</p>'+(order.excludedFromFinance?'<div class="finance-exclusion-note"><strong>Dikecualikan dari laporan keuangan</strong><span>'+escapeHTML(order.financeExclusionReason||'Alasan tidak dicatat')+'</span></div>':'')+(order.proof?'<a href="'+order.proof+'" target="_blank" rel="noreferrer">Lihat bukti pembayaran</a>':'')+'<div class="admin-order-actions"><select data-order-status="'+escapeHTML(order.id)+'">'+options+'</select><label>Kurir aktual <input type="number" min="0" step="500" data-courier-cost="'+escapeHTML(order.id)+'" value="'+(order.courierActualCost==null?'':Number(order.courierActualCost))+'" placeholder="Rp"></label>'+(order.paymentStatus==='Lunas terkonfirmasi'?'':'<button class="small-button primary" data-action="confirm-payment" data-id="'+escapeHTML(order.id)+'">Konfirmasi bayar</button>')+'<button class="small-button" data-action="receipt" data-id="'+escapeHTML(order.id)+'">Struk</button><button class="small-button" data-action="payment" data-id="'+escapeHTML(order.id)+'">Detail bayar</button><button class="small-button '+(order.excludedFromFinance?'primary':'')+'" data-action="finance-filter" data-id="'+escapeHTML(order.id)+'">'+(order.excludedFromFinance?'Pulihkan laporan':'Kecualikan dari laporan')+'</button></div></article>';}).join('');
  }
  function dayBetween(date,start,end){const key=String(date||'').slice(0,10);return key>=start&&key<=end;}
  function ledgerFor(start,end){return state.ledger.filter(entry=>dayBetween(entry.date,start,end));}
  function financeMetrics(start,end){
    const paid=state.orders.filter(order=>order.paymentStatus==='Lunas terkonfirmasi'&&!order.excludedFromFinance&&dayBetween(order.paidAt||order.createdAt,start,end)),entries=ledgerFor(start,end),productRevenue=paid.reduce((s,o)=>s+Number(o.subtotal||0),0),shippingRevenue=paid.reduce((s,o)=>s+Number(o.shipping||0),0);
    const cogs=paid.reduce((sum,order)=>sum+order.items.reduce((s,item)=>s+Number(item.unitCost==null?totalHpp(item):item.unitCost)*Number(item.qty||0),0),0),courierKnown=paid.filter(order=>order.courierActualCost!=null&&order.courierActualCost!==''),courier=courierKnown.reduce((s,o)=>s+Number(o.courierActualCost||0),0),missingCourier=paid.length-courierKnown.length;
    const operational=entries.filter(e=>e.type==='operational').reduce((s,e)=>s+Number(e.amount||0),0),purchases=entries.filter(e=>e.type==='purchase').reduce((s,e)=>s+Number(e.amount||0),0),withdrawals=entries.filter(e=>e.type==='withdrawal').reduce((s,e)=>s+Number(e.amount||0),0),gross=productRevenue-cogs,net=gross+shippingRevenue-courier-operational;
    const allPaid=state.orders.filter(o=>o.paymentStatus==='Lunas terkonfirmasi'&&!o.excludedFromFinance),beforePaid=allPaid.filter(o=>String(o.paidAt||o.createdAt).slice(0,10)<start).reduce((s,o)=>s+Number(o.total||0),0),beforeEntries=state.ledger.filter(e=>String(e.date||'')<start).reduce((s,e)=>s+Number(e.amount||0),0),beforeCourier=allPaid.filter(o=>String(o.paidAt||o.createdAt).slice(0,10)<start&&o.courierActualCost!=null).reduce((s,o)=>s+Number(o.courierActualCost||0),0),cashStart=Number(state.settings.initialCash||0)+beforePaid-beforeEntries-beforeCourier;
    const cashIn=paid.reduce((s,o)=>s+Number(o.total||0),0),cashOut=operational+purchases+withdrawals+courier,cashEnd=cashStart+cashIn-cashOut,receivable=state.orders.filter(o=>!o.excludedFromFinance&&dayBetween(o.createdAt,start,end)&&o.paymentStatus!=='Lunas terkonfirmasi'&&o.status!=='Dibatalkan').reduce((s,o)=>s+Number(o.total||0),0),packageSales=paid.reduce((s,o)=>s+Number(o.packages||0),0),daily=[];
    let cursor=new Date(start+'T12:00:00'),last=new Date(end+'T12:00:00'),guard=0;while(cursor<=last&&guard++<400){const date=localDate(cursor),orders=paid.filter(o=>String(o.paidAt||o.createdAt).slice(0,10)===date);daily.push({date,revenue:orders.reduce((s,o)=>s+Number(o.total||0),0),profit:orders.reduce((s,o)=>s+Number(o.subtotal||0)-o.items.reduce((c,item)=>c+Number(item.unitCost||0)*Number(item.qty||0),0),0)-entries.filter(e=>e.date===date&&e.type==='operational').reduce((s,e)=>s+Number(e.amount||0),0)});cursor.setDate(cursor.getDate()+1);}
    return {paid,entries,productRevenue,shippingRevenue,cogs,courier,missingCourier,operational,purchases,withdrawals,gross,net,cashStart,cashEnd,cashIn,cashOut,receivable,packageSales,daily};
  }
  function compactMoney(value){const n=Number(value)||0;return Math.abs(n)>=1000000?'Rp'+(n/1000000).toFixed(1)+' jt':Math.abs(n)>=1000?'Rp'+Math.round(n/1000)+' rb':'Rp'+Math.round(n);}
  function renderFinanceChart(daily){
    if(!daily.length)return '<div class="admin-empty">Rentang tanggal kosong.</div>';
    const width=900,height=240,left=64,right=20,top=16,bottom=34,vals=daily.flatMap(item=>[item.revenue,item.profit]),min=Math.min(0,...vals),max=Math.max(1,...vals),x=i=>left+(daily.length<2?0:i*(width-left-right)/(daily.length-1)),y=v=>top+(max-v)/(max-min||1)*(height-top-bottom),path=key=>daily.map((item,i)=>(i?'L':'M')+x(i).toFixed(1)+' '+y(item[key]).toFixed(1)).join(' ');
    const lines=[0,1,2,3].map(i=>{const value=max-(max-min)*i/3,yy=y(value);return '<line x1="'+left+'" y1="'+yy+'" x2="'+(width-right)+'" y2="'+yy+'" class="chart-grid"/><text x="'+(left-7)+'" y="'+(yy+4)+'" text-anchor="end">'+compactMoney(value)+'</text>';}).join(''),step=Math.max(1,Math.ceil(daily.length/8)),labels=daily.map((item,i)=>i%step===0||i===daily.length-1?'<text x="'+x(i)+'" y="'+(height-8)+'" text-anchor="middle">'+item.date.slice(8,10)+'/'+item.date.slice(5,7)+'</text>':'').join('');
    return '<div class="finance-legend"><span><i></i> Omzet + ongkir</span><span><i class="gold-line"></i> Laba estimasi*</span></div><div class="finance-canvas-wrap"><svg class="finance-chart" viewBox="0 0 '+width+' '+height+'" role="img" aria-label="Grafik omzet dan laba harian">'+lines+'<path d="'+path('revenue')+'" class="chart-revenue"/><path d="'+path('profit')+'" class="chart-profit"/>'+labels+'</svg></div>';
  }
  function salesMixRows(data){const rows=PRODUCTS.map(product=>({name:product.name,grams:0}));data.paid.forEach(order=>order.items.forEach(item=>{const totalMix=item.mix.reduce((s,row)=>s+Number(row.grams||0),0)||1;item.mix.forEach(row=>{const target=rows.find(x=>x.name===row.name);if(target)target.grams+=Number(row.grams||0)*Number(item.qty||0);});}));const max=Math.max(1,...rows.map(row=>row.grams));return '<div class="bar-list">'+rows.map(row=>'<div class="bar-row"><span>'+escapeHTML(row.name)+'</span><span class="bar-track"><i style="width:'+(row.grams/max*100)+'%"></i></span><b>'+fmtNumber(row.grams)+' g</b></div>').join('')+'</div>';}
  function ledgerForm(){return '<form id="ledgerForm" class="ledger-form"><div class="field"><label>Jenis catatan</label><select name="type"><option value="operational">Biaya operasional</option><option value="purchase">Belanja bahan / stok</option><option value="withdrawal">Penarikan pemilik</option></select></div><div class="field"><label>Tanggal</label><input type="date" name="date" value="'+todayISO()+'" required></div><div class="field"><label>Jumlah (Rp)</label><input type="number" min="1" name="amount" required></div><div class="field"><label>Kategori / catatan</label><input name="category" placeholder="Contoh: bumbu, gas, minyak" required maxlength="80"></div><button class="small-button primary" type="submit">Simpan input</button></form>';}
  function renderLedger(entries){if(!entries.length)return '<div class="admin-empty">Belum ada catatan biaya pada periode ini.</div>';const labels={operational:'Biaya operasional',purchase:'Belanja bahan / persediaan',withdrawal:'Penarikan pemilik'};return entries.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(entry=>'<div class="ledger-row"><div><strong>'+escapeHTML(labels[entry.type]||entry.type)+' · '+money(entry.amount)+'</strong><small>'+escapeHTML(entry.category)+' · '+escapeHTML(dateLabel(entry.date))+'</small></div><button class="small-button" data-action="delete-ledger" data-id="'+escapeHTML(entry.id)+'">Hapus</button></div>').join('');}
  function renderFinance(){
    const data=financeMetrics(dateStart,dateEnd),margin=data.productRevenue?data.net/data.productRevenue*100:0,unvalidated=Number(state.settings.hppPer100g)===0,summary='<div class="admin-kpis"><div class="admin-kpi"><small>Omzet produk lunas</small><strong>'+money(data.productRevenue)+'</strong></div><div class="admin-kpi"><small>Kas masuk termasuk ongkir</small><strong>'+money(data.cashIn)+'</strong></div><div class="admin-kpi"><small>HPP terjual</small><strong>'+money(data.cogs)+'</strong></div><div class="admin-kpi"><small>Laba kotor</small><strong>'+money(data.gross)+'</strong></div><div class="admin-kpi"><small>Laba bersih estimasi</small><strong>'+money(data.net)+'</strong></div><div class="admin-kpi"><small>Margin bersih</small><strong>'+margin.toFixed(1).replace('.',',')+'%</strong></div><div class="admin-kpi"><small>Saldo kas akhir</small><strong>'+money(data.cashEnd)+'</strong></div><div class="admin-kpi"><small>Tagihan belum lunas</small><strong>'+money(data.receivable)+'</strong></div></div>';
    const orderRows=data.paid.map(order=>'<tr><td>'+escapeHTML(dateLabel(order.paidAt||order.createdAt))+'</td><td>'+escapeHTML(order.id)+'<br>'+escapeHTML(order.customerName)+'</td><td>'+order.items.map(item=>item.weight+' g × '+item.qty).join('<br>')+'</td><td>'+money(order.subtotal)+'</td><td>'+money(order.shipping)+'</td><td>'+(order.courierActualCost==null?'Belum diinput':money(order.courierActualCost))+'</td></tr>').join(''),forecast=[10,25,50].map(packages=>{const avgRevenue=data.packageSales?data.productRevenue/data.packageSales:0,avgCost=data.packageSales?data.cogs/data.packageSales:0;return '<div class="forecast-card"><span>'+packages+' pouch / batch</span><strong>'+money((avgRevenue-avgCost)*packages-data.operational)+'</strong></div>';}).join('');
    return '<div class="finance-toolbar"><div><div class="modal-eyebrow">ANALISIS USAHA</div><h3>Laporan keuangan</h3></div><div class="finance-toolbar-actions"><form id="periodForm" class="period-form"><label>Dari <input name="start" type="date" value="'+dateStart+'"></label><label>Sampai <input name="end" type="date" value="'+dateEnd+'"></label><button class="small-button" type="submit">Terapkan</button></form><button class="small-button" data-action="print">Cetak / Simpan PDF</button><button class="small-button" data-action="export-csv">Unduh CSV</button></div></div>'+(data.paid.length?'':'<div class="finance-alert">Belum ada pembayaran lunas pada periode ini. Pendapatan tercatat setelah pemilik menekan “Konfirmasi pembayaran”.</div>')+(unvalidated?'<div class="finance-alert">HPP belum diatur. Isi HPP per 100 g dan biaya pouch di Pengaturan agar laba bersih lebih akurat.</div>':'')+(data.missingCourier?'<div class="finance-alert">'+data.missingCourier+' pesanan lunas belum memiliki biaya kurir aktual. Laba bersih dapat terlihat lebih tinggi sampai ongkir kurir dicatat.</div>':'')+summary+'<div class="finance-grid"><section class="finance-card wide"><h4>Grafik omzet dan laba harian</h4>'+renderFinanceChart(data.daily)+'</section><section class="finance-card"><h4>Ringkasan laba-rugi</h4><div class="finance-table-wrap"><table class="finance-table"><tbody><tr><th>Penjualan produk</th><td>'+money(data.productRevenue)+'</td></tr><tr><th>Ongkir diterima</th><td>'+money(data.shippingRevenue)+'</td></tr><tr><th>HPP produk</th><td>− '+money(data.cogs)+'</td></tr><tr><th>Biaya kurir aktual</th><td>− '+money(data.courier)+'</td></tr><tr><th>Biaya operasional</th><td>− '+money(data.operational)+'</td></tr><tr><th>Laba bersih estimasi</th><td><b>'+money(data.net)+'</b></td></tr></tbody></table></div></section><section class="finance-card"><h4>Arus kas periode</h4><div class="finance-table-wrap"><table class="finance-table"><tbody><tr><th>Saldo awal</th><td>'+money(data.cashStart)+'</td></tr><tr><th>Pembayaran masuk</th><td>'+money(data.cashIn)+'</td></tr><tr><th>Operasional + belanja</th><td>− '+money(data.operational+data.purchases)+'</td></tr><tr><th>Penarikan pemilik</th><td>− '+money(data.withdrawals)+'</td></tr><tr><th>Kurir aktual</th><td>− '+money(data.courier)+'</td></tr><tr><th>Saldo akhir</th><td><b>'+money(data.cashEnd)+'</b></td></tr></tbody></table></div></section><section class="finance-card"><h4>Jenis kerupuk paling banyak terjual</h4>'+salesMixRows(data)+'</section><section class="finance-card"><h4>Simulasi batch berikutnya</h4><div class="forecast-grid">'+forecast+'</div><p class="field-hint">Proyeksi dari rata-rata harga dan HPP pesanan lunas pada periode ini. Bukan pendapatan aktual.</p></section><section class="finance-card wide"><h4>Input biaya, belanja, atau penarikan</h4>'+ledgerForm()+'<div style="margin-top:12px">'+renderLedger(data.entries)+'</div></section><section class="finance-card wide"><h4>Pesanan lunas pada periode ini</h4><div class="finance-table-wrap"><table class="finance-table"><thead><tr><th>Tanggal bayar</th><th>Order / pelanggan</th><th>Berat isi × jumlah</th><th>Produk</th><th>Ongkir masuk</th><th>Kurir aktual</th></tr></thead><tbody>'+(orderRows||'<tr><td colspan="6">Belum ada pembayaran lunas.</td></tr>')+'</tbody></table></div></section></div>';
  }

  function renderSettings(){
    const prices='<div class="field"><label>Harga jual per 100 g (Rp)</label><input type="number" min="0" step="100" name="pricePer100g" value="'+Number(state.settings.pricePer100g||0)+'"><small>Harga tiap pesanan dihitung proporsional dari berat.</small></div>';
    const stock=PRODUCTS.map(item=>'<div class="field"><label>'+escapeHTML(item.name)+' · stok (gram)</label><input type="number" min="0" step="100" name="stock_'+item.id+'" value="'+stockGrams(item.id)+'"></div>').join('');
    const productPhotos=PRODUCTS.map(item=>'<div class="field photo-setting"><label>'+escapeHTML(item.name)+'</label><input type="file" name="productFile_'+item.id+'" accept="image/*">'+(state.settings.productImages[item.id]?'<img src="'+state.settings.productImages[item.id]+'" alt="Foto katalog '+escapeHTML(item.name)+'">':'<small>Foto rujukan saat ini akan dipakai.</small>')+'</div>').join('');
    const signaturePhotos=SIGNATURES.map(item=>'<div class="field photo-setting"><label>'+escapeHTML(item.name)+' · ikon Signature</label><input type="file" name="flavorFile_'+item.id+'" accept="image/*">'+(state.settings.flavorImages[item.id]?'<img class="flavor-preview" src="'+state.settings.flavorImages[item.id]+'" alt="Ikon '+escapeHTML(item.name)+' saat ini">':'<small>Ikon bawaan akan dipakai.</small>')+'</div>').join('');
    const ingredientPhotos=INGREDIENTS.map(item=>'<div class="field photo-setting"><label>'+escapeHTML(item.name)+' · ikon bumbu</label><input type="file" name="ingredientFile_'+item.id+'" accept="image/*">'+(state.settings.ingredientImages[item.id]?'<img class="flavor-preview" src="'+state.settings.ingredientImages[item.id]+'" alt="Ikon '+escapeHTML(item.name)+' saat ini">':'<small>Ikon bawaan akan dipakai.</small>')+'</div>').join('');
    return '<form id="settingsForm"><div class="admin-setting-grid"><section><h3>Harga & HPP</h3><p class="field-hint">Masukkan harga dan biaya agar laporan keuangan dihitung otomatis.</p>'+prices+'<div class="field"><label>HPP kerupuk + bumbu per 100 g (Rp)</label><input type="number" name="hppPer100g" min="0" step="100" value="'+Number(state.settings.hppPer100g||0)+'"></div><div class="field"><label>Biaya kemasan per bungkus (Rp)</label><input type="number" name="pouchCost" min="0" step="100" value="'+Number(state.settings.pouchCost||0)+'"></div><div class="field"><label>Saldo kas awal (Rp)</label><input type="number" name="initialCash" min="0" step="1000" value="'+Number(state.settings.initialCash||0)+'"></div></section><section><h3>PO, ongkir & pembayaran</h3><div class="shipping-policy"><strong>Ongkir tetap Rp10.000</strong><span>Gratis jika subtotal produk mencapai Rp70.000.</span></div><div class="field"><label>Batas pesanan per hari (bungkus)</label><input type="number" name="maxPackagesDay" min="1" step="1" value="'+Number(state.settings.maxPackagesDay)+'"></div><div class="field"><label>Nama penerima pembayaran</label><input name="payee" value="'+escapeHTML(state.settings.payee)+'"></div><div class="field"><label>WhatsApp usaha</label><input name="whatsapp" inputmode="tel" value="'+escapeHTML(state.settings.whatsapp)+'"></div><div class="field"><label>QRIS pembayaran</label><input name="qrisFile" type="file" accept="image/*">'+(state.settings.qrisImage?'<img class="qr-box" style="width:100px;min-height:100px" src="'+state.settings.qrisImage+'" alt="QRIS saat ini">':'')+'</div><div class="field"><label>Instruksi pembayaran</label><textarea name="paymentNote" rows="3">'+escapeHTML(state.settings.paymentNote)+'</textarea></div></section><section><h3>Logo usaha</h3><p class="field-hint">Gambar ini dipakai untuk logo di header, bagian cerita, ringkasan, ikon browser, dan struk.</p><div class="field photo-setting"><label>Logo utama website</label><input name="brandLogoFile" type="file" accept="image/*">'+(state.settings.brandLogo?'<img class="brand-logo-preview" src="'+state.settings.brandLogo+'" alt="Logo website saat ini">':'<small>Logo KSB bawaan akan dipakai.</small>')+'</div></section><section><h3>Ikon Signature</h3><p class="field-hint">Atur ikon kecil untuk enam racikan rekomendasi pemilik.</p>'+signaturePhotos+'</section><section><h3>Ikon bumbu racik sendiri</h3><p class="field-hint">Atur ikon kecil untuk masing-masing bumbu racik mandiri.</p>'+ingredientPhotos+'</section><section><h3>Stok campuran</h3><p class="field-hint">Stok berkurang otomatis sesuai gram yang dialokasikan ke tiap jenis.</p>'+stock+'</section><section><h3>Foto katalog kerupuk</h3><p class="field-hint">Ganti foto produk di sini. Unggah foto yang jelas dan tidak buram.</p>'+productPhotos+'</section><section><h3>Foto hero</h3><p class="field-hint">Unggah foto utama website milik usaha.</p><div class="field"><label>Foto hero website</label><input name="heroFile" type="file" accept="image/*">'+(state.settings.heroImage?'<img style="width:100%;max-height:180px;object-fit:cover" src="'+state.settings.heroImage+'" alt="Foto hero saat ini">':'')+'</div></section></div><button class="button button-gold" type="submit">Simpan pengaturan ↗</button></form><form id="ownerProfileForm" style="margin-top:18px;padding-top:15px;border-top:1px solid var(--line)"><h3 style="color:#6f1824;font-family:Georgia,serif">Akun pemilik khusus</h3><p class="field-hint">Ganti nomor WhatsApp atau PIN akses akun ini.</p><div class="form-grid"><div class="field"><label>Nama pemilik</label><input name="name" value="'+escapeHTML(ownerAccount()?.name||'')+'" required></div><div class="field"><label>WhatsApp pemilik</label><input name="phone" value="'+escapeHTML(ownerAccount()?.phone||'')+'" required inputmode="tel"></div><div class="field"><label>PIN baru 6 digit (kosongkan jika tetap)</label><input name="pin" type="password" inputmode="numeric" pattern="[0-9]{6}" maxlength="6"></div></div><button class="small-button primary" type="submit">Perbarui akun pemilik</button></form>';
  }
  async function saveSettings(form){
    const data=new FormData(form),s=state.settings;
    s.shippingFee=10000;s.freeShippingSubtotal=70000;delete s.minSubtotal;delete s.shippingTiers;delete s.distanceLabels;delete s.origin;
    s.maxPackagesDay=Math.max(1,Number(data.get('maxPackagesDay')||30));s.hppPer100g=Math.max(0,Number(data.get('hppPer100g')||0));s.pouchCost=Math.max(0,Number(data.get('pouchCost')||0));s.initialCash=Math.max(0,Number(data.get('initialCash')||0));s.payee=String(data.get('payee')||'').trim();s.whatsapp=normalizedPhone(data.get('whatsapp'));s.paymentNote=String(data.get('paymentNote')||'').trim();s.pricePer100g=Math.max(0,Number(data.get('pricePer100g')||0));
    PRODUCTS.forEach(item=>state.stock[item.id]=Math.max(0,Number(data.get('stock_'+item.id)||0)));
    const qris=$('input[name="qrisFile"]',form).files?.[0],hero=$('input[name="heroFile"]',form).files?.[0],brandLogo=$('input[name="brandLogoFile"]',form).files?.[0];
    try{
      if(qris)s.qrisImage=await compressImage(qris,900,.8);
      if(hero)s.heroImage=await compressImage(hero,1600,.82);
      if(brandLogo)s.brandLogo=await compressImage(brandLogo,900,.86);
      s.flavorImages=s.flavorImages||{};
      s.ingredientImages=s.ingredientImages||{};
      for(const item of SIGNATURES){const file=$('input[name="flavorFile_'+item.id+'"]',form).files?.[0];if(file)s.flavorImages[item.id]=await compressImage(file,240,.86);}
      for(const item of INGREDIENTS){const file=$('input[name="ingredientFile_'+item.id+'"]',form).files?.[0];if(file)s.ingredientImages[item.id]=await compressImage(file,240,.86);}
      for(const item of PRODUCTS){const file=$('input[name="productFile_'+item.id+'"]',form).files?.[0];if(file)s.productImages[item.id]=await compressImage(file,720,.66);}
    }catch(_){toast('Salah satu foto gagal dibaca; pengaturan lain tersimpan.');}
    if(CLOUD.enabled&&!cloudReady){toast('Server belum tersambung. Pengaturan belum disimpan.');return;}
    if(cloudReady){
      try{const saved=await CLOUD.saveOwnerState({settings:state.settings,stock:state.stock,ledger:state.ledger});state.settings={...state.settings,...saved.settings};state.stock={...saved.stock};state.ledger=saved.ledger||[];try{localStorage.setItem(STORE,JSON.stringify(state));}catch(_){} }
      catch(error){toast('Pengaturan gagal tersimpan: '+error.message);return;}
    }else persist();
    renderBrandImages();if(s.heroImage) $('.hero-visual>img').src=s.heroImage;renderBuilder();renderAdmin('settings');toast(cloudReady?'Pengaturan, logo, ikon, dan stok tersimpan online.':'Pengaturan demo tersimpan di browser ini.');
  }
  async function updateOwnerProfile(form){
    const data=new FormData(form),account=ownerAccount(),phone=normalizedPhone(data.get('phone')),pin=String(data.get('pin')||'');if(!account)return;
    if(phone.length<8||phone.length>15){toast('Nomor WhatsApp pemilik tidak valid.');return;}
    if(cloudReady){
      try{const result=await CLOUD.updateOwnerProfile({name:String(data.get('name')||'Pemilik').trim(),phone,pin});state.owner=result.owner;cloudUser={...cloudUser,...result.owner};renderAdmin('settings');toast('Akun pemilik diperbarui di server.');}
      catch(error){toast(error.message);}return;
    }
    account.name=String(data.get('name')||'Pemilik').trim();account.phone=phone;if(pin){if(pin.length!==6){toast('PIN baru harus 6 digit.');return;}account.salt=randomSalt();account.pinHash=await hashPin(pin,account.salt);}
    localStorage.setItem(OWNER_STORE,JSON.stringify(account));renderAdmin('settings');toast('Akun pemilik demo diperbarui.');
  }
  async function addLedger(form){const data=new FormData(form),amount=Math.max(0,Number(data.get('amount')||0));if(!amount){toast('Masukkan nominal yang lebih dari nol.');return;}if(CLOUD.enabled&&!cloudReady){toast('Server belum tersambung. Catatan belum disimpan.');return;}const entry={id:'FIN-'+Date.now().toString(36),type:String(data.get('type')),date:String(data.get('date')||todayISO()),amount,category:String(data.get('category')||'').trim()};if(cloudReady){try{const result=await CLOUD.addLedger(entry);state.ledger=result.ledger;}catch(error){toast(error.message);return;}}else{state.ledger.unshift(entry);persist();}renderAdmin('finance');toast('Catatan keuangan tersimpan.');}
  async function setOrderStatus(id,status){const order=state.orders.find(item=>item.id===id);if(!order)return;const patch={status};if(status==='Selesai'&&!order.deliveredAt)patch.deliveredAt=new Date().toISOString();if(cloudReady){try{const result=await CLOUD.updateOrder(id,patch);Object.assign(order,result.order);}catch(error){toast(error.message);return;}}else{Object.assign(order,patch);persist();}toast('Status pesanan diperbarui.');}
  async function toggleFinanceExclusion(id){
    if(!ownerAuthorized()){openOwner();return;}
    const order=state.orders.find(item=>item.id===id);if(!order)return;
    if(order.excludedFromFinance){if(!window.confirm('Masukkan kembali pesanan '+order.id+' ke laporan keuangan?'))return;order.excludedFromFinance=false;delete order.financeExclusionReason;delete order.financeExcludedAt;}
    else{const reason=window.prompt('Alasan mengecualikan pesanan '+order.id+' dari laporan keuangan (contoh: pesanan uji atau data keliru):','');if(reason===null)return;if(!reason.trim()){toast('Isi alasan koreksi agar perubahan tercatat.');return;}order.excludedFromFinance=true;order.financeExclusionReason=reason.trim();order.financeExcludedAt=new Date().toISOString();}
    if(cloudReady){try{const result=await CLOUD.updateOrder(id,{excludedFromFinance:order.excludedFromFinance,financeExclusionReason:order.financeExclusionReason||'',financeExcludedAt:order.financeExcludedAt||''});Object.assign(order,result.order);}catch(error){toast(error.message);return;}}
    else persist();renderAdmin(activeAdminTab);toast(order.excludedFromFinance?'Pesanan dikecualikan dari laporan; riwayat pesanan tetap tersimpan.':'Pesanan dimasukkan kembali ke laporan.');
  }
  async function setCourierCost(id,value){const order=state.orders.find(item=>item.id===id);if(!order)return;const courierActualCost=value===''?null:Math.max(0,Number(value)||0);if(cloudReady){try{const result=await CLOUD.updateOrder(id,{courierActualCost});Object.assign(order,result.order);}catch(error){toast(error.message);}}else{order.courierActualCost=courierActualCost;persist();}}
  async function confirmPayment(id){if(!ownerAuthorized()){openOwner();return;}const order=state.orders.find(item=>item.id===id);if(!order)return;const patch={paymentStatus:'Lunas terkonfirmasi',paidAt:new Date().toISOString()};if(order.status==='Menunggu pembayaran'||order.status==='Menunggu verifikasi pembayaran')patch.status='Pembayaran diverifikasi';if(cloudReady){try{const result=await CLOUD.updateOrder(id,patch);Object.assign(order,result.order);}catch(error){toast(error.message);return;}}else{Object.assign(order,patch);persist();}renderAdmin(activeAdminTab);toast('Pembayaran dikonfirmasi pemilik.');}
  async function saveCustomerAddress(form){const customer=currentCustomer(),address=String(new FormData(form).get('address')||'').trim();if(!customer||!address)return;if(CLOUD.enabled&&!cloudReady){toast('Server belum tersambung. Alamat belum disimpan.');return;}if(!customer.addresses.includes(address))customer.addresses.unshift(address);if(cloudReady){try{const result=await CLOUD.saveAddresses(customer.addresses);customer.addresses=result.addresses;}catch(error){toast(error.message);return;}}else persist();renderCustomerProfile(customer);toast('Alamat disimpan.');}
  async function deleteLedgerEntry(id){if(cloudReady){try{const result=await CLOUD.deleteLedger(id);state.ledger=result.ledger;}catch(error){toast(error.message);return;}}else{state.ledger=state.ledger.filter(entry=>entry.id!==id);persist();}renderAdmin('finance');}
  async function removeCustomerAddress(index){const customer=currentCustomer();if(!customer)return;customer.addresses.splice(index,1);if(cloudReady){try{const result=await CLOUD.saveAddresses(customer.addresses);customer.addresses=result.addresses;}catch(error){toast(error.message);return;}}else persist();renderCustomerProfile(customer);}
  function exportFinanceCSV(){
    const data=financeMetrics(dateStart,dateEnd),rows=[['Ringkasan','Nilai'],['Periode',dateStart+' sampai '+dateEnd],['Penjualan produk lunas',data.productRevenue],['Ongkir diterima',data.shippingRevenue],['HPP',data.cogs],['Biaya kurir tercatat',data.courier],['Biaya operasional',data.operational],['Laba bersih estimasi',data.net],['Kas masuk',data.cashIn],['Saldo akhir',data.cashEnd],[],['Tanggal','ID Pesanan','Pelanggan','Pouch','Produk','Ongkir','Status bayar','Status pesanan']];
    data.paid.forEach(order=>rows.push([String(order.paidAt||order.createdAt).slice(0,10),order.id,order.customerName,order.packages,order.subtotal,order.shipping,order.paymentStatus,order.status]));rows.push([],['Tanggal','Jenis catatan','Kategori','Nominal']);data.entries.forEach(entry=>rows.push([entry.date,entry.type,entry.category,entry.amount]));
    const csv='\ufeff'+rows.map(row=>row.map(cell=>'"'+String(cell??'').replace(/"/g,'""')+'"').join(',')).join('\r\n'),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='laporan-kerupuk-seblak-'+dateStart+'-sampai-'+dateEnd+'.csv';link.click();URL.revokeObjectURL(url);
  }
  async function renderInitial(){
    renderBrandImages();if(state.settings.heroImage)$('.hero-visual>img').src=state.settings.heroImage;renderBuilder();updateCartUi();
    if(CLOUD.enabled){
      cloudMode=true;
      try{const session=await CLOUD.initialize();applyCloudData(session.user,session.ownerData);}
      catch(error){cloudReady=false;cloudMode=true;cloudRole=null;cloudUser=null;toast('Server belum tersambung: '+error.message);}
    }
    if(location.hash.toLowerCase()==='#pemilik')openOwner();
  }
  const canRefreshOwner=()=>cloudReady&&cloudRole==='owner'&&activeAdminTab!=='settings'&&!$('#modalBackdrop').hidden&&!document.activeElement.matches('input,select,textarea');
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&canRefreshOwner())refreshCloudOwner().catch(()=>{});});
  setInterval(()=>{if(canRefreshOwner())refreshCloudOwner().catch(()=>{});},30000);
  window.addEventListener('hashchange',()=>{if(location.hash.toLowerCase()==='#pemilik')openOwner();});
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-action]');if(!button)return;const action=button.dataset.action;
    if(action==='menu')$('.main-nav').classList.toggle('open');
    else if(action==='close')closeModal();
    else if(action==='account'){activeStep='login';openAccount();}
    else if(action==='account-tab'){activeStep=button.dataset.tab;openAccount();}
    else if(action==='owner')openOwner();
    else if(action==='owner-logout'){if(cloudReady){CLOUD.logout().catch(()=>{});cloudRole=null;cloudUser=null;applyCloudData(null);}sessionStorage.removeItem(OWNER_SESSION);closeModal();toast('Keluar dari akun pemilik.');}
    else if(action==='admin-tab')renderAdmin(button.dataset.tab);
    else if(action==='cart')openCart();
    else if(action==='checkout')checkoutForm();
    else if(action==='add-cart')addToCart();
    else if(action==='clear-crackers'){state.builder.selected=[];persist();renderCrackers();}
    else if(action==='seasoning-mode'){
      const mode=button.dataset.mode;
      if(mode==='signature'&&!SIGNATURES.some(item=>item.id===state.builder.flavor))state.builder.flavor=SIGNATURES[0].id;
      state.builder.mode=mode;persist();renderFlavors();updateSummary();
    }
    else if(action==='quantity'){state.builder.quantity=Math.max(1,Math.min(99,Number(state.builder.quantity)+(Number(button.dataset.delta)||0)));$('#builderQuantity').textContent=state.builder.quantity;updateSummary();}
    else if(action==='cart-qty'){const item=state.cart[Number(button.dataset.index)];if(item){item.qty=Math.max(1,Math.min(99,item.qty+(Number(button.dataset.delta)||0)));persist();openCart();updateCartUi();}}
    else if(action==='remove-cart'){state.cart.splice(Number(button.dataset.index),1);persist();openCart();updateCartUi();}
    else if(action==='payment')openPayment(button.dataset.id);
    else if(action==='upload-proof')uploadProof(button.dataset.id);
    else if(action==='receipt')openReceipt(button.dataset.id);
    else if(action==='track')openTrack();
    else if(action==='print')window.print();
    else if(action==='confirm-payment')confirmPayment(button.dataset.id);
    else if(action==='delete-ledger')deleteLedgerEntry(button.dataset.id);
    else if(action==='finance-filter')toggleFinanceExclusion(button.dataset.id);
    else if(action==='export-csv')exportFinanceCSV();
    else if(action==='logout-customer'){if(cloudReady){CLOUD.logout().catch(()=>{});cloudRole=null;cloudUser=null;applyCloudData(null);}sessionStorage.removeItem(CUSTOMER_SESSION);closeModal();toast('Keluar dari akun pelanggan.');}
    else if(action==='remove-address')removeCustomerAddress(Number(button.dataset.index));
  });
  document.addEventListener('change',event=>{
    const target=event.target;
    if(target.matches('[data-cracker]')){const id=target.dataset.cracker;if(target.checked&&!state.builder.selected.includes(id))state.builder.selected.push(id);else if(!target.checked)state.builder.selected=state.builder.selected.filter(item=>item!==id);persist();renderCrackers();}
    else if(target.name==='weight'){state.builder.weight=Number(target.value);persist();renderWeightOptions();updateMixSummary();}
    else if(target.name==='flavor'){const signature=SIGNATURES.find(item=>item.id===target.value)||SIGNATURES[0];state.builder.flavor=signature.id;persist();renderFlavors();updateSummary();}
    else if(target.name==='seasoning'){const id=target.value;if(target.checked)state.builder.seasonings[id]=Number(state.builder.seasonings[id])||.5;else delete state.builder.seasonings[id];persist();renderFlavors();updateSummary();}
    else if(target.matches('[data-seasoning-spoons]')){state.builder.seasonings[target.dataset.seasoningSpoons]=Number(target.value);persist();updateSummary();}
    else if(target.matches('[data-order-status]'))setOrderStatus(target.dataset.orderStatus,target.value);
    else if(target.matches('[data-courier-cost]'))setCourierCost(target.dataset.courierCost,target.value);
  });
  document.addEventListener('submit',event=>{
    const form=event.target;event.preventDefault();
    if(form.id==='checkoutForm')submitOrder(form);
    else if(form.id==='customerForm')handleCustomerForm(form);
    else if(form.id==='ownerSetupForm')handleOwnerSetup(form);
    else if(form.id==='ownerLoginForm')handleOwnerLogin(form);
    else if(form.id==='trackForm'){const data=new FormData(form);showTrackResult(data.get('id'),data.get('phone')||'');}
    else if(form.id==='ledgerForm')addLedger(form);
    else if(form.id==='settingsForm')saveSettings(form);
    else if(form.id==='ownerProfileForm')updateOwnerProfile(form);
    else if(form.id==='addAddressForm')saveCustomerAddress(form);
    else if(form.id==='periodForm'){const data=new FormData(form),start=String(data.get('start')),end=String(data.get('end'));if(start>end){toast('Tanggal awal harus sebelum tanggal akhir.');return;}dateStart=start;dateEnd=end;renderAdmin('finance');}
  });
  $('#modalBackdrop').addEventListener('click',event=>{if(event.target===$('#modalBackdrop'))closeModal();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('#modalBackdrop').hidden)closeModal();});
  $$('img').forEach(img=>img.addEventListener('error',()=>img.classList.add('image-unavailable')));
  renderInitial();
})();
