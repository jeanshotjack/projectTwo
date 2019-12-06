var db = require("../models");
var crypto = require("crypto");
var sessionstorage = require("sessionstorage");

module.exports = function(app) {
  app.get("/", function(req, res) {
    if (sessionstorage.getItem("user")) {
      res.render("index");
      console.log("success");
      // res.json(sessionstorage.getItem("user"));
    } else {
      res.redirect("/login");
    }
  });
  app.get("/posts/:id", function(req, res) {
    db.Post.findAll({ where: { id: req.params.id } }).then(function(dbPost) {
      res.render("Post", {
        Post: dbPost
      });
    });
  });
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  app.post("/signin", function(req, res) {
    console.log("Posting");
    var userInfo = req.body;
    if (!userInfo.username || !userInfo.password) {
      console.log("Fill in all fields");
      res.render("login", {
        username: userInfo.username
      });
    } else {
      db.account
        .findAll({ where: { username: userInfo.username } })
        .then(function(username) {
          // res.render("login", {
          //   username: userInfo.username
          // });
          if (username.length > 0) {
            var hash = crypto
              .pbkdf2Sync(
                userInfo.password,
                username[0].salt,
                10000,
                64,
                "sha512"
              )
              .toString("hex");
            if (hash === username[0].password) {
              // req.session.username = username[0];
              sessionstorage.setItem("user", username[0]);
              // console.log("Log in Successful");
              // console.log(sessionstorage.getItem("user"));
              // res.redirect("/");
              var user = sessionstorage.getItem("user");
              console.log(user);
              res.redirect("/");
              res.redirect("/");
            } else {
              res.render("login");
            }
          } else {
            console.log("Log in Failed");
            $("#error").text("Invalid Info");
          }
        });
    }
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  app.post("/createaccount", function(req, res) {
    console.log(req.body);
    var userInfo = req.body;

    if (
      !userInfo.username ||
      !userInfo.password ||
      !userInfo.confirm_password
    ) {
      console.log("All fields weren't filled out");
      res.render("signup");
    } else if (userInfo.password !== userInfo.confirm_password) {
      console.log("passwords don't match.");
      res.render("signup");
    } else {
      console.log("Checking if user exists...");
      db.account
        .findAll({
          limit: 1,
          where: {
            username: userInfo.username
          }
        })
        .then(function(user) {
          if (user.length === 1) {
            console.log("User already exists");
            res.render("signup");
          } else {
            console.log("encrypting...");
            var salt = crypto.randomBytes(64).toString("hex");
            var hash = crypto
              .pbkdf2Sync(userInfo.password, salt, 10000, 64, "sha512")
              .toString("hex");

            var newUser = {
              username: userInfo.username,
              password: hash,
              salt: salt,
              email: userInfo.email,
              pronouns: userInfo.pronouns,
              insta: userInfo.insta,
              DOB: userInfo.birthday
            };
            console.log("new user is");
            console.log(newUser);
            // eslint-disable-next-line no-unused-vars
            db.account.create(newUser).then(function(user) {
              console.log("creating account");
              console.log("success");
              res.render("login");
            });
          }
        });
    }
  });
  app.get("/createaccount", function(req, res) {
    res.render("signup");
  });
  app.get("/login", function(req, res) {
    res.render("login");
  });
  app.get("/signout", function(req, res) {
    sessionstorage.clear();
    res.redirect("/login");
  });
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
