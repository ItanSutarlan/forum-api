class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, owner, parentId } = payload;
    this.id = id;
    this.owner = owner;
    this.parentId = parentId;
  }

  _verifyPayload({ id, owner, parentId }) {
    if (!id || !owner || !parentId) throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    if (typeof id !== 'string' || typeof owner !== 'string' || typeof parentId !== 'string') throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = DeleteComment;
