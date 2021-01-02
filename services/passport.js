const passport = require('passport');
const User = require('../models/user');
const config = require('../config/config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, passport, done){
	// Verify this username and password, call done with the user
	User.findOne({email: email}, function(err, user){
		if (err) { return done(err)};

		// no user found, call done with false
		if (!user){ return done(null, false)}

		//if it is the correct username and passport
		//compare the password - is 'password' equal to user.password by hashing the input password and see if it's the same as the hashed pwd saved.
		user.comparePassword(passport, function(err, isMatch){
			if (err) return done(err);
			if (!isMatch) return done(null, false);
			
			return done (null, user)
		})


	})
})



// Making sure that the request from Client side has been authorized using tokens
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
};

/*{ Create JWT Strategy }*/
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done){
	//payload is the decoded JWT token; done is callback fn
	// See if the user ID in the payload exists in our database
	User.findById(payload.sub, function(err, user){
		if (err) { return done(err, false)};

		if (user) {
			// If it does, call 'done' with that user
			done(null, user); // no error, found the user
		} else {
			// If not, call done without user obj.
			done (null, false); // no error but can't find user
		}
	})
})

// Tell Passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);