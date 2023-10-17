const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadsHandler,
    options: {
      auth: '',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
  },
]);

module.exports = routes;
