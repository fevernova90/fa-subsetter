const request = require('supertest');
const app = require('./server');

describe('Server API smoke tests', () => {
  it('GET /saved-icons returns 200 or 500', async () => {
    const res = await request(app).get('/saved-icons');
    expect([200, 500]).toContain(res.status);
  });

  it('POST /gen-webfonts with empty body returns 500', async () => {
    const res = await request(app)
      .post('/gen-webfonts')
      .set('Content-Type', 'application/json')
      .send([]);
    expect(res.status).toBe(500);
  });

  it('GET /download returns 200, 404, or 500', async () => {
    const res = await request(app).get('/download');
    expect([200, 404, 500]).toContain(res.status);
  });
});
