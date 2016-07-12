var canvaswrapper = document.getElementById("map_canvas");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

canvas.width = 626;
canvas.height = 659;

canvaswrapper.appendChild(canvas);


var canvaswrapper2 = document.getElementById("map");
var canvas2 = document.createElement("canvas");
var ctx2 = canvas2.getContext("2d");

canvas2.width = 608;
canvas2.height = 608;

canvaswrapper2.appendChild(canvas2);


var canvaswrapper3 = document.getElementById("right");
var canvas3 = document.createElement("canvas");
var ctx3 = canvas3.getContext("2d");

canvas3.width = 80;
canvas3.height = 100;

canvaswrapper3.appendChild(canvas3);

TILE_SIZE = 32;
TILE_COUNT_X = Math.floor(canvas2.width / TILE_SIZE);
TILE_COUNT_Y = Math.floor(canvas2.height / TILE_SIZE);

var drawerPosX = 0;
var drawerPosY = 0;
var selectedTileX = 0;
var selectedTileY = 0;
var mouseDown = false;
var tilesReady = false;
var tilesDrawn = false;
var tilesImage = new Image();
tilesImage.onload = function () {
    tilesReady = true;
};
tilesImage.src = "img/tiles/summertiles.png";

function describeTexture(e) {
    getCursorPosition(e);
}

canvas.addEventListener("click", describeTexture, false);
canvas2.addEventListener("mousedown", function () { mouseDown = true; }, false);
canvas2.addEventListener("mouseup", function () { mouseDown = false; }, false);
canvas2.addEventListener("mousemove", drawTexture, false);
canvas2.addEventListener("click", getCursor2Position, false);


var main = function () {
    if (tilesReady) {
        ctx.drawImage(tilesImage, 0, 0);
    }
};

function drawTexture(e) {
    if (mouseDown) { getCursor2Position(e); }
}

function getCursorPosition(e) {
    var x, y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft +
           document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop +
           document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    x = Math.floor(x / 33);
    y = Math.floor(y / 33);

    if ((x < 20) && (y < 21)) {
        selectedTileX = x;
        selectedTileY = y;
        drawBrushTile(10,10);
    }

    return;
}

var tiles = {};

function isWalkable(tile) {

    if ((tile >= 16) && (tile <= 87)) { return false; }
    if ((tile >= 102) && (tile <= 125)) { return false; }
    if ((tile >= 127) && (tile <= 165)) { return false; }
    if ((tile >= 167) && (tile <= 179)) { return false; }
    if ((tile >= 206) && (tile <= 237)) { return false; }
    if ((tile >= 300) && (tile <= 333)) { return false; }

    return true;
}

function Tile(tex, walk) {
    this.tex = tex;
    this.walk = walk;
}

function getCursor2Position(e) {
    var x, y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft +
           document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop +
           document.documentElement.scrollTop;
    }
    x -= canvas2.offsetLeft;
    y -= canvas2.offsetTop;

    x = Math.floor(x / 32);
    y = Math.floor(y / 32);

    drawTile(x * TILE_SIZE, y * TILE_SIZE);
    
    tiles[TILE_COUNT_X * y + x] = new Tile(TILE_COUNT_X * selectedTileY + selectedTileX,
    isWalkable(TILE_COUNT_X * selectedTileY + selectedTileX));

    return;
}

function exportmap() {
    var textArea = document.getElementById("mapText");
    textArea.textContent = "";
    textArea.textContent = "textures: [";
    for (var i = 0; i < TILE_COUNT_X * TILE_COUNT_Y; i++) {
        if (tiles[i] != null)
            textArea.textContent += tiles[i].tex + ",";
    }
    textArea.textContent += "],walking: [";
    for (var i = 0; i < TILE_COUNT_X * TILE_COUNT_Y; i++) {
        if (tiles[i] != null)
            textArea.textContent += tiles[i].walk + ",";
    }
    textArea.textContent += "]";
};

function drawTile(x,y) {
    ctx2.drawImage(tilesImage, selectedTileX * 32 + selectedTileX, selectedTileY * 32 + selectedTileY, 32, 32, x, y, 32, 32);
};

function drawBrushTile(x,y) {
    ctx3.drawImage(tilesImage, selectedTileX * 32 + selectedTileX, selectedTileY * 32 + selectedTileY, 32, 32, x, y, 32, 32);
};

setInterval(main, 1);