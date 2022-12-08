const bcrypt = require('bcryptjs');
const saltRounds = 8;
const { accountValidation, passwordValidation, checkName } = require('../publicMethods');
const { userCollection } = require('../config/mongoCollection');

/**
 * 
 * @param {String} account - create user account
 * @param {String} password - create password
 * @param {String} firstName - create user first name
 * @param {String} lastName - create user last name
 * @returns - return {insertedUser: true}
 */
const createUser = async (account, password, firstName, lastName) => {
    // check first name
    firstName = checkName(firstName, 'firstName');
    // check last name
    lastName = checkName(lastName, 'lastName');
    // check username
    account = accountValidation(account);
    // check password
    password = passwordValidation(password);

    const col = await userCollection();
    const checkUserExist = await col.findOne({ user_account: account });
    if (checkUserExist) throw 'Could not add this user: already have this user in database';

    const passwordAfterHash = await bcrypt.hash(password, saltRounds);
    const userData = {
        user_account: account,
        user_password: passwordAfterHash,
        first_name: firstName,
        last_name: lastName,
        animal_id: [],
        volunteer_id: [],
        follow_animal_id: [],
        comment_id: []
    }
    // add to db
    const info = await col.insertOne(userData);
    if (!info.acknowledged || !info.insertedId) throw 'Could not add this user';
    return { insertedUser: true };
}

/**
 * 
 * @param {String} username - check username
 * @param {String} password - check password
 * @returns - { authenticatedUser: true }
 */

const checkUser = async (username, password) => {
    username = usernameValidation(username);
    password = passwordValidation(password);
    const col = await userCollection();
    const checkUserExist = await col.findOne({ username: username });
    if (!checkUserExist) throw 'Either the username or password is invalid"';
    const comparePassword = await bcrypt.compare(password, checkUserExist.password);
    if (comparePassword == false) throw 'Either the username or password is invalid';
    else return { authenticatedUser: true };
}


module.exports = { createUser, checkUser };