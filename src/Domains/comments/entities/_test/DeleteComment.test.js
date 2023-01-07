const DeleteComment = require('../DeleteComment');

describe('DeleteComment', () => {
  it('should throw an error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      parentId: 'thread-123',
    };

    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      owner: true,
      parentId: 435,
    };

    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      owner: 'user-235',
      parentId: 'thread-123',
    };

    const deleteComment = new DeleteComment(payload);

    expect(deleteComment).toBeInstanceOf(DeleteComment);
    expect(deleteComment.id).toEqual(payload.id);
    expect(deleteComment.owner).toEqual(payload.owner);
    expect(deleteComment.parentId).toEqual(payload.parentId);
  });
});
