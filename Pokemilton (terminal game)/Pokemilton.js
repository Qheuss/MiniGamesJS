const students = [
  'Sop',
  'hie',
  'Man',
  'on',
  'Quen',
  'tin',
  'Sam',
  'uel',
  'Jona',
  'than',
  'Dan',
  'iel',
  'Cyr',
  'il',
  'Dam',
  'ien',
  'Auré',
  'liane',
  'Den',
  'is',
  'Emi',
  'lie',
  'Jér',
  'ôme',
  'Quen',
  'tin',
  'Nat',
  'alya',
  'Auré',
  'lien',
  'Chris',
  'tophe',
  'Gil',
  'les',
  'Cél',
  'ine',
  'Mari',
  'lou',
  'Lou',
  'is',
  'Math',
  'ilde',
  'Enk',
  'elan',
  'Ma',
  'rc',
  'Yas',
  'mine',
  'Sam',
  'uel',
  'Thom',
  'as',
  'Jul',
  'ien',
  'Greg',
  'ory',
  'Cyr',
  'ille',
  'Ken',
  'ny',
];

class Pokemilton {
  constructor() {
    this.name = this.generateRandomName();
    this.level = 1;
    this.experienceMeter = 0;
    this.attackRange = this.getRandomNumber(1, 8);
    this.defenseRange = this.getRandomNumber(1, 3);
    this.healthPool = this.getRandomNumber(10, 30);
    this.maxHealth = this.healthPool;
    this.catchPhrase = this.generateCatchPhrase();
  }

  generateRandomName() {
    const randomStudent1 =
      students[Math.floor(Math.random() * students.length)];
    const randomStudent2 =
      students[Math.floor(Math.random() * students.length)];
    return `${randomStudent1}${randomStudent2}`;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateCatchPhrase() {
    const phrases = [
      'I choose you!',
      'Let the battle begin!',
      'Pokemilton, go!',
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  gainExperience(opponentLevel) {
    const experienceGain = this.getRandomNumber(1, 5) * opponentLevel;
    this.experienceMeter += experienceGain;
    console.log(`${this.name} gained ${experienceGain} experience points!`);
    if (this.experienceMeter >= this.level * 100) {
      this.evolve();
    }
  }

  evolve() {
    this.level += 1;
    const attackIncrease = this.getRandomNumber(1, 5);
    const defenseIncrease = this.getRandomNumber(1, 5);
    const healthIncrease = this.getRandomNumber(1, 5);

    this.attackRange += attackIncrease;
    this.defenseRange += defenseIncrease;
    this.healthPool += healthIncrease;

    console.log(
      `${this.name} evolved into a higher level! New stats: Level ${this.level}, Attack Range ${this.attackRange}, Defense Range ${this.defenseRange}, Health Pool ${this.healthPool}`
    );
  }

  sayCatchPhrase() {
    console.log(`${this.name} says: "${this.catchPhrase}"`);
  }
}

module.exports = Pokemilton;
