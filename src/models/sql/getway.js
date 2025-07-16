const getway = (sequelize, type) => {
    return sequelize.define('getways', {
        idGetway: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        codigoGeyway: type.STRING,
        direccionIpGetway: type.STRING,
        stateGetway: type.STRING,
        createGetway: type.STRING,
        updateGetway: type.STRING,
    }, {
        timestamsp: false,
        Comment: 'Tabla Getways'
    })
}

module.exports = getway