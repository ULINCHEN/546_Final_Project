const express = require('express');
const xss = require('xss');
const router = express.Router();
const publicMethods = require('../publicMethods');
const data = require('../data');
const volunteerData = data.volunteerData;

router.route("/")
    .get(async (req, res) => {
        //code here for GET
        let login = false;
        if (req.session.user)
            login = true;
        try {
            const postData = await volunteerData.getAllVolunteerPost();
            //console.log(postData);
            res.render('volunteerPosts', {
                postData: postData,
                login: login
            });
        } catch (e) {
            res.status(400);
            return res.render('error', {
                errorMsg: e,
                login: login
            });
        }
    });


router.route("/detail/:id")
    .get(async (req, res) => {
        //code here for GET
        let id = req.params.id;
        let login = false;
        if (req.session.user)
            login = true;
        try {
            let post = await volunteerData.getVolunteerById(id);
            res.render('postDetail', {
                title: "volunteer details",
                id: id,
                post: post,
                login: login
            });
        } catch (e) {
            res.status(400);
            return res.render('error', {
                errorMsg: e,
                login
            });
        }
    });

router.route("/new")
    .get(async (req, res) => {
        //code here for GET
        if (req.session.user) {
            return res.render('addVolunteerPost', {
                title: "add new volunteer post",
                login: true
            });
        } else {
            res.status(400);
            return res.render('error', { 
                errorMsg: 'Please login to add a new volunteer post.',
                login: false
            }); 
        }
    })
    .post(async (req, res) => {
        //code here for GET
        if (req.session.user) {
            console.log(req.body);
            //add volunteer post paras
            let volunteer_name = xss(req.body.volunteer_name);
            let contact = xss(req.body.contact);
            let location = xss(req.body.location);
            let type = xss(req.body.type);
            let description = xss(req.body.description);
            let username = req.session.user.username;

            try {
                volunteer_name = publicMethods.checkName(volunteer_name, "volunteer name");
                //contact = publicMethods.checkContact(contact);
                //location = 
                type = publicMethods.checkVolunteerPost(type);
                description = publicMethods.checkArticle(description);
            } catch(e) {
                res.status(400);
                return res.render('addVolunteerPost',  {
                    error: e,
                    login: true
                });
            }
            try {
                const new_volunteer_post = await volunteerData.createVolunteerPost(
                    volunteer_name,
                    contact,
                    location,
                    type,
                    description,
                    username
                );
                res.status(200);
                return res.redirect('/volunteer/detail/' + new_volunteer_post.volunteerid);
            } catch (e) {
                res.status(500);
                return res.render('addVolunteerPost',  {
                    error: e,
                    login: true
                });
            }            
        } else {
            res.status(400);
            return res.render('error', { 
                errorMsg: 'Please login to add new post.',
                login: false
            }); 
        }
    });

module.exports = router;