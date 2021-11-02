const http = require('http');
const app = require('./lib/app.js');

const port = process.env.PORT || 7890;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
