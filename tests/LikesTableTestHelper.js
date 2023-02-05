/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({ commentId, owner }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2)',
      values: [commentId, owner],
    };

    await pool.query(query);
  },

  async findLike({ commentId, owner }) {
    const query = {
      text: 'SELECT comment_id, owner FROM likes WHERE comment_id = $1 AND owner = $2;',
      values: [commentId, owner],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
