class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(credentialId, threadId, commentId, replyId) {
    this._replyRepository.deleteReply(credentialId, threadId, commentId, replyId);
  }
}

module.exports = DeleteReplyUseCase;
