const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const {
      content, owner, parentId,
    } = addComment;
    const id = `comment-${this._idGenerator()}`;

    await this._pool.query('INSERT INTO commentable(id) VALUES($1)', [id]);
    const query = {
      text: 'INSERT INTO comments(id, content, owner, parent_id) VALUES($1, $2, $3, $4) RETURNING id, content, owner;',
      values: [id, content, owner, parentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getCommentsByParentId(parentId) {
    const query = `WITH cte_likes AS (
                    SELECT
                      comment_id, COUNT(*)::int AS total_likes
                    FROM
                      likes
                    GROUP BY comment_id
                  )
                  SELECT
                    c.id,
                    c.content,
                    u.username,
                    c.date,
                    COALESCE(l.total_likes, 0) AS likes,
                    c.is_deleted
                  FROM
                    comments AS c
                  INNER JOIN
                    users AS u ON c.owner = u.id
                  LEFT JOIN
                    cte_likes AS l ON c.id = l.comment_id
                  WHERE
                    c.parent_id = $1
                  ORDER BY
                    date ASC;`;

    const result = await this._pool.query(query, [parentId]);

    return result.rows;
  }

  async checkAvailabilityComment({ id, parentId }) {
    const result = await this._pool.query('SELECT id FROM comments WHERE id = $1 AND parent_id = $2', [id, parentId]);

    if (!result.rowCount) throw new NotFoundError('thread atau comment id tidak valid');
  }

  async verifyCommentOwner({ id, owner }) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }

  async deleteCommentById(id) {
    const query = {
      text: `UPDATE comments
             SET is_deleted = true
             WHERE id = $1`,
      values: [id],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
