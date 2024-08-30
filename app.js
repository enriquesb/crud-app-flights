require("dotenv").config();
const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const fs = require("fs");

const supabase = require("@supabase/supabase-js");

const supabaseClient = supabase.createClient("https://sjbxqqmzeluaqpnvktsl.supabase.co", process.env.SUPABASE_KEY);

const rawCountries = fs.readFileSync("public/countries.json");
const countries = JSON.parse(rawCountries);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const { data, error } = await supabaseClient.from("flights").select();
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

app.post("/edit", async (req, res) => {
  id2edit = req.body.id2edit;
  const { data, error } = await supabaseClient.from("flights").select().eq("id", id2edit);
  res.render("edit", { row: data[0], countries: countries });
});

app.post("/editing", async (req, res) => {
  const { error } = await supabaseClient
    .from("flights")
    .update({
      origin: req.body.origin,
      destination: req.body.destination,
      price: req.body.price,
      airline: req.body.airline,
      departure_date: req.body.date,
    })
    .eq("id", req.body.id2edit);
  res.redirect("/");
});

app.post("/filtered", async (req, res) => {
  const { data, error } = await supabaseClient.from("flights").select().lt("price", req.body.maxPrice);
  res.render("filtered", { dbValues: data, maxPrice: req.body.maxPrice });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
