const aH = require('express-async-handler')
const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();
const url = 'http://localhost:3000';


/* Routes */
router.get('/', aH(async (req, res, next) => {
//  const trips = await fetch(url + '/trips').json();
//
  const homePhotosRaw = await fetch(url + '/homephotos');
  const homePhotosJson = await homePhotosRaw.json();
  const homePhotos = homePhotosJson['images']; // ??? TODO .images OR ['images']
  const homePhoto = homePhotos[Math.floor(Math.random() * homePhotos.length)];
//
//  const news = await fetch(url + '/news').json();

  res.render('index', {
    title: 'Home',
    header: 'HOME',
    miniHeader: 'Hello Your Name Here', // TODO
    homePhoto: homePhoto
//    news: news,
//    trips: trips
  });
}));

module.exports = router;
