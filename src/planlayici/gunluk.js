(() => {
  if (window.__cor3Gunluk) return;
  window.__cor3Gunluk = true;
  const DB = "cor3_gunluk", ST = "olay", SAKLA_GUN = 7;
  let db = null;
  const kuyruk = [];
  const yaz = (k, m, v) => kuyruk.push(v === undefined ? { t: new Date().toISOString(), k, m: String(m).slice(0, 600) } : { t: new Date().toISOString(), k, m: String(m).slice(0, 600), v });
  const ac = () => new Promise((res) => {
    try {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => { const s = r.result.createObjectStore(ST, { keyPath: "id", autoIncrement: true }); s.createIndex("t", "t"); };
      r.onsuccess = () => res(r.result);
      r.onerror = () => res(null);
    } catch { res(null); }
  });
  const bosalt = () => {
    if (!db || !kuyruk.length) return;
    const l = kuyruk.splice(0, kuyruk.length);
    try { const tx = db.transaction(ST, "readwrite"); const s = tx.objectStore(ST); for (const o of l) s.add(o); } catch { kuyruk.unshift(...l); }
  };
  const temizle = () => {
    if (!db) return;
    try {
      const sinir = new Date(Date.now() - SAKLA_GUN * 86400000).toISOString();
      const c = db.transaction(ST, "readwrite").objectStore(ST).index("t").openCursor(IDBKeyRange.upperBound(sinir));
      c.onsuccess = (e) => { const cur = e.target.result; if (cur) { cur.delete(); cur.continue(); } };
    } catch {}
  };
  const nedenTr = (h) => {
    const t = String(h || "");
    if (/^Pre-check/.test(t)) { const o = nedenTr(t.replace(/^Pre-check: /, "")); return { n: o.n + " Job alınmadı, depozito ödenmedi.", c: o.c, tip: o.tip }; }
    if (/no decrypt software/i.test(t)) return { n: "Bu dosya türünü açacak decrypt yazılımı yok.", c: "Alım gerekir: o türü açan yazılım (Tavsiye > Dosya türleri).", tip: "alim" };
    let m;
    if (/conditions not met/i.test(t)) return { n: "Dosya çözülemedi: çözme oyunu tamamlanmadı, oyun jobu kabul etmedi, depozito gitti.", c: "Oyun türü tanınmayınca sayfa otomatik yenileniyor; tekrar olmamalı.", tip: "oto" };
    if (/decrypt power \d+ < encryption level/i.test(t)) return { n: "Çözme gücü dosyanın şifre seviyesine yetmiyor.", c: "Alım gerekir: o dosya türünü açan daha güçlü decrypt yazılımı ya da donanım.", tip: "alim" };
    if (/Insufficient decrypt power/i.test(t)) return { n: "Çözme gücü yetmiyor: bu dosya türünü açacak güçte yazılım yok.", c: "Alım gerekir: 5CRYPt0L 09 (D4RK, itibar 3). Tavsiye edilen alımlar listesine bak.", tip: "alim" };
    if (/hack power|serverDefenceRate/i.test(t)) return { n: "Hack gücü sunucu savunmasından düşük.", c: "Alım gerekir: daha güçlü CPU/PSU (tavsiye listesinde ilk sırada).", tip: "alim" };
    if (/no hack(ing)? software|sai-no-hack/i.test(t)) return { n: "Bu sunucu türünü açacak hack yazılımı yok.", c: "Alım gerekir: o türe uygun hack yazılımı.", tip: "alim" };
    if (/market unreachable|Market not reach/i.test(t)) return { n: "Markete ulaşılamadı: yol sunucularına erişim yoktu.", c: "Yol sunucuları yalnız store'larında job beklemiyorken ve reset bakım + pay + 15 dk uzaktayken aranıp force ediliyor; job saatinde Helper yolu yeniden hack'liyor.", tip: "oto" };
    if ((m = /^maintenance: (.+)$/.exec(t)) || /in maintenance/i.test(t)) return { n: "Sunucu job saatinde bakımdaydı" + (m ? ": " + m[1].replace(/\(blocked by ([^)]+)\)/g, "(yolundaki $1 bakımda)") : "") + ".", c: "Planlayıcı job sunucularını yalnız force öncesi arıyor, yarıda kalan turu tekrarlıyor.", tip: "oto" };
    if (/Hack failed|no access granted/i.test(t)) return { n: "Sunucu hacklenemedi.", c: "Oyun türü tanınmazsa sayfa yenileniyor; güç yetmiyorsa alım gerekir.", tip: "izle" };
    if (/unreachable|no path/i.test(t)) return { n: "Sunucuya ulaşılamadı.", c: "Yol açılınca Helper tekrar dener.", tip: "izle" };
    if (/timed out|timeout/i.test(t)) return { n: "Zaman aşımı.", c: "Helper sonraki turda tekrar dener.", tip: "izle" };
    return { n: t.slice(0, 140) || "neden yazılmamış", c: "Bilinmeyen hata; günlükte izleniyor.", tip: "izle" };
  };
  const ozetYaz = () => {
    if (!db) return;
    const sinir = new Date(Date.now() - 3 * 86400000).toISOString();
    const gunler = {};
    const gun = (t) => { const k = new Date(t).toLocaleDateString("sv-SE"); return gunler[k] || (gunler[k] = { job: 0, jobCr: 0, kacan: 0, satis: 0, satisCr: 0, depozito: 0, liste: [] }); };
    const saatAd = (t) => new Date(t).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    try {
      const c = db.transaction(ST).objectStore(ST).index("t").openCursor(IDBKeyRange.lowerBound(sinir));
      c.onsuccess = (e) => {
        const cur = e.target.result;
        if (cur) {
          const x = cur.value, m = String(x.m || "");
          if (x.k === "job") {
            let q;
            if ((q = /^sonuç: (\S+) (.+?) @\S+ done \+(-?\d+) CR/.exec(m))) { const g = gun(x.t); const a = q[1].toUpperCase() + " " + q[2]; g.kaynak = g.kaynak || {}; const k0 = g.kaynak[a] || (g.kaynak[a] = [0, 0]); k0[0]++; k0[1] += +q[3]; }
            if ((q = /✅ Job completed: .*🏅(\d+)/.exec(m))) { const g = gun(x.t); g.renown = (g.renown || 0) + +q[1]; }
            const o = /Auto Jobs Complete: (\d+) done, (\d+) failed(?:, (\d+) skipped)?.*?Net: 💰(-?[\d,.]+)(?: \(deposits: (-?[\d,.]+)\))?/.exec(m);
            let e = null, f;
            if ((f = /^sonuç: (\S+) (.+?) @(\S+) (failed|skipped)(?: hata: (.+))?$/.exec(m))) e = { m: f[1], ad: f[2], sv: f[3] === "None" ? "" : f[3], ham: f[5] || f[4] };
            else if ((f = /Job skipped \((.+?)\): (.+?) —/.exec(m)) && /market unreachable/.test(f[1])) e = { m: "", ad: f[2], sv: "", ham: "market unreachable" };
            else if ((f = /skipped (\d+ )?job\(s\) due to maintenance: (.+)$/.exec(m))) e = { m: "", ad: (f[1] ? f[1].trim() + " job" : "job"), sv: f[2].split(/,| \(/)[0], ham: "maintenance: " + f[2] };
            if (e) { const g = gun(x.t); if (g.liste.length < 80) g.liste.push({ s: saatAd(x.t), ...e, ...nedenTr(e.ham) }); }
            if (o) { const g = gun(x.t); g.job += +o[1]; g.kacan += +o[2] + +(o[3] || 0); g.jobCr += Number(o[4].replace(/[,.]/g, "")) || 0; g.depozito += Number((o[5] || "0").replace(/[,.]/g, "")) || 0; }
          } else if (x.k === "ws" && m === "← sell.items" && x.v) { const g = gun(x.t); g.satis += (x.v.items || []).length; g.satisCr += x.v.totalPrice || 0; }
          cur.continue();
          return;
        }
        for (const g of Object.values(gunler)) {
          g.deneme = g.kacan;
          g.kacan = new Set(g.liste.map((e) => [e.m, e.ad, e.sv, e.n].join("|"))).size;
        }
        chrome.storage.local.set({ ozet3: { zaman: Date.now(), gunler } }).then(() => raporYaz(gunler));
      };
    } catch {}
  };
  const HEDEF_CR = 1310000;
  const raporYaz = async (gunler) => {
    const n = new Date();
    if (n.getHours() < 8) return;
    const bugun = n.toLocaleDateString("sv-SE");
    const r = await chrome.storage.local.get(["gunlukRapor", "kosular", "marketData", "darkMarketData", "soyuzMarketData", "usolMarketData", "profilIlerleme"]);
    if (r.gunlukRapor && r.gunlukRapor.gun === bugun) return;
    const dun = new Date(n.getTime() - 86400000).toLocaleDateString("sv-SE");
    const tdNet = (k) => (r.kosular || []).filter((x) => x.completedAt && new Date(x.completedAt).toLocaleDateString("sv-SE") === k).reduce((a, x) => a + (typeof x.rewardPaid === "number" ? x.rewardPaid : 0) - (x.entryFee ?? 1000), 0);
    const g = gunler[dun] || { job: 0, jobCr: 0, kacan: 0, satis: 0, satisCr: 0, liste: [] };
    const sayi = (x) => Math.round(x).toLocaleString("tr-TR");
    const td = tdNet(dun);
    const toplam = g.jobCr + g.satisCr + td;
    const kaynak = Object.entries(g.kaynak || {}).sort((a, b) => b[1][1] - a[1][1]).slice(0, 8).map(([k, v]) => `${k}: ${v[0]} job, ${sayi(v[1])} CR`);
    const grup = new Map();
    for (const e of g.liste || []) { const k = [e.m, e.ad, e.sv].join("|"); const o = grup.get(k) || { ...e, adet: 0 }; o.adet++; grup.set(k, o); }
    const kacan = [...grup.values()].sort((a, b) => b.adet - a.adet).slice(0, 6).map((e) => `${[e.m && e.m.toUpperCase(), e.ad, e.sv].filter(Boolean).join(" ")}${e.adet > 1 ? " ×" + e.adet : ""}: ${e.n || e.ham || "?"}`);
    const kredi = [r.marketData, r.darkMarketData, r.soyuzMarketData, r.usolMarketData].map((m) => m && m.userCredits).find((x) => typeof x === "number");
    const rep = r.darkMarketData && r.darkMarketData.reputation;
    const onceki = new Date(n.getTime() - 2 * 86400000).toLocaleDateString("sv-SE");
    const g2 = gunler[onceki];
    const ort = g2 ? (toplam + g2.jobCr + g2.satisCr + tdNet(onceki)) / 2 : toplam;
    const kalanGun = typeof kredi === "number" && ort > 0 ? Math.max(0, (HEDEF_CR - kredi) / ort) : null;
    const pr = r.profilIlerleme && r.profilIlerleme.data;
    const satirlar = [
      `Dün (${dun}) toplam: ${toplam >= 0 ? "+" : ""}${sayi(toplam)} CR`,
      `Joblar: ${g.job} job, ${sayi(g.jobCr)} CR net · Satış: ${g.satis || 0} dosya, ${sayi(g.satisCr)} CR · TD net: ${td >= 0 ? "+" : ""}${sayi(td)} CR`,
      ...kaynak.map((x) => "  " + x),
      `Kaçan joblar: ${g.kacan}`,
      ...kacan.map((x) => "  " + x),
      `Renown: dün +${g.renown || 0}` + (pr ? ` (son: ${JSON.stringify(pr).slice(0, 120)})` : ""),
      rep ? `D4RK itibarı: seviye ${rep.level}, ${sayi(rep.progress || 0)}/${sayi(rep.requiredReputation || 0)}` : "D4RK itibarı: bilinmiyor",
      typeof kredi === "number" ? `Bakiye: ${sayi(kredi)} CR · hedef ${sayi(HEDEF_CR)} CR` + (kalanGun !== null ? ` · bu hızla ~${kalanGun.toFixed(1)} gün (günlük ort. ${sayi(ort)} CR)` : "") : "Bakiye: bilinmiyor",
    ];
    await chrome.storage.local.set({ gunlukRapor: { gun: bugun, zaman: Date.now(), baslik: `Sabah raporu ${bugun}: dün ${toplam >= 0 ? "+" : ""}${sayi(toplam)} CR`, satirlar } });
    yaz("sistem", "sabah raporu yazıldı", { satirlar });
  };
  const indir = () => {
    if (!db) return;
    const tum = [];
    const c = db.transaction(ST).objectStore(ST).openCursor();
    c.onsuccess = (e) => {
      const cur = e.target.result;
      if (cur) { tum.push(cur.value); cur.continue(); return; }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(tum)], { type: "application/json" }));
      a.download = `cor3-gunluk-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-")}.json`;
      document.documentElement.append(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 5000);
    };
  };

  let tespitler = [];
  const tespitYok = () => {
    const t = Date.now();
    tespitler = tespitler.filter((x) => t - x < 15 * 60000).concat(t);
    if (tespitler.length < 2) return;
    let onceki = 0;
    try { onceki = Number(localStorage.getItem("cor3TespitYenile") || 0); } catch {}
    if (t - onceki < 30 * 60000) return;
    chrome.storage.local.get(["durum", "planMesgul", "automationQueueStatus"], (r) => {
      if (r.durum && r.durum.macta && t - (r.durum.zaman || 0) < 30000) return;
      const q = r.automationQueueStatus || {};
      if (r.planMesgul || ["auto-valuable", "auto-valuable-force"].includes(q.active)) { yaz("sistem", "minigame türü algılanamadı ama planlayıcı/arama sürüyor, yenileme ertelendi"); tespitler = []; return; }
      try { localStorage.setItem("cor3TespitYenile", String(t)); } catch {}
      yaz("sistem", "minigame türü algılanamadı (2 kez), sayfa yenileniyor");
      bosalt();
      setTimeout(() => location.reload(), 1500);
    });
  };
  const doktor = { qAktif: null, qBas: 0, bayrakBas: 0, mesgulBas: 0, tdIs: null, tdBas: 0, sonLog: Date.now() };
  const duzelt = (m, yenile) => {
    yaz("sistem", "otomatik düzeltme: " + m);
    chrome.storage.local.set({ sonDuzeltme: { t: Date.now(), m } });
    if (!yenile) return;
    let onceki = 0;
    try { onceki = Number(localStorage.getItem("cor3TespitYenile") || 0); } catch {}
    if (Date.now() - onceki < 30 * 60000) return;
    try { localStorage.setItem("cor3TespitYenile", String(Date.now())); } catch {}
    bosalt();
    setTimeout(() => location.reload(), 1500);
  };
  const doktorKontrol = () => chrome.storage.local.get(["automationQueueStatus", "valuableSearchRunning", "valuableSellerRunning", "planMesgul", "planCalisma", "durum", "ayar"], (r) => {
    const t = Date.now(), q = r.automationQueueStatus || {}, d = r.durum || {};
    const macta = d.macta && t - (d.zaman || 0) < 30000;
    if (q.active !== doktor.qAktif) { doktor.qAktif = q.active; doktor.qBas = t; }
    if (q.active && t - doktor.qBas > 45 * 60000 && t - doktor.sonLog > 15 * 60000 && !macta) duzelt(`Helper "${q.active}" 45 dk'dır ilerlemiyor, sayfa yenileniyor`, true);
    const bos = !q.active && !(q.queued || []).length;
    if (bos && (r.valuableSearchRunning || r.valuableSellerRunning)) { if (!doktor.bayrakBas) doktor.bayrakBas = t; else if (t - doktor.bayrakBas > 5 * 60000) { chrome.storage.local.set({ valuableSearchRunning: false, valuableSellerRunning: false }); doktor.bayrakBas = 0; duzelt("takılı kalan arama/satış bayrağı sıfırlandı"); } } else doktor.bayrakBas = 0;
    const adim = r.planCalisma && r.planCalisma.adim;
    if (r.planMesgul && (!adim || adim === "bos")) { if (!doktor.mesgulBas) doktor.mesgulBas = t; else if (t - doktor.mesgulBas > 5 * 60000) { chrome.storage.local.set({ planMesgul: false }); doktor.mesgulBas = 0; duzelt("planlayıcı meşgul bayrağı takılı kalmıştı, sıfırlandı (TD serbest)"); } } else doktor.mesgulBas = 0;
    if (r.ayar && r.ayar.acik && !macta && bos && !r.planMesgul) {
      if (d.sonIs !== doktor.tdIs) { doktor.tdIs = d.sonIs; doktor.tdBas = t; }
      else if (t - doktor.tdBas > 25 * 60000 && !/bekle|joblar bitmedi|maç bitince dur|durdu|CR sınırı|mola|kayıp sonrası/.test(String(d.sonIs))) { doktor.tdBas = t; duzelt(`TD 25 dk'dır "${d.sonIs}" durumunda takılı, sayfa yenileniyor`, true); }
    } else { doktor.tdIs = d.sonIs; doktor.tdBas = t; }
  });
  const son = { tdIs: null, kuyruk: null, plan: new Set(), jobLog: "", valLog: "", sonuc: new Set(), mac: null, kosu: {}, ayar: null, planAyar: null, mesgul: null, planOzet: 0 };
  const logYeni = (l, anahtar, k) => {
    if (!Array.isArray(l) || !l.length) return;
    const imza = (e) => (e.timestamp || "") + "|" + (e.msg || "");
    let i = son[anahtar] ? l.findIndex((e) => imza(e) === son[anahtar]) : l.length - 1;
    for (let j = i + 1; j < l.length; j++) { yaz(k, `${l[j].level || ""} ${l[j].msg || ""}`.trim()); if (/Could not detect hack type/.test(l[j].msg || "")) tespitYok(); }
    son[anahtar] = imza(l[l.length - 1]);
  };
  const farkYaz = (k, eski, yeni) => {
    if (!eski || !yeni) return;
    const d = Object.keys(yeni).filter((x) => JSON.stringify(eski[x]) !== JSON.stringify(yeni[x]));
    if (d.length) yaz(k, "ayar değişti: " + d.map((x) => `${x}=${JSON.stringify(yeni[x])}`).join(", ").slice(0, 500));
  };
  const planIsle = (p) => {
    if (!p) return;
    for (const satir of p.log || []) if (!son.plan.has(satir)) { son.plan.add(satir); yaz("plan", satir); }
    if (son.plan.size > 500) son.plan = new Set([...son.plan].slice(-200));
    if (Date.now() - son.planOzet > 15 * 60000 && p.hazir) {
      son.planOzet = Date.now();
      yaz("plan", "durum", {
        adim: p.calisma && p.calisma.adim,
        magaza: (p.magazalar || []).map((m) => `${m.ad} ${m.kalanDk}dk bekleyen ${m.bekleyen}${m.satisIzin ? "" : " satış yok"}`),
        izinli: (p.sunucular || []).filter((s) => s.durum === "izinli").map((s) => s.ad),
        korunan: (p.sunucular || []).filter((s) => s.durum === "korunan").map((s) => `${s.ad}: ${s.neden}`),
        bakimda: (p.sunucular || []).filter((s) => s.bakimBitis).map((s) => `${s.ad} -> ${s.bakimBitis}`),
        uyari: (p.sunucular || []).filter((s) => s.uyari && !s.bakimBitis).map((s) => `${s.ad} @ ${s.uyari}`),
        force: p.forceOner, uyarilar: p.uyarilar,
      });
    }
  };
  const isle = (d) => {
    if (d.durum) {
      const x = d.durum;
      if (x && x.sonIs !== son.tdIs) { son.tdIs = x.sonIs; yaz("td", x.sonIs || "-", x.mac ? { dalga: x.mac.dalga, can: x.mac.can, altin: x.mac.altin } : undefined); }
    }
    if (d.automationQueueStatus) {
      const q = d.automationQueueStatus;
      const s = q ? `${q.active || "boş"}${(q.queued || []).length ? " (sırada: " + q.queued.join(", ") + ")" : ""}` : "boş";
      if (s !== son.kuyruk) { son.kuyruk = s; yaz("helper", "iş sırası: " + s); }
    }
    if (d.planMesgul !== undefined && d.planMesgul !== son.mesgul) { son.mesgul = d.planMesgul; yaz("plan", d.planMesgul ? "TD bekletiliyor" : "TD serbest"); }
    if (d.autoJobsDebugLogs) { logYeni(d.autoJobsDebugLogs, "jobLog", "job"); doktor.sonLog = Date.now(); }
    if (d.valuableDebugLogs) { logYeni(d.valuableDebugLogs, "valLog", "valuable"); doktor.sonLog = Date.now(); }
    if (d.autoJobsCompletedResults) for (const r of d.autoJobsCompletedResults || []) {
      const k = r.jobId + r.status;
      if (son.sonuc.has(k)) continue;
      son.sonuc.add(k);
      if (son.ilkSonuc) yaz("job", `sonuç: ${r.marketKey} ${r.name} @${r.serverName} ${r.status}${r.reward ? " +" + r.reward.credits + " CR" : ""}${r.error ? " hata: " + r.error : ""}`);
    }
    if (d.maclar) {
      const l = d.maclar, m = l[l.length - 1];
      if (m && m.tarih !== son.mac) { if (son.mac !== null) yaz("td", `maç bitti: ${m.sonuc} dalga ${m.dalga} can ${m.can} gelir ${m.gelir}/${m.rakipGelir} ${m.mod}${m.gecersiz ? " geçersiz: " + m.gecersiz : ""}`); son.mac = m.tarih; }
    }
    if (d.kosular) for (const k of d.kosular || []) {
      const s = `${k.status} ${k.wins}G ${k.losses}M ${k.rewardPaid ?? ""}`;
      if (son.kosu[k.runId] !== undefined && son.kosu[k.runId] !== s) yaz("td", `giriş ${k.startedAt}: ${s}`);
      son.kosu[k.runId] = s;
    }
    if (d.ayar) { farkYaz("ayar", son.ayar, d.ayar); son.ayar = d.ayar; }
    if (d.planAyar) { farkYaz("ayar", son.planAyar, d.planAyar); son.planAyar = d.planAyar; }
    if (d.planDurum) planIsle(d.planDurum);
  };

  const WS = /"action":"(maintenance|receive\.credits|receive\.progress|job\.complete|job\.take|tower-defense\.(start\.run|run\.completed|match\.found|leave\.match)|sell\.items|hack\.start)"/;
  window.addEventListener("message", (e) => {
    if (e.source !== window || !e.data) return;
    if (e.data.type === "COR3_DAILY_HACK_LOG") { yaz("daily", e.data.message); return; }
    if (e.data.type === "COR3_WS_LOG" && typeof e.data.message === "string") {
      const m = e.data.message.match(WS);
      if (!m) return;
      try {
        const p = JSON.parse(e.data.message.slice(e.data.message.indexOf("[")));
        const v = p[1] && p[1].data;
        if (m[1] === "receive.progress" && v) chrome.storage.local.set({ profilIlerleme: { t: Date.now(), data: v } });
        yaz("ws", `${e.data.direction === "sent" ? "→" : "←"} ${m[1]}`, v ? JSON.parse(JSON.stringify(v, (k, x) => (typeof x === "string" && x.length > 200 ? x.slice(0, 200) : x))) : undefined);
      } catch { yaz("ws", m[1]); }
    }
  });

  const ANAHTAR = ["durum", "automationQueueStatus", "planMesgul", "autoJobsDebugLogs", "valuableDebugLogs", "autoJobsCompletedResults", "maclar", "kosular", "ayar", "planAyar", "planDurum"];
  ac().then((d) => {
    db = d;
    temizle();
    yaz("sistem", "sayfa açıldı", { surum: chrome.runtime.getManifest().version, adres: location.href });
    chrome.storage.local.get(ANAHTAR, (r) => {
      const ilk = {};
      for (const k of ANAHTAR) if (r[k] !== undefined) ilk[k] = r[k];
      son.ayar = r.ayar || null;
      son.planAyar = r.planAyar || null;
      son.jobLog = (r.autoJobsDebugLogs || []).length ? (r.autoJobsDebugLogs.at(-1).timestamp || "") + "|" + (r.autoJobsDebugLogs.at(-1).msg || "") : "";
      son.valLog = (r.valuableDebugLogs || []).length ? (r.valuableDebugLogs.at(-1).timestamp || "") + "|" + (r.valuableDebugLogs.at(-1).msg || "") : "";
      for (const x of r.autoJobsCompletedResults || []) son.sonuc.add(x.jobId + x.status);
      son.ilkSonuc = true;
      son.mac = r.maclar && r.maclar.length ? r.maclar.at(-1).tarih : "";
      for (const k of r.kosular || []) son.kosu[k.runId] = `${k.status} ${k.wins}G ${k.losses}M ${k.rewardPaid ?? ""}`;
      isle({ durum: ilk.durum, automationQueueStatus: ilk.automationQueueStatus, planMesgul: ilk.planMesgul });
      chrome.storage.onChanged.addListener((ch, alan) => {
        if (alan !== "local") return;
        if (ch.gunlukIndir) indir();
        const d = {};
        for (const k of ANAHTAR) if (ch[k]) d[k] = ch[k].newValue;
        if (Object.keys(d).length) isle(d);
      });
    });
    setInterval(bosalt, 3000);
    setInterval(temizle, 6 * 3600000);
    setTimeout(ozetYaz, 20000);
    setInterval(ozetYaz, 10 * 60000);
    setInterval(doktorKontrol, 2 * 60000);
  });
  window.addEventListener("beforeunload", () => { yaz("sistem", "sayfa kapanıyor/yenileniyor"); bosalt(); });
})();
