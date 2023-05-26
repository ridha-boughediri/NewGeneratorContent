/************************************/
/*** Import des modules nécessaires */
const { DataTypes } = require("sequelize");

/*******************************/
/*** Définition du modèle Message */
module.exports = (sequelize) => {
  const Message = sequelize.define(
    "message",
    {
      id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { paranoid: true }
  ); // Ici pour faire du softDelete

  return Message;
};

/****************************************/
/*** Ancienne Synchronisation du modèle */
// Message.sync()
// Message.sync({ force: true });
// Message.sync({ alter: true });
