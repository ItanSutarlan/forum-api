const Jwt = require('@hapi/jwt');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const JwtTokenManager = require('../JwtTokenManager');

afterEach(() => {
  jest.restoreAllMocks();
});

describe('JwtTokenManager', () => {
  describe('createAcessToken function', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
        username: 'dicoding',
      };
      const spyGenerate = jest.spyOn(Jwt.token, 'generate').mockReturnValueOnce('mock_token');
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      // Action
      const accessToken = await jwtTokenManager
        .createAccessToken(payload);

      // Assert
      expect(spyGenerate)
        .toBeCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
        username: 'dicoding',
      };
      const spyGenerate = jest.spyOn(Jwt.token, 'generate').mockReturnValueOnce('mock_token');
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      // Action
      const refreshToken = await jwtTokenManager
        .createRefreshToken(payload);

      // Assert
      expect(spyGenerate)
        .toBeCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
      expect(spyGenerate)
        .toBeCalledTimes(1);
      expect(refreshToken).toEqual('mock_token');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw an InvariantError when verification failed', async () => {
      // Arrange
      const spyDecode = jest.spyOn(Jwt.token, 'decode').mockReturnValueOnce('artifacts');
      const spyVerify = jest.spyOn(Jwt.token, 'verify');
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .rejects
        .toThrow(InvariantError);
      expect(spyDecode).toBeCalledWith(refreshToken);
      expect(spyVerify).toBeCalledWith('artifacts', process.env.REFRESH_TOKEN_KEY);
    });

    it('should not throw InvariantError when refresh token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const spyDecode = jest.spyOn(Jwt.token, 'decode');
      const spyVerify = jest.spyOn(Jwt.token, 'verify');
      const refreshToken = await jwtTokenManager.createRefreshToken({ username: 'dicoding' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves
        .not.toThrow(InvariantError);
      expect(spyDecode).toBeCalledTimes(1);
      expect(spyDecode).toBeCalledWith(refreshToken);
      expect(spyVerify).toBeCalledTimes(1);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });
      const spyDecode = jest.spyOn(Jwt.token, 'decode');

      // Action
      const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken);

      // Action & Assert
      expect(spyDecode).toBeCalledTimes(1);
      expect(spyDecode).toBeCalledWith(accessToken);
      expect(expectedUsername).toEqual('dicoding');
    });
  });
});
