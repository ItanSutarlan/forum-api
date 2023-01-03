const AuthenticationRepository = require('../../../../Domains/authentications/AuthenticationRepository');
const RefreshAuth = require('../../../../Domains/authentications/entities/RefreshAuth');
const LogoutUserUseCase = require('../LogoutUserUseCase');

jest.mock('../../../../Domains/authentications/entities/RefreshAuth');

describe('LogoutUserUseCase', () => {
  it('should orchestrate the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };
    RefreshAuth.mockReturnValue({ refreshToken: useCasePayload.refreshToken });
    const mockAuthenticationRepository = new AuthenticationRepository();
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    await logoutUserUseCase.execute(useCasePayload);

    // Assert
    expect(RefreshAuth).toBeCalledTimes(1);
    expect(RefreshAuth).toBeCalledWith(useCasePayload);
    expect(mockAuthenticationRepository.checkAvailabilityToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
  });
});
