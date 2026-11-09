importScripts('background.js');

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
    if (imza !== b.imza) { b.imza = imza; b.imzaZaman = t; }
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
