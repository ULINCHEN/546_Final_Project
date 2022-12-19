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
const { uniqueSort } = require("jquery");
const upload = multer({
  dest: "public/uploads/",
  limits: { fileSize: maxsize },
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
});

router
  .route("/")
  .get(async (req, res) => {
    //code here for GET
    let login = false;
    if (req.session.user) login = true;
    try {
      let postData = await animalData.getAllAnimalPosts();
      for (let i = 0, len = postData.length; i < len; i++) {
        let locationData = await animalData.getLocationByA(
          publicMethods.checkDatabaseId(postData[i]._id)
        );

        postData[i].location = locationData.location;
      }
      //console.log(postData);
      res.render("animalPosts", {
        postData: postData,
        login: login,
        title: "Animal Posts",
      });
    } catch (e) {
      res.status(400);
      return res.render("error", {
        errorMsg: e,
        login: login,
        title: "Error",
      });
    }
  })
  .post(async (req, res) => {
    //search by type
    let type = xss(req.body.type);
    let login = false;
    if (req.session.user) login = true;
    try {
      const postData = await animalData.getAnimalByType(type);
      res.render("animalPosts", {
        postData: postData,
        login: login,
        title: "Animal Posts",
      });
    } catch (e) {
      res.status(400);
      return res.render("error", {
        errorMsg: e,
        login: login,
        title: "Error",
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
    title: "Animal Posts",
  });
});

router
  .route("/detail/:id")
  .get(async (req, res) => {
    //code here for GET
    let id = publicMethods.checkDatabaseId(req.params.id);
    let login = false;
    let follow = false;
    if (req.session.user) login = true;
    try {
      let post = await animalData.getAnimalPostById(id);
      let comments = await commentData.getCommentByPostId(id);
      let locationData = await animalData.getLocationByA(post._id.toString());
      if (login) {
        let follow_animal_list = await userData.getFollowAnimalList(
          req.session.user.username
        );
        if (follow_animal_list.indexOf(id) != -1) {
          follow = true;
        }
      }
      post.location = locationData.location;

      res.render("postDetail", {
        animal_id: "animal/detail/" + id,
        follow_url: "animal/follow/" + id,
        unfollow_url: "animal/unfollow/" + id,
        post: post,
        comments: comments,
        login: login,
        follow: follow,
        title: "Animal Detail",
      });
    } catch (e) {
      res.status(400);
      return res.render("error", {
        errorMsg: e,
        login: login,
        title: "Error",
      });
    }
  })
  .post(async (req, res) => {
    if (req.session.user) {
      let animal_id = publicMethods.checkDatabaseId(req.params.id);
      let text = publicMethods.checkArticle(
        xss(req.body.newComment),
        "comment"
      );
      let username = req.session.user.username;
      //console.log(animal_id, text, username);
      //not users' own post
      //console.log(req.body);
      try {
        const comment = await commentData.createComment(
          text,
          username,
          animal_id
        );
      } catch (e) {
        res.status(400);
        return res.render("error", {
          errorMsg: e,
          login: true,
          title: "Error",
        });
      }
      try {
        let post = await animalData.getAnimalPostById(animal_id);
        let comments = await commentData.getCommentByPostId(animal_id);
        let locationData = await animalData.getLocationByA(post._id.toString());
        post.location = locationData.location;
        res.redirect("/animal/detail/" + animal_id);
        // res.render("postDetail", {
        //   animal_id: "animal/detail/" + animal_id,
        //   post: post,
        //   comments: comments,
        //   login: true,
        //   title: "Animal Detail",
        // });
      } catch (e) {
        res.status(400);
        return res.render("error", {
          errorMsg: e,
          login: true,
          title: "Error",
        });
      }
    } else {
      res.status(400);
      return res.render("error", {
        errorMsg: "Please login to comment.",
        login: false,
        title: "Error",
      });
    }
  })
  .delete(async (req, res) => {
    if (req.session.user) {
      //code here for DELETE
      let post_id = null;
      let user_id = undefined;
      try {
        post_id = publicMethods.checkDatabaseId(req.params.id);
        const postData = await animalData.getAnimalPostById(post_id);
        user_id = publicMethods.checkDatabaseId(postData.user_id);
        if (req.session.user.userid !== user_id)
          throw "Please login to delete your animal post.";
      } catch (e) {
        return res.render("error", {
          errorMsg: e,
          login: true,
          title: "Error",
        });
      }
      try {
        await commentData.removeCommentByA(post_id);
        await animalData.removeAnimalById(post_id);
        res.status(200);
        // return res.redirect('/user/userCenter/' + post_id);
        return res.render("deleteAlert", {
          id: user_id,
          title: "Delete Successful",
        });
      } catch (e) {
        return res.render("error", {
          errorMsg: e,
          login: true,
          title: "Error",
        });
      }
    } else {
      res.status(400);
      return res.render("error", {
        errorMsg: "Please login to delete your animal post.",
        login: true,
        title: "Error",
      });
    }
  });

router
  .route("/edit/:id")
  .get(async (req, res) => {
    if (req.session.user) {
      try {
        const post_id = publicMethods.checkDatabaseId(req.params.id);
        const postData = await animalData.getAnimalPostById(post_id);
        const locationObj = await animalData.getLocationByA(post_id.toString());
        // console.log(locationObj.location);
        // const locationData = locationObj.location
        const user_id = publicMethods.checkDatabaseId(postData.user_id);
        let locationData = await animalData.getLocationByA(post_id);
        postData.location = locationData.location;
        const putUrl = "animal/edit/" + post_id + "?_method=PUT";
        if (req.session.user.userid !== user_id)
          throw "Please login to edit your animal post.";
        return res.render("editAnimalPost", {
          title: "Edit your animal post",
          postData: postData,
          locationData: locationObj,
          url: putUrl,
          login: true,
          title: "Edit Animal Post",
        });
      } catch (e) {
        return res.render("error", {
          errorMsg: e,
          login: true,
          title: "Error",
        });
      }
    } else {
      res.status(400);
      return res.render("error", {
        errorMsg: "Please login to edit your animal post.",
        login: false,
        title: "Error",
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
      let post_id = publicMethods.checkDatabaseId(req.params.id);
      //console.log(post_id);
      let user_id = null;
      //console.log(location);
      try {
        const animalPost = await animalData.getAnimalPostById(post_id);
        user_id = publicMethods.checkDatabaseId(animalPost.user_id);
        if (req.session.user.userid !== user_id)
          throw "Please login to edit your animal post.";
        animalName = publicMethods.checkNameWithSpace(
          xss(req.body.animal_name),
          "Animal Name"
        );
        species = publicMethods.checkAnimalSpecies(xss(req.body.species));
        description = publicMethods.checkArticle(
          xss(req.body.description),
          "description"
        );
        healthCondition = publicMethods.checkAnimalHealth(
          xss(req.body.condition)
        );
        location = xss(req.body.location);
        // animal photo can be empty
        // location check
      } catch (e) {
        res.status(400);
        return res.render("editAnimalPost", {
          error: e,
          login: true,
          title: "Edit Animal Post",
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
        //console.log(new_animal_post);
        res.status(200);
        return res.redirect("/animal/detail/" + post_id);
      } catch (e) {
        res.status(500);
        //console.log(e);
        return res.render("editAnimalPost", {
          error: e,
          login: true,
          title: "Edit Animal Post",
        });
      }
    } else {
      res.status(400);
      return res.render("error", {
        errorMsg: "Please login to edit your post.",
        login: false,
        title: "Error",
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
        title: "Error",
      });
    }
  })
  .post(upload.single("photo1"), async (req, res) => {
    if (req.session.user) {
      let animalName = null;
      let species = null;
      let description = null;
      let healthCondition = null;
      let location = null;
      let userid = publicMethods.checkDatabaseId(req.session.user.userid);
      //console.log(req.body);
      //[xss(req.body.photo1), xss(req.body.photo2), xss(req.body.photo3)];

      //console.log(location);

      try {
        animalName = publicMethods.checkNameWithSpace(
          xss(req.body.animal_name)
        );
        species = publicMethods.checkAnimalSpecies(xss(req.body.species));
        description = publicMethods.checkArticle(
          xss(req.body.description),
          "description"
        );
        healthCondition = publicMethods.checkAnimalHealth(
          xss(req.body.condition)
        );
        location = xss(req.body.location);
        userid = publicMethods.checkDatabaseId(req.session.user.userid);
        // animal photo can be empty
        // location check
      } catch (e) {
        res.status(400);
        return res.render("addPost", {
          error: e,
          login: true,
          title: "Add New Post",
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
          title: "Add New Post",
        });
      }
    } else {
      res.status(400);
      return res.render("error", {
        errorMsg: "Please login to add new post.",
        login: false,
        title: "Error",
      });
    }
  });

router.route("/follow/:id").post(async (req, res) => {
  if (req.session.user) {
    let post_id = publicMethods.checkDatabaseId(req.params.id);
    let postData = await animalData.getAnimalPostById(post_id);
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
        title: "Error",
      });
    }
    try {
      let post = await animalData.getAnimalPostById(post_id);
      let comments = await commentData.getCommentByPostId(post_id);
      let locationData = await animalData.getLocationByA(post._id.toString());
      post.location = locationData.location;

      res.redirect("/animal/detail/" + post_id);
      // res.render("postDetail", {
      //   animal_id: "animal/detail/" + post_id,
      //   post: post,
      //   comments: comments,
      //   follow: true,
      //   login: true,
      //   title: "Animal Post Detail",
      // });
    } catch (e) {
      res.status(400);
      return res.render("error", {
        errorMsg: e,
        login: true,
        title: "Error",
      });
    }
  } else {
    res.status(400);
    return res.render("error", {
      errorMsg: "Please login to follow.",
      login: false,
      title: "Error",
    });
  }
});

router.route("/unfollow/:id").post(async (req, res) => {
  if (req.session.user) {
    let post_id = publicMethods.checkDatabaseId(req.params.id);
    let postData = await animalData.getAnimalPostById(post_id);
    try {
      if (req.session.user.userid === postData.user_id)
        throw "You can not follow the animal you have posted.";
      const unfollow = await animalData.removeFollow(
        post_id,
        req.session.user.userid
      );
    } catch (e) {
      res.status(400);
      return res.render("error", {
        errorMsg: e,
        login: true,
        title: "Error",
      });
    }
    try {
      let post = await animalData.getAnimalPostById(post_id);
      let comments = await commentData.getCommentByPostId(post_id);
      let locationData = await animalData.getLocationByA(post._id.toString());
      post.location = locationData.location;
      res.redirect("/animal/detail/" + post_id);
      // res.render("postDetail", {
      //   animal_id: "animal/detail/" + post_id,
      //   post: post,
      //   comments: comments,
      //   follow: false,
      //   login: true,
      //   title: "Post Detail",
      // });
    } catch (e) {
      res.status(400);
      return res.render("error", {
        errorMsg: e,
        login: true,
        title: "Error",
      });
    }
  } else {
    res.status(400);
    return res.render("error", {
      errorMsg: "Please login to unfollow.",
      login: false,
      title: "Error",
    });
  }
});

// 测试用
router.route("/map").get(async (req, res) => {
  let login = false;
  if (req.session.user) login = true;

  try {
    const postData = await animalData.getAllAnimalPosts();
    if (postData === null) throw "No animal post found.";
    res.render("test", {
      postData: postData,
      login: login,
      title: "Map View",
    });
  } catch (e) {
    res.status(400);
    return res.render("error", {
      errorMsg: e,
      login: true,
      title: "Error",
    });
  }
  // const postData = await animalData.getAllAnimalPosts();
  // res.render("test", {
  //   postData: postData,
  // });

  // const postData = await animalData.getAllAnimalPosts();
  // // console.log(postData);
  // res.render('test', {
  //   postData: postData,
  // })
  // try {
  //     let postData = await animalData.getAllAnimalPosts();
  //     console.log(postData);
  //     if (postData === null) throw "No animal post found.";
  //     for (let i = 0, len = postData.length; i < len; i++) {

  //         let locationData = await animalData.getLocationByA(postData[i]._id);

  //         postData[i].location = locationData.location;
  //     }
  //     //console.log(postData);
  //     res.render('animalPosts', {
  //         postData: postData,
  //         login: login
  //     });
  // } catch (e) {
  //     res.status(400);
  //     return res.render('error', {
  //         errorMsg: e,
  //         login: login
  //     });
  // }
});
// 测试用

module.exports = router;
