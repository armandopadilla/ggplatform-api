const AWS = require('aws-sdk');
const {
  aws,
  company,
} = require('../../config');



/**
 * Send push message
 *
 * @param text
 */
const sendPush = (text) => {
  // Grab the text
  // Do the push
};


/**
 * Send a text message to someone.
 *
 * @param phoneNumber
 * @param text
 * @returns {Promise<PromiseResult<SNS.Types.PublishResponse, AWSError>>}
 */
const sendText = async (phoneNumber, text) => {
  if (!phoneNumber) throw Error('Phone number required');
  if (!text) throw Error('Text message required.');

  const params = {
    Message: text,
    PhoneNumber: phoneNumber
  };

  const smsSettings = {
    attributes: {
      'DefaultSenderID': 'WiredPanda',
      'DefaultSMSType': 'Promotional'
    }
  };

  const sns = new AWS.SNS({
    accessKeyId: aws.auth.ACCESS_KEY_ID,
    secretAccessKey: aws.auth.SECRET_KEY,
    region: aws.sns.region
  });

  await sns.setSMSAttributes(smsSettings).promise();
  return await sns.publish(params).promise();
}

/**
 * Send email
 *
 * @param subject
 * @param body
 * @param to
 */
const sendEmail = async (subject, body, to) => {
  const ses = new AWS.SES({
    accessKeyId: aws.auth.ACCESS_KEY_ID,
    secretAccessKey: aws.auth.SECRET_KEY,
    region: aws.ses.region
  });

  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject
      }
    },
    Source: company.COMPANY_WELCOME_FROM_EMAIL_ADDRESS,
  };

  return await ses.sendEmail(params).promise();
};


module.exports = {
  sendPush,
  sendEmail,
  sendText
};
