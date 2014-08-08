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


    // Fix the drawable area dimensions
    this._screen.height = this._screenHeight;
    this._screen.width  = this._screenWidth;

//    this.canvas.addEventListener('click', this.canvas.requestPointerLock, false); // TODO : Get this working
}

Renderer3D.prototype.SetPlayerPose = function(pose) {
    this._playerPose = pose;
};

Renderer3D.prototype.SetMap = function(map) {
    this._map = map;
};


Renderer3D.prototype.Draw = function() {

};

Renderer3D.prototype.FullRedraw = function() {
    this.Draw();
};

Renderer3D.prototype._GetPlayerPose = function() {
    var r = this;
    return { 
        X     : r._playerPose.X * this._wallCellVisualSize,
        Y     : r._playerPose.Y * this._wallCellVisualSize,
        Angle : r._playerPose.Angle + Math.PI
    };
};

