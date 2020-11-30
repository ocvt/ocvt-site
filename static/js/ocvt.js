"use strict";
/* myocvt */

function myocvtMigrateMyAccount(form) {
  var memberData = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    email: form.email.value,
    birthyear: parseInt(form.birthyear.value)
  };
  fetch("".concat(API_URL, "/myaccount/migrate"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(memberData)
  }).then(function (r) {
    if (r.status >= 200 && r.status < 300) {
      window.location.href = "/";
    } else if (r.status == 400) {
      r.json().then(function (rj) {
        document.getElementById('myocvtMigrateMyAccount').textContent = "ERROR: " + rj.error;
      });
    } else {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-migrate-myaccount&text=").concat(rt);
      });
    }
  });
}

function myocvtUpdateMyAccount(method, redirect, id, message, form) {
  var memberData = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    email: form.email.value,
    birthyear: parseInt(form.birthyear.value),
    gender: form.gender.value,
    cellNumber: form.cellNumber.value,
    medicalCond: form.medicalCond.checked,
    medicalCondDesc: form.medicalCondDesc.value
  };

  if (form.hasOwnProperty('ECName') && form.hasOwnProperty('ECNumber') && form.hasOwnProperty('ECRelationship')) {
    memberData.ECName = form.ECName.value;
    memberData.ECNumber = form.ECNumber.value;
    memberData.ECRelationship = form.ECRelationship.value;
  }

  fetch("".concat(API_URL, "/myaccount"), {
    credentials: "include",
    method: method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(memberData)
  }).then(function (r) {
    if (r.status >= 200 && r.status < 300) {
      if (redirect) {
        window.location.href = "/";
      } else {
        document.getElementById(id).textContent = message;
      }
    } else {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-update-myaccount&text=").concat(rt);
      });
    }
  });
}

function myocvtUpdateNotifications(notifications, form) {
  var notificationData = JSON.parse(notifications);

  for (var key in notificationData) {
    notificationData[key] = form[key].checked;
  }

  fetch("".concat(API_URL, "/myaccount/notifications"), {
    credentials: "include",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(notificationData)
  }).then(function (r) {
    if (r.status !== 204) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-update-notifications&text=").concat(rt);
        return;
      });
    }

    document.getElementById("updateNotificationsInfo").textContent = "Success!";
  });
}

function myocvtDeactivateAccount(form) {
  if (!form.deactivateAccount.checked) {
    window.location.href = "/";
    return;
  }

  fetch("".concat(API_URL, "/myaccount/deactivate"), {
    credentials: "include",
    method: "PATCH"
  }).then(function (r) {
    if (r.status !== 204) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-deactivate-account&text=").concat(rt);
        return;
      });
    }

    window.location.href = "/";
  });
}

function myocvtDeleteAccount(form) {
  if (!form.deleteAccount.checked || !confirm("Are you sure you want to delete your account? This CANNOT be undone!")) {
    window.location.href = "/";
    return;
  }

  fetch("".concat(API_URL, "/myaccount"), {
    credentials: "include",
    method: "DELETE"
  }).then(function (r) {
    if (r.status !== 204) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-delete-account&text=").concat(rt);
        return;
      });
    }

    window.location.href = "/logout";
  });
}

function myocvtReactivateAccount() {
  fetch("".concat(API_URL, "/myaccount/reactivate"), {
    credentials: "include",
    method: "PATCH"
  }).then(function (r) {
    if (r.status !== 204) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-reactivate-account&text=").concat(rt);
        return;
      });
    }

    window.location.href = "/";
  });
}
/* trips */


function tripsNewTrip(form) {
  var startDate = form.startDate.value;
  var startTime = form.startTime.value;
  var endTime = form.endTime.value;
  var startDatetime = new Date("".concat(form.startDate.value, "T").concat(form.startTime.value, ":00"));
  var endDatetime = new Date("".concat(form.startDate.value, "T").concat(form.endTime.value, ":00"));

  if (endDatetime.getTime() > startDatetime.getTime()) {
    endDatetime.setDate(endDatetime.getDate() + 1);
  }

  var trip = {
    membersOnly: form.membersOnly.checked,
    allowLateSignups: form.allowLateSignups.checked,
    drivingRequired: form.drivingRequired.checked,
    hasCost: form.hasCost.checked,
    costDescription: form.costDescription.value,
    maxPeople: parseInt(form.maxPeople.value),
    name: form.name.value,
    notificationTypeId: form.notificationTypeId.value,
    startDatetime: startDatetime.toISOString(),
    endDatetime: endDatetime.toISOString(),
    summary: form.summary.value,
    description: form.description.value,
    location: form.location.value,
    locationDirections: form.locationDirections.value,
    meetupLocation: form.meetupLocation.value,
    distance: parseInt(form.distance.value),
    difficulty: parseInt(form.difficulty.value),
    difficultyDescription: form.difficultyDescription.value,
    instructions: form.instructions.value,
    petsAllowed: form.petsAllowed.checked,
    petsDescription: form.petsDescription.value
  };
  var tripSignup = {
    shortNotice: true,
    driver: form.driver.checked,
    carpool: form.canCarpool.checked,
    carCapacity: parseInt(form.carCapacity.value),
    notes: form.notes.value,
    pet: form.pet.checked
  };
  console.log(JSON.stringify(trip));
  console.log(JSON.stringify(tripSignup));
  fetch("".concat(API_URL, "/trips"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(trip)
  }).then(function (r) {
    if (r.status !== 201) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-trip-create-signup&text=").concat(rt);
        return;
      });
    }

    return r.json();
  }).then(function (d) {
    fetch("".concat(API_URL, "/trips/").concat(d.tripId, "/signup"), {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tripSignup)
    }).then(function (r) {
      if (r.status !== 204) {
        r.text().then(function (rt) {
          window.location.href = "/error?status=".concat(r.status, "&code=error-trip-create-signup-2&text=").concat(rt);
          return;
        });
      }

      window.location.href = "/trips/".concat(d.tripId);
    });
  });
}

function tripsJoinTrip(tripId, form) {
  var tripSignup = {
    shortNotice: form.shortNotice.checked,
    driver: form.driver.checked,
    carpool: form.canCarpool.checked,
    carCapacity: parseInt(form.carCapacity.value),
    notes: form.notes.value,
    pet: form.pet && form.pet.checked || false
  };
  fetch("".concat(API_URL, "/trips/").concat(tripId, "/signup"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(tripSignup)
  }).then(function (r) {
    if (r.status !== 204) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-trip-signup&text=").concat(rt);
        return;
      });
    }

    window.location.href = "/trips/".concat(tripId, "/mysignup");
  });
}

function tripsCancelSignup(tripId) {
  if (!confirm("Are you sure you want to cancel your attendance? This cannot be undone!")) {
    window.location.href = "/trips";
    return;
  }

  fetch("".concat(API_URL, "/trips/").concat(tripId, "/mysignup/cancel"), {
    credentials: "include",
    method: "PATCH"
  }).then(function (r) {
    if (r.status !== 204) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-signup-cancel&text=").concat(rt);
        return;
      });
    }

    window.location.href = "/trips";
  });
}

function tripsCancelTrip(tripId) {
  if (!confirm("Are you sure you want to cancel this trip? This cannot be undone!")) {
    window.location.href = "/trips/".concat(tripId, "/admin");
    return;
  }

  fetch("".concat(API_URL, "/trips/").concat(tripId, "/admin/cancel"), {
    credentials: "include",
    method: "PATCH"
  }).then(function (r) {
    if (r.status !== 204) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-trip-cancel&text=").concat(rt);
        return;
      });
    }

    window.location.href = "/trips/".concat(tripId, "/admin");
  });
}

function tripsPublishTrip(tripId) {
  fetch("".concat(API_URL, "/trips/").concat(tripId, "/admin/publish"), {
    credentials: "include",
    method: "PATCH"
  }).then(function (r) {
    if (r.status !== 204) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-trip-publish&text=").concat(rt);
        return;
      });
    }

    window.location.href = "/trips/".concat(tripId, "/admin");
  });
}

function tripsSendMessage(tripId, form) {
  if (!confirm("Please confirm you want to send a custom message.")) {
    return;
  }

  var emailData = {
    body: form.body.value,
    notificationTypeId: form.notificationTypeId.value,
    subject: form.subject.value
  };
  fetch("".concat(API_URL, "/trips/").concat(tripId, "/admin/notify"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(emailData)
  }).then(function (r) {
    if (r.status !== 204) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-send-message&text=").concat(rt);
        return;
      });
    }
  });
}

function tripsSendReminder(tripId) {
  if (!confirm("Are you sure you want to send a reminder to everyone on the trip?")) {
    return;
  }

  fetch("".concat(API_URL, "/trips/").concat(tripId, "/admin/reminder"), {
    credentials: "include",
    method: "POST"
  }).then(function (r) {
    if (r.status !== 204) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-send-reminder&text=").concat(rt);
        return;
      });
    }
  });
}

function tripSignupStatusBoot(tripId, memberId) {
  var bootReason = prompt("Please enter a boot reason");

  if (!bootReason) {
    return;
  }

  fetch("".concat(API_URL, "/trips/").concat(tripId, "/admin/signup/").concat(memberId, "/boot"), {
    credentials: "include",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      bootReason: bootReason
    })
  }).then(function (r) {
    if (r.status !== 204) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-signup-boot&text=").concat(rt);
        return;
      });
    }

    window.location.reload(true);
  });
}

function tripSignupStatusGeneric(tripId, memberId, action) {
  fetch("".concat(API_URL, "/trips/").concat(tripId, "/admin/signup/").concat(memberId, "/").concat(action), {
    credentials: "include",
    method: "PATCH"
  }).then(function (r) {
    if (r.status !== 204) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-signup-status-generic&text=").concat(rt);
        return;
      });
    }

    window.location.reload(true);
  });
}

function unsubscribe(form) {
  fetch("".concat(API_URL, "/unsubscribe/all"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: form.email.value
    })
  }).then(function (r) {
    if (r.status !== 204) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-update-myaccount&text=").concat(rt);
        return;
      });
    }

    document.getElementById("updateUnsubscribeInfo").textContent = "Success!";
  });
}
/* payments */


function ocvtDues(form) {
  // requires stripe js library
  var stripe = Stripe(STRIPE_PUBLIC_KEY);
  fetch("".concat(API_URL, "/payment/").concat(form.paymentOption.value), {
    credentials: "include"
  }).then(function (r) {
    if (r.status !== 200) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-dues-get&text=").concat(rt);
        return;
      });
    }

    r.json().then(function (rj) {
      return stripe.redirectToCheckout({
        sessionId: rj.sessionId
      });
    }).then(function (c) {
      if (c.error) {
        window.location.href = "/error?status=".concat(c.status, "&code=error-stripe-payment&text=").concat(c.error.message);
      }
    });
  });
}

function ocvtRedeemCode(form) {
  var code = form.code.value;
  fetch("".concat(API_URL, "/payment/redeem"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      code: code
    })
  }).then(function (r) {
    if (r.status === 403) {
      document.getElementById("redeemCodeInfo").textContent = "Sorry, this code does not exist or has already been redeemed. Contact the Webmaster if this is an error.";
      return;
    } else if (r.status !== 204) {
      r.text().then(function (rt) {
        window.location.href = "/error?status=".concat(r.status, "&code=error-redeem-code&text=").concat(rt);
        return;
      });
    }

    document.getElementById("redeemCodeInfo").textContent = "Success! Visit your account page to view when your membership expires.";
  });
}
