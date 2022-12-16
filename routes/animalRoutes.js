const express = require('express');
const xss = require('xss');
const data = require('../data');
const publicMethods = require('../publicMethods');
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
        //console.log(id);
        try {
            let post = await animalData.getAnimalPostById(id);
            let comments = await commentData.getCommentByPostId(id);
            res.render('postDetail', {
                animal_id: 'animal/detail/' + id,
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
            let text = xss(req.body.newComment);
            let username = req.session.user.username;
            console.log(id, text, username);
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
                    animal_id: 'animal/detail/' + id,
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

router.route("/edit/:id")
    .get(async (req, res) => {
        let id = req.params.id;
        const postData = animalData.getAnimalPostById(id);
        const userId = postData.user_id;
        if (req.session.user && req.session.user.userid == userId) {
            return res.render('editPost', {
                title: "Edit your animal post",
                postData: postData
            });
        } else {
            res.status(400);
            return res.render('error', { 
                errorMsg: 'Please login to edit your animal post.'
            }); 
        }
    })
    .put(async (req, res) => {
        let id = req.params.id;
        const animalPost = animalData.getAnimalPostById(id);
        const userid = animalPost.user_id;
        if (req.session.user && req.session.user.userid == userid){
            let animalName = xss(req.body.animal_name);
            let species = xss(req.body.species);
            let description = xss(req.body.description);
            let healthCondition = xss(req.body.condition);
            let location = xss(req.body.location);
            let userid = req.session.user.userid;
            let animalPhoto = null;
            //[xss(req.body.photo1), xss(req.body.photo2), xss(req.body.photo3)];
                        
            //console.log(location);

            try{
                animalName = publicMethods.checkName(animalName, "Animal Name");
                [species, healthCondition] = publicMethods.checkAnimalPost(species, healthCondition);
                description = publicMethods.checkArticle(description);
                // animal photo can be empty
                // location check
            } catch(e) {
                res.status(400);
                return res.render('editPost',  {
                    error: e
                });
            }
            
            try {
                const new_animal_post = await animalData.updateAnimalPost(
                    id,
                    animalName,
                    species,
                    description,
                    healthCondition,
                    location,
                    userid
                );
                res.status(200);
                return res.redirect('/animal/edit/' + id);
            } catch (e) {
                res.status(500);
                return res.render('editPost',  {
                    error: e
                });
            }
        } else {
            res.status(400);
            return res.render('error', { 
                errorMsg: 'Please login to edit your post.'
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
        if (req.session.user){
            let animalName = xss(req.body.animal_name);
            let species = xss(req.body.species);
            let description = xss(req.body.description);
            let healthCondition = xss(req.body.condition);
            let location = xss(req.body.location);
            let userid = req.session.user.userid;
            let animalPhoto = null;
            //[xss(req.body.photo1), xss(req.body.photo2), xss(req.body.photo3)];
                        
            //console.log(location);

            try{
                animalName = publicMethods.checkName(animalName, "Animal Name");
                [species, healthCondition] = publicMethods.checkAnimalPost(species, healthCondition);
                description = publicMethods.checkArticle(description);
                // animal photo can be empty
                // location check
            } catch(e) {
                res.status(400);
                return res.render('addPost',  {
                    error: e
                });
            }
            
            try {
                const new_animal_post = await animalData.createAnimalPost(
                    animalName,
                    species,
                    description,
                    healthCondition,
                    location,
                    userid
                );
                res.status(200);
                return res.redirect('/animal/detail/'+new_animal_post.animalid);
            } catch (e) {
                res.status(500);
                return res.render('addPost',  {
                    error: e
                });
            }
        } else {
            res.status(400);
            return res.render('error', { 
                errorMsg: 'Please login to add new post.'
            }); 
        }
    });

module.exports = router;