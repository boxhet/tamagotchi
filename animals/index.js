const fs = require('fs');
const path = require('path');

function readFile(id) {
  const fileName = path.join(__dirname, `${id}.json`);
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (error, data) => {
      if (error) reject(error);
      resolve(JSON.parse(data));
    });
  });
}

function generateId() {
  return new Promise((resolve, reject) => {
    fs.readdir(__dirname, (error, files) => {
      if (error) reject(error);
      const ids = files
        .filter((file) => /^\d.json$/.test(file))
        .map((file) => Number(file.replace(/.json$/, '')));
      const lastIndex = Math.max(...ids) + 1;
      resolve(lastIndex);
    });
  });
}

function passedHours(timestamp) {
  const now = Date.now();
  const difference = Math.floor(((now - new Date(timestamp)) / 3600) / 1000);
  return difference;
}

class Animal {
  constructor(animal) {
    this.name = animal.name;
    this.age = animal.age;
    this.id = animal.id;
    this.lastFeed = animal.lastFeed;
    this.satiation = animal.satiation;
    this.status = animal.alive;
    this.happiness = animal.happiness;
  }

  static async create(name, age) {
    const id = await generateId();
    const animal = new Animal({
      name,
      age,
      id,
      lastFeed: Date.now(),
      satiation: 10,
      status: 'alive',
      happiness: 10,
    });
    await animal.save();
    return animal;
  }

  static async findAnimalById(id) {
    const data = await readFile(id);
    const animal = new Animal(data);
    await animal.checkAndUpdateProperties();
    return animal;
  }

  async feed() {
    if (this.status === 'dead') {
      throw new Error('Animal is dead');
    }

    this.satiation += 2;
    this.happiness += 1;
    this.lastFeed = Date.now();
    await this.save();
  }

  async play() {
    if (this.status === 'dead') {
      throw new Error('Animal is dead');
    }

    this.happiness += 3;
    await this.save();
  }

  async save() {
    const data = {
      name: this.name,
      age: this.age,
      id: this.id,
      status: this.status,
      lastFeed: this.lastFeed,
      satiation: this.satiation,
      happiness: this.happiness,
    };
    const fileName = path.join(__dirname, `${this.id}.json`);
    return new Promise((resolve, reject) => {
      fs.writeFile(fileName, JSON.stringify(data, null, 2), (error) => {
        if (error) reject(error);
        resolve(true);
      });
    });
  }

  async checkAndUpdateProperties() {
    const satiationPoints = passedHours(this.lastFeed);
    const happinessPoints = Animal.SATIATION_DEPENDENCY * satiationPoints;
    this.satiation -= satiationPoints;
    this.happiness -= happinessPoints;

    if (this.satiation <= 0) {
      this.satiation = 0;
      this.status = 'dead';
    }

    await this.save();
  }

  static get SATIATION_DEPENDENCY() {
    return 0.3;
  }
}

module.exports = Animal;
