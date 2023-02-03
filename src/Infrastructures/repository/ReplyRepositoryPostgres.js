const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReplyToComment(addReply) {
    const {
      content, owner, parentId,
    } = addReply;
    const id = `reply-${this._idGenerator()}`;

    await this._pool.query('INSERT INTO commentable(id) VALUES($1)', [id]);
    const query = {
      text: 'INSERT INTO comments(id, content, owner, parent_id) VALUES($1, $2, $3, $4) RETURNING id, content, owner;',
      values: [id, content, owner, parentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getRepliesToComment(commentId) {
    const query = `SELECT
                    r.*, u.username
                  FROM
                    comments AS r
                  INNER JOIN
                    users AS u ON r.owner = u.id
                  WHERE
                    r.parent_id = ANY($1::text[])
                  ORDER BY
                    date ASC;`;

    const result = await this._pool.query(query, [commentId]);

    return result.rows;
  }

  async checkAvailabilityReply({ id, parentId }) {
    const result = await this._pool.query('SELECT id FROM comments WHERE id = $1 AND parent_id = $2', [id, parentId]);

    if (!result.rowCount) throw new NotFoundError('comment atau reply id tidak valid');
  }

  async verifyReplyOwner({ id, owner }) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }

  async deleteReplyById(id) {
    const query = {
      text: `UPDATE comments
             SET is_deleted = true
             WHERE id = $1`,
      values: [id],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
