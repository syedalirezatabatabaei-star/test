const $=x=>document.getElementById(x);
chrome.storage.local.get(['url','key','query'],v=>{ $('url').value=v.url||'';$('key').value=v.key||'';$('query').value=v.query||''});
$('go').onclick=async()=>{
  const button=$('go'),status=$('status');
  button.disabled=true;
  try{
    const url=$('url').value.trim(),key=$('key').value,query=$('query').value.trim();
    if(!url||!key||!query)throw Error('آدرس Webhook، کلید و عبارت جستجو الزامی است.');
    const parsed=new URL(url);
    if(!['https:','http:'].includes(parsed.protocol))throw Error('آدرس Webhook معتبر نیست.');
    const origin=parsed.origin;
    if(!await chrome.permissions.request({origins:[origin+'/*']}))throw Error('دسترسی به Webhook داده نشد.');
    await chrome.storage.local.set({url,key,query});
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    if(!tab?.id)throw Error('تب فعال پیدا نشد.');
    let data;
    try{data=await chrome.tabs.sendMessage(tab.id,{type:'SCAN_TOROB'});}
    catch{throw Error('اسکریپت اکستنشن روی این صفحه در دسترس نیست. صفحه ترب را refresh کن و دوباره تلاش کن.');}
    if(!data?.ok){
      if(data?.code==='TOROB_CHALLENGE'){
        status.textContent='⛔ توقف امن: '+data.error+'\n\nهیچ درخواستی به n8n ارسال نشد.';
        status.dataset.state='warning';
        return;
      }
      throw Error(data?.error||'خواندن محصولات ناموفق بود.');
    }
    if(!data.products?.length)throw Error('کارت محصولی پیدا نشد؛ صفحه نتایج را دستی اسکرول کن تا محصولات بارگذاری شوند.');
    status.textContent='در حال ارسال '+data.products.length+' محصول…';
    status.dataset.state='normal';
    const res=await fetch(url,{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json','X-Torob-Import-Key':key},body:JSON.stringify({query,source_url:data.source_url,products:data.products})});
    if(!res.ok){const msg=(await res.text()).slice(0,500);throw Error('n8n HTTP '+res.status+': '+msg);}
    const blob=await res.blob();
    if(!blob.size)throw Error('فایل خروجی خالی است.');
    const obj=URL.createObjectURL(blob);
    try{await chrome.downloads.download({url:obj,filename:'torob-products.xlsx',saveAs:true});}
    finally{setTimeout(()=>URL.revokeObjectURL(obj),60000);}
    status.textContent='درخواست خروجی ارسال شد؛ دانلود فایل آغاز شد. تعداد کارت‌های خوانده‌شده: '+data.products.length;
  }catch(e){status.textContent=e.message;status.dataset.state='error';}
  finally{button.disabled=false;}
};