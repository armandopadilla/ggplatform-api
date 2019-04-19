/*
1. Win percentage

 */
const ObjectId = require('mongodb').ObjectId;
const { db: collection } = require('../../config');

const getWinPercent = async (userId, db) => {
  // Hit up the DB
  const gamesPlayed = await db.collection(collection.GAME_COLL_NAME).find({
    participants: { $all: [userId] }
  }).toArray();

  //console.log(gamesPlayed);
  // Get the games the player is participating in
  const totalGames = gamesPlayed.length || 0;

  // Get the number of times the user won.
  const contests = await db.collection(collection.CONTEST_COLL_NAME).find({
    winners: { $all: [userId] }
  }).toArray();

  const wonCount = contests.length || 0;

  // Calculate the %
  const calc = (wonCount/totalGames).toFixed(2)*100;

  return calc;

};


module.exports = {
  getWinPercent,
};