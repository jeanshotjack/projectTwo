module.exports = function(sequelize, Sequelize) {
  var account = sequelize.define("account", {
    username: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    salt: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  return account;
};
