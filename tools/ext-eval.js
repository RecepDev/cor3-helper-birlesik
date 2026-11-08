const WebSocket = require("D:/Botlar/cor3-td-bot/node_modules/ws");
const http = require("http"); const fs = require("fs");
let ifade = process.argv[2]; if (ifade.startsWith("@")) ifade = fs.readFileSync(ifade.slice(1), "utf8");
http.get("http://127.0.0.1:9241/json/list", (r) => { let d = ""; r.on("data", (c) => (d += c)); r.on("end", async () => {
  const t = JSON.parse(d).find((x) => x.type === "page" && /^https:\/\/cor3\.gg/.test(x.url));
  const ws = new WebSocket(t.webSocketDebuggerUrl, { perMessageDeflate: false });
  let id = 0; const bek = {}; const bag = [];
  const g = (method, params = {}) => new Promise((res) => { const i = ++id; bek[i] = res; ws.send(JSON.stringify({ id: i, method, params })); });
  ws.on("message", (m) => { const v = JSON.parse(m); if (v.method === "Runtime.executionContextCreated") bag.push(v.params.context); if (v.id && bek[v.id]) bek[v.id](v); });
  await new Promise((r) => ws.on("open", r));
  await g("Runtime.enable"); await new Promise((r) => setTimeout(r, 400));
  let cid = null;
  for (const c of bag.filter((x) => x.auxData?.type === "isolated" && /COR3 Helper/i.test(x.name)).reverse()) {
    const v = await g("Runtime.evaluate", { expression: "typeof chrome!=='undefined'&&!!chrome.storage&&!!chrome.runtime.id", returnByValue: true, contextId: c.id });
    if (v.result?.result?.value) { cid = c.id; break; }
  }
  if (!cid) { console.log("baglam yok"); process.exit(1); }
  const v = await g("Runtime.evaluate", { expression: ifade, returnByValue: true, awaitPromise: true, contextId: cid });
  const s = v.result?.result?.value; console.log(v.result?.exceptionDetails ? "HATA " + JSON.stringify(v.result.exceptionDetails).slice(0, 300) : typeof s === "string" ? s : JSON.stringify(s));
  process.exit(0);
}); });
