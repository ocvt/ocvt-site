const aH = require('express-async-handler');
const express = require('express');

const h = require('./helpers');

const router = express.Router();

/* Root Routes */
router.get('/', aH(async (req, res) => {
  const [trips, /* homePhotos, */news] = await Promise.all([
    h.fetchHelper(`${h.API_URL}/noauth/trips`, req).then((t) => t.json()),
    // TODO remove after testign
    //    h.fetchHelper(`${h.API_URL}/homephotos`, req).then(h => h.json()),
    h.fetchHelper(`${h.API_URL}/news`, req).then((n) => n.json()),
  ]);

  //  homePhotos = homePhotos.images;
  const homePhoto = ''; // TODO homePhotos[Math.floor(Math.random() * homePhotos.length)];

  res.render('index', {
    title: 'Home',
    header: 'HOME',
    name: await h.getFirstName(req),
    homePhoto,
    news: news.news,
    trips: trips.trips,
  });
}));

router.get('/gallery', aH(async (req, res) => {
  const [homePhotos, tripsPhotos] = await Promise.all([
    h.fetchHelper(`${h.API_URL}/homephotos`, req).then((p) => p.json()),
    h.fetchHelper(`${h.API_URL}/noauth/trips/photos`, req).then((t) => t.json()),
  ]);
  const images = []; // TODO (homePhotos.images.concat(tripsPhotos.images)).reverse();

  res.render('gallery', {
    title: 'Gallery',
    header: 'GALLERY',
    name: await h.getFirstName(req),
    images,
  });
}));

router.get('/help', aH(async (req, res) => {
  res.render('help', {
    title: 'Help',
    header: 'HELP',
    name: await h.getFirstName(req),
  });
}));

router.get('/login', aH(async (req, res) => {
  const name = await h.getFirstName(req);

  if (name.status !== 401) {
    res.redirect(302, '/myocvt');
    return;
  }

  res.render('login', {
    title: 'Login',
    header: 'LOGIN',
    name,
    API_URL: h.API_URL,
  });
}));

router.get('/logout', aH(async (req, res) => {
  res.render('logout', {
    API_URL: h.API_URL,
  });
}));

router.get('/privacy', aH(async (req, res) => {
  res.render('privacy', {
    title: 'Privacy Policy & Terms',
    header: 'PRIVACY POLICY / TERMS OF USE',
    name: await h.getFirstName(req),
  });
}));

router.get('/reactivate', aH(async (req, res) => {
  const name = await h.getFirstName(req);

  if (name.status !== 403) {
    res.redirect(302, '/myocvt');
    return;
  }

  res.render('reactivate', {
    title: 'Reactivate',
    header: 'REACTIVATE',
    name,
    API_URL: h.API_URL,
  });
}));

router.get('/register', aH(async (req, res) => {
  const name = await h.getFirstName(req);

  if (name.status !== 404) {
    res.redirect(302, '/myocvt');
    return;
  }

  res.render('register', {
    title: 'Register',
    header: 'REGISTER',
    name,
    API_URL: h.API_URL,
  });
}));

router.get('/resources', aH(async (req, res) => {
  res.render('resources', {
    title: 'Resources',
    header: 'RESOURCES',
    name: await h.getFirstName(req),
  });
}));

router.get('/tripagreement', aH(async (req, res) => {
  res.render('tripagreement', {
    title: 'Trip Agreement',
    header: 'TRIP AGREEMENT',
    name: await h.getFirstName(req),
  });
}));

module.exports = router;
