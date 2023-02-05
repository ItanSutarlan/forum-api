const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  describe('when GET /threads/{threadId}', () => {
    beforeAll(async () => {
      /** insert needed records */
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: 'user-223', username: 'johndoe' });
      const thread1 = {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      };
      await ThreadsTableTestHelper.addThread(thread1);
      const comment1 = {
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        parentId: thread1.id,
        isDeleted: true,
      };

      const comment2 = {
        id: 'comment-223',
        content: 'sebuah comment',
        owner: 'user-223',
        parentId: thread1.id,
        isDeleted: false,
      };
      await CommentsTableTestHelper.addComment(comment1);
      await CommentsTableTestHelper.addComment(comment2);

      /** give two likes to second comment */
      await LikesTableTestHelper.addLike({
        commentId: 'comment-223',
        owner: 'user-123',
      });
      await LikesTableTestHelper.addLike({
        commentId: 'comment-223',
        owner: 'user-223',
      });

      const reply1 = {
        id: 'reply-223',
        owner: 'user-223',
        content: 'sebuah comment',
        parentId: comment1.id,
        isDeleted: true,
      };
      await CommentsTableTestHelper.addComment(reply1);

      const reply2 = {
        id: 'reply-323',
        owner: 'user-123',
        content: 'sebuah comment',
        parentId: comment1.id,
      };
      await CommentsTableTestHelper.addComment(reply2);
    });

    /** clean all records from all needed tables after all test */
    afterAll(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    it('should response 404 when thread is not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-623',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 200 status code and have correct property and value when id is found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toHaveProperty('thread');
      /** checking thread property and value */
      const { data: { thread } } = responseJson;
      expect(thread)
        .toEqual(expect.objectContaining({
          id: 'thread-123',
          title: 'sebuah thread',
          body: 'sebuah body thread',
          date: expect.any(String),
          username: 'dicoding',
          comments: expect.any(Array),
        }));
      /** checking comments value */
      expect(thread).toHaveProperty('comments');
      const { comments } = thread;
      expect(comments)
        .toEqual(expect.arrayContaining([
          expect.objectContaining({
            id: 'comment-123',
            username: 'dicoding',
            content: '**komentar telah dihapus**',
            date: expect.any(String),
            likeCount: 0,
            replies: expect.any(Array),
          }),
          expect.objectContaining({
            id: 'comment-223',
            username: 'johndoe',
            content: 'sebuah comment',
            date: expect.any(String),
            likeCount: 2,
            replies: expect.any(Array),
          }),
        ]));
      /** checking replies value */
      expect(comments[0].replies)
        .toEqual(expect.arrayContaining([
          expect.objectContaining({
            id: 'reply-223',
            username: 'johndoe',
            content: '**balasan telah dihapus**',
            date: expect.any(String),
          }),
          expect.objectContaining({
            id: 'reply-323',
            username: 'dicoding',
            content: 'sebuah comment',
            date: expect.any(String),
          }),
        ]));
    });
  });

  describe('when POST /threads', () => {
  /** creating needed data before all test */
    const neededData = {};
    beforeAll(async () => {
      const server = await createServer(container);
      /** add user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      /** login */
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const responseJson = JSON.parse(response.payload);
      neededData.accessToken = responseJson.data.accessToken;
    });

    /** clean all records from all needed tables after all test */
    afterAll(async () => {
      await AuthenticationsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await pool.end();
    });

    it('should response 401 if headers authorization is not valid', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };
      const server = await createServer({});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
      const { accessToken } = neededData;
      const requestPayload = {
        title: 'sebuah thread',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan thread karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const { accessToken } = neededData;
      const requestPayload = {
        title: 123,
        body: 123,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan thread karena tipe data tidak sesuai');
    });

    it('should response 201 status code and correct added thread', async () => {
      // Arrange
      const { accessToken } = neededData;
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      // get added thread from database
      const { data: { addedThread } } = responseJson;
      const threads = await ThreadsTableTestHelper.findThreadById(addedThread.id);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toHaveProperty('addedThread');
      expect(responseJson.data.addedThread).toEqual(expect.objectContaining({
        id: threads[0].id,
        title: threads[0].title,
        owner: threads[0].owner,
      }));
    });
  });
});
