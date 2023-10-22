const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentsUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, credentialId, threadId) {
    const newComment = new NewComment(useCasePayload, credentialId, threadId);
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentsUseCase;
