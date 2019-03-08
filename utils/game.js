/**
 * Check if the user is already a participant.
 */
const { db: collection } = require('../config');
const ObjectId = require('mongodb').ObjectId;

const canJoinGame = async (userId, gameId, db) => {
  const game = await db.collection(collection.GAME_COLL_NAME).findOne({ _id: ObjectId(gameId) });

  if (game.participants.indexOf(userId) > -1) throw new Error('User already a participant', 400);
  return true;
};

module.exports = {
  canJoinGame
};