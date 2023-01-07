const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({
    commentRepository,
  }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { id, owner, parentId } = new DeleteComment(useCasePayload);
    await this._commentRepository.checkAvailabilityComment({ id, parentId });
    await this._commentRepository.verifyCommentOwner({ id, owner });
    await this._commentRepository.deleteCommentById(id);
  }
}

module.exports = DeleteCommentUseCase;
