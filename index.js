require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const handlebars = require('express-handlebars');

const adminData = require("./routes/admin");
const shopRoute = require("./routes/shop");

const PORT = process.env.PORT || 3000;
const app = express();

app.engine('handlebars', handlebars()); // to use express-handlebars
app.set("view engine", "handlebars");
app.set("views", "views"); // set location of views folder(2nd arg)

// pug auto-registers itself so we do not need to import it and we can directly use it like this
// app.set("view engine", "pug");
// app.set("views", "views"); // set location of views folder(2nd arg)

// do this before any other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// body parser is now added into express as well
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

// use match with any url pattern
// whereas get, post and others match exact pattern
app.use(shopRoute);
app.use("/admin", adminData.routes);

app.use((req, res, next) => {
  res.status(404).render("404", { docTitle: "404" });
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
});

app.listen(PORT);
