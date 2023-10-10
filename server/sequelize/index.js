const { Sequelize } = require("sequelize");
require("dotenv").config();
const { DB_SCHEMA, DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(DB_SCHEMA, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_NAME,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database is connected....");
  })
  .catch((err) => {
    console.log(`connection error => ${err}`);
  });

const allModels = [
  require("./model/chat.model"),
  require("./model/grpChat.model"),
];

for (const newModel of allModels) {
  newModel(sequelize);
}

sequelize
  .sync({
    alter: true,
    // force:true
  })
  .then(() => {
    console.log("Database sync successfully");
  })
  .catch((err) => {
    console.log(`database sync error => ${err}`);
  });

module.exports = sequelize;
