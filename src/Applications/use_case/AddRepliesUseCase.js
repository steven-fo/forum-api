const NewReply = require('../../Domains/replies/entities/NewReply');

class AddRepliesUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, credentialId, threadId, commentId) {
    const newReply = new NewReply(useCasePayload, credentialId, threadId, commentId);
    await this._replyRepository.verifyThread(threadId);
    await this._replyRepository.verifyComment(commentId);
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddRepliesUseCase;
