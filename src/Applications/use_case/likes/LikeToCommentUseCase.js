const Like = require('../../../Domains/likes/entities/Like');

class LikeToCommentUseCase {
  constructor({
    likeRepository, commentRepository,
  }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const like = new Like(useCasePayload);

    const {
      commentId,
      owner,
      threadId,
    } = like;

    await this._commentRepository.checkAvailabilityComment({
      id: commentId,
      parentId: threadId,
    });
    const addedLike = await this._likeRepository.getLikeToComment({ commentId, owner });

    if (!addedLike) {
      return this._likeRepository.addLikeToComment({ commentId, owner });
    }

    return this._likeRepository.deleteLikeToComment({ commentId, owner });
  }
}

module.exports = LikeToCommentUseCase;
