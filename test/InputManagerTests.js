// Custom event polyfill
(function () {
    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();

function GenerateMouseEvent(newX, newY) {
    var event = document.createEvent('MouseEvents'); // change this to use new MouseMove when phantomjs supports it
    event.initMouseEvent('mousemove', true, true, window, 0,
         newX, newY, newX, newY, false, false, false, false, 0, null);
    document.dispatchEvent(event);
}

// This currently doesn't work because movementX is readonly
function GenerateLockedMouseEvent(dX, dY) {
    var event = new MouseEvent('mousemove', {
                    movementX : dX,
                    movementY : dY,
                    webkitMovementX : dX,
                    webkitMovementY : dY,
                    mozMovementX : dX,
                    mozMovementY : dY
    });
    document.dispatchEvent(event);
}

function GenerateKeyboardEvent(key, upOrDown) {
    var eventType = upOrDown == 'up' ? 'keyup' : 'keydown';
    var keyCode;

    key = key.toUpperCase();

    if (key.length > 1) {
        switch (key) {
            case 'UP':
                keyCode = 38;
                break;
            case 'LEFT':
                keyCode = 37;
                break;
            case 'DOWN':
                keyCode = 40;
                break;
            case 'RIGHT':
                keyCode = 39;
                break;
            default:
                keyCode = 420;
                break;
        }
    } else {
        keyCode = key.charCodeAt();
    }
    var event = window.crossBrowser_initKeyboardEvent(eventType, { keyCode: keyCode});
    document.dispatchEvent(event);
}

function GeneratePointerLockEvent() {
    var event = CustomEvent('pointerlockchange', {}); // TODO: Maybe include tests for vendor prefixes

    if(document.pointerLockElement === null || typeof document.pointerLockElement === "undefined") {
        document.pointerLockElement = document.createElement('canvas');
    } else {
        document.pointerLockElement = null;
    }

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

    var movement = inputManager.GetInput();
    mouseXPos = inputManager._mouseXPosition;
    mouseYPos = inputManager._mouseYPosition;

    var expectedDX = 100/window.innerWidth;
    assert.equal(movement.mouseDX, expectedDX, "Mouse X movement should be " + (expectedDX * 100).toFixed(2) + "%");
    assert.equal(movement.mouseDY, 0, "Mouse should not have registered as moving in Y direction");

    GenerateMouseEvent(mouseXPos, mouseYPos -200);
    movement = inputManager.GetInput();

    var expectedDY = -200/window.innerHeight;
    assert.equal(movement.mouseDY, expectedDY, "Mouse Y movement should be " + (expectedDY * 100).toFixed(2) + "%");
    assert.equal(movement.mouseDX, 0, "Mouse should not have moved in X direction");

});

QUnit.test("Test mouse movement is zero after a movement and then a stop", function(assert) {
    var inputManager = new InputManager();

    GenerateMouseEvent(100, 400);
    var movement = inputManager.GetInput();
    assert.notEqual(movement.mouseDX, 0, "Should have registered movement");
    assert.notEqual(movement.mouseDY, 0, "Should have registered movement");

    movement = inputManager.GetInput();
    assert.equal(movement.mouseDX, 0, "There shouldn't have been any registered movement");
    assert.equal(movement.mouseDY, 0, "There shouldn't have been any registered movement");

});


QUnit.test("Test WASD keyboard input registers", function(assert) {
    var inputManager = new InputManager();

    try {
        var test = new KeyboardEvent('keydown');
        GenerateKeyboardEvent('W', 'down'); // apparently this doesn't fail with phantomjs...but it doesn't work
    }
    catch(e) {
        console.log("Some tests weren't run, custom key events not supported. Re-run a browser with: $ grunt test_extra");
        assert.ok(true, "Dummy test to get grunt qunit to pass");
        return;
    }

    var mappings = {
        'W' : 'up',
        'A' : 'left',
        'S' : 'down',
        'D' : 'right'
    };

    for (var key in mappings) {
        GenerateKeyboardEvent(key, 'down');
        var input = inputManager.GetInput();
        assert.ok(input[mappings[key]], key + " button was pressed, should have registered as '" + mappings[key] + "'");

        GenerateKeyboardEvent(key, 'up');
        input = inputManager.GetInput();
        assert.ok(!input[mappings[key]], key + " button was unpressed, '" + mappings[key] + "' should not be registered");
    }
});

QUnit.test("Test pointerlock and mouse movement", function(assert) {
    var inputManager = new InputManager();

    GeneratePointerLockEvent();

    // mouse clientX/Y does not change during a pointer lock so we need to unbind the event
    var mouseXPos = inputManager._mouseXPosition;
    var mouseYPos = inputManager._mouseYPosition;
    GenerateMouseEvent(mouseXPos + 100, mouseYPos + 100);

    var movement = inputManager.GetInput();
    assert.equal(movement.mouseDX, 0, "Pointer is locked, there shouldn't have been any registered clientX movement");
    assert.equal(movement.mouseDY, 0, "Pointer is locked, there shouldn't have been any registered clientY movement");

    // Can't test beyond this because MouseEvents are readonly

});
