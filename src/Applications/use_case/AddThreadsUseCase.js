const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadsUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, credentialId) {
    const newThread = new NewThread(useCasePayload, credentialId);
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadsUseCase;
