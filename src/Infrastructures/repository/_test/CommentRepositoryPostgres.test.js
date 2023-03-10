const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should add comment and return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'some text',
        parentId: 'thread-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      /** insert needed records */
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      /** create repository instance */
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment).toStrictEqual({
        id: 'comment-123',
        content: 'some text',
        owner: 'user-123',
      });
    });
  });

  describe('getCommentsByParentId function', () => {
    it('should return an empty array when comment is not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByParentId('thread-123');

      // Assert
      expect(comments).toHaveLength(0);
    });

    it('should return the correct property and value when id is found', async () => {
      // Arrange
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
        owner: 'user-223',
        content: 'sebuah comment1',
        parentId: thread1.id,
        date: new Date(),
        isDeleted: true,
      };
      await CommentsTableTestHelper.addComment(comment1);

      const comment2 = {
        id: 'comment-223',
        owner: 'user-123',
        content: 'sebuah comment2',
        parentId: thread1.id,
        date: new Date(),
      };
      await CommentsTableTestHelper.addComment(comment2);

      /** creating repository instance */
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByParentId(thread1.id);

      // Assert
      expect(comments).toHaveLength(2);

      /** checking replies value */
      expect(comments)
        .toEqual(expect.arrayContaining([
          expect.objectContaining({
            id: comment1.id,
            username: 'johndoe',
            content: comment1.content,
            date: comment1.date,
            is_deleted: true,
          }),
          expect.objectContaining({
            id: comment2.id,
            username: 'dicoding',
            content: comment2.content,
            date: comment2.date,
            is_deleted: false,
          }),
        ]));
    });
  });

  describe('checkAvailabilityComment function', () => {
    it('should throw NotFoundError when id or parentId not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.checkAvailabilityComment({
        id: 'comment-123',
        parentId: 'thread-123',
      }))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when id is available', async () => {
      // Arrange
      /** insert needed records */
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'developer' });
      await UsersTableTestHelper.addUser({ id: 'user-235', username: 'engineer' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-235',
        parentId: 'thread-123',
      });
      /** create repository instance */
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.checkAvailabilityComment({ id: 'comment-123', parentId: 'thread-123' }))
        .resolves
        .not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner funciton', () => {
    it('should throw AuthorizationError when owner is not valid', async () => {
      // Arrange
      /** insert needed records */
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'developer' });
      await UsersTableTestHelper.addUser({ id: 'user-235', username: 'engineer' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-235',
        parentId: 'thread-123',
      });
      /** create repository instance */
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner({ id: 'comment-123', owner: 'user-123' }))
        .rejects
        .toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when owner is valid', async () => {
      // Arrange
      /** insert needed records */
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'developer' });
      await UsersTableTestHelper.addUser({ id: 'user-235', username: 'engineer' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-235',
        parentId: 'thread-123',
      });
      /** create repository instance */
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner({ id: 'comment-123', owner: 'user-235' }))
        .resolves
        .not.toThrow(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should softly delete specific comment from database', async () => {
      // Arrange
      /** insert needed records */
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'developer' });
      await UsersTableTestHelper.addUser({ id: 'user-235', username: 'engineer' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-235',
        parentId: 'thread-123',
      });
      /** create repository instance */
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-123');

      // Assert
      const comments = await CommentsTableTestHelper
        .findCommentById('comment-123');
      expect(comments[0].is_deleted)
        .toEqual(true);
    });
  });
});
