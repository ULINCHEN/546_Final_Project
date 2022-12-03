const express = require('express');
const router = express.Router();


router.route("/")
    .get(async (req, res) => {
        //code here for GET
        res.render('volunteerPosts', {
            title: "all volunteer post"
        })
    });


router.route("/detail/:id")
    .get(async (req, res) => {
        //code here for GET
        res.render('postDetail', {
            title: "volunteer details",
            id: req.params.id
        })
    });

router.route("/new")
    .get(async (req, res) => {
        //code here for GET
        res.render('addPost', {
            title: "add new volunteer post",
        })
    });

module.exports = router;