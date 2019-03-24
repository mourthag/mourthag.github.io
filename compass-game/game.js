var countries;
var userPosition;

var currentDirection;
var currentTarget;

var guessedDirection;

window.onload =
    function() {

        window.addEventListener("deviceorientationabsolute", handleOrientation);

        $.get('https://restcountries.eu/rest/v2/all?fields=name;latlng', function(data, status) {
            countries = data;
            nextTarget();
        });
        
        if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    userPosition = position;
                    document.getElementById("location").innerHTML = "<p> Your location: " + position.coords.latitude.toFixed(2) + " " + position.coords.longitude.toFixed(2) + "</p>";
            });
       }
        else {
            alert("Can't find current position. \n Please enable geolocation in your browser!");
        }

        
    
    }

function quitGuessScreen() {
    document.getElementById("resultOverlay").style.display = "none";
    nextTarget();
}

function guess() {

    document.getElementById("resultOverlay").style.display = "block";
    guessedDirection = currentDirection;
    
    var angle = angleFromCoordinate(userPosition.coords.latitude, userPosition.coords.longitude, 
        currentTarget.latlng[0], currentTarget.latlng[1]);

    var won = Math.abs(angle-guessedDirection) < 10;
    document.getElementById("resultHeader").innerHTML = won ? "You win!" : "You loose!"; 
    document.getElementById("resultGuessed").innerHTML = guessedDirection.toFixed(1);
    document.getElementById("resultCorrect").innerHTML = angle.toFixed(1);
}

function handleOrientation(event) {
    currentDirection = (360 - event.alpha);
    document.getElementById("compassDirection").innerHTML =  currentDirection.toFixed(1);
    var compassDisc = document.getElementById("compassDisc");
    compassDisc.style.webkitTransform = "rotate("+ event.alpha +"deg)";
    compassDisc.style.MozTransform = "rotate("+ event.alpha +"deg)";
    compassDisc.style.transform = "rotate("+ event.alpha +"deg)";

}

function nextTarget()
 {     
    currentTarget = countries[Math.floor(Math.random()*countries.length)];
    document.getElementById("target").innerHTML = "Your target: " + currentTarget.name;

}

//Loxodrome starting angle 
function angleFromCoordinate( lat1, long1, lat2, long2) {

    var dLat = (degreeToRadian(long2) - degreeToRadian(long1));

    var phi2 = Math.log( Math.tan(Math.PI/4 + degreeToRadian(lat2)/2));
    var phi1 = Math.log(Math.tan(Math.PI/4 + degreeToRadian(lat1)/2))

    var angle = radianToDegree(Math.atan(dLat/(phi2 - phi1)));
    if(lat2 < lat1)
        angle = 180 + angle;
    
    return angle < 0 ? 360 + angle : angle;
}

function radianToDegree(num) {
    return num * 180 / Math.PI;
}

function degreeToRadian(num) {
    return num * Math.PI / 180;
}