const asistencia = (sequelize, DataTypes) => {
    return sequelize.define('asistencias', {
        idAsistencia: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        clienteId: DataTypes.INTEGER,
        claseId: DataTypes.INTEGER,
        estado: DataTypes.STRING,
        stateAsistencia: DataTypes.STRING,
        createAsistencia: DataTypes.DATE,
        updateAsistencia: DataTypes.DATE
    }, {
        timestamps: false,
        comment: 'Tabla de Asistencias'
    });
};

module.exports = asistencia;