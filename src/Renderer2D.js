function Renderer2D(canvasElementId) {
    var element = document.getElementById(canvasElementId);
    assert(element, "No such element with ID '" + canvasElementId + "'");
    assert(element.nodeName === "CANVAS", "Element with ID " + canvasElementId + " is not a canvas element");

    this.canvas = element;
    this.ctx    = element.getContext();
}
