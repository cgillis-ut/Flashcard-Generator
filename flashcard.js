var inquirer = require("inquirer"),
	fs = require("fs");

//constructor for basic flash card
var BasicCard = function(front, back) {
	this.front = front;
	this.back = back;
}

//constructor for cloze card
//reminder: cloze is the word/phrase that will be hidden
function ClozeCard(text, cloze) {
	this.text = text;
	this.cloze = cloze;
	this.partial = function() {
		//function that hides part of the text to dashes
		this.text.replace(this.cloze, "-------");
	}
}

//asks user to create their card
inquirer.prompt({
	type: "list",
	name: "cards",
	message: "What card would you like to make?",
	choices: ["Basic Card", "Cloze Card"]
}).then(function(data) {
	if (data.choices === "Basic Card") {
		return inquirer.prompt([{
			type: "input",
			name: "front",
			message: "What is the question?"
		}, {
			type: "input",
			name: "back",
			message: "What is the answer you would like to store?"
		}]);
	} else {
		return inquirer.prompt([{
			type: "input",
			name: "text",
			message: "Add your text message"
		}, {
			type: "input",
			name: "cloze",
			message: "Add your cloze message"
		}]);
	}
}).then(function(data) {
	if (data.front) {
		var basic = new BasicCard(data.front, data.back);
		addCard({
			data: basic
		});
	} else {
		// var card = new ClozeCard("I love Sairah", "Sairah")
		var clozetest = new ClozeCard(data.text, data.cloze);
		addCard({
			data: clozetest.text,
			partial: clozetest.cloze
		});
	}
}).catch(function(err) {
	console.log("heres your error: " + err);
});

//turn card info to json
function parsePush(data, partial, add) {
	var arr = JSON.parse(data);
	arr.cards.push(add);
}

//load saved cards in log
var addCard = function(arr) {
	fs.appendFile("test.txt", JSON.stringify(arr), "utf8", function(err) {
		if (err) throw err;
		console.log("Your card has been saved");
	});
};