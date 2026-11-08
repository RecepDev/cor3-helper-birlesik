(() => {
  if (window.__cor3Planlayici) return;
  window.__cor3Planlayici = true;

  const MAG = [
    { k: "home", ad: "HOME", veri: "marketData" },
    { k: "dark", ad: "D4RK", veri: "darkMarketData", sunucu: "019d29c5-4b37-79bf-b23e-304d8ea03c15" },
    { k: "soyuz", ad: "SOYUZ", veri: "soyuzMarketData", sunucu: "019da6f1-16f7-75a6-b6d3-0b1d5f92a108" },
    { k: "usol", ad: "USOL", veri: "usolMarketData", sunucu: "019e4052-c317-7388-9d71-883ffb1560cd" },
  ];
  const MAG_ID = {
    "019d3ea4-85bd-7389-904d-8f7c85841134": "home",
    "019d3ea4-85bd-7389-904d-908ba9194aa0": "dark",
    "019da731-2db5-7d76-9447-1ea3b9b78001": "soyuz",
    "019e4065-6ae8-760d-8724-58ab4f2cf7d7": "usol",
  };
  const VARSAYILAN = { acik: false, oneri: true, payDk: 30, bilinmeyenDk: 0, jobPencereDk: 120, force: true, kismiForce: true, gunluk: false, aralikDk: 30, haric: "" };
  const ANAHTAR = ["marketData", "darkMarketData", "soyuzMarketData", "usolMarketData", "autoJobsTracker", "autoJobsQueue", "autoJobsRunning", "autoJobsDebugLogs", "autoJobsCompletedResults", "automationQueueStatus", "valuableSearchRunning", "valuableSellerRunning", "durum", "planAyar", "planOgrenme", "planCalisma", "dailyOpsData"];

  let ayar = { ...VARSAYILAN };
  let ogr = { surum: 2, tohum: false, isler: {}, gorulen: [], bakimlar: [], uyari: {}, basla: {} };
  let harita = null;
  let haritaZaman = 0;
  let depo = {};
  let calisma = { adim: "bos", bas: 0, sonDongu: 0, secilen: [], haricMagaza: [] };
  let log = [];

  const simdi = () => Date.now();
  const dk = (ms) => Math.round(ms / 60000);
  const yaz = (m) => {
    log.push(new Date().toISOString().slice(11, 19) + " " + m);
    while (log.length > 80) log.shift();
  };
  const kaydetOgr = () => chrome.storage.local.set({ planOgrenme: ogr });
  const kaydetCalisma = () => chrome.storage.local.set({ planCalisma: calisma });
  const wsKomut = (cmd, data) => window.postMessage({ type: "COR3_AUTOJOB_CMD", cmd, data: data || {} }, "*");
  const haritaIste = () => wsKomut("get.map", {});
  const aktar = (payload) => new Promise((res) => {
    try { chrome.runtime.sendMessage({ planRelay: payload }, (r) => res(r || { ok: false, hata: chrome.runtime.lastError && chrome.runtime.lastError.message })); }
    catch (e) { res({ ok: false, hata: String(e) }); }
  });
  const bekleMesaj = (tip, ms) => new Promise((res) => {
    let bitti = false;
    const f = (e) => { if (e.source === window && e.data && e.data.type === tip && !bitti) { bitti = true; window.removeEventListener("message", f); res(e.data); } };
    window.addEventListener("message", f);
    setTimeout(() => { if (!bitti) { bitti = true; window.removeEventListener("message", f); res(null); } }, ms);
  });
  const uyu = (ms) => new Promise((r) => setTimeout(r, ms));

  const isKaydet = (mk, j, zaman) => {
    if (!mk || !j || !j.id) return;
    if (ogr.gorulen.includes(j.id)) return;
    ogr.gorulen.push(j.id);
    const z = Date.parse(zaman || "") || simdi();
    if (!ogr.ilkJob || z < ogr.ilkJob) ogr.ilkJob = z;
    while (ogr.gorulen.length > 3000) ogr.gorulen.shift();
    const t = ogr.isler[mk] || (ogr.isler[mk] = {});
    for (const s of j.relatedServers || []) {
      const o = t[s.id] || (t[s.id] = { ad: s.serverName, n: 0, son: null });
      o.n++;
      o.son = zaman || new Date().toISOString();
    }
  };

  const bakimKaydet = (id, ad, tip, bas, bit) => {
    if (!bit) return false;
    const var_ = ogr.bakimlar.find((b) => b.id === id && b.bit === bit);
    if (var_) { if (!var_.bas && bas) { var_.bas = bas; return true; } return false; }
    ogr.bakimlar.push({ id, ad, tip, bas: bas || null, bit });
    while (ogr.bakimlar.length > 500) ogr.bakimlar.shift();
    return true;
  };

  const bitisIsle = (id, zaman) => {
    const bas = ogr.basla[id] && Date.parse(ogr.basla[id]) < Date.parse(zaman) ? ogr.basla[id] : ogr.uyari[id] && Date.parse(ogr.uyari[id].bas) < Date.parse(zaman) ? ogr.uyari[id].bas : null;
    if (!bas) return;
    const yakin = ogr.bakimlar.find((b) => b.id === id && Math.abs(Date.parse(b.bit) - Date.parse(zaman)) < 10 * 60000);
    if (yakin) { if (!yakin.bas) yakin.bas = bas; return; }
    const s = harita && harita.servers.find((x) => x.id === id);
    bakimKaydet(id, s ? s.serverName : null, s ? s.serverTypeName : null, bas, zaman);
  };

  const haritaIsle = (servers, connections, zaman) => {
    const t = zaman || simdi();
    let degisti = false;
    for (const b of ogr.bakimlar) if (!b.tip) { const s = servers.find((x) => x.id === b.id); if (s) { b.tip = s.serverTypeName; b.ad = s.serverName; degisti = true; } }
    for (const s of servers) {
      if (s.timeUntilMaintenance && !s.maintenanceEndsAt) {
        const u = ogr.uyari[s.id];
        if (!u || u.bas !== s.timeUntilMaintenance) { ogr.uyari[s.id] = { bas: s.timeUntilMaintenance, gorulme: new Date(t).toISOString() }; degisti = true; }
      }
      ogr.gorulme = ogr.gorulme || {};
      const once = ogr.gorulme[s.id];
      if (s.maintenanceEndsAt) {
        const u = ogr.uyari[s.id];
        let bas = ogr.basla[s.id] && Date.parse(ogr.basla[s.id]) <= Date.parse(s.maintenanceEndsAt) && Date.parse(s.maintenanceEndsAt) - Date.parse(ogr.basla[s.id]) < 2 * 86400000 ? ogr.basla[s.id] : null;
        if (!bas && once && !once.b && t - once.t < 20 * 60000 && t >= once.t) bas = new Date(once.t + (t - once.t) / 2).toISOString();
        if (!bas && u && Date.parse(u.bas) <= t + 60000 && Date.parse(u.bas) < Date.parse(s.maintenanceEndsAt)) bas = u.bas;
        if (bakimKaydet(s.id, s.serverName, s.serverTypeName, bas, s.maintenanceEndsAt)) degisti = true;
      }
      ogr.gorulme[s.id] = { t, b: !!s.maintenanceEndsAt };
    }
    if (degisti) kaydetOgr();
  };

  const tohumla = () => new Promise((res) => {
    let r;
    try { r = indexedDB.open("cor3_ws_db"); } catch (e) { res(false); return; }
    r.onerror = () => res(false);
    r.onsuccess = () => {
      const db = r.result;
      if (!db.objectStoreNames.contains("messages")) { res(false); return; }
      const st = db.transaction("messages").objectStore("messages");
      const g = st.openCursor();
      let sonMarket = null;
      let n = 0;
      g.onsuccess = (e) => {
        const cur = e.target.result;
        if (!cur) { res(n); return; }
        const v = cur.value;
        let p = null;
        try { if (typeof v.message === "string" && v.message.startsWith("42")) p = JSON.parse(v.message.slice(2)); } catch {}
        if (Array.isArray(p)) {
          const pl = p[1] || {};
          const a = pl.event && pl.event.action;
          const t = Date.parse(v.timestamp);
          if (v.direction === "sent" && a === "get.jobs") sonMarket = MAG_ID[(pl.data || {}).marketId] || null;
          if (v.direction === "received" && a === "get.jobs" && pl.data && sonMarket) {
            for (const j of [...(pl.data.jobs || []), ...(pl.data.recentJobs || [])]) isKaydet(sonMarket, j, v.timestamp);
            n++;
          }
          if (v.direction === "received" && a === "maintenance" && pl.data && pl.data.reason === "started") ogr.basla[pl.data.serverId] = v.timestamp;
          if (v.direction === "received" && a === "maintenance" && pl.data && pl.data.reason === "ended") bitisIsle(pl.data.serverId, v.timestamp);
          if (v.direction === "received" && a === "get.map" && pl.data && Array.isArray(pl.data.servers)) haritaIsle(pl.data.servers, pl.data.connections, t);
        }
        cur.continue();
      };
    };
  });

  const sureTahmin = (s) => {
    const ol = ogr.bakimlar.filter((b) => b.bas && b.bit && Date.parse(b.bit) > Date.parse(b.bas));
    const sure = (b) => Date.parse(b.bit) - Date.parse(b.bas);
    const ayni = ol.filter((b) => b.id === s.id).map(sure);
    if (ayni.length) return { ms: Math.max(...ayni), kaynak: "sunucu", n: ayni.length };
    const tur = ol.filter((b) => b.tip && b.tip === s.serverTypeName).map(sure);
    if (tur.length) return { ms: Math.max(...tur), kaynak: "tür", n: tur.length };
    const aile = (x) => String(x || "").split(/[\s/]/)[0];
    const ai = ol.filter((b) => b.tip && aile(b.tip) === aile(s.serverTypeName)).map(sure);
    if (ai.length) return { ms: Math.max(...ai), kaynak: "aile", n: ai.length };
    if (ayar.bilinmeyenDk > 0) return { ms: ayar.bilinmeyenDk * 60000, kaynak: "ayar", n: 0 };
    const hep = ol.map(sure);
    if (hep.length) return { ms: Math.max(...hep), kaynak: "en uzun", n: hep.length };
    return { ms: 24 * 3600000, kaynak: "veri yok", n: 0 };
  };

  const komsuluk = () => {
    const adj = {};
    for (const c of harita.connections || []) {
      (adj[c.serverA] = adj[c.serverA] || new Set()).add(c.serverB);
      (adj[c.serverB] = adj[c.serverB] || new Set()).add(c.serverA);
    }
    return adj;
  };
  const yol = (adj, bas, hedef, kapali) => {
    const onceki = { [bas]: null };
    const q = [bas];
    for (let i = 0; i < q.length; i++) {
      const u = q[i];
      if (u === hedef) break;
      for (const w of adj[u] || []) {
        if (w in onceki) continue;
        if (kapali && kapali.has(w) && w !== hedef) continue;
        onceki[w] = u;
        q.push(w);
      }
    }
    if (!(hedef in onceki)) return null;
    const p = [];
    for (let x = hedef; x; x = onceki[x]) p.push(x);
    return p.reverse();
  };

  const mesafe = (adj, bas, kapali) => {
    const d = { [bas]: 0 };
    const q = [bas];
    for (let i = 0; i < q.length; i++) {
      const u = q[i];
      for (const w of adj[u] || []) {
        if (w in d) continue;
        d[w] = d[u] + 1;
        if (kapali && kapali.has(w)) continue;
        q.push(w);
      }
    }
    return d;
  };
  const kisaYollar = (adj, bas, hedef, kapali) => {
    const dB = mesafe(adj, bas, kapali);
    if (!(hedef in dB)) return null;
    const dH = mesafe(adj, hedef, kapali);
    const L = dB[hedef];
    const k = [];
    for (const x of Object.keys(dB)) if (x in dH && dB[x] + dH[x] === L && (!kapali || !kapali.has(x) || x === hedef)) k.push(x);
    return k;
  };

  const engelliSunucular = () => {
    const ad = new Set();
    const l = depo.autoJobsDebugLogs || [];
    for (let i = 0; i < l.length; i++) {
      const m = (l[i] && l[i].msg) || "";
      const h = m.match(/Hack attempt (\d+)\/\1 on (.+)$/);
      if (h) ad.add(h[2].trim());
    }
    for (const r of depo.autoJobsCompletedResults || []) {
      if ((r.status === "failed" || r.status === "skipped") && r.error && !/Aborted by user/i.test(r.error)) ad.add(r.serverName);
    }
    return ad;
  };

  const hesapla = () => {
    const t = simdi();
    const sonuc = { zaman: t, hazir: false, magazalar: [], sunucular: [], forceOner: [], uyarilar: [] };
    if (!harita || !Array.isArray(harita.servers)) { sonuc.neden = "harita bekleniyor"; return sonuc; }
    const S = {};
    for (const s of harita.servers) S[s.id] = s;
    const home = harita.servers.find((s) => s.serverTypeName === "Home" || s.serverName === "Home Server");
    if (!home) { sonuc.neden = "Home Server haritada yok"; return sonuc; }
    const adj = komsuluk();
    const engelli = engelliSunucular();
    const haric = new Set(String(ayar.haric || "").split(/[,\n]/).map((x) => x.trim()).filter(Boolean));
    const pay = (ayar.payDk || 0) * 60000;

    const magazalar = [];
    for (const m of MAG) {
      const v = depo[m.veri];
      if (!v) continue;
      ogr.sonReset = ogr.sonReset || {};
      const okunan = Date.parse(v.nextJobsResetAt || "") || null;
      if (okunan) ogr.sonReset[m.k] = okunan;
      const reset = okunan || (ogr.sonReset[m.k] > t ? ogr.sonReset[m.k] : null);
      const sunucu = (v.market && v.market.marketServer) || m.sunucu || home.id;
      const repSeviye = (v.reputation && v.reputation.level) || 0;
      const jobs = Array.isArray(v.jobs) ? v.jobs : [];
      const secili = depo.seciliTurler && depo.seciliTurler[m.k];
      const yapilacak = (ad) => !secili || secili.includes(ad);
      const takip = (depo.autoJobsTracker || []).filter((j) => j.marketKey === m.k && (j.status === "pending" || j.status === "running" || j.status === "in-progress") && yapilacak(j.type || j.name) && (j.serverName && j.serverName !== "None" || m.k !== "home"));
      const bekleyen = [];
      for (const j of jobs) {
        const srv = (j.relatedServers || []).map((s) => s.serverName);
        const yapilamaz = (j.requiredReputationLevel || 0) > repSeviye || srv.some((n) => engelli.has(n));
        if (!yapilamaz && yapilacak(j.name) && (srv.length || m.k !== "home")) bekleyen.push({ ad: j.name, srv });
      }
      for (const j of takip) if (!engelli.has(j.serverName)) bekleyen.push({ ad: j.name, srv: [j.serverName] });
      const hedef = new Set();
      if (sunucu !== home.id) hedef.add(sunucu);
      for (const id of Object.keys(ogr.isler[m.k] || {})) hedef.add(id);
      for (const j of jobs) for (const s of j.relatedServers || []) hedef.add(s.id);
      const T = bekleyen.length ? t : reset;
      const bakimda = new Set(harita.servers.filter((s) => s.maintenanceEndsAt && Date.parse(s.maintenanceEndsAt) > (T || t)).map((s) => s.id));
      const K = new Set();
      const yollar = {};
      for (const h of hedef) {
        if (!S[h]) continue;
        const p = kisaYollar(adj, home.id, h, bakimda) || kisaYollar(adj, home.id, h, null);
        if (!p) continue;
        yollar[h] = p;
        for (const x of p) if (x !== home.id) K.add(x);
      }
      magazalar.push({ k: m.k, ad: m.ad, sunucu, reset, T, bekleyen, K, yollar });
    }
    if (!magazalar.length) { sonuc.neden = "market verisi yok (Helper popup'ını bir kez aç)"; return sonuc; }

    for (const s of harita.servers) {
      if (s.id === home.id) continue;
      const D = sureTahmin(s);
      const kayit = { id: s.id, ad: s.serverName, tip: s.serverTypeName || "", def: s.serverDefenceRate || 0, erisim: !!(s.isAccessible || s.hasAdminAccess), sureDk: dk(D.ms), kaynak: D.kaynak, uyari: s.timeUntilMaintenance || null, bakimBitis: s.maintenanceEndsAt || null, magazalar: [] };
      for (const m of magazalar) if (m.K.has(s.id)) kayit.magazalar.push(m.ad);
      if (s.maintenanceEndsAt && Date.parse(s.maintenanceEndsAt) > t) { kayit.durum = "bakımda"; kayit.neden = `${dk(Date.parse(s.maintenanceEndsAt) - t)} dk kaldı`; }
      else if (haric.has(s.serverName)) { kayit.durum = "korunan"; kayit.neden = "elle hariç"; }
      else if (s.isDiscovered === false) { kayit.durum = "dışarıda"; kayit.neden = "keşfedilmemiş"; }
      else {
        const red = [];
        for (const m of magazalar) {
          if (!m.K.has(s.id)) continue;
          if (!m.T) { red.push(`${m.ad} zamanı yok`); continue; }
          const kalan = m.T - t;
          if (m.bekleyen.length) red.push(`${m.ad} ${m.bekleyen.length} job bekliyor`);
          else if (kalan < D.ms + pay) red.push(`${m.ad} ${dk(kalan)} dk sonra, bakım ~${dk(D.ms)} dk + ${ayar.payDk} pay`);
        }
        kayit.durum = red.length ? "korunan" : "izinli";
        kayit.neden = red.join("; ") || (kayit.magazalar.length ? `yetişiyor (${kayit.magazalar.join(", ")})` : "hiçbir store kullanmıyor");
      }
      if (kayit.uyari && kayit.durum !== "bakımda") {
        const bas = Date.parse(kayit.uyari);
        const cakis = (a, b) => Math.max(0, Math.min(a[1], b[1]) - Math.max(a[0], b[0]));
        const pencere = magazalar.filter((m) => m.K.has(s.id) && (m.bekleyen.length || m.reset)).map((m) => {
          const b = m.bekleyen.length ? t : m.reset;
          return { ad: m.ad, w: [b, b + ayar.jobPencereDk * 60000] };
        });
        const dogal = [bas, bas + D.ms], zorla = [t, t + D.ms + pay];
        const oD = pencere.reduce((a, p) => a + cakis(dogal, p.w), 0);
        const oZ = pencere.reduce((a, p) => a + cakis(zorla, p.w), 0);
        const cakisan = pencere.filter((p) => cakis(dogal, p.w) > 0).map((p) => p.ad);
        if (cakisan.length) {
          kayit.cakisma = cakisan;
          if (kayit.durum === "izinli") { sonuc.forceOner.push(kayit.ad); kayit.forceNeden = "yetişiyor"; }
          else if (ayar.kismiForce !== false && kayit.neden !== "elle hariç" && oZ < oD) {
            sonuc.forceOner.push(kayit.ad);
            kayit.forceNeden = `kısmi: job saatine çakışma ${dk(oD)} dk -> ${dk(oZ)} dk`;
          } else sonuc.uyarilar.push(`${kayit.ad}: bakımı ${cakisan.join(", ")} job saatine denk geliyor, force çakışmayı azaltmıyor`);
        }
      }
      sonuc.sunucular.push(kayit);
    }
    sonuc.magazalar = magazalar.map((m) => ({ ad: m.ad, kalanDk: m.reset ? dk(m.reset - t) : null, bekleyen: m.bekleyen.length, bekleyenOrnek: m.bekleyen.slice(0, 3).map((b) => `${b.ad} (${b.srv.join(", ") || "sunucusuz"})`), K: [...m.K].map((id) => (S[id] && S[id].serverName) || id), satisIzin: m.ad === "HOME" || !m.K.has(m.sunucu) ? true : (sonuc.sunucular.find((x) => x.id === m.sunucu) || {}).durum === "izinli" }));
    sonuc.izinli = sonuc.sunucular.filter((x) => x.durum === "izinli").map((x) => x.id);
    sonuc.haricMagaza = sonuc.magazalar.filter((m) => !m.satisIzin).map((m) => m.ad);
    sonuc.hazir = true;
    return sonuc;
  };

  let sonHesap = null;
  const durumYaz = () => {
    sonHesap = hesapla();
    chrome.storage.local.set({ planDurum: { ...sonHesap, ayar, calisma, log, haritaYasDk: haritaZaman ? dk(simdi() - haritaZaman) : null, ogrenme: { bakim: ogr.bakimlar.length, olculen: ogr.bakimlar.filter((b) => b.bas).length, job: Object.values(ogr.isler).reduce((a, x) => a + Object.values(x).reduce((b, y) => b + y.n, 0), 0) } } });
  };

  const otomasyonBos = () => {
    const q = depo.automationQueueStatus || {};
    return !q.active && !(q.queued || []).length && !depo.autoJobsRunning && !depo.valuableSearchRunning && !depo.valuableSellerRunning;
  };
  const tdMacta = () => {
    const d = depo.durum;
    return !!(d && d.macta && simdi() - (d.zaman || 0) < 30000);
  };
  const mesgul = (v) => chrome.storage.local.set({ planMesgul: !!v });

  let dongude = false;
  const dongu = async () => {
    if (dongude) return;
    dongude = true;
    try {
      calisma = { adim: "hazirlik", bas: simdi(), sonDongu: calisma.sonDongu, secilen: [], haricMagaza: [] };
      kaydetCalisma();
      await mesgul(true);
      yaz("döngü: TD yeni maça girmeyecek, maç bitmesi bekleniyor");
      const bekleBas = simdi();
      while (tdMacta()) {
        if (!ayar.acik || ayar.oneri) throw new Error("kapatıldı");
        if (simdi() - bekleBas > 40 * 60000) throw new Error("TD maçı 40 dk'da bitmedi");
        await uyu(5000);
      }
      haritaIste();
      await bekleMesaj("COR3_WS_MAP_DATA", 15000);
      durumYaz();
      if (!sonHesap.hazir || (!sonHesap.izinli.length && !sonHesap.forceOner.length)) throw new Error("izinli sunucu yok");
      calisma.adim = "arama";
      kaydetCalisma();
      yaz(`arama: ${sonHesap.izinli.length} izinli sunucu`);
      await chrome.storage.local.set({ valuableSearchRunning: true, valuableSellerRunning: false });
      const r1 = await aktar({ action: "startValuableSearch", onlyServers: sonHesap.izinli });
      if (!r1.ok) throw new Error("arama başlatılamadı: " + (r1.hata || ""));
      if (await bekleMesaj("COR3_VALUABLE_DONE", 120 * 60000) === null) throw new Error("arama 120 dk'da bitmedi");
      await uyu(2000);
      haritaIste();
      await bekleMesaj("COR3_WS_MAP_DATA", 15000);
      const st = await chrome.storage.local.get(["valuableServersData", "valuableDownloadsData"]);
      durumYaz();
      const izin = new Set(sonHesap.izinli);
      const secilen = ((st.valuableServersData && st.valuableServersData.servers) || []).filter((s) => izin.has(s.id) && ((s.files || []).length + (s.logs || []).length) > 0).map((s) => s.id);
      const indir = ((st.valuableDownloadsData && st.valuableDownloadsData.files) || []).map((f) => f.id);
      calisma.secilen = secilen;
      calisma.haricMagaza = sonHesap.haricMagaza;
      if (!secilen.length && !indir.length) yaz("satılacak bir şey yok");
      else {
        calisma.adim = "satis";
        kaydetCalisma();
        yaz(`satış: ${secilen.length} sunucu, ${indir.length} indirilen; satılmayacak market: ${sonHesap.haricMagaza.join(", ") || "yok"}`);
        await chrome.storage.local.set({ valuableSellerRunning: true, valuableSearchRunning: false });
        const r2 = await aktar({ action: "startValuableSeller", selectedServers: secilen, selectedDownloads: indir, excludeMarkets: sonHesap.haricMagaza });
        if (!r2.ok) throw new Error("satış başlatılamadı: " + (r2.hata || ""));
        if (await bekleMesaj("COR3_VALUABLE_DONE", 150 * 60000) === null) throw new Error("satış 150 dk'da bitmedi");
        await uyu(3000);
      }
      if (!ayar.force) { yaz("force kapalı, bitti"); return; }
      haritaIste();
      await bekleMesaj("COR3_WS_MAP_DATA", 15000);
      durumYaz();
      const kullanilan = new Set(secilen);
      const oneri = new Set(sonHesap.forceOner);
      const zorla = sonHesap.sunucular.filter((s) => s.uyari && !s.bakimBitis && ((s.durum === "izinli" && kullanilan.has(s.id)) || oneri.has(s.ad)));
      if (!zorla.length) { yaz("uyarı alan sunucu yok, force gerekmedi"); return; }
      calisma.adim = "force";
      kaydetCalisma();
      yaz(`force: ${zorla.map((s) => s.ad).join(", ")}`);
      const r3 = await aktar({ action: "forceMaintenanceBatch", servers: zorla.map((s) => ({ id: s.id, name: s.ad })) });
      if (!r3.ok) throw new Error("force başlatılamadı: " + (r3.hata || ""));
      if (await bekleMesaj("COR3_VALUABLE_FORCE_MAINT_DONE", 180 * 60000) === null) throw new Error("force 180 dk'da bitmedi");
      yaz("force bitti");
    } catch (e) {
      yaz("durdu: " + e.message);
      const q = (await chrome.storage.local.get("automationQueueStatus")).automationQueueStatus || {};
      if (q.active !== "auto-valuable" && !(q.queued || []).includes("auto-valuable")) await chrome.storage.local.set({ valuableSearchRunning: false, valuableSellerRunning: false });
    } finally {
      calisma.adim = "bos";
      calisma.sonDongu = simdi();
      kaydetCalisma();
      await mesgul(false);
      dongude = false;
      haritaIste();
      durumYaz();
    }
  };

  let gunlukSon = 0;
  const gunlukDene = async () => {
    const d = depo.dailyOpsData;
    if (!ayar.gunluk || dongude || !d || !otomasyonBos() || tdMacta()) return false;
    const yeni = !d.hasClaimedToday || (d.lastClaimDate && d.lastClaimDate.slice(0, 10) < new Date().toISOString().slice(0, 10));
    if (!yeni || (d.nextTaskTime && Date.parse(d.nextTaskTime) > simdi()) || simdi() - gunlukSon < 60 * 60000) return false;
    gunlukSon = simdi();
    dongude = true;
    try {
      await mesgul(true);
      yaz("daily ops başlatılıyor");
      await chrome.storage.sync.set({ autoDailyHackEnabled: true });
      const r = await aktar({ action: "toggleDailyHackSolver", enabled: true });
      if (!r.ok) throw new Error(r.hata || "başlatılamadı");
      const bas = simdi();
      while (simdi() - bas < 10 * 60000) {
        await uyu(10000);
        const s = await chrome.storage.sync.get("autoDailyHackEnabled");
        if (!s.autoDailyHackEnabled) break;
      }
      const l = await chrome.storage.local.get("dailyHackLog");
      yaz("daily ops: " + String(l.dailyHackLog || "bitti").split(/\r?\n/).filter(Boolean).slice(-1)[0].slice(0, 120));
    } catch (e) { yaz("daily ops durdu: " + e.message); }
    finally { await mesgul(false); dongude = false; }
    return true;
  };

  const tik = () => {
    if (simdi() - haritaZaman > 5 * 60000) haritaIste();
    durumYaz();
    if (ayar.acik && !ayar.oneri && !dongude && depo.dailyOpsData && ayar.gunluk) gunlukDene();
    if (!ayar.acik || ayar.oneri || dongude) return;
    if (simdi() - (calisma.sonDongu || 0) < ayar.aralikDk * 60000) return;
    if (!sonHesap || !sonHesap.hazir || (!sonHesap.izinli.length && !sonHesap.forceOner.length)) return;
    if (!otomasyonBos()) return;
    dongu();
  };

  window.addEventListener("message", (e) => {
    if (e.source !== window || !e.data) return;
    if (e.data.type === "COR3_WS_MAP_DATA" && Array.isArray(e.data.servers)) {
      harita = { servers: e.data.servers, connections: e.data.connections || [] };
      haritaZaman = simdi();
      haritaIsle(e.data.servers, e.data.connections, haritaZaman);
    }
    if (e.data.type === "COR3_WS_MAINTENANCE_STARTED" && e.data.data && e.data.data.serverId) {
      if (e.data.data.reason === "started") { ogr.basla[e.data.data.serverId] = new Date().toISOString(); kaydetOgr(); }
      if (e.data.data.reason === "ended") { bitisIsle(e.data.data.serverId, new Date().toISOString()); kaydetOgr(); }
      setTimeout(haritaIste, 2000);
    }
  });

  chrome.storage.onChanged.addListener((d, alan) => {
    if (alan === "sync" && d.autoJobsSelectedTypes) { depo.seciliTurler = d.autoJobsSelectedTypes.newValue || null; durumYaz(); }
    if (alan !== "local") return;
    for (const k of Object.keys(d)) if (ANAHTAR.includes(k)) depo[k] = d[k].newValue;
    if (d.planAyar) {
      ayar = { ...VARSAYILAN, ...(d.planAyar.newValue || {}) };
      if (!ayar.acik || ayar.oneri) mesgul(false);
      durumYaz();
    }
    if (d.planKomut && d.planKomut.newValue) {
      const k = d.planKomut.newValue.k;
      if (k === "hesapla") { haritaIste(); setTimeout(durumYaz, 1500); }
      if (k === "simdi" && !dongude && ayar.acik && !ayar.oneri) dongu();
    }
    for (const m of MAG) if (d[m.veri] && d[m.veri].newValue) for (const j of d[m.veri].newValue.jobs || []) isKaydet(m.k, j);
  });

  chrome.storage.local.get(ANAHTAR, async (r) => {
    depo = r;
    try { depo.seciliTurler = (await chrome.storage.sync.get("autoJobsSelectedTypes")).autoJobsSelectedTypes || null; } catch {}
    ayar = { ...VARSAYILAN, ...(r.planAyar || {}) };
    if (r.planOgrenme && r.planOgrenme.surum === 2) ogr = r.planOgrenme;
    if (r.planCalisma) calisma = { ...r.planCalisma, adim: "bos" };
    await mesgul(false);
    if (!ogr.tohum) {
      const n = await tohumla();
      ogr.tohum = true;
      kaydetOgr();
      yaz(`geçmiş kayıttan öğrenildi: ${n || 0} job listesi, ${ogr.bakimlar.length} bakım`);
    }
    for (const m of MAG) if (r[m.veri]) for (const j of r[m.veri].jobs || []) isKaydet(m.k, j);
    kaydetOgr();
    haritaIste();
    setTimeout(tik, 3000);
    setInterval(tik, 60000);
  });
})();
