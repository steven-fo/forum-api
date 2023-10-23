const AddThreadsUseCase = require('../../../../Applications/use_case/AddThreadsUseCase');
const GetThreadsUseCase = require('../../../../Applications/use_case/GetThreadsUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadsHandler = this.postThreadsHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
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

  async getThreadByIdHandler(request, h) {
    const { threadId } = request.params;
    const getThreadsUseCase = this._container.getInstance(GetThreadsUseCase.name);
    const thread = await getThreadsUseCase.execute(threadId);
    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    return response;
  }
}

module.exports = ThreadsHandler;
