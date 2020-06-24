const aH = require('express-async-handler');
const express = require('express');

const h = require('./helpers');
const d = require('./data.js');

const router = express.Router();

router.get('/', aH(async (req, res) => {
  let [myAccount, notifications] = await Promise.all([
    h.fetchHelper(`${h.API_URL}/myaccount`, req),
    h.fetchHelper(`${h.API_URL}/myaccount/notifications`, req),
  ]);
  myAccount = await myAccount.json();
  notifications = await notifications.json();

  const name = await h.getFirstName(req);
  if (name.status === 401) {
    res.redirect(302, '/login');
    return;
  } if (name.status === 403) {
    res.redirect(302, '/reactivate');
    return;
  } if (name.status === 404) {
    res.redirect(302, '/register');
    return;
  } if (name.status !== 200) {
    res.redirect(302, '/');
    return;
  }

  if (!('emergencyContactName' in myAccount)) {
    myAccount.emergencyContact = '';
  }
  if (!('emergencyContactNumber' in myAccount)) {
    myAccount.emergencyContact = '';
  }
  if (!('emergencyContactRelationship' in myAccount)) {
    myAccount.emergencyContact = '';
  }

  res.render('myocvt', {
    title: 'My OCVT',
    header: 'MY OCVT',
    name,
    API_URL: h.API_URL,
    myAccount,
    notifications: notifications.notifications,
    generalTypes: d.generalTypes,
    tripTypes: d.tripTypes,
  });
}));

module.exports = router;
