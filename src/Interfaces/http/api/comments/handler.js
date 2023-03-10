const autoBind = require('auto-bind');
const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comments/DeleteCommentUseCase');
const LikeToCommentUseCase = require('../../../../Applications/use_case/likes/LikeToCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId: parentId } = request.params;
    const { content } = request.payload;

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute({ content, owner, parentId });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request) {
    const { id: owner } = request.auth.credentials;
    const {
      threadId: parentId,
      commentId: id,
    } = request.params;

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute({ id, owner, parentId });

    return {
      status: 'success',
    };
  }

  async putLikeToCommentHandler(request) {
    const { id: owner } = request.auth.credentials;
    const { commentId, threadId } = request.params;

    const likeToCommentUseCase = this._container.getInstance(LikeToCommentUseCase.name);
    await likeToCommentUseCase.execute({ commentId, owner, threadId });

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
