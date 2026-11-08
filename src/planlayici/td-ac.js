(() => {
    const btn = document.getElementById("tdBotBtn");
    if (!btn) return;
    const st = document.createElement("style");
    st.textContent = `
body.td-gorunum{width:340px!important;padding:0!important;overflow:hidden}
body.td-gorunum.mode-popout,body.td-gorunum.mode-sidepanel{width:auto!important}
body.td-gorunum>*:not(#tdView){display:none!important}
#tdView{display:none}
body.td-gorunum #tdView{display:flex;flex-direction:column}
#tdView .td-ust{display:flex;align-items:center;gap:8px;padding:6px 10px;background:#0d1f27;border-bottom:1px solid #1d4b5a}
#tdView .td-ust button{display:flex;align-items:center;gap:4px;background:none;border:1px solid #1d4b5a;color:#bfe9f5;border-radius:5px;padding:3px 10px 3px 6px;cursor:pointer;font:600 11px system-ui,'Segoe UI',sans-serif}
#tdView .td-ust button:hover{border-color:#76c1d1}
#tdView iframe{border:0;width:100%;height:560px;background:#081419;display:block}
body.td-gorunum.mode-popout #tdView iframe,body.td-gorunum.mode-sidepanel #tdView iframe{height:calc(100vh - 37px)}`;
    document.head.append(st);
    const v = document.createElement("div");
    v.id = "tdView";
    v.innerHTML = '<div class="td-ust"><button id="tdGeri"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#76c1d1" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>COR3 Helper</button></div>';
    document.body.append(v);
    let f = null;
    const goster = (td) => {
        document.body.classList.toggle("td-gorunum", td);
        if (td && !f) {
            f = document.createElement("iframe");
            f.src = "td/popup.html";
            v.append(f);
        }
        try { localStorage.setItem("cor3Gorunum", td ? "td" : "helper"); } catch {}
    };
    btn.addEventListener("click", () => goster(true));
    v.querySelector("#tdGeri").addEventListener("click", () => goster(false));
    let son = "helper";
    try { son = localStorage.getItem("cor3Gorunum") || "helper"; } catch {}
    if (son === "td") goster(true);
})();
