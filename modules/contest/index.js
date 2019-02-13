const postCreateContest = require('./routes/postCreateContest');
const getGameContests = require('./routes/getGameContests');
const patchUpdateContest = require('./routes/patchUpdateContest');

module.exports = (fastify, opts, next) => {
  // POST - /game/:gameId/contest
  postCreateContest(fastify);

  // GET - /game/:gameId/contest/list
  getGameContests(fastify);

  // PATCH - /games/:gameId/contest/:contestId
  patchUpdateContest(fastify);

  next();
};


/*
 // Betting
 // Add to the pot
 // Fetch the wallet
 // Fetch the entry fee
 // Withdraw funds from wallet
 // Enter the user into the contest
 // Payout the pot
 // Grab all the participants that won in a specific contest
 // Break up the pot into (number of participants that won)
 // Foreach participant that won
 // Deposit the funds
 // Sendout a notification that they won X
 */


// Create bet
// Create the bet in its own collection
// Store the bet buckets in the contest
//

// I think this is OK because I cant see a contests having hundres of bet buckets
