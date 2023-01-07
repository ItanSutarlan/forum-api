const AddReply = require('../AddReply');

describe('AddReply', () => {
  it('should throw an error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      parentId: 'comment-123',
      owner: 'user-123',
      content: 'sebuah reply',
    };

    // Action & Arrange
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      parentId: true,
      grandParentId: 'thread-123',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddReply entities when payload is correct', () => {
    // Arrange
    const payload = {
      content: 'sebuah content',
      parentId: 'comment-123',
      grandParentId: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const addComment = new AddReply(payload);

    // Assert
    expect(addComment).toBeInstanceOf(AddReply);
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.parentId).toEqual(payload.parentId);
    expect(addComment.grandParentId).toEqual(payload.grandParentId);
    expect(addComment.owner).toEqual(payload.owner);
  });
});
