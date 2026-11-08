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

  const son = { tdIs: null, kuyruk: null, plan: new Set(), jobLog: "", valLog: "", sonuc: new Set(), mac: null, kosu: {}, ayar: null, planAyar: null, mesgul: null, planOzet: 0 };
  const logYeni = (l, anahtar, k) => {
    if (!Array.isArray(l) || !l.length) return;
    const imza = (e) => (e.timestamp || "") + "|" + (e.msg || "");
    let i = son[anahtar] ? l.findIndex((e) => imza(e) === son[anahtar]) : l.length - 1;
    for (let j = i + 1; j < l.length; j++) yaz(k, `${l[j].level || ""} ${l[j].msg || ""}`.trim());
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
    if (d.autoJobsDebugLogs) logYeni(d.autoJobsDebugLogs, "jobLog", "job");
    if (d.valuableDebugLogs) logYeni(d.valuableDebugLogs, "valLog", "valuable");
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

  const WS = /"action":"(maintenance|receive\.credits|job\.complete|job\.take|tower-defense\.(start\.run|run\.completed|match\.found|leave\.match)|sell\.items|hack\.start)"/;
  window.addEventListener("message", (e) => {
    if (e.source !== window || !e.data) return;
    if (e.data.type === "COR3_WS_LOG" && typeof e.data.message === "string") {
      const m = e.data.message.match(WS);
      if (!m) return;
      try {
        const p = JSON.parse(e.data.message.slice(e.data.message.indexOf("[")));
        const v = p[1] && p[1].data;
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
  });
  window.addEventListener("beforeunload", () => { yaz("sistem", "sayfa kapanıyor/yenileniyor"); bosalt(); });
})();
