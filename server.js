// server.js
const express = require('express')
const bodyParser = require('body-parser');
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

app.listen(PORT, function(){
    console.log(`App running on localhost:${PORT}`);
});
