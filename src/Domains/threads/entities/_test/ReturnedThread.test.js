const ReturnedThread = require('../ReturnedThread');

describe('ReturnedThread', () => {
  it('should throw an error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah judul',
      body: 'sebuah body',
      username: 'johndoe',
      date: new Date(),
    };

    // Action & Assert
    expect(() => new ReturnedThread(payload)).toThrowError('RETURNED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 'thread-123',
      title: 'sebuah judul',
      body: 'sebuah body',
      username: 'johndoe',
      date: new Date(),
      comments: 'sebuah comments',
    };
    const payload2 = {
      id: 'thread-223',
      title: 'sebuah judul',
      body: 'sebuah body',
      username: 'dicoding',
      date: 123,
      comments: [],
    };
    const payload3 = {
      id: 123,
      title: 'sebuah judul',
      body: 'sebuah body',
      username: 'dicoding',
      date: new Date(),
      comments: [],
    };

    // Action & Assert
    expect(() => new ReturnedThread(payload1)).toThrowError('RETURNED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ReturnedThread(payload2)).toThrowError('RETURNED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ReturnedThread(payload3)).toThrowError('RETURNED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw an error if an array of comments did not contain object with needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah judul thread',
      body: 'sebuah body thread',
      username: 'dicoding',
      date: new Date(),
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          content: 'sebuah komentar',
          date: new Date(),
          replies: [],
        },
        {
          id: 'comment-223',
          username: 'developer',
          content: 'sebuah komentar',
          replies: [],
        },
      ],
    };

    // Action & Assert
    expect(() => new ReturnedThread(payload)).toThrowError('RETURNED_THREAD.COMMENTS_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error if an array of comments did not contain object with property that meets data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah judul thread',
      body: 'sebuah body thread',
      username: 'dicoding',
      date: new Date(),
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          content: 'sebuah komentar',
          date: new Date(),
          replies: [],
        },
        {
          id: 'comment-223',
          username: 'developer',
          content: 'sebuah komentar',
          date: 123,
          replies: [],
        },
      ],
    };

    // Action & Assert
    expect(() => new ReturnedThread(payload)).toThrowError('RETURNED_THREAD.COMMENTS_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw an error if an array of replies of each comments of thread did not contain object with needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah judul thread',
      body: 'sebuah body thread',
      username: 'dicoding',
      date: new Date(),
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          content: 'sebuah komentar',
          date: new Date(),
          replies: [
            {
              id: 'comment-123',
              username: 'johndoe',
              content: 'sebuah komentar',
            },
          ],
        },
      ],
    };

    // Action & Assert
    expect(() => new ReturnedThread(payload)).toThrowError('RETURNED_THREAD.REPLIES_OF_COMMENTS_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error if  an array of replies of each comments of thread did not contain object with property that meets data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah judul thread',
      body: 'sebuah body thread',
      username: 'dicoding',
      date: new Date(),
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          content: 'sebuah komentar',
          date: new Date(),
          replies: [
            {
              id: 'comment-123',
              username: 'johndoe',
              content: 'sebuah komentar',
              date: 123,
            },
          ],
        },
      ],
    };

    // Action & Assert
    expect(() => new ReturnedThread(payload)).toThrowError('RETURNED_THREAD.REPLIES_OF_COMMENTS_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
