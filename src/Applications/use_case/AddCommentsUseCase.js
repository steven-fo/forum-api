const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentsUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, credentialId, threadId) {
    const newComment = new NewComment(useCasePayload, credentialId, threadId);
    await this._threadRepository.verifyThread(threadId);
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentsUseCase;
