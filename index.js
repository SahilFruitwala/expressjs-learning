require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");

const adminRoute = require('./routes/admin')
const shopRoute = require('./routes/shop')

const PORT = process.env.PORT || 3000;
const app = express();

// do this before any other middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

// body parser is now added into express as well
// app.use(express.json())
// app.use(express.urlencoded({ extended: false })); 

// use match with any url pattern
// whereas get, post and others match exact pattern
app.use(shopRoute);
app.use('/admin', adminRoute);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(PORT);