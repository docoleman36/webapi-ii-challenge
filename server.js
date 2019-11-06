const express = require('express');

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
  res.send(`<h1>Server is up and running</h1>`)
})

module.export = server;