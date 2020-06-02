const express = require('express');
const server = express();
const posts_router = require('./Post/posts_router');
server.use(express.json());

server.use('/api/posts', posts_router);

server.get("/", (req, res) => {
    res.send('API')
})

server.listen(8000, () => {
    console.log('Server listening on http://localhost:8000')
})