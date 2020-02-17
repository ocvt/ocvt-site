const aH = require('express-async-handler')
const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();
const url = 'http://localhost:3000';

async function getFirstName () {
  let name = await fetch(url + '/myaccount/name')
  if (name.status == 401) {
    return ''
    name = '';
  }
  name = await name.json();
  return name.firstName;
}

/* About Routes */
router.get('/', aH(async (req, res, next) => {
  res.render('about/index', {
    title: 'About Us',
    header: 'ABOUT US - Contact Info',
    name: await getFirstName()
  });
}));

router.get('/contact', aH(async (req, res, next) => {
  res.render('about/contact', {
    title: 'Contact Info',
    header: 'ABOUT US',
    name: await getFirstName()
  });
}));

router.get('/officers', aH(async (req, res, next) => {
  res.render('about/officers/President', {
    title: 'President',
    header: 'ABOUT US - Officers',
    name: await getFirstName()
  });
}));

router.get('/officers/:officerTitle', aH(async (req, res, next) => {
  const officerTitle = req.params.officerTitle;
  const officerTitles = {
    'Advisor': 'Advisor',
    'HeadTripLeader': 'Head Trip Leader',
    'PR': 'PR',
    'President': 'President',
    'TrailMaintenance': 'Trail Maintenance',
    'Treasurer': 'Treasurer',
    'Webmaster': 'Webmaster'
  };

  res.render('about/officers/' + officerTitle, {
    title: officerTitles[officerTitle],
    header: 'ABOUT US - Officers',
    name: await getFirstName()
  });
}));

router.get('/tripleader', aH(async (req, res, next) => {
  res.render('about/tripleader', {
    title: 'Trip Leaders',
    header: 'ABOUT US - Trip Leaders',
    name: await getFirstName()
  });
}));

router.get('/trailmaint', aH(async (req, res, next) => {
  res.render('about/trailmaint', {
    title: 'Trail Maintenance',
    header: 'ABOUT US - Trail Maintenance',
    name: await getFirstName()
  });
}));

router.get('/becomeatripleader', aH(async (req, res, next) => {
  res.render('about/becomeatripleader', {
    title: 'Become a Trip Leader',
    header: 'ABOUT US - Become a Trip Leader',
    name: await getFirstName()
  });
}));

module.exports = router;
