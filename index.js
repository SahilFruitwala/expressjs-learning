const http = require('http');

require("dotenv").config();
const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);

server.listen(PORT);