/*
1. Win percentage

 */
const ObjectId = require('mongodb').ObjectId;
const { db: collection } = require('../../config');

const getWinPercent = async (userId, db) => {

  //console.log(gamesPlayed);
  // Get the games the player is participating in
  const totalGames = await getTotalGamesPlayed(userId, db);

  // Get the number of times the user won.
  const wonCount = await getTotalGamesWon(userId, db);

  // Calculate the %
  const calc = (wonCount/totalGames).toFixed(2)*100;

  return calc;

};


/**
 * Get the total games played by the user.
 *
 * @param userId
 * @param db
 * @returns {Promise.<number>}
 */
const getTotalGamesPlayed = async (userId, db) => {

  // Hit up the DB
  const gamesPlayed = await db.collection(collection.GAME_COLL_NAME).find({
    participants: { $all: [userId] }
  }).toArray();

  // Get the games the player is participating in
  return gamesPlayed.length || 0;

};

/**
 * Get the number of times the user won.
 * @param userId
 * @param db
 * @returns {Promise.<number>}
 */
const getTotalGamesWon = async (userId, db) => {
  // Get the number of times the user won.
  const contests = await db.collection(collection.CONTEST_COLL_NAME).find({
    winners: { $all: [userId] }
  }).toArray();

  return contests.length || 0;
}

const getUserStats = async (userId, db) => {
  return {
      totalGamesPlayed: await getTotalGamesPlayed(userId, db),
      totalGamesWon: await getTotalGamesWon(userId, db),
      winPercent: await getWinPercent(userId, db)
    }
}


module.exports = {
  getWinPercent,
  getTotalGamesPlayed,
  getTotalGamesWon,
  getUserStats,
};