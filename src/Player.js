function Pose(x, y, angle) {
    return { X : x, Y : y, Angle : angle };
}

function Player(pose) {
    this._pose = pose;
    this._speed = 1;
}

Player.prototype.WithSpeed = function(newSpeed)  {
    this._speed = newSpeed;
    return this;
};

Player.prototype.GetPose = function() {
    return this._pose;
};
