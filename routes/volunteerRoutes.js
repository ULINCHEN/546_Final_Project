const express = require('express');
const xss = require('xss');
const router = express.Router();
const publicMethods = require('../publicMethods');
const data = require('../data');
const volunteerData = data.volunteerData;

router.route("/")
    .get(async (req, res) => {
        //code here for GET
        try {
            const postData = await volunteerData.getAllVolunteerPost();
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
            let post = await volunteerData.getVolunteerById(id);
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
            return res.render('addVolunteerPost', {
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
            let volunteer_name = xss(req.body.volunteer_name);
            let contact = xss(req.body.contact);
            let location = xss(req.body.location);
            let type = xss(req.body.type);
            let description = xss(req.body.description);
            let username = req.session.user.username;

            try {
                volunteer_name = publicMethods.checkName(volunteer_name);
                //contact = publicMethods.checkContact(contact);
                //location = 
                type = publicMethods.checkVolunteerPost(type);
                description = publicMethods.checkArticle(description);
            } catch(e) {
                res.status(400);
                return res.render('addVolunteerPost',  {
                    error: e
                });
            }
            try {
                const new_volunteer_post = await volunteerData.createVolunteerPost(
                    contact,
                    location,
                    type,
                    description,
                    username
                );
                return res.redirect('/volunteer/detail/' + new_volunteer_post.volunteerid);
            } catch (e) {
                res.status(500);
                return res.render('addVolunteerPost',  {
                    error: e
                });
            }            
        } else {
            return res.redirect('/user/login');
        }
    });

module.exports = router;