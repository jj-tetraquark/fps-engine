QUnit.asyncTest("Test the loadJSON function", function(assert) {
    loadJSON('test.json', function(test_json) {
        assert.equal(test_json.TestValue, 42);
        QUnit.start();
    });
});
