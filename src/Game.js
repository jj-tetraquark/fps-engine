/*
 * This file contains the main game loop logic
 */

function Game() {
    this.inputManager = new InputManager(); 
    this.player = new Player().WithPose(20,20,0);
    window.DBG = new DebugConsole();

    this.startLoop();
}

Game.prototype.startLoop = function() {
    var onEachFrame;
    var self = this;
    if (requestAnimationFrame) {
        onEachFrame = function() {
            var loop = function(time) { 
                var seconds = (time - this.lastTime) / 1000;
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

Game.prototype.Loop = function(frameTime) {
    var input = this.inputManager.GetInput(); 
    this.player.HandleInput(input, frameTime);
    var playerPose = this.player.GetPose();

    window.DBG.Log("User Input", input);
    window.DBG.Log("Details", { "FPS" : (1/frameTime).toFixed(2) });
    window.DBG.Log("Player pose", playerPose );
};



