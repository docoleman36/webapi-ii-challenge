const express = require('express');

const server = express();
server.use(express.json());

const postRoutes = require('./router/postRouter');

server.use('/api', postRoutes);

server.get('/', (req, res) => {
  res.send(`<h1>Server is up and running</h1>`)
})

server.listen(4000, () => {
  console.log('\n*** Server Running on http://localhost:4000 ***\n');
})