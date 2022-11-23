const animalRoutes = require('./animalRoutes');
const userRoutes = require('./userRoutes');
const volunteerRoutes = require('./volunteerRoutes');
const mainPageRoutes = require('./mainPageRoutes');


const constructorMethod = (app) => {

    app.use('/', mainPageRoutes);

    app.use('/animal', animalRoutes);
    app.use('/volunteer', volunteerRoutes);
    app.use('/user', userRoutes);

    app.use('*', (req, res) => {
        res.render('error', {
            errorMsg: "页面不存在"
        })
    });
};

module.exports = constructorMethod;