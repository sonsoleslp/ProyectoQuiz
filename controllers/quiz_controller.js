var models = require('../models/models.js');

exports.ownershipRequired = function(req,res,next){

	var objQuizOwner = req.quiz.UserId;
	var logUser = req.session.user.id;
	var isAdmin = req.session.user.isAdmin;

	if(isAdmin ||objQuizOwner === logUser){
		next();
	}else{
		res.redirect('/');
	}
};


exports.propiedad = function(req,res,next){
		
	var barra = req.user.id;
	var logUser = req.session.user.id;
	console.log(barra); console.log(logUser);
	if(barra === logUser){
		next();
	}else{
		res.redirect('/');
	}
};


// LOAD
exports.load = function(req,res,next,quizId) {
	console.log("Load quiz");
	models.Quiz.find({
		where: {id: Number(quizId)},
		include: [{model: models.Comment}]
	}).then(
			function(quiz) {
				if(quiz){
					
					req.quiz=quiz; 

					next();
				}else{ next(new Error('No existe quizId=' + quizId)); }
			}).catch(function(error){next(error);});
};


// GET /quizes

// GET /quizes
exports.index = function(req,res){

	var options = {};
	var logUser = req.session.user;
	var favs = {};

	if(req.user){
		options.where = {UserId: req.user.id }
		console.log("req.user      " +req.user);
			//Gestión favoritos para Mis preguntas
			/*	req.user.getQuizzes({through: 'Favourites'}).then(function(favourites){
				favourites.forEach(function(favourite){
					favs[favourite.id]=1; console.log("id"+favourite.id);
					});
			});*/
			//	
	};

	if ( req.session && req.session.user){
		options.include = {model: models.User, as: "Fans"}
    }

	
	
	console.log(favs.toString());

	if (req.query.search == undefined) {
		models.Quiz.findAll(options).then(function(quizes){

			if (req.session.user) {
				quizes.forEach(function(quiz) {
					quiz.isFav = quiz.Fans.some(function(fan) {return fan.id == 

req.session.user.id});
				});
			}
						
			res.render('quizes/index.ejs',{quizes: quizes, errors:[]});
		});
	}else{
			
		console.log(req.query.search);
		var search= '%' +(String(req.query.search)).replace(/\s/g,"%")+'%';
		models.Quiz.findAll({where: ["pregunta like ?",search], order: ['pregunta'], include : 

{model: models.User, as: "Fans"}}).then(function(quizes){
			if (req.session.user) {
				quizes.forEach(function(quiz) {
					quiz.isFav = quiz.Fans.some(function(fan) {return fan.id == 

req.session.user.id});
				});
			}
			res.render('quizes/index.ejs',{quizes: quizes,errors:[]});
		}).catch(function(error){next(error);});
	}
};
// GET /quiz/:id
exports.show = function (req,res){///////////////////////
	models.Quiz.findAll({where: {id:req.params.quizId}, include:{model: models.User, as: "Fans"}}).then(function(quizes) {
	    //	if(req.user){
			if (req.session.user) {
				quizes.forEach(function(quiz) {
					req.quiz.isFav = quiz.Fans.some(function(fan) {return fan.id == req.session.user.id});
					res.render('quizes/show',{quiz: req.quiz, errors:[]});
				});
			

			} else{
				res.render('quizes/show',{quiz: req.quiz, errors:[]});
			}


	});
}
// GET /quizes/:id/answer
exports.answer = function(req,res){
	var resultado = 'Incorrecto';
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		if (req.query.respuesta === req.quiz.respuesta){
			resultado = 'Correcto';
		}
			res.render('quizes/answer',
				{quiz: quiz,respuesta: resultado, errors:[]});
		
	})
};


// GET /quizes/new
exports.new = function (req,res) {
	var quiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta"});
	res.render('quizes/new', {quiz: quiz, errors: []});
};


//POST /quizes/create
exports.create = function(req,res) {
	req.body.quiz.UserId = req.session.user.id;

	if(req.files.image){
		req.body.quiz.image = req.files.image.name;
	}

	var quiz = models.Quiz.build(req.body.quiz);
	quiz.validate().then(
		function(err){
		if (err) {
			res.render('quizes/new', {quiz:quiz, errors:err.errors});

		} else {
			quiz.save({fields: ["pregunta","respuesta","UserId","image"]})
			.then(function(){res.redirect('/quizes')})}
		
	}).catch(function(error){next(error)});
};

exports.edit = function(req,res) {

	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

exports.update = function(req,res) {

	if(req.files.image){
		req.quiz.image=req.files.image.name;
	}

	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz.validate().then(
		function(err){
		if (err) {
			res.render('quizes/edit', {quiz:req.quiz, errors:err.errors});

		} else {
			req.quiz.save({fields: ["pregunta","respuesta","image"]})
			.then(function(){res.redirect('/quizes')})}
		
	});
};
exports.destroy = function(req,res){
	req.quiz.destroy()
	.then(function(){res.redirect('/quizes');
	}).catch(function(error){next(error);});

	};


