const AddComment = require('../../../../Domains/comments/entities/AddComment');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

jest.mock('../../../../Domains/comments/entities/AddComment');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
      parentId: 'thread-123',
      owner: 'user-123',
    };

    // mocks
    /** mocking class constructor */
    AddComment.mockReturnValue(useCasePayload);

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-235',
      }));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const comment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(AddComment)
      .toBeCalledWith(useCasePayload);
    expect(mockThreadRepository.checkAvailabilityThreadById)
      .toBeCalledWith(useCasePayload.parentId);
    expect(mockCommentRepository.addComment)
      .toBeCalledWith(useCasePayload);
    expect(comment)
      .toEqual({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-235',
      });
  });
});
