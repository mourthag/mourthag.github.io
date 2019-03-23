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
                    document.body.innerHTML += "<p>" + position.coords.latitude + " " + position.coords.longitude + "</p>";
            });
       }
        else {
            alert("Can't find current position. \n Please enable geolocation in your browser!");
        }

        
    
    }

function guess() {
    guessedDirection = currentDirection;
    
    var angle = angleFromCoordinate(userPosition.coords.latitude, userPosition.coords.longitude, 
        currentTarget.latlng[0], currentTarget.latlng[1]);
    document.body.innerHTML += "<p> You guessed: " + guessedDirection + "</p> <p> Correct was: "  + angle + "</p>";
}

function handleOrientation(event) {
    currentDirection = (360 - event.alpha);
    document.getElementById("compass").innerHTML =  currentDirection;

}

function nextTarget()
 {     
    currentTarget = countries[Math.floor(Math.random()*countries.length)];
    document.body.innerHTML += "<p> Your target: " + currentTarget.name + "</p>";

}

//Loxodrome starting angle 
function angleFromCoordinate( lat1, long1, lat2, long2) {

    var dLat = (degreeToRadian(long2) - degreeToRadian(long1));

    var phi2 = Math.log( Math.tan(Math.PI/4 + degreeToRadian(lat2)/2));
    var phi1 = Math.log(Math.tan(Math.PI/4 + degreeToRadian(lat1)/2))

    var angle = radianToDegree(Math.atan(dLat/(phi2 - phi1)));
    if(lat2 < lat1)
        angle = 180 + angle;
    
    return angle;
}

function radianToDegree(num) {
    return num * 180 / Math.PI;
}

function degreeToRadian(num) {
    return num * Math.PI / 180;
}