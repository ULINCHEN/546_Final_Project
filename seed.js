// // fake data, run this before test

const dbcon = require("./config/mongoConnection");
const { volunteerData } = require("./data");
// const db = require("./config/mongoCollection");
const Data = require("./data");

const main = async () => {
  const Database = await dbcon.dbConnection();
  await Database.dropDatabase();
  try {
    var user1 = await Data.userData.createUser(
      "abcd@123.com",
      "abcd123",
      "Mary",
      "May"
    );
    // console.log(user1);
  } catch (error) {
    console.log(error);
  }
  try {
    var user2 = await Data.userData.createUser(
      "test@123.com",
      "test123",
      "Maryyyy",
      "May"
    );
    // console.log(user2);
    // console.log(user2.userID);
  } catch (error) {
    console.log(error);
  }
  try {
    var user3 = await Data.userData.createUser(
      "abcdef@123.com",
      "abcdefg123",
      "April",
      "May"
    );
    // console.log(user1);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal1 = await Data.animalData.createAnimalPostForSeed(
      "miaomiao",
      "Cat",
      "cute!!!!!",
      "Normal",
      "hoboken nj",
      "12/2/2022 12:22",
      user2.userid
    );
    // console.log(animal1);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal2 = await Data.animalData.createAnimalPostForSeed(
      "wangwang",
      "Dog",
      "cute!!!!!",
      "Normal",
      "hoboken nj",
      "12/2/2022 12:02",
      user2.userid
    );
    // console.log(animal1);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal3 = await Data.animalData.createAnimalPostForSeed(
      "mimi",
      "Cat",
      "cute!!!!!",
      "Good",
      "Stevens institute of technology",
      "12/12/2022 12:22",
      user2.userid
    );
    // console.log(animal3);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal4 = await Data.animalData.createAnimalPostForSeed(
      "doggggggggg",
      "Dog",
      "cute!!!!!",
      "Bad",
      "hoboken nj",
      "12/22/2022 12:02",
      user1.userid
    );
    // console.log(animal4);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal5 = await Data.animalData.createAnimalPostForSeed(
      "afaufiafaof",
      "Dog",
      "cute!!!!!",
      "Good",
      "706 Eastern Pkwy, Brooklyn, NY 11213",
      "12/12/2022 12:2",
      user1.userid
    );
    // console.log(animal4);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal6 = await Data.animalData.createAnimalPostForSeed(
      "haha",
      "Others",
      "cute!!!!!",
      "Normal",
      "Stamford Town Center",
      "11/2/2022 12:22",
      user3.userid
    );
    // console.log(animal1);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal7 = await Data.animalData.createAnimalPostForSeed(
      "hahahaha",
      "Others",
      "cute!!!!!",
      "Normal",
      "Flatbush Ave",
      "11/2/2022 10:22",
      user3.userid
    );
    // console.log(animal1);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal8 = await Data.animalData.createAnimalPost(
      "abab",
      "Others",
      "cute!!!!!",
      "Normal",
      "Stamford Town Center",
      user3.userid
    );
    // console.log(animal1);
  } catch (error) {
    console.log(error);
  }
  try {
    let follow1 = await Data.animalData.putFollowInUser(
      animal4.animalid,
      user2.userid
    ); //639b8a7f243dbaead1371918
    // console.log(a.comm);
    // console.log(follow1);
  } catch (error) {
    console.log(error);
  }
  try {
    let getanimalbyuser1 = await Data.animalData.getAnimalByUser(
      "test@123.com"
    );
    // console.log(getanimalbyuser1);
  } catch (error) {
    console.log(error);
  }
  try {
    var addcomment1 = await Data.commentData.createComment(
      "ababababaaaaa",
      "test@123.com",
      animal3.animalid
    );
    // console.log(addcomment1);
  } catch (error) {
    console.log(error);
  }

  try {
    let addcomment2 = await Data.commentData.createComment(
      "cuttttteeeeeee",
      "test@123.com",
      animal3.animalid
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }

  try {
    let addvolunteer1 = await Data.volunteerData.createVolunteerPost(
      "nicehouse",
      "1231234444",
      "6th ST",
      "Organization",
      "An organazation that orders free treatment for stray animals.",
      "test@123.com"
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }
  try {
    let addvolunteer2 = await volunteerData.createVolunteerPost(
      "ggiuviu",
      "1234567890",
      "location",
      "Individual",
      "description",
      "test@123.com"
    );
    // console.log(addvolunteer);
  } catch (error) {
    console.log(error);
  }
  try {
  } catch (error) {
    console.log(error);
  }
  try {
  } catch (error) {
    console.log(error);
  }
  //   try {
  //     let checkuser1 = await Data.userData.checkUser("abcd@123.com", "abcd123");
  //     console.log(checkuser1);
  //   } catch (error) {
  //     console.log(error);
  //   }
  dbcon.closeConnection();
};

main();
