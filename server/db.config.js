/************************************/
/*** Import des modules nécessaires */
const { Sequelize } = require("sequelize");

/************************************/
/*** Connexion à la base de données */
let sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

/*** Mise en place des relations */
const db = {};

db.sequelize = sequelize;
db.user = require("./models/user")(sequelize);
db.message = require("./models/messages")(sequelize);

// 8 relation user et message

db.message.hasMany(db.user, { foreignKey: "message_id", onDelete: "cascade" });
db.user.belongsTo(db.message, { foreignKey: "message_id" });

/*********************************/
/*** Synchronisation des modèles */
sequelize.sync((err) => {
  console.log("Database Sync Error", err);
});
db.sequelize.sync({ alter: true });

module.exports = db;
