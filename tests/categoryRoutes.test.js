const request = require('supertest');
const app = require('../app'); // Import from app.js, not server.js
const sequelize = require('../config/connection');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset the DB before running tests

  // Seed initial categories
  await request(app).post('/api/categories').send({ category_name: 'Shirts' });
  await request(app).post('/api/categories').send({ category_name: 'Shorts' });
  await request(app).post('/api/categories').send({ category_name: 'Music' });
});

describe('Category API Endpoints', () => {
  it('should GET all categories', async () => {
    const response = await request(app).get('/api/categories');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should POST a new category', async () => {
    const response = await request(app)
      .post('/api/categories')
      .send({ category_name: 'Test Category' });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('category_name', 'Test Category');
  });

  it('should GET a category by ID', async () => {
    const response = await request(app).get('/api/categories/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  it('should return 404 for non-existent category', async () => {
    const response = await request(app).get('/api/categories/999');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'No category found with this ID');
  });

  it('should DELETE a category by ID', async () => {
    const response = await request(app).delete('/api/categories/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Category deleted successfully');
  });
});

afterAll(async () => {
  await sequelize.close(); // Close DB connection after tests
});
