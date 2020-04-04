const aH = require('express-async-handler');
const express = require('express');

const h = require('./helpers')

const router = express.Router();

/* Root Routes */
router.get('/', aH(async (req, res, next) => {
  let [trips, homePhotos, news] = await Promise.all([
    h.fetchHelper(h.API_URL + '/trips', req),
    h.fetchHelper(h.API_URL + '/homephotos', req),
    h.fetchHelper(h.API_URL + '/news', req)
  ]);

  [trips, homePhotos, news] = await Promise.all([
    trips.json(), homePhotos.json(), news.json()
  ]);

  homePhotos = homePhotos.images;
  const homePhoto = ''; // TODO homePhotos[Math.floor(Math.random() * homePhotos.length)];

  res.render('index', {
    title: 'Home',
    header: 'HOME',
    name: await h.getFirstName(req),
    homePhoto: homePhoto,
    news: news.news,
    trips: trips.trips
  });
}));

router.get('/gallery', aH(async (req, res, next) => {
  let [homePhotos, tripsPhotos] = await Promise.all([
    h.fetchHelper(h.API_URL + '/homephotos', req),
    h.fetchHelper(h.API_URL + '/trips/photos', req)
  ]);
  [homePhotos, tripsPhotos] = await Promise.all([
    homePhotos.json(),
    tripsPhotos.json()
  ]);
  const images = []; // TODO (homePhotos.images.concat(tripsPhotos.images)).reverse();
  
  res.render('gallery', {
    title: 'Gallery',
    header: 'GALLERY',
    name: await h.getFirstName(req),
    images: images
  });
}));

router.get('/help', aH(async (req, res, next) => {
  res.render('help', {
    title: 'Help',
    header: 'HELP',
    name: await h.getFirstName(req)
  });
}));

router.get('/login', aH(async (req, res, next) => {
  const name = await h.getFirstName(req);

  if (name.status === 404) {
    res.redirect(302, '/register');
    return;
  }

  res.render('login', {
    title: 'Login',
    header: 'LOGIN',
    name: name,
    API_URL: h.API_URL
  });
}));

router.get('/myocvt', aH(async (req, res, next) => {
  let [name, myaccount] = await Promise.all([
    h.getFirstName(req),
    h.fetchHelper(h.API_URL + '/myaccount', req)
  ]);
  myaccount = await myaccount.json();

  if (name.status !== 200) {
    res.redirect(302, '/login');
    return;
  }

  res.render('myocvt', {
    title: 'My OCVT',
    header: 'MY OCVT',
    name: name,
    API_URL: h.API_URL,
    myaccount: myaccount
  });
}));

router.get('/privacy', aH(async (req, res, next) => {
  res.render('privacy', {
    title: 'Privacy Policy & Terms',
    header: 'PRIVACY POLICY / TERMS OF USE',
    name: await h.getFirstName(req)
  });
}));

router.get('/register', aH(async (req, res, next) => {
  let myAccount = await h.fetchHelper(h.API_URL + '/myaccount', req);

  res.render('register', {
    title: 'Register',
    header: 'REGISTER',
    name: await h.getFirstName(req),
    myAccount: myAccount,
    API_URL: h.API_URL
  });
}));

router.get('/resources', aH(async (req, res, next) => {
  res.render('resources', {
    title: 'Resources',
    header: 'RESOURCES',
    name: await h.getFirstName(req)
  });
}));

module.exports = router;
