const cliente = (sequelize, DataTypes) => {
    return sequelize.define('clientes', {
        idCliente: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true 
        },
        telefono: DataTypes.STRING,
        direccion: DataTypes.STRING,
        membresiaId: DataTypes.INTEGER,
        stateCliente: DataTypes.STRING,
        createCliente: DataTypes.STRING,
        updateCliente: DataTypes.STRING
    }, {
        timestamps: false,
        comment: 'Tabla de Clientes'
    });
};

module.exports = cliente;