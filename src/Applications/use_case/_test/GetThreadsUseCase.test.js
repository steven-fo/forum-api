const ThreadRepository = require('../../../Domains/threads/ThreadsRepository');
const CommentRepository = require('../../../Domains/comments/CommentsRepository');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const GetThreadsUseCase = require('../GetThreadsUseCase');

describe('GetThreadsUseCase', () => {
  it('should orchestrating the get threads action correctly', async () => {
    // Arrange
    const user = {
      id: 'user-123',
      username: 'dicoding',
    };

    const useCaseParams = {
      threadId: 'thread-123',
    };

    const thread = {
      id: useCaseParams.threadId,
      title: 'sebuah thread',
      body: 'sebuah thread body',
      date: '2023:10:24',
      username: user.username,
    };

    let expectedComment = [
      {
        id: 'comment-123',
        username: user.username,
        date: '2023:10:24',
        content: 'sebuah comment',
        is_delete: false,
      },
    ];
    expectedComment = expectedComment.map((komen) => {
      const comment = new GetComment(komen);
      const {
        id, content, username, date,
      } = comment;
      return {
        id, content, username, date,
      };
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: useCaseParams.threadId,
        title: 'sebuah thread',
        body: 'sebuah thread body',
        date: '2023:10:24',
        username: user.username,
      }));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          content: 'sebuah comment',
          date: '2023:10:24',
          username: user.username,
          is_delete: false,
        },
      ]));

    /** creating use case instance */
    const getThreadsUseCase = new GetThreadsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const getThreads = await getThreadsUseCase.execute(useCaseParams.threadId);

    // Assert
    expect(getThreads).toEqual({
      ...thread,
      comments: expectedComment,
    });

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParams.threadId);
  });
});
