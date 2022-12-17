// 这里写公用方法 数据校验等
let nodeGeocoder = require("node-geocoder");

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

const checkAnimalPost = (species, health) => {
  if (!vaildAnimalSpecies.includes(species))
    throw `${species} is not an vaild animal species.`;
  if (!vaildAnimalHealthCondition.includes(health))
    throw `${health} is not an vaild animal Health Condition.`;
  // No localtion check now.
  // No photo check now
  return [species, health];
};

const checkVolunteerPost = (type) => {
  if (!vaildVolunteerType.includes(type))
    throw `${type} is not an vaild Volunteer type.`;
  // No localtion check now.
  // No photo check now
  return type;
};

const convertLocation = async (location) => {
  if (!location) throw "Please provide a location";
  if (typeof location != "string") throw "location should be a string";
  location = location.trim();
  if (location.length == 0) throw "location should not contains only spaces";

  let options = {
    provider: "openstreetmap",
  };

  let geoCoder = nodeGeocoder(options);

  let result = await geoCoder.geocode("273 16th, nj");
  return result;
  //
};

//console.log(checkAnimalPost("Cat","Good1"))

module.exports = {
  accountValidation,
  passwordValidation,
  checkName,
  getDate,
  checkArticle,
  checkAnimalPost,
  checkVolunteerPost,
  convertLocation,
};
