QUnit.test("Test ray casting", function(assert) {

    var map = new Map([
                      [0,0,0,0,0],
                      [0,0,0,0,0],
                      [0,0,0,0,0], // player in this row
                      [0,0,0,0,0],
                      [0,0,0,1,0],
                      ]);
   
    var player = new Player().WithPose(1,2,0).OnMap(map);
    var renderer = new Renderer3D('testCanvas')
                        .SetPlayerPose(player.GetPose())
                        .SetMap(map);


    // Yeah I'm testing private methods, fuck you
    var rayDestination =  renderer._CastRay(Math.PI/4);
    assert.deepEqual(rayDestination, { X : 3, Y : 4 });

    // Let's try that again
    var map2 = new Map([
                       [1,0,0,0],
                       [0,0,0,0],
                       [0,0,0,0], // player on end of this road;
                       [0,0,0,0]
                       ]);

    player = new Player().WithPose(3,2,0).OnMap(map2);
    renderer.SetPlayerPose(player.GetPose()).SetMap(map2);

    rayDestination = renderer._CastRay(-2.16);
    assert.deepEqual(rayDestination, { X : 0, Y : 0 });

    // and again
    var map3 = new Map([
                       [0,0,1,0],
                       [0,0,0,0],
                       [0,0,0,0],
                       [0,0,0,0]
                       ]);

    player = new Player().WithPose(2,3,0).OnMap(map3);
    renderer.SetPlayerPose(player.GetPose()).SetMap(map3);

    rayDestination = renderer._CastRay(Math.PI);
    assert.deepEqual(rayDestination, { X : 2, Y : 0 });

    var map4 = new Map([
                       [0,0,0,0],
                       [0,0,0,0],
                       [0,0,0,0],
                       [1,0,0,0]
                       ]);

    player = new Player().WithPose(2,2,0).OnMap(map4);
    renderer.SetPlayerPose(player.GetPose()).SetMap(map4);

    rayDestination = renderer._CastRay(-Math.PI/4);
    assert.deepEqual(rayDestination, { X : 0, Y : 3 });

    // check out of range
    
    var map5 = new Map([
                       [0,0,0,0,0,0,0,0,0,1],
                       [0,0,0,0,0,0,0,0,0,0]
                       ]);

    player = new Player().WithPose(0,0,0).OnMap(map5);
    renderer.SetPlayerPose(player.GetPose()).SetMap(map5).WithFogAndDrawDistance(6,8);

    rayDestination = renderer._CastRay(Math.PI/2);
    assert.deepEqual(rayDestination, { X : Infinity, Y : Infinity });

});
