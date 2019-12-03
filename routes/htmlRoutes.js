var db = require("../models");
var crypto = require("crypto");
module.exports = function(app) {
  app.get("/", function(req, res) {
    db.Post.findAll({}).then(function(dbPost) {
      res.render("index", {
        msg: "Welcome!",
        Post: dbPost
      });
    });
  });

  // Load Post page and pass in an Post by id
  app.get("/posts/:id", function(req, res) {
    db.Post.findOne({ where: { id: req.params.id } }).then(function(dbPost) {
      res.render("Post", {
        Post: dbPost
      });
    });
  });

  app.post("/login", function(req, res) {
    var userInfo = req.body;

    if (!userInfo.username || !userInfo.password) {
      res.render("login", {
        message: "Please Fill Out All Fields",
        type: "error",
        username: userInfo.username
      });
    } else {
      db.User.findOne({ username: userInfo.username }, function(err, user) {
        if (err) {
          res.render("login", {
            message: "Database Error",
            type: "error",
            username: userInfo.username
          });
        }

        if (user) {
          var hash = crypto
            .pbkdf2Sync(userInfo.password, user.salt, 10000, 64, "sha512")
            .toString("hex");
          if (hash === user.password) {
            req.session.user = user;
            res.redirect("/");
          } else {
            res.render("login", {
              message: "Invalid Password",
              type: "error",
              username: userInfo.username
            });
          }
        } else {
          res.render("login", {
            message: "User Does Not Exist",
            type: "error",
            username: userInfo.username
          });
        }
      });
    }
  });
  app.get("/login", function(req, res) {
    var userInfo = req.body;
    if (!userInfo.username || !userInfo.password) {
      res.render("login");
      //  {
      //   message: "Please Fill Out All Fields",
      //   type: "error",
      //   username: userInfo.username
      // });
    } else {
      app.post("/api/posts", function(req, res) {
        db.Post.create(req.body).then(function() {
          res.json(dbPost);
        });
      });
      db.account.findOne({ username: userInfo.username }, function(err, user) {
        if (err) {
          res.render("/login", {
            message: "Database Error",
            type: "error",
            username: userInfo.username
          });
        }
        if (user) {
          var hash = crypto
            .pbkdf2Sync(userInfo.password, user.salt, 10000, 64, "sha512")
            .toString("hex");
          if (hash === user.password) {
            req.session.user = user;
            res.redirect("/");
          } else {
            res.render("/login", {
              message: "Invalid Password",
              type: "error",
              username: userInfo.username
            });
          }
        } else {
          res.render("/login", {
            message: "User Does Not Exist",
            type: "error",
            username: userInfo.username
          });
        }
      });
    }
  });
  app.post("/createaccount", function(req, res) {
    var userInfo = req.body;

    if (
      !userInfo.username ||
      !userInfo.password ||
      !userInfo.confirm_password
    ) {
      res.render("signup", {
        message: "Please fill out all fields",
        type: "error"
      });
    } else if (userInfo.password !== userInfo.confirm_password) {
      res.render("signup", {
        message: "Passwords do not match",
        type: "error",
        username: userInfo.username
      });
    } else {
      db.account.findOne({ username: userInfo.username }, function(err, user) {
        if (err) {
          res.render("signup", {
            message: "Database Error",
            type: "error",
            username: userInfo.username
          });
        }

        if (user) {
          res.render("signup", {
            message: "Username is Taken",
            type: "error"
          });
        } else {
          var salt = crypto.randomBytes(64).toString("hex");
          var hash = crypto
            .pbkdf2Sync(userInfo.password, salt, 10000, 64, "sha512")
            .toString("hex");

          var newUser = {
            username: userInfo.username,
            password: hash,
            salt: salt
          };
          // eslint-disable-next-line no-unused-vars
          db.User.create(newUser).then(function(user) {
            if (err) {
              res.render("signup", {
                message: "Database Error",
                type: "error",
                username: userInfo.username
              });
            } else {
              res.render("login", {
                message: "Account Created. Please Login.",
                type: "success"
              });
            }
          });
        }
      });
    }
  });
  app.get("/signup", function(req, res) {
    res.render("signup");
  });
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
