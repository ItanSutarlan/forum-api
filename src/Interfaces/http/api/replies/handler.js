const autoBind = require('auto-bind');
const AddReplyUseCase = require('../../../../Applications/use_case/replies/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/replies/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postReplyHanlder(request, h) {
    const {
      threadId: grandParentId,
      commentId: parentId,
    } = request.params;
    const { content } = request.payload;
    const { id: owner } = request.auth.credentials;

    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute({
      content,
      owner,
      parentId,
      grandParentId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request) {
    const {
      threadId: grandParentId,
      commentId: parentId,
      replyId: id,
    } = request.params;
    const { id: owner } = request.auth.credentials;

    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute({
      id, owner, parentId, grandParentId,
    });

    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
