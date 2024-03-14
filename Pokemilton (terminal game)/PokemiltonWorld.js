const PokemiltonArena = require('./PokemiltonArena');
const Pokemilton = require('./Pokemilton');
const PokemiltonMaster = require('./PokemiltonMaster');

class PokemiltonWorld {
  constructor() {
    this.day = 0;
  }

  oneDayPasses() {
    this.day += 1;
  }

  randomizeEvent(oneDayLater, wildBattle, pokeMaster) {
    const event = Math.trunc(Math.random() * 3);
    if (event === 0) {
      setTimeout(oneDayLater, 5000);
    } else if (event === 1) {
      console.log(`\nYou really are unlucky :/`);
      setTimeout(wildBattle, 5000);
    } else {
      const randomItem = Math.trunc(Math.random() * 3);
      if (randomItem === 0) {
        console.log(`\nYou have found a pokeball!`);
        pokeMaster.POKEBALLS++;
      } else if (randomItem === 1) {
        console.log(`\nYou have found a heal item!`);
        pokeMaster.healingItems++;
      } else {
        console.log(`\nYou have found a revive item!`);
        pokeMaster.reviveItems++;
      }
      setTimeout(oneDayLater, 5000);
    }
  }

  addLog(newLog) {
    console.log(`Day ${this.day}: ${newLog}`);
  }
}

module.exports = PokemiltonWorld;
