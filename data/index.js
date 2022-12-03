const dbConnection = require('./mongoConnection');


/**
 * 
 * @param {*} collection - collection name
 * @returns - return a connected collection
 */

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
    userCollection: getCollectionFn('user_collection'),
};
