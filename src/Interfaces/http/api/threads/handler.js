const autoBind = require('auto-bind');
const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');
const FindThreadUseCase = require('../../../../Applications/use_case/threads/FindThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const useCasePayload = {
      ...request.payload,
      owner,
    };
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request) {
    const findThreadUseCase = this._container.getInstance(FindThreadUseCase.name);
    const thread = await findThreadUseCase.execute(request.params);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
