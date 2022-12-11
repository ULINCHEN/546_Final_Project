const express = require('express');
const { createAnimalPost, getAllAnimalPosts, getAnimalPostById } = require('../data');
const router = express.Router();


router.route("/")
    .get(async (req, res) => {
        //code here for GET
        const postData = await getAllAnimalPosts();

        res.render('animalPosts', {
            postData: postData,

        })
    });


router.route("/detail/:id")
    .get(async (req, res) => {
        //code here for GET
        let id = req.params.id;
        console.log(id);
        let post = await getAnimalPostById(id);

        res.render('postDetail', {
            id: req.params.id,
            post: post
        })
    });

router.route("/new")
    .get(async (req, res) => {
        //code here for GET
        res.render('addPost', {
            title: "add new animal post",
        })
    })

    .post(async (req, res) => {
        console.log(req.body);
        res.render('addPost');
    })

module.exports = router;