const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReplyToComment function', () => {
    it('should add reply to a comment and return added added reply correctly', async () => {
      // Arrange
      const addReply = {
        content: 'sebuah reply',
        parentId: 'comment-123',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123';
      /** insert needed records */
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', parentId: 'thread-123' });
      /** create repository instance */
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReplyToComment(addReply);

      // Assert
      const comments = await CommentsTableTestHelper
        .findCommentById('reply-123');
      expect(comments)
        .toHaveLength(1);
      expect(addedReply)
        .toStrictEqual({
          id: 'reply-123',
          content: 'sebuah reply',
          owner: 'user-123',
        });
    });
  });

  describe('checkAvailabilityReply function', () => {
    it('should throw NotFoundError when id or parentId not available', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.checkAvailabilityReply({
        id: 'reply-123',
        parentId: 'comment-123',
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
      await CommentsTableTestHelper.addComment({
        id: 'reply-123',
        owner: 'user-123',
        parentId: 'comment-123',
      });
      /** create repository instance */
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.checkAvailabilityReply({ id: 'reply-123', parentId: 'comment-123' }))
        .resolves
        .not.toThrow(NotFoundError);
    });
  });

  describe('verifyReplyOwner funciton', () => {
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
      await CommentsTableTestHelper.addComment({
        id: 'reply-123',
        owner: 'user-123',
        parentId: 'comment-123',
      });
      /** create repository instance */
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner({ id: 'reply-123', owner: 'user-235' }))
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
      await CommentsTableTestHelper.addComment({
        id: 'reply-123',
        owner: 'user-123',
        parentId: 'comment-123',
      });
      /** create repository instance */
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner({ id: 'reply-123', owner: 'user-123' }))
        .resolves
        .not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should softly delete specific reply from database', async () => {
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
      await CommentsTableTestHelper.addComment({
        id: 'reply-123',
        owner: 'user-123',
        parentId: 'comment-123',
      });
      /** create repository instance */
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReplyById('reply-123');

      // Assert
      const replies = await CommentsTableTestHelper
        .findCommentById('reply-123');
      expect(replies[0].is_deleted)
        .toEqual(true);
    });
  });
});
