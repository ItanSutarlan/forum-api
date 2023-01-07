const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const AddReply = require('../../../../Domains/replies/entities/AddReply');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

jest.mock('../../../../Domains/replies/entities/AddReply');

describe('AddReplyUseCase', () => {
  it('should orchestrate the add reply correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah reply',
      parentId: 'comment-123',
      grandParentId: 'thread-123',
      owner: 'user-123',
    };

    // mocks
    /** mocking class constructor */
    AddReply.mockReturnValue(useCasePayload);

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReplyToComment = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'reply-123',
        content: 'sebuah reply',
        owner: 'user-235',
      }));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const reply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(AddReply)
      .toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.checkAvailabilityComment)
      .toBeCalledWith({
        id: useCasePayload.parentId,
        parentId: useCasePayload.grandParentId,
      });
    expect(mockReplyRepository.addReplyToComment)
      .toBeCalledWith({
        parentId: useCasePayload.parentId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      });
    expect(reply)
      .toEqual({
        id: 'reply-123',
        content: 'sebuah reply',
        owner: 'user-235',
      });
  });
});
