class FindThreadUseCase {
  constructor({
    threadRepository,
    replyRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute({ id }) {
    this._verifyPaylod(id);
    const thread = await this._threadRepository.getThreadById(id);
    const comments = await this._commentRepository.getCommentsByParentId(id);

    thread.comments = await Promise.all(comments.map(async (comment) => ({
      ...this._mapCommentToModel(comment),
      replies: await this._getReplies(comment.id),
    })));

    return thread;
  }

  _verifyPaylod(id) {
    if (!id) throw new Error('FIND_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    if (typeof id !== 'string') throw new Error('FIND_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }

  async _getReplies(parentId) {
    const replies = await this._replyRepository.getRepliesToComment(parentId);

    const mappedReplies = replies.map((reply) => this._mapReplyToModel(reply));

    return mappedReplies;
  }

  _mapCommentToModel({
    id, username, content, date, is_deleted: isDeleted,
  }) {
    return {
      id,
      username,
      content: isDeleted ? '**komentar telah dihapus**' : content,
      date,
    };
  }

  _mapReplyToModel({
    id, username, content, date, is_deleted: isDeleted,
  }) {
    return {
      id,
      username,
      content: isDeleted ? '**balasan telah dihapus**' : content,
      date,
    };
  }
}

module.exports = FindThreadUseCase;
