const express = require('express');
const router = express.Router();
const { getAllVolunteerPosts } = require('../data');


router.route("/")
    .get(async (req, res) => {
        //code here for GET
        const postData = await getAllVolunteerPosts();
        res.render('volunteerPosts', {
            postData: postData
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
        res.render('addVolunteerPost', {
            title: "add new volunteer post",
        })
    })

    .post(async (req, res) => {
        console.log(req.body);
        res.render('addVolunteerPost');
    })

module.exports = router;