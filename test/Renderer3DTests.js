QUnit.test("Test ray casting", function(assert) {

    var map =  new Map([
                       [0,0,0,0,0],
                       [0,0,0,0,0],
                       [0,0,0,0,0], // player in this row
                       [0,0,0,0,0],
                       [0,0,0,1,0],
                       ]);
   
    var player = new Player().WithPose(1,2,0).OnMap(map);
    var renderer = new Renderer3D('testCanvas').SetPlayerPose(player.GetPose());
    
    assert.deepEqual(renderer._CastRay(-Math.PI/4), { X : 3, Y : 4 });
});
