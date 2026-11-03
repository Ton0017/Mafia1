// ═══ ЛЕТОПИСЬ РОДА — реиграбельность через смерть ═══
const Prestige = {
  KEY: 'noir_city_prestige_v1',

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return this.default();
      return JSON.parse(raw);
    } catch (e) { return this.default(); }
  },

  default() {
    return {
      blood: 0,          // накопленная «кровь рода»
      totalDeaths: 0,
      totalDays: 0,
      totalKills: 0,
      totalMoneyEarned: 0,
      bestDay: 0,
      lastLife: null,    // {name, days, kills, epitaph}
      deaths: [],        // [{name, days, kills, side, city, epitaph, day}]
    };
  },

  save(data) {
    try { localStorage.setItem(this.KEY, JSON.stringify(data)); }
    catch (e) {}
  },

  // При смерти — фиксируем жизнь и добавляем кровь
  onDeath(player, city) {
    if (!player) return { gainedBlood: 0, totalBlood: this.load().blood || 0 };
    // #65: защита от неполного lifetime (старые сейвы)
    const life = player.lifetime || {};
    const days = life.daysSurvived || 0;
    const kills = life.kills || 0;
    const money = life.moneyEarned || 0;

    const data = this.load();
    const gainedBlood = this.calcBlood(player);
    data.blood = (data.blood || 0) + gainedBlood;
    data.totalDeaths = (data.totalDeaths || 0) + 1;
    data.totalDays = (data.totalDays || 0) + days;
    data.totalKills = (data.totalKills || 0) + kills;
    data.totalMoneyEarned = (data.totalMoneyEarned || 0) + money;
    if (days > (data.bestDay || 0)) data.bestDay = days;

    const epitaph = this.buildEpitaph(player);
    const record = {
      name: player.name,
      side: player.side,
      days: days,
      kills: kills,
      money: money,
      city: city ? city.name : '?',
      epitaph,
      blood: gainedBlood,
      day: new Date().toISOString().slice(0, 10),
    };
    if (!Array.isArray(data.deaths)) data.deaths = [];
    data.deaths.push(record);
    if (data.deaths.length > 50) data.deaths.shift();
    data.lastLife = record;

    this.save(data);
    return { gainedBlood, totalBlood: data.blood };
  },

  // Расчёт крови за жизнь
  calcBlood(player) {
    if (!player) return 0;
    const life = player.lifetime || {};
    let blood = 0;
    blood += (life.kills || 0) * 1;
    blood += (life.missionsDone || 0) * 0.5;
    blood += Math.floor((life.daysSurvived || 0) * 0.5);
    blood += (life.overdoses || 0) * 2;
    blood += (life.breakdowns || 0) * 3;
    blood += Math.floor((life.moneyEarned || 0) / 100);
    blood += (player.reputation || 0) * 0.5;
    const result = Math.round(blood);
    return Number.isFinite(result) ? result : 0;
  },

  // Бонусы к новой жизни
  getStartingBonuses() {
    const data = this.load();
    const blood = Number.isFinite(data.blood) ? data.blood : 0;
    return {
      blood,
      bonusMoney: Math.min(5000, Math.floor(blood * 20)),
      bonusReputation: Math.floor(blood / 10),
      tradeDiscount: Math.min(0.25, Math.floor(blood / 1000) * 0.05),
      inheritChance: Math.min(0.5, blood / 2000),
      deaths: data.totalDeaths,
      bestDay: data.bestDay,
      totalKills: data.totalKills,
    };
  },

  buildEpitaph(player) {
    if (!player) return 'Безымянный. Ушёл. Не попрощался.';
    const parts = [];
    const life = player.lifetime || {};
    const days = life.daysSurvived || 0;
    const kills = life.kills || 0;
    const money = life.moneyEarned || 0;

    if (days < 3) parts.push('Ты не успел. Город даже не заметил твоего прихода.');
    else if (days < 10) parts.push('Ты продержался ' + days + ' дней. Это уже больше, чем большинство.');
    else if (days < 30) parts.push(days + ' дней. Ты начал понимать правила — и это тебя убило.');
    else parts.push(days + ' дней. Ты был близко. Ближе, чем хотелось бы городу.');

    if (kills === 0) parts.push('Никого не убил. В этом городе — почти чудо.');
    else if (kills < 5) parts.push('Забрал ' + kills + ' жизней. Каждую помнишь. Пока.');
    else if (kills < 20) parts.push(kills + ' убийств. Ты перестал считать после десятого.');
    else parts.push(kills + ' жизней на руках. Кровь не смывается — ты пробовал.');

    if ((life.overdoses || 0) > 0) parts.push('Передозов: ' + life.overdoses + '. Ты был близко.');
    if ((life.breakdowns || 0) > 0) parts.push('Сломался ' + life.breakdowns + ' раз. Тело помнит.');
    if (player.sanity && player.sanity.sanity < 25) parts.push('Умер безумным. Может, это милосердие.');
    if (money > 10000) parts.push('$' + Utils.fmtMoney(money) + ' заработал. Не успел потратить.');
    else if (money > 1000) parts.push('$' + Utils.fmtMoney(money) + ' — всё, что осталось.');

    parts.push('Город уже забыл твоё имя. Или сделает вид, что забыл.');
    return parts.join(' ');
  },

  // Записать в кладбище (совместимость)
  addToGraveyard(record) {
    const data = this.load();
    if (!Array.isArray(data.deaths)) data.deaths = [];
    data.deaths.push(record);
    if (data.deaths.length > 50) data.deaths.shift();
    // #66: увеличиваем totalDeaths
    data.totalDeaths = (data.totalDeaths || 0) + 1;
    this.save(data);
  },

  getGraveyard() {
    return this.load().deaths || [];
  },
};
