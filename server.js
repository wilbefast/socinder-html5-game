// ----------------------------------------------------------------------------
// GAME STATE
// ----------------------------------------------------------------------------

function Concept(name) {
	this.name = name;
}

var concepts = [
	new Concept("Cats"),
	new Concept("Chainsaws"),
	new Concept("Underpants"),
	new Concept("Nazis"),
	new Concept("Robot party"),
	new Concept("Autocracy"),
	new Concept("Anarchy"),
	new Concept("Peanut allergies"),
	new Concept("Golfing"),
	new Concept("Socks"),
	new Concept("Blowdarts"),
	new Concept("Apathy"),
	new Concept("Cranes"),
	new Concept("Trains"),
	new Concept("Donald Trump")
];

function Citizen(name) {
	this.name = name;
	this.opinions = {};
	return this;
}

var citizens = [
	new Citizen("Bob"),
	new Citizen("Frank"),
	new Citizen("John")
];

for(var i in citizens) {
	for(var j in concepts) {
		var citizen = citizens[i]
		var concept = concepts[j];
		citizen.opinions[concept.name] = Math.floor(Math.random() * 4)
	}
}

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
	SERVER_URL = "http://socinder-dev.eu-west-1.elasticbeanstalk.com"
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

var login = require('connect-ensure-login');

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

var users = {};

var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: SERVER_URL + "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, next) {
  	var user = users[profile.id];
  	if(!user) {
  		user = {
  			id : profile.id,
  			displayName : profile.displayName
  		}
  		users[profile.id] = user;
  	}
    next(null, user);
  }
));

passport.serializeUser(function(user, next) {
  next(null, user.id);
});

passport.deserializeUser(function(id, next) {
  next(null, users[id]);
});

// ------------------------------------
// HTTP
// ------------------------------------

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on port 3000');
});

app.get('/login', passport.authenticate('facebook'));

app.get('/prout',
  login.ensureLoggedIn(),
  function(req, res){
    res.send("HELLO" + req.user.id);
	}
);

app.get('/game/_citizens',
	function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(citizens));
});

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/prout');
  });