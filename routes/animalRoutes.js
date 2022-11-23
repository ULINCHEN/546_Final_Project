const express = require('express');
const router = express.Router();


router.route("/")
    .get(async (req, res) => {
        //code here for GET
        res.render('allPost', {
            title: "all animal post"
        })
    });


router.route("/detail/:id")
    .get(async (req, res) => {
        //code here for GET
        res.render('postDetail', {
            title: "animal details",
            id: req.params.id
        })
    });

router.route("/new")
    .get(async (req, res) => {
        //code here for GET
        res.render('addPost', {
            title: "add new animal post",
        })
    });

module.exports = router;