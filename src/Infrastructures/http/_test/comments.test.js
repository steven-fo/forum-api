const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /comments', () => {
    it('should response 201 and new comment', async () => {
      // Arrange
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

      const requestPayloadThread = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadThread,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      const requestPayloadComment = {
        content: 'sebuah comment',
      };

      // Action
      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayloadComment,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const response = JSON.parse(addCommentResponse.payload);
      expect(addCommentResponse.statusCode).toEqual(201);
      expect(response.status).toEqual('success');
      expect(response.data.addedComment.id).toBeDefined();
      expect(response.data.addedComment.content).toBeDefined();
      expect(response.data.addedComment.owner).toBeDefined();
    });

    it('should response 400 when payload not meet data type specification', async () => {
      // Arrange
      const requestPayloadComment = {
        content: 20,
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

      // Login user
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
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      // Action
      const addedComment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayloadComment,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const response = JSON.parse(addedComment.payload);
      expect(addedComment.statusCode).toEqual(400);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual('tipe data komen baru tidak sesuai');
    });

    it('should response 400 when payload not contain needed data property', async () => {
      // Arrange
      const requestPayloadComment = {
        content: '',
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

      // Login user
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
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      // Action
      const addedComment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayloadComment,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const response = JSON.parse(addedComment.payload);
      expect(addedComment.statusCode).toEqual(400);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual('properti komen baru tidak sesuai');
    });

    it('should response 401 when user does not have authentications', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah comment',
      };

      const server = await createServer(container);

      const threadId = 'thread-123';

      // Action
      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      const response = JSON.parse(addCommentResponse.payload);
      expect(addCommentResponse.statusCode).toEqual(401);
      expect(response.error).toEqual('Unauthorized');
      expect(response.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayloadComment = {
        content: 'sebuah comment',
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

      // Login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const fakeThreadId = 'xxx';

      // Action
      const addedComment = await server.inject({
        method: 'POST',
        url: `/threads/${fakeThreadId}/comments`,
        payload: requestPayloadComment,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const response = JSON.parse(addedComment.payload);
      expect(addedComment.statusCode).toEqual(404);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual('thread tidak ditemukan');
    });
  });

  describe('when DELETE /comments', () => {
    it('should response 200 and delete comment', async () => {
      // Arrange
      const requestPayloadThread = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };

      const requestPayloadComment = {
        content: 'sebuah comment',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login user
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

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayloadComment,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);

      // Action
      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const response = JSON.parse(deleteCommentResponse.payload);
      expect(deleteCommentResponse.statusCode).toEqual(200);
      expect(response.status).toEqual('success');
    });

    it('should response 403 when user is not the owner', async () => {
      // Arrange
      const requestPayloadThread = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };

      const requestPayloadComment = {
        content: 'sebuah comment',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding2',
          password: 'not secret',
          fullname: 'Sebuah nama user',
        },
      });

      // Login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken: realAccessToken } } = JSON.parse(loginResponse.payload);

      const loginResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding2',
          password: 'not secret',
        },
      });
      const { data: { accessToken: wrongAccessToken } } = JSON.parse(loginResponse2.payload);

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadThread,
        headers: {
          authorization: `Bearer ${realAccessToken}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayloadComment,
        headers: {
          authorization: `Bearer ${realAccessToken}`,
        },
      });
      const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);

      // Action
      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        headers: {
          authorization: `Bearer ${wrongAccessToken}`,
        },
      });

      // Assert
      const response = JSON.parse(deleteCommentResponse.payload);
      expect(deleteCommentResponse.statusCode).toEqual(403);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual('kredensial yang diberikan salah');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayloadThread = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };

      const requestPayloadComment = {
        content: 'sebuah comment',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login user
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

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayloadComment,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);

      const fakeThreadId = 'xxx';

      // Action
      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${fakeThreadId}/comments/${addedComment.id}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const response = JSON.parse(deleteCommentResponse.payload);
      expect(deleteCommentResponse.statusCode).toEqual(404);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const requestPayloadThread = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login user
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

      const fakeCommentId = 'xxx';

      // Action
      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${fakeCommentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const response = JSON.parse(deleteCommentResponse.payload);
      expect(deleteCommentResponse.statusCode).toEqual(404);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual('comment tidak ditemukan');
    });
  });
});
