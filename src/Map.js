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

    this._rayCaster = new GridMapRayCaster(this);
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

Map.prototype.CastRay = function(angle, origin, range) {
    return this._rayCaster.Cast(angle, origin, range);
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


// Should probably split this bit out, however it is a raycaster that will only work with
// the map class above. If you write a new map, you'll need a raycaster to fit it.
function GridMapRayCaster(map) {
    this._angle = 0;
    this._origin = {};
    this._range2 = 0; // squared
    this._map = map;
    this._dx = 0;
    this._dy = 0;
    this._gradient = 0;
    this.y_intercept = 0;
}

GridMapRayCaster.prototype.Cast = function(angle, origin, range) {
    this._angle = angle;
    this._origin = origin;
    this._range2 = Math.pow(range, 2);

    this._dx = Math.sin(angle);
    this._dy = Math.cos(angle);
    this._gradient = (this._dy/this._dx).toDecPlaces(6);

    var rayDistance2 = 0;
    var nextIntersection = this.GetNextGridLineIntersection(this._origin);

    var x = 0;
    do {
        if (this._map.HasWallAt(nextIntersection.X, nextIntersection.Y)) {
            return {
                X : nextIntersection.X,
                Y : nextIntersection.Y,
                Distance : Math.sqrt(rayDistance2)
            };
        }

        nextIntersection = this.GetNextGridLineIntersection(nextIntersection);
        rayDistance2 = Math.pow(nextIntersection.X - this._origin.X, 2) + Math.pow(nextIntersection.Y - this._origin.Y, 2);

        x++;
    } while (rayDistance2 <= this._range2 && x < 2000);

    return {
        X : Infinity,
        Y : Infinity,
        Distance : Infinity
    };
};

GridMapRayCaster.prototype.GetNextGridLineIntersection = function(localOrigin) {
    var nextXIntersection = this.GetNextXIntersection(localOrigin);
    var nextYIntersection = this.GetNextYIntersection(localOrigin);
    return (nextXIntersection.distance2 < nextYIntersection.distance2) ? nextXIntersection : nextYIntersection;
};

GridMapRayCaster.prototype.GetNextXIntersection = function(localOrigin) {
    if (this._dx === 0) {
        return { X : localOrigin.X, Y : Infinity, distance2 : Infinity };
    }
    var nextXVertex = (this._dx > 0) ? Math.floor(localOrigin.X + 1) : Math.ceil(localOrigin.X - 1);

    var changeInX = nextXVertex - localOrigin.X;
    var changeInY = changeInX * this._gradient;

    var distance2 = Math.pow(changeInX, 2) + Math.pow(changeInY, 2);
    return {
        X : nextXVertex,
        Y : localOrigin.Y + changeInY,
        distance2 : distance2
    };
};

GridMapRayCaster.prototype.GetNextYIntersection = function(localOrigin) {
    if (this._dy === 0) {
        return { X : Infinity, Y : localOrigin.Y, distance2 : Infinity };
    }
    var nextYVertex = (this._dy > 0) ? Math.floor(localOrigin.Y + 1) : Math.ceil(localOrigin.Y - 1);

    var changeInY = nextYVertex - localOrigin.Y;
    var changeInX = changeInY / this._gradient;

    var distance2 = Math.pow(changeInX, 2) + Math.pow(changeInY, 2);
    return {
        X : localOrigin.X + changeInX,
        Y : nextYVertex,
        distance2 : distance2
    };
};
