(() => {
  'use strict';
  const enabled = location.protocol === 'https:';

  async function request(path, options={}) {
    const response=await fetch(path,{credentials:'same-origin',...options,headers:{...(options.body?{'content-type':'application/json'}:{}),...(options.headers||{})}});
    let data={};
    try { data=await response.json(); } catch (_) { data={}; }
    if(!response.ok) throw new Error(data.error||`Permintaan gagal (${response.status}).`);
    return data;
  }

  const cloud={
    enabled,ready:false,ownerExists:false,user:null,bootstrapSettings:null,bootstrapStock:null,
    async initialize(){
      if(!enabled) return null;
      const bootstrap=await request('/api/bootstrap');
      this.ownerExists=Boolean(bootstrap.ownerExists);
      this.bootstrapSettings=bootstrap.settings;this.bootstrapStock=bootstrap.stock;
      const session=await request('/api/session');
      this.user=session.user||null;
      let ownerData=null;
      if(this.user?.role==='owner') ownerData=await request('/api/owner/state');
      this.ready=true;
      return {bootstrap,user:this.user,ownerData};
    },
    async registerCustomer(data){
      const result=await request('/api/auth/customer/register',{method:'POST',body:JSON.stringify(data)});
      this.user=result.user;return result.user;
    },
    async registerOwner(data){
      const result=await request('/api/auth/owner/register',{method:'POST',body:JSON.stringify(data)});
      this.user=result.user;this.ownerExists=true;
      return await this.loadOwnerState();
    },
    async login(data){
      const result=await request('/api/auth/login',{method:'POST',body:JSON.stringify(data)});
      this.user=result.user;
      if(result.user.role==='owner') return {user:this.user,ownerData:await this.loadOwnerState()};
      const session=await request('/api/session');this.user=session.user;
      return {user:this.user,ownerData:null};
    },
    async loadOwnerState(){return await request('/api/owner/state');},
    async saveOwnerState(state){return await request('/api/owner/state',{method:'PUT',body:JSON.stringify(state)});},
    async updateOwnerProfile(data){return await request('/api/owner/profile',{method:'PUT',body:JSON.stringify(data)});},
    async placeOrder(data){return await request('/api/orders',{method:'POST',body:JSON.stringify(data)});},
    async submitPayment(id,data){return await request(`/api/orders/${encodeURIComponent(id)}/payment`,{method:'POST',body:JSON.stringify(data)});},
    async lookupOrder(id,phone=''){
      const query=phone?`?phone=${encodeURIComponent(phone)}`:'';
      return await request(`/api/orders/${encodeURIComponent(id)}${query}`);
    },
    async updateOrder(id,data){return await request(`/api/owner/orders/${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify(data)});},
    async addLedger(entry){return await request('/api/owner/ledger',{method:'POST',body:JSON.stringify({entry})});},
    async deleteLedger(id){return await request(`/api/owner/ledger/${encodeURIComponent(id)}`,{method:'DELETE'});},
    async saveAddresses(addresses){return await request('/api/account/addresses',{method:'PUT',body:JSON.stringify({addresses})});},
    async logout(){
      try { await request('/api/auth/logout',{method:'POST',body:'{}'}); }
      finally { this.user=null; }
    }
  };
  window.KSBCloud=cloud;
})();
