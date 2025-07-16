const lectura = (sequelize, type) =>{
    return sequelize.define('lecturas', {
        idLectura:{
             type: type.INTEGER,
             autoIncrement: true,
             primaryKey: true,
        },
        valorLectura: type.STRING,
        createLecturas: type.STRING,
        updateLecturas: type.STRING,
    },{
        timestamps: false,
        Comment: 'Tabla lecturas'
    })
}

module.exports = lectura