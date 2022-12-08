const dbConnection = require('./mongoConnection');


const getCollectionFn = (collection) => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection.dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    };
};


module.exports = {
    animalPostCollection: getCollectionFn('animalPostCollection'),
    commentCollection: getCollectionFn('commentCollection'),
    locationCollection: getCollectionFn('locationCollection'),
    userCollection: getCollectionFn('userCollection'),
    volunteerCollection: getCollectionFn('volunteerCollection')
};
