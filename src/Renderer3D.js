// TODO - Make this and Renderer2D inherit from a base class Renderer. 
// This code is so WET right now I could make a crude laddish joke about it... but I won't


function Renderer3D(canvasElementId) {
    var element = document.getElementById(canvasElementId);
    assert(element, "No such element with ID '" + canvasElementId + "'");
    assert(element.nodeName === "CANVAS", "Element with ID " + canvasElementId + " is not a canvas element");

    this._screen        = element;
    this._ctx           = element.getContext('2d');
    this._screenWidth   = this._screen.offsetWidth;
    this._screenHeight  = this._screen.offsetHeight;

    this._resolution    = 320; // number of rays
    this._focalLength   = Math.PI/4;
    this._drawDistance  = 14;
    this._fogDistance   = 8;


    // Fix the drawable area dimensions
    this._screen.height = this._screenHeight;
    this._screen.width  = this._screenWidth;

//    this.canvas.addEventListener('click', this.canvas.requestPointerLock, false); // TODO : Get this working
}

Renderer3D.prototype.WithResolution = function(resolution) {
    this._resolution = resolution;
    return this;
};

Renderer3D.prototype.WithFogAndDrawDistance = function(fog, draw) {
    assert(draw > fog, "Fog distance can't be greater than the draw distance!");
    this._drawDistance = draw;
    this._fogDistance  = fog;
    return this;
};

Renderer3D.prototype.WithFocalLength = function(focalLength) {
    this._focalLength = focalLength;
    return this;
};

Renderer3D.prototype.SetPlayerPose = function(pose) {
    this._playerPose = pose;
    return this;
};

Renderer3D.prototype.SetMap = function(map) {
    this._map = map;
    return this;
};


Renderer3D.prototype.Draw = function() {
    
};

Renderer3D.prototype.FullRedraw = function() {
    this.Draw();
};

Renderer3D.prototype._DrawWallColumns = function() {
    for (var column = 0; column < this.resolution; column++) {
        // Imagine rays are coming from a distance, meeting at a point, crossing over and projecting
        // on a screen. focalLength is the distance between the point and the screen, focalWidth is
        // the distance of the projection from the centre. 

        var focalWidth = column / this.resolution -0.5; // We minus 0.5 because we want the centre angle to be 0
        var angle = Math.atan2(focalWidth, this._focalLength);

        var globalAngle = angle + this._playerPose.Angle;
        var rayTerminationCoords = this._CastRay(globalAngle);

    }
};

Renderer3D.prototype._CastRay = function(angle, stepLength) {
    stepLength = stepLength || 0.1;
    var stepX = Math.sin(angle);
    var stepY = Math.cos(angle);

    //floating point weirdness
    stepX = stepX.toDecPlaces(6);
    stepY = stepY.toDecPlaces(6);

    for (var step = 0; step < this._drawDistance; step += stepLength) {
        var x = this._playerPose.X + step * stepX;
        var y = this._playerPose.Y + step * stepY;

        if (this._map.HasWallAt(x,y)) {
            
            var intersection = this._map.GetWallIntersectionPoint(x - stepX, y - stepY, x, y);
            var distance     = this._map.GetDistance(this._playerPose.X, this._playerPose.Y, 
                                                     intersection.X, intersection.Y);
            
            return { X : x, Y: y, Distance: distance };
        }
    }
    return { X : Infinity, Y : Infinity, Distance: Infinity};
};

Renderer3D.prototype._DrawColumn = function(column, rayTerminationCoords, angle) {

};
