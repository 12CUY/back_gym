const fichaEntrenamiento = (sequelize, DataTypes) => {
    return sequelize.define('fichas_entrenamiento', {
        idFicha: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            comment: 'Clave primaria de la ficha de entrenamiento'
        },
        clienteId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        profesorId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        stateFicha: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        createFicha: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        updateFicha: {
            type: DataTypes.STRING(20)
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Fichas de Entrenamiento'
    });
};

module.exports = fichaEntrenamiento;