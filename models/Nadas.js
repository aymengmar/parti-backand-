module.exports=(sequelize,DataTypes)=>{
    const Nadas=sequelize.define(
        'Nadas',
        {
            DateDesactivation:{
                type:DataTypes.DATE,
                
            },
          
          

            region:{
                type:DataTypes.INTEGER,
            },
            rue:{
                type:DataTypes.INTEGER,
            },

        }
    );
 
   
    return Nadas;
}