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

  async getCommentsById(id) {
    const query = `WITH RECURSIVE comments_cte (
                    id,
                    path,
                    username,
                    date,
                    content
                  ) AS (
                    SELECT
                      c.id,
                      concat('/', c.parent_id),
                      u.username,
                      c.date,
                      CASE
                        WHEN c.is_deleted THEN '**komentar telah dihapus**'
                        ELSE c.content
                      END AS content
                    FROM
                      "comments" AS c
                    JOIN
                      users AS u ON c.owner = u.id
                    WHERE
                      parent_id = $1
                    UNION ALL
                    SELECT
                      r.id,
                      concat(path, '/', r.parent_id),
                      users.username,
                      r.date,
                      CASE
                        WHEN r.is_deleted THEN '**balasan telah dihapus**'
                        ELSE r.content
                      END AS content
                    FROM
                      "comments" r
                      JOIN
                        users ON r.owner = users.id
                      JOIN
                        comments_cte ON comments_cte.id = r.parent_id
                  )
                  SELECT
                    *
                  FROM
                    comments_cte
                  ORDER BY
                    date ASC;`;

    const result = await this._pool.query(query, [id]);

    return this._getNestedRepliesRecursively(`/${id}`, result.rows);
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

  _getNestedRepliesRecursively(path, comments) {
    const result = comments.filter((comment) => comment.path === path);
    if (!result.length) {
      return [];
    }

    return result.map(({
      id, date, content, username,
    }) => {
      const comment = {
        id,
        username,
        content,
        date,
      };
      const replies = this._getNestedRepliesRecursively(`${path}/${id}`, comments);
      if (!replies.length) {
        return comment;
      }
      comment.replies = replies;
      return comment;
    });
  }
}

module.exports = CommentRepositoryPostgres;
