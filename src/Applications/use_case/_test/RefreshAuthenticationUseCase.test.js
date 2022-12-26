const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const RefreshAuth = require('../../../Domains/authentications/entities/RefreshAuth');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase');

jest.mock('../../../Domains/authentications/entities/RefreshAuth');

describe('RefreshAuthenticationUseCase', () => {
  it('should orchestrate the RefreshAuthenticationUseCase action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'any_refresh_token',
    };
    // mocking domain entities
    RefreshAuth.mockReturnValue({
      refreshToken: useCasePayload.refreshToken,
    });
    // mocking repository and services
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.verifyRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'user-123',
        username: 'dicoding',
      }));
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve('new_access_token'));
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(RefreshAuth).toBeCalledTimes(1);
    expect(RefreshAuth).toBeCalledWith(useCasePayload);
    expect(mockAuthenticationTokenManager.verifyRefreshToken)
      .toBeCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.checkAvailabilityToken)
      .toBeCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload)
      .toBeCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toBeCalledWith({
        id: 'user-123',
        username: 'dicoding',
      });
    expect(accessToken).toEqual('new_access_token');
  });
});
