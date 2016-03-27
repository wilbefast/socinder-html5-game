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

var concepts;

function getConceptByName(name) {
	for(var i in concepts) {
		if(concepts[i].name === name) {
			return concepts[i];
		}
	}
}

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

	return this;
}
Citizen.prototype.byName = {}

Citizen.prototype.isNewbie = function() {
	return (Object.keys(this.conceptJudgements).length < concepts.length);
}

Citizen.prototype.randomConceptJudgements = function() {
	for(var j in concepts) {
		var concept = concepts[j];
		this.setConceptJudgement(concept, Math.floor(Math.random() * 4));
	}
}

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
	// cannot judge yourself
	if(this.name === targetCitizen.name) {
		return "'" + this.name + "' cannot self-judge";
	}
	// already judged this target?
	if(this.citizenJudgements[targetCitizen]) {
		return "'" + this.name + "' has already judged '" + targetCitizen.name 
		+ "' with judgement '" + this.citizenJudgements[targetCitizen] + "'";
	}
	// valid judgement?
	if(judgement !== "positive" && judgement !== "negative") {
		return "Invalid judgement '" + judgement + "'";
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

GAME_ID = new Date().getTime();

var concepts = [
	new Concept("money"),
	new Concept("justice"),
	new Concept("war"),
	new Concept("migration"),
	new Concept("religion"),
	new Concept("tradition"),
	new Concept("surveillance"),
	new Concept("authority"),
	new Concept("competitive"),
	new Concept("nature"),
	new Concept("adaptability"),
	new Concept("carrot"),
	new Concept("fashion"),
	new Concept("hobby"),
	new Concept("dog")];

 userName = ["Aaron","Abdallah","Abril","Aby","Adam","Ahmed","Aiden","Akira","Alexandre","Ali","Alice","Amelia","Andrei","Anna","Arthur","Ava","Ben","Camila","Catherine","Celine",
			 "Charlotte","Christophe","Daniel","David","Diego","Dylan","Elodie","Elsa","Emilie","Emma","Enzo","Filip","Finn","Francesco","Gabriel","Harry","Haruto","Hina","Hiroshi","Hiroto",
			 "Ines","Isabela","Jack","Jacob","Jean","Jeremy","Jessica","Joshua","Juan","Julie","Julien","Kayla","Kevin","Kristin","Lara","Laura","Lea","Leila","Lena","Leon",
			 "Liam","Lily","Lisa","Lucas","Lucie","Luisa","Luke","Madison","Mamadou","Manon","Marie","Marine","Matheo","Maxime","Mehdi","Mia","Miguel","Mohamed","Nathan","Nicolas",
			 "Noa","Olivia","Oscar","Paul","Paula","Pierre","Ren","Riley","Santiago","Sara","Sebastian","Sophie","Stefan","Thomas","Wei","William","Yuna","Yusuf","Zoe","William",
			 "Clement","Mathieu","Maxence","Simon","Charlie","Guillaume"];
shuffle(userName);

userName.nextIndex = 0;
for(var i = 0; i < 10; i++) {
	var bot = new Citizen(userName[userName.nextIndex++]);
	bot.randomConceptJudgements();
}

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

app.get('/_joinGame',
	function(req, res) {
		var citizenName = req.query.citizen;
		var gameId = req.query.gameId;
		var message = { 
			gameId : GAME_ID 
		};
		var citizen = Citizen.prototype.byName[citizenName];
		var isValidCitizen = (citizen !== undefined);
		var isGameIdValid = (gameId == GAME_ID);

		if(!isValidCitizen || !isGameIdValid) {
			if(userName.nextIndex < userName.length) {
				var newbie = new Citizen(userName[userName.nextIndex++]);
				message.error = false;
				message.yourName = newbie.name;
				message.youAreANewbie = true;
			}
			else {
				message.error = "All the usernames have already been used"
			}
		}
		else {
			console.log("welcome back", citizenName);
			message.yourName = citizenName;
			message.youAreANewbie = citizen.isNewbie();
		}
		res.send(JSON.stringify(message));
	}
);

app.get('/_getVictim',
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

app.get('/_doJudge',
	function(req, res) {
		responseRelativeToCitizen(req, res, function(citizen, message) {
	    var otherName = req.query.otherCitizen;
	    if(otherName) {
	    	var otherCitizen = Citizen.prototype.byName[otherName];
	    	if(otherCitizen) {
	    		var judgement = req.query.judgement;
	    		if(judgement) {
    				message.error = citizen.judgeCitizen(otherCitizen, judgement) || false;
	    		}
	    		else {	    			
	    			message.error = "Missing 'judgement' query parameter";
	    		}
	    	}
	    	else {
	    		message.error = "No citizen called '" + otherName + "'";
	    	}
	    }
	    else {
	    	message.error = "Missing 'citizen' query parameter";
	    }
		});
	}
);

app.get('/_getMap',
	function(req, res) {
		responseRelativeToCitizen(req, res, function(citizen, message) {
  		message.distanceFromNorm = {
				__me__ : citizen.getDistanceFromNorm()
  		};
  		message.distanceFromOther = {};
  		message.judgement = {};
  		for(var other_name in Citizen.prototype.byName) {
  			if(other_name !== citizen.name) {
  				var other_citizen = Citizen.prototype.byName[other_name];    				
    			message.distanceFromOther[other_name] = citizen.getDistanceFromOther(other_citizen);
    			message.distanceFromNorm[other_name] = other_citizen.getDistanceFromNorm();
    			var judgement = citizen.citizenJudgements[other_name];
    			if(judgement) {
    				message.judgement[other_name] = judgement;
    			}
  			}
  		}
		});
	}
);

app.get('/_doJudgeConcept',
	function(req, res) {
		responseRelativeToCitizen(req, res, function(citizen, message) {
			var conceptName = req.query.conceptName;
			var conceptValue = req.query.conceptValue;
			if(!conceptName) {
				message.error = "Missing 'conceptName' query parameter";
			}
			else if(!conceptValue) {
				message.error = "Missing 'conceptValue' query parameter";
			}
			else if(conceptValue != 0 && conceptValue != 1 && conceptValue != 2 && conceptValue != 3) {
				message.error = "Invalid 'conceptValue' query parameter, should be 0, 1, 2 or 3";
			}
			else {
				var concept = getConceptByName(conceptName);
				if(!concept) {
					message.error = "There is no concept called '" + conceptName + "'";
				}
				else if(citizenJudgements[conceptName]) {
					message.error = "'" + citizen.name + "' has already judged'" + conceptName + "'";
				}
				else {
					citizen.setConceptJudgement(concept, conceptValue);
					message.youAreANewbie = citizen.isNewbie();
				}
			}
		});
	}
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
