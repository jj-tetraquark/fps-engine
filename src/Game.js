/*
 * This file contains the main game loop logic
 */

function Game() {
    this.inputManager = new InputManager(); 
    window.DBG = new DebugConsole();

    this.startLoop();
}

// may be able to replace vendor-sepecifics with requestAnimationFrame
Game.prototype.startLoop = function() {
    var onEachFrame;
    var self = this;
    if (requestAnimationFrame) {
        onEachFrame = function() {
            var loop = function(time) { 
                seconds = (time - this.lastTime) / 1000;
                this.lastTime = time;
                self.Loop(seconds); 
                requestAnimationFrame(loop); 
            };
            loop();
        };
    } else {
        onEachFrame = function() {
            setInterval(self.Loop.bind(1/60), 1000 / 60);
        };
    }

    onEachFrame();
};

Game.prototype.Loop = function(seconds) {
   var input = this.inputManager.GetInput(); 
   window.DBG.Log("User Input", input);
   window.DBG.Log("Details", { "FPS" : (1/seconds).toFixed(2) });
};



