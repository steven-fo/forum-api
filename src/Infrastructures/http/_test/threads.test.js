const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and new thread', async () => {
      // Arrange
      const requestPayloadThread = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };

      const server = await createServer(container);

      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadThread,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const response = JSON.parse(addThreadResponse.payload);
      expect(addThreadResponse.statusCode).toEqual(201);
      expect(response.status).toEqual('success');
      expect(response.data.addedThread.id).toBeDefined();
      expect(response.data.addedThread.title).toBeDefined();
      expect(response.data.addedThread.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayloadThread = {
        title: 'sebuah thread',
      };

      const server = await createServer(container);

      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadThread,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const response = JSON.parse(addThreadResponse.payload);
      expect(addThreadResponse.statusCode).toEqual(400);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual('properti thread baru tidak sesuai');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayloadThread = {
        title: 'sebuah thread',
        body: 19,
      };

      const server = await createServer(container);

      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadThread,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const response = JSON.parse(addThreadResponse.payload);
      expect(addThreadResponse.statusCode).toEqual(400);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual('tipe data thread baru tidak sesuai');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayloadThread = {
        title: 'sebuah thread',
        body: 19,
      };

      const server = await createServer(container);

      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Action
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadThread,
      });

      // Assert
      const response = JSON.parse(addThreadResponse.payload);
      expect(addThreadResponse.statusCode).toEqual(401);
      expect(response.error).toEqual('Unauthorized');
      expect(response.message).toEqual('Missing authentication');
    });
  });

  describe('when GET /threads/{threadId}/', () => {
    it('should response 200 and get threads', async () => {
      // Arrange
      const requestPayloadThread = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };

      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadThread,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      // Action
      const getThreadResponse = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });

      // Assert
      const response = JSON.parse(getThreadResponse.payload);
      expect(getThreadResponse.statusCode).toEqual(200);
      expect(response.status).toEqual('success');
      expect(response.data.thread.id).toBeDefined();
      expect(response.data.thread.title).toBeDefined();
      expect(response.data.thread.date).toBeDefined();
      expect(response.data.thread.body).toBeDefined();
      expect(response.data.thread.username).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      const fakeThreadId = 'xxx';

      // Action
      const getThreadResponse = await server.inject({
        method: 'GET',
        url: `/threads/${fakeThreadId}`,
      });

      // Assert
      const response = JSON.parse(getThreadResponse.payload);
      expect(getThreadResponse.statusCode).toEqual(404);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual('thread tidak ditemukan');
    });
  });
});
