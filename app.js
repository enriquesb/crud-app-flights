require("dotenv").config();
const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const fs = require("fs");

const connection = mysql.createConnection(process.env.DATABASE_URL);
connection.connect();

const rawCountries = fs.readFileSync("public/countries.json");
const countries = JSON.parse(rawCountries);

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
  sql = `INSERT INTO flights (origin, destination, price, airline, departure_date)VALUES
        ("${req.body.origin}", "${req.body.destination}", ${req.body.price}, "${req.body.airline}", 
        "${req.body.date}");`;
  //console.log(sql);
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/new_flight", (req, res) => {
  res.render("new", { countries: countries });
});

app.post("/delete", (req, res) => {
  console.log(req.body.id2delete);
  sql = `DELETE FROM flights WHERE id="${req.body.id2delete}";`;
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err;
    res.redirect("/");
  });
});

app.post("/edit", (req, res) => {
  id2edit = req.body.id2edit;
  sql = `SELECT * FROM flights WHERE id="${id2edit}";`;
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err;
    rows[0].id = id2edit;
    res.render("edit", { row: rows[0], countries: countries });
  });
});

app.post("/editing", (req, res) => {
  console.log(req.body);
  sql = `UPDATE flights SET
        origin = "${req.body.origin}",
        destination = "${req.body.destination}",
        price = ${req.body.price},
        airline = "${req.body.airline}",
        departure_date = "${req.body.date}"
   WHERE id="${req.body.id2edit}";`;
  //console.log(sql);
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err;
    //rows[0].id = id2edit;
    res.redirect("/");
  });
});

app.get("/countries", (req, res) => {
  let rawCountries = fs.readFileSync("countries.json");
  let countries = JSON.parse(rawCountries);
  //res.send(rawdata);
  console.log(countries[0]);
  res.render("countriesDatalist", { countries: countries });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
