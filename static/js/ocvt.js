function myocvtUpdateMyAccount(url, method, redirect, id, message, form) {
  const memberData = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    email: form.email.value,
    birthyear: parseInt(form.birthyear.value),
    gender: form.gender.value,
    cellNumber: form.cellNumber.value,
    medicalCond: form.medicalCond.value === 'true',
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
