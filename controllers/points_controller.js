var models = require('../models/models.js');


// PUT /quizes/:userId/favourites/:quizId
exports.ganar = function(req,res,next){
	console.log("Ganar!!!!!!!!!!!!!!!");

	var resultado = 'Incorrecto';
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		if (req.query.respuesta === req.quiz.respuesta){
			resultado = 'Correcto';
			if(req.session.user){				
				models.User.findById(req.session.user.id).then(function(user){
					
					user.addGanados(req.quiz).then(function(){
						user.score++;
						user.save({fields: ['score']})
						

						res.render('quizes/answer', {quiz: quiz,respuesta: resultado, errors:[]})
						
					}).catch(function(error){next(error);})});
			} else {res.render('quizes/answer', {quiz: quiz,respuesta: resultado, errors:[]})}
		}else {res.render('quizes/answer', {quiz: quiz,respuesta: resultado, errors:[]})}
		
	});

};



// DELETE /quizes/:userId/favourites/:quizId
exports.perder = function(req,res,next){

	var direccion = req.body.redir || '/user/' + req.user.id+ '/superados';
	req.user.removeGanados(req.quiz).then(function(){
		res.redirect(direccion);
	}).catch(function(error){next(error);})
};


// GET /quizes/:userId/favourites
exports.show = function(req,res,next){
	console.log("show favourites");
	req.user.getGanados().then(function(superados){
		req.user.getFavourites().then(function(favs){

			superados.forEach(function(superado){
				superado.isFav = favs.some(function(fan) {return fan.id == superado.id});
				superado.won =true;

			});
			res.render('quizes/index.ejs',{quizes:superados, errors:[]});
		});
		
	}).catch(function(error){ next(error);})

};

