function DebugConsole() {
    // create the window
    var debugConsole = document.createElement('div');
    debugConsole.id = 'debug-console';

    this._window = document.body.appendChild(debugConsole);
    this._debugCategories = [];
}

DebugConsole.prototype.log = function(category, object) {
    
    var existingCategoryInWindow = this._window.querySelector('#' + category);
    // update existing
    var key, valueContainer;
    if (existingCategoryInWindow) {
        for (key in object) {
            valueContainer = existingCategoryInWindow.querySelector('#' + key);
            if (valueContainer) {
                valueContainer.innerText = object[key];
            } else {
                console.warn("Error! No such category in debug console");
            }
        } 
    } else { // create new category
        var newCategory = document.createElement('p'); 
        newCategory.id = category;

        var categoryTitle = document.createElement('h4');
        categoryTitle.innerText = category;
        categoryTitle.style.marginBottom = 0;
        newCategory.appendChild(categoryTitle);

        for (key in object) {
            var valueLabel = document.createElement('span');
            valueLabel.innerText = key + " : ";
            valueContainer = document.createElement('span');
            valueContainer.id = key;
            valueContainer.innerText = object[key];

            newCategory.appendChild(valueLabel);
            newCategory.appendChild(valueContainer);
        }

        this._window.appendChild(newCategory);
    }
        
};
