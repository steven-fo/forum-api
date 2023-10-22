const NewReply = require('../../Domains/replies/entities/NewReply');

class AddRepliesUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, credentialId, threadId, commentId) {
    const newReply = new NewReply(useCasePayload, credentialId, threadId, commentId);
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddRepliesUseCase;
