const db = require("../config/mongoCollection");
const userdb = require("./userData");
const { ObjectId } = require("mongodb");
const validation = require("../publicMethods");

const createVolunteerPost = async (
  volunteername,
  contact,
  location,
  type,
  description,
  username
) => {
  volunteername = validation.checkName(volunteername);
  contact = validation.checkVolunteerInfo(contact);
  type = validation.checkVolunteerPost(type);
  description = validation.checkArticle(description);
  username = validation.accountValidation(username);

  const User = await userdb.getUserData(username);
  const userid = User._id.toString();
  const VollunteerData = {
    volunteer_name: volunteername,
    volunteer_contact: contact,
    volunteer_location: location,
    volunteer_type: type,
    volunteer_decription: description,
    user_id: userid,
  };
  await validation.convertLocation(location);
  const volunteerdb = await db.volunteerCollection();
  const insertInfo = await volunteerdb.insertOne(VollunteerData);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw "Could not add this comment";
  }
  VollunteerData._id = VollunteerData._id.toString();
  const insertuser = await userdb.putVolunteerIn(VollunteerData._id, userid);
  if (!insertuser) {
    throw "comment_id insert error";
  }
  return { volunteerid: insertInfo.insertedId.toString() };
};

const getAllVolunteerPost = async () => {
  const volunteerdb = await db.volunteerCollection();
  const postList = await volunteerdb.find({}).toArray();
  if (postList.length == 0) throw "No Volunteer in database";
  for (let index = 0; index < postList.length; index++) {
    const element = postList[index];
    element._id = element._id.toString();
  }
  return postList;
};

const getVolunteerPostsByU = async (username) => {
  username = validation.accountValidation(username);

  const user = await userdb.getUserData(username);
  let volunteeridList = user.volunteer_ids;
  let volunteerList = [];
  for (let index = 0; index < volunteeridList.length; index++) {
    const element = volunteeridList[index];
    let volunteer = await getVolunteerById(element);
    volunteerList.push(volunteer);
  }
  return volunteerList;
};

const getVolunteerById = async (volunteerid) => {
  volunteerid = validation.checkDatabaseId(volunteerid);

  const volunteerdb = await db.volunteerCollection();
  const volunteer = await volunteerdb.findOne({ _id: ObjectId(volunteerid) });
  if (!volunteer) {
    throw `can not find animal post with id of ${volunteerid}`;
  }
  volunteer._id = volunteer._id.toString();
  return volunteer;
};

const removeVolunteerById = async (id) => {
  id = validation.checkDatabaseId(id);
  //volunteer id
  const volunteerdb = await db.volunteerCollection();
  const volunteer = await volunteerdb.findOne({ _id: ObjectId(id) });
  if (!volunteer) {
    throw `could not find volunteer with id of ${id}`;
  }
  let userid = volunteer.user_id.toString();
  if (!volunteer) {
    throw "This volunteert post is not exist";
  }
  const deletionInfo = await volunteerdb.deleteOne({ _id: ObjectId(id) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete volunteert post with id of ${id}`;
  }
  const remove = await userdb.removeVolunteerFromU(id, userid);
  return `The volunteert post ${volunteer._id} has been successfully deleted!`;
};

module.exports = {
  createVolunteerPost,
  getVolunteerPostsByU,
  getVolunteerById,
  removeVolunteerById,
  getAllVolunteerPost,
};
