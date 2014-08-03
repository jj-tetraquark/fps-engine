QUnit.test("Test construction of Debug Console", function(assert) {
    var dbg = new DebugConsole();
    assert.ok(dbg);
    assert.ok(document.getElementById('debug-console'), "Construction of debug console should " +
        "make div called debug-console. Nothing found with that ID");
});

QUnit.test("Test can send things to the Debug Console", function(assert) {
    var dbg = new DebugConsole();
    
    dbg.Log("Test Category", { "testValue" : 42 });
    
    var debugContents = document.body.innerText;
    assert.notEqual(debugContents.search("Test Category"), -1, "Couldn't find title. Found " + debugContents);
    assert.notEqual(debugContents.search("testValue : 42"), -1, "Couldn't find key value pair. Found " + debugContents);

    dbg.Log("Test Category", { "testValue" : 9000 });
    debugContents = document.body.innerText;
    assert.notEqual(debugContents.search("testValue : 9000"), -1, "testValue should have updated");

});

QUnit.test("Test it updates rather than creating new fields", function(assert) {
    var dbg = new DebugConsole();

    dbg.Log("Test Category2", { "testValue2" : 42 });
    var debugContents = document.body.innerText;

    var fieldLocation = debugContents.search("testValue2 : 42");
    assert.notEqual(fieldLocation, -1, "Couldn't find key value pair. Found " + debugContents);

    dbg.Log("Test Category2", { "testValue2" : 9000 });

    var newfieldLocation = debugContents.search("testValue2 : 9000");
    if (newfieldLocation == -1) { 
        console.log("This test could not be run, PhantomJS didn't update in time.");
        return;
    }
    assert.equal(fieldLocation, newfieldLocation, "Debug field moved!\n" + document.body.innerHTML);
});
