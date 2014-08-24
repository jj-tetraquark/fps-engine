/*
 * Base class of sorts. Shouldn't be called directly
 */

function Renderer(canvasElementId) {
    "use strict";

    var element = document.getElementById(canvasElementId);
    assert(element, "No such element with ID '" + canvasElementId + "'");
    assert(element.nodeName === "CANVAS", "Element with ID " + canvasElementId + " is not a canvas element");

    this._screen       = element;
    this._ctx          = element.getContext('2d');
    this._screenWidth  = this._screen.offsetWidth;
    this._screenHeight = this._screen.offsetHeight;

    this._playerPose = new Pose(-1,-1,0);
    this._map        = null;

    // Fix the drawable area dimensions
    this._screen.height = this._screenHeight;
    this._screen.width  = this._screenWidth;
}

Renderer.prototype.SetPlayerPose = function(pose) {
    "use strict";
    this._playerPose = pose;
    return this;
};

Renderer3D.prototype.SetMap = function(map) {
    "use strict";
    this._map = map;
    return this;
};

Renderer.prototype.Draw = function() {
    throw "Draw method is not implemented!";
};
