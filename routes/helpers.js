import fetch from 'node-fetch';

import * as d from './data.js';

const { API_URL, MIGRATE_ENABLED } = process.env;

// Server-side fetches go straight to the api container instead of round
// tripping through cloudflare; browsers still use API_URL
const INTERNAL_API_URL = process.env.INTERNAL_API_URL || API_URL;

async function fetchHelper(url, req) {
  const opts = {
    credentials: 'include',
    headers: {
      Cookie: req.headers.cookie,
    },
  };
  return fetch(url.replace(API_URL, INTERNAL_API_URL), opts);
}

/* Frequently used route. Gets account name and auth status */
async function getName(req) {
  const name = await fetchHelper(`${API_URL}/myaccount/name`, req);

  return { status: name.status, json: await name.json() };
}

/* Construct pretty date primarily used for trip dates */
function prettyDate(dateString) {
  const date = new Date(dateString);
  return `${d.dayString[date.getDay()]}, 
${d.monthShortString[date.getMonth()]} ${date.getDate()}, 
${date.getFullYear()}`;
}

/* Construct pretty date for display dates in webtools */
function prettyDateISO8601ish(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 
${date.toLocaleTimeString()}`;
}

export {
  API_URL,
  MIGRATE_ENABLED,
  fetchHelper,
  getName,
  prettyDate,
  prettyDateISO8601ish,
};
