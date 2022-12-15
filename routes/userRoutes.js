const express = require('express');
const router = express.Router();
const publicMethods = require('../publicMethods');
const data = require('../data');
const userData = data.userData;
const animalData = data.animalData;

router.route("/usercenter/:id")
    .get(async (req, res) => {
        //code here for GET
        if (req.session.user) {
            const user = await userData.getUserData(req.session.user.username);
            let follow_animal_ids = user.follow_animal_id;
            let follow_animal_posts = [];
            for (let i = 0, len = follow_animal_ids.length; i < len; i++){
                let animal_post = await animalData.getAnimalPostById(follow_animal_ids[i]);
                follow_animal_posts.push(animal_post);
            }
            let animal_ids = user.animal_id;
            let animal_posts = [];
            for (let i = 0, len = animal_ids.length; i < len; i++){
                let animal_post = await animalData.getAnimalPostById(animal_ids[i]);
                animal_posts.push(animal_post);
            }
            let volunteer_ids = user.volunteer_ids;
            let volunteer_posts = [];
            for (let i = 0, len = volunteer_ids.length; i < len; i++){
                let volunteer_post= await volunteerData.getVolunteerPostById(volunteer_ids[i]);
                volunteer_posts.push(volunteer_post);
            }
            return res.render('userCenter', {
                title: "current user data",
                first_name: user.first_name,    //"jake", 
                last_name: user.last_name,  //"ma"
                follow_animal_posts: follow_animal_posts,
                animal_posts: animal_posts,
                volunteer_posts: volunteer_posts
            });
        } else {
            return res.render('error', { 
                errorMsg: 'Please login to view User Center.'
            });
        }
    });

router.route("/login")
    .get(async (req, res) => {
        //code here for GET
        if (req.session.user){
            return res.redirect('/user');
        } else {
            res.render('logIn', {
                title: "login page"
            });
        }  
    })
    .post(async (req, res) => {
        let username = xss(req.body.inputAccount);
        let password = xss(req.body.inputPassword);
        try{
            username = publicMethods.accountValidation(username);
            password = publicMethods.passwordValidation(password);
        } catch (e) {
            res.status(400);
            return res.redirect('/user/login');
        }
        try {
            const login = await userData.checkUser(username, password);
            if (login.authenticatedUser) {
                req.session.user = {username: username};
                return res.redirect('/');
            } else {    //login failed
                return res.render('logIn', {
                    title: "login page",
                    error: true
                });
            }
        } catch (e) {
            res.status(400);
            return res.render('error', { 
                errorMsg: e
            });
        }
    });


router.route("/signin")
    .get(async (req, res) => {
        //code here for GET
        if (req.session.user){
            return res.redirect('/user');
        } else {
            res.render('signIn', {
                title: "signin page"
            });
        }
    })
    .post(async (req, res) => {
        //code here for POST
        let username = xss(req.body.inputAccount);
        let password = xss(req.body.inputPassword);
        let errors = [];
        try{
            username = publicMethods.accountValidation(username);
            password = publicMethods.passwordValidation(password);
        } catch (e) {
            errors.push(e);
        }   
        try{
            const createUser = await userData.createUser(username, password);
            if (createUser.insertedUser) {
                return res.redirect('/user/login');
            } else {
                res.status(500);
                return res.send('Internal Server Error');
            }
        } catch (e) {
            res.status(400);
            return res.redirect('/user/signin');
        }
    });

router.route("/followed")
    .get(async (req, res) => {
        //code here for GET
        //这里需要有个方法通过用户id拉出follow的动物信息
        if (req.session.user) {
            let user = await userData.getUserData(req.session.user.username);
            let follow_animal_ids = user.follow_animal_id;
            let follow_animal_posts = [];
            for (let i = 0, len = follow_animal_ids.length; i < len; i++){
                let animal_post = await animalData.getAnimalPostById(follow_animal_ids[i]);
                follow_animal_posts.push(animal_post);
            }
            return res.render('animalPost', {
                title: "followed page",
                postData: follow_animal_posts
            });
        } else {
            return res.redirect('/user/login');
        }
    });

router.route("/mypost")
    .get(async (req, res) => {
        //code here for GET
        //这里需要有个方法通过用户id拉出其发布的帖子信息
        if (req.session.user) {
            let user = await userData.getUserData(req.session.user.username);
            let animal_ids = user.animal_id;
            let animal_posts = [];
            for (let i = 0, len = animal_ids.length; i < len; i++){
                let animal_post = await animalData.getAnimalPostById(animal_ids[i]);
                animal_posts.push(animal_post);
            }
            res.render('animalPost', {
                title: "my post page",
                postData: animal_posts
            });
        } else {
            return res.redirect('/user/login');
        }
    });

router.route("/edit/:id")
    .get(async (req, res) => {
        //code here for GET
        //这里需要将对应ID的用户资料传到页面
        res.render('editUserInfo', {

        })
    })
    .post(async (req, res) => {
        console.log(req.body);
        res.redirect('/user/login');
    })

module.exports = router;