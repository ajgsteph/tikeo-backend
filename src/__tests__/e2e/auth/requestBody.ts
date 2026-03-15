import request from 'supertest';
import { app } from '../../..';

describe('Auth API', () => {
  const zodErrorKey = 'ZodError';
  const authLoginPath = '/api/auth/login';

  async function checkBadRequestBody(path: string, body: object) {
    const response = await request(app).post(path).send(body);
    expect(response.status).toBe(400);
    console.log(response.body);
    expect(response.body['message']['name']).toStrictEqual(zodErrorKey);
  }

  describe('Login', () => {
    it('should return a bad request when email is missing', async () => {
      const requestBody = { password: 'password' };

      await checkBadRequestBody(authLoginPath, requestBody);
    });

    it('should return a bad request when password is missing', async () => {
      const requestBody = { email: 'user@example.com' };

      await checkBadRequestBody(authLoginPath, requestBody);
    });

    it('should return a bad request when email is not valid', async () => {
      const requestBody = { email: 'user', password: 'yourpassword' };

      await checkBadRequestBody(authLoginPath, requestBody);
    });
  });
});
