const aH = require('express-async-handler');
const express = require('express');

const h = require('./helpers');

const router = express.Router();

/* Primary about page showing overview of OCVT */
router.get('/', aH(async (req, res) => {
  res.render('about/index', {
    title: 'About Us',
    header: 'ABOUT US - Contact Info',
    name: await h.getFirstName(req),
  });
}));

/* Contact - display officer contact info */
router.get('/contact', aH(async (req, res) => {
  res.render('about/contact', {
    title: 'Contact Info',
    header: 'ABOUT US',
    name: await h.getFirstName(req),
  });
}));

/* Offciers - default to showing president */
router.get('/officers', aH(async (req, res) => {
  res.render('about/officers/President', {
    title: 'President',
    header: 'ABOUT US - Officers',
    name: await h.getFirstName(req),
  });
}));

/* Officer, specific position - show specific officer */
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

/* Tripleader - display info about the trip leader program */
router.get('/tripleader', aH(async (req, res) => {
  res.render('about/tripleader', {
    title: 'Trip Leaders',
    header: 'ABOUT US - Trip Leaders',
    name: await h.getFirstName(req),
  });
}));

/* Trialmaint - display info about trail maintenance */
router.get('/trailmaint', aH(async (req, res) => {
  res.render('about/trailmaint', {
    title: 'Trail Maintenance',
    header: 'ABOUT US - Trail Maintenance',
    name: await h.getFirstName(req),
  });
}));

/* Becomeatripleader - display info about becoming a trip leader */
router.get('/becomeatripleader', aH(async (req, res) => {
  res.render('about/becomeatripleader', {
    title: 'Become a Trip Leader',
    header: 'ABOUT US - Become a Trip Leader',
    name: await h.getFirstName(req),
  });
}));

module.exports = router;
