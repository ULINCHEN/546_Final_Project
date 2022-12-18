const user = require("./userData");
const animal = require("./animalData");
const location = require("./locationData");
const comment = require("./commentData");
const volunteer = require("./volunteerData");
module.exports = {
  userData: user,
  animalData: animal,
  locationData: location,
  commentData: comment,
  volunteerData: volunteer,
};

// /**
//  *
//  * @param {*} collection - collection name
//  * @returns - return a connected collection
//  */

// const getCollectionFn = (collection) => {
//   let _col = undefined;

//   return async () => {
//     if (!_col) {
//       const db = await dbConnection.dbConnection();
//       _col = await db.collection(collection);
//     }

//     return _col;
//   };
// };

// module.exports = {
//   userCollection: getCollectionFn("user_collection"),
// };
