var express = require('express');
var multer = require('multer');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');
var statscontroller = require('../controllers/stats_controller');
var favscontroller = require('../controllers/favourites_controller');
var pointsController = require('../controllers/points_controller');
var visitasController = require('../controllers/visitas_controller');
var emailController = require('../controllers/email_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index',  { title: 'Quiz', errors: []});
});

router.param('quizId', 		quizController.load);
router.param('userId',		userController.load);
router.param('commentId', 	commentController.load);

//Definición de rutas de sesión
router.get('/login',  sessionController.new); //formulario login
router.post('/login', sessionController.create); //crear sesión
router.get('/logout', sessionController.destroy); //dstruir sesion

//Definición de rutas de cuenta
router.get('/user', userController.new);
router.post('/user', multer({dest:'./public/media/'}), userController.create, emailController.enviar, emailController.confirma);
router.get('/user/:userId(\\d+)/edit',		sessionController.loginRequired, userController.ownershipRequired, userController.edit);
router.put('/user/:userId(\\d+)', 			sessionController.loginRequired, userController.ownershipRequired, multer({dest:'./public/media/'}),  userController.update);
router.delete('/user/:userId(\\d+)', 		sessionController.loginRequired, userController.ownershipRequired, userController.destroy);
router.get('/user/:userId(\\d+)/quizes',	sessionController.loginRequired, userController.ownershipRequired, quizController.index);


//Definición de rutas de /quizes
router.get('/quizes', 														 quizController.index);
router.get('/quizes/:quizId(\\d+)', 										 quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 									 pointsController.ganar);
router.get('/quizes/new',					sessionController.loginRequired, quizController.new);
router.post('/quizes/create', 				sessionController.loginRequired, multer({dest:'./public/media/'}), quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', 	sessionController.loginRequired, quizController.ownershipRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', 		sessionController.loginRequired, multer({dest:'./public/media/'}), quizController.ownershipRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',		sessionController.loginRequired, quizController.ownershipRequired, quizController.destroy);


//Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', 	  				  commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',		 				  commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired,  commentController.ownershipRequired, commentController.publish);

//Definición de rutas de estadísticas
router.get('/quizes/statistics', statscontroller.show);

//Definición de rutas de favoritos
router.get('/user/:userId(\\d+)/favourites', 					sessionController.loginRequired, favscontroller.show);
router.put('/user/:userId(\\d+)/favourites/:quizId(\\d+)',  	sessionController.loginRequired, quizController.propiedad, favscontroller.marcar);
router.delete('/user/:userId(\\d+)/favourites/:quizId(\\d+)', 	sessionController.loginRequired, quizController.propiedad, favscontroller.desmarcar);

router.get('/users',				 		 sessionController.loginRequired, userController.index);
router.get('/user/:userId(\\d+)',			 sessionController.loginRequired,  statscontroller.pasar, userController.show);

router.get('/user/:userId(\\d+)/superados',  sessionController.loginRequired, pointsController.show);
router.get('/sent',  emailController.enviar, emailController.confirma);

module.exports = router;