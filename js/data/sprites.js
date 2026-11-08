const Sprites = {
  men: [
    'assets/sprites/man.png1.jpg',
    'assets/sprites/man.png2.jpg',
    'assets/sprites/man.png3.jpg',
    'assets/sprites/man.png4.jpg',
    'assets/sprites/man.png5.jpg',
    'assets/sprites/man.png6.jpg',
    'assets/sprites/man.png7.jpg',
  ],
  women: [
    'assets/sprites/women.png1.jpg',
    'assets/sprites/women.png2.jpg',
  ],

  randomMan() { return Utils.pick(this.men); },
  randomWoman() { return Utils.pick(this.women); },
  randomAny() { return Utils.chance(0.8) ? this.randomMan() : this.randomWoman(); },

  // Детерминированный выбор по имени — один и тот же NPC всегда с одним лицом
  byName(name) {
    if (!name) return this.randomMan();
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
    const female = /а$|я$|ия$|Кармен|Рози|Долорес|Мария|Лучия|Джанна|Сандра|Рита|Бонни|Клэр|woman/i.test(name);
    const pool = female ? this.women : this.men;
    return pool[Math.abs(hash) % pool.length];
  },
};
