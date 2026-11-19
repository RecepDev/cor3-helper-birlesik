import {
    log, delay, sendCmd, waitForEvent, humanDelay,
    running, setCachedMapData, invalidateLoadoutCache
} from './state.js';
import { ensureServerAccess } from './server-access.js';
import { getLoadoutData } from './loadout.js';
import { findHackSoftwareForServerType } from '../shared/loadout-resolver.js';

function bitir(ozet) {
    try { localStorage.setItem('cor3OtoHackSon', JSON.stringify(ozet)); } catch (e) { }
    window.postMessage({ type: 'COR3_VALUABLE_HACKALL_DONE', ozet: ozet }, '*');
}

function mesafeler(servers, connections) {
    var komsu = {}, ev = null;
    for (var i = 0; i < servers.length; i++) {
        komsu[servers[i].id] = [];
        if (servers[i].serverTypeName === 'Home' || servers[i].serverName === 'Home Server') ev = servers[i].id;
    }
    for (var j = 0; j < connections.length; j++) {
        var c = connections[j];
        if (komsu[c.serverA] && komsu[c.serverB]) { komsu[c.serverA].push(c.serverB); komsu[c.serverB].push(c.serverA); }
    }
    var d = {};
    if (!ev) return d;
    d[ev] = 0;
    var kuyruk = [ev];
    while (kuyruk.length) {
        var u = kuyruk.shift();
        for (var k = 0; k < komsu[u].length; k++) {
            var v = komsu[u][k];
            if (d[v] === undefined) { d[v] = d[u] + 1; kuyruk.push(v); }
        }
    }
    return d;
}

export async function runHackAll() {
    var ozet = { bas: Date.now(), bit: 0, hacklendi: [], zatenVar: 0, yetmez: [], yazilimYok: [], bakimda: 0, basarisiz: [], hata: null };
    log('=== Auto hack: all servers ===', 'info');
    setCachedMapData(null);
    var harita;
    try {
        sendCmd('get.map', {});
        harita = await waitForEvent('COR3_WS_MAP_DATA', 15000);
    } catch (e) {
        ozet.hata = 'harita alınamadı';
        ozet.bit = Date.now();
        log('Auto hack: network map timeout', 'error');
        return bitir(ozet);
    }
    var servers = Array.isArray(harita.servers) ? harita.servers : [];
    var mesafe = mesafeler(servers, Array.isArray(harita.connections) ? harita.connections : []);

    invalidateLoadoutCache();
    var loadout = await getLoadoutData(true);
    var yazilim = (loadout && loadout.ownedSoftware) || [];

    var adaylar = [];
    for (var i = 0; i < servers.length; i++) {
        var s = servers[i];
        if (s.serverTypeName === 'Home' || mesafe[s.id] === 0) continue;
        if (s.isAccessible || s.hasAdminAccess) { ozet.zatenVar++; continue; }
        if (s.isInMaintenance) { ozet.bakimda++; continue; }
        if (mesafe[s.id] === undefined) continue;
        var def = s.serverDefenceRate || 0;
        if (loadout) {
            var aday = findHackSoftwareForServerType(yazilim, s.serverTypeName);
            if (!aday.length) { ozet.yazilimYok.push(s.serverName); continue; }
            if (def > 0 && aday[0].spec.power[1] < def) { ozet.yetmez.push(s.serverName + ' (' + aday[0].spec.power[1] + '<' + def + ')'); continue; }
        }
        adaylar.push({ id: s.id, ad: s.serverName, m: mesafe[s.id] });
    }
    adaylar.sort(function (a, b) { return a.m - b.m; });
    log('Auto hack: ' + adaylar.length + ' hackable, ' + ozet.zatenVar + ' already accessible, ' + ozet.yetmez.length + ' too strong, ' + ozet.yazilimYok.length + ' no software, ' + ozet.bakimda + ' in maintenance');

    for (var n = 0; n < adaylar.length; n++) {
        if (!running) { ozet.hata = 'durduruldu'; break; }
        if (Date.now() - ozet.bas > 25 * 60000) { ozet.kalan = adaylar.length - n; log('Auto hack: 25 min budget used, ' + ozet.kalan + ' left for next round', 'warn'); break; }
        var a = adaylar[n];
        log('Auto hack ' + (n + 1) + '/' + adaylar.length + ': ' + a.ad);
        var ok = false;
        try { ok = await ensureServerAccess(a.id); } catch (e) { if (e.message === 'Stopped') { ozet.hata = 'durduruldu'; break; } }
        if (ok) ozet.hacklendi.push(a.ad); else ozet.basarisiz.push(a.ad);
        await delay(humanDelay());
    }
    ozet.bit = Date.now();
    log('=== Auto hack done: ' + ozet.hacklendi.length + ' hacked, ' + ozet.basarisiz.length + ' failed ===', 'success');
    bitir(ozet);
}
