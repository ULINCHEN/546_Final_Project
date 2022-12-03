const { animalPostCollection } = require('../config/mongoCollection');

const createAnimalPost = async (
    animalName,
    species,
    description,
    healthCondition,
    time,
    animalPhoto,
    location,
) => {

    if (!animalName) throw 'Animal name can not be empty';
    if (!species) throw 'Species can not be empty';
    if (!description) throw 'Description can not be empty';
    if (!healthCondition) throw 'HealthCondition can not be empty';
    if (!time) throw 'Time can not be empty';
    // animal photo can be empty
    if (!location) throw 'Location can not be empty';

    // locationId = somefunction(location) 这里应该要把location 转化成 locationId
    // location 暂时没加入postData
    const postData = {
        animal_name: animalName,
        species: species,
        description: description,
        health_condition: healthCondition,
        find_time: time,
        animal_photo: animalPhoto,
        location_id: [],
        user_id: [],
        comment_id: [],
    }

    const col = await animalPostCollection();

    const info = await col.insertOne(postData);
    if (!info.acknowledged || !info.insertedId) throw 'Could not add this user';
    return { insertedAnimalPost: true };

}

const getAllAnimalPosts = async () => {
    const col = await animalPostCollection();
    const postList = await col.find({}).toArray();
    if (postList.length == 0) throw 'No Animal in database';
    return postList;
}



module.exports = { createAnimalPost, getAllAnimalPosts }