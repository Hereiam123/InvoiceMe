// server.js
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sqlite3 = require('sqlite3').verbose();
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 3128;

const app = express();


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.send(200);
  }
  else {
  //move on
    next();
  }
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('appSecret', 'secretforinvoicingapp');

app.get('/', function(req,res){
    res.send("Welcome to Invoicing App");
});

app.post('/register', upload.any(),function(req, res){
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
        let user_id = this.lastID;
        let query = `SELECT * FROM users WHERE id='${user_id}'`;
        db.all(query, [], (err, rows) => {
          if (err) {
            throw err;
          }
          let user = rows[0];
          delete user.password;
          //  create payload for JWT
          const payload = {
            user: user
          }
          // create token
          let token = jwt.sign(payload, app.get("appSecret"), {
             expiresIn : 60*60*24 // expires in 24 hours
          });
          // send response back to client
          return res.json({
            status: true,
            token : token,
            user : user
          });
        });
      }
    });
    db.close();
  });
});


app.post("/login", upload.any(), function(req, res) {
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
      //  create payload for JWT
      const payload = { user: user };
      // create token
      let token = jwt.sign( payload, app.get("appSecret"),{
        expiresIn: "24h" // expires in 24 hours
      });
      return res.json({
        status: true,
        token: token,
        user: user
      });
    }

    return res.json({
      status: false,
      message: "Wrong Password, please retry"
    });
  });
});

app.use(upload.any(),function(req, res, next) {
  // check header or url parameters or post parameters for token

  let token =
    req.body.token || req.query.token || req.headers["authorization"];

  if(req.headers["authorization"]){
    token = token.split('bearer ')[1];
  }

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get("appSecret"), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authenticate token."
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: "No token provided."
    });
  }
});

app.post("/invoice", function(req, res) {
  // validate data
  if (!req.body.name) {
    return res.json({
      status: false,
      message: "Invoice needs a name"
    });
  }
  // create invoice
  let db = new sqlite3.Database("./database/InvoicingApp.db");
  let sql = `INSERT INTO invoices(name,user_id,paid) VALUES(
    '${req.body.name}',
    '${req.body.user_id}',
    0
  )`;

  db.serialize(function() {
  db.run(sql, function(err) {
      if (err) {
        throw err;
      }
      let invoice_id = this.lastID;
      for (let i = 0; i < req.body.txn_names.length; i++) {
        let query = `INSERT INTO transactions(name,price,invoice_id) VALUES(
            '${req.body.txn_names[i]}',
            '${req.body.txn_prices[i]}',
            '${invoice_id}'
        )`;
        db.run(query);
      }
      return res.json({
        status: true,
        message: "Invoice created"
      });
    });
  });
});

app.get("/invoice/user/:user_id", function(req, res) {
 let db = new sqlite3.Database("./database/InvoicingApp.db");
 let sql = `SELECT * FROM invoices LEFT JOIN transactions ON invoices.id=transactions.invoice_id WHERE user_id='${req.params.user_id}'`;
 db.all(sql, [], (err, rows) => {
   if (err) {
     throw err;
   }
   return res.json({
     status: true,
     transactions: rows
   });
 });
 db.close();
});

app.get("/invoice/user/:user_id/:invoice_id", function(req, res) {
  let db = new sqlite3.Database("./database/InvoicingApp.db");
  let sql = `SELECT * FROM invoices LEFT JOIN transactions ON invoices.id=transactions.invoice_id WHERE user_id='${
    req.params.user_id
  }' AND invoice_id='${req.params.invoice_id}'`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    return res.json({
      status: true,
      transactions: rows
    });
  });
  db.close();
});

app.listen(PORT, function(){
    console.log(`App running on localhost:${PORT}`);
});
