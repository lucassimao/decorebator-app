const  {UserRepository} = require('@lucassimao/decorabator-common')
const isStringEmpty = string => !string || string.trim().length == 0;

/**
 *
 * @param {String} name User full name
 * @param {String} country User country
 * @param {String} email User email. It'll be used as his login
 * @param {String} password User password. The plain password won't be stored, It'll be hashed
 *
 * @returns {Promise} Promise to be resolved to the new user registered on the database
 */
const register = (name, country, email, password) => {
  if (isStringEmpty(password)) {
    return Promise.reject("A password must be provided");
  }
  return UserRepository.register(name,country,email,password)
};

/**
 *
 * @param {String} email User email, used as username
 * @param {String} password User password
 *
 * @returns {Promise} Promise to be resolved to the jwt token that will allow the user to send authenticated requests
 */
const doLogin = (email, password) => {
  if (isStringEmpty(email) || isStringEmpty(password)) {
    return Promise.reject("Login and password must be provided");
  }
  return UserRepository.login(email, password)
};


const removeAccount = email => UserRepository.removeAccount(email);

module.exports = { register, doLogin, removeAccount };
