const RefreshAuth = require('../../Domains/authentications/entities/RefreshAuth');

class RefreshAuthenticationUseCase {
  constructor({
    authenticationRepository,
    authenticationTokenManager,
  }) {
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    const { refreshToken } = new RefreshAuth(useCasePayload);

    await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
    const { id, username } = await this._authenticationTokenManager.decodePayload(refreshToken);
    const accessToken = await this._authenticationTokenManager.createAccessToken({
      id,
      username,
    });
    return accessToken;
  }
}

module.exports = RefreshAuthenticationUseCase;
