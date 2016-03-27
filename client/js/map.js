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
	  
	  var img = new Image();
	  
	  console.log("img:", img);
	  img.onload = function(){
		  
		ctx.drawImage(img, canvas.width * 0.5 -drawSize, canvas.height * 0.5 + radius * myDistanceToNorm-drawSize, drawSize, drawSize);
	  };
	  img.src = '/images/profilepics/'+localStorage.myName+'.jpg';
	  
	  var left = Math.random() > 0.5 ? 1 : 0;
	  
	  var imgArray = [];
	  var i = 0;
	  
	  for(var name in data.distanceFromOther) {
			imgArray[i] = new Image();
			
		  
			/*	if (data.Judgement == "positive")
			{
				imgArray[i].style.border='2px solid #8EFF58';
			}
			else if (data.Judgement == "negative")
			{
				style.border='2px solid #8EFF58';
			}
			else 
				break;*/
		  
			left = left % 2;
			
			imgArray[i].onload = function(){

			
			ctx.drawImage(this,
			(canvas.width * 0.5) - (drawSize * (-1+left*2)) + (-1+left*2) * (data.distanceFromNorm[name] * radius * Math.cos((0.5+data.distanceFromOther[name]) * Math.PI)),
			(canvas.height	 * 0.5) + data.distanceFromNorm[name] * radius * Math.sin((0.5+data.distanceFromOther[name]) * Math.PI),drawSize,drawSize);
		};
		imgArray[i] .src = "/images/profilepics/"+name+".jpg";
		i++;
			//ctx.drawImage(citizen_unknown, (canvas.width * 0.5) - (drawSize * (-1+left*2)) + (-1+left*2) * data.distanceFromNorm[name] * radius, radius * Math.sin(data.distanceFromOther[name] * Math.PI),drawSize,drawSize);
			
			left++;
	  }
	});
}