const request = require('supertest');
const app = require('./app');

describe('API TODO - Tests', () => {

  test('GET / - infos API', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
  });

  test('GET /todos - liste des todos', async () => {
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body.todos).toBeInstanceOf(Array);
  });

  test('GET /todos/1 - todo existant', async () => {
    const res = await request(app).get('/todos/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  test('GET /todos/999 - todo inexistant', async () => {
    const res = await request(app).get('/todos/999');
    expect(res.status).toBe(404);
  });

  test('POST /todos - création', async () => {
    const res = await request(app).post('/todos').send({ title: 'Test CI/CD' });
    expect(res.status).toBe(201);
  });

  test('POST /todos - sans titre', async () => {
    const res = await request(app).post('/todos').send({});
    expect(res.status).toBe(400);
  });

  test('PUT /todos/1 - modification', async () => {
    const res = await request(app).put('/todos/1').send({ completed: true });
    expect(res.status).toBe(200);
  });

  test('GET /health - status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

});
