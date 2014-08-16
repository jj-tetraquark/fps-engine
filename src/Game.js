/*
 * This file contains the main game loop logic
 * Much of the code here is just for testing
 */

function Game(element, minimap) {
    window.DBG = new DebugConsole();

    this.inputManager = new InputManager();
    this.map = new Map([
                       [0,0,0,0,0,0,0,0,0,0],
                       [0,0,0,0,0,0,0,0,0,0],
                       [0,0,1,1,0,0,1,1,0,0],
                       [0,0,1,1,0,0,1,1,0,0],
                       [0,0,0,0,0,0,1,1,0,0],
                       [0,0,0,0,0,0,1,1,0,0],
                       [0,0,1,1,0,0,1,1,0,0],
                       [0,0,1,1,0,0,1,1,0,0],
                       [0,0,0,0,0,0,0,0,0,0],
                       [0,0,0,0,0,0,0,0,0,0]
                       ]);
    this.player = new Player().WithPose(this.map.GetWallGridWidth()/2, this.map.GetWallGridHeight()/2, 0).OnMap(this.map);
    this.player.SetSensitivity(2);

    this.renderer = new Renderer3D(element);
    this.renderer.SetMap(this.map);
    this.renderer.SetPlayerPose(this.player.GetPose());

    // TODO: Tidy all this up
    if (minimap) {
        this.minimap = new Renderer2D(minimap);
        this.minimap.SetMap(this.map);
        this.minimap.SetPlayerPose(this.player.GetPose());
    }

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

    this.renderer.Draw();
    if (this.minimap) {
        this.minimap.Draw();
    }

    window.DBG.Log("User Input", input);
    window.DBG.Log("Details", { "FPS" : (1/frameTime).toFixed(2) });
    window.DBG.Log("Player pose", new Pose(playerPose.X, playerPose.Y, playerPose.Angle/Math.PI));
};
