var canvaswrapper = document.getElementById("canvas_wrapper");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var canvaswrapper2 = document.getElementById("player_wrapper");
var canvas2 = document.createElement("canvas");
var ctx2 = canvas2.getContext("2d");

var canvaswrapper3 = document.getElementById("canvas_layer");
var canvas3 = document.createElement("canvas");
var ctxText = canvas3.getContext("2d");

canvas.width = 608;
canvas.height = 608;
canvaswrapper.appendChild(canvas);

canvas3.width = 608;
canvas3.height = 608;
canvaswrapper3.appendChild(canvas3);

canvas2.width = 240;
canvas2.height = 608;
canvaswrapper2.appendChild(canvas2);

ANIM_SPEED = 40;
TILE_SIZE = 32;
TILE_COUNT_X = Math.floor(canvas.width / TILE_SIZE);
TILE_COUNT_Y = Math.floor(canvas.height / TILE_SIZE);
DAMAGE_DRAWN_TIME = 1000;

var damage_opacity = 1;
var damage_message = "";
var activeEnemy;
var isVictory = false;
var isGameOver = false;
var timer = 0;

var tilesReady = false;
var tilesDrawn = false;
var tilesImage = new Image();
tilesImage.onload = function () {
    tilesReady = true;
};
tilesImage.src = "img/tiles/summertiles.png";

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "img/grunt/grunt.png";

var enemyReady = false;
var enemyImage = new Image();
enemyImage.onload = function () {
    enemyReady = true;
};
enemyImage.src = "img/footman/footman.png";

var iconsReady = false;
var iconsDrawn = false;
var iconsImage = new Image();
iconsImage.onload = function () {
    iconsReady = true;
};
iconsImage.src = "img/icons/gruntico.png";

var healthReady = false;
var healthImage = new Image();
healthImage.onload = function () {
    healthReady = true;
};
healthImage.src = "img/bg/health.png";

var manaReady = false;
var manaImage = new Image();
manaImage.onload = function () {
    manaReady = true;
};
manaImage.src = "img/bg/mana.png";

var xpReady = false;
var xpImage = new Image();
xpImage.onload = function () {
    xpReady = true;
};
xpImage.src = "img/bg/xp.png";

var itemsReady = false;
var itemsImage = new Image();
itemsImage.onload = function () {
    itemsReady = true;
};
itemsImage.src = "img/items/healthpotion.png";

var tunicReady = false;
var runicImage = new Image();
runicImage.onload = function () {
    runicReady = true;
};
runicImage.src = "img/items/runicpotion.png";

var damageDrawn;

var hero = {
	id: 999,
    speed: 1,
    size: 64,
    x: 0,
    y: 0,
    animationX: 0,
    animationY: 0,
    canMove: true,
    isMoving: false,
    isAttacking: false,
    items: 5,
    runic: 3,
    canUseItem: true,
    itemCooldown: 2000,
    canAttack: true,
    attackRate: 300,
    attackRange: 60,
    attackPower: 30,
    hitChance: 90,
    hitTargets: 1,
    targetTile: null,
    itemUsed: Date.now(),
    hasBuff: false,
    buffExpire: 3000,
    gotBuff:Date.now(),
    mana: 200,
    maxMana: 200,
    XP: 100,
    level: 1,
    HP: 200,
    maxHP: 200,
    lastAttack: Date.now(),
    lastAnim: Date.now(),
    enemiesKilled: 0,
    attack: function () {
        var strikes = 0;
        for (en in enemies) {
            if (enemies[en].isAlive) {

                if ((Math.abs(enemies[en].x - hero.x) < hero.attackRange)
                && (Math.abs(enemies[en].y - hero.y) < hero.attackRange)) {

                    var isHit = Math.random() * 100;

                    if (isHit < hero.hitChance) {
                        var dam = Math.round(Math.random() * hero.attackPower +
                        Math.round(hero.attackPower / 4));
                        enemies[en].HP -= dam;
                        damage_message = dam;
                    }
                    else {
                        damage_message = 'miss';
                    }

                    strikes++;
                }
                damageDrawn = Date.now();
                damage_opacity = 1;
            }
            if (strikes === hero.hitTargets) { break; }
        }
        if (strikes === 0) {
            damage_message = 'no enemy in range';
            damageDrawn = Date.now();
            damage_opacity = 1;
        }
    }
};

function drawDamage(damage_message) {
    ctxText.clearRect(0, 0, canvas3.width, canvas3.height);
    ctxText.fillStyle = "rgba(254, 253, 124, " + damage_opacity + ")";
    ctxText.textAlign = "center";
    ctxText.font = "18px Arial";
    ctxText.fillText(damage_message, hero.x + hero.size / 2, hero.y);
}

function Enemy(id, x, y, HP, aX, aY) {

    function isHeroInRange() {
        if ((Math.abs(this.x - hero.x) < this.threatRange) && (Math.abs(this.y - hero.y)
        < this.threatRange)) {
            return true;
        }
        return false;
    }

    function attackHero() {
        this.isAttacking = true;
        this.isMoving = false;
        this.animationY = 5;

        var isHit = Math.random() * 100;

        if (isHit < this.hitChance) {
            var dam = Math.round(Math.random() * this.attackPower + Math.round(this.attackPower / 4));
            hero.HP -= dam;
        }
    }
    
    function die(){    	
    	  drawArea(Math.floor(this.x / TILE_SIZE), Math.floor(this.y / TILE_SIZE), Math.floor((this.x + this.size) / TILE_SIZE), Math.floor((this.y + this.size) / TILE_SIZE));
          this.isAlive = false;
          this.isMoving = false;
          this.isAttacking = false;
          this.animationY = 10;
          hero.XP += 50;
    }

	this.id = id;
    this.size = 64;
    this.speed = 90;
    this.x = x;
    this.y = y;
    this.animationX = aX;
    this.animationY = aY;
    this.HP = HP;
    this.isAlive = true;
    this.threatRange = 150;
    this.attackRange = 32;
    this.attackPower = 8;
    this.attackRate = 300;
    this.hitChance = 100;
    this.canAttack = true;
    this.isAttacking = false;
    this.lastAnim = Date.now();
    this.isHeroInRange = isHeroInRange;
    this.isAtTarget = false;
    this.attackHero = attackHero;
    this.hasTarget = false;
    this.isMoving = false;
    this.lastAttack = Date.now();
    this.targetTile = null;
    this.die = die;
}

function Tile(x, y, texture, walkable) {
    this.x = x;
    this.y = y;
    this.walkable = walkable;
    this.sourceY = Math.floor(texture / 19);
    this.sourceX = Math.floor(texture % 19);
    this.drawTile = drawTile;

    function drawTile() {
        ctx.drawImage(tilesImage, this.sourceX * TILE_SIZE + this.sourceX,
        this.sourceY * TILE_SIZE + this.sourceY, TILE_SIZE, TILE_SIZE,
        this.x, this.y, TILE_SIZE, TILE_SIZE);
    }
}

function Target(x, y) {
    this.x = x;
    this.y = y;
    this.size = 32;
}

function getTile(object) {
    return tiles[object.x / TILE_SIZE][object.y / TILE_SIZE];
}

var tiles = {};
var enemies = {};

var keysDown = {};

addEventListener("keydown", function (e) { keysDown[e.keyCode] = true; }, false);
addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);

function drawMap() {    
    for (var i = 0; i < currentLevel.width; i++) {
        for (var j = 0; j < currentLevel.height; j++) {
            tiles[i][j].drawTile();
        }
    }
}

function drawArea(px, py, pmx, pmy) {

    if (px < 1) px = 1;
    if (py < 1) py = 1;
    
    if (pmx >= (currentLevel.width - 3)) pmx = currentLevel.width - 3;
    if (pmy >= (currentLevel.height - 3)) pmy = currentLevel.height - 3;

    for (var i = px - 1; i < pmx + 3; i++) {
        for (var j = py - 1; j < pmy + 3; j++) {
            tiles[i][j].drawTile();
        }
    }
}

var map1 = {
    width: 19,
    height: 19,
    textures: [19, 28, 28, 28, 28, 28, 28, 29, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 26, 22, 356, 356, 356, 356, 356, 356, 22, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 21, 22, 356, 19, 27, 27, 25, 356, 22, 356, 285, 293, 293, 293, 293, 293, 293, 277, 356, 21, 22, 356, 22, 356, 356, 356, 356, 22, 356, 290, 221, 230, 230, 230, 230, 213, 281, 356, 21, 20, 356, 22, 356, 16, 16, 356, 22, 356, 290, 225, 311, 311, 311, 311, 217, 281, 356, 21, 356, 356, 20, 356, 16, 16, 356, 22, 356, 290, 225, 311, 311, 311, 311, 217, 281, 356, 21, 356, 356, 356, 356, 356, 356, 356, 22, 356, 290, 225, 311, 311, 311, 311, 217, 281, 356, 21, 18, 27, 27, 27, 27, 25, 356, 20, 356, 290, 225, 311, 311, 311, 311, 217, 281, 356, 21, 356, 356, 356, 356, 356, 356, 356, 356, 356, 290, 225, 311, 311, 311, 311, 217, 281, 356, 21, 356, 357, 357, 357, 356, 357, 356, 356, 356, 290, 208, 211, 211, 211, 211, 207, 281, 356, 21, 356, 356, 356, 136, 106, 106, 106, 107, 356, 273, 274, 274, 274, 274, 274, 275, 270, 356, 21, 17, 356, 104, 105, 105, 105, 105, 109, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 21, 21, 356, 130, 124, 124, 124, 124, 110, 356, 357, 357, 356, 356, 356, 357, 357, 356, 356, 21, 21, 356, 356, 356, 126, 126, 126, 356, 356, 357, 357, 357, 356, 356, 356, 357, 356, 356, 21, 21, 356, 356, 356, 356, 126, 356, 356, 356, 356, 357, 357, 356, 356, 356, 356, 356, 356, 21, 23, 28, 28, 28, 28, 28, 25, 356, 356, 356, 356, 356, 18, 28, 28, 28, 28, 28, 30, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, ],
    walking: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, false, false, true, false, false, false, false, true, false, true, true, true, true, true, true, true, true, true, true, false, false, true, false, true, true, true, true, false, true, true, false, false, false, false, false, false, true, true, false, false, true, false, true, false, false, true, false, true, true, false, false, false, false, false, false, true, true, false, true, true, false, true, false, false, true, false, true, true, false, false, false, false, false, false, true, true, false, true, true, true, true, true, true, true, false, true, true, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, true, false, true, true, false, false, false, false, false, false, true, true, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, false, true, true, true, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, ],
    enemiesCount: 3,
    heroPosX: 8,
    heroPosY: 8
};

var map2 = {
    width: 19,
    height: 19,
    textures: [19, 28, 28, 28, 28, 28, 29, 28, 28, 28, 28, 28, 28, 25, 103, 127, 127, 127, 127, 22, 356, 356, 356, 356, 356, 22, 356, 356, 356, 356, 356, 126, 126, 102, 127, 127, 127, 127, 22, 356, 18, 28, 26, 356, 22, 356, 136, 106, 132, 356, 356, 126, 126, 115, 127, 127, 127, 22, 356, 356, 356, 22, 356, 22, 356, 102, 131, 129, 356, 356, 126, 126, 115, 127, 127, 127, 22, 356, 18, 27, 31, 356, 22, 356, 17, 356, 356, 356, 356, 356, 126, 115, 127, 127, 127, 22, 98, 88, 98, 22, 356, 22, 356, 22, 356, 356, 356, 356, 356, 356, 130, 127, 127, 127, 22, 98, 98, 88, 22, 356, 22, 356, 22, 356, 136, 106, 132, 356, 356, 356, 130, 127, 127, 23, 27, 27, 27, 30, 356, 22, 356, 23, 25, 102, 131, 129, 356, 356, 356, 356, 130, 110, 356, 356, 356, 356, 356, 356, 20, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 16, 356, 16, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 294, 277, 356, 16, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 356, 16, 334, 296, 277, 356, 16, 356, 356, 356, 356, 356, 356, 356, 356, 356, 16, 356, 16, 285, 294, 334, 338, 296, 294, 294, 277, 16, 356, 16, 356, 16, 356, 16, 285, 294, 294, 294, 298, 335, 221, 229, 229, 213, 334, 296, 294, 294, 294, 294, 294, 294, 294, 299, 334, 340, 334, 334, 334, 226, 311, 311, 216, 334, 334, 334, 337, 334, 334, 334, 334, 334, 334, 334, 334, 334, 334, 334, 236, 227, 311, 216, 334, 334, 334, 334, 334, 334, 340, 334, 221, 230, 230, 230, 230, 230, 230, 232, 236, 227, 216, 334, 169, 170, 171, 334, 334, 334, 221, 235, 315, 304, 301, 304, 301, 304, 313, 232, 236, 206, 334, 142, 176, 150, 334, 334, 221, 235, 304, 301, 304, 301, 304, 301, 304, 313, 313, 216, 334, 334, 334, 334, 334, 334, 334, 225, 301, 304, 301, 304, 301, 304, 301, 304, ], walking: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, false, true, true, true, true, true, true, true, false, false, false, false, false, false, true, false, false, false, true, false, true, false, false, false, true, true, true, true, false, false, false, false, false, true, true, true, false, true, false, true, false, false, false, true, true, true, true, false, false, false, false, false, true, false, false, false, true, false, true, false, true, true, true, true, true, true, false, false, false, false, false, true, true, true, false, true, false, true, false, true, true, true, true, true, true, false, false, false, false, false, true, true, true, false, true, false, true, false, true, false, false, false, true, true, true, false, false, false, false, false, false, false, false, true, false, true, false, false, false, false, false, true, true, true, true, false, false, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, false, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, false, true, true, true, true, true, true, true, true, true, false, true, false, true, true, true, true, true, true, true, true, false, true, false, true, false, true, false, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, ],
    enemiesCount: 3,
    heroPosX: 18,
    heroPosY: 14
}

var currentLevel = map1;

function renderLevel() {
    for (var i = 0; i < TILE_COUNT_X; i++) {
        tiles[i] = new Array();
        for (var j = 0; j < TILE_COUNT_Y; j++) {
            tiles[i][j] = new Tile(i * TILE_SIZE, j * TILE_SIZE, currentLevel.textures[TILE_COUNT_X * j + i], currentLevel.walking[TILE_COUNT_X * j + i]);
        }
    }
    tilesDrawn = true;
    drawMap();
    resetEnemy();
}

function drawMessage(msg) {
    ctxText.font = "60pt Arial";
    ctxText.textAlign = "center";
    ctxText.textBaseline = "middle";
    ctxText.clearRect(0, 0, canvas3.width, canvas3.height);
    ctxText.fillStyle = "rgba(255,238,64,1)";
    ctxText.fillText(msg, canvas3.width / 2, canvas3.height / 2);
}

var render = function (now) {
    if (tilesReady) {
        if (!tilesDrawn) {
            renderLevel();
        }
        else {



            if ((healthReady) && (xpReady)) {

                if (hero.HP > 0) {
                    ctx2.clearRect(0, 66, 240, 500);
                    ctx2.drawImage(healthImage, 0, 0, 1, 24, 0, 70, Math.floor(hero.HP / hero.maxHP * 240), 12);
                    ctx2.strokeStyle = "black";
                    ctx2.fillStyle = "white";
                    ctx2.lineWidth = 1;
                    ctx2.font = "10px Arial";
                    ctx2.fillText(hero.HP + " / " + hero.maxHP, 4, 80);

                    ctx2.drawImage(xpImage, 0, 0, 1, 24, 0, 100, Math.floor(hero.XP / 600 * 240), 12);
                    ctx2.fillText(hero.XP + " / " + 600, 4, 110);

                    ctx2.fillStyle = "white";
                    ctx2.font = "16px Arial";
                    ctx2.fillText("Attack Power:   " + Math.floor(hero.attackPower / 4) + " - " + Math.round(hero.attackPower + hero.attackPower / 4), 20, 210);
                    ctx2.fillText("Hit Chance:       " + hero.hitChance + "%", 20, 240);
                    ctx2.fillText("Attack Speed:   " + hero.attackRate, 20, 270);
                    ctx2.fillText("Targets:             " + hero.hitTargets, 20, 300);

                }
                else {
                    ctx2.clearRect(0, 66, 240, 166);
                    ctx2.font = "10px Arial";
                    ctx2.fillStyle = "white";
                    ctx2.fillText(0 + " / " + hero.maxHP, 4, 80);
                    isGameOver = true;
                    hero.animationY = 10;
                    drawMessage("GAME OVER");
                }

                if (manaReady) {
                    ctx2.font = "10px Arial";
                    ctx2.drawImage(manaImage, 0, 0, 1, 24, 0, 84, Math.floor(hero.mana / hero.maxMana * 240), 12);
                    ctx2.fillText(hero.mana + " / " + hero.maxMana, 4, 94);
                }
            }

            if ((itemsReady) && (runicReady)) {
                ctx2.clearRect(64, 508, 100, 100);
                ctx2.drawImage(itemsImage, 0, 0, 64, 64, 20, 500, 48, 48);
                ctx2.drawImage(runicImage, 0, 0, 64, 64, 72, 500, 48, 48);
                ctx2.fillStyle = "white";
                ctx2.font = "16px Arial";
                ctx2.fillText(hero.items, 52, 542);
                ctx2.fillText(hero.runic, 106, 542);
            }

            drawArea(Math.floor(hero.x / TILE_SIZE), Math.floor(hero.y / TILE_SIZE), Math.floor((hero.x + hero.size) / TILE_SIZE), Math.floor((hero.y + hero.size) / TILE_SIZE));

            if (enemyReady) {
                for (en in enemies) {
                    ctx.drawImage(enemyImage, enemies[en].animationX * enemies[en].size + enemies[en].animationX, enemies[en].animationY * enemies[en].size + enemies[en].animationY, enemies[en].size, enemies[en].size, Math.floor(enemies[en].x - 16), Math.floor(enemies[en].y - 16), enemies[en].size, enemies[en].size);
                    /*ctx.fillStyle = "blue";
                    ctx.font = "20pt Arial";
                    ctx.fillText(enemies[en].id, enemies[en].x + 16, enemies[en].y + 16);*/
                }
            }

            if (heroReady) {
                ctx.drawImage(heroImage, (hero.animationX * hero.size) + hero.animationX, (hero.animationY * hero.size) + hero.animationY, hero.size, hero.size, Math.floor(hero.x - 16), Math.floor(hero.y - 16), hero.size, hero.size);
                //ctx.fillStyle = "black";
                //ctx.fillRect(Math.floor(hero.x), Math.floor(hero.y), 32, 32);
            }

            if (enemyReady) {
                for (en in enemies) {
                    if (enemies[en].isAlive) {
                        ctx.fillStyle = "black";
                        ctx.fillRect(Math.floor(enemies[en].x - 16), Math.floor(enemies[en].y - 16), enemies[en].size, 4);
                        ctx.fillStyle = "rgba(83,234,42,1)";
                        ctx.fillRect(Math.floor(enemies[en].x - 16), Math.floor(enemies[en].y - 16), Math.floor(enemies[en].HP / 100 * (enemies[en].size)), 4);
                    }
                }
            }

            if ((iconsReady) && (!iconsDrawn)) {
                ctx2.drawImage(iconsImage, 0, 0, 64, 64, 0, 0, 64, 64);
                ctx2.fillStyle = "yellow";
                ctx2.font = "24px Gothic";
                ctx2.fillText("Orc Warrior", 80, 24);
                ctx2.fillStyle = "white";
                ctx2.fillText("Level " + hero.level, 80, 58);
                iconsDrawn = true;
            }
        }
    }

};

var reset = function () {
    hero.x = currentLevel.heroPosX * 32;
    hero.y = currentLevel.heroPosY * 32;
};

var resetEnemy = function () {
    var posX, posY;

    for (var i = 0; i < currentLevel.enemiesCount; i++) {

        if (tilesReady) {
            do {
                posX = Math.floor(Math.random() * TILE_COUNT_X);
                posY = Math.floor(Math.random() * TILE_COUNT_Y);
            } while (tiles[posX][posY].walkable == false)
        }

        enemies[i] = new Enemy(i, posX * TILE_SIZE, posY * TILE_SIZE, 100, Math.floor(Math.random() * 7), 0);
    }
};

function Point(x,y) {
    this.x = x;
    this.y = y;
}

function isCollision(object, dirX, dirY) {

    var tileX = object.x / TILE_SIZE + dirX;
    var tileY = object.y / TILE_SIZE + dirY;

    if (tileX < 0) tileX = 0;
    if (tileY < 0) tileY = 0;
    if (tileX > currentLevel.width - 1) tileX = currentLevel.width - 1;
    if (tileY > currentLevel.height - 1) tileY = currentLevel.height - 1;

    if (tiles[tileX][tileY] != null) {
    	if (tiles[tileX][tileY].walkable == false) { return true; }
    }
    else { return true; }
    
    for (enemy in enemies) {
    	 
        if ((enemies[enemy].isAlive) && (object.id != enemies[enemy])) {

            if ((enemies[enemy].x == object.x + dirX * TILE_SIZE) && (enemies[enemy].y == object.y + dirY * TILE_SIZE)) { return true; }

            if ((enemies[enemy].hasTarget) && (enemies[enemy].targetTile != null)) {
                if ((enemies[enemy].targetTile.x == object.x + dirX * TILE_SIZE) && (enemies[enemy].targetTile.y == object.y + dirY * TILE_SIZE)) { return true };
            }
			
    	}
    }

    if (hero.id != object.id) {
        if ((hero.x == object.x + dirX * TILE_SIZE) && (hero.y == object.y + dirY * TILE_SIZE)) { return true; }

        if (hero.targetTile != null) {
            if ((hero.targetTile.x == object.x + dirX * TILE_SIZE) && (hero.targetTile.y == object.y + dirY * TILE_SIZE)) { return true };
        }
    }
	
    return false;
}

function roundNumber(num, dec) {
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}

function getPath(object, target) {

    var locDifUp = isCollision(object, 0, -1) ? 5000 : Math.sqrt(Math.abs(target.x - object.x) * Math.abs(target.x - object.x) + Math.abs(target.y - object.y + 32) * Math.abs(target.y - object.y + 32));
    var locDifDown = isCollision(object, 0, 1) ? 5000 : Math.sqrt(Math.abs(target.x - object.x) * Math.abs(target.x - object.x) + Math.abs(target.y - object.y - 32) * Math.abs(target.y - object.y - 32));
    var locDifLeft = isCollision(object, -1, 0) ? 5000 : Math.sqrt(Math.abs(target.x - object.x + 32) * Math.abs(target.x - object.x + 32) + Math.abs(target.y - object.y) * Math.abs(target.y - object.y));
    var locDifRight = isCollision(object, 1, 0) ? 5000 : Math.sqrt(Math.abs(target.x - object.x - 32) * Math.abs(target.x - object.x - 32) + Math.abs(target.y - object.y) * Math.abs(target.y - object.y));

	var direction = locDifUp;

    if (locDifDown < direction) direction = locDifDown;
    if (locDifLeft < direction) direction = locDifLeft;
    if (locDifRight < direction) direction = locDifRight;

    switch (direction) {
        case locDifUp:  return new Target(object.x, object.y - 32); break;
        case locDifDown: return new Target(object.x, object.y + 32); break;
        case locDifLeft: return new Target(object.x - 32, object.y);  break;
        case locDifRight: return new Target(object.x + 32, object.y);  break;
    }
}

var update = function () {
    if ((!isVictory) && (!isGameOver)) {

        for (en in enemies) {

            if (enemies[en].isAlive) {

                if ((roundNumber(Math.sqrt(Math.abs(hero.x - enemies[en].x) * Math.abs(hero.x - enemies[en].x) + Math.abs(hero.y - enemies[en].y) * Math.abs(hero.y - enemies[en].y)), 0) <= enemies[en].attackRange)
                && (!enemies[en].hasTarget) && (enemies[en].canAttack) && (!enemies[en].isAttacking)) {
                    enemies[en].attackHero();
                }

                if ((!enemies[en].hasTarget) && (enemies[en].isHeroInRange()) && (enemies[en].canAttack) && (!enemies[en].isAttacking)) {
                    enemies[en].targetTile = getPath(enemies[en], hero);
                    enemies[en].hasTarget = true;
                }

                if ((enemies[en].hasTarget) && (!enemies[en].isAttacking) && (enemies[en].targetTile != null)) {

                    if ((enemies[en].x == enemies[en].targetTile.x) && (enemies[en].y == enemies[en].targetTile.y)) {
                        enemies[en].hasTarget = false;
                        enemies[en].isMoving = false;
                    }
                    else {
                        enemies[en].isMoving = true;
                        enemies[en].isAttacking = false;

                        var locDifX = enemies[en].x - enemies[en].targetTile.x;
                        var locDifY = enemies[en].y - enemies[en].targetTile.y;

                        if (locDifX > 0) {
                            enemies[en].x -= 1;
                            enemies[en].animationX = 6;
                        }
                        else if (locDifX < 0) {
                            enemies[en].x += 1;
                            enemies[en].animationX = 2;
                        }

                        if (locDifY > 0) {
                            enemies[en].y -= 1;
                            enemies[en].animationX = 0;
                        }
                        else if (locDifY < 0) {
                            enemies[en].y += 1;
                            enemies[en].animationX = 4;
                        }
                    }
                }
            }
        }


        if ((hero.canMove) && (!hero.isMoving)) {
            if (38 in keysDown) { //nahoru
                if (hero.y > 0) {
                    if (!isCollision(hero, 0, -1)) {
                        moveHero(0, -1);
                    }
                }
                hero.animationX = 0;
            }
            if (40 in keysDown) { //dolu
                if (hero.y < canvas.height - hero.size / 2) {
                    if (!isCollision(hero, 0, 1)) {
                        moveHero(0, 1);
                    }
                }
                hero.animationX = 4;
            }
            if (37 in keysDown) {
                if (hero.x > 0) {
                    if (!isCollision(hero, -1, 0)) {
                        moveHero(-1, 0);
                    }
                }
                hero.animationX = 6;
            }
            if (39 in keysDown) {
                if (hero.x < canvas.width - hero.size / 2) {
                    if (!isCollision(hero, 1, 0)) {
                        moveHero(1, 0);
                    }
                }
                hero.animationX = 2;
            }
        }

        if (32 in keysDown) {
            if ((!hero.isAttacking) && (hero.canAttack)) {
                hero.canMove = false;
                hero.isAttacking = true;
                hero.animationY = 5;
                hero.attack();
            }
        }

        if (72 in keysDown) {
            if (hero.canUseItem) {
                if ((hero.items > 0) && (hero.maxHP != hero.HP)) {
                    if (hero.HP + 30 < hero.maxHP)
                        hero.HP += 30;
                    else hero.HP = hero.maxHP;
                    hero.items--;
                    hero.canUseItem = false;
                    hero.itemUsed = Date.now();
                }
            }
        }

        if (82 in keysDown) {
            if (hero.canUseItem) {
                if (hero.runic > 0) {
                    hero.attackRate -= 150;
                    hero.runic--;
                    hero.canUseItem = false;
                    hero.hasBuff = true;
                    hero.gotBuff = Date.now();
                    hero.itemUsed = Date.now();
                }
            }
        }

        for (en in enemies) {
            var living = 0;
            if (enemies[en].isAlive) {
                if (enemies[en].HP < 0) {
                    enemies[en].die();
                    hero.enemiesKilled++;
                }
                if ((enemies[en].isMoving) || (enemies[en].isAttacking)) {
                    drawArea(Math.floor(enemies[en].x / TILE_SIZE), Math.floor(enemies[en].y / TILE_SIZE), Math.floor((enemies[en].x + enemies[en].size) / TILE_SIZE), Math.floor((enemies[en].y + enemies[en].size) / TILE_SIZE));
                }
            }
        }

        drawDamage(damage_message);

        if (hero.enemiesKilled == currentLevel.enemiesCount) {
            isVictory = true;
            drawMessage('VICTORY!');
        }
    }
    else {

        timer++;
        if ((timer > 200) && (isVictory)) {
            drawMessage('Next Level!');
            if (timer > 400) {
                timer = 0;
                isVictory = false;
                hero.enemiesKilled = 0;
                currentLevel = map2;
                renderLevel();
                reset();
                drawMessage('');
            }
        }
    }
}

function moveHero(dirX, dirY) {
    if (!hero.isMoving) {
        var target = new Target(hero.x + dirX * 32, hero.y + dirY * 32);
        hero.targetTile = getTile(target);
        hero.isMoving = true;
    }
}

var walkCharacters = function (modifier) {

    if (hero.targetTile != null) {
        if (hero.isMoving) {
        
            var difX = hero.x - hero.targetTile.x;
            var difY = hero.y - hero.targetTile.y;

            if (difX > 0) difX = 1;
            if (difX < 0) difX = -1;
            if (difY > 0) difY = 1;
            if (difY < 0) difY = -1;

            if ((hero.targetTile.x != hero.x) || (hero.targetTile.y != hero.y)) {
                hero.x = hero.x - difX * hero.speed;
                hero.y = hero.y - difY * hero.speed;
            }
            else {
                hero.isMoving = false;
            }
        }
    }

}

var animateHero = function (now) {

    if (hero.isMoving) {
        if ((now - hero.lastAnim) > ANIM_SPEED) {
            if (hero.animationY < 4) {
                hero.animationY++;
            }
            else {
                hero.animationY = 0;
            }
            hero.lastAnim = now;
        }
    }

    for (en in enemies) {

        if (enemies[en].isMoving) {
            if ((now - enemies[en].lastAnim) > ANIM_SPEED) {
                if (enemies[en].animationY < 4) {
                    enemies[en].animationY++;
                }
                else {
                    enemies[en].animationY = 0;
                }
                enemies[en].lastAnim = now;
            }
        }

        if (enemies[en].isAttacking) {
            if ((now - enemies[en].lastAnim) > ANIM_SPEED) {
                if (enemies[en].animationY < 8) {
                    enemies[en].animationY++;
                }
                else {
                    enemies[en].animationY = 0;
                    enemies[en].isAttacking = false;
                    enemies[en].canAttack = false;
                    enemies[en].lastAttack = Date.now();
                }
                enemies[en].lastAnim = now;
            }
        }
    }

    if (hero.isAttacking) {
        if ((now - hero.lastAnim) > ANIM_SPEED) {
            if (hero.animationY < 8) {
                hero.animationY++;
            }
            else {
                hero.animationY = 0;
                hero.isAttacking = false;
                hero.canMove = true;
                hero.canAttack = false;
                hero.lastAttack = Date.now();
            }
            hero.lastAnim = now;
        }
    }

    if ((!hero.isMoving) && (!hero.isAttacking)) { hero.animationY = 0; };
};

var refresh = function (now) {
    if ((now - hero.lastAttack) > hero.attackRate) {
        hero.canAttack = true;
    }

    if (!hero.canUseItem){
        if ((now - hero.itemUsed) > hero.itemCooldown) {
            hero.canUseItem = true;
        }
        else {
            ctx2.fillStyle= "white";
            ctx2.globalAlpha = 0.3;
            ctx2.fillRect(20, 500, ((now - hero.itemUsed) / hero.itemCooldown) * 48, 48);
            ctx2.fillRect(72, 500, ((now - hero.itemUsed) / hero.itemCooldown) * 48, 48);
            ctx2.globalAlpha = 1;
        }
    }

    for (en in enemies) {
        if ((now - enemies[en].lastAttack) > enemies[en].attackRate) {
            enemies[en].canAttack = true;
        }
    }

    if (hero.hasBuff) {
        if (now - hero.gotBuff > hero.buffExpire) {
            hero.hasBuff = false;
            hero.attackRate = 300;
        }
    }
};

var main = function () {
    var now = Date.now();
    var delta = now - then;

    update();
    walkCharacters();
    animateHero(now);
    render(now);

    refresh(now);
    if (damage_opacity != 0.003) damage_opacity -= 0.004;

    then = now;
};

    reset();
    var then = Date.now();
    setInterval(main, 1);