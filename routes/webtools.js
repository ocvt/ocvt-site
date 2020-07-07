const aH = require('express-async-handler');
const express = require('express');

const h = require('./helpers');

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

router.get('/members', aH(async (req, res) => {
  let members = await h.fetchHelper(`${h.API_URL}/webtools/members`, req);

  if (members.status !== 200) {
    res.redirect('/');
    return;
  }

  members = await members.json().then((m) => m.members);

  res.render('webtools/members', {
    title: 'Webtools - Members',
    header: 'MEMBERS',
    name: await h.getFirstName(req),
    API_URL: h.API_URL,
    members,
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

router.get('/orders/complete', aH(async (req, res) => {
  let orders = await h.fetchHelper(`${h.API_URL}/webtools/payments`, req);

  if (orders.status !== 200) {
    res.redirect('/');
    return;
  }

  orders = await orders.json().then((o) => o.payments.filter((o) => o.completed));

  res.render('webtools/orders_complete', {
    orders,
  });
}));

module.exports = router;