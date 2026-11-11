// Auto-Send Mercenary logic

import { isContextValid, _automationFinish, _automationEnqueue, _broadcastQueueStatus, getAutomationActive, setAutomationActive, getAutomationQueue } from './helpers.js';

export let _initialFetchDone = true; // false during initial data fetch after reconnect
export let autoSendInProgress = false;
export let autoSendExpeditionId = null;
export let autoSendAwaitingMercenaries = false;
export let autoSendAwaitingUsolMercs = false;
export let initialMercsReady = false;
export let autoSendDeferredWaiting = false;
export let autoSendExpeditionBlocked = false;
export let autoSendCollectRetries = 0;
export const MAX_COLLECT_RETRIES = 3;
export let _autoSendUsolSkipped = false;
export let _autoSendMercRetryCount = 0;
export const MAX_MERC_RETRIES = 3;

export function setInitialFetchDone(v) { _initialFetchDone = v; }
export function setAutoSendInProgress(v) { autoSendInProgress = v; }
export function setAutoSendExpeditionId(v) { autoSendExpeditionId = v; }
export function setAutoSendAwaitingMercenaries(v) { autoSendAwaitingMercenaries = v; }
export function setAutoSendAwaitingUsolMercs(v) { autoSendAwaitingUsolMercs = v; }
export function setInitialMercsReady(v) { initialMercsReady = v; }
export function setAutoSendDeferredWaiting(v) { autoSendDeferredWaiting = v; }
export function setAutoSendExpeditionBlocked(v) { autoSendExpeditionBlocked = v; }
export function setAutoSendCollectRetries(v) { autoSendCollectRetries = v; }
export function setAutoSendUsolSkipped(v) { _autoSendUsolSkipped = v; }
export function setAutoSendMercRetryCount(v) { _autoSendMercRetryCount = v; }

const GOREV_MADDE = [
    { a: 1, cr: 27000, usol: true, e: { 'FARLINE Universal Crimper': 1 } },
    { a: 5, cr: 23000, e: { 'Old Abibas beanie': 3, 'CCS "Kaloshi" Utility boots': 3 } },
    { a: 5, cr: 47000, e: { 'Soylent green bar': 3, 'Kosmonavt Energy Bar': 3 } },
    { a: 5, cr: 82000, e: { 'High-load auxiliary cable': 2 } },
    { a: 6, cr: 63000, e: { 'Nergalium-79-B slab': 1 } },
    { a: 6, cr: 72000, usol: true, e: { 'Core tech NIC "Nano" package': 1, 'Water vial': 3, 'Artificial milk': 3 } },
    { a: 7, cr: 45000, e: { 'Californium-252 slab': 1 } },
    { a: 7, cr: 17000, e: { 'Holocene Holographic cable': 1 } },
    { a: 7, cr: 94000, e: { 'Scissors (CCS Field Surgeon Kit Mk2)': 3, 'Scalpel (CCS Field Surgeon Kit Mk2)': 3, 'NPO "Platforma" universal straps with backpack connector slot': 2 } },
    { a: 8, cr: 26000, usol: true, e: { 'Circuit components': 2 } },
    { a: 8, cr: 95000, usol: true, e: { 'CCS Painkiller inhaler': 3, 'CCS small oxygen inhaler tank': 3 } },
    { a: 8, cr: 61000, e: { 'METALIFE medical components': 2 } },
    { a: 9, cr: 51000, e: { 'Holocene Holographic processor': 1, 'CCS Hydrogel Burn kit': 3 } },
    { a: 9, cr: 47000, e: { 'Circuit components': 2, 'Holocene Holographic processor': 1 } },
    { a: 11, cr: 44000, e: { 'SPI "Smartwrench" Powered adjustable wrench': 1, 'High-load auxiliary cable': 1 } },
];
const USOL_ESYA = new Set(['farlineuniversalcrimper', 'coretechnicnanopackage', 'circuitcomponents', 'ccssmalloxygeninhalertank']);
const ESYA_ES = { holoscene: 'holocene', auxillary: 'auxiliary' };
const esyaAd = (n) => String(n || '').toLowerCase().replace(/holoscene|auxillary/g, (x) => ESYA_ES[x]).replace(/[^a-z0-9]/g, '');
const GOREV_AD = {};
for (const m of GOREV_MADDE) for (const k of Object.keys(m.e)) GOREV_AD[esyaAd(k)] = (GOREV_AD[esyaAd(k)] || 0) + m.e[k];

function gorevSayacYaz(items) {
    const varOlan = {};
    for (const i of items || []) { const ad = esyaAd(i.name); if (GOREV_AD[ad] !== undefined) varOlan[ad] = (varOlan[ad] || 0) + (i.quantity || 1); }
    const kalan = { ...varOlan };
    const maddeler = GOREV_MADDE.map((m) => {
        const e = Object.keys(m.e).map((k) => { const ad = esyaAd(k); const v = Math.min(m.e[k], kalan[ad] || 0); kalan[ad] = (kalan[ad] || 0) - v; return [k, v, m.e[k]]; });
        const usolE = e.filter((x) => USOL_ESYA.has(esyaAd(x[0])));
        return { a: m.a, cr: m.cr, e, tam: e.every((x) => x[1] >= x[2]), usol: !!m.usol && usolE.some((x) => x[1] < x[2]) };
    });
    chrome.storage.local.set({ gorevEsya: { t: Date.now(), maddeler } });
}

export function ganimetSatilacak(items, fazla) {
    const sayac = {};
    const liste = [];
    for (const i of items || []) {
        if (i.source !== 'EXPEDITION' || !i.canSell || !(i.sellPrice > 0) || i.tier === 'QUEST') continue;
        const ad = esyaAd(i.name);
        const gerek = GOREV_AD[ad];
        const adet = i.quantity || 1;
        if (gerek === undefined) { liste.push({ item: i, adet }); continue; }
        if (!fazla) continue;
        const onceki = sayac[ad] || 0;
        const tut = Math.max(0, Math.min(adet, gerek - onceki));
        sayac[ad] = onceki + tut;
        if (adet - tut > 0) liste.push({ item: i, adet: adet - tut });
    }
    return liste;
}

const ganimetDenenen = new Set();
let ganimetSon = 0;
let ganimetSuruyor = false;

function ganimetSat() {
    if (ganimetSuruyor || Date.now() - ganimetSon < 60000) return;
    chrome.storage.sync.get('autoSendMerc', (ay) => {
        const m = ay.autoSendMerc || {};
        if (!m.ganimetSat) return;
        chrome.storage.local.get('stashData', (r) => {
            const liste = ganimetSatilacak(r.stashData && r.stashData.items, !!m.ganimetFazla).filter((x) => !ganimetDenenen.has(x.item.id)).slice(0, 12);
            if (liste.length === 0) return;
            ganimetSuruyor = true;
            ganimetSon = Date.now();
            console.log('[COR3 Helper] Loot-sell: selling', liste.length, 'item(s):', liste.map((x) => x.item.name + ' x' + x.adet + ' (' + x.item.sellPrice + ')').join(', '));
            let idx = 0;
            const sonraki = () => {
                if (idx >= liste.length) {
                    ganimetSuruyor = false;
                    setTimeout(() => window.postMessage({ type: 'COR3_REQUEST_STASH' }, '*'), 1500);
                    return;
                }
                const x = liste[idx++];
                ganimetDenenen.add(x.item.id);
                window.postMessage({ type: 'COR3_SELL_ITEM', itemId: x.item.id, quantity: x.adet, skipStashRefresh: true }, '*');
                setTimeout(sonraki, 1200 + Math.floor(Math.random() * 300));
            };
            sonraki();
        });
    });
}

chrome.storage.onChanged.addListener((d, alan) => {
    if (alan === 'local' && d.stashData) gorevSayacYaz(d.stashData.newValue && d.stashData.newValue.items);
    if ((alan === 'local' && d.stashData) || (alan === 'sync' && d.autoSendMerc)) ganimetSat();
});
chrome.storage.local.get('stashData', (r) => gorevSayacYaz(r.stashData && r.stashData.items));

let mercIzleZaman = null;
function mercIzle() {
    chrome.storage.local.get(['mercenariesData', 'usolMercenariesData', 'mercConfigData', 'mercGecmis'], (r) => {
        const g = r.mercGecmis || { son: {}, olay: [] };
        const cfg = r.mercConfigData || {};
        const hepsi = [];
        const ekle = (d, market) => {
            for (const m of (d && d.mercenaries) || []) hepsi.push([m, market, false]);
            for (const es of (d && d.eliteSlots) || []) if (es.mercenary) hepsi.push([es.mercenary, market, true]);
        };
        ekle(r.mercenariesData, 'core');
        ekle(r.usolMercenariesData, 'usol');
        let degisti = false;
        const simdi = Date.now();
        for (const [m, market, elit] of hepsi) {
            const c = cfg[m.id];
            if (!c || typeof c.totalCost !== 'number') continue;
            const yeni = { ad: m.callsign, market, elit, rutbe: m.rank, gorev: m.missionsCompleted || 0, ucret: c.totalCost, t: simdi };
            const eski = g.son[m.id];
            if (!eski && Object.keys(g.son).length) { g.olay.push({ t: simdi, tip: 'geldi', ad: yeni.ad, market, elit, sonra: [yeni.rutbe, yeni.gorev, yeni.ucret] }); }
            if (!eski || eski.rutbe !== yeni.rutbe || eski.gorev !== yeni.gorev || eski.ucret !== yeni.ucret) {
                if (eski) g.olay.push({ t: simdi, ad: yeni.ad, market, elit, once: [eski.rutbe, eski.gorev, eski.ucret], sonra: [yeni.rutbe, yeni.gorev, yeni.ucret] });
                degisti = true;
            }
            g.son[m.id] = yeni;
        }
        const gorulen = new Set(hepsi.map(([m]) => m.id));
        const listeler = { core: !!(r.mercenariesData && (r.mercenariesData.mercenaries || []).length), usol: !!(r.usolMercenariesData && (r.usolMercenariesData.mercenaries || []).length) };
        for (const id of Object.keys(g.son)) {
            const x = g.son[id];
            if (!gorulen.has(id) && listeler[x.market]) { g.olay.push({ t: simdi, tip: 'gitti', ad: x.ad, market: x.market, elit: x.elit, once: [x.rutbe, x.gorev, x.ucret] }); delete g.son[id]; degisti = true; continue; }
            if (simdi - (x.t || 0) > 3 * 86400000) { delete g.son[id]; degisti = true; }
        }
        while (g.olay.length > 200) g.olay.shift();
        if (degisti) chrome.storage.local.set({ mercGecmis: g });
    });
}
chrome.storage.onChanged.addListener((d, alan) => {
    if (alan !== 'local' || !(d.mercenariesData || d.usolMercenariesData || d.mercConfigData)) return;
    clearTimeout(mercIzleZaman);
    mercIzleZaman = setTimeout(mercIzle, 4000);
});
setTimeout(mercIzle, 20000);

let tekrarZaman = null;
function tekrarKur() {
    clearTimeout(tekrarZaman);
    chrome.storage.local.get(['mercenariesData', 'usolMercenariesData'], (r) => {
        const simdi = Date.now();
        let en = simdi + 5 * 60000;
        for (const d of [r.mercenariesData, r.usolMercenariesData]) for (const m of (d && d.mercenaries) || []) {
            const t = Date.parse(m.restUntil || '');
            if (t > simdi && t < en) en = t;
        }
        tekrarZaman = setTimeout(tekrarDene, Math.max(20000, en - simdi + 15000));
    });
}
function tekrarDene() {
    chrome.storage.sync.get('autoSendMerc', (s) => {
        const m = s.autoSendMerc || {};
        if (m.enabled && !autoSendInProgress && !getAutomationActive()) {
            chrome.storage.local.get('expeditionsData', (r) => {
                const e = r.expeditionsData || [];
                if (!e.some((x) => x.status !== 'COMPLETED' && x.status !== 'FAILED') || e.some((x) => x.status === 'COMPLETED' && !x.completedAt)) {
                    console.log('[COR3 Helper] Auto-send: periodic re-check (merc rest over / nothing sent)');
                    checkAutoSendOnExpeditionData(e);
                }
            });
        }
        tekrarKur();
    });
}
chrome.storage.onChanged.addListener((d, alan) => {
    if (alan === 'local' && (d.mercenariesData || d.usolMercenariesData)) tekrarKur();
});
setTimeout(tekrarKur, 30000);
let bekciIlk = 0;
setInterval(() => {
    const ak = getAutomationActive();
    const takili = autoSendInProgress || (ak && ak.type === 'auto-send');
    if (!takili) { bekciIlk = 0; return; }
    const bas = ak && ak.type === 'auto-send' ? ak.startedAt : 0;
    if (!bekciIlk) bekciIlk = bas || Date.now();
    if (Date.now() - bekciIlk < 240000) return;
    console.log('[COR3 Helper] Auto-send: stuck over 4 min — resetting');
    bekciIlk = 0;
    autoSendInProgress = false;
    autoSendAwaitingMercenaries = false;
    autoSendAwaitingUsolMercs = false;
    autoSendExpeditionId = null;
    autoSendDeferredWaiting = false;
    if (ak && ak.type === 'auto-send') _automationFinish('auto-send');
    else if (!ak) import('./helpers.js').then(m => m._automationProcessNext());
}, 30000);
setTimeout(ganimetSat, 90000);

// Helper: sell cheapest sellable items to free up `count` stash slots
export function autoSellCheapestItems(items, count, callback) {
    if (!items || count <= 0) { if (callback) callback(); return; }
    const sellable = items
        .filter(i => i.canSell && i.sellPrice && i.sellPrice > 0 && GOREV_AD[esyaAd(i.name)] === undefined)
        .sort((a, b) => a.sellPrice - b.sellPrice);
    const toSell = sellable.slice(0, Math.max(count, 1));
    if (toSell.length === 0) {
        console.log('[COR3 Helper] Auto-sell: no sellable items found');
        if (callback) callback();
        return;
    }
    console.log('[COR3 Helper] Auto-sell: selling', toSell.length, 'item(s):', toSell.map(i => i.name + ' (' + i.sellPrice + ')').join(', '));
    let idx = 0;
    function sellNext() {
        if (idx >= toSell.length) { if (callback) callback(); return; }
        const item = toSell[idx++];
        window.postMessage({ type: 'COR3_SELL_ITEM', itemId: item.id, quantity: 1, skipStashRefresh: true }, '*');
        setTimeout(sellNext, 1200 + Math.floor(Math.random() * 300));
    }
    sellNext();
}

// Helper: disable auto-send mercenary due to full stash
export function disableAutoSendDueToStashFull() {
    chrome.storage.sync.get('autoSendMerc', (settings) => {
        if (settings.autoSendMerc) {
            chrome.storage.sync.set({
                autoSendMerc: {
                    ...settings.autoSendMerc,
                    enabled: false,
                    disabledReason: 'stash_full'
                }
            });
        }
    });
    window.postMessage({
        type: 'COR3_STASH_FULL_WARNING',
        message: 'Stash is full. Clear stash before claiming more items. Auto-send mercenary disabled.'
    }, '*');
    setTimeout(() => window.postMessage({ type: 'COR3_REQUEST_STASH' }, '*'), 3000);
    autoSendInProgress = false;
    _automationFinish('auto-send');
    autoSendExpeditionId = null;
}

let autoSendGunlukOnay = false;
let autoSendGunlukLog = null;

export function checkAutoSendOnExpeditionData(expeditions) {
    if (!expeditions || !Array.isArray(expeditions) || autoSendInProgress) return;
    if (!_initialFetchDone) {
        console.log('[COR3 Helper] Auto-send: deferred — initial data fetch still in progress');
        return;
    }
    if (autoSendExpeditionBlocked) {
        var hasActive = expeditions.some(e => e.status !== 'COMPLETED' && e.status !== 'FAILED');
        if (hasActive) {
            console.log('[COR3 Helper] Auto-send: still blocked — active expedition in progress');
            return;
        }
        console.log('[COR3 Helper] Auto-send: active expedition finished — unblocking');
        autoSendExpeditionBlocked = false;
        chrome.storage.local.remove('autoSendExpeditionBlocked');
    }
    const _automationActive = getAutomationActive();
    const _automationQueue = getAutomationQueue();
    if (_automationActive && _automationActive.type !== 'auto-send') {
        if (!_automationQueue.some(q => q.type === 'auto-send')) {
            console.log('[COR3 Helper] Auto-send: queued (waiting for', _automationActive.type, 'to finish)');
            _automationQueue.push({ type: 'auto-send', run: function () {
                chrome.storage.local.get('expeditionsData', (result) => {
                    setAutomationActive(null);
                    if (result.expeditionsData) {
                        checkAutoSendOnExpeditionData(result.expeditionsData);
                        setTimeout(() => { if (!getAutomationActive() && !autoSendInProgress) import('./helpers.js').then(m => m._automationProcessNext()); }, 5000);
                    } else {
                        import('./helpers.js').then(m => m._automationProcessNext());
                    }
                });
            }});
            _broadcastQueueStatus();
        } else {
            console.log('[COR3 Helper] Auto-send: already queued (waiting for', _automationActive.type, ')');
        }
        return;
    }
    chrome.storage.sync.get('autoSendMerc', (settings) => {
        if (!settings.autoSendMerc || !settings.autoSendMerc.enabled) return;
        if (!settings.autoSendMerc.mercenaryId && !settings.autoSendMerc.autoChooseMerc) return;

        const hasActiveExpeditions = expeditions.some(e => !e.completedAt && e.status !== 'FAILED');
        if (!hasActiveExpeditions) {
            const sinirsiz = !!settings.autoSendMerc.sinirsiz;
            const sinir = sinirsiz ? 0 : (settings.autoSendMerc.gunluk ?? 2);
            if (sinir > 0 || sinirsiz) {
                const bugun = new Date().toLocaleDateString('sv-SE');
                chrome.storage.local.get(['expGunluk', 'bakiyeSon', 'marketData'], (r) => {
                    const eg = r.expGunluk && r.expGunluk.gun === bugun ? r.expGunluk : { gun: bugun, n: 0 };
                    if (sinirsiz) {
                        const ws = r.bakiyeSon && typeof r.bakiyeSon.v === 'number' ? r.bakiyeSon : null;
                        const mk = r.marketData && typeof r.marketData.userCredits === 'number' ? r.marketData.userCredits : null;
                        const bakiye = ws ? ws.v : mk;
                        const alt = settings.autoSendMerc.paraAlt ?? 20000;
                        if (bakiye === null || bakiye < alt) {
                            const k = bugun + '|' + Math.floor(Date.now() / 3600000);
                            if (autoSendGunlukLog !== k) { autoSendGunlukLog = k; console.log('[COR3 Helper] Auto-send: balance', bakiye, 'below reserve', alt, '— waiting'); }
                            return;
                        }
                    } else if (eg.n >= sinir) {
                        if (!autoSendGunlukLog || autoSendGunlukLog !== bugun) { autoSendGunlukLog = bugun; console.log('[COR3 Helper] Auto-send: daily limit reached (' + eg.n + '/' + sinir + ')'); }
                        return;
                    }
                    autoSendGunlukOnay = true;
                    checkAutoSendOnExpeditionData(expeditions);
                });
                if (!autoSendGunlukOnay) return;
                autoSendGunlukOnay = false;
            }
            if (!initialMercsReady) {
                if (autoSendDeferredWaiting) {
                    console.log('[COR3 Helper] Auto-send: Already waiting for initial mercs — skipping duplicate deferral');
                    return;
                }
                autoSendDeferredWaiting = true;
                console.log('[COR3 Helper] Auto-send: No active expeditions but initial mercs not ready — deferring');
                function onInitialMercsDone(evt) {
                    if (evt.data && evt.data.type === 'COR3_USOL_MERCS_DONE') {
                        window.removeEventListener('message', onInitialMercsDone);
                        clearTimeout(deferTimeout);
                        autoSendDeferredWaiting = false;
                        console.log('[COR3 Helper] Auto-send: Initial mercs now ready — re-checking expeditions');
                        initialMercsReady = true;
                        chrome.storage.local.get('expeditionsData', (result) => {
                            if (result.expeditionsData) {
                                checkAutoSendOnExpeditionData(result.expeditionsData);
                            }
                        });
                    }
                }
                window.addEventListener('message', onInitialMercsDone);
                var deferTimeout = setTimeout(() => {
                    window.removeEventListener('message', onInitialMercsDone);
                    autoSendDeferredWaiting = false;
                    initialMercsReady = true;
                    console.log('[COR3 Helper] Auto-send: Deferred merc wait timed out — proceeding');
                    chrome.storage.local.get('expeditionsData', (result) => {
                        if (result.expeditionsData) {
                            checkAutoSendOnExpeditionData(result.expeditionsData);
                        }
                    });
                }, 60000);
                return;
            }
            console.log('[COR3 Helper] Auto-send: No active expeditions, refreshing mercs (CORE + USOL) before launch');
            autoSendInProgress = true;
            if (!getAutomationActive()) setAutomationActive({ type: 'auto-send', startedAt: Date.now() });
            _broadcastQueueStatus();
            autoSendExpeditionId = null;
            autoSendAwaitingMercenaries = false;
            autoSendAwaitingUsolMercs = true;
            var mercDelay = 2500 + Math.floor(Math.random() * 1000);
            setTimeout(() => {
                if (!autoSendInProgress || (getAutomationActive() && getAutomationActive().type !== 'auto-send')) {
                    console.log('[COR3 Helper] Auto-send: merc refresh skipped (no longer active or another automation took over)');
                    return;
                }
                window.postMessage({ type: 'COR3_REQUEST_MERCENARIES' }, '*');
            }, mercDelay);
            return;
        }

        // Look for a COMPLETED expedition that hasn't been fully collected yet
        for (const exp of expeditions) {
            if (exp.status === 'COMPLETED' && !exp.completedAt) {
                autoSendInProgress = true;
                if (!getAutomationActive()) setAutomationActive({ type: 'auto-send', startedAt: Date.now() });
                _broadcastQueueStatus();
                autoSendExpeditionId = exp.id;
                if (!exp.containerOpenedAt) {
                    console.log('[COR3 Helper] Auto-send: Detected COMPLETED expedition:', exp.id, '- opening container in 10s');
                    setTimeout(() => {
                        window.postMessage({ type: 'COR3_OPEN_CONTAINER', expeditionId: exp.id }, '*');
                    }, 10000 + Math.floor(Math.random() * 500));
                } else {
                    console.log('[COR3 Helper] Auto-send: Detected COMPLETED expedition:', exp.id, '- container already open, collecting in 10s');
                    setTimeout(() => {
                        window.postMessage({ type: 'COR3_COLLECT_ALL', expeditionId: exp.id }, '*');
                    }, 10000 + Math.floor(Math.random() * 500));
                }
                return; // process one at a time
            }
        }
    });
}

export function proceedWithMerc(mercId, allMercs, settings, localData) {
    if (!mercId) {
        console.log('[COR3 Helper] Auto-send: no mercenary selected, aborting');
        autoSendInProgress = false;
        _automationFinish('auto-send');
        return;
    }
    const selectedMerc = allMercs.find(m => m.id === mercId);
    if (!selectedMerc || selectedMerc.status !== 'AVAILABLE') {
        console.log('[COR3 Helper] Auto-send: selected mercenary not AVAILABLE (status: ' + (selectedMerc ? selectedMerc.status : 'not found') + '), aborting');
        autoSendInProgress = false;
        _automationFinish('auto-send');
        return;
    }
    const isUsol = selectedMerc._market === 'usol' || (selectedMerc.faction && selectedMerc.faction.key === 'usol_employment');
    const configKey = isUsol ? 'usolExpeditionConfigData' : 'expeditionConfigData';
    const marketId = isUsol ? '019e4065-6ae8-760d-8724-58ab4f2cf7d7' : '019d3ea4-85bd-7389-904d-8f7c85841134';
    const config = localData[configKey];
    if (!config || !config.locations || config.locations.length === 0) {
        console.log('[COR3 Helper] Auto-send: no expedition config available for ' + (isUsol ? 'USOL' : 'CORE') + ', aborting');
        autoSendInProgress = false;
        _automationFinish('auto-send');
        return;
    }
    const DEFAULT_LOCATION_NAMES = ['Skylift Remains', 'Koute Mining and Reprocessing Outpost'];
    let loc = config.locations.find(l => DEFAULT_LOCATION_NAMES.includes(l.name));
    if (!loc) loc = config.locations[0];
    const zone = loc.zones && loc.zones[0] ? loc.zones[0] : null;
    const goal = zone && zone.goals && zone.goals[0] ? zone.goals[0] : null;
    if (!zone || !goal) {
        console.log('[COR3 Helper] Auto-send: missing zone/goal config, aborting');
        autoSendInProgress = false;
        _automationFinish('auto-send');
        return;
    }
    const launchConfig = {
        mercenaryId: mercId,
        marketId: marketId,
        locationConfigId: loc.id,
        zoneConfigId: zone.id,
        goalId: goal.id,
        hasInsurance: false
    };
    console.log('[COR3 Helper] Auto-send: launching expedition with mercenary:', selectedMerc.callsign, '(' + (isUsol ? 'USOL' : 'CORE') + ')');
    setTimeout(() => {
        chrome.storage.local.set({ lastExpeditionLaunchData: launchConfig });
        const bugun = new Date().toLocaleDateString('sv-SE');
        chrome.storage.local.get('expGunluk', (r) => {
            const eg = r.expGunluk && r.expGunluk.gun === bugun ? r.expGunluk : { gun: bugun, n: 0 };
            chrome.storage.local.set({ expGunluk: { gun: bugun, n: eg.n + 1, son: Date.now() } });
        });
        window.postMessage({ type: 'COR3_LAUNCH_EXPEDITION', config: launchConfig }, '*');
        autoSendExpeditionBlocked = true;
        chrome.storage.local.set({ autoSendExpeditionBlocked: true });
        autoSendInProgress = false;
        _automationFinish('auto-send');
    }, 1500 + Math.floor(Math.random() * 500));
}
