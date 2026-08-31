require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_PRIVATE_APP_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.HUBSPOT_CUSTOM_OBJECT_TYPE || '2-68435432';
const MOCK_HUBSPOT = process.env.MOCK_HUBSPOT === 'true';
const CUSTOM_PROPERTIES = ['name', 'bio', 'power'];

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const hubspotHeaders = {
  Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
};

const sampleMarvelCharacters = [
  {
    id: 'sample-1',
    properties: {
      name: 'Spider-Man',
      bio: 'A friendly neighborhood hero from Queens shown when MOCK_HUBSPOT=true.',
      power: '82'
    }
  },
  {
    id: 'sample-2',
    properties: {
      name: 'Thor',
      bio: 'The Asgardian god of thunder shown when MOCK_HUBSPOT=true.',
      power: '98'
    }
  }
];

function missingHubSpotConfig() {
  return !HUBSPOT_ACCESS_TOKEN || HUBSPOT_ACCESS_TOKEN.includes('your-service-key-token') || !CUSTOM_OBJECT_TYPE;
}

app.get('/', async (req, res) => {
  const title = 'Marvel Characters | Integrating With HubSpot I Practicum';

  if (MOCK_HUBSPOT) {
    return res.render('homepage', { title, data: sampleMarvelCharacters });
  }

  if (missingHubSpotConfig()) {
    return res.status(500).render('homepage', {
      title,
      data: [],
      error: 'Add HUBSPOT_PRIVATE_APP_ACCESS_TOKEN and HUBSPOT_CUSTOM_OBJECT_TYPE to your .env file to call HubSpot.'
    });
  }

  const objectUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

  try {
    const response = await axios.get(objectUrl, {
      headers: hubspotHeaders,
      params: {
        properties: CUSTOM_PROPERTIES.join(','),
        limit: 100,
        archived: false
      }
    });

    res.render('homepage', { title, data: response.data.results });
  } catch (error) {
    console.error('Error getting Marvel character records:', error.response?.data || error.message);
    res.status(500).render('homepage', {
      title,
      data: [],
      error: 'Unable to retrieve Marvel character records from HubSpot. Check your token, scopes, and custom object type ID.'
    });
  }
});

app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

app.post('/update-cobj', async (req, res) => {
  const newRecord = {
    properties: {
      name: req.body.name,
      bio: req.body.bio,
      power: req.body.power
    }
  };

  if (MOCK_HUBSPOT) {
    console.log('MOCK_HUBSPOT=true, not creating a HubSpot record:', newRecord);
    return res.redirect('/');
  }

  if (missingHubSpotConfig()) {
    return res.status(500).send('Add HUBSPOT_PRIVATE_APP_ACCESS_TOKEN and HUBSPOT_CUSTOM_OBJECT_TYPE to your .env file to call HubSpot.');
  }

  const objectUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

  try {
    await axios.post(objectUrl, newRecord, { headers: hubspotHeaders });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating Marvel character record:', error.response?.data || error.message);
    res.status(500).send('Unable to create Marvel character record in HubSpot. Check your token, scopes, object type ID, and property internal names.');
  }
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
