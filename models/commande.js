"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    
    class Commande extends Model {
      static associate(models) {
        // define association hereÒ
        Commande.belongsTo(models.Utilisateurs, {
          foreignKey: "userId",
          onDelete: "CASCADE",
        });
      }
      }
  Commande.init(
    {
      total_price: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      
    },
    {
      sequelize,
      modelName: "Commande",
    }
  );
  return Commande;
};
