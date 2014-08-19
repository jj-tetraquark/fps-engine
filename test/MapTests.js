QUnit.test("Test construction of Map object", function(assert) {
    var testMap = new Map(10);
    assert.ok(testMap);
    assert.equal(testMap._wallGrid.length, 100);

    var testMap2 = new Map(10,20);
    assert.ok(testMap2);
    assert.equal(testMap2._wallGrid.length, 200);

    var testMap3 = new Map([
                            [0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0,0]
                            ]);

    assert.ok(testMap3);
    assert.equal(testMap3._wallGrid.length, 40);


});

QUnit.test("Test map grid accessor", function(assert) {
    var testMap = new Map([
                            [0,0,0],
                            [0,0,0],
                            [0,1,0]
                            ]);
    assert.ok(!testMap.HasWallAt(1,1), "Expect not to find a wall");
    assert.ok(testMap.HasWallAt(1,2), "Expect to find a wall");

    assert.ok(testMap.HasWallAt(-1,-1, "Outside map should be considered wall"));
    assert.ok(testMap.HasWallAt(3,3), "Outside map should be considered wall");
    assert.ok(testMap.HasWallAt(2,0), "Edge of map needs to be treated as a wall");
    assert.ok(testMap.HasWallAt(0,0), "Edge of map needs to be treated as a wall");

    assert.ok(testMap.HasWallAt(1.2, 2.9), "Expect to find a wall with non-integer coords");
});

QUnit.test("Test map randomiser", function(assert) {
    var testMap = new Map(100); // large to reduce statistical chance of generating an identical map
    var initialWallGrid = new Uint8Array(testMap._wallGrid);

    testMap.Randomize();
    assert.notDeepEqual(testMap._wallGrid, initialWallGrid);

});

QUnit.test("Test ray casting", function(assert) {

    var map = new Map([
                      [0,0,0,0,0],
                      [0,0,0,0,0],
                      [0,0,0,0,0], // player in this row
                      [0,0,0,0,0],
                      [0,0,0,1,0],
                      ]);

    var rayDestination =  map.CastRay(Math.PI/4, Pose(1,2,0), 14);
    var rayDestinationFloored = { X : Math.floor(rayDestination.X), Y : Math.floor(rayDestination.Y) };
    assert.deepEqual(rayDestinationFloored, { X : 3, Y : 4 });

    // Let's try that again
    var map2 = new Map([
                       [1,0,0,0],
                       [0,0,0,0],
                       [0,0,0,0], // player on end of this road;
                       [0,0,0,0]
                       ]);

    rayDestination = map2.CastRay(-2.16, Pose(3,2,0), 14);
    rayDestinationFloored = { X : Math.floor(rayDestination.X), Y : Math.floor(rayDestination.Y) };
    assert.deepEqual(rayDestinationFloored, { X : 0, Y : 0 });

    // and again
    var map3 = new Map([
                       [0,0,1,0],
                       [0,0,0,0],
                       [0,0,0,0],
                       [0,0,0,0]
                       ]);

    var ray = map3.CastRay(Math.PI, Pose(2,3,0), 14);
    rayDestination = { X : ray.X, Y : ray.Y, Distance: ray.Distance };
    assert.deepEqual(rayDestination, { X : 2, Y : 1, Distance: 2 }, "Ray should terminate on the south-facing wall");

    var map4 = new Map([
                       [0,0,0,0],
                       [0,0,0,0],
                       [0,0,0,0],
                       [1,0,0,0]
                       ]);

    rayDestination = map4.CastRay(-Math.PI/4, Pose(2,1,0), 14);
    rayDestinationFloored = { X : Math.floor(rayDestination.X), Y : Math.floor(rayDestination.Y) };
    assert.deepEqual(rayDestinationFloored, { X : 0, Y : 3 });

    // check out of range

    var map5 = new Map([
                       [0,0,0,0,0,0,0,0,0,1],
                       [0,0,0,0,0,0,0,0,0,0]
                       ]);

    rayDestination = map5.CastRay(Math.PI/2, Pose(0.1,0.1,0), 8);
    assert.deepEqual(rayDestination, { X : Infinity, Y : Infinity, Distance: Infinity});

    var map6 = new Map([
                       [0,0,0,0,0],
                       [1,0,0,0,0],
                       [0,0,0,0,0]
                       ]);

    rayDestination = map6.CastRay(-Math.PI/2, Pose(4, 1.5, 0), 8);
    assert.deepEqual(rayDestination, { X : 0, Y : 1.5, Distance : 4, Shadow : 1 }, "Need to make sure you deal with non integer intersections");

});
