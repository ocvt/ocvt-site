/* myocvt */
function myocvtUpdateMyAccount(url, method, redirect, id, message, form) {
  const memberData = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    email: form.email.value,
    birthyear: parseInt(form.birthyear.value),
    gender: form.gender.value,
    cellNumber: form.cellNumber.value,
    medicalCond: form.medicalCond.checked,
    medicalCondDesc: form.medicalCondDesc.value
  };

  fetch(url + '/myaccount', {
    credentials: 'include',
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(memberData)
  })
  .then((r) => {
    if (r.status >= 200 && r.status < 300) {
      if (redirect) {
        window.location.href = '/';
      } else {
        document.getElementById(id).textContent = message;
      }
    }
  });
}

function myocvtUpdateEmergency(url, form) {
  const emergencyData = {
    emergencyContactName: form.name.value,
    emergencyContactNumber: form.cellNumber.value,
    emergencyContactRelationship: form.relationship.value
  };

  fetch(url + '/myaccount/emergency', {
    credentials: 'include',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emergencyData)
  })
  .then((r) => {
    if (r.status === 204) {
      document.getElementById('updateEmergencyInfo').textContent = 'Success!';
    }
  });
}

function myocvtUpdateNotifications(url, notifications, form) {
  notificationData = JSON.parse(notifications);

  for (let key in notificationData) {
    notificationData[key] = form[key].checked;
  }

  fetch(url + '/myaccount/notifications', {
    credentials: 'include',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(notificationData)
  })
  .then((r) => {
    if (r.status === 204) {
      document.getElementById('updateNotificationsInfo').textContent = 'Success!';
    }
  });
}

function myocvtDeactivateAccount(url, form) {
  if (!form.deactivateAccount.checked) {
    window.location.href = '/';
    return
  }

  fetch(url + '/myaccount/deactivate', {
    credentials: 'include',
    method: 'PATCH'
  })
  .then((r) => {
    window.location.href = '/';
    return;
  });
}

function myocvtDeleteAccount(url, form) {
  if (!form.deleteAccount.checked || !confirm('Are you sure you want to delete your account? This CANNOT be undone!')) {
    window.location.href = '/';
    return
  }

  fetch(url + '/myaccount', {
    credentials: 'include',
    method: 'DELETE'
  })
  .then((r) => {
    window.location.href = '/logout';
    return;
  });
}

function myocvtReactivateAccount(url) {
  fetch(url + '/myaccount/reactivate', {
    credentials: 'include',
    method: 'PATCH'
  })
  .then((r) => {
    window.location.href = '/';
    return;
  });
}

/* trips */
function tripsNewTrip(url, form) {
  const startDate = form.startDate.value;
  const startTime = form.startTime.value;
  const endTime = form.endTime.value;

  const startDatetime = new Date(`${form.startDate.value}T${form.startTime.value}:00`);
  let endDatetime = new Date(`${form.startDate.value}T${form.endTime.value}:00`);
  if (endDatetime.getTime() > startDatetime.getTime()) {
    endDatetime.setDate(endDatetime.getDate() + 1);
  }
  const trip = {
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
  const tripSignup = {
    shortNotice: true,
    driver: form.driver.checked,
    carpool: form.canCarpool.checked,
    carCapacity: parseInt(form.carCapacity.value),
    notes: form.notes.value,
    pet: form.pet.checked
  };
  console.log(JSON.stringify(trip));
  console.log(JSON.stringify(tripSignup));

  fetch(url + '/trips', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(trip)
  })
  .then(r => {
    if (r.status !== 201) {
      console.error(`Invalid status code on trip create: ${r.status}`);
      return;
    }
    return r.json();
  })
  .then(d => {
    fetch(url + `/trips/${d.tripId}/signup`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tripSignup)
    })
    .then(r => {
      if (r.status !== 204) {
        console.error(`Invalid status code on trip signup: ${r.status}`);
        return;
      }
      window.location.href = `/trips/${d.tripId}`;
    })
  });
}

function tripsJoinTrip(url, tripId, form) {
  const tripSignup = {
    shortNotice: form.shortNotice.checked,
    driver: form.driver.checked,
    carpool: form.canCarpool.checked,
    carCapacity: parseInt(form.carCapacity.value),
    notes: form.notes.value,
    pet: (form.pet && form.pet.checked) || false
  };

  fetch(url + `/trips/${tripId}/signup`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tripSignup)
  })
  .then(r => {
    if (r.status !== 204) {
        console.error(`Invalid status code on trip signup: ${r.status}`);
        return;
    }
    window.location.reload(true);
  });
}

function tripsCancelSignup(url, tripId) {
  if (!confirm('Are you sure you want to cancel your attendance? This cannot be undone!')) {
    window.location.href = '/trips';
    return
  }

  fetch(url + `/trips/${tripId}/mysignup/cancel`, {
    credentials: 'include',
    method: 'PATCH'
  })
  .then((r) => {
    window.location.href = '/trips';
    return;
  });
}

function tripsCancelTrip(url, tripId) {
  if (!confirm('Are you sure you want to cancel this trip? This cannot be undone!')) {
    window.location.href = `/trips/${tripId}/admin`;
    return
  }

  fetch(url + `/trips/${tripId}/admin/cancel`, {
    credentials: 'include',
    method: 'PATCH'
  })
  .then((r) => {
    window.location.href = `/trips/${tripId}/admin`;
    return;
  });
}

function tripsPublishTrip(url, tripId) {
  fetch(url + `/trips/${tripId}/admin/publish`, {
    credentials: 'include',
    method: 'PATCH'
  })
  .then((r) => {
    window.location.href = `/trips/${tripId}/admin`;
    return;
  });
}

function tripsSendReminder(url, tripId) {
  if (!confirm('Are you sure you want to send a reminder to everyone on the trip?')) {
    return;
  }

  fetch(url + `/trips/${tripId}/admin/reminder`, {
    credentials: 'include',
    method: 'POST'
  });
}
