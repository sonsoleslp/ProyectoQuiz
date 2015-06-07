

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'sonsoleslpquiz@gmail.com',
        pass: 'sfhwlwo*'
    }
});

var css = '<style> html{  font-family:  Arial; font-size: 14px;} div{text-align:center;} strong{color:#F60062} a {  color: #E5012C;  text-decoration: none;} a:hover{font-weight:bold;}</style>'
// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols


// send mail with defined transport object


exports.enviar = function(req,res,next){
	var mailOptions = {
    from: 'Sonsoles López Pernas ✔ <sonsoleslpquiz@gmail.com>', // sender address
    to: req.correo, // list of receivers
    subject: 'Welcome to QUIZ! ✔', // Subject line
    text: + 'Hola '+ req.usu + '!\n'
    	+'Gracias por registrarte en QUIZ! ✔\n'
    	+'Tu clave es: ' + req.passsent + '\n'
    	+'Utilízala para iniciar sesión'
    , // plaintext body
    html: css+'<div><img src="http://sonsoleslp.neocities.org/OTHER.png"><br><br>'
   + 'Hola <strong>'+ req.usu + '</strong>!<br>'
  +' Gracias por registrarte en QUIZ. ✔<br>' // html body
  +'Tu clave es: ' + req.passsent + '<br><br>'
   +'Utilízala para iniciar sesión <br><br>'
   + '<a href="http://sonsoleslp.herokuapp.com">Entra en QUIZ!</a></div>'
	};
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	        next();
	    }else{
	        console.log('Message sent: ' + info.response);
	        next();
	    }
	});
}

exports.confirma = function(req,res){
	res.render('sessions/email',
				{correo: req.correo, errors:[]});
}