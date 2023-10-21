const AddThreadsUseCase = require('../../../../Applications/use_case/AddThreadsUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadsHandler = this.postThreadsHandler.bind(this);
  }

  async postThreadsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const addThreadsUseCase = this._container.getInstance(AddThreadsUseCase.name);
    const addedThread = await addThreadsUseCase.execute(request.payload, credentialId);
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
