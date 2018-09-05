// server.js
const express = require('express');
const validator = require('express-validator');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sqlite3 = require('sqlite3').verbose();

/*let db = new sqlite3.Database('./database/InvoicingApp.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});*/

const PORT = process.env.PORT || 3128;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function(req,res){
    res.send("Welcome to Invoicing App");
});

app.post('/register', function(req, res){
   // check to make sure none of the fields are empty
   if( !req.body.name  || !req.body.email || !req.body.company_name || !req.body.password){
       return res.json({
           'status' : false,
           'message' : 'All fields are required'
       });
   }
   bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    let db = new sqlite3.Database("./database/InvoicingApp.db");
    let sql = `INSERT INTO users(name,email,company_name,password) VALUES('${
      req.body.name
    }','${req.body.email}','${req.body.company_name}','${hash}')`;
    db.run(sql, function(err) {
      if (err) {
        throw err;
      } else {
        return res.json({
          status: true,
          message: "User Created"
        });
      }
    });
    db.close();
  });
});

app.post("/login", function(req, res) {
  let db = new sqlite3.Database("./database/InvoicingApp.db");
  let sql = `SELECT * from users where email='${req.body.email}'`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    db.close();
    if (rows.length == 0) {
      return res.json({
        status: false,
        message: "Sorry, wrong email"
      });
    }
    let user = rows[0];
    let authenticated = bcrypt.compareSync(req.body.password, user.password);
    delete user.password;
    if (authenticated) {
      return res.json({
        status: true,
        user: user
      });
    }
    return res.json({
      status: false,
      message: "Wrong Password, please retry"
   });
 });
});

app.listen(PORT, function(){
    console.log(`App running on localhost:${PORT}`);
});
