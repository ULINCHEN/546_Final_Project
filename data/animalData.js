const { ObjectId } = require("mongodb");
const db = require("../config/mongoCollection");
const userdb = require("./userData");

//create,update,search,delete
const createAnimalPost = async (
  animalName,
  species,
  description,
  healthCondition,
  location,
  userid,
  animalPhoto
) => {
  if (!animalName) throw "Animal name can not be empty";
  if (!species) throw "Species can not be empty";
  if (!description) throw "Description can not be empty";
  if (!healthCondition) throw "HealthCondition can not be empty";
  // if (!time) throw "Time can not be empty";
  // animal photo can be empty
  if (!location) throw "Location can not be empty";
  if (!userid) throw "userid can not be empty";

  // locationId = somefunction(location) 这里应该要把location 转化成 locationId
  // location 暂时没加入postData
  const animaldb = await db.animalPostCollection();
  // const Animal_exist = await animaldb.findOne({ animal_name: animalName });
  // let useridList = [];
  // if (Animal_exist) {
  //   useridList = Animal_exist.user_id;
  //   useridList.push(userid);
  // } else {
  //   useridList.push(userid);
  // }
  // let useridList = [];
  // useridList.push(userid);
  let time = new Date();
  time = time.toUTCString();
  const postData = {
    animal_name: animalName,
    species: species,
    description: description,
    health_condition: healthCondition,
    find_time: time,
    animal_photo: animalPhoto,
    location_id: [],
    user_id: userid,
    comment_ids: [],
  };

  const info = await animaldb.insertOne(postData);
  if (!info.acknowledged || !info.insertedId) throw "Could not add this user";
  if (userid) {
    await userdb.putAnimalIn(info.insertedId.toString(), userid);
  }
  return { insertedAnimalPost: true, animalid: info.insertedId.toString() };
};

/**
 * 传id进来
 *
 */
const updateAnimalPost = async (
  animalid,
  animalName,
  species,
  description,
  healthCondition,
  time,
  location,
  userid,
  animalPhoto
) => {
  useridList.push(userid);
  const updateData = {
    animal_name: animalName,
    species: species,
    description: description,
    health_condition: healthCondition,
    find_time: time,
    animal_photo: animalPhoto,
    location_id: [],
    user_id: useridList,
    comment_ids: [],
  };
  const animaldb = await db.animalPostCollection();
  const updatedInfo = await animaldb.updateOne(
    { _id: ObjectId(animalid) },
    { $set: updateData }
  );
  if (!updatedInfo.acknowledged || !updatedInfo.insertedId)
    throw "Could not add this user";
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
  }
  return postList;
};

const getAnimalPostByID = async (id) => {
  const animaldb = await db.animalPostCollection();
  const animal = await animaldb.findOne({ _id: ObjectId(id) });
  if (!animal) {
    throw `can not find animal post with id of ${id}`;
  }
  animal._id = animal._id.toString();
  return animal;
};

const putCommentIn = async (commentid, animalid) => {
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
  const animaldb = await db.animalPostCollection();
  const Animal = await animaldb.findOne({ _id: ObjectId(animalid) });
  let commenidtList = Animal.comment_ids;
  for (let index = 0; index < commenidtList.length; index++) {
    const element = commenidtList[index];
    if (element == commentid) {
      commenidtList.splice(index, 1);
    }
  }
  const updateinfo = await userdb.updateOne(
    { _id: ObjectId(animalid) },
    { $set: { comment_ids: commenidtList } }
  );
  if (!updateinfo) {
    throw `could not remove commentid from animal ${animalid}`;
  }
  return true;
};

const getAnimalbyuser = async (username) => {
  let animalidList = await userdb.getAnimalList(username);
  let animalList = [];
  for (let index = 0; index < animalidList.length; index++) {
    const element = animalidList[index];
    let animal = await getAnimalPostByID(element);
    animalList.push(animal);
  }
  return animalList;
};
const removeAnimalById = async (animalid) => {
  const animaldb = await db.animalPostCollection();
  const animal = await animaldb.findOne({ _id: ObjectId(animalid) });
  if (!animal) {
    throw "This animal post is not exist";
  }
  const deletionInfo = await animaldb.deleteOne({ _id: ObjectId(animalid) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete animal post with id of ${animalid}`;
  }
  return `The animal post ${animal._id} has been successfully deleted!`;
};

const getAnimalByType = async (type) => {
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

module.exports = {
  createAnimalPost,
  getAllAnimalPosts,
  getAnimalPostByID,
  getAnimalbyuser,
  updateAnimalPost,
  getAnimalByType,
  removeAnimalById,
  putCommentIn,
  removeCommentFromA,
};
