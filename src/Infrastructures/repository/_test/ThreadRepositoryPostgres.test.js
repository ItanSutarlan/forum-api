const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread and return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'dicoding',
        body: 'some text',
        owner: 'user-123',
      });
      /** insert needed user for thread owner */
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const fakeIdGenerator = () => '123'; // stub!
      /** creating repository instance */
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
      expect(addedThread).toStrictEqual({
        id: 'thread-123',
        title: 'dicoding',
        owner: 'user-123',
      });
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should return the correct property and value when id is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const thread = {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
        date: new Date(),
      };
      await ThreadsTableTestHelper.addThread(thread);

      /** creating repository instance */
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const result = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      /** checking thread property and value */
      expect(result)
        .toEqual(expect.objectContaining({
          id: thread.id,
          title: thread.title,
          body: thread.body,
          date: thread.date,
          username: 'dicoding',
        }));
    });
  });

  describe('checkAvailabilityThreadById function', () => {
    it('should throw NotFoundError when id not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.checkAvailabilityThreadById('thread-123'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when id is available', async () => {
      // Arrange
      /** insert needed records */
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'developer' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      /** create repository instance */
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.checkAvailabilityThreadById('thread-123'))
        .resolves
        .not.toThrow(NotFoundError);
    });
  });
});
