module.exports=(sequelize,DataTypes)=>{
    const Reclamations=sequelize.define(
        'Reclamations',
        {
            date_reclamation:{
                type:DataTypes.DATE,
                
            },
            etat:{
                type:DataTypes.STRING,
            },

            id_reclamation:{
                type:DataTypes.INTEGER,
            },

            text:{
                type:DataTypes.STRING,
            },

            personne:{
                type:DataTypes.STRING,
            },
            emailUser:{
                type:DataTypes.STRING,
            },
            nameUser:{
                type:DataTypes.STRING,
            },
            
            




        }  
    );
    Reclamations.associate=models=>{
        Reclamations.belongsTo(models.Utilisateurs,{onDelete:"cascade"})
    }
    return Reclamations;
}