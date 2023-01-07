const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  // creating needed data for test
  const neededData = {};
  beforeAll(async () => {
    const server = await createServer(container);
    /** add user */
    const user = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });
    const userJson = JSON.parse(user.payload);
    neededData.userId = userJson.data.addedUser.id;
    /** login */
    const auth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const authJson = JSON.parse(auth.payload);
    neededData.accessToken = authJson.data.accessToken;

    /** creating thread */
    const thread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      },
      headers: {
        Authorization: `Bearer ${neededData.accessToken}`,
      },
    });
    const threadJson = JSON.parse(thread.payload);
    neededData.threadId = threadJson.data.addedThread.id;

    /** creating thread */
    const comment = await server.inject({
      method: 'POST',
      url: `/threads/${neededData.threadId}/comments`,
      payload: {
        content: 'sebuah comment',
      },
      headers: {
        Authorization: `Bearer ${neededData.accessToken}`,
      },
    });
    const commentJson = JSON.parse(comment.payload);
    neededData.commentId = commentJson.data.addedComment.id;
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 401 if headers authorization is not valid', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah reply',
      };
      const server = await createServer({});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: 'Bearer wrongaccesstoken',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const { accessToken, threadId, commentId } = neededData;
      const requestPayload = {};
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan reply karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const { accessToken, threadId, commentId } = neededData;
      const requestPayload = {
        content: 123,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan reply karena tipe data tidak sesuai');
    });

    it('should response 404 when threadId or commentId is not found', async () => {
      // Arrange
      const { accessToken, threadId } = neededData;
      const requestPayload = {
        content: 'sebuah reply',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/comment-123/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread atau comment id tidak valid');
    });

    it('should response 201 status code and correct added Comment', async () => {
      // Arrange
      const {
        accessToken, userId, threadId, commentId,
      } = neededData;
      const requestPayload = {
        content: 'sebuah reply',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toHaveProperty('addedReply');
      expect(responseJson.data.addedReply).toHaveProperty('id');
      expect(responseJson.data.addedReply).toEqual(expect.objectContaining({
        content: 'sebuah reply',
        owner: userId,
      }));
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 401 if headers authorization is not valid', async () => {
      // Arrange
      const server = await createServer({});

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: 'Bearer wrongaccesstoken',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 404 when threadId or commentId is not found', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, threadId, userId } = neededData;
      // add comment
      await CommentsTableTestHelper.addComment({ id: 'comment-223', owner: userId, parentId: threadId });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 403 when owner is not valid', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, threadId, commentId } = neededData;
      // create new owner
      await UsersTableTestHelper.addUser({ id: 'user-323', username: 'thomas' });
      // add reply
      await CommentsTableTestHelper.addComment({ id: 'reply-123', parentId: commentId, owner: 'user-323' });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/reply-123`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak berhak mengakses resource ini');
    });

    it('should response 200 status code and have status property success', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        accessToken, threadId, userId, commentId,
      } = neededData;
      // add reply
      await CommentsTableTestHelper.addComment({ id: 'reply-223', owner: userId, parentId: commentId });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/reply-223`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
