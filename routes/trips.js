const aH = require('express-async-handler');
const express = require('express');

const h = require('./helpers');
const d = require('./data.js');

const router = express.Router();

/* Trips Routes */
router.get('/', aH(async (req, res) => {
  let [trips, recentTrips] = await Promise.all([
    h.fetchHelper(`${h.API_URL}/noauth/trips`, req),
    h.fetchHelper(`${h.API_URL}/noauth/trips/archive`, req),
  ]);

  [trips, recentTrips] = await Promise.all([
    trips.json(), recentTrips.json(),
  ]);

  trips = trips.trips;
  recentTrips = recentTrips.trips.filter((rT) => !trips.some((t) => rT.id === t.id));

  // Pretty print date & type
  for (let i = 0; i < trips.length; i += 1) {
    const date = new Date(trips[i].startDatetime);
    trips[i].date = `${d.dayString[date.getDay()]},
                     ${d.monthShortString[date.getMonth()]},
                     ${date.getDate()},
                     ${date.getFullYear()}`;
    trips[i].tripTypeName = d.tripTypes[trips[i].notificationTypeId].name;
  }
  for (let i = 0; i < recentTrips.length; i += 1) {
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
    trips,
    recentTrips,
  });
}));

router.get('/archive/:startId?/:perPage?', aH(async (req, res) => {
  let pastTrips;
  if (req.params.startId && req.params.perPage) {
    pastTrips = await h.fetchHelper(`${h.API_URL}/noauth/trips/archive/${req.params.startId}/${req.params.perPage}`, req);
  } else {
    pastTrips = await h.fetchHelper(`${h.API_URL}/noauth/trips/archive`, req);
  }
  pastTrips = await pastTrips.json();
  pastTrips = pastTrips.trips;

  // Pretty print date & type
  for (let i = 0; i < pastTrips.length; i += 1) {
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
    pastTrips,
  });
}));

router.get('/newtrip', aH(async (req, res) => {
  const name = await h.getFirstName(req);

  if (name.status !== 200) {
    res.redirect('/myocvt');
    return;
  }

  res.render('trips/newtrip', {
    title: 'Trips',
    header: 'NEW TRIP',
    name,
    API_URL: h.API_URL,
    tripTypes: d.tripTypes,
  });
}));

router.get('/:tripId', aH(async (req, res) => {
  let trip = await h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}`, req);
  const signupStatus = trip.status;
  if (signupStatus !== 200) {
    trip = await h.fetchHelper(`${h.API_URL}/noauth/trips/${req.params.tripId}`, req);
  }
  trip = await trip.json();

  const date = new Date(trip.startDatetime);
  trip.date = `${d.dayString[date.getDay()]},
               ${d.monthShortString[date.getMonth()]},
               ${date.getDate()},
               ${date.getFullYear()}`;
  trip.startTime = date.toLocaleTimeString();
  trip.endTime = new Date(trip.endDatetime).toLocaleTimeString();
  trip.tripTypeName = d.tripTypes[trip.notificationTypeId].name;

  res.render('trips/trip', {
    title: 'Trips',
    header: 'VIEW TRIP',
    name: await h.getFirstName(req),
    signupStatus,
    trip,
  });
}));

router.get('/:tripId/jointrip', aH(async (req, res) => {
  let trip = await h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}`, req);
  //  const signupStatus = trip.status;
  //  if (signupStatus === 401 || signupStatus === 403) {
  //    trip = await h.fetchHelper(h.API_URL + '/noauth/trips/' + req.params.tripId, req);
  //  }
  trip = await trip.json();

  const date = new Date(trip.startDatetime);
  trip.date = `${d.dayString[date.getDay()]},
               ${d.monthShortString[date.getMonth()]},
               ${date.getDate()},
               ${date.getFullYear()}`;
  trip.startTime = date.toLocaleTimeString();
  trip.endTime = new Date(trip.endDatetime).toLocaleTimeString();
  trip.tripTypeName = d.tripTypes[trip.notificationTypeId].name;

  res.render('trips/jointrip', {
    title: 'Join A Trip',
    header: 'JOIN A TRIP',
    name: await h.getFirstName(req),
    API_URL: h.API_URL,
    trip,
  });
}));

module.exports = router;
