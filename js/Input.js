const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;


const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_R = 82;
const KEY_B = 66;
const KEY_C = 67;

const KEY_SPACE = 32;

var mouseX = 0;
var mouseY = 0;

function setupInput() {
	canvas.addEventListener('mousemove', updateMousePos);

	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);

	player.setupInput(KEY_UP_ARROW, KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_SPACE);
}

function updateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;

	// cheat / hack to test car in any position
	/*carX = mouseX;
	carY = mouseY;
	carSpeedX = 4;
	carSpeedY = -4;*/
}

function keySet(keyEvent, setTo) {
	var validGameKey = true;
	if(keyEvent.keyCode == player.controlKeyLeft) {
		player.keyHeld_West = setTo;
	}else if(keyEvent.keyCode == player.controlKeyRight) {
		player.keyHeld_East = setTo;
	}else if(keyEvent.keyCode == player.controlKeyUp) {
		player.keyHeld_North = setTo;
	}else if(keyEvent.keyCode == player.controlKeyDown) {
		player.keyHeld_South = setTo;
	}else if(keyEvent.keyCode == player.controlKeyAttack) {
		player.keyHeld_Attack = setTo;
	} else {
		validGameKey = false;
	}
	return validGameKey;
}

function keyPressed(evt) {
	// console.log("Key pressed: "+evt.keyCode);
	var validKey = keySet(evt, true);
	if(evt.keyCode == KEY_R){
		validKey = true;
		resetAllRooms();
	}
	if(evt.keyCode == KEY_B) {
		validKey = true;
		_DEBUG_DRAW_HITBOX_COLLIDERS = !_DEBUG_DRAW_HITBOX_COLLIDERS;
	}
	if(evt.keyCode == KEY_C) {
		validKey = true;
		_DEBUG_DRAW_TILE_COLLIDERS = !_DEBUG_DRAW_TILE_COLLIDERS;
	}
	if(validKey){
		evt.preventDefault();
	}
}

function keyReleased(evt) {
	// console.log("Key pressed: "+evt.keyCode);
	keySet(evt, false);
}
