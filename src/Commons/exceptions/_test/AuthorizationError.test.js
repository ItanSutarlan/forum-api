const AuthorizationError = require('../AuthorizationError');

describe('AuthorizationError', () => {
  it('should create an error correctly', () => {
    const invariantError = new AuthorizationError('an error occurs');

    expect(invariantError.statusCode).toEqual(403);
    expect(invariantError.message).toEqual('an error occurs');
    expect(invariantError.name).toEqual('AuthorizationError');
  });
});
