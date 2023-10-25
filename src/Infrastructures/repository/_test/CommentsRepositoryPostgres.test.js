/* eslint-disable max-len */
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadsRepositoryPostgres = require('../ThreadsRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const CommentsRepositoryPostgres = require('../CommentsRepositoryPostgres');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentsRepository postgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should add new comment to database', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const userRepository = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      const registeredUser = await userRepository.addUser(registerUser);
      const threadRepository = new ThreadsRepositoryPostgres(pool, fakeIdGenerator);
      const newThread = new NewThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
      }, registeredUser.id);
      const addedThread = await threadRepository.addThread(newThread);
      const newComment = new NewComment({
        content: 'sebuah comment',
      }, registeredUser.id, addedThread.id);
      const commentRepository = new CommentsRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepository.addComment(newComment);

      // Assert
      const addedComment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(addedComment).toStrictEqual({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      });
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment from database', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const userRepository = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      const registeredUser = await userRepository.addUser(registerUser);
      const threadRepository = new ThreadsRepositoryPostgres(pool, fakeIdGenerator);
      const newThread = new NewThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
      }, registeredUser.id);
      const addedThread = await threadRepository.addThread(newThread);
      const newComment = new NewComment({
        content: 'sebuah comment',
      }, registeredUser.id, addedThread.id);
      const commentRepository = new CommentsRepositoryPostgres(pool, fakeIdGenerator);
      const addedComment = await commentRepository.addComment(newComment);
      const commentId = addedComment.id;

      // Action & Assert
      await commentRepository.deleteComment(commentId);
      const comment = new AddedComment(await CommentsTableTestHelper.findCommentById(commentId));
      expect(comment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      }));
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should get comment details correctly from database', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const userRepository = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      const registeredUser = await userRepository.addUser(registerUser);
      const threadRepository = new ThreadsRepositoryPostgres(pool, fakeIdGenerator);
      const newThread = new NewThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
      }, registeredUser.id);
      const addedThread = await threadRepository.addThread(newThread);
      const newComment = new NewComment({
        content: 'sebuah comment',
      }, registeredUser.id, addedThread.id);
      const commentRepository = new CommentsRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepository.addComment(newComment);

      // Action
      const getComment = await commentRepository.getCommentByThreadId(addedThread.id);

      // Assert
      expect(getComment).toHaveLength(1);
    });
  });

  describe('verifyThread function', () => {
    it('should return 404 when thread not found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const userRepository = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      await userRepository.addUser(registerUser);
      const commentRepository = new CommentsRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepository.verifyThread('xxx')).rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyComment function', () => {
    it('should return 404 when comment not found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const userRepository = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      const registeredUser = await userRepository.addUser(registerUser);
      const threadRepository = new ThreadsRepositoryPostgres(pool, fakeIdGenerator);
      const newThread = new NewThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
      }, registeredUser.id);
      await threadRepository.addThread(newThread);
      const commentRepository = new CommentsRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepository.verifyComment('xxx')).rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should return 403 when user without access', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const fakeIdGenerator2 = () => '234';
      const userRepository = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const userRepository2 = new UserRepositoryPostgres(pool, fakeIdGenerator2);
      const registerUser1 = new RegisterUser({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      const registeredUser = await userRepository.addUser(registerUser1);
      const registerUser2 = new RegisterUser({
        username: 'user123',
        password: 'not secret',
        fullname: 'Sebuah nama',
      });
      const registeredUser2 = await userRepository2.addUser(registerUser2);
      const threadRepository = new ThreadsRepositoryPostgres(pool, fakeIdGenerator);
      const newThread = new NewThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
      }, registeredUser.id);
      const addedThread = await threadRepository.addThread(newThread);
      const newComment = new NewComment({
        content: 'sebuah comment',
      }, registeredUser.id, addedThread.id);
      const commentRepository = new CommentsRepositoryPostgres(pool, fakeIdGenerator);
      const addedComment = await commentRepository.addComment(newComment);
      const commentId = addedComment.id;

      // Action & Assert
      await expect(commentRepository.verifyCommentOwner(commentId, registeredUser2.id)).rejects.toThrow(AuthorizationError);
    });
  });
});
