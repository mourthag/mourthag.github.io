var score = 0;

var scores = [];

var set = 0;
var setPoints = 0;

var numPlayers = 4;
var activePlayer = 0;


window.onload = function() {
	
	reset();
	
	
	var anchors = document.getElementsByClassName('score');    
		
	for(var i = 0; i < anchors.length; i++) {
		var anchor = anchors[i];
		anchor.onclick = function() { throwDart(this)};
	}
}

function reset() {
	score = 0;
	activePlayer = 0;
	set = 0;
	
	var table = document.getElementById("scoreboard");
	table.innerHTML = "";
	var headerRow = table.insertRow(-1);
	
	for( var i = 0; i < numPlayers; i++) {
		var cell = document.createElement('th');
		cell.innerHTML = "Player " + (i+1);
		cell.className = "scoreboard header";
		headerRow.appendChild(cell);
	}
	
	headerRow.cells[0].className = "scoreboard header active";
	
	var scoreRow = table.insertRow(-1);
	for( var i = 0; i < numPlayers; i++) {
		var cell = scoreRow.insertCell(-1);
		cell.innerHTML = 501;
		cell.className = "scoreboard value";
		scores.push(501);
	}
	var newRow = table.insertRow(-1);
	var newCell = newRow.insertCell(-1);
	newCell.innerHTML = 501;
	newCell.className = "scoreboard value";
}

function throwDart(element) {
	var throwData = getThrowData(element);
	
	var table = document.getElementById("scoreboard");
	
	var row = table.rows[table.rows.length - 1];
	var cell = row.cells[activePlayer];
	
	var score = parseInt(cell.innerHTML);
	score -= throwData.value;
	setPoints += throwData.value;
	scores[activePlayer] = score;
	
	if(score <= 0) {
		score = 0;
		cell.innerHTML = score;
		
		alert("Player " + (activePlayer+1) + " wins!")
		reset();
		
		return;
	
	}
	
	cell.innerHTML = score;
	
	set++;
	if(set == 3) {
		table.rows[0].cells[activePlayer].className = "scoreboard header";
		
		
		activePlayer = (activePlayer + 1) % numPlayers;
		
		table.rows[0].cells[activePlayer].className = "scoreboard header active";
		
		if(activePlayer == 0)  {
			row = table.insertRow(-1);
		}
		
		var cell = row.insertCell(activePlayer);
		cell.className = "scoreboard value";
		
		var lastScore = table.rows[table.rows.length - 2].cells[activePlayer];
		
		
		cell.innerHTML = lastScore.innerHTML;
		
		
		set = 0;
		setPoints = 0;
	}
	setCurrentPlayerPanel();
	
}

function setCurrentPlayerPanel() {
	var currentPlayerElements = Array.from(document.getElementsByClassName("currentplayer"));
	currentPlayerElements.forEach(element => {
		element.innerHTML = "Player " + (activePlayer + 1);
		
	});
	
	var dartsLeftElements = Array.from(document.getElementsByClassName("setdartsleft"));
	dartsLeftElements.forEach(element => {
		element.innerHTML = (3 - set);
	});
	
	var pointsThrownElements = Array.from(document.getElementsByClassName("pointsthrown"));
	pointsThrownElements.forEach(element => {
		element.innerHTML = setPoints;
	});
	
	var pointsLeftElements = Array.from(document.getElementsByClassName("pointsleft"));
	pointsLeftElements.forEach(element => {
		element.innerHTML = scores[activePlayer];
	});
	
	
	var possibleFinishers = getPossibleFinishers(scores[activePlayer], 3 - set);
	possibleFinishers.sort(function(a, b){
	// ASC  -> a.length - b.length
	// DESC -> b.length - a.length
	return a.length - b.length;
	});
	var finishersElements = Array.from(document.getElementsByClassName("finishers"));
	finishersElements.forEach(element => {
		element.innerHTML = "";
		for(var i = 0; i < Math.min(3,possibleFinishers.length); i++) {
			element.innerHTML += "<p>" + possibleFinishers[i] + "</p>";
		}
	});
}

function getThrowData(element) {
	var name = element.className;
	
	var val = parseInt(element.innerHTML);
	
	var classes = name.split(" ");
	
	var multiplicator = 1;
	
	if(classes.length > 2) {
		var multiplicatorName = classes[classes.length - 2];
		
		switch(multiplicatorName) {
			case "double":
				multiplicator = 2;
				break;
			case "triple":
				multiplicator = 3;
				break;
		}
	}
	
	var base = val / multiplicator;
	
	
	return {baseValue:base, value:val, multiplicatorFactor:multiplicator};
}

function getPossibleFinishers(score, numDarts) {
	
	return getCombinations(score, numDarts, [], []);
}

var multiplicatorTexts = ["", "D", "T"];

function getCombinations(score, numDarts, combinations, usedDarts) {
	
	
	var sum = usedDarts.reduce(function(pv, cv) { return pv + cv.value; }, 0);
	
	var newCombinations = combinations;

	if(score == sum && usedDarts[usedDarts.length - 1].multiplicator == 2) {
		var text = usedDarts.reduce(function(pv, cv) {return pv + " " + multiplicatorTexts[cv.multiplicator - 1] + cv.text}, "");
		newCombinations.push(text);
	}
	else if(usedDarts.length < numDarts) {
		for(var base = 20; base >= 1; base--) {
			for(var multiplicator = 1; multiplicator <= 3; multiplicator++) {
				
				
				var newDart = {value: base * multiplicator, base:base, multiplicator:multiplicator, text:base.toString(10)};
				usedDarts.push(newDart);
				
				newCombinations = getCombinations(score, numDarts, newCombinations, usedDarts);
				usedDarts.splice(usedDarts.length - 1, 1);
			}
		}
	}
	return newCombinations;
}