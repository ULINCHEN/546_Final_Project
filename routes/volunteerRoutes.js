const express = require("express");
const xss = require("xss");
const router = express.Router();
const publicMethods = require("../publicMethods");
const data = require("../data");
const volunteerData = data.volunteerData;

router.route("/").get(async (req, res) => {
  //code here for GET
  let login = false;
  if (req.session.user) login = true;
  try {
    const postData = await volunteerData.getAllVolunteerPost();
    //console.log(postData);
    res.render("volunteerPosts", {
      postData: postData,
      login: login,
      title: "Volunteer",
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

router
  .route("/detail/:id")
  .get(async (req, res) => {
    //code here for GET
    let id = publicMethods.checkDatabaseId(req.params.id);
    let login = false;
    if (req.session.user) login = true;
    try {
      let post = await volunteerData.getVolunteerById(id);
      res.render("postDetail", {
        title: "volunteer details",
        id: id,
        post: post,
        login: login,
      });
    } catch (e) {
      res.status(400);
      return res.render("error", {
        errorMsg: e,
        login,
        title: "Error",
      });
    }
  })
  .delete(async (req, res) => {
    if (req.session.user) {
      //code here for DELETE
      let post_id = publicMethods.checkDatabaseId(req.params.id);
      try {
        const postData = await volunteerData.getVolunteerById(post_id);
      } catch (e) {
        return res.render("error", {
          errorMsg: e,
          login: true,
          title: "Error",
        });
      }

      try {
        await volunteerData.removeVolunteerById(post_id);
        res.status(200);
        return res.redirect("/user/userCenter/" + post_id);
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
        errorMsg: "Please login to delete your volunteer post.",
        login: true,
        title: "Error",
      });
    }
  });

router
  .route("/new")
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      return res.render("addVolunteerPost", {
        title: "add new volunteer post",
        login: true,
      });
    } else {
      res.status(400);
      return res.render("error", {
        errorMsg: "Please login to add a new volunteer post.",
        login: false,
        title: "Error",
      });
    }
  })
  .post(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      //console.log(req.body);
      //add volunteer post paras
      let volunteer_name = null;
      let contact = null;
      let location = null;
      let type = null;
      let description = null;
      let username = req.session.user.username;
      try {
        volunteer_name = publicMethods.checkNameWithSpace(
          xss(req.body.volunteer_name),
          "volunteer name"
        );
        contact = publicMethods.checkVolunteerInfo(xss(req.body.contact));
        location = xss(req.body.location);
        type = publicMethods.checkVolunteerPost(xss(req.body.type));
        description = publicMethods.checkArticle(
          xss(req.body.description),
          "description"
        );
      } catch (e) {
        res.status(400);
        return res.render("addVolunteerPost", {
          error: e,
          login: true,
          title: "Error",
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
        return res.redirect("/volunteer");
      } catch (e) {
        res.status(500);
        return res.render("addVolunteerPost", {
          error: e,
          login: true,
          title: "Error",
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

module.exports = router;
