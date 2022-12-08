const { createAnimalPost, getAllAnimalPosts, getAnimalPostById } = require('./animalData');
const { createUser, checkUser } = require('./userData');
const { createVolunteer, getAllVolunteerPosts } = require('./volunteerData');


module.exports = {
    createAnimalPost,
    getAllAnimalPosts,
    getAnimalPostById,
    createUser,
    checkUser,
    createVolunteer,
    getAllVolunteerPosts
}