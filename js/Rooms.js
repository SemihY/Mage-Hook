var currentRoomCol = 1,currentRoomRow = 1, currentFloor = 1;
var lastValidCurrentRoomCol = 1,lastValidCurrentRoomRow = 1, lastValidCurrentFloor = 1;
var roomName = "room"+currentRoomCol + "" + String.fromCharCode(97+currentRoomRow) + "" + currentFloor;
function roomCoordToVar()
{
	roomName = "room"+currentRoomCol + "" + String.fromCharCode(97+currentRoomRow) + "" + currentFloor;
	console.log("Loading room from var named "+roomName);
	return window[roomName];
}

function Room(roomLayout) {
	this.originalLayout = roomLayout.slice();
	this.layout = this.originalLayout.slice();
	this.enemyList = [];
	this.magic = [];
	this.itemOnGround = [];
	this.reset = function(){
		this.layout = this.originalLayout.slice();
		this.enemyList = [];
		this.itemOnGround = [];
		this.spawnItems();
		this.spawnMyEnemies();
	}

	this.spawnItems = function() {

		for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
			for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
				if(this.layout[arrayIndex] == TILE_KEY_COMMON) {
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_KEY_COMMON);
				} // end of player start if
			} // end of col for
		}
	}

	this.spawnMyEnemies = function(){
		var nextEnemy = null;
		var x, y;
		var offsetX = -3
		var offsetY = -3;
		var enemyWasFound = false;
		do {
			enemyWasFound = false;
			for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
				for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
					var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
					if(this.layout[arrayIndex] == TILE_ENEMYSTART) {
						this.layout[arrayIndex] = TILE_GROUND;
						x = eachCol * WORLD_W + WORLD_W/2 + offsetX;
						y = eachRow * WORLD_H + WORLD_H/2 + offsetY; //monsters are currently too tall to put next to walls
						var enemyType = Math.random() * 3;
						if (enemyType > 1 && enemyType < 2){
							nextEnemy = new slugMonster(x, y);
						} else if (enemyType > 2 && enemyType < 3){
							nextEnemy = new armsBro(x, y)
						} else {
							nextEnemy = new slimeMonster(x, y);
						}
						this.enemyList.push(nextEnemy);
						enemyWasFound = true;
						break;
					} // end of player start if
				} // end of col for
			}
		} while (enemyWasFound)
	}
	this.drawMyEnemies = function(){
		for(var i = 0; i<this.enemyList.length; i++){
			this.enemyList[i].draw();
		}
	}

	this.drawMagic = function(){
		for(var i = 0; i<this.magic.length; i++){
			this.magic[i].draw();
		}
	}

	this.drawDynamic = function() {
		var objects = [];
		for(var i = 0; i<this.enemyList.length; i++){
			objects.push({"y":this.enemyList[i].y , "object": this.enemyList[i]});
		}
		for(var i = 0; i<this.magic.length; i++){
			objects.push({"y":this.magic[i].y , "object": this.magic[i]});
		}
		objects.push({"y":player.y, "object": player});

		objects.sort(function(a, b) {
			return a.y-b.y;
		});

		for(var i = 0; i<objects.length; i++){
			objects[i].object.draw();
		}
	}

	this.moveMyEnemies = function(){
		for(var i = 0; i<this.enemyList.length; i++){
			this.enemyList[i].update();
		}
	}

	this.moveMagic = function(){
		for(var i = 0; i<this.magic.length; i++){
			this.magic[i].update();
		}
	}
	this.considerRoomChange = function () {
		if (player.x < 0){
			currentRoomCol--;
			Sound.play("room_change",false,0.05);
			loadLevel();
			player.x += canvas.width;
		}
		else if (player.x > canvas.width){
			currentRoomCol++;
			Sound.play("room_change",false,0.05);
			loadLevel();
			player.x -= canvas.width;
		}
		if (player.y < 0){
			currentRoomRow--;
			Sound.play("room_change",false,0.05);
			loadLevel();
			player.y += canvas.height;
		}
		else if (player.y > canvas.height){
			currentRoomRow++;
			Sound.play("room_change",false,0.05);
			loadLevel();
			player.y -= canvas.height;
		}
		if (lastValidCurrentFloor != currentFloor) {
			if ((currentFloor-lastValidCurrentFloor) == 1) { //Going up
				player.x += 30; //Offset for stairs
			}
			else if ((currentFloor-lastValidCurrentFloor) == -1) { //Going down
				player.x -= 30; //Offset for stairs
			}
			Sound.play("room_change",false,0.1);
			loadLevel();
		}
	}
};

var room0a1 = new Room([
	24,19,19,19,19,19,19,19,19,19,19,19,19,19,19,25,
	20,00,00,00,00,08,01,00,00,00,05,00,01,01,01,21,
	20,00,00,06,00,00,01,00,00,00,01,00,01,04,04,21,
	20,00,00,00,00,00,01,00,00,00,01,05,01,14,01,21,
	20,01,01,15,01,01,01,10,10,10,01,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,01,00,04,00,00,21,
	20,00,00,00,00,00,00,00,00,06,01,00,00,00,00,28,
	20,00,00,00,00,00,00,00,00,00,01,00,04,00,00,21,
	22,18,18,18,18,18,18,18,27,18,18,18,18,18,18,23]);

var room1a1 = new Room([
	24,19,19,19,19,19,19,19,19,19,19,19,19,19,19,25,
	20,10,00,00,00,00,01,00,00,00,05,00,01,01,01,21,
	20,00,00,06,00,00,01,00,06,00,01,00,01,04,04,21,
	20,00,00,00,00,00,01,00,00,00,01,05,01,05,01,21,
	20,01,01,05,01,01,01,00,00,00,01,00,00,00,00,21,
	20,00,00,00,00,00,00,09,03,00,01,09,04,00,00,21,
	29,00,00,04,00,00,00,00,00,00,01,00,06,00,00,21,
	20,00,00,00,00,00,00,00,00,00,01,00,04,00,00,21,
	22,18,18,18,18,18,18,18,27,18,18,18,18,18,18,23]);

var room0b1 = new Room([
	24,19,19,19,19,19,19,19,26,19,19,19,19,19,19,25,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,20,0,0,0,0,0,0,11,0,0,0,0,0,0,0,28,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,22,18,18,18,18,18,18,18,27,18,18,18,18,18,18,23]);
var room0c1 = new Room([
	24,19,19,19,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,11,00,00,00,00,00,00,00,28,
	20,00,00,31,31,31,31,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,18,18,18,18,18,18,18,18,18,18,18,18,23]);

var room1b1 = new Room([
	24,19,19,19,19,19,19,19,26,19,19,19,19,19,19,25,
	20,10,8,0,0,0,0,0,0,0,0,0,0,0,0,21,20,0,0,0,0,0,
	0,0,0,3,9,0,0,0,0,21,20,7,0,0,0,0,0,0,0,0,0,0,0,
	0,0,21,29,0,0,0,0,10,0,0,0,0,0,0,17,0,0,21,22,18,
	18,18,25,0,0,0,0,0,10,0,0,0,0,21,31,31,31,31,20,0,0,
	0,0,0,0,0,0,0,8,21,31,31,31,31,22,18,25,0,0,0,0,0,0,
	0,0,21,31,31,31,31,31,31,22,18,18,18,18,18,18,18,18,23]);

var room1b2 = new Room([
	24,19,19,19,19,19,19,19,19,19,19,19,19,19,19,25,
	20,10,08,10,00,10,00,00,00,00,00,00,00,00,00,21,
	20,10,00,10,00,10,00,00,00,00,09,00,00,00,00,21,
	20,10,10,10,00,10,00,00,00,00,00,00,00,00,00,21,
	20,10,00,10,00,10,00,00,00,00,00,00,30,00,00,21,
	20,10,00,10,00,10,00,00,00,00,10,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,08,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,18,18,18,18,18,18,18,18,18,18,18,18,23]);

var allRooms = [room0a1, room1a1, room0b1, room1b1, room1b2];
var currentRoom = null;

function resetAllRooms(){
	for(var i = 0; i< allRooms.length; i++){
		allRooms[i].reset();
	}
	currentRoomCol = 1;
	currentRoomRow = 1;
	currentFloor = 1;
	loadLevel();
}
