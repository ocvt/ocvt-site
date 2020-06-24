const aH = require('express-async-handler');
const express = require('express');

const h = require('./helpers');

const router = express.Router();

/* About Routes */
router.get('/', aH(async (req, res) => {
  res.render('about/index', {
    title: 'About Us',
    header: 'ABOUT US - Contact Info',
    name: await h.getFirstName(req),
  });
}));

router.get('/contact', aH(async (req, res) => {
  res.render('about/contact', {
    title: 'Contact Info',
    header: 'ABOUT US',
    name: await h.getFirstName(req),
  });
}));

router.get('/officers', aH(async (req, res) => {
  res.render('about/officers/President', {
    title: 'President',
    header: 'ABOUT US - Officers',
    name: await h.getFirstName(req),
  });
}));

router.get('/officers/:officerTitle', aH(async (req, res) => {
  const { officerTitle } = req.params;
  const officerTitles = {
    Advisor: 'Advisor',
    HeadTripLeader: 'Head Trip Leader',
    PR: 'PR',
    President: 'President',
    TrailMaintenance: 'Trail Maintenance',
    Treasurer: 'Treasurer',
    Webmaster: 'Webmaster',
  };

  res.render(`about/officers/${officerTitle}`, {
    title: officerTitles[officerTitle],
    header: 'ABOUT US - Officers',
    name: await h.getFirstName(req),
  });
}));

router.get('/tripleader', aH(async (req, res) => {
  res.render('about/tripleader', {
    title: 'Trip Leaders',
    header: 'ABOUT US - Trip Leaders',
    name: await h.getFirstName(req),
  });
}));

router.get('/trailmaint', aH(async (req, res) => {
  res.render('about/trailmaint', {
    title: 'Trail Maintenance',
    header: 'ABOUT US - Trail Maintenance',
    name: await h.getFirstName(req),
  });
}));

router.get('/becomeatripleader', aH(async (req, res) => {
  res.render('about/becomeatripleader', {
    title: 'Become a Trip Leader',
    header: 'ABOUT US - Become a Trip Leader',
    name: await h.getFirstName(req),
  });
}));

module.exports = router;
