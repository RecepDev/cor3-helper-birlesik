(() => {
  if (window.__cor3TdBot) return;
  window.__cor3TdBot = true;

  const KEY = "cor3TdBotAyar";
  const varsayilan = { acik: false, al: true, birlestir: true, yukselt: true, hazir: false, otomatik: false, desteSec: true, mod: "rating", kosuSatinAl: false, aralik: 300, minOran: 0.15, sabotaj: true, rakipAnaliz: true, ekonomiAltin: 900, yogunluk: 1, minPay: 0, bossSabotaj: false, bossSabotajDalga: 0, pencereKapat: true, gelirGoster: true, macLimiti: 0, insanGibi: false, beklemeMin: 222, beklemeMax: 1000, molaMin: 20, molaMax: 90, uzunAraHer: 8, uzunAraDk: 10, kuleTercih: 1.2, swapYerlestir: false, deneyMinDalga: 10, sabotajBaslangic: 0, bossTumDalga: false, x0Yasak: false, biriktirOnce: 0, ikiliSeviye: 2, ekonomi: true, ekonomiBaslangic: 0, ekonomiYedek: 0, gelirMinOran: 0.11, kalanTahmin: 20, guvenliIlerleme: 0.85, saldiriItme: false, ekonomiOnce: true, sizanSay: true, pasifRakip: true, pasifDalga: 8, pasifFark: 140, rushDalga: 8, rushGelir: 140, rushKarsiYok: true, rushSniperCarpan: 1.3, bossKarsiOran10: 0.8, boss10HazirlikOnce: 2, freezeYukseltCarpan: 0.5, splashYukseltCarpan: 1.3, splashBirlestirCarpan: 1.5, canOkYatir: true, canOkEsik: 12, kotuDizilimDalga: 9, erkenYeterEsik: 1.0, erkenOldur: true, erkenOldurDalga: 8, erkenOldurCan: 13, erkenOldurEsik: 0.6, erkenOldurOran: 0.7, freezeYanYanaBirlestir: true, freezeAzBirlestir: true, bossOncesiHarca: true, icereCekme: true, icMenzil: 3.5, erkenKule: true, zayifKule: true, kotuDizilimKule: true, ustSiraEnAz: 3, etkiliKule: true, etkiliKapsama: 1.5, freezeYayil: true, freezeOncelik: true, freezeOncelikDalga: 15, freezeHedef: 0.8, erkenTitan: true, erkenYukseltme: false, yeterEsik: 0.7, liderSinir: true, liderFark: 1000, crAltSinir: 10000, rematch: true, rematchBekleSn: 8, acidHizliYok: true, acidPayEsik: 0.2, sizmaMin: 0.05, erkenTitanDalga: 9, erkenMinKule: 3, yalnizTitan: true, ekonomiMinKule: 4, bossSavunma: true, bossSavunmaOnce: 2, bossHazirlik: true, bossHazirlikOnce: 2, erkenBakis: 1, bossDmgKontrol: true, bossGuvenEsik: 0.6, tehditYukselt: true, bossKarsi: true, bossKarsiOran: 0.6, bossYukselt: true, bossYukseltOnce: 3, biriktirmeSiniri: true, bosAltin: 1500, sabitCanDevam: true, gelirTakip: true, gelirFarkEsik: 70, bekci: true, bekciDk: 5, ekonomiMinCan: 8, ekonomiCanKaybi: 2, deneySonraRating: false, kosuLimiti: 0, kosuSayacBaslangic: "", sabitDeste: "universal sniper puddle acid splash", deney: false, deneyMac: 8, deneyDesteleri: "universal sniper gatling acid swap", vSurum: 5, gecOyun: true, gecOyunDalga: 0, gecVerimEsik: 1, turTavan: 2, deployOnce: true, ilkSeviye: true, ilkSeviyeDalga: 9, universalCiftYok: true, erkenDeploy: true, oluBirlestir: true, puddleAz: true, puddleDalga: 25, kayipMolaDk: 1, yukseltmeDalga: 15, yukseltmeAcilCan: 5, rematchKac: true, rematchUzunDalga: 30, rematchRiskCan: 7, alanSinerji: true, arkaYerlesim: true, arkaOran: 0.9, uzakMenzil: 3, suruDalga: 4, suruCan: 10, suruOran: 0.5, suruAlanEsik: 0.15, suruMinKule: 3, suruDenemeAltin: 600, suruDenemeDalga: 3, bosAltinEsik: 600, bosAltinYedek: 200, bosAltinCan: 3 };
  let ayar = { ...varsayilan };
  try { ayar = { ...varsayilan, ...JSON.parse(localStorage.getItem(KEY) || "{}"), acik: false }; } catch {}
  const kaydet = () => { try { localStorage.setItem(KEY, JSON.stringify(ayar)); } catch {} };

  const sayac = { al: 0, birlestir: 0, yukselt: 0, sabotaj: 0, lobi: 0 };
  let sonIs = "-";
  let sonAksiyon = 0;

  const fiberOf = (el) => {
    if (!el) return null;
    const anahtarlar = Object.keys(el);
    const k = anahtarlar.find((x) => x.startsWith("__reactFiber$"));
    if (!k) return null;
    let f = el[k];
    const pk = anahtarlar.find((x) => x.startsWith("__reactProps$"));
    const guncel = pk ? el[pk] : null;
    if (guncel && f.alternate && f.memoizedProps !== guncel && f.alternate.memoizedProps === guncel) f = f.alternate;
    return f;
  };

  const yukariAra = (el, kosul) => {
    let f = fiberOf(el);
    while (f) {
      const p = f.memoizedProps;
      if (p && typeof p === "object" && kosul(p)) return p;
      f = f.return;
    }
    return null;
  };

  const savasProps = () => {
    const el = document.querySelector('[data-component-name="TowerDefenseGameArea"]') ||
      document.querySelector('[data-component-name="TdBattleUpgradesPanel"]');
    if (!el) return null;
    const ana = yukariAra(el, (p) => typeof p.placeRandomTower === "function" && p.stateRef);
    const alan = yukariAra(el, (p) => typeof p.onPlaceRandomTower === "function" && "canBuyRandomTower" in p);
    return ana ? { ana, alan } : null;
  };

  const MENZIL = { basic: 2, sniper: 4, splash: 1.25, freeze: 2.3, puddle: 2, acid: 2, gatling: 2, synergy: 2.5, swap: 2, universal: 1.75 };
  const SEVIYE_MENZIL = [1, 1, 1.3, 1.6];
  const DEGER = { gatling: 54, basic: 42, sniper: 40, splash: 45, freeze: 35, synergy: 25, acid: 25, puddle: 15, swap: 20, universal: 21 };
  const HARITA_KEY = "cor3TdBotHarita";

  let yolOnbellek = { ref: null, yol: [] };
  const yolAl = (level) => {
    if (!level || !Array.isArray(level.waypoints)) return [];
    if (yolOnbellek.ref !== level) {
      const n = level.waypoints.length;
      yolOnbellek = { ref: level, yol: level.waypoints.map((w, i) => ({ x: w.x, y: w.y, w: 1.35 - 0.7 * (n > 1 ? i / (n - 1) : 0) })) };
      try { localStorage.setItem(HARITA_KEY, JSON.stringify({ cols: level.cols, rows: level.rows, yol: yolOnbellek.yol })); } catch {}
    }
    return yolOnbellek.yol;
  };

  const acidYol = new WeakMap();
  const acidAgirlik = (yol) => {
    if (!yol.length || yol[0].w === undefined) return yol;
    let v = acidYol.get(yol);
    if (!v) { v = yol.map((c) => ({ ...c, w: Math.max(0, (c.w - 0.65) / 0.7) * 2.2 })); acidYol.set(yol, v); }
    return v;
  };
  const kapsama = (x, y, r, yol) => {
    let n = 0;
    for (const w of yol) { const dx = w.x - x, dy = w.y - y; if (dx * dx + dy * dy <= r * r) n += w.w ?? 1; }
    return n;
  };
  const menzil = (t, lv, st) => st ? ozellik(kural(st.level), t, lv, st.typeLevels?.[t] ?? 0).menzil : (MENZIL[t] ?? 2) * (SEVIYE_MENZIL[lv] ?? 1.6);

  const birlesebilir = (s, b) => {
    if (s === b || s.level !== b.level || s.level >= 3) return false;
    if (s.typeId === "swap" || b.typeId === "swap") return s.typeId === "swap" && b.typeId === "swap";
    if (s.typeId === b.typeId) return true;
    return s.typeId === "universal" && b.typeId !== "universal";
  };

  const YAVAS = new Set(["freeze", "puddle"]);
  const ALAN = new Set(["splash", "acid", "puddle"]);
  const UZAK = new Set(["sniper", "gatling"]);
  const freezeTahta = (kuleler, k, tl, yol, yt = "freeze") => {
    const h = new Map();
    const komsu = new Set();
    let top = 0;
    for (const t of kuleler) {
      if (t.typeId !== yt) continue;
      const o = ozellik(k, yt, t.level, tl[yt] ?? 0);
      for (const w of yol) if (Math.abs(w.x - t.x) <= 1 && Math.abs(w.y - t.y) <= 1) komsu.add(w.x + "," + w.y);
      for (const w of yol) {
        const dx = w.x - t.x, dy = w.y - t.y;
        if (dx * dx + dy * dy > o.menzil * o.menzil) continue;
        const key = w.x + "," + w.y, v = (60 + 0.3 * o.dps) * (w.w ?? 1);
        if (v > (h.get(key) || 0)) { top += v - (h.get(key) || 0); h.set(key, v); }
      }
    }
    top += (ayar.freezeKoseBonus ?? 30) * komsu.size;
    return top;
  };

  const freezeIhtiyac = (st, yol) => {
    const d = st?.currentWave || 0;
    if (ayar.freezeOncelik === false || d < (ayar.freezeOncelikDalga ?? 15) || !yol?.length) return 0;
    if (!Object.keys(st.typeLevels || {}).includes("freeze") && !(st.towers || []).some((t) => t.typeId === "freeze")) return 0;
    const k = kural(st.level);
    const tl = st.typeLevels?.freeze ?? 0;
    const fz = (st.towers || []).filter((t) => t.typeId === "freeze");
    let kapali = 0;
    for (const w of yol) if (fz.some((t) => { const r = ozellik(k, "freeze", t.level, tl).menzil; return (w.x - t.x) ** 2 + (w.y - t.y) ** 2 <= r * r; })) kapali++;
    const oran = kapali / yol.length;
    const eksik = Math.max(0, (ayar.freezeHedef ?? 0.8) - oran) / (ayar.freezeHedef ?? 0.8);
    return Math.min(1, eksik + (fz.length < 2 ? 0.3 : 0));
  };

  const birlesmeBul = (kuleler, yol, st) => {
    const k = kural(st?.level);
    const tl = st?.typeLevels || {};
    const bos = (st?.buildableSet?.size ?? 0) - kuleler.length;
    let en = null;
    for (const s of kuleler) {
      for (const b of kuleler) {
        if (!birlesebilir(s, b)) continue;
        const ciftUni = s.typeId === "universal" && b.typeId === "universal" && ayar.universalCiftYok !== false;
        if (ciftUni && (s.level !== 1 || bos > 0)) continue;
        const tip = b.typeId === "universal" ? s.typeId : b.typeId;
        const olu = (t, lv, tt) => yol.length > 0 && kapsama(t.x, t.y, menzil(tt, lv, st), tt === "acid" ? acidAgirlik(yol) : yol) < (ayar.etkiliKapsama ?? 1.5);
        const oluKural = ayar.oluBirlestir !== false && s.typeId !== "universal" && s.typeId !== "swap";
        const sOlu = oluKural && olu(s, s.level, s.typeId) && !olu(b, b.level + 1, tip);
        if (oluKural && olu(b, b.level + 1, tip) && !olu(s, b.level + 1, tip)) continue;
        if (bos > 0 && (st?.currentWave || 0) < (ayar.l3ErkenDalga ?? 10) && b.level === 2 && s.level === 2 && s.typeId !== "universal" && !sOlu) continue;
        const yanYana = YAVAS.has(s.typeId) && s.typeId === b.typeId && Math.max(Math.abs(s.x - b.x), Math.abs(s.y - b.y)) <= 1;
        const puddleErken = ayar.puddleAz !== false && tip === "puddle" && (st?.currentWave || 0) < (ayar.puddleDalga ?? 25) && !yanYana;
        if (puddleErken && !sOlu && bos >= 2) continue;
        if (s.typeId === "universal" && yol.length && ayar.universalOluYok !== false) {
          const yk = tip === "acid" ? acidAgirlik(yol) : yol;
          if (kapsama(b.x, b.y, menzil(tip, b.level + 1, st), yk) < (ayar.etkiliKapsama ?? 1.5)) continue;
        }
        const uzak = ayar.arkaYerlesim !== false && yol.length && s.typeId !== "universal" && UZAK.has(tip) && menzil(tip, b.level + 1, st) >= (ayar.uzakMenzil ?? 3);
        if (uzak) {
          const kisa = (c) => kapsama(c.x, c.y, 2, yol);
          const yb = kuleDegeri(k, { ...b, typeId: tip, level: b.level + 1 }, tl[tip] ?? 0, yol);
          const ys = kuleDegeri(k, { ...s, typeId: tip, level: b.level + 1 }, tl[tip] ?? 0, yol);
          const kb = kisa(b), ks = kisa(s), oran = ayar.arkaOran ?? 0.9;
          if (kb < ks - 0.01 ? yb < ys * oran : kb > ks + 0.01 ? ys >= yb * oran : yb + 0.01 < ys) continue;
        }
        if (!uzak && ayar.icereCekme !== false && yol.length && s.typeId !== "universal" && (MENZIL[tip] ?? 2) < (ayar.icMenzil ?? 3.5)) {
          const r1 = MENZIL[tip] ?? 2;
          const kose = (c) => YAVAS.has(tip) ? yol.filter((w) => Math.abs(w.x - c.x) <= 1 && Math.abs(w.y - c.y) <= 1).length : 0;
          const yk = tip === "acid" ? acidAgirlik(yol) : yol;
          const komsu = (c) => ayar.alanSinerji !== false && ALAN.has(tip) ? kuleler.filter((t) => t !== s && t !== b && ALAN.has(t.typeId) && Math.max(Math.abs(t.x - c.x), Math.abs(t.y - c.y)) <= 1).length : 0;
          const kb = kapsama(b.x, b.y, r1, yk) * (1 + 0.3 * komsu(b)), ks = kapsama(s.x, s.y, r1, yk) * (1 + 0.3 * komsu(s));
          if (kose(b) < kose(s) || (kose(b) === kose(s) && kb + 0.01 < ks)) continue;
        }
        let kazanc = 0;
        if (yol.length) {
          const yeni = { ...b, typeId: tip, level: b.level + 1 };
          kazanc = kuleDegeri(k, yeni, tl[tip] ?? 0, yol) - kuleDegeri(k, b, tl[b.typeId] ?? 0, yol) - kuleDegeri(k, s, tl[s.typeId] ?? 0, yol);
          const yt = YAVAS.has(tip) ? tip : YAVAS.has(s.typeId) ? s.typeId : YAVAS.has(b.typeId) ? b.typeId : null;
          if (ayar.freezeYayil !== false && yt) {
            const once = freezeTahta(kuleler, k, tl, yol, yt);
            const sonra = freezeTahta(kuleler.filter((x) => x !== s && x !== b).concat([yeni]), k, tl, yol, yt);
            const tekil = (x) => kuleDegeri(k, x, tl[x.typeId] ?? 0, yol);
            kazanc += (sonra - once) * (1 + 2 * (yt === "freeze" ? freezeIhtiyac(st, yol) : 0)) - ((tip === yt ? tekil(yeni) : 0) - (b.typeId === yt ? tekil(b) : 0) - (s.typeId === yt ? tekil(s) : 0));
          }
        }
        const yanYanaFreeze = ayar.freezeYanYanaBirlestir !== false && yanYana;
        if (yanYanaFreeze) kazanc += 1000;
        if (tip === "splash" && kazanc > 0) kazanc *= ayar.splashBirlestirCarpan ?? 1.5;
        if (YAVAS.has(tip) && ayar.freezeAzBirlestir !== false && !yanYanaFreeze && !sOlu) {
          if (bos >= 2) continue;
          if (s.typeId === "universal") kazanc -= 5000;
        }
        if (yol.length && bos >= 2 && kazanc <= 0) continue;
        const puan = (bos >= 2 ? kazanc : -b.level * 100000 + kazanc) + (sOlu ? 1e7 : 0) - (puddleErken && !sOlu ? 50000 : 0) - (ciftUni ? 1e6 : 0);
        if (!en || puan > en.puan) en = { s, b, puan, kazanc, olu: sOlu };
      }
    }
    return en;
  };

  const VARS_TANIM = {
    basic: { damage: 25, range: 2, fireIntervalMs: 600 }, sniper: { damage: 60, range: 4, fireIntervalMs: 1500 },
    splash: { damage: 30, range: 1.25, fireIntervalMs: 1000 }, freeze: { damage: 20, range: 2.3, fireIntervalMs: 1300, effectDurationMs: 850 },
    puddle: { damage: 0, range: 2, fireIntervalMs: 1300, slowPercent: 20, puddleDurationMs: 1500 },
    acid: { damage: 0, range: 2, fireIntervalMs: 900, puddleDurationMs: 2500, puddleTickMs: 300, puddleDamage: 3 },
    gatling: { damage: 7, range: 2, fireIntervalMs: 130 }, synergy: { damage: 20, range: 2.5, fireIntervalMs: 900, synergyNeighborDamageBonusPct: 75 },
    swap: { damage: 20, range: 2, fireIntervalMs: 700 }, universal: { damage: 20, range: 1.75, fireIntervalMs: 950 },
  };
  const VARS_BIRLESME = [{ damageMultiplier: 1, speedMultiplier: 1, rangeMultiplier: 1 }, { damageMultiplier: 1.8, speedMultiplier: 1.4, rangeMultiplier: 1.3 }, { damageMultiplier: 2.8, speedMultiplier: 1.8, rangeMultiplier: 1.6 }];
  const VARS_YUKSELTME = [
    { level: 1, damageBonusPct: 8, speedBonusPct: 6, rangeBonusPct: 4, cost: 80 }, { level: 2, damageBonusPct: 15, speedBonusPct: 11, rangeBonusPct: 7, cost: 200 },
    { level: 3, damageBonusPct: 21, speedBonusPct: 15, rangeBonusPct: 10, cost: 400 }, { level: 4, damageBonusPct: 26, speedBonusPct: 18, rangeBonusPct: 12, cost: 700 },
    { level: 5, damageBonusPct: 30, speedBonusPct: 20, rangeBonusPct: 14, cost: 1100 },
  ];

  const alanCarpani = () => {
    const n = mac?.oncekiDalgaSayi || 0;
    if (!n) return 1.8;
    return Math.max(1.2, Math.min(3, 1 + (n - 5) / 10));
  };

  const kural = (level) => {
    const tanim = { ...VARS_TANIM };
    for (const d of level?.towerDefs || []) if (d && d.type) tanim[d.type] = { ...tanim[d.type], ...d };
    return {
      tanim,
      birlesme: level?.mergeScaling?.length ? level.mergeScaling : VARS_BIRLESME,
      yukseltme: level?.typeUpgradeLevels?.length ? level.typeUpgradeLevels : VARS_YUKSELTME,
    };
  };

  const turSeviye = (k, n) => {
    if (n <= 0) return { damageBonusPct: 0, speedBonusPct: 0, rangeBonusPct: 0, cost: k.yukseltme[0]?.cost ?? 80 };
    const t = k.yukseltme.find((x) => x.level === n);
    if (t) return t;
    const m = n - 5;
    return { damageBonusPct: 30 + 3 * m, speedBonusPct: 20 + 2 * m, rangeBonusPct: 14 + m, cost: 100 * Math.ceil(1100 * Math.pow(1.45, m) / 100) };
  };

  const ozellik = (k, tip, lv, tl) => {
    const d = k.tanim[tip] || VARS_TANIM.basic;
    const b = k.birlesme[Math.min(3, Math.max(1, lv)) - 1] || VARS_BIRLESME[0];
    const u = turSeviye(k, tl);
    const carpan = b.damageMultiplier * (1 + u.damageBonusPct / 100);
    const aralik = Math.max(60, Math.round(d.fireIntervalMs / (b.speedMultiplier * (1 + u.speedBonusPct / 100))));
    const menzil = Number((d.range * b.rangeMultiplier * (1 + u.rangeBonusPct / 100)).toFixed(2));
    let dps = Math.ceil((d.damage || 0) * carpan) / aralik * 1000;
    if (tip === "acid") dps = Math.ceil((d.puddleDamage || 0) * carpan) / ((d.puddleTickMs || 300) / 1000) * Math.min(3, Math.max(1, (d.puddleDurationMs || 2500) / aralik)) * alanCarpani();
    if (tip === "puddle") dps = (d.slowPercent || 20) * ({ 1: 1, 2: 1.5, 3: 2 }[Math.min(3, lv)] || 2) * 0.6;
    if (tip === "splash") dps *= alanCarpani();
    if (tip === "freeze") dps += Math.min(1, (d.effectDurationMs || 850) / aralik) * 25;
    if (tip === "synergy") dps *= 1.3;
    return { dps, menzil, aralik };
  };

  const kuleDegeri = (k, t, tl, yol) => {
    const o = ozellik(k, t.typeId, t.level, tl);
    const kap = yol.length ? kapsama(t.x, t.y, o.menzil, t.typeId === "acid" ? acidAgirlik(yol) : yol) : 3;
    return o.dps * kap;
  };

  const yukseltmeKazanci = (k, st, tip, yol) => {
    const tl = st.typeLevels?.[tip] ?? 0;
    const fark = (adim) => {
      let f = 0;
      for (const t of st.towers || []) if (t.typeId === tip) f += kuleDegeri(k, t, tl + adim, yol) - kuleDegeri(k, t, tl, yol);
      return f;
    };
    const maliyet = turSeviye(k, tl + 1).cost;
    const f1 = fark(1);
    const f2 = fark(2);
    const m2 = maliyet + turSeviye(k, tl + 2).cost;
    const oran = Math.max(f1 / maliyet, f1 <= 0 ? f2 / m2 * 0.8 : 0);
    return { fark: f1 > 0 ? f1 : f2, maliyet, oran, birim: f1 > 0 ? f1 / maliyet : f2 / m2, tl };
  };

  const tehditKarisim = (st) => {
    const birimler = st.level?.incomeUnits || [];
    const hp = {};
    let top = 0;
    for (const q of st.oppIncomeQueue || []) {
      const u = birimler.find((x) => x.id === q.unitId);
      if (!u) continue;
      const h = (u.hp || u.baseHp || 0) * (q.count || 1);
      hp[u.typeId] = (hp[u.typeId] || 0) + h; top += h;
    }
    return { hp, top };
  };
  const ONSEL_KULE = { fast: { acid: 0.26, puddle: 0.2, splash: 0.46, gatling: 0.46, sniper: 0.5, basic: 0.64, freeze: 0.65 }, normal: {}, tank: {}, boss: { sniper: 0.26, basic: 0.26, freeze: 0.27, gatling: 0.38, splash: 0.44, acid: 0.66, puddle: 0.69 } };
  const turIlerleme = (dusman, tip) => {
    const h = ogrenme[dusman]?.[tip];
    if (h && h.n >= 3) return h.ilerleme / h.n;
    return ONSEL_KULE[dusman]?.[tip] ?? null;
  };
  const tehditCarpani = (st, tip) => {
    if (ayar.tehditYukselt === false) return 1;
    const { hp, top } = tehditKarisim(st);
    const olcek = mac?.oncekiDalgaHp || 0;
    if (top <= 0 || olcek <= 0 || top < olcek * 0.15) return 1;
    let c = 0;
    for (const [dusman, h] of Object.entries(hp)) {
      const turler = Object.keys(st.typeLevels || {}).filter((t) => t !== "universal" && t !== "swap");
      const vals = turler.map((t) => turIlerleme(dusman, t)).filter((v) => v !== null);
      const benim = turIlerleme(dusman, tip);
      if (!vals.length || benim === null) continue;
      const ort = vals.reduce((x, y) => x + y, 0) / vals.length;
      c += (h / top) * (ort - benim) / Math.max(0.05, ort);
    }
    const guc = Math.min(1, top / olcek);
    return Math.max(0.5, Math.min(1.8, 1 + guc * c));
  };
  const bossCarpani = (st, tip) => {
    if (ayar.bossYukselt === false) return 1;
    const dalga = st.currentWave || 0, boss = st.nextBossWave || Math.ceil((dalga + 1) / 10) * 10;
    const kalan = dalga > 0 && dalga % 10 === 0 ? 0 : boss - dalga;
    if (kalan < 0 || kalan > (ayar.bossYukseltOnce ?? 3)) return 1;
    const turler = Object.keys(st.typeLevels || {}).filter((t) => t !== "universal" && t !== "swap");
    const vals = turler.map((t) => turIlerleme("boss", t)).filter((v) => v !== null);
    const benim = turIlerleme("boss", tip);
    if (!vals.length || benim === null) return 1;
    const ort = vals.reduce((x, y) => x + y, 0) / vals.length;
    return Math.max(0.6, Math.min(1.6, 1 + 0.8 * (ort - benim) / Math.max(0.05, ort)));
  };

  const tahtaDegeri = (k, st, yol) => (st?.towers || []).reduce((x, t) => x + kuleDegeri(k, t, st.typeLevels?.[t.typeId] ?? 0, yol), 0);
  const yukseltmeKarti = (st, yol, esik = ayar.minOran, serbest = false) => {
    const k = kural(st?.level);
    const sayi = {};
    const toplam = Math.max(1, tahtaDegeri(k, st, yol));
    for (const t of st?.towers || []) sayi[t.typeId] = (sayi[t.typeId] || 0) + Math.pow(2, t.level - 1);
    const enCok = Math.max(1, ...Object.values(sayi));
    const kartlar = [...document.querySelectorAll('[data-component-name="TdBattleTowerCard"]')];
    let secilen = null, enIyiYeten = null;
    for (const el of kartlar) {
      const p = yukariAra(el, (x) => "typeLevel" in x && typeof x.onUpgrade === "function");
      if (!p || p.typeId === "universal" || p.typeId === "swap") continue;
      const pay = (sayi[p.typeId] || 0) / enCok;
      if (pay < ayar.minPay) continue;
      const g = yukseltmeKazanci(k, st, p.typeId, yol);
      if ((ayar.turTavan ?? 0) > 0 && g.tl >= ayar.turTavan) continue;
      const verim = g.birim / toplam * 1e5;
      const puan = g.oran * Math.pow(pay, ayar.yogunluk) * tehditCarpani(st, p.typeId) * bossCarpani(st, p.typeId) * (YAVAS.has(p.typeId) ? (ayar.freezeYukseltCarpan ?? 0.5) : 1) * (p.typeId === "splash" ? (ayar.splashYukseltCarpan ?? 1.3) : 1) * (mac?.rush && p.typeId === "sniper" ? (ayar.rushSniperCarpan ?? 1.3) : 1);
      if (puan < esik) continue;
      const aday = { k: el, p, g, puan, pay, verim, yetiyor: !el.disabled && st.gold >= g.maliyet };
      if (aday.yetiyor && (!enIyiYeten || puan > enIyiYeten.puan)) enIyiYeten = aday;
      if (!secilen || puan > secilen.puan) secilen = aday;
    }
    if (secilen) secilen.alt = enIyiYeten && enIyiYeten !== secilen ? enIyiYeten : null;
    return secilen;
  };

  let sonKarar = null;
  let aktifDeste = null;
  let swapPlani = null;
  const yerlestir = (st, yol) => {
    const k = kural(st.level);
    const tl = st.typeLevels || {};
    const kuleler = st.towers || [];
    const deg = (t, x, y) => kuleDegeri(k, { ...t, x, y }, tl[t.typeId] ?? 0, yol);
    const toplam = kuleler.reduce((a, t) => a + deg(t, t.x, t.y), 0) || 1;
    const esik = toplam * 0.03;
    if (swapPlani) {
      const S = kuleler.find((t) => t.typeId === "swap" && t.x === swapPlani.sx && t.y === swapPlani.sy);
      const T = kuleler.find((t) => t.id === swapPlani.tid && t.x === swapPlani.tx && t.y === swapPlani.ty);
      swapPlani = null;
      if (S && T && S.level === T.level) return { S, T, kazanc: 0, plan: true };
    }
    let en = null;
    for (const S of kuleler) {
      if (S.typeId !== "swap") continue;
      const A = [S.x, S.y];
      const adaylar = kuleler.filter((t) => t !== S && t.typeId !== "swap" && t.level === S.level);
      for (const T1 of adaylar) {
        const B1 = [T1.x, T1.y];
        const k1 = deg(T1, ...A) + deg(S, ...B1) - deg(T1, ...B1) - deg(S, ...A);
        if (!en || k1 > en.kazanc) en = { S, T: T1, kazanc: k1 };
        for (const T2 of adaylar) {
          if (T2 === T1) continue;
          const B2 = [T2.x, T2.y];
          const k2 = deg(T1, ...A) + deg(T2, ...B1) + deg(S, ...B2) - deg(T1, ...B1) - deg(T2, ...B2) - deg(S, ...A);
          if (k2 > (en?.kazanc ?? -Infinity) && k2 > k1 + esik) en = { S, T: T1, kazanc: k2, sonraki: { tid: T2.id, tx: T2.x, ty: T2.y, sx: B1[0], sy: B1[1] } };
        }
      }
    }
    if (!en || en.kazanc < esik) return null;
    if (en.sonraki) swapPlani = en.sonraki;
    return en;
  };
  const kuleAlmaDegeri = (st, yol) => {
    const k = kural(st.level);
    const dolu = new Set((st.towers || []).map((t) => t.x + "," + t.y));
    const bos = [...(st.buildableSet || [])].filter((h) => !dolu.has(h)).map((h) => h.split(",").map(Number));
    if (!bos.length) return 0;
    const turler = (aktifDeste || Object.keys(st.typeLevels || {})).filter((t) => t !== "swap");
    if (!turler.length) return 0;
    let top = 0;
    for (const t of turler) {
      const o = ozellik(k, t === "universal" ? "basic" : t, 1, st.typeLevels?.[t] ?? 0);
      let kap = 0;
      for (const [x, yy] of bos) kap += kapsama(x, yy, o.menzil, yol);
      let deger = o.dps * (kap / bos.length);
      const ayni = (st.towers || []).some((x) => x.level === 1 && (x.typeId === t || t === "universal"));
      if (ayni) deger *= 1.25;
      top += deger;
    }
    return top / turler.length;
  };

  let biriktirKayit = null;
  const kalanDalga = (st) => {
    const bas = st.level?.startLives || 15;
    if ((st.lives ?? bas) <= 4) return 4;
    return ayar.kalanTahmin || 20;
  };

  const tehdit = (st) => {
    const birimler = st.level?.incomeUnits || [];
    let hp = 0;
    for (const q of st.oppIncomeQueue || []) { const u = birimler.find((x) => x.id === q.unitId); if (u) hp += (u.hp || u.baseHp || 0) * (q.count || 1); }
    return hp;
  };

  const savunmaDurumu = (st) => {
    const bas = st.level?.startLives || 15;
    const d = mac?.dalgalar || [];
    const ikiOnce = d.length >= 2 ? d[d.length - 2].can : d.length ? d[0].can : bas;
    const ucOnceCan = d.length >= 3 ? d[d.length - 3].can : d.length ? d[0].can : bas;
    const sabit = (ucOnceCan ?? bas) === (st.lives ?? bas);
    const canDustu = (ikiOnce ?? bas) - (st.lives ?? bas) >= (ayar.ekonomiCanKaybi ?? 2) || ((st.lives ?? bas) < (ayar.ekonomiMinCan ?? 8) && !(ayar.sabitCanDevam !== false && sabit));
    const ilerleme = mac?.olumIlerleme || [];
    const sirali = [...ilerleme].sort((x, y) => x - y);
    const p75 = sirali.length >= 8 ? sirali[Math.floor(sirali.length * 0.75)] : 0;
    const gelen = tehdit(st);
    const kapasite = mac?.oncekiDalgaHp || 0;
    const tehditBuyuk = gelen > 0 && kapasite > 0 && gelen > kapasite * 0.5 && p75 > 0.45;
    const yeterli = !canDustu && p75 < (ayar.guvenliIlerleme || 0.6) && !tehditBuyuk;
    const azCan = (st.lives ?? bas) < (ayar.ekoMinCan ?? 5) && !(ayar.sabitCanDevam !== false && sabit);
    const ekoYeterli = !azCan && p75 < (ayar.guvenliIlerleme || 0.6) && !tehditBuyuk;
    return { yeterli, ekoYeterli, canDustu, sabit, p75: +p75.toFixed(2), gelen, kapasite, tehditBuyuk };
  };

  const HP_TABLO = [500, 544, 708, 1014, 1247, 1683, 2338, 2849, 3832, 4515, 5627, 5990, 6656, 7371, 8509, 10846, 11604, 12830, 14216, 16435, 21732, 20032, 20607, 23735, 23836, 29819, 27815, 29895, 35501, 35188, 42813, 39217, 42549, 44565, 47924, 50942, 56407, 55525, 62116, 56110, 81251, 59144, 90340, 67310];
  const dalgaHp = (d) => (d < HP_TABLO.length ? HP_TABLO[Math.max(0, d)] : HP_TABLO[HP_TABLO.length - 1] * Math.pow(1.1, d - HP_TABLO.length + 1));
  const hasarYeter = (st, kac = 2) => {
    const d = st.currentWave || 0;
    const olum = mac?.olumIlerleme || [];
    if (olum.length < 8) {
      const yol = yolAl(st.level);
      if (!yol.length) return { yeter: d <= 4, tahmin: null };
      const k = kural(st.level);
      let kap = 0;
      for (const t of st.towers || []) {
        if (t.typeId === "universal" || t.typeId === "swap") continue;
        const o = ozellik(k, t.typeId, t.level, st.typeLevels?.[t.typeId] ?? 0);
        kap += o.dps * 20 * Math.min(1, kapsama(t.x, t.y, o.menzil, yol) / 6);
      }
      let gerek = 0;
      for (let j = 1; j <= kac; j++) gerek = Math.max(gerek, dalgaHp(d + j) + tehdit(st));
      const tahmin = +(gerek / Math.max(1, kap) * 0.7).toFixed(2);
      return { yeter: tahmin <= (ayar.yeterEsik ?? 0.7), tahmin, kapasite: Math.round(kap), gerek: Math.round(gerek) };
    }
    const sirali = [...olum].sort((x, y) => x - y);
    const p75 = sirali[Math.floor(sirali.length * 0.75)];
    const ref = Math.max(mac?.oncekiDalgaHp || 0, dalgaHp(Math.max(0, d - 1)) * 0.5);
    const gelen = tehdit(st);
    let oran = 1;
    for (let j = 1; j <= kac; j++) oran = Math.max(oran, (dalgaHp(d + j) + gelen) / Math.max(1, ref));
    const tahmin = +(p75 * oran).toFixed(2);
    return { yeter: tahmin <= (ayar.yeterEsik ?? 0.7), tahmin };
  };

  const rakipZayiflik = (st) => {
    const yol = Array.isArray(st.oppLevelWaypoints) && st.oppLevelWaypoints.length ? st.oppLevelWaypoints : yolAl(st.level);
    if (!yol.length) return null;
    const k = kural(st.level);
    let kap = 0;
    for (const t of st.oppTowers || []) {
      if (t.typeId === "universal" || t.typeId === "swap") continue;
      const o = ozellik(k, t.typeId, t.level, st.oppTypeLevels?.[t.typeId] ?? 0);
      kap += o.dps * 20 * Math.min(1, kapsama(t.x, t.y, o.menzil, yol) / 6);
    }
    const gerek = dalgaHp((st.currentWave || 0) + 1);
    return { kap: Math.round(kap), gerek, tahmin: +(gerek / Math.max(1, kap) * 0.7).toFixed(2) };
  };

  const sabotajDurumu = (st) => {
    const lv = st.level || {};
    const her = lv.bossEveryNWaves || 10;
    const dalga = st.currentWave || 0;
    const boss = st.nextBossWave || Math.ceil((dalga + 1) / her) * her;
    const acilis = lv.incomeUnlockWave ?? 3;
    const saldiriAcik = dalga >= Math.max(acilis, ayar.sabotajBaslangic || 0);
    const tehlike = st.lives <= (lv.startLives || 15) * 0.4;
    const bossDalgasi = dalga > 0 && dalga % her === 0;
    const pencere = (st.waveStage === "prep" && dalga + 1 === boss) || (st.waveStage === "combat" && dalga === boss - 1 && (ayar.bossTumDalga || (st.currentWaveEndsAt && st.currentWaveEndsAt - Date.now() < 8000))) || (!ayar.x0Yasak && bossDalgasi && st.waveStage === "combat" && Date.now() - (st.currentWaveStartedAt || 0) < 6000);
    const hedefBoss = bossDalgasi ? dalga : boss;
    const bossAktif = ayar.bossSabotaj || (ayar.bossSabotajDalga > 0 && hedefBoss >= ayar.bossSabotajDalga);
    const sonrakiAktif = ayar.bossSabotaj || (ayar.bossSabotajDalga > 0 && boss >= ayar.bossSabotajDalga);
    let biriktir = sonrakiAktif && boss >= (ayar.sabotajBaslangic || 0) && dalga >= acilis && !tehlike && !pencere && boss - dalga <= (ayar.biriktirOnce || 3) && boss - dalga > 0;
    if (biriktir) {
      if (!biriktirKayit || biriktirKayit.boss !== boss) biriktirKayit = { boss, can: st.lives, iptal: false };
      if (st.lives < biriktirKayit.can) biriktirKayit.iptal = true;
      if (biriktirKayit.iptal) biriktir = false;
    }
    const sav = savunmaDurumu(st);
    const R = kalanDalga(st);
    const gelirFark = (st.oppIncome || 0) - (st.income || 0);
    const guvenli = ((st.lives ?? 15) >= (ayar.ekoMinCan ?? 5) || (ayar.sabitCanDevam !== false && sav.sabit && (st.lives ?? 15) > 4)) && sav.ekoYeterli;
    const takip = !guvenli && ayar.gelirTakip !== false && gelirFark >= (ayar.gelirFarkEsik ?? 70) && (st.lives ?? 15) > 4 && mac?._takipDalga !== dalga;
    const ekonomiAcik = ayar.ekonomi !== false && dalga >= Math.max(acilis, ayar.ekonomiBaslangic || 0) && (guvenli || takip);
    if (mac && dalga <= (ayar.rushDalga ?? 8) && (st.oppIncome || 0) >= (ayar.rushGelir ?? 140)) mac.rush = true;
    const pasif = ayar.pasifRakip !== false && dalga >= (ayar.pasifDalga ?? 8) && (st.oppIncome || 0) <= 70 && !mac?.rush;
    const fark = (st.income || 0) - (st.oppIncome || 0);
    const canOk = ayar.canOkYatir !== false && (st.lives ?? 15) >= (ayar.canOkEsik ?? 12) && sav.sabit && !sav.canDustu;
    const lider = !canOk && ((ayar.liderSinir !== false && fark >= (ayar.liderFark ?? 1000)) || (pasif && fark >= (ayar.pasifFark ?? 140)));
    const sonuc = { gonder: false, biriktir, tehlike, boss, sav, R, lider, pasif, rush: !!mac?.rush };
    if (saldiriAcik && pencere && bossAktif && !(ayar.x0Yasak && bossDalgasi)) return { ...sonuc, gonder: true, neden: "boss sabotajı", yedek: 100, biriktir: false };
    if (ayar.x0Yasak && bossDalgasi && st.waveStage === "combat" && saldiriAcik) sonuc.yasak = true;
    const bossaKalan = boss - dalga;
    const bossRef = Math.max(mac?.oncekiDalgaHp || 0, dalgaHp(Math.max(0, dalga - 1)) * 0.5);
    const bossTabloTahmin = sav.p75 > 0 ? sav.p75 * (dalgaHp(bossDalgasi ? dalga : boss) + 1.5 * tehdit(st)) / Math.max(1, bossRef) : null;
    const bossEski = sav.p75 > 0 ? sav.p75 * Math.pow(1.05, bossDalgasi ? 0 : Math.max(0, bossaKalan)) * (bossDalgasi ? 1.15 : 1.35) : null;
    const bossTahmin = bossEski === null ? null : +Math.max(bossEski, bossTabloTahmin ?? 0).toFixed(2);
    const bossaYetiyor = ayar.bossDmgKontrol !== false && bossTahmin !== null && bossTahmin <= (ayar.bossGuvenEsik ?? 0.45) && sav.yeterli && !tehlike;
    const karsiPencere = (st.waveStage === "combat" && dalga === boss - 1) || (st.waveStage === "prep" && dalga + 1 === boss);
    const karsiKule = (st.towers || []).length >= Math.min(st.buildableSet?.size ?? 15, Math.max(ayar.ekonomiMinKule ?? 4, Math.floor(dalga / 3)));
    const guvende = bossTahmin !== null && bossTahmin <= (ayar.bossGuvenEsik ?? 0.45) && sav.yeterli && sav.sabit && !tehlike && karsiKule;
    if (ayar.bossKarsi !== false && ayar.sabotaj && mac && karsiPencere && dalga >= acilis && (st.lives ?? 15) > 4 && guvende && !(mac.rush && ayar.rushKarsiYok !== false)) {
      const k = mac._karsi && mac._karsi.boss === boss ? mac._karsi : (mac._karsi = { boss, butce: 0, harcanan: 0 });
      k.butce = Math.max(k.butce, k.harcanan + Math.floor((st.gold || 0) * (boss === 10 ? (ayar.bossKarsiOran10 ?? 0.8) : (ayar.bossKarsiOran ?? 0.6))));
      const kalan = k.butce - k.harcanan;
      if (kalan >= 50) return { ...sonuc, gonder: true, neden: "boss karşı sabotaj", yedek: Math.max(0, (st.gold || 0) - kalan), tahmin: bossTahmin };
    }
    if (ayar.erkenOldur !== false && ayar.sabotaj && mac && dalga >= acilis && dalga <= (ayar.erkenOldurDalga ?? 8) && (st.lives ?? 15) >= (ayar.erkenOldurCan ?? 13) && sav.yeterli) {
      const rz = rakipZayiflik(st);
      const bizYeter = hasarYeter(st, 1).yeter;
      if (rz && bizYeter && rz.tahmin >= (ayar.erkenOldurEsik ?? 0.6)) {
        const k = mac._eo && mac._eo.d === dalga ? mac._eo : (mac._eo = { d: dalga, butce: 0, harcanan: 0 });
        k.butce = Math.max(k.butce, k.harcanan + Math.floor((st.gold || 0) * (ayar.erkenOldurOran ?? 0.7)));
        const kalan = k.butce - k.harcanan;
        if (kalan >= 50) return { ...sonuc, gonder: true, neden: "erken öldürme", yedek: Math.max(0, (st.gold || 0) - kalan), rz };
      }
    }
    const bossYakinSuru = (bossaKalan > 0 && bossaKalan <= (ayar.bossSavunmaOnce ?? 2)) || bossDalgasi;
    if (ayar.sabotaj && mac && dalga >= Math.max(acilis, ayar.suruDalga ?? 4) && (st.lives ?? 15) >= (ayar.suruCan ?? 10) && sav.yeterli && !tehlike && !bossYakinSuru) {
      const sd = suruDurumu(st);
      const s = mac._suru || (mac._suru = { d0: null, rCan0: null, harcanan: 0, kapali: false, d: -1, butce: 0, dHarcanan: 0 });
      if (sd.uygun && !s.kapali) {
        if (s.d0 === null) { s.d0 = dalga; s.rCan0 = st.oppLives ?? 15; }
        if (s.harcanan >= (ayar.suruDenemeAltin ?? 600) && dalga - s.d0 >= (ayar.suruDenemeDalga ?? 3) && (st.oppLives ?? 15) >= s.rCan0) s.kapali = true;
        if (st.oppLives < s.rCan0) { s.rCan0 = st.oppLives; s.d0 = dalga; s.harcanan = 0; }
      }
      if (sd.uygun && !s.kapali) {
        if (s.d !== dalga) { s.d = dalga; s.butce = Math.floor((st.gold || 0) * (ayar.suruOran ?? 0.5)); s.dHarcanan = 0; }
        const kalan = s.butce - s.dHarcanan;
        if (kalan >= 50) return { ...sonuc, gonder: true, neden: "sürü", yedek: Math.max(0, (st.gold || 0) - kalan), alanPay: sd.alanPay };
      }
    }
    const bossSavunma = ayar.bossSavunma !== false && ((bossaKalan > 0 && bossaKalan <= (ayar.bossSavunmaOnce ?? 2)) || bossDalgasi) && !bossaYetiyor;
    if (bossSavunma) return { ...sonuc, bossSavunma: true, tahmin: bossTahmin };
    if (ayar.bossHazirlik !== false && bossaKalan > 0 && bossaKalan <= (ayar.bossHazirlikOnce ?? 2) && bossTahmin !== null && bossTahmin > (ayar.guvenliIlerleme || 0.85)) return { ...sonuc, bossHazirlik: true, tahmin: bossTahmin };
    sonuc.tahmin = bossTahmin;
    sonuc.bossaYetiyor = bossaYetiyor && ((bossaKalan > 0 && bossaKalan <= (ayar.bossSavunmaOnce ?? 2)) || bossDalgasi);
    const rd = mac?.dalgalar || [];
    const ucOnce = rd.length >= 3 ? rd[rd.length - 3].rCan : null;
    const saldiriIsliyor = ucOnce !== null && (st.oppLives ?? 15) < ucOnce;
    const itme = ayar.saldiriItme !== false && R <= 8 && dalga >= 10 && saldiriIsliyor && sav.yeterli && !tehlike;
    if (itme) return { ...sonuc, gonder: true, neden: "saldırı", yedek: Math.max(100, Math.round(st.gold * 0.4)) };
    if (ayar.sabotaj && mac && dalga >= acilis && (st.lives ?? 15) > 4 && !ekonomiAcik) {
      const yr = titanYarisi(st, rd);
      if (yr.aktif) {
        const k = mac._yaris && mac._yaris.d === dalga ? mac._yaris : (mac._yaris = { d: dalga, butce: Math.floor((st.gold || 0) * (ayar.yarisOran ?? 0.6)), harcanan: 0, toplam: mac._yaris?.toplam || 0 });
        const kalan = k.butce - k.harcanan;
        if (kalan >= 300) return { ...sonuc, gonder: true, neden: "titan yarışı", yedek: Math.max(0, (st.gold || 0) - kalan), yr };
      }
    }
    if (ekonomiAcik) return { ...sonuc, gonder: true, neden: "gelir", yedek: ayar.ekonomiYedek ?? 50, takip };
    return sonuc;
  };

  const ONSEL = {
    fast: { acid: 0.25, splash: 0.4, puddle: 0.8, gatling: 0.8 },
    normal: { acid: 0.6, splash: 0.6 },
    tank: { sniper: 0.55, freeze: 0.75, puddle: 0.8 },
    boss: { sniper: 0.55, freeze: 0.75, puddle: 0.8 },
  };
  const OGREN_KEY = "cor3TdBotOgrenme";
  let ogrenme = {};
  try { ogrenme = JSON.parse(localStorage.getItem(OGREN_KEY) || "{}"); } catch {}
  const izlenen = new Map();
  let sonOgrenKayit = 0;

  const kompozisyon = (st) => {
    const c = {};
    for (const t of st.oppTowers || []) c[t.typeId] = (c[t.typeId] || 0) + Math.pow(2, (t.level || 1) - 1) * (1 + 0.1 * ((st.oppTypeLevels || {})[t.typeId] || 0));
    return c;
  };

  const gozlemle = (st) => {
    const yolUz = (st.oppLevelWaypoints || st.level?.waypoints || []).length;
    if (!yolUz) return;
    const simdi = new Set();
    for (const e of st.oppEnemies || []) {
      simdi.add(e.id);
      const kayit = izlenen.get(e.id);
      if (!kayit) izlenen.set(e.id, { tur: e.typeId, en: e.pathIndex || 0, can: e.hp, komp: kompozisyon(st) });
      else { kayit.en = Math.max(kayit.en, e.pathIndex || 0); kayit.can = e.hp; }
    }
    for (const [id, k] of izlenen) {
      if (simdi.has(id)) continue;
      izlenen.delete(id);
      const ilerleme = Math.min(1, k.en / Math.max(1, yolUz - 1));
      const sizdi = ilerleme >= 0.95 && k.can > 0 ? 1 : 0;
      const top = Object.values(k.komp).reduce((x, y) => x + y, 0) || 1;
      const tur = (ogrenme[k.tur] ||= {});
      for (const [t, w] of Object.entries(k.komp)) {
        const pay = w / top;
        const h = (tur[t] ||= { n: 0, ilerleme: 0, sizma: 0 });
        h.n += pay; h.ilerleme += ilerleme * pay; h.sizma += sizdi * pay;
      }
    }
    if (Date.now() - sonOgrenKayit > 10000) {
      sonOgrenKayit = Date.now();
      try { localStorage.setItem(OGREN_KEY, JSON.stringify(ogrenme)); } catch {}
    }
  };

  const rakipAnaliz = (st) => {
    const k = kural(st.level);
    const yol = Array.isArray(st.oppLevelWaypoints) && st.oppLevelWaypoints.length ? st.oppLevelWaypoints : yolAl(st.level);
    const tl = st.oppTypeLevels || {};
    let guc = 0;
    for (const t of st.oppTowers || []) {
      const o = ozellik(k, t.typeId, t.level, tl[t.typeId] ?? 0);
      guc += o.dps * kapsama(t.x, t.y, o.menzil, yol) * 0.8;
    }
    const komp = kompozisyon(st);
    const kompTop = Object.values(komp).reduce((x, y) => x + y, 0) || 1;
    const birimler = (st.level?.incomeUnits || []).map((u) => {
      const tip = u.typeId || "normal";
      const hiz = u.speedMultiplier || 1;
      const hp = u.hp || u.baseHp;
      const hasar = guc / hiz;
      let onsel = 1;
      for (const [t, w] of Object.entries(komp)) onsel *= Math.pow(ONSEL[tip]?.[t] ?? 1, Math.min(1, (w / kompTop) * 2));
      let ogren = null, veri = 0, ogTop = 0;
      for (const [t, w] of Object.entries(komp)) {
        const h = ogrenme[tip]?.[t];
        if (!h || h.n < 3) continue;
        ogTop += (h.ilerleme / h.n) * w; veri += w;
      }
      if (veri > 0) ogren = ogTop / veri;
      const kuram = hasar > 0 ? Math.min(1, hp / hasar) : 1;
      let etki = Math.pow(onsel, 1.5) * (0.7 + 0.3 * kuram);
      if (ogren !== null) etki *= 0.4 + 1.2 * ogren;
      return { id: u.id, tip, cost: u.cost, gelir: u.income || 0, odul: u.reward || 0, hp, onsel: +onsel.toFixed(2), ogrenilen: ogren === null ? null : +ogren.toFixed(2), etki: +etki.toFixed(3) };
    });
    return { guc: Math.round(guc), komp, can: st.oppLives, birimler };
  };

  const titanYarisi = (st, rd) => {
    const agirlik = (ks) => (ks || []).filter((t) => t.typeId !== "universal").reduce((a, t) => a + Math.pow(2, (t.level || 1) - 1), 0);
    const biz = agirlik(st.towers), rakip = agirlik(st.oppTowers);
    const fark = (st.oppIncome || 0) - (st.income || 0);
    const once = rd.length >= 3 ? rd[rd.length - 3].rGelir || 0 : 0;
    const artis = (st.oppIncome || 0) - once;
    const azKule = rakip <= biz * (ayar.yarisKuleOran ?? 0.7);
    const aktif = azKule && (fark >= (ayar.yarisFark ?? 150) || artis >= (ayar.yarisArtis ?? 140));
    return { aktif, biz, rakip, fark, artis };
  };

  const suruDurumu = (st) => {
    const kuleler = (st.oppTowers || []).filter((t) => t.typeId !== "universal");
    if (kuleler.length < (ayar.suruMinKule ?? 3)) return { uygun: false, alanPay: null };
    const komp = kompozisyon(st);
    delete komp.universal;
    const top = Object.values(komp).reduce((x, y) => x + y, 0) || 1;
    const alan = (komp.splash || 0) + (komp.acid || 0) + (komp.puddle || 0) + 0.5 * (komp.gatling || 0);
    const alanPay = +(alan / top).toFixed(2);
    return { uygun: alanPay <= (ayar.suruAlanEsik ?? 0.15), alanPay };
  };

  const birimSec = (st, yedek, neden) => {
    const tum = st.level?.incomeUnits || [];
    const uygun = tum.filter((b) => st.gold - b.cost >= yedek);
    if (neden === "titan yarışı") {
      const titan = tum.find((u) => u.id === "titan") || tum.slice().sort((a, b) => b.cost - a.cost)[0];
      return titan && st.gold - titan.cost >= yedek ? titan : null;
    }
    if (neden === "sürü") {
      const hizli = uygun.filter((u) => u.typeId === "fast").sort((a, b) => a.cost - b.cost);
      return hizli[0] || uygun.sort((a, b) => a.cost - b.cost)[0] || null;
    }
    if (neden === "gelir") {
      const R = kalanDalga(st);
      const iyi = tum.filter((u) => (u.income || 0) / u.cost >= (ayar.gelirMinOran ?? 0.11) && ((u.income || 0) / u.cost) * R * 0.8 > 1).sort((x, y) => (y.income / y.cost) - (x.income / x.cost));
      if (!iyi.length) return null;
      if (ayar.yalnizTitan) iyi.length = 1;
      const en = iyi[0];
      if (st.gold - en.cost >= yedek) return en;
      const ikinci = iyi.find((u) => st.gold - u.cost >= yedek);
      if (ikinci && st.gold >= en.cost * 0.75) return null;
      return ikinci || null;
    }
    if (!uygun.length) return null;
    if (ayar.acidHizliYok !== false) {
      const kmp = kompozisyon(st);
      const kt = Object.values(kmp).reduce((x, y) => x + y, 0) || 1;
      const oldurucu = ((kmp.acid || 0) + (kmp.puddle || 0)) / kt;
      if (oldurucu >= (ayar.acidPayEsik ?? 0.2)) {
        const kalan = uygun.filter((u) => u.typeId !== "fast");
        if (!kalan.length) return null;
        uygun.length = 0; uygun.push(...kalan);
      }
    }
    if (neden === "boss karşı sabotaj" || neden === "erken öldürme") {
      const komp = kompozisyon(st);
      const top = Object.values(komp).reduce((x, y) => x + y, 0) || 1;
      const sizma = (tip) => {
        let v = 0, w = 0;
        for (const [t, a] of Object.entries(komp)) {
          const h = ogrenme[tip]?.[t];
          const s = h && h.n >= 3 ? h.sizma / h.n : Math.max(0, (ONSEL_KULE[tip]?.[t] ?? 0.35) - 0.2) * 0.45;
          v += s * a; w += a;
        }
        return w > 0 ? v / w : 0;
      };
      const R = kalanDalga(st);
      const secilebilir = uygun.filter((u) => sizma(u.typeId || "normal") >= (ayar.sizmaMin ?? 0.05) || (u.income || 0) / u.cost >= 0.12);
      if (!secilebilir.length) return null;
      uygun.length = 0; uygun.push(...secilebilir);
      const puan = (u) => (sizma(u.typeId || "normal") * 100 + ((u.income || 0) * R * 0.8 - u.cost) * 0.05) / u.cost;
      return uygun.sort((a, b) => puan(b) - puan(a))[0];
    }
    if (!ayar.rakipAnaliz) return uygun.sort((a, b) => b.cost - a.cost)[0];
    const r = rakipAnaliz(st);
    const puan = (u) => {
      const a = r.birimler.find((x) => x.id === u.id);
      if (!a) return -1;
      return (a.gelir - a.odul * (1 - Math.min(1, a.etki))) / u.cost * a.etki;
    };
    return uygun.sort((a, b) => puan(b) - puan(a))[0];
  };

  let sonLobi = 0;
  let lobiSonraki = 0;
  let aksiyonSonraki = 0;
  let molaBitis = 0;
  const rastgele = (a, b) => a + Math.random() * Math.max(0, b - a);
  const lobiBekleme = () => (ayar.insanGibi ? rastgele(1200, 3500) : 1500);
  const aksiyonBekleme = () => {
    if (!ayar.insanGibi) return ayar.aralik;
    let ms = rastgele(ayar.beklemeMin, ayar.beklemeMax);
    if (Math.random() < 0.06) ms += rastgele(2000, 6000);
    return ms;
  };
  const MOLA_KEY = "cor3TdBotMola";
  let kayipMolasi = false;
  try { const m = JSON.parse(sessionStorage.getItem(MOLA_KEY) || "null"); if (m && m.bitis > Date.now()) { molaBitis = m.bitis; kayipMolasi = !!m.kayip; } } catch {}
  const molaVer = (kayip) => {
    let bitis = 0;
    if (ayar.insanGibi) {
      let sn = rastgele(ayar.molaMin, ayar.molaMax);
      if (ayar.uzunAraHer > 0 && oturumMac > 0 && oturumMac % ayar.uzunAraHer === 0) sn += ayar.uzunAraDk * 60 * rastgele(0.7, 1.3);
      bitis = Date.now() + sn * 1000;
    }
    const kayipBitis = kayip && (ayar.kayipMolaDk || 0) > 0 ? Date.now() + ayar.kayipMolaDk * 60000 : 0;
    kayipMolasi = kayipBitis > bitis;
    molaBitis = Math.max(bitis, kayipBitis);
    try { sessionStorage.setItem(MOLA_KEY, JSON.stringify({ bitis: molaBitis, kayip: kayipMolasi })); } catch {}
  };
  const molada = () => {
    if (Date.now() >= molaBitis) return false;
    if (!ayar.insanGibi && !kayipMolasi) return false;
    const kalan = Math.ceil((molaBitis - Date.now()) / 1000);
    sonIs = kayipMolasi ? `kayıp sonrası bekleme (${Math.floor(kalan / 60)} dk ${kalan % 60} sn)` : kalan > 90 ? `uzun ara (${Math.ceil(kalan / 60)} dk)` : `mola (${kalan} sn)`;
    return true;
  };
  const gorunur = (el) => el && el.isConnected && el.getClientRects().length > 0;
  const bul = (sec) => [...document.querySelectorAll(sec)].find(gorunur) || null;
  const metinliButon = (metin) => [...document.querySelectorAll("button")].find((b) => gorunur(b) && !b.disabled && b.textContent.trim() === metin) || null;
  const tikla = (el, is) => { el.click(); sonIs = is; sonLobi = Date.now(); lobiSonraki = sonLobi + lobiBekleme(); sayac.lobi++; return true; };

  const ONCELIK = ["gatling", "basic", "sniper", "splash", "universal", "freeze", "synergy", "acid", "puddle", "swap"];

  const destePuani = () => {
    let h = null;
    try { h = JSON.parse(localStorage.getItem(HARITA_KEY) || "null"); } catch {}
    if (!h || !h.yol?.length) return null;
    const yolSet = new Set(h.yol.map((w) => w.x + "," + w.y));
    const hucreler = [];
    for (let y = 0; y < h.rows; y++) for (let x = 0; x < h.cols; x++) if (!yolSet.has(x + "," + y)) hucreler.push([x, y]);
    if (!hucreler.length) return null;
    const puan = {};
    for (const t of Object.keys(MENZIL)) {
      let top = 0;
      const r = ozellik(kural(null), t, 1, 0).menzil;
      for (const [x, y] of hucreler) top += kapsama(x, y, r, h.yol);
      puan[t] = ozellik(kural(null), t, 1, 0).dps * top / hucreler.length;
    }
    return puan;
  };

  let desteDeneme = {};
  let desteBitti = false;
  const desteLog = [];

  const DENEY_KEY = "cor3TdBotDeney";
  let deneySayac = {};
  try { deneySayac = JSON.parse(localStorage.getItem(DENEY_KEY) || "{}"); } catch {}
  let deneyHedef = null;
  const DENEY_SONUC_KEY = "cor3TdBotDeneySonuc";
  let deneySonuc = {};
  try { deneySonuc = JSON.parse(localStorage.getItem(DENEY_SONUC_KEY) || "{}"); } catch {}
  const enIyiDeste = () => {
    let en = null;
    for (const [k, r] of Object.entries(deneySonuc)) {
      if (!deneyListesi().some((d) => desteAnahtar(d) === k)) continue;
      const n = Math.max(1, r.n), kayip = r.n - r.g;
      const puan = ((r.g + 1) / (r.n + 2)) * 100 + 2 * ((r.can || 0) / n) + (kayip > 0 ? (r.kayipDalga || 0) / kayip / 2 : 0);
      if (!en || puan > en.puan) en = { k, puan, ...r };
    }
    return en;
  };
  const ayarYaz = (degisim) => {
    Object.assign(ayar, degisim);
    kaydet();
    try { window.postMessage({ kaynak: "cor3td-bot", ayarYaz: degisim }, location.origin); } catch {}
  };
  const desteAnahtar = (l) => [...l].sort().join("+");
  const desteCoz = (m) => String(m || "").split(/[,+\s]+/).map((x) => x.trim().toLowerCase()).filter(Boolean);
  const deneyListesi = () => String(ayar.deneyDesteleri || "").split(/\n|;/).map(desteCoz).filter((l) => l.length);
  const deneyBitti = () => deneyListesi().every((d) => (deneySayac[desteAnahtar(d)] || 0) >= ayar.deneyMac);
  const istenenDeste = () => {
    if (ayar.deney) {
      if (!deneyHedef) {
        const l = deneyListesi().filter((d) => (deneySayac[desteAnahtar(d)] || 0) < ayar.deneyMac);
        l.sort((a, b) => (deneySayac[desteAnahtar(a)] || 0) - (deneySayac[desteAnahtar(b)] || 0));
        deneyHedef = l[0] || null;
      }
      return deneyHedef;
    }
    const sabit = desteCoz(ayar.sabitDeste);
    return sabit.length ? sabit : null;
  };

  const desteDuzelt = () => {
    if (desteBitti) return false;
    const kartlar = [...document.querySelectorAll('[data-component-name="TowerSelectionCard"]')]
      .map((el) => ({ el, p: yukariAra(el, (x) => "typeId" in x && "isSelected" in x) }))
      .filter((k) => k.p);
    if (!kartlar.length) return false;
    const baslik = yukariAra(bul('[data-component-name="TdDeckSelectHeader"]'), (x) => "deckSize" in x);
    if (!baslik?.deckSize) { sonIs = "deste boyutu bekleniyor"; return true; }
    const boyut = baslik.deckSize;
    const puan = destePuani();
    const sira = (t) => {
      if (t === "universal") return -1e9;
      if (t === "swap" && ayar.swapYerlestir) return -1e8;
      if (puan) return -(puan[t] ?? 0);
      const i = ONCELIK.indexOf(t); return i < 0 ? 99 : i;
    };
    const turler = [...new Set(kartlar.map((k) => k.p.typeId))].sort((a, b) => sira(a) - sira(b) || a.localeCompare(b));
    const sirali = ayar.swapYerlestir && turler.includes("swap") ? ["swap", ...turler.filter((t) => t !== "swap")] : turler;
    const zorunlu = istenenDeste();
    const hedef = zorunlu ? new Set(zorunlu.filter((t) => turler.includes(t)).slice(0, boyut)) : new Set(sirali.slice(0, boyut));
    if (zorunlu && hedef.size < Math.min(boyut, zorunlu.length)) { sonIs = "istenen destede olmayan kule var"; }
    const secili = kartlar.filter((k) => k.p.isSelected).map((k) => k.p.typeId);
    const sec = (k, is) => {
      const t = k.p.typeId;
      desteDeneme[t] = (desteDeneme[t] || 0) + 1;
      desteLog.push({ zaman: new Date().toLocaleTimeString(), is, tur: t, hedef: [...hedef], secili, boyut });
      if (desteLog.length > 50) desteLog.shift();
      if (desteDeneme[t] > 2) { desteBitti = true; sonIs = `deste: ${t} oturmuyor, mevcut desteyle devam`; return false; }
      return tikla(k.el, `${is} ${t}`);
    };
    const cikar = kartlar.find((k) => k.p.isSelected && !hedef.has(k.p.typeId));
    if (cikar) return sec(cikar, "desteden çıkar");
    if (secili.length < boyut) {
      const ekle = kartlar.find((k) => !k.p.isSelected && hedef.has(k.p.typeId) && !secili.includes(k.p.typeId));
      if (ekle) return sec(ekle, "desteye ekle");
    }
    return false;
  };

  const TD_ID = "019d2f40-8e2c-7c41-9b5e-5a8c7a4d2e10";
  const GC_ID = "019a0c41-b17f-7abc-1234-567890abcde2";
  const uygulamalar = () => [...document.querySelectorAll('[data-component-name^="Application-"]')].filter(gorunur);
  const uygulamaId = (el) => el.getAttribute("data-component-name").slice("Application-".length);
  const tdMi = (el) => uygulamaId(el) === TD_ID || !!el.querySelector('[data-component-name^="TowerDefense"],[data-component-name^="TdDeck"],[data-component-name^="TdBattle"],[data-component-name="TdRunOverModal"]');
  const gcMi = (el) => uygulamaId(el) === GC_ID || !!el.querySelector(".game-center-grid");

  const gcSekmesi = () => {
    const dogrudan = bul(`[data-component-name="TabBarItem-${GC_ID}"]`);
    if (dogrudan) return dogrudan;
    for (const el of document.querySelectorAll('[data-component-name^="TabBarItem-"]')) {
      if (!gorunur(el)) continue;
      const ad = el.getAttribute("data-component-name").slice("TabBarItem-".length);
      if (/game.?center/i.test(ad)) return el;
      const p = yukariAra(el, (x) => Object.values(x).some((v) => v === GC_ID || (typeof v === "string" && /game.?center/i.test(v)) || (v && typeof v === "object" && !Array.isArray(v) && (v.id === GC_ID || v.applicationId === GC_ID))));
      if (p) return el;
    }
    return null;
  };

  const pencereler = () => {
    if (planMesgul || helperMesgul) return false;
    const acik = uygulamalar();
    const td = acik.find(tdMi);
    const macta = !!savasProps() || !!bul('[data-component-name="MatchSearchWaiting"]') || !!bul('[data-component-name="MatchSearchTime"]');
    if (ayar.pencereKapat && !macta && !planMesgul && !helperMesgul) {
      const fazla = acik.find((el) => !tdMi(el) && !(gcMi(el) && !td));
      const kapat = fazla && fazla.querySelector('[data-component-name="close-app-btn"]');
      if (kapat) return tikla(kapat, "pencere kapat");
      const diyalog = bul('[data-component-name="DialogWindowClose"]') || bul('[data-component-name="AchievementDetailClose"]') || bul('[data-component-name="SharePopupClose"]');
      if (diyalog) return tikla(diyalog, "açılır pencere kapat");
    }
    if (td) return false;
    const gc = acik.find(gcMi);
    if (gc) {
      const kart = [...gc.querySelectorAll(".game-center-card")].find((b) => /tower\s*defen[cs]e/i.test(b.querySelector(".game-center-card-title")?.textContent || b.textContent));
      if (kart) return tikla(kart, "Tower Defense aç");
      sonIs = "Oyun Merkezi'nde Tower Defense kartı yok";
      return true;
    }
    const sekme = gcSekmesi();
    if (sekme) return tikla(sekme, "Oyun Merkezi aç (alt menü)");
    const kisayol = bul(`[data-component-name="DesktopShortcut"][data-app-id="${GC_ID}"]`);
    if (kisayol) {
      kisayol.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
      kisayol.dispatchEvent(new MouseEvent("dblclick", { bubbles: true, cancelable: true, view: window, detail: 2 }));
      sonIs = "Oyun Merkezi aç"; sonLobi = Date.now(); lobiSonraki = sonLobi + lobiBekleme(); sayac.lobi++;
      return true;
    }
    sonIs = "Oyun Merkezi bulunamadı (alt menü / masaüstü)";
    return true;
  };

  const KOSU_KEY = "cor3TdBotKosular";
  let kosuKayit = [];
  try { kosuKayit = JSON.parse(localStorage.getItem(KOSU_KEY) || "[]"); } catch {}
  let kosuDeneme = 0;
  const bakiye = () => {
    const m = (document.body?.innerText || "").match(/BALANCE\s*(?:\S\s*)?CR\s*([\d.,]+)/);
    if (!m) return null;
    const n = Number(m[1].replace(/[.,](?=\d{3}(?!\d))/g, ""));
    return Number.isFinite(n) ? n : null;
  };
  const crYeter = (maliyet) => {
    if (!(ayar.crAltSinir > 0)) return true;
    const b = bakiye();
    return b !== null && b - (maliyet || 1000) >= ayar.crAltSinir;
  };
  const kosuHakki = () => !(ayar.kosuLimiti > 0) || kosuKayit.filter((k) => k.zaman >= (ayar.kosuSayacBaslangic || "")).length < ayar.kosuLimiti;

  let rematchBekle = 0;
  const rematchZor = (st) => {
    if (ayar.rematchKac === false) return null;
    const d = Math.max(st.currentWave || 0, mac?.dalga || 0);
    if (d >= (ayar.rematchUzunDalga ?? 30)) return `maç uzun sürdü (${d}. dalga)`;
    const enAz = Math.min(st.lives ?? 15, ...(mac?.dalgalar || []).map((w) => w.can ?? 15));
    if (enAz <= (ayar.rematchRiskCan ?? 7)) return `riskliydi (can en az ${enAz})`;
    if ((st.oppIncome || 0) > (st.income || 0)) return `rakip gelirde öndeydi (${st.oppIncome}/${st.income})`;
    return null;
  };
  let planMesgul = false;
  let helperMesgul = false;
  let helperNeden = null;
  const lobi = () => {
    if (!ayar.otomatik) return false;
    if (Date.now() < lobiSonraki) return true;
    if (pencereler()) return true;

    const kosuBitti = bul('[data-component-name="TdRunOverAction"]');
    if (kosuBitti) return tikla(kosuBitti, "koşu bitti, menü");

    const overlay = [...document.querySelectorAll('[data-component-name="TowerDefenseOverlayBtn"]')].filter((b) => gorunur(b));
    const spx = savasProps();
    const stx = spx?.ana.stateRef.current;
    const zor = ayar.rematch && stx?.phase === "game_over" && stx.winner === spx?.ana.playerIndex ? rematchZor(stx) : null;
    if (ayar.rematch && !ayar.sonrakindeDur && stx?.phase === "game_over" && overlay.length) {
      const kazandik = stx.winner === spx.ana.playerIndex;
      if (kazandik && !zor) {
        const rm = overlay.find((b) => !b.disabled && /^Rematch \(/.test(b.textContent.trim()));
        if (rm) { rematchBekle = 0; return tikla(rm, "kazandık, rematch"); }
        if (overlay.some((b) => /Waiting|Starting/.test(b.textContent))) { sonIs = "rematch: rakip bekleniyor"; return true; }
        if (!rematchBekle) rematchBekle = Date.now();
        if (Date.now() - rematchBekle < (ayar.rematchBekleSn ?? 8) * 1000) { sonIs = "rematch teklifi bekleniyor"; return true; }
      }
    }
    rematchBekle = 0;
    const menu = overlay.find((b) => !b.disabled && b.textContent.trim() === "Go to menu");
    if (menu) return tikla(menu, zor ? `kazandık ama ${zor}, rematch yok` : stx?.phase === "game_over" && stx.winner !== spx?.ana.playerIndex ? "kaybettik, menüye" : "maç bitti, menü");

    if (bul('[data-component-name="MatchSearchWaiting"]') || bul('[data-component-name="MatchSearchTime"]')) {
      if ((planMesgul || helperMesgul || ayar.sonrakindeDur) && !spx) {
        const iptal = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Cancel searching");
        if (iptal && ayar.sonrakindeDur && !planMesgul && !helperMesgul) { ayarYaz({ acik: false, sonrakindeDur: false }); return tikla(iptal, "maç bitince dur: arama iptal, bot kapatıldı"); }
        if (iptal) return tikla(iptal, planMesgul ? "planlayıcı sırada, rakip arama iptal" : (helperNeden ? helperNeden + ", rakip arama iptal" : "Helper çalışıyor, rakip arama iptal"));
      }
      sonIs = "rakip aranıyor";
      return true;
    }

    const satinAl = bul('[data-component-name="LobbyBuyModalStart"]');
    if (satinAl) {
      if (ayar.kosuSatinAl && kosuHakki() && kosuDeneme >= 3) { sonIs = "koşu satın alınamadı (CR yetersiz olabilir), durdu"; return true; }
      const maliyet = Number((satinAl.textContent.match(/[\d.,]+/) || ["1000"])[0].replace(/[.,]/g, "")) || 1000;
      if (ayar.kosuSatinAl && kosuHakki() && !crYeter(maliyet)) { sonIs = `CR sınırı: bakiye ${bakiye()} - ${maliyet} < ${ayar.crAltSinir}, durdu`; return true; }
      if (ayar.kosuSatinAl && kosuHakki()) {
        kosuDeneme++;
        kosuKayit.push({ zaman: new Date().toISOString(), metin: satinAl.textContent.trim() });
        try { localStorage.setItem(KOSU_KEY, JSON.stringify(kosuKayit)); } catch {}
        return tikla(satinAl.closest("button") || satinAl, "koşu satın al: " + satinAl.textContent.trim());
      }
      sonIs = "koşu satın alma kapalı";
      return true;
    }

    if (bul('[data-component-name="TdDeckSelectScreen"]')) {
      if (ayar.desteSec && desteDuzelt()) return true;
      const basla = bul('button[aria-label="Start Match"]');
      if (basla && !basla.disabled && molada()) return true;
      if (ayar.sonrakindeDur) { ayarYaz({ acik: false, sonrakindeDur: false }); sonIs = "maç bitti, 'maç bitince dur' ile bot kapatıldı"; return true; }
      if (planMesgul || helperMesgul) { sonIs = planMesgul ? "planlayıcı çalışıyor, yeni maç bekliyor" : (helperNeden ? helperNeden + ", yeni maç bekliyor" : "Helper çalışıyor, yeni maç bekliyor"); return true; }
      if (basla && !basla.disabled) { desteBitti = false; desteDeneme = {}; if (mac === null || mac.bitti) bekleyenDeney = deneyHedef ? desteAnahtar(deneyHedef) : null; return tikla(basla, "maç başlat"); }
      sonIs = "deste eksik";
      return true;
    }

    if (bul('[data-component-name="TowerDefenseLobby"]')) {
      if (ayar.sonrakindeDur) { ayarYaz({ acik: false, sonrakindeDur: false }); sonIs = "maç bitti, 'maç bitince dur' ile bot kapatıldı"; return true; }
      if (planMesgul || helperMesgul) { sonIs = planMesgul ? "planlayıcı çalışıyor, yeni maç bekliyor" : (helperNeden ? helperNeden + ", yeni maç bekliyor" : "Helper çalışıyor, yeni maç bekliyor"); return true; }
      if (ayar.macLimiti > 0 && oturumMac >= ayar.macLimiti) { sonIs = `${oturumMac} maç tamamlandı, durdu`; return true; }
      if (ayar.deney && deneyBitti()) {
        const en = enIyiDeste();
        if (ayar.deneySonraRating && en) {
          ayarYaz({ deney: false, sabitDeste: en.k.split("+").join(" "), mod: "rating", kosuSatinAl: true, kosuSayacBaslangic: new Date().toISOString() });
          sonIs = `deney bitti, en iyi ${en.k} (${en.g}/${en.n}), rating'e geçildi`;
          return true;
        }
        sonIs = "deste deneyi tamamlandı";
        return true;
      }
      deneyHedef = null;
      if (molada()) return true;
      desteBitti = false;
      desteDeneme = {};
      if (ayar.mod === "rating") {
        const r = bul('button[aria-label="Start Rating Match"]');
        if (r && !r.disabled) { kosuDeneme = 0; return tikla(r, "rating maçı"); }
        if (kosuDeneme >= 3) { sonIs = "koşu satın alınamadı (CR yetersiz olabilir), durdu"; return true; }
        const yeni = bul('button[aria-label="Rating Mode"]');
        if (yeni && !yeni.disabled && ayar.kosuSatinAl && kosuHakki() && !crYeter(1000)) { sonIs = `CR sınırı: bakiye ${bakiye()}, en az ${ayar.crAltSinir} kalmalı, durdu`; return true; }
        if (yeni && !yeni.disabled && ayar.kosuSatinAl && kosuHakki()) return tikla(yeni, "rating koşusu aç");
        sonIs = ayar.kosuSatinAl && !kosuHakki() ? `koşu sınırı doldu (${kosuKayit.length}), durdu` : "rating koşusu yok";
        return true;
      }
      const f = bul('[data-component-name="TowerDefenseLobbyFreePlay"]');
      if (f) return tikla(f, "free play");
    }
    return false;
  };

  let sonRejoin = 0;
  const yenidenBaglan = () => {
    const b = bul('[data-component-name="TdConnectionRejoin"]');
    if (!b || b.disabled || Date.now() - sonRejoin < 4000) return false;
    sonRejoin = Date.now();
    b.click();
    sayac.yenidenBaglan = (sayac.yenidenBaglan || 0) + 1;
    sonIs = "bağlantı koptu: maça geri dönülüyor";
    return true;
  };
  let bekciImza = "", bekciZaman = Date.now();
  const BEKCI_KEY = "cor3TdBotBekci";
  const bekci = () => {
    const sp = savasProps();
    const st = sp?.ana.stateRef.current;
    const imza = [!!sp, st?.phase, st?.currentWave, sonIs].join("|");
    if (imza !== bekciImza) { bekciImza = imza; bekciZaman = Date.now(); return; }
    if (!ayar.acik || !ayar.otomatik || ayar.bekci === false) { bekciZaman = Date.now(); return; }
    if (sp && st?.phase !== "game_over") { bekciZaman = Date.now(); return; }
    if (bul('[data-component-name="MatchSearchWaiting"]') || bul('[data-component-name="MatchSearchTime"]')) { bekciZaman = Date.now(); return; }
    if (Date.now() < molaBitis || /durdu|rating koşusu yok/.test(sonIs)) { bekciZaman = Date.now(); return; }
    if (planMesgul || helperMesgul) { bekciZaman = Date.now(); return; }
    if (Date.now() - bekciZaman < (ayar.bekciDk || 5) * 60000) return;
    let gecmis = [];
    try { gecmis = JSON.parse(sessionStorage.getItem(BEKCI_KEY) || "[]").filter((t) => Date.now() - t < 3600000); } catch {}
    if (gecmis.length >= 3) { sonIs = "bekçi: 1 saatte 3 yenileme yapıldı, bekliyor"; bekciZaman = Date.now(); return; }
    gecmis.push(Date.now());
    try { sessionStorage.setItem(BEKCI_KEY, JSON.stringify(gecmis)); } catch {}
    location.reload();
  };

  const adim = () => {
    if (!ayar.acik) return;
    if (yenidenBaglan()) return;
    if (Date.now() < aksiyonSonraki) return;
    const sp = savasProps();
    if (!sp || sp.ana.stateRef.current?.phase === "game_over") { if (!lobi()) sonIs = "maç yok"; return; }
    const { ana, alan } = sp;
    const st = ana.stateRef.current || ana.state;
    if (!st) return;

    if (ayar.hazir && st.phase === "waiting" && ana.isReady === false && typeof ana.sendReady === "function") {
      ana.sendReady();
      sonIs = "hazır";
      sonAksiyon = Date.now();
      return;
    }
    if (st.phase !== "playing") { if (!lobi()) sonIs = "faz: " + st.phase; return; }
    try { gozlemle(st); } catch {}

    const kuleler = st.towers || [];
    if (ayar.birlestir) {
      const m = birlesmeBul(kuleler, yolAl(st.level), st);
      if (m) {
        ana.mergeTowers(m.b.x, m.b.y, m.s.x, m.s.y);
        sayac.birlestir++;
        sonIs = `birleştir ${m.b.typeId} L${m.b.level}${m.olu ? " (vuramayan kule)" : ""}`;
        sonAksiyon = Date.now();
        return;
      }
    }

    const yol = yolAl(st.level);
    aktifDeste = Array.isArray(ana.selectedDeck) && ana.selectedDeck.length ? ana.selectedDeck : null;
    if (ayar.swapYerlestir && typeof ana.swapTowers === "function") {
      const yr = yerlestir(st, yol);
      if (yr) {
        ana.swapTowers(yr.S.x, yr.S.y, yr.T.x, yr.T.y);
        sayac.tasi = (sayac.tasi || 0) + 1;
        sonIs = `taşı ${yr.T.typeId} L${yr.T.level} (${yr.T.x},${yr.T.y}) -> (${yr.S.x},${yr.S.y})`;
        sonAksiyon = Date.now();
        return;
      }
    }
    const bosHucre = (st.buildableSet?.size ?? Infinity) - kuleler.length;
    const kuleMal = alan?.randomTowerCost ?? 100 + 10 * (st.buildCount || 0);
    const kuleOran = bosHucre > 0 ? kuleAlmaDegeri(st, yol) / kuleMal * ayar.kuleTercih : 0;
    const alabilir = bosHucre > 0 && st.gold >= kuleMal && (alan ? alan.canBuyRandomTower : true);
    const sab = sabotajDurumu(st);
    const yEsik = sab.biriktir ? ayar.minOran * 4 : sab.tehlike ? 0.0001 : ayar.minOran;
    const erkenDonem = ayar.erkenTitan !== false && (st.currentWave || 0) < (ayar.erkenTitanDalga ?? 9);
    const erkenCanGitti = (mac?.dalgalar || []).some((w) => w.can < (st.level?.startLives || 15)) || st.lives < (st.level?.startLives || 15);
    const yeterlik = erkenDonem ? hasarYeter(st, ayar.erkenBakis ?? 1) : null;
    const tehlikeli = sab.sav.canDustu || (sab.tehlike && !sab.sav.sabit) || (st.lives ?? 15) <= 4;
    const serbest = tehlikeli || sab.bossSavunma || sab.bossHazirlik;
    const erkenDeploy = ((ayar.erkenDeploy !== false && erkenDonem) || ayar.deployOnce !== false) && bosHucre > 0;
    const gecBasla = (st.currentWave || 0) < (ayar.yukseltmeDalga ?? 0) && (st.lives ?? 15) > (ayar.yukseltmeAcilCan ?? 5) && !(bosHucre <= 0 && !sab.sav.yeterli);
    const y = ayar.yukselt && !erkenDeploy && !gecBasla && !(erkenDonem && ayar.erkenYukseltme === false && !erkenCanGitti && yeterlik.yeter) ? yukseltmeKarti(st, yol, yEsik, serbest) : null;
    const gec = ayar.gecOyun !== false && ayar.sabotaj && (st.currentWave || 0) >= Math.max(ayar.gecOyunDalga ?? 0, st.level?.incomeUnlockWave ?? 3) && bosHucre <= 0 && !(y && y.verim >= (ayar.gecVerimEsik ?? 1));
    const yUstun = y && y.puan > kuleOran;
    const yCokUstun = y && y.puan > kuleOran * 1.5;
    sonKarar = { kuleOran: +kuleOran.toFixed(3), kuleMal, bosHucre, gec, serbest, yukseltme: y ? { tur: y.p.typeId, puan: +y.puan.toFixed(3), verim: +y.verim.toFixed(2), maliyet: y.g.maliyet, yetiyor: y.yetiyor } : null };

    if (ayar.ikiliSeviye > 0 && !gecBasla && !erkenDeploy && !sab.gonder && !(ayar.erkenTitan !== false && (st.currentWave || 0) < (ayar.erkenTitanDalga ?? 9))) {
      const say = {};
      for (const t of kuleler) if (t.typeId !== "universal" && t.typeId !== "swap") say[t.typeId] = (say[t.typeId] || 0) + 1;
      const adaylar = Object.entries(say).filter(([t, n]) => n >= 2 && (st.typeLevels?.[t] ?? 0) < ayar.ikiliSeviye && !(t === "puddle" && ayar.puddleAz !== false && (st.currentWave || 0) < (ayar.puddleDalga ?? 25))).sort((a, b) => b[1] - a[1]);
      if (adaylar.length) {
        const [tur] = adaylar[0];
        const kart = [...document.querySelectorAll('[data-component-name="TdBattleTowerCard"]')].map((el) => ({ el, p: yukariAra(el, (x) => "typeLevel" in x && typeof x.onUpgrade === "function") })).find((x) => x.p && x.p.typeId === tur);
        const maliyet = turSeviye(kural(st.level), (st.typeLevels?.[tur] ?? 0) + 1).cost;
        if (kart && !kart.el.disabled && st.gold >= maliyet) {
          kart.p.onUpgrade(tur);
          sayac.yukselt++;
          harca("yukseltme", maliyet, tur);
          sonIs = `ikili kural: ${tur} yükselt (${maliyet})`;
          sonAksiyon = Date.now();
          return;
        }
        if (kart) { sonIs = `ikili kural: ${tur} için biriktir (${st.gold}/${maliyet})`; return; }
      }
    }

    if (ayar.ilkSeviye !== false && ayar.yukselt && (ayar.turTavan ?? 1) !== 0 && (st.currentWave || 0) >= (ayar.ilkSeviyeDalga ?? 9)) {
      const varTur = new Set(kuleler.map((t) => t.typeId).filter((t) => t !== "universal" && t !== "swap" && !(t === "puddle" && ayar.puddleAz !== false && (st.currentWave || 0) < (ayar.puddleDalga ?? 25))));
      const kart = [...document.querySelectorAll('[data-component-name="TdBattleTowerCard"]')].map((el) => ({ el, p: yukariAra(el, (x) => "typeLevel" in x && typeof x.onUpgrade === "function") })).find((x) => x.p && varTur.has(x.p.typeId) && (st.typeLevels?.[x.p.typeId] ?? 0) === 0 && !x.el.disabled);
      const maliyet = kart ? turSeviye(kural(st.level), 1).cost : 0;
      if (kart && st.gold >= maliyet) {
        kart.p.onUpgrade(kart.p.typeId);
        sayac.yukselt++;
        harca("yukseltme", maliyet, kart.p.typeId);
        sonIs = `ilk seviye: ${kart.p.typeId} (${maliyet})`;
        sonAksiyon = Date.now();
        return;
      }
    }
    {
      const dl = st.currentWave || 0;
      const tU = (st.level?.incomeUnits || []).find((u) => u.id === "titan");
      const ilkAc = st.level?.incomeUnlockWave ?? 3;
      if (ayar.sabotaj && mac && tU && dl >= ilkAc && dl <= (ayar.ilkTitanDalga ?? 10) && mac._ilkTitan !== dl && (st.lives ?? 15) >= (ayar.ilkTitanCan ?? 5) && kuleler.length >= (ayar.erkenMinKule ?? 3)) {
        if (st.gold >= tU.cost) {
          ana.sendIncomeUnit(tU.id);
          mac._ilkTitan = dl;
          sayac.sabotaj++;
          harca("birim", tU.cost, tU.id);
          sonIs = `ilk ${ayar.ilkTitanDalga ?? 10} dalga: her dalga titan (${dl}. dalga)`;
          sonAksiyon = Date.now();
          return;
        }
        const hyIlk = hasarYeter(st, 1);
        if (hyIlk.yeter || hyIlk.tahmin === null) {
          sonIs = `ilk ${ayar.ilkTitanDalga ?? 10} dalga: titan için biriktir (${st.gold}/${tU.cost})`;
          return;
        }
      }
    }
    if (ayar.sabotaj && sab.gonder && (sab.neden === "boss karşı sabotaj" || sab.neden === "erken öldürme" || sab.neden === "sürü" || sab.neden === "titan yarışı")) {
      const kb = birimSec(st, sab.yedek, sab.neden);
      if (kb) {
        ana.sendIncomeUnit(kb.id);
        sayac.sabotaj++;
        harca("birim", kb.cost, kb.id);
        if (sab.neden === "titan yarışı") {
          if (mac?._yaris) { mac._yaris.harcanan += kb.cost; mac._yaris.toplam = (mac._yaris.toplam || 0) + kb.cost; }
          sonIs = `titan yarışı: ${kb.id} (rakip gelir +${sab.yr.fark}, son 3 dalga +${sab.yr.artis}, kule ağırlığı ${sab.yr.rakip}/${sab.yr.biz})`;
          sonAksiyon = Date.now();
          return;
        }
        if (sab.neden === "sürü") {
          if (mac?._suru) { mac._suru.harcanan += kb.cost; mac._suru.dHarcanan += kb.cost; mac._suru.toplam = (mac._suru.toplam || 0) + kb.cost; }
          sonIs = `sürü: ${kb.id} (rakipte alan hasarı payı ${sab.alanPay})`;
          sonAksiyon = Date.now();
          return;
        }
        if (sab.neden === "erken öldürme") {
          if (mac?._eo) mac._eo.harcanan += kb.cost;
          sonIs = `erken öldürme: ${kb.id} (rakip zayıf ${sab.rz?.tahmin})`;
          sonAksiyon = Date.now();
          return;
        }
        if (mac?._karsi) mac._karsi.harcanan += kb.cost;
        sonIs = `boss ${sab.boss} karşı sabotaj: ${kb.id} (${mac?._karsi ? mac._karsi.harcanan + "/" + mac._karsi.butce : kb.cost})`;
        sonAksiyon = Date.now();
        return;
      }
    }
    if (gec) {
      const gb = birimSec(st, -1e9, "geç oyun");
      if (gb && st.gold >= gb.cost) {
        ana.sendIncomeUnit(gb.id);
        sayac.sabotaj++;
        harca("birim", gb.cost, gb.id);
        sonIs = `geç oyun: ${gb.id} (${gb.cost}), yükseltme verimi ${y ? y.verim.toFixed(2) : "-"} < ${ayar.gecVerimEsik ?? 1}`;
        sonAksiyon = Date.now();
        return;
      }
      if (gb) { sonIs = `geç oyun: ${gb.id} için biriktir (${st.gold}/${gb.cost})`; return; }
    }
    const erken = ayar.erkenTitan !== false && (st.currentWave || 0) < (ayar.erkenTitanDalga ?? 9);
    const kEtkili = kural(st.level);
    const etkili = ayar.etkiliKule === false ? kuleler : kuleler.filter((t) => t.typeId === "universal" || t.typeId === "swap" || kapsama(t.x, t.y, ozellik(kEtkili, t.typeId, t.level, st.typeLevels?.[t.typeId] ?? 0).menzil, yol) >= (ayar.etkiliKapsama ?? 1.5));
    const minKule = erken ? (ayar.erkenMinKule ?? 3) : Math.min(st.buildableSet?.size ?? 15, Math.max(ayar.ekonomiMinKule ?? 5, Math.floor((st.currentWave || 0) / 3)));
    const acilisD = st.level?.incomeUnlockWave ?? 3;
    const titanU = (st.level?.incomeUnits || []).find((u) => u.id === "titan");
    const dolu = new Set(kuleler.map((t) => t.x + "," + t.y));
    const ustSira = (c) => Number(String(c).split(",")[1]) <= (ayar.ustSiraY ?? 2);
    const ustBos = [...(st.buildableSet || [])].filter((c) => ustSira(c) && !dolu.has(c)).length;
    const ustKule = etkili.filter((t) => t.y <= (ayar.ustSiraY ?? 2) && t.typeId !== "universal" && t.typeId !== "swap").length;
    const kotuDizilim = ayar.kotuDizilimKule !== false && (st.currentWave || 0) >= (ayar.kotuDizilimDalga ?? 9) && ustKule < (ayar.ustSiraEnAz ?? 3) && ustBos > 0;
    const hy = hasarYeter(st, erken ? (ayar.erkenBakis ?? 1) : 2);
    const bossRahat = sab.tahmin != null && sab.tahmin <= (ayar.bossGuvenEsik ?? 0.6) && sab.sav?.yeterli && (st.lives ?? 15) >= 12;
    const bossYakin = ayar.bossOncesiHarca !== false && !bossRahat && (sab.bossSavunma || sab.bossHazirlik || ((sab.boss || 0) - (st.currentWave || 0) <= (sab.boss === 10 ? (ayar.boss10HazirlikOnce ?? 2) : 1)));
    const erkenZayif = (erken && ayar.erkenKule !== false && hy.tahmin !== null && hy.tahmin > (ayar.erkenYeterEsik ?? 1.0)) || (!erken && ayar.zayifKule !== false && !hy.yeter && hy.tahmin !== null) || kotuDizilim || bossYakin;
    if (!erkenZayif && erken && ayar.sabotaj && ayar.ekonomi !== false && titanU && (st.currentWave || 0) < acilisD && etkili.length >= minKule && st.gold < titanU.cost + 100 + 10 * (st.buildCount || 0)) {
      sonIs = `erken titan için biriktir (${st.gold}/${titanU.cost}, ${acilisD}. dalgada açılır)`;
      return;
    }
    const liderBos = sab.lider && sab.neden === "gelir" && (st.buildableSet?.size ?? 15) - kuleler.length > 0;
    if (ayar.sabotaj && ayar.ekonomiOnce && sab.gonder && sab.neden === "gelir" && etkili.length >= minKule && !liderBos && !erkenZayif) {
      const eb = birimSec(st, sab.yedek, "gelir");
      if (eb) {
        ana.sendIncomeUnit(eb.id);
        sayac.sabotaj++;
        harca("birim", eb.cost, eb.id);
        if (sab.takip && mac) mac._takipDalga = st.currentWave;
        sonIs = sab.takip ? `gelir takibi: ${eb.id} (rakip +${(st.oppIncome || 0) - (st.income || 0)} önde)` : sab.bossaYetiyor ? `gelir: ${eb.id}, boss ${sab.boss}'a savunma yetiyor (${sab.tahmin})` : `gelir: ${eb.id} (${eb.cost})`;
        sonAksiyon = Date.now();
        return;
      }
      const hedefU = (st.level?.incomeUnits || []).filter((u) => (u.income || 0) / u.cost >= (ayar.gelirMinOran ?? 0.11)).sort((x, y) => y.income / y.cost - x.income / x.cost)[0];
      if (hedefU && !sab.takip && kalanDalga(st) * (hedefU.income / hedefU.cost) * 0.8 > 1 && !(ayar.yukseltOnce !== false && y && y.yetiyor && (bosHucre <= 0 || yUstun))) { sonIs = `gelir için biriktir (${st.gold}/${hedefU.cost})`; return; }
    }

    if (ayar.al && alabilir && (erkenZayif || (!(yUstun && y.yetiyor) && !(yCokUstun && !y.yetiyor && y.g.maliyet <= st.gold + 400)))) {
      ana.placeRandomTower();
      sayac.al++;
      harca("kule", kuleMal);
      sonIs = `kule al (${kuleMal})`;
      sonAksiyon = Date.now();
      return;
    }

    if (ayar.sabotaj && sab.gonder && !(sab.lider && sab.neden === "gelir" && (liderBos || (y && y.yetiyor))) && !(erkenZayif && sab.neden === "gelir" && !sab.takip)) {
      const birim = birimSec(st, sab.yedek, sab.neden);
      if (birim) {
        ana.sendIncomeUnit(birim.id);
        sayac.sabotaj++;
        harca("birim", birim.cost, birim.id);
        if (sab.takip && mac) mac._takipDalga = st.currentWave;
        sonIs = `${sab.neden}: ${birim.id} (${birim.cost})`;
        sonAksiyon = Date.now();
        return;
      }
    }

    if (y && (bosHucre <= 0 || yUstun)) {
      if (!y.yetiyor) {
        const alt = y.alt;
        const altOran = st.gold >= (ayar.bosAltin ?? 1500) ? 0.25 : 0.5;
        if (alt && ayar.biriktirmeSiniri !== false && alt.puan >= y.puan * altOran) {
          alt.p.onUpgrade(alt.p.typeId);
          sayac.yukselt++;
          harca("yukseltme", alt.g.maliyet, alt.p.typeId);
          sonIs = `yükselt ${alt.p.typeId} (${alt.g.maliyet}), ${y.p.typeId} için ${y.g.maliyet} beklemek yerine`;
          sonAksiyon = Date.now();
          return;
        }
        if (erkenZayif && bossYakin) { sonIs = `boss ${sab.boss} öncesi: ${y.p.typeId} yükseltmesi yetmiyor, biriktirilmiyor`; }
        else if (bosHucre <= 0 || yCokUstun) { sonIs = `${y.p.typeId} yükseltmesi için biriktir (${st.gold}/${y.g.maliyet})`; return; }
      } else {
        y.p.onUpgrade(y.p.typeId);
        sayac.yukselt++;
        harca("yukseltme", y.g.maliyet, y.p.typeId);
        sonIs = `yükselt ${y.p.typeId} (${y.g.maliyet})${bosHucre > 0 ? " > kule" : ""}`;
        sonAksiyon = Date.now();
        return;
      }
    }
    if (ayar.sabotaj && !sab.bossSavunma && !sab.bossHazirlik && !sab.yasak && !sab.biriktir && (st.currentWave || 0) >= acilisD && (st.lives ?? 15) >= (ayar.bosAltinCan ?? 3) && (st.oppIncome || 0) > (st.income || 0) && st.gold >= (ayar.bosAltinEsik ?? 600)) {
      const bb = birimSec(st, ayar.bosAltinYedek ?? 200, "gelir");
      if (bb) {
        ana.sendIncomeUnit(bb.id);
        sayac.sabotaj++;
        harca("birim", bb.cost, bb.id);
        sonIs = `boş altın gelire: ${bb.id} (rakip +${(st.oppIncome || 0) - (st.income || 0)} önde, altın ${st.gold})`;
        sonAksiyon = Date.now();
        return;
      }
    }
    sonIs = sab.bossSavunma ? `boss (${sab.boss}) öncesi savunma` : sab.bossHazirlik ? `boss (${sab.boss}) hazırlığı: savunma yetmeyebilir (${sab.tahmin})` : sab.yasak ? "boss dalgası, birim gönderilmiyor" : sab.biriktir ? `biriktir (boss ${sab.boss})` : "bekle";
  };

  let mac = null;
  let oturumMac = 0;
  let bekleyenDeney = null;
  const yeniMac = (st, ana) => ({
    basla: Date.now(), mod: ayar.mod, botAcik: ayar.acik, rakipBot: !!st.hasBot, oyuncu: ana.playerIndex,
    deste: Array.isArray(ana.selectedDeck) ? [...ana.selectedDeck] : Object.keys(st.typeLevels || {}), deney: bekleyenDeney, dalga: 0, hasar: 0, oldurme: 0, sizan: 0, rakipSizan: 0,
    harcama: { kule: 0, yukseltme: 0, birim: 0 }, birimler: {}, yukseltmeler: {}, dalgalar: [], hasarGecmis: [],
    _dusman: new Map(), olumIlerleme: [], _dalgaHp: 0, oncekiDalgaHp: 0, _sonDalga: -1, _dalgaHasar: 0, _sonCan: st.lives, _sonRakipCan: st.oppLives, bitti: false,
  });
  const harca = (tur, miktar, ne) => {
    if (!mac) return;
    mac.harcama[tur] += miktar || 0;
    if (tur === "birim") mac.birimler[ne] = (mac.birimler[ne] || 0) + 1;
    if (tur === "yukseltme") mac.yukseltmeler[ne] = (mac.yukseltmeler[ne] || 0) + 1;
  };
  const tahtaOzet = (kuleler) => {
    const o = {};
    for (const t of kuleler || []) o[t.typeId] = (o[t.typeId] || "") + t.level;
    return o;
  };
  const macBitir = (st, ana) => {
    if (!mac || mac.bitti) return;
    mac.bitti = true;
    oturumMac++;
    const kazandi = st && st.winner >= 0 && st.winner === ana?.playerIndex;
    const bitti = st && st.winner !== undefined && st.winner >= 0;
    const rakipCikti = bitti && kazandi && (st.oppLives ?? 0) >= 3;
    const bizCiktik = bitti && !kazandi && (st.lives ?? 0) >= 3;
    const erkenGalibiyet = bitti && kazandi && mac.dalga < ayar.deneyMinDalga;
    const gecersiz = !bitti ? "belirsiz" : rakipCikti ? "rakip çıktı" : bizCiktik ? "biz çıktık" : erkenGalibiyet ? "erken galibiyet" : null;
    if (mac.deney && bitti && !gecersiz) {
      const gercek = desteAnahtar(mac.deste);
      if (gercek === mac.deney) {
        deneySayac[mac.deney] = (deneySayac[mac.deney] || 0) + 1;
        const ds = (deneySonuc[mac.deney] ||= { n: 0, g: 0, dalga: 0, can: 0, kayipDalga: 0 });
        ds.n++; ds.dalga += mac.dalga; ds.can = (ds.can || 0) + Math.max(0, st.lives || 0);
        if (kazandi) ds.g++; else ds.kayipDalga = (ds.kayipDalga || 0) + mac.dalga;
        try { localStorage.setItem(DENEY_KEY, JSON.stringify(deneySayac)); localStorage.setItem(DENEY_SONUC_KEY, JSON.stringify(deneySonuc)); } catch {}
      }
    }
    bekleyenDeney = null;
    molaVer(bitti && !kazandi);
    const kayit = {
      gecersiz,
      tarih: new Date(mac.basla).toISOString(), deney: mac.deney && desteAnahtar(mac.deste) === mac.deney ? mac.deney : null, sure: Math.round((Date.now() - mac.basla) / 1000), mod: mac.mod, botAcik: mac.botAcik, rakipBot: mac.rakipBot,
      sonuc: st?.winner === undefined || st?.winner < 0 ? "belirsiz" : kazandi ? "galibiyet" : "maglubiyet",
      dalga: mac.dalga, can: st?.lives, rakipCan: st?.oppLives, hasar: Math.round(mac.hasar), oldurme: mac.oldurme, sizan: mac.sizan, rakipSizan: mac.rakipSizan,
      harcama: mac.harcama, birimler: mac.birimler, yukseltmeler: mac.yukseltmeler, deste: mac.deste,
      tahta: tahtaOzet(st?.towers), turSeviye: st?.typeLevels, rakipTahta: tahtaOzet(st?.oppTowers), rakipTurSeviye: st?.oppTypeLevels, suru: mac?._suru ? { toplam: mac._suru.toplam || 0, kapali: mac._suru.kapali } : null, yaris: mac?._yaris?.toplam || 0,
      gelir: st?.income, rakipGelir: st?.oppIncome, dalgalar: mac.dalgalar, ayar: { ...ayar },
    };
    try { window.postMessage({ kaynak: "cor3td-bot", mac: kayit, ogrenme }, location.origin); } catch {}
  };
  const izle = () => {
    const sp = savasProps();
    const st = sp?.ana.stateRef.current;
    if (!st) { if (mac && !mac.bitti) macBitir(null, null); return; }
    if (st.phase === "game_over") { macBitir(st, sp.ana); return; }
    if (st.phase !== "playing") return;
    if (!mac || mac.bitti) mac = yeniMac(st, sp.ana);
    const simdi = new Set();
    const yolUz = (st.level?.waypoints || []).length;
    for (const e of st.enemies || []) {
      simdi.add(e.id);
      const k = mac._dusman.get(e.id);
      if (!k) { mac._dusman.set(e.id, { hp: e.hp, en: e.pathIndex || 0 }); mac._dalgaHp += e.maxHp || e.hp || 0; mac._dalgaSayi = (mac._dalgaSayi || 0) + 1; }
      else {
        if (e.hp < k.hp) { const d = k.hp - e.hp; mac.hasar += d; mac._dalgaHasar += d; mac.hasarGecmis.push([Date.now(), d]); }
        k.hp = e.hp; k.en = Math.max(k.en, e.pathIndex || 0);
      }
    }
    for (const [id, k] of mac._dusman) {
      if (simdi.has(id)) continue;
      mac._dusman.delete(id);
      if (yolUz && k.en >= yolUz - 1.5) { if (ayar.sizanSay !== false) { mac.olumIlerleme.push(1); if (mac.olumIlerleme.length > 40) mac.olumIlerleme.shift(); } continue; }
      if (yolUz) { mac.olumIlerleme.push(Math.min(1, k.en / Math.max(1, yolUz - 1))); if (mac.olumIlerleme.length > 40) mac.olumIlerleme.shift(); }
      mac.hasar += k.hp; mac._dalgaHasar += k.hp; mac.hasarGecmis.push([Date.now(), k.hp]); mac.oldurme++;
    }
    const sinir = Date.now() - 10000;
    while (mac.hasarGecmis.length && mac.hasarGecmis[0][0] < sinir) mac.hasarGecmis.shift();
    if (st.lives < mac._sonCan) mac.sizan += mac._sonCan - st.lives;
    if (st.oppLives < mac._sonRakipCan) mac.rakipSizan += mac._sonRakipCan - st.oppLives;
    mac._sonCan = st.lives; mac._sonRakipCan = st.oppLives;
    if (st.currentWave !== mac._sonDalga) {
      if (mac._sonDalga >= 0) mac.dalgalar.push({ d: mac._sonDalga, can: st.lives, rCan: st.oppLives, altin: st.gold, gelir: st.income, rGelir: st.oppIncome, hasar: Math.round(mac._dalgaHasar), kule: tahtaOzet(st.towers), tl: { ...(st.typeLevels || {}) }, rKule: tahtaOzet(st.oppTowers), is: mac._isler || {} });
      mac._isler = {};
      mac._sonDalga = st.currentWave; mac._dalgaHasar = 0; mac.dalga = st.currentWave;
      if (mac._dalgaHp > 0) mac.oncekiDalgaHp = mac._dalgaHp;
      if (mac._dalgaSayi > 0) mac.oncekiDalgaSayi = mac._dalgaSayi;
      mac._dalgaSayi = 0;
      mac._dalgaHp = 0;
    }
  };
  const canliOzet = () => {
    if (!mac) return null;
    const st = savasProps()?.ana.stateRef.current;
    const son10 = mac.hasarGecmis.reduce((x, y) => x + y[1], 0);
    return {
      dalga: mac.dalga, can: st?.lives, rakipCan: st?.oppLives, altin: st?.gold, gelir: st?.income, rakipGelir: st?.oppIncome,
      hasar: Math.round(mac.hasar), dps: Math.round(son10 / 10), oldurme: mac.oldurme, sizan: mac.sizan, rakipSizan: mac.rakipSizan,
      harcama: mac.harcama, bitti: mac.bitti,
    };
  };

  let gelirKutu = null, gelirGecmis = [], gelirSonDalga = -1, gelirOnceki = null;
  const gelirCiz = () => {
    const st = ayar.gelirGoster ? savasProps()?.ana.stateRef.current : null;
    if (!st || st.income == null) { if (gelirKutu) gelirKutu.style.display = "none"; return; }
    if (!gelirKutu) {
      gelirKutu = document.createElement("div");
      gelirKutu.id = "cor3td-gelir";
    }
    const orta = document.querySelector('[data-component-name="TowerDefenseMainColumn"]');
    const alanlar = orta ? [...orta.children].filter((c) => c.getAttribute("data-component-name") === "TowerDefenseGameArea") : [];
    const yuva = document.querySelector('[data-component-name="TdBattleIncomePanelBody"]');
    const ortak = "z-index:2147483646;padding:12px 14px;background:rgba(10,14,20,.92);border:1px solid rgba(120,200,255,.35);border-radius:6px;color:#d8e6f0;font:20px/1.3 Consolas,monospace;pointer-events:none;user-select:none;box-sizing:border-box";
    const yatay = alanlar.length === 2;
    if (yatay) {
      if (gelirKutu.parentElement !== orta || gelirKutu.nextElementSibling !== alanlar[1]) {
        const kart = getComputedStyle(alanlar[1]);
        const ic = alanlar[1].querySelector('[data-component-name="TowerDefenseCanvasWrap"]');
        const yan = ic ? Math.max(8, Math.round(ic.getBoundingClientRect().left - alanlar[1].getBoundingClientRect().left)) : 20;
        gelirKutu.style.cssText = `position:relative;flex:1 1 auto;align-self:stretch;margin:0;min-height:0;display:flex;flex-direction:column;justify-content:center;padding:8px ${yan}px;box-sizing:border-box;background:${kart.backgroundColor};border:${kart.borderTopWidth} solid ${kart.borderTopColor};border-radius:${kart.borderTopLeftRadius};box-shadow:${kart.boxShadow};color:#d8e6f0;font:20px/1.3 Consolas,monospace;pointer-events:none;user-select:none`;
        orta.insertBefore(gelirKutu, alanlar[1]);
      }
    } else if (yuva) {
      if (gelirKutu.parentElement !== yuva || yuva.lastElementChild !== gelirKutu) { gelirKutu.style.cssText = ortak + ";position:relative;width:100%;margin-top:14px;flex:none"; yuva.appendChild(gelirKutu); }
    } else if (gelirKutu.parentElement !== document.body) {
      gelirKutu.style.cssText = ortak + ";position:fixed;right:12px;top:50%;transform:translateY(-50%);width:300px";
      document.body.appendChild(gelirKutu);
    }
    gelirKutu.style.display = "block";
    const d = st.currentWave ?? 0;
    if (d < gelirSonDalga) { gelirGecmis = []; gelirOnceki = null; }
    if (d !== gelirSonDalga) {
      if (gelirOnceki) gelirGecmis.push(gelirOnceki);
      if (gelirGecmis.length > 40) gelirGecmis.shift();
      gelirSonDalga = d;
    }
    const biz = st.income || 0, rk = st.oppIncome || 0;
    const bekBiz = st.pendingIncome > 0 ? `bekleyen +${st.pendingIncome}` : "", bekRk = st.oppPendingIncome > 0 ? `bekleyen +${st.oppPendingIncome}` : "";
    let bossSatir = "", bossKisa = "";
    try {
      const sb = sabotajDurumu(st);
      const kalan = (sb.boss || 0) - d;
      const metin = sb.bossHazirlik ? `boss ${sb.boss}: hazırlık, titan yok` : sb.bossSavunma ? `boss ${sb.boss}: savunma` : kalan > 0 ? `boss ${sb.boss}: ${kalan} dalga` : "";
      const r = sb.bossHazirlik ? "#ff8a8a" : sb.bossSavunma ? "#f0b35a" : "#8fb8d0";
      if (metin) { bossSatir = `<div style="margin-top:4px;font-size:17px;color:${r}">${metin}</div>`; bossKisa = `<span style="color:${r}">${metin}</span>`; }
    } catch {}
    gelirOnceki = { d, biz, rk };
    const nokta = [...gelirGecmis, gelirOnceki];
    const fark = biz - rk;
    const renk = fark > 0 ? "#6ee7a0" : fark < 0 ? "#ff8a8a" : "#d8e6f0";
    const bes = nokta.length > 5 ? nokta[nokta.length - 6] : nokta[0];
    const art = (v, o) => { const x = v - o; return x > 0 ? `+${x}` : `${x}`; };
    const W = 200, H = 70, enCok = Math.max(1, ...nokta.map((n) => Math.max(n.biz, n.rk)));
    const cizgi = (k) => nokta.map((n, i) => `${(nokta.length < 2 ? W : (i / (nokta.length - 1)) * W).toFixed(1)},${(H - (n[k] / enCok) * (H - 2) - 1).toFixed(1)}`).join(" ");
    const birim = mac?.harcama?.birim || 0;
    if (yatay) {
      const kolon = (ad, deger, renk2, alt) => `<div style="flex:1"><div style="color:#8fb8d0;font-size:15px">${ad}</div><b style="color:${renk2};font-size:30px;line-height:1.1">${deger}</b><div style="color:#8fb8d0;font-size:13px;min-height:16px;white-space:nowrap">${alt}</div></div>`;
      gelirKutu.innerHTML =
        `<div style="display:flex;justify-content:space-between;color:#8fb8d0;font-size:15px;letter-spacing:.5px"><span>GELİR / DALGA · dalga ${d}</span>${bossKisa}</div>` +
        `<div style="display:flex;gap:12px;align-items:stretch;margin-top:4px">` +
          `<div style="flex:1.3;display:flex;gap:8px">${kolon("Biz", biz, "#7cc8ff", bekBiz)}${kolon("Rakip", rk, "#ffb86b", bekRk)}${kolon("Fark", (fark > 0 ? "+" : "") + fark, renk, `son 5: ${art(biz, bes.biz)}/${art(rk, bes.rk)}`)}</div>` +
          `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="flex:1;height:76px;display:block;background:rgba(255,255,255,.04)"><polyline fill="none" stroke="#ffb86b" stroke-width="2.5" points="${cizgi("rk")}"/><polyline fill="none" stroke="#7cc8ff" stroke-width="2.5" points="${cizgi("biz")}"/></svg>` +
        `</div>` +
        `<div style="display:flex;justify-content:space-between;margin-top:4px;font-size:15px;color:#8fb8d0"><span>altın ${st.gold ?? "-"}</span><span>birime ${birim}</span></div>`;
      return;
    }
    gelirKutu.innerHTML =
      `<div style="display:flex;justify-content:space-between;color:#8fb8d0;font-size:17px;letter-spacing:.5px"><span>GELİR / DALGA</span><span>dalga ${d}</span></div>` +
      `<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:6px"><span>Biz</span><span><span style="color:#8fb8d0;font-size:15px">${bekBiz}</span> <b style="color:#7cc8ff;font-size:28px">${biz}</b></span></div>` +
      `<div style="display:flex;justify-content:space-between;align-items:baseline"><span>Rakip</span><span><span style="color:#8fb8d0;font-size:15px">${bekRk}</span> <b style="color:#ffb86b;font-size:28px">${rk}</b></span></div>` +
      `<div style="display:flex;justify-content:space-between;align-items:baseline"><span>Fark</span><b style="color:${renk};font-size:28px">${fark > 0 ? "+" : ""}${fark}</b></div>` +
      `<div style="display:flex;justify-content:space-between;color:#8fb8d0;font-size:17px"><span>son 5 dalga</span><span><span style="color:#7cc8ff">${art(biz, bes.biz)}</span> / <span style="color:#ffb86b">${art(rk, bes.rk)}</span></span></div>` +
      `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:${H}px;display:block;margin-top:8px;background:rgba(255,255,255,.04)"><polyline fill="none" stroke="#ffb86b" stroke-width="2.5" points="${cizgi("rk")}"/><polyline fill="none" stroke="#7cc8ff" stroke-width="2.5" points="${cizgi("biz")}"/></svg>` +
      `<div style="display:flex;justify-content:space-between;margin-top:6px;font-size:17px;color:#8fb8d0"><span>altın ${st.gold ?? "-"}</span><span>birime ${birim}</span></div>` + bossSatir;
  };

  const ciz = () => {
    try {
      window.postMessage({ kaynak: "cor3td-bot", durum: { sonIs, sayac: { ...sayac }, zaman: Date.now(), mac: canliOzet(), macta: !!savasProps() || !!bul('[data-component-name="MatchSearchWaiting"]') || !!bul('[data-component-name="MatchSearchTime"]'), planMesgul, oturumMac, deney: ayar.deney ? deneyListesi().map((d) => [desteAnahtar(d), deneySayac[desteAnahtar(d)] || 0]) : null } }, location.origin);
    } catch {}
  };
  let sonCiz = 0;
  const asilIW = Object.getOwnPropertyDescriptor(window, "innerWidth") || Object.getOwnPropertyDescriptor(Window.prototype, "innerWidth");
  let panelPx = 0;
  const kucultulen = new WeakMap();
  const pencereSigdir = (kapandi) => {
    for (const el of document.querySelectorAll('[data-component-name^="Application-"]')) {
      const ctx = yukariAra(el, (p) => p.value && typeof p.value === "object" && typeof p.value.fitToContent === "function");
      const kutu = el.closest(".react-draggable");
      if (!ctx || !kutu) continue;
      const r = kutu.getBoundingClientRect();
      const eski = kucultulen.get(kutu);
      if (kapandi && eski && Math.abs(eski.yeni.w - r.width) < 2 && Math.abs(eski.yeni.h - r.height) < 2) {
        ctx.value.fitToContent(eski.w, eski.h, { recenter: true });
        kucultulen.delete(kutu);
        continue;
      }
      if (kapandi || r.right <= window.innerWidth) continue;
      const k = Math.min(1, (window.innerWidth - 36) / r.width, (window.innerHeight - 36) / r.height);
      const w = Math.round(r.width * k), h = Math.round(r.height * k);
      if (k < 1) kucultulen.set(kutu, { w: Math.round(r.width), h: Math.round(r.height), yeni: { w, h } });
      ctx.value.fitToContent(w, h, { recenter: true });
    }
  };
  const panelUygula = (px) => {
    px = Math.max(0, Number(px) || 0);
    if (!asilIW?.get || px === panelPx) return;
    panelPx = px;
    if (px > 0) Object.defineProperty(window, "innerWidth", { configurable: true, enumerable: true, get: () => asilIW.get.call(window) - panelPx });
    else Object.defineProperty(window, "innerWidth", asilIW);
    let st = document.getElementById("cor3td-dar");
    if (px > 0) {
      if (!st) { st = document.createElement("style"); st.id = "cor3td-dar"; document.head.append(st); }
      st.textContent = `body{width:calc(100% - ${px}px)!important}.Toastify__toast-container--bottom-right,.Toastify__toast-container--top-right{right:${px + 16}px!important}[data-component-name="NotificationsHistory"]{right:${px + 20}px!important}`;
    } else if (st) st.remove();
    window.dispatchEvent(new Event("resize"));
    setTimeout(() => { try { pencereSigdir(px === 0); } catch {} }, 50);
  };
  window.addEventListener("message", (e) => {
    if (e.source !== window || e.data?.kaynak !== "cor3td-kopru") return;
    if (e.data.panel !== undefined) panelUygula(e.data.panel);
    if (e.data.planMesgul !== undefined) planMesgul = !!e.data.planMesgul;
    if (e.data.helperMesgul !== undefined) helperMesgul = !!e.data.helperMesgul;
    if (e.data.helperNeden !== undefined) helperNeden = e.data.helperNeden;
    if (e.data.ayar) {
      const a = e.data.ayar;
      if (a.vSurum >= 2 && a.vSurum < varsayilan.vSurum) { const g = { vSurum: varsayilan.vSurum }; if (a.vSurum < 3) g.ekonomiMinKule = 4; if (a.vSurum < 4) g.ekonomiYedek = 0; if (a.vSurum < 5 && String(a.sabitDeste || "").trim() === "universal sniper gatling acid splash") g.sabitDeste = "universal sniper gatling acid freeze"; Object.assign(ayar, varsayilan, a, g); kaydet(); try { window.postMessage({ kaynak: "cor3td-bot", ayarYaz: g }, location.origin); } catch {} }
      else if ((a.vSurum || 0) < varsayilan.vSurum) {
        const yeni = { ...varsayilan, acik: !!a.acik, otomatik: !!a.otomatik, kosuSatinAl: !!a.kosuSatinAl, kosuSayacBaslangic: a.kosuSayacBaslangic || "", surum: 8 };
        Object.assign(ayar, yeni); kaydet();
        try { window.postMessage({ kaynak: "cor3td-bot", ayarYaz: yeni }, location.origin); } catch {}
      } else { Object.assign(ayar, varsayilan, a); }
      Object.assign(ayar, { swapYerlestir: false, bossTumDalga: false, x0Yasak: false, deney: false, deneySonraRating: false }); kaydet();
    }
    if (e.data.sifirla) { for (const k of Object.keys(sayac)) sayac[k] = 0; oturumMac = 0; }
    if (e.data.deneySifirla) { deneySayac = {}; try { localStorage.removeItem(DENEY_KEY); } catch {} }
  });

  window.cor3TdBot = {
    ayar,
    durum: () => { const sp = savasProps(); return sp ? { ...sp, state: sp.ana.stateRef.current } : null; },
    destePuani: () => destePuani(),
    desteLog,
    kosular: () => kosuKayit,
    deneySonuc: () => ({ sonuc: deneySonuc, enIyi: enIyiDeste() }),
    verim: () => {
      const st = savasProps()?.ana.stateRef.current;
      if (!st) return null;
      const yol = yolAl(st.level), k = kural(st.level), toplam = Math.max(1, tahtaDegeri(k, st, yol));
      const satir = [...new Set((st.towers || []).map((t) => t.typeId))].filter((t) => t !== "universal" && t !== "swap").map((tip) => {
        const g = yukseltmeKazanci(k, st, tip, yol);
        return { tur: tip, seviye: g.tl, panel: g.tl + 1, maliyet: g.maliyet, verim: +(g.birim / toplam * 1e5).toFixed(2), tavan: (ayar.turTavan ?? 0) > 0 && g.tl >= ayar.turTavan };
      });
      console.table?.(satir);
      return satir;
    },
    yukseltme: () => { const st = savasProps()?.ana.stateRef.current; const y = st && yukseltmeKarti(st, yolAl(st.level)); return y ? { tur: y.p.typeId, pay: +y.pay.toFixed(2), maliyet: y.g.maliyet, yetiyor: y.yetiyor, puan: y.puan } : null; },
    karar: () => sonKarar,
    bakiye: () => bakiye(),
    rakipZayif: () => { const st = savasProps()?.ana.stateRef.current; return st ? rakipZayiflik(st) : null; },
    yeter: () => { const st = savasProps()?.ana.stateRef.current; return st ? hasarYeter(st, 2) : null; },
    ekonomi: () => { const st = savasProps()?.ana.stateRef.current; if (!st) return null; const s = sabotajDurumu(st); return { gelir: st.income, rakipGelir: st.oppIncome, karar: s.gonder ? s.neden : s.yasak ? "yasak" : s.biriktir ? "biriktir" : "-", R: s.R, savunma: s.sav, birim: s.gonder ? birimSec(st, s.yedek, s.neden)?.id : null }; },
    bossBirimi: () => { const st = savasProps()?.ana.stateRef.current; return st ? birimSec(st, 100, "boss sabotajı") : null; },
    ogrenme: () => { const t = {}; for (const [e, m] of Object.entries(ogrenme)) for (const [k, h] of Object.entries(m)) (t[e] ||= {})[k] = `${(h.ilerleme / h.n * 100).toFixed(0)}% ilerleme, ${(h.sizma / h.n * 100).toFixed(0)}% sızma (n=${h.n.toFixed(1)})`; console.table?.(t); return t; },
    ogrenmeSifirla: () => { ogrenme = {}; try { localStorage.removeItem(OGREN_KEY); } catch {} },
    rakip: () => { const st = savasProps()?.ana.stateRef.current; return st ? rakipAnaliz(st) : null; },
    sabotaj: () => { const st = savasProps()?.ana.stateRef.current; return st ? { ...sabotajDurumu(st), dalga: st.currentWave, asama: st.waveStage, altin: st.gold, birimler: st.level?.incomeUnits } : null; },
    yukseltmeTablosu: (tip = "gatling", kuleSeviye = 3, kac = 10) => {
      const st = savasProps()?.ana.stateRef.current;
      const k = kural(st?.level);
      const satir = [];
      for (let tl = 0; tl < kac; tl++) {
        const a = ozellik(k, tip, kuleSeviye, tl), b = ozellik(k, tip, kuleSeviye, tl + 1), c = turSeviye(k, tl + 1).cost;
        satir.push({ seviye: tl + 1, maliyet: c, dps: +b.dps.toFixed(1), artis: +(b.dps - a.dps).toFixed(1), aralikMs: b.aralik, menzil: b.menzil, artisPer100Altin: +((b.dps - a.dps) / c * 100).toFixed(2) });
      }
      console.table?.(satir);
      return satir;
    },
  };

  setInterval(() => {
    try { izle(); } catch {}
    try { bekci(); } catch {}
    const onceki = sonAksiyon;
    try { adim(); } catch (e) { sonIs = "hata: " + e.message; }
    if (sonAksiyon !== onceki) aksiyonSonraki = sonAksiyon + aksiyonBekleme();
    if (Date.now() - sonCiz > 700) {
      sonCiz = Date.now(); ciz(); try { gelirCiz(); } catch {}
      if (mac && !mac.bitti) { const k = String(sonIs).replace(/\([^)]*\)/g, "").replace(/\d+/g, "#").trim().slice(0, 50); (mac._isler ||= {})[k] = (mac._isler[k] || 0) + 1; }
    }
  }, 100);
  window.postMessage({ kaynak: "cor3td-bot", hazir: true }, location.origin);
})();
