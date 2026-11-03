const Components = {
  // Безопасный генератор кнопки. Экранирует & и " в onclick,
  // иначе onclick="Actions.go("zones")" ломает HTML-атрибут.
  button(text, onclick, opts = {}) {
    const cls = opts.className || (opts.primary ? 'primary' : opts.danger ? 'danger' : '');
    const dis = opts.disabled ? 'disabled' : '';
    const safe = String(onclick).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    return `<button class="${cls}" ${dis} onclick="${safe}">${text}</button>`;
  },

  card(title, html, opts = {}) {
    const cls = opts.hot ? 'card hot' : 'card';
    return `<div class="${cls}">${title ? `<h3>${title}</h3>` : ''}${html}</div>`;
  },

  bodyBar(body) {
    if (!body) return '';
    const names = { head:'Голова', torso:'Торс', leftArm:'Л.рука', rightArm:'П.рука', leftLeg:'Л.нога', rightLeg:'П.нога' };
    return Object.entries(body).map(([part, p]) => {
      if (!p) return '';
      const label = names[part] || part;
      const hp = Number(p.hp) || 0;
      const max = Number(p.max) || 100;
      const pct = hp / max;
      const cls = pct <= 0 ? 'hp-dead' : pct < 0.3 ? 'hp-low' : pct < 0.6 ? 'hp-mid' : 'hp-good';
      return `<span class="body-part ${cls}" title="${label}">${label}: ${hp}</span>`;
    }).join(' ');
  },

  sprite(src, size = 'medium', extraClass = '') {
    if (!src) return '';
    return `<img src="${src}" class="sprite ${size} ${extraClass}" alt="">`;
  },

  spriteRow(src, html, size = 'medium', extraClass = '') {
    return `<div class="sprite-row">${this.sprite(src, size, extraClass)}<div class="info">${html}</div></div>`;
  },

  statRow(label, value, cls = '') {
    return `<p>${label}: <span class="${cls}">${value}</span></p>`;
  },

  zoneCard(zone) {
    if (!zone) return '';
    const ownerName = zone.ownerId
      ? (zone.ownerId === 'player'
          ? '<span class="gold">Ты</span>'
          : (State.factions.find(f => f.id === zone.ownerId)?.name || '?'))
      : '<span class="muted">нейтрал</span>';
    return `
      <div class="card">
        <div class="row" style="justify-content:space-between">
          <div><b>${zone.name}</b> <span class="muted small">(${zone.typeName})</span></div>
          <div class="small">${ownerName}</div>
        </div>
        <div class="small muted">Доход $${zone.income}/день · Влияние ${zone.influence} · Сложность ${zone.difficulty}</div>
        <div class="small">Ресурс: <span class="gold">${zone.resource}</span></div>
        <div class="row tight" style="margin-top:0.3rem">
          ${Components.button('Осмотреть', `Actions.viewZone('${zone.id}')`)}
        </div>
      </div>
    `;
  },

  factionCard(f) {
    if (!f) return '';
    const rel = f.relations && State.player && State.player.story
      ? (f.id === State.player.story.enemyFactionId ? '<span class="red">враг</span>'
         : f.id === State.player.story.allyFactionId ? '<span class="green">союзник</span>'
         : '<span class="muted">нейтрал</span>')
      : '';
    return `
      <div class="card">
        <div class="row" style="justify-content:space-between">
          <div><b>${f.name}</b></div>
          <div class="small">${rel}</div>
        </div>
        <div class="small muted">Характер: ${f.trait} · Сила: ${f.power} · Зон: ${f.zones}</div>
      </div>
    `;
  },
};
