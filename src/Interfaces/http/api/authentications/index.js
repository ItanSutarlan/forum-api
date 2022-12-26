const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  register: async (server, { container }) => {
    const autenticationsHandler = new AuthenticationsHandler(container);
    server.route(routes(autenticationsHandler));
  },
};
