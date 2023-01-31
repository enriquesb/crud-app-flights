require("dotenv").config();
const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const mysql = require("mysql2");

const connection = mysql.createConnection(process.env.DATABASE_URL);
connection.connect();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { foo: "FOO" });
});

app.get("/rows", (req, res) => {
  connection.query("SELECT * FROM flights", function (err, rows, fields) {
    if (err) throw err;

    res.send(rows);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
