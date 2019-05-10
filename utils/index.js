const response = require('./responseHandlers');
const auth = require('./auth');
const game = require('./game');
const contest = require('./contest');

const getMaxParticipants = (matchType) => {
  if (matchType == "3 v 3") return 6;
  if (matchType == "5 v 5") return 10;
  return 0;
}

module.exports = {
  response,
  auth,
  game,
  contest,
  getMaxParticipants
};
