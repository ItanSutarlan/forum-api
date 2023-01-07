const AddReply = require('../../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({
    commentRepository, replyRepository,
  }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);

    const {
      grandParentId,
      parentId,
      owner,
      content,
    } = addReply;

    await this._commentRepository
      .checkAvailabilityComment({ id: parentId, parentId: grandParentId });
    const addedReply = await this._replyRepository
      .addReplyToComment({ content, owner, parentId });

    return addedReply;
  }
}

module.exports = AddReplyUseCase;
