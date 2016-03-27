
var currentQuestion = 0;
var questions = [];
var currentCitizen; 
var currentCitizenName ="";
var currentPageId;


$(document).ready(function(){

	for (i = 0; i<15 ; i++) {
		questions.push('question'+i);
	}

	// hide everything by default
	
	$(".page").hide();

	// Get a name from the server if we don't have one
	var query = (localStorage.myName && localStorage.gameId) 
		? "?citizen=" + localStorage.myName + "&gameId=" + localStorage.gameId
		: "";
	$.getJSON("/_joinGame" + query, {format: "json"}).done(function(data){
		if(data.error) {
			console.error("Failed to join the game", data.error);
		}
		else {
			localStorage.setItem('myName', data.yourName);
			localStorage.setItem('gameId', data.gameId);

			$(".yourName").text(data.yourName);

			if(data.youAreANewbie) {
				currentPageId = '#setup-account';
				localStorage.setItem('IAmANewbie', true);
			}
			else {
				currentPageId = '#map';
				localStorage.setItem('IAmANewbie', false);
			}

			getMap();
			getUnjudged();
			$(currentPageId).show();
		}
	});

	//$('#judge .profile').on('swipeleft', swipeleftHandler);
	//$('#judge .profile').on('swiperight', swiperightHandler);
	
	$('.decision').on('touchstart', function(){
		$(this).css(
			'transform', 'scale(0.8)'
		);
	});

	$('.decision').on('touchend', function(){
		$(this).css(
			'transform', 'scale(1)'
		);
	});
	
	$('#dislike').on('touchend', function(){
		swipeleftHandler();
	});
	
	$('#like').on('touchend', function(){
		swiperightHandler();
	});

	$('#map-icon').on('click', function(){
		if(!localStorage.IAmANewbie) {
			setPage("#map");
		}
	})

	$('#judge-icon').on('click', function(){
		if(!localStorage.IAmANewbie) {
			setPage("#judge");
		}
	})
	
	$('.answers .icon-container').on('click', nextQuestion);

	console.log('coucou');

	$('#question').innerHTML = questions[currentQuestion];

});


function judge(answer, judgedName) {

		$.getJSON("/_doJudge?citizen=" + localStorage.myName + '&otherCitizen=' + judgedName + '&judgement=' + answer, {format: "json"}).done(function(data){})

}

var lock_page_transition = false;
function setPage(newPageId) {
	if(currentPageId === newPageId) {
		return;
	}
	if(lock_page_transition) {
		return;
	}
	lock_page_transition = true;
	var $previousPage = $(currentPageId);
	var $newPage = $(newPageId);
	$previousPage.slideUp(200);
	$newPage.slideDown(200, function() { 
		$previousPage.hide();
		lock_page_transition = false; 
		currentPageId = newPageId;
	});
}

function getUnjudged() {
		
		$.getJSON("/_getVictim?citizen=" + localStorage.myName, {format: "json"}).done(function(data){
		    
		    currentCitizen = data;
		    currentCitizenName = data.name;
		    citizen = data;
		    console.log(currentCitizen);
		    
			newDiv = '<div class="profile untouched">' +
							'<img src="images/profilepics/profile.jpg" class="profile-pic">' +
								'<div class="infos">' +
									'<h1 class="name">'+ citizen.name + '</h1>' +
										'<div class="opinion">' +
											'<div class="icon-container opinion1">' +
												'<img src="images/icons/icon.png">' +
											'</div>' +
											'<div class="icon-container opinion2">' +
												'<img src="images/icons/icon.png">' +
											'</div>' +
											'<div class="icon-container opinion3">' +
												'<img src="images/icons/icon.png">' +
											'</div>' +
										'</div>' +
									'</div>' +
								'</div>';
			$('#profile-container').append(newDiv).on('swiperight', swiperightHandler).on('swipeleft', swipeleftHandler);
		});
	}

function nextQuestion(e) {

	$('#question').innerHTML = questions[currentQuestion];
	console.log(questions[currentQuestion]);
	currentQuestion++;
	
}

function swipeleftHandler(e) {
	console.log('coucou');
	$('#judge .profile').addClass('rotate-left').delay(700).fadeOut(1);
	getUnjudged();
	judge('negative', currentCitizen.name);
	
}

function swiperightHandler(e) {
	console.log('coucou');
	$('#judge .profile').addClass('rotate-right').delay(700).fadeOut(1);
	getUnjudged();
	judge('positive', currentCitizen.name);
}
