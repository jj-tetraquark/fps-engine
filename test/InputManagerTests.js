function GenerateMouseEvent(newX, newY) {
     var event = document.createEvent('MouseEvents'); // change this to use new MouseMove when phantom supports it
     event.initMouseEvent('mousemove', true, false, window, 0, 
             newX, newY, newX, newY, false, false, false, false, 0, null);
     window.dispatchEvent(event);
}


QUnit.test("Test can construct InputManager", function(assert) {
    var inputManager = new InputManager();
    assert.notEqual(inputManager, null);
});

QUnit.test("Test mouseXPosition and mouseYPosition are initialised to center of screen", function(assert) {
    var inputManager = new InputManager();
    assert.equal(inputManager._mouseXPosition, screen.width/2);
    assert.equal(inputManager._mouseYPosition, screen.height/2);
});

QUnit.test("Test InputManager captures and handles mouse movement", function(assert) {
    var inputManager = new InputManager();
    mouseX = inputManager._mouseXPosition;
    mouseY = inputManager._mouseYPosition;
    GenerateMouseEvent(mouseX + 100, mouseY);

    movement = inputManager.GetInput();
    assert.equal(movement.mouseX, 100);
});
