// Хелпер: суммарная скидка (престиж + перки)
function getTradeDiscount() {
  let d = State.flags.tradeDiscount || 0;
  if (typeof Perks !== 'undefined') {
    d += Perks.getModifiers().tradeDiscount || 0;
  }
  return Math.min(0.5, d);
}

const Screens = {
  menu() {
    const hasSave = Save.exists();
    // #68: используем Prestige, а не старый Save.getGraveyard
    const graveyard = (typeof Prestige !== 'undefined') ? Prestige.getGraveyard() : [];
    return `
      <h1>CITY OF NOIR</h1>
      <p class="center muted" style="letter-spacing:2px">— нуарная мафия RPG —</p>
      <div class="center" style="margin:1.5rem 0">
        ${Components.button('Новая игра', 'Actions.newGame()', { primary: true })}
        ${Components.button('Продолжить', 'Actions.continueGame()', { disabled: !hasSave })}
      </div>
      ${graveyard.length > 0 ? `
        <hr>
        <h3 class="center">Кладбище</h3>
        ${graveyard.slice(-5).reverse().map(g =>
          `<p class="small muted center">День ${g.days || 0} — ${g.name || '?'} (${g.side === 'mafia' ? 'мафия' : 'полиция'}) · ${g.kills || 0} убийств${(g.overdoses || 0) > 0 ? ' · передоз: ' + g.overdoses : ''}</p>
           ${g.epitaph ? `<p class="small muted center" style="font-style:italic">${g.epitaph}</p>` : ''}`
        ).join('')}
      ` : ''}
      <hr>
      <div class="center">${Components.button('Летопись рода', 'Actions.go("prestige")')}</div>
      ${hasSave ? `<hr><div class="center">${Components.button('Стереть сейв', 'Actions.wipeSave()', { danger: true })}</div>` : ''}
      <p class="small muted center" style="margin-top:1rem">v2.0 — хардкор</p>
    `;
  },

  create() {
    return `
      <h2>Новая жизнь</h2>
      <p class="muted">${Utils.pick(Lore.noir.intro)}</p>
      <hr>
      <label class="small">Имя:</label>
      <input type="text" id="inp-name" maxlength="20" value="Безымянный">
      <hr>
      <h3>Сторона</h3>
      <div class="grid-2">
        <div class="card" id="side-mafia" onclick="Actions.pickSide('mafia')">
          <b>Мафия</b>
          <p class="small muted">Деньги, рэкет, контрабанда. Сила — в людях. Слабость — в законе.</p>
        </div>
        <div class="card" id="side-police" onclick="Actions.pickSide('police')">
          <b>Полиция</b>
          <p class="small muted">Бюджет, взятки, рейды. Сила — в законе. Слабость — в политике.</p>
        </div>
      </div>
      <div id="gang-input-wrap" style="display:none; margin-top:1rem">
        <label class="small" id="gang-label">Название:</label>
        <input type="text" id="inp-gang" maxlength="30">
        <div id="portrait-picker-wrap" style="display:none; margin-top:1rem">
          <h3>Твоё лицо</h3>
          <p class="small muted">Выбери, как ты выглядишь. Город запомнит.</p>
          <div class="row tight" style="margin-top:0.5rem">
            ${(Sprites && Sprites.men && Sprites.women) ? [...Sprites.men, ...Sprites.women].map(src =>
              `<img src="${src}" class="sprite medium hover" style="cursor:pointer"
                data-portrait="${src}"
                onclick="Actions.pickPortrait('${src}')">`
            ).join('') : ''}
          </div>
        </div>
        <div class="row" style="margin-top:1rem">
          ${Components.button('Начать', 'Actions.startGame()', { primary: true })}
        </div>
      </div>
    `;
  },

  city() {
    if (!State.city) return '<p class="red">Мир не сгенерирован.</p>';
    const p = State.player;
    // #69: страховка от неполных данных (старый сейв / ручная порча)
    const s = p.survival || { hunger: 0, thirst: 0, energy: 0 };
    const san = p.sanity || { sanity: 0, stress: 0 };
    const deps = p.dependencies || { withdrawal: null };
    const story = p.story;
    const enemyFaction = story ? State.factions.find(f => f.id === story.enemyFactionId) : null;

    // Предупреждения о критических состояниях
    const warnings = [];
    if (s.hunger < 20) warnings.push('<span class="red">Голод!</span>');
    if (s.thirst < 20) warnings.push('<span class="red">Жажда!</span>');
    if (s.energy < 20) warnings.push('<span class="red">Истощение!</span>');
    if (san.sanity < 30) warnings.push('<span class="red">Рассудок на грани!</span>');
    if (deps.withdrawal) warnings.push('<span class="red">Ломка: ' + deps.withdrawal.type + '</span>');

    return `
      <h2>${State.city.name}</h2>
      <p class="muted">${State.city.weather} · ${State.city.motto}</p>
      ${warnings.length ? `<div class="card hot">${warnings.join(' · ')}</div>` : ''}
      <hr>
      ${Components.card('Игрок', `
        <div class="sprite-row" style="margin-bottom:0.5rem">
          ${Components.sprite(p.portrait || 'assets/sprites/man.png1.jpg', 'large', 'player')}
          <div class="info">
            <p><b style="font-size:1.2em">${p.name}</b></p>
            <p class="small muted">${p.side === 'mafia' ? 'Мафия' : 'Полиция'} · ${p.gangName}</p>
            <p class="small">Уровень ${p.level || 1} · XP ${p.xp || 0}/${p.xpNext || 100}</p>
          </div>
        </div>
        <div class="row" style="justify-content:space-between; border-top:1px solid #333; padding-top:0.5rem; margin-top:0.5rem;">
          <div class="icon-text small ${s.hunger < 30 ? 'red' : ''}" title="Голод">${Icons.get('hunger')} ${s.hunger}</div>
          <div class="icon-text small ${s.thirst < 30 ? 'red' : ''}" title="Жажда">${Icons.get('thirst')} ${s.thirst}</div>
          <div class="icon-text small ${s.energy < 30 ? 'red' : ''}" title="Сон">${Icons.get('sleep')} ${s.energy}</div>
          <div class="icon-text small ${san.sanity < 30 ? 'red' : ''}" title="Рассудок">${Icons.get('sanity')} ${san.sanity}</div>
        </div>
      `)}
      ${State.city.news && State.city.news.length > 0 ? Components.card('Сводка с улиц', `
        ${State.city.news.map(n => `<p class="small muted" style="margin: 4px 0;">${n}</p>`).join('')}
      `) : ''}
      
      ${story ? Components.card('Твоя история', `
        <p class="small"><b>${story.archetypeName}.</b> ${story.backstory}</p>
        <p class="small gold">Цель: ${story.goal}</p>
        ${enemyFaction ? `<p class="small red">Враг: ${enemyFaction.name}</p>` : ''}
      `) : ''}
      
      ${(s.hunger < 30 || s.thirst < 30) ? `
        <div class="card hot" style="border-color:#a32626">
          <p class="small red"><b>ВНИМАНИЕ: Голод или жажда на исходе!</b></p>
          <div class="row">
            ${(p.inventory && p.inventory.food > 0) ? Components.button('Поесть (из инвентаря)', 'Actions.eat()', { primary: true }) : Components.button('Купить еду (в бар)', 'Actions.go("bar")', { primary: true })}
            ${(p.inventory && p.inventory.water > 0) ? Components.button('Попить (из инвентаря)', 'Actions.drink()') : Components.button('Купить воду (в бар)', 'Actions.go("bar")')}
          </div>
        </div>
      ` : ''}
      ${(State.events && State.events.pending && State.events.pending.length > 0) ? `
        <div class="card hot">
          <p><b>Событие ждёт решения</b></p>
          ${Components.button('Открыть', 'Actions.go("events")', { primary: true })}
        </div>
      ` : ''}
      ${typeof Perks !== 'undefined' && Perks.hasNew() ? `
        <div class="card hot">
          <p><b>Доступен новый перк!</b></p>
          ${Components.button('Выбрать перк', 'Actions.go("perkChoice")', { primary: true })}
        </div>
      ` : ''}
      <hr>
      <h3>Куда идти</h3>
      <div class="row">
        ${Components.button('Квесты', 'Actions.go("quests")')}
        ${Components.button('Оружие', 'Actions.go("shop")')}
        ${Components.button('Наёмники', 'Actions.go("mercenaries")')}
        ${Components.button('Мои зоны', 'Actions.go("myZones")', { primary: true })}
        ${Components.button('Все зоны', 'Actions.go("zones")')}
        ${Components.button('Фракции', 'Actions.go("factions")')}
        ${Components.button('Мэрия', 'Actions.go("mayorOffice")')}
        ${Components.button('Штаб', 'Actions.go("building")')}
        ${Components.button('Автосалоны', 'Actions.go("carsShowrooms")')}
        ${Components.button('Бар', 'Actions.go("bar")')}
        ${Components.button('Аптека', 'Actions.go("apothecary")')}
        ${Components.button('Дилер', 'Actions.go("dealer")')}
        ${Components.button('Игрок', 'Actions.go("player")')}
      </div>
      <hr>
      <div class="row">
        ${Components.button('Спать', 'Actions.sleep()', { primary: true })}
        ${Components.button('Сохранить в меню', 'Actions.saveAndMenu()')}
      </div>
    `;
  },

  barSceneView(params) {
    if (!params || !params.scene) return '<p>Ошибка сцены</p>';
    const scene = params.scene;
    return `
      <h2>${scene.title}</h2>
      <p class="muted" style="font-style:italic">${scene.desc}</p>
      <hr>
      <h3>Что делать?</h3>
      ${scene.choices.map((c, i) => `<div class="row" style="margin-bottom:0.5rem">${Components.button(c.text, `Actions.resolveBarScene('${scene.id}', ${i})`, { primary: true })}</div>`).join('')}
      <hr>
      ${Components.button('← Назад в бар', 'Actions.go("bar")')}
    `;
  },

  bar() {
    if (!State.player) return '<p>Нет игрока</p>';
    const inv = State.player.inventory || { food: 0, water: 0 };
    return `
      <h2>Бар</h2>
      <p class="muted">Дым, виски, тихие разговоры.</p>
      <hr>
      <h3>Еда</h3>
      <p class="small">Еда: ${inv.food} · Вода: ${inv.water}</p>
      <div class="row">
        ${Components.button('Съесть', 'Actions.eat()', { disabled: inv.food <= 0 })}
        ${Components.button('Выпить воду', 'Actions.drink()', { disabled: inv.water <= 0 })}
      </div>
      <div class="row">
        ${Components.button('Купить еду $80', 'Actions.buyFood(1)')}
        ${Components.button('Купить воду $30', 'Actions.buyWater(1)')}
      </div>
      <hr>
      <h3>Выпивка</h3>
      <div class="row">
        ${Object.entries(DrugDataBrands.alc).map(([id, b]) => 
          Components.button('Выпить ' + b.name + ' ($' + b.price + ')', `Actions.buyAndUseBrand('alc', '${id}')`)
        ).join('')}
      </div>
      <h3>Сигареты</h3>
      <div class="row">
        ${Object.entries(DrugDataBrands.cig).map(([id, b]) => 
          Components.button('Выкурить ' + b.name + ' ($' + b.price + ')', `Actions.buyAndUseBrand('cig', '${id}')`)
        ).join('')}
      </div>
      <hr>
      <h3>Осмотреться</h3>
      <p class="small muted">Здесь всегда кто-то хочет что-то продать. Или купить.</p>
      ${(State.player.barVisitsToday || 0) < 2 
        ? Components.button('Оглядеться по сторонам (1ч)', 'Actions.barScene()', { primary: true }) 
        : '<p class="small red">Бармен косится на тебя. «Хватит на сегодня». (Лимит 2/2)</p>'}
      <hr>
      <h3>Покерный стол</h3>
      <p class="small muted">Карты, дым, чужие деньги. Дилер ждёт.</p>
      ${(typeof Poker !== 'undefined' && Poker.canPlay()) ? `
        <div class="row">
          ${Components.button('Сесть за стол (анте $50)', 'Actions.pokerSit()', { primary: true })}
        </div>
        <p class="small muted">Игр сегодня: ${State.player.pokerGamesToday || 0} / ${Poker.MAX_GAMES}</p>
      ` : '<p class="small red">Дилер на сегодня закончил. Приходи завтра.</p>'}
      <hr>
      <h3>Женщины</h3>
      <p class="small muted">В этом баре всегда есть на кого посмотреть.</p>
      <div class="row">
        ${Components.button('Подойти к женщинам', 'Actions.go("barGirls")', { primary: true })}
      </div>
      <hr>
      <h3>Отдых</h3>
      ${Components.button('Посидеть, отдохнуть (2ч)', 'Actions.restInBar()')}
      <hr>
      ${Components.button('← В город', 'Actions.go("city")')}
    `;
  },

  apothecary() {
    if (!State.player || !State.player.inventory) return '<p>Ошибка: нет игрока</p>';
    const inv = State.player.inventory.medicine || {};
    const W = (typeof WoundData !== 'undefined' && WoundData.medicine) || {};
    return `
      <h2>Аптека</h2>
      <p class="muted">Врач без лицензии. Зато без вопросов и без бумажек.</p>
      <hr>
      <h3>Твои медикаменты</h3>
      <p class="small">${Object.entries(W).map(([id, med]) => `${med.name}: ${inv[id] || 0}`).join(' · ')}</p>
      <hr>
      <h3>Купить</h3>
      ${Object.entries(W).map(([id, med]) => {
        const discount = getTradeDiscount();
        const price = Math.round(med.price * (1 - discount));
        return `
        <div class="card">
          <div class="row" style="justify-content:space-between">
            <div><b>${med.name}</b></div>
            <div class="small gold">$${Utils.fmtMoney(price)}</div>
          </div>
          <p class="small muted">${med.desc || ''}</p>
          ${Components.button('Купить', `Actions.buyMedicine('${id}', 1)`)}
        </div>
      `;
      }).join('')}
      <hr>
      ${Components.button('← В город', 'Actions.go("city")')}
    `;
  },

  dealer() {
    if (!State.player) return '<p>Нет игрока</p>';
    const inv = State.player.inventory || {};
    return `
      <h2>Дилер</h2>
      <p class="muted">«Что нужно?» — он не смотрит в глаза.</p>
      <hr>
      <p class="small">У тебя: Сигареты: ${inv.cigs || 0} · Алкоголь: ${inv.alcohol || 0}</p>
      ${Object.entries(DrugData).filter(([id, d]) => d.id && typeof d === 'object' && d.price).map(([id, d]) => `
        <div class="card">
          <div><b>${d.name}</b> <span class="small muted">(${d.category})</span></div>
          <p class="small muted">${d.desc}</p>
          <p class="small">Зависимость: +${d.addictionGain} · Передоз: ${Math.round((d.overdoseChance || 0) * 100)}%</p>
          <p class="small gold">$${d.price}</p>
          <div class="row tight">
            ${Components.button('Купить', `Actions.buyDrug('${id}', 1)`)}
            ${((inv[id] || (id === 'alcohol' ? inv.alcohol : id === 'cigarettes' ? inv.cigs : (inv.drugs && inv.drugs[id]))) || 0) > 0
              ? Components.button('Использовать', `Actions.useDrug('${id}')`, { primary: true })
              : ''}
          </div>
        </div>
      `).join('')}
      <hr>
      ${Components.button('← В город', 'Actions.go("city")')}
    `;
  },

  building() {
    if (!State.building || !State.building.modules) return '<p>Штаб недоступен</p>';
    const b = State.building;
    const businesses = State.businesses || [];
    const zones = State.zones || [];
    const now = Time.totalHours();
    return `
      <h2>Штаб</h2>
      <p class="muted">Твоя база. Здесь ты либо поднимаешься, либо сдохнешь.</p>
      <hr>
      ${Object.entries(Buildings.modules).map(([id, def]) => {
        const mod = b.modules[id];
        const cost = Buildings.moduleCost(id, mod.level);
        const time = Buildings.moduleTime(id, mod.level);
        const remaining = mod.upgradeUntil ? Math.max(0, mod.upgradeUntil - now) : 0;
        return `
          <div class="card">
            <div class="row" style="justify-content:space-between">
              <div><b>${def.name}</b> <span class="small muted">ур. ${mod.level}</span></div>
              ${mod.upgradeUntil ? '<span class="small">Осталось: ' + remaining + 'ч</span>' : ''}
            </div>
            <p class="small muted">${def.desc}</p>
            ${!mod.upgradeUntil ? `
              <p class="small">Апгрейд: $${Utils.fmtMoney(cost)} · ${time}ч</p>
              ${Components.button(`Улучшить до ур.${mod.level + 1}`, `Actions.upgradeModule('${id}')`)}
            ` : ''}
          </div>
        `;
      }).join('')}
      <hr>
      <h3>Бизнесы (${businesses.length})</h3>
      ${businesses.map(biz => `
        <div class="card">
          <b>${biz.name}</b> <span class="small muted">+$${biz.income}/день</span>
        </div>
      `).join('')}
      <h3>Купить бизнес</h3>
      ${Object.entries(Buildings.businesses).map(([id, def]) => `
        <div class="card">
          <div><b>${def.name}</b> <span class="small gold">$${Utils.fmtMoney(def.buyPrice)}</span></div>
          <p class="small muted">${def.desc} · +$${def.income}/день</p>
          <div class="row tight">
            ${zones.slice(0, 6).map(z => {
              const bizCount = Array.isArray(z.businesses) ? z.businesses.length : 0;
              return bizCount < 2
                ? Components.button(z.name, `Actions.buyBusiness('${id}', '${z.id}')`)
                : '';
            }).join('')}
          </div>
        </div>
      `).join('')}
      <hr>
      ${Components.button('← В город', 'Actions.go("city")')}
    `;
  },

  events() {
    if (!State.events || !State.events.pending) return `<p class="muted">Событий нет.</p>${Components.button('← В город', 'Actions.go("city")')}`;
    const pending = State.events.pending;
    if (pending.length === 0) return `<p class="muted">Событий нет.</p>${Components.button('← В город', 'Actions.go("city")')}`;
    const ev = pending[0];
    // #75: сохраняем портрет в событии (не меняется при рендере)
    if (!ev.portrait && typeof Sprites !== 'undefined') {
      ev.portrait = Sprites.randomAny();
      Save.save();
    }
    return `
      <div class="sprite-row">
        ${Components.sprite(ev.portrait || 'assets/sprites/man.png1.jpg', 'large')}
        <div class="info">
          <h2 style="margin:0">${ev.title}</h2>
          <p class="muted">${ev.desc}</p>
        </div>
      </div>
      <hr>
      <h3>Что делать?</h3>
      ${(ev.choices || []).map((c, i) => {
        const canAfford = !c.requires || !c.requires.money || State.player.money >= c.requires.money;
        return `<div class="row">
          ${Components.button(c.text, `Actions.resolveEvent('${ev.id}', ${i})`, { disabled: !canAfford, primary: true })}
        </div>`;
      }).join('')}
    `;
  },

  quests() {
    if (!State.quests) State.quests = { available: [], active: [], completed: [], failed: [], dailyReset: 1 };
    const active = State.quests.active;
    const available = State.quests.available;
    const filter = (Engine.params && Engine.params.filter) || 'all';
    const page = (Engine.params && Engine.params.page) || 0;

    // Группировка по типу
    const typeLabels = {
      combat: 'Бой', stealth: 'Скрытность', trade: 'Сделка',
      social: 'Разговор', patrol: 'Патруль',
    };
    const counts = {};
    for (const q of available) {
      const key = q.fromFaction ? 'faction' : q.type;
      counts[key] = (counts[key] || 0) + 1;
    }

    // Фильтрация
    let filtered = available;
    if (filter !== 'all') {
      filtered = available.filter(q => {
        if (filter === 'faction') return !!q.fromFaction;
        return q.type === filter && !q.fromFaction;
      });
    }

    // Пагинация — 5 за раз
    const PER_PAGE = 5;
    const total = filtered.length;
    const pageCount = Math.ceil(total / PER_PAGE);
    const start = page * PER_PAGE;
    const shown = filtered.slice(start, start + PER_PAGE);

    return `
      <h2>Квесты</h2>

      <h3>Активные (${active.length}/${Quests.MAX_ACTIVE})</h3>
      ${active.length === 0 ? '<p class="muted">Пока ничего.</p>' :
        active.map(q => `
          <div class="card">
            <div>
              <b>${q.title}</b> 
              ${q.type === 'combat' ? '<span class="tag danger" style="font-size:1.1em; border:1px solid #fff; background:#300; color:#fff">⚔ ПЕРЕСТРЕЛКА</span>' : `<span class="small muted">(${QuestData.typeLabels[q.type]?.label || q.type})</span>`}
            </div>
            <p class="small muted">${q.desc}</p>
            <p class="small">Где: ${q.zoneName} · Займёт: ${q.duration}ч · Риск ${Math.round(q.risk * 100)}%</p>
            <p class="small">Награда: $${Utils.fmtMoney((typeof Quests !== 'undefined') ? Quests.calcReward(q.reward.money) : q.reward.money)} · XP ${q.reward.xp} · REP ${q.reward.rep}</p>
            <div class="row tight">
              ${Components.button('Выполнить', `Actions.executeQuest('${q.id}')`, { primary: true })}
            </div>
          </div>
        `).join('')}

      <hr>
      <h3>Доступные (${total}${filter !== 'all' ? ' / ' + available.length : ''})</h3>

      <div class="row tight" style="margin-bottom:0.5rem; flex-wrap:wrap">
        ${Components.button('Все' + (filter === 'all' ? ' •' : ''), `Actions.setQuestFilter('all')`, { primary: filter === 'all' })}
        ${counts.combat ? Components.button('Бой (' + counts.combat + ')' + (filter === 'combat' ? ' •' : ''), `Actions.setQuestFilter('combat')`, { primary: filter === 'combat' }) : ''}
        ${counts.stealth ? Components.button('Скрытность (' + counts.stealth + ')' + (filter === 'stealth' ? ' •' : ''), `Actions.setQuestFilter('stealth')`, { primary: filter === 'stealth' }) : ''}
        ${counts.trade ? Components.button('Сделка (' + counts.trade + ')' + (filter === 'trade' ? ' •' : ''), `Actions.setQuestFilter('trade')`, { primary: filter === 'trade' }) : ''}
        ${counts.social ? Components.button('Разговор (' + counts.social + ')' + (filter === 'social' ? ' •' : ''), `Actions.setQuestFilter('social')`, { primary: filter === 'social' }) : ''}
        ${counts.patrol ? Components.button('Патруль (' + counts.patrol + ')' + (filter === 'patrol' ? ' •' : ''), `Actions.setQuestFilter('patrol')`, { primary: filter === 'patrol' }) : ''}
        ${counts.faction ? Components.button('Фракция (' + counts.faction + ')' + (filter === 'faction' ? ' •' : ''), `Actions.setQuestFilter('faction')`, { primary: filter === 'faction' }) : ''}
      </div>

      ${total === 0 ? '<p class="muted">Нет квестов в этой категории.</p>' :
        shown.map(q => `
          <div class="card">
            <div>
              <b>${q.title}</b> 
              ${q.type === 'combat' ? '<span class="tag danger" style="font-size:0.9em; border:1px solid #fff; background:#300; color:#fff">⚔ БОЙ</span>' : ''}
              ${q.daily ? '<span class="tag">ежедневный</span>' : ''} 
              ${q.fromFaction ? '<span class="tag owner">фракция</span>' : ''} 
              ${q.dangerous ? '<span class="tag danger">[ОПАСНО]</span>' : ''}
            </div>
            <p class="small muted">${q.desc}</p>
            <p class="small">${q.giverName || 'Неизвестный'} · ${q.zoneName} · Риск ${Math.round(q.risk * 100)}% · $${Utils.fmtMoney((typeof Quests !== 'undefined') ? Quests.calcReward(q.reward.money) : q.reward.money)}</p>
            <div class="row tight">
              ${Components.button('Принять', `Actions.acceptQuest('${q.id}')`, { primary: true })}
              ${Components.button('Отклонить', `Actions.declineQuest('${q.id}')`, { danger: true })}
            </div>
          </div>
        `).join('')}

      ${pageCount > 1 ? `
        <div class="row" style="justify-content:center; margin-top:0.5rem">
          ${page > 0 ? Components.button('← Назад', `Actions.setQuestPage(${page - 1})`) : ''}
          <span class="small muted" style="align-self:center">Стр. ${page + 1}/${pageCount}</span>
          ${page < pageCount - 1 ? Components.button('Ещё →', `Actions.setQuestPage(${page + 1})`) : ''}
        </div>
      ` : ''}

      <hr>
      ${Components.button('← В город', 'Actions.go("city")')}
    `;
  },

  shop() {
    if (!State.player) return '<p>Нет игрока</p>';
    const owned = (State.weapons && State.weapons.owned) || [];
    const prices = (State.economy && State.economy.prices) || {};
    const weapons = Weapons.list.filter(w => w.rarity <= 3 || owned.includes(w.id));
    const discount = getTradeDiscount();
    return `
      <h2>Оружейный магазин</h2>
      <p class="muted small">«Что нужно?» — спрашивает продавец, не поднимая глаз. У него их два.</p>
      <hr>
      <h3>Броня</h3>
      ${Weapons.armor.map(a => {
        const price = Math.round(a.basePrice * (1 - discount));
        const equipped = State.player.armor === a.id;
        const owned = State.player.inventory.ownedArmor && State.player.inventory.ownedArmor.includes(a.id);
        return `
          <div class="card">
            <div class="row" style="justify-content:space-between">
              <div><b>${a.name}</b> ${owned ? '<span class="tag">куплено</span>' : ''}</div>
              <div class="small gold">${a.basePrice === 0 ? 'бесплатно' : '$' + Utils.fmtMoney(price)}</div>
            </div>
            <p class="small muted">${a.desc}</p>
            <p class="small">Защита: ${a.defense} · Вес: ${a.weight}кг</p>
            <div class="row tight">
              ${equipped ? '<span class="tag owner">надето</span>' :
                !owned && a.basePrice > 0 ? Components.button(`Купить $${Utils.fmtMoney(price)}`, `Actions.buyArmor('${a.id}')`) :
                Components.button('Надеть', `Actions.equipArmor('${a.id}')`)}
            </div>
          </div>
        `;
      }).join('')}
      <hr>
      <h3>Патроны</h3>
      ${Weapons.ammo.map(a => {
        const price = Math.round(a.price * (1 - discount));
        return `
          <div class="card">
            <div class="row" style="justify-content:space-between">
              <div><b>${a.name}</b></div>
              <div class="small gold">$${Utils.fmtMoney(price)}</div>
            </div>
            ${Components.button('Купить', `Actions.buyAmmo('${a.id}', 1)`)}
          </div>
        `;
      }).join('')}
      <hr>
      <h3>Оружие</h3>
      ${weapons.map(w => {
        const price = prices[w.id] || w.basePrice;
        const isOwned = owned.includes(w.id);
        const equipped = State.player.currentWeaponId === w.id;
        return `
          <div class="card">
            <div class="row" style="justify-content:space-between">
              <div><b>${w.name}</b> <span class="small muted">(${w.category})</span></div>
              <div class="small">${equipped ? '<span class="tag owner">в руках</span>' : isOwned ? '<span class="tag">куплено</span>' : ''}</div>
            </div>
            <p class="small muted">${w.desc}</p>
            <p class="small">Урон ${w.damage} · Точность ${Math.round(w.accuracy * 100)}% · Магазин ${w.magazine} · Дальность ${w.range}м</p>
            <p class="small gold">$${Utils.fmtMoney(price)}</p>
            <div class="row tight">
              ${!isOwned ? Components.button(`Купить $${Utils.fmtMoney(price)}`, `Actions.buyWeapon('${w.id}')`)
                : !equipped ? `
                  ${Components.button('Взять в руки', `Actions.equipWeapon('${w.id}')`)}
                  ${Components.button(`Продать ($${Utils.fmtMoney(Math.round(w.basePrice * 0.5))})`, `Actions.sellWeapon('${w.id}')`, { danger: true })}
                ` : '<span class="tag owner">в руках</span>'}
            </div>
          </div>
        `;
      }).join('')}
      <hr>
      ${Components.button('← В город', 'Actions.go("city")')}
    `;
  },

  guardSelect(params) {
    if (!params || !params.mercId) return Engine.go('mercenaries');
    if (!State.mercenaries) return Engine.go('mercenaries');
    const m = State.mercenaries.active.find(x => x.id === params.mercId);
    if (!m) return Engine.go('mercenaries');
    const myZones = (State.zones || []).filter(z => z.ownerId === 'player');

    return `
      <h2>Кого охранять?</h2>
      <p class="small muted">Наёмник будет защищать выбранную зону (+3 к охране). Пока он там, он не может выполнять другие миссии.</p>
      ${myZones.length === 0 ? '<p class="red">У тебя нет зон.</p>' : 
        myZones.map(z => `
          <div class="card">
            <div class="row" style="justify-content:space-between">
              <div><b>${z.name}</b></div>
              <div class="small">Охрана: ${z.guards || 0}</div>
            </div>
            ${Components.button('Назначить', `Actions.assignMission('${m.id}', 'guard', '${z.id}')`, { primary: true })}
          </div>
        `).join('')}
      <hr>
      ${Components.button('← Назад', 'Actions.go("mercenaries")')}
    `;
  },

  mercenaries() {
    if (!State.mercenaries) State.mercenaries = { pool: [], active: [], poolResetDay: 1 };
    const active = State.mercenaries.active;
    const pool = State.mercenaries.pool;
    const now = Time.totalHours();
    return `
      <h2>Наёмники</h2>
      <h3>Твои люди (${active.length})</h3>
      ${active.length === 0 ? '<p class="muted">Пока никого.</p>' :
        active.map(m => {
          const remaining = m.mission ? m.mission.until - now : 0;
          return `
            <div class="card">
              <div class="sprite-row">
                ${Components.sprite(m.portrait || Sprites.byName(m.name), 'medium')}
                <div class="info">
                  <div class="row" style="justify-content:space-between">
                    <div><b>${m.name}</b> <span class="small muted">(${m.className})</span></div>
                    <div class="small">${m.status === 'idle' ? '<span class="green">свободен</span>' : '<span class="muted">на задании</span>'}</div>
                  </div>
                  <p class="small muted">${m.classDesc}</p>
                </div>
              </div>
              <p class="small">Стрельба ${(m.stats && m.stats.shooting) || 0} · Здоровье ${(m.stats && m.stats.health) || 0} · Верность ${(m.stats && m.stats.loyalty) || 0}</p>
              <p class="small">Содержание: $${Utils.fmtMoney(m.upkeep || 0)}/день</p>
              ${m.mission ? `<p class="small gold">${m.mission.name} · ${Math.max(0, remaining)}ч</p>` : ''}
              <div class="row tight">
                ${m.status === 'idle' ? `
                  ${Components.button('Охрана', `Actions.guardZoneSelect('${m.id}')`)}
                  ${Components.button('Патруль', `Actions.assignMission('${m.id}', 'patrol')`)}
                  ${Components.button('Кража', `Actions.assignMission('${m.id}', 'steal')`)}
                  ${Components.button('Рейд', `Actions.assignMission('${m.id}', 'raid')`)}
                  ${Components.button('Разведка', `Actions.assignMission('${m.id}', 'scout')`)}
                  ${Components.button('Диверсия', `Actions.assignMission('${m.id}', 'sabotage')`)}
                ` : ''}
                ${m.mission && m.mission.type === 'guard' ? Components.button('Отозвать', `Actions.recallMerc('${m.id}')`) : ''}
                ${Components.button('Уволить', `Actions.dismissMerc('${m.id}')`, { danger: true, disabled: m.status !== 'idle' })}
              </div>
            </div>
          `;
        }).join('')}
      <hr>
      <h3>Биржа (${pool.length})</h3>
      ${pool.length === 0 ? '<p class="muted">Обновится через пару дней.</p>' :
        pool.map(m => `
          <div class="card">
            <div class="sprite-row">
              ${Components.sprite(m.portrait || Sprites.byName(m.name), 'medium')}
              <div class="info">
                <div><b>${m.name}</b> <span class="small muted">(${m.className})</span></div>
                <p class="small muted">${m.classDesc}</p>
                <p class="small">Стрельба ${(m.stats && m.stats.shooting) || 0} · Здоровье ${(m.stats && m.stats.health) || 0} · Верность ${(m.stats && m.stats.loyalty) || 0}</p>
                <p class="small">Найм: $${Utils.fmtMoney(m.price || 0)} · Содержание: $${Utils.fmtMoney(m.upkeep || 0)}/день</p>
              </div>
            </div>
            <div class="row tight">
              ${Components.button(`Нанять $${Utils.fmtMoney(m.price)}`, `Actions.hireMerc('${m.id}')`)}
            </div>
          </div>
        `).join('')}
      <hr>
      ${Components.button('← В город', 'Actions.go("city")')}
    `;
  },

  combat() {
    if (!State.player) return '<p class="red">Нет игрока.</p>';
    const c = State.combat;
    if (!c) return `<p class="red">Бой не идёт.</p>${Components.button('← В город', 'Actions.go("city")')}`;

    if (c.finished) {
      const win = c.outcome === 'win';
      const lose = c.outcome === 'lose';
      return `
        <h2>${lose ? 'Ты упал' : win ? 'Ты стоишь' : 'Ты ушёл'}</h2>
        <hr>
        <p class="muted" style="font-style:italic">${lose ? Utils.pick(Lore.noir.lose) : win ? Utils.pick(Lore.noir.win) : 'Ты бежишь. Город не прощает, но иногда — отпускает.'}</p>
        <hr>
        <div class="center">${Components.button(lose ? 'Начать заново' : 'Продолжить', 'Actions.combatFinish()', { primary: true })}</div>
      `;
    }

    if (!c.playerState) c.playerState = { weaponId: null, ammo: 0 };
    const weapon = Weapons.find(c.playerState.weaponId) || Weapons.list[0] || { name: 'Кулаки', magazine: 0 };
    const penalties = Combat._getAllPenalties();

    return `
      <h2 style="color:#a32626; text-align:center;">ПЕРЕСТРЕЛКА</h2>
      <p class="center muted">Дистанция ${c.distance}м · Раунд ${c.round}</p>
      <p class="center" style="font-weight:bold; font-size:1.2em; color:${c.turn === 'player' ? '#fff' : '#888'};">${c.turn === 'player' ? 'ТВОЙ ХОД' : 'ХОД ВРАГА...'}</p>
      ${penalties.log.length ? `<p class="small red center">Штрафы: ${penalties.log.join(', ')}</p>` : ''}
      <hr>

      <div class="grid-2">
        <div class="card hot" style="margin:0; padding:0.5rem;">
          <h3 style="text-align:center; margin:0 0 0.5rem 0;">ТЫ</h3>
          <div style="text-align:center; margin-bottom:0.5rem;">${Components.sprite(State.player.portrait || 'assets/sprites/man.png1.jpg', 'large', 'player')}</div>
          <p class="small center" style="margin-bottom:0.2rem;">${Components.bodyBar(State.player.body)}</p>
          <p class="small center gold">${weapon.name} · ${c.playerState.ammo}/${c.playerState.effectiveMag || weapon.magazine}</p>
        </div>
        
        <div class="card" style="margin:0; padding:0.5rem;">
          <h3 style="text-align:center; margin:0 0 0.5rem 0;">ВРАГ</h3>
          <div style="text-align:center; margin-bottom:0.5rem;">${Components.sprite((c.enemy && c.enemy.portrait) || (Sprites && Sprites.byName ? Sprites.byName(c.enemy && c.enemy.name) : 'assets/sprites/man.png1.jpg'), 'large', 'enemy')}</div>
          <p class="small center" style="margin-bottom:0.2rem;">${Components.bodyBar(c.enemy && c.enemy.body)}</p>
          <p class="small center" style="color:#888">${(c.enemy && c.enemy.name) || '?'} ${(c.enemy && c.enemy.debuff) ? '('+c.enemy.debuff+')' : ''}</p>
        </div>
      </div>
      
      <hr>
      <div style="max-height:15vh; overflow-y:auto; padding:0.4rem; border:1px solid #262626; background:#000; margin-bottom:1rem;">
        ${(c.log || []).map(l => `<p class="small ${l.type === 'bad' ? 'red' : l.type === 'good' ? 'green' : l.type === 'lore' ? 'muted' : ''}" style="margin:2px 0;">${l.text}</p>`).join('')}
      </div>
      <hr>

      ${c.turn === 'player' ? `
        <h3 style="text-align:center">КУДА СТРЕЛЯЕМ?</h3>
        <div class="row" style="justify-content:center; margin-bottom:1rem;">
          ${Components.button(Icons.get('skull') + ' ГОЛОВА', `Actions.combatAction('shoot', 'head')`, { primary: true })}
          ${Components.button('ТОРС', `Actions.combatAction('shoot', 'torso')`)}
          ${Components.button('Л.РУКА', `Actions.combatAction('shoot', 'leftArm')`)}
          ${Components.button('П.РУКА', `Actions.combatAction('shoot', 'rightArm')`)}
        </div>
        <div class="row" style="justify-content:center; margin-bottom:1rem;">
          ${Components.button('Л.НОГА', `Actions.combatAction('shoot', 'leftLeg')`)}
          ${Components.button('П.НОГА', `Actions.combatAction('shoot', 'rightLeg')`)}
        </div>

        <h3 style="text-align:center">ДРУГИЕ ДЕЙСТВИЯ</h3>
        <div class="row" style="justify-content:center;">
          ${Components.button('Прицелиться (+25%)', `Actions.combatAction('aim')`)}
          ${Components.button('В укрытие (-40% урона)', `Actions.combatAction('cover')`)}
          ${c.playerState.jammed ? Components.button('⚠ Передёрнуть затвор', `Actions.combatAction('unjam')`, { danger: true, primary: true }) : Components.button('Перезарядить', `Actions.combatAction('reload')`)}
          ${Components.button('Ударить', `Actions.combatAction('melee', 'torso')`)}
          ${Components.button('Убежать', `Actions.combatAction('flee')`, { danger: true })}
        </div>
      ` : '<p class="muted center" style="font-style:italic; padding:2rem 0;">Враг целится...</p>'}
    `;
  },

  zones() {
    return `
      <h2>Зоны города</h2>
      <p class="muted small">Тридцать кусков этого города. Каждый что-то значит.</p>
      <hr>
      ${(State.zones || []).map(z => Components.zoneCard(z)).join('')}
      <hr>
      ${Components.button('← В город', 'Actions.go("city")')}
    `;
  },

  myZones() {
    if (typeof ZonesSystem === 'undefined') return '<p class="red">Система зон недоступна.</p>';
    const my = ZonesSystem.playerZones();
    const max = ZonesSystem.maxZones();
    const idle = ZonesSystem.idleMercs();
    const allZones = (State.zones || []).filter(z => z.ownerId !== 'player');

    return `
      <h2>Мои зоны</h2>
      <p class="muted">Зоны под контролем: ${my.length} / ${max} (лимит = 3 + казарма×2)</p>
      <p class="small muted">Свободных наёмников: ${idle.length}</p>
      <hr>

      <h3>Мои (${my.length})</h3>
      ${my.length === 0 ? '<p class="muted">Пока ничего. Захвати нейтральную зону — это начало.</p>' :
        my.map(z => `
          <div class="card">
            <div class="row" style="justify-content:space-between">
              <div><b>${z.name}</b> <span class="small muted">(${z.typeName})</span></div>
              <div class="small gold">+$${z.income}/день</div>
            </div>
            <p class="small muted">Охрана: ${z.guards || 0} · Ресурс: ${z.resource}</p>
            <div class="row tight">
              ${Components.button('Укрепить $500', `Actions.garrisonZone('${z.id}')`)}
              ${Components.button('Оставить', `Actions.abandonZone('${z.id}')`, { danger: true })}
            </div>
          </div>
        `).join('')}

      <hr>
      <h3>Доступные для захвата (${allZones.length})</h3>
      ${allZones.length === 0 ? '<p class="muted">Весь город под твоим контролем.</p>' :
        allZones.slice(0, 30).map(z => {
          const owner = z.ownerId
            ? (State.factions.find(f => f.id === z.ownerId)?.name || '?')
            : 'нейтрал';
          const check = ZonesSystem.canCapture(z.id) || { ok: false, reason: 'Нельзя' };
          const isFaction = z.ownerId && z.ownerId !== 'player';

          return `
            <div class="card">
              <div class="row" style="justify-content:space-between">
                <div><b>${z.name}</b> <span class="small muted">(${z.typeName})</span></div>
                <div class="small">${owner}</div>
              </div>
              <p class="small muted">Доход $${z.income}/день · Сложность ${z.difficulty} · Ресурс: ${z.resource}</p>
              ${isFaction ? `<p class="small red">Охрана фракции: ${z.guards || 0}</p>` : ''}
              <div class="row tight">
                ${isFaction
                  ? Components.button(check.ok ? 'Атаковать' : (check.reason || 'Нельзя'),
                      check.ok ? `Actions.attackFactionZone('${z.id}')` : '', { danger: check.ok, disabled: !check.ok })
                  : Components.button(check.ok ? 'Захватить' : (check.reason || 'Нельзя'),
                      check.ok ? `Actions.captureZone('${z.id}')` : '', { primary: check.ok, disabled: !check.ok })
                }
              </div>
            </div>
          `;
        }).join('')}

      <hr>
      ${Components.button('← В город', 'Actions.go("city")')}
    `;
  },

  perkChoice() {
    if (!State.player) return '<p class="red">Нет игрока.</p>';
    if (typeof Perks === 'undefined') return '<p class="red">Система перков недоступна.</p>';
    const available = Perks.getAvailable();
    const taken = State.player.perks || [];
    const canTake = Perks.hasNew();

    return `
      <h2>Выбор перка</h2>
      <p class="muted">Уровень ${State.player.level} · Взято ${taken.length} / ${Perks.maxAllowed()}</p>
      ${!canTake ? '<p class="red">Пока нельзя взять новый перк. Расти в уровне.</p>' : ''}
      <hr>
      <h3>Доступные (${available.length})</h3>
      ${available.length === 0 ? '<p class="muted">Нет доступных — все ветки закрыты или не хватает уровня.</p>' :
        available.map(p => `
          <div class="card">
            <div><b>${p.name}</b> <span class="small muted">(${p.branchName}, шаг ${p.step})</span></div>
            <p class="small muted">${p.desc}</p>
            ${canTake ? Components.button('Взять', `Actions.pickPerk('${p.id}')`, { primary: true }) : ''}
          </div>
        `).join('')}
      <hr>
      <h3>Взятые (${taken.length})</h3>
      ${taken.length === 0 ? '<p class="muted">Пока ничего.</p>' :
        taken.map(id => {
          const p = (typeof PerkData !== 'undefined' && PerkData.find) ? PerkData.find(id) : null;
          return p ? `<p class="small">[+] ${p.name} — ${p.desc}</p>` : '';
        }).join('')}
      <hr>
      ${Components.button('← В город', 'Actions.go("city")')}
    `;
  },

  factionDialogue(params) {
    if (!params || !params.factionId) return '<p class="red">Фракция не найдена.</p>' + Components.button('← Назад', 'Actions.go("factions")');
    const faction = (State.factions || []).find(f => f.id === params.factionId);
    if (!faction) return '<p class="red">Фракция не найдена.</p>' + Components.button('← Назад', 'Actions.go("factions")');

    const leader = (State.npcs || []).find(n => n.id === faction.leaderId);
    const rel = (faction.relations && faction.relations.player) || 0;
    const relLabel = rel < -30 ? 'враждебно' : rel < 10 ? 'холодно' : rel > 40 ? 'тепло' : 'нейтрально';
    const greeting = (typeof Dialogues !== 'undefined') ? Dialogues.getGreeting(faction) : '«…»';
    const lastResult = params.result || null;
    const ally = faction.allyWithPlayer;

    return `
      <h2>${faction.name}</h2>
      <p class="muted small">${faction.trait} · Сила ${faction.power} · Зон ${faction.zones}</p>
      <hr>
      <div class="sprite-row">
        ${Components.sprite(leader && typeof Sprites !== 'undefined' ? Sprites.byName(leader.name) : (typeof Sprites !== 'undefined' ? Sprites.randomMan() : ''), 'large', 'enemy')}
        <div class="info">
          <p><b>${leader ? leader.name : 'Лидер'}</b></p>
          <p class="small muted">Отношение: ${relLabel} (${rel})${ally ? ' · <span class="green">СОЮЗНИК</span>' : ''}</p>
          <p style="font-style:italic; margin-top:0.4rem">${greeting}</p>
        </div>
      </div>
      ${lastResult && lastResult.text ? `<div class="card ${lastResult.ok ? '' : 'hot'}" style="border-color:${lastResult.ok ? '#4a7a4a' : '#8a2a2a'}"><p>${lastResult.text}</p></div>` : ''}
      <hr>
      <h3>Что сказать</h3>
      ${ally ? '<p class="small muted">Вы союзники. Торг и угрозы — не для вас.</p>' : ''}
      <div class="row">
        ${!ally ? Components.button('Предложить союз', `Actions.dialogueAction('${faction.id}', 'ally')`) : ''}
        ${ally ? Components.button('Разорвать союз', `Actions.breakAlly('${faction.id}')`, { danger: true }) : ''}
        ${Components.button('Торговля', `Actions.dialogueAction('${faction.id}', 'trade')`)}
        ${!ally ? Components.button('Угрожать', `Actions.dialogueAction('${faction.id}', 'threat')`, { danger: true }) : ''}
        ${Components.button('Попросить работу', `Actions.dialogueAction('${faction.id}', 'job')`, { primary: true })}
        ${Components.button('Спросить про тайну', `Actions.dialogueAction('${faction.id}', 'mystery')`)}
      </div>
      <hr>
      ${Components.button('← Назад', 'Actions.go("factions")')}
    `;
  },

  zoneSceneView(params) {
    if (!params || !params.scene) return '<p>Ошибка сцены</p>';
    const scene = params.scene;
    return `
      <h2>${scene.title}</h2>
      <p class="muted" style="font-style:italic">${scene.desc}</p>
      <hr>
      <h3>Что делать?</h3>
      ${scene.choices.map((c, i) => `<div class="row" style="margin-bottom:0.5rem">${Components.button(c.text, `Actions.resolveZoneScene('${scene.id}', ${i})`, { primary: true })}</div>`).join('')}
      <hr>
      ${Components.button('← Назад', 'Actions.go("zones")')}
    `;
  },

  copEvent(params) {
    if (!params || !params.eventId) return Engine.go('city');
    if (typeof CopEvents === 'undefined') return Engine.go('city');
    if (!State.player) return Engine.go('city');
    const event = CopEvents.find(e => e.id === params.eventId);
    if (!event) return Engine.go('city');

    // Считаем цену взятки для показа
    const basePrice = 500 + ((State.player.heat || 0) * 20) + ((State.player.level || 1) * 100);

    return `
      <h2 style="color:#a32626">${event.title}</h2>
      <p class="muted" style="font-style:italic">${event.desc}</p>
      <hr>
      <p class="small">Твой Heat: <b>${State.player.heat}</b> · Деньги: <b>$${Utils.fmtMoney(State.player.money)}</b></p>
      <p class="small muted">Цена взятки: ~$${Utils.fmtMoney(basePrice)}</p>
      <hr>
      <h3>Что делать?</h3>
      ${(event.actions || []).map(a => {
        let label = a.text;
        if (a.type === 'bribe') {
          let price = basePrice;
          if (a.priceMod) price = Math.round(price * a.priceMod);
          label = a.text + ' ($' + Utils.fmtMoney(price) + ')';
          if (State.player.money < price) {
            return `<div class="row" style="margin-bottom:0.5rem">${Components.button(label, '', { disabled: true })}</div>`;
          }
        }
        return `<div class="row" style="margin-bottom:0.5rem">${Components.button(label, `Actions.copAction('${event.id}', '${a.id}')`, { primary: true, danger: a.type === 'fight' })}</div>`;
      }).join('')}
    `;
  },

  pokerTable() {
    if (!State.player) return Engine.go('bar');
    const s = State.poker;
    if (!s) return Engine.go('bar');

    const playerCards = Cards.showHand(s.playerHand);
    const playerStr = Cards.describe(s.playerHand);

    if (s.stage === 'decide') {
      return `
        <h2>Покерный стол</h2>
        <p class="muted">Дым висит над столом. Дилер смотрит на тебя без эмоций.</p>
        <hr>
        <p class="small gold">Твои карты: <b style="font-size:1.4em; color:white">${playerCards}</b> <span class="muted">(${playerStr})</span></p>
        <p class="small">Ставка: <b>$${Utils.fmtMoney(s.playerBet)}</b> · В кармане: <b>$${Utils.fmtMoney(State.player.money)}</b></p>
        <hr>
        <h3>Что делать?</h3>
        <div class="row">
          ${Components.button('Сбросить', 'Actions.pokerFold()', { danger: true })}
          ${Components.button('Уравнять (+$50)', 'Actions.pokerCall()', { primary: true })}
        </div>
        <h3>Поднять ставку</h3>
        <p class="small muted">От $${Poker.MIN_RAISE} до $${Poker.MAX_RAISE}. Не больше, чем у тебя в кармане.</p>
        <div class="row">
          <input type="number" id="poker-raise" min="${Poker.MIN_RAISE}" max="${Poker.MAX_RAISE}" value="${Poker.MIN_RAISE}" style="max-width:8em; font-size:18px; background:#000; color:#fff; border:1px solid #555; padding:0.4rem;">
          ${Components.button('Поднять', 'Actions.pokerRaise()', { primary: true })}
        </div>
        <hr>
        ${Components.button('Выйти из-за стола', 'Actions.pokerLeave()', { danger: true })}
      `;
    }

    // Результат
    let resultHeader = '';
    if (s.result === 'win') resultHeader = '<h2 style="color:#6fa84f">Ты выиграл</h2>';
    else if (s.result === 'lose') resultHeader = '<h2 style="color:#a32626">Ты проиграл</h2>';
    else resultHeader = '<h2>Сброс</h2>';

    return `
      ${resultHeader}
      <hr>
      <p class="small gold">Твои карты: <b style="font-size:1.3em">${playerCards}</b> (${playerStr})</p>
      <p class="small">Карты дилера: <b style="font-size:1.3em">${Cards.showHand(s.dealerHand)}</b> (${Cards.describe(s.dealerHand)})</p>
      <hr>
      <p class="big ${(s.netGain || 0) >= 0 ? 'green' : 'red'}">${(s.netGain || 0) >= 0 ? '+' : ''}$${Utils.fmtMoney(s.netGain || 0)}</p>
      <p class="small">В кармане: $${Utils.fmtMoney(State.player.money)}</p>
      <hr>
      ${Components.button('Уйти из-за стола', 'Actions.pokerLeave()', { primary: true })}
    `;
  },

  mayorOffice() {
    if (typeof Politics === 'undefined') return '<p class="red">Политика недоступна.</p>';
    if (!State.player) return '<p class="red">Нет игрока.</p>';
    const mayor = Politics.getMayor();
    if (!mayor) return '<p class="red">Мэр не избран.</p>';
    const types = Politics.MAYOR_TYPES || {};
    const typeData = types[mayor.type] || { desc: '', taxMod: 1, heatMod: 1, bribeAccept: 0.5 };
    const daysLeft = Math.max(0, (mayor.termEnd || 0) - State.time.day);

    return `
      <h2>Мэрия</h2>
      <p class="muted">Мрамор, дым, запах чужих сигар.</p>
      <hr>
      ${Components.card('Мэр', `
        <p><b>${mayor.name}</b> · <span class="gold">${mayor.typeName}</span></p>
        <p class="small muted" style="font-style:italic">${typeData.desc}</p>
        <p class="small">До выборов: <b>${daysLeft}</b> дней</p>
      `)}
      ${Components.card('Твоё влияние', `
        <p class="small gold">Влияние: <b>${(State.politics && State.politics.playerInfluence) || 0}</b></p>
        <p class="small muted">Растет от захвата зон и союзов. Нужно для выборов.</p>
      `)}
      ${Components.card('Налоги и порядки', `
        <p class="small">Налог: ×${typeData.taxMod} (${Math.round(typeData.taxMod * 100)}% от базового)</p>
        <p class="small">Розыск (Heat): ×${typeData.heatMod}</p>
        <p class="small">Взятки: ${Math.round(typeData.bribeAccept * 100)}% шанс</p>
      `)}
      <hr>
      ${(typeof Politics !== 'undefined') ? Components.card('Политический расклад', `
        <p class="small muted">Кто набирает силу перед выборами:</p>
        ${Politics.getFactionCoalitions().map(c => `
          <p class="small" style="margin: 4px 0;">
            ${c.factions.map(f => f.name).join(' <span class="gold">+</span> ')} 
            <span class="gold">(${c.influence} влияния)</span>
          </p>
        `).join('')}
        ${Politics.getFactionCoalitions().length === 0 ? '<p class="small muted">Пока все сами за себя.</p>' : ''}
      `) : ''}

      <h3>Действия</h3>
      
      ${Components.card('Подкуп мэра', `
        <p class="small muted">Снизить розыск (Heat). Может не сработать (зависит от мэра).</p>
        <p class="small">Цена: $${Utils.fmtMoney(1000 + ((State.player.heat || 0) * 30) + ((State.player.level || 1) * 100))}</p>
        ${Components.button('Подкупить', 'Actions.bribeMayor()', { primary: true })}
      `)}
      
      ${Components.card('Лоббирование', `
        <p class="small muted">Снизить налог на 50% на 10 дней. Но мэр заберет 20% дохода бизнесов.</p>
        ${(State.politics && State.politics.lobbyUntil && State.time.day < State.politics.lobbyUntil) 
          ? `<p class="small green">Активно до дня ${State.politics.lobbyUntil}</p>`
          : `<p class="small">Цена: $1000</p>${Components.button('Лоббировать', 'Actions.lobbyBusiness()')}`}
      `)}
      
      ${Components.card('Компромат', `
        <p class="small muted">Снизить влияние фракции на 20. Фракция узнает и объявит войну.</p>
        <div class="row">
          ${(State.factions || []).filter(f => !f.isPolice).map(f => 
            Components.button(f.name, `Actions.compromiseFaction('${f.id}')`, { danger: true })
          ).join('')}
        </div>
      `)}
      
      ${(State.politics && State.politics.playerInfluence >= 50) ? `
        <div class="card hot">
          <p class="small gold">У тебя достаточно влияния (${State.politics.playerInfluence}), чтобы выдвинуть своего кандидата!</p>
          ${Components.button('Выдвинуть своего мэра ($5000 + 50 Влияния)', 'Actions.promoteCandidate()', { primary: true })}
        </div>
      ` : `<p class="small muted">Для выдвижения своего мэра нужно 50 Влияния (у тебя: ${(State.politics && State.politics.playerInfluence) || 0}).</p>`}
      <hr>
      <hr>
      ${Components.button('← В город', 'Actions.go("city")')}
    `;
  },

  barGirls() {
    if (typeof WomenData === 'undefined') return '<p class="red">Данные женщин недоступны.</p>';
    if (!State.player) return '<p class="red">Нет игрока.</p>';
    const girls = WomenData.getAll();
    return `
      <h2>Женщины</h2>
      <p class="muted">В нуарном городе женщины опаснее пуль.</p>
      <hr>
      ${girls.map(g => {
        const aff = (typeof WomenSystem !== 'undefined' && WomenSystem.getAffection) ? WomenSystem.getAffection(g.id) : 0;
        return `
          <div class="card">
            <div class="row" style="justify-content:space-between">
              <div><b>${g.name}</b></div>
              <div class="small ${State.player.relationship && State.player.relationship[g.id] === 'ex' ? 'red' : 'gold'}">
                ${State.player.relationship && State.player.relationship[g.id] === 'ex' ? 'В ССОРЕ' : 'Симпатия: ' + aff + '/100'}
              </div>
            </div>
            <p class="small muted">${g.desc}</p>
            <div class="row tight">
              ${Components.button('Подарить ($' + g.giftCost + ')', `Actions.womenGift('${g.id}')`)}
              
              ${State.player.relationship && State.player.relationship[g.id] === 'lover' 
                ? Components.button('Провести ночь (4ч)', `Actions.womenSleep('${g.id}')`, { primary: true })
                : Components.button('Свидание', `Actions.womenDate('${g.id}')`, { primary: true })}
              
              ${g.id === 'lily' ? Components.button('Разобраться с мажором', `Actions.womenFight()`, { danger: true }) : ''}
            </div>
          </div>
        `;
      }).join('')}
      <hr>
      ${Components.button('← Назад в бар', 'Actions.go("bar")')}
    `;
  },



  carsShowrooms() {
    if (typeof CarsData === 'undefined' || !CarsData.showrooms) return '<p class="red">Автосалоны недоступны.</p>';
    const showrooms = CarsData.showrooms;
    return `
      <h2>Автосалоны</h2>
      <p class="muted">В городе десять салонов. Каждая тачка — кусок твоей репутации.</p>
      <hr>
      ${Object.entries(showrooms).map(([id, sh]) => `
        <div class="card">
          <div class="row" style="justify-content:space-between">
            <div><b>${sh.name}</b></div>
            <div class="small muted">${sh.cars.length} машин</div>
          </div>
          <p class="small muted">${sh.desc}</p>
          ${Components.button('Зайти в салон', `Actions.go("carsShowroom", { showroomId: '${id}' })`, { primary: true })}
        </div>
      `).join('')}
      <hr>
      ${Components.button('Мой гараж', 'Actions.go("carsGarage")')}
      <hr>
      ${Components.button('← В город', 'Actions.go("city")')}
    `;
  },

  carsShowroom(params) {
    if (!params || !params.showroomId) return '<p class="red">Салон не найден.</p>' + Components.button('← Назад', 'Actions.go("carsShowrooms")');
    if (typeof CarsData === 'undefined' || !CarsData.showrooms) return '<p class="red">Салон не найден.</p>' + Components.button('← Назад', 'Actions.go("carsShowrooms")');
    if (!State.player) return '<p class="red">Нет игрока.</p>';
    const showroom = CarsData.showrooms[params.showroomId];
    if (!showroom) return '<p class="red">Салон не найден.</p>' + Components.button('← Назад', 'Actions.go("carsShowrooms")');
    return `
      <h2>${showroom.name}</h2>
      <p class="muted">${showroom.desc}</p>
      <hr>
      ${showroom.cars.map(car => {
        const owned = CarsSystem.isOwned(car.id);
        return `
          <div class="card ${owned ? 'hot' : ''}">
            <div class="row" style="justify-content:space-between">
              <div><b>${car.name}</b> <span class="small muted">(${car.year})</span></div>
              <div class="small gold">$${Utils.fmtMoney(car.price)}</div>
            </div>
            <p class="small muted">${car.desc}</p>
            <p class="small">+1 к Репутации</p>
            <div class="row tight">
              ${owned 
                ? '<span class="tag owner">В гараже</span>'
                : Components.button(`Купить $${Utils.fmtMoney(car.price)}`, `Actions.buyCar('${car.id}')`, { primary: true, disabled: State.player.money < car.price })}
            </div>
          </div>
        `;
      }).join('')}
      <hr>
      ${Components.button('← К салонам', 'Actions.go("carsShowrooms")')}
    `;
  },

  carsGarage() {
    if (typeof CarsSystem === 'undefined') return '<p class="red">Гараж недоступен.</p>';
    if (!State.player) return '<p class="red">Нет игрока.</p>';
    const owned = CarsSystem.getOwned();
    return `
      <h2>Мой гараж</h2>
      <p class="muted">${owned.length === 0 ? 'Пока пусто. Купи что-нибудь.' : 'Твоя коллекция. ' + owned.length + ' машин.'}</p>
      <hr>
      ${owned.length === 0 ? '<p class="small muted">Гараж пуст.</p>' : owned.map(car => {
        const sellPrice = Math.round(car.price * 0.3);
        return `
          <div class="card">
            <div class="row" style="justify-content:space-between">
              <div><b>${car.name}</b> <span class="small muted">(${car.year})</span></div>
            </div>
            <p class="small muted">${car.desc}</p>
            ${Components.button(`Продать за $${Utils.fmtMoney(sellPrice)}`, `Actions.sellCar('${car.id}')`, { danger: true })}
          </div>
        `;
      }).join('')}
      <hr>
      ${Components.button('← К салонам', 'Actions.go("carsShowrooms")')}
    `;
  },

  zoneDetail(params) {
    if (!params || !params.zoneId) return '<p class="red">Зона не найдена.</p>' + Components.button('← Назад', 'Actions.go("zones")');
    if (!State.zones) return '<p class="red">Зона не найдена.</p>' + Components.button('← Назад', 'Actions.go("zones")');
    if (!State.player) return '<p class="red">Нет игрока.</p>';
    const zone = State.zones.find(z => z.id === params.zoneId);
    if (!zone) return '<p class="red">Зона не найдена.</p>' + Components.button('← Назад', 'Actions.go("zones")');

    const ownerName = zone.ownerId
      ? (zone.ownerId === 'player' ? 'Ты' : ((State.factions || []).find(f => f.id === zone.ownerId)?.name || '?'))
      : 'нейтрал';

    const check = (typeof ZonesSystem !== 'undefined') ? ZonesSystem.canCapture(zone.id) : { ok: false, reason: 'Система зон не загружена' };
    const isFaction = zone.ownerId && zone.ownerId !== 'player';
    const isMine = zone.ownerId === 'player';

    return `
      <h2>${zone.name}</h2>
      <p class="muted">${zone.typeName}</p>
      <hr>
      ${Components.card('Данные', `
        ${Components.statRow('Контроль', ownerName)}
        ${Components.statRow('Доход', '$' + zone.income + '/день', 'gold')}
        ${Components.statRow('Влияние', zone.influence)}
        ${Components.statRow('Сложность', zone.difficulty)}
        ${Components.statRow('Ресурс', zone.resource, 'gold')}
        ${Components.statRow('Охрана', (zone.guards || 0) + (zone.ownerId !== 'player' && zone.ownerId !== null && zone.guards <= 2 ? ' <span class="red">(Ослаблена войной)</span>' : ''))}
      `)}
      <hr>
      <h3>Осмотреться</h3>
      <p class="small muted">На улицах всегда что-то происходит.</p>
      ${(State.player.zoneVisitsToday || 0) < 2 
        ? Components.button('Оглядеться в зоне (1ч)', `Actions.zoneScene('${zone.id}')`, { primary: true })
        : '<p class="small red">Ты уже весь район обошёл. Хватит.</p>'}
      <hr>
      <h3>Действия</h3>
      <div class="row">
        ${isMine ? `
          ${Components.button('Укрепить $500', `Actions.garrisonZone('${zone.id}')`)}
          ${Components.button('Оставить', `Actions.abandonZone('${zone.id}')`, { danger: true })}
        ` : isFaction ? `
          ${Components.button(check.ok ? 'Атаковать' : (check.reason || 'Нельзя'),
            check.ok ? `Actions.attackFactionZone('${zone.id}')` : '', { danger: check.ok, disabled: !check.ok })}
        ` : `
          ${Components.button(check.ok ? 'Захватить' : (check.reason || 'Нельзя'),
            check.ok ? `Actions.captureZone('${zone.id}')` : '', { primary: check.ok, disabled: !check.ok })}
        `}
      </div>
      <hr>
      ${Components.button('← Назад', 'Actions.go("zones")')}
    `;
  },

  factions() {
    return `
      <h2>Фракции</h2>
      <p class="muted small">Те, кто держит город. Или пытается.</p>
      <hr>
      ${(State.factions || []).map(f => {
        const rel = (f.relations && f.relations.player) || 0;
        const relLabel = rel < -30 ? 'враждебно' : rel < 10 ? 'холодно' : rel > 40 ? 'тепло' : 'нейтрально';
        return `
          <div class="card">
            <div class="row" style="justify-content:space-between">
              <div><b>${f.name}</b>${f.allyWithPlayer ? ' <span class="green">[СОЮЗНИК]</span>' : ''}</div>
              <div class="small muted">${relLabel}</div>
            </div>
            <p class="small muted">Характер: ${(typeof Faction !== 'undefined') ? Faction.getEffectiveTrait(f) : f.trait}${f.mood && f.mood !== f.trait ? ' <span class="gold">(' + f.mood + ')</span>' : ''} · Сила ${f.power} · Зон ${f.zones}</p>
            <p class="small gold">Влияние: ${f.influence || 0}</p>
            <div class="row tight">
              ${Components.button('Поговорить', `Actions.factionDialogue('${f.id}')`, { primary: true })}
            </div>
          </div>
        `;
      }).join('')}
      <hr>
      ${Components.button('← В город', 'Actions.go("city")')}
    `;
  },

  prestige() {
    if (typeof Prestige === 'undefined') return '<p class="red">Система престижа недоступна.</p>';
    // #87: слияние с default — защита от undefined на старых данных
    const raw = Prestige.load();
    const data = Object.assign(Prestige.default(), raw);
    const bonus = Prestige.getStartingBonuses();
    const deaths = data.deaths || [];
    return `
      <h2>Кладбище</h2>
      <p class="muted">Каждое имя в этой книге — тот, кто пытался.</p>
      <p class="small muted">Каждая новая жизнь начинается с нуля.</p>
      <hr>
      ${Components.card('Рекорды', `
        <p class="small">Лучший результат: ${data.bestDay} дней</p>
        <p class="small">Всего убийств: ${data.totalKills}</p>
        <p class="small">Всего заработано: $${Utils.fmtMoney(data.totalMoneyEarned)}</p>
        <p class="small">Всего дней в городе: ${data.totalDays}</p>
      `)}
      <hr>
      <h3>Мёртвые (${deaths.length})</h3>
      ${deaths.length === 0 ? '<p class="muted">Пока никто. Ты первый.</p>' :
        deaths.slice().reverse().slice(0, 10).map(d => `
          <div class="card">
            <div class="row" style="justify-content:space-between">
              <div><b>${d.name}</b> <span class="small muted">(${d.side === 'mafia' ? 'мафия' : 'полиция'})</span></div>
              <div class="small">${d.city}</div>
            </div>
            <p class="small muted">День ${d.days} · ${d.kills} убийств · $${Utils.fmtMoney(d.money)}</p>
            <p class="small" style="font-style:italic">${d.epitaph}</p>
          </div>
        `).join('')}
      <hr>
      ${Components.button('← В меню', 'Actions.go("menu")')}
    `;
  },

  player() {
    if (!State.player) return '<p class="red">Нет игрока.</p>';
    const p = State.player;
    if (!p.survival) p.survival = { hunger: 100, thirst: 100, energy: 100, combatFatigue: 0 };
    if (!p.sanity) p.sanity = { sanity: 100, stress: 0, killsToday: 0, lastResetDay: 0, nightmares: 0 };
    if (!p.lifetime) p.lifetime = { kills: 0, moneyEarned: 0, missionsDone: 0, daysSurvived: 0, deaths: 0, overdoses: 0, breakdowns: 0 };
    if (!p.dependencies) p.dependencies = { nicotine: 0, alcohol: 0, stimulants: 0, opiates: 0, activeEffects: [], withdrawal: null };
    if (!p.dependencies.activeEffects) p.dependencies.activeEffects = [];
    if (!p.stats) p.stats = {};
    if (!p.inventory) p.inventory = {};
    if (!p.inventory.medicine) p.inventory.medicine = {};
    if (!p.inventory.cigs_inv) p.inventory.cigs_inv = {};
    if (!p.inventory.alc_inv) p.inventory.alc_inv = {};
    if (!p.inventory.drugs) p.inventory.drugs = {};
    const conds = p.conditions || {};
    const activeConds = [];
    for (const [part, c] of Object.entries(conds || {})) {
      for (const [injury, active] of Object.entries(c || {})) {
        // #82: защита от неизвестной травмы
        if (active && typeof WoundData !== 'undefined' && WoundData.conditions && WoundData.conditions[injury]) {
          activeConds.push({ part, injury, data: WoundData.conditions[injury] });
        }
      }
    }
    const deps = p.dependencies;
    const activeEffects = deps.activeEffects || [];
    const now = Time.totalHours();

    return `
      <div class="sprite-row">
        ${Components.sprite(State.player.portrait || 'assets/sprites/man.png1.jpg', 'large', 'player')}
        <div class="info">
          <h2 style="margin:0">${p.name}</h2>
          <p class="muted">${p.side === 'mafia' ? 'Мафия' : 'Полиция'} · ${p.gangName}</p>
        </div>
      </div>
      <hr>
      ${Components.card('Вкусы', `
        ${(!State.player.knownPrefs || !State.player.knownPrefs.cig || !State.player.preferences || !DrugDataBrands.cig[State.player.preferences.cig]) 
          ? '<p class="small muted">Сигареты: ты пока не знаешь, что тебе нравится. Попробуй разные.</p>'
          : `<p class="small">Любимые сигареты: <span class="gold">${DrugDataBrands.cig[State.player.preferences.cig].name}</span></p>
             <p class="small">Не любишь: <span class="red">${DrugDataBrands.cig[State.player.preferences.cigHate]?.name || '—'}</span></p>`}
        
        ${(!State.player.knownPrefs || !State.player.knownPrefs.alc || !State.player.preferences || !DrugDataBrands.alc[State.player.preferences.alc]) 
          ? '<p class="small muted">Алкоголь: ты пока не знаешь, что тебе нравится. Попробуй разные.</p>'
          : `<p class="small">Любимый алкоголь: <span class="gold">${DrugDataBrands.alc[State.player.preferences.alc].name}</span></p>
             <p class="small">Не любишь: <span class="red">${DrugDataBrands.alc[State.player.preferences.alcHate]?.name || '—'}</span></p>`}
      `)}
      ${Components.card('Оружие', `
        ${(!State.weapons || !State.weapons.owned || State.weapons.owned.length === 0) ? '<p class="small muted">Пусто.</p>' : State.weapons.owned.map(id => {
          const w = Weapons.find(id);
          if (!w) return '';
          let dur = State.weapons.durability[id] !== undefined ? State.weapons.durability[id] : 100;
          let color = dur > 60 ? 'green' : dur > 30 ? 'gold' : 'red';
          let text = Math.round(dur) + '%';
          
          const workshopLvl = (State.building && State.building.modules && State.building.modules.workshop) ? State.building.modules.workshop.level : 0;
          let canRepair = workshopLvl > 0 && dur < 100;
          let repairCost = Math.round(w.basePrice * 0.1);
          let repairBtn = canRepair ? Components.button(`Починить ($` + repairCost + `)`, `Actions.repairWeapon('${id}')`, { primary: true }) : '';
          
          return `<div class="row" style="justify-content:space-between; margin-bottom:4px; align-items:center;">
            <div class="small"><b>${w.name}</b> <span class="${color}">[${text}]</span></div>
            <div>${repairBtn}</div>
          </div>`;
        }).join('')}
        <p class="small muted" style="margin-top:6px; border-top:1px solid #333; padding-top:6px;">Ремонт требует Мастерскую в Штабе</p>
      `)}
      
      ${Components.card('Тело', Components.bodyBar(p.body))}
      
      ${Components.card('Инвентарь (Расходники)', `
        ${(() => {
          let html = '';
          // Сигареты
          for (const [id, count] of Object.entries(p.inventory.cigs_inv || {})) {
            if (count > 0) {
              html += `<div class="row" style="justify-content:space-between; margin-bottom:4px;">
                <div class="small">${DrugDataBrands.cig[id].name} (${count} шт)</div>
                <div>
                  ${Components.button('Выкурить', `Actions.useInvItem('cig', '${id}')`, { primary: true })}
                  ${Components.button('Выбросить', `Actions.dropItem('cig', '${id}')`, { danger: true })}
                </div>
              </div>`;
            }
          }
          // Алкоголь
          for (const [id, count] of Object.entries(p.inventory.alc_inv || {})) {
            if (count > 0) {
              html += `<div class="row" style="justify-content:space-between; margin-bottom:4px;">
                <div class="small">${DrugDataBrands.alc[id].name} (${count} шт)</div>
                <div>
                  ${Components.button('Выпить', `Actions.useInvItem('alc', '${id}')`, { primary: true })}
                  ${Components.button('Выбросить', `Actions.dropItem('alc', '${id}')`, { danger: true })}
                </div>
              </div>`;
            }
          }
          // Наркотики
          for (const [id, count] of Object.entries(p.inventory.drugs || {})) {
            if (count > 0 && DrugData[id]) {
              html += `<div class="row" style="justify-content:space-between; margin-bottom:4px;">
                <div class="small">${DrugData[id].name} (${count} шт)</div>
                <div>
                  ${Components.button('Использовать', `Actions.useInvItem('drug', '${id}')`, { primary: true })}
                  ${Components.button('Выбросить', `Actions.dropItem('drug', '${id}')`, { danger: true })}
                </div>
              </div>`;
            }
          }
          // Медикаменты
          for (const [id, count] of Object.entries(p.inventory.medicine || {})) {
            if (count > 0 && typeof WoundData !== 'undefined' && WoundData.medicine[id]) {
              html += `<div class="row" style="justify-content:space-between; margin-bottom:4px;">
                <div class="small">${WoundData.medicine[id].name} (${count} шт)</div>
                <div>
                  ${Components.button('Использовать', `Actions.useMedicine('${id}')`, { primary: true })}
                </div>
              </div>`;
            }
          }
          return html || '<p class="small muted">Пусто. Купи что-нибудь в баре или у дилера.</p>';
        })()}
      `)}
      ${p.diseases && p.diseases.length > 0 ? Components.card('Смертельные болезни', p.diseases.map(d => {
        const info = d === 'cancer' ? { name: 'Рак легких', icon: '☠', desc: '−2 HP торса/час', price: 5000 } : { name: 'Цирроз', icon: '☠', desc: '−1 HP торса/час', price: 5000 };
        return `
          <div class="row" style="justify-content:space-between; margin-bottom:0.5rem;">
            <div class="small red"><b>${info.icon} ${info.name}</b> (${info.desc})</div>
            ${Components.button('Операция ($' + info.price + ')', `Actions.healDisease('${d}')`, { danger: true })}
          </div>
        `;
      }).join('')) : ''}
      ${activeConds.length > 0 ? Components.card('Травмы', activeConds.map(c => `
        <div class="row" style="justify-content:space-between">
          <div class="small">${c.data.icon} <b>${c.data.name}</b> (${c.part})</div>
          <div>${c.data.treatWith && p.inventory.medicine[c.data.treatWith] > 0
            ? Components.button('Лечить', `Actions.treatCondition('${c.part}', '${c.injury}')`)
            : '<span class="small muted">' + (c.data.treatWith ? 'нужно: ' + (WoundData.medicine[c.data.treatWith]?.name || c.data.treatWith) : 'только время') + '</span>'
          }</div>
        </div>
      `).join('')) : ''}
      ${Components.card('Выживание', `
        <p class="small">Голод: ${p.survival.hunger}/100</p>
        <p class="small">Жажда: ${p.survival.thirst}/100</p>
        <p class="small">Сон: ${p.survival.energy}/100</p>
        <p class="small">Рассудок: ${p.sanity.sanity}/100</p>
        <p class="small">Стресс: ${p.sanity.stress}/100</p>
      `)}
      ${activeEffects.length > 0 ? Components.card('Активные эффекты', activeEffects.map(e => {
        const rem = Math.max(0, (e.until || now) - now);
        return `<p class="small">${e.type === 'crash' ? '! Крах: ' : ''}${(DrugData[e.source]?.name || e.source)} — ${rem}ч</p>`;
      }).join('')) : ''}
      ${deps.withdrawal ? Components.card('Ломка', `<p class="small red">${deps.withdrawal.type} — осталось ${Math.max(0, (deps.withdrawal.until || now) - now)}ч</p>`) : ''}
      ${Components.card('Зависимости', `
        <p class="small">Никотин: ${deps.nicotine}/100</p>
        <p class="small">Алкоголь: ${deps.alcohol}/100</p>
        <p class="small">Стимуляторы: ${deps.stimulants}/100</p>
        <p class="small">Опиаты: ${deps.opiates}/100</p>
      `)}
      ${Components.card('Статы', Object.entries(p.stats).map(([k, v]) =>
        `<p class="small">${k}: <span class="gold">${v}</span></p>`
      ).join(''))}
      ${Components.card('Перки', (p.perks && p.perks.length > 0
        ? p.perks.map(id => {
            const pk = (typeof PerkData !== 'undefined' && PerkData.find) ? PerkData.find(id) : null;
            return pk ? `<p class="small">[+] ${pk.name} — ${pk.desc}</p>` : '';
          }).join('')
        : '<p class="small muted">Пока нет. Расти в уровне — на 3-м, 6-м, 9-м…</p>')
        + (typeof Perks !== 'undefined' && Perks.hasNew() ? `<p class="small gold">Доступен новый перк!</p>` : '')
      )}
      ${Components.card('Статистика', `
        <p class="small">Убийств: ${p.lifetime.kills}</p>
        <p class="small">Заработано: $${Utils.fmtMoney(p.lifetime.moneyEarned)}</p>
        <p class="small">Дней: ${p.lifetime.daysSurvived}</p>
        <p class="small">Передозов: ${p.lifetime.overdoses || 0}</p>
        <p class="small">Срывов: ${p.lifetime.breakdowns || 0}</p>
      `)}
      ${Components.button('← В город', 'Actions.go("city")')}
    `;
  },
};

const Actions = {
  // ═══ ПОКЕР ═══
  pokerSit() { if (typeof Poker !== 'undefined') Poker.sitDown(); },
  pokerFold() { if (typeof Poker !== 'undefined') Poker.fold(); },
  pokerCall() { if (typeof Poker !== 'undefined') Poker.call(); },
  pokerRaise() {
    const el = document.getElementById('poker-raise');
    if (el && typeof Poker !== 'undefined') Poker.raise(el.value);
  },
  pokerLeave() { if (typeof Poker !== 'undefined') Poker.leave(); },
  
  // ═══ БОЛЕЗНИ ═══
  healDisease(diseaseId) {
    if (typeof Diseases !== 'undefined') {
      if (Diseases.heal(diseaseId)) Engine.render();
    }
  },
  bribeMayor() { if (typeof Politics !== 'undefined') Politics.bribeMayor(); },
  compromiseFaction(factionId) { if (typeof Politics !== 'undefined') Politics.compromiseFaction(factionId); },
  lobbyBusiness() { if (typeof Politics !== 'undefined') Politics.lobbyBusiness(); },
  promoteCandidate() {
    if (typeof Politics === 'undefined') return;
    const cost = 5000;
    const reqInf = 50;
    const inf = (State.politics && State.politics.playerInfluence) || 0;
    
    if (inf < reqInf) { Engine.log('Не хватает влияния (нужно ' + reqInf + ').', 'warn'); return; }
    if (!Economy.spend(cost, 'Предвыборная кампания')) return;

    State.politics.playerInfluence -= reqInf;
    
    State.mayor = {
      id: 'mayor_' + Utils.uid(),
      name: 'Твой человек',
      type: 'corrupt',
      typeName: 'Марионетка',
      electedDay: State.time.day,
      termEnd: State.time.day + 30,
      influence: 100,
      relationToPlayer: 100
    };
    
    Engine.log('Твой человек в мэрии! Налоги снижены, Heat упал.', 'good');
    Economy.changeHeat(-30, 'Своя власть');
    Save.save();
    Engine.go('city');
  },
  guardZoneSelect(mercId) { Engine.go('guardSelect', { mercId }); },
  recallMerc(mercId) {
    if (!State.mercenaries) return;
    const m = State.mercenaries.active.find(x => x.id === mercId);
    if (!m) return;
    if (m.status === 'onMission' && m.mission && m.mission.type === 'guard') {
      m.status = 'idle';
      m.mission = null;
      Engine.log(m.name + ' отозван с охраны.', 'info');
      Save.save();
      Engine.render();
    }
  },
  zoneScene(zoneId) { 
    if (typeof ZoneSystem !== 'undefined') Engine.go('zoneSceneView', { scene: ZoneSystem.getRandomScene(zoneId) }); 
  },
  resolveZoneScene(sceneId, choiceIndex) { 
    if (typeof ZoneSystem !== 'undefined') ZoneSystem.resolve(sceneId, choiceIndex); 
  },
  go(screen, params) { Engine.go(screen, params); },
  newGame() { Engine.go('create'); },

  pickSide(side) {
    State.flags.pendingSide = side;
    document.querySelectorAll('.card').forEach(c => c.style.borderColor = '#262626');
    document.getElementById('side-' + side).style.borderColor = '#ffffff';
    document.getElementById('gang-input-wrap').style.display = 'block';
    const label = document.getElementById('gang-label');
    const inp = document.getElementById('inp-gang');
    if (side === 'mafia') {
      label.textContent = 'Название твоей семьи:';
      inp.value = 'Семья ' + Utils.pick(Lore.factionRoots);
    } else {
      label.textContent = 'Название отдела:';
      inp.value = 'Отдел ' + Utils.rnd(1, 99);
    }
    const pp = document.getElementById('portrait-picker-wrap');
    if (pp) pp.style.display = 'block';
  },

  pickPortrait(src) {
    State.flags.pendingPortrait = src;
    document.querySelectorAll('[data-portrait]').forEach(img => {
      img.style.borderColor = '#4a4a4a';
      img.style.borderWidth = '2px';
    });
    const el = document.querySelector('[data-portrait="' + src + '"]');
    if (el) { el.style.borderColor = '#ffffff'; el.style.borderWidth = '3px'; }
  },

  startGame() {
    const name = (document.getElementById('inp-name').value || 'Безымянный').trim();
    const gang = (document.getElementById('inp-gang').value || '').trim();
    const side = State.flags.pendingSide;
    if (!side) { alert('Выбери сторону'); return; }
    if (!gang) { alert('Введи название'); return; }
    const chosenPortrait = State.flags ? State.flags.pendingPortrait : null;
    State.reset();
    Engine.clearLog();
    WorldGen.generate(name, side, gang, chosenPortrait);
    if (!State.mercenaries) State.mercenaries = { pool: [], active: [], poolResetDay: 1 };
    if (State.mercenaries.pool.length === 0) Hire.generatePool();
    Engine.go('city');
    Save.save();
  },

  continueGame() {
    if (Save.load()) {
      Engine.clearLog();
      Engine.log('Возвращение в ' + (State.city ? State.city.name : 'город') + '.', 'lore');
      if (State.combat && State.combat.active) Engine.go('combat');
      else if (State.events && State.events.pending && State.events.pending.length > 0) Engine.go('events');
      else Engine.go('city');
    } else alert('Сейв повреждён или не найден.');
  },

  wipeSave() {
    if (!confirm('Стереть сохранение?')) return;
    Save.wipe();
    Engine.go('menu');
  },

  equipArmor(id) {
    if (!State.player || !State.player.inventory) return;
    const a = Weapons.findArmor(id);
    if (!a) return;
    const owned = State.player.inventory.ownedArmor || [];
    if (!owned.includes(id)) {
      Engine.log('Броня не куплена.', 'warn');
      return;
    }
    State.player.armor = id;
    Engine.log('Надето: ' + a.name, 'info');
    Save.save();
    Engine.render();
  },

  buyArmor(id) {
    if (!State.player || !State.player.inventory) return;
    const a = Weapons.findArmor(id);
    if (!a) return;
    const owned = State.player.inventory.ownedArmor || [];
    if (owned.includes(id)) return;
    const discount = getTradeDiscount();
    const price = Math.round(a.basePrice * (1 - discount));
    if (!Economy.spend(price, 'Покупка брони: ' + a.name)) return;
    if (!State.player.inventory.ownedArmor) State.player.inventory.ownedArmor = ['armor_none'];
    State.player.inventory.ownedArmor.push(id);
    Engine.log('Куплено: ' + a.name + '. Надень через магазин.', 'good');
    Save.save();
    Engine.render();
  },

  buyAmmo(id, q) {
    if (!State.player || !State.player.inventory) return;
    if (!State.player.inventory.ammo) State.player.inventory.ammo = {};
    const a = Weapons.ammo.find(x => x.id === id);
    if (!a) return;
    // Сколько патронов даёт 1 упаковка
    const roundsPerPack = {
      ammo_pistol: 20,
      ammo_revolver: 12,
      ammo_shotgun: 10,
      ammo_rifle: 20,
    };
    const perPack = roundsPerPack[id] || 20;
    const discount = getTradeDiscount();
    const price = Math.round(a.price * (1 - discount)) * q;
    if (!Economy.spend(price, a.name + ' ×' + q)) return;
    State.player.inventory.ammo[id] = (State.player.inventory.ammo[id] || 0) + q * perPack;
    Engine.log('Куплено: ' + a.name + ' (+' + (q * perPack) + ' патронов)', 'good');
    Save.save();
    Engine.render();
  },

  saveAndMenu() { Save.save(); Engine.log('Сохранено.', 'good'); Engine.go('menu'); },
  sleep() { Time.sleep(); },

  // Выживание
  eat() { if (typeof Survival !== 'undefined') Survival.eat(); },
  drink() { if (typeof Survival !== 'undefined') Survival.drink(); },
  buyFood(q) { if (typeof Survival !== 'undefined') Survival.buyFood(q); },
  buyWater(q) { if (typeof Survival !== 'undefined') Survival.buyWater(q); },

  buyAndUseAlcohol() {
    // #83: проверяем время ДО денег и эффекта
    if (!Time.canSpend(0.75)) { Engine.log('Слишком поздно. Иди спать.', 'warn'); return; }
    if (!Economy.spend(150, 'Виски в баре')) return;
    State.player.inventory.alcohol = (State.player.inventory.alcohol || 0) + 1;
    Drugs.use('alcohol');
  },

  restInBar() {
    if (!State.player) return;
    if (!Time.spend(2, 'Ты сидишь в баре, слушаешь дождь.')) return;
    if (!State.player || !State.city) return;
    if (!State.player.survival) State.player.survival = { hunger: 100, thirst: 100, energy: 100, combatFatigue: 0 };
    if (typeof Sanity !== 'undefined') Sanity.onRest(3);
    State.player.survival.energy = Math.min(100, (State.player.survival.energy || 0) + 10);
    Save.save();
    Engine.go('bar');
  },

  // Вещества
  buyDrug(id, q) { if (typeof Drugs !== 'undefined') Drugs.buy(id, q); },
  useDrug(id) { if (typeof Drugs !== 'undefined') Drugs.use(id); },

  // Медицина
  buyMedicine(id, q) { if (typeof Wounds !== 'undefined') Wounds.buyMedicine(id, q); },
  useMedicine(id) { if (typeof Wounds !== 'undefined') Wounds.useMedicine(id); },
  treatCondition(part, injury) { if (typeof Wounds !== 'undefined') Wounds.treat(part, injury); },

  // Здания
  upgradeModule(id) { if (typeof Building !== 'undefined') Building.upgrade(id); },
  buyBusiness(type, zoneId) { if (typeof Building !== 'undefined') Building.buyBusiness(type, zoneId); },

  // События
  resolveEvent(id, i) { if (typeof EventsSystem !== 'undefined') EventsSystem.resolve(id, i); },

  // Квесты
  acceptQuest(id) { if (typeof Quests !== 'undefined') Quests.accept(id); },
  executeQuest(id) { if (typeof Quests !== 'undefined') Quests.execute(id); },

  // Оружие
  buyWeapon(id) {
    if (!State.player || !State.weapons || !State.weapons.owned) return;
    if (!State.player.inventory) State.player.inventory = {};
    if (!State.player.inventory.ammo) State.player.inventory.ammo = {};
    const w = Weapons.find(id);
    if (!w) return;
    const price = (State.economy && State.economy.prices && State.economy.prices[id]) || w.basePrice;
    if (State.weapons.owned.includes(id)) return;
    if (!Economy.spend(price, 'Покупка: ' + w.name)) return;
    State.weapons.owned.push(id);
    State.player.inventory.ammo[id] = w.magazine;
    Engine.log('Куплено: ' + w.name, 'good');
    Save.save();
    Engine.render();
  },

  equipWeapon(id) {
    if (!State.weapons.owned.includes(id)) return;
    State.player.currentWeaponId = id;
    Engine.log('В руках: ' + Weapons.find(id).name, 'info');
    Save.save();
    Engine.render();
  },

  // Наёмники
  hireMerc(id) { if (typeof Hire !== 'undefined') Hire.recruit(id); },
  dismissMerc(id) {
    // #84: если на задании — предупреждаем и не увольняем
    const m = State.mercenaries.active.find(x => x.id === id);
    if (!m) return;
    if (m.status !== 'idle') {
      Engine.log('Он на задании. Не уволишь, пока не вернётся.', 'warn');
      return;
    }
    if (typeof Hire !== 'undefined') Hire.dismiss(id);
  },
  assignMission(mercId, type) { if (typeof Hire !== 'undefined') Hire.assignMission(mercId, type); },

  // Бой
  combatAction(action, target) {
    const r = Combat.playerAction(action, target);
    if (r && r.ok === false) Engine.render();
  },

  combatFinish() {
    const c = State.combat;
    if (!c) { Engine.go('city'); return; }
    if (c.outcome === 'lose') { if (typeof DeathSystem !== 'undefined') DeathSystem.fullRestart(); return; }
    const ctx = c.context || {};
    State.combat = null;
    Save.save();
    Engine.go(ctx.returnScreen || 'city');
  },

  viewZone(zoneId) { Engine.go('zoneDetail', { zoneId }); },
  // ═══ ЗАХВАТ ЗОН ═══
  captureZone(zoneId) { if (typeof ZonesSystem !== 'undefined') ZonesSystem.captureNeutral(zoneId); },
  attackFactionZone(zoneId) { if (typeof ZonesSystem !== 'undefined') ZonesSystem.attackFactionZone(zoneId); },
  garrisonZone(zoneId) { if (typeof ZonesSystem !== 'undefined') ZonesSystem.garrison(zoneId); },
  abandonZone(zoneId) { if (typeof ZonesSystem !== 'undefined') ZonesSystem.abandon(zoneId); },
  // ═══ ПЕРКИ ═══
  pickPerk(perkId) { if (typeof Perks !== 'undefined') Perks.pick(perkId); },

  // ═══ ДИАЛОГИ ═══
  factionDialogue(factionId) {
    Engine.go('factionDialogue', { factionId });
  },

  dialogueAction(factionId, action) {
    if (typeof Dialogues === 'undefined') return;
    let result = null;
    if (action === 'ally')         result = Dialogues.proposeAlly(factionId);
    else if (action === 'trade')   result = Dialogues.trade(factionId);
    else if (action === 'threat')  result = Dialogues.threaten(factionId);
    else if (action === 'job')     result = Dialogues.askJob(factionId);
    else if (action === 'mystery') result = Dialogues.askMystery(factionId);
    if (!result) return;
    Engine.go('factionDialogue', { factionId, result });
  },
  // ═══ ФИЛЬТР КВЕСТОВ ═══
  setQuestFilter(filter) {
    Engine.go('quests', { filter: filter, page: 0 });
  },

  setQuestPage(page) {
    const f = (Engine.params && Engine.params.filter) || 'all';
    Engine.go('quests', { filter: f, page: page });
  },
  declineQuest(questId) {
    if (!State.quests || !State.quests.available) return;
    State.quests.available = State.quests.available.filter(q => q.id !== questId);
    Engine.log('Квест отклонён.', 'info');
    Save.save();
    Engine.render();
  },
  // ═══ БАРНЫЕ СЦЕНЫ ═══
  barScene() {
    if (typeof BarSystem !== 'undefined') {
      Engine.go('barSceneView', { scene: BarSystem.getRandomScene() });
    }
  },
  resolveBarScene(sceneId, choiceIndex) {
    if (typeof BarSystem !== 'undefined') {
      BarSystem.resolve(sceneId, choiceIndex);
    }
  },
  repairWeapon(id) {
    if (!State.player || !State.weapons) return;
    const w = Weapons.find(id);
    if (!w) return;
    const workshopLvl = (State.building && State.building.modules && State.building.modules.workshop) ? State.building.modules.workshop.level : 0;
    if (workshopLvl === 0) { Engine.log('Нужна Мастерская.', 'warn'); return; }
    // #177: время проверяем ДО денег
    if (!Time.canSpend(6)) { Engine.log('Слишком поздно. Возьми утром.', 'warn'); return; }
    const cost = Math.round(w.basePrice * 0.1);
    if (!Economy.spend(cost, 'Ремонт: ' + w.name)) return;
    
    Time.spend(6, 'Ты чистишь и смазываешь оружие.');
    State.weapons.durability[id] = 100;
    Engine.log(w.name + ' снова в идеальном состоянии.', 'good');
    Save.save();
    Engine.render();
  },

  copAction(eventId, actionId) {
    if (typeof CopSystem !== 'undefined') CopSystem.resolve(eventId, actionId);
  },
  womenAction(actionId) {
    if (typeof WomenSystem !== 'undefined') WomenSystem.execute(actionId);
  },
  womenGift(id) { if (typeof WomenSystem !== 'undefined') WomenSystem.giveGift(id); },
  womenDate(id) { if (typeof WomenSystem !== 'undefined') WomenSystem.date(id); },
  womenFight() { if (typeof WomenSystem !== 'undefined') WomenSystem.dangerClient(); },
  womenSleep(id) { if (typeof WomenSystem !== 'undefined') WomenSystem.sleepWith(id); },
  buyBrand(type, id) {
    if (!State.player || !State.player.inventory) return;
    if (typeof DrugDataBrands === 'undefined') return;
    if (!State.player.inventory.cigs_inv) State.player.inventory.cigs_inv = {};
    if (!State.player.inventory.alc_inv) State.player.inventory.alc_inv = {};
    const isCig = type === 'cig';
    const brand = isCig ? DrugDataBrands.cig[id] : DrugDataBrands.alc[id];
    if (!brand) return;
    if (!Time.canSpend(0.25)) { Engine.log('Слишком поздно.', 'warn'); return; }
    if (!Economy.spend(brand.price, 'Покупка ' + brand.name)) return;
    
    if (isCig) State.player.inventory.cigs_inv[id] = (State.player.inventory.cigs_inv[id] || 0) + 1;
    else State.player.inventory.alc_inv[id] = (State.player.inventory.alc_inv[id] || 0) + 1;
    
    Engine.log('Ты купил ' + brand.name + '.', 'good');
    Time.spend(0.25);
    Save.save();
    Engine.render();
  },

  buyAndUseBrand(type, id) {
    if (!State.player || !State.player.inventory) return;
    if (typeof DrugDataBrands === 'undefined') return;
    if (!State.player.inventory.cigs_inv) State.player.inventory.cigs_inv = {};
    if (!State.player.inventory.alc_inv) State.player.inventory.alc_inv = {};
    const isCig = type === 'cig';
    const brand = isCig ? DrugDataBrands.cig[id] : DrugDataBrands.alc[id];
    if (!brand) return;
    if (!Time.canSpend(0.5)) { Engine.log('Слишком поздно.', 'warn'); return; }
    if (!Economy.spend(brand.price, 'Покупка ' + brand.name)) return;
    
    if (isCig) State.player.inventory.cigs_inv[id] = (State.player.inventory.cigs_inv[id] || 0) + 1;
    else State.player.inventory.alc_inv[id] = (State.player.inventory.alc_inv[id] || 0) + 1;
    
    if (typeof Drugs !== 'undefined') Drugs.useBrand(type, id);
  },
  useInvItem(type, id) {
    if (type === 'cig' || type === 'alc') {
      if (typeof Drugs !== 'undefined') Drugs.useBrand(type, id);
    } else if (type === 'drug') {
      if (typeof Drugs !== 'undefined') Drugs.use(id);
    }
  },

  dropItem(type, id) {
    if (!State.player || !State.player.inventory) return;
    const inv = type === 'cig' ? State.player.inventory.cigs_inv : 
                type === 'alc' ? State.player.inventory.alc_inv : 
                State.player.inventory.drugs;
    if (inv && inv[id] > 0) {
      inv[id]--;
      Engine.log('Ты выбросил это в грязь.', 'warn');
      Save.save();
      Engine.render();
    }
  },

  sellWeapon(id) {
    if (!State.player || !State.weapons || !State.weapons.owned) return;
    const w = Weapons.find(id);
    if (!w) return;
    if (State.player.currentWeaponId === id) {
      Engine.log('Нельзя продать оружие, которое в руках.', 'warn');
      return;
    }
    const price = Math.round(w.basePrice * 0.5);
    State.weapons.owned = State.weapons.owned.filter(x => x !== id);
    Economy.earn(price, 'Продажа: ' + w.name);
    Save.save();
    Engine.render();
  },
  breakAlly(factionId) {
    if (typeof Dialogues !== 'undefined') Dialogues.breakAlly(factionId);
    Engine.go('factionDialogue', { factionId });
  },
  buyCar(carId) { if (typeof CarsSystem !== 'undefined') CarsSystem.buy(carId); },
  sellCar(carId) { if (typeof CarsSystem !== 'undefined') CarsSystem.sell(carId); },
};
