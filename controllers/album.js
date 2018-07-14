'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-Pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
	var albumId = req.params.id;

	Album.findById(albumId).populate({path: 'artist'}).exec((err, album) =>{
		if (err) {
			res.status(500).send({message : 'error album GETALBUM'});
		}else{
			if (!album) {
				res.status(404).send({message : 'no se devolvio ningun album en getAlbum'});
			}else{
				res.status(200).send({album});
			}
		}
	});
}

function getAlbums(req, res){
	var artistId = req.params.artist;
	var albumId = req.params.id;

	if (!artistId) {
		//sacar todos los albums de la base de datos
		var find = Album.find({}).sort('title');
	}else{
		//sacar los albums de un artista concreto de la base de datos
		var find = Album.find({artist: artistId}).sort('year');
	}

	find.populate({path:'artist'}).exec((err, albums) => {
		if (err) {
			res.status(500).send({message: 'error en la petición de populate' });
		}else{
			if (!albums) {
				res.status(404).send({message: 'error en la petición de populate no hay albums' });
			}else{
				res.status(200).send({albums });
			}
		}
	})
}

function saveAlbum(req, res) {
	var album = new Album();

	var params = req.body;
	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;

	album.save((err, albumStored) => {
		if(err){
			res.status(500).send({message : 'no se guardo error album'});
		}else{
			if (!albumStored) {
				res.status(404).send({message : 'no se ha cuagdado el album'});
			}else{
				res.status(200).send({album: albumStored});
			}
		}
	});
}

function updateAlbum(req, res) {
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) =>{
		if(err){
			res.status(500).send({message : 'error al hace update album'});
		}else{
			if (!albumUpdated) {
				res.status(404).send({message : 'no se ha actualizado el album'});
			}else{
				res.status(200).send({album: albumUpdated});
			}
		}
	});
}

function deleteAlbum(req, res) {
	var albumId = req.params.id;
		
	Album.findByIdAndRemove(albumId,(err, albumRemoved) => {
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
							res.status(200).send({album: albumRemoved});
						}
					}
				});
			}
		}
	});
}


module.exports= {
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum
};