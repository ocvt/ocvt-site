const aH = require('express-async-handler')
const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();
const url = 'http://localhost:3000';

/* Root Routes */
router.get('/login', aH(async (req, res, next) => {
  res.render('login', {
    title: 'Login',
    header: 'LOGIN',
    name: await fetch(url + '/myaccount/name')
  });
}));

router.get('/register', aH(async (req, res, next) => {
  let myAccount = await fetch(url + '/myaccount');
  // 400 -> authed but not registered TODO check this everywhere

  res.render('register', {
    title: 'Register',
    header: 'REGISTER',
    name: await fetch(url + '/myaccount/name'),
    myAccount: myAccount
  });
}));

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
    name: await fetch(url + '/myaccount/name'),
    homePhoto: homePhoto,
    news: news.news,
    trips: trips.trips
  });
}));

router.get('/gallery', aH(async (req, res, next) => {
  let [homePhotos, tripsPhotos] = await Promise.all([
    fetch(url + '/homephotos'),
    fetch(url + '/trips/photos')
  ]);
  [homePhotos, tripsPhotos] = await Promise.all([
    homePhotos.json(),
    tripsPhotos.json()
  ]);
  const images = (homePhotos.images.concat(tripsPhotos.images)).reverse();
  
  res.render('gallery', {
    title: 'Gallery',
    header: 'GALLERY',
    name: await fetch(url + '/myaccount/name'),
    images: images
  });
}));

router.get('/resources', aH(async (req, res, next) => {
  res.render('resources', {
    title: 'Resources',
    header: 'RESOURCES',
    name: await fetch(url + '/myaccount/name')
  });
}));

router.get('/help', aH(async (req, res, next) => {
  res.render('help', {
    title: 'Help',
    header: 'HELP',
    name: await fetch(url + '/myaccount/name')
  });
}));

router.get('/privacy', aH(async (req, res, next) => {
  res.render('privacy', {
    title: 'Privacy Policy & Terms',
    header: 'PRIVACY POLICY / TERMS OF USE',
    name: await fetch(url + '/myaccount/name')
  });
}));

module.exports = router;
