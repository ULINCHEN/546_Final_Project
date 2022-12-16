const express = require('express');
const xss = require('xss');
const router = express.Router();
const publicMethods = require('../publicMethods');
const data = require('../data');
const userData = data.userData;
const animalData = data.animalData;
const volunteerData = data.volunteerData;

router.route("/usercenter/:id")
    .get(async (req, res) => {
        //code here for GET
        if (req.session.user) {
            const user = await userData.getUserData(req.session.user.username);
            const username = req.session.user.username;
            console.log(user);

            // let follow_animal_ids = user.follow_animal_ids;
            // let follow_animal_posts = [];
            // if (follow_animal_ids.length > 0){
            //     for (let i = 0, len = follow_animal_ids.length; i < len; i++){
            //         let animal_post = await animalData.getAnimalPostById(follow_animal_ids[i]);
            //         follow_animal_posts.push(animal_post);
            //     }
            // }
            let follow_animal_posts =  animalData.getFollowAnimalByUser(username);
            
            // let animal_ids = user.animal_ids;
            // let animal_posts = [];
            // if (animal_ids.length > 0){
            //     for (let i = 0, len = animal_ids.length; i < len; i++){
            //         let animal_post = await animalData.getAnimalPostById(animal_ids[i]);
            //         animal_posts.push(animal_post);
            //     }
            // }
            let animal_posts = animalData.getAnimalByUser(username);
            
            // let volunteer_ids = user.volunteer_ids;
            // let volunteer_posts = [];
            // if (volunteer_ids.length > 0){
            //     for (let i = 0, len = volunteer_ids.length; i < len; i++){
            //         let volunteer_post= await volunteerData.getVolunteerById(volunteer_ids[i]);
            //         volunteer_posts.push(volunteer_post);
            //     }
            // }
            let volunteer_posts = volunteerData.getVolunteerPostsByU(username);
            
            return res.render('userCenter', {
                title: "current user data",
                first_name: user.first_name,    //"jake", 
                last_name: user.last_name,  //"ma"
                follow_animal_posts: follow_animal_posts,
                animal_posts: animal_posts,
                volunteer_posts: volunteer_posts,
                login: true
            });
        } else {
            return res.render('error', { 
                errorMsg: 'Please login to view User Center.',
                login: false
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
                title: "login page",
                login: false
            });
        }  
    })
    .post(async (req, res) => {
        let username = xss(req.body.account);
        let password = xss(req.body.password);
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
                req.session.user = {username: username, userid: login.userid};
                return res.render('loginAlert', {
                    logMsg: "You have successfully logged in!",
                    url: '/user/usercenter/' + login.userid,
                    login: true
                });
            } else {  
                res.status(500);  
                return res.render('error', { 
                    errorMsg: 'Internal Server Error',
                    login: false
                });
            }
        } catch (e) {//login failed
            res.status(400);
            return res.render('logIn', {
                title: "login page",
                error: e,
                login: false
            });
        }
    });


router.route("/signin")
    .get(async (req, res) => {
        //code here for GET
        if (req.session.user){
            return res.redirect('/user/usercenter/'+req.session.user.userid);
        } else {
            res.render('signIn', {
                title: "signin page",
                login: false
            });
        }
    })
    .post(async (req, res) => {
        //code here for POST
        if (req.session.user){
            return res.redirect('/user/usercenter/'+req.session.user.userid);
        } else {
            let firstname = xss(req.body.firstname);
            let lastname = xss(req.body.lastname);
            let username = xss(req.body.account);
            let password = xss(req.body.password);
            let password_again = xss(req.body.password_again);
            try{
                firstname = publicMethods.checkName(firstname);
                lastname = publicMethods.checkName(lastname);
                username = publicMethods.accountValidation(username);
                password = publicMethods.passwordValidation(password);
                if (password != password_again) throw "The password entered the first and second time does not match";
            } catch (e) {
                res.status(400);
                return res.render('signIn', {
                    title: "signin page",
                    error: e,
                    login: false
                });
            }   
            try{
                const createUser = await userData.createUser(username, password, firstname, lastname);
                if (createUser.insertedUser) {
                    return res.redirect('/user/login');
                } else {
                    res.status(500);
                    return res.render('error', { 
                        errorMsg: 'Internal Server Error',
                        login: false
                    });
                }
            } catch (e) {
                res.status(400);
                return res.render('signIn', {
                    title: "signin page",
                    error: e,
                    login: false
                });
            }
        }
    });

router.route("/logout")
    .get(async (req, res) => {
        if (req.session.user){
            req.session.destroy();
            return res.render('logoutAlert', {
                logMsg: "You have successfully logged out!",
                url: '/',
                login: true
            });
        } else {
            res.status(400);
            return res.render('error', {
                errorMsg: "Please log in to log out.",
                login: false
            });
        }
    })

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
                postData: follow_animal_posts,
                login: true
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
                postData: animal_posts,
                login: true
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