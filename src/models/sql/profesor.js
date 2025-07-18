const profesor = (sequelize, DataTypes) => {
    return sequelize.define('profesores', {
        idProfesor: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        especialidad: {
            type: DataTypes.STRING,
            allowNull: false
        },
        stateProfesor: {
            type: DataTypes.ENUM('activo', 'inactivo'),
            allowNull: false
        },
        createProfesor: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updateProfesor: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Profesores'
    });
};

module.exports = profesor;