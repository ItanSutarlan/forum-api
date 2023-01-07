const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const DeleteReply = require('../../../../Domains/replies/entities/DeleteReply');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');

jest.mock('../../../../Domains/replies/entities/DeleteReply');

describe('DeleteReplyUseCase', () => {
  it('should orchestrate the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      owner: 'user-235',
      parentId: 'comment-123',
      grandParentId: 'thread-123',
    };

    // Mocks
    DeleteReply.mockReturnValue(useCasePayload);

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkAvailabilityReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    const {
      id, parentId, grandParentId, owner,
    } = useCasePayload;
    expect(DeleteReply)
      .toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.checkAvailabilityComment)
      .toBeCalledWith({
        id: parentId, parentId: grandParentId,
      });
    expect(mockReplyRepository.checkAvailabilityReply)
      .toBeCalledWith({
        id, parentId,
      });
    expect(mockReplyRepository.verifyReplyOwner)
      .toBeCalledWith({
        id, owner,
      });
    expect(mockReplyRepository.deleteReplyById)
      .toBeCalledWith(id);
  });
});
