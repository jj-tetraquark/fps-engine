QUnit.test("Test construction of 2D Renderer", function(assert) {
    expect(3);

    var renderer = new Renderer2D('testCanvas');
    assert.ok(renderer, "Renderer should construct normally on canvas element 'testCanvas'");

    assert.throws(function() {
       var renderer = new Renderer2D('noSuchID'); 
    }, "Should throw exception on non-existent canvas");

    assert.throws(function() {
        var renderer = new Renderer2D('fakeCanvas');
    }, "Should throw exception on non-canvas element");
});

QUnit.test("Test can set reference to player pose", function(assert) {
    
    var mockPlayer = {
        pose    : Pose(3,4,0),
        GetPose : function() { return this.pose; }
    };

    var renderer = new Renderer2D('testCanvas');
    renderer.SetPlayerPose(mockPlayer.GetPose());
    
    assert.deepEqual(renderer._playerPose, mockPlayer.GetPose());

    // make sure it's a reference and not a copy
    mockPlayer.pose.X += 1;
    assert.deepEqual(renderer._playerPose, mockPlayer.GetPose());
});
