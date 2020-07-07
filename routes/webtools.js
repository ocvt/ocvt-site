const aH = require('express-async-handler');
const express = require('express');

const h = require('./helpers');
const d = require('./data.js');

const router = express.Router();

/* Webtools Routes */
router.get('/', aH(async (req, res) => {
  const name = await h.getFirstName(req);

  if (!name.json.officer) {
    res.redirect('/');
    return;
  }

  res.render('webtools/index', {
    title: 'Webtools',
    header: 'WEBTOOLS',
    name: await h.getFirstName(req),
  });
}));

router.get('/officers', aH(async (req, res) => {
  let officers = await h.fetchHelper(`${h.API_URL}/webtools/officers`, req);

  if (officers.status !== 200) {
    res.redirect('/');
    return;
  }

  officers = await officers.json().then((o) => o.officers);

  res.render('webtools/officers', {
    title: 'Webtools - Officers',
    header: 'OFFICERS',
    name: await h.getFirstName(req),
    API_URL: h.API_URL,
    officers,
  });
}));

module.exports = router;
