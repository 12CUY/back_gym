const actividad = (sequelize, DataTypes) => {
    return sequelize.define('logs_actividad', {
        idLog: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        usuarioId: DataTypes.INTEGER,
        accion: DataTypes.STRING,
        tablaAfectada: DataTypes.STRING,
        stateLog: DataTypes.STRING,
        createLog: DataTypes.STRING,
        updateLog: DataTypes.STRING
    }, {
        timestamps: false,
        comment: 'Tabla de Logs de Actividad'
    });
};

module.exports = actividad;