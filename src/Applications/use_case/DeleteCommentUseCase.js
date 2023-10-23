class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(credentialId, threadId, commentId) {
    await this._commentRepository.verifyThread(threadId);
    await this._commentRepository.verifyComment(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, credentialId);
    this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
