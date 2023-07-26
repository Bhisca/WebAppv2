const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER, 
    password: process.env.PASSWORD,
    database: process.env.DATABASE,  
    port: process.env.DB_PORT,
});

connection.connect((err) => {
    if(err) {
        console.log(err.message);
    }
    console.log('db' + connection.state);
});

class DbService {
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }

    async getAllData(page) {
        try {
          const perPage = 10; 
          const offset = (page - 1) * perPage; 
      
          const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM apps ORDER BY `apps`.`name` ASC LIMIT ? OFFSET ?;";
      
            connection.query(query, [perPage, offset], (err, results) => {
              if (err) reject(new Error(err.message));
              resolve(results);
            });
          });
      
          return response;
        } catch (error) {
          console.log(error);
        }
      }


      async getTotalPages() {
        try {
          const response = await new Promise((resolve, reject) => {
            const query = "SELECT COUNT(*) AS total FROM apps;";
            connection.query(query, (err, results) => {
              if (err) reject(new Error(err.message));
              const total = results[0].total;
              const totalPages = Math.ceil(total / 10); 
              resolve(totalPages);
            });
          });
    
          return response;
        } catch (error) {
          console.log(error);
        }
      }
    



    async searchByName(name, page) {
        try {
          const perPage = 10; 
          const offset = (page - 1) * perPage; 
      
          const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM apps WHERE name LIKE ? LIMIT ? OFFSET ?;";
      
            connection.query(query, [`%${name}%`, perPage, offset], (err, results) => {
              if (err) reject(new Error(err.message));
              resolve(results);
            });
          });
      
          return response;
        } catch (error) {
          console.log(error);
        }
      }

      async getTotalPagesForSearch(name) {
        try {
          const response = await new Promise((resolve, reject) => {
            const query = "SELECT COUNT(*) AS total FROM apps WHERE name LIKE ?;";
            connection.query(query, [`%${name}%`], (err, results) => {
              if (err) reject(new Error(err.message));
              const total = results[0].total;
              const totalPages = Math.ceil(total / 10); // Assuming 10 items per page
              resolve(totalPages);
            });
          });
      
          return response;
        } catch (error) {
          console.log(error);
        }
      }


      async insertNewEntry(name, platform, status, date, comment) {
        try {
          if (!date) {
            date = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current date in the format 'YYYY-MM-DD HH:mm:ss'
          }
      
          const response = await new Promise((resolve, reject) => {
            const query = "INSERT INTO apps (name, platform, status, date_added, comment) VALUES (?, ?, ?, ?, ?);";
      
            connection.query(query, [name, platform, status, date, comment], (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result);
            });
          });
      
          return response;
        } catch (error) {
          console.log(error);
        }
      }
      

      
      
};

module.exports = DbService;
