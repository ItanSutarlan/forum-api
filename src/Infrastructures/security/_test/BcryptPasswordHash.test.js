const bcrypt = require('bcrypt');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const BcryptPasswordHash = require('../BcryptPasswordHash');

afterEach(() => {
  jest.restoreAllMocks();
});

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Assert
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toBeCalledWith('plain_password', 10); // 10 adalah nilai saltRound default untuk BcryptPasswordHash
    });
  });

  describe('comparePassword function', () => {
    it('should throw an AuthenticationError if password did not match', async () => {
      // Arrange
      const spyComparePassword = jest.spyOn(bcrypt, 'compare');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Act & Assert
      await expect(bcryptPasswordHash.comparePassword('plain_password', 'encrypted_password'))
        .rejects.toThrow(AuthenticationError);
      expect(spyComparePassword).toBeCalledTimes(1);
      expect(spyComparePassword).toBeCalledWith('plain_password', 'encrypted_password');
    });

    it('should not throw an AuthenticationError if password match', async () => {
      // Arrange
      const spyComparePassword = jest.spyOn(bcrypt, 'compare');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const plainPassword = 'secret';
      const encryptedPassword = await bcryptPasswordHash.hash(plainPassword);

      // Act & Assert
      await expect(bcryptPasswordHash.comparePassword(plainPassword, encryptedPassword))
        .resolves.not.toThrow(AuthenticationError);
      expect(spyComparePassword).toBeCalledTimes(1);
      expect(spyComparePassword).toBeCalledWith(plainPassword, encryptedPassword);
    });
  });
});
