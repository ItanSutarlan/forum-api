const Like = require('../Like');

describe('Like', () => {
  it('should throw an error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new Like(payload)).toThrowError('LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
      owner: 'user-123',
      threadId: 'thread-123',
    };

    // Action & Assert
    expect(() => new Like(payload)).toThrowError('LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Like entities when payload is correct', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    // Action
    const like = new Like(payload);

    // Assert
    expect(like).toBeInstanceOf(Like);
    expect(like.commentId).toEqual(payload.commentId);
    expect(like.owner).toEqual(payload.owner);
    expect(like.threadId).toEqual(payload.threadId);
  });
});
