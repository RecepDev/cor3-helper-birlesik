import { getCor3Tab } from './helpers.js';

const autoChosenDecisions = new Set();

function calcOptionScoreBg(opt, expeditionRiskScore, lootMod, riskMod) {
    return Math.round((opt.lootModifier * lootMod) + ((opt.riskModifier * riskMod) * (((expeditionRiskScore + Math.abs(opt.riskModifier)) / 10) || 1)));
}

export async function checkAutoChooseBackground() {
    try {
        const settings = await chrome.storage.sync.get('decisionModifiers');
        const mods = settings.decisionModifiers || {};
        if (!mods.autoChoose) return;

        const modifiersEnabled = mods.enabled !== false;
        const lootMod = modifiersEnabled ? (mods.loot ?? 3) : 1;
        const riskMod = modifiersEnabled ? (mods.risk ?? -2) : -1;

        const { expeditionDecisions, expeditionsData, olumMerc, kararDeney, kararGuvenli } = await chrome.storage.local.get(['expeditionDecisions', 'expeditionsData', 'olumMerc', 'kararDeney', 'kararGuvenli']);
        const decisions = expeditionDecisions || [];
        if (decisions.length === 0) return;

        for (const d of decisions) {
            if (d.isResolved || !d.decisionDeadline || !Array.isArray(d.decisionOptions)) continue;
            if (autoChosenDecisions.has(d.messageId)) continue;
            const dl = new Date(d.decisionDeadline);
            const remaining = dl - Date.now();
            if (remaining <= 0) continue;
            if (remaining > 60000) continue;

            const olumExp = d.expeditionId && (expeditionsData || []).find(e => e.id === d.expeditionId);
            const olum = !!(olumExp && olumExp.mercenary && (olumMerc || {})[olumExp.mercenary.id]) || (!kararGuvenli && !!kararDeney && parseInt(String(d.expeditionId || '0').slice(-1), 16) % 2 === 0);
            let bestOpt = null;
            let bestScore = -Infinity;
            for (const opt of d.decisionOptions) {
                const score = olum ? opt.riskModifier : kararGuvenli ? -opt.riskModifier * 1000 + opt.lootModifier : calcOptionScoreBg(opt, d.riskScore, lootMod, riskMod);
                if (score > bestScore) {
                    bestScore = score;
                    bestOpt = opt;
                }
            }
            if (bestOpt) {
                autoChosenDecisions.add(d.messageId);
                try {
                    const tab = await getCor3Tab();
                    if (tab) {
                        await chrome.tabs.sendMessage(tab.id, {
                            action: 'respondDecision',
                            expeditionId: d.expeditionId,
                            messageId: d.messageId,
                            selectedOption: bestOpt.id
                        });
                        console.log(`[COR3 Helper BG] Auto-chose "${bestOpt.label}" (score: ${bestScore})`);
                    }
                } catch (e) { /* silent */ }
            }
        }
    } catch (e) {
        console.log('[COR3 Helper] Background auto-choose failed:', e);
        cor3LogError('background.js', e, { action: 'checkAutoChooseBackground' });
    }
}
