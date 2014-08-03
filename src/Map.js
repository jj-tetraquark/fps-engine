function Map(lengthOrJson, height) {
    if (typeof(lengthOrJson) === "number") {
        if (height === undefined) {
            this._wallGrid = new Uint8Array(lengthOrJson * lengthOrJson);
        } else {
            this._wallGrid = new Uint8Array(lengthOrJson * height);
        }
        this._width = lengthOrJson;
    } else {
        this.AssignFromJson(lengthOrJson);
    }
}

Map.prototype.AssignFromJson = function(json) {
    this._wallGrid = new Uint8Array(json[0].length * json.length);
    this._width = json[0].length;
    for (var y = 0; y < this._width; y++) {
        for (var x = 0; x < json.length; x++) {
            this._Assign(x, y, json[x][y]);
        }
    }
};

Map.prototype.HasWallAt = function(x,y) {
    return this._ElementAt(x, y) > 0;
};

Map.prototype._ElementAt = function(x,y) {
    return this._wallGrid[y * this._width + x];
};

Map.prototype._Assign= function(x, y, value) {
    this._wallGrid[y * this._width + x] = value;
};

