// PhantomJS doesn't support bind yet
Function.prototype.bind = Function.prototype.bind || function (thisp) {
  var fn = this;
  return function () {
    return fn.apply(thisp, arguments);
  };
};

function GenerateMouseEvent(newX, newY) {
     var event = document.createEvent('MouseEvents'); // change this to use new MouseMove when phantom supports it
     event.initMouseEvent('mousemove', true, false, window, 0, 
             newX, newY, newX, newY, false, false, false, false, 0, null);
     document.dispatchEvent(event);
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
    var mouseXPos = inputManager._mouseXPosition;
    var mouseYPos = inputManager._mouseYPosition;
    GenerateMouseEvent(mouseXPos + 100, mouseYPos);

    movement = inputManager.GetInput();
    mouseXPos = inputManager._mouseXPosition;
    mouseYPos = inputManager._mouseYPosition;


    assert.equal(movement.mouseX, 100, "Mouse X movement should be 100");
    assert.equal(movement.mouseY, 0, "Mouse should not have registered as moving in Y direction");

    GenerateMouseEvent(mouseXPos, mouseYPos -200);
    movement = inputManager.GetInput();

    assert.equal(movement.mouseY, -200, "Mouse Y movement should be -200");
    assert.equal(movement.mouseX, 0, "Mouse should not have moved in X direction");

});

QUnit.test("Test mouse movement is zero after a movement and then a stop", function(assert) {
    var inputManager = new InputManager();
    
    GenerateMouseEvent(100, 400);
    movement = inputManager.GetInput();
    assert.notEqual(movement.mouseX, 0, "Should have registered movement");
    assert.notEqual(movement.mouseY, 0, "Should have registered movement");

    movement = inputManager.GetInput();
    assert.equal(movement.mouseX, 0, "There shouldn't have been any registered movement");
    assert.equal(movement.mouseY, 0, "There shouldn't have been any registered movement");

});
