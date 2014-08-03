QUnit.test("Test construction of player object", function(assert) {
    var player = new Player(Pose(0, 0, 0));
    assert.ok(player, "Should be able to construct a player object");
    assert.propEqual(player.GetPose(), Pose(0, 0, 0));
});

QUnit.test("Test setting player speed", function(assert) {
    var player = new Player(1, 2, 3).WithSpeed(2);
    assert.equal(player._speed, 2);
});
