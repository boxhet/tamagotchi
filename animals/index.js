const base = require('../base');

function passedHours(timestamp) {
  const now = Date.now();
  const difference = Math.floor(((now - new Date(timestamp)) / 3600) / 1000);
  return difference;
}

class Animal {
  constructor(animal) {
    this.name = animal.name;
    this.createdAt = animal.createdAt;
    this.id = animal.id;
    this.lastFeed = animal.lastFeed;
    this.satiation = animal.satiation;
    this.status = animal.status;
    this.happiness = animal.happiness;
  }

  get age() {
    return passedHours(this.createdAt);
  }

  static async create(name) {
    const data = {
      name,
      createdAt: Date.now(),
      lastFeed: Date.now(),
      satiation: 10,
      status: 'alive',
      happiness: 10,
    };

    data.id = await base.create('animals', data);
    return new Animal(data);
  }

  static async findAnimalById(id) {
    const data = await base.read(`animals/${id}`);
    const animal = new Animal({ ...data, id });
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
      createdAt: this.createdAt,
      status: this.status,
      lastFeed: this.lastFeed,
      satiation: this.satiation,
      happiness: this.happiness,
    };
    await base.update(`animals/${this.id}`, data);
    return this;
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
