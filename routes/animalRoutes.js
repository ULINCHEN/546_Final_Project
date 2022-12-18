const express = require("express");
const xss = require("xss");
const data = require("../data");
const publicMethods = require("../publicMethods");
const userData = data.userData;
const animalData = data.animalData;
const commentData = data.commentData;
const router = express.Router();
const maxsize = 16777216;
const multer = require("multer");
const upload = multer({
    dest: "public/uploads/",
    limits: { fileSize: maxsize },
    onError: function (err, next) {
        console.log("error", err);
        next(err);
    },
});

router.route("/")
    .get(async (req, res) => {
        //code here for GET  
        let login = false;
        if (req.session.user)
            login = true;
        try {
            let postData = await animalData.getAllAnimalPosts();
            for (let i = 0, len = postData.length; i < len; i++) {

                let locationData = await animalData.getLocationByA(postData[i]._id);

                postData[i].location = locationData.location;
            }
            //console.log(postData);
            res.render('animalPosts', {
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
    })
    .post(async (req, res) => { //search by type
        let type = xss(req.body.type);
        let login = false;
        if (req.session.user)
            login = true;
        try {
            const postData = await animalData.getAnimalByType(type);
            res.render('animalPosts', {
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

router.route("/location/:location").get(async (req, res) => {
    let login = false;
    if (req.session.user) login = true;
    const location = req.params.location;
    const postData = await animalData.getAllAnimalPosts();
    // 这里要做一个判断 如果数据库有这个地址，则可以访问，否则导向错误页面
    res.render("animalPosts", {
        location: location,
        postData: postData,
        login: login,
    });
});


router.route("/detail/:id")
    .get(async (req, res) => {
        //code here for GET
        let id = req.params.id;
        let login = false;
        if (req.session.user)
            login = true;
        try {
            let post = await animalData.getAnimalPostById(id);
            let comments = await commentData.getCommentByPostId(id);
            let locationData = await animalData.getLocationByA(post._id.toString());
            post.location = locationData.location;
            res.render('postDetail', {
                animal_id: 'animal/detail/' + id,
                follow_url: 'animal/follow/' + id,
                post: post,
                comments: comments,
                login: login
            });
        } catch (e) {
            res.status(400);
            return res.render('error', {
                errorMsg: e,
                login: login
            });
        }
    })
    .post(async (req, res) => {
        if (req.session.user) {
            let animal_id = req.params.id;
            let text = xss(req.body.newComment);
            let username = req.session.user.username;
            //console.log(animal_id, text, username);
            //not users' own post
            console.log(req.body);
            try {
                const comment = await commentData.createComment(text, username, animal_id);

            } catch (e) {
                res.status(400);
                return res.render('error', {
                    errorMsg: e,
                    login: true
                });
            }
            try {
                let post = await animalData.getAnimalPostById(animal_id);
                let comments = await commentData.getCommentByPostId(animal_id);
                res.render('postDetail', {
                    animal_id: 'animal/detail/' + animal_id,
                    post: post,
                    comments: comments,
                    login: true
                });
            } catch (e) {
                res.status(400);
                return res.render('error', {
                    errorMsg: e,
                    login: true
                });
            }
        } else {
            res.status(400);
            return res.render('error', {
                errorMsg: 'Please login to comment.',
                login: false
            });
        }
    })
    .delete(async (req, res) => {
        if (req.session.user) {
            //code here for DELETE
            let post_id = null;
            try {
                post_id = req.params.id;
                const postData = await animalData.getAnimalPostById(post_id);
                const user_id = postData.user_id;
                if (req.session.user.userid !== user_id) throw 'Please login to delete your animal post.';
            } catch (e) {
                return res.render('error', {
                    errorMsg: e,
                    login: true
                });
            }
            try {
                await commentData.removeCommentByA(post_id);
                await animalData.removeAnimalById(post_id);
                res.status(200)
                return res.redirect('/user/userCenter/' + post_id);
            } catch (e) {
                return res.render('error', {
                    errorMsg: e,
                    login: true
                });
            }
        } else {
            res.status(400);
            return res.render('error', {
                errorMsg: 'Please login to delete your animal post.',
                login: true
            });
        }
    });

router
    .route("/edit/:id")
    .get(async (req, res) => {
        if (req.session.user) {
            let post_id = req.params.id;
            const postData = animalData.getAnimalPostById(post_id);
            const user_id = postData.user_id;
            if (req.session.user.userid !== user_id)
                throw "Please login to delete your animal post.";
            return res.render("editPost", {
                title: "Edit your animal post",
                postData: postData,
                url: "/animal/edit/" + post_id,
                login: true,
            });
        } else {
            res.status(400);
            return res.render("error", {
                errorMsg: "Please login to edit your animal post.",
                login: false,
            });
        }
    })
    .put(async (req, res) => {
        if (req.session.user) {
            let animalName = null;
            let species = null;
            let description = null;
            let healthCondition = null;
            let location = null;
            //console.log(location);

            try {
                let post_id = req.params.id;
                const animalPost = animalData.getAnimalPostById(post_id);
                const user_id = animalPost.user_id;
                if (req.session.user.userid !== user_id)
                    throw "Please login to delete your animal post.";
                animalName = publicMethods.checkName(
                    xss(req.body.animal_name),
                    "Animal Name"
                );
                species = xss(req.body.species);
                description = publicMethods.checkArticle(
                    xss(req.body.description),
                    "description"
                );
                healthCondition = xss(req.body.condition);
                location = xss(req.body.location);
                // animal photo can be empty
                // location check
            } catch (e) {
                res.status(400);
                return res.render("editPost", {
                    error: e,
                    login: true,
                });
            }

            try {
                const new_animal_post = await animalData.updateAnimalPost(
                    post_id,
                    animalName,
                    species,
                    description,
                    healthCondition,
                    location,
                    user_id
                );
                res.status(200);
                return res.redirect("/animal/edit/" + id);
            } catch (e) {
                res.status(500);
                return res.render("editPost", {
                    error: e,
                    login: true,
                });
            }
        } else {
            res.status(400);
            return res.render("error", {
                errorMsg: "Please login to edit your post.",
                login: false,
            });
        }
    });

router
    .route("/new")
    .get(async (req, res) => {
        //code here for GET
        if (req.session.user) {
            return res.render("addPost", {
                title: "Add new animal post",
                login: true,
            });
        } else {
            res.status(400);
            return res.render("error", {
                errorMsg: "Please login to add a new animal post.",
                login: false,
            });
        }
    })
    .post(upload.single("photo1"), async (req, res) => {
        if (req.session.user) {
            let animalName = xss(req.body.animal_name);
            let species = xss(req.body.species);
            let description = xss(req.body.description);
            let healthCondition = xss(req.body.condition);
            let location = xss(req.body.location);
            let userid = req.session.user.userid;
            //   console.log(req.body);
            //[xss(req.body.photo1), xss(req.body.photo2), xss(req.body.photo3)];

            //console.log(location);

            try {
                animalName = publicMethods.checkName(animalName, "Animal Name");
                species = publicMethods.checkAnimalSpecies(species);
                healthCondition = publicMethods.checkAnimalHealth(healthCondition);
                description = publicMethods.checkArticle(description);
                // animal photo can be empty
                // location check
            } catch (e) {
                res.status(400);
                return res.render("addPost", {
                    error: e,
                    login: true,
                });
            }

            try {
                const new_animal_post = await animalData.createAnimalPost(
                    animalName,
                    species,
                    description,
                    healthCondition,
                    location,
                    userid,
                    req.file
                );
                res.status(200);
                return res.redirect("/animal/detail/" + new_animal_post.animalid);
            } catch (e) {
                res.status(500);
                return res.render("addPost", {
                    error: e,
                    login: true,
                });
            }
        } else {
            res.status(400);
            return res.render("error", {
                errorMsg: "Please login to add new post.",
                login: false,
            });
        }
    });

router.route("/follow/:id").post(async (req, res) => {
    if (req.session.user) {
        let post_id = req.params.id;
        let postData = animalData.getAnimalPostById(post_id);
        try {
            if (req.session.user.userid === postData.user_id)
                throw "You can not follow the animal you have posted.";
            const follow = await animalData.putFollowInUser(
                post_id,
                req.session.user.userid
            );
        } catch (e) {
            res.status(400);
            return res.render("error", {
                errorMsg: e,
                login: true,
            });
        }
        try {
            let post = await animalData.getAnimalPostById(post_id);
            let comments = await commentData.getCommentByPostId(post_id);
            res.render("postDetail", {
                animal_id: "animal/detail/" + post_id,
                post: post,
                comments: comments,
                follow: true,
                login: true,
            });
        } catch (e) {
            res.status(400);
            return res.render("error", {
                errorMsg: e,
                login: true,
            });
        }
    } else {
        res.status(400);
        return res.render("error", {
            errorMsg: "Please login to follow.",
            login: false,
        });
    }
});

// 测试用
router.route("/test").get(async (req, res) => {
    const postData = await animalData.getAllAnimalPosts();
    res.render("test", {
        postData: postData,
    });
});
// 测试用

module.exports = router;
