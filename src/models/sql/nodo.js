const nodo = (sequelize, type) =>{
    return sequelize.define('nodos', {
        idNodos: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        codijoNodo: type.STRING,
        tipoNodo: type.STRING,
        createNodo: type.STRING,
        updateNodo: type.STRING,
    },{
        timestamsp: false,
        Comment: 'Tabla de nodos'
    })
}