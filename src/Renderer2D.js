function Renderer2D(canvasElementId) {
    var element = document.getElementById(canvasElementId);
    assert(element, "No such element with ID '" + canvasElementId + "'");
    assert(element.nodeName === "CANVAS", "Element with ID " + canvasElementId + " is not a canvas element");

    this._canvas        = element;
    this._ctx           = element.getContext();
    this._playerPose    = Pose(-1,-1,0);

//    this.canvas.addEventListener('click', this.canvas.requestPointerLock, false); // TODO : Get this working
}

Renderer2D.prototype.SetPlayerPose = function(pose) {
    this._playerPose = pose;
};


Renderer2D.prototype.Draw = function() {
     
};
