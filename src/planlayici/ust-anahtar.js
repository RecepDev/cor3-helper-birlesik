(() => {
    const ust = document.querySelector("#mainView .header-row");
    if (!ust || document.getElementById("cor3Anahtarlar")) return;
    const popupMu = () => !document.body.matches(".mode-popout,.mode-sidepanel,.cor3-yanda") && window.top === window;
    let olcu = { w: 520, h: 592 };
    try { olcu = { ...olcu, ...JSON.parse(localStorage.getItem("cor3PopupBoyut") || "{}") }; } catch {}
    const boy = document.createElement("style");
    document.head.append(boy);
    const boyUygula = () => {
        const genis = popupMu() && olcu.w >= 620;
        document.body.classList.toggle("cor3-genis", genis);
        boy.textContent = `body:not(.mode-popout):not(.mode-sidepanel):not(.cor3-yanda):not(.td-gorunum){width:${olcu.w}px!important;min-height:${olcu.h}px}`
            + `body.cor3-genis:not(.td-gorunum) #mainView{column-count:2;column-gap:12px}`
            + `body.cor3-genis #mainView>*{break-inside:avoid}`
            + `body.cor3-genis #mainView>.header-row,body.cor3-genis #mainView>#cor3Anahtarlar{column-span:all}`;
    };
    boyUygula();
    if (popupMu()) {
        for (const [yon, css] of [["sol", "left:0;top:0;bottom:0;width:6px;cursor:ew-resize"], ["alt", "left:0;right:0;bottom:0;height:6px;cursor:ns-resize"], ["kose", "left:0;bottom:0;width:14px;height:14px;cursor:nesw-resize"]]) {
            const t = document.createElement("div");
            t.title = "Sürükleyerek boyutlandır";
            t.style.cssText = "position:fixed;z-index:100000;" + css;
            t.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                t.setPointerCapture(e.pointerId);
                const x0 = e.screenX, y0 = e.screenY, w0 = olcu.w, h0 = olcu.h;
                const hareket = (ev) => {
                    if (yon !== "alt") olcu.w = Math.max(300, Math.min(800, w0 + (x0 - ev.screenX)));
                    if (yon !== "sol") olcu.h = Math.max(300, Math.min(600, h0 + (ev.screenY - y0)));
                    boyUygula();
                };
                const birak = () => { t.removeEventListener("pointermove", hareket); try { localStorage.setItem("cor3PopupBoyut", JSON.stringify(olcu)); } catch {} };
                t.addEventListener("pointermove", hareket);
                t.addEventListener("pointerup", birak, { once: true });
            });
            document.body.append(t);
        }
    }
    const ANAHTAR = [
        { ad: "TD bot", tip: "td", k: "acik", ipucu: "Tower Defense botu. Açıkken maç oynar; Helper ya da planlayıcı çalışırken ve store jobları bitmeden yeni maça girmez." },
        { ad: "TD: maç bitince dur", tip: "td", k: "sonrakindeDur", ipucu: "Açınca TD sürmekte olan maçı bitirir, sonra TD botunu kapatır ve bu anahtar kendiliğinden kapanır. Rematch yapılmaz." },
        { ad: "Helper jobları", tip: "dom", id: "autoFinishAllJobsToggle", ipucu: "Auto Finish All Jobs. Store jobları yenilenince seçili türdeki jobları otomatik alıp yapar." },
        { ad: "Planlayıcı (arama/satış)", tip: "plan", k: "acik", ipucu: "Değerli dosya arama, indirme, satış ve force turlarını yönetir; daily ops da buna bağlı. Kapatınca hepsi durur." },
        { ad: "Birikim (dolunca sat)", tip: "plan", k: "birikim", ipucu: "Açıkken çift tur yerine çalışır. Joblar bitince saatte bir yalnız arama yapar (arama bakım başlatmaz). Bir sunucunun dosya sayısı 3 taramada artmazsa dolmuş sayılır, indirilip satılır. Job yolundaki sunucu yalnız store resetine bakım + pay kadar süre varken indirilir ve hemen force edilir." },
        { ad: "Çift tur", tip: "plan", k: "ciftTur", ipucu: "Store'a uzun süre varsa önce arama ve satış, store yaklaşınca tekrar arama, satış ve force. Kapalıyken 'Döngü arası' süresiyle tek tur çalışır." },
        { ad: "Force", tip: "plan", k: "force", ipucu: "Satıştan sonra sunucuları bilerek bakıma sokar; bakım job saatinden önce biter. Bakımdan çıkan sunucunun erişimi sıfırlanır, yeniden hack gerekir." },
        { ad: "Daily ops", tip: "plan", k: "gunluk", ipucu: "Günlük görevi otomatik yapar (her gün 03:00 TR yenilenir, kaçarsa seri sıfırlanır). Planlayıcı açık olmalı." },
        { ad: "Arama/force kapalı", tip: "plan", k: "aramaKapali", ipucu: "Planlayıcı açık kalır ama arama, satış ve force turlarını başlatmaz. Daily ops, Helper jobları ve TD sürer." },
        { ad: "Paralı asker gönder", tip: "dom", id: "autoSendMercenaryToggle", ipucu: "Auto Send Mercenary. Expedition dönünce paralı askeri otomatik yeniden gönderir (gönderme ve ücret CR tutar)." },
    ];
    const kutu = document.createElement("div");
    kutu.id = "cor3Anahtarlar";
    kutu.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:4px 10px;padding:6px 10px;margin-bottom:4px;background:var(--bg-card);border-radius:6px;border:1px solid var(--border)";
    const satirlar = ANAHTAR.map((a) => {
        const s = document.createElement("label");
        s.title = a.ipucu;
        s.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:10px;color:var(--text-secondary);cursor:pointer;min-width:0";
        s.innerHTML = `<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a.ad}</span><span class="alarm-toggle-switch" style="flex:none"><input type="checkbox"><span class="slider-track"></span></span>`;
        const g = s.querySelector("input");
        kutu.append(s);
        return { a, g };
    });
    ust.after(kutu);
    const anlik = document.createElement("div");
    anlik.id = "cor3Anlik";
    anlik.style.cssText = "padding:6px 10px;margin-bottom:4px;background:var(--bg-card);border-radius:6px;border:1px solid var(--border);font-size:10.5px;color:var(--text-secondary);line-height:1.5";
    kutu.after(anlik);
    const HELPER_IS = { "auto-jobs": "store jobları yapılıyor", "auto-valuable": "değerli dosya arama/satış", "auto-valuable-force": "sunucular bakıma sokuluyor (force)", "auto-update-markets": "market verisi yenileniyor", "auto-send": "paralı asker gönderiliyor", "auto-daily": "daily ops" };
    const ADIM = { bos: "bekliyor", hazirlik: "TD maçının bitmesini bekliyor", arama: "değerli dosya arıyor", satis: "satış yapıyor", force: "force yapıyor", "görev sorusu": "görev sorusunun cevabını bekliyor" };
    const hh = (ms) => new Date(ms).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    const anlikCiz = () => chrome.storage.local.get(["durum", "ayar", "automationQueueStatus", "planDurum", "planAyar", "dailyOpsData", "autoJobsDebugLogs", "valuableDebugLogs", "valuableSearchRunning", "valuableSellerRunning", "sonDuzeltme", "bildirimDurum"], (r) => {
        const d = r.durum || {}, p = r.planDurum || {}, q = r.automationQueueStatus || {}, pa = r.planAyar || {};
        const tdIs = !(r.ayar && r.ayar.acik) ? "kapalı" : (d.macta && d.mac && !d.mac.bitti ? `maçta (dalga ${d.mac.dalga ?? "?"})` : d.sonIs || "-");
        const hIs = q.active ? (HELPER_IS[q.active] || q.active) + ((q.queued || []).length ? ` · sırada: ${q.queued.map((x) => HELPER_IS[x] || x).join(", ")}` : "") : "boşta";
        const pIs = !pa.acik ? "kapalı" : ((p.calisma && ADIM[p.calisma.adim]) || (p.calisma && p.calisma.adim) || "-") + (p.ciftDurum && (!p.calisma || p.calisma.adim === "bos") ? ` · ${p.ciftDurum}` : "");
        const z = p.zaman || Date.now();
        const plan = [];
        for (const m of p.magazalar || []) if (m.kalanDk !== null && m.kalanDk !== undefined) plan.push({ t: z + m.kalanDk * 60000, m: `${m.ad} jobları yenilenir, Helper yapar` });
        const dd = r.dailyOpsData;
        if (dd) plan.push(dd.hasClaimedToday ? { t: Date.parse(dd.nextTaskTime), m: "yeni daily ops" } : { t: Date.now(), m: "daily ops bugün yapılmadı, sırada" });
        const c2 = /2\. tur (\d+) dk sonra/.exec(p.ciftDurum || "");
        const b2 = /sonraki tarama (\d+) dk sonra/.exec(p.ciftDurum || "");
        if (b2 && pa.acik && pa.birikim) plan.push({ t: z + Number(b2[1]) * 60000, m: "birikim taraması (yalnız arama)" });
        if (c2 && pa.acik && pa.ciftTur) plan.push({ t: z + Number(c2[1]) * 60000, m: "çift tur 2. tur: arama + satış + force" });
        const gelecek = plan.filter((x) => x.t >= Date.now() - 60000).sort((a, b) => a.t - b.t).slice(0, 6);
        const sat = (b, v) => `<div style="display:flex;gap:6px"><span style="color:var(--text-dim);flex:none;width:62px">${b}</span><span style="color:var(--text)">${kac(v)}</span></div>`;
        const sonLog = (l) => { const x = Array.isArray(l) && l.length ? l[l.length - 1] : null; if (!x) return null; const t = Date.parse(x.timestamp || x.time || "") || 0; return t && Date.now() - t < 3 * 60000 ? `${hh(t)} ${String(x.msg || "").replace(/^[^\wÇĞİÖŞÜçğıöşü]+/, "").slice(0, 110)}` : null; };
        const jobSon = sonLog(r.autoJobsDebugLogs), aramaSon = sonLog(r.valuableDebugLogs);
        const aramaVar = q.active === "auto-valuable" || q.active === "auto-valuable-force" || r.valuableSearchRunning || r.valuableSellerRunning;
        anlik.innerHTML = `<div style="color:var(--accent-light-cyan);font-size:12px;font-weight:600;margin-bottom:3px">Şimdi</div>` + sat("TD", tdIs) + sat("Helper", hIs) + sat("Planlayıcı", pIs)
            + ((q.active === "auto-jobs" || jobSon) && jobSon ? sat("Job", jobSon) : "")
            + (aramaVar && aramaSon ? sat(r.valuableSellerRunning ? "Satış" : q.active === "auto-valuable-force" ? "Force" : "Arama", aramaSon) : "")
            + (r.sonDuzeltme && Date.now() - r.sonDuzeltme.t < 6 * 3600000 ? sat("Düzeltme", hh(r.sonDuzeltme.t) + " " + r.sonDuzeltme.m) : "")
            + (() => { const l = (r.bildirimDurum && r.bildirimDurum.liste) || []; const x = l[l.length - 1]; const t = x && Date.parse(x.t); return t && Date.now() - t < 12 * 3600000 ? `<div style="display:flex;gap:6px"><span style="color:var(--text-dim);flex:none;width:62px">Uyarı</span><span style="color:var(--accent-orange)">${kac(hh(t) + " " + x.m)}</span></div>` : ""; })()
            + `<div style="color:var(--accent-light-cyan);font-size:12px;font-weight:600;margin:5px 0 3px">Sıradaki</div>`
            + (gelecek.length ? gelecek.map((x) => sat(x.t - Date.now() < 60000 ? "şimdi" : hh(x.t), x.m)).join("") : `<div>planlanmış iş yok</div>`);
    });
    setInterval(anlikCiz, 15000);
    const ozet = document.createElement("div");
    ozet.id = "cor3Ozet";
    ozet.style.cssText = "padding:6px 10px;margin-bottom:4px;background:var(--bg-card);border-radius:6px;border:1px solid var(--border);font-size:10px;color:var(--text-secondary)";
    anlik.after(ozet);
    const rapor = document.createElement("details");
    rapor.id = "cor3Rapor";
    rapor.style.cssText = "padding:6px 10px;margin-bottom:4px;background:var(--bg-card);border-radius:6px;border:1px solid var(--border);font-size:10px;color:var(--text-secondary);line-height:1.45";
    ozet.after(rapor);
    const raporCiz = () => chrome.storage.local.get("gunlukRapor", (r) => {
        const g = r.gunlukRapor;
        const acik = rapor.open;
        rapor.innerHTML = `<summary style="cursor:pointer;color:var(--accent-light-cyan);font-size:12px;font-weight:600">${g ? kac(g.baslik) : "Sabah raporu (08:00'de hazırlanır)"}</summary>`
            + (g ? (g.satirlar || []).map((x) => `<div style="${/^  /.test(x) ? "padding-left:10px;color:var(--text-dim)" : "color:var(--text)"}">${kac(x.trim())}</div>`).join("") : "");
        rapor.open = acik;
    });
    const sayi = (n) => Math.round(n).toLocaleString("tr-TR");
    const TIP = { oto: ["Otomatik çözüldü", "var(--accent-green)"], alim: ["Alım gerekir", "var(--accent-orange)"], izle: ["İzleniyor", "var(--text-secondary)"] };
    const kacanHtml = (l) => {
        const grup = new Map();
        for (const x of l || []) {
            const o = typeof x === "string" ? { s: "", ad: x, sv: "", n: "", c: "", tip: "izle" } : x;
            const k = [o.m, o.ad, o.sv, o.n].join("|");
            const g = grup.get(k) || { ...o, saatler: [] };
            if (o.s) g.saatler.push((o.gun ? o.gun + " " : "") + o.s);
            grup.set(k, g);
        }
        const l2 = [...grup.values()].sort((a, b) => ["alim", "izle", "oto"].indexOf(a.tip) - ["alim", "izle", "oto"].indexOf(b.tip));
        if (!l2.length) return "";
        const say = { oto: 0, alim: 0, izle: 0 };
        for (const g of l2) say[g.tip] = (say[g.tip] || 0) + 1;
        return `<div style="display:flex;gap:8px;margin-bottom:6px;font-size:10px">${Object.entries(say).filter(([, n]) => n).map(([t, n]) => `<span style="color:${TIP[t][1]}">● ${TIP[t][0]}: ${n}</span>`).join("")}</div>`
            + l2.map((g) => `<div style="border-left:3px solid ${TIP[g.tip][1]};padding:4px 0 4px 7px;margin-bottom:5px;background:var(--bg-option);border-radius:0 4px 4px 0">
                <div style="display:flex;justify-content:space-between;gap:6px"><b style="color:var(--text)">${kac(g.ad)}${g.saatler.length > 1 ? ` <span style="color:var(--text-dim);font-weight:400">×${g.saatler.length}</span>` : ""}</b><span style="color:${TIP[g.tip][1]};font-size:9.5px;white-space:nowrap">${TIP[g.tip][0]}</span></div>
                <div style="color:var(--text-dim);font-size:9.5px">${[g.m && g.m.toUpperCase(), g.sv, g.saatler.length ? (g.saatler.length > 1 ? g.saatler[0] + " – " + g.saatler[g.saatler.length - 1] : g.saatler[0]) : ""].filter(Boolean).map(kac).join(" · ")}</div>
                ${g.n ? `<div style="margin-top:2px">${kac(g.n)}</div>` : ""}
                ${g.c ? `<div style="margin-top:2px;color:${TIP[g.tip][1]}">→ ${kac(g.c)}</div>` : ""}
            </div>`).join("");
    };
    const pop = document.createElement("div");
    pop.style.cssText = "position:fixed;z-index:99999;display:none;width:290px;max-height:70vh;overflow:auto;padding:8px;background:var(--bg-card);border:1px solid var(--accent);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.6);font-size:10.5px;color:var(--text-secondary);line-height:1.4";
    document.body.append(pop);
    let popW = 290;
    try { popW = Number(localStorage.getItem("cor3PopGenislik")) || 290; } catch {}
    pop.style.width = popW + "px";
    const popTut = document.createElement("div");
    popTut.title = "Sürükleyerek genişlet";
    popTut.style.cssText = "position:absolute;left:0;top:0;bottom:0;width:6px;cursor:ew-resize";
    popTut.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        popTut.setPointerCapture(e.pointerId);
        const x0 = e.clientX, w0 = popW, sag = pop.getBoundingClientRect().right;
        const hareket = (ev) => { popW = Math.max(240, Math.min(window.innerWidth - 8, w0 + (x0 - ev.clientX))); pop.style.width = popW + "px"; pop.style.left = Math.max(4, sag - popW) + "px"; };
        popTut.addEventListener("pointermove", hareket);
        popTut.addEventListener("pointerup", () => { popTut.removeEventListener("pointermove", hareket); try { localStorage.setItem("cor3PopGenislik", String(popW)); } catch {} }, { once: true });
    });
    let popVeri = {};
    let popOzet = {};
    const kac = (x) => String(x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const ozetCiz = () => chrome.storage.local.get(["ozet3", "kosular"], (r) => {
        const g = (r.ozet3 && r.ozet3.gunler) || {};
        const sinir = Date.now() - 3 * 86400000;
        for (const k of r.kosular || []) {
            if (!k.completedAt || Date.parse(k.completedAt) < sinir) continue;
            const ad = new Date(k.completedAt).toLocaleDateString("sv-SE");
            const o = g[ad] || (g[ad] = { job: 0, jobCr: 0, kacan: 0, satis: 0, satisCr: 0, depozito: 0 });
            o.td = (o.td || 0) + (typeof k.rewardPaid === "number" ? k.rewardPaid : 0) - (k.entryFee ?? 1000);
        }
        const gunler = Object.keys(g).filter((k) => k >= new Date(sinir).toLocaleDateString("sv-SE")).sort();
        const top = { job: 0, jobCr: 0, kacan: 0, satisCr: 0, td: 0 };
        top.liste = [];
        top.deneme = 0;
        for (const k of gunler) { const o = g[k]; top.deneme += o.deneme || 0; top.liste.push(...(o.liste || []).map((x) => typeof x === "string" ? x : { ...x, gun: `${k.slice(8)}.${k.slice(5, 7)}` })); top.job += o.job; top.jobCr += o.jobCr; top.kacan += o.kacan; top.satisCr += o.satisCr; top.td += o.td || 0; }
        const hucre = "padding:2px 4px;text-align:right;font-variant-numeric:tabular-nums";
        popVeri = {};
        popOzet = {};
        const satir = (ad, o, kalin) => (popVeri[ad] = o.liste || [], popOzet[ad] = { kacan: o.kacan, deneme: o.deneme }, 0) || `<tr style="${kalin ? "color:var(--text);font-weight:700;border-top:1px solid var(--border)" : ""}"><td style="padding:2px 4px">${ad}</td><td style="${hucre}" title="yapılan job, net CR (depozito düşülmüş)">${o.job} · ${sayi(o.jobCr)}</td><td style="${hucre};color:${o.kacan ? "var(--accent-orange)" : "inherit"};${(o.liste || []).length ? "cursor:help;text-decoration:underline dotted" : ""}" data-kacan="${kac(ad)}">${o.kacan}</td><td style="${hucre}">${sayi(o.satisCr)}</td><td style="${hucre};color:${(o.td || 0) >= 0 ? "var(--accent-green)" : "var(--accent-red)"}">${(o.td || 0) >= 0 ? "+" : ""}${sayi(o.td || 0)}</td></tr>`;
        ozet.innerHTML = `<div style="display:flex;justify-content:space-between;color:var(--accent-light-cyan);font-size:12px;font-weight:600;margin-bottom:4px"><span>Özet (son 3 gün)</span><span style="font-size:10px;color:var(--text-dim);font-weight:400">${r.ozet3 ? new Date(r.ozet3.zaman).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : "hesaplanıyor"}</span></div>`
            + `<table style="width:100%;border-collapse:collapse"><tr style="color:var(--text-dim)"><th style="text-align:left;padding:2px 4px;font-weight:400">Gün</th><th style="${hucre};font-weight:400" title="Helper'ın yaptığı joblar ve net kazanç">Job · CR</th><th style="${hucre};font-weight:400" title="Helper'ın denediği ama yapamadığı ya da atladığı joblar">Kaçan</th><th style="${hucre};font-weight:400" title="Değerli dosya satışı (arama/indirme)">Satış CR</th><th style="${hucre};font-weight:400" title="TD koşuları: ödül - giriş ücreti">TD net</th></tr>`
            + gunler.map((k) => satir(new Date(k + "T12:00").toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }), g[k])).join("") + satir("Toplam", top, true) + `</table>`
            + `<div style="color:var(--text-dim);margin-top:3px">Kayıt 8 Kas 06:49'dan beri tutuluyor; job/satış sayıları günlükten.</div>`;
    });
    let sabit = false;
    const popAc = (td, kalici) => {
        const h = kacanHtml(popVeri[td.dataset.kacan]);
        if (!h) return;
        const v = popOzet[td.dataset.kacan] || {};
        pop.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;color:var(--accent-light-cyan);font-weight:600;font-size:12px;margin-bottom:2px"><span>Kaçan joblar · ${kac(td.dataset.kacan)}</span>${kalici ? `<span data-kapat style="cursor:pointer;color:var(--text-secondary);padding:0 4px" title="Kapat">✕</span>` : `<span style="font-size:9.5px;color:var(--text-dim);font-weight:400">tıkla: sabitle</span>`}</div><div style="color:var(--text-dim);font-size:9.5px;margin-bottom:6px">${v.kacan || 0} farklı job kaçtı${v.deneme ? `; Helper turlarında toplam ${v.deneme} başarısız/atlanan deneme (aynı job her turda tekrar sayılır)` : ""}</div>` + h;
        sabit = !!kalici;
        pop.style.position = "fixed";
        pop.append(popTut);
        pop.style.display = "block";
        const b = td.getBoundingClientRect();
        pop.style.left = Math.max(4, Math.min(window.innerWidth - popW - 6, b.right - popW)) + "px";
        const ust = b.bottom + 4, yuk = pop.offsetHeight;
        pop.style.top = (ust + yuk > window.innerHeight ? Math.max(4, b.top - yuk - 4) : ust) + "px";
    };
    ozet.addEventListener("mouseover", (e) => { const td = e.target.closest("[data-kacan]"); if (td && !sabit) popAc(td, false); });
    ozet.addEventListener("click", (e) => { const td = e.target.closest("[data-kacan]"); if (td) { e.stopPropagation(); popAc(td, true); } });
    ozet.addEventListener("mouseout", (e) => { if (!sabit && e.target.closest("[data-kacan]") && !pop.contains(e.relatedTarget)) pop.style.display = "none"; });
    pop.addEventListener("mouseleave", () => { if (!sabit) pop.style.display = "none"; });
    pop.addEventListener("click", (e) => { e.stopPropagation(); if (e.target.closest("[data-kapat]")) { sabit = false; pop.style.display = "none"; } });
    document.addEventListener("click", () => { if (sabit) { sabit = false; pop.style.display = "none"; } });
    ozetCiz();
    raporCiz();
    anlikCiz();

    const oku = () => chrome.storage.local.get(["ayar", "planAyar"], (r) => {
        for (const { a, g } of satirlar) {
            if (a.tip === "td") g.checked = !!(r.ayar && r.ayar[a.k]);
            else if (a.tip === "plan") g.checked = !!(r.planAyar && r.planAyar[a.k]);
            else { const e = document.getElementById(a.id); g.checked = !!(e && e.checked); g.disabled = !e; }
        }
    });
    for (const { a, g } of satirlar) {
        g.addEventListener("change", () => {
            const v = g.checked;
            if (a.tip === "td") chrome.storage.local.get("ayar", (r) => chrome.storage.local.set({ ayar: { ...(r.ayar || {}), [a.k]: v } }));
            else if (a.tip === "plan") chrome.storage.local.get("planAyar", (r) => chrome.storage.local.set({ planAyar: { ...(r.planAyar || {}), [a.k]: v } }));
            else {
                const e = document.getElementById(a.id);
                if (e && e.checked !== v) e.click();
                setTimeout(oku, 300);
            }
        });
        if (a.tip === "dom") {
            const e = document.getElementById(a.id);
            if (e) e.addEventListener("change", oku);
        }
    }
    chrome.storage.onChanged.addListener((d) => { if (d.ayar || d.planAyar || d.autoFinishAllJobsEnabled || d.autoSendMerc) oku(); if (d.ozet3 || d.kosular) ozetCiz(); if (d.gunlukRapor) raporCiz(); if (d.durum || d.automationQueueStatus || d.planDurum || d.ayar || d.planAyar || d.autoJobsDebugLogs || d.valuableDebugLogs) anlikCiz(); });
    oku();
    setTimeout(oku, 1500);
})();
