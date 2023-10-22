class CommentsRepository {
  async addComment(newComment) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteComment(credentialId, threadId, commentId) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyThread(threadId) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyComment(commentId) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentOwner(credentialId, commentId) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentsRepository;
