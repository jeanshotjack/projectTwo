var db = require("../models");

module.exports = function(app) {
  app.get("/api/posts", function(req, res) {
    db.Post.findAll({
      include: [
        {
          model: db.account
        }
      ]
    }).then(function(dbPosts) {
      res.json(dbPosts);
    });
  });

  app.get("/api/posts/:id", function(req, res) {
    db.Post.findOne({
      where: {
        id: req.params.id
      },
      include: [db.account]
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });
  // Create a new example
  app.post("/api/posts", function(req, res) {
    db.Post.create(req.body).then(function(dbPost) {
      res.json(dbPost);
    });
  });
  // Delete an example by id
  app.delete("/api/posts/:id", function(req, res) {
    db.Post.destroy({
      where: { id: req.params.id }
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  app.put("/api/posts", function(req, res) {
    db.Post.update(req.body, {
      where: {
        id: req.body.id
      }
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });
};
