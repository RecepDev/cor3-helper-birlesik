document.getElementById("tdBotBtn")?.addEventListener("click", async () => {
    const [sekme] = await chrome.tabs.query({ url: ["https://cor3.gg/*", "https://*.cor3.gg/*"] });
    await chrome.storage.local.set({ yanPanel: true });
    if (sekme) {
        await chrome.tabs.update(sekme.id, { active: true });
        if (sekme.windowId) await chrome.windows.update(sekme.windowId, { focused: true });
    }
    window.close();
});
