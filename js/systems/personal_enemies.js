// ═══ СИСТЕМА ЛИЧНЫХ ВРАГОВ ═══
const PersonalEnemies = {
  MAX_ENEMIES: 5,

  // Хук: убийство (combat.js, civilians.js, sanity.js)
  onKill(victimName, victimLevel) {
    if (!State.player) return;
    if (!State.player.personalEnemies) State.player.personalEnemies = [];
    if (State.player.personalEnemies.length >= this.MAX_ENEMIES) return;
    if (!Utils.chance(0.30)) return; // 30% шанс что был мститель

    const tpl = Utils.pick(PersonalEnemiesData.avengerTemplates);
    State.player.personalEnemies.push({
      id: 'pe_' + Utils.uid(),
      type: 'avenger',
      name: tpl.name,
      desc: tpl.desc,
      dialog: tpl.dialog,
      power: Math.max(1, (victimLevel || 1) + Utils.rnd(0, 2)),
      createdDay: State.time.day,
      deadlineDay: State.time.day + Utils.rnd(5, 7),
      status: 'waiting',
      reason: 'Кровная месть за ' + (victimName || 'неизвестного')
    });
    Engine.log('Где-то в городе появился человек, который запомнил твоё лицо.', 'lore');
    Save.save();
  },

  // Хук: ограбление
  onRob(victimName, amount) {
    if (!State.player) return;
    if (!State.player.personalEnemies) State.player.personalEnemies = [];
    if (State.player.personalEnemies.length >= this.MAX_ENEMIES) return;
    if (!Utils.chance(0.20)) return; // 20% шанс

    const tpl = Utils.pick(PersonalEnemiesData.robbedTemplates);
    State.player.personalEnemies.push({
      id: 'pe_' + Utils.uid(),
      type: 'robbed',
      name: tpl.name,
      desc: tpl.desc,
      dialog: tpl.dialog,
      power: Math.max(1, (State.player.level || 1) + Utils.rnd(-1, 1)),
      createdDay: State.time.day,
      deadlineDay: State.time.day + Utils.rnd(3, 5),
      status: 'waiting',
      reason: 'Ограблен на $' + (amount || 0)
    });
    Engine.log('Ограбленный запомнил твоё лицо. Он вернётся.', 'lore');
    Save.save();
  },

  // Тик: проверка deadline'ов (onNewDay)
  tick() {
    if (!State.player || !State.player.personalEnemies) return;
    const today = State.time.day;

    for (const enemy of State.player.personalEnemies) {
      if (enemy.status === 'waiting' && today >= enemy.deadlineDay) {
        enemy.status = 'appeared';
        Engine.log('⚠ ' + enemy.name + ' нашёл тебя. Он ждёт.', 'bad');

        // 30% шанс, что атакует сразу
        if (Utils.chance(0.30)) {
          this.triggerAttack(enemy);
        }
      }
    }
    Save.save();
  },

  getActive() {
    if (!State.player || !State.player.personalEnemies) return [];
    return State.player.personalEnemies.filter(e => e.status === 'appeared');
  },

  getWaiting() {
    if (!State.player || !State.player.personalEnemies) return [];
    return State.player.personalEnemies.filter(e => e.status === 'waiting');
  },

  triggerAttack(enemy) {
    if (!enemy) return;
    const lvl = Math.max(1, enemy.power || 1);
    const e = Combat.spawnEnemy(lvl, { affiliation: 'independent' });
    e.name = enemy.name;
    e.role = 'Личный враг';
    e.roleDesc = enemy.reason;
    e.loot.money = Utils.rnd(200, 500);
    Combat.start(e, { type: 'personal_enemy', enemyId: enemy.id, returnScreen: 'city' });
  },

  // Действия
  pay(enemyId) {
    if (!State.player) return;
    const enemy = (State.player.personalEnemies || []).find(e => e.id === enemyId);
    if (!enemy) return;
    const cost = 500 + (enemy.power || 1) * 100;
    if (!Economy.spend(cost, 'Отступные: ' + enemy.name)) return;
    enemy.status = 'resolved';
    Engine.log('Ты платишь $' + cost + '. ' + enemy.name + ' уходит. На время.', 'warn');
    Save.save();
    Engine.go('city');
  },

  flee(enemyId) {
    if (!State.player) return;
    const enemy = (State.player.personalEnemies || []).find(e => e.id === enemyId);
    if (!enemy) return;
    if (Utils.chance(0.6)) {
      enemy.status = 'resolved';
      Economy.changeHeat(10, 'Сбежал от личного врага');
      Engine.log('Ты растворяешься в переулках. ' + enemy.name + ' теряет след.', 'good');
    } else {
      Economy.changeHeat(15, 'Погоня');
      if (State.player.body && State.player.body.torso) {
        State.player.body.torso.hp = Math.max(0, State.player.body.torso.hp - 15);
      }
      Engine.log('Он догоняет. Ты получаешь удар, но вырываешься.', 'bad');
    }
    Save.save();
    Engine.go('city');
  },

  fight(enemyId) {
    if (!State.player) return;
    const enemy = (State.player.personalEnemies || []).find(e => e.id === enemyId);
    if (!enemy) return;
    this.triggerAttack(enemy);
  },

  talk(enemyId) {
    if (!State.player) return;
    const enemy = (State.player.personalEnemies || []).find(e => e.id === enemyId);
    if (!enemy) return;
    const rep = State.player.reputation || 0;
    if (rep < 50) {
      Engine.log('Ты пытаешься говорить. ' + enemy.name + ' не слушает. «Слишком поздно».', 'bad');
      this.triggerAttack(enemy);
      return;
    }
    if (Utils.chance(0.5)) {
      enemy.status = 'resolved';
      Engine.log('Ты говоришь. Долго. ' + enemy.name + ' слушает. Потом кивает и уходит.', 'good');
      Economy.changeRep(3, 'Убедил врага');
    } else {
      Engine.log('Он слушает. Но не верит. «Слова — это дым».', 'warn');
      this.triggerAttack(enemy);
    }
    Save.save();
    Engine.go('city');
  },

  resolveByCombat(enemyId, outcome) {
    if (!State.player) return;
    const enemy = (State.player.personalEnemies || []).find(e => e.id === enemyId);
    if (!enemy) return;
    if (outcome === 'win') {
      enemy.status = 'resolved';
      Engine.log(enemy.name + ' больше не вернётся. Ты решил это.', 'good');
      Save.save();
    }
  }
};
