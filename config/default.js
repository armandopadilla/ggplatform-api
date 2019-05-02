module.exports = {
  db: {
    connInfo: {
      forceClose: true,
      url: process.env.MONGO_CONN_STRING,
      useNewUrlParser: true,
    },
    USER_COLL_NAME: 'users',
    WALLET_COLL_NAME: 'wallets',
    WALLET_TRXS_COLL_NAME: 'wallet_trxs',
    EVENTLOGGER_COLL_NAME: 'event_logger',
    GAME_COLL_NAME: 'games',
    CONTEST_COLL_NAME: 'contests'
  },
  errors: {
    USER_NOT_FOUND: 'User not found',
    USER_EMAIL_OR_PHONE_NOT_PROVIDED: 'email or phone required.',
    USER_TERMS_NO_ACCPTED: 'Terms have not be accepted.',
    USER_USER_TOO_YOUNG: 'User is too young.',
    USER_USERNAME_EXISTS: 'Username already in use.',
    USER_EMAIL_EXISTS: 'Email already in use.',
    CONTEST_NOT_FOUND: 'Contest not found',
  },
  server: {
    logger: true
  },
  aws: {
    auth: {
      ACCESS_KEY_ID: 'AKIAJ7XLSUSTUZX5FYCQ',
      SECRET_KEY: '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'
    },
    ses: {
      region: 'us-west-2'
    },
    sns: {
      region: 'us-west-2'
    },
    sqs: {

    }
  },
  company: {
    COMPANY_NAME: '',
    COMPANY_SUPPORT_EMAIL: '',
    COMPANY_WELCOME_FROM_EMAIL_ADDRESS: 'support@wiredpanda.com',
  }
};