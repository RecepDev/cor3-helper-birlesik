import { isContextValid, _automationEnqueue, _automationFinish, getAutomationActive, getAutomationQueue } from './helpers.js';
import { injectAutoValuableSeller } from './solvers.js';

const ARALIK = 30 * 60 * 1000;
const ZAMAN_ASIMI = 40 * 60 * 1000;
let calisiyor = false;
let sonDeneme = 0;

function bitti(ozet) {
    calisiyor = false;
    try { chrome.storage.local.set({ otoHackSon: { ...(ozet || {}), bit: (ozet && ozet.bit) || Date.now() } }); } catch (e) {}
    _automationFinish('auto-hack');
}

function baslat() {
    _automationEnqueue('auto-hack', () => {
        calisiyor = true;
        injectAutoValuableSeller();
        const sure = setTimeout(() => { window.removeEventListener('message', dinle); window.postMessage({ type: 'COR3_VALUABLE_STOP' }, '*'); bitti({ hata: 'zaman aşımı' }); }, ZAMAN_ASIMI);
        function dinle(e) {
            if (e.source !== window || !e.data || e.data.type !== 'COR3_VALUABLE_HACKALL_DONE') return;
            window.removeEventListener('message', dinle);
            clearTimeout(sure);
            bitti(e.data.ozet);
        }
        window.addEventListener('message', dinle);
        setTimeout(() => window.postMessage({ type: 'COR3_VALUABLE_START_HACKALL' }, '*'), 500);
    });
}

function kontrol() {
    if (window.top !== window || calisiyor || !isContextValid()) return;
    if (getAutomationActive() || getAutomationQueue().length) return;
    if (Date.now() - sonDeneme < 60000) return;
    try {
        chrome.storage.local.get(['otoHackAcik', 'otoHackSon', 'durum', 'ayar', 'planMesgul', 'planAyar'], (r) => {
            if (!r.otoHackAcik || r.planMesgul) return;
            chrome.storage.sync.get('autoFinishAllJobsEnabled', (sy) => {
            if (!(r.planAyar && r.planAyar.acik) && !(sy && sy.autoFinishAllJobsEnabled)) return;
            const d = r.durum || {};
            if (r.ayar && r.ayar.acik && d.macta && d.mac && !d.mac.bitti) return;
            const son = (r.otoHackSon && (r.otoHackSon.bit || r.otoHackSon.bas)) || 0;
            if (Date.now() - son < ARALIK) return;
            if (getAutomationActive() || getAutomationQueue().length || calisiyor) return;
            sonDeneme = Date.now();
            baslat();
            });
        });
    } catch (e) {}
}

setTimeout(kontrol, 90000);
setInterval(kontrol, 60000);
