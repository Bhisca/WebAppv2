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
      tableHtml += `<td data-id="${id}">${id}</td>`;
      tableHtml += `<td>${name}</td>`;
      tableHtml += `<td>${platform}</td>`;
      tableHtml += `<td>${status}</td>`;
      tableHtml += `<td>${new Date(date_added).toDateString()}</td>`;
      tableHtml += `<td class="comment">${truncateComment(comment)}</td>`;
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
  fetch('https://allowapps.onrender.com/getAll')
    .then(response => response.json())
    .then(data => {
      const totalPages = data.totalPages;
      const currentPage = data.currentPage;
      const rows = data.data;

      if (rows.length === 0) {
        alert("No data to export.");
        return;
      }

      // Fetch remaining pages
      const fetchPromises = [];
      for (let page = 2; page <= totalPages; page++) {
        fetchPromises.push(fetch(`https://allowapps.onrender.com/getAll?page=${page}`)
          .then(response => response.json())
          .then(data => {
            rows.push(...data.data);
          })
        );
      }

      // Wait for all fetch requests to complete
      Promise.all(fetchPromises)
        .then(() => {
          const csvContent = convertToCSV(rows);

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
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}


function convertToCSV(data) {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(row => Object.values(row).map(cell => `"${cell}"`).join(","));
  return [headers, ...rows].join("\n");
}


//right click thingy

const table = document.querySelector('table');
let isTextSelected = false;



table.addEventListener('contextmenu', function(event) {
  const clickedRow = event.target.closest('tr');
  if (!clickedRow) return;

  const isTextSelected = window.getSelection().toString() !== '';

  if (!isTextSelected) {
    event.preventDefault();

    // Retrieve the data-id attribute to get the unique identifier of the row
    const rowId = clickedRow.querySelector('td[data-id]').getAttribute('data-id');

    // Show the options menu and pass the rowId
    showOptionsMenu(event.clientX, event.clientY, rowId);
  }
});

function showOptionsMenu(x, y, rowId) {
  const optionsMenu = document.createElement('ul');
  optionsMenu.className = 'options-menu';
  optionsMenu.innerHTML = `
    <li id="export-option">Export row</li>
  `;

  // Handle the export option click event
  const exportOption = optionsMenu.querySelector('#export-option');
  exportOption.addEventListener('click', function() {
    exportRowToCSVFile(rowId);
  });

  // Position the menu and append it to the body
  optionsMenu.style.left = x + 'px';
  optionsMenu.style.top = y + 'px';
  document.body.appendChild(optionsMenu);

  // Remove the options menu when clicked outside
  document.addEventListener('click', function(event) {
    if (!optionsMenu.contains(event.target)) {
      optionsMenu.remove();
    }
  });
}

document.addEventListener('mousedown', function(event) {
  const optionsMenu = document.querySelector('.options-menu');
  if (optionsMenu && !optionsMenu.contains(event.target)) {
    optionsMenu.remove();
  }
});

document.addEventListener('click', function(event) {
  const optionsMenu = document.querySelector('.options-menu');
  if (optionsMenu && !optionsMenu.contains(event.target)) {
    optionsMenu.remove();
  }
});








function exportRowToCSVFile(rowId) {
  const table = document.getElementById('table');
  const row = table.querySelector(`td[data-id="${rowId}"]`).closest('tr');

  const cells = Array.from(row.getElementsByTagName('td'));
  const rowData = cells.map((cell) => cell.textContent);

  const csvContent = convertRowToCSV(rowData);

  // Download the CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'row_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function convertRowToCSV(rowData) {
  const cells = rowData.map(cell => `"${cell}"`);
  return cells.join(',');
}


const overlayLinks = document.querySelectorAll(".overlay-content a");

       
        function handleClick(event) {
            event.preventDefault(); 
            overlayLinks.forEach(link => {
                link.classList.remove("active");
            });

            event.target.classList.add("active");

            const linkHref = event.target.getAttribute("href");
            if (linkHref) {
                window.location.href = linkHref;
            }
        }

        
        overlayLinks.forEach(link => {
            link.addEventListener("click", handleClick);
        });

        
        function highlightLink() {
            const currentPageURL = window.location.href;
            let isLinkHighlighted = false;
            overlayLinks.forEach(link => {
                const linkURL = new URL(link.href); 
                const currentURL = new URL(currentPageURL); 
                if (linkURL.pathname === currentURL.pathname) {
                    link.classList.add("active");
                    isLinkHighlighted = true;
                }
            });

           
            if (!isLinkHighlighted) {
                const homeLink = document.querySelector(".overlay-content a[href='index.html']");
                homeLink.classList.add("active");
            }
        }

        
        highlightLink();


function truncateComment(comment, maxLength = 100) {
  if (comment.length > maxLength) {
    return `${comment.slice(0, maxLength)}... <button class="see-more-btn" onclick="expandComment(this)">See More</button>`;
  }
  return comment;
}

// Function to expand the comment to its full length
function expandComment(button) {
  const commentCell = button.parentNode;
  const fullComment = commentCell.dataset.fullComment;
  commentCell.innerHTML = `${fullComment} <button class="see-less-btn" onclick="truncateComment(this.dataset.comment, ${commentCell.dataset.maxLength})">See Less</button>`;
}

// Initial table load
loadHTMLTable(currentPage);
