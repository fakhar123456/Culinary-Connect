const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');
const emailForm = document.querySelector('.emailForm');
const nameForm = document.querySelector('.nameForm');
const passwordForm = document.querySelector('.passwordForm');


tabButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    showTab(index);
  });
});

function showTab(index) {
  tabPanes.forEach(pane => {
    pane.classList.remove('active');
  });
  tabButtons.forEach(button => {
    button.classList.remove('active');
  });

  tabPanes[index].classList.add('active');
  tabButtons[index].classList.add('active');
}



emailForm.addEventListener('submit', (e) => {
  e.preventDefault();

    const currentEmail = document.querySelector(".currentEmail");
    const newEmail = document.querySelector(".newEmail");

    const data = {currentEmail : currentEmail.value, newEmail : newEmail.value};
    console.log(data)

  fetch('/update-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Email updated:', data);

    })
    .catch(error => {
      console.error('Error uploading donation:', error);
    });


});




nameForm.addEventListener('submit', (e) => {
  e.preventDefault();

    const currentName = document.querySelector(".currentName");
    const newName = document.querySelector(".newName");

    const data = {currentName : currentName.value, newName : newName.value};
    console.log(data)

  fetch('/update-name', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Name updated:', data);
    })
    .catch(error => {
      console.error('Error uploading name:', error);
    });


});





passwordForm.addEventListener('submit', (e) => {
  e.preventDefault();

    const currentPassword = document.querySelector(".currentPassword");
    const newPassword = document.querySelector(".newPassword");

    const data = {currentPassword : currentPassword.value, newPassword : newPassword.value};
    console.log(data)

  fetch('/update-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('password updated:', data);

    })
    .catch(error => {
      console.error('Error updating password:', error);
    });


});