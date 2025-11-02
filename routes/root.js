import aH from 'express-async-handler';
import express from 'express';

import * as d from './data.js';
import * as h from './helpers.js';

const router = express.Router();

/* Home - mostly static content */
router.get('/', aH(async (req, res) => {
  // eslint-disable-next-line prefer-const
  let [homePhotos, news, trips] = await Promise.all([
    h.fetchHelper(`${h.API_URL}/homephotos`, req).then((p) => p.json()).then((pp) => pp.images),
    h.fetchHelper(`${h.API_URL}/news`, req).then((n) => n.json()).then((nn) => nn.news),
    h.fetchHelper(`${h.API_URL}/noauth/trips`, req).then((t) => t.json()),
  ]);

  const homePhoto = homePhotos[Math.floor(Math.random() * homePhotos.length)];
  for (let i = 0; i < news.length; i += 1) {
    news[i].date = h.prettyDate(news[i].createDatetime);
  }

  // Pretty print date & type
  trips = trips.trips;
  for (let i = 0; i < trips.length; i += 1) {
    trips[i].date = h.prettyDate(trips[i].startDatetime);
    trips[i].tripTypeName = d.tripTypes[trips[i].notificationTypeId].name;
  }

  res.render('index', {
    title: 'Home',
    header: 'HOME',
    name: await h.getName(req),
    API_URL: h.API_URL,
    homePhoto,
    news,
    trips,
  });
}));

/* Special error page to show error info from api */
router.get('/error', aH(async (req, res) => {
  res.render('error', {
    errorStatus: req.query.status,
    errorCode: req.query.code,
    errorMessage: req.query.text,
  });
}));

/* Instagram */
router.get('/instagram', aH(async (req, res) => {
  res.render('instagram', {
    title: 'Instagram',
    header: 'INSTAGRAM',
    name: await h.getName(req),
  });
}));

/* Help - static content */
router.get('/help', aH(async (req, res) => {
  res.render('help', {
    title: 'Help',
    header: 'HELP',
    name: await h.getName(req),
  });
}));

/* Login - initiate login process */
router.get('/login', aH(async (req, res) => {
  const name = await h.getName(req);

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

/* Logout - clear api cookies */
router.get('/logout', aH(async (req, res) => {
  res.render('logout', {
    API_URL: h.API_URL,
  });
}));

/* News - view specific article, or all if 'archive' is used */
router.get('/news/:newsId', aH(async (req, res) => {
  let news = await h.fetchHelper(`${h.API_URL}/news/archive`, req).then((n) => n.json()).then((nn) => nn.news);

  if (req.params.newsId !== 'archive') {
    news = news.filter((n) => n.id.toString() === req.params.newsId);
  }

  for (let i = 0; i < news.length; i += 1) {
    news[i].date = h.prettyDate(news[i].createDatetime);
  }

  res.render('news', {
    title: 'News',
    header: 'NEWS ARCHIVE',
    name: await h.getName(req),
    news,
  });
}));

/* Privacy - display privacy & terms of use */
router.get('/privacy', aH(async (req, res) => {
  res.render('privacy', {
    title: 'Privacy Policy & Terms',
    header: 'PRIVACY POLICY / TERMS OF USE',
    name: await h.getName(req),
  });
}));

/* Quicksignup - quickly add new emails for gobblerfest or similar */
router.get('/quicksignup', aH(async (req, res) => {
  res.render('quicksignup', {
    API_URL: h.API_URL,
  });
}));

/* Reactivate - reactivate a deactivated account */
router.get('/reactivate', aH(async (req, res) => {
  const name = await h.getName(req);

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

/* Register - complete registration for logged in account */
router.get('/register', aH(async (req, res) => {
  const name = await h.getName(req);

  if (name.status !== 404) {
    res.redirect(302, '/myocvt');
    return;
  }

  res.render('register', {
    title: 'Register',
    header: 'REGISTER',
    name,
    API_URL: h.API_URL,
    MIGRATE_ENABLED: h.MIGRATE_ENABLED,
  });
}));

/* Resources - misc resources about the area */
router.get('/resources', aH(async (req, res) => {
  res.render('resources', {
    title: 'Resources',
    header: 'RESOURCES',
    name: await h.getName(req),
  });
}));

/* Tripagreement - trip agreement all members agree to upon registering */
router.get('/tripagreement', aH(async (req, res) => {
  res.render('tripagreement', {
    title: 'Trip Agreement',
    header: 'TRIP AGREEMENT',
    name: await h.getName(req),
  });
}));

/* Unsubscript - simple unsubscribe function */
router.get('/unsubscribe', aH(async (req, res) => {
  res.render('unsubscribe', {
    title: 'Unsubscribe',
    header: 'UNSUBSCRIPE',
    name: await h.getName(req),
    API_URL: h.API_URL,
  });
}));

/* eslint-disable import/prefer-default-export */
export { router };
