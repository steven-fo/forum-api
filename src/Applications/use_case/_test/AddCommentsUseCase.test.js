const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../Domains/threads/ThreadsRepository');
const CommentRepository = require('../../../Domains/comments/CommentsRepository');
const AddCommentsUseCase = require('../AddCommentsUseCase');

describe('AddCommentsUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const user = {
      id: 'user-123',
      username: 'dicoding',
    };

    const thread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    const useCasePayload = {
      content: 'sebuah comment',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    /** creating use case instance */
    const getCommentsUseCase = new AddCommentsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await getCommentsUseCase.execute(useCasePayload, user.id, thread.id);

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    }));

    expect(mockThreadRepository.verifyThread).toBeCalledWith(thread.id);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment(useCasePayload, user.id, thread.id),
    );
  });
});
