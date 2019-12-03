var db = require("../models");
var crypto = require("crypto");
module.exports = function(app) {
  app.get("/", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });
  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
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
      PlayerModel.findOne({ username: userInfo.username }, function(err, user) {
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
      PlayerModel.findOne({ username: userInfo.username }, function(err, user) {
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

          var newPlayer = new PlayerModel({
            username: userInfo.username,
            password: hash,
            salt: salt
          });
        
          app.post("/api/users", function(req, res) {
            db.Post.create(req.body).then(function(dbPost) {
              res.json(dbPost);
            });

          });
          newPlayer.create(function(err, PlayerModel) {
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
  app.post("/signup", function(req, res) {
    res.render("signup");
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
      PlayerModel.findOne({ username: userInfo.username }, function(err, user) {
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
            //res.render("game.pug", {username: user.username});
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
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
