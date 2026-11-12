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
    const UCUZ = (d) => d.m.yalnizUcuz && "Yalnız ucuz asker açık (2.500 CR ve üstü hiç gitmez)";
    const OTO = (d) => (!d.dom.autoSendMercenaryToggle && "Paralı asker gönder kapalı") || (!d.dom.autoChooseMercToggle && "Asker otomatik seç kapalı (bu kural yalnız otomatik seçimde çalışır)");
    const OLUM = (d) => OTO(d) || (d.guvenli && "Hiç risk alma açık (öldürme riskli karar gerektirir)");
    const ANAHTAR = [
        { b: "Tower Defense", ad: "TD bot", tip: "td", k: "acik", ipucu: "Tower Defense botu. Açıkken maç oynar; Helper ya da planlayıcı çalışırken ve store jobları bitmeden yeni maça girmez." },
        { b: "Tower Defense", ad: "TD: maç bitince dur", tip: "td", k: "sonrakindeDur", kos: (d) => !d.td.acik && "TD bot kapalı", ipucu: "Açınca TD sürmekte olan maçı bitirir, sonra TD botunu kapatır ve bu anahtar kendiliğinden kapanır. Rematch yapılmaz." },
        { b: "Joblar ve planlayıcı", ad: "Helper jobları", tip: "dom", id: "autoFinishAllJobsToggle", ipucu: "Auto Finish All Jobs. Store jobları yenilenince seçili türdeki jobları otomatik alıp yapar." },
        { b: "Joblar ve planlayıcı", ad: "Planlayıcı (arama/satış)", tip: "plan", k: "acik", ipucu: "Değerli dosya arama, indirme, satış ve force turlarını yönetir; daily ops da buna bağlı. Kapatınca hepsi durur." },
        { b: "Joblar ve planlayıcı", ad: "Daily ops", tip: "plan", k: "gunluk", kos: (d) => !d.plan.acik && "Planlayıcı kapalı", ipucu: "Günlük görevi otomatik yapar (her gün 03:00 TR yenilenir, kaçarsa seri sıfırlanır). Planlayıcı açık olmalı." },
        { b: "Joblar ve planlayıcı", ad: "Birikim (dolunca sat)", tip: "plan", k: "birikim", kos: (d) => !d.plan.acik && "Planlayıcı kapalı", ipucu: "Açıkken çift tur yerine çalışır. Joblar bitince saatte bir yalnız arama yapar (arama bakım başlatmaz). Bir sunucunun dosya sayısı 3 taramada artmazsa dolmuş sayılır, indirilip satılır. Job yolundaki sunucu yalnız store resetine bakım + pay kadar süre varken indirilir ve hemen force edilir." },
        { b: "Joblar ve planlayıcı", ad: "Çift tur", tip: "plan", k: "ciftTur", kos: (d) => (!d.plan.acik && "Planlayıcı kapalı") || (d.plan.birikim && "Birikim açıkken çift tur çalışmaz"), ipucu: "Store'a uzun süre varsa önce arama ve satış, store yaklaşınca tekrar arama, satış ve force. Kapalıyken 'Döngü arası' süresiyle tek tur çalışır." },
        { b: "Joblar ve planlayıcı", ad: "Force", tip: "plan", k: "force", kos: (d) => (!d.plan.acik && "Planlayıcı kapalı") || (d.plan.aramaKapali && "Arama/force kapalı açık"), ipucu: "Satıştan sonra sunucuları bilerek bakıma sokar; bakım job saatinden önce biter. Bakımdan çıkan sunucunun erişimi sıfırlanır, yeniden hack gerekir." },
        { b: "Joblar ve planlayıcı", ad: "Arama/force kapalı", tip: "plan", k: "aramaKapali", kos: (d) => !d.plan.acik && "Planlayıcı kapalı", ipucu: "Planlayıcı açık kalır ama arama, satış ve force turlarını başlatmaz. Daily ops, Helper jobları ve TD sürer." },
        { b: "Expedition gönderimi", ad: "Paralı asker gönder", tip: "dom", id: "autoSendMercenaryToggle", ipucu: "Auto Send Mercenary. Expedition dönünce ganimeti toplar, günlük sınıra kadar paralı askeri yeniden gönderir (her gönderim CR tutar, +10 renown)." },
        { b: "Expedition gönderimi", ad: "Asker otomatik seç", tip: "dom", id: "autoChooseMercToggle", kos: (d) => !d.dom.autoSendMercenaryToggle && "Paralı asker gönder kapalı", ipucu: "Uygun askerler içinden en ucuzunu (eşitse en az riskliyi) seçer. Kapalıyken popup'ta seçili asker gider." },
        { b: "Expedition gönderimi", ad: "Yalnız ucuz asker (< 2.500)", tip: "merc", k: "yalnizUcuz", kos: OTO, ipucu: "Açıkken yalnız ücreti 2.500 CR'ın altındaki askerler gönderilir. Ucuzlar dinlenirken hiç gönderim olmaz; USOL görev yolu ve öldürme yolları da 2.500 ve üstü askeri göndermez." },
        { b: "Expedition gönderimi", ad: "Yalnız USOL askeri", tip: "merc", k: "yalnizUsol", kos: (d) => OTO(d) || UCUZ(d), ipucu: "Açıkken yalnız USOL askerleri gönderilir; CORE askerleri hiçbir yoldan gitmez (öldürme yolu dahil). USOL askerleri dinlenirken gönderim olmaz. Elit asker gitmez." },
        { b: "Expedition gönderimi", ad: "Recruit en çok görev", tip: "sayi", k: "recruitSinir", vs: 0, max: 99, kos: OTO, ipucu: "RECRUIT rütbeli asker bu kadar görev tamamladıysa hiçbir yoldan gönderilmez (öldürme yolu dahil). Örnek 10: 10 görevden sonra durur, rütbe atlayıp pahalanmaz. 0 = kapalı." },
        { b: "Expedition gönderimi", ad: "Para yettikçe gönder", tip: "merc", k: "sinirsiz", kos: (d) => !d.dom.autoSendMercenaryToggle && "Paralı asker gönder kapalı", ipucu: "Açıkken günlük sınır yok: bakiye alt sınırın üstünde oldukça asker gönderilmeye devam eder (askerler dinlenirken beklenir). Kapalıyken 'Expedition / gün' sınırı geçerli." },
        { b: "Expedition gönderimi", ad: "Gönderim alt bakiye", tip: "sayi", k: "paraAlt", vs: 20000, max: 2000000, kos: (d) => (!d.dom.autoSendMercenaryToggle && "Paralı asker gönder kapalı") || (!d.m.sinirsiz && "Para yettikçe gönder kapalı"), ipucu: "'Para yettikçe gönder' açıkken bakiye bu sayının altına inince gönderim durur, üstüne çıkınca sürer." },
        { b: "Expedition gönderimi", ad: "Expedition / gün", tip: "sayi", k: "gunluk", vs: 2, max: 72, kos: (d) => (!d.dom.autoSendMercenaryToggle && "Paralı asker gönder kapalı") || (d.m.sinirsiz && "Para yettikçe gönder açıkken günlük sınır yok"), ipucu: "Günde en çok kaç expedition gönderilsin (yerel gün). 0 = sınırsız." },
        { b: "Expedition gönderimi", ad: "USOL askerine öncelik", tip: "merc", k: "usolOncelik", kos: (d) => OTO(d) || UCUZ(d), ipucu: "Açıkken müsait bir USOL askeri varsa (elit değil, ücreti USOL tavanı 6.000 CR'ı geçmiyor) ucuz CORE askerlerinden önce o gönderilir. USOL askeri yoksa ya da dinleniyorsa her zamanki sıra geçerli. USOL ücret sınırını geçenler öldürme kuralına göre en riskli kararla gider." },
        { b: "Expedition gönderimi", ad: "USOL: görev eşyası topla", tip: "merc", k: "usolGorev", kos: (d) => OTO(d) || UCUZ(d), ipucu: "USOL'dan çıkan görev eşyaları (Crimper, NIC Nano, Circuit x2, oxygen tank x3) tamamlanana kadar, yalnız ~2k'lık ucuz asker yokken (hepsi dinlenmede) USOL askeri gönderilir (~5.000 CR). Eşyalar tamamlanınca kendiliğinden durur. Elit asker gitmez." },
        { b: "Asker öldürme", ad: "Öldür: CORE ücret > CR", tip: "sayi", k: "olumEsik", vs: 0, max: 100000, kos: (d) => OTO(d) || UCUZ(d), alt: 2500, ipucu: "CORE askerinin ücreti bu sayının üstündeyse (ya da görev sayısı sınırını geçtiyse) ucuz asker yokken gönderilir ve her seferinde en riskli kararlar seçilir (ölsün diye). Hiç risk alma açıkken de geçerli. (ölsün, yerine 2k'lık yeni asker gelsin). Surface bölgesinde ölüm şansı düşük; her deneme ücret kadar tutar. 0 = kapalı." },
        { b: "Asker öldürme", ad: "Öldür: USOL ücret > CR", tip: "sayi", k: "olumEsikUsol", vs: 0, max: 100000, kos: (d) => OTO(d) || UCUZ(d), alt: 5500, ipucu: "USOL askerinin ücreti bu sayının üstündeyse (ya da görev sayısı sınırını geçtiyse) ucuz asker yokken gönderilir ve her seferinde en riskli kararlar seçilir. Hiç risk alma açıkken de geçerli. USOL askerleri 5.000'den başladığı için ayrı sınır. 0 = kapalı." },
        { b: "Asker öldürme", ad: "Öldür: görev sayısı ≥", tip: "sayi", k: "olumGorev", vs: 0, max: 99, kos: OTO, ipucu: "Ucuz asker bu kadar görev tamamladıysa sonraki seferlerinde en riskli kararlar seçilir (10. görevde rütbe atlayıp ~5.500'e pahalanmadan ölsün). 'Hiç risk alma' açıkken de çalışır. 0 = kapalı. Kaçıncı görevde fiyat arttığı Askerler kutusunda öğreniliyor." },
        { b: "Kararlar ve ganimet", ad: "Expedition kararları", tip: "dom", id: "autoChooseCheckbox", ipucu: "Expedition sırasında gelen seçimleri ganimet/risk puanına göre otomatik yanıtlar." },
        { b: "Kararlar ve ganimet", ad: "Hiç risk alma", tip: "yerel", k: "kararGuvenli", kos: (d) => !d.dom.autoChooseCheckbox && "Expedition kararları kapalı", ipucu: "Her karar sorusunda en düşük riskli seçenek seçilir (eşitse ganimeti fazla olan). Açıkken karar deneyi çalışmaz; öldürülecek askerler (ücret ya da görev sınırını geçenler) yine en riskli kararla gider." },
        { b: "Kararlar ve ganimet", ad: "Karar deneyi", tip: "yerel", k: "kararDeney", kos: (d) => (!d.dom.autoChooseCheckbox && "Expedition kararları kapalı") || (d.guvenli && "Hiç risk alma açık"), ipucu: "Seferlerin yarısında en riskli, yarısında normal (güvenli) kararlar seçilir; hangisinin daha çok ganimet getirdiği ölçülür." },
        { b: "Kararlar ve ganimet", ad: "Stash: Receive all", tip: "merc", k: "mailAl", ipucu: "Stash'teki gelen kutusunda (mailbox) bekleyen eşyaları otomatik alır, oyundaki 'Receive all' düğmesinin yaptığını yapar. 5 dakikada bir bakar; kasada yer yoksa sığmayanlar kutuda kalır." },
        { b: "Kararlar ve ganimet", ad: "Ganimeti sat", tip: "merc", k: "ganimetSat", ipucu: "Expedition'dan gelen satılabilir eşyaları otomatik satar. Görev (QUEST) eşyaları ve drone görevinde istenen eşyalar satılmaz." },
        { b: "Kararlar ve ganimet", ad: "Görev fazlasını sat", tip: "merc", k: "ganimetFazla", kos: (d) => !d.m.ganimetSat && "Ganimeti sat kapalı", ipucu: "Drone görevinde istenen eşyalardan, görevin istediği adetten fazlası da satılır (ör. beanie 3 tane kalır). Kapalıyken bu eşyalar hiç satılmaz." },
    ];
    const kutu = document.createElement("div");
    kutu.id = "cor3Anahtarlar";
    kutu.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:4px 10px;padding:6px 10px;margin-bottom:4px;background:var(--bg-card);border-radius:6px;border:1px solid var(--border)";
    let sonBolum = null;
    const satirlar = ANAHTAR.map((a) => {
        if (a.b !== sonBolum) {
            sonBolum = a.b;
            const h = document.createElement("div");
            h.className = "cor3-bolum";
            h.textContent = a.b;
            h.style.cssText = "grid-column:1/-1;font-size:10.5px;font-weight:600;color:var(--accent-light-cyan);padding-top:4px;margin-top:2px;border-top:1px solid var(--border)";
            if (kutu.childElementCount === 0) h.style.cssText += ";border-top:none;margin-top:0;padding-top:0";
            kutu.append(h);
        }
        const s = document.createElement("label");
        s.title = a.ipucu;
        s.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:10px;color:var(--text-secondary);cursor:pointer;min-width:0";
        s.innerHTML = a.tip === "sayi"
            ? `<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a.ad}</span><input type="number" min="0" max="${a.max}" style="width:52px;flex:none;font-size:10px;padding:1px 3px;background:var(--bg-input,transparent);color:var(--text);border:1px solid var(--border);border-radius:4px">`
            : `<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a.ad}</span><span class="alarm-toggle-switch" style="flex:none"><input type="checkbox"><span class="slider-track"></span></span>`;
        const g = s.querySelector("input");
        kutu.append(s);
        return { a, g };
    });
    ust.after(kutu);
    const aktar = document.createElement("div");
    aktar.style.cssText = "grid-column:1/-1;display:flex;gap:6px;align-items:center;margin-top:4px;padding-top:4px;border-top:1px solid var(--border);font-size:10px;color:var(--text-secondary)";
    aktar.innerHTML = `<button type="button" data-a="disa" style="font-size:10px;padding:2px 8px;cursor:pointer">Ayarları dışa aktar</button><button type="button" data-a="ice" style="font-size:10px;padding:2px 8px;cursor:pointer">İçe aktar</button><input type="file" accept=".json,application/json" style="display:none"><span data-not style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span>`;
    kutu.append(aktar);
    const gun = document.createElement("div");
    gun.style.cssText = "grid-column:1/-1;display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:10px;color:var(--text-secondary)";
    gun.innerHTML = `<span data-s></span><button type="button" data-g style="font-size:10px;padding:2px 8px;cursor:pointer">Güncelleme ara</button><span data-d style="flex-basis:100%"></span>`;
    kutu.append(gun);
    const gunCiz = (g) => {
        const v = chrome.runtime.getManifest().version;
        gun.querySelector("[data-s]").textContent = "Sürüm " + v;
        const d = gun.querySelector("[data-d]");
        d.style.color = "";
        if (!g) { d.textContent = ""; return; }
        if (g.disk && g.disk !== v) d.textContent = `${g.disk} indirildi, maç arasında kendini yeniden yükleyecek.`;
        else if (g.var) { d.textContent = `Yeni sürüm ${g.uzak} var: Güncelleme ara düğmesine bas, indirip kurar.` + (g.notlar ? " (" + g.notlar + ")" : ""); d.style.color = "var(--warning,#e0a030)"; }
        else if (g.hata) d.textContent = "Güncelleme bakılamadı: " + g.hata;
        else if (g.bakildi) d.textContent = "Güncel (" + new Date(g.bakildi).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) + " bakıldı).";
    };
    chrome.storage.local.get("guncelleme", (r) => gunCiz(r.guncelleme));
    chrome.storage.onChanged.addListener((d, alan) => { if (alan === "local" && d.guncelleme) gunCiz(d.guncelleme.newValue); });
    gun.querySelector("[data-g]").addEventListener("click", () => {
        gun.querySelector("[data-d]").textContent = "Bakılıyor...";
        chrome.runtime.sendMessage({ guncellemeBak: true }, (g) => { void chrome.runtime.lastError; gunCiz(g); if (g && g.var && !(g.disk && g.disk !== chrome.runtime.getManifest().version)) gunIndir(g); });
    });
    const gunIndir = async (g) => {
        const d = gun.querySelector("[data-d]");
        try {
            const ps = await (await fetch(chrome.runtime.getURL("guncelle.ps1"))).text();
            const bat = "@echo off\r\ntitle cor3 guncelle\r\npowershell -NoProfile -ExecutionPolicy Bypass -Command \"$s=[IO.File]::ReadAllText('%~f0');$i=$s.IndexOf('#PS'+'BASLA');iex ('& {'+$s.Substring($i)+'} -ID " + chrome.runtime.id + "')\"\r\nexit /b\r\n#PSBASLA\r\n" + ps.replace(/\r?\n/g, "\r\n");
            const url = "data:application/octet-stream;base64," + btoa(unescape(encodeURIComponent(bat)));
            chrome.downloads.download({ url, filename: "cor3-guncelle.bat", conflictAction: "overwrite", saveAs: true }, (id) => {
                if (chrome.runtime.lastError || !id) { d.textContent = "İndirilemedi: " + (chrome.runtime.lastError ? chrome.runtime.lastError.message : "iptal"); return; }
                d.textContent = `${g.uzak} için cor3-guncelle.bat indiriliyor...`;
                const izle = (c) => {
                    if (c.id !== id || !c.state) return;
                    chrome.downloads.onChanged.removeListener(izle);
                    if (c.state.current !== "complete") { d.textContent = "İndirme yarıda kaldı."; return; }
                    d.textContent = "cor3-guncelle.bat indirildi ve açılıyor. Pencere bitince eklenti hemen yeniden yüklenir.";
                    try { chrome.downloads.open(id); } catch (e) { d.textContent = "cor3-guncelle.bat indirildi, çift tıklayıp çalıştır."; }
                    const bas = Date.now();
                    const tik = setInterval(() => { if (Date.now() - bas > 10 * 60000) return clearInterval(tik); chrome.runtime.sendMessage({ diskBak: true }, () => void chrome.runtime.lastError); }, 3000);
                };
                chrome.downloads.onChanged.addListener(izle);
            });
        } catch (e) {
            d.textContent = "İndirilemedi: " + (e && e.message ? e.message : e);
        }
    };
    const YEREL_AYAR = ["ayar", "planAyar", "yanPanel", "kararDeney", "kararGuvenli"];
    const aktarNot = (m) => { aktar.querySelector("[data-not]").textContent = m; };
    aktar.querySelector('[data-a="disa"]').addEventListener("click", async () => {
        const sync = await chrome.storage.sync.get(null);
        const local = await chrome.storage.local.get(YEREL_AYAR);
        delete sync.oldValues; delete sync.pinnedTimers;
        if (sync.autoSendMerc) { sync.autoSendMerc = { ...sync.autoSendMerc }; for (const k of ["mercenaryId", "mercenaryName", "dokunma", "disabledReason"]) delete sync.autoSendMerc[k]; sync.autoSendMerc.usolKalan = 0; }
        const veri = { tur: "cor3-ayarlar", surum: chrome.runtime.getManifest().version, tarih: new Date().toISOString(), sync, local };
        const url = URL.createObjectURL(new Blob([JSON.stringify(veri, null, 1)], { type: "application/json" }));
        const l = document.createElement("a");
        l.href = url; l.download = "cor3-ayarlar-" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.append(l); l.click(); l.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        aktarNot("Dışa aktarıldı (" + Object.keys(sync).length + " Helper + " + Object.keys(local).length + " TD/planlayıcı ayarı).");
    });
    const dosya = aktar.querySelector('input[type="file"]');
    aktar.querySelector('[data-a="ice"]').addEventListener("click", () => dosya.click());
    dosya.addEventListener("change", async () => {
        const f = dosya.files && dosya.files[0];
        dosya.value = "";
        if (!f) return;
        try {
            const v = JSON.parse(await f.text());
            if (!v || typeof v !== "object" || !v.sync || !v.local) throw new Error("dosya cor3 ayar dosyası değil");
            const simdi = await chrome.storage.sync.get("autoSendMerc");
            const sync = { ...v.sync };
            delete sync.oldValues; delete sync.pinnedTimers;
            if (sync.autoSendMerc) {
                const eski = simdi.autoSendMerc || {};
                sync.autoSendMerc = { ...sync.autoSendMerc, mercenaryId: eski.mercenaryId || null, mercenaryName: eski.mercenaryName || "", dokunma: eski.dokunma || [], disabledReason: null };
            }
            const local = {};
            for (const k of YEREL_AYAR) if (v.local[k] !== undefined) local[k] = v.local[k];
            await chrome.storage.sync.set(sync);
            await chrome.storage.local.set({ ...local, ayarYazan: { kim: "ayar içe aktarma", t: Date.now() } });
            aktarNot("İçe aktarıldı (" + Object.keys(sync).length + " + " + Object.keys(local).length + " ayar). Oyun sekmesini yenile.");
            setTimeout(oku, 300);
        } catch (e) {
            aktarNot("İçe aktarılamadı: " + (e && e.message ? e.message : e));
        }
    });
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
    const gorev = document.createElement("details");
    gorev.id = "cor3Gorev";
    gorev.style.cssText = rapor.style.cssText;
    rapor.after(gorev);
    const gorevCiz = () => chrome.storage.local.get("gorevEsya", (r) => {
        const l = (r.gorevEsya && r.gorevEsya.maddeler) || [];
        const acik = gorev.open;
        const tam = l.filter((m) => m.tam);
        const kisa = (x) => x.replace(/ \(CCS Field Surgeon Kit Mk2\)| with backpack connector slot| Powered adjustable wrench/g, "");
        gorev.innerHTML = `<summary style="cursor:pointer;color:var(--accent-light-cyan);font-size:12px;font-weight:600">Görev eşyaları: ${tam.length}/${l.length} madde hazır (${Math.round(tam.reduce((t, m) => t + m.cr, 0)).toLocaleString("tr-TR")} CR)</summary>`
            + l.map((m) => `<div style="color:${m.tam ? "var(--success,#4caf50)" : "var(--text)"}">A${m.a} · ${m.cr.toLocaleString("tr-TR")} CR${m.tam ? " · HAZIR" : ""}</div>`
                + `<div style="padding-left:10px;color:var(--text-dim)">${m.e.map((x) => `<span style="color:${x[1] >= x[2] ? "var(--success,#4caf50)" : x[1] ? "var(--text)" : "inherit"}">${kac(kisa(x[0]))} ${x[1]}/${x[2]}</span>`).join(", ")}</div>`).join("");
        gorev.open = acik;
    });
    const asker = document.createElement("details");
    asker.id = "cor3Asker";
    asker.style.cssText = rapor.style.cssText;
    gorev.after(asker);
    const askerCiz = () => chrome.storage.local.get("mercGecmis", (r) => chrome.storage.sync.get("autoSendMerc", (sy) => {
        const dok = new Set(((sy.autoSendMerc || {}).dokunma) || []);
        const g = r.mercGecmis || { son: {}, olay: [] };
        const acik = asker.open;
        const l = Object.entries(g.son).map(([id, x]) => ({ ...x, id })).filter((x) => Date.now() - (x.t || 0) < 6 * 3600000).sort((a, b) => a.ucret - b.ucret);
        const olay = (g.olay || []).filter((o) => o.tip || o.once[0] !== o.sonra[0] || o.once[2] !== o.sonra[2]).slice(-10).reverse();
        const zm = (t) => new Date(t).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
        const olaySatir = (o) => o.tip === "geldi" ? `${zm(o.t)} YENİ: ${kac(o.ad)} (${o.market.toUpperCase()}, ${kac(o.sonra[0])}, ${o.sonra[2].toLocaleString("tr-TR")} CR)`
            : o.tip === "gitti" ? `${zm(o.t)} AYRILDI: ${kac(o.ad)} (${o.market.toUpperCase()}, ${o.once[1]} görev, ${o.once[2].toLocaleString("tr-TR")} CR)`
            : `${zm(o.t)} ${kac(o.ad)}: ${kac(o.once[0])} ${o.once[1]} görev ${o.once[2].toLocaleString("tr-TR")} → ${kac(o.sonra[0])} ${o.sonra[1]} görev ${o.sonra[2].toLocaleString("tr-TR")} CR`;
        asker.innerHTML = `<summary style="cursor:pointer;color:var(--accent-light-cyan);font-size:12px;font-weight:600">Askerler: ${l.length} (ücret/rütbe takibi)</summary>`
            + l.map((x) => `<div style="color:var(--text)">${kac(x.ad)}${x.elit ? " (ELİT, gönderilmez)" : ""}${dok.has(x.id) ? " (DOKUNMA, gönderilmez)" : ""} · ${x.market.toUpperCase()} · ${kac(x.rutbe)} · ${x.gorev} görev · ${x.ucret.toLocaleString("tr-TR")} CR</div>`).join("")
            + (olay.length ? `<div style="margin-top:4px;color:var(--text-dim)">Gelen/ayrılan askerler, ücret/rütbe değişimleri:</div>` + olay.map((o) => `<div style="padding-left:10px;color:var(--text-dim)">${olaySatir(o)}</div>`).join("") : `<div style="color:var(--text-dim)">Henüz değişim görülmedi.</div>`);
        asker.open = acik;
    }));
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
        for (const k of gunler) { const o = g[k]; top.deneme += o.deneme || 0; top.liste.push(...(o.liste || []).map((x) => typeof x === "string" ? x : { ...x, gun: `${k.slice(8)}.${k.slice(5, 7)}` })); top.job += o.job; top.jobTahmini = (top.jobTahmini || 0) + (o.jobTahmini || 0); top.jobCr += o.jobCr; top.kacan += o.kacan; top.satisCr += o.satisCr; top.td += o.td || 0; }
        const hucre = "padding:2px 4px;text-align:right;font-variant-numeric:tabular-nums";
        popVeri = {};
        popOzet = {};
        const satir = (ad, o, kalin) => (popVeri[ad] = o.liste || [], popOzet[ad] = { kacan: o.kacan, deneme: o.deneme }, 0) || `<tr style="${kalin ? "color:var(--text);font-weight:700;border-top:1px solid var(--border)" : ""}"><td style="padding:2px 4px">${ad}</td><td style="${hucre}" title="yapılan job, net CR (depozito düşülmüş)${o.jobTahmini ? "; " + o.jobTahmini + " jobun CR'ı günün ortalamasından tahmin (kayıt eksik)" : ""}">${o.job} · ${o.jobTahmini ? "~" : ""}${sayi(o.jobCr)}</td><td style="${hucre};color:${o.kacan ? "var(--accent-orange)" : "inherit"};${(o.liste || []).length ? "cursor:help;text-decoration:underline dotted" : ""}" data-kacan="${kac(ad)}">${o.kacan}</td><td style="${hucre}">${sayi(o.satisCr)}</td><td style="${hucre};color:${(o.td || 0) >= 0 ? "var(--accent-green)" : "var(--accent-red)"}">${(o.td || 0) >= 0 ? "+" : ""}${sayi(o.td || 0)}</td></tr>`;
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
    gorevCiz();
    askerCiz();
    anlikCiz();

    const oku = () => chrome.storage.local.get(["ayar", "planAyar", "kararDeney", "kararGuvenli"], (r) => chrome.storage.sync.get("autoSendMerc", (sy) => {
        const dom = {};
        for (const id of ["autoSendMercenaryToggle", "autoChooseMercToggle", "autoChooseCheckbox", "autoFinishAllJobsToggle"]) { const e = document.getElementById(id); dom[id] = !!(e && e.checked); }
        const d = { td: r.ayar || {}, plan: r.planAyar || {}, m: sy.autoSendMerc || {}, dom, guvenli: !!r.kararGuvenli };
        for (const { a, g } of satirlar) {
            const neden = a.kos ? a.kos(d) : "";
            const s = g.closest("label");
            s.style.opacity = neden ? "0.45" : "";
            s.title = (neden ? "Etkisiz: " + neden + "\n\n" : "") + a.ipucu;
            if (a.tip !== "dom") g.disabled = !!neden;
            if (a.tip === "merc") { g.checked = !!(sy.autoSendMerc && sy.autoSendMerc[a.k]); continue; }
            if (a.tip === "yerel") { g.checked = !!r[a.k]; continue; }
            if (a.tip === "sayi") { if (document.activeElement !== g) g.value = (sy.autoSendMerc && sy.autoSendMerc[a.k]) ?? a.vs; continue; }
            if (a.tip === "td") g.checked = !!(r.ayar && r.ayar[a.k]);
            else if (a.tip === "plan") g.checked = !!(r.planAyar && r.planAyar[a.k]);
            else { const e = document.getElementById(a.id); g.checked = !!(e && e.checked); g.disabled = !e; }
        }
    }));
    for (const { a, g } of satirlar) {
        g.addEventListener("change", () => {
            const v = g.checked;
            if (a.tip === "sayi") { let n = Math.max(0, Math.min(a.max, parseInt(g.value, 10) || 0)); if (a.alt && n > 0 && n < a.alt) { if (document.activeElement === g) return; n = a.alt; g.value = n; } chrome.storage.sync.get("autoSendMerc", (sy) => chrome.storage.sync.set({ autoSendMerc: { ...(sy.autoSendMerc || {}), [a.k]: n } })); return; }
            if (a.tip === "yerel") { chrome.storage.local.set({ [a.k]: v }); return; }
            if (a.tip === "merc") { chrome.storage.sync.get("autoSendMerc", (sy) => chrome.storage.sync.set({ autoSendMerc: { ...(sy.autoSendMerc || {}), [a.k]: v } })); return; }
            if (a.tip === "td") chrome.storage.local.get("ayar", (r) => chrome.storage.local.set({ ayar: { ...(r.ayar || {}), [a.k]: v, ...(a.k === "acik" && !v ? { sonrakindeDur: false } : {}) }, ayarYazan: { kim: "Helper üst anahtar", t: Date.now() } }));
            else if (a.tip === "plan") chrome.storage.local.get("planAyar", (r) => chrome.storage.local.set({ planAyar: { ...(r.planAyar || {}), [a.k]: v }, ayarYazan: { kim: "Helper üst anahtar", t: Date.now() } }));
            else {
                const e = document.getElementById(a.id);
                if (e && e.checked !== v) e.click();
                setTimeout(oku, 300);
            }
        });
        if (a.tip === "sayi") { g.addEventListener("input", () => g.dispatchEvent(new Event("change"))); g.addEventListener("blur", () => g.dispatchEvent(new Event("change"))); }
        if (a.tip === "dom") {
            const e = document.getElementById(a.id);
            if (e) e.addEventListener("change", oku);
        }
    }
    chrome.storage.onChanged.addListener((d) => { if (d.ayar || d.planAyar || d.autoFinishAllJobsEnabled || d.autoSendMerc) oku(); if (d.ozet3 || d.kosular) ozetCiz(); if (d.gunlukRapor) raporCiz(); if (d.gorevEsya) gorevCiz(); if (d.mercGecmis || d.autoSendMerc) askerCiz(); if (d.kararDeney || d.kararGuvenli) oku(); if (d.autoSendMerc || d.decisionModifiers) oku(); if (d.durum || d.automationQueueStatus || d.planDurum || d.ayar || d.planAyar || d.autoJobsDebugLogs || d.valuableDebugLogs) anlikCiz(); });
    oku();
    setTimeout(oku, 1500);
})();
