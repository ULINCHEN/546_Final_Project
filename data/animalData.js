const { ObjectId } = require("mongodb");
const db = require("../config/mongoCollection");
const userdb = require("./userData");
const locationdb = require("./locationData");
const fs = require("fs");
const path = require("path");
const validation = require("../publicMethods");

//create,update,search,delete
const createAnimalPost = async (
  animalName,
  species,
  description,
  healthCondition,
  location,
  userid,
  file
) => {
  animalName = validation.checkNameWithSpace(animalName);
  species = validation.checkAnimalSpecies(species);
  description = validation.checkArticle(description);
  healthCondition = validation.checkAnimalHealth(healthCondition);
  userid = validation.checkDatabaseId(userid);
  const animaldb = await db.animalPostCollection();
  // use current date as animal post time
  // let time = new Date();
  let time = validation.getDate();
  let filepath = "";
  if (!file) {
    filepath = "public/images/default.png";
  } else {
    await createImg(file);
    // console.log(file);
    filepath =
      file.destination + file.filename + "." + file.mimetype.split("/")[1];
    // console.log(filepath);
  }
  let addressInfo = await locationdb.LocationD(location);
  // console.log(filepath);
  const postData = {
    animal_name: animalName,
    species: species,
    description: description,
    health_condition: healthCondition,
    find_time: time,
    animal_photo: filepath,
    location_id: null,
    user_id: userid,
    followers_id: [],
    comment_ids: [],
  };
  const info = await animaldb.insertOne(postData);
  if (!info.acknowledged || !info.insertedId) throw "Could not add this user";
  // let animalid = info.insertedId.toString();
  let createInfo = await locationdb.createLocation(
    location,
    addressInfo,
    info.insertedId.toString()
  );
  const updatedInfo = await animaldb.updateOne(
    { _id: info.insertedId },
    { $set: { location_id: createInfo.locationid } }
  );
  if (!updatedInfo) {
    throw "location_id update failed";
  }
  // if (!createInfo) {
  //   throw "could not create location information";
  // }

  if (userid) {
    await userdb.putAnimalIn(info.insertedId.toString(), userid);
  }
  return { insertedAnimalPost: true, animalid: info.insertedId.toString() };
};

//refer from
//https://blog.csdn.net/FuyuumiAI/article/details/109498598
const createImg = async (file) => {
  // console.log(file, body);
  // if (file.size > maxsize) {
  //   removeImg("public/images/" + file.filename);
  //   throw "File too large";
  // }
  return new Promise(async (resolve, reject) => {
    fs.readFile(file.path, async (err, data) => {
      if (err) {
        reject(err);
      }
      // get the extname
      let extName = file.mimetype.split("/")[1];
      // concatenate picture path
      let imgName = `${file.filename}.${extName}`;
      // write file in uploads
      await fs.writeFile(
        path.resolve(`./public/uploads/${imgName}`),
        data,
        (err) => {
          if (err) {
            reject(err);
          }
        }
      );
      // delete binary file
      await fs.unlink(file.path, (err) => {
        if (err) {
          reject(err);
        }
      });
      // verify storage
      // await fs.stat(path.resolve(`./public/uploads/${imgName}`), (err) => {
      //   if (err) {
      //     reject(err);
      //   }
      //   // success and return
      //   // console.log(imgName);
      //   resolve(`./public/uploads/${imgName}`);
      // });
      resolve(`./public/uploads/${imgName}`);
    });
  });
};

const removeImg = async (filepath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, async (err, data) => {
      if (err) {
        reject(err);
      }
      // delete img
      await fs.unlink(filepath, (err) => {
        if (err) {
          reject(err);
        }
        resolve(`${filepath}`);
      });
    });
  });
};

const getLocationByA = async (animalid) => {
  animalid = validation.checkDatabaseId(animalid);
  const animaldb = await db.animalPostCollection();
  const animal = await animaldb.findOne({ _id: ObjectId(animalid) });
  const locationInfo = await locationdb.getLocationById(
    animal.location_id.toString()
  );
  return locationInfo;
};

const updateAnimalPost = async (
  animalid,
  animalName,
  species,
  description,
  healthCondition,
  location,
  userid
) => {
  animalid = validation.checkDatabaseId(animalid);
  animalName = validation.checkNameWithSpace(animalName);
  species = validation.checkAnimalSpecies(species);
  description = validation.checkArticle(description);
  healthCondition = validation.checkAnimalHealth(healthCondition);
  userid = validation.checkDatabaseId(userid);
  let time = new Date();
  time = time.toUTCString();
  const animaldb = await db.animalPostCollection();
  const checkexist = await animaldb.findOne({ _id: ObjectId(animalid) });
  if (userid !== checkexist.user_id.toString()) {
    throw "This post is not your post";
  }
  await locationdb.removeLocationByAId(
    checkexist._id.toString(),
    checkexist.location_id.toString()
  );
  let addressInfo = await locationdb.LocationD(location);
  let createInfo = await locationdb.createLocation(
    location,
    addressInfo,
    animalid
  );
  const updateData = {
    animal_name: animalName,
    species: species,
    description: description,
    health_condition: healthCondition,
    find_time: time,
    animal_photo: checkexist.animal_photo,
    location_id: createInfo.locationid,
    user_id: userid,
    followers_id: [],
    comment_ids: [],
  };

  const updatedInfo = await animaldb.updateOne(
    { _id: ObjectId(animalid) },
    { $set: updateData }
  );
  if (!updatedInfo) throw "Could not add this user";
  return true;
};

const getAllAnimalPosts = async () => {
  const animaldb = await db.animalPostCollection();
  const postList = await animaldb.find({}).toArray();
  if (postList.length == 0) throw "No Animal in database";
  postList.sort((a, b) => {
    let m = new Date(a.find_time);
    let n = new Date(b.find_time);
    if (m.getTime() > n.getTime()) {
      return 1;
    } else {
      return -1;
    }
  });
  for (let index = 0; index < postList.length; index++) {
    const element = postList[index];
    element._id = element._id.toString();
    let locationInfo = await locationdb.getLocationById(element.location_id);
    element.locationinfo = locationInfo;
  }
  return postList;
};

const getAnimalPostById = async (id) => {
  id = validation.checkDatabaseId(id);
  const animaldb = await db.animalPostCollection();
  const animal = await animaldb.findOne({ _id: ObjectId(id) });
  if (!animal) {
    throw `can not find animal post with id of ${id}`;
  }
  let locationInfo = await locationdb.getLocationById(animal.location_id);
  animal.locationinfo = locationInfo;
  animal._id = animal._id.toString();
  return animal;
};

// Before use this funtion, please use removeCommentByA(animalid) in commentData in routes first
const removeAnimalById = async (animalid) => {
  animalid = validation.checkDatabaseId(animalid);
  const animaldb = await db.animalPostCollection();
  const animal = await animaldb.findOne({ _id: ObjectId(animalid) });
  if (!animal) {
    throw "This animal post is not exist";
  }
  const followList = animal.followers_id;
  for (let index = 0; index < followList.length; index++) {
    const element = followList[index];
    await userdb.removeFollowFromU(animalid, element);
  }
  await userdb.removeAnimalFromU(animalid, animal.user_id);
  await locationdb.removeLocationByAId(animalid, animal.location_id);
  if (animal.animal_photo !== "public/images/default.png") {
    await removeImg(animal.animal_photo);
  }
  const deletionInfo = await animaldb.deleteOne({ _id: ObjectId(animalid) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete animal post with id of ${animalid}`;
  }
  return `The animal post ${animal._id} has been successfully deleted!`;
};

const getAnimalByType = async (type) => {
  type = validation.checkAnimalSpecies(type);
  const animaldb = await db.animalPostCollection();
  const animalList = await animaldb.find({ species: type }).toArray();
  animalList.sort((a, b) => {
    let m = new Date(a.find_time);
    let n = new Date(b.find_time);
    if (m.getTime() > n.getTime()) {
      return 1;
    } else {
      return -1;
    }
  });
  for (let index = 0; index < animalList.length; index++) {
    const element = animalList[index];
    element._id = element._id.toString();
  }
  return animalList;
};

const getAnimalByUser = async (username) => {
  username = validation.accountValidation(username);
  let animalidList = await userdb.getAnimalList(username);
  let animalList = [];
  for (let index = 0; index < animalidList.length; index++) {
    const element = animalidList[index];
    let animal = await getAnimalPostById(element);
    animalList.push(animal);
  }
  return animalList;
};

const putFollowInUser = async (animalid, userid) => {
  animalid = validation.checkDatabaseId(animalid);
  userid = validation.checkDatabaseId(userid);
  const animaldb = await db.animalPostCollection();
  const userdb = await db.userCollection();
  const animal = await animaldb.findOne({ _id: ObjectId(animalid) });
  const User = await userdb.findOne({ _id: ObjectId(userid) });
  let FollowanimalidList = User.follow_animal_ids;
  let FollowuseridList = animal.followers_id;
  let animalidList = User.animal_ids;
  for (let index = 0; index < animalidList.length; index++) {
    const element = animalidList[index];
    if (animalid === element) {
      throw "you can not follow the animal you have posted";
    }
  }
  for (let index = 0; index < FollowuseridList.length; index++) {
    const element = FollowuseridList[index];
    if (userid === element) {
      throw "you can not follow the animal again";
    }
  }
  FollowanimalidList.push(animalid);
  FollowuseridList.push(userid);
  const updateinfo1 = await userdb.updateOne(
    { _id: ObjectId(userid) },
    { $set: { follow_animal_ids: FollowanimalidList } }
  );
  if (!updateinfo1) {
    throw "can not put animal in user";
  }
  const updateinfo2 = await animaldb.updateOne(
    { _id: ObjectId(animalid) },
    { $set: { followers_id: FollowuseridList } }
  );
  if (!updateinfo2) {
    throw "can not put animal in user";
  }
  return true;
};

/**
 *
 * @param {*} animalid - ID of posts that need to delete
 * @param {*} userid - ID of current user
 * @returns - boolean
 */
const removeFollow = async (animalid, userid) => {
  animalid = validation.checkDatabaseId(animalid);
  userid = validation.checkDatabaseId(userid);
  const animaldb = await db.animalPostCollection();
  const userdb = await db.userCollection();
  const animal = await animaldb.findOne({ _id: ObjectId(animalid) });
  const User = await userdb.findOne({ _id: ObjectId(userid) });
  let FollowanimalidList = User.follow_animal_ids;
  let FollowuseridList = animal.followers_id;
  for (let index = 0; index < FollowanimalidList.length; index++) {
    const element = FollowanimalidList[index];
    if (element === animalid) {
      FollowanimalidList.splice(index, 1);
    }
  }
  for (let index = 0; index < FollowuseridList.length; index++) {
    const element = FollowuseridList[index];
    if (userid === element) {
      FollowuseridList.splice(index, 1);
    }
  }
  const updateinfo1 = await userdb.updateOne(
    { _id: ObjectId(userid) },
    { $set: { follow_animal_ids: FollowanimalidList } }
  );
  if (!updateinfo1) {
    throw "can not put animal in user";
  }
  const updateinfo2 = await animaldb.updateOne(
    { _id: ObjectId(animalid) },
    { $set: { followers_id: FollowuseridList } }
  );
  if (!updateinfo2) {
    throw "can not put animal in user";
  }
  return true;
};

const getFollowAnimalByUser = async (username) => {
  username = validation.accountValidation(username);
  let animalidList = await userdb.getFollowAnimalList(username);
  let animalList = [];
  for (let index = 0; index < animalidList.length; index++) {
    const element = animalidList[index];
    let animal = await getAnimalPostById(element);
    animalList.push(animal);
  }
  return animalList;
};

const putCommentIn = async (commentid, animalid) => {
  commentid = validation.checkDatabaseId(commentid);
  animalid = validation.checkDatabaseId(animalid);
  const animaldb = await db.animalPostCollection();
  const animal = await animaldb.findOne({ _id: ObjectId(animalid) });
  let commenidtList = animal.comment_ids;
  commenidtList.push(commentid);
  const updateinfo = await animaldb.updateOne(
    { _id: ObjectId(animalid) },
    { $set: { comment_ids: commenidtList } }
  );
  if (!updateinfo) {
    throw "can not put comment in animal";
  }
  return true;
};

const removeCommentFromA = async (commentid, animalid) => {
  commentid = validation.checkDatabaseId(commentid);
  animalid = validation.checkDatabaseId(animalid);
  const animaldb = await db.animalPostCollection();
  const Animal = await animaldb.findOne({ _id: ObjectId(animalid) });
  let commenidtList = Animal.comment_ids;
  for (let index = 0; index < commenidtList.length; index++) {
    const element = commenidtList[index];
    if (element == commentid) {
      commenidtList.splice(index, 1);
    }
  }
  const userdb = await db.userCollection();
  const updateinfo = await userdb.updateOne(
    { _id: ObjectId(animalid) },
    { $set: { comment_ids: commenidtList } }
  );
  if (!updateinfo) {
    throw `could not remove commentid from animal ${animalid}`;
  }
  return true;
};

const createAnimalPostForSeed = async (
  animalName,
  species,
  description,
  healthCondition,
  location,
  time,
  userid,
  filepath
) => {
  animalName = validation.checkNameWithSpace(animalName);
  species = validation.checkAnimalSpecies(species);
  description = validation.checkArticle(description);
  healthCondition = validation.checkAnimalHealth(healthCondition);
  userid = validation.checkDatabaseId(userid);
  const animaldb = await db.animalPostCollection();
  // use current date as animal post time
  // let time = new Date();
  // time = time.toUTCString();
  //  let time = validation.getDate();
  // let filepath = "";
  // if (!file) {
  //   filepath = "public\\images\\default.png";
  // } else {
  //   await createImg(file);
  //   filepath = file.path + "." + file.mimetype.split("/")[1];
  //   // console.log(filepath);
  // }

  // console.log(filepath);
  const postData = {
    animal_name: animalName,
    species: species,
    description: description,
    health_condition: healthCondition,
    find_time: time,
    animal_photo: filepath,
    location_id: null,
    user_id: userid,
    followers_id: [],
    comment_ids: [],
  };
  const info = await animaldb.insertOne(postData);
  if (!info.acknowledged || !info.insertedId) throw "Could not add this user";
  let addressInfo = await locationdb.LocationD(location);
  // let animalid = info.insertedId.toString();
  let createInfo = await locationdb.createLocation(
    location,
    addressInfo,
    info.insertedId.toString()
  );
  const updatedInfo = await animaldb.updateOne(
    { _id: info.insertedId },
    { $set: { location_id: createInfo.locationid } }
  );
  if (!updatedInfo) {
    throw "location_id update failed";
  }
  // if (!createInfo) {
  //   throw "could not create location information";
  // }

  if (userid) {
    await userdb.putAnimalIn(info.insertedId.toString(), userid);
  }
  return { insertedAnimalPost: true, animalid: info.insertedId.toString() };
};

module.exports = {
  createAnimalPost,
  getAllAnimalPosts,
  getAnimalPostById,
  getAnimalByUser,
  updateAnimalPost,
  getAnimalByType,
  removeAnimalById,
  putCommentIn,
  removeCommentFromA,
  createImg,
  putFollowInUser,
  removeFollow,
  getFollowAnimalByUser,
  createAnimalPostForSeed,
  getLocationByA,
  removeImg,
};
