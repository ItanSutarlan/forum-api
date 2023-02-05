const LikeRepository = require('../../../../Domains/likes/LikeRepository');
const Like = require('../../../../Domains/likes/entities/Like');
const LikeToCommentUseCase = require('../LikeToCommentUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');

jest.mock('../../../../Domains/likes/entities/Like');

describe('LikeToCommentUseCase', () => {
  it('should orchestrate the action of deleting like correctly when the like data is already available', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    // mocks
    /** mocking class constructor */
    Like.mockReturnValue(useCasePayload);

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.getLikeToComment = jest.fn()
      .mockImplementation(() => Promise.resolve({
        comment_id: 'comment-123',
        owner: 'user-123',
      }));
    mockLikeRepository.deleteLikeToComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeToCommentUseCase = new LikeToCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await likeToCommentUseCase.execute(useCasePayload);

    // Assert
    expect(Like)
      .toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.checkAvailabilityComment)
      .toBeCalledWith({
        id: 'comment-123',
        parentId: 'thread-123',
      });
    expect(mockLikeRepository.getLikeToComment)
      .toBeCalledWith({
        commentId: 'comment-123',
        owner: 'user-123',
      });
    expect(mockLikeRepository.deleteLikeToComment)
      .toBeCalledWith({
        commentId: 'comment-123',
        owner: 'user-123',
      });
  });

  it('should orchestrate the action of adding like correctly when the like data is not available yet', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    // mocks
    /** mocking class constructor */
    Like.mockReturnValue(useCasePayload);

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.getLikeToComment = jest.fn()
      .mockImplementation(() => Promise.resolve(0));
    mockLikeRepository.addLikeToComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeToCommentUseCase = new LikeToCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await likeToCommentUseCase.execute(useCasePayload);

    // Assert
    expect(Like)
      .toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.checkAvailabilityComment)
      .toBeCalledWith({
        id: 'comment-123',
        parentId: 'thread-123',
      });
    expect(mockLikeRepository.getLikeToComment)
      .toBeCalledWith({
        commentId: 'comment-123',
        owner: 'user-123',
      });
    expect(mockLikeRepository.addLikeToComment)
      .toBeCalledWith({
        commentId: 'comment-123',
        owner: 'user-123',
      });
  });
});
