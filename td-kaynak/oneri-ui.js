(() => {
  const el = (id) => document.getElementById(id);
  if (!el("oneriListe")) return;
  const KAYNAK = ["cpu_frequency", "cpu_cores", "gpu_power", "gpu_memory", "ram_frequency", "ram_memory"];
  const MAGAZA = [["marketData", "home", "HOME"], ["darkMarketData", "dark", "D4RK"], ["soyuzMarketData", "soyuz", "SOYUZ"], ["usolMarketData", "usol", "USOL"]];
  const ODUL = { home: 1000, dark: 1600, soyuz: 1714, usol: 1330 };
  const DOSYA_GUN = 230;
  const YENI_GUN = 500;
  const KAT = ["CPU", "GPU", "RAM", "PSU"];
  const kac = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const sayi = (n) => Math.round(n).toLocaleString("tr-TR");

  const arz = (hw) => ({
    cpu_frequency: hw.CPU.specs.cpuFrequency, cpu_cores: hw.CPU.specs.cpuCores,
    gpu_power: hw.GPU.specs.gpuPower, gpu_memory: hw.GPU.specs.gpuMemory,
    ram_frequency: hw.RAM.specs.ramFrequency, ram_memory: hw.RAM.specs.ramMemory,
  });
  const aralik = (v) => v.length === 3 ? { min: v[1], max: v[2] } : v.length === 2 ? { min: v[0], max: v[1] } : { min: 0, max: 0 };
  const oran = (sw, a) => {
    let o = 1;
    for (const k of KAYNAK) {
      const c = sw.consuming && sw.consuming[k];
      if (!c) continue;
      const r = aralik(c), m = a[k] || 0;
      if (m < r.min) return -1;
      o = Math.min(o, r.max > r.min ? Math.max(0, Math.min(1, (m - r.min) / (r.max - r.min))) : 1);
    }
    return o;
  };
  const guc = (sp, o) => Math.floor(sp.power[0] + o * (sp.power[1] - sp.power[0]));
  const psuOk = (hw) => hw.PSU.specs.psuPower >= (hw.CPU.specs.cpuConsuming || 0) + (hw.GPU.specs.gpuConsuming || 0);
  const yetenek = (hw, yazilim) => {
    const a = arz(hw), t = { HACK: {}, SEARCH: {}, DECRYPT: {} }, calismaz = [];
    for (const sw of yazilim) {
      const o = oran(sw, a);
      if (o < 0) { calismaz.push(sw.name); continue; }
      for (const sp of sw.specs || []) {
        if (!t[sp.type]) continue;
        for (const x of sp.serverTypes || sp.fileTypes || []) t[sp.type][x] = Math.max(t[sp.type][x] || 0, guc(sp, o));
      }
    }
    return { t, calismaz };
  };
  const deger = (t, v) => {
    let job = 0, dosya = 0;
    const acik = new Set();
    for (const s of v.sunucular) {
      const h = t.HACK[s.tip] || 0;
      const giris = s.erisim || (h > 0 && h >= (s.def || 0));
      if (!giris) continue;
      acik.add(s.id);
      for (const [mk, n] of Object.entries(s.isler)) job += n * (v.odul[mk] || ODUL[mk] || 1000);
      if ((t.SEARCH[s.tip] || 0) > 0) dosya += DOSYA_GUN;
    }
    return { job, dosya, top: job + dosya, acik };
  };
  const farklar = (a, b) => {
    const l = [];
    for (const tur of ["HACK", "SEARCH", "DECRYPT"]) {
      const k = new Set([...Object.keys(a[tur]), ...Object.keys(b[tur])]);
      for (const x of k) if ((b[tur][x] || 0) !== (a[tur][x] || 0)) l.push(`${tur} ${x}: ${a[tur][x] || "yok"} → ${b[tur][x] || "yok"}`);
    }
    return l;
  };

  const hesapla = (r) => {
    const L = r.loadoutData;
    if (!L || !L.equippedHardware) return { hata: "Yük düzeni verisi yok (Helper popup'ında Loadout bölümünü bir kez yenile)." };
    if (!r.planDurum || !r.planDurum.sunucular) return { hata: "Planlayıcı verisi yok." };
    const isler = (r.planOgrenme && r.planOgrenme.isler) || {};
    const gun = Math.max(1, (Date.now() - ((r.planOgrenme && r.planOgrenme.ilkJob) || Date.now() - 86400000)) / 86400000);
    const sunucular = r.planDurum.sunucular.map((s) => ({ ...s, isler: Object.fromEntries(Object.entries(isler).map(([mk, x]) => [mk, ((x[s.id] && x[s.id].n) || 0) / gun]).filter(([, n]) => n > 0)) }));
    const odul = {};
    for (const [anahtar, mk] of MAGAZA) {
      const j = ((r[anahtar] && r[anahtar].jobs) || []).map((x) => x.rewardCredits).filter(Boolean);
      if (j.length) odul[mk] = j.reduce((a, b) => a + b, 0) / j.length;
    }
    const sahipHw = L.ownedHardware || [], sahipSw = L.ownedSoftware || [];
    const sahipId = new Set([...sahipHw, ...sahipSw].map((x) => x.id));
    const lotlar = [];
    for (const [anahtar, mk, ad] of MAGAZA) {
      const d = r[anahtar];
      if (!d) continue;
      const rep = (d.reputation && d.reputation.level) || 0;
      for (const l of d.lots || []) {
        if ((l.category !== "SOFTWARE" && l.category !== "HARDWARE") || !l.details || sahipId.has(l.offer)) continue;
        lotlar.push({ ...l.details, lotId: l.id, marketId: d.market && d.market.id, magaza: ad, fiyat: l.price, rep: l.accessLevel, alinir: l.accessLevel <= rep && l.availableCount > 0 && !l.unavailableReason, neden: l.accessLevel > rep ? `${ad} itibarı ${rep}, ${l.accessLevel} gerekli` : l.availableCount <= 0 ? "stokta yok" : l.unavailableReason || "" });
      }
    }
    const takili = {};
    for (const k of KAT) takili[k] = Object.values(L.equippedHardware).find((x) => x && x.category === k);
    if (KAT.some((k) => !takili[k])) return { hata: "Takılı donanım eksik okundu." };
    const v = { sunucular, odul };
    const taban = yetenek(takili, sahipSw);
    const tabanDeger = deger(taban.t, v);
    const secenek = {};
    for (const k of KAT) {
      secenek[k] = [...sahipHw.filter((x) => x.category === k).map((x) => ({ ...x, sahip: true })), ...lotlar.filter((x) => x.category === k).map((x) => ({ ...x, sahip: false }))];
    }
    const swAday = [null, ...lotlar.filter((x) => x.specs && x.consuming && !x.category)];
    const sonuc = new Map();
    for (const cpu of secenek.CPU) for (const gpu of secenek.GPU) for (const ram of secenek.RAM) for (const psu of secenek.PSU) {
      const hw = { CPU: cpu, GPU: gpu, RAM: ram, PSU: psu };
      if (!psuOk(hw)) continue;
      for (const yeni of swAday) {
        const alinan = [...KAT.map((k) => hw[k]).filter((x) => !x.sahip), ...(yeni ? [yeni] : [])];
        const degisen = KAT.filter((k) => hw[k].id !== takili[k].id);
        if (!alinan.length && !degisen.length) continue;
        const y = yetenek(hw, yeni ? [...sahipSw, yeni] : sahipSw);
        const d = deger(y.t, v);
        const yeniSrv = v.sunucular.filter((s) => d.acik.has(s.id) && !tabanDeger.acik.has(s.id));
        const kazanc = d.top - tabanDeger.top;
        if (kazanc <= 0 && !yeniSrv.length) continue;
        const maliyet = alinan.reduce((a, x) => a + x.fiyat, 0);
        const anahtar = alinan.map((x) => x.id).sort().join("+") + "|" + degisen.map((k) => hw[k].id).sort().join("+");
        const o = { alinan, tak: degisen.map((k) => hw[k]), maliyet, kazanc, job: d.job - tabanDeger.job, dosya: d.dosya - tabanDeger.dosya, gun: maliyet ? maliyet / Math.max(1, kazanc) : 0, yeni: yeniSrv.map((s) => s.ad), puan: (kazanc + yeniSrv.length * YENI_GUN) / Math.max(1, maliyet), fark: farklar(taban.t, y.t), calismaz: y.calismaz, alinir: alinan.every((x) => x.alinir), engel: alinan.filter((x) => !x.alinir).map((x) => `${x.name}: ${x.neden}`) };
        const eski = sonuc.get(anahtar);
        if (!eski || o.yeni.length > eski.yeni.length || (o.yeni.length === eski.yeni.length && o.kazanc > eski.kazanc)) sonuc.set(anahtar, o);
      }
    }
    const l = [...sonuc.values()].sort((a, b) => (b.alinir - a.alinir) || ((b.yeni.length > 0) - (a.yeni.length > 0)) || (b.puan - a.puan) || (b.yeni.length - a.yeni.length) || (b.kazanc - a.kazanc));
    const kisa = [];
    const gorulen = new Set();
    for (const o of l) {
      const k = o.alinan.map((x) => x.id).sort().join("+");
      if (gorulen.has(k)) continue;
      gorulen.add(k);
      kisa.push(o);
      if (kisa.length >= 15) break;
    }
    const tipler = {};
    const dec = (sw) => (Array.isArray(sw.specs) ? sw.specs : []).filter((p) => p.type === "DECRYPT");
    for (const sw of sahipSw) for (const p of dec(sw)) for (const x of p.fileTypes || []) { const o = tipler[x] || (tipler[x] = { sahip: [], lot: [] }); o.sahip.push(`${sw.name} (güç ${p.power.join("-")})`); }
    for (const l of lotlar) for (const p of dec(l)) for (const x of p.fileTypes || []) { const o = tipler[x] || (tipler[x] = { sahip: [], lot: [] }); o.lot.push(l); }
    const dosyaTur = Object.entries(tipler).map(([x, o]) => ({ tur: x, sahip: o.sahip, lot: o.lot.sort((a, b) => (b.alinir - a.alinir) || (a.fiyat - b.fiyat))[0] || null })).sort((a, b) => (a.sahip.length > 0) - (b.sahip.length > 0) || a.tur.localeCompare(b.tur));
    return { dosyaTur, liste: kisa, taban: tabanDeger, kapali: sunucular.filter((x) => !tabanDeger.acik.has(x.id)).length, toplamAday: l.length };
  };

  const dosyaCiz = (s) => !s.dosyaTur || !s.dosyaTur.length ? "" : `<div style="margin-top:10px;padding-top:6px;border-top:1px solid var(--cizgi)"><b>Dosya türleri (decrypt)</b><div class="ipucu">Sahip olunan yazılım varsa job öncesi Helper onu takar. Değerli dosya satış fiyatları türe değil etikete bağlı; job ödülü ~800-1.000 CR.</div>` + s.dosyaTur.map((d) => `<div style="font-size:12px;margin-top:4px"><b style="color:${d.sahip.length ? "var(--yesil)" : "var(--turuncu)"}">${kac(d.tur)}</b> ${d.sahip.length ? "açılabilir: " + kac(d.sahip.join(", ")) : "açılamıyor" + (d.lot ? ` · gerekli: ${kac(d.lot.name)} (${kac(d.lot.magaza)}, ${sayi(d.lot.fiyat)} CR, rep ${d.lot.rep}${d.lot.alinir ? "" : " · " + kac(d.lot.neden)})` : " · satan market yok")}</div>`).join("") + `</div>`;
  const ciz = (s) => {
    const k = el("oneriListe");
    if (s.hata) { k.innerHTML = `<div class="ipucu">${kac(s.hata)}</div>`; return; }
    if (!s.liste.length) { k.innerHTML = `<div class="ipucu">Mevcut düzene göre gelir artıran alım bulunamadı.</div>` + dosyaCiz(s); return; }
    k.innerHTML = `<div class="ipucu">Şu anki tahmini gelir: job ${sayi(s.taban.job)} + dosya ${sayi(s.taban.dosya)} CR/gün. Hiç açılamayan sunucu: ${s.kapali}. Önce yeni sunucu açanlar, sonra harcanan CR başına en çok getiren. ${s.toplamAday} kombinasyon denendi.</div>` + s.liste.map((o, i) => {
      const renk = !o.alinir ? "var(--soluk)" : "var(--yesil)";
      return `<div style="padding:6px 0;border-top:1px solid var(--cizgi)">
        <div style="display:flex;gap:6px;align-items:baseline"><b style="color:${renk}">${i + 1}.</b><b style="flex:1">${o.alinan.map((x) => kac(x.name)).join(" + ") || "Yalnız takılı parçayı değiştir"}</b><span style="font:600 12px ui-monospace,Consolas,monospace">${o.maliyet ? sayi(o.maliyet) : "bedava"}</span></div>
        <div class="ipucu" style="margin:2px 0 0">${o.alinan.map((x) => `${kac(x.magaza)} rep ${x.rep}`).join(", ")}${o.tak.length ? `${o.alinan.length ? " · " : ""}tak: ${o.tak.map((x) => kac(x.name)).join(", ")}` : ""}</div>
        <div style="font-size:11px;margin-top:2px">+${sayi(o.kazanc)} CR/gün (job ${sayi(o.job)}, dosya ${sayi(o.dosya)}) · amorti ${o.maliyet ? (o.gun < 1 ? "1 günden az" : Math.ceil(o.gun) + " gün") : "hemen"}</div>
        ${o.yeni.length ? `<div style="font-size:11px;margin-top:2px;color:var(--yesil)">Yeni açılan ${o.yeni.length} sunucu: ${kac(o.yeni.join(", "))}</div>` : ""}
        <div class="ipucu" style="margin:2px 0 0">${kac(o.fark.slice(0, 4).join(" · "))}</div>
        ${o.calismaz.length ? `<div class="ozel">Bu donanımla çalışmayacak yazılım: ${kac(o.calismaz.join(", "))}</div>` : ""}
        ${o.engel.length ? `<div class="ozel">${kac(o.engel.join("; "))}</div>` : ""}
      </div>`;
    }).join("") + dosyaCiz(s);
  };

  const ANAHTAR = ["loadoutData", "marketData", "darkMarketData", "soyuzMarketData", "usolMarketData", "planDurum", "planOgrenme"];
  const calis = () => {
    el("oneriListe").innerHTML = `<div class="ipucu">Hesaplanıyor…</div>`;
    try { chrome.storage.local.get(ANAHTAR, (r) => { try { ciz(hesapla(r)); } catch (e) { el("oneriListe").innerHTML = `<div class="ozel">Hesap hatası: ${kac(e.message)}</div>`; } }); }
    catch (e) { el("oneriListe").innerHTML = `<div class="ozel">Eklenti yenilenmiş, bu paneli kapatıp yeniden aç.</div>`; }
  };
  el("oneriHesapla").addEventListener("click", calis);
  calis();
  let bekle = null;
  chrome.storage.onChanged.addListener((d, alan) => {
    if (alan !== "local" || !["loadoutData", "marketData", "darkMarketData", "soyuzMarketData", "usolMarketData"].some((k) => d[k])) return;
    clearTimeout(bekle);
    bekle = setTimeout(calis, 2000);
  });
})();
