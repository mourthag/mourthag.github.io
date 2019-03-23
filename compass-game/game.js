var countries;
var userPosition;
window.onload =
    function() {

        window.addEventListener("deviceorientationabsolute", handleOrientation);

        $.get('https://restcountries.eu/rest/v2/all?fields=name;latlng', function(data, status) {
            countries = data;
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


function handleOrientation(event) {
    document.getElementById("compass").innerHTML =  (360 - event.alpha);

}

function nextTarget()
 {     
    var item = countries[Math.floor(Math.random()*countries.length)];
    document.body.innerHTML += "<p>" + item.name + " " + item.latlng + "</p>";

    var angle = angleFromCoordinate(userPosition.coords.latitude, userPosition.coords.longitude, item.latlng[0], item.latlng[1]);
    document.body.innerHTML += "<p>" + angle + "</p>";
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