var models = require('../models/models.js');

exports.load = function(req,res,next){
  	models.Contador.count().then(function(numero){
  		console.log("//////////////////////////////////////////////"+req.visitas)
  		req.visitas = numero;
  		next();
  	});
  };


exports.nuevavisita = function(req,res,next,visita){
	var visitante = {};
	visitante.sesion = visita;
		var visit = models.Contador.build(visitante);
	visit.save({fields: ["sesion"]});


		/*	visit.validate()
					.then(
						function(err){
							console.log("this went wrong:" +err);
							if(!err) {	
								
											}
						}
					).catch(function(error){next(error)});*/
};

  exports.recuperar = function(req,res,next){
  	models.Contador.countAll().then(function(numero){
  		//req.visitasinicio = numero;
  		visitas= numero;
  	});
  };