$(document).ready(function(){

	getUnjudged();
	

	var currentPageId = '#judge';

	console.log($('.icon-container').css('width'));
	
	$('#judge .profile').on('swipeleft', swipeleftHandler);
	$('#judge .profile').on('swiperight', swiperightHandler );
	
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
		$(currentPageId).slideUp(200);
		$('#map').slideDown(200);
		currentPageId = "#map";
	})

	$('#judge-icon').on('click', function(){
		$(currentPageId).slideUp(200);
		$('#judge').slideDown(200);
	})
	
	console.log('coucou');
	
});


function getUnjudged() {
		

		$.getJSON("/_getVictim?citizen=John", {format: "json"}).done(function(data){
		    
		    citizen = data;
		    console.log(citizen);
		    
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
			$('#profile-container').append(newDiv);
		});
	}


function swipeleftHandler(e) {
	console.log('coucou');
	$('#judge .profile').addClass('rotate-left').delay(700).fadeOut(1);
	getUnjudged();
	
}

function swiperightHandler(e) {
	console.log('coucou');
	$('#judge .profile').addClass('rotate-right').delay(700).fadeOut(1);
	getUnjudged();
}
