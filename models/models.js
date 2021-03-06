var path = require('path');
var visitasprincipio;
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


//Importar definición de la tabla de visitas
var cont_path = path.join(__dirname, 'contador');
var Contador = sequelize.import(cont_path);

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
exports.Contador = Contador;


sequelize.sync().then(function(){
	Contador.count().then(function(count){
		visitasprincipio = count || 0;
		exports.visitasprincipio = visitasprincipio;
	}).then(function(){
		
		
	User.count().then(function(count){//////})
	if(count===0){console.log('aqui');
	User.bulkCreate(
		[ {username: 'admin', password:'1234', isAdmin: true, image: 'kudb5ucvig8c7xypfh6w'},
		{username: 'sonsoleslp', password:'5678', description: ' Sonsoles López Pernas. 21 años.', image: 'sonso_tcivhx'}
		]
		

		).then(function(){
			
			console.log('Base de datos(tabla user) inicializada');
			Quiz.count().then(function(count){
				if(count === 0) {
					Quiz.bulkCreate(
						[{pregunta:'Capital de Italia',	respuesta:'Roma', UserId:2, image: 'ITALIA_pim7i8'},
						{pregunta:'Capital de Portugal',respuesta:'Lisboa', UserId:2, image: 'PORTUGAL_ptlqvv'},
						{pregunta:'Capital de España',	respuesta:'Madrid', UserId:2, image: 'SPAIN_itmfvc'}				     
						]
						).then(function(){console.log('Base de datos (tabla quiz) inicializada')

					});
					};
				});
		});
	};
});
})
});
