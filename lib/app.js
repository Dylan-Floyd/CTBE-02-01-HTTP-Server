const cats = require('./cats.js');

const routes = {
  cats
};

const app = async (req, res) => {
  const [, resource] = req.url.split('/');
  const route = routes[resource];

  if(route) {
    try {
      const handler = route[req.method.toLowerCase()];
      if(handler) {
        await handler(req, res);
      } else {
        res.statusCode = 404;
        res.end('Not Found');
      }
    } catch(e) {
      console.log(e);
      res.statusCode = 500;
      res.end(e.message);
    }
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
};

module.exports = app;
