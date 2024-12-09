import TestAgent from 'supertest/lib/agent';
import { BASE_URL, ACCESS_TOKEN } from '../constants/apiConstants';
import { generateRandomUser } from '../utils';
import request from 'supertest';

describe(`API ${BASE_URL} ApiClient`, () => {
  let apiClient: TestAgent;
  let token: string;
  let testUser: User;
  let userID: number;

  beforeEach(() => {
    apiClient = request(BASE_URL);
    token = ACCESS_TOKEN;
  });

  afterEach(async () => {
    // Clean up any necessary resources
  });

  beforeAll(async () => {
    testUser = generateRandomUser({ status: 'active' });
  });

  afterAll(async () => {
    if (userID && apiClient) {
      await apiClient
        .delete(`/users/${userID}`)
        .set('Authorization', `Bearer ${token}`);
    }
  });

  describe('POST /users', () => {
    it('should return 401 if the request is unauthorized', async () => {
      const response = await apiClient
        .post('users')
        .set('Authorization', 'Bearer invalid_token')
        .send(testUser);
      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({
        message: 'Invalid token',
      });
    });

    it('should return 422 if the request body is invalid', async () => {
      const response = await apiClient
        .post('users')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'test' });
      expect(response.status).toEqual(422);
      expect(response.body).toMatchObject([
        { field: 'email', message: "can't be blank" },
        { field: 'gender', message: "can't be blank, can be male of female" },
        { field: 'status', message: "can't be blank" },
      ]);
    });

    it('should create a new user and return the user object', async () => {
      const response = await apiClient
        .post('users')
        .set('Authorization', `Bearer ${token}`)
        .send(testUser);
      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject(testUser);
      userID = response.body.id;
    });
  });

  describe('PATCH  /users/:id', () => {
    it('should return 401 if the request is unauthorized', async () => {
      const response = await apiClient
        .patch(`users/${userID}`)
        .set('Authorization', 'Bearer invalid_token')
        .send(testUser);
      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({
        message: 'Invalid token',
      });
    });

    it('should return 422 if the request body is invalid', async () => {
      const response = await apiClient
        .patch(`users/${userID}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'test' });
      expect(response.status).toEqual(422);
      expect(response.body).toMatchObject([
        { field: 'email', message: 'is invalid' },
      ]);
    });

    it('should update the user and return the updated user object', async () => {
      const response = await apiClient
        .patch(`users/${userID}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'updated name' });
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ name: 'updated name' });
      testUser.name = 'updated name';
    });
  });

  describe('GET /users/:id', () => {
    it('should return 401 if the request is unauthorized', async () => {
      const response = await apiClient
        .get(`users/${userID}`)
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({
        message: 'Invalid token',
      });
    });

    it('should return 404 if the user does not exist', async () => {
      const response = await apiClient
        .get(`users/999999999`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(404);
      expect(response.body).toMatchObject({
        message: 'Resource not found',
      });
    });

    it('should return the user object', async () => {
      const response = await apiClient
        .get(`users/${userID}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ id: userID, ...testUser });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should return 401 if the request is unauthorized', async () => {
      const response = await apiClient
        .delete(`users/${userID}`)
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({
        message: 'Invalid token',
      });
    });

    it('should return 404 if the user does not exist', async () => {
      const response = await apiClient
        .delete(`users/999999999`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(404);
      expect(response.body).toMatchObject({
        message: 'Resource not found',
      });
    });

    it('should delete the user and return 204', async () => {
      const response = await apiClient
        .delete(`users/${userID}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(204);
    });
  });

  describe('GET /users', () => {
    it('should return 401 if the request is unauthorized', async () => {
      const response = await apiClient
        .get('users')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({
        message: 'Invalid token',
      });
    });

    it('should return a list of users', async () => {
      const response = await apiClient
        .get('users')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
      expect(response.body?.length).toBeGreaterThan(0);
    });

    it('should return a list of users with pagination', async () => {
      const response = await apiClient
        .get('users')
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 1, per_page: 10 });
      expect(response.status).toEqual(200);
      expect(response.body?.length).toEqual(10);
      expect(response.headers['x-pagination-total']).toBeDefined();
      expect(parseInt(response.headers['x-pagination-total'])).toBeGreaterThan(
        0,
      );
      expect(response.headers['x-pagination-pages']).toBeDefined();
      expect(parseInt(response.headers['x-pagination-pages'])).toBeGreaterThan(
        0,
      );
      expect(response.headers['x-pagination-page']).toBeDefined();
      expect(parseInt(response.headers['x-pagination-page'])).toEqual(1);
      expect(response.headers['x-pagination-limit']).toBeDefined();
      expect(parseInt(response.headers['x-pagination-limit'])).toEqual(10);
    });
  });
});
