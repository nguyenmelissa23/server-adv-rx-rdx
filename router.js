const Authentification = require('./controllers/authentification')
const passportService = require('./services/passport');
const passport = require('passport')

const requireAuth = passport.authenticate('jwt', {session: false}); 
// session for cookie is false because we are using token
const requireSignin = passport.authenticate('local', {session: false})

module.exports = function(app){
	
	app.get('/', requireAuth, function(req, res){
		res.send({hi: 'there'});
	})

	app.post('/signup', Authentification.signup);
	app.post('/signin', requireSignin, Authentification.signin);
	// `requireSignin` will intercept/act as middleware before running Authentification.signin	
}									

