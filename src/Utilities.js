// Good ol' all-purpose assert
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


// Function rounds a number to a specified number of decimal places
Number.prototype.toDecPlaces = function(places) {
    var powerOfTen = Math.pow(10, places);
    var ans = this * powerOfTen;
    ans = Math.round(ans);
    ans /= powerOfTen;
    return ans;
};
