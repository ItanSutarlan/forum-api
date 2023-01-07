const AddComment = require('../../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    await this._threadRepository.checkAvailabilityThreadById(addComment.parentId);
    const addedComment = await this._commentRepository.addComment(addComment);
    return addedComment;
  }
}

module.exports = AddCommentUseCase;
