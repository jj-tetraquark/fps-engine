QUnit.test("Test construction of 2D Renderer", function(assert) {
    expect(3);

    var renderer = new Renderer2D('testCanvas');
    assert.ok(renderer, "Renderer should construct normally on canvas element 'testCanvas'");

    assert.throws(function() {
       var renderer = new Renderer2D('noSuchID'); 
    }, "Should throw exception on non-existent canvas");

    assert.throws(function() {
        var renderer = new Renderer2D('fakeCanvas');
    }, "Should throw exception on non-canvas element");
});
