const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('./controllers');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/animals/:id', controllers.getAnimalById);

app.post('/animals', controllers.postAnimal);

app.post('/animals/:id/feeds', controllers.postFeed);

app.post('/animals/:id/games', controllers.postPlay);

/* eslint-disable */
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

/* eslint-enable */
