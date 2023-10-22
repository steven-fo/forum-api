class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(credentialId, threadId, commentId) {
    this._commentRepository.deleteComment(credentialId, threadId, commentId);
  }
}

module.exports = DeleteCommentUseCase;
