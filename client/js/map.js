var center = document.getElementById("center");
var citizen_me = document.getElementById("citizen_me");
var citizen_unknown = document.getElementById("citizen_unknown");
var citizen_friend = document.getElementById("citizen_friend");
var citizen_enemy = document.getElementById("citizen_enemy");
 
var canvas = document.getElementById("map_canvas");
var radius = Math.min(canvas.width,canvas.height) * 0.5;
var radiusOuter = radius * 0.8;		
var drawSize = 32;

var ctx = canvas.getContext("2d");

function getMap() {
	ctx.drawImage(center, canvas.width * 0.5 -drawSize, canvas.height * 0.5 -drawSize, drawSize, drawSize);
	
	$.getJSON("/_getMap?citizen=" + localStorage.myName, { format: "json" }).done(function( data ){
	 	if(data.error) {
	 		console.error("Failed to get map", data.error);
	 		return;
	 	}

	 	var myDistanceToNorm = data.distanceFromNorm.__me__;
	  
	  ctx.drawImage(citizen_me, canvas.width * 0.5 -drawSize, canvas.height * 0.5 + radius * myDistanceToNorm-drawSize, drawSize, drawSize);

	  console.log(data);
	  console.log("MY DISTANCE FROM SOCIETY NORM", data.distanceFromNorm.__me__);
	  
	  data.distanceFromOther.Bob = 0.5;
	  
	  var left = Math.random() > 0.5 ? 1 : 0;
	  
	  for(var name in data.distanceFromOther) {
			left = left % 2;
			console.log("name", name);
	    console.log("distance from me", data.distanceFromOther[name]);
			console.log("distance from norm", data.distanceFromNorm[name]);
			//ctx.drawImage(citizen_unknown, (canvas.width * 0.5) - (drawSize * (-1+left*2)) + (-1+left*2) * data.distanceFromNorm[name] * radius, radius * Math.sin(data.distanceFromOther[name] * Math.PI),drawSize,drawSize);
			ctx.drawImage(citizen_unknown,
			(canvas.width * 0.5) - (drawSize * (-1+left*2)) + (-1+left*2) * (data.distanceFromNorm[name] * radius * Math.cos((0.5+data.distanceFromOther[name]) * Math.PI)),
			(canvas.height	 * 0.5) + data.distanceFromNorm[name] * radius * Math.sin((0.5+data.distanceFromOther[name]) * Math.PI),drawSize,drawSize);
			left++;
	  }
	});
}