const fetch = require('node-fetch');

const { API_URL } = process.env;

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

module.exports = {
  API_URL,
  fetchHelper,
  getFirstName,
};
// module.exports.API_URL = API_URL;
// module.exports.fetchHelper = fetchHelper;
// module.exports.getFirstName = getFirstName;
