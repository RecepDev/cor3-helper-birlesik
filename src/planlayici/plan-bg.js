importScripts('background.js');

chrome.runtime.onMessage.addListener((m, sender, cevap) => {
    if (!m || !m.planRelay || !sender.tab) return;
    chrome.tabs.sendMessage(sender.tab.id, m.planRelay, (r) => {
        cevap({ ok: !chrome.runtime.lastError, r: r || null, hata: chrome.runtime.lastError ? chrome.runtime.lastError.message : null });
    });
    return true;
});
