const mongose = require('mongoose')

const getwayMongose = new mongose.Schema({
    ubicacion: String,
    fechaInstalacion: String,
    latitud: String,
    longitud: String,
    idGetwaySql: String,
}, {
    timestamps: false,
    collection: 'getway'
})

const getway = mongose.model('getways', getwayMongose)

module.exports = getway