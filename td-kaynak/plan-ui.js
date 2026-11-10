(() => {
  const VARSAYILAN = { acik: false, oneri: true, payDk: 30, bilinmeyenDk: 0, jobPencereDk: 120, force: true, kismiForce: true, gorevSor: false, gorevSorDk: 5, aramaKapali: false, sessizBas: "", sessizBit: "", ciftTur: true, ciftTurDk: 20, topluSatis: 10, yolEkDk: 15, birikim: false, taramaDk: 60, doluTarama: 3, aralikDk: 30, haric: "" };
  const el = (id) => document.getElementById(id);
  const kac = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const sure = (d) => d == null ? "?" : d < 0 ? "geçti" : d >= 60 ? `${Math.floor(d / 60)} sa ${d % 60} dk` : `${d} dk`;
  let ayar = { ...VARSAYILAN };

  const ayarCiz = () => {
    for (const i of document.querySelectorAll("[data-p]")) {
      const k = i.dataset.p;
      if (i.type === "checkbox") i.checked = !!ayar[k];
      else if (document.activeElement !== i) i.value = ayar[k] ?? "";
    }
  };
  for (const i of document.querySelectorAll("[data-p]")) {
    i.addEventListener("change", () => {
      const k = i.dataset.p;
      const v = i.type === "checkbox" ? i.checked : i.type === "number" ? Number(i.value) || 0 : i.value;
      chrome.storage.local.get("planAyar", (r) => chrome.storage.local.set({ planAyar: { ...VARSAYILAN, ...(r.planAyar || {}), [k]: v }, ayarYazan: { kim: "Para sekmesi", t: Date.now() } }));
    });
  }
  el("planHesapla").addEventListener("click", () => chrome.storage.local.set({ planKomut: { k: "hesapla", t: Date.now() } }));
  el("planSimdi").addEventListener("click", () => chrome.storage.local.set({ planKomut: { k: "simdi", t: Date.now() } }));

  const renk = { izinli: "var(--yesil)", korunan: "var(--turuncu)", "bakımda": "var(--kirmizi)", "yol kapalı": "var(--kirmizi)", "dışarıda": "var(--soluk)" };
  const ciz = (p) => {
    if (!p) return;
    el("paraSekme").hidden = false;
    if (!p.hazir) { el("planMagaza").innerHTML = `<div class="ipucu">${kac(p.neden || "hesaplanıyor")}</div>`; return; }
    el("planMagaza").innerHTML = (p.magazalar || []).map((m) => `<div style="padding:4px 0;border-bottom:1px solid var(--cizgi)"><b>${kac(m.ad)}</b> <span style="color:var(--soluk)">job: ${sure(m.kalanDk)}</span>${m.bekleyen ? ` <span style="color:var(--turuncu)">${m.bekleyen} job bekliyor</span>` : ""}${m.satisIzin ? "" : ` <span style="color:var(--turuncu)">satış yok</span>`}<div class="ipucu" style="margin:2px 0 0">${kac((m.bekleyenOrnek || []).join("; "))}</div></div>`).join("")
      + `<div class="ipucu" style="margin-top:6px">Adım: ${kac(p.calisma?.adim || "bos")}${p.aramaEngel ? ` · <span style="color:var(--turuncu)">arama/force ${kac(p.aramaEngel)}</span>` : ""}${p.ciftDurum ? ` · çift tur: ${kac(p.ciftDurum)}` : ""} · harita ${p.haritaYasDk ?? "?"} dk önce · öğrenilen ${p.ogrenme?.olculen || 0} bakım süresi, ${p.ogrenme?.job || 0} job sunucusu${(p.forceOner || []).length ? ` · force önerisi: ${kac(p.forceOner.join(", "))}` : ""}</div>`
      + (p.uyarilar || []).map((u) => `<div class="ozel">${kac(u)}</div>`).join("");
    const sira = { izinli: 0, korunan: 1, "bakımda": 2, "yol kapalı": 2, "dışarıda": 3 };
    const l = [...(p.sunucular || [])].sort((a, b) => (sira[a.durum] ?? 9) - (sira[b.durum] ?? 9) || a.ad.localeCompare(b.ad));
    el("planSunucu").innerHTML = l.map((s) => `<div style="padding:3px 0;border-bottom:1px solid var(--cizgi);font-size:12px"><span style="color:${renk[s.durum] || "var(--yazi)"}">●</span> <b>${kac(s.ad)}</b> <span style="color:var(--soluk)">${kac(s.durum)} · bakım ~${sure(s.sureDk)} (${kac(s.kaynak)})${s.uyari ? ` · uyarı ${kac(new Date(s.uyari).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }))}` : ""}</span><div class="ipucu" style="margin:1px 0 0">${kac(s.neden || "")}</div></div>`).join("");
    el("planLog").textContent = (p.log || []).slice(-25).reverse().join("\n");
  };

  chrome.storage.local.get(["planAyar", "planDurum"], (r) => { ayar = { ...VARSAYILAN, ...(r.planAyar || {}) }; ayarCiz(); ciz(r.planDurum); });
  chrome.storage.onChanged.addListener((d, alan) => {
    if (alan !== "local") return;
    if (d.planAyar) { ayar = { ...VARSAYILAN, ...(d.planAyar.newValue || {}) }; ayarCiz(); }
    if (d.planDurum) ciz(d.planDurum.newValue);
  });
})();
