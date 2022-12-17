// 这里写公用方法 数据校验等
let nodeGeocoder = require("node-geocoder");
const { ObjectId } = require("mongodb");
/*
Description:

1. "All global vaild variables" to change scopes.

Export functions:
2. accountValidation(username); to user's account check.
3. passwordValidation = (password); to check user's password.
4. checkName(string, type) in common name check.
5. checkArticle(string, type) using in Animal_description and Comment check.
6. checkAnimalSpecies(species) to check addPost animal inputs.
7. checkAnimalHealth(health) to check addPost animal inputs.
8. checkVolunteerPost(tpye) to check views.layouts.addVolunteerPost inputs.
9. checkVolunteerInfo(input) to check Volunteer information, it vaild as email or phonenumber(just US number without country code '+1').
10. convertLocation => async (location); temporary using a const loaction now.
11. checkDatabaseId(id, varName); to check if a id is a valid object, used in yetong's lab 6.

*/

// All vaild variables
var maxAccountLength = 50;
var minAccountLength = 4;
var maxPasswordLength = 50;
var minPasswordLength = 6;
var maxNameLength = 25;
var minNameLength = 3;
var maxArticleLength = 400;
var minArticleLength = 5;
var vaildAnimalSpecies = ["Cat", "Dog", "Others"];
var vaildAnimalHealthCondition = ["Good", "Normal", "Bad"];
var vaildVolunteerType = ["Organization", "Individual"];

// username and password validation
const accountValidation = (username) => {
  if (!username) throw "Please provide a username";
  if (typeof username != "string") throw "username type should be string";
  username = username.trim().toLowerCase();
  if (username.length < minAccountLength)
    throw `username length should be at least ${minAccountLength} character`;
  if (username.length > maxAccountLength)
    throw `username length should be less than ${maxAccountLength} character`;
  // check if string contains space
  const space = /\s/;
  if (space.test(username) == true) throw "username should not contains space";

  // check if string is only number
  const num = /^\d+$/;
  if (num.test(username) == true) throw `username should not be only digits`;

  // check if is vaild email
  var reg =
    /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  isok = reg.test(username);
  if (!isok) throw `username should be vaild email`;
  return username;
};

const passwordValidation = (password) => {
  if (!password) throw "Please provide a password";
  if (typeof password !== "string") throw "Password should be a string";
  password = password.trim();
  if (password.length < minPasswordLength)
    throw `Password should be at least${minPasswordLength} character or can not be full of space`;
  if (password.length > maxPasswordLength)
    throw `Password should be less than ${maxAccountLength} character`;

  // check if string contains space
  const space = /\s/;
  if (space.test(password) == true) throw "Password should not contains space";
  return password;
};

const checkName = (string, type) => {
  if (!string) throw `${type} should not be empty`;
  if (typeof string != "string") throw `${type} should be string`;
  string = string.trim();
  if (string.length == 0) throw `${type} should not contains only spaces`;
  if (string.length > maxNameLength)
    throw `${type} length must less than ${maxNameLength}`;
  if (string.length < minNameLength)
    throw `${type} length must greater than ${minNameLength}`;

  string = checkSpecialCharacterNoNumber(string, type);
  return string;
};

const checkSpecialCharacterNoNumber = (string, inputName) => {
  const specialChars = /^[a-zA-Z]+$/;
  string = string.trim();
  if (specialChars.test(string) === false)
    throw `${inputName} should only contains character a-z and A-Z`;
  return string;
};

const checkSpecialCharacter = (string, inputName) => {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  string = string.trim();
  if (specialChars.test(string) === true)
    throw `${inputName} should not contain special character`;
  return string;
};

const getDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const curDate = `${month}/${day}/${year} ${hour}:${minutes}`;
  return curDate;
};

const checkArticle = (string, type) => {
  if (!string) throw `${type} should not be empty`;
  if (typeof string != "string") throw `${type} should be string`;
  string = string.trim();
  if (string.length == 0) throw `${type} should not contains only spaces`;
  if (string.length > maxArticleLength)
    throw `${type} length must less than ${maxArticleLength}`;
  if (string.length < minArticleLength)
    throw `${type} length must greater than ${minArticleLength}`;
  //SpecialCharacter(XSS) checked in middleware.
  //string = checkSpecialCharacter(string, type);
  return string;
};

const checkAnimalSpecies = (species) => {
  if (typeof species !== "string") throw "species must be a string";
  species = species.trim();
  if (!vaildAnimalSpecies.includes(species))
    throw `${species} is not an vaild animal species.`;
  return species;
};

const checkAnimalHealth = (health) => {
  if (typeof health !== "string") throw "health must be a string";
  health = health.trim();
  if (!vaildAnimalHealthCondition.includes(health))
    throw `${health} is not an vaild animal Health Condition.`;
  return health;
};

const checkVolunteerPost = (type) => {
  if (!vaildVolunteerType.includes(type))
    throw `${type} is not an vaild Volunteer type.`;
  // No localtion check now.
  // No photo check now
  return type;
};

// check if it's a vaild email or phone, using in volunteer.
// it vaild as email or phonenumber(just US number without country code '+1').
const checkVolunteerInfo = (input) => {
  input = input.trim();
  var mail =
    /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  var phonenumber = /\d{10}/;
  isok = mail.test(input) || phonenumber.test(input);
  if (!isok) throw `${input} is not an vaild Email or Phone number.`;
  return input;
};

const convertLocation = async (location) => {
  if (!location) throw "Please provide a location";
  if (typeof location != "string") throw "location should be a string";
  location = location.trim();
  if (location.length == 0) throw "location should not contains only spaces";
  reg = /^(([A-Z]*[a-z]*(\d)*(\s)*(\#)*(\*)*(\_)*))*$/;
  if (!reg.test(location)) {
    console.log("1");
    throw "This is an invalid location";
  }
  let options = {
    provider: "openstreetmap",
  };

  let geoCoder = nodeGeocoder(options);

  let result = await geoCoder.geocode(location);
  // console.log(result[0]);
  if (result === undefined) {
    console.log("2");
    throw "This is an invalid location";
  }
  if (result.length < 1) {
    console.log("3");
    throw "This is an invalid location";
  }

  // console.log(reg.test("afaf # 123 af*a_f"));
  if (!reg.test(result.state)) {
    console.log("4");
    throw "This is an invalid location";
  }
  if (!reg.test(result.city)) {
    console.log("5");
    throw "This is an invalid location";
  }
  if (result[0].state === undefined) {
    console.log("6");
    console.log(result.state);
    throw "This is an invalid location";
  }
  return result;
};

const checkDatabaseId = (id, varName) => {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== "string") throw `Error:${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
};

//console.log(checkAnimalPost("Cat","Good1"))

module.exports = {
  accountValidation,
  passwordValidation,
  checkName,
  getDate,
  checkArticle,
  checkAnimalSpecies,
  checkAnimalHealth,
  checkVolunteerPost,
  checkVolunteerInfo,
  convertLocation,
  checkDatabaseId,
};
