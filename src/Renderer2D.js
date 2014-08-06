function Renderer2D(canvasElementId) {
    var element = document.getElementById(canvasElementId);
    assert(element, "No such element with ID '" + canvasElementId + "'");
    assert(element.nodeName === "CANVAS", "Element with ID " + canvasElementId + " is not a canvas element");

    this.canvas = element;
    this.ctx    = element.getContext();

//    this.canvas.addEventListener('click', this.canvas.requestPointerLock, false); // TODO : Get this working
}

Renderer2D.prototype.Draw = function() {
     
};
