require('./paket.js');
const { handleWsMessage } = globalThis.test;
const bekle = (ms) => new Promise(r => setTimeout(r, ms));
const sock = { readyState: 1, send(m) { gonderilen.push(String(m)); } };
const st = require('./paket.js');
async function senaryo(ad, ucret, tavan) {
  gonderilen.length = 0; mesajlar.length = 0;
  window.__cor3PendingMercConfigures.length = 0;
  const cfg = { mercenaryId: 'm1', marketId: '019d3ea4-85bd-7389-904d-8f7c85841134', locationConfigId: 'L', zoneConfigId: 'Z', goalId: 'G', hasInsurance: false };
  if (tavan) cfg.__tavan = tavan;
  window.__cor3LaunchExpedition(cfg);
  await bekle(1500);
  const conf = gonderilen.find(m => m.includes('"configure"'));
  if (ucret != null) handleWsMessage('42["expeditions",{"event":{"name":"expeditions","action":"configure"},"data":{"totalCost":' + ucret + '}}]', sock);
  await bekle(ucret == null ? 11000 : 6000);
  const launch = gonderilen.some(m => m.includes('"launch"'));
  const blok = mesajlar.find(m => m.type === 'COR3_LAUNCH_COST_BLOCKED');
  const merc = mesajlar.some(m => m.type === 'COR3_WS_MERC_CONFIGURE');
  console.log(ad, '| configure:', !!conf, 'tavan sızdı:', !!(conf && conf.includes('__tavan')), '| launch:', launch, '| blok:', blok ? blok.cost : '-', '| merc cfg yanlış:', merc, '| kuyruk:', JSON.stringify(window.__cor3PendingMercConfigures));
}
(async () => {
  await senaryo('pahali 32775 tavan 14000', 32775, 14000);
  await senaryo('ucuz 13000 tavan 14000', 13000, 14000);
  await senaryo('yanit yok tavan 14000', null, 14000);
  await senaryo('tavan yok', 32775, 0);
  process.exit(0);
})();
