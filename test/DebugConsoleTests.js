QUnit.test("Test construction of Debug Console", function(assert) {
    dbg = new DebugConsole();
    assert.ok(dbg);
    assert.ok(document.getElementById('debug-console'), "Construction of debug console should " +
        "make div called debug-console. Nothing found with that ID");
});

