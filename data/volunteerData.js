const { volunteerCollection } = require('../config/mongoCollection');



const createVolunteer = async (name, contact, location, type, decription) => {

    const volunteerData = {
        volunteer_name: name,
        volunteer_contact: contact,
        volunteer_location: location,
        volunteer_type: type,
        volunteer_decription: decription
    }

    const col = await volunteerCollection();

    const info = await col.insertOne(volunteerData);
    if (!info.acknowledged || !info.insertedId) throw 'Could not add this volunteer';
    return { insertedVolunteer: true };

}

const getAllVolunteerPosts = async () => {
    const col = await volunteerCollection();
    const postList = await col.find({}).toArray();
    if (postList.length == 0) throw 'No volunteer in database';
    return postList;
}


module.exports = { createVolunteer, getAllVolunteerPosts };