/* eslint-disable max-len */
const AddRepliesUseCase = require('../../../../Applications/use_case/AddRepliesUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postRepliesHandler = this.postRepliesHandler.bind(this);
  }

  async postRepliesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const addRepliesUseCase = this._container.getInstance(AddRepliesUseCase.name);
    const addedReply = await addRepliesUseCase.execute(request.payload, credentialId, threadId, commentId);
    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute(credentialId, threadId, commentId, replyId);
    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = RepliesHandler;
