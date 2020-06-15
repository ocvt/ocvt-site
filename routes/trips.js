const aH = require('express-async-handler')
const express = require('express');

const h = require('./helpers')
const d = require('./data.js')

const router = express.Router();

/* Trips Routes */
router.get('/', aH(async (req, res, next) => {
  let [trips, recentTrips] = await Promise.all([
    h.fetchHelper(h.API_URL + '/noauth/trips', req),
    h.fetchHelper(h.API_URL + '/noauth/trips/archive', req)
  ]);

  [trips, recentTrips] = await Promise.all([
    trips.json(), recentTrips.json()
  ]);

  trips = trips.trips;
  recentTrips = recentTrips.trips.filter(x => !trips.includes(x));


  // Pretty print date & type
  for (let i = 0; i < trips.length; i++) {
    const date = new Date(trips[i].startDatetime);
    trips[i].date = `${d.dayString[date.getDay()]},
                     ${d.monthShortString[date.getMonth()]},
                     ${date.getDate()},
                     ${date.getFullYear()}`;
    trips[i].tripTypeName = d.tripTypes[trips[i].notificationTypeId].name;
  }
  for (let i = 0; i < recentTrips.length; i++) {
    const date = new Date(recentTrips[i].startDatetime);
    recentTrips[i].date = `${d.dayString[date.getDay()]},
                           ${d.monthShortString[date.getMonth()]},
                           ${date.getDate()},
                           ${date.getFullYear()}`;
    recentTrips[i].tripTypeName = d.tripTypes[recentTrips[i].notificationTypeId].name;
  }

  res.render('trips/index', {
    title: 'Trips',
    header: 'OCVT TRIPS',
    name: await h.getFirstName(req),
    trips: trips,
    recentTrips: recentTrips
  });
}));

router.get('/archive/:startId?/:perPage?', aH(async (req, res, next) => {
  let pastTrips;
  if (req.params.startId && req.params.perPage) {
    pastTrips = await h.fetchHelper(h.API_URL + `/noauth/trips/archive/${req.params.startId}/${req.params.perPage}`, req);
  } else {
    pastTrips = await h.fetchHelper(h.API_URL + `/noauth/trips/archive`, req);
  }
  pastTrips = await pastTrips.json();
  pastTrips = pastTrips.trips;

  // Pretty print date & type
  for (let i = 0; i < pastTrips.length; i++) {
    const date = new Date(pastTrips[i].startDatetime);
    pastTrips[i].date = `${d.dayString[date.getDay()]},
                           ${d.monthShortString[date.getMonth()]},
                           ${date.getDate()},
                           ${date.getFullYear()}`;
    pastTrips[i].tripTypeName = d.tripTypes[pastTrips[i].notificationTypeId].name;
  }

  res.render('trips/archive', {
    title: 'Trips',
    header: 'TRIPS ARCHIVE',
    name: await h.getFirstName(req),
    pastTrips: pastTrips
  });
}));

router.get('/:tripId', aH(async (req, res, next) => {
  let trip = await h.fetchHelper(h.API_URL + '/trips/' + req.params.tripId, req);
  const signupStatus = trip.status;
  if (signupStatus <= 403) {
    trip = await h.fetchHelper(h.API_URL + '/noauth/trips/' + req.params.tripId, req);
  }
  trip = await trip.json();

  const date = new Date(trip.startDatetime);
  trip.date = `${d.dayString[date.getDay()]},
               ${d.monthShortString[date.getMonth()]},
               ${date.getDate()},
               ${date.getFullYear()}`;

  const tripTypeName = d.tripTypes[trip.notificationTypeId].name;

  res.render('trips/trip', {
    title: 'Trips',
    header: 'VIEW TRIP',
    name: await h.getFirstName(req),
    signupStatus: signupStatus,
    trip: trip,
    tripTypeName: tripTypeName
  });
}))

module.exports = router;
