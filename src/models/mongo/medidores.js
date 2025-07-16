const mongoose = require('mongoose')

const medidorMongo = new mongoose.Schema({
    marcaMedidor: String,
    modeloMedidor: String,
    fechaUltimaLectur: String,
},{
    timestamps: false,
    collection: 'Medidor'
})

const medidor = mongoose.model('medidor', medidorMongo)

module.exports = medidor
