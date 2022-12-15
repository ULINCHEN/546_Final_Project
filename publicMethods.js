// 这里写公用方法 数据校验等

// username and password validation
const accountValidation = (username) => {
    if (!username) throw "Please provide a username";
    if (typeof username != 'string') throw "username type should be string";
    username = username.trim().toLowerCase();
    if (username.length < 4) throw 'username length should be at least 4 character';

    // check if string contains space
    const space = /\s/;
    if (space.test(username) == true) throw 'username should not contains space';

    // check if string is only number
    const num = /^\d+$/;
    if (num.test(username) == true) throw `username should not be only digits`;
    return username;
}

const passwordValidation = (password) => {
    if (!password) throw "Please provide a password";
    if (typeof password != 'string') throw "Password should be a string";
    password = password.trim();
    if (password.length < 6) throw "Password should be at least 6 character, or can not be full of space";
    // check if string contains space
    const space = /\s/;
    if (space.test(password) == true) throw 'Password should not contains space';
    return password;
}

const checkName = (string, type) => {
    if (!string) throw `${type} should not be empty`;
    if (typeof string != 'string') throw `${type} should be string`;
    string = string.trim();
    if (string.length == 0) throw `${type} should not contains only spaces`;
    string = checkSpecialCharacterNoNumber(string, type);
    return string;
}

const checkSpecialCharacterNoNumber = (string, inputName) => {
    const specialChars = /^[a-zA-Z]+$/;
    string = string.trim();
    if (specialChars.test(string) === false) throw `${inputName} should only contains character a-z and A-Z`;
    return string;
}

const checkSpecialCharacter = (string, inputName) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    string = string.trim();
    if (specialChars.test(string) === true) throw `${inputName} should not contain special character`;
    return string;
}

const getDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const curDate = `${month}/${day}/${year} ${hour}:${minutes}`;
    return curDate;
}



module.exports = { accountValidation, passwordValidation, checkName, getDate };




