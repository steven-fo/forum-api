const GetComment = require('../../Domains/comments/entities/GetComment');

class GetThreadsUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    let getComment = await this._commentRepository.getCommentByThreadId(threadId);
    getComment = getComment.map((komen) => {
      const comment = new GetComment(komen);
      const {
        id, username, date, content,
      } = comment;
      return {
        id, username, date, content,
      };
    });

    const result = {
      ...thread,
      comments: getComment,
    };
    return result;
  }
}

module.exports = GetThreadsUseCase;
