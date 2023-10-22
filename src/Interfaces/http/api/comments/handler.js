const AddCommentsUseCase = require('../../../../Applications/use_case/AddCommentsUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentsHandler = this.postCommentsHandler.bind(this);
  }

  async postCommentsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;
    const addCommentsUseCase = this._container.getInstance(AddCommentsUseCase.name);
    const addedComment = await addCommentsUseCase.execute(request.payload, credentialId, threadId);
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentByIdHandler(request, h) {
  }
}

module.exports = CommentsHandler;
