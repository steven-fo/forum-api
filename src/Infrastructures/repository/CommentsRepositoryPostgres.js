const CommentsRepository = require('../../Domains/comments/CommentsRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentsRepositoryPostgres extends CommentsRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const { content, credentialId, threadId } = newComment;

    await this.verifyThread(threadId);

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, credentialId, date, content, threadId],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(credentialId, threadId, commentId) {
    await this.verifyThread(threadId);
    await this.verifyComment(commentId);
    await this.verifyCommentOwner(commentId, credentialId);

    const query = {
      text: 'DELETE FROM comments WHERE id = $1',
      values: [commentId],
    };
    await this._pool.query(query);
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
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, credentialId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, credentialId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('kredensial yang diberikan salah');
    }
  }
}

module.exports = CommentsRepositoryPostgres;
