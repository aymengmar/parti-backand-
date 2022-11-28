module.exports=(sequelize,DataTypes)=>{
    const Menus=sequelize.define(
        'Menus',
        {
            name:{
                type:DataTypes.STRING,
                allowNull:false
            },
            price:{
                type:DataTypes.STRING
            },
            description:{
                type:DataTypes.STRING
            },
            photo:{
                type:DataTypes.STRING
            },
            categorie:{
                type:DataTypes.STRING
            }
        }
    );
    Menus.associate=models=>{

        Menus.belongsTo(models.Restaurants,{onDelete:"cascade"}) 

    }
    return Menus;
}