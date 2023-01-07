const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const FindThreadUseCase = require('../FindThreadUseCase');

describe('FindThreadUseCase', () => {
  it('should orchestrate the find thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-AqVg2b9JyQXR6wSQ2TmH4',
    };
    const thread = {
      id: 'thread-AqVg2b9JyQXR6wSQ2TmH4',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:59:16.198Z',
      username: 'dicoding',
    };
    const comments = [
      {
        id: 'comment-q_0uToswNf6i24RDYZJI3',
        username: 'dicoding',
        date: '2021-08-08T07:59:18.982Z',
        content: 'sebuah comment',
      },
    ];
    /** mocking needed function */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getCommentsById = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));
    /** creating use case instance */
    const findThreadUseCase = new FindThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const result = await findThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentsById).toBeCalledWith(useCasePayload.id);
    expect(result).toEqual(expect.objectContaining({
      ...thread,
    }));
    expect(result).toHaveProperty('comments');
    expect(result.comments).toEqual(expect.arrayContaining([
      ...comments,
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
