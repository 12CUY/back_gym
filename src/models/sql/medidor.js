const medidor = (sequelize, type) =>{
    return sequelize.define('medidores',{
        idMedidores:{
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        codijoMedidor: type.STRING,
        tipoMedidor: type.STRING,
        consumoActualMedidor: type.STRING,
        estadoMedidor: type.STRING,
        createMedidor: type.STRING,
        updateMedidor: type.STRING,
    },{
        timestamps: false,
        Comment: 'Tabala medidores'
    })
}