const express = require("express");
const xss = require("xss");
const router = express.Router();
const publicMethods = require("../publicMethods");
const data = require("../data");
const { getUserById } = require("../data/userData");
const userData = data.userData;
const animalData = data.animalData;
const volunteerData = data.volunteerData;

router.route("/usercenter/:id").get(async (req, res) => {
  //code here for GET
  if (req.session.user) {
    try {
      const user = await userData.getUserData(req.session.user.username);
      const username = req.session.user.username;
      const user_id = publicMethods.checkDatabaseId(req.params.id);
      if (req.session.user.userid !== user_id)
        throw "Please login to view User Center.";
      //console.log(user);

      // let follow_animal_ids = user.follow_animal_ids;
      // let follow_animal_posts = [];
      // if (follow_animal_ids.length > 0){
      //     for (let i = 0, len = follow_animal_ids.length; i < len; i++){
      //         let animal_post = await animalData.getAnimalPostById(follow_animal_ids[i]);
      //         follow_animal_posts.push(animal_post);
      //     }
      // }
      let follow_animal_posts = await animalData.getFollowAnimalByUser(
        username
      );
      for (let i = 0, len = follow_animal_posts.length; i < len; i++) {
        let locationData = await animalData.getLocationByA(
          follow_animal_posts[i]._id.toString()
        );
        follow_animal_posts[i].location = locationData.location;
      }

      // let animal_ids = user.animal_ids;
      // let animal_posts = [];
      // if (animal_ids.length > 0){
      //     for (let i = 0, len = animal_ids.length; i < len; i++){
      //         let animal_post = await animalData.getAnimalPostById(animal_ids[i]);
      //         animal_posts.push(animal_post);
      //     }
      // }
      let animal_posts = await animalData.getAnimalByUser(username);
      for (let i = 0, len = animal_posts.length; i < len; i++) {
        let locationData = await animalData.getLocationByA(
          animal_posts[i]._id.toString()
        );
        animal_posts[i].location = locationData.location;
      }

      // let volunteer_ids = user.volunteer_ids;
      // let volunteer_posts = [];
      // if (volunteer_ids.length > 0){
      //     for (let i = 0, len = volunteer_ids.length; i < len; i++){
      //         let volunteer_post= await volunteerData.getVolunteerById(volunteer_ids[i]);
      //         volunteer_posts.push(volunteer_post);
      //     }
      // }
      let volunteer_posts = await volunteerData.getVolunteerPostsByU(username);

      return res.render("userCenter", {
        title: "current user data",
        user_id: user_id,
        first_name: user.first_name, //"jake",
        last_name: user.last_name, //"ma"
        follow_animal_posts: follow_animal_posts,
        animal_posts: animal_posts,
        volunteer_posts: volunteer_posts,
        login: true,
      });
    } catch (e) {
      return res.render("error", {
        errorMsg: e,
        login: true,
        title: "error",
      });
    }
  } else {
    return res.render("error", {
      errorMsg: "Please login to view User Center.",
      login: false,
      title: "error",
    });
  }
});

router
  .route("/login")
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      return res.redirect("/user/usercenter/" + req.session.user.userid);
    } else {
      res.render("logIn", {
        title: "login page",
        login: false,
      });
    }
  })
  .post(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/user/usercenter/" + req.session.user.userid);
    }
    let username = null;
    let password = null;
    try {
      username = publicMethods.accountValidation(xss(req.body.account));
      password = publicMethods.passwordValidation(xss(req.body.password));
    } catch (e) {
      res.status(400);
      return res.render("logIn", {
        title: "login page",
        error: e,
        login: false,
      });
    }
    try {
      const login = await userData.checkUser(username, password);
      if (login.authenticatedUser) {
        req.session.user = { username: username, userid: login.userid };
        return res.render("loginAlert", {
          logMsg: "You have successfully logged in!",
          url: "/user/usercenter/" + login.userid,
          login: true,
          title: "loginAlert",
        });
      } else {
        res.status(500);
        return res.render("error", {
          errorMsg: "Internal Server Error",
          login: false,
          title: "error",
        });
      }
    } catch (e) {
      //login failed
      res.status(400);
      return res.render("logIn", {
        title: "login page",
        error: e,
        login: false,
      });
    }
  });

router
  .route("/signin")
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      return res.redirect("/user/usercenter/" + req.session.user.userid);
    } else {
      res.render("signIn", {
        title: "signin page",
        login: false,
      });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    if (req.session.user) {
      return res.redirect("/user/usercenter/" + req.session.user.userid);
    }
    let firstname = null;
    let lastname = null;
    let username = null;
    let password = null;
    let password_again = null;
    try {
      firstname = publicMethods.checkName(
        xss(req.body.firstname),
        "first name"
      );
      lastname = publicMethods.checkName(xss(req.body.lastname), "last name");
      username = publicMethods.accountValidation(xss(req.body.account));
      password = publicMethods.passwordValidation(xss(req.body.password));
      password_again = publicMethods.passwordValidation(
        xss(req.body.password_again)
      );
      if (password !== password_again)
        throw "The password entered the first and second time does not match";
    } catch (e) {
      res.status(400);
      return res.render("signIn", {
        title: "signin page",
        error: e,
        login: false,
      });
    }
    try {
      const createUser = await userData.createUser(
        username,
        password,
        firstname,
        lastname
      );
      if (createUser.insertedUser) {
        return res.redirect("/user/login");
      } else {
        res.status(500);
        return res.render("error", {
          errorMsg: "Internal Server Error",
          login: false,
          title: "error",
        });
      }
    } catch (e) {
      res.status(400);
      return res.render("signIn", {
        title: "signin page",
        error: e,
        login: false,
      });
    }
  });

router.route("/logout").get(async (req, res) => {
  if (req.session.user) {
    req.session.destroy();
    return res.render("logoutAlert", {
      logMsg: "You have successfully logged out!",
      url: "/",
      login: false,
      title: "logoutAlert",
    });
  } else {
    res.status(400);
    return res.render("error", {
      errorMsg: "Please log in to log out.",
      login: false,
      title: "error",
    });
  }
});

// router.route("/followed")
//     .get(async (req, res) => {
//         //code here for GET
//         //这里需要有个方法通过用户id拉出follow的动物信息
//         if (req.session.user) {
//             let user = await userData.getUserData(req.session.user.username);
//             let follow_animal_ids = user.follow_animal_id;
//             let follow_animal_posts = [];
//             for (let i = 0, len = follow_animal_ids.length; i < len; i++){
//                 let animal_post = await animalData.getAnimalPostById(follow_animal_ids[i]);
//                 follow_animal_posts.push(animal_post);
//             }
//             return res.render('animalPost', {
//                 title: "followed page",
//                 postData: follow_animal_posts,
//                 login: true
//             });
//         } else {
//             return res.redirect('/user/login');
//         }
//     });

// router.route("/mypost")
//     .get(async (req, res) => {
//         //code here for GET
//         //这里需要有个方法通过用户id拉出其发布的帖子信息
//         if (req.session.user) {
//             let user = await userData.getUserData(req.session.user.username);
//             let animal_ids = user.animal_id;
//             let animal_posts = [];
//             for (let i = 0, len = animal_ids.length; i < len; i++){
//                 let animal_post = await animalData.getAnimalPostById(animal_ids[i]);
//                 animal_posts.push(animal_post);
//             }
//             res.render('animalPost', {
//                 title: "my post page",
//                 postData: animal_posts,
//                 login: true
//             });
//         } else {
//             return res.redirect('/user/login');
//         }
//     });

router
  .route("/edit/:id")
  .get(async (req, res) => {
    if (req.session.user) {
      try {
        const user_id = publicMethods.checkDatabaseId(req.params.id);
        if (req.session.user.userid !== user_id)
          throw "Please login to set your account.";
        const user = await userData.getUserById(user_id);
        const url = "/user/edit/" + user_id + "?_method=PUT";
        return res.render("editUserInfo", {
          url: url,
          login: true,
          first_name: user.first_name,
          last_name: user.last_name,
          title: "editUserInfo",
        });
      } catch (e) {
        return res.render("error", {
          errorMsg: e,
          login: true,
          title: "error",
        });
      }
    } else {
      return res.render("error", {
        errorMsg: "Please login to set your account.",
        login: false,
        title: "error",
      });
    }
  })
  .put(async (req, res) => {
    //console.log(req.body);
    if (req.session.user) {
      let firstname = null;
      let lastname = null;
      let old_password = null;
      let new_password = null;
      let new_password_again = null;

      try {
        const user_id = publicMethods.checkDatabaseId(req.params.id);
        if (req.session.user.userid !== user_id)
          throw "Please login to set your account.";
        firstname = publicMethods.checkName(
          xss(req.body.firstname),
          "first name"
        );
        lastname = publicMethods.checkName(xss(req.body.lastname), "last name");
        old_password = publicMethods.passwordValidation(
          xss(req.body.old_password)
        );
        new_password = publicMethods.passwordValidation(
          xss(req.body.new_password)
        );
        new_password_again = publicMethods.passwordValidation(
          xss(req.body.new_password_again)
        );
        if (old_password === new_password)
          throw "The new password cannot be the same as the old one.";
        if (new_password !== new_password_again)
          throw "The two new passwords are different.";
      } catch (e) {
        return res.render("editUserInfo", {
          error: e,
          login: true,
          title: "editUserInfo",
        });
      }

      try {
        const password_change = await userData.updateUser(
          req.session.user.username,
          new_password,
          firstname,
          lastname
        );
        req.session.destroy();
        console.log("password_change:", password_change);
        res.status(200);
        return res.redirect("/user/login");
      } catch (e) {
        return res.render("editUserInfo", {
          error: e,
          login: true,
          title: "editUserInfo",
        });
      }
    } else {
      return res.render("error", {
        errorMsg: "Please login to set your account.",
        login: false,
        title: "error",
      });
    }
  });

module.exports = router;
