module.exports=(sequelize,DataTypes)=>{
    const Utilisateurs=sequelize.define(
        'Utilisateurs',
        {
            code:{
                type:DataTypes.STRING,
               
            },
            DateActivation:{
                type:DataTypes.DATE,
            },
            DateDesactivation:{
                type:DataTypes.DATE,
            },
            DateInscription:{
                type:DataTypes.DATE,
            },
            email:{
                type:DataTypes.STRING,
            },
            etat:{
                type:DataTypes.STRING,
            },
            
            Login:{
                type:DataTypes.STRING,
            },
            NbCommande:{
                type:DataTypes.INTEGER,
            },
           
            NbrDesactivation:{
                type:DataTypes.INTEGER,
            },

            NbReclamation:{
                type:DataTypes.INTEGER,
            },
            nom:{
                type:DataTypes.STRING,
            },
            password_:{
                type:DataTypes.STRING,
            },
            prenom:{
                type:DataTypes.STRING,
            },
            region:{
                type:DataTypes.STRING,
            },
            rue:{
                type:DataTypes.STRING,
            },
            statut:{
                type:DataTypes.STRING,
            },
            telephone:{
                type:DataTypes.INTEGER,
            },
            ville:{
                type:DataTypes.STRING,
            },
            solde:{
                type:DataTypes.INTEGER,
            },
            role:{
                type:DataTypes.STRING,
            },

        }
    );
    Utilisateurs.associate=models=>{
        Utilisateurs.hasMany(models.Reclamations,{onDelete:"cascade"})
    }
    Utilisateurs.associate=models=>{
        Utilisateurs.belongsTo(models.Notifications,{onDelete:"cascade"})
    }
    Utilisateurs.associate=models=>{
        Utilisateurs.hasMany(models.Restaurants,{onDelete:"cascade"})
    }
   Utilisateurs.associate=models=>{
    Utilisateurs.hasMany(models.Reactions,{onDelete:"cascade"})
    }

    return Utilisateurs;
}