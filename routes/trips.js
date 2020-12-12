const aH = require('express-async-handler');
const express = require('express');

const d = require('./data');
const h = require('./helpers');

const router = express.Router();

/* Trips - overview of trips */
router.get('/', aH(async (req, res) => {
  // eslint-disable-next-line prefer-const
  let [name, trips, recentTrips] = await Promise.all([
    h.getName(req),
    h.fetchHelper(`${h.API_URL}/noauth/trips`, req).then((t) => t.json()).then((tj) => tj.trips),
    h.fetchHelper(`${h.API_URL}/noauth/trips/archive`, req).then((r) => r.json()).then((rj) => rj.trips),
  ]);

  recentTrips = recentTrips.filter((rT) => !rT.cancel && !trips.some((t) => rT.id === t.id));

  // Pretty print date & type + add attendance info
  for (let i = 0; i < trips.length; i += 1) {
    trips[i].date = h.prettyDate(trips[i].startDatetime);
    trips[i].tripTypeName = d.tripTypes[trips[i].notificationTypeId].name;

    // eslint-disable-next-line no-await-in-loop
    const mystatus = await h.fetchHelper(`${h.API_URL}/trips/${trips[i].id}/mystatus`, req).then((s) => s.json());
    if (mystatus.tripLeader || name.json.officer) {
    // eslint-disable-next-line no-await-in-loop
      trips[i].attendanceInfo = await h.fetchHelper(`${h.API_URL}/trips/${trips[i].id}/admin/attendance`, req).then((a) => a.json()).then((aj) => aj.attendanceInfo);
    }
  }
  for (let i = 0; i < recentTrips.length; i += 1) {
    recentTrips[i].date = h.prettyDate(recentTrips[i].startDatetime);
    recentTrips[i].tripTypeName = d.tripTypes[recentTrips[i].notificationTypeId].name;

    // eslint-disable-next-line no-await-in-loop
    const mystatus = await h.fetchHelper(`${h.API_URL}/trips/${trips[i].id}/mystatus`, req).then((s) => s.json());
    if (mystatus.tripLeader || name.json.officer) {
    // eslint-disable-next-line no-await-in-loop
      trips[i].attendanceInfo = await h.fetchHelper(`${h.API_URL}/trips/${trips[i].id}/admin/attendance`, req).then((a) => a.json()).then((aj) => aj.attendanceInfo);
    }
  }

  res.render('trips/index', {
    title: 'Trips',
    header: 'OCVT TRIPS',
    name,
    recentTrips,
    trips,
  });
}));

/* Trips Archive - display old trips */
router.get('/archive/:startId?/:perPage?', aH(async (req, res) => {
  const name = await h.getName(req);
  let pastTrips;
  if (req.params.startId && req.params.perPage) {
    pastTrips = await h.fetchHelper(`${h.API_URL}/noauth/trips/archive/${req.params.startId}/${req.params.perPage}`, req).then((t) => t.json()).then((tj) => tj.trips);
  } else {
    pastTrips = await h.fetchHelper(`${h.API_URL}/noauth/trips/archive`, req).then((t) => t.json()).then((tj) => tj.trips);
  }

  // Pretty print date & type
  for (let i = 0; i < pastTrips.length; i += 1) {
    pastTrips[i].date = h.prettyDate(pastTrips[i].startDatetime);
    pastTrips[i].tripTypeName = d.tripTypes[pastTrips[i].notificationTypeId].name;

    // eslint-disable-next-line no-await-in-loop
    const mystatus = await h.fetchHelper(`${h.API_URL}/trips/${pastTrips[i].id}/mystatus`, req).then((s) => s.json());
    if (mystatus.tripLeader || name.json.officer) {
    // eslint-disable-next-line no-await-in-loop
      pastTrips[i].attendanceInfo = await h.fetchHelper(`${h.API_URL}/trips/${pastTrips[i].id}/admin/attendance`, req).then((a) => a.json()).then((aj) => aj.attendanceInfo);
    }
  }

  res.render('trips/archive', {
    title: 'Trips',
    header: 'TRIPS ARCHIVE',
    name,
    pastTrips,
  });
}));

/* Myattendance - show trips member is on */
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

    // eslint-disable-next-line no-await-in-loop
    const mystatus = await h.fetchHelper(`${h.API_URL}/trips/${trip.id}/mystatus`, req).then((s) => s.json());
    if (mystatus.tripLeader) {
    // eslint-disable-next-line no-await-in-loop
      trip.attendanceInfo = await h.fetchHelper(`${h.API_URL}/trips/${trip.id}/admin/attendance`, req).then((a) => a.json()).then((aj) => aj.attendanceInfo);
    }

    if (trip.attendingCode === 'CANCEL') {
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
    name: await h.getName(req),
    API_URL: h.API_URL,
    trips,
    tripSignups: myattendance.tripSignups,
  });
}));

/* Mytrips - show trips created by member */
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

  for (let i = 0; i < mytrips.length; i += 1) {
    const trip = mytrips[i];
    const startDate = new Date(trip.startDatetime);
    const endDate = new Date(trip.endDatetime);
    trip.date = h.prettyDate(trip.startDatetime);
    trip.startTime = startDate.toLocaleTimeString();
    trip.endTime = endDate.toLocaleTimeString();
    trip.tripTypeName = d.tripTypes[trip.notificationTypeId].name;

    // eslint-disable-next-line no-await-in-loop
    trip.attendanceInfo = await h.fetchHelper(`${h.API_URL}/trips/${trip.id}/admin/attendance`, req).then((a) => a.json()).then((aj) => aj.attendanceInfo);

    if (trip.cancel) {
      trips.canceled.push(trip);
    } else if (!trip.publish) {
      trips.unpublished.push(trip);
    } else if (endDate < Date.now()) {
      trips.past.push(trip);
    } else {
      trips.upcoming.push(trip);
    }
  }

  res.render('trips/mytrips', {
    title: 'My Trips',
    header: 'TRIP ADMINISTRATION',
    name: await h.getName(req),
    API_URL: h.API_URL,
    trips,
  });
}));

/* Newtrip - create a new trip */
router.get('/newtrip', aH(async (req, res) => {
  const name = await h.getName(req);

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

/* Trip - view details for specific trip */
router.get('/:tripId', aH(async (req, res) => {
  let [mystatus, photos, trip] = await Promise.all([
    h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}/mystatus`, req),
    h.fetchHelper(`${h.API_URL}/noauth/trips/${req.params.tripId}/photos`, req),
    h.fetchHelper(`${h.API_URL}/trips/${req.params.tripId}`, req),
  ]);

  if (trip.status !== 200) {
    trip = await h.fetchHelper(`${h.API_URL}/noauth/trips/${req.params.tripId}`, req);
  }
  if (trip.status !== 200) {
    res.redirect('/trips');
    return;
  }

  [mystatus, photos, trip] = await Promise.all([
    mystatus.json(),
    photos.json(),
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
    name: await h.getName(req),
    API_URL: h.API_URL,
    mainphoto: photos.mainphoto,
    mystatus,
    trip,
  });
}));

/* Trip admin print - view roster in a printable format */
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

  for (let i = 0; i < admin.tripSignups.length; i += 1) {
    const signup = admin.tripSignups[i];
    const signupDate = new Date(signup.signupDatetime);
    signup.date = h.prettyDate(signup.signupDatetime);
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
  }

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
      name: await h.getName(req),
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

/* Trip, jointrip - join a trip */
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
    name: await h.getName(req),
    API_URL: h.API_URL,
    trip,
  });
}));

/* Trip, mysignup - view signup info for specific trip */
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

  mysignup.name = myAccount.name;
  mysignup.email = myAccount.email;
  mysignup.pronouns = myAccount.pronouns;
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
    name: await h.getName(req),
    API_URL: h.API_URL,
    signup: mysignup,
    mystatus,
    trip,
  });
}));

/* Trip, photos - view photos for trip */
router.get('/:tripId/photos', aH(async (req, res) => {
  let [photos, trip] = await Promise.all([
    h.fetchHelper(`${h.API_URL}/noauth/trips/${req.params.tripId}/photos`, req),
    h.fetchHelper(`${h.API_URL}/noauth/trips/${req.params.tripId}`, req),
  ]);

  if (trip.status !== 200) {
    res.redirect('/trips');
    return;
  }

  [photos, trip] = await Promise.all([
    photos.json(),
    trip.json(),
  ]);

  res.render('trips/photos', {
    title: 'Trip Photos',
    header: 'TRIP PHOTOS',
    name: await h.getName(req),
    API_URL: h.API_URL,
    photos,
    trip,
  });
}));

module.exports = router;
