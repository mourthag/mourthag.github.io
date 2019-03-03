var score = 0;

var scores = [];

var set = 0;

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
	
	var table = document.getElementsByClassName("scoreboard")[0];
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
}

function throwDart(element) {
	var throwData = getThrowData(element);
	
	
	var table = document.getElementsByClassName("scoreboard")[0];
	
	var row = table.rows[table.rows.length - 1];
	var cell;
	
	if(set == 0) {
		if(activePlayer == 0)  {
			row = table.insertRow(-1);
		}
		cell = row.insertCell(activePlayer);
		cell.className = "scoreboard value";
		
		var lastScore = table.rows[table.rows.length - 2].cells[activePlayer];
		
		
		cell.innerHTML = lastScore.innerHTML;
	}
	else {
		cell = row.cells[activePlayer];
	}
	
	var score = parseInt(cell.innerHTML);
	score -= throwData.value;
	
	if(score <= 0) {
		score = 0;
		cell.innerHTML = score;
		
		alert("Player " + activePlayer + " wins!")
		reset();
		
		return;
	
	}
	
	cell.innerHTML = score;
	
	set++;
	if(set == 3) {
		table.rows[0].cells[activePlayer].className = "scoreboard header";
		
		
		activePlayer = (activePlayer + 1) % numPlayers;
		
		table.rows[0].cells[activePlayer].className = "scoreboard header active";
		
		set = 0;
	}
	
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

var multTexts = ["", "D", "T"];

function getCombinations(score, numDarts, combinations, usedDarts) {
	
	
	var sum = usedDarts.reduce(function(pv, cv) { return pv + cv.value; }, 0);
	
	var newCombinations = combinations;

	if(usedDarts.length == numDarts && score == sum && usedDarts[usedDarts.length - 1].multiplicator == 2) {
		var text = usedDarts.reduce(function(pv, cv) {return pv + " " + multTexts[cv.multiplicator - 1] + cv.text}, "");
		newCombinations.push(text);
	}
	else if(usedDarts.length < numDarts) {
		for(var base = 1; base <= 20; base++) {
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