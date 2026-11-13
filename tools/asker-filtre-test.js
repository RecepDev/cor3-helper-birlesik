const fs = require("fs");
const path = require("path");
const kaynak = fs.readFileSync(path.join(__dirname, "..", "src", "content", "ws-relay.js"), "utf8");
const bas = kaynak.indexOf("const recruitSinir");
const son = kaynak.indexOf("const ucuzSinir");
if (bas < 0 || son < 0) { console.log("KALDI blok bulunamadı"); process.exit(1); }
const blok = kaynak.slice(bas, son);
const filtre = new Function("settings", "configs", "allMercs", blok + "; return allMercs;");
const askerler = () => [
  { id: "c1", callsign: "core-ucuz", _market: "core", rank: "RECRUIT", missionsCompleted: 3 },
  { id: "c2", callsign: "core-orta", _market: "core", rank: "EXPERIENCED", missionsCompleted: 12 },
  { id: "c3", callsign: "core-pahali", _market: "core", rank: "VETERAN", missionsCompleted: 30 },
  { id: "c4", callsign: "core-recruit10", _market: "core", rank: "RECRUIT", missionsCompleted: 10 },
  { id: "u1", callsign: "usol-ucuz", _market: "usol", rank: "RECRUIT", missionsCompleted: 2 },
  { id: "u2", callsign: "usol-orta", _market: "usol", rank: "EXPERIENCED", missionsCompleted: 11 },
  { id: "u3", callsign: "usol-pahali", _market: "usol", rank: "VETERAN", missionsCompleted: 25 },
  { id: "x1", callsign: "ayarsiz", _market: "core", rank: "RECRUIT", missionsCompleted: 0 },
];
const configs = { c1: { totalCost: 2000 }, c2: { totalCost: 5200 }, c3: { totalCost: 12000 }, c4: { totalCost: 2200 }, u1: { totalCost: 5000 }, u2: { totalCost: 9000 }, u3: { totalCost: 16000 } };
let gecen = 0, toplam = 0;
const dene = (ad, ayar, beklenen) => {
  toplam++;
  const kalan = filtre({ autoSendMerc: ayar }, configs, askerler()).map((m) => m.id).sort().join(",");
  const ok = kalan === [...beklenen].sort().join(",");
  if (ok) gecen++;
  console.log(`${ok ? "GEÇTİ" : "KALDI"}  ${ad}\n        kalan: ${kalan || "(hiçbiri)"}${ok ? "" : "  beklenen: " + beklenen.join(",")}`);
};
dene("Hiçbir sınır yok: hepsi kalır", {}, ["c1", "c2", "c3", "c4", "u1", "u2", "u3", "x1"]);
dene("Yalnız ucuz: CORE < 2.500, USOL < 6.000", { yalnizUcuz: true }, ["c1", "c4", "u1"]);
dene("Yalnız USOL: CORE askerleri çıkar", { yalnizUsol: true }, ["u1", "u2", "u3"]);
dene("Yalnız ucuz + Yalnız USOL: 6.000 altı USOL", { yalnizUcuz: true, yalnizUsol: true }, ["u1"]);
dene("Market limiti CORE 10.000 / USOL 15.000", { tavanCore: 10000, tavanUsol: 15000 }, ["c1", "c2", "c4", "u1", "u2"]);
dene("Yalnız CORE limiti 3.000 (USOL serbest)", { tavanCore: 3000 }, ["c1", "c4", "u1", "u2", "u3"]);
dene("Yalnız USOL limiti 6.000 (CORE serbest)", { tavanUsol: 6000 }, ["c1", "c2", "c3", "c4", "u1", "x1"]);
dene("Recruit en çok 10 görev", { recruitSinir: 10 }, ["c1", "c2", "c3", "u1", "u2", "u3", "x1"]);
dene("Limit + Yalnız USOL + Recruit 10", { tavanUsol: 10000, yalnizUsol: true, recruitSinir: 10 }, ["u1", "u2"]);
console.log(`\n${gecen}/${toplam} senaryo geçti`);
process.exit(gecen === toplam ? 0 : 1);
