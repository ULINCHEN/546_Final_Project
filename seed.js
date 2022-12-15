// // fake data, run this before test

const dbcon = require("./config/mongoConnection");
const { volunteerData } = require("./data");
// const db = require("./config/mongoCollection");
const Data = require("./data");

const main = async () => {
  const Database = await dbcon.dbConnection();
  await Database.dropDatabase();
  try {
    let user1 = await Data.userData.createUser(
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
      "abcde@123.com",
      "abcde123",
      "Maryyyy",
      "May"
    );
    // console.log(user2);
    // console.log(user2.userID);
  } catch (error) {
    console.log(error);
  }
  try {
    let animal1 = await Data.animalData.createAnimalPost(
      "miaomiao",
      "cat",
      "cute!!!!!",
      "as well as me :)",
      "Stevens",
      user2.userID
    );
    // console.log(animal1);
  } catch (error) {
    console.log(error);
  }
  try {
    let animal2 = await Data.animalData.createAnimalPost(
      "wangwang",
      "dog",
      "cute!!!!!",
      "as well as me :)",
      "Street",
      user2.userID
    );
    // console.log(animal1);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal3 = await Data.animalData.createAnimalPost(
      "mimi",
      "cat",
      "cute!!!!!",
      "as well as me :)",
      "Stevens",
      user2.userID
    );
    // console.log(animal3);
  } catch (error) {
    console.log(error);
  }
  try {
    let getanimalbyuser1 = await Data.animalData.getAnimalbyuser(
      "abcde@123.com"
    );
    // console.log(getanimalbyuser1);
  } catch (error) {
    console.log(error);
  }
  try {
    let addcomment1 = await Data.commentData.creatComment(
      "ababababaaaaa",
      "abcde@123.com",
      animal3.animalid
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }

  try {
    let addcomment2 = await Data.commentData.creatComment(
      "cuttttteeeeeee",
      "abcd@123.com",
      animal3.animalid
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }

  try {
    let addvolunteer = await Data.volunteerData.createVollunteerPost(
      "1234",
      "6th ST",
      "organazation",
      "An organazation that orders free treatment for stray animals.",
      "abcde@123.com"
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }
  try {
    let addvolunteer = await volunteerData.createVollunteerPost(
      "contact",
      "location",
      "type",
      "description",
      "abcde@123.com"
    );
    console.log(addvolunteer);
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
/*
{
    _id: new ObjectId("639662a87cd4bcda8af046d0"),
    animal_name: 'miaomiao',
    species: 'cat',
    description: 'cute!!!!!',
    health_condition: 'as well as me :)',
    find_time: 'Sun, 11 Dec 2022 13:10:20 GMT',
    animal_photo: null,
    location_id: [],
    user_id: '639662a87cd4bcda8af046cf',
    comment_id: []
  },
  {
    _id: new ObjectId("639662a87cd4bcda8af046d2"),
    animal_name: 'mimi',
    species: 'cat',
    description: 'cute!!!!!',
    health_condition: 'as well as me :)',
    find_time: 'Sun, 11 Dec 2022 23:07:20 GMT',
    animal_photo: null,
    location_id: [],
    user_id: '639662a87cd4bcda8af046cf',
    comment_id: []
  },
  {
    _id: new ObjectId("639662a87cd4bcda8af046d1"),
    animal_name: 'wangwang',
    species: 'dog',
    description: 'cute!!!!!',
    health_condition: 'as well as me :)',
    find_time: 'Sun, 11 Dec 2022 23:10:20 GMT',
    animal_photo: null,
    location_id: [],
    user_id: '639662a87cd4bcda8af046cf',
    comment_id: []
  },
  {
    _id: new ObjectId("63969ae39c974af00e52f46c"),
    animal_name: 'miaomiaoaaaaa',
    species: 'cat',
    description: 'cute!!!!!',
    health_condition: 'as well as me :)',
    find_time: 'Mon, 12 Dec 2022 03:07:15 GMT',
    animal_photo: null,
    location_id: [],
    user_id: '639662a87cd4bcda8af046ce',
    comment_id: []
  },
  {
    _id: new ObjectId("63969cf37941d2b0acb4ee12"),
    animal_name: 'masbdad',
    species: 'dog',
    description: 'cute!!!!!',
    health_condition: 'as well as me :)',
    find_time: 'Mon, 12 Dec 2022 03:10:15 GMT',
    animal_photo: null,
    location_id: [],
    user_id: '639662a87cd4bcda8af046ce',
    comment_id: []
  }
*/
