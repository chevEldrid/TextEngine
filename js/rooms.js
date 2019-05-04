/*
    ====================================================
    |       Class Necessary for Object Creation      |
    ====================================================
*/

/*
    @name:String        		name of Room
    @desc:String        		description of Room
    @items:Array<Item>  		items in room
    @actions:Array<String> 		list of available actions in room
	@effects:Array<function> 	actions available
    @enemies:Array<Enemy>		list of enemies in the room
    ---navigation---
    @directions:Array<String>   Directions from room to travel
    @connections:Array<Room>    Rooms connected to directions
*/
class Room {
    constructor(name, desc, items, actions, effects, enemies, directions, connections) {
        this.name = name;
        this.desc = desc;
        this.items = items;
        this.actions = actions;
		this.effects = effects;
        this.enemies = enemies;
        this.directions = directions;
        this.connections = connections
    }
};

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
    PURPOSE: To connect rooms at runtime and not throw super errors
*/
function loadRoomConnections() {
    yourApartment.connections = [corridor];
	corridor.connections = [yourApartment, corridor2];
	corridor2.connections = [corridor];
}