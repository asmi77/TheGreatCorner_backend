var config = {};

config.mongoURI = {
  development: 'mongodb://localhost:27017/mocha-testing',
  test: 'mongodb://localhost:27017/mocha-test'
};

module.exports = config;