var models = require('../models/models.js');


// PUT /quizes/:userId/favourites/:quizId
exports.marcar = function(req,res,next){
	console.log("Marcada como favorita");
	var direccion = req.body.redir || '/user/' + req.user.id+ '/favourites';
	req.user.addFavourites(req.quiz).then(function(){
		res.redirect(direccion);
	}).catch(function(error){next(error);})
};



// DELETE /quizes/:userId/favourites/:quizId
exports.desmarcar = function(req,res,next){
	console.log("Eliminada de  favoritos");
	var direccion = req.body.redir || '/user/' + req.user.id+ '/favourites';
	req.user.removeFavourites(req.quiz).then(function(){
		res.redirect(direccion);
	}).catch(function(error){next(error);})
};


// GET /quizes/:userId/favourites
exports.show = function(req,res,next){
	console.log("show favourites");
	req.user.getFavourites().then(function(favourites){
		req.user.getGanados().then(function(superados){
			favourites.forEach(function(favourite){
				favourite.won = superados.some(function(ganado) {return favourite.id == ganado.id});				
				favourite.isFav =true;
			});
			res.render('quizes/index.ejs',{quizes:favourites, errors:[]});
		});
		
	}).catch(function(error){ next(error);})

};


