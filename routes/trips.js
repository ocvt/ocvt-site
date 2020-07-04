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

router.get('/attendance', aH(async (req, res) => {
  const name = await h.getFirstName(req);

  if (name.status !== 200) {
    res.redirect('/myocvt');
    return;
  }

  res.render('trips/attendance', {
    title: 'Trip Attendance',
    header: 'TRIP ATTENDANCE',
    name,
    API_URL: h.API_URL,
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
  // Only attending people can view trip details.
  // GET /trips/{tripId}/mystatus also works here but this saves an api call in this case
  const signupStatus = trip.status;
  if (signupStatus !== 200) {
    trip = await h.fetchHelper(`${h.API_URL}/noauth/trips/${req.params.tripId}`, req);
  }
  trip = await trip.json();

  const startDate = new Date(trip.startDatetime);
  const endDate = new Date(trip.endDatetime);
  trip.date = `${d.dayString[startDate.getDay()]},
               ${d.monthShortString[startDate.getMonth()]},
               ${startDate.getDate()},
               ${startDate.getFullYear()}`;
  trip.startTime = startDate.toLocaleTimeString();
  trip.endTime = endDate.toLocaleTimeString();
  trip.tripTypeName = d.tripTypes[trip.notificationTypeId].name;

  const now = new Date();
  const defaultSignupDate = new Date(startDate.getHours() - 12);
  trip.pastSignupPeriod = (trip.allowLateSignups && startDate < now) || (!trip.allowLateSignups && defaultSignupDate < now);

  res.render('trips/trip', {
    title: 'Trips',
    header: 'VIEW TRIP',
    name: await h.getFirstName(req),
    signupStatus,
    trip,
  });
}));

router.get('/:tripId/admin', aH(async (req, res) => {
  let [admin, mystatus, trip] = await Promise.all([
    h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}/admin`, req),
    h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}/mystatus`, req),
    h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}`, req),
  ]);

  if (mystatus.status !== 200) {
    res.redirect(`/trips/${req.params.tripId}`);
    return;
  }

  [admin, mystatus, trip] = await Promise.all([
    admin.json(),
    mystatus.json(),
    trip.json(),
  ]);
  const signups = { attend: [], boot: [], cancel: [], force: [], wait: [] };
  let carSeats = 0;

  admin.tripSignups.forEach(signup => {
    const signupDate = new Date(signup.signupDatetime);
    signup.date = `${d.dayString[signupDate.getDay()]},
                       ${d.monthShortString[signupDate.getMonth()]},
                       ${signupDate.getDate()},
                       ${signupDate.getFullYear()}`;
    signup.time = signupDate.toLocaleTimeString();

    if (signup.attendingCode === 'ATTEND') {
      carSeats += 1;
      signups.attend.push(signup);
    } else if (signup.attendingCode === 'FORCE') {
      carSeats += 1;
      signups.force.push(signup);
    } else if (signup.attendingCode === 'BOOT') {
      signups.boot.push(signup);
    } else if (signup.attendingCode === 'CANCEL') {
      signups.cancel.push(signup);
    } else {
      signups.wait.push(signup);
    }
  });

  const tripDate = new Date(trip.startDatetime);
  trip.date = `${d.dayString[tripDate.getDay()]},
               ${d.monthShortString[tripDate.getMonth()]},
               ${tripDate.getDate()},
               ${tripDate.getFullYear()}`;
  trip.startTime = tripDate.toLocaleTimeString();
  trip.endTime = new Date(trip.endDatetime).toLocaleTimeString();
  trip.tripTypeName = d.tripTypes[trip.notificationTypeId].name;

  res.render('trips/admin', {
    title: 'Trip Admin',
    header: 'TRIP ADMIN',
    name: await h.getFirstName(req),
    API_URL: h.API_URL,
    carSeats,
    mystatus,
    signups,
    trip,
  });
}));

router.get('/:tripId/jointrip', aH(async (req, res) => {
  let trip = await h.fetchHelper(`${h.API_URL}/noauth/trips/${req.params.tripId}`, req);
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

router.get('/:tripId/signup', aH(async (req, res) => {
  let [myAccount, signup, status, trip] = await Promise.all([
    h.fetchHelper(`${h.API_URL}/myaccount`, req),
    h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}/signup`, req),
    h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}/mystatus`, req),
    h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}`, req),
  ]);

  if (signup.status !== 200) {
    res.redirect(`/trips/${req.params.tripId}`);
    return;
  }

  [myAccount, signup, status, trip] = await Promise.all([
    myAccount.json(),
    signup.json(),
    status.json(),
    trip.json(),
  ]);

  const signupDate = new Date(signup.signupDatetime);
  signup.date = `${d.dayString[signupDate.getDay()]},
               ${d.monthShortString[signupDate.getMonth()]},
               ${signupDate.getDate()},
               ${signupDate.getFullYear()}`;
  signup.time = signupDate.toLocaleTimeString();

  const tripDate = new Date(trip.startDatetime);
  trip.date = `${d.dayString[tripDate.getDay()]},
               ${d.monthShortString[tripDate.getMonth()]},
               ${tripDate.getDate()},
               ${tripDate.getFullYear()}`;
  trip.startTime = tripDate.toLocaleTimeString();
  trip.endTime = new Date(trip.endDatetime).toLocaleTimeString();
  trip.tripTypeName = d.tripTypes[trip.notificationTypeId].name;

  res.render('trips/signup', {
    title: 'Trip Attendance',
    header: 'TRIP ATTENDANCE',
    name: await h.getFirstName(req),
    API_URL: h.API_URL,
    myAccount,
    signup,
    status,
    trip,
  });
}));

module.exports = router;
