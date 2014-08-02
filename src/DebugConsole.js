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
            this.CreateNewCategoryValue(categoryElement, key, updateObject[key]);
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
        this.CreateNewCategoryValue(newCategory, key, object[key]);
    }

    this._window.appendChild(newCategory);
};


DebugConsole.prototype.CreateNewCategoryValue = function(categoryElement, name, value) {
    var valueLabel = document.createElement('span');
    valueLabel.innerText = "\t" + name + " : ";
    var valueContainer = document.createElement('span');
    valueContainer.id = name;
    valueContainer.innerText = value;

    categoryElement.appendChild(valueLabel);
    categoryElement.appendChild(valueContainer);
};
