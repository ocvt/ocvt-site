"use strict";

/* Front-end */
function webtoolsOrderToggle(showId) {
  var hideId = {
    manualOrder: "generateCode",
    generateCode: "manualOrder"
  };
  document.getElementById(hideId[showId]).style.display = "none";
  document.getElementById(showId).style.display = "block";
}
function sortMembers() {
  var filter = document.getElementById("memberFilter").value.toLowerCase();
  var rows = document.getElementById("filterMembers").getElementsByTagName("tr"); // Skip header row

  for (var i = 1; i < rows.length; i++) {
    if (filter !== "" && rows[i].textContent.toLowerCase().indexOf(filter) <= 0) {
      rows[i].style.display = "none";
    } else {
      rows[i].style.display = "";
    }
  }
}
function webtoolsOrderSelectMember(memberId) {
  document.getElementById("manualOrderMemberId").value = memberId;
}
/* Trip Approvers */

function webtoolsAddApprover(form) {
  var approverData = {
    memberId: parseInt(form.memberId.value),
    expireDatetime: form.expireDatetime.value
  };
  fetch("".concat(API_URL, "/webtools/approvers"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(approverData)
  }).then(function (r) {
    window.location.reload(true);
  });
}
function webtoolsDeleteApprover(memberId) {
  if (!confirm("Are you sure you want to remove this trip approver?!?")) {
    return;
  }
  fetch("".concat(API_URL, "/webtools/approvers/").concat(memberId), {
    credentials: "include",
    method: "DELETE"
  }).then(function (r) {
    window.location.reload(true);
  });
}
/* Officers */

function webtoolsAddOfficer(form) {
  var officerData = {
    memberId: parseInt(form.memberId.value),
    expireDatetime: form.expireDatetime.value,
    position: form.position.value,
    security: parseInt(form.security.value)
  };
  fetch("".concat(API_URL, "/webtools/officers"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(officerData)
  }).then(function (r) {
    window.location.reload(true);
  });
}
function webtoolsDeleteOfficer(memberId) {
  if (!confirm("Are you sure you want to remove this officer?!?")) {
    return;
  }
  fetch("".concat(API_URL, "/webtools/officers/").concat(memberId), {
    credentials: "include",
    method: "DELETE"
  }).then(function (r) {
    window.location.reload(true);
  });
}
/* Payments */

function webtoolsAddYear(memberId) {
  fetch("".concat(API_URL, "/webtools/members/").concat(memberId, "/dues/grant"), {
    credentials: "include",
    method: "POST"
  }).then(function (r) {
    window.location.reload(true);
  });
}
function webtoolsCompleteOrder(paymentRowId) {
  fetch("".concat(API_URL, "/webtools/payments/").concat(paymentRowId, "/completed"), {
    credentials: "include",
    method: "PATCH"
  }).then(function (r) {
    window.location.reload(true);
  });
} // Code Generation

function generateCode(codeData) {
  return fetch("".concat(API_URL, "/webtools/payments/generateCode"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(codeData)
  }).then(function (r) {
    return r.json();
  }).then(function (c) {
    return c.code;
  });
}
function showCode(code) {
  document.getElementById("generateCodeResult").textContent = code;
}
function webtoolsGenerateCode(form) {
  var itemId = form.storeItemId.value;
  var amounts = {
    dues: 20,
    duesShirt: 30,
    duesSpecial: 65,
    shirt: 20
  };
  var codeData = {
    storeItemCount: parseInt(form.storeItemCount.value),
    completed: form.completed.checked,
    note: form.note.value,
    amount: amounts[itemId],
    code: ""
  };
  if (itemId === "dues") {
    codeData.storeItemId = "MEMBERSHIP";
    generateCode(codeData).then(function (code) {
      codeData.code = code;
      showCode(codeData.code);
    });
  } else if (itemId === "duesShirt") {
    codeData.storeItemId = "SHIRT";
    generateCode(codeData).then(function (code) {
      codeData.code = code;
      codeData.storeItemId = "MEMBERSHIP";
      return generateCode(codeData);
    }) // We already know code, this verified both requests went through
    .then(function (code) {
      return showCode(code);
    });
  } else if (itemId === "duesSpecial") {
    codeData.storeItemId = "SHIRT";
    generateCode(codeData).then(function (code) {
      codeData.code = code;
      codeData.storeItemId = "MEMBERSHIP";
      codeData.storeItemCount *= 4;
      return generateCode(codeData);
    }) // We already know code, this verified both requests went through
    .then(function (code) {
      return showCode(code);
    });
  } else if (itemId === "shirt") {
    codeData.storeItemId = "SHIRT";
    generateCode(codeData).then(function (code) {
      codeData.code = code;
      showCode(codeData.code);
    });
  }
} // Order Submission

function submitOrder(orderData) {
  return fetch("".concat(API_URL, "/webtools/payments"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  }).then(function (r) {
    return r.json();
  }).then(function (p) {
    return p.paymentId;
  });
}
function webtoolsSubmitOrder(form) {
  var itemId = form.storeItemId.value;
  var amounts = {
    dues: 20,
    duesShirt: 30,
    duesSpecial: 65,
    shirt: 20
  };
  var orderData = {
    memberId: parseInt(form.memberId.value),
    storeItemCount: parseInt(form.storeItemCount.value),
    completed: form.completed.checked,
    note: form.note.value,
    amount: amounts[itemId],
    paymentId: ""
  };
  if (itemId === "dues") {
    orderData.storeItemId = "MEMBERSHIP";
    submitOrder(orderData).then(function (paymentId) {
      orderData.paymentId = paymentId;
      alert("Success! Check the My Account page to view your membership details.");
      window.location.reload(false);
    });
  } else if (itemId === "duesShirt") {
    orderData.storeItemId = "SHIRT";
    submitOrder(orderData).then(function (paymentId) {
      orderData.paymentId = paymentId;
      orderData.storeItemId = "MEMBERSHIP";
      return submitOrder(orderData);
    }) // We already know payment id, this verified both requests went through
    .then(function (paymentId) {
      orderData.paymentId = paymentId;
      alert("Success! Check the My Account page to view your membership details.");
      window.location.reload(false);
    });
  } else if (itemId === "duesSpecial") {
    orderData.storeItemId = "SHIRT";
    submitOrder(orderData).then(function (paymentId) {
      orderData.paymentId = paymentId;
      orderData.storeItemId = "MEMBERSHIP";
      orderData.storeItemCount *= 4;
      return submitOrder(orderData);
    }) // We already know payment id, this verified both requests went through
    .then(function (paymentId) {
      orderData.paymentId = paymentId;
      alert("Success! Check the My Account page to view your membership details.");
      window.location.reload(false);
    });
  } else if (itemId === "shirt") {
    orderData.storeItemId = "SHIRT";
    submitOrder(orderData).then(function (paymentId) {
      orderData.paymentId = paymentId;
      alert("Success!");
      window.location.reload(false);
    });
  }
}
/* News / Announcements */

function webtoolsDeleteNews(newsId) {
  fetch("".concat(API_URL, "/webtools/news/").concat(newsId), {
    credentials: "include",
    method: "DELETE"
  }).then(function (r) {
    window.location.reload(true);
  });
}
function webtoolsSubmitEmail(form) {
  var emailData = {
    subject: form.subject.value,
    body: tinymce.activeEditor.getContent()
  };
  fetch("".concat(API_URL, "/webtools/emails"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(emailData)
  }).then(function (r) {
    window.location.href = "/";
  });
}
function webtoolsSubmitNews(form) {
  var newsData = {
    title: form.title.value,
    summary: form.summary.value,
    content: tinymce.activeEditor.getContent()
  };
  fetch("".concat(API_URL, "/webtools/news"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newsData)
  }).then(function (r) {
    window.location.href = "/";
  });
}
/* Equipment */

function webtoolsAddItem(form) {
  var itemData = {
    count: parseInt(form.itemCount.value),
    description: form.itemDesc.value
  };
  fetch("".concat(API_URL, "/webtools/equipment"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(itemData)
  }).then(function (r) {
    window.location.reload(true);
  });
}
function webtoolsUpdateItem(form, id) {
  var count = parseInt(form.itemCount.value);
  fetch("".concat(API_URL, "/webtools/equipment/").concat(id, "/").concat(count), {
    credentials: "include",
    method: "PATCH"
  }).then(function (r) {
    window.location.reload(true);
  });
}
/* Quicksignups */

function webtoolsQuicksignup(form) {
  var bulkEmailData = {
    emails: form.emails.value.split("\n")
  };
  fetch("".concat(API_URL, "/webtools/quicksignups/").concat(form.action.value), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bulkEmailData)
  }).then(function (r) {
    window.location.reload(true);
  });
}
