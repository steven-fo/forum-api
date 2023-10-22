const RepliesRepository = require('../../Domains/replies/RepliesRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class RepliesRepositoryPostgres extends RepliesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const {
      content, credentialId, threadId, commentId,
    } = newReply;

    await this.verifyThread(threadId);
    await this.verifyComment(commentId);

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, date, credentialId, threadId, commentId, false],
    };
    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async verifyThread(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async verifyComment(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komen tidak ditemukan');
    }
  }

  async verifyReply(replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async verifyReplyOwner(credentialId, replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [credentialId, replyId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('kredensial yang diberikan salah');
    }
  }
}

module.exports = RepliesRepositoryPostgres;
