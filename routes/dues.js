const aH = require('express-async-handler');
const express = require('express');

const h = require('./helpers');

const router = express.Router();

/* Dues Routes */
router.get('/', aH(async (req, res) => {
  let myaccount = await h.fetchHelper(`${h.API_URL}/myaccount`, req);

  if (myaccount.status !== 200) {
    res.redirect(302, '/myocvt');
    return;
  }
  const { STRIPE_PUBLIC_KEY } = process.env;

  myaccount = await myaccount.json();
  myaccount.paid = (new Date()).getTime() < (new Date(myaccount.paidExpireDatetime)).getTime();
  myaccount.paidExpirePretty = h.prettyDate(myaccount.paidExpireDatetime);

  res.render('dues/index', {
    title: 'Dues',
    header: 'PAY DUES',
    name: await h.getFirstName(req),
    API_URL: h.API_URL,
    myaccount,
    STRIPE_PUBLIC_KEY,
  });
}));

router.get('/cancel', aH(async (req, res) => {
  res.render('dues/cancel', {
    title: 'Dues - Canceled',
    header: 'PAY DUES',
    name: await h.getFirstName(req),
  });
}));

router.get('/payment', aH(async (req, res) => {
  const { STRIPE_PUBLIC_KEY } = process.env;
  const { paymentId } = req.query;
  res.render('dues/payment', {
    title: 'Dues',
    header: 'PAY DUES',
    name: await h.getFirstName(req),
    paymentId,
    STRIPE_PUBLIC_KEY,
  });
}));

router.get('/success', aH(async (req, res) => {
  let myaccount = await h.fetchHelper(`${h.API_URL}/myaccount`, req);

  if (myaccount.status !== 200) {
    res.redirect(302, '/myocvt');
    return;
  }

  myaccount = await myaccount.json();
  myaccount.paidExpirePretty = h.prettyDate(myaccount.paidExpireDatetime);

  res.render('dues/success', {
    title: 'Dues - Success',
    header: 'PAY DUES',
    name: await h.getFirstName(req),
    myaccount,
  });
}));

module.exports = router;
