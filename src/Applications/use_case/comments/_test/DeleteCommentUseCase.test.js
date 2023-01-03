const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const DeleteComment = require('../../../../Domains/comments/entities/DeleteComment');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

jest.mock('../../../../Domains/comments/entities/DeleteComment');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      owner: 'user-235',
    };

    // Mocks
    DeleteComment.mockReturnValue(useCasePayload);

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.checkAvailabilityCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(DeleteComment)
      .toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.checkAvailabilityCommentById)
      .toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.verifyCommentOwner)
      .toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.deleteCommentById)
      .toBeCalledWith(useCasePayload.id);
  });
});