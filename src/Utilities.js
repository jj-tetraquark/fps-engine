function assert(condition, exception) {
    if (!condition) {
        throw exception;
    }
}

// Function to load an external json file
function loadJSON(path, callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true); 
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            var json = JSON.parse(xobj.responseText);
            callback(json);
        }
    };
    xobj.send(null);  
}
