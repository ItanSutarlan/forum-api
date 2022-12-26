const PasswordHash = require('../PaswordHash');

describe('PasswordHash interface', () => {
  it('should throw an error when invoke abstract behavior', async () => {
    // Arrange
    const passwordHash = new PasswordHash();

    // Arrange and Assert
    await expect(passwordHash.hash('dummy_password')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
    await expect(passwordHash.comparePassword('plain', 'encrypted')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  });
});
