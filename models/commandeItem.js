"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommandeItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
        // define association here
        CommandeItem.belongsTo(models.Commande, {
          foreignKey: "commandeId",
          onDelete: "CASCADE",
        });
        CommandeItem.belongsTo(models.Menus, {
            foreignKey: "menuId",
            onDelete: "CASCADE",
          });
      }
  }
  CommandeItem.init(
    {
      quantity: DataTypes.INTEGER,
      commandeId: DataTypes.INTEGER,
      menuId: DataTypes.INTEGER,
      
    },
    {
      sequelize,
      modelName: "CommandeItem",
    }
  );
  return CommandeItem;
};
