//system.js - functions relating to player actions, player inputs, and background content generation
/*
    =========================================================
    |     System Actions - commands and functions           |
    =========================================================
*/
//list of available commands on a system level
var sysActions = ['survey', 'help', 'about', 'stats', 'inspect', 'use', 'drop', 'go', 'equip', 'attack'];
//parallel array for running the commands of the above list
var sysEffects = [survey, help, about, stats, inspect, use, drop, go, equip, attack];
//the actual code for the effects
/*
	PURPOSE: Repeats the description of the room, as if the Player is surveying it.
*/
function survey(term) {
	term.echo(curRoom.desc, {keepWords: true});
	//add code to show all available specific room actions and items
	inspect(term,"");
	//specific room actions
	term.echo("Special actions here include: ", {keepWords: true});
	for(i = 0; i < curRoom.actions.length; i++) {
        //just for the sake of flowy-ness - prevents 'Start' from being listed as a valid command going forward
		if(curRoom.actions[i] != 'start') {
			term.echo(curRoom.actions[i], {keepWords: true});
		}
	}
};
/*
	PURPOSE: To list all available commands in the current room to the Player
*/
function help(term) {
    term.echo('possible commands at this point are: ', {keepWords: true});
    for(i = 0; i < actions.length; i++) {
        //just for the sake of flowy-ness - prevents 'Start' from being listed as a valid command going forward
		if(actions[i] != 'start') {
			term.echo(actions[i], {keepWords: true});
		}
    }
    term.echo('For further assistance please refer to included documentation or press buttons until something happens.', {keepWords: true});
};
/*
	PURPOSE: Prints some simple "About the Game" information
*/
function about(term) {
    term.echo('Welcome to "Testing Chamber", A Text-Adventure surrounding nothing...', {keepWords: true});
    term.echo('VER: 1.1  DATE: May 2019', {keepWords: true});
};
/*
	PURPOSE: Lists the current player statistics relevant to advancement
*/
function stats(term) {
	term.echo('CURRENT STATS FOR: ' + player.name +'\n SANITY: ' + player.sanity + '\n HEALTH: ' + player.health + '\n BACKPACK CONTAINS: ', {keepWords: true});
	if(player.backpack.length < 1) {
		term.echo('  nothing', {keepWords: true});
	}
	else {
		for(i = 0; i < player.backpack.length; i++) {
			term.echo('  ' + player.backpack[i].name);
		}
	}
	term.echo('------');
	if(player.equip){
		term.echo(player.equip.name + ' is currently equipped');
    }
    else{
        basicEcho('You currently have no weapon equipped', term);
    }
};
/*
	Purpose: general tutor for items in an array using 3-case system, returns index of found thing
	SIDE EFFECTS: Prints failure to find cases to console
	RETURNS: index of found thing, -1 if thing not found, -2 if either first two cases trigger
	NOTES: named is an optional parameter so tutor can work with arrays of objects with names or arrays of strings
*/
function tutor(term, args, things, r1, r2, named = true) {
	var ls = things
	if(named) {
		ls = things.map(x => x.name);
	}
	if(ls.length < 1) {
		basicEcho(r1, term);
		return -2;
	}
	//Case 2: no additional arguements supplied with command
	else if(args === '') {
		basicEcho(r2, term);
		for(i = 0; i < ls.length; i++) {
			basicEcho(ls[i], term);
		}
		return -2;
	}
	else {
		for(i = 0; i < ls.length; i++) {
			var thingName = ls[i];
			if(thingName.toUpperCase() === args.toUpperCase()) {
				return i;
			}
		}
		return -1;
	}
};

/*
	PURPOSE: Allows player to inspect items in the room and if possible, add them to Player's collection
	SIDE EFFECTS: Adding items to Player's backpack
*/
function inspect(term, args) {
	var things = curRoom.items;
	var r1 = "There\'s nothing worth investigating here";
	var r2 = 'You see: ';
	var index = tutor(term, args, things, r1, r2);
	if(index > -1) {
		basicEcho(things[index].desc, term);
		if(things[index].takeable) {
			basicEcho('You put the ' + things[index].name + ' into your bag for later.', term);
			player.backpack.push(things[index]);
			things.splice(index, 1);
		}
	}
	else if(index > -2) {
		basicEcho(args + ' isn\'t in this room', term);
	}
};
/*
	PURPOSE: Use an item in your backpack
	SIDE EFFECTS: Whatever the item does, durability will drop by one and if it hits zero-item will be removed
*/
function use(term, args) {
	var things = player.backpack;
	var r1 = "There\'s nothing in your backpack";
	var r2 = "You rummage around and find: ";
	var index = tutor(term, args, things, r1, r2);
	if(index > -1) {
		var curItem = things[index];
        if(!curItem.isWeapon) {
            if(curItem.cond()) {
                curItem.use(term);
                curItem.durability--;
                if(curItem.durability <= 0){
                    player.backpack.splice(index, 1);
                }
            }
            else{
                basicEcho('That\'s not useful right now!', term);
            }
        }
        else {
            basicEcho('That\'s a weapon, not a usable item!', term);
        }
	}
	else if(index > -2) {
        basicEcho('You don\'t have any ' + args + ' in your backpack', term);
    }
};
/*
    PURPOSE: removes the first instance of a particular item from your backpack
*/
function drop(term, args) {
	var things = player.backpack;
	var r1 = 'There\'s nothing in your backpack to remove';
	var r2 = 'You rummage around and find: ';
	var index = tutor(term, args, things, r1, r2);
	if(index > -1) {
		var curItem = things[index];
        things.splice(index, 1);
        //attempt to drop item into room you're in
        curRoom.items.push(curItem)
        basicEcho('You dropped '+curItem.name+' from your backpack, hope you don\'t need it!', term);
	}
	else if(index > -2) {
		basicEcho('You don\'t have any ' +args+ ' in your backpack to drop', term);
	}
};

/*
    PURPOSE: Allows player to traverse between rooms, based on unique array of connections from curRoom
*/
function go(term, args) {
    var options = curRoom.directions;
    var places = curRoom.connections;
    var r1 = "It would appear...there isn\'t anywhere to go from here";
    var r2 = "You can go: ";
    var index = tutor(term, args, options, r1, r2, false);
    if(index > -1) {
    	var place = places[index];
    	loadRoom(place);
    	basicEcho(place.desc, term);
    }
    else if(index > -2) {
    	basicEcho('To go '+args+' isn\'t an option in this room...', term);
    }
};

/* PURPOSE: Takes an item that is in your backpack and isWeapon and equips it to player
	SIDE-EFFECTS: Changes player character
*/
function equip(term, args) {
	var options = player.backpack.filter(item => item.isWeapon);
	//const result = words.filter(word => word.length > 6);
	var r1 = "There\'s nothing in your backpack to equip";
	var r2 = 'You are currently carrying these weapons: ';
	var index = tutor(term, args, options, r1, r2);
	if(index > -1) {
		var curItem = options[index];
        if(player.equip && curItem.name == player.equip.name.toUpperCase()){
            term.echo('You already have that equipped!');
        }
        else {
            player.equip = curItem;
            term.echo('You equipped the '+curItem.name);
        }				
	}
	else if(index > -2){
		term.echo('You don\'t have any ' + args + ' in your arsenal');
	}
	
};
/* PURPOSE: Very simple combat where all attacks start with you, and you can run away at any time */
function attack(term, args) {
	var roomEnemies = curRoom.enemies;
	var r1 = 'There\'s nothing worth fighting here...';
	var r2 = 'You scan the area and see: ';
	if(player.equip) {
		var index = tutor(term, args, roomEnemies, r1, r2);
		if(index > -1) {
			var thisEnemy = roomEnemies[index];
			//strength of weapon + modifier based on player's sanity
			var attackPower = getAttackStrength();
			term.echo('You attacked the '+thisEnemy.name+' for '+attackPower+' damage!');
			term.echo('The '+thisEnemy.name+' attacked you for '+thisEnemy.attack+' damage!');				
			thisEnemy.health -= attackPower;
			player.health -= thisEnemy.attack;
			if(thisEnemy.health <= 0){
				term.echo('You killed the '+thisEnemy.name+'!');
				roomEnemies.splice(i,1);
				//basic loot-dropping action...
				if(thisEnemy.loot) {
					//special case for if loot required
					if(thisEnemy.isReq) {
						lootDrop(thisEnemy.loot, 1, term);
					}
					else {
						lootDrop(thisEnemy.loot, 2, term);
					}							
				}
			}
		}
		else if(index > -2) {	
			term.echo('There are no enemies by that name here');	
		}
	}
	else {
		term.echo('You don\'t have a weapon equipped!');
	}
};
//given an array of possible loot options from enemy, and odds of drop returns a loot if odds met
function lootDrop(possibilities, odds, term) {
	var numPos = possibilities.length;
	var chance = getRandomInt(1,odds);
	if(chance == 1) {
        var lootIndex = getRandomInt(1, numPos) - 1;
		var givenLoot = possibilities[lootIndex];
		player.backpack.push(givenLoot);
		basicEcho('Congradulations! You got a '+givenLoot.name+'!', term);
	}
}

//GAME FUNCTIONS - general purpose methods
/*
	PURPOSE: Return a random integer within the supplied range
*/
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.round(Math.random() * (max - min)) + min;
};
/*
	PURPOSE: Adds modifier to attack based on player's current sanity
*/
function getAttackStrength() {
	var sanity = player.sanity;
	var baseStrength = player.equip.strength;
	var totalPower = 0;
	if(sanity < 30) {
		totalPower = getRandomInt(Math.floor(baseStrength * 0.5), baseStrength);
	}
	else if(sanity < 60){
		totalPower = getRandomInt(Math.floor(baseStrength * 0.7), baseStrength);
	}
	else if(sanity < 99){
		totalPower = baseStrength;
	}else {
		totalPower = getRandomInt(baseStrength, Math.ceil(baseStrength * 1.2));
	}
	return totalPower;
}
