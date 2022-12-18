const bcrypt = require("bcryptjs");
const saltRounds = 8;
const validation = require("../publicMethods");
const db = require("../config/mongoCollection");
// const animaldb = require("./animalData");
const { ObjectId } = require("mongodb");

/**
 *
 * @param {String} username - create username
 * @param {String} password - create password
 * @param {String} firstName - create user first name
 * @param {String} lastName - create user last name
 * @returns - return {insertedUser: true}
 */
const createUser = async (username, password, firstName, lastName) => {
  //check input parm
  username = validation.accountValidation(username);
  password = validation.passwordValidation(password);
  firstName = validation.checkName(firstName);
  lastName = validation.checkName(lastName);

  const userdb = await db.userCollection();
  const checkUserExist = await userdb.findOne({ username: username });
  if (checkUserExist)
    throw "Could not add this user: already have this user in database";

  const passwordAfterHash = await bcrypt.hash(password, saltRounds);
  const userData = {
    user_account: username,
    user_password: passwordAfterHash,
    first_name: firstName,
    last_name: lastName,
    animal_ids: [],
    volunteer_ids: [],
    follow_animal_ids: [],
    comment_ids: [],
  };
  // add to db
  const info = await userdb.insertOne(userData);
  let user_id = info.insertedId.toString();
  if (!info.acknowledged || !info.insertedId) throw "Could not add this user";
  return { insertedUser: true, userid: user_id };
};

/**
 *
 * @param {String} username - check username
 * @param {String} password - check password
 * @returns - { authenticatedUser: true }
 */

const checkUser = async (username, password) => {
  username = validation.accountValidation(username);
  password = validation.passwordValidation(password);
  const userdb = await db.userCollection();
  const checkUserExist = await userdb.findOne({ user_account: username });
  if (!checkUserExist) throw "Either the username or password is invalid";
  const comparePassword = await bcrypt.compare(
    password,
    checkUserExist.user_password
  );
  if (comparePassword == false)
    throw "Either the username or password is invalid";
  else
    return { authenticatedUser: true, userid: checkUserExist._id.toString() };
};

const updateUser = async (username, password, firstName, lastName) => {
  username = validation.accountValidation(username);
  password = validation.passwordValidation(password);
  firstName = validation.checkName(firstName);
  lastName = validation.checkName(lastName);
  const userdb = await db.userCollection();
  const checkUserExist = await userdb.findOne({ user_account: username });
  if (!checkUserExist) throw "Either the username or password is invalid";
  const comparePassword = await bcrypt.compare(
    password,
    checkUserExist.user_password
  );
  if (comparePassword == true) {
    throw "The new and old passwords cannot be the same";
  }
  const passwordAfterHash = await bcrypt.hash(password, saltRounds);
  const updatedInfo = await userdb.updateOne(
    { user_account: username },
    {
      $set: {
        user_password: passwordAfterHash,
        first_name: firstName,
        last_name: lastName,
      },
    }
  );
  if (!updatedInfo) {
    throw `could not update user ${username}`;
  }
  return true;
};

const getAnimalList = async (username) => {
  username = validation.accountValidation(username);
  const userdb = await db.userCollection();
  const User = await userdb.findOne({ user_account: username });
  if (!User) throw `${username} is not exist`;
  return User.animal_ids;
};
const getFollowAnimalList = async (username) => {
  username = validation.accountValidation(username);
  const userdb = await db.userCollection();
  const User = await userdb.findOne({ user_account: username });
  if (!User) throw `${username} is not exist`;
  return User.follow_animal_ids;
};

const getUserData = async (username) => {
  username = validation.accountValidation(username);
  const userdb = await db.userCollection();
  const User = await userdb.findOne({ user_account: username });
  if (!User) throw `${username} is not exist`;
  // console.log(User);
  User._id = User._id.toString();
  return User;
};
const getUserById = async (userid) => {
  userid = validation.checkDatabaseId(userid);
  const userdb = await db.userCollection();
  const User = await userdb.findOne({ _id: ObjectId(userid) });
  if (!User) throw `can not find user with id of ${userid}`;
  // console.log(User);
  User._id = User._id.toString();
  return User;
};

const putAnimalIn = async (animalid, userid) => {
  userid = validation.checkDatabaseId(userid);
  animalid = validation.checkDatabaseId(animalid);
  const userdb = await db.userCollection();
  const User = await userdb.findOne({ _id: ObjectId(userid) });
  let animalidList = User.animal_ids;
  animalidList.push(animalid);
  const updateinfo = await userdb.updateOne(
    { _id: ObjectId(userid) },
    { $set: { animal_ids: animalidList } }
  );
  if (!updateinfo) {
    throw "can not put animal in user";
  }
  return true;
};

const removeAnimalFromU = async (animalid, userid) => {
  userid = validation.checkDatabaseId(userid);
  animalid = validation.checkDatabaseId(animalid);
  const userdb = await db.userCollection();
  const User = await userdb.findOne({ _id: ObjectId(userid) });
  let animalidList = User.animal_ids;
  for (let index = 0; index < animalidList.length; index++) {
    const element = animalidList[index];
    if (element == animalid) {
      animalidList.splice(index, 1);
    }
  }
  const updateinfo = await userdb.updateOne(
    { _id: ObjectId(userid) },
    { $set: { animal_ids: animalidList } }
  );
  if (!updateinfo) {
    throw `could not remove ${animalid} from user`;
  }
  return true;
};

const removeFollowFromU = async (animalid, userid) => {
  userid = validation.checkDatabaseId(userid);
  animalid = validation.checkDatabaseId(animalid);
  const userdb = await db.userCollection();
  const User = await userdb.findOne({ _id: ObjectId(userid) });
  let animalidList = User.follow_animal_ids;
  for (let index = 0; index < animalidList.length; index++) {
    const element = animalidList[index];
    if (element === animalid) {
      animalidList.splice(index, 1);
    }
  }
  const updateinfo = await userdb.updateOne(
    { _id: ObjectId(userid) },
    { $set: { follow_animal_ids: animalidList } }
  );
  if (!updateinfo) {
    throw `could not remove ${animalid} from user`;
  }
  return true;
};

const putCommentIn = async (commentid, userid) => {
  userid = validation.checkDatabaseId(userid);
  commentid = validation.checkDatabaseId(commentid);
  const userdb = await db.userCollection();
  const User = await userdb.findOne({ _id: ObjectId(userid) });
  let commenidtList = User.comment_ids;
  commenidtList.push(commentid);
  const updateinfo = await userdb.updateOne(
    { _id: ObjectId(userid) },
    { $set: { comment_ids: commenidtList } }
  );
  if (!updateinfo) {
    throw "can not put comment in user";
  }
  return true;
};

const removeCommentFromU = async (commentid, userid) => {
  userid = validation.checkDatabaseId(userid);
  commentid = validation.checkDatabaseId(commentid);
  const userdb = await db.userCollection();
  const User = await userdb.findOne({ _id: ObjectId(userid) });
  let commenidtList = User.comment_ids;
  for (let index = 0; index < commenidtList.length; index++) {
    const element = commenidtList[index];
    if (element == commentid) {
      commenidtList.splice(index, 1);
    }
  }
  const updateinfo = await userdb.updateOne(
    { _id: ObjectId(userid) },
    { $set: { comment_ids: commenidtList } }
  );
  if (!updateinfo) {
    throw `Could not remove commentid in user ${userid}`;
  }
  return true;
};
const removeVolunteerFromU = async (volunteerid, userid) => {
  userid = validation.checkDatabaseId(userid);
  volunteerid = validation.checkDatabaseId(volunteerid);
  const userdb = await db.userCollection();
  const User = await userdb.findOne({ _id: ObjectId(userid) });
  let volunteeridtList = User.volunteer_ids;
  for (let index = 0; index < volunteeridtList.length; index++) {
    const element = volunteeridtList[index];
    if (element == volunteerid) {
      volunteeridtList.splice(index, 1);
    }
  }
  const updateinfo = await userdb.updateOne(
    { _id: ObjectId(userid) },
    { $set: { volunteer_ids: volunteeridtList } }
  );
  if (!updateinfo) {
    throw `Could not remove volunteerid in user ${userid}`;
  }
  return true;
};
const putVolunteerIn = async (volunteerid, userid) => {
  userid = validation.checkDatabaseId(userid);
  volunteerid = validation.checkDatabaseId(volunteerid);
  const userdb = await db.userCollection();
  const User = await userdb.findOne({ _id: ObjectId(userid) });
  let VolunteeridtList = User.volunteer_ids;
  VolunteeridtList.push(volunteerid);
  const updateinfo = await userdb.updateOne(
    { _id: ObjectId(userid) },
    { $set: { volunteer_ids: VolunteeridtList } }
  );
  if (!updateinfo) {
    throw "can not put volunteer in user";
  }
  return true;
};

const removeUserById = async (userid) => {
  userid = validation.checkDatabaseId(userid);
  const userdb = await db.userCollection();
  const user = await userdb.findOne({ _id: ObjectId(userid) });
  if (!user) {
    throw "This user is not exist";
  }
  const deletionInfo = await userdb.deleteOne({ _id: ObjectId(userid) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete user with id of ${userid}`;
  }
  return `The user ${user._id} has been successfully deleted!`;
};

module.exports = {
  createUser,
  checkUser,
  getAnimalList,
  putAnimalIn,
  putVolunteerIn,
  getUserData,
  updateUser,
  putCommentIn,
  removeUserById,
  getUserById,
  removeCommentFromU,
  removeAnimalFromU,
  removeVolunteerFromU,
  getFollowAnimalList,
  removeFollowFromU,
};
