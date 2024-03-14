const readline = require('readline');
const Pokemilton = require('./Pokemilton');
const PokemiltonMaster = require('./PokemiltonMaster');
const oneDayLater = require('./Game');
const savePathFile = './Save.json';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

let round = 0;

function deleteGame() {
  fs.unlink(savePathFile, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Deleting...');
  });
}

class PokemiltonArena {
  constructor(selectedPokemilton, wildPokemilton, pokeMaster, world) {
    this.selectedPokemilton = selectedPokemilton;
    this.wildPokemilton = wildPokemilton;
    this.pokeMaster = pokeMaster;
    this.world = world;
  }

  choosePokemilton(oneDayLater, wildBattle) {
    console.log(`\nYou have chosen '${this.selectedPokemilton.name}' !`);
    this.startRound(oneDayLater, wildBattle);
  }

  startRound(oneDayLater, wildBattle) {
    console.log(
      `\n${this.selectedPokemilton.name} vs ${this.wildPokemilton.name}\n  ----------  \nLvl: ${this.selectedPokemilton.level} | ${this.wildPokemilton.level}\nAtk: ${this.selectedPokemilton.attackRange} | ${this.wildPokemilton.attackRange}\nDef: ${this.selectedPokemilton.defenseRange} | ${this.wildPokemilton.defenseRange}\nHP: ${this.selectedPokemilton.healthPool} | ${this.wildPokemilton.healthPool}`
    );
    rl.question(
      `\nAttack (anything)\nTry to catch (catch)\nRun away (coward): `,
      (choice) => {
        if (choice === 'catch') {
          this.tryToCatch(oneDayLater, wildBattle);
        } else if (choice === 'coward') {
          this.world.randomizeEvent(oneDayLater, wildBattle, this.pokeMaster);
        } else {
          this.attack(oneDayLater, wildBattle);
        }
      }
    );
  }

  attack(oneDayLater, wildBattle) {
    const damage = this.calculateDamage(
      this.selectedPokemilton.attackRange * this.selectedPokemilton.level,
      this.wildPokemilton.defenseRange * this.wildPokemilton.level
    );
    this.wildPokemilton.healthPool -= damage;
    this.wildPokemiltonAction(oneDayLater, wildBattle);
  }

  tryToCatch(oneDayLater, wildBattle) {
    if (
      this.wildPokemilton.healthPool < this.wildPokemilton.healthPool * 0.2 &&
      this.pokeMaster.POKEBALLS > 0
    ) {
      console.log(this.wildPokemilton.catchPhrase);
      this.pokeMaster.pokemiltonCollection.push(this.wildPokemilton);
      console.log(this.pokeMaster.pokemiltonCollection);
      this.pokeMaster.POKEBALLS--;
    } else {
      console.log('\nCatch failed :(');
      this.startRound(oneDayLater, wildBattle);
    }
  }

  calculateDamage(attackRange, defenseRange) {
    return Math.floor(
      Math.random() * (attackRange - defenseRange) + defenseRange
    );
  }

  wildPokemiltonAction(oneDayLater, wildBattle) {
    const damage = this.calculateDamage(
      this.wildPokemilton.attackRange * this.wildPokemilton.level,
      this.selectedPokemilton.defenseRange * this.selectedPokemilton.level
    );
    this.selectedPokemilton.healthPool -= damage;
    this.startNewRound(oneDayLater, wildBattle);
  }

  startNewRound(oneDayLater, wildBattle) {
    round += 1;
    console.log(`\n\nRound number [${round}]`);
    this.endBattle(oneDayLater, wildBattle);
  }

  endBattle(oneDayLater, wildBattle) {
    if (this.selectedPokemilton.healthPool <= 0) {
      this.selectedPokemilton.healthPool = 0;
      console.log(
        `\n${this.selectedPokemilton.name} vs ${this.wildPokemilton.name}\n  ----------  \nLvl: ${this.selectedPokemilton.level} | ${this.wildPokemilton.level}\nAtk: ${this.selectedPokemilton.attackRange} | ${this.wildPokemilton.attackRange}\nDef: ${this.selectedPokemilton.defenseRange} | ${this.wildPokemilton.defenseRange}\nHP: ${this.selectedPokemilton.healthPool} | ${this.wildPokemilton.healthPool}`
      );
      console.log('Your pokemilton is dead... RIP you lost :(');
      this.checkBattleStatus(oneDayLater, wildBattle);
    } else if (this.wildPokemilton.healthPool <= 0) {
      this.wildPokemilton.healthPool = 0;
      console.log(
        `\n${this.selectedPokemilton.name} vs ${this.wildPokemilton.name}\n  ----------  \nLvl: ${this.selectedPokemilton.level} | ${this.wildPokemilton.level}\nAtk: ${this.selectedPokemilton.attackRange} | ${this.wildPokemilton.attackRange}\nDef: ${this.selectedPokemilton.defenseRange} | ${this.wildPokemilton.defenseRange}\nHP: ${this.selectedPokemilton.healthPool} | ${this.wildPokemilton.healthPool}`
      );
      console.log(
        `You won, you murdered an innocent wild Pokemilton :/\n${this.selectedPokemilton.name} has won ${this.xp} xp by eating ${this.wildPokemilton.name} corpse`
      );
      this.checkBattleStatus(oneDayLater, wildBattle);
    } else {
      this.checkBattleStatus(oneDayLater, wildBattle);
    }
  }

  checkBattleStatus(oneDayLater, wildBattle) {
    if (
      this.selectedPokemilton.healthPool === 0 ||
      this.wildPokemilton.healthPool === 0
    ) {
      if (this.selectedPokemilton.healthPool === 0) {
        if (
          this.pokeMaster.reviveItems === 0 &&
          this.pokeMaster.pokemiltonCollection.length === 1
        ) {
          console.log(
            `You lost all your pokemiltons... This is sadly the end of your journey. Bye`
          );
          deleteGame();
          setTimeout(process.exit, 5000);
        } else if (this.pokeMaster.reviveItems > 0) {
          this.pokeMaster.revivePokemilton(this.selectedPokemilton);
          // BUG
          console.log(
            `${this.selectedPokemilton.name} has been revived because you had no more pokemilton`
          );
          this.pokeMaster.reviveItems--;
          this.world.randomizeEvent(oneDayLater, wildBattle, this.pokeMaster);
        } else {
          console.log(
            `${this.selectedPokemilton.name} died and you had no more revive items`
          );
          this.pokeMaster.pokemiltonCollection.splice(
            this.pokeMaster.pokemiltonCollection.findIndex(
              this.selectedPokemilton
            ) - 1,
            1
          );
          this.world.randomizeEvent(oneDayLater, wildBattle, this.pokeMaster);
        }
      } else {
        this.selectedPokemilton.gainExperience(this.wildPokemilton.level);
        console.log(`\n${this.selectedPokemilton.name} gained some xp`);
        this.world.randomizeEvent(oneDayLater, wildBattle, this.pokeMaster);
      }
    } else {
      this.startRound(oneDayLater, wildBattle);
    }
  }
}

module.exports = PokemiltonArena;
