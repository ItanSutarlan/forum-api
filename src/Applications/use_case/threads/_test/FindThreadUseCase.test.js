const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const ReturnedThread = require('../../../../Domains/threads/entities/ReturnedThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const FindThreadUseCase = require('../FindThreadUseCase');

describe('FindThreadUseCase', () => {
  it('should orchestrate the find thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };

    const thread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      username: 'dicoding',
      date: new Date(),
    };

    const comment1 = {
      id: 'comment-123',
      content: 'sebuah comment',
      username: 'dicoding',
      parent_id: thread.id,
      is_deleted: false,
      date: new Date(),
    };

    const comment2 = {
      id: 'comment-223',
      content: 'sebuah comment',
      username: 'johndoe',
      parent_id: thread.id,
      is_deleted: true,
      date: new Date(),
    };

    const reply1 = {
      id: 'reply-223',
      username: 'johndoe',
      content: 'sebuah reply',
      parent_id: comment1.id,
      is_deleted: true,
      date: new Date(),
    };

    const reply2 = {
      id: 'reply-323',
      username: 'dicoding',
      content: 'sebuah reply',
      parent_id: comment1.id,
      is_deleted: false,
      date: new Date(),
    };

    /** mocking needed function */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getCommentsByParentId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        comment1, comment2,
      ]));
    mockReplyRepository.getRepliesToComment = jest.fn()
      .mockImplementationOnce(() => Promise.resolve([
        reply1, reply2,
      ]));

    /** creating use case instance */
    const findThreadUseCase = new FindThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const result = await findThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentsByParentId).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.getRepliesToComment).toBeCalledWith([comment1.id, comment2.id]);
    expect(mockReplyRepository.getRepliesToComment).toBeCalledTimes(1);
    expect(result).toBeInstanceOf(ReturnedThread);
    /** checking thread property and value */
    expect(result).toEqual(expect.objectContaining({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: expect.any(Array),
    }));

    /** checking comments value */
    const { comments } = result;
    expect(comments)
      .toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: comment1.id,
          username: comment1.username,
          content: comment1.content,
          date: comment1.date,
          replies: expect.any(Array),
        }),
        expect.objectContaining({
          id: comment2.id,
          username: comment2.username,
          content: '**komentar telah dihapus**',
          date: comment2.date,
          replies: expect.any(Array),
        }),
      ]));

    /** checking replies value */
    expect(comments[0].replies)
      .toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: reply1.id,
          username: reply1.username,
          content: '**balasan telah dihapus**',
          date: reply1.date,
        }),
        expect.objectContaining({
          id: reply2.id,
          username: reply2.username,
          content: reply2.content,
          date: reply2.date,
        }),
      ]));
  });

  it('should throw an error when payload did not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const findThreadUseCase = new FindThreadUseCase({});

    // Action & Arrange
    await expect(findThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('FIND_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      id: 123,
    };
    const findThreadUseCase = new FindThreadUseCase({});

    // Action & Arrange
    await expect(findThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('FIND_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
