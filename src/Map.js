function Map(lengthOrJson, width) {
    if (typeof(lengthOrJson) === "number") {
        if (width === undefined) {
            this._wallGrid = new Uint8Array(lengthOrJson * lengthOrJson);
        } else {
            this._wallGrid = new Uint8Array(lengthOrJson * width);
        }
    } else {
        this._wallGrid = new Uint8Array(lengthOrJson[0].length * lengthOrJson.length);
    }
}
