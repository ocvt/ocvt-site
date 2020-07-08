/* Front-end */
function webtoolsOrderToggle(showId) {
  const hideId = { manualOrder: 'generateCode', generateCode: 'manualOrder' };
  document.getElementById(hideId[showId]).style.display = 'none';
  document.getElementById(showId).style.display = 'block';
}

function sortMembers() {
  const filter = document.getElementById('memberFilter').value.toLowerCase();
  const rows = document.getElementsByTagName('tr');
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    if (filter !== '' && rows[i].textContent.toLowerCase().indexOf(filter) <= 0) {
      rows[i].style.display = 'none';
    } else {
      rows[i].style.display = '';
    }
  }
}

/* Officers */
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

/* Payments */
function webtoolsAddYear(url, memberId) {
  fetch(`${url}/webtools/members/${memberId}/dues/grant`, {
    credentials: 'include',
    method: 'POST',
  })
  .then((r) => {
    window.location.reload(true);
  });
}

function generateCode(url, codeData) {
  return fetch(`${url}/webtools/payments/generateCode`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(codeData)
  })
  .then((r) => r.json())
  .then((c) => c.code);
}

function showCode(code) {
  document.getElementById('generateCodeResult').textContent = code;
}

function webtoolsGenerateCode(url, form) {
  const itemId = form.storeItemId.value;
  const amounts = {
    dues: 20,
    duesShirt: 30,
    duesSpecial: 65,
    shirt: 20,
  };

  const codeData = {
    storeItemCount: parseInt(form.storeItemCount.value),
    completed: form.completed.checked,
    note: form.note.value,
    amount: amounts[itemId],
    code: '',
  };

  if (itemId === 'dues') {
    codeData.storeItemId = 'MEMBERSHIP';
    generateCode(url, codeData)
    .then((code) => {
      codeData.code = code;
      showCode(codeData.code);
    });
  } else if (itemId === 'duesShirt') {
    codeData.storeItemId = 'SHIRT';
    generateCode(url, codeData)
    .then((code) => {
      codeData.code = code;
      codeData.storeItemId = 'MEMBERSHIP';
      return generateCode(url, codeData);
    })
    // We already know code, this verified both requests went through
    .then((code) => showCode(code));
  } else if (itemId === 'duesSpecial') {
    codeData.storeItemId = 'SHIRT';
    generateCode(url, codeData)
    .then((code) => {
      codeData.code = code;
      codeData.storeItemId = 'MEMBERSHIP';
      codeData.storeItemCount *= 4;
      return generateCode(url, codeData);
    })
    // We already know code, this verified both requests went through
    .then((code) => showCode(code));
  } else if (itemId === 'shirt') {
    codeData.storeItemId = 'SHIRT';
    generateCode(url, codeData)
    .then((code) => {
      codeData.code = code;
      showCode(codeData.code);
    });
  }
}
