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

/* Homepage Routes */
router.get('/', aH(async (req, res, next) => {
  let [trips, homePhotos, news] = await Promise.all([
    fetch(url + '/trips'),
    fetch(url + '/homephotos'),
    fetch(url + '/news')
  ]);

  [trips, homePhotos, news] = await Promise.all([
    trips.json(), homePhotos.json(), news.json()
  ]);

  homePhotos = homePhotos.images;
  const homePhoto = homePhotos[Math.floor(Math.random() * homePhotos.length)];

  res.render('index', {
    title: 'Home',
    header: 'HOME',
    name: await getFirstName(),
    homePhoto: homePhoto,
    news: news.news,
    trips: trips.trips
  });
}));

// TODO Split into separate files
router.get('/about', aH(async (req, res, next) => {
  res.render('about/index', {
    title: 'About Us',
    header: 'ABOUT US - Contact Info',
    name: await getFirstName()
  });
}));

router.get('/about/contact', aH(async (req, res, next) => {
  res.render('about/contact', {
    title: 'Contact Info',
    header: 'ABOUT US',
    name: await getFirstName()
  });
}));

router.get('/about/officers', aH(async (req, res, next) => {
  res.render('about/officers/President', {
    title: 'President',
    header: 'ABOUT US - Officers',
    name: await getFirstName()
  });
}));

router.get('/about/officers/:officerTitle', aH(async (req, res, next) => {
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

router.get('/about/tripleader', aH(async (req, res, next) => {
  res.render('about/tripleader', {
    title: 'Trip Leaders',
    header: 'ABOUT US - Trip Leaders',
    name: await getFirstName()
  });
}));

router.get('/about/trailmaint', aH(async (req, res, next) => {
  res.render('about/trailmaint', {
    title: 'Trail Maintenance',
    header: 'ABOUT US - Trail Maintenance',
    name: await getFirstName()
  });
}));

router.get('/about/becomeatripleader', aH(async (req, res, next) => {
  res.render('about/becomeatripleader', {
    title: 'Become a Trip Leader',
    header: 'ABOUT US - Become a Trip Leader',
    name: await getFirstName()
  });
}));

router.get('/resources', aH(async (req, res, next) => {
  res.render('resources', {
    title: 'Resources',
    header: 'RESOURCES',
    name: await getFirstName()
  });
}));

module.exports = router;
