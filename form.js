document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#add-entry-form').addEventListener('submit', submitForm);
});

function submitForm(event) {
  event.preventDefault();

  const name = document.querySelector('#name').value;
  const platform = document.querySelector('#platform').value;
  const status = document.querySelector('#status').value;
  const date = document.querySelector('#date_added').value;
  const comment = document.querySelector('#comment').value;

  fetch('https://allowapps.onrender.com/insert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      platform,
      status,
      date_added: date,
      comment,
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Entry added successfully');
        window.location.href = 'home.html';
      } else {
        alert('Error adding entry');
      }
    })
    .catch(err => console.log(err));
}
