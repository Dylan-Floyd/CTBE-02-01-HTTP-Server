const { rm, mkdir, readdir } = require('fs/promises');
const request = require('supertest');
const app = require('../lib/app.js');
const SimpleDb = require('../SimpleDb.js');
const rootDir = './store/';
const db = new SimpleDb(rootDir);

describe('cats route tests', () => {

  const clearStore = () => {
    return rm(rootDir, { force: true, recursive: true }).then(() =>
      mkdir(rootDir, { recursive: true })
    );
  };

  beforeEach(clearStore);
  afterEach(clearStore);

  test('GET /cats get all cats', async () => {
    const cats = [
      {
        name: 'cat1'
      },
      {
        name: 'cat2'
      }
    ];
    const savedCats = [];
    await Promise.all(cats.map(async (cat) => {
      savedCats.push(cat); //This should make savedCats contain the id
      return db.save(cat);
    }));

    const res = await request(app).get('/cats');
    expect(res.body).toEqual(expect.arrayContaining(savedCats));
  });

  test('GET /cats/<id> gets a cat by id', async () => {
    const cat = {
      name: 'bob'
    };

    await db.save(cat);

    const res = await request(app).get(`/cats/${cat.id}`);
    expect(res.body).toEqual(cat);    
  });

  test('POST /cats creates a cat and returns it', async () => {
    const cat = {
      name: 'bob'
    };

    const expected = {
      name: 'bob',
      id: expect.any(String)
    };

    const res = await request(app).post('/cats').send(cat);
    expect(res.body).toEqual(expected);

    const savedCat = await db.get(res.body.id);
    expect(savedCat).toEqual(expected);
  });

  test('PUT /cats/:id updates a cat and returns 200', async () => {
    const cat = {
      name: 'bob'
    };

    await db.save(cat);
    cat.name = 'bobbert';

    const res = await request(app).put(`/cats/${cat.id}`).send(cat);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(cat);
  });

  test('DELETE /cats/:id deletes a cat and returns 200', async () => {
    const cat = {
      name: 'bob'
    };

    await db.save(cat);

    const res = await request(app).delete(`/cats/${cat.id}`);
    expect(res.statusCode).toEqual(200);
    const files = await readdir(rootDir);
    expect(files).not.toContain(`${cat.id}.json`);
  });

});
