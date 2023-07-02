const express = require('express');
const app = express(); 
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');
  
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended : false}));
 
//create
app.post('/insert', (request, response) => { 
    const {name} = request.body; 
    const db = dbService.getDbServiceInstance();
 
    const result = db.insertNewName(name);

    result 
    .then(data => response.json({success: true}))
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

//update


//delete  





app.listen(process.env.PORT, () => console.log('app is running'));