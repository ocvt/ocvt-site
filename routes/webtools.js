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

router.get('/orders/codes', aH(async (req, res) => {
  let codes = await h.fetchHelper(`${h.API_URL}/webtools/codes`, req);

  if (codes.status !== 200) {
    res.redirect('/');
    return;
  }

  codes = await codes.json().then((c) => c.codes.filter((i) => !i.redeemed));

  res.render('webtools/orders_codes', {
    codes,
  });
}));

router.get('/orders/complete', aH(async (req, res) => {
  let orders = await h.fetchHelper(`${h.API_URL}/webtools/payments`, req);

  if (orders.status !== 200) {
    res.redirect('/');
    return;
  }

  orders = await orders.json().then((o) => o.payments.filter((p) => p.completed));

  res.render('webtools/orders_complete', {
    header: 'All Complete Orders',
    orders,
  });
}));

router.get('/orders/incomplete', aH(async (req, res) => {
  let orders = await h.fetchHelper(`${h.API_URL}/webtools/payments`, req);

  if (orders.status !== 200) {
    res.redirect('/');
    return;
  }

  orders = await orders.json().then((o) => o.payments.filter((p) => !p.completed));

  res.render('webtools/orders_incomplete', {
    API_URL: h.API_URL,
    header: 'All Incomplete Orders',
    orders,
  });
}));

router.get('/orders/manual', aH(async (req, res) => {
  let members = await h.fetchHelper(`${h.API_URL}/webtools/members`, req);

  if (members.status !== 200) {
    res.redirect('/');
    return;
  }

  members = await members.json().then((m) => m.members);

  res.render('webtools/orders_manual', {
    API_URL: h.API_URL,
    members,
  });
}));

module.exports = router;
