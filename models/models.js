var path = require('path');

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol  = (url[1]||null);
var dialect  = (url[1]||null);
var port  = (url[5]||null);
var host  = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

var Sequelize = require('sequelize');
var sequelize = new Sequelize(DB_name,user,pwd,
	{ dialect:protocol,
 	  protocol:protocol,
 	  port:port,
 	  host:host,
 	  storage:storage,
 	  omitNull:true
 	 });

//Importar definición de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

//Importar definición de la tabla Comment
var comment_path= path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

//Importar definición de la tabla de usuarios
var user_path = path.join(__dirname, 'user');
var User = sequelize.import(user_path);



//los quizes pertenecen a un usuario registrado
Quiz.belongsTo(User);
User.hasMany(Quiz);
User.belongsToMany(Quiz, {through: 'Favourites', as:"Favourites" });
Quiz.belongsToMany(User, {through: 'Favourites', as: "Fans" });
User.belongsToMany(Quiz, {through: 'Points', as:"Ganados" });
Quiz.belongsToMany(User, {through: 'Points', as:"Participants" });
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);
// exportar tablas
exports.Quiz = Quiz;
exports.Comment = Comment;
exports.User = User;



sequelize.sync().then(function(){
	User.count().then(function(count){//////})
		if(count===0){console.log('aqui');
			User.bulkCreate(
				[ {username: 'admin', password:'1234', isAdmin: true, image: 'user2.png'},
				  {username: 'sonsoleslp', password:'5678', description: ' Sonsoles López Pernas. 21 años.', image: 'sonso.png'}
				  ]
				

			).then(function(){
			
				console.log('Base de datos(tabla user) inicializada');
				Quiz.count().then(function(count){
				if(count === 0) {
					Quiz.bulkCreate(
					[{pregunta:'Capital de Italia',	respuesta:'Roma', UserId:2, image: 'ITALIA.jpg'},
				     {pregunta:'Capital de Portugal',respuesta:'Lisboa', UserId:2, image: 'PORTUGAL.png'},
				     {pregunta:'Capital de España',	respuesta:'Madrid', UserId:2, image: 'SPAIN.jpg'}				     
					]
					).then(function(){console.log('Base de datos (tabla quiz) inicializada')});
					};
				});
			});
		};
	});
});