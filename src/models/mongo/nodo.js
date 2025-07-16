const mongoose = require('mongoose')

const nodoMongo = new mongoose.Schema({
    fechaIntalacionNodo: String,
    bateriaNodo: String,
    idNodoSql: String,
},{
     timestamps: false,
     collection: 'nodo'
})

const nodo = mongoose.model('nodo', nodoMongo)

module.exports = nodo