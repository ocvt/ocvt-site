import aH from 'express-async-handler';
import express from 'express';

import * as h from './helpers.js';

const router = express.Router();

/* Webtools - display overview of pages */
router.get('/', aH(async (req, res) => {
  const name = await h.getName(req);

  if (!name.json.officer) {
    res.redirect('/');
    return;
  }

  res.render('webtools/index', {
    title: 'Webtools',
    header: 'WEBTOOLS',
    name: await h.getName(req),
  });
}));

/* Approvers - view/manager trip approvers */
router.get('/approvers', aH(async (req, res) => {
  let approvers = await h.fetchHelper(`${h.API_URL}/webtools/approvers`, req);

  if (approvers.status !== 200) {
    res.redirect('/');
    return;
  }

  approvers = await approvers.json().then((a) => a.approvers);
  for (let i = 0; i < approvers.length; i += 1) {
    approvers[i].date = h.prettyDateISO8601ish(approvers[i].expireDatetime);
  }

  res.render('webtools/approvers', {
    name: await h.getName(req),
    API_URL: h.API_URL,
    approvers,
  });
}));

/* Email - send a new email */
router.get('/email', aH(async (req, res) => {
  const name = await h.getName(req);

  if (!name.json.officer) {
    res.redirect('/');
    return;
  }

  res.render('webtools/email', {
    API_URL: h.API_URL,
  });
}));

/* Email, view - view sent emails */
router.get('/email/view', aH(async (req, res) => {
  let emails = await h.fetchHelper(`${h.API_URL}/webtools/emails`, req);

  if (emails.status !== 200) {
    res.redirect('/');
    return;
  }

  emails = await emails.json().then((e) => e.emails);
  for (let i = 0; i < emails.length; i += 1) {
    emails[i].dateCreated = h.prettyDateISO8601ish(emails[i].createDatetime);
    if (emails[i].sentDatetime.Valid) {
      emails[i].dateSent = h.prettyDateISO8601ish(emails[i].sentDatetime.String);
    }
  }

  res.render('webtools/email_view', {
    emails,
  });
}));

/* Equipment - view/manage equipment */
router.get('/equipment', aH(async (req, res) => {
  let equipment = await h.fetchHelper(`${h.API_URL}/webtools/equipment`, req);

  if (equipment.status !== 200) {
    res.redirect('/');
    return;
  }

  equipment = await equipment.json().then((e) => e.equipment);
  for (let i = 0; i < equipment.length; i += 1) {
    equipment[i].date = h.prettyDateISO8601ish(equipment[i].createDatetime);
  }

  res.render('webtools/equipment', {
    API_URL: h.API_URL,
    equipment,
  });
}));

/* Members - view/manage members */
router.get('/members', aH(async (req, res) => {
  let members = await h.fetchHelper(`${h.API_URL}/webtools/members`, req);

  if (members.status !== 200) {
    res.redirect('/');
    return;
  }

  members = await members.json().then((m) => m.members);
  for (let i = 0; i < members.length; i += 1) {
    members[i].date = h.prettyDateISO8601ish(members[i].paidExpireDatetime);
  }

  res.render('webtools/members', {
    name: await h.getName(req),
    API_URL: h.API_URL,
    members,
  });
}));

/* News - create a news item */
router.get('/news', aH(async (req, res) => {
  const name = await h.getName(req);

  if (!name.json.officer) {
    res.redirect('/');
    return;
  }

  res.render('webtools/news', {
    API_URL: h.API_URL,
  });
}));

/* News, delete - unpublish a news item */
router.get('/news/delete', aH(async (req, res) => {
  const [name, news] = await Promise.all([
    h.getName(req),
    h.fetchHelper(`${h.API_URL}/news/archive`, req).then((n) => n.json()).then((nn) => nn.news),
  ]);

  if (!name.json.officer) {
    res.redirect('/');
    return;
  }

  for (let i = 0; i < news.length; i += 1) {
    news[i].date = h.prettyDateISO8601ish(news[i].createDatetime);
  }

  res.render('webtools/news_delete', {
    API_URL: h.API_URL,
    news,
  });
}));

/* Officers - view/manage officers */
router.get('/officers', aH(async (req, res) => {
  let officers = await h.fetchHelper(`${h.API_URL}/webtools/officers`, req);

  if (officers.status !== 200) {
    res.redirect('/');
    return;
  }

  officers = await officers.json().then((o) => o.officers);
  for (let i = 0; i < officers.length; i += 1) {
    officers[i].date = h.prettyDateISO8601ish(officers[i].expireDatetime);
  }

  res.render('webtools/officers', {
    name: await h.getName(req),
    API_URL: h.API_URL,
    oicers: officers,
  });
}));

/* Orders, codes - display all unredeemed codes */
router.get('/orders/codes', aH(async (req, res) => {
  let codes = await h.fetchHelper(`${h.API_URL}/webtools/codes`, req);

  if (codes.status !== 200) {
    res.redirect('/');
    return;
  }

  codes = await codes.json().then((c) => c.codes.filter((i) => !i.redeemed));
  for (let i = 0; i < codes.length; i += 1) {
    codes[i].amount /= 100;
    codes[i].date = h.prettyDateISO8601ish(codes[i].createDatetime);
  }

  res.render('webtools/orders_codes', {
    codes,
  });
}));

/* Orders, complete - display all complete orders */
router.get('/orders/complete', aH(async (req, res) => {
  let orders = await h.fetchHelper(`${h.API_URL}/webtools/payments`, req);

  if (orders.status !== 200) {
    res.redirect('/');
    return;
  }

  orders = await orders.json().then((o) => o.payments.filter((p) => p.completed));
  for (let i = 0; i < orders.length; i += 1) {
    orders[i].amount /= 100;
    orders[i].date = h.prettyDateISO8601ish(orders[i].createDatetime);
  }

  res.render('webtools/orders_complete', {
    header: 'All Complete Orders',
    orders,
  });
}));

/* Orders, incomplete - display all incomplete orders */
router.get('/orders/incomplete', aH(async (req, res) => {
  let orders = await h.fetchHelper(`${h.API_URL}/webtools/payments`, req);

  if (orders.status !== 200) {
    res.redirect('/');
    return;
  }

  orders = await orders.json().then((o) => o.payments.filter((p) => !p.completed));
  for (let i = 0; i < orders.length; i += 1) {
    orders[i].amount /= 100;
    orders[i].date = h.prettyDateISO8601ish(orders[i].createDatetime);
  }

  res.render('webtools/orders_incomplete', {
    API_URL: h.API_URL,
    header: 'All Incomplete Orders',
    orders,
  });
}));

/* Orders, manual - do a manual payment or generate a code to redeem */
router.get('/orders/manual', aH(async (req, res) => {
  let members = await h.fetchHelper(`${h.API_URL}/webtools/members`, req);

  if (members.status !== 200) {
    res.redirect('/');
    return;
  }

  members = await members.json().then((m) => m.members);
  for (let i = 0; i < members.length; i += 1) {
    members[i].date = h.prettyDateISO8601ish(members[i].paidExpireDatetime);
  }

  res.render('webtools/orders_manual', {
    API_URL: h.API_URL,
    members,
  });
}));

/* Quicksignup - bulk add/remove quicksignups */
router.get('/quicksignups', aH(async (req, res) => {
  let quicksignups = await h.fetchHelper(`${h.API_URL}/webtools/quicksignups`, req);

  if (quicksignups.status !== 200) {
    res.redirect('/');
    return;
  }

  quicksignups = await quicksignups.json().then((q) => q.quicksignups);
  for (let i = 0; i < quicksignups.length; i += 1) {
    quicksignups[i].dateAdd = h.prettyDateISO8601ish(quicksignups[i].createDatetime);
    quicksignups[i].dateExpire = h.prettyDateISO8601ish(quicksignups[i].expireDatetime);
  }

  res.render('webtools/quicksignups', {
    API_URL: h.API_URL,
    quicksignups,
  });
}));

/* eslint-disable import/prefer-default-export */
export { router };
