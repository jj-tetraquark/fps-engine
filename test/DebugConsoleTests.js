QUnit.test("Test construction of Debug Console", function(assert) {
    dbg = new DebugConsole();
    assert.ok(dbg);
    assert.ok(document.getElementById('debug-console'), "Construction of debug console should " +
        "make div called debug-console. Nothing found with that ID");
});

QUnit.test("Test can send things to the Debug Console", function(assert) {
    dbg = new DebugConsole();
    
    dbg.log("Test Category", { "testValue" : 42 });
    
    debugContents = document.body.innerText;
    assert.notEqual(debugContents.search("Test Category"), -1, "Couldn't find title. Found " + debugContents);
    assert.notEqual(debugContents.search("testValue : 42"), -1, "Couldn't find key value pair. Found " + debugContents);

});
