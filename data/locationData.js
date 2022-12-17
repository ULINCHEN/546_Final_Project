const db = require("../config/mongoCollection");
const { convertLocation } = require("../publicMethods");

const getLocation = async (location) => {
  if (!location) throw "Please provide a location";
  if (typeof location != "string") throw "location should be a string";
  location = location.trim();
  if (location.length == 0) throw "location should not contains only spaces";
  location = await convertLocation(location);
  // console.log(location);
  return location;
};
// const result = convertLocation("hoboken");
// console.log(result);
// getLocation("hoboken nj");
// ["lat", "log"]

const LocationD = async (address) => {
  // address.streetName;
  // address.city;
  let locationList = await getLocation(address);
  let addressInfo = {};
  addressInfo.latitude = locationList[0].latitude.toString();
  addressInfo.longitude = locationList[0].longitude.toString();
  addressInfo.state = locationList[0].state.toString();
  addressInfo.city = locationList[0].city.toString();
  // console.log(addressInfo);
  // console.log(typeof addressInfo.latitude);
  return addressInfo;
  //   getLocation(address);
};

const createLocation = async (location, addressInfo, animalid) => {
  let addressinfo = {};
  addressinfo.latitude = addressInfo.latitude;
  addressinfo.longitude = addressInfo.longitude;
  const locationdb = await db.locationCollection();
  const locationexist = await locationdb.findOne({ addressInfo: addressinfo });
  let animalidList = [];
  if (locationexist) {
    animalidList = locationexist.animalids;
    animalidList.push(animalid);
  } else {
    animalidList.push(animalid);
  }
  let num = animalidList.length;
  const postData = {
    location: location,
    addressInfo: addressinfo,
    state: addressInfo.state,
    city: addressInfo.city,
    animalids: animalidList,
    total_animal_num: num,
  };
  console.log(postData);
  const info = await locationdb.insertOne(postData);
  if (!info) {
    throw "could not insert location";
  }
  return { locationid: info.insertedId.toString() };
};

const getLocationByCity = async (City, State) => {
  const locationdb = await db.locationCollection();
  const locationList = await locationdb
    .find({ city: City, state: State })
    .toArry();
  let sum = 0;
  for (let index = 0; index < locationList.length; index++) {
    const element = locationList[index];
    sum += element.animalids.length;
  }
};

// LocationD("hoboken nj");

module.exports = { LocationD, createLocation, getLocationByCity };
