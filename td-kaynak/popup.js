const varsayilan = { acik: false, al: true, birlestir: true, yukselt: true, hazir: false, otomatik: false, desteSec: true, mod: "rating", kosuSatinAl: false, aralik: 300, minOran: 0.15, sabotaj: true, rakipAnaliz: true, ekonomiAltin: 900, yogunluk: 1, minPay: 0, bossSabotaj: false, bossSabotajDalga: 0, pencereKapat: true, gelirGoster: true, macLimiti: 0, insanGibi: false, beklemeMin: 222, beklemeMax: 1000, molaMin: 20, molaMax: 90, uzunAraHer: 8, uzunAraDk: 10, kuleTercih: 1.2, swapYerlestir: false, deneyMinDalga: 10, sabotajBaslangic: 0, bossTumDalga: false, x0Yasak: false, biriktirOnce: 0, ikiliSeviye: 2, ekonomi: true, ekonomiBaslangic: 0, ekonomiYedek: 0, gelirMinOran: 0.11, kalanTahmin: 20, guvenliIlerleme: 0.85, saldiriItme: false, ekonomiOnce: true, sizanSay: true, pasifRakip: true, pasifDalga: 8, pasifFark: 140, rushDalga: 8, rushGelir: 140, rushKarsiYok: true, rushSniperCarpan: 1.3, bossKarsiOran10: 0.8, boss10HazirlikOnce: 2, freezeYukseltCarpan: 0.5, splashYukseltCarpan: 1.3, splashBirlestirCarpan: 1.5, canOkYatir: true, canOkEsik: 12, kotuDizilimDalga: 9, erkenYeterEsik: 1.0, erkenOldur: true, erkenOldurDalga: 8, erkenOldurCan: 13, erkenOldurEsik: 0.6, erkenOldurOran: 0.7, freezeYanYanaBirlestir: true, freezeAzBirlestir: true, bossOncesiHarca: true, icereCekme: true, icMenzil: 3.5, erkenKule: true, zayifKule: true, kotuDizilimKule: true, ustSiraEnAz: 3, etkiliKule: true, etkiliKapsama: 1.5, freezeYayil: true, freezeOncelik: true, freezeOncelikDalga: 15, freezeHedef: 0.8, erkenTitan: true, erkenYukseltme: false, yeterEsik: 0.7, liderSinir: true, liderFark: 1000, crAltSinir: 10000, rematch: true, rematchBekleSn: 8, acidHizliYok: true, acidPayEsik: 0.2, sizmaMin: 0.05, erkenTitanDalga: 9, erkenMinKule: 3, yalnizTitan: true, ekonomiMinKule: 4, bossSavunma: true, bossSavunmaOnce: 2, bossHazirlik: true, bossHazirlikOnce: 2, erkenBakis: 1, bossDmgKontrol: true, bossGuvenEsik: 0.6, tehditYukselt: true, bossKarsi: true, bossKarsiOran: 0.6, bossYukselt: true, bossYukseltOnce: 3, biriktirmeSiniri: true, bosAltin: 1500, sabitCanDevam: true, gelirTakip: true, gelirFarkEsik: 70, bekci: true, bekciDk: 5, ekonomiMinCan: 8, ekonomiCanKaybi: 2, deneySonraRating: false, kosuLimiti: 0, kosuSayacBaslangic: "", sabitDeste: "universal sniper puddle acid splash", deney: false, deneyMac: 8, deneyDesteleri: "universal sniper gatling acid swap", vSurum: 5, gecOyun: true, gecOyunDalga: 0, gecVerimEsik: 1, turTavan: 2, deployOnce: true, ilkSeviye: true, ilkSeviyeDalga: 9, universalCiftYok: true, erkenDeploy: true, oluBirlestir: true, puddleAz: true, puddleDalga: 25, kayipMolaDk: 3, yukseltmeDalga: 15, yukseltmeAcilCan: 5, rematchKac: true, rematchUzunDalga: 30, rematchRiskCan: 7, alanSinerji: true, arkaYerlesim: true, arkaOran: 0.9, uzakMenzil: 3 };
let ayar = { ...varsayilan };
let kayitlar = [];

const $ = (id) => document.getElementById(id);
const sayi = (n) => (n === undefined || n === null || Number.isNaN(n) ? "-" : Math.round(n).toLocaleString("tr-TR"));
const kacis = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sakla = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
const oku = (k, v) => { try { return localStorage.getItem(k) ?? v; } catch { return v; } };

const YILDIZ = '<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/></svg>';

const STRATEJI = ["kuleTercih", "guvenliIlerleme", "ekonomi", "yalnizTitan", "ekonomiOnce", "ekonomiMinKule", "erkenTitan", "erkenTitanDalga", "erkenMinKule", "erkenYukseltme", "yeterEsik", "liderSinir", "liderFark", "ekonomiYedek", "ekonomiMinCan", "ekonomiCanKaybi", "bossSavunma", "bossSavunmaOnce", "bossHazirlik", "bossHazirlikOnce", "bossDmgKontrol", "bossGuvenEsik", "bossKarsi", "bossKarsiOran", "tehditYukselt", "sabitCanDevam", "gelirTakip", "gelirFarkEsik", "saldiriItme", "ikiliSeviye", "sabotaj", "rakipAnaliz", "turTavan", "deployOnce", "ilkSeviye", "ilkSeviyeDalga", "yukseltmeDalga", "yukseltmeAcilCan", "gecOyun", "gecOyunDalga", "gecVerimEsik", "erkenDeploy", "oluBirlestir", "puddleAz", "puddleDalga", "universalCiftYok", "alanSinerji", "arkaYerlesim"];
const bizim = Object.fromEntries(STRATEJI.map((k) => [k, varsayilan[k]]));
const HAZIRLAR = [
  { id: "bizim", ad: "Bizim ayar", fav: true, alt: "Yalnız titan, 4 kuleden sonra gelir, boss hazırlığı", d: bizim },
  { id: "ekonomi", ad: "Hızlı ekonomi", alt: "Titan 3 kuleden itibaren, can kaybına daha toleranslı", d: { ...bizim, ekonomiMinKule: 3, guvenliIlerleme: 0.9, kuleTercih: 1, ekonomiMinCan: 6, ekonomiCanKaybi: 3, bossHazirlikOnce: 3 } },
  { id: "savunma", ad: "Temkinli savunma", alt: "Önce sağlam savunma, titan + brute, can düşünce gelir durur", d: { ...bizim, yalnizTitan: false, ekonomiMinKule: 8, guvenliIlerleme: 0.6, kuleTercih: 2, ekonomiMinCan: 11, ekonomiCanKaybi: 1, bossSavunmaOnce: 3, bossHazirlikOnce: 5 } },
];
const hazirEslesen = () => HAZIRLAR.find((h) => STRATEJI.every((k) => ayar[k] === h.d[k]));

const DESTELER = [
  { d: "universal sniper puddle acid splash", ad: "Bizim deste (Splash + Puddle)", fav: true },
  { d: "universal sniper gatling acid freeze", ad: "Freeze ile" },
  { d: "universal sniper gatling acid splash", ad: "Splash ile" },
  { d: "universal sniper gatling acid basic", ad: "Basic ile" },
  { d: "", ad: "Otomatik", not: "Deste ekranında kule türlerini haritaya göre puanlar" },
];
const desteAnahtar = (d) => (Array.isArray(d) ? d : String(d || "").split(/[\s,+]+/)).filter(Boolean).map((x) => x.toLowerCase()).sort().join(" ");
const desteKisa = (d) => desteAnahtar(d).split(" ").filter((x) => x && x !== "universal").join(" + ");
const gecerliMaclar = () => kayitlar.filter((m) => !m.gecersiz && (m.sonuc === "galibiyet" || m.sonuc === "maglubiyet"));
const kazanma = (l) => { const g = l.filter((m) => m.sonuc === "galibiyet").length; return { g, n: l.length, m: l.length - g, yuzde: l.length ? Math.round((g / l.length) * 100) : 0 }; };
const ort = (l, f) => (l.length ? l.reduce((x, m) => x + (f(m) || 0), 0) / l.length : 0);

const kart = (secili, tip, ust, alt, not, tikla) => {
  const l = document.createElement("label");
  l.className = "secenek" + (secili ? " secili" : "");
  const r = document.createElement("input");
  r.type = "radio"; r.name = tip; r.checked = secili;
  r.addEventListener("change", tikla);
  const m = document.createElement("div");
  m.innerHTML = `<div class="ad">${ust}</div>${alt ? `<div class="alt">${kacis(alt)}</div>` : ""}${not ? `<div class="not">${kacis(not)}</div>` : ""}`;
  l.append(r, m);
  return l;
};

const hazirCiz = () => {
  const el = $("hazirlar");
  el.innerHTML = "";
  const es = hazirEslesen();
  for (const h of HAZIRLAR) {
    el.append(kart(es?.id === h.id, "hazir", `${h.fav ? YILDIZ : ""}<span>${kacis(h.ad)}</span>`, null, h.alt, () => { Object.assign(ayar, h.d); kaydet(h.d); ciz(); }));
  }
  $("ozelNot").textContent = es ? "" : "Strateji ayarları elle değiştirilmiş, hiçbir hazır ayarla aynı değil.";
};

const desteNotu = (d) => {
  const l = gecerliMaclar().filter((m) => desteAnahtar(m.deste) === desteAnahtar(d));
  if (!l.length) return "henüz kayıt yok";
  const k = kazanma(l);
  const r = kazanma(l.filter((m) => m.mod === "rating"));
  return `${k.g}/${k.n} galibiyet · ort. can ${ort(l, (m) => m.can).toFixed(1)}${r.n ? ` · rating ${r.g}/${r.n}` : ""}`;
};
const TURLER = ["universal", "sniper", "gatling", "acid", "splash", "puddle", "freeze", "basic", "synergy", "swap"];
const DESTE_BOYUT = 5;
let desteler = null;
let taslak = null;
const desteListesi = () => desteler || DESTELER.filter((x) => x.d).map((x, i) => ({ id: "h" + i, ad: x.ad, d: x.d, fav: !!x.fav }));
const desteYaz = (l) => { desteler = l; chrome.storage.local.set({ desteler: l }); };
const seciliDeste = () => { const s = desteAnahtar(ayar.sabitDeste); return s ? desteListesi().find((x) => desteAnahtar(x.d) === s) || null : null; };
const desteCiz = () => {
  const el = $("desteler");
  el.innerHTML = "";
  el.classList.toggle("kapali", !ayar.desteSec);
  const simdiki = desteAnahtar(ayar.sabitDeste);
  const liste = [...desteListesi()];
  if (simdiki && !seciliDeste()) liste.push({ d: ayar.sabitDeste, ad: "Özel" });
  liste.push({ d: "", ad: "Otomatik", not: "Deste ekranında kule türlerini haritaya göre puanlar" });
  liste.forEach((x, i) => {
    if (i === 1) { const a = document.createElement("div"); a.className = "ayrac"; a.textContent = "Diğer desteler"; el.append(a); }
    el.append(kart(desteAnahtar(x.d) === simdiki, "deste", `${x.fav ? YILDIZ : ""}<span>${kacis(x.ad)}</span>`, x.d ? desteKisa(x.d) : null, x.d ? desteNotu(x.d) : x.not, () => { ayar.sabitDeste = x.d; kaydet({ sabitDeste: x.d }); taslak = null; ciz(); }));
  });
  duzenCiz();
};
const duzenCiz = () => {
  const sec = seciliDeste();
  const kaynak = sec ? sec.id : "ozel:" + desteAnahtar(ayar.sabitDeste);
  if (!taslak || taslak.kaynak !== kaynak) taslak = { kaynak, id: sec?.id || null, ad: sec?.ad || "", l: desteAnahtar(ayar.sabitDeste).split(" ").filter(Boolean) };
  const cip = $("desteCip");
  cip.innerHTML = "";
  for (const t of TURLER) {
    const b = document.createElement("button");
    b.className = "cip" + (taslak.l.includes(t) ? " aktif" : "");
    b.textContent = t;
    b.addEventListener("click", () => { taslak.l = taslak.l.includes(t) ? taslak.l.filter((x) => x !== t) : [...taslak.l, t]; duzenCiz(); });
    cip.append(b);
  }
  const n = taslak.l.length;
  $("desteSayi").textContent = `${n}/${DESTE_BOYUT}` + (n !== DESTE_BOYUT ? " (oyunda deste 5 kule)" : "");
  $("desteSayi").className = n !== DESTE_BOYUT ? "uyari" : "";
  if (document.activeElement !== $("desteAd")) $("desteAd").value = taslak.ad;
  const d = taslakDeste();
  const degisti = !sec || desteAnahtar(d) !== desteAnahtar(sec.d) || (taslak.ad.trim() && taslak.ad.trim() !== sec.ad);
  $("desteKaydet").disabled = !n || !degisti;
  $("desteYeni").disabled = !n;
  $("desteSil").disabled = !taslak.id;
};
const taslakDeste = () => TURLER.filter((t) => taslak.l.includes(t)).join(" ");
const desteKullan = (d) => { ayar.sabitDeste = d; kaydet({ sabitDeste: d }); };

const secimCiz = () => {
  const gelir = !ayar.ekonomi ? "kapali" : ayar.yalnizTitan ? "titan" : "karma";
  for (const g of document.querySelectorAll("[data-secim]")) {
    const v = g.dataset.secim === "mod" ? ayar.mod : gelir;
    for (const b of g.querySelectorAll("button")) b.classList.toggle("aktif", b.dataset.v === v);
  }
};

const ciz = () => {
  $("ac").textContent = ayar.acik ? "Durdur" : "Başlat";
  $("ac").classList.toggle("calisiyor", !!ayar.acik);
  for (const el of document.querySelectorAll("[data-k]")) {
    const v = ayar[el.dataset.k];
    if (el.type === "checkbox") el.checked = !!v; else if (document.activeElement !== el) el.value = v ?? "";
  }
  secimCiz();
  hazirCiz();
  desteCiz();
};

const kaydet = (degisim) => chrome.storage.local.get("ayar", (r) => chrome.storage.local.set({ ayar: Object.assign({}, varsayilan, r.ayar || {}, degisim || {}, degisim && degisim.acik === false ? { sonrakindeDur: false } : {}), ayarYazan: { kim: "TD paneli", t: Date.now() } }));

const macCiz = (m) => {
  const el = $("mac");
  el.innerHTML = "";
  if (!m) { el.innerHTML = '<div class="bos">maç yok</div>'; el.style.display = "block"; return; }
  el.style.display = "";
  const h = m.harcama || {};
  const kutular = [
    ["dalga", sayi(m.dalga)], ["can biz / rakip", `${sayi(m.can)} / ${sayi(m.rakipCan)}`], ["altın", sayi(m.altin)],
    ["gelir biz / rakip", `${sayi(m.gelir)} / ${sayi(m.rakipGelir)}`, m.gelir > m.rakipGelir ? "iyi" : m.gelir < m.rakipGelir ? "kotu" : ""], ["dps (10 sn)", sayi(m.dps)], ["öldürme", sayi(m.oldurme)],
    ["sızan biz", sayi(m.sizan), m.sizan > 0 ? "kotu" : ""], ["sızan rakip", sayi(m.rakipSizan), m.rakipSizan > 0 ? "iyi" : ""], ["toplam hasar", sayi(m.hasar)],
    ["kuleye", sayi(h.kule)], ["yükseltmeye", sayi(h.yukseltme)], ["birime", sayi(h.birim)],
  ];
  for (const [ad, v, s] of kutular) {
    const k = document.createElement("div");
    k.className = "kutu" + (s ? " " + s : "");
    k.innerHTML = `<b>${kacis(v)}</b><span>${kacis(ad)}</span>`;
    el.append(k);
  }
};

const durumCiz = (d) => {
  macCiz(d?.mac);
  const el = $("durum");
  if (!d) { el.innerHTML = '<span class="eski">cor3.gg sekmesi açık değil</span>'; return; }
  const eski = Date.now() - d.zaman > 5000;
  const s = d.sayac || {};
  el.innerHTML = `<div class="${eski ? "eski" : "is"}">${kacis(eski ? "bağlantı yok (sayfa kapalı ya da yenilenmeli)" : d.sonIs)}</div><div class="sayac">oturum ${d.oturumMac || 0} maç · kule ${s.al || 0} · birleştir ${s.birlestir || 0} · yükselt ${s.yukselt || 0} · birim ${s.sabotaj || 0}${s.yenidenBaglan ? ` · geri bağlanma ${s.yenidenBaglan}` : ""}</div>`;
};

const cubuk = (ad, deger, enCok, renk, metin) => `<div class="cubuk"><span class="ad">${kacis(ad)}</span><div class="yol"><div class="dolu" style="width:${enCok > 0 ? Math.max(2, (deger / enCok) * 100) : 0}%;background:${renk}"></div></div><span class="deger">${kacis(metin ?? sayi(deger))}</span></div>`;

let analizAralik = oku("cor3tdAnaliz", "son20");
const analizCiz = () => {
  const el = $("analiz");
  for (const b of $("analizSecim").querySelectorAll("button")) b.classList.toggle("aktif", b.dataset.v === analizAralik);
  const tum = gecerliMaclar();
  const l = analizAralik === "son20" ? tum.slice(-20) : analizAralik === "rating" ? tum.filter((m) => m.mod === "rating") : analizAralik === "free" ? tum.filter((m) => m.mod !== "rating") : tum;
  if (!l.length) { el.innerHTML = `<section><div class="bos">${kayitlar.length ? "Bu aralıkta sonuçlanmış maç yok." : "Henüz kayıt yok. Maçlar bittikçe burada özet çıkar."}</div></section>`; return; }
  const k = kazanma(l);
  const kaz = l.filter((m) => m.sonuc === "galibiyet"), kay = l.filter((m) => m.sonuc === "maglubiyet");
  let html = `<section><h2>Özet</h2><div class="izgara">
    <div class="kutu ${k.yuzde >= 60 ? "iyi" : k.yuzde < 45 ? "kotu" : ""}"><b>%${k.yuzde}</b><span>kazanma</span></div>
    <div class="kutu"><b>${k.g}G ${k.m}M</b><span>${k.n} maç</span></div>
    <div class="kutu"><b>${ort(l, (m) => m.dalga).toFixed(1)}</b><span>ort. dalga</span></div>
  </div></section>`;
  const gelirler = [ort(kaz, (m) => m.gelir), ort(kaz, (m) => m.rakipGelir), ort(kay, (m) => m.gelir), ort(kay, (m) => m.rakipGelir)];
  const gMax = Math.max(1, ...gelirler);
  html += `<section><h2>Maç sonu gelir (dalga başına)</h2><div class="lejant"><span><i style="background:var(--mavi)"></i>biz</span><span><i style="background:var(--rakip)"></i>rakip</span></div>`;
  if (kaz.length) html += `<div class="grup"><div class="baslik">Kazandığımız ${kaz.length} maçta</div>${cubuk("biz", gelirler[0], gMax, "var(--mavi)")}${cubuk("rakip", gelirler[1], gMax, "var(--rakip)")}</div>`;
  if (kay.length) html += `<div class="grup"><div class="baslik">Kaybettiğimiz ${kay.length} maçta</div>${cubuk("biz", gelirler[2], gMax, "var(--mavi)")}${cubuk("rakip", gelirler[3], gMax, "var(--rakip)")}</div>`;
  html += `</section>`;
  if (kay.length) {
    const dus = {};
    for (const m of kay) { const dl = m.dalgalar || []; for (let i = 1; i < dl.length; i++) { const f = (dl[i - 1].can ?? 0) - (dl[i].can ?? 0); if (f > 0) dus[dl[i].d] = (dus[dl[i].d] || 0) + f; } }
    const en = Object.entries(dus).sort((a, b) => b[1] - a[1]).slice(0, 6);
    if (en.length) {
      const mx = en[0][1];
      html += `<section><h2>Canın gittiği dalgalar (kayıplar)</h2>${en.map(([d, n]) => cubuk(`dalga ${d}${d % 10 === 0 ? " boss" : ""}`, n, mx, d % 10 === 0 ? "var(--kirmizi)" : "var(--turuncu)", `-${n}`)).join("")}</section>`;
    }
  }
  const desteler = {};
  for (const m of l) (desteler[desteAnahtar(m.deste)] ||= []).push(m);
  const satirlar = Object.entries(desteler).sort((a, b) => b[1].length - a[1].length).map(([d, ml]) => { const x = kazanma(ml); return `<tr><td>${kacis(desteKisa(d) || "-")}</td><td class="sayi">${x.n}</td><td class="sayi">%${x.yuzde}</td><td class="sayi">${ort(ml, (m) => m.can).toFixed(1)}</td></tr>`; }).join("");
  html += `<section><h2>Destelere göre</h2><table><thead><tr><th>Deste (universal hariç)</th><th class="sayi">maç</th><th class="sayi">kaz.</th><th class="sayi">can</th></tr></thead><tbody>${satirlar}</tbody></table></section>`;
  const rakipTur = {};
  for (const m of l) for (const t of Object.keys(m.rakipTahta || {})) (rakipTur[t] ||= []).push(m);
  const rs = Object.entries(rakipTur).filter(([, ml]) => ml.length >= 2).map(([t, ml]) => [t, kazanma(ml)]).sort((a, b) => a[1].yuzde - b[1].yuzde).slice(0, 5);
  if (rs.length) html += `<section><h2>Rakip kulesine göre kazanma</h2>${rs.map(([t, x]) => cubuk(t, x.yuzde, 100, x.yuzde >= 60 ? "var(--yesil)" : x.yuzde < 45 ? "var(--kirmizi)" : "var(--turuncu)", `%${x.yuzde}`)).join("")}<div class="ipucu" style="margin:4px 0 0">En zor rakipler üstte; yalnız 2+ maçta görülen kuleler.</div></section>`;
  html += `<section><div class="ipucu" style="margin:0">Toplam ${kayitlar.length} kayıt. Rakibin çıktığı ya da belirsiz biten maçlar sayılmaz.</div></section>`;
  el.innerHTML = html;
};
const kayitCiz = (l) => { kayitlar = Array.isArray(l) ? l : []; analizCiz(); desteCiz(); };

const sekmeAc = (s) => {
  for (const b of document.querySelectorAll("nav button")) b.classList.toggle("aktif", b.dataset.sekme === s);
  for (const el of document.querySelectorAll(".sekme")) el.classList.toggle("aktif", el.id === "s-" + s);
  sakla("cor3tdSekme", s);
};
for (const b of document.querySelectorAll("nav button")) b.addEventListener("click", () => sekmeAc(b.dataset.sekme));
sekmeAc(oku("cor3tdSekme", "oyna"));

for (const b of $("analizSecim").querySelectorAll("button")) b.addEventListener("click", () => { analizAralik = b.dataset.v; sakla("cor3tdAnaliz", analizAralik); analizCiz(); });

for (const g of document.querySelectorAll("[data-secim]")) {
  for (const b of g.querySelectorAll("button")) b.addEventListener("click", () => {
    const v = b.dataset.v;
    const d = g.dataset.secim === "mod" ? { mod: v } : v === "kapali" ? { ekonomi: false } : { ekonomi: true, yalnizTitan: v === "titan" };
    Object.assign(ayar, d); kaydet(d); ciz();
  });
}

try { $("surum").textContent = "sürüm " + chrome.runtime.getManifest().version; } catch {}

$("desteAd").addEventListener("input", (e) => { if (taslak) { taslak.ad = e.target.value; duzenCiz(); } });
$("desteKaydet").addEventListener("click", () => {
  const d = taslakDeste();
  if (!d) return;
  const l = [...desteListesi()];
  const i = taslak.id ? l.findIndex((x) => x.id === taslak.id) : -1;
  const ad = taslak.ad.trim() || (i >= 0 ? l[i].ad : desteKisa(d));
  if (i >= 0) l[i] = { ...l[i], ad, d };
  else { const id = "k" + Date.now(); l.push({ id, ad, d }); taslak.id = id; }
  taslak.kaynak = taslak.id; taslak.ad = ad;
  desteYaz(l); desteKullan(d); ciz();
});
$("desteYeni").addEventListener("click", () => {
  const d = taslakDeste();
  if (!d) return;
  const id = "k" + Date.now();
  const ad = taslak.ad.trim() && taslak.ad.trim() !== seciliDeste()?.ad ? taslak.ad.trim() : desteKisa(d) || "Yeni deste";
  desteYaz([...desteListesi(), { id, ad, d }]);
  taslak = { kaynak: id, id, ad, l: d.split(" ") };
  desteKullan(d); ciz();
});
$("desteSil").addEventListener("click", () => {
  const l = desteListesi();
  const x = l.find((y) => y.id === taslak?.id);
  if (!x || !confirm(`"${x.ad}" silinsin mi?`)) return;
  desteYaz(l.filter((y) => y.id !== x.id));
  taslak = null; ciz();
});

chrome.storage.local.get(["ayar", "durum", "maclar", "desteler"], (r) => {
  desteler = Array.isArray(r.desteler) ? r.desteler : null;
  ayar = { ...varsayilan, ...(r.ayar || {}) };
  if (ayar.vSurum >= 2 && ayar.vSurum < varsayilan.vSurum) { const g = { vSurum: varsayilan.vSurum }; if (ayar.vSurum < 3) g.ekonomiMinKule = 4; if (ayar.vSurum < 4) g.ekonomiYedek = 0; if (ayar.vSurum < 5 && String(ayar.sabitDeste || "").trim() === "universal sniper gatling acid splash") g.sabitDeste = "universal sniper gatling acid freeze"; Object.assign(ayar, g); kaydet(g); }
  if ((ayar.vSurum || 0) < varsayilan.vSurum) { const a = r.ayar || {}; ayar = { ...varsayilan, acik: !!a.acik, otomatik: !!a.otomatik, kosuSatinAl: !!a.kosuSatinAl, kosuSayacBaslangic: a.kosuSayacBaslangic || "", surum: 8 }; chrome.storage.local.set({ ayar }); }
  if ((ayar.surum || 0) < 8) { ayar.minOran = varsayilan.minOran; ayar.minPay = 0; ayar.surum = 8; kaydet({ minOran: ayar.minOran, minPay: 0, surum: 8 }); }
  kayitlar = Array.isArray(r.maclar) ? r.maclar : [];
  ciz();
  analizCiz();
  durumCiz(r.durum);
});

chrome.storage.onChanged.addListener((d, alan) => {
  if (alan !== "local") return;
  if (d.ayar) { ayar = { ...varsayilan, ...(d.ayar.newValue || {}) }; ciz(); }
  if (d.durum) durumCiz(d.durum.newValue);
  if (d.maclar) kayitCiz(d.maclar.newValue);
  if (d.desteler) { desteler = Array.isArray(d.desteler.newValue) ? d.desteler.newValue : null; desteCiz(); }
});

$("ac").addEventListener("click", () => { ayar.acik = !ayar.acik; kaydet({ acik: ayar.acik }); ciz(); });

const yanda = window.top !== window;
if (yanda) document.documentElement.classList.add("yanda");
let yanAcik = false;
const yanCiz = () => { $("yan").classList.toggle("acik", yanAcik); $("yan").title = yanAcik ? "Sağdaki paneli kapat" : "Sayfanın sağına sabitle"; };
chrome.storage.local.get("yanPanel", (r) => { yanAcik = !!r.yanPanel; yanCiz(); });
chrome.storage.onChanged.addListener((d, alan) => { if (alan === "local" && d.yanPanel) { yanAcik = !!d.yanPanel.newValue; yanCiz(); } });
$("yan").addEventListener("click", () => { const yeni = !yanAcik; chrome.storage.local.set({ yanPanel: yeni }, () => { if (yeni && !yanda) window.close(); }); });

document.addEventListener("change", (e) => {
  const k = e.target.dataset?.k;
  if (!k) return;
  ayar[k] = e.target.type === "checkbox" ? e.target.checked : e.target.type === "number" ? Number(e.target.value) : e.target.value;
  kaydet({ [k]: ayar[k] });
  if (STRATEJI.includes(k)) hazirCiz();
  if (k === "desteSec") desteCiz();
});

$("sifirla").addEventListener("click", () => chrome.storage.local.set({ sifirla: Date.now() }));
const KORU = ["acik", "otomatik", "kosuSatinAl", "kosuSayacBaslangic"];
$("ayarDis").addEventListener("click", () => {
  chrome.storage.local.get(["ayar", "desteler"], (r) => {
    const a = { ...varsayilan, ...(r.ayar || {}) };
    for (const k of KORU) delete a[k];
    const veri = JSON.stringify({ tur: "cor3td-ayar", surum: chrome.runtime.getManifest().version, ayar: a, desteler: r.desteler || null }, null, 1);
    const l = document.createElement("a");
    l.href = URL.createObjectURL(new Blob([veri], { type: "application/json" }));
    l.download = `cor3td-ayar-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-")}.json`;
    l.click();
    $("ayarNot").textContent = "Ayar dosyası indirildi.";
  });
});
$("ayarIc").addEventListener("click", () => $("ayarDosya").click());
$("ayarDosya").addEventListener("change", (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  f.text().then((t) => {
    const v = JSON.parse(t);
    const gelen = v.tur === "cor3td-ayar" ? v.ayar : v.ayar;
    if (!gelen || typeof gelen !== "object") throw new Error("ayar yok");
    chrome.storage.local.get("ayar", (r) => {
      const eski = r.ayar || {};
      const yeni = { ...varsayilan, ...gelen };
      for (const k of KORU) yeni[k] = eski[k] ?? varsayilan[k];
      const ek = Array.isArray(v.desteler) ? { desteler: v.desteler } : {};
      chrome.storage.local.set({ ayar: yeni, ...ek, ayarYazan: { kim: "TD paneli (içe aktar)", t: Date.now() } }, () => { $("ayarNot").textContent = `İçe aktarıldı (${Object.keys(gelen).length} ayar${v.surum ? ", sürüm " + v.surum : ""}).`; });
    });
  }).catch((x) => { $("ayarNot").textContent = "Dosya okunamadı: " + x.message; });
  e.target.value = "";
});
$("indir").addEventListener("click", () => {
  chrome.storage.local.get(["maclar", "ayar", "ogrenme"], (r) => {
    const veri = JSON.stringify({ surum: chrome.runtime.getManifest().version, ayar: r.ayar, ogrenme: r.ogrenme || {}, maclar: r.maclar || [] }, null, 1);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([veri], { type: "application/json" }));
    a.download = `cor3td-maclar-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-")}.json`;
    a.click();
  });
});
$("kayitSil").addEventListener("click", () => { if (confirm("Tüm maç kayıtları silinsin mi?")) chrome.storage.local.set({ maclar: [] }); });

const girisCiz = (kosular, maclar) => {
  const ozet = $("girisOzet"), liste = $("girisler");
  if (!ozet || !liste) return;
  kosular = Array.isArray(kosular) ? kosular : [];
  maclar = Array.isArray(maclar) ? maclar : [];
  const t = (x) => Date.parse(x || 0) || 0;
  const saat = (x) => new Date(x).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  const botlu = kosular.filter((k) => k.botAcik);
  const harcanan = botlu.reduce((a, k) => a + (k.entryFee ?? 1000), 0);
  const kazanilan = botlu.reduce((a, k) => a + (typeof k.rewardPaid === "number" ? k.rewardPaid : 0), 0);
  const suren = botlu.filter((k) => k.status === "active").length;
  const net = kazanilan - harcanan;
  ozet.innerHTML = kosular.length
    ? `<div class="izgara"><div class="kutu"><b>${sayi(harcanan)}</b><span>harcanan</span></div><div class="kutu"><b>${sayi(kazanilan)}</b><span>kazanılan</span></div><div class="kutu ${net >= 0 ? "iyi" : "kotu"}"><b>${net >= 0 ? "+" : ""}${sayi(net)}</b><span>net CR</span></div></div><div class="ipucu" style="margin:6px 0 2px">Bot açıkken ${botlu.length} giriş${suren ? `, ${suren} sürüyor` : ""}</div>`
    : `<div class="ipucu">Koşu verisi henüz yok.</div>`;
  const gruplar = [];
  const kullanilan = new Set();
  for (const k of kosular) {
    const bas = t(k.startedAt) - 60000, bit = k.completedAt ? t(k.completedAt) + 30000 : Infinity;
    const m = maclar.filter((x) => x.mod === "rating" && !kullanilan.has(x) && t(x.tarih) >= bas && t(x.tarih) <= bit);
    m.forEach((x) => kullanilan.add(x));
    gruplar.push({ tur: "giris", bas: t(k.startedAt), k, m });
  }
  let seg = null;
  for (const x of maclar.filter((x) => !kullanilan.has(x)).sort((a, b) => t(a.tarih) - t(b.tarih))) {
    const rating = x.mod === "rating";
    const g = seg && seg.rating === rating && t(x.tarih) - seg.son < (rating ? 12 * 3600000 : 1800000) && !(rating && (seg.g >= 10 || seg.l >= 3)) ? seg : null;
    if (!g) { seg = { tur: rating ? "tahmini" : "free", rating, bas: t(x.tarih), son: t(x.tarih), m: [], g: 0, l: 0 }; gruplar.push(seg); }
    seg.m.push(x);
    seg.son = t(x.tarih);
    if (!x.gecersiz && x.sonuc === "galibiyet") seg.g++;
    if (!x.gecersiz && x.sonuc === "maglubiyet") seg.l++;
  }
  gruplar.sort((a, b) => b.bas - a.bas);
  const kare = (x) => `<span class="kare ${x.gecersiz ? "x" : x.sonuc === "galibiyet" ? "g" : x.sonuc === "maglubiyet" ? "m" : "x"}" title="${kacis(saat(x.tarih))} · dalga ${x.dalga ?? "?"} · can ${x.can ?? "?"}${x.gecersiz ? " · geçersiz" : ""}"></span>`;
  const isaret = (n) => n === null ? "" : `<span class="net" style="color:${n >= 0 ? "var(--yesil)" : "var(--kirmizi)"}">${n >= 0 ? "+" : ""}${sayi(n)}</span>`;
  liste.innerHTML = gruplar.slice(0, 30).map((g) => {
    if (g.tur === "giris") {
      const k = g.k;
      const odul = typeof k.rewardPaid === "number" ? k.rewardPaid : null;
      const bitti = (k.losses || 0) >= (k.maxLosses || 3) ? "var(--kirmizi)" : (k.wins || 0) >= (k.maxWins || 10) ? "var(--yesil)" : "var(--yazi)";
      return `<div class="giris"><div class="bas"><span class="zaman">${kacis(saat(k.startedAt))}</span><span class="skor" style="color:${bitti}">${k.wins ?? 0}G ${k.losses ?? 0}M</span>${k.status === "active" ? '<span class="net" style="color:var(--soluk)">sürüyor</span>' : isaret(odul === null ? null : odul - (k.entryFee ?? 1000))}</div><div class="kareler">${g.m.map(kare).join("")}</div></div>`;
    }
    return `<div class="giris"><div class="bas"><span class="zaman">${kacis(saat(g.bas))}</span><span class="skor">${g.g}G ${g.l}M</span><span class="net" style="color:var(--soluk)">${g.tur === "free" ? "free" : "tahmini"}</span></div><div class="kareler">${g.m.map(kare).join("")}</div></div>`;
  }).join("");
};
let girisKosular = [];
chrome.storage.local.get(["kosular", "maclar"], (r) => { girisKosular = r.kosular || []; girisCiz(girisKosular, r.maclar); });
chrome.storage.onChanged.addListener((d, alan) => {
  if (alan !== "local" || (!d.kosular && !d.maclar)) return;
  if (d.kosular) girisKosular = d.kosular.newValue || [];
  chrome.storage.local.get("maclar", (r) => girisCiz(girisKosular, r.maclar));
});

$("gunlukIndir")?.addEventListener("click", () => chrome.storage.local.set({ gunlukIndir: Date.now() }));

try {
  const tema = (t) => { document.body.classList.forEach((c) => { if (c.startsWith("theme-")) document.body.classList.remove(c); }); document.body.classList.add("theme-" + (t || "default")); };
  chrome.storage.sync.get("selectedTheme", (d) => tema(d.selectedTheme));
  chrome.storage.onChanged.addListener((d, alan) => { if (alan === "sync" && d.selectedTheme) tema(d.selectedTheme.newValue); });
} catch {}
