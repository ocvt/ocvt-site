const aH = require('express-async-handler');
const express = require('express');

const d = require('./data');
const h = require('./helpers');

const router = express.Router();

/* Trips Routes */
router.get('/', aH(async (req, res) => {
  let [trips, recentTrips] = await Promise.all([
    h.fetchHelper(`${h.API_URL}/noauth/trips`, req).then((t) => t.json()),
    h.fetchHelper(`${h.API_URL}/noauth/trips/archive`, req).then((r) => r.json()),
  ]);

  trips = trips.trips;
  recentTrips = recentTrips.trips.filter((rT) => !rT.cancel && !trips.some((t) => rT.id === t.id));

  // Pretty print date & type
  for (let i = 0; i < trips.length; i += 1) {
    trips[i].date = h.prettyDate(trips[i].startDatetime);
    trips[i].tripTypeName = d.tripTypes[trips[i].notificationTypeId].name;
  }
  for (let i = 0; i < recentTrips.length; i += 1) {
    recentTrips[i].date = h.prettyDate(recentTrips[i].startDatetime);
    recentTrips[i].tripTypeName = d.tripTypes[recentTrips[i].notificationTypeId].name;
  }

  res.render('trips/index', {
    title: 'Trips',
    header: 'OCVT TRIPS',
    name: await h.getFirstName(req),
    recentTrips,
    trips,
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
    pastTrips[i].date = h.prettyDate(pastTrips[i].startDatetime);
    pastTrips[i].tripTypeName = d.tripTypes[pastTrips[i].notificationTypeId].name;
  }

  res.render('trips/archive', {
    title: 'Trips',
    header: 'TRIPS ARCHIVE',
    name: await h.getFirstName(req),
    pastTrips,
  });
}));

router.get('/myattendance', aH(async (req, res) => {
  let myattendance = await h.fetchHelper(`${h.API_URL}/trips/myattendance`, req);

  if (myattendance.status !== 200) {
    res.redirect('/myocvt');
    return;
  }

  myattendance = await myattendance.json();
  const trips = { canceled: [], past: [], upcoming: [] };

  for (let i = 0; i < myattendance.trips.length; i += 1) {
    const trip = myattendance.trips[i];
    const startDate = new Date(trip.startDatetime);
    const endDate = new Date(trip.endDatetime);

    trip.date = h.prettyDate(trip.startDatetime);
    trip.startTime = startDate.toLocaleTimeString();
    trip.endTime = endDate.toLocaleTimeString();
    trip.tripTypeName = d.tripTypes[trip.notificationTypeId].name;

    if (myattendance.tripSignups[i].attendingCode === 'CANCEL') {
      trips.cancel.push(trip);
    } else if (endDate < Date.now()) {
      trips.past.push(trip);
    } else {
      trips.upcoming.push(trip);
    }
  }

  res.render('trips/myattendance', {
    title: 'Trip Attendance',
    header: 'TRIP ATTENDANCE',
    name: await h.getFirstName(req),
    API_URL: h.API_URL,
    trips,
    tripSignups: myattendance.tripSignups,
  });
}));

router.get('/mytrips', aH(async (req, res) => {
  let mytrips = await h.fetchHelper(`${h.API_URL}/trips/mytrips`, req);

  if (mytrips.status !== 200) {
    res.redirect('/myocvt');
    return;
  }

  mytrips = await mytrips.json().then((m) => m.trips);
  const trips = {
    canceled: [], past: [], upcoming: [], unpublished: [],
  };

  mytrips.forEach((trip) => {
    const startDate = new Date(trip.startDatetime);
    const endDate = new Date(trip.endDatetime);
    // eslint-disable-next-line no-param-reassign
    trip.date = h.prettyDate(trip.startDatetime);
    // eslint-disable-next-line no-param-reassign
    trip.startTime = startDate.toLocaleTimeString();
    // eslint-disable-next-line no-param-reassign
    trip.endTime = endDate.toLocaleTimeString();
    // eslint-disable-next-line no-param-reassign
    trip.tripTypeName = d.tripTypes[trip.notificationTypeId].name;

    if (trip.cancel) {
      trips.canceled.push(trip);
    } else if (!trip.publish) {
      trips.unpublished.push(trip);
    } else if (endDate < Date.now()) {
      trips.past.push(trip);
    } else {
      trips.upcoming.push(trip);
    }
  });

  res.render('trips/mytrips', {
    title: 'My Trips',
    header: 'TRIP ADMINISTRATION',
    name: await h.getFirstName(req),
    API_URL: h.API_URL,
    trips,
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
  let [mystatus, trip] = await Promise.all([
    h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}/mystatus`, req),
    h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}`, req),
  ]);

  if (trip.status !== 200) {
    trip = await h.fetchHelper(`${h.API_URL}/noauth/trips/${req.params.tripId}`, req);
  }

  [mystatus, trip] = await Promise.all([
    mystatus.json(),
    trip.json(),
  ]);

  const startDate = new Date(trip.startDatetime);
  const endDate = new Date(trip.endDatetime);
  trip.date = h.prettyDate(trip.startDatetime);
  trip.startTime = startDate.toLocaleTimeString();
  trip.endTime = endDate.toLocaleTimeString();
  trip.tripTypeName = d.tripTypes[trip.notificationTypeId].name;

  const now = new Date();
  const defaultSignupDate = new Date(trip.startDatetime);
  defaultSignupDate.setHours(defaultSignupDate.getHours() - 12);
  trip.pastSignupPeriod = (trip.allowLateSignups && startDate < now)
    || (!trip.allowLateSignups && defaultSignupDate < now);

  res.render('trips/trip', {
    title: 'Trips',
    header: 'VIEW TRIP',
    name: await h.getFirstName(req),
    mystatus,
    trip,
  });
}));

router.get('/:tripId/admin/:print?', aH(async (req, res) => {
  let [admin, trip] = await Promise.all([
    h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}/admin`, req),
    h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}`, req),
  ]);

  if (admin.status !== 200 || (req.params.print && req.params.print !== 'print')) {
    res.redirect(`/trips/${req.params.tripId}`);
    return;
  }

  [admin, trip] = await Promise.all([
    admin.json(),
    trip.json(),
  ]);

  const signups = {
    attend: [], boot: [], cancel: [], force: [], leader: [], wait: [],
  };
  let carSeats = 0;

  admin.tripSignups.forEach((signup) => {
    const signupDate = new Date(signup.signupDatetime);
    // eslint-disable-next-line no-param-reassign
    signup.date = h.prettyDate(signup.signupDatetime);
    // eslint-disable-next-line no-param-reassign
    signup.time = signupDate.toLocaleTimeString();

    if (signup.attendingCode === 'ATTEND') {
      carSeats += 1;
      signups.attend.push(signup);
    } else if (signup.leader) {
      carSeats += 1;
      signups.leader.push(signup);
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

  const startDate = new Date(trip.startDatetime);
  const endDate = new Date(trip.endDatetime);
  trip.date = h.prettyDate(trip.startDatetime);
  trip.startTime = startDate.toLocaleTimeString();
  trip.endTime = endDate.toLocaleTimeString();
  trip.tripTypeName = d.tripTypes[trip.notificationTypeId].name;

  if (!req.params.print) {
    res.render('trips/admin', {
      title: 'Trip Admin',
      header: 'TRIP ADMIN',
      name: await h.getFirstName(req),
      API_URL: h.API_URL,
      carSeats,
      signups,
      trip,
    });
  } else {
    res.render('trips/admin_print', {
      carSeats,
      signups,
      trip,
    });
  }
}));

router.get('/:tripId/jointrip', aH(async (req, res) => {
  const trip = await h.fetchHelper(`${h.API_URL}/noauth/trips/${req.params.tripId}`, req).then((t) => t.json());

  const startDate = new Date(trip.startDatetime);
  const endDate = new Date(trip.endDatetime);
  trip.date = h.prettyDate(trip.startDatetime);
  trip.startTime = startDate.toLocaleTimeString();
  trip.endTime = endDate.toLocaleTimeString();
  trip.tripTypeName = d.tripTypes[trip.notificationTypeId].name;

  res.render('trips/jointrip', {
    title: 'Join A Trip',
    header: 'JOIN A TRIP',
    name: await h.getFirstName(req),
    API_URL: h.API_URL,
    trip,
  });
}));

router.get('/:tripId/mysignup', aH(async (req, res) => {
  let [myAccount, mysignup, mystatus, trip] = await Promise.all([
    h.fetchHelper(`${h.API_URL}/myaccount`, req),
    h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}/mysignup`, req),
    h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}/mystatus`, req),
    h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}`, req),
  ]);

  if (mysignup.status !== 200) {
    res.redirect(`/trips/${req.params.tripId}`);
    return;
  }

  [myAccount, mysignup, mystatus, trip] = await Promise.all([
    myAccount.json(),
    mysignup.json(),
    mystatus.json(),
    trip.json(),
  ]);

  mysignup.firstName = myAccount.firstName;
  mysignup.lastname = myAccount.lastName;
  mysignup.email = myAccount.email;
  mysignup.gender = myAccount.gender;
  if (myAccount.medicalCond) {
    mysignup.medicalCond = myAccount.medicalCond;
  }
  if (myAccount.medicalCondDesc) {
    mysignup.medicalCondDesc = myAccount.medicalCondDesc;
  }

  const signupDate = new Date(mysignup.signupDatetime);
  mysignup.date = h.prettyDate(mysignup.signupDatetime);
  mysignup.time = signupDate.toLocaleTimeString();

  const startDate = new Date(trip.startDatetime);
  const endDate = new Date(trip.endDatetime);
  trip.date = h.prettyDate(trip.startDatetime);
  trip.startTime = startDate.toLocaleTimeString();
  trip.endTime = endDate.toLocaleTimeString();
  trip.tripTypeName = d.tripTypes[trip.notificationTypeId].name;

  res.render('trips/mysignup', {
    title: 'Trip Attendance',
    header: 'TRIP ATTENDANCE',
    name: await h.getFirstName(req),
    API_URL: h.API_URL,
    signup: mysignup,
    mystatus,
    trip,
  });
}));

module.exports = router;
