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
    CONTEST_COLL_NAME: 'contests',
    ACCOUNT_COLL_NAME: 'accounts'
  },
  errors: {
    USER_NOT_FOUND: 'User not found',
    USER_EMAIL_OR_PHONE_NOT_PROVIDED: 'email or phone required.',
    USER_TERMS_NO_ACCPTED: 'Terms have not be accepted.',
    USER_USER_TOO_YOUNG: 'User is too young.',
    USER_USERNAME_EXISTS: 'Username already in use.',
    USER_EMAIL_EXISTS: 'Email already in use.',
    CONTEST_NOT_FOUND: 'Contest not found',
    INVALID_APP_ID: 'Invalid APP ID',
    UNAUTH_REQUEST: 'Unathorized request',
  },
  server: {
    logger: true
  },
  aws: {
    auth: {
      ACCESS_KEY_ID: '',
      SECRET_KEY: ''
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
