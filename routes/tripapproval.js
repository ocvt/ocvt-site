import aH from 'express-async-handler';
import express from 'express';
import fetch from 'node-fetch';

import * as h from './helpers.js';

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

/* eslint-disable import/prefer-default-export */
export { router };
