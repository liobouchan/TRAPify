'use strict'

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/trapify', (err , res) => {
  if (err) {
    throw err;
  }else {
    console.log("Conectado a la Base da Datos EXITOSO");
  }
})
