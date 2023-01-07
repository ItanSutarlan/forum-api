class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, owner, parentId, grandParentId,
    } = payload;
    this.id = id;
    this.owner = owner;
    this.parentId = parentId;
    this.grandParentId = grandParentId;
  }

  _verifyPayload({
    id, owner, parentId, grandParentId,
  }) {
    if (!id || !owner || !parentId || !grandParentId) throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    if (typeof id !== 'string' || typeof owner !== 'string' || typeof parentId !== 'string' || typeof grandParentId !== 'string') throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = DeleteReply;
