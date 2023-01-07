class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      content, owner, parentId, grandParentId,
    } = payload;

    this.content = content;
    this.owner = owner;
    this.parentId = parentId;
    this.grandParentId = grandParentId;
  }

  _verifyPayload({
    content, owner, parentId, grandParentId,
  }) {
    if (!content || !owner || !parentId || !grandParentId) throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    if (typeof content !== 'string' || typeof owner !== 'string' || typeof parentId !== 'string' || typeof grandParentId !== 'string') throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = AddReply;
