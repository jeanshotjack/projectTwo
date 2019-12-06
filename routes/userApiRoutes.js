var db = require("../models");

module.exports = function(app) {
  app.get("/api/users", function(req, res) {
    db.account
      .findAll({
        include: [db.Post]
      })
      .then(function(dbUser) {
        res.json(dbUser);
      });
  });

  app.get("/api/users/:id", function(req, res) {
    db.account
      .findOne({
        where: {
          id: req.params.id
        },
        include: [db.Post]
      })
      .then(function(dbUser) {
        res.json(dbUser);
      });
  });

  app.post("/api/users", function(req, res) {
    db.account.create(req.body).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  app.delete("/api/users/:id", function(req, res) {
    db.account
      .destroy({
        where: {
          id: req.params.id
        }
      })
      .then(function(dbUser) {
        res.json(dbUser);
      });
  });
};
