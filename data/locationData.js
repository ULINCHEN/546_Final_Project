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
  const locationexist = await locationdb
    .find({ addressInfo: addressinfo, city: addressInfo.city })
    .toArray();
  let animalidList = [];
  let num = 0;
  if (locationexist.length === 0) {
    animalidList.push(animalid);
    num = animalidList.length;
    const postData = {
      location: location,
      addressInfo: addressinfo,
      state: addressInfo.state,
      city: addressInfo.city,
      animalids: animalidList,
      total_animal_num: num,
    };
    // console.log(postData);
    const info = await locationdb.insertOne(postData);
    if (!info) {
      throw "could not insert location";
    }
    return { locationid: info.insertedId.toString() };
  }
  for (let index = 0; index < locationexist.length; index++) {
    const element = locationexist[index];
    if (element.location === location) {
      // console.log(element);
      animalidList = element.animalids;
      animalidList.push(animalid);
      num = element.total_animal_num + 1;
      const updateinfo = await locationdb.updateOne(
        { _id: element._id },
        { $set: { animalids: animalidList, total_animal_num: num } }
      );
      if (!updateinfo) {
        throw "could not update location";
      }
      await updateTotalNum(addressinfo, addressInfo.city, num);
      return { locationid: element._id };
    }
  }
  // console.log(locationexist);
  animalidList.push(animalid);
  // console.log(locationexist);
  num = animalidList.length + locationexist[0].total_animal_num;
  const postData = {
    location: location,
    addressInfo: addressinfo,
    state: addressInfo.state,
    city: addressInfo.city,
    animalids: animalidList,
    total_animal_num: num,
  };
  await updateTotalNum(addressinfo, addressInfo.city, num);
  // console.log(postData);
  const info = await locationdb.insertOne(postData);
  if (!info) {
    throw "could not insert location";
  }
  return { locationid: info.insertedId.toString() };
};

// const getLocationByCity = async (City, State) => {
//   const locationdb = await db.locationCollection();
//   const locationList = await locationdb
//     .find({ city: City, state: State })
//     .toArray();
//   for (let index = 0; index < locationList.length; index++) {
//     const element = locationList[index];
//     await updateTotalNum(element);
//   }
// };

const updateTotalNum = async (addressInfo, city, num) => {
  const locationdb = await db.locationCollection();

  let updateinfo = await locationdb.updateMany(
    {
      addressInfo: addressInfo,
      city: city,
    },
    { $set: { total_animal_num: num } }
  );
  if (!updateinfo) {
    throw "could not update total num";
  }
  const locationList = await locationdb
    .find({ addressInfo: addressInfo, city: city })
    .toArray();
  return locationList;
};

// LocationD("hoboken nj");

module.exports = {
  LocationD,
  createLocation,
  // getLocationByCity,
  updateTotalNum,
};
