/**
 * Game functionality
 *
 * 1. User/System (U/S) can create a game
 * 2. (U/S) can update a game.
 * 3. (U/S) can NOT delete a game for now if there are participants.
 * 4. (U/S) can fetch all games in the system.
 * 5. (U/S) can fetch a specifi game
 * 6. (U/S) can fetch a specific users games they've created or entered.
 * 7. User can join a game.  (hook - entering a game requires a fee)
 * 8. User can leave a game. (hook - give the entry fee back)
 */
const getMyGames = require('./routes/getMyGames');
const getGame = require('./routes/getGame');
const getGames = require('./routes/getGames');
const postCreateGame = require('./routes/postCreateGame');
const patchUpdateGame = require('./routes/patchUpdateGame');
const deleteRemoveGame = require('./routes/deleteRemoveGame');
const postJoin = require('./routes/postJoin');
const postLeave = require('./routes/postLeave');

module.exports = (fastify, opt, next) => {
  // GET - /game/my-games
  getMyGames(fastify);

  // GET - /game/:gameId
  getGame(fastify);

  // GET - /game/list
  getGames(fastify);

  // POST - /game
  postCreateGame(fastify);

  // PATCH - /game/:gameId
  patchUpdateGame(fastify);

  // DELETE - /game/:gameId
  deleteRemoveGame(fastify);

  // POST - /game/:gameId/join
  postJoin(fastify);

  // POST - /game/:gameId/leave
  postLeave(fastify);

  next();
};


/**
 Let me see all the available contests I can place a waiger on.
 User fetches all contests that have not completed

 As a System, let me update each contest
 As a System, let me grab all the 'end' state contests and dispurse pot.
 Place the contest in 'pot_dispursement_in_progress'
 As a System, let me grab all 'pot_dispursement_in_progress_completed'
 to 'completed
*/
