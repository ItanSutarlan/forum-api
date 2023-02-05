const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addLikeToComment({ commentId, owner }) {
    const query = {
      text: 'INSERT INTO likes(comment_id, owner) VALUES($1, $2) RETURNING *',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async getLikeToComment({ commentId, owner }) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2;',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);
    return result.rowCount;
  }

  async deleteLikeToComment({ commentId, owner }) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2;',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }
}

module.exports = LikeRepositoryPostgres;
