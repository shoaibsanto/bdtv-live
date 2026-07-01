import https from "https";
import http from "http";
const UA="Mozilla/5.0";
function raw(mod,url,opts){return new Promise(res=>{
  const req=mod.get(url,{headers:{"User-Agent":UA},timeout:12000,...opts},r=>{
    let b="";r.on("data",d=>b+=d);r.on("end",()=>res(`status ${r.statusCode} body:${JSON.stringify(b.slice(0,60))}`));
  });
  req.on("error",e=>res("ERR "+(e.code||e.message))); req.on("timeout",()=>{req.destroy();res("timeout")});
});}
console.log("https default   :", await raw(https,"https://padmaonline.duckdns.org:8088/pcv/index.m3u8"));
console.log("https insecure  :", await raw(https,"https://padmaonline.duckdns.org:8088/pcv/index.m3u8",{rejectUnauthorized:false}));
console.log("http :8088      :", await raw(http,"http://padmaonline.duckdns.org:8088/pcv/index.m3u8"));
