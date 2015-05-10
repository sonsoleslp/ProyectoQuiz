var models = require('../models/models.js');

// GET /quiz/:id
exports.show = function (req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show',{quiz: quiz});})	
	
};

// GET /quizes/:id/answer
exports.answer = function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if (req.query.respuesta === quiz.respuesta){
			res.render('quizes/answer',
				{quiz: quiz, respuesta: 'Correcto'});
		}else{
			res.render('quizes/answer',
				{quiz: quiz, respuesta: 'Incorrecto'});
		}
	})
};


exports.index = function(req,res){
	console.log(req.query.search);
	var buscar =req.query.search 
	if (buscar== undefined){

		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs',{quizes: quizes});
		
		})
	}else{
		var search= '%' +(String(buscar)).replace(/\s/g,"%")+'%';
		models.Quiz.findAll({where: ["pregunta like ?",search], order: ['pregunta']}).then(function(quizes){
			res.render('quizes/index.ejs',{quizes: quizes});
		})
	}
};
