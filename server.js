// ----------------------------------------------------------------------------
// UTILITIES
// ----------------------------------------------------------------------------

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// ----------------------------------------------------------------------------
// GAME STATE
// ----------------------------------------------------------------------------

// ------------------------------------
// Concepts
// ------------------------------------

function Concept(name) {
	this.name = name;
	this.overallJudgement = [ 0, 0, 0, 0 ];
	this.normalisedOverallJudgement = [0, 0, 0, 0 ];
}

Concept.prototype.refreshNormalisedOverallJudgement = function() {
	var best_judgement = null, best_judgement_value = -Infinity;
	var worst_judgement = null, worst_judgement_value = Infinity;
	for(var judgement in this.overallJudgement) {

		var judgement_value = this.overallJudgement[judgement];
		if(judgement_value > best_judgement_value) {
			best_judgement_value = judgement_value;
			best_judgement = judgement
		}
		if(judgement_value < worst_judgement_value) {
			worst_judgement_value = judgement_value;
			worst_judgement = judgement;
		}
	}
	var distance_best_to_worst = best_judgement_value - worst_judgement_value;

	for(var judgement in this.overallJudgement) {
		var judgement_value = this.overallJudgement[judgement];
		this.normalisedOverallJudgement[judgement] = (judgement_value - worst_judgement_value)/distance_best_to_worst;
	} 
}

// ------------------------------------
// Citizens
// ------------------------------------

function Citizen(name) {
	this.name = name;
	this.conceptJudgements = {};
	this.citizenJudgements = {}
	this.byName[name] = this;

	for(var j in concepts) {
		var concept = concepts[j];
		this.setConceptJudgement(concept, Math.floor(Math.random() * 4));
	}

	return this;
}
Citizen.prototype.byName = {}

Citizen.prototype.getRandomNotJudged = function() {
	var randomisedCitizens = [];
	for(var name in Citizen.prototype.byName) {
		if(name !== this.name && !this.citizenJudgements[name]) {
			randomisedCitizens.push(Citizen.prototype.byName[name]);
		}
	}
	if(randomisedCitizens.length > 0) {
		shuffle(randomisedCitizens);
		return randomisedCitizens[0];
	}
	else {
		console.log("There is not left to judge");
		return null;
	}
}

Citizen.prototype.getRandomConcepts = function(number_to_draw) {
	var randomisedConcepts = [];
	for(var conceptName in this.conceptJudgements) {
		randomisedConcepts.push({
			name : conceptName,
			judgment : this.conceptJudgements[conceptName]
		});
	}
	shuffle(randomisedConcepts);
	return randomisedConcepts.slice(0, Math.min(number_to_draw, randomisedConcepts.length));
}

Citizen.prototype.setConceptJudgement = function(concept, value) {
	if(this.conceptJudgements[concept.name]) {
		concept.overallJudgement[value]--;
	}
	this.conceptJudgements[concept.name] = value;
	concept.overallJudgement[value]++;
	concept.refreshNormalisedOverallJudgement();
}

Citizen.prototype.getConceptJudgement = function(concept) {
	return this.conceptJudgements[concept.name];
}

Citizen.prototype.judgeCitizen = function(targetCitizen, judgement) {
	// already judged this target?
	if(this.citizenJudgements[targetCitizen]) {
		console.log("You're not allowed to judge multiple times!")
	}
	this.citizenJudgements[targetCitizen] = judgement;
	var conceptValueChange = (judgement === "positive") ? 1 : -1;
	for(var i in concepts) {
		var concept = concepts[i];
		var targetCitizenConceptJudgement = targetCitizen.getConceptJudgement(concept);
		if(targetCitizenConceptJudgement) {
			concept.overallJudgement[targetCitizenConceptJudgement] += conceptValueChange;
			concept.refreshNormalisedOverallJudgement();
		}
	}
}

Citizen.prototype.getDistanceFromOther = function(other) {
	var max_distance = concepts.length * 4;
	var distance = 0;
	for(var i in concepts) {
		var my_opinion = this.getConceptJudgement(concepts[i]);
		var their_opinion = other.getConceptJudgement(concepts[i]);
		distance += Math.abs(my_opinion - their_opinion);
	}
	return distance / max_distance;
};

Citizen.prototype.getDistanceFromNorm = function() {
	var total_score = 0;
	var total_concepts = 0;
	for(var i in concepts) {
		var concept = concepts[i];
		if(this.conceptJudgements[concept.name]) {
			var my_judgment = this.getConceptJudgement(concept);
			total_score += concept.normalisedOverallJudgement[my_judgment];
			total_concepts++;
		}
	}
	if(total_concepts <= 0) {
		return 0;
	}
	total_score /= total_concepts;
	return total_score;
};

// ------------------------------------
// Initialisation
// ------------------------------------

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

new Citizen("Bob");
new Citizen("Frank");
new Citizen("John");

// ----------------------------------------------------------------------------
// SERVER
// ----------------------------------------------------------------------------

var LOCALHOST = false; // set this to false to use AWS

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

var responseRelativeToCitizen = function(req, res, f) {
		var message = {};
  	res.setHeader('Content-Type', 'application/json');
    var myName = req.query.citizen;
    if(myName) {
    	var citizen = Citizen.prototype.byName[myName];
    	if(citizen) {
    		f(citizen, message)
    	}
    	else {
    		message.error = "No citizen called '" + myName + "'";
    	}
    }
    else {
    	message.error = "Missing 'citizen' query parameter";
    }
    res.send(JSON.stringify(message));
}


app.get('/game/judgement/_getVictim',
	function(req, res) {
		responseRelativeToCitizen(req, res, function(citizen, message) {
			var victim = citizen.getRandomNotJudged();
			if(victim) {
				message.name = victim.name;
				message.concepts = victim.getRandomConcepts(3);
			}
			else {
				message.error = "There is nobody left for '" + citizen.name + "' to judge";
			}
		});
	}
);

app.get('/game/_map',
	function(req, res) {
		responseRelativeToCitizen(req, res, function(citizen, message) {
  		result.distanceFromNorm = {
				__me__ : citizen.getDistanceFromNorm()
  		};
  		result.distanceFromOther = {};
  		for(var other_name in Citizen.prototype.byName) {
  			if(other_name !== myName) {
  				var other_citizen = Citizen.prototype.byName[other_name];    				
    			result.distanceFromOther[other_name] = citizen.getDistanceFromOther(other_citizen);
    			result.distanceFromNorm[other_name] = other_citizen.getDistanceFromNorm();
  			}
  		}
		});
	}
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/prout');
  });