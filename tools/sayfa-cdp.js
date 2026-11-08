const WebSocket = require("D:/Botlar/cor3-td-bot/node_modules/ws");
const http = require("http");
let [,, urlDesen, ifade, yeniUrl] = process.argv; if (ifade.startsWith("@")) ifade = require("fs").readFileSync(ifade.slice(1), "utf8");
const istek = (yol, yontem = "GET") => new Promise((res, rej) => { const r = http.request({ host: "127.0.0.1", port: 9241, path: yol, method: yontem }, (x) => { let d = ""; x.on("data", (c) => (d += c)); x.on("end", () => res(JSON.parse(d))); }); r.on("error", rej); r.end(); });
(async () => {
  let t = (await istek("/json/list")).find((x) => x.url.startsWith(urlDesen));
  if (!t && yeniUrl) { t = await istek("/json/new?" + encodeURIComponent(yeniUrl), "PUT"); await new Promise((r) => setTimeout(r, 2500)); }
  if (!t) { console.log("hedef yok"); process.exit(1); }
  const ws = new WebSocket(t.webSocketDebuggerUrl, { perMessageDeflate: false });
  ws.on("open", () => ws.send(JSON.stringify({ id: 1, method: "Runtime.evaluate", params: { expression: ifade, returnByValue: true, awaitPromise: true } })));
  ws.on("message", (m) => { const v = JSON.parse(m); if (v.id !== 1) return; const r = v.result; console.log(r.exceptionDetails ? "HATA " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text) : JSON.stringify(r.result.value)); process.exit(0); });
})();
