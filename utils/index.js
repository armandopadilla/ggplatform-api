const response = require('./responseHandlers');
const auth = require('./auth');
const game = require('./game');
const contest = require('./contest');

module.exports = {
  response,
  auth,
  game,
  contest,
};
