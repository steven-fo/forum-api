class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(credentialId, threadId, commentId, replyId) {
    await this._replyRepository.verifyThread(threadId);
    await this._replyRepository.verifyComment(commentId);
    await this._replyRepository.verifyReply(replyId);
    await this._replyRepository.verifyReplyOwner(credentialId, replyId);
    this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
