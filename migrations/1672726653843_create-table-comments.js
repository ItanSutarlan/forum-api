exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      references: 'commentable',
      onDelete: 'cascade',
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
    parent_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'commentable',
      onDelete: 'cascade',
    },
    is_deleted: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    date: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
