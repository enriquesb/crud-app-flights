require("dotenv").config();
const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const fs = require("fs");

const supabase = require("@supabase/supabase-js");

//import { createClient } from "@supabase/supabase-js";
const supabaseClient = supabase.createClient("https://sjbxqqmzeluaqpnvktsl.supabase.co", process.env.SUPABASE_KEY);

const connection = mysql.createConnection(process.env.DATABASE_URL);
connection.connect();

const rawCountries = fs.readFileSync("public/countries.json");
const countries = JSON.parse(rawCountries);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const { data, error } = await supabaseClient.from("flights").select();
  console.log(data);
  res.render("index", { dbValues: data });
});

app.post("/new_flight", async (req, res) => {
  const { error } = await supabaseClient.from("flights").insert({
    origin: req.body.origin,
    destination: req.body.destination,
    price: req.body.price,
    airline: req.body.airline,
    departure_date: req.body.date,
  });
  res.redirect("/");
});

app.get("/new_flight", (req, res) => {
  res.render("new", { countries: countries });
});

app.post("/delete", async (req, res) => {
  const { error } = await supabaseClient.from("flights").delete().eq("id", req.body.id2delete);
  res.redirect("/");
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
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err;
    res.redirect("/");
  });
});

app.post("/filtered", (req, res) => {
  maxPrice = req.body.maxPrice;
  sql = `SELECT * FROM flights
        WHERE price <= ${maxPrice};`;
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err;
    res.render("filtered", { dbValues: rows, maxPrice: maxPrice });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
