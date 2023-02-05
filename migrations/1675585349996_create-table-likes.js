exports.up = (pgm) => {
  pgm.createTable('likes', {
    comment_id: {
      type: 'VARCHAR(50)',
      references: 'comments',
      onDelete: 'cascade',
    },
    owner: {
      type: 'VARCHAR(50)',
      references: 'users',
      onDelete: 'cascade',
    },
  }, {
    constraints: {
      primaryKey: ['comment_id', 'owner'],
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
