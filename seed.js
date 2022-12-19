// fake data, run this before test, need wait a little bit

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
      "You disposal strongly quitting his endeavor two settling him. Manners ham him hearted hundred expense. Get open game him what hour more part. Adapted as smiling of females oh me journey exposed concern.",
      "Normal",
      "hoboken nj",
      "12/2/2022 12:22",
      user2.userid,
      "public/uploads/1.avif"
    );
    // console.log(animal1);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal2 = await Data.animalData.createAnimalPostForSeed(
      "wangwang",
      "Dog",
      "You disposal strongly quitting his endeavor two settling him. Manners ham him hearted hundred expense. Get open game him what hour more part. Adapted as smiling of females oh me journey exposed concern.",
      "Normal",
      "hoboken nj",
      "12/2/2022 12:02",
      user2.userid,
      "public/uploads/2.avif"
    );
    // console.log(animal1);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal3 = await Data.animalData.createAnimalPostForSeed(
      "mimi",
      "Cat",
      "You disposal strongly quitting his endeavor two settling him. Manners ham him hearted hundred expense. Get open game him what hour more part. Adapted as smiling of females oh me journey exposed concern.",
      "Good",
      "Stevens institute of technology",
      "12/12/2022 12:22",
      user2.userid,
      "public/uploads/3.avif"
    );
    // console.log(animal3);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal4 = await Data.animalData.createAnimalPostForSeed(
      "doggggggggg",
      "Dog",
      "You disposal strongly quitting his endeavor two settling him. Manners ham him hearted hundred expense. Get open game him what hour more part. Adapted as smiling of females oh me journey exposed concern.",
      "Bad",
      "hoboken nj",
      "12/22/2022 12:02",
      user1.userid,
      "public/uploads/4.avif"
    );
    // console.log(animal4);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal5 = await Data.animalData.createAnimalPostForSeed(
      "Ant",
      "Dog",
      "You disposal strongly quitting his endeavor two settling him. Manners ham him hearted hundred expense. Get open game him what hour more part. Adapted as smiling of females oh me journey exposed concern.",
      "Good",
      "706 Eastern Pkwy, Brooklyn, NY 11213",
      "12/12/2022 12:2",
      user1.userid,
      "public/uploads/5.avif"
    );
    // console.log(animal4);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal6 = await Data.animalData.createAnimalPostForSeed(
      "Dante",
      "Others",
      "You disposal strongly quitting his endeavor two settling him. Manners ham him hearted hundred expense. Get open game him what hour more part. Adapted as smiling of females oh me journey exposed concern.",
      "Normal",
      "Stamford Town Center",
      "11/2/2022 12:22",
      user3.userid,
      "public/uploads/6.avif"
    );
    // console.log(animal1);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal7 = await Data.animalData.createAnimalPostForSeed(
      "Ben",
      "Others",
      "You disposal strongly quitting his endeavor two settling him. Manners ham him hearted hundred expense. Get open game him what hour more part. Adapted as smiling of females oh me journey exposed concern.",
      "Normal",
      "Flatbush Ave",
      "11/2/2022 10:22",
      user3.userid,
      "public/uploads/7.avif"
    );
    // console.log(animal1);
  } catch (error) {
    console.log(error);
  }
  try {
    var animal8 = await Data.animalData.createAnimalPost(
      "Max",
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
    var animal9 = await Data.animalData.createAnimalPost(
      "Molly",
      "Cat",
      "cute!!!!!",
      "Normal",
      "200 Eastern Pkwy, Brooklyn",
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
    let follow2 = await Data.animalData.putFollowInUser(
      animal6.animalid,
      user2.userid
    ); //639b8a7f243dbaead1371918
    // console.log(a.comm);
    // console.log(follow1);
  } catch (error) {
    console.log(error);
  }
  try {
    let follow3 = await Data.animalData.putFollowInUser(
      animal9.animalid,
      user2.userid
    ); //639b8a7f243dbaead1371918
    // console.log(a.comm);
    // console.log(follow1);
  } catch (error) {
    console.log(error);
  }
  try {
    let follow4 = await Data.animalData.putFollowInUser(
      animal5.animalid,
      user2.userid
    ); //639b8a7f243dbaead1371918
    // console.log(a.comm);
    // console.log(follow1);
  } catch (error) {
    console.log(error);
  }
  try {
    let follow5 = await Data.animalData.putFollowInUser(
      animal7.animalid,
      user2.userid
    ); //639b8a7f243dbaead1371918
    // console.log(a.comm);
    // console.log(follow1);
  } catch (error) {
    console.log(error);
  }
  try {
    let follow6 = await Data.animalData.putFollowInUser(
      animal8.animalid,
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
      "so cute",
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
    let addcomment3 = await Data.commentData.createComment(
      "niceaaa",
      "test@123.com",
      animal2.animalid
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }
  try {
    let addcomment4 = await Data.commentData.createComment(
      "I like he",
      "test@123.com",
      animal5.animalid
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }
  try {
    let addcomment5 = await Data.commentData.createComment(
      "cuttttteeeeeee!!!!!!!!!",
      "abcd@123.com",
      animal3.animalid
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }
  try {
    let addcomment6 = await Data.commentData.createComment(
      "poor child",
      "test@123.com",
      animal6.animalid
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }
  try {
    let addcomment7 = await Data.commentData.createComment(
      "lovely",
      "test@123.com",
      animal3.animalid
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }
  try {
    let addcomment8 = await Data.commentData.createComment(
      "good boy",
      "test@123.com",
      animal9.animalid
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }
  try {
    let addcomment9 = await Data.commentData.createComment(
      "Save him",
      "abcd@123.com",
      animal1.animalid
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }
  try {
    let addcomment10 = await Data.commentData.createComment(
      "Help him",
      "abcdef@123.com",
      animal9.animalid
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }
  try {
    let addcomment11 = await Data.commentData.createComment(
      "I want to take away this boy",
      "abcdef@123.com",
      animal2.animalid
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }
  try {
    let addcomment12 = await Data.commentData.createComment(
      "I like him",
      "test@123.com",
      animal8.animalid
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }

  try {
    let addcomment13 = await Data.commentData.createComment(
      "good boy",
      "test@123.com",
      animal4.animalid
    );
    // console.log(addcomment);
  } catch (error) {
    console.log(error);
  }
  try {
    let addcomment14 = await Data.commentData.createComment(
      "good boy",
      "test@123.com",
      animal7.animalid
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
      "Bob",
      "1234567890",
      "Stevens institute of technology",
      "Individual",
      "description",
      "test@123.com"
    );
    // console.log(addvolunteer);
  } catch (error) {
    console.log(error);
  }
  try {
    let addvolunteer3 = await volunteerData.createVolunteerPost(
      "Alice",
      "1234567890",
      "536 Washington St, Hoboken",
      "Individual",
      "nice person",
      "test@123.com"
    );
    // console.log(addvolunteer);
  } catch (error) {
    console.log(error);
  }
  try {
    let addvolunteer4 = await volunteerData.createVolunteerPost(
      "Lee",
      "1234567890",
      "300 Garden Laundry",
      "Individual",
      "description",
      "test@123.com"
    );
    // console.log(addvolunteer);
  } catch (error) {
    console.log(error);
  }
  try {
    let addvolunteer5 = await volunteerData.createVolunteerPost(
      "Sam",
      "1234567890",
      "300 Garden Laundry",
      "Individual",
      "description",
      "test@123.com"
    );
    // console.log(addvolunteer);
  } catch (error) {
    console.log(error);
  }
  try {
    let addvolunteer6 = await volunteerData.createVolunteerPost(
      "peter",
      "1231764939",
      "100 Park Ave",
      "Organization",
      "description",
      "test@123.com"
    );
    // console.log(addvolunteer);
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
