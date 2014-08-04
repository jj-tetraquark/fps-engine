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
                            [0,0],
                            [0,1]
                            ]);
    assert.ok(!testMap.HasWallAt(0,0), "Expect not to find a wall");
    assert.ok(testMap.HasWallAt(1,1), "Expect to find a wall");

    assert.ok(testMap.HasWallAt(-1,-1, "Outside map should be considered wall"));
    assert.ok(testMap.HasWallAt(3,3, "Outside map should be considered wall"));
});

QUnit.test("Test map randomiser", function(assert) {
    var testMap = new Map(100); // large to reduce statistical chance of generating an identical map
    var initialWallGrid = new Uint8Array(testMap._wallGrid);

    testMap.Randomize();
    assert.notDeepEqual(testMap._wallGrid, initialWallGrid);
    
});
