function DebugConsole() {
    // create the window
    var debugConsole = document.createElement('div');
    debugConsole.id = 'debug-console';

    this._window = document.body.appendChild(debugConsole);
    this._debugCategories = [];
}

DebugConsole.prototype.Log = function(category, object) {

    var strippedCategory = category.replace(/ /g,'');
    var existingCategoryInWindow = this._window.querySelector('#' + strippedCategory);

    if (existingCategoryInWindow) {
        this.UpdateExistingCategory(existingCategoryInWindow, object);
    } else { 
        this.CreateNewDebugCategory(category, strippedCategory, object);
    }
};

DebugConsole.prototype.UpdateExistingCategory = function(categoryElement, updateObject) {
    for (var key in updateObject) {
        var valueContainer = categoryElement.querySelector('#' + key);
        if (valueContainer) {
            valueContainer.innerText = updateObject[key];
        } else {
            console.error("Error! No such category in debug console");
        }
    } 
};

DebugConsole.prototype.CreateNewDebugCategory = function(category, categoryId, object) {
        var newCategory = document.createElement('p'); 
        newCategory.id = categoryId;

        var categoryTitle = document.createElement('h4');
        categoryTitle.innerText = category;
        categoryTitle.style.marginBottom = 0;
        newCategory.appendChild(categoryTitle);

        for (var key in object) {
            var valueLabel = document.createElement('span');
            valueLabel.innerText = "\t" + key + " : ";
            var valueContainer = document.createElement('span');
            valueContainer.id = key;
            valueContainer.innerText = object[key];

            newCategory.appendChild(valueLabel);
            newCategory.appendChild(valueContainer);
        }

        this._window.appendChild(newCategory);
};
