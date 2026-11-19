import { _h, _noData, _clearEl, _safeSetHtml } from './dom-helpers.js';
import { getCor3Tab, waitForStorageKey } from './utils.js';
import { refreshAllTimestamps } from './timestamps.js';

const archivedExpSectionToggle = document.getElementById('archivedExpSectionToggle');
const archivedExpSectionBody = document.getElementById('archivedExpSectionBody');
const archivedExpContainer = document.getElementById('archivedExpContainer');
const refreshArchivedBtn = document.getElementById('refreshArchivedBtn');

archivedExpSectionToggle.addEventListener('click', () => {
    archivedExpSectionToggle.classList.toggle('open');
    archivedExpSectionBody.classList.toggle('open');
});

async function requestArchivedExpeditions() {
    archivedExpContainer.replaceChildren(_noData('Loading archived expeditions...'));
    try {
        const tab = await getCor3Tab();
        if (tab) await chrome.tabs.sendMessage(tab.id, { action: "requestArchivedExpeditions" });
    } catch (e) { /* not reachable */ }
    setTimeout(() => loadArchivedExpeditions(), 3000);
}

if (refreshArchivedBtn) {
    refreshArchivedBtn.addEventListener('click', () => requestArchivedExpeditions());
}

export async function loadArchivedExpeditions() {
    const { archivedExpeditionsData, droneArsiv, ganimetSatis } = await chrome.storage.local.get(['archivedExpeditionsData', 'droneArsiv', 'ganimetSatis']);
    renderArchivedExpeditions(archivedExpeditionsData, droneArsiv, ganimetSatis);
    refreshAllTimestamps();
}

const adNorm = (n) => String(n || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function satisEsle(kayitlar, satis) {
    const kalan = (satis || []).map((x) => ({ ...x, n: adNorm(x.ad), kal: x.adet || 1 })).sort((x, y) => x.t - y.t);
    for (const k of kayitlar.slice().sort((x, y) => x.t - y.t)) {
        for (const it of k.esya) {
            it.satilan = 0;
            it.cr = 0;
            if (!k.t) continue;
            const n = adNorm(it.ad);
            for (const s of kalan) {
                if (it.satilan >= it.adet) break;
                if (s.kal <= 0 || s.n !== n || s.t < k.t) continue;
                const al = Math.min(s.kal, it.adet - it.satilan);
                s.kal -= al;
                it.satilan += al;
                it.cr += al * (s.fiyat || 0);
            }
        }
    }
}

function onceText(t) {
    const agoMs = Date.now() - t;
    if (agoMs < 60000) return 'just now';
    if (agoMs < 3600000) return Math.floor(agoMs / 60000) + 'm ago';
    if (agoMs < 86400000) { const h = Math.floor(agoMs / 3600000); const m = Math.floor((agoMs % 3600000) / 60000); return h + 'h' + (m > 0 ? ' ' + m + 'm' : '') + ' ago'; }
    const d = Math.floor(agoMs / 86400000); const h = Math.floor((agoMs % 86400000) / 3600000); return d + 'd' + (h > 0 ? ' ' + h + 'h' : '') + ' ago';
}

const esc = (v) => String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function esyaSatiri(it, ekDurum) {
    const imgTag = it.resim ? `<img src="${esc(it.resim)}" style="width:24px;height:24px;border-radius:4px;vertical-align:middle;margin-right:4px;" loading="lazy">` : '';
    const tierTag = it.tier ? ` <span class="tier-tag tier-tag-${esc(it.tier.toLowerCase())}">${esc(it.tier)}</span>` : '';
    const sat = it.satilan > 0 ? ` <span style="color:var(--accent-orange);font-size:9px;">Sold${it.satilan < it.adet || it.adet > 1 ? ' ' + it.satilan + '/' + it.adet : ''} · ${it.cr.toLocaleString()} CR</span>` : '';
    return `<div style="font-size:10px;margin:2px 0;">${imgTag}${esc(it.ad || '?')}${it.adet > 1 ? ' x' + it.adet : ''}${tierTag}${ekDurum || ''}${sat}</div>`;
}

function esyaBlok(uid, esya, durumFn) {
    if (!esya.length) return '';
    const satToplam = esya.reduce((t, x) => t + (x.cr || 0), 0);
    let html = `<div class="container-items">`;
    html += `<div class="expandable-header" data-expand="${uid}"><span class="expand-arrow">▶</span><span class="expand-label">Loot (${esya.length} items)${satToplam > 0 ? ' · sold ' + satToplam.toLocaleString() + ' CR' : ''}</span></div>`;
    html += `<div class="expandable-body" id="${uid}">`;
    for (const it of esya) html += esyaSatiri(it, durumFn(it));
    html += `</div></div>`;
    return html;
}

function sonucSinif(outcome) {
    if (outcome.includes('PARTIAL')) return 'outcome-partial';
    if (outcome.includes('FAIL')) return 'outcome-fail';
    if (outcome.includes('DEATH')) return 'outcome-death';
    return 'outcome-full';
}

function expHtml(k) {
    const exp = k.exp;
    const factionDisplay = (exp.mercenary && exp.mercenary.faction) ? ((exp.mercenary.faction.name || '').replace('factions.', '').replace(/([A-Z])/g, ' $1').trim().split(" ")[0].toUpperCase()) : 'UNEMPLOYED';
    const mercName = exp.mercenary ? exp.mercenary.callsign : 'Unknown';
    const outcome = (exp.outcome || exp.status || 'COMPLETED').toUpperCase();
    let html = `<div class="archived-exp-header">`;
    html += `<span class="archived-exp-merc">🧑 ${esc(mercName)}</span>`;
    html += `<span class="outcome-tag ${sonucSinif(outcome)}">${esc(outcome)}</span>`;
    html += `</div>`;
    html += `<div class="archived-exp-info">`;
    html += `Faction: <b>${esc(factionDisplay)}</b>`;
    html += `<br>`;
    if ((exp.locationName && exp.zoneName) && (exp.locationName.length + exp.zoneName.length) > 30) {
        html += `📍 ${esc(exp.locationName || '--')} /<br>${esc(exp.zoneName || '--')}`;
    } else {
        html += `📍 ${esc(exp.locationName || '--')} / ${esc(exp.zoneName || '--')}`;
    }
    if (exp.objectiveName) html += ` — ${esc(exp.objectiveName)}`;
    html += `<br>`;
    if (exp.totalCost !== undefined) html += `💰 Cost: ${exp.totalCost.toLocaleString()} · `;
    if (exp.riskScore !== undefined) html += `⚠️ Risk: ${exp.riskScore}`;
    html += `</div>`;
    html += esyaBlok('archived_' + exp.id, k.esya, (it) => it.isCollected ? ' <span style="color:var(--accent-green);font-size:9px;">✓ Collected</span>' : it.isDeleted ? ' <span style="color:var(--accent-red);font-size:9px;">✗ Deleted</span>' : '');
    if (k.t) html += `<span style="font-size:9px;color:var(--text-dim);display:flex;flex-direction:row-reverse;">🕐 Completed ${onceText(k.t)}</span>`;
    return html;
}

function droneHtml(k, droneAd) {
    const m = k.m;
    const outcome = (m.outcome || m.status || 'COMPLETED').toUpperCase();
    let html = `<div class="archived-exp-header">`;
    html += `<span class="archived-exp-merc">Drone${droneAd ? ' ' + esc(droneAd) : ''}</span>`;
    html += `<span class="outcome-tag ${sonucSinif(outcome)}">${esc(outcome)}</span>`;
    html += `</div>`;
    html += `<div class="archived-exp-info">📍 ${esc(m.yer || '--')} / ${esc(m.gorev || '--')}`;
    const ek = [];
    if (typeof m.dayanik === 'number') ek.push('Durability at launch: ' + m.dayanik);
    if (typeof m.hasar === 'number') ek.push('Damage: ' + m.hasar);
    if (ek.length) html += `<br>${ek.join(' · ')}`;
    html += `</div>`;
    if (k.esya.length) html += esyaBlok('drone_' + m.id, k.esya, (it) => it.alindi ? ' <span style="color:var(--accent-green);font-size:9px;">✓ Collected</span>' : '');
    else html += `<div class="archived-exp-info">No loot</div>`;
    if (k.t) html += `<span style="font-size:9px;color:var(--text-dim);display:flex;flex-direction:row-reverse;">🕐 Completed ${onceText(k.t)}</span>`;
    return html;
}

function renderArchivedExpeditions(data, droneArsiv, satis) {
    if (!archivedExpContainer) return;
    _clearEl(archivedExpContainer);

    let items = data;
    if (data && !Array.isArray(data) && data.items) items = data.items;
    if (data && !Array.isArray(data) && data.data) items = data.data;
    if (!Array.isArray(items)) items = [];

    const kayitlar = [];
    for (const exp of items) {
        const rawContainer = exp.containerData || exp.container;
        const containerItems = Array.isArray(rawContainer) ? rawContainer : (rawContainer && Array.isArray(rawContainer.items) ? rawContainer.items : []);
        const esya = containerItems.map((ci) => { const det = ci.item || ci; return { ad: det.name || det.id, adet: det.quantity || ci.quantity || 1, resim: det.imageUrl || det.image || '', tier: det.tier, isCollected: det.isCollected, isDeleted: det.isDeleted }; });
        kayitlar.push({ tip: 'exp', exp, esya, t: exp.completedAt ? new Date(exp.completedAt).getTime() : 0 });
    }
    for (const m of (droneArsiv && droneArsiv.liste) || []) {
        kayitlar.push({ tip: 'drone', m, esya: (m.loot || []).map((x) => ({ ...x })), t: m.bit ? new Date(m.bit).getTime() : 0 });
    }
    if (kayitlar.length === 0) {
        archivedExpContainer.replaceChildren(_noData('No archived expeditions found.'));
        return;
    }
    satisEsle(kayitlar, satis);
    kayitlar.sort((x, y) => y.t - x.t);
    for (const k of kayitlar) {
        const card = document.createElement('div');
        card.className = 'archived-exp-card' + (k.tip === 'drone' ? ' archived-drone-card' : '');
        _safeSetHtml(card, k.tip === 'drone' ? droneHtml(k, droneArsiv && droneArsiv.drone) : expHtml(k));
        archivedExpContainer.appendChild(card);
    }
    archivedExpContainer.querySelectorAll('.expandable-header').forEach(hdr => {
        hdr.addEventListener('click', () => {
            hdr.classList.toggle('open');
            const targetId = hdr.getAttribute('data-expand');
            const body = document.getElementById(targetId);
            if (body) body.classList.toggle('openExtended');
        });
    });
}

export async function refreshArchivedOnly() {
    archivedExpContainer.replaceChildren(_noData('Loading archived expeditions...'));
    try {
        const tab = await getCor3Tab();
        if (tab) await chrome.tabs.sendMessage(tab.id, { action: "requestArchivedExpeditions" });
    } catch (e) {}
    await waitForStorageKey('archivedExpeditionsData', 5000);
    await loadArchivedExpeditions();
    refreshAllTimestamps();
}

loadArchivedExpeditions();
