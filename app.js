'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//AQUI SE CARGAN LAS RUTAS
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configurar cabeceras HTTP

// RUTAS BASE
app.use('/api' , user_routes);
app.use('/api' , artist_routes);
app.use('/api' , album_routes);


module.exports = app;