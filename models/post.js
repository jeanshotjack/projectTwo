module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    text: DataTypes.STRING,
    header: DataTypes.TEXT
  });
  return Post;
};
