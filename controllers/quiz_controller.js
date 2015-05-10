var models = require('../models/models.js');


exports.load = function(req,res,next,quizId) {
	models.Quiz.find(quizId).then(
			function(quiz) {
				if(quiz){
					req.quiz=quiz; 	next();
				}else{ next(new Error('No existe quizId=' + quizId)); }
			}).catch(function(error){next(error);});
};

exports.index = function(req,res){
	console.log(req.query.search);
	var buscar =req.query.search ;
	if (buscar== undefined){

		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs',{quizes: quizes}).catch(function(error){next(error)});
		
		})
	}else{
		var search= '%' +(String(buscar)).replace(/\s/g,"%")+'%';
		models.Quiz.findAll({where: ["pregunta like ?",search], order: ['pregunta']}).then(function(quizes){
			res.render('quizes/index.ejs',{quizes: quizes});
		}).catch(function(error){next(error);});
	}
};

// GET /quiz/:id
exports.show = function (req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show',{quiz: req.quiz});})	
	
};

// GET /quizes/:id/answer
exports.answer = function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if (req.query.respuesta === req.quiz.respuesta){
			res.render('quizes/answer',
				{quiz: quiz, respuesta: 'Correcto'});
		}else{
			res.render('quizes/answer',
				{quiz: quiz, respuesta: 'Incorrecto'});
		}
	})
};


