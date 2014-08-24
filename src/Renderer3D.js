
function Renderer3D(canvasElementId) {
    Renderer.call(this, canvasElementId);

    this._resolution    = 320; // number of rays
    this._focalLength   = Math.PI/4;
    this._drawDistance  = 14;
    this._fogDistance   = 8;
    this._ambientLight  = 0;

    this._spacing        = this._screenWidth / this._resolution;
    this._columnWidth    = Math.ceil(this._spacing);

//    this.canvas.addEventListener('click', this.canvas.requestPointerLock, false); // TODO : Get this working
}

Renderer3D.prototype = Object.create(Renderer.prototype);
Renderer3D.prototype.constructor = Renderer3D;

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
    var leftOffset = this._screenWidth - Math.floor(column * this._spacing);
    var projectedWallColumn = this._ProjectImage(angle, ray.Distance);

    this._ctx.beginPath();
    this._ctx.globalAlpha = 1;
    this._ctx.fillStyle = '#CCCCCC'; // grey walls for now
    this._ctx.fillRect(leftOffset, projectedWallColumn.top, this._columnWidth, projectedWallColumn.height);

    // overlay shadow
    this._ctx.fillStyle = '#000000';
    this._ctx.globalAlpha = Math.max((ray.Distance + ray.Shadow) / this._fogDistance - this._ambientLight, 0);
    this._ctx.fillRect(leftOffset, projectedWallColumn.top, this._columnWidth, projectedWallColumn.height);

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
