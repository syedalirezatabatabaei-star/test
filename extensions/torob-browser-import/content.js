(()=>{
  const txt=e=>(e?.innerText||e?.textContent||'').replace(/\\s+/g,' ').trim();
  const challenge=()=>{
    const title=document.title||'';
    const body=(document.body?.innerText||'').slice(0,12000);
    const signals=[
      document.querySelector('iframe[src*="captcha" i],iframe[src*="challenge" i],[id*="captcha" i],[class*="captcha" i],[data-sitekey]'),
      /captcha|verify you are human|checking your browser|security challenge|unusual traffic|complete the security check|cloudflare ray id/i.test(title+' '+body),
      /تأیید کنید که انسان هستید|ترافیک غیرعادی|کد امنیتی|عبور از آزمون امنیتی|در حال بررسی مرورگر/i.test(title+' '+body)
    ];
    return signals.some(Boolean);
  };
  const get=()=>{
    const out=new Map();
    for(const a of document.querySelectorAll('a[href*="/p/"]')){
      let u;
      try{u=new URL(a.href,location.href)}catch{continue}
      const id=u.pathname.match(/\\/p\\/([^/?#]+)/i)?.[1];
      if(!id||out.has(id))continue;
      let c=a;
      for(let i=0;i<7&&c.parentElement;i++){
        c=c.parentElement;
        const t=txt(c);
        if(t.length>30&&/تومان|ریال/.test(t)&&/فروشگاه|فروشنده/.test(t))break;
      }
      const lines=(c.innerText||'').split(/\\n+/).map(x=>x.trim()).filter(Boolean);
      const title=a.title||txt(a)||lines.find(x=>x.length>8&&!/تومان|فروشگاه|فروشنده/.test(x));
      if(!title)continue;
      const card=txt(c);
      out.set(id,{product_id:id,title,price:lines.find(x=>/تومان|ریال/.test(x))||null,stores:lines.find(x=>/فروشگاه|فروشنده/.test(x))||null,condition:/کارکرده|دست\\s*دوم|استوک/.test(card)?'کارکرده':(/آکبند/.test(card)?'نو':'نامشخص'),product_kind:/طرح|کپی|غیراصل/.test(card)?'طرح':(/اصلی/.test(card)?'اصلی':'نامشخص'),is_ad:/تبلیغ|آگهی/.test(card)?true:null,url:u.origin+u.pathname,card_text:card});
    }
    return [...out.values()];
  };
  chrome.runtime.onMessage.addListener((m,s,reply)=>{
    if(m?.type!=='SCAN_TOROB')return;
    try{
      if(!/torob\\.com$/i.test(location.hostname))throw Object.assign(Error('ابتدا صفحه جستجوی ترب را باز کن.'),{code:'NOT_TOROB'});
      if(challenge())return reply({ok:false,code:'TOROB_CHALLENGE',error:'صفحه ترب CAPTCHA یا بررسی امنیتی نشان می‌دهد. استخراج متوقف شد. در همین تب به‌صورت دستی مراحل رسمی صفحه را کامل کن و سپس دوباره روی «بررسی و خروجی» بزن.'});
      const products=get();
      if(challenge())return reply({ok:false,code:'TOROB_CHALLENGE',error:'هنگام خواندن صفحه، چالش امنیتی تشخیص داده شد؛ استخراج متوقف شد. پس از رفع دستی چالش دوباره تلاش کن.'});
      reply({ok:true,source_url:location.href,products});
    }catch(e){reply({ok:false,code:e.code||'SCAN_ERROR',error:e.message})}
  });
})();