function Map(lengthOrJson, height) {

    assert(lengthOrJson !== undefined, "Did not specify map size");
        
    if (typeof(lengthOrJson) === "number") {
        if (height === undefined) {
            this._wallGrid = new Uint8Array(lengthOrJson * lengthOrJson);
            this._wallGridHeight = lengthOrJson;
        } else {
            this._wallGrid = new Uint8Array(lengthOrJson * height);
            this._wallGridHeight = height;
        }
        this._wallGridWidth = lengthOrJson;
    } else {
        this.AssignFromJson(lengthOrJson);
    }
}

Map.prototype.AssignFromJson = function(json) {
    this._wallGrid = new Uint8Array(json[0].length * json.length);
    this._wallGridWidth = json[0].length;
    this._wallGridHeight = json.length;
    for (var y = 0; y < this._wallGridHeight; y++) {
        for (var x = 0; x < this._wallGridWidth; x++) {
            this._Assign(x, y, json[y][x]);
        }
    }
};

Map.prototype.Randomize = function(json) {
    for (var i = 0; i < this._wallGrid.length; i++) {
        this._wallGrid[i] = (Math.random() > 0.8) ? 1 : 0;
    }
};

Map.prototype.HasWallAt = function(x,y) {
    if (this._CoordsOutOfRange(x, y)) { 
        // If the element is outside the map, it's treated as wall
        return true;
    }
    return this._ElementAt(x, y) > 0;
};

// TODO make this more efficient and refactor
Map.prototype.GetWallIntersectionPoint = function(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    
    var gradient = dy/dx;
    var c = y1 - gradient*x1; // y - m*x = c;

    var minX = Math.min(x1, x2);
    var maxX = Math.max(x1, x2);
    var minY = Math.min(y1, y2);
    var maxY = Math.max(y1, y2);

    function getYCoord(x) {
        if(!isFinite(gradient)) {
            return Infinity;
        }
        return gradient * x + c;
    }

    function getXCoord(y) {
        if(!isFinite(gradient)) {
            return x1;
        }
        return (y - c)/gradient;
    }

    function isWithinBounds(x, y) {
        return (x >= minX && x <= maxX) && (y >= minY && y <= maxY);
    }

    // TODO - shouldn't have to check every single one, should be able
    // to infer which vertex from ray trajectory. 
    // Lines that define the wall cell that's been intersected
    var yBoxTop     = Math.ceil(y2);
    var yBoxBottom  = Math.ceil(y2);
    var xBoxLeft    = Math.floor(x2);
    var xBoxRight   = Math.ceil(x2);

    // run each through the line equation and see if answers are within bounds
    var intersections = [ { X: getXCoord(yBoxTop)   , Y: yBoxTop },
                          { X: getXCoord(yBoxBottom), Y: yBoxBottom},
                          { X: xBoxLeft             , Y: getYCoord(xBoxLeft)},
                          { X: xBoxRight            , Y: getYCoord(xBoxRight)}
    ];

    for (var i = 0; i < intersections.length; i++) {
        var coord = intersections[i];
        if (isWithinBounds(coord.X, coord.Y)) {
            return coord;
        }
    }
};

Map.prototype.GetDistance = function(x1, y1, x2, y2) {
    // pythagorus
    var side1Squared = Math.pow(x1 - x2, 2);
    var side2Squared = Math.pow(y1 - y2, 2);
    return Math.sqrt(side1Squared + side2Squared);
};

Map.prototype.GetWallGridWidth = function() {
    return this._wallGridWidth;
};

Map.prototype.GetWallGridHeight = function() {
    return this._wallGridHeight; 
};

Map.prototype._ElementAt = function(x,y) {
    var xFloor = Math.floor(x);
    var yFloor = Math.floor(y); 
    return this._wallGrid[yFloor * this._wallGridWidth + xFloor];
};

Map.prototype._Assign= function(x, y, value) {
    this._wallGrid[y * this._wallGridWidth + x] = value;
};

Map.prototype._CoordsOutOfRange = function(x, y) {
    return (x > this._wallGridWidth - 1 || x < 0 || y > this._wallGridHeight - 1 || y < 0);
};
