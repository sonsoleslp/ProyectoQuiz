var models = require('../models/models.js');
var cloudinary = require('cloudinary');
//Comprueba si el usuario está registrado en users
//Si autenticación falla o hay errores se ejecuta callback(error)




exports.ownershipRequired = function(req,res,next){
		console.log("entra user");
	var objUser = req.user.id;
	console.log("objuser ok");
	var logUser = req.session.user.id;
	console.log("loguser ok");
	var isAdmin = req.session.user.isAdmin;
	console.log("isadmin ok");
	if(isAdmin || objUser === logUser){
		console.log("next user");
		next();
	}else{
		console.log("redirect user");
		res.redirect('/');
	}
};

//Autoload: userId
exports.load = function(req,res,next,userId){
	console.log("usercontroller load");
	models.User.find({where:{ id:Number(userId)}})
	.then(function(user){
		if(user){
			req.user = user;
			console.log("asignacion");
			next();
		} else {next(new Error('No existe userId=' + userId))}

	}).catch(function(error){console.log("ha fallado en userload");next(error)});
};




exports.autenticar = function(login, password, callback){
	models.User.find({
		where: {username: login}
	}).then(function(user){
		if(user){
			if(user.verifyPassword(password)){
				callback(null,user);
			} else {callback(new Error('La contraseña introducida no es correcta')); }
		} else {callback(new Error('El usuario '+login+' no existe' ))}	
		}).catch(function(error){callback(error)})
};

exports.edit = function(req,res){
	console.log("edit user");
	res.render('user/edit', {user:req.user, errors:[]});
};

exports.update = function(req,res,next){
	console.log("update user");
	if (!req.body.user) {
		req.body.user={};
	}
	req.user.username = req.body.user.username || "";
	req.user.password = req.body.user.password || "";
	console.log("llega");
	req.user.description = req.body.user.description || "";
	if(req.files.image){
		req.user.image=req.files.image.name;
	}
	console.log("llega2");
	req.user
	.validate()
	.then(
		function(err){
			if(err){
				res.render('user/edit',{user:req.user,errors:err.errors});
			} else {
				req.user
				.save({fields: ['username','password','description','image']})
				.then(function(){res.redirect('/');});
			}
		}).catch(function(error){next(error)});
};

exports.new = function(req,res){
	var user = models.User.build(
		{username: "", password:""}
		);
	res.render('user/new',{user:user,errors:[]})
};

exports.create = function(req,res){
	
	/*if(req.files.image){
		req.body.user.image=req.files.image.name;
	}*/
	if(req.files.image){
		 cloudinary.uploader.upload(
			req.files.image.path, function(result) { 
				console.log(result);
				req.body.user.image = result.public_id;
				//console.log("imageeeeeeen   " + req.body.quiz.image);


			var user = models.User.build(req.body.user);
	user.validate().then(
		function(err){
			if(err){
				res.render('user/new',{user:user,errors:err.errors});
			}else{
				user
				.save({fields:["username","password", "description","image"]})
				.then(function(){
					req.session.user = {id:user.id, username:user.username, description:user.description, image:user.image};
					res.redirect('/');
				});
			}
		}
	).catch(function(error){next(error)});});
} else{
	var user = models.User.build(req.body.user);
	user
	.validate()
	.then(
		function(err){
			if(err){
				res.render('user/new',{user:user,errors:err.errors});
			}else{
				user
				.save({fields:["username","password", "description","image"]})
				.then(function(){
					req.session.user = {id:user.id, username:user.username, description:user.description, image:user.image};
					res.redirect('/');
				});
					}
				}
			).catch(function(error){next(error)});
	}



};

exports.destroy = function(req,res){
	req.user.destroy().then(function(){
		delete req.session.user;
		res.redirect('/');
	}).catch(function(error){next(error)});
};



exports.show = function(req,res){

	models.User.findById(req.user.id).then(function(user){

		res.render('user/profile',{
			user:user, 
			preguntas: req.preguntas, 
			comentarios: req.comentarios,
			media: req.media,
			sin: req.sin,
			con: req.con,
			superadas: req.superadas,
			nosuperadas: req.nosuperadas,
			errors: []});
	})
	
};



exports.index = function(req,res){

	models.User.findAll({order:[['score', 'DESC']]}).then(function(users){
		res.render('user/index',{users:users, errors: []});
	})
	
};