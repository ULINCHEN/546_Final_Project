// fake data, run this before test


// const { userCollection } = require('../config/mongoCollections');
const { dbConnection, closeConnection } = require('./config/mongoConnection');
const { userCollection, animalPostCollection } = require('./config/mongoCollection');
const { createAnimalPost, getAllAnimalPosts } = require('./data/animalData');
const { getDate } = require('./publicMethods');

const main = async () => {

    const db = await dbConnection();
    await db.dropDatabase();

    let animalName = 'testdog1';
    let species = 'dog';
    let description = 'testtesttesttesttesttesttesttesttesttesttesttest';
    let healthCondition = 'bad';
    let time = getDate();
    let animalPhoto = 'https://plus.unsplash.com/premium_photo-1667099521841-8078e09b47f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80';
    let location = 'hoboken';

    // first add user, should be add to database
    try {
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);
        await createAnimalPost(animalName, species, description, healthCondition, time, animalPhoto, location);

    }
    catch (e) {
        console.log(e);
    }





    // connect to database and return all document
    const col = await animalPostCollection();
    const cursor = await col.find({}).toArray();

    console.log('all doc: ', cursor);
    console.log("Seeding Process Finished");

    // close 
    closeConnection();

}


main();