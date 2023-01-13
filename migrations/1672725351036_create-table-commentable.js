exports.up = (pgm) => {
  pgm.createTable('commentable', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('commentable');
};
