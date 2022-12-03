const bcrypt = require('bcryptjs');
const saltRounds = 8;
const { usernameValidation, passwordValidation, checkName } = require('../publicMethods');
const { userCollection } = require('../config/mongoCollections');

/**
 * 
 * @param {String} username - create username
 * @param {String} password - create password
 * @param {String} firstName - create user first name
 * @param {String} lastName - create user last name
 * @returns - return {insertedUser: true}
 */
const createUser = async (username, password, firstName, lastName) => {
    // check first name
    firstName = checkName(firstName, 'firstName');
    // check last name
    lastName = checkName(lastName, 'lastName');
    // check username
    username = usernameValidation(username);
    // check password
    password = passwordValidation(password);

    const col = await userCollection();
    const checkUserExist = await col.findOne({ username: username });
    if (checkUserExist) throw 'Could not add this user: already have this user in database';

    const passwordAfterHash = await bcrypt.hash(password, saltRounds);
    const userData = {
        user_account: username,
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