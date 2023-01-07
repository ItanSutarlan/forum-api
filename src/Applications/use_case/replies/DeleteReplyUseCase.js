const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({
    replyRepository, commentRepository,
  }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const {
      id, owner, parentId, grandParentId,
    } = new DeleteReply(useCasePayload);

    await this._commentRepository
      .checkAvailabilityComment({
        id: parentId,
        parentId: grandParentId,
      });

    await this._replyRepository
      .checkAvailabilityReply({ id, parentId });

    await this._replyRepository
      .verifyReplyOwner({ id, owner });

    await this._replyRepository
      .deleteReplyById(id);
  }
}

module.exports = DeleteReplyUseCase;
