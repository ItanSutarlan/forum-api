class FindThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute({ id }) {
    this._verifyPaylod(id);
    const thread = await this._threadRepository.getThreadById(id);
    const comments = await this._commentRepository.getCommentsById(id);

    return {
      ...thread,
      comments,
    };
  }

  _verifyPaylod(id) {
    if (!id) throw new Error('FIND_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    if (typeof id !== 'string') throw new Error('FIND_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = FindThreadUseCase;
