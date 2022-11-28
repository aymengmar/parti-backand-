

module.exports=(sequelize,DataTypes)=>{
    const Restaurants=sequelize.define(
        'Restaurants',
        {
            first_name:{
                type:DataTypes.STRING,
                allowNull:false
            },
            adress:{
                type:DataTypes.STRING
            },
            designation:{
                type:DataTypes.STRING
            },
            date:{
                type:DataTypes.DATE
            },
            photo:{
                type:DataTypes.STRING
            }
        }
    );
    Restaurants.associate=models=>{
        Restaurants.hasMany(models.Menus,{onDelete:"cascade"});
       
    }
    Restaurants.associate=models=>{
        Restaurants.belongsTo(models.Utilisateurs,{onDelete:"cascade"})
    }
    return Restaurants;
}

