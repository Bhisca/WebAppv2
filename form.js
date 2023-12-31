document.addEventListener('DOMContentLoaded', function() {
  
  const addNewEntryBtn = document.getElementById('add-new-entry-btn');
  const popupOverlay = document.getElementById('popup-overlay');
  const popupForm = document.getElementById('popup-form');
  const closeBtn = document.getElementById('close-btn');
  const form = document.getElementById('add-entry-form');

  addNewEntryBtn.addEventListener('click', function() {
    popupOverlay.style.display = 'block';
    popupForm.style.display = 'block';
  });

  closeBtn.addEventListener('click', function() {
    popupOverlay.style.display = 'none';
    popupForm.style.display = 'none';
  });

  form.addEventListener('submit', function(event) {
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
          popupOverlay.style.display = 'none';
          popupForm.style.display = 'none';
          window.location.href = 'home.html';
        } else {
          alert('Error adding entry');
        }
      })
      .catch(err => console.log(err));
  });
});
