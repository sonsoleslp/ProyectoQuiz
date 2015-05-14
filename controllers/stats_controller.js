var models = require('../models/models.js');


function num_preguntas(quizes){
	return quizes.length;
};

function num_com(comentarios){
	return comentarios.length;
};

function avg(q,c){
	return c.length/q.length;
}

function preguntassin(q,c){ 
	var preg=[];console.log(preg[0]);
	console.log("q "+q.length);
	console.log("c "+c.length);

	for (var i =0; i<c.length; i++){
		console.log("i "+i);console.log("content"+c[i].texto);
		console.log("quizid"+c[i].QuizId);

		if(preg[c[i].QuizId]) preg[c[i].QuizId]+=1;
		else preg[c[i].QuizId]=1;

		}
		console.log(preg.length);
		console.log(q.length);
		llenas=0;
	for(var k = 0; k<preg.length; k++){
		if(preg[k]) llenas++;
	}

	return q.length-llenas;
}



// GET /quizes/statistics
exports.show = function(req,res){

	models.Quiz.findAll().then(function(quizes){

		
		models.Comment.findAll({where: ["publicado like ?",1]}).then(function(coment){
			if(coment ==undefined) coment = [];
			if(quizes == undefined ) quizes = [];
			var sin= preguntassin(quizes,coment);
			var preguntas =num_preguntas(quizes);

				res.render('quizes/data.ejs',{
				preguntas: preguntas, 
				comentarios: num_com(coment),
				media: avg(quizes,coment),
				sin: preguntassin(quizes,coment),
				con: preguntas - sin,
				errors:[]});})

			
		});



};