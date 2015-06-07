var models = require('../models/models.js');


exports.ownershipRequired = function(req,res,next){

	models.Quiz.find({
		where: {id: Number(req.comment.QuizId)}
	}).then(function(quiz){
		if(quiz){
			var objQuizOwner = quiz.UserId;////
			var logUser = req.session.user.id;
			var isAdmin = req.session.user.isAdmin;
			console.log(objQuizOwner, logUser, isAdmin);
			if(isAdmin ||objQuizOwner === logUser){			
				next();
			} else { res.redirect('/');}
		} else {next(new Error('No existe quizId='+ quizId));}
	}).catch(function(error){next(error)});

};



//Autoload: id de comentarios
exports.load = function(req,res,next,commentId){
	models.Comment.find({
		where: {
			id: Number(commentId)
		}
	}).then(function(comment) {
		if(comment){
			req.comment = comment;
			next();
		} else{next(new Error('No existe commentId=' + commentId))}
	}).catch(function(error){next(error)});
};


// GET /quizes/:quizId/comments/new
exports.new = function(req,res){

	res.render('comments/new.ejs', {quizid: req.params.quizId, errors:[]});

};

exports.create = function(req,res){

	var usuario ='anónimo';
	if(req.session.user){usuario = req.session.user.username;}

	var comment = models.Comment.build(
		{texto: req.body.comment.texto, 
			QuizId: req.params.quizId, autor:usuario});

	comment.validate().then(function(err){
		if(err){
			res.render('comments/new.ejs',{comment:comment, errors: err.errors});	
		} else { comment
			.save()
			.then( function(){res.redirect('/quizes/'+req.params.quizId)})}
			
		}).catch(function(error){next(error)});};

//GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req,res) {
	req.comment.publicado = true;

	req.comment.save( {fields: ["publicado"]})
	.then( function(){res.redirect('/quizes/'+ req.params.quizId);
		console.log("aqui" + req.params.quizId);})
	.catch(function(error){next(error)});
};