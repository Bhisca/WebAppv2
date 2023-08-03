const express = require('express');
const app = express(); 
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require("fs");

dotenv.config();

const dbService = require('./dbService');
const upload = multer({ dest: "uploads/" });
  
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended : false}));
 
//create
app.post('/insert', (request, response) => {
  const { name, platform, status, date_added, comment } = request.body;
  const db = dbService.getDbServiceInstance();

  const result = db.insertNewEntry(name, platform, status, date_added, comment);

  result
    .then(() => response.json({ success: true }))
    .catch(err => console.log(err));
});
   
//read 
app.get('/getAll', (request, response) => {
    const page = parseInt(request.query.page) || 1; 
    const db = dbService.getDbServiceInstance(); 
  
    Promise.all([
      db.getAllData(page),
      db.getTotalPages()
    ])
      .then(([data, totalPages]) => response.json({ data, totalPages }))
      .catch(err => console.log(err));
  });
  
  app.get('/search/:name', (request, response) => {
    const name = request.params.name;
    const page = parseInt(request.query.page) || 1; 
    const db = dbService.getDbServiceInstance(); 
  
    Promise.all([
      db.searchByName(name, page),
      db.getTotalPagesForSearch(name)
    ])
      .then(([data, totalPages]) => response.json({ data, totalPages }))
      .catch(err => console.log(err));
  });

app.post("/import", upload.single("csvFile"), (request, response) => {
    if (!request.file) {
      response.json({ success: false, message: "No file selected." });
      return;
    }
  
    const filePath = request.file.path;
  
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        const db = dbService.getDbServiceInstance();
        const importPromises = results.map((entry) =>
          db.insertNewEntry(
            entry.name,
            entry.platform,
            entry.status,
            entry.date_added,
            entry.comment
          )
        );
  
        Promise.all(importPromises)
          .then(() => {
            fs.unlinkSync(filePath); // Delete the temporary CSV file
            response.json({ success: true });
          })
          .catch((err) => {
            fs.unlinkSync(filePath); // Delete the temporary CSV file in case of an error
            console.log(err);
            response.json({ success: false, message: "Error importing data." });
          });
      });
  });





app.listen(process.env.PORT, () => console.log('app is running'));
