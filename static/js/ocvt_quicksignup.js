function quickSignup(form) {
  const emailData = {
    email: form.email.value
  }
  
  fetch(`${API_URL}/quicksignup`, {
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
