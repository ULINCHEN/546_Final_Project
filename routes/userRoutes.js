const express = require('express');
const router = express.Router();


router.route("/usercenter/:id")
    .get(async (req, res) => {
        //code here for GET
        res.render('userCenter', {
            title: "current user data",
            first_name: "jake",
            last_name: "ma"
        })
    })

router.route("/login")
    .get(async (req, res) => {
        //code here for GET
        res.render('logIn', {
            title: "login page"
        })
    })
    .post(async (req, res) => {

        console.log(req.body);
        res.redirect('/');
    })


router.route("/signin")
    .get(async (req, res) => {
        //code here for GET
        res.render('signIn', {
            title: "signin page"
        })
    })
    .post(async (req, res) => {
        console.log(req.body);
        res.redirect('/user/login');
    })


router.route("/followed")
    .get(async (req, res) => {
        //code here for GET
        //这里需要有个方法通过用户id拉出follow的动物信息
        res.render('animalPost', {
            title: "followed page"
        })
    });

router.route("/mypost")
    .get(async (req, res) => {
        //code here for GET
        //这里需要有个方法通过用户id拉出其发布的帖子信息
        res.render('animalPost', {
            title: "my post page"
        })
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