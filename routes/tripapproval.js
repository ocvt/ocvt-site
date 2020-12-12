const aH = require('express-async-handler');
const express = require('express');
const fetch = require('node-fetch');

const h = require('./helpers');

const router = express.Router();

/* Trip Approval - attempt to allow/deny trip or display error message to approver */
router.get('/:guidCode/:action', aH(async (req, res) => {
  const approval = await fetch(`${h.API_URL}/tripapproval/${req.params.guidCode}/${req.params.action}`, {
    method: 'PATCH',
  });

  if (approval.status !== 200) {
    res.redirect('/');
    return;
  }

  res.render('tripapproval', {
    title: 'Trip Approval',
    header: 'TRIP APPROVAL',
    name: await h.getName(req),
    approval: await approval.json(),
  });
}));

module.exports = router;
