const db = require("../config/mongoCollection");
const userdb = require("./userData");
const animaldb = require("./animalData");
const { ObjectId } = require("mongodb");

const createComment = async (comment, username, animalid) => {
  let date = new Date();
  date = date.toUTCString();
  const commentdb = await db.commentCollection();
  const User = await userdb.getUserData(username);
  const userid = User._id.toString();
  const commentData = {
    text: comment,
    user_id: userid,
    animal_id: animalid,
    time: date,
  };
  const commentInfo = await commentdb.insertOne(commentData);
  if (!commentInfo.acknowledged || !commentInfo.insertedId) {
    throw "Could not add this comment";
  }

  commentData._id = commentData._id.toString();
  const insertuser = await userdb.putCommentIn(commentData._id, userid);
  if (!insertuser) {
    throw "comment_id insert in user error";
  }
  const insertanimal = await animaldb.putCommentIn(commentData._id, animalid);
  if (!insertanimal) {
    throw "comment_id insert in animal error";
  }
  return commentData;
};

const getCommentByPostId = async (animalid) => {
  const animal = await animaldb.getAnimalPostById(animalid);
  const commentidList = animal.comment_ids;
  let commentList = [];
  for (let index = 0; index < commentidList.length; index++) {
    const element = commentidList[index];
    let comment = await getCommentById(element);
    comment._id = comment._id.toString();
    commentList.push(comment);
  }
  return commentList;
};

const getCommentByUserId = async (userid) => {
  const user = await userdb.getUserById(userid);
  const commentidList = user.comment_ids;
  let commentList = [];
  for (let index = 0; index < commentidList.length; index++) {
    const element = commentidList[index];
    let comment = await getCommentById(element);
    comment._id = comment._id.toString();
    commentList.push(comment);
  }
  return commentList;
};

const getCommentById = async (commentid) => {
  const commentdb = await db.commentCollection();
  const comment = await commentdb.findOne({ _id: ObjectId(commentid) });
  if (!comment) {
    throw `can not find comment with id of ${commentid}`;
  }
  const user = await userdb.getUserById(comment.user_id);
  comment.username = user.first_name + " " + user.last_name;
  comment.user_account = user.user_account;
  comment._id = comment._id.toString();
  return comment;
};

const removeCommentById = async (commentid) => {
  const commentdb = await db.commentCollection();
  const commnet = await commentdb.findOne({ _id: ObjectId(commentid) });
  let userid = commnet.user_id.toString();
  let animalid = commnet.animal_id.toString();
  if (!commnet) {
    throw "This commnet is not exist";
  }
  const deletionInfo = await commentdb.deleteOne({ _id: ObjectId(commentid) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete comment with id of ${commentid}`;
  }
  const removeInfo = await userdb.removeCommentFromU(commentid, userid);
  const removeInfo2 = await animaldb.removeCommentFromA(commentid, animalid);
  if (removeInfo && removeInfo2)
    return `The comment ${commnet._id} has been successfully deleted!`;
};

const removeCommentByA = async (animalid) => {
  const animal = await animaldb.getAnimalPostById(animalid);
  const commentidList = animal.comment_ids;
  for (let index = 0; index < commentidList.length; index++) {
    const element = commentidList[index];
    removeCommentById(element);
  }
};

module.exports = {
  createComment,
  getCommentByPostId,
  removeCommentById,
  getCommentById,
  getCommentByUserId,
  removeCommentByA,
};
