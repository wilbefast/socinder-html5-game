// ----------------------------------------------------------------------------
// GAME STATE
// ----------------------------------------------------------------------------

// ------------------------------------
// Game Objects
// ------------------------------------

// ----------------------------------------------------------------------------
// SERVER
// ----------------------------------------------------------------------------

var LOCALHOST = true; // set this to false to use AWS

var FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET;
var SERVER_URL;

if(LOCALHOST) {
	FACEBOOK_APP_ID = 1719505808267776;
	FACEBOOK_APP_SECRET = "40c7610ad84f80ce2df9ad237d609455";
	SERVER_URL = "http://localhost:3000"
}
else {
	FACEBOOK_APP_ID = 1719504328267924;
	FACEBOOK_APP_SECRET = "5a30ef2234b6114fd48d0c7e10d5b98e";
	SERVER_URL = "http://localhost:3000"
}

// ------------------------------------
// Express
// ------------------------------------

var express = require('express'); 
var app = express();
var http = require('http').Server(app);

app.use(express.static("client"));

// ------------------------------------
// Passport
// ------------------------------------

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: SERVER_URL + "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
  	console.log("facebook lol");
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
  }
));

// ------------------------------------
// HTTP
// ------------------------------------

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on port 3000');
});

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback', function(req, res) {
  res.send('hello world');
  console.log("facebook lolz");
});