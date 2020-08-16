const aH = require('express-async-handler');
const express = require('express');

const d = require('./data');
const h = require('./helpers');

const router = express.Router();

/* Root Routes */
router.get('/', aH(async (req, res) => {
  // eslint-disable-next-line prefer-const
  let [/* homePhotos, */news, trips] = await Promise.all([
    // TODO remove after testing
    //    h.fetchHelper(`${h.API_URL}/homephotos`, req).then(h => h.json()),
    h.fetchHelper(`${h.API_URL}/news`, req).then((n) => n.json()).then((nn) => nn.news),
    h.fetchHelper(`${h.API_URL}/noauth/trips`, req).then((t) => t.json()),
  ]);

  //  homePhotos = homePhotos.images;
  const homePhoto = ''; // TODO homePhotos[Math.floor(Math.random() * homePhotos.length)];
  news.forEach((n) => {
    // eslint-disable-next-line no-param-reassign
    n.date = h.prettyDate(n.createDatetime);
  });

  // Pretty print date & type
  trips = trips.trips;
  for (let i = 0; i < trips.length; i += 1) {
    trips[i].date = h.prettyDate(trips[i].startDatetime);
    trips[i].tripTypeName = d.tripTypes[trips[i].notificationTypeId].name;
  }

  res.render('index', {
    title: 'Home',
    header: 'HOME',
    name: await h.getFirstName(req),
    homePhoto,
    news,
    trips,
  });
}));

router.get('/gallery', aH(async (req, res) => {
  // eslint-disable-next-line no-unused-vars
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

router.get('/news/:newsId', aH(async (req, res) => {
  let news = await h.fetchHelper(`${h.API_URL}/news/archive`, req).then((n) => n.json()).then((nn) => nn.news);

  if (req.params.newsId !== 'archive') {
    news = news.filter((n) => n.id.toString() === req.params.newsId);
  }

  news.forEach((n) => {
    // eslint-disable-next-line no-param-reassign
    n.date = h.prettyDate(n.createDatetime);
  });

  res.render('news', {
    title: 'News',
    header: 'NEWS ARCHIVE',
    name: await h.getFirstName(req),
    news,
  });
}));

router.get('/privacy', aH(async (req, res) => {
  res.render('privacy', {
    title: 'Privacy Policy & Terms',
    header: 'PRIVACY POLICY / TERMS OF USE',
    name: await h.getFirstName(req),
  });
}));

router.get('/quicksignup', aH(async (req, res) => {
  res.render('quicksignup', {
    API_URL: h.API_URL,
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

router.get('/unsubscribe', aH(async (req, res) => {
  res.render('unsubscribe', {
    title: 'Unsubscribe',
    header: 'UNSUBSCRIPE',
    name: await h.getFirstName(req),
    API_URL: h.API_URL,
  });
}));

module.exports = router;
