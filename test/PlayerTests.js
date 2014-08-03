QUnit.test("Test construction of player object", function(assert) {
    var player = new Player(0, 0, 0);
    assert.ok(player, "Should be able to construct a player object");
});
