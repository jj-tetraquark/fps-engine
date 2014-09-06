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

QUnit.test("Test WallAtVertex", function(assert) {

    var testMap = new Map([
                          [0,0,0],
                          [0,1,0],
                          [0,0,0]
                          ]);

    assert.throws(function() { testMap.HasWallAtVertex(0.5, 0.5); },
        "Two non-integer coords, should have thrown an exception");

    assert.ok(!testMap.HasWallAtVertex(0, 0).result, "Should not have found wall");

    var test1 = testMap.HasWallAtVertex(1, 1.5);
    assert.ok(test1.result, "Should have found western wall");
    assert.equal(test1.normal, 1.5 * Math.PI, "Western wall should have normal angle of 1.5 PI");

    var test2 = testMap.HasWallAtVertex(1.5, 1);
    assert.ok(test2.result, "Should have found northern wall");
    assert.equal(test2.normal, Math.PI, "Western wall should have normal angle of PI");

    var test3 = testMap.HasWallAtVertex(2, 1.5);
    assert.ok(test3.result, "Should have found eastern wall");
    assert.equal(test3.normal, Math.PI / 2, "Western wall should have normal angle of PI/2");

    var test4 = testMap.HasWallAtVertex(1.5, 2);
    assert.ok(test4.result, "Should have found southern wall");
    assert.equal(test4.normal, 0, "Western wall should have normal angle of 0");
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

    var ray2 = map2.CastRay(-2.16, Pose(3,2,0), 14);
    rayDestination = { X : ray2.X, Y : Math.floor(ray2.Y) };
    assert.deepEqual(rayDestination, { X : 1, Y : 0 }, "Ray should terminate somewhere on the east-facing wall");

    // and again
    var map3 = new Map([
                       [0,0,1,0],
                       [0,0,0,0],
                       [0,0,0,0],
                       [0,0,0,0]
                       ]);

    var ray3 = map3.CastRay(Math.PI, Pose(2.2,3,0), 14);
    rayDestination = { X : ray3.X, Y : ray3.Y, Distance: ray3.Distance };
    assert.deepEqual(rayDestination, { X : 2.2, Y : 1, Distance: 2 }, "Ray should terminate on the south-facing wall");

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
    assert.deepEqual(rayDestination, { X : 1, Y : 1.5, Distance : 3, Normal : Math.PI/2 }, "Need to make sure you deal with non integer intersections");


    var map7 = new Map([
                       [0,0,0,0],
                       [0,0,1,0],
                       [0,0,0,0]
                       ]);

    rayDestination = map7.CastRay(Math.PI/2, Pose(1.2, 1.5), 8);
    assert.deepEqual(rayDestination, { X : 2, Y : 1.5, Distance : 0.8, Normal : 1.5 * Math.PI }, "Need to handle ray distances less than 1 grid unit");

    rayDestination = map7.CastRay(-Math.PI/2, Pose(1.2, 1.5, 0), 8);
    assert.deepEqual(rayDestination, { X : 0, Y : 1.5, Distance: 1.2, Normal : Math.PI/2 });
});
