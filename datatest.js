const { compareSync } = require("bcryptjs");
const { volunteerCollection } = require("./config/mongoCollection");
const dbcon = require("./config/mongoConnection");
const { animalData, volunteerData } = require("./data");
const Data = require("./data");

const main = async () => {
  const Database = await dbcon.dbConnection();
  //   await Database.dropDatabase();

  // try {
  //   let getanimalbyuser1 = await Data.animalData.getAnimalbyuser(
  //     "abcde@123.com"
  //   );
  //   console.log(getanimalbyuser1);
  // } catch (error) {
  //   console.log(error);
  // }

  // try {
  //   let getUser = await Data.userData.getUserdata("abcde@123.com");
  //   console.log(getUser);
  // } catch (error) {
  //   console.log(error);
  // }

  // try {
  //   let addcomment = await Data.volunteerData.createVollunteerPost(
  //     "1234",
  //     "6th ST",
  //     "organazation",
  //     "An organazation that orders free treatment for stray animals.",
  //     "abcde@123.com"
  //   );
  //   console.log(addcomment);
  // } catch (error) {
  //   console.log(error);
  // }

  // try {
  //   let all = await Data.animalData.getAnimalByType("cat");
  //   console.log(all);
  // } catch (error) {
  //   console.log(error);
  // }

  // try {
  //   let animal1 = await Data.animalData.createAnimalPost(
  //     "doggggggggg",
  //     "dog",
  //     "cute!!!!!",
  //     "as well as me :)",
  //     "Stevens",
  //     "639662a87cd4bcda8af046cf"
  //   );
  //   console.log(animal1);
  // } catch (error) {
  //   console.log(error);
  // }

  // try {
  //   let user2 = await Data.userData.createUser(
  //     "abcdefg@123.com",
  //     "abcde123qqq",
  //     "Maryyyy",
  //     "May"
  //   );
  //   console.log(user2);
  //   // console.log(user2.userID);
  // } catch (error) {
  //   console.log(error);
  // }

  // try {
  //   let addcomment = await Data.commentData.creatComment(
  //     "abaaaaaab",
  //     "abcde@123.com",
  //     "639662a87cd4bcda8af046d1"
  //   );
  //   // console.log(addcomment);
  // } catch (error) {
  //   console.log(error);
  // }
  // try {
  //   let remove1 = await Data.commentData.removeCommentById(
  //     "639752b600de8928732fb086"
  //   );
  //   console.log(remove1);
  // } catch (error) {
  //   console.log(error);
  // }

  try {
    let remove = await volunteerData.getAllVollunteerPosts("abcde@123.com"); //639b8a7f243dbaead1371918
    // console.log(a.comm);
    console.log(remove);
  } catch (error) {
    console.log(error);
  }

  dbcon.closeConnection();
};

main();