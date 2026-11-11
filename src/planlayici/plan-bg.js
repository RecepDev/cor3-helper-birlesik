importScripts('background.js');

chrome.runtime.onInstalled.addListener((d) => {
    if (d.reason !== 'install') return;
    fetch(chrome.runtime.getURL('varsayilan-ayar.json')).then((r) => (r.ok ? r.json() : null)).then((v) => {
        if (!v) return;
        const uygula = () => Promise.all([chrome.storage.sync.set(v.sync || {}), chrome.storage.local.set(v.local || {})]);
        uygula().then(() => setTimeout(uygula, 3000));
    }).catch(() => {});
});

chrome.runtime.onMessage.addListener((m, sender, cevap) => {
    if (!m || !m.planRelay || !sender.tab) return;
    chrome.tabs.sendMessage(sender.tab.id, m.planRelay, (r) => {
        cevap({ ok: !chrome.runtime.lastError, r: r || null, hata: chrome.runtime.lastError ? chrome.runtime.lastError.message : null });
    });
    return true;
});

const BILDIRIM_HEDEF = { bakiye: 1310000, d4rkRep: 3, durgunDk: 30 };

const bildir = (id, baslik, mesaj) => new Promise((res) => {
    try {
        chrome.notifications.create(id + '-' + Date.now(), { type: 'basic', iconUrl: 'icon/favicon128.png', title: baslik, message: mesaj, priority: 2, requireInteraction: true }, () => res());
    } catch (e) { res(); }
});

const bildirimKontrol = async () => {
    const r = await chrome.storage.local.get(['planAyar', 'bildirimDurum', 'marketData', 'darkMarketData', 'soyuzMarketData', 'usolMarketData', 'durum', 'autoJobsCompletedResults', 'automationQueueStatus', 'gunlukRapor']);
    const ayar = r.planAyar || {};
    if (ayar.bildirim === false) return;
    const t = Date.now();
    const b = r.bildirimDurum || {};
    const liste = b.liste || [];
    const ekle = async (id, baslik, mesaj) => {
        liste.push({ t: new Date(t).toISOString(), id, m: baslik + ': ' + mesaj });
        while (liste.length > 20) liste.shift();
        await bildir(id, baslik, mesaj);
    };
    const kredi = [r.marketData, r.darkMarketData, r.soyuzMarketData, r.usolMarketData].map((m) => m && m.userCredits).find((x) => typeof x === 'number');
    const rep = r.darkMarketData && r.darkMarketData.reputation;
    if (rep && rep.level >= BILDIRIM_HEDEF.d4rkRep && !b.repTamam) { b.repTamam = t; await ekle('rep', 'D4RK itibarı ' + rep.level, '5CRYPt0L 0J alınabilir (D4RK itibar ' + BILDIRIM_HEDEF.d4rkRep + ').'); }
    if (typeof kredi === 'number' && kredi >= BILDIRIM_HEDEF.bakiye && !b.bakiyeTamam) { b.bakiyeTamam = t; await ekle('bakiye', 'Bakiye ' + kredi.toLocaleString('tr-TR') + ' CR', 'Hedef ' + BILDIRIM_HEDEF.bakiye.toLocaleString('tr-TR') + ' CR geçildi.'); }
    const d = r.durum || {};
    const imza = [kredi, JSON.stringify(d.sayac || {}), (r.autoJobsCompletedResults || []).length, (r.automationQueueStatus || {}).active || ''].join('|');
    if (imza !== b.imza) { b.imza = imza; b.imzaZaman = t; for (let i = liste.length - 1; i >= 0; i--) if (liste[i].id === 'durgun') liste.splice(i, 1); }
    for (let i = liste.length - 1; i >= 0; i--) if (t - Date.parse(liste[i].t) > 12 * 3600000) liste.splice(i, 1);
    const durgun = t - (b.imzaZaman || t);
    const sayfaYok = t - (d.zaman || 0) > 10 * 60000;
    if ((durgun > BILDIRIM_HEDEF.durgunDk * 60000 || (sayfaYok && t - (d.zaman || 0) > BILDIRIM_HEDEF.durgunDk * 60000)) && t - (b.durgunSon || 0) > 60 * 60000) {
        b.durgunSon = t;
        await ekle('durgun', 'cor3 bot ilerlemiyor', sayfaYok ? 'cor3 sayfasından ' + Math.round((t - (d.zaman || 0)) / 60000) + ' dk haber yok (sekme/Opera kapalı olabilir).' : Math.round(durgun / 60000) + ' dk boyunca bakiye, TD sayaçları ve joblar değişmedi. Son TD durumu: ' + (d.sonIs || '?'));
    }
    const rp = r.gunlukRapor;
    if (rp && rp.gun !== b.raporGun) { b.raporGun = rp.gun; await bildir('rapor', rp.baslik, (rp.satirlar || []).filter((x) => !/^  /.test(x)).slice(1).join(' · ').slice(0, 400)); }
    b.liste = liste;
    b.kontrol = t;
    await chrome.storage.local.set({ bildirimDurum: b });
};

chrome.alarms.get('cor3-bildirim', (a) => { if (!a) chrome.alarms.create('cor3-bildirim', { periodInMinutes: 5 }); });
chrome.alarms.onAlarm.addListener((a) => { if (a.name === 'cor3-bildirim') bildirimKontrol().catch(() => {}); });

const GH_REPO = 'RecepDev/cor3-helper-birlesik';
const surumBuyuk = (a, b) => {
    const x = String(a || '').split('.').map(Number), y = String(b || '').split('.').map(Number);
    for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
    return false;
};
async function diskYukle() {
    const sekmeler = await chrome.tabs.query({ url: 'https://cor3.gg/*' });
    if (sekmeler.length) {
        await chrome.storage.local.set({ planMesgul: true });
        const [r, s] = await Promise.all([chrome.storage.local.get(['durum', 'automationQueueStatus', 'planDurum']), chrome.storage.sync.get('autoDailyHackEnabled')]);
        const d = r.durum || {}, q = r.automationQueueStatus || {};
        const { guncelleBekle } = await chrome.storage.local.get('guncelleBekle');
        const bas = guncelleBekle || Date.now();
        if (!guncelleBekle) await chrome.storage.local.set({ guncelleBekle: bas });
        const taze = Date.now() - (d.zaman || 0) < 15000;
        const ok = !q.active && !(q.queued || []).length && (taze ? !d.macta && ((r.planDurum || {}).calisma || {}).adim === 'bos' && !s.autoDailyHackEnabled : Date.now() - bas > 20 * 60000);
        if (!ok) return;
    }
    await chrome.storage.local.set({ guncellemeYenile: Date.now() });
    await chrome.storage.local.remove('guncelleBekle');
    chrome.runtime.reload();
}
async function guncellemeBak(uzaktan) {
    const simdi = chrome.runtime.getManifest().version;
    const { guncelleme } = await chrome.storage.local.get('guncelleme');
    const g = { ...(guncelleme || {}) };
    if (uzaktan || Date.now() - (g.bakildi || 0) > 6 * 3600000) {
        try {
            const r = await fetch('https://raw.githubusercontent.com/' + GH_REPO + '/main/surum.json?t=' + Date.now(), { cache: 'no-store' });
            if (r.ok) { const v = await r.json(); g.uzak = v.surum; g.notlar = v.notlar || ''; g.hata = ''; } else g.hata = 'GitHub ' + r.status;
        } catch (e) { g.hata = String(e && e.message || e); }
        g.bakildi = Date.now();
    }
    let disk = null;
    try { disk = (await (await fetch(chrome.runtime.getURL('manifest.json'), { cache: 'no-store' })).json()).version; } catch (e) {}
    g.simdi = simdi;
    g.disk = disk;
    g.var = !!g.uzak && surumBuyuk(g.uzak, simdi);
    await chrome.storage.local.set({ guncelleme: g });
    if (disk && surumBuyuk(disk, simdi)) await diskYukle();
    return g;
}
chrome.storage.local.get('guncellemeYenile', async (r) => {
    if (!r.guncellemeYenile) return;
    await chrome.storage.local.remove('guncellemeYenile');
    if (Date.now() - r.guncellemeYenile > 5 * 60000) return;
    const { ayar } = await chrome.storage.local.get('ayar');
    await chrome.storage.local.set({ planMesgul: false, ayar: Object.assign({}, ayar, { otomatik: true }), ayarYazan: { kim: 'otomatik güncelleme', t: Date.now() } });
    setTimeout(async () => { for (const t of await chrome.tabs.query({ url: 'https://cor3.gg/*' })) chrome.tabs.reload(t.id); }, 2000);
});
chrome.alarms.get('cor3-guncelle', (a) => { if (!a) chrome.alarms.create('cor3-guncelle', { periodInMinutes: 1 }); });
chrome.alarms.onAlarm.addListener((a) => { if (a.name === 'cor3-guncelle') guncellemeBak(false).catch(() => {}); });
chrome.runtime.onMessage.addListener((m, sender, cevap) => {
    if (!m || !m.guncellemeBak) return;
    guncellemeBak(true).then((g) => cevap(g)).catch((e) => cevap({ hata: String(e) }));
    return true;
});
