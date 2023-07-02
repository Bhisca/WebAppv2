document.addEventListener('DOMContentLoaded', function() {
  fetch('https://allowapps.onrender.com/getAll')
    .then(response => response.json())
    .then(data => {
      const { currentPage, totalPages } = data;
      loadHTMLTable(currentPage, totalPages, data.data);
      updatePaginationButtons(currentPage, totalPages);
    });
});

const addBtn = document.querySelector('#add-name-btn');


// Search table function
function search() { 
  const searchValue = document.querySelector('#search-input').value;
  currentPage = 1; 

  if (searchValue.trim() !== '') {
    fetch(`https://allowapps.onrender.com/search/${encodeURIComponent(searchValue)}?page=${currentPage}`)
      .then(response => response.json())
      .then(data => {
        loadHTMLTable(currentPage, searchValue);
        updatePaginationButtons(currentPage, data.totalPages);
      })
      .catch(err => console.log(err));
  } else {
    // If the search input is empty, load all data
    loadHTMLTable(currentPage);
  }
}

// Add event listeners for the search and reset buttons
document.querySelector("#search-btn").addEventListener("click", search);
document.querySelector("#reset-btn").addEventListener("click", () => {
  document.querySelector('#search-input').value = '';
  search();
});

document.querySelector('#search-input').addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    search();
  }
});



function removeTime(date = new Date()) {
return new Date(
  date.getFullYear(),
  date.getMonth(),
  date.getDate()
);
}

let currentPage = 1; 
let totalPages = 1; 

// Function to load table data for a specific page
function loadHTMLTable(page, searchValue = '') {
  const table = document.querySelector('table tbody');

  let url = `https://allowapps.onrender.com/getAll?page=${page}`;
  if (searchValue.trim() !== '') {
    url = `https://allowapps.onrender.com/search/${searchValue}?page=${page}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
    if (data.data.length === 0) {
      table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
      return;
    }

    let tableHtml = "";

    data.data.forEach(function ({ id, name, platform, status, date_added, comment }) {
      tableHtml += "<tr>";
      tableHtml += `<td>${id}</td>`;
      tableHtml += `<td>${name}</td>`;
      tableHtml += `<td>${platform}</td>`;
      tableHtml += `<td>${status}</td>`;
      tableHtml += `<td>${new Date(date_added).toDateString()}</td>`;
      tableHtml += `<td>${comment}</td>`;
      tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;

    // Update the totalPages variable
    totalPages = data.totalPages;

    // Update the pagination buttons
    updatePaginationButtons(page, totalPages);
  })
  .catch(err => console.log(err));
}


// Previous button click event handler
document.querySelector("#previous-btn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadHTMLTable(currentPage); 
  }
});

// Next button click event handler
document.querySelector("#next-btn").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    loadHTMLTable(currentPage); 
  }
});


// Update pagination buttons
function updatePaginationButtons(currentPage, totalPages) {
  const previousBtn = document.querySelector("#previous-btn");
  const nextBtn = document.querySelector("#next-btn");

  previousBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}


function openNav() {
  document.getElementById("myNav").style.width = "14%";
}

function on() {
  document.getElementById("overlay").style.display = "block";
}

window.addEventListener("DOMContentLoaded", function() {
  openNav();
  on();
});

var mybutton = document.getElementById("myBtn");





const exportButton = document.getElementById("export-btn");
exportButton.addEventListener("click", exportToCSV);

function exportToCSV() {
  const table = document.getElementById("table");
  const rows = Array.from(table.getElementsByTagName("tr"));

  const data = rows.map((row) => {
    const cells = Array.from(row.getElementsByTagName("td"));
    return cells.map((cell) => cell.textContent);
  });

  const csvContent = convertToCSV(data);

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "data.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  } else {
    alert("Export to CSV is not supported in this browser.");
  }
}

function convertToCSV(data) {
  const rows = data.map((row) => row.join(","));
  return rows.join("\n");
}




// Initial table load
loadHTMLTable(currentPage);
