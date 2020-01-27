// Utility functions
function paramsStrToJson(params) {
  const paramsArray = params.split('&');
  const paramsJson = {};

  paramsArray.forEach(function(kvpair) {
    kvpair = kvpair.split('=');
    paramsJson[kvpair[0]] = decodeURIComponent(kvpair[1] || '');
  });

  return paramsJson;
}

// https://gist.github.com/sindresorhus/1583375
var XHRHelper = function() {
    var xhr = new XMLHttpRequest();
    return function(method, url, credentials, body, callback) {
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                callback(xhr.status, xhr.responseText);
            }
        };
        xhr.open(method, url);
        if (credentials) {
          xhr.withCredentials = true;
          xhr.setRequestHeader('Authorization', 'Bearer ' + credentials);
        }
        xhr.overrideMimeType('application/json');
        xhr.send();
    };
}();

// Redirect to some path
function redirect(path, errorMessage) {
  if (errorMessage) {
    window.location.replace(path + '?error=' + errorMessage);
  } else {
    window.location.replace(path);
  }
}

// Handle unexpected exceptions
function exceptionRedirect(e) {
  redirect('/error', 'Unexpected exception ' + e.name + ': ' + e.message);
}

// Make OCVT Api requests
function OCVTApiRequest(method, path, jwt, body, callback) {
  const url = 'http://localhost:44000' + path;

  XHRHelper(method, url, jwt, body, function(status, data) {
    // Api down
    if (status === 0) {
      redirect('/error', 'API: "' + url + '" is not responding.');
      return;
    }
    // Invalid credentials
    if (status === 401) {
      redirect('/login', 'Session expired. Please log in again.');
      return;
    }

    // Check for errors
    try {
      const response = JSON.parse(data);
      if (status !== 200) {
        redirect('/error', 'Unexpected status: ' + status + ', ' + JSON.stringify(response));
        return;
      }

      callback(response);
    } catch (e) {
      exceptionRedirect(e);
    }
  });
}

///////////////////////////////////////////////////////////

function loginVT() {
  alert('loginVT has been called!!');
}

function loginGoogle() {
  // Create form containing OAuth2 request
  const form = document.createElement('form');
  form.setAttribute('method', 'GET');
  form.setAttribute('action', 'https://accounts.google.com/o/oauth2/v2/auth');

  // TODO maintain current page/state
  const requestParams = {
    'client_id': '106881746579-72pfhdes3gkl4k3bmj9gqfjthuhfm8hj.apps.googleusercontent.com',
    'redirect_uri': 'http://localhost:1313/login',
    'response_type': 'token',
    'scope': 'openid profile',
    'state': '{ "idp": "GOOGLE" }'
  };

  // Create hidden form
  for (let x in requestParams) {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', x);
    input.setAttribute('value', requestParams[x]);
    form.appendChild(input);
  }

  // Add hidden form to page and submit
  document.body.appendChild(form);
  form.submit();
}

function checkLogin() {
  // not logged in
  const chooseLoginStr = ''
    + '<h3>Please Choose A Logon Method:</h3>'
    + ''
    + '<table width="500" height="200">'
    + '  <tr>'
    + '    <td align="center">'
    + '      <button onclick="loginVT()">Login with VT PID</button>'
    + '    </td>'
    + '  </tr>'
    + '  <tr>'
    + '    <td align="center">Use Your Virginia Tech PID and password to log onto the site (recommended).</td>'
    + '  </tr>'
    + ''
    + '  <tr><td><hr></td></tr>'
    + ''
    + '  <tr>'
    + '    <td align="center">'
    + '      <button onclick="loginGoogle()">Login with Google</button>'
    + '    </td>'
    + '  </tr>'
    + '</table>';

  /////////////////////////////////////////////////////////

  // Check for hash style and query params
  let paramsStr = window.location.hash.substr(1) + '&' + window.location.search.substr(1);

  if (paramsStr) {
    // Parse callback query params into json
    const params = paramsStrToJson(paramsStr);

    // Process error if present
    if (params.hasOwnProperty('error')) {
      sessionStorage.clear();
      document.getElementById('login').innerHTML = '<h3>Error accessing user data: "' + params['error'] + '"</h3><hr>' + chooseLoginStr;
      return
    // Process callback if present
    } else if (params.hasOwnProperty('state')) {
      // Get idp
      params['state'] = JSON.parse(params['state']);

      // Store session data
      const sessionData = {
        'access_token': params['access_token'],
        'idp': params['state']['idp']
      };
      sessionStorage.setItem('ocvt_jwt', btoa(JSON.stringify(sessionData)));
    }
  }

  /////////////////////////////////////////////////////////

  const ocvtJwt = sessionStorage.getItem('ocvt_jwt');
  if (ocvtJwt) {
    OCVTApiRequest('GET', '/myaccount/summary', ocvtJwt, {}, function(accountSummary) {
      // New user
      if (accountSummary['status'] === 'unregistered') {
        // Show form TODO
//        OCVTApiRequest('POST', '/myaccount/register', ocvtJwt, registerData, function(newAccountSummary) {
//          // Verify registration is successful
//          if (newAccountSummary['status'] !== 'unregistered') {
//            document.getElementById('login').innerHTML = '<h3>You have successfully registered as ' + newAccountSummary['firstname'] + ' ' + newAccountSummary['lastname'] + '</h3>';
//          } else {
//            redirect('/error', 'Unexpected error attempting to register: ' + JSON.stringify(newAccountSummary));
//          }
//        }
      } else {
        // Existing user
        document.getElementById('login').innerHTML = '<h3>You are logged in as ' + accountSummary['firstname'] + ' ' + accountSummary['lastname'] + '</h3>';
      }
    });
  // No session data present
  } else {
    document.getElementById('login').innerHTML = chooseLoginStr;
  }
}
