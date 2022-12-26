const RefreshAuth = require('../RefreshAuth');

describe('RefreshAuth entity', () => {
  it('should throw an error when payload did not contain needed property', () => {
    expect(() => new RefreshAuth({})).toThrowError('REFRESH_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet data type specification', () => {
    expect(() => new RefreshAuth({ refreshToken: 1234 })).toThrowError('REFRESH_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create RefreshToken entity correctly', () => {
    // Arrange & Action
    const refreshAuth = new RefreshAuth({ refreshToken: 'refresh_token' });

    // Assert
    expect(refreshAuth).toBeInstanceOf(RefreshAuth);
    expect(refreshAuth.refreshToken).toEqual('refresh_token');
  });
});
