import { _noData, _safeSetHtml } from './dom-helpers.js';

const toggle = document.getElementById('droneEkoSectionToggle');
const govde = document.getElementById('droneEkoSectionBody');
const kutu = document.getElementById('droneEkoContainer');

if (toggle && govde) {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        govde.classList.toggle('open');
    });
}

const adNorm = (n) => String(n || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const esc = (v) => String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cr = (n) => Math.round(n).toLocaleString() + ' CR';
const tarih = (t) => { const d = new Date(t); return isNaN(d) ? '--' : d.toLocaleString([], { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); };
const renk = (n) => n > 0 ? 'var(--accent-green)' : n < 0 ? 'var(--accent-red)' : 'var(--text-dim)';
const isaret = (n) => (n > 0 ? '+' : '') + cr(n);

export function droneHesapla(gecmis, satis, durum) {
    const rate = (durum && durum.secenek && durum.secenek.repairRate && durum.secenek.repairRate.creditsPerPoint) || 200;
    const seferler = gecmis.filter((m) => m && m.bas && m.status !== 'RUNNING').slice().sort((a, b) => new Date(a.bas) - new Date(b.bas));
    const kalan = (satis || []).filter((x) => /DRONE/i.test(x.kaynak || '')).map((x) => ({ ...x, n: adNorm(x.ad), kal: x.adet || 1 })).sort((a, b) => a.t - b.t);
    const kalemler = [];
    for (const m of seferler) {
        m._gelir = 0; m._satilan = 0; m._kalan = 0;
        const bas = new Date(m.bas).getTime();
        for (const it of m.loot || []) { const k = { m, bas, n: adNorm(it.ad), ist: it.adet || 1 }; kalemler.push(k); }
    }
    for (const s of kalan) {
        while (s.kal > 0) {
            let en = null;
            for (const k of kalemler) if (k.ist > 0 && k.n === s.n && k.bas <= s.t && (!en || k.bas > en.bas)) en = k;
            if (!en) break;
            const al = Math.min(s.kal, en.ist);
            s.kal -= al; en.ist -= al;
            en.m._gelir += al * (s.fiyat || 0);
            en.m._satilan += al;
        }
    }
    for (const k of kalemler) k.m._kalan += k.ist;
    const donguler = [];
    let cur = { tamir: 0, puan: 0, seferler: [] };
    let onceki = null;
    for (const m of seferler) {
        const d = typeof m.dayanik === 'number' ? m.dayanik : null;
        if (onceki !== null && d !== null && d > onceki) { cur.tamir += (d - onceki) * rate; cur.puan += d - onceki; }
        cur.seferler.push(m);
        onceki = d !== null && typeof m.hasar === 'number' ? Math.max(0, d - m.hasar) : null;
        m._son = onceki;
        if (onceki === 0) { cur.bitti = true; donguler.push(cur); cur = { tamir: 0, puan: 0, seferler: [] }; }
    }
    const dr = durum && durum.secenek && durum.secenek.drone;
    let simdi = null;
    if (dr) {
        simdi = (dr.repair && dr.repair.targetDurability) || dr.durability;
        const aktifYeni = durum.aktif && durum.aktif.status === 'RUNNING' && !seferler.some((m) => m.id === durum.aktif.id);
        if (!aktifYeni && onceki !== null && typeof simdi === 'number' && simdi > onceki) { cur.tamir += (simdi - onceki) * rate; cur.puan += simdi - onceki; }
    }
    if (cur.seferler.length || cur.tamir) donguler.push(cur);
    for (const c of donguler) {
        c.gelir = c.seferler.reduce((t, m) => t + m._gelir, 0);
        c.net = c.gelir - c.tamir;
        c.say = { FULL: 0, PARTIAL: 0, FAIL: 0 };
        for (const m of c.seferler) { const o = String(m.outcome || ''); if (o.includes('PARTIAL')) c.say.PARTIAL++; else if (o.includes('FAIL')) c.say.FAIL++; else c.say.FULL++; }
    }
    return { donguler, rate, simdi, maks: (dr && dr.maxDurability) || 100 };
}

function satir(ad, deger, stil) {
    return `<div style="display:flex;justify-content:space-between;font-size:10px;margin:1px 0;"><span style="color:var(--text-dim);">${ad}</span><span style="${stil || ''}">${deger}</span></div>`;
}

function seferSatiri(m) {
    const o = String(m.outcome || m.status || '');
    const sinif = o.includes('PARTIAL') ? 'outcome-partial' : o.includes('FAIL') ? 'outcome-fail' : 'outcome-full';
    const dur = typeof m.dayanik === 'number' ? `${m.dayanik}→${m._son ?? '?'}` : '';
    const esya = (m.loot || []).map((x) => esc(x.ad)).join(', ') || 'No loot';
    return `<div style="font-size:10px;margin:3px 0;border-top:1px solid var(--border-color,rgba(255,255,255,.08));padding-top:3px;">`
        + `<div style="display:flex;justify-content:space-between;gap:6px;"><span>${tarih(m.bas)} <span class="outcome-tag ${sinif}" style="font-size:8px;">${esc(o.replace('_SUCCESS', ''))}</span> <span style="color:var(--text-dim);">${dur}</span></span>`
        + `<span style="color:${m._gelir > 0 ? 'var(--accent-orange)' : 'var(--text-dim)'};">${m._gelir > 0 ? cr(m._gelir) : '-'}</span></div>`
        + `<div style="color:var(--text-dim);font-size:9px;">${esya}${m._kalan > 0 ? ` · ${m._kalan} not sold` : ''}</div></div>`;
}

export async function loadDroneEkonomi() {
    if (!kutu) return;
    const { droneGecmis, droneArsiv, ganimetSatis, droneDurum } = await chrome.storage.local.get(['droneGecmis', 'droneArsiv', 'ganimetSatis', 'droneDurum']);
    const harita = new Map((droneGecmis || []).map((x) => [x.id, x]));
    for (const x of (droneArsiv && droneArsiv.liste) || []) if (x && x.id && x.status !== 'RUNNING') harita.set(x.id, x);
    const gecmis = [...harita.values()].map((x) => ({ ...x }));
    if (!gecmis.length) { kutu.replaceChildren(_noData('No drone runs yet.')); return; }
    const { donguler, rate, simdi, maks } = droneHesapla(gecmis, ganimetSatis, droneDurum);
    const top = donguler.reduce((t, c) => ({ sefer: t.sefer + c.seferler.length, gelir: t.gelir + c.gelir, tamir: t.tamir + c.tamir }), { sefer: 0, gelir: 0, tamir: 0 });
    const net = top.gelir - top.tamir;
    let html = `<div class="archived-exp-card">`;
    html += `<div class="archived-exp-header"><span class="archived-exp-merc">Total${droneArsiv && droneArsiv.drone ? ' · ' + esc(droneArsiv.drone) : ''}</span><span style="font-weight:bold;color:${renk(net)};">${isaret(net)}</span></div>`;
    html += satir('Runs', `${top.sefer} (${donguler.filter((c) => c.bitti).length} × down to 0)`);
    html += satir('Loot sold', cr(top.gelir), 'color:var(--accent-orange);');
    html += satir('Repairs paid', top.tamir ? '-' + cr(top.tamir) : '0 CR', top.tamir ? 'color:var(--accent-red);' : '');
    html += satir('Net per run', top.sefer ? isaret(net / top.sefer) : '-', `color:${renk(net)};`);
    if (typeof simdi === 'number') html += satir('Durability now', `${simdi}/${maks} · full repair ${cr((maks - simdi) * rate)}`);
    html += `<div style="font-size:9px;color:var(--text-dim);margin-top:3px;">Repair cost from durability gained between runs × ${rate} CR/point.</div>`;
    html += `</div>`;
    donguler.slice().reverse().forEach((c, i) => {
        const no = donguler.length - i;
        const uid = 'droneEko_' + no;
        const ilk = c.seferler[0], son = c.seferler[c.seferler.length - 1];
        html += `<div class="archived-exp-card archived-drone-card">`;
        html += `<div class="archived-exp-header"><span class="archived-exp-merc">Cycle ${no}${c.bitti ? '' : ' · ongoing'}</span><span style="font-weight:bold;color:${renk(c.net)};">${isaret(c.net)}</span></div>`;
        if (ilk) html += `<div class="archived-exp-info">${tarih(ilk.bas)} → ${c.bitti ? tarih(son.bit) + ' (durability 0)' : 'now'}</div>`;
        html += satir('Repair paid', c.tamir ? `-${cr(c.tamir)} (${c.puan} pts)` : (no === 1 ? 'none (new drone)' : '0 CR'), c.tamir ? 'color:var(--accent-red);' : '');
        html += satir('Runs', `${c.seferler.length} · ${c.say.FULL} full, ${c.say.PARTIAL} partial, ${c.say.FAIL} fail`);
        html += satir('Loot sold', `${cr(c.gelir)} (${c.seferler.reduce((t, m) => t + m._satilan, 0)} items)`, 'color:var(--accent-orange);');
        html += satir('Net', isaret(c.net), `color:${renk(c.net)};font-weight:bold;`);
        if (c.seferler.length) {
            html += `<div class="container-items"><div class="expandable-header" data-expand="${uid}"><span class="expand-arrow">▶</span><span class="expand-label">Runs (${c.seferler.length})</span></div>`;
            html += `<div class="expandable-body" id="${uid}">${c.seferler.slice().reverse().map(seferSatiri).join('')}</div></div>`;
        }
        html += `</div>`;
    });
    const sar = document.createElement('div');
    _safeSetHtml(sar, html);
    kutu.replaceChildren(...sar.childNodes);
    kutu.querySelectorAll('.expandable-header[data-expand]').forEach((hdr) => {
        hdr.addEventListener('click', () => {
            hdr.classList.toggle('open');
            const b = document.getElementById(hdr.getAttribute('data-expand'));
            if (b) b.classList.toggle('openExtended');
        });
    });
}

loadDroneEkonomi();
