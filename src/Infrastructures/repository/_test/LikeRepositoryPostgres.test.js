const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  beforeAll(async () => {
    /** add needed data for testing */
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', parentId: 'thread-123' });
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addLikeToComment function', () => {
    it('should add like to a comment correctly', async () => {
      // Arrange
      const payload = {
        commentId: 'comment-123',
        owner: 'user-123',
      };
      /** create repository instance */
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      await likeRepositoryPostgres.addLikeToComment(payload);

      // Assert
      const likes = await LikesTableTestHelper
        .findLike({
          commentId: 'comment-123',
          owner: 'user-123',
        });
      expect(likes)
        .toHaveLength(1);
    });
  });

  describe('getLikeToComment function', () => {
    it('should return 0 when like to a comment is not found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      const like = await likeRepositoryPostgres.getLikeToComment({
        commentId: 'comment-123',
        owner: 'user-123',
      });

      // Assert
      expect(like).toEqual(0);
    });

    it('should return 1 when like to a comment is found', async () => {
      // Arrange
      const payload = {
        commentId: 'comment-123',
        owner: 'user-123',
      };
      /** insert needed record */
      await LikesTableTestHelper.addLike(payload);

      /** create repository instance */
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      const like = await likeRepositoryPostgres.getLikeToComment(payload);

      // Assert
      expect(like).toEqual(1);
    });
  });

  describe('deleteLikeToComment function', () => {
    it('should delete specific like from database', async () => {
      // Arrange
      const payload = {
        commentId: 'comment-123',
        owner: 'user-123',
      };
      /** insert needed record */
      await LikesTableTestHelper.addLike(payload);

      /** create repository instance */
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      await likeRepositoryPostgres.deleteLikeToComment(payload);

      // Assert
      const likes = await LikesTableTestHelper.findLike(payload);
      expect(likes).toHaveLength(0);
    });
  });
});
