module.exports = {
  db: {
    connInfo: {
      forceClose: true,
      url: process.env.MONGO_CONN_STRING,
      useNewUrlParser: true,
    },
    ACCOUNT_NAME: 'accounts',
    WALLET_NAME: 'wallets',
    EVENTLOGGER__NAME: 'event_logger',
    CONTEST_NAME: 'contests',
    BETBUCKET_NAME: 'betbuckets'
  },
  errors: {
    ACCOUNT_NOT_FOUND: 'Account not found',
    CONTEST_NOT_FOUND: 'Contest not found',
    ACCOUNT_EMAIL_OR_PHONE_NOT_PROVIDED: 'email or phone required.',
    ACCOUNT_TERMS_NO_ACCPTED: 'Terms have not be accepted.',
    ACCOUNT_USER_TOO_YOUNG: 'User is too young.',
    ACCOUNT_USERNAME_EXISTS: 'Username already in use.',
    ACCOUNT_EMAIL_EXISTS: 'Email already in use.',
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
    }
  }
};
