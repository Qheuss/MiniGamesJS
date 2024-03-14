const Pokemilton = require('./Pokemilton');

class PokemiltonMaster {
  constructor(name) {
    this.name = name;
    this.pokemiltonCollection = [];
    this.healingItems = 5; // Initial number of healing items
    this.reviveItems = 3; // Initial number of revive items
    this.POKEBALLS = 10; // Initial number of JOHNEBALLS
  }

  renamePokemilton(newName, pokemilton) {
    pokemilton.name = newName;
  }

  healPokemilton(pokemilton) {
    if (this.healingItems > 0 && pokemilton.healthPool > 0) {
      pokemilton.healthPool = pokemilton.maxHealth;
      this.healingItems--;
      console.log(`${pokemilton.name} has been healed`);
    } else {
      console.log("You don't have any healing item anymore :(");
    }
  }

  revivePokemilton(pokemilton) {
    pokemilton.healthPool = Math.trunc(pokemilton.maxHealth * 0.5);
  }

  releasePokemilton(pokemilton) {
    this.pokemiltonCollection.splice(pokemilton, 1);
  }

  showPokeCollection() {
    for (let i = 0; i < this.pokemiltonCollection.length; i++) {
      console.log(
        `\n--- ${i + 1} ---\nname: ${
          this.pokemiltonCollection[i].name
        }\nLevel: ${this.pokemiltonCollection[i].level}\nExperience: ${
          this.pokemiltonCollection[i].experienceMeter
        }\nAttack: ${this.pokemiltonCollection[i].attackRange}\nDefense: ${
          this.pokemiltonCollection[i].defenseRange
        }\nHealth: ${this.pokemiltonCollection[i].healthPool}`
      );
    }
  }
}

module.exports = PokemiltonMaster;
