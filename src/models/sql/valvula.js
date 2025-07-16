const valvula = (sequelize, type) =>{
    return sequelize.define('valvula',{
        idValvula:{
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        codijoValula: type.STRING,
        stateValvula: type.STRING,
        createValvula: type.STRING,
        updateValvula: type.STRING,
    },{
        timestamps: false,
        Comment: 'Tabla Valvulas'
    })
}

module.exports = valvula