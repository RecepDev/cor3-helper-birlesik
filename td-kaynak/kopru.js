(() => {
  const gonder = (veri) => window.postMessage({ kaynak: "cor3td-kopru", ...veri }, location.origin);
  const ayarYolla = () => chrome.storage.local.get("ayar", (r) => {
    const a = r.ayar || { acik: false };
    if ((a.surum || 0) < 8 && r.ayar) { a.minOran = 0.15; a.minPay = 0; a.surum = 8; chrome.storage.local.set({ ayar: a }); }
    gonder({ ayar: a });
  });
  ayarYolla();
  const panelSayfa = (() => {
    try {
      const l = (chrome.runtime.getManifest().web_accessible_resources || []).flatMap((w) => w.resources || []);
      return l.includes("popup.html") ? "popup.html" : l.find((x) => /(^|\/)popup\.html$/.test(x)) || "popup.html";
    } catch {}
    return "popup.html";
  })();
  const PANEL = "cor3td-yan-panel";
  const DUGME = "cor3td-ust-dugme";
  const dugmeCiz = (acik) => {
    let b = document.getElementById(DUGME);
    if (!b) {
      b = document.createElement("button");
      b.id = DUGME;
      b.title = "Bot paneli";
      b.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#76c1d1" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/></svg><span>Bot</span>';
      b.style.cssText = "position:fixed;top:6px;left:50%;transform:translateX(-50%);z-index:2147483646;display:flex;align-items:center;gap:6px;padding:4px 12px;background:#0d1f27;border:1px solid #1d4b5a;border-radius:6px;color:#bfe9f5;font:600 12px system-ui,'Segoe UI',sans-serif;letter-spacing:.04em;cursor:pointer;opacity:.85";
      b.addEventListener("click", () => chrome.storage.local.get("yanPanel", (r) => chrome.storage.local.set({ yanPanel: !r.yanPanel })));
      document.documentElement.append(b);
    }
    b.style.borderColor = acik ? "#76c1d1" : "#1d4b5a";
    b.style.background = acik ? "#11313c" : "#0d1f27";
  };
  const panelCiz = (acik) => {
    let f = document.getElementById(PANEL);
    gonder({ panel: acik ? 342 : 0 });
    dugmeCiz(acik);
    if (!acik) { if (f) f.remove(); return; }
    if (f) return;
    f = document.createElement("iframe");
    f.id = PANEL;
    f.src = chrome.runtime.getURL(panelSayfa);
    f.style.cssText = "position:fixed;top:0;right:0;width:342px;height:100vh;border:0;border-left:1px solid #1d4b5a;z-index:2147483647;background:#081419;box-shadow:-4px 0 16px rgba(0,0,0,.5)";
    document.documentElement.append(f);
  };
  chrome.storage.local.get("yanPanel", (r) => panelCiz(!!r.yanPanel));
  const KISA = ["auto-update-markets"];
  let tdSerbest = false;
  const helperMi = (q) => !!(q && [q.active, ...(q.queued || [])].some((x) => x && !KISA.includes(x) && !(tdSerbest && x === "auto-valuable")));
  const PAZAR = [["home", "marketData", null, "HOME"], ["dark", "darkMarketData", "darkMarketAvailable", "D4RK"], ["soyuz", "soyuzMarketData", "soyuzMarketAvailable", "SOYUZ"], ["usol", "usolMarketData", "usolMarketAvailable", "USOL"]];
  const JOB_ANAHTAR = ["automationQueueStatus", "autoJobsCompletedResults", "autoJobsTracker", ...PAZAR.flatMap((p) => [p[1], p[1] + "UpdatedAt", p[2]].filter(Boolean))];
  let jobBosBas = 0, jobImza = "";
  const jobKontrol = async () => {
    try {
      const y = await chrome.storage.sync.get(["autoFinishAllJobsEnabled", "autoJobsSelectedTypes"]);
      const r = await chrome.storage.local.get(JOB_ANAHTAR);
      const q = helperMi(r.automationQueueStatus);
      if (!y.autoFinishAllJobsEnabled) { jobBosBas = 0; return { helperMesgul: q, helperNeden: null }; }
      const islenen = new Set((r.autoJobsCompletedResults || []).map((x) => x.jobId));
      const bekleyen = [];
      for (const [k, veri, acik, ad] of PAZAR) {
        if (acik && r[acik] === false) continue;
        const v = r[veri];
        if (!v) continue;
        const reset = Date.parse(v.nextJobsResetAt || "") || 0;
        if (reset && reset < Date.now() - 60000 && (r[veri + "UpdatedAt"] || 0) < reset) { bekleyen.push(`${ad} yenilenmedi`); continue; }
        const secili = y.autoJobsSelectedTypes && y.autoJobsSelectedTypes[k];
        const rep = (v.reputation && v.reputation.level) || 0;
        const n = (v.jobs || []).filter((j) => !islenen.has(j.id) && (!secili || secili.includes(j.name)) && (j.requiredReputationLevel || 0) <= rep).length;
        if (n) bekleyen.push(`${ad} ${n} job`);
      }
      const imza = bekleyen.join(", ");
      if (!imza) { jobBosBas = 0; jobImza = ""; return { helperMesgul: q, helperNeden: null }; }
      if (q) jobBosBas = 0;
      else if (imza !== jobImza || !jobBosBas) jobBosBas = Date.now();
      jobImza = imza;
      if (!q && Date.now() - jobBosBas > 20 * 60000) return { helperMesgul: false, helperNeden: null };
      return { helperMesgul: true, helperNeden: q ? null : `joblar bitmedi (${imza})` };
    } catch { return null; }
  };
  const planYolla = () => chrome.storage.local.get(["planMesgul", "automationQueueStatus", "planTdSerbest"], async (r) => {
    tdSerbest = !!r.planTdSerbest;
    const j = await jobKontrol();
    gonder({ planMesgul: !!r.planMesgul, ...(j || { helperMesgul: helperMi(r.automationQueueStatus), helperNeden: null }) });
  });
  planYolla();
  setInterval(planYolla, 15000);
  chrome.storage.onChanged.addListener((d, alan) => {
    if (alan !== "local") return;
    if (d.ayar) gonder({ ayar: d.ayar.newValue });
    if (d.yanPanel) panelCiz(!!d.yanPanel.newValue);
    if (d.planMesgul) gonder({ planMesgul: !!d.planMesgul.newValue });
    if (JOB_ANAHTAR.some((k) => d[k]) || d.planTdSerbest) planYolla();
    if (d.sifirla) gonder({ sifirla: true });
    if (d.deneySifirla) gonder({ deneySifirla: true });
  });
  const KOSU_ALAN = ["status", "wins", "losses", "botGamesCount", "maxWins", "maxLosses", "entryFee", "projectedReward", "startedAt", "completedAt", "rewardPaid"];
  let kosuSira = Promise.resolve();
  const kosuIsle = (liste) => {
    kosuSira = kosuSira.then(() => new Promise((bitti) => chrome.storage.local.get(["kosular", "ayar"], (r) => {
      const l = Array.isArray(r.kosular) ? r.kosular : [];
      let bot = [];
      try { bot = JSON.parse(localStorage.getItem("cor3TdBotKosular") || "[]"); } catch {}
      for (const { d, a, zaman } of liste) {
        if (!d || !d.runId) continue;
        let o = l.find((x) => x.runId === d.runId);
        if (!o) {
          const bas = Date.parse(d.startedAt || zaman);
          const botAldi = bot.some((k) => Math.abs(Date.parse(k.zaman) - bas) < 180000);
          o = { runId: d.runId, botAcik: zaman ? botAldi : !!(r.ayar && r.ayar.acik) || botAldi, botAldi };
          l.push(o);
        }
        if (a === "start.run" && !zaman && r.ayar && r.ayar.acik) o.botAcik = true;
        for (const k of KOSU_ALAN) if (d[k] !== undefined) o[k] = d[k];
      }
      l.sort((x, y) => Date.parse(x.startedAt || 0) - Date.parse(y.startedAt || 0));
      while (l.length > 300) l.shift();
      chrome.storage.local.set({ kosular: l }, bitti);
    })));
  };
  const kosuAyikla = (m) => {
    if (typeof m !== "string" || m.indexOf("tower-defense.") < 0 || m.indexOf("runId") < 0) return null;
    try {
      const p = JSON.parse(m.slice(m.indexOf("[")));
      const a = (p[1] && p[1].event && p[1].event.action) || "";
      const e = a.match(/^tower-defense\.(start\.run|update\.run|get\.active\.run|[a-z.]*run[a-z.]*)$/);
      const d = p[1].data && (p[1].data.run || p[1].data);
      return e && d && d.runId ? { d, a: e[1] } : null;
    } catch { return null; }
  };
  window.addEventListener("message", (e) => {
    if (e.source !== window || e.data?.type !== "COR3_WS_LOG" || e.data.direction !== "received") return;
    const k = kosuAyikla(e.data.message);
    if (k) kosuIsle([k]);
  });
  chrome.storage.local.get("kosuTohum", (r) => {
    if (r.kosuTohum) return;
    let istek;
    try { istek = indexedDB.open("cor3_ws_db"); } catch { return; }
    istek.onsuccess = () => {
      const db = istek.result;
      if (!db.objectStoreNames.contains("messages")) return;
      const liste = [];
      const g = db.transaction("messages").objectStore("messages").openCursor();
      g.onsuccess = (ev) => {
        const cur = ev.target.result;
        if (!cur) { kosuIsle(liste); chrome.storage.local.set({ kosuTohum: true }); return; }
        if (cur.value.direction === "received") { const k = kosuAyikla(cur.value.message); if (k) liste.push({ ...k, zaman: cur.value.timestamp }); }
        cur.continue();
      };
    };
  });
  window.addEventListener("message", (e) => {
    if (e.source !== window || e.data?.kaynak !== "cor3td-bot") return;
    if (e.data.hazir) { ayarYolla(); planYolla(); chrome.storage.local.get("yanPanel", (r) => gonder({ panel: r.yanPanel ? 342 : 0 })); }
    if (e.data.durum) chrome.storage.local.set({ durum: e.data.durum });
    if (e.data.ayarYaz) chrome.storage.local.get("ayar", (r) => chrome.storage.local.set({ ayar: Object.assign({}, r.ayar || {}, e.data.ayarYaz), ayarYazan: { kim: "bot", t: Date.now() } }));
    if (e.data.ogrenme) chrome.storage.local.set({ ogrenme: e.data.ogrenme });
    if (e.data.mac) chrome.storage.local.get("maclar", (r) => {
      const l = Array.isArray(r.maclar) ? r.maclar : [];
      const m = e.data.mac, o = l[l.length - 1];
      try { m.surum = chrome.runtime.getManifest().version; } catch {}
      if (o && ["sonuc", "dalga", "can", "rakipCan", "gelir", "rakipGelir"].every((k) => o[k] === m[k]) && Math.abs(Date.parse(m.tarih) - Date.parse(o.tarih)) < 3600000) return;
      l.push(m);
      while (l.length > 500) l.shift();
      chrome.storage.local.set({ maclar: l });
    });
  });
  let kosuSon = null;
  const kosuOku = () => chrome.storage.local.get("kosular", (r) => { const l = r.kosular || []; kosuSon = l.length ? l[l.length - 1] : null; });
  kosuOku();
  chrome.storage.onChanged.addListener((d, alan) => { if (alan === "local" && d.kosular) kosuOku(); });
  const kosuRozet = () => {
    const app = document.querySelector('[data-component-name="TowerDefenseApplication"]');
    let b = document.getElementById("cor3-kosu-rozet");
    const k = kosuSon;
    if (!app || !k || k.status !== "active") { if (b) b.remove(); return; }
    if (!b || b.parentElement !== app) {
      if (b) b.remove();
      b = document.createElement("div");
      b.id = "cor3-kosu-rozet";
      b.style.cssText = "position:absolute;right:8px;bottom:8px;z-index:50;pointer-events:none;padding:8px 14px;background:rgba(8,20,25,.9);border:1px solid #1d4b5a;border-radius:6px;font:17px/1.4 'Segoe UI',system-ui,sans-serif !important;color:#bfe9f5;text-align:right;box-shadow:0 2px 10px rgba(0,0,0,.45)";
      if (getComputedStyle(app).position === "static") app.style.position = "relative";
      app.append(b);
      if (!document.getElementById("cor3-kosu-rozet-stil")) {
        const st = document.createElement("style");
        st.id = "cor3-kosu-rozet-stil";
        st.textContent = "#cor3-kosu-rozet,#cor3-kosu-rozet *{font-family:'Segoe UI',system-ui,sans-serif !important;font-size:20px !important;line-height:1.35 !important;letter-spacing:0 !important}#cor3-kosu-rozet .k,#cor3-kosu-rozet .k *{font-size:15px !important}";
        document.head.append(st);
      }
    }
    const w = k.wins || 0, mw = k.maxWins || 10, l = k.losses || 0, ml = k.maxLosses || 3;
    const h = `<div><b style="color:#3fcf8e">${w}</b><span style="color:#6f9aa8">/${mw} win</span> · <b style="color:${l >= ml - 1 ? "#f07a6a" : "#f0b35a"}">${l}</b><span style="color:#6f9aa8">/${ml} lose</span></div><div class="k" style="color:#6f9aa8">ödül ${Number(k.projectedReward || 0).toLocaleString("tr-TR")} CR · kalan lose ${Math.max(0, ml - l)}</div>`;
    if (b.innerHTML !== h) b.innerHTML = h;
  };
  setInterval(kosuRozet, 1500);
})();
