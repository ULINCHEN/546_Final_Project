const express = require('express');
const router = express.Router();
const publicMethods = require('../publicMethods');
const data = require('../data');
const volunteerData = data.volunteerData;

router.route("/")
    .get(async (req, res) => {
        //code here for GET
        try {
            const postData = await volunteerData.getAllVolunteerPosts();
            console.log(postData);
            res.render('volunteerPosts', {
                postData: postData
            });
        } catch (e) {
            res.status(400);
            return res.render('error', {
                errorMsg: e
            });
        }
    });


router.route("/detail/:id")
    .get(async (req, res) => {
        //code here for GET
        let id = req.params.id;
        //console.log(id);
        try {
            let post = await volunteerData.getVolunteerPostById(id);
            res.render('postDetail', {
                title: "volunteer details",
                id: id,
                post: post
            });
        } catch (e) {
            res.status(400);
            return res.render('error', {
                errorMsg: e
            });
        }
    });

router.route("/new")
    .get(async (req, res) => {
        //code here for GET
        if (req.session.user) {
            return res.render('addPost', {
                title: "add new volunteer post",
            });
        } else {
            res.status(400);
            return res.render('error', { 
                errorMsg: 'Please login to add a new volunteer post.'
            }); 
        }
    })
    .post(async (req, res) => {
        //code here for GET
        if (req.session.user) {
            //add volunteer post paras

            try {
                const new_volunteer_post = await volunteerData.createVounteerPost(
                    contact,
                    location,
                    type,
                    description,
                    username
                );
                return res.redirect('/volunteer/detail/' + new_volunteer_post.volunteerid);
            } catch (e) {
                res.status(400);
                return res.render('error', {
                    errorMsg: e
                });
            }            
        } else {
            return res.redirect('/user/login');
        }
    });

module.exports = router;