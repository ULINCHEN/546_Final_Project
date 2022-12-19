const { ObjectId } = require("mongodb");
const db = require("../config/mongoCollection");
const validation = require("../publicMethods");

const getLocation = async (location) => {
  if (!location) throw "Please provide a location";
  if (typeof location != "string") throw "location should be a string";
  location = location.trim();
  if (location.length == 0) throw "location should not contains only spaces";
  location = await validation.convertLocation(location);
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
    .find({ state: addressInfo.state, city: addressInfo.city })
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
      await updateTotalNum(addressInfo.state, addressInfo.city, num);
      return { locationid: element._id.toString() };
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
  await updateTotalNum(addressInfo.state, addressInfo.city, num);
  // console.log(postData);
  const info = await locationdb.insertOne(postData);
  if (!info) {
    throw "could not insert location";
  }
  return { locationid: info.insertedId.toString() };
};

const getLocationById = async (locationid) => {
  const locationdb = await db.locationCollection();
  const locationinfo = await locationdb.findOne({
    _id: ObjectId(locationid),
  });
  if (!locationinfo) {
    throw "could not find location";
  }
  locationinfo._id = locationinfo._id.toString();
  return locationinfo;
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

const updateTotalNum = async (state, city, num) => {
  const locationdb = await db.locationCollection();
  let updateinfo = await locationdb.updateMany(
    {
      state: state,
      city: city,
    },
    { $set: { total_animal_num: num } }
  );
  if (!updateinfo) {
    throw "could not update total num";
  }
  // const locationList = await locationdb
  //   .find({ addressInfo: addressInfo, city: city })
  //   .toArray();
  // return locationList;
};

const removeLocationByAId = async (animalid, locationid) => {
  const locationdb = await db.locationCollection();
  const locationinfo = await locationdb.findOne({ _id: ObjectId(locationid) });
  // console.log(locationinfo);
  let animalidsList = locationinfo.animalids;
  for (let index = 0; index < animalidsList.length; index++) {
    const element = animalidsList[index];
    if (element === animalid) {
      animalidsList.splice(index, 1);
    }
  }
  await updateTotalNum(
    locationinfo.addressInfo,
    locationinfo.city,
    locationinfo.total_animal_num - 1
  );
  const removeinfo = await locationdb.updateOne(
    { _id: ObjectId(locationid) },
    { $set: { animalids: animalidsList } }
  );
  if (!removeinfo) {
    throw "Could not remove this animal's location";
  }
  return true;
};

// LocationD("hoboken nj");

module.exports = {
  getLocation,
  LocationD,
  createLocation,
  removeLocationByAId,
  getLocationById,
  // getLocationByCity,
  updateTotalNum,
};
