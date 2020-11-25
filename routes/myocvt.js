const aH = require('express-async-handler');
const express = require('express');

const d = require('./data');
const h = require('./helpers');

const router = express.Router();

/* Lookup user info and allow them to modify it */
router.get('/', aH(async (req, res) => {
  let [myaccount, notifications] = await Promise.all([
    h.fetchHelper(`${h.API_URL}/myaccount`, req),
    h.fetchHelper(`${h.API_URL}/myaccount/notifications`, req),
  ]);

  if (myaccount.status === 401) {
    res.redirect(302, '/login');
    return;
  } if (myaccount.status === 403) {
    res.redirect(302, '/reactivate');
    return;
  } if (myaccount.status === 404) {
    res.redirect(302, '/register');
    return;
  } if (myaccount.status !== 200) {
    res.redirect(302, '/');
    return;
  }

  [myaccount, notifications] = await Promise.all([
    myaccount.json(),
    notifications.json(),
  ]);

  if (!('emergencyContactName' in myaccount)) {
    myaccount.emergencyContact = '';
  }
  if (!('emergencyContactNumber' in myaccount)) {
    myaccount.emergencyContact = '';
  }
  if (!('emergencyContactRelationship' in myaccount)) {
    myaccount.emergencyContact = '';
  }

  res.render('myocvt', {
    title: 'My OCVT',
    header: 'MY OCVT',
    name: await h.getFirstName(req),
    API_URL: h.API_URL,
    generalTypes: d.generalTypes,
    myaccount,
    notifications: notifications.notifications,
    tripTypes: d.tripTypes,
  });
}));

module.exports = router;
