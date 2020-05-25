const aH = require('express-async-handler')
const express = require('express');

const h = require('./helpers')

const router = express.Router();

/* Trips Routes */
router.get('/', aH(async (req, res, next) => {
  const dayString = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                     'Friday', 'Saturday'];
  const monthShortString = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
                            'June', 'July', 'Aug', 'Sep', 'Oct',
                            'Nov', 'Dec'];

  let [trips, recentTrips] = await Promise.all([
    h.fetchHelper(h.API_URL + '/noauth/trips', req),
    h.fetchHelper(h.API_URL + '/noauth/trips/archive', req)
  ]);

  [trips, recentTrips] = await Promise.all([
    trips.json(), recentTrips.json()
  ]);

  trips = trips.trips;
  recentTrips = recentTrips.trips.filter(x => !trips.includes(x));


  // Pretty print date strings
  for (let i = 0; i < trips.length; i++) {
    const date = new Date(trips[i].startDatetime);
    trips[i].date = `${dayString[date.getDay()]},
                     ${monthShortString[date.getMonth()]},
                     ${date.getYear()}`;
  }
  for (let i = 0; i < recentTrips.length; i++) {
    const date = new Date(recentTrips[i].startDatetime);
    recentTrips[i].date = `${dayString[date.getDay()]},
                           ${monthShortString[date.getMonth()]},
                           ${date.getYear()}`;
  }
  // Remove filler trip
  recentTrips.pop();

  res.render('trips/index', {
    title: 'Trips',
    header: 'OCVT TRIPS',
    name: await h.getFirstName(req),
    trips: trips,
    recentTrips: recentTrips
  });
}));

module.exports = router;
