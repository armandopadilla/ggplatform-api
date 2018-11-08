module.exports = {
  db: {
    connInfo: {
      forceClose: true,
      url: 'mongodb://localhost:27017/phoenix',
      useNewUrlParser: true,
    },
    ACCOUNT_NAME: 'accounts',
    WALLET_NAME: 'wallets',
    EVENTLOGGER__NAME: 'event_logger',
    CONTEST_NAME: 'contests',
  },
  errors: {
    ACCOUNT_NOT_FOUND: 'Account not found',
    CONTEST_NOT_FOUND: 'Contest not found',
  },
  server: {
    logger: false
  }
};
