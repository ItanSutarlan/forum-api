class ReturnedThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, title, body, date, username, comments,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload(payload) {
    this._verifyThread(payload);
    const { comments } = payload;
    this._verifyComments({ comments });
  }

  _verifyThread({
    id, title, body, date, username, comments,
  }) {
    if (!id || !title || !body || !date || !username || !comments) {
      throw new Error('RETURNED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || !(date instanceof Date) || typeof username !== 'string' || !(Array.isArray(comments))) {
      throw new Error('RETURNED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyComments({ comments }) {
    comments.forEach((comment) => {
      const {
        id, username, content, date, replies,
      } = comment;

      if (!id || !username || !content || !date || !replies) {
        throw new Error('RETURNED_THREAD.COMMENTS_NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string' || !(date instanceof Date) || !(Array.isArray(replies))) {
        throw new Error('RETURNED_THREAD.COMMENTS_NOT_MEET_DATA_TYPE_SPECIFICATION');
      }

      this._verifyReplies({ replies });
    });
  }

  _verifyReplies({ replies }) {
    replies.forEach((reply) => {
      const {
        id, username, content, date,
      } = reply;

      if (!id || !username || !content || !date) {
        throw new Error('RETURNED_THREAD.REPLIES_OF_COMMENTS_NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string' || !(date instanceof Date)) {
        throw new Error('RETURNED_THREAD.REPLIES_OF_COMMENTS_NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    });
  }
}

module.exports = ReturnedThread;
