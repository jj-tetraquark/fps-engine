function InputManager() {
    // members
    this._mouseXPosition = screen.width/2;
    this._mouseYPosition = screen.height/2;
    this._mouseXMovement = 0;
    this._mouseYMovement = 0;
    this._upIsPressed    = false;

    // binds
    document.addEventListener('mousemove', this.OnMouseMove.bind(this), false);
    document.addEventListener('keydown'  , this.OnKeyDown.bind(this)  , false);
}

InputManager.prototype.GetInput = function() {
    input = {
            'mouseX': this._mouseXMovement,
            'mouseY': this._mouseYMovement,
            'up'    : this._upIsPressed
    };

    this._mouseXMovement = 0;
    this._mouseYMovement = 0;
    return input;
};

InputManager.prototype.OnMouseMove = function(event) {
   this._mouseXMovement = event.screenX - this._mouseXPosition;
   this._mouseYMovement = event.screenY - this._mouseYPosition;

   this._mouseXPosition = event.screenX;
   this._mouseYPosition = event.screenY;
};

InputManager.prototype.OnKeyDown = function(event) {
    switch (event.keyCode) {
        case 87: // W
            this._upIsPressed = true;
            break;
        default:
            break;
    }
};
