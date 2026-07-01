const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const cases = [
  ["animal-planet-hd (as-is)", "https://tiger-hub.vercel.app@vodzong.mjunoon.tv:8087/streamtest/Animal-Planet-158-3/playlist.m3u8"],
  ["animal-planet-hd (host only)", "https://vodzong.mjunoon.tv:8087/streamtest/Animal-Planet-158-3/playlist.m3u8"],
  ["pcv (retry)", "https://padmaonline.duckdns.org:8088/pcv/index.m3u8"],
];
async function test(url){
  const ctrl=new AbortController(); const t=setTimeout(()=>ctrl.abort(),15000);
  try{
    const res=await fetch(url,{redirect:"follow",signal:ctrl.signal,headers:{"User-Agent":UA,"Accept":"*/*"}});
    const text=(await res.text()).slice(0,300);
    return `HTTP ${res.status} ${res.ok&&text.includes("#EXTM3U")?"OK ✓":"BAD"} | body: ${JSON.stringify(text.slice(0,80))}`;
  }catch(e){ return "ERR "+(e.cause?.code||e.name||e.message); }
  finally{clearTimeout(t);}
}
for(const [name,url] of cases){
  let r;
  for(let i=0;i<3;i++){ r=await test(url); if(r.includes("OK ✓")) break; }
  console.log(name.padEnd(30), r);
}
