import fs from "fs";
const lines = fs.readFileSync("streams.tsv","utf8").split("\n").filter(Boolean);
const rows = lines.map(l => { const [slug, ...r] = l.split("\t"); return { slug, url: r.join("\t") }; });

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

async function testOne(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": UA, "Accept": "*/*", "Referer": new URL(url).origin + "/" },
    });
    if (!res.ok) return { ok:false, reason:"HTTP "+res.status };
    const text = (await res.text()).slice(0, 2000);
    if (text.includes("#EXTM3U")) return { ok:true, reason:"HTTP "+res.status };
    return { ok:false, reason:"HTTP "+res.status+" no-EXTM3U" };
  } catch (e) {
    return { ok:false, reason: e.name === "AbortError" ? "timeout" : (e.cause?.code || e.code || e.message || "error").toString().slice(0,40) };
  } finally { clearTimeout(t); }
}

async function run() {
  const results = [];
  const CONC = 12;
  let i = 0;
  async function worker() {
    while (i < rows.length) {
      const idx = i++;
      const { slug, url } = rows[idx];
      const r = await testOne(url);
      results[idx] = { slug, url, ...r };
      process.stderr.write(r.ok ? "." : "x");
    }
  }
  await Promise.all(Array.from({length:CONC}, worker));
  process.stderr.write("\n");
  fs.writeFileSync("results.json", JSON.stringify(results, null, 2));
  const dead = results.filter(r => !r.ok);
  const ok = results.filter(r => r.ok);
  console.log("OK:", ok.length, " DEAD:", dead.length, " / total", results.length);
  console.log("\n=== DEAD ===");
  for (const d of dead) console.log(d.slug.padEnd(28), d.reason.padEnd(18), d.url);
}
run();
