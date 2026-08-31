const express = require('express');

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('HubSpot practicum starter app');
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
