function InputManager() {
    // members
    this._mouseXPosition = screen.width/2;
    this._mouseYPosition = screen.height/2;
    this._mouseXMovement = 0;
    this._mouseYMovement = 0;

    // binds
    document.addEventListener('mousemove', this.OnMouseMove.bind(this), false);
}

InputManager.prototype.GetInput = function() {
    input = {
            'mouseX': this._mouseXMovement,
            'mouseY': this._mouseYMovement,
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

