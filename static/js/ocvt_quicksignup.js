"use strict";

function quickSignup(form) {
  var emailData = {
    email: form.email.value
  };
  fetch("".concat(API_URL, "/quicksignup"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(emailData)
  }).then(function (r) {
    window.location.reload(true);
  });
}
