/*
 * This file contains the main game loop logic
 */

function Game() {
    this.inputManager = new InputManager(); 
    window.DBG = new DebugConsole();

    this.startLoop();
}

Game.prototype.startLoop = function() {
    var onEachFrame;
    var self = this;
    if (window.webkitRequestAnimationFrame) {
        onEachFrame = function() {
            var loop = function() { 
                self.Loop(); 
                webkitRequestAnimationFrame(loop); 
            };
            loop();
        };
    } else if (window.mozRequestAnimationFrame) {
        onEachFrame = function() {
            var loop = function() { 
                self.Loop();
                mozRequestAnimationFrame(loop); 
            };
            loop();
        };
    } else {
        onEachFrame = function() {
            setInterval(self.Loop, 1000 / 60);
        };
    }

    onEachFrame();
};

Game.prototype.Loop = function() {
   var input = this.inputManager.GetInput(); 
   window.DBG.Log("User Input", input);
};



