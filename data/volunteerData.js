const db = require("../config/mongoCollection");
const userdb = require("./userData");
const { ObjectId } = require("mongodb");

const createVollunteerPost = async (
  contact,
  location,
  type,
  description,
  username
) => {
  const User = await userdb.getUserdata(username);
  const userid = User._id.toString();
  const VollunteerData = {
    volunteer_contact: contact,
    volunteer_location: location,
    volunteer_type: type,
    volunteer_decription: description,
    user_id: userid,
  };
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
};

const getAllVollunteerPosts = async (username) => {
  const user = await userdb.getUserdata(username);
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
  const volunteerdb = await db.volunteerCollection();
  const volunteer = await volunteerdb.findOne({ _id: ObjectId(volunteerid) });
  if (!volunteer) {
    throw `can not find animal post with id of ${volunteerid}`;
  }
  volunteer._id = volunteer._id.toString();
  return volunteer;
};

const removeVolunteerById = async (id) => {
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
  createVollunteerPost,
  getAllVollunteerPosts,
  getVolunteerById,
  removeVolunteerById,
};
