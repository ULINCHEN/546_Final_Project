const animalRoutes = require('./animalRoutes');
const userRoutes = require('./userRoutes');
const volunteerRoutes = require('./volunteerRoutes');


const constructorMethod = (app) => {

    app.get('/', (req, res) => {
        res.redirect('/animal');
    });

    app.use('/animal', animalRoutes);
    app.use('/volunteer', volunteerRoutes);
    app.use('/user', userRoutes);

    app.get('/user/usercenter', (req, res) => {
        if (req.session.user)
            return res.redirect('/user/usercenter/' + req.session.user.userid);
        else
            return res.render('error', {
                errorMsg: "Please log in to view User Center",
                login: false
            })
    })

    app.use('*', (req, res) => {
        res.render('error', {
            errorMsg: "Page Not Found",
            login: false
        })
    });
};

module.exports = constructorMethod;