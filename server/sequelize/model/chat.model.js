const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Chat",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4(),
        primaryKey: true,
      },
      chatMsg: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      messageBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Chat",
    }
  );
};
