class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, owner } = payload;
    this.id = id;
    this.owner = owner;
  }

  _verifyPayload({ id, owner }) {
    if (!id || !owner) throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    if (typeof id !== 'string' || typeof owner !== 'string') throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = DeleteComment;
