const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadsRepository');
const AddThreadsUseCase = require('../AddThreadsUseCase');

describe('AddThreadsUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const user = {
      id: 'user-123',
      username: 'dicoding',
    };

    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** creating use case instance */
    const getThreadsUseCase = new AddThreadsUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadsUseCase.execute(useCasePayload, user.id);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: 'user-123',
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread(useCasePayload, user.id));
  });
});
