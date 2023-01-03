const UserRepository = require('../../../../Domains/users/UserRepository');
const AuthenticationRepository = require('../../../../Domains/authentications/AuthenticationRepository');
const LoginUser = require('../../../../Domains/users/entities/LoginUser');
const PasswordHash = require('../../../security/PaswordHash');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManager');
const NewAuth = require('../../../../Domains/authentications/entities/NewAuth');
const LoginUserUseCase = require('../LoginUserUsecase');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  LoginUser.mockClear();
});

jest.mock('../../../../Domains/users/entities/LoginUser', () => jest.fn().mockImplementationOnce((payload) => ({
  username: payload.username,
  password: payload.password,
})));

describe('GetAuthenticationUseCase', () => {
  it('should orchestrate the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };

    const expectedAuthentication = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockAuthenticationRepository = new AuthenticationRepository();

    // Mocking
    mockUserRepository.getPasswordByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockPasswordHash.comparePassword = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('user-123'));
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAuthentication.accessToken));
    mockAuthenticationTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAuthentication.refreshToken));
    mockAuthenticationRepository.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Create use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(LoginUser).toBeCalledWith(useCasePayload);
    expect(mockUserRepository.getPasswordByUsername)
      .toBeCalledWith('dicoding');
    expect(mockPasswordHash.comparePassword)
      .toBeCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getIdByUsername)
      .toBeCalledWith('dicoding');
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationTokenManager.createRefreshToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationRepository.addToken)
      .toBeCalledWith(expectedAuthentication.refreshToken);
    expect(actualAuthentication).toStrictEqual(new NewAuth(expectedAuthentication));
  });
});
