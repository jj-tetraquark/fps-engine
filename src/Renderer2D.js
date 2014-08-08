// Note for future refactoring. Current design knows too much about the format of the map.
// It knows it's a grid of cells. There should be some sort of abstraction layer so the
// format of the map can change but the renderer remains the same.


function Renderer2D(canvasElementId) {
    var element = document.getElementById(canvasElementId);
    assert(element, "No such element with ID '" + canvasElementId + "'");
    assert(element.nodeName === "CANVAS", "Element with ID " + canvasElementId + " is not a canvas element");

    this._screen        = element;
    this._ctx           = element.getContext('2d');
    this._screenWidth   = this._screen.offsetWidth;
    this._screenHeight  = this._screen.offsetHeight;

    // We prerender certain elements for great justice
    this._preRenderedWallGrid = document.createElement('canvas');
    this._preRenderedPlayer   = document.createElement('canvas');

    this._playerPose           = Pose(-1,-1,0);
    this._map                  = null;
    this._wallCellVisualSize   = 0; // TODO consider renaming this to something like "gridMultiplier" or "gridToScreenRatio"
    this._wallGridVisualWidth  = 0;
    this._wallGridVisualHeight = 0;
    
    // Fix the drawable area dimensions
    this._screen.height = this._screenHeight;
    this._screen.width  = this._screenWidth;

//    this.canvas.addEventListener('click', this.canvas.requestPointerLock, false); // TODO : Get this working

    this._PreRenderPlayerAvatar();
}

Renderer2D.prototype.SetPlayerPose = function(pose) {
    this._playerPose = pose;
};

Renderer2D.prototype.SetMap = function(map) {
    this._map = map;
    
    this._CalculateWallGridVisualDimensions();
    this._PreRenderWallGrid();
};


Renderer2D.prototype.Draw = function() {
    this._ctx.clearRect(0, 0, this._screenWidth, this._screenHeight);
    this._ctx.drawImage(this._preRenderedWallGrid, 0, 0);
    this._ctx.save();

    var playerPose = this._GetPlayerPose();

    this._ctx.translate(playerPose.X, playerPose.Y);
    this._ctx.rotate(-this._GetPlayerPose().Angle);  // I'm not entirely sure why this is -ve other than it's fucked without it. 
    this._ctx.drawImage(this._preRenderedPlayer, -10, -10, 20, 20);
    this._ctx.restore();
};

Renderer2D.prototype.FullRedraw = function() {
    this._PreRenderWallGrid();
    this.Draw();
};

// TODO Make this call a function that's passed in. People can pass in their own
// grid renderers
Renderer2D.prototype._PreRenderWallGrid = function() {
    this._preRenderedWallGrid.width = this._wallGridVisualWidth;
    this._preRenderedWallGrid.height = this._wallGridVisualHeight;
    var ctx = this._preRenderedWallGrid.getContext('2d');
    
    this._DrawGrid(ctx);
    this._DrawWalls(ctx);
};

// TODO Same goes for this one, developers can define their own player renderers
Renderer2D.prototype._PreRenderPlayerAvatar = function() {
    this._preRenderedPlayer.width = 100;
    this._preRenderedPlayer.height = 100;

    var ctx = this._preRenderedPlayer.getContext('2d');

    ctx.fillStyle = "#EB3838";
    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.lineTo(100,100);
    ctx.quadraticCurveTo(50,80,0,100);
    ctx.lineTo(50,0);
    ctx.fill();
};


Renderer2D.prototype._CalculateWallGridVisualDimensions = function() {

    // The wall grid is an int x int grid. 
    var numberOfWallGridColumns = this._map.GetWallGridWidth();
    var numberOfWallGridRows    = this._map.GetWallGridHeight();

    var maxCellWidth = this._screenWidth / numberOfWallGridColumns;
    var maxCellHeight = this._screenHeight / numberOfWallGridRows;

    this._wallCellVisualSize = (maxCellWidth < maxCellHeight) ? maxCellWidth : maxCellHeight;
    
    this._wallGridVisualWidth = this._wallCellVisualSize * numberOfWallGridRows;
    this._wallGridVisualHeight = this._wallCellVisualSize * numberOfWallGridRows;
};

Renderer2D.prototype._DrawGrid = function(ctx) {
    for (var x = 0; x <= this._wallGridVisualWidth ; x += this._wallCellVisualSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this._wallGridVisualHeight);
    }

    for (var y = 0; y < this._wallGridVisualHeight; y += this._wallCellVisualSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(this._wallGridVisualWidth, y);
    }
    ctx.strokeStyle = "#ddd"; // TODO: Paramaterise
    ctx.stroke();
};

Renderer2D.prototype._DrawWalls = function(ctx) {
    // Draw walls
    for (var x = 0; x < this._map.GetWallGridWidth(); x++) {
        for (var y = 0; y < this._map.GetWallGridHeight(); y++) {
            if (this._map.HasWallAt(x,y)) {
                var x1 = x * this._wallCellVisualSize;
                var y1 = y * this._wallCellVisualSize;
                ctx.fillRect(x1, y1, this._wallCellVisualSize, this._wallCellVisualSize);
            }
        }
    }
};

Renderer2D.prototype._GetPlayerPose = function() {
    var r = this;
    return { 
        X     : r._playerPose.X * this._wallCellVisualSize,
        Y     : r._playerPose.Y * this._wallCellVisualSize,
        Angle : r._playerPose.Angle + Math.PI
    };
};

