/**
 * Get a list of bucket into a contest
 *
 * @see GET - /contest/:contestId
 */


module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/',
  handler: () => {},
  schema: {
    tags: ['Bet'],
    description: 'Do Not Use - See Contest - GET /contest/{contestId}',
    summary: 'Do Not Use - See Contest - GET /contest/{contestId}'
  }
});
