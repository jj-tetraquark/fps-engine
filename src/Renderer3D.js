// TODO - Make this and Renderer2D inherit from a base class Renderer.
// This code is so WET right now I could make a crude laddish joke about it... but I won't


function Renderer3D(canvasElementId) {
    "use strict";
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
    this._ambientLight  = 0;

    this._width          = this._screenWidth;
    this._spacing        = this._width / this._resolution;
    this._columnWidth    = Math.ceil(this._spacing);


    // Fix the drawable area dimensions
    this._screen.height = this._screenHeight;
    this._screen.width  = this._screenWidth;

//    this.canvas.addEventListener('click', this.canvas.requestPointerLock, false); // TODO : Get this working
}

Renderer3D.prototype.WithResolution = function(resolution) {
    "use strict";
    this._resolution = resolution;
    this._spacing = this.width / this._resolution;
    this._columnWidth    = Math.ceil(this._spacing);
    return this;
};

Renderer3D.prototype.WithFogAndDrawDistance = function(fog, draw) {
    "use strict";
    assert(draw > fog, "Fog distance can't be greater than the draw distance!");
    this._drawDistance = draw;
    this._fogDistance  = fog;
    return this;
};

Renderer3D.prototype.WithFocalLength = function(focalLength) {
    "use strict";
    this._focalLength = focalLength;
    return this;
};

Renderer3D.prototype.SetPlayerPose = function(pose) {
    "use strict";
    this._playerPose = pose;
    return this;
};

Renderer3D.prototype.SetMap = function(map) {
    "use strict";
    this._map = map;
    return this;
};


Renderer3D.prototype.Draw = function() {
    "use strict";
    this._DrawBackdrop();
    this._DrawWalls();
};

Renderer3D.prototype.FullRedraw = function() {
    "use strict";
    this.Draw();
};

Renderer3D.prototype._DrawBackdrop = function() {
    "use strict";
    this._ctx.save();
    this._ctx.fillStyle = '#FFFFFF'; // In the white room, with black curtains, near the station
    this._ctx.fillRect(0,0, this._screenWidth, this._screenHeight);
    this._ctx.restore();
};

Renderer3D.prototype._DrawWalls = function() {
    "use strict";
    this._ctx.save();
    for (var column = 0; column < this._resolution; column++) {
        // Imagine rays are coming from a distance, meeting at a point, crossing over and projecting
        // on a screen. focalLength is the distance between the point and the screen, focalWidth is
        // the distance of the projection from the centre.

        var focalWidth = column / this._resolution -0.5; // We minus 0.5 because we want the centre angle to be 0
        var angle = Math.atan2(focalWidth, this._focalLength);

        var globalAngle = angle + this._playerPose.Angle;
        var ray = this._map.CastRay(globalAngle, this._playerPose, this._drawDistance);
        this._DrawWallColumn(column, ray, angle);
    }
    this._ctx.restore();
};


Renderer3D.prototype._DrawWallColumn = function(column, ray, angle) {
    "use strict";
    var leftOffset = Math.floor(column * this._spacing);
    var projectedWallColumn = this._ProjectImage(angle, ray.Distance);

    this._ctx.beginPath();
    this._ctx.globalAlpha = 1;
    this._ctx.fillStyle = '#CCCCCC'; // grey walls for now
    this._ctx.fillRect(leftOffset, projectedWallColumn.top, this._width, projectedWallColumn.height);

    // overlay shadow
    this._ctx.fillStyle = '#000000';
    this._ctx.globalAlpha = Math.max((ray.Distance + ray.Shadow) / this._fogDistance - this._ambientLight, 0);
    this._ctx.fillRect(leftOffset, projectedWallColumn.top, this._width, projectedWallColumn.height);

};

Renderer3D.prototype._ProjectImage = function(angle, distance, height) {
    "use strict";
    height = height || 1; // currently only walls, all the same height
    // cos to remove fisheye
    var z = distance * Math.cos(angle);
    // This assumes max wall height is 1. TODO: Make more general
    var projectedHeight = this._screenHeight * height / z;
    // Bottom of projection never goes above the horizon (screenheight/2);
    var projectedBottom = (this._screenHeight / 2) * (1 + (1 / z));
    return {
      "top"   : projectedBottom - projectedHeight,
      "height": projectedHeight
    };
};
