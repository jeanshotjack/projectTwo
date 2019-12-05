module.exports = function(sequelize, Sequelize) {
  var Post = sequelize.define("Post", {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [1, 70]
      }
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: false,
      len: [1, 200]
    }
  });

  Post.associate = function(models) {
    Post.belongsTo(models.account, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Post;
};
