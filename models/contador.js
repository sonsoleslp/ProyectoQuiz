module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Contador',
		{
			sesion:{
			type: DataTypes.STRING
			
		}

	});

};



/*
,
				validate: { notEmpty: {msg: "->No ha introducido ningún nombre de usuario"},
					//devuelve mensaje de error si username ya existe
					isUnique: function(value, next){
						console.log("not even")
						var self = this;
						Contador
						.find({where: {sesion: value}})
						.then(function(ses){
							if(ses && self.sesion !== ses.sesion) {
								console.log("returning user");
								return next('El usuario ya existe');
							}console.log("right here");
							return next();
						}).catch(function(err){return next(err);});
						console.log("right past");
					}
*/

























/*
,
			validate: { notEmpty: {msg: "->No ha introducido ningún nombre de usuario"},
					//devuelve mensaje de error si username ya existe
					isUnique: function(value, next){
						var self = this;
						Contador
						.find({where: {sesion: value}})
						.then(function(ses){
							if(ses && self.id !== ses.id) {
									console.log("returning user");
								return next('El usuario ya existe');
							}
							return next();
						}).catch(function(err){return next(err);});
					}
				}*/
