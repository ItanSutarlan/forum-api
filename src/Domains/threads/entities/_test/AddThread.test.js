const AddThread = require('../AddThread');

describe('AddThread', () => {
  it('should throw an error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Sebuah Thread',
      body: 'Sebuah body',
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: true,
      body: 123,
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread entities when the payload is correct', () => {
    // Arrange
    const payload = {
      title: 'Title Thread',
      body: 'Body sebuah thread',
      owner: 'user-123',
    };

    // Action
    const addThread = new AddThread(payload);

    // Assert
    expect(addThread).toBeInstanceOf(AddThread);
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
    expect(addThread.owner).toEqual(payload.owner);
  });
});
