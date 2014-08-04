QUnit.test("Test construction of Debug Console", function(assert) {
    var dbg = new DebugConsole();
    assert.ok(dbg);
    assert.ok(document.getElementById('debug-console'), "Construction of debug console should " +
        "make div called debug-console. Nothing found with that ID");
});

QUnit.test("Test can send things to the Debug Console", function(assert) {
    var dbg = new DebugConsole();
    
    dbg.Log("Test Category", { "testValue" : 42 });
    
    var debugContents = document.body.textContent;
    assert.notEqual(debugContents.search("Test Category"), -1, "Couldn't find title. Found " + debugContents);
    assert.notEqual(debugContents.search("testValue : 42"), -1, "Couldn't find key value pair. Found " + debugContents);

    dbg.Log("Test Category", { "testValue" : 9000 });
    debugContents = document.body.textContent;
    assert.notEqual(debugContents.search("testValue : 9000"), -1, "testValue should have updated");

});

QUnit.test("Test it updates rather than creating new fields", function(assert) {
    var dbg = new DebugConsole();

    dbg.Log("Test Category2", { "testValue2" : 42 });
    var debugContents = document.body.textContent;

    var fieldLocation = debugContents.search("testValue2 : 42");
    assert.notEqual(fieldLocation, -1, "Couldn't find key value pair. Found " + debugContents);

    dbg.Log("Test Category2", { "testValue2" : 9000 });

    debugContents = document.body.textContent;
    var newfieldLocation = debugContents.search("testValue2 : 9000");
    assert.equal(fieldLocation, newfieldLocation, "Debug field moved!\n" + document.body.innerHTML);
});

QUnit.test("Test logs numbers to fixed decimal places", function(assert) {
    var dbg = new DebugConsole();

    dbg.Log("Test Category 3", { "testValue3" : 42.12345 });
    var debugContents = document.body.textContent;

    var untruncated = debugContents.search("testValue3 : 42.12345");
    assert.equal(untruncated, -1, "Should not find untruncated value");

    var truncated = debugContents.search("testValue3 : 42.12");
    assert.notEqual(truncated, -1, "Should find truncated value");
});
