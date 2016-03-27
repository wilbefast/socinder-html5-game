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


	ctx.beginPath();
    ctx.arc(canvas.width * 0.5, canvas.height * 0.5, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#00C0CC';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#D6FDFF';
    ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(canvas.width * 0.5, canvas.height * 0.5, radius * 0.05, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#267A7F';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#00C0CC';
    ctx.stroke();
	
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
		  
			
			
			imgArray[i].onload = function(){
			left = left % 2;
			
			ctx.drawImage(this,
			(canvas.width * 0.5) - (drawSize * (-1+left*2)) + (-1+left*2) * (data.distanceFromNorm[this.id] * radius * Math.cos((0.5+data.distanceFromOther[this.id]) * Math.PI)),
			(canvas.height	 * 0.5) + data.distanceFromNorm[this.id] * radius * Math.sin((0.5+data.distanceFromOther[this.id]) * Math.PI),drawSize,drawSize);
			
			left++;
		};
		imgArray[i].id = name;
		imgArray[i] .src = "/images/profilepics/"+name+".jpg";
		i++;
			//ctx.drawImage(citizen_unknown, (canvas.width * 0.5) - (drawSize * (-1+left*2)) + (-1+left*2) * data.distanceFromNorm[name] * radius, radius * Math.sin(data.distanceFromOther[name] * Math.PI),drawSize,drawSize);
			
			
	  }
	});
}