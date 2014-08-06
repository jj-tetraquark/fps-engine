/*
 * This file contains the main game loop logic
 * Much of the code here is just for testing
 */

function Game(element) {
    var size = 20;
    this.inputManager = new InputManager(); 
    this.map = new Map(size);
    this.player = new Player().WithPose(size/2,size/2,0).OnMap(this.map);
    this.renderer = new Renderer2D(element);
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



