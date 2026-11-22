import { _safeSetHtml } from './dom-helpers.js';

const kutu = document.getElementById('kararGecmisContainer');
const turSec = document.getElementById('kararGecmisTur');
const ara = document.getElementById('kararGecmisAra');
const sayi = document.getElementById('kararGecmisSayi');
let goster = 30;
let veri = { drone: [], asker: [], sonuc: {} };

const esc = (v) => String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const tarih = (t) => { const d = new Date(t); return isNaN(d) ? '--' : d.toLocaleString([], { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); };
const sayiYaz = (n, carp) => { const v = Math.round(n * carp * 10) / 10; return (v > 0 ? '+' : '') + v; };
const sonucAd = { FULL_SUCCESS: 'Full', PARTIAL_SUCCESS: 'Partial', FAIL: 'Fail', CRITICAL_FAIL: 'Critical' };

try { const k = localStorage.getItem('kararGecmisTur'); if (k !== null && turSec) turSec.value = k; } catch (x) {}

function ciz() {
    if (!kutu) return;
    const tur = turSec ? turSec.value : '';
    const q = (ara && ara.value || '').trim().toLowerCase();
    let l = [...veri.drone, ...veri.asker].filter((x) => x && (!tur || x.tur === tur));
    if (q) l = l.filter((x) => [x.mesaj, x.yer, x.gorev, x.asker, x.drone, ...(x.secenekler || []).map((o) => o.ad)].join(' ').toLowerCase().includes(q));
    l.sort((a, b) => b.t - a.t);
    if (sayi) sayi.textContent = l.length ? `(${l.length})` : '';
    if (!l.length) { _safeSetHtml(kutu, '<div class="no-decisions">No decisions recorded yet.</div>'); return; }
    let h = '';
    for (const k of l.slice(0, goster)) {
        const drone = k.tur === 'drone';
        const carp = drone ? 100 : 1;
        const sonuc = veri.sonuc[k.gorevId];
        let et = drone ? '<span class="kg-etiket">Drone</span>' : '<span class="kg-etiket">Merc</span>';
        if (drone) et += k.oto ? (k.riskli ? '<span class="kg-etiket riskli">auto · risky</span>' : '<span class="kg-etiket">auto · safe</span>') : k.oto === false ? '<span class="kg-etiket">manual</span>' : '';
        else if (k.sureDoldu) et += '<span class="kg-etiket">expired</span>';
        const kim = drone ? (k.drone || 'Drone') + ' — ' + (k.yer || '') : (k.asker || '?') + ' — ' + (k.yer || '');
        h += `<div class="kg-kart"><div class="kg-ust"><span>${esc(kim)}${et}</span><span>${sonuc ? `<span class="kg-sonuc-${esc(sonuc)}">${esc(sonucAd[sonuc] || sonuc)}</span> · ` : ''}${tarih(k.t)}</span></div>`;
        h += `<div class="kg-mesaj">${esc(k.mesaj)}</div>`;
        for (const o of k.secenekler || []) {
            const s = o.id === k.secilen;
            h += `<div class="kg-sec${s ? ' secildi' : ''}"><span>${esc(o.ad)}${s ? ' ✓' : ''}${o.modul ? ' <span class="kg-etiket">module</span>' : ''}</span><span><span class="stat-risk">Risk ${sayiYaz(o.risk, carp)}</span> · <span class="stat-loot">Loot ${sayiYaz(o.loot, carp)}</span></span></div>`;
        }
        h += '</div>';
    }
    if (l.length > goster) h += `<div class="kg-daha" id="kararGecmisDaha">Show more (${l.length - goster})</div>`;
    _safeSetHtml(kutu, h);
    const d = document.getElementById('kararGecmisDaha');
    if (d) d.addEventListener('click', () => { goster += 30; ciz(); });
}

export async function loadKararGecmis() {
    const { droneKarar, askerKarar, droneGecmis, archivedExpeditionsData } = await chrome.storage.local.get(['droneKarar', 'askerKarar', 'droneGecmis', 'archivedExpeditionsData']);
    const sonuc = {};
    for (const m of droneGecmis || []) if (m && m.id && m.outcome) sonuc[m.id] = m.outcome;
    const arsiv = Array.isArray(archivedExpeditionsData) ? archivedExpeditionsData : ((archivedExpeditionsData && (archivedExpeditionsData.expeditions || archivedExpeditionsData.items)) || []);
    for (const e of arsiv) if (e && e.id && (e.outcome || e.result)) sonuc[e.id] = e.outcome || e.result;
    veri = { drone: droneKarar || [], asker: askerKarar || [], sonuc };
    ciz();
}

if (turSec) turSec.addEventListener('change', () => { try { localStorage.setItem('kararGecmisTur', turSec.value); } catch (x) {} goster = 30; ciz(); });
if (ara) ara.addEventListener('input', () => { goster = 30; ciz(); });
chrome.storage.onChanged.addListener((c, alan) => {
    if (alan === 'local' && (c.droneKarar || c.askerKarar || c.droneGecmis || c.archivedExpeditionsData)) loadKararGecmis();
});
loadKararGecmis();
