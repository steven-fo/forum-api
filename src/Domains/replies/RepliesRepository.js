class RepliesRepository {
  async addReply(newReply) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReply(replyId) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyThread(threadId) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  
  async verifyComment(commentId) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReply(replyId) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyOwner(credentialId, replyId) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = RepliesRepository;
