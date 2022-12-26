const RefreshAuth = require('../../Domains/authentications/entities/RefreshAuth');

class LogoutUserUseCase {
  constructor({
    authenticationRepository,
  }) {
    this._authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload) {
    const { refreshToken } = new RefreshAuth(useCasePayload);
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }
}

module.exports = LogoutUserUseCase;
