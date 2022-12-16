// fake data, run this before test


// const { userCollection } = require('../config/mongoCollections');
const { dbConnection, closeConnection } = require('./config/mongoConnection');
const { userCollection, animalPostCollection, volunteerCollection } = require('./config/mongoCollection');
const { createAnimalPost, getAllAnimalPosts } = require('./data/animalData');
const { createVolunteer } = require('./data/volunteerData');
const { createUser } = require('./data/userData');
const { getDate } = require('./publicMethods');

const main = async () => {

    const db = await dbConnection();
    await db.dropDatabase();
    let dataScale = 25;

    // fake animal post data
    let baseName = 'testdog';
    let species = 'dog';
    let description = 'testtesttesttesttesttesttesttesttesttesttesttest';
    let healthCondition = 'bad';
    let time = getDate();
    let animalPhoto = 'https://plus.unsplash.com/premium_photo-1667099521841-8078e09b47f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80';
    let location = '40.7447099, -74.0289506';

    // first add user, should be add to database
    try {
        for (let i = 0; i < dataScale; ++i) {
            let animalName = baseName + i;
            await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        }
    }
    catch (e) {
        console.log(e);
    }


    // fake user data
    let first_name = 'Owen';
    let last_name = 'Wang';
    let user_account = 'owenwang@gmail.com';
    let user_password = '1234567ABCabc';

    try {
        for (let i = 0; i < dataScale; ++i) {
            await createUser(user_account + i, user_password, first_name, last_name);
        }
    }
    catch (e) {
        console.log(e);
    }

    // fake volunteer data
    let name = 'Paws hospital';
    let contact = 'testtest@gmail.com';
    location = 'Jersey City, 6th st';
    let type = 'organazation';
    let decription = 'An organazation that orders free treatment for stray animals.';

    try {
        for (let i = 0; i < dataScale; ++i) {
            await createVolunteer(name, contact + i, location, type, decription);
        }
    }
    catch (e) {
        console.log(e);
    }



    // connect to database and return all document
    let col = await animalPostCollection();
    let cursor = await col.find().toArray();


    console.log('all animal post: ', cursor);


    col = await userCollection();
    cursor = await col.find().toArray();

    console.log('all user data: ', cursor);


    col = await volunteerCollection();
    cursor = await col.find().toArray();

    console.log('all volunteer data: ', cursor);


    console.log("Seeding Process Finished");

    // close 
    closeConnection();

}


main();