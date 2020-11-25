const fetch = require('node-fetch');

const { API_URL } = process.env;

const d = require('./data');

async function fetchHelper(url, req) {
  const opts = {
    credentials: 'include',
    headers: {
      Cookie: req.headers.cookie,
    },
  };
  return fetch(url, opts);
}

async function getFirstName(req) {
  const name = await fetchHelper(`${API_URL}/myaccount/name`, req);

  return { status: name.status, json: await name.json() };
}

function prettyDate(dateString) {
  const date = new Date(dateString);
  return `${d.dayString[date.getDay()]}, 
${d.monthShortString[date.getMonth()]} ${date.getDate()}, 
${date.getFullYear()}`;
}

function prettyDateISO8601ish(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 
${date.toLocaleTimeString()}`;
}

module.exports = {
  API_URL,
  fetchHelper,
  getFirstName,
  prettyDate,
  prettyDateISO8601ish,
};
// module.exports.API_URL = API_URL;
// module.exports.fetchHelper = fetchHelper;
// module.exports.getFirstName = getFirstName;
