function InputManager() {
    //public

    //private
    this._mouseXPosition = screen.width/2;
    this._mouseYPosition = screen.height/2;
}

InputManager.prototype.GetInput = function() {
    return {
            'mouseX': this._mouseXMovement,
            'mouseY': this._mouseYMovement,
    };
};

