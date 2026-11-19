import { wsSend, joinRoomNow } from './ws-send.js';

var acik = false;
var zamanlayici = null;
var secenek = null;
var aktif = null;
var son = { claim: 0, repair: 0, launch: 0, karar: 0, join: 0 };
var cozulen = {};
var SAKLA = 'cor3DroneSon';

function gonder(action, data) {
    wsSend('42' + JSON.stringify(['event', { event: { name: 'drone-missions', action: action }, data: data || {} }]));
}

function durumYaz() {
    try { window.postMessage({ type: 'COR3_DRONE_DURUM', durum: { t: Date.now(), secenek: secenek, aktif: aktif } }, '*'); } catch (x) {}
}

function sor() {
    if (Date.now() - son.join > 600000) { son.join = Date.now(); joinRoomNow('drone-missions'); }
    setTimeout(function () { gonder('get.options'); }, 1500);
    setTimeout(function () { gonder('get.active'); }, 3500);
}

function kurZaman() {
    if (acik) setTimeout(sor, 6000);
}
setTimeout(sor, 20000);
zamanlayici = setInterval(sor, 180000);

window.addEventListener('message', function (e) {
    if (e.source !== window || !e.data) return;
    if (e.data.type === 'COR3_DRONE_AYAR') {
        var yeni = !!e.data.acik;
        if (yeni === acik) return;
        acik = yeni;
        console.log('[COR3 Helper] Drone: auto relaunch ' + (acik ? 'on' : 'off'));
        kurZaman();
        return;
    }
    if (e.data.type === 'COR3_WS_LOG' && e.data.direction === 'sent' && typeof e.data.message === 'string' && e.data.message.indexOf('drone-missions') > 0 && e.data.message.indexOf('"launch"') > 0) {
        try {
            var p = JSON.parse(e.data.message.substring(2));
            var d = p[1] && p[1].data;
            if (d && d.locationConfigId && d.missionConfigId) localStorage.setItem(SAKLA, JSON.stringify({ locationConfigId: d.locationConfigId, missionConfigId: d.missionConfigId }));
        } catch (x) {}
    }
});

function hedefSec(o) {
    var loc = o.locations || [];
    var s = null;
    try { s = JSON.parse(localStorage.getItem(SAKLA) || 'null'); } catch (x) {}
    if (!s && aktif && aktif.location && aktif.mission) s = { locationConfigId: aktif.location.id, missionConfigId: aktif.mission.id };
    if (s) {
        var l = loc.find(function (x) { return x.id === s.locationConfigId; });
        var m = l && (l.missions || []).find(function (x) { return x.id === s.missionConfigId; });
        if (m) return { l: l, m: m };
    }
    for (var i = 0; i < loc.length; i++) if ((loc[i].missions || []).length) return { l: loc[i], m: loc[i].missions[0] };
    return null;
}

function kararVer(a) {
    if (!a || a.status !== 'RUNNING' || Date.now() - son.karar < 5000) return false;
    var ev = (a.channelEvents || []).slice(0, a.deliveredEventCount || 0);
    var cozuldu = {};
    (a.resolvedEvents || []).forEach(function (r) { cozuldu[r.eventId] = 1; });
    for (var i = 0; i < ev.length; i++) {
        var e = ev[i];
        if ((e.type !== 'DECISION' && e.type !== 'HAZARD') || e.isResolved || cozuldu[e.eventId] || cozulen[e.eventId]) continue;
        var ops = (e.options || []).filter(function (o) { return !o.requiredModuleId; });
        if (!ops.length) continue;
        ops.sort(function (x, y) {
            var rx = (x.effect && x.effect.riskDelta) || 0, ry = (y.effect && y.effect.riskDelta) || 0;
            if (rx !== ry) return rx - ry;
            return ((y.effect && y.effect.lootDelta) || 0) - ((x.effect && x.effect.lootDelta) || 0);
        });
        cozulen[e.eventId] = 1;
        son.karar = Date.now();
        console.log('[COR3 Helper] Drone: decision "' + (e.message || e.eventId) + '" -> ' + (ops[0].label || ops[0].id));
        setTimeout(function (mid, eid, oid) { gonder('resolve.event', { missionId: mid, eventId: eid, optionId: oid }); }, 1500 + Math.floor(Math.random() * 2000), a.id, e.eventId, ops[0].id);
        return true;
    }
    return false;
}

function karar() {
    if (!acik || !secenek) return;
    var simdi = Date.now();
    if (aktif && aktif.status === 'COMPLETED') {
        if ((aktif.loot || []).some(function (x) { return !x.claimed; }) && simdi - son.claim > 30000) {
            son.claim = simdi;
            console.log('[COR3 Helper] Drone: mission returned, claiming loot');
            setTimeout(function (mid) { gonder('claim', { missionId: mid }); }, 2000 + Math.floor(Math.random() * 1500), aktif.id);
        }
        return;
    }
    if (aktif && aktif.status !== 'ARCHIVED') { kararVer(aktif); return; }
    if (secenek.activeMissionId) return;
    var dr = secenek.drone;
    var bat = secenek.battery || {};
    if (!dr || dr.isDestroyed || dr.isRepairing) return;
    var hedef = hedefSec(secenek);
    if (!hedef) return;
    var maks = dr.maxDurability || 100;
    if (!(dr.durability > 0)) {
        if (simdi - son.repair > 600000) {
            son.repair = simdi;
            console.log('[COR3 Helper] Drone: durability ' + dr.durability + ', repairing to ' + maks);
            setTimeout(function () { gonder('repair', { targetDurability: maks }); }, 1500 + Math.floor(Math.random() * 1500));
        }
        return;
    }
    if (!(bat.current >= (hedef.m.batteryCost || 0))) return;
    if (simdi - son.launch < 60000) return;
    son.launch = simdi;
    console.log('[COR3 Helper] Drone: launching ' + hedef.l.name + ' / ' + hedef.m.name + ' (durability ' + dr.durability + ', battery ' + bat.current + ')');
    setTimeout(function () { gonder('launch', { locationConfigId: hedef.l.id, missionConfigId: hedef.m.id }); }, 2500 + Math.floor(Math.random() * 2500));
}

function nesne(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }

export function droneMesaj(payload) {
    if (!nesne(payload)) return;
    if (payload.error) { if (acik) console.log('[COR3 Helper] Drone error:', JSON.stringify(payload.error)); return; }
    if (!nesne(payload.event)) return;
    var a = payload.event.action;
    var d = payload.data;
    switch (a) {
        case 'get.active': case 'launch': case 'resolve.event':
            aktif = nesne(d) ? d : null; break;
        case 'claim':
            aktif = nesne(d) ? d : null;
            if (acik) setTimeout(function () { gonder('get.options'); }, 2000);
            break;
        case 'get.options': case 'repair': case 'repair.cancel':
            if (nesne(d)) secenek = d; break;
        case 'update':
            if (!nesne(d)) break;
            if (typeof d.missionId === 'string') { if (acik) setTimeout(sor, 1500); }
            else if (secenek && secenek.drone) secenek.drone = Object.assign({}, secenek.drone, { durability: d.durability, isRepairing: false, repairSecondsRemaining: null });
            break;
        case 'event':
            if (nesne(d) && aktif && aktif.id === d.missionId && d.event) {
                var ev = aktif.channelEvents || [];
                if (!ev.some(function (x) { return x.eventId === d.event.eventId; })) ev = ev.concat([d.event]);
                aktif = Object.assign({}, aktif, { channelEvents: ev, deliveredEventCount: Math.min(ev.length, (aktif.deliveredEventCount || 0) + 1) });
            }
            break;
        case 'completed':
            if (nesne(d) && aktif && aktif.id === d.missionId) aktif = Object.assign({}, aktif, { status: d.status || 'COMPLETED', outcome: d.outcome, loot: d.loot });
            if (acik) setTimeout(sor, 3000);
            break;
        case 'loot.expired':
            if (acik) setTimeout(sor, 3000);
            break;
        default:
            return;
    }
    durumYaz();
    if (acik) setTimeout(karar, 500);
}
