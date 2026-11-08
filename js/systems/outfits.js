// ═══ СИСТЕМА ОДЕЖДЫ ═══
const OutfitsSystem = {
  buy(outfitId) {
    if (!State.player) return false;
    const item = OutfitsData.findById(outfitId);
    if (!item) return false;
    if (!State.player.ownedOutfits) State.player.ownedOutfits = ['outfit_drifter'];
    if (State.player.ownedOutfits.includes(outfitId)) {
      Engine.log('У тебя уже есть этот наряд.', 'warn');
      return false;
    }
    if (!Economy.spend(item.price, 'Покупка: ' + item.name)) return false;
    State.player.ownedOutfits.push(outfitId);
    Economy.changeRep(item.rep, 'Новый образ');
    Engine.log('Ты покупаешь «' + item.name + '». ' + item.desc, 'good');
    Save.save();
    Engine.render();
    return true;
  },

  wear(outfitId) {
    if (!State.player) return false;
    if (!State.player.ownedOutfits || !State.player.ownedOutfits.includes(outfitId)) {
      Engine.log('У тебя нет этого наряда.', 'warn');
      return false;
    }
    if (State.player.currentOutfit === outfitId) {
      Engine.log('Ты уже в нём.', 'info');
      return false;
    }
    const item = OutfitsData.findById(outfitId);
    State.player.currentOutfit = outfitId;
    Engine.log('Ты надеваешь «' + item.name + '».', 'good');
    Save.save();
    Engine.render();
    return true;
  },

  getCurrent() {
    if (!State.player || !State.player.currentOutfit) return null;
    return OutfitsData.findById(State.player.currentOutfit);
  },

  buyAccessory(id) {
    if (!State.player) return false;
    const item = OutfitsData.findById(id);
    if (!item || item.type !== 'accessory') return false;
    if (!State.player.accessories) State.player.accessories = {};
    if (!State.player.ownedAccessories) State.player.ownedAccessories = [];
    if (State.player.ownedAccessories.includes(id)) {
      Engine.log('У тебя уже есть эта вещь.', 'warn');
      return false;
    }
    if (!Economy.spend(item.price, 'Покупка: ' + item.name)) return false;
    State.player.ownedAccessories.push(id);
    State.player.accessories[item.slot] = id;
    if (item.rep) Economy.changeRep(item.rep, 'Новая вещь');
    Engine.log('Ты покупаешь «' + item.name + '». ' + item.desc, 'good');
    Save.save();
    Engine.render();
    return true;
  },

  equipAccessory(id) {
    if (!State.player) return false;
    const item = OutfitsData.findById(id);
    if (!item || item.type !== 'accessory') return false;
    if (!State.player.ownedAccessories || !State.player.ownedAccessories.includes(id)) {
      Engine.log('У тебя нет этой вещи.', 'warn');
      return false;
    }
    if (!State.player.accessories) State.player.accessories = {};
    if (State.player.accessories[item.slot] === id) {
      delete State.player.accessories[item.slot];
      Engine.log('Ты снимаешь «' + item.name + '».', 'info');
    } else {
      State.player.accessories[item.slot] = id;
      Engine.log('Ты надеваешь «' + item.name + '».', 'good');
    }
    Save.save();
    Engine.render();
    return true;
  }
};
