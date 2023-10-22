const AddCommentsUseCase = require('../../../../Applications/use_case/AddCommentsUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentsHandler = this.postCommentsHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
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
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(credentialId, threadId, commentId);
    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = CommentsHandler;
