/*
    @name:String        name of item
    @desc:String        description of item
    @takeable:boolean   can I put the item in my backpack
    @cond:boolean		Condition when this item is usable
    @use:function		What this Item will do if cond is met...
	@durability:int     how many times item can be used before breaking
	@weapon:bool		is this item a weapon/can be used to attack
	@strength:int		if item is weapon, its attack strength
*/
class Item {
    constructor(name, desc, takeable, cond, use, durability, isWeapon, strength) {
        this.name = name;
        this.desc = desc;
        this.takeable = takeable;
		this.cond = cond;
		this.use = use;
		this.durability = durability;
		this.isWeapon = isWeapon;
		this.strength = strength;
    }
};
/*
	@name:String		name of Enemy
	@desc:String		quick description of Enemy
	@health:int			Enemy health
	@attack:int			Enemy attack strength
	@loot:Array<Item>	Potential loot drops
	@isReq:bool			if loot is required for character
*/
class Enemy {
	constructor(name, desc, health, attack, loot, isReq) {
		this.name = name;
		this.desc = desc;
		this.health = health;
		this.attack = attack;
		this.loot = loot;
		this.isReq = isReq;
	}
};

/* =============================
   |       Generic Items       |
   ============================= */

function moldySandwich(){
	return new Item('Moldy Sandwich', 
	'A sandwich that has most definitely seen better days',
	true,
	function(){return (player.health <= 95);},
	function(term){player.health+=5;player.sanity-=5;basicEcho('You eat it...but you hate yourself for it', term);},
	1,
	false,
	0);
}

function calamari(){
	return new Item(
		'calamari',
		'A delicacy to some among the pre-Oktopi invasion populice',
		true,
		function(){return (player.health <= 80);},
		function(term){player.health+=20;player.sanity+=20;basicEcho('It brings you some kind of weird pleasure to eat the cousins of the opressors. You\'re a little sick', term);},
		1,
		false,
		0);
}

/* =============================
   |       Special Items       |
   ============================= */

//weapons
function oldSword(){
	return new Item(
		'Old Sword',
		'your old sword from the fandom wars, a little rusty but probably still packs a punch.',
		true,
		function() {return false;},
		function(term) {},
		0,
		true,
		5
	);
}

/* =============================
   |     Special Enemies       |
   ============================= */

/* =============================
   |     Generic Enemies       |
   ============================= */

function tentacle() {
	return new Enemy('Tentacle', 
	'Looking slightly more threatening than a wet noodle',
	5,
	0,
	[moldySandwich()],
	false);
}