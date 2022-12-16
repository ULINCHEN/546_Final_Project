const { convertLocation } = require('../publicMethods');

const getLocation = async (location) => {
    if (!location) throw "Please provide a location";
    if (typeof location != 'string') throw "location should be a string";
    location = location.trim();
    if (location.length == 0) throw "location should not contains only spaces";
    location = await convertLocation(location);
    console.log(location);
    return location;
}
// const result = convertLocation("hoboken");
// console.log(result);
getLocation("hoboken");