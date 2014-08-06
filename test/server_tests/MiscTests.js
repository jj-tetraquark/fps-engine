QUnit.asyncTest("Test the loadJSON function", function(assert) {
    loadJSON('test.json', function(test_json) {
        assert.equal(test_json.TestValue, 42);
        QUnit.start();
    });
});

QUnit.test("Test the assert function", function(qassert) {
    expect(2);
    qassert.throws(function() {
        assert(false, "Exception!");
    }, "Asserted false, should have thrown");

    assert(true, "This should not be thrown");
    qassert.ok("Should not have asserted again");
});
