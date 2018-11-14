const hasEmailOrPhone = (email, phone) => (email || phone) ? true : false;

const isEmailTaken = async (email, collectObj) => {
  const record = await collectObj.findOne({ email });
  return (record)? true : false;
}

const isUsernameTaken = async (username, collectObj) => {
  const record = await collectObj.findOne({ username });
  return (record) ? true : false;
}

const isValidAge = (dob) => {
  const ACCEPTABLE_AGE = 18;
  if (!dob) return false;

  const dobYear = new Date(dob).getFullYear();
  const currentYear = new Date().getFullYear();

  return ((currentYear - dobYear) >= ACCEPTABLE_AGE) ? true : false;
}

module.exports = {
  hasEmailOrPhone,
  isValidAge,
  isEmailTaken,
  isUsernameTaken
}