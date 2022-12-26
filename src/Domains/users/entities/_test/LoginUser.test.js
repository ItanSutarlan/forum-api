const LoginUser = require('../LoginUser');

describe('LoginUser entities', () => {
  it('should throw an error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
    };

    // Action & Assert
    expect(() => new LoginUser(payload)).toThrowError('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 1234,
    };

    // Action & Assert
    expect(() => new LoginUser(payload)).toThrowError('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create LoginUser entities when the payload is correct', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: '123456',
    };

    // Action
    const loginUser = new LoginUser(payload);

    // Assert
    expect(loginUser).toBeInstanceOf(LoginUser);
    expect(loginUser.username).toEqual(payload.username);
    expect(loginUser.password).toEqual(payload.password);
  });
});
