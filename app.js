require("dotenv").config();
const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const connection = mysql.createConnection(process.env.DATABASE_URL);
connection.connect();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  connection.query("SELECT * FROM flights", function (err, rows, fields) {
    if (err) throw err;
    res.render("index", { dbValues: rows });
  });
});

app.post("/new_flight", (req, res) => {
  console.log(req.body);
  sql = `INSERT INTO flights (origin, destination, price, airline, departure_date)VALUES ("${req.body.origin}", "${req.body.destination}", ${req.body.price}, "${req.body.airline}", "${req.body.date}");`;
  //console.log(sql);
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/new_flight", (req, res) => {
  res.render("new", { foo: "FOO" });
});

app.get("/rows", (req, res) => {
  connection.query("SELECT * FROM flights", function (err, rows, fields) {
    if (err) throw err;

    res.send(rows);
    console.log(rows[0].departure);
    console.log(typeof rows);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
