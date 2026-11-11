import { wsSend, joinRoomNow } from './ws-send.js';

var acik = false;
var sonAlim = 0;
var zamanlayici = null;

function durumSor() {
    if (!acik) return;
    joinRoomNow('mail');
    setTimeout(function () {
        wsSend('42["event",{"event":{"name":"mail","action":"get.state"},"data":{}}]');
    }, 1500);
}

window.addEventListener('message', function (e) {
    if (e.source !== window || !e.data || e.data.type !== 'COR3_MAIL_AYAR') return;
    var yeni = !!e.data.acik;
    if (yeni === acik) return;
    acik = yeni;
    if (zamanlayici) { clearInterval(zamanlayici); zamanlayici = null; }
    if (acik) {
        setTimeout(durumSor, 5000);
        zamanlayici = setInterval(durumSor, 300000);
    }
});

export function mailMesaj(payload) {
    if (!payload || !payload.event) return;
    var a = payload.event.action;
    if (a === 'claim.all') {
        window.postMessage({ type: 'COR3_WS_MAIL_ALINDI', data: payload.data || null, error: payload.error || null }, '*');
        return;
    }
    if (!acik || (a !== 'get.state' && a !== 'update.state')) return;
    var d = payload.data || {};
    var bekleyen = (Array.isArray(d.messages) ? d.messages : []).filter(function (m) {
        return Array.isArray(m.attachments) && m.attachments.some(function (x) { return x && x.claimedAt == null; });
    }).length;
    if (!bekleyen || Date.now() - sonAlim < 20000) return;
    sonAlim = Date.now();
    console.log('[COR3 Helper] Mail: claiming all (' + bekleyen + ' message(s) with items)');
    setTimeout(function () {
        wsSend('42["event",{"event":{"name":"mail","action":"claim.all"},"data":{}}]');
    }, 800 + Math.floor(Math.random() * 1200));
}
