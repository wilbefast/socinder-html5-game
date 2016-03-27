var center = document.getElementById("center");
var citizen_me = document.getElementById("citizen_me");
var citizen_unknown = document.getElementById("citizen_unknown");
var citizen_friend = document.getElementById("citizen_friend");
var citizen_enemy = document.getElementById("citizen_enemy");
 
var canvas = document.getElementById("map_canvas");
var radius = Math.min(canvas.width,canvas.height) * 0.5;
var radiusOuter = radius * 0.8;		
var drawSize = 64;

var ctx = canvas.getContext("2d");

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function getMap() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);

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
		  
		ctx.drawImage(img, canvas.width * 0.5 -drawSize, canvas.height * 0.5 + radius * myDistanceToNorm-drawSize, drawSize*2, drawSize*2);
	  };
	  img.src = '/images/profilepics/'+localStorage.myName+'.jpg';

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
		  
			var ox = canvas.width * 0.5;
			var oy = canvas.height * 0.5;
			
			imgArray[i].onload = function(){

				var direction = (this.src.hashCode() % 2) ? -1 : 1
				var distance = data.distanceFromNorm[this.id] * radius;
				console.log(data.distanceFromOther[this.id])
				var angle = data.distanceFromOther[this.id] * Math.PI * direction + Math.PI*0.5;
				var x = distance * Math.cos(angle);
				var y = distance * Math.sin(angle);

				ctx.drawImage(this, ox + x - drawSize*0.5, oy + y - drawSize*0.5, drawSize, drawSize);
		};
		imgArray[i].id = name;
		imgArray[i] .src = "/images/profilepics/"+name+".jpg";
		i++;

			
	  }
	});
}