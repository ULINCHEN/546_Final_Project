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


module.exports = router;