const mongoose = require('mongoose')

const lecturaShema = new mongoose.Schema({
    fechaHoraLectura: String,
    tipoLectura: String,
    idLecturaSql: String,
},{
    timestamps: false,
    collation: 'lecturas'
})

const lecturas = mongoose.model('lecturas', lecturaShema)

module.exports = lecturas