const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddThread = require('../../../../Domains/threads/entities/AddThread');
const AddThreadUseCase = require('../AddThreadUseCase');

jest.mock('../../../../Domains/threads/entities/AddThread');

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Sebuah Judul',
      body: 'Sebuah text',
      owner: 'user-123',
    };

    // mocking
    /** mocking class constructor */
    AddThread.mockReturnValue(useCasePayload);

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'Sebuah Judul',
        body: 'Sebuah text',
      }));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(AddThread).toBeCalledWith(useCasePayload);
    expect(mockThreadRepository.addThread).toBeCalledWith(useCasePayload);
    expect(addedThread).toEqual({
      id: 'thread-123',
      title: 'Sebuah Judul',
      body: 'Sebuah text',
    });
  });
});
