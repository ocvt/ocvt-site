function quickSignup(url, form) {
  const emailData = {
    email: form.email.value
  }
  
  fetch(`${url}/quicksignup`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  })
  .then((r) => {
    window.location.reload(true);
  });
}
