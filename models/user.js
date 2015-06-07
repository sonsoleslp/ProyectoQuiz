var crypto = require('crypto');
var key = 'MIIEpAIBAAKCAQEAv8lubZQYPqUlNAAjorlccab10b81gv0BYicgU6c+q7kFNO3KsU3ZW/cxCGEGdV18sG+ft3f1XtZP9m2NwWTidfGj7f8r1kvkhx9XOfWDg/+gZWzCuMDMjqSSm+CXXmAL2QpJ/fsHl5cC4v2k4t8PQMCFjEIwi8kjJukWv+NQ8fFW0gRtD9rgd5FIwGZxz9xFkjxqQvAm34eKlPNrEiLqPpp9BT0Du4dr4wulTLyUsu8NPN/0k98SjDtiTsxt5noLeT7CSY1NmJDxpCvq8pcukIjMmkq2DJ7y5qIopfBwazn0DPz4ua8ZVZtozGH6Zt7c1uOy+ZF1bu7WggXyTbuBOQIDAQABAoIBAHehfnB74GOzP/Gf5JqsZS2/p7aePxLmHubK4S9NM5qKXuUVL0pJ9TuYhc1kOFMdbZnhBw+6lCQEKvzceYAZHenUQR1D/mQ+Et72fcJ5kv/ThIm/vfbgzLhtj8YL4l/MKZfJAz6aR7IXUIWnEiMyYKFTdfp3jzCi1np/CuHHOcawXrMNe5N3HIqyAOE9fXX8SONk+6OtfgZV/bZMv2DNICpetWZ+jHv7hV5u9vsUrtwCSOSv2lLPIDiIarDQUxVQengnny3vNhdLI42ECzh5IR/fpTdmy9OMi3JKI8FprPdINx9r5cfW4UcM2Ldflkn4wTAt8v+Rn7lhUjkoh8qTmMECgYEA8XnMp+1yF0G8Vy0t4IhrE0SU0MZ3P1cTJ4VdpXc3QKntnALXckNsoTXGKIsLRjasDPvqcpjAPrA5fMPTJfZsbaYxc/QdUu6dYV1R1IuJaV7sD+KACENwc91aQxwm3kr5lp/8CNywZSX5zVjpC+CLuH8oQtwbJTgk0+yaQXxBeqsCgYEAy1KH1cLOSL+CgqNc2LJj4KVW2Q5mdS+OT/Jc0z9DbYRAEV8Nk+h5XjPoRXxiY+xF+eXTjC8putza5nytTuqFJrzlSC/fxbhFjlGgHqPyDmFmmYFPav2hukJbf0Qq3vhXUdr/5wXLpauvb4n25HH9tJGM7WAQN+XTDiQIML+rs6sCgYEAtSX2DZPnHuNFcvCFlgdArDeqm+QG2RFtYRx/X/3LCUtw4LSRAzrpZxZ8DTYhww6Ii0UAX++PaHey6JHO+I+gT7F5L89VoD04+y2SkawL7Ww0EsaL3acZ2RGZAPdBgUkla4WhANTtzzNp7k5gpXRR3JonjeCozIcNuZ2pKq8YP/kCgYAh6MfCvNSOiXIIu5oWgdnqc2jCloY78Qx5BOC6Uoi6UR4mR4YKLvFe5qVMQWxfYd5hyRS5AnyhL4hKfGyjBrXiOgq7OVDGtu7Sx4Y+1fTetRvZahmGrHo2iC6eUQ4dVamqey3Gp87I+JMvtQC6JNC9NrEcPbM2v1utthCvoKfQNQKBgQCO1l0nmIRYzybUCa+j0j0Y+AJPV/5ydcImQYHj5lHVKhDLVDuoPivRrJ+I2kJIFQ+OFw/CszQBQhu8Se4MLZ2Lc+b2GAttEs35TuqKOgVem1NouFkPnreLpcpKqoyFdaAT+nNZY5ZSAxWgBU4SuNy8j+GJ52KLgmKHWNjiiQKfVw';

module.exports = function(sequelize, DataTypes){
	var User = sequelize.define(
		'User',
		{ 
			username: {
				type: DataTypes.STRING,
				unique: true,
				validate: { notEmpty: {msg: "->No ha introducido ningún nombre de usuario"},
					//devuelve mensaje de error si username ya existe
					isUnique: function(value, next){
						var self = this;
						User
						.find({where: {username: value}})
						.then(function(user){
							if(user && self.id !== user.id) {
								return next('El usuario ya existe');
							}
							return next();
						}).catch(function(err){return next(err);});
					}
				}
				///////////////////////
			},
			password: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "->No ha introducido ninguna contraseña"}},
				set: function(password){
					var encripted = crypto
									.createHmac('sha1',key)
									.update(password)
							.digest('hex');
					//Evita  vacíos
					if(password === '') {encripted = '';}
					this.setDataValue('password',encripted);				
					
				}
			},
			isAdmin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			description:{
				type: DataTypes.STRING,
				defaultValue:''
			},
			image:{
				type: DataTypes.STRING,
				defaultValue: 'kudb5ucvig8c7xypfh6w'
			},
			email:{
				type:DataTypes.STRING
			},

			score:{
				type: DataTypes.INTEGER,
				defaultValue: 0
			}

		},{
			instanceMethods: {
				verifyPassword: function(password){
					var encripted = crypto.createHmac('sha1',key)
									.update(password)
									.digest('hex');
					return encripted == this.password;
				}
			}
		}

	);
	return User;
}
