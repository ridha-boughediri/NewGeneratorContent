/************************************/
/*** Import des modules nécessaires */
const { DataTypes } = require("sequelize");

/*******************************/
/*** Définition du modèle User */
module.exports = (sequelize) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true, //une validation des données
        },
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING(64),
        is: /^[0-9a-f]{64}$/i, //ici une contrainte
        allowNull: false,
      },

      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      login: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uri_avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // uri_avatar: {
      //     type: DataTypes.STRING,
      //     allowNull: true
      // },
      // points: {
      //     type: DataTypes.INTEGER,
      //     allowNull:true
      // },
      // uri_badge: {
      //     type: DataTypes.STRING,
      //     allowNull: true
      // },
    },
    { paranoid: true }
  ); // Ici pour faire du softDelete

  return User;
};

/****************************************/
/*** Ancienne Synchronisation du modèle */
// User.sync();
// User.sync({ force: true });
// User.sync({ alter: true });
