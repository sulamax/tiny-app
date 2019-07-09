const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
var cookieParser = require('cookie-parser')
app.use(cookieParser())

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  console.log('Body parsed ', req.body);
  res.render("urls_new");
});

app.get("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  urlDatabase[generateRandomString(6)] = req.body.longURL;
  res.redirect("/urls");
});

function generateRandomString(len) {
  let arr = '';
  let characters = 'DSDVFRGSDVSDF452387FDV689XCV769XCV';
  for (var i = 0; i < len; i++) {
    arr += characters.charAt(Math.random() * characters.length)

  }
  return arr;
}

app.get("/u/:shortURL", (req, res) => {
  const longURL = "http://www.lighthouselabs.ca";
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.params.shortURL)
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls/index");
});

app.post("/urls/:shortURL", (req, res) => {
  console.log(req.params)
  console.log('Body parsed ', req.body);
  urlDatabase[req.params.shortURL] = req.body.name;
  console.log(urlDatabase)
  res.redirect("/urls/" + req.params.shortURL);
});

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username)
  res.redirect("/urls")
});