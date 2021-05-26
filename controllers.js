const Animal = require('./animals');

async function getAnimalById(req, res) {
  const { id } = req.params;
  const animal = await Animal.findAnimalById(id);

  if (!animal) {
    return res.status(404).send('Animal not found');
  }
  return res.send(animal);
}

async function postAnimal(req, res) {
  if (req.body.status === 'dead') {
    res.send('You can\'t create a dead animal');
  }

  const newAnimal = await Animal.create(req.body.name, req.body.age);
  res.send(newAnimal);
}

async function postFeed(req, res) {
  const animal = await Animal.findAnimalById(req.params.id);
  if (!animal) {
    res.status(404).send('Animal not found');
    return;
  }

  await animal.checkAndUpdateProperties();

  try {
    await animal.feed();
  } catch (e) {
    res.status(404).send(e.message);
    return;
  }
  res.send(animal);
}

async function postPlay(req, res) {
  const animal = await Animal.findAnimalById(req.params.id);
  if (!animal) {
    res.status(404).send('Animal not found');
    return;
  }

  await animal.checkAndUpdateProperties();

  try {
    await animal.play();
  } catch (e) {
    res.status(404).send(e.message);
    return;
  }
  res.send(animal);
}

module.exports = {
  getAnimalById,
  postAnimal,
  postFeed,
  postPlay,
};
