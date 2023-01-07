const DeleteReply = require('../DeleteReply');

describe('DeleteReply', () => {
  it('should throw an error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      parentId: 'comment-123',
      grandParentId: 'thread-123',
    };

    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      owner: true,
      parentId: 'comment-123',
      grandParentId: 'thread-123',
    };

    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    const payload = {
      id: 'reply-123',
      owner: 'user-235',
      parentId: 'comment-123',
      grandParentId: 'thread-123',
    };

    const deleteComment = new DeleteReply(payload);

    expect(deleteComment).toBeInstanceOf(DeleteReply);
    expect(deleteComment.id).toEqual(payload.id);
    expect(deleteComment.owner).toEqual(payload.owner);
    expect(deleteComment.parentId).toEqual(payload.parentId);
    expect(deleteComment.grandParentId).toEqual(payload.grandParentId);
  });
});
