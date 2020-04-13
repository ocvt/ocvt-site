function myocvtRegister(form) {
  memberData = {
    email: form.email.value,
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    cellNumber: form.cellNumber.value,
    gender: form.gender.value,
    birthyear: parseInt(form.birthyear.value),
    medicalCond: form.medicalCond.value === "true",
    medicalCondDesc: form.medicalCondDesc.value
  };

  console.log(JSON.stringify(memberData));
  fetch('http://cabinet.seaturtle.pw:3000/myaccount', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(memberData)
  })
  .then((respose) => console.log('STATUS: ' + response.status));
  // TODO Add check for 400
}
