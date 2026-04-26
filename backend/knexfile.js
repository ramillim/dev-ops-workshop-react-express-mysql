const { database } = require('./src/config');

module.exports = {
  client: 'mysql2',
  connection: database,
  migrations: {
    directory: './migrations'
  }
};
