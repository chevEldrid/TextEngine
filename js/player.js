/*
    ====================================================
    |       Class Necessary for Object Creation      |
    ====================================================
*/

/*
    @name:String        name of Player
    @backpack:Array<Item> a list of carried items
	@sanity:Int			total sanity of player
	@health:Int			total health of player
	@equip:Item			Current Item equipped by player to attack
*/
class Player {
    constructor(name, backpack, sanity, health, equip) {
        this.name = name;
        this.backpack = backpack;
		this.sanity = sanity;
		this.health = health;
		this.equip = equip;
    }
};

/*
	PURPOSE: Create a basic player with starting values for health and sanity
*/
function createCharacter(playerName) {
	player = {
		name: playerName,
		backpack: [],
		sanity: 50,
		health: 50
	};
};

function createTemplateCharacter() {
	player = {
		name: 'Nobody',
		backpack: [],
		sanity: 50,
		health: 50
	};
};
function createKCodeCharacter() {
    player = {
        name: 'Hax0r',
        backpack: [calamari()],
        sanity: 100,
        health: 100,
    };
}