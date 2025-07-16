const sector = (sequelize, type) =>{
    return sequelize.define('sectores',{
        idSector: {
            type:  type.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombreSector: type.STRING,
        codigoPostalSector: type.STRING,
        descripcionSector: type.STRING,
        createSector: type.STRING,
        updateString: type.STRING,
    },{
        timestamps: false,
        Comment: 'Tabla Sector'
    })
}

module.exports = sector