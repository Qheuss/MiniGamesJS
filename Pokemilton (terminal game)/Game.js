const readline = require('readline');
const PokemiltonMaster = require('./PokemiltonMaster');
const Pokemilton = require('./Pokemilton');
const PokemiltonWorld = require('./PokemiltonWorld');
const fs = require('fs');
const savePathFile = './Save.json';
const PokemiltonArena = require('./PokemiltonArena');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let pokeMaster = new PokemiltonMaster();
let newWorld = new PokemiltonWorld();
let fight = new PokemiltonArena();
let wildPokemilton = new Pokemilton();

function replaceValues(saveContent) {
  pokeMaster.name = saveContent.PokemiltonMaster.name;
  pokeMaster.healingItems = saveContent.PokemiltonMaster.healingItems;
  pokeMaster.reviveItems = saveContent.PokemiltonMaster.reviveItems;
  pokeMaster.POKEBALLS = saveContent.PokemiltonMaster.POKEBALLS;

  pokeMaster.pokemiltonCollection =
    saveContent.PokemiltonMaster.pokemiltonCollection.map((pokemiltonData) => {
      const newPokemilton = new Pokemilton();

      for (const key in pokemiltonData) {
        if (pokemiltonData.hasOwnProperty(key)) {
          newPokemilton[key] = pokemiltonData[key];
        }
      }
      return newPokemilton;
    });

  newWorld.day = saveContent.day;
  newWorld.logs = saveContent.logs;
}

function saveGameState(pokemaster, newWorld) {
  const formattedDate = new Date();
  let save = {
    'saved on': formattedDate,
    PokemiltonMaster: pokemaster,
    day: newWorld.day,
    logs: newWorld.logs,
  };

  fs.writeFileSync(savePathFile, JSON.stringify(save, null, 2));
  console.log('Saving...');
}

function loadGame() {
  return new Promise((resolve, reject) => {
    fs.readFile(savePathFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Erreur lors de la lecture du fichier :', err);
        reject(err);
      } else {
        contentSave = JSON.parse(data);
        resolve(contentSave);
      }
    });
  });
}

async function startGame() {
  console.clear();
  if (fs.existsSync(savePathFile)) {
    const saveContent = await loadGame();
    console.log(saveContent);
    replaceValues(saveContent);
    oneDayLater();
  } else {
    askForName();
  }
}

function askForName() {
  return new Promise((resolve) => {
    rl.question(`What's your name?\n> `, (username) => {
      if (username.trim()) {
        resolve(username.trim());
        console.log(`\nHello ${username} welcome to the Pokemilton game!`);
        pokeMaster = new PokemiltonMaster(username);
        proposeFirstPokemilton();
      } else {
        console.error('No name entered!');
        askForName();
      }
    });
  });
}

function proposeFirstPokemilton() {
  let FirstPokemiltonArr = [];
  for (i = 0; i < 3; i++) {
    let FirstPokemilton = new Pokemilton();
    FirstPokemiltonArr.push(FirstPokemilton);
    console.log(
      `\n--- ${i + 1} ---\nName: ${FirstPokemilton.name}\nLevel: ${
        FirstPokemilton.level
      }\nExperience: ${FirstPokemilton.experienceMeter}\nAttack: ${
        FirstPokemilton.attackRange
      }\nDefense: ${FirstPokemilton.defenseRange}\nHealth: ${
        FirstPokemilton.healthPool
      }`
    );
  }
  fistChoice();
  function fistChoice() {
    rl.question(`\nChoose your first Pokemilton (1, 2 or 3): `, (answer) => {
      if (answer >= 1 && answer <= 3) {
        console.clear();
        console.log(
          `You chose: ${FirstPokemiltonArr[answer - 1].name}\nLevel: ${
            FirstPokemiltonArr[answer - 1].level
          }\nExperience: ${
            FirstPokemiltonArr[answer - 1].experienceMeter
          }\nAttack: ${FirstPokemiltonArr[answer - 1].attackRange}\nDefense: ${
            FirstPokemiltonArr[answer - 1].defenseRange
          }\nHealth: ${FirstPokemiltonArr[answer - 1].healthPool}`
        );
        secondChoice();
        function secondChoice() {
          rl.question(
            `\nDo you wish to choose this Pokemilton or do you want to reroll the choices?\n1) to keep it\n2) to reroll\n> `,
            (choice) => {
              if (Number(choice) === 1) {
                console.clear();
                console.log(`Your adventure begin ${pokeMaster.name}!`);
                pokeMaster.pokemiltonCollection.push(
                  FirstPokemiltonArr[answer - 1]
                );
                oneDayLater();
              } else if (Number(choice) === 2) {
                console.clear();
                proposeFirstPokemilton();
              } else {
                console.log(
                  `\nIs choosing between 1 and too that difficult? Your iq is lower than I tought...`
                );
                secondChoice();
              }
            }
          );
        }
      } else {
        console.error('You dumbass 🤬\nChoose between 1 and 3');
        fistChoice();
      }
    });
  }
}

function showPokeItems() {
  console.log(
    `\nHealing Items: ${pokeMaster.healingItems}\nRevive Items: ${pokeMaster.reviveItems}\nPokeballs: ${pokeMaster.POKEBALLS}`
  );
}

function oneDayLater() {
  console.clear();
  newWorld.oneDayPasses();
  console.log(`Day number: ${newWorld.day}`);
  showPokeItems();
  if (newWorld.day > 0) {
    rl.question(
      `\nA day has passed, what would you like to do?\n1: Heal a Pokemilton\n2: Release a Pokemilton\n3: Rename a Pokemilton\n4: Save and leave the game\nAnything else: 💀\n> `,
      (answer) => {
        if (Number(answer) === 1) {
          pokeMaster.showPokeCollection();
          rl.question(
            `\nWhich Pokemilton would you like to heal?\n> `,
            (choice) => {
              pokeMaster.healPokemilton(
                pokeMaster.pokemiltonCollection[choice - 1]
              );
            }
          );
          newWorld.randomizeEvent(oneDayLater, wildBattle, pokeMaster);
        } else if (Number(answer) === 2) {
          pokeMaster.showPokeCollection();
          rl.question(
            `\nWhich Pokemilton would you like to Release?\n> `,
            (choice) => {
              pokeMaster.releasePokemilton(choice - 1);
            }
          );
          newWorld.randomizeEvent(oneDayLater, wildBattle, pokeMaster);
        } else if (Number(answer) === 3) {
          pokeMaster.showPokeCollection();
          rl.question(
            `\nWhich Pokemilton would you like to rename?\n> `,
            (choice) => {
              console.log(
                `\n${pokeMaster.pokemiltonCollection[choice - 1].name} ?`
              );
              rl.question(`\nChoose it a new name\n> `, (newName) => {
                pokeMaster.renamePokemilton(
                  newName,
                  pokeMaster.pokemiltonCollection[choice - 1]
                );
                newWorld.randomizeEvent(oneDayLater, wildBattle, pokeMaster);
              });
            }
          );
        } else if (Number(answer) === 4) {
          saveGameState(pokeMaster, newWorld);
          setTimeout(process.exit, 5000);
        } else {
          wildBattle();
        }
      }
    );
  } else {
    wildBattle();
  }
}

function wildBattle() {
  console.clear();
  wildPokemilton = new Pokemilton();
  console.log(
    `\nA wild Pokemilton appears\n\n--- ${wildPokemilton.name} ---\nLevel: ${wildPokemilton.level}\nAttack: ${wildPokemilton.attackRange}\nDefense: ${wildPokemilton.defenseRange}\nHealth: ${wildPokemilton.healthPool}`
  );
  rl.question(
    `\nDo you fight ((type anything))\nor do you run (1)?\n> `,
    (choice) => {
      if (Number(choice) === 1) {
        newWorld.randomizeEvent(oneDayLater, wildBattle, pokeMaster);
      } else {
        console.log('\nYour Pokemiltons are:');
        pokeMaster.showPokeCollection();
        pokeFightChoice();
        function pokeFightChoice() {
          rl.question(`\nWhich one will you use?\n> `, (choice) => {
            if (pokeMaster.pokemiltonCollection[choice - 1]) {
              console.clear();
              fight = new PokemiltonArena(
                pokeMaster.pokemiltonCollection[choice - 1],
                wildPokemilton,
                pokeMaster,
                newWorld
              );
              fight.choosePokemilton(oneDayLater, wildBattle);
            } else {
              pokeFightChoice();
            }
          });
        }
      }
    }
  );
}

startGame();
