'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-Pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
	var artistId = req.params.id;

	Artist.findById(artistId, (err, artist)=>{
		if (err) {
			console.log('error');
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if (!artist) {
				console.log('!artist');
				res.status(404).send({message: 'Artista no existen'});
			}else{
				console.log('logrado')
				res.status(200).send({artist});
			}
		}
	});
}

function saveArtist(req, res) {
	var artist = new Artist();

	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';
	
	artist.save((err,artistStored) =>{
		if (err) {
			res.status(500).send({message: 'Error al guardar el artista'});			
		}else{
			if (!artistStored) {
				res.status(404).send({message: 'El artista no ha sido guardado'});
			}else{
				res.status(200).send({artist: artistStored});
			}
		}
	});
}

function getArtists(req , res){
	if (req.params.page) {
		var page = req.params.page;
	}else{
		var page = 1;
	}
	var itemsPerPage = 3;

	Artist.find().sort('name').paginate(page, itemsPerPage, function (err, artists, total) {
		if (err) {
			res.status(500).send({message: 'Error en la petición getArtist'});		
		}else{
			if (!artists) {
				res.status(404).send({message: 'No hay artistas metodo getArtist'});		
			}else{
				return res.status(200).send({total_items: total, artists: artists});		
			}
		}
	});
}

function updateArtist(req , res) {
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) =>{
		if (err) {
			res.status(500).send({message: 'Error en la petición updateArtist'});	
		}else{
			if (!artistUpdated) {
				res.status(404).send({message: 'El artista no ha sido actualuizadi'});	
			}else{
				res.status(200).send({artist: artistUpdated});
			}
		}
	});
}

function deleteArtist(req , res){
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición deleteArtist'});	
		}else{
			if (!artistRemoved) {
				res.status(404).send({message: 'El artista no ha sido eliminado'});
			}else{
				console.log(artistRemoved);
				//res.status(404).send({artistRemoved});
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
					if (err) {
						res.status(500).send({message: 'Error en la petición deleteArtistALBUM'});	
					}else{
						if (!albumRemoved) {
							res.status(404).send({message: 'El album no ha sido eliminado'});
						}else{
							Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
								if (err) {
									res.status(500).send({message: 'Error en la petición deleteArtistALBUMSong'});	
								}else{
									if (!songRemoved) {
										res.status(404).send({message: 'El cancion no ha sido eliminado'});
									}else{
										res.status(200).send({artist: artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res){
	var artistId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) =>{
				if (!artistUpdated) {
					res.status(404).send({
						message: 'No se ha podido actualizar el usuario'
					});	
				}else{
					res.status(200).send({artist: artistUpdated});
				}
			});
		}else{
			res.status(200).send({message: 'Extensión del archivo no valida.'});
		}
	}else{
		res.status(200).send({message: 'No has subido ninguna imagen...'});
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/artists/'+imageFile;
	fs.exists(path_file , function(exists){
		if (exists) {
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
};