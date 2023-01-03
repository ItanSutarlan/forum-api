class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, parentId, owner } = payload;
    this.content = content;
    this.parentId = parentId;
    this.owner = owner;
  }

  _verifyPayload({ content, parentId, owner }) {
    if (!content || !parentId || !owner) throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof content !== 'string' || typeof parentId !== 'string' || typeof owner !== 'string') throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = AddComment;
