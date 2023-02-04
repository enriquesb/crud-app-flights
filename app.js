require("dotenv").config();
const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const mysql = require("mysql2");

const connection = mysql.createConnection(process.env.DATABASE_URL);
connection.connect();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  connection.query("SELECT * FROM flights", function (err, rows, fields) {
    if (err) throw err;
    res.render("index", { dbValues: rows });
    //console.log(rows[0].departure);
    //console.log(typeof rows);
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
