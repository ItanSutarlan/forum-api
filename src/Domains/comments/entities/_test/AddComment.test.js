const AddComment = require('../AddComment');

describe('AddComment', () => {
  it('should throw an error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      parentId: 'thread-123',
      owner: 'user-123',
    };

    // Action & Arrange
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      parentId: true,
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment entities when payload is correct', () => {
    // Arrange
    const payload = {
      content: 'sebuah content',
      parentId: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const addComment = new AddComment(payload);

    // Assert
    expect(addComment).toBeInstanceOf(AddComment);
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.parentId).toEqual(payload.parentId);
    expect(addComment.owner).toEqual(payload.owner);
  });
});
