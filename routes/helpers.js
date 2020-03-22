const fetch = require('node-fetch');

const API_URL = process.env.API_URL;

async function fetchHelper(url, req) {
  const opts = {
    credentials: 'include',
    headers: {
      Cookie: req.headers.cookie
    }
  };
  return await fetch(url, opts);
}

async function getFirstName(req) {
  return await fetchHelper(API_URL + '/myaccount/name', req)
}

module.exports = {
  API_URL,
  fetchHelper,
  getFirstName
};
//module.exports.API_URL = API_URL;
//module.exports.fetchHelper = fetchHelper;
//module.exports.getFirstName = getFirstName;
