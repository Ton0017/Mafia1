const Diseases = {
  tick() {
    if (!State.player) return;
    if (!State.player.dependencies) State.player.dependencies = { nicotine: 0, alcohol: 0, stimulants: 0, opiates: 0, activeEffects: [], withdrawal: null };
    const deps = State.player.dependencies;
    const p = State.player;

    // Инициализация массива болезней
    if (!p.diseases) p.diseases = [];

    // 1. Проверка на получение болезней (раз в день)
    if (State.time.hour === 8) { // Утром
      if ((deps.nicotine || 0) > 70 && !p.diseases.includes('cancer') && Utils.chance(0.05)) {
        p.diseases.push('cancer');
        Engine.log('— ДИАГНОЗ —', 'bad');
        Engine.log('Врач качает головой: «У тебя рак легких. Это конец, если не остановиться».', 'bad');
      }
      if ((deps.alcohol || 0) > 70 && !p.diseases.includes('cirrhosis') && Utils.chance(0.05)) {
        p.diseases.push('cirrhosis');
        Engine.log('— ДИАГНОЗ —', 'bad');
        Engine.log('Врач качает головой: «Твоя печень превратилась в камень. Цирроз».', 'bad');
      }
    }

    // 2. Эффекты болезней (каждый час)
    if (p.diseases.includes('cancer')) {
      p.body.torso.hp = Math.max(0, p.body.torso.hp - 2);
      if (Utils.chance(0.05)) Engine.log('Ты кашляешь кровью. Рак пожирает тебя изнутри.', 'bad');
    }
    if (p.diseases.includes('cirrhosis')) {
      p.body.torso.hp = Math.max(0, p.body.torso.hp - 1);
      if (Utils.chance(0.05)) Engine.log('Твои глаза желтеют. Печень отказывает.', 'bad');
    }

    // 3. Смерть от болезней
    if (p.body && p.body.torso && p.body.torso.hp <= 0) {
      Engine.log('Болезнь доконала тебя. Это была не пуля, а твои привычки.', 'bad');
      if (typeof DeathSystem !== 'undefined') DeathSystem.fullRestart('Болезнь. Не пуля — твои привычки.');
      return;
    }
  },

  heal(diseaseId) {
    if (!State.player || !State.player.dependencies) return false;
    const p = State.player;
    const deps = p.dependencies;
    const price = 5000;

    if (!p.diseases || !p.diseases.includes(diseaseId)) {
      Engine.log('Этой болезни нет.', 'warn');
      return false;
    }

    // Проверка на чистоту
    if (diseaseId === 'cancer' && deps.nicotine > 0) {
      Engine.log('Врач отказывает: «Сначала брось курить. Иначе операция бесполезна».', 'bad');
      return false;
    }
    if (diseaseId === 'cirrhosis' && deps.alcohol > 0) {
      Engine.log('Врач отказывает: «Сначала брось пить. Иначе операция бесполезна».', 'bad');
      return false;
    }

    if (!Economy.spend(price, 'Операция: ' + diseaseId)) return false;

    p.diseases = p.diseases.filter(d => d !== diseaseId);
    Engine.log('Операция прошла успешно. Болезнь отступила. Но шрамы остались.', 'good');
    Time.spend(24, 'Ты восстанавливаешься после операции.'); // Операция занимает сутки
    if (!State.player || !State.city) return true;
    Save.save();
    return true;
  }
};
