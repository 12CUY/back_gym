const empleado = (sequelize, DataTypes) => {
    return sequelize.define('empleados', {
        idEmpleado: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true 
        },
        cargo: DataTypes.STRING,
        stateEmpleado: DataTypes.STRING,
        createEmpleado: DataTypes.STRING,
        updateEmpleado: DataTypes.STRING
    }, {
        timestamps: false,
        comment: 'Tabla de Empleados'
    });
};

module.exports = empleado;