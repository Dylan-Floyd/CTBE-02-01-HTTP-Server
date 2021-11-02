const SimpleDb = require('../SimpleDb.js');
const parseBody = require('./parseBody.js');
const db = new SimpleDb('./store/');

const cats = {
  get: async (req, res) => {
    const [, , id] = req.url.split('/');
    
    if (id) {
      const cat = await db.get(id);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(cat));
    } else {
      const cats = await db.getAll(id);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(cats));
    }
  },

  post: async (req, res) => {
    const cat = await parseBody(req);
    await db.save(cat);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(cat));
  },

  put: async (req, res) => {
    const [, , id] = req.url.split('/');
    const newCat = await parseBody(req);
    const cat = await db.get(id);
    if(!cat) {
      res.statusCode = 404;
      res.end('Cat Not Found');
    } else {
      await db.update(id, newCat);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(newCat));
    }
  },

  delete: async (req, res) => {
    const [, , id] = req.url.split('/');
    const cat = await db.get(id);
    if(!cat) {
      res.statusCode = 404;
      res.end('Cat Not Found');
    } else {
      await db.remove(id);
      res.statusCode = 200;
      res.end('Success');
    }
  }
};

module.exports = cats;
