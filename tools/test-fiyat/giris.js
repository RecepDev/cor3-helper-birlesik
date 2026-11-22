import './mock.js';
import * as ws from '../../src/content-early/ws-send.js';
import '../../src/content-early/expeditions.js';
import { handleWsMessage } from '../../src/content-early/ws-message-handler.js';
import { setActiveSocket } from '../../src/content-early/state.js';
setActiveSocket({ readyState: 1, send(m) { gonderilen.push(String(m)); } });
globalThis.test = { ws, handleWsMessage };
