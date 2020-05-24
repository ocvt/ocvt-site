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
