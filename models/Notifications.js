module.exports=(sequelize,DataTypes)=>{
    const Notifications=sequelize.define(
        'Notifications',
        {
            Date_notification:{
                type:DataTypes.DATE,
                
            },
          
            Text_notification:{
                type:DataTypes.STRING,
            },

        }
    );
    Notifications.associate=models=>{
        Notifications.hasMany(models.Utilisateurs,{onDelete:"cascade"})
    }
    return Notifications;
}