/* eslint-disable max-len */
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadsRepository');
const CommentRepository = require('../../../Domains/comments/CommentsRepository');

describe('DeleteCommentUseCase', () => {
  it('should be orchestrating the delete comment action correctly', async () => {
    // Arrange
    const user = {
      id: 'user-123',
      username: 'dicoding',
    };

    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getCommentsUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await getCommentsUseCase.execute(user.id, useCaseParams.threadId, useCaseParams.commentId);

    // Assert
    expect(mockThreadRepository.verifyThread).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.verifyComment).toBeCalledWith(useCaseParams.commentId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCaseParams.commentId, user.id);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCaseParams.commentId);
  });
});
