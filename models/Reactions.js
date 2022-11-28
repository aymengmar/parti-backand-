

module.exports=(sequelize,DataTypes)=>{
    const Reactions=sequelize.define(
        'Reactions',
        {
            reaction:{
                type:DataTypes.STRING,
                allowNull:false
            }
        }
    );
    Reactions.associate=models=>{
        Reactions.belongsTo(models.Menus,{onDelete:"cascade"});
      
    }
    Reactions.associate=models=>{
        Reactions.belongsTo(models.Utilisateurs,{onDelete:"cascade"})
    }
    return Reactions;
}

