QUnit.test("Test construction of player object", function(assert) {
    var player = new Player();
    assert.ok(player, "Should be able to construct a player object");
    assert.propEqual(player.GetPose(), Pose(0, 0, 0), "Defualt player pose should be (0,0,0)"); 
    assert.equal(player._speed, 1, "Defualt player speed should be 1");
});

QUnit.test("Test setting new player speed", function(assert) {
    var player = new Player().WithSpeed(2);
    assert.equal(player._speed, 2);
});

QUnit.test("Test setting new player Pose", function(assert) {
    var player = new Player().WithPose(4, 5, 3.14);
    assert.propEqual(player.GetPose(), Pose(4, 5, 3.14), "Should have set player pose to (4, 5, 3.14). Pose is " +  player.GetPose());
});

QUnit.test("Test setting player Map", function(assert) {
    var mockMap = { mutableValue : 42 };
    var player = new Player().OnMap(mockMap);
    
    assert.propEqual(player._map, mockMap);
    
    // make sure it's a reference and not a copy
    mockMap.mutableValue++;
    assert.equal(player._map.mutableValue, mockMap.mutableValue, "Updates to the world map should be known by player");
});

QUnit.test("Test player translation movement", function(assert) {
    var player = new Player().WithPose(5, 5, 0);
    var mockInput = { mouseDX : 0, mouseDY : 0, up : true, left : false, down : false, right : false };

    // Test moving forwards
    player.HandleInput(mockInput, 0.1);
    assert.propEqual(player.GetPose(), Pose(5, 5.1, 0));

    // backwards
    mockInput.up    = false;
    mockInput.down  = true;
    player.HandleInput(mockInput, 0.1);
    assert.propEqual(player.GetPose(), Pose(5, 5, 0));

    // rotate and try again
    player = new Player().WithPose(5, 5, Math.PI/2);
    mockInput.up    = true;
    mockInput.down  = false;
    player.HandleInput(mockInput, 0.1);
    assert.propEqual(player.GetPose(), Pose(5.1, 5, Math.PI/2));
});

QUnit.test("Test player strafing", function(assert) {
    var player = new Player().WithPose(5, 5, 0);
    var mockInput = { mouseDX : 0, mouseDY : 0, up : false, left : false, down : false, right : false };

    mockInput.left = true;
    player.HandleInput(mockInput, 0.1);
    assert.propEqual(player.GetPose(), Pose(4.9, 5, 0), "Player should have shifted to the left");

    mockInput.left  = false;
    mockInput.right = true;
    player.HandleInput(mockInput, 0.2);
    assert.propEqual(player.GetPose(), Pose(5.1, 5, 0), "Player should have shifted to the right");

    player = new Player().WithPose(5, 5, Math.PI/2);
    mockInput.left = false;
    mockInput.right = true;
    player.HandleInput(mockInput, 0.1);
    assert.propEqual(player.GetPose(), Pose(5, 4.9, Math.PI/2), "Player should have shifted to the right");
    
    mockInput.left = true;
    mockInput.right = false;
    player.HandleInput(mockInput, 0.2);
    assert.propEqual(player.GetPose(), Pose(5, 5.1, Math.PI/2), "Player should have shifted to the left");
});

QUnit.test("Test wall collision", function(assert) {
    var mockMap =  { HasWallAt : function(x, y) { return true; } };
    var mockInput = { mouseDX : 0, mouseDY : 0, up : false, left : false, down : false, right : false };
    mockInput.up = true;
    mockInput.left = true;

    var player = new Player().WithPose(5, 5, 0).OnMap(mockMap);
    player.HandleInput(mockInput, 0.1);

    assert.propEqual(player.GetPose(), Pose(5, 5, 0), "There are walls everywhere! Player should not have moved");

});

QUnit.test("Test player rotation", function(assert) {
    var player = new Player().WithPose(5, 5, 0);
    var mockInput = { mouseDX : 0, mouseDY : 0, up : false, left : false, down : false, right : false };

    mockInput.mouseDX = 0.25;
    player.HandleInput(mockInput, 0.1);
    assert.equal(player.GetPose().Angle, Math.PI/2, "At default sensitivity, movement across 1/4 screen width is 1/4 of a circle");

    player.SetSensitivity(2);
    mockInput.mouseDX = -0.25;
    player.HandleInput(mockInput, 0.1);
    assert.equal(player.GetPose().Angle, -Math.PI/2, "At twice default sensitivity, movement should be twice as far");
    
});
