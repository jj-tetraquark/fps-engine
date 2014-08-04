function DebugConsole() {
    // create the window
    this.console = document.createElement('div');
    this.console.id = 'debug-console';

    this.StyleTheConsole();
    document.body.appendChild(this.console);
}

DebugConsole.prototype.Log = function(category, object) {

    var strippedCategory = category.replace(/ /g,'');
    var existingCategoryInWindow = this.console.querySelector('#' + strippedCategory);

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
            this.WriteValue(valueContainer, updateObject[key]);
        } else {
            this.CreateNewCategoryValue(categoryElement, key, updateObject[key]);
        }
    } 
};

DebugConsole.prototype.CreateNewDebugCategory = function(category, categoryId, object) {
    var newCategory = document.createElement('p'); 
    newCategory.id = categoryId;

    var categoryTitle = document.createElement('h4');
    categoryTitle.textContent = category;
    categoryTitle.style.marginBottom = 0;
    newCategory.appendChild(categoryTitle);

    for (var key in object) {
        this.CreateNewCategoryValue(newCategory, key, object[key]);
    }

    this.console.appendChild(newCategory);
};


DebugConsole.prototype.CreateNewCategoryValue = function(categoryElement, name, value) {
    var valueLabel = document.createElement('span');
    valueLabel.textContent = "\t" + name + " : ";
    var valueContainer = document.createElement('span');
    valueContainer.id = name;
    this.WriteValue(valueContainer, value);
    var comma = document.createTextNode(',');

    categoryElement.appendChild(valueLabel);
    categoryElement.appendChild(valueContainer);
    categoryElement.appendChild(comma);
    
};

DebugConsole.prototype.WriteValue = function(container, value) {
    if (typeof(value) === "number") {
        value = value.toFixed(2);
    }
    container.textContent = value;
};

DebugConsole.prototype.StyleTheConsole = function() {
    var dbgStyle = this.console.style;
    dbgStyle.position = 'absolute';
    dbgStyle.top = 0;
    dbgStyle.left = 0;
    dbgStyle.height = '200px';
    dbgStyle.width = '700px';
    dbgStyle.overflowY = 'scroll';
    dbgStyle.backgroundColor = 'black';
    dbgStyle.opacity = 0.7;
    dbgStyle.color = "white";
    dbgStyle.fontFamily = "monospace";
};
