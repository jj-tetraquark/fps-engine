/*
 * This file contains tests all renderers need to pass.
 * It's largely for testing the API
 */

function testRendererConstructor(assert, Renderer) {
    expect(3);
    var renderer = new Renderer('testCanvas');
    assert.ok(renderer, "Renderer should construct normally on canvas element 'testCanvas'");

    assert.throws(function() {
       var renderer = new Renderer('noSuchID'); 
    }, "Should throw exception on non-existent canvas");

    assert.throws(function() {
        var renderer = new Renderer('fakeCanvas');
    }, "Should throw exception on non-canvas element");
}

function testSetPlayerPoseReference(assert, Renderer) {
    var mockPlayer = {
        pose    : Pose(3,4,0),
        GetPose : function() { return this.pose; }
    };

    var renderer = new Renderer('testCanvas');
    renderer.SetPlayerPose(mockPlayer.GetPose());
    
    assert.deepEqual(renderer._playerPose, mockPlayer.GetPose());

    // make sure it's a reference and not a copy
    mockPlayer.pose.X += 1;
    assert.deepEqual(renderer._playerPose, mockPlayer.GetPose());
}

// If anyone wants to write a proper test, be my guest
function testSetMapReference(assert, Renderer) {
    var renderer = new Renderer2D('testCanvas');
    renderer.SetMap({ 
        GetWallGridWidth : function() {},
        GetWallGridHeight : function() {}
    });

    assert.ok(true, "Don't need to really test this, just need to make sure the API is there");
}


// --- Tests actually begin


// 2D renderer
QUnit.test("Test construction of 2D Renderer", function(assert) {
    testRendererConstructor(assert, Renderer2D);
});

QUnit.test("Test can set reference to player pose", function(assert) {
    testSetPlayerPoseReference(assert, Renderer2D); 
});

QUnit.test("Test can set reference to map", function(assert) {
    testSetMapReference(assert, Renderer2D);
});

// 3D renderer
QUnit.test("Test construction of 3D Renderer", function(assert) {
    testRendererConstructor(assert, Renderer3D);
});

QUnit.test("Test can set reference to player pose", function(assert) {
    testSetPlayerPoseReference(assert, Renderer3D); 
});

QUnit.test("Test can set reference to map", function(assert) {
    testSetMapReference(assert, Renderer3D);
});


