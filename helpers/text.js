const sendGameAboutToStartTxt = async (phoneNumber) => {
  const message = "gtgchamp - Your match is about to start!"
  return await sendText(phoneNumber, message);
};

module.exports = {
  sendGameAboutToStartTxt,
};