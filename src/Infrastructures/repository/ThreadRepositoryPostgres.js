const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { title, body, owner } = addThread;
    const id = `thread-${this._idGenerator()}`;

    await this._pool.query('INSERT INTO "commentable" VALUES($1)', [id]);

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getThreadById(id) {
    const query = `SELECT
                      t.id,
                      t.title,
                      t.body,
                      t.date,
                      u.username
                    FROM 
                      threads AS t
                    JOIN
                      users u ON t.owner = u.id
                    WHERE
                      t.id = $1`;

    const result = await this._pool.query(query, [id]);

    if (!result.rowCount) throw new NotFoundError('thread tidak ditemukan');

    return result.rows[0];
  }

  async checkAvailabilityThreadById(id) {
    const result = await this._pool.query('SELECT id FROM threads WHERE id = $1', [id]);

    if (!result.rowCount) throw new NotFoundError('thread tidak ditemukan');
  }
}

module.exports = ThreadRepositoryPostgres;
