//Adapted from original concept-snowfall: Dark Depths.
//I'd say spiritual successor...but really just a good ol' fashioned code smash n grab
/*
    =========================================================
    |      			   System Variables      		        |
    =========================================================
*/
//actions for current position, combination of room and sys
var actions = sysActions;
//effects for current position, combination of room and sys
var effects = sysEffects;
//INPUT VARIABLES
var command = "";
var arguments = "";
//A way to have multi-command prompts with game elements or whatnot
//Flag to switch from primary prompt behavior
var hijack = false;
//the previous action performed in the prompt
var prevAction = null;
//for multi-level interactions, a way to keep track of your place
var promptPos = 0;
//player representation
var player = null;
//current room of player
var curRoom = null;
//current scope of player
var scope = 'global'; //can be 'global' or 'shop'

//NOT A GOOD SOLUTION!! FIND A BETTER ONE!
var curShopWares = [];

/*
    =========================================================
    |    			  Background Functions    		        |
    =========================================================
*/
/*
	PURPOSE: Load the currently available actions and effects
	SIDE EFFECTS: changes the actions and effects variables to reflect current position of player
*/ 
function loadRoom(room) {
    var tempActions = [];
    var tempEffects = [];
    for (i = 0; i < sysActions.length; i++) {
        tempActions.push(sysActions[i]);
    }
    for (i = 0; i < room.actions.length; i++) {
        tempActions.push(room.actions[i]);
    }
    actions = tempActions;

    for (i = 0; i < sysEffects.length; i++) {
        tempEffects.push(sysEffects[i]);
    }
    for (i = 0; i < room.effects.length; i++) {
        tempEffects.push(room.effects[i]);
    }
    effects = tempEffects;
    
    curRoom = room;
};
//basic parsing function
/*
	PURPOSE: Parses the input of the user into commands and arguments the program can understand
	SIDE EFFECTS: changes the value of @Command to current inputted command
	RETURNS: The extra arguments inputted after command
*/
function parseInput(input) {
	var inputs = input.split(" ");
	command = inputs[0];
	inputs.shift();
	arguments = inputs;
	var known = false;
	var availActions = actions;
	//new scope code - change which functions we're looking at depending on the scope
	if(scope === 'shop') {
		availActions = shopActions
	}
	//
	for(i = 0; i < (arguments.length + 1) && !known; i++) {
		for(j = 0; j < availActions.length; j++) {
			if(command.toUpperCase() === availActions[j].toUpperCase()) {
				known = true;
			}
		}
		if(!known) {
			command = command + " " + arguments[0];
			arguments.shift();
		}
	}
	return arguments.join(" ");
};

/*
	PURPOSE: Cut down on the needless functions that just print to term, given text and term. Prints text to term
*/
function basicEcho(text, term) {
	term.echo(text, {keepWords: true});
};
/*
	PURPOSE: Sets all variables that effect prompt hijacks back to baseline
	SIDE EFFECTS: sets hijack to false and resets promptPos
*/
function endHijack() {
	hijack = false;
	promptPos = 0;
};

/*
    =========================================================
    |             Actual Terminal and Start State           |
    =========================================================
*/
//Let us begin

jQuery(document).ready(function($) {
	//GAME INITIALIZERS
	//loads starting room
    loadRoom(corridor2);
    //loadRoom(cathedral);
	//Creates a generic character
    player = createTemplateCharacter();
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
				var availActions = actions;
				var availEffects = effects;
				if(scope === 'shop') {
					availActions = shopActions;
					availEffects = shopEffects;
				}
				if(!hijack) {
					//TO PUT SOME SPACE IN THE TERMINAL AND BREAK IT UP A LITTLE
					this.echo(' ');
					//calls parsing function
					var args = parseInput(input);
					var known = false;
					for(i = 0; i < availActions.length; i++) {
						if(command.toUpperCase() === availActions[i].toUpperCase()) {
							known = true;
							prevAction = availEffects[i];
							//this.echo('previous action is: ' + actions[i]);
							availEffects[i](this, args);
							//storing previous command for potential hijack
							break;
						}
					}
					if(!known) {
						this.echo('unknown command, if you\'re stuck, type "help" for options!', {keepWords: true});
					}
				}
				else {
					//this.echo('triggered');
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

