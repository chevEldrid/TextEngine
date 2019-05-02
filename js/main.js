//Adapted from original concept-snowfall: Dark Depths.
//I'd say spiritual successor...but really just a good ol' fashioned code smash n grab

/*
    =========================================================
    |           Specific Rooms and functions                |
    =========================================================
*/
// ||Starting Room - Your Apartment||

//Apartment (Start) specific functions
/*
	Easy way to do an intro text if you want the player to start somewhere- make it a function of that room
*/
function startGame(term, args) {
	if(promptPos == 0) {
		hijack = true;
		basicEcho('"Welcome test subject 001. I hope your accomodations have been nice. What\'s your name?', term);
		promptPos += 1;
	}
	//loads initial content and displays room information
	else if(promptPos == 1) {
		createCharacter(args);
		basicEcho('"' + args +' is it? Nice to meet you '+args+'. At this point, your simulation shall begin. Or type \'start\' again to reset."', term);
		basicEcho('', term);
		basicEcho(curRoom.desc, term);
		endHijack();
	}
};
//function for action associated with command 'eat cereal'
function eatCereal(term) {
	basicEcho('You take a helping of cereal and consume the cereal saying "Mmmm, cereal"', term);
};

//The Apartment itself
/*
	Typical room. 
	Special actions aside listed with associated functions written above
	(Special consideration for 'start' since it's a special fucntion)
	also items listed that are generated in items.js
	Items are functions. I'm not sure I remember why
	Directions are loaded in system, where you can walk from here

*/
var yourApartment = {
	name:'Your Apartment',
	desc:'A quaint, if sterile, apartment with human necessities like a bed and some cereal',
	items: [oldSword()],
	actions: ['start', 'eat cereal'],
	effects: [startGame, eatCereal],
	directions: ['outside'],
	connections: [corridor],
	enemies: []
};

// ||Room 2 - corridor||
var corridor = {
	name: 'Corridor',
	desc: 'A whitewashed corridor outside of your room with decaying walls and furniture',
	items: [moldySandwich()],
	actions: [],
	effects: [],
	directions: ['inside', 'south'],
	connections: [yourApartment, corridor2],
	enemies:[tentacle()]
};
//unlimited calamari - this is on purpose
function talkPasserby(term) {
	basicEcho('"Woah, who ever knew the Calamari would strike back. Do you want some?"', term);
	player.backpack.push(calamari());
	basicEcho('You recieved CALAMARI', term);
}

// ||Room 3 - Down the Street||
var corridor2 = {
	name: 'Ellis Ave South',
	desc: 'Where a proud and noble fast foot restaurant once stood-now only charred bricks remain. The Oktopi care not for fillet o\' fish. A passerby gawks.',
	items: [],
	actions:['talk to passerby'],
	effects:[talkPasserby],
	directions:['north'],
	connections:[corridor],
	enemies: [tentacle()]
};

/*
    =========================================================
    |                  Actual Terminal                      |
    =========================================================
*/
//Let us begin

jQuery(document).ready(function($) {
	//GAME INITIALIZERS
	//loads starting room
    loadRoom(yourApartment);
    //loadRoom(cathedral);
	//Creates a generic character
    createTemplateCharacter();
    //createKCodeCharacter();
	//loads room connections
	loadRoomConnections();
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = "https://github.com/chevEldrid/chevEldrid.github.io/blob/master/js/main.js";
    } else {
		//this holds the interpreter function...where we figure out what to do with the text
		$('#term').terminal(function(input) {
			//"If you're currently not dead..."
			if(player.health > 0) {
				//"If you are currently not in the middle of doing something else..."
				if(!hijack) {
					//TO PUT SOME SPACE IN THE TERMINAL AND BREAK IT UP A LITTLE
					this.echo(' ');
					//calls parsing function
					//literally no idea why I have to do this...by this I mean the saving the extras as args
					var args = parseInput(input);
					var known = false;
					for(i = 0; i < actions.length; i++) {
						if(command.toUpperCase() === actions[i].toUpperCase()) {
							known = true;
							effects[i](this, args);
							//storing previous command for potential hijack
							prevAction = effects[i];
							break;
						}
					}
					if(!known) {
						this.echo('unknown command, if you\'re stuck, type "help" for options!', {keepWords: true});
					}
				}
				else {
					prevAction(this, input);
				}
			}
			else {
				this.echo('Well, you\'re dead. That kinda blows. Press [F5] to try again!', {keepWords: true});
			}
		}, {
		//this is the second: descriptors
        greetings: 'Welcome to the Testing Room! Type "start" to begin!',
        prompt: '> '
    });
    }
});

