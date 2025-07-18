const clase = (sequelize, DataTypes) => {
    return sequelize.define('clases', {
        idClase: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        capacidadMaxima: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        horario: {
            type: DataTypes.STRING, // Puedes usar TIME o DATE si es horario específico
            allowNull: false
        },
        profesorId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        stateClase: {
            type: DataTypes.ENUM('activo', 'inactivo'),
            allowNull: false
        },
        createClase: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updateClase: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Clases'
    });
};

module.exports = clase;