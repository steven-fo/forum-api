const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const ThreadsRepositoryPostgres = require('../ThreadsRepositoryPostgres');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadsRepository postgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread to database', async () => {
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

      // Action
      await threadRepository.addThread(newThread);

      // Assert
      const addedThread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(addedThread).toStrictEqual({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: 'user-123',
      });
    });
  });

  describe('getThreadById function', () => {
    it('should get thread details correctly', async () => {
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

      // Action
      const getThread = await threadRepository.getThreadById('thread-123');

      // Assert
      expect(getThread).toStrictEqual({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: getThread.date,
        username: 'dicoding',
      });
    });

    it('should return 404 when thread not found', async () => {
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

      // Action & Assert
      await expect(threadRepository.getThreadById('xxx')).rejects.toThrow(NotFoundError);
    });
  });
});
