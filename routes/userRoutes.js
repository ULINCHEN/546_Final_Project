const express = require('express');
const router = express.Router();


router.route("/")
    .get(async (req, res) => {
        //code here for GET
        res.render('userCenter', {
            title: "current user data"
        })
    });

router.route("/login")
    .get(async (req, res) => {
        //code here for GET
        res.render('logIn', {
            title: "login page"
        })
    });


router.route("/signin")
    .get(async (req, res) => {
        //code here for GET
        res.render('signIn', {
            title: "signin page"
        })
    });

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
            title: "followed page"
        })
    });

module.exports = router;