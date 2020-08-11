/* Front-end */
function webtoolsOrderToggle(showId) {
  const hideId = { manualOrder: 'generateCode', generateCode: 'manualOrder' };
  document.getElementById(hideId[showId]).style.display = 'none';
  document.getElementById(showId).style.display = 'block';
}

function sortMembers() {
  const filter = document.getElementById('memberFilter').value.toLowerCase();
  const rows = document.getElementById('filterMembers').getElementsByTagName('tr');
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    if (filter !== '' && rows[i].textContent.toLowerCase().indexOf(filter) <= 0) {
      rows[i].style.display = 'none';
    } else {
      rows[i].style.display = '';
    }
  }
}

function webtoolsOrderSelectMember(memberId) {
  document.getElementById('manualOrderMemberId').value = memberId;
}

/* Trip Approvers */
function webtoolsAddApprover(form) {
  const approverData = {
    memberId: parseInt(form.memberId.value),
    expireDatetime: form.expireDatetime.value,
  };

  fetch(`${API_URL}/webtools/approvers`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(approverData)
  })
  .then((r) => {
    window.location.reload(true);
  });
}

function webtoolsDeleteApprover(memberId) {
  if (!confirm('Are you sure you want to remove this trip approver?!?')) {
    return;
  }

  fetch(`${API_URL}/webtools/approvers/${memberId}`, {
    credentials: 'include',
    method: 'DELETE',
  })
  .then((r) => {
    window.location.reload(true);
  });
}

/* Officers */
function webtoolsAddOfficer(form) {
  const officerData = {
    memberId: parseInt(form.memberId.value),
    expireDatetime: form.expireDatetime.value,
    position: form.position.value,
    security: parseInt(form.security.value),
  };

  fetch(`${API_URL}/webtools/officers`, {
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

function webtoolsDeleteOfficer(memberId) {
  if (!confirm('Are you sure you want to remove this officer?!?')) {
    return;
  }

  fetch(`${API_URL}/webtools/officers/${memberId}`, {
    credentials: 'include',
    method: 'DELETE',
  })
  .then((r) => {
    window.location.reload(true);
  });
}

/* Payments */
function webtoolsAddYear(memberId) {
  fetch(`${API_URL}/webtools/members/${memberId}/dues/grant`, {
    credentials: 'include',
    method: 'POST',
  })
  .then((r) => {
    window.location.reload(true);
  });
}

function webtoolsCompleteOrder(paymentRowId) {
  fetch(`${API_URL}/webtools/payments/${paymentRowId}/completed`, {
    credentials: 'include',
    method: 'PATCH',
  })
  .then((r) => {
    window.location.reload(true);
  });
}

// Code Generation
function generateCode(codeData) {
  return fetch(`${API_URL}/webtools/payments/generateCode`, {
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

function webtoolsGenerateCode(form) {
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
    generateCode(codeData)
    .then((code) => {
      codeData.code = code;
      showCode(codeData.code);
    });
  } else if (itemId === 'duesShirt') {
    codeData.storeItemId = 'SHIRT';
    generateCode(codeData)
    .then((code) => {
      codeData.code = code;
      codeData.storeItemId = 'MEMBERSHIP';
      return generateCode(codeData);
    })
    // We already know code, this verified both requests went through
    .then((code) => showCode(code));
  } else if (itemId === 'duesSpecial') {
    codeData.storeItemId = 'SHIRT';
    generateCode(codeData)
    .then((code) => {
      codeData.code = code;
      codeData.storeItemId = 'MEMBERSHIP';
      codeData.storeItemCount *= 4;
      return generateCode(codeData);
    })
    // We already know code, this verified both requests went through
    .then((code) => showCode(code));
  } else if (itemId === 'shirt') {
    codeData.storeItemId = 'SHIRT';
    generateCode(codeData)
    .then((code) => {
      codeData.code = code;
      showCode(codeData.code);
    });
  }
}

// Order Submission
function submitOrder(orderData) {
  return fetch(`${API_URL}/webtools/payments`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  })
  .then((r) => r.json())
  .then((p) => p.paymentId);
}

function webtoolsSubmitOrder(form) {
  const itemId = form.storeItemId.value;
  const amounts = {
    dues: 20,
    duesShirt: 30,
    duesSpecial: 65,
    shirt: 20,
  };

  const orderData = {
    memberId: parseInt(form.memberId.value),
    storeItemCount: parseInt(form.storeItemCount.value),
    completed: form.completed.checked,
    note: form.note.value,
    amount: amounts[itemId],
    paymentId: '',
  };

  if (itemId === 'dues') {
    orderData.storeItemId = 'MEMBERSHIP';
    submitOrder(orderData)
    .then((paymentId) => {
      orderData.paymentId = paymentId;
      window.location.reload(false);
    });
  } else if (itemId === 'duesShirt') {
    orderData.storeItemId = 'SHIRT';
    submitOrder(orderData)
    .then((paymentId) => {
      orderData.paymentId = paymentId;
      orderData.storeItemId = 'MEMBERSHIP';
      return submitOrder(orderData);
    })
    // We already know payment id, this verified both requests went through
    .then((paymentId) => {
      orderData.paymentId = paymentId;
      window.location.reload(false);
    });
  } else if (itemId === 'duesSpecial') {
    orderData.storeItemId = 'SHIRT';
    submitOrder(orderData)
    .then((paymentId) => {
      orderData.paymentId = paymentId;
      orderData.storeItemId = 'MEMBERSHIP';
      orderData.storeItemCount *= 4;
      return submitOrder(orderData);
    })
    // We already know payment id, this verified both requests went through
    .then((paymentId) => {
      orderData.paymentId = paymentId;
      window.location.reload(false);
    });
  } else if (itemId === 'shirt') {
    orderData.storeItemId = 'SHIRT';
    submitOrder(orderData)
    .then((paymentId) => {
      orderData.paymentId = paymentId;
      window.location.reload(false);
    });
  }
}

/* News / Announcements */
function webtoolsDeleteNews(newsId) {
  fetch(`${API_URL}/webtools/news/${newsId}`, {
    credentials: 'include',
    method: 'DELETE',
  })
  .then((r) => {
    window.location.reload(true);
  });
}

function webtoolsSubmitEmail(form) {
  const emailData = {
    subject: form.subject.value,
    body: tinymce.activeEditor.getContent(),
  }

  fetch(`${API_URL}/webtools/emails`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  })
  .then((r) => {
    window.location.href = '/';
  });
}

function webtoolsSubmitNews(form) {
  const newsData = {
    title: form.title.value,
    summary: form.summary.value,
    content: tinymce.activeEditor.getContent(),
  }

  fetch(`${API_URL}/webtools/news`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newsData)
  })
  .then((r) => {
    window.location.href = '/';
  });
}
