function webtoolsAddOfficer(url, form) {
  const officerData = {
    memberId: parseInt(form.memberId.value),
    expireDatetime: form.expireDatetime.value,
    position: form.position.value,
    security: parseInt(form.security.value),
  };

  fetch(`${url}/webtools/officers`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(officerData)
  })
  .then((r) => {
    window.location.reload(true);
  });
}

function webtoolsDeleteOfficer(url, memberId) {
  if (!confirm('Are you sure you want to remove this officer?!?')) {
    return;
  }

  fetch(`${url}/webtools/officers/${memberId}`, {
    credentials: 'include',
    method: 'DELETE',
  })
  .then((r) => {
    window.location.reload(true);
  });
}
