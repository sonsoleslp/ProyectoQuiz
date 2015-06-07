var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var visitas = 0;
var cloudinary = require('cloudinary');
var routes = require('./routes/index');
var author = require('./routes/author');
var models = require('./models/models');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());//{ extended: false }));
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));



//Logout automático
app.use(function(req,res,next){
    console.log('sesion:  ' +req.session);
     req.session.count = req.session.count || 0;
    var contadorController = require('./controllers/visitas_controller');
        if(visitas ===0) visitas = models.visitasprincipio;

        if(req.session.count=== 0) { visitas++;
     contadorController.nuevavisita(req,res,next,JSON.stringify(req.session));}
     req.session.count++;
     
     console.log("visitas: "+ visitas);


    req.session
     req.session.visitas=visitas;

        
    

    if (req.session.user){
        if(req.session.user.inicio){

            if((new Date().getTime()-req.session.user.inicio)>120000){
                req.session.user = undefined;
               
            }else {req.session.user.inicio = new Date().getTime();}
           
        } else {req.session.user.inicio = new Date().getTime();}

    }
    next();
});


//Helpers dinámicos:
app.use(function(req,res,next){
    //si no existe lo inicializa
    if(!req.session.redir){
        req.session.redir = '/';
    }
    //guardar path en session.redir para despues de login
    if (!req.path.match(/\/login|\/logout|\/user/)){
        req.session.redir = req.path;
    }
    //hacer visible req.session en las vistas
    res.locals.session = req.session;
    res.locals.cloudinary = cloudinary;
    next();
});

app.use('/', routes);







app.use('/author',author);
app.use('/', routes);

//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
