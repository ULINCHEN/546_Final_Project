const express = require('express');
const xss = require('xss');
const data = require('../data');
const userData = data.userData;
const animalData = data.animalData;
const commentData = data.commentData;
const router = express.Router();


router.route("/")
    .get(async (req, res) => {
        //code here for GET       
        try {
            const postData = await animalData.getAllAnimalPosts();
            //console.log(postData);
            res.render('animalPosts', {
                postData: postData,
            });
        } catch (e) {
            res.status(400);
            return res.render('error', {
                errorMsg: e
            });
        }
    })
    .post(async (req, res) => { //search by type
        let type = xss(req.body.type);
        try {
            const postData = await animalData.getAnimalByType(type);
            res.render('animalPosts', {
                postData: postData,
            });
        } catch (e) {
            res.status(400);
            return res.render('error', {
                errorMsg: e
            });
        }
    });


router.route("/location/:location")
    .get(async (req, res) => {
        const location = req.params.location;
        const postData = await animalData.getAllAnimalPosts();
        // 这里要做一个判断 如果数据库有这个地址，则可以访问，否则导向错误页面
        res.render('animalPosts', {
            location: location,
            postData: postData,
        })
    })


router.route("/detail/:id")
    .get(async (req, res) => {
        //code here for GET
        let id = req.params.id;
        console.log(id);
        try {
            let post = await animalData.getAnimalPostById(id);
            let comments = await commentData.getCommentById(id);
            res.render('postDetail', {
                id: id,
                post: post,
                comments: comments
            });
        } catch (e) {
            res.status(400);
            return res.render('error', {
                errorMsg: e
            });
        }
    })
    .post(async (req, res) => {
        if (req.session.user){
            let id = req.params.id;
            let text = xss(req.body.comment);
            let username = req.session.user.username;
            try {
                const comment = await commentData.createComment(text, username, id);
            } catch (e) {
                res.status(400);
                return res.render('error', {
                    errorMsg: e
                });
            }
            try {
                let post = await animalData.getAnimalPostById(id);
                let comments = await commentData.getCommentByPostId(id);
                res.render('postDetail', {
                    id: id,
                    post: post,
                    comments: comments
                });
            } catch (e) {
                res.status(400);
                return res.render('error', {
                    errorMsg: e
                });
            }
        } else {
            res.status(400);
            return res.render('error', { 
                errorMsg: 'Please login to comment.'
            }); 
        }
    });

router.route("/new")
    .get(async (req, res) => {
        //code here for GET
        if (req.session.user) {
            return res.render('addPost', {
                title: "Add new animal post",
            });
        } else {
            res.status(400);
            return res.render('error', { 
                errorMsg: 'Please login to add a new animal post.'
            }); 
        }
    })
    .post(async (req, res) => {
        let animalName = xss(req.body.animal_name);
        let species = xss(req.body.species);
        let description = xss(req.body.description);
        let healthCondition = xss(req.body.condition);
        let animalPhoto = [xss(req.body.photo1), xss(req.body.photo2), xss(req.body.photo3)];
        let location = xss(req.body.location);
        console.log(req.body);

        if (!animalName) throw 'Animal name can not be empty';
        if (!species) throw 'Species can not be empty';
        if (!description) throw 'Description can not be empty';
        if (!healthCondition) throw 'HealthCondition can not be empty';
        // animal photo can be empty
        if (!location) throw 'Location can not be empty';

        try {
            const new_animal_post = await animalData.createAnimalPost(
                animalName,
                species,
                description,
                healthCondition,
                animalPhoto,
                location
            );
            res.status(200);
            return res.redirect('/animal/detail/'+new_animal_post.animalid);
        } catch (e) {
            res.status(500);
            return res.render('error', {
                errorMsg: e
            });
        }
    });

module.exports = router;