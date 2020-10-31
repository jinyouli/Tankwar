"use strict";
cc._RF.push(module, 'e0850dHf3VMs6DaFbgNuP0k', 'TiledMapData');
// scripts/TiledMapData.js

"use strict";

var _tileType = cc.Enum({
  tileNone: 0,
  tileGrass: 1,
  tileSteel: 2,
  tileWall: 3,
  tileRiver: 4,
  tileKing: 5
}); //gid从1开始


var _gidToTileType = [_tileType.tileNone, _tileType.tileNone, _tileType.tileSteel, _tileType.tileRiver, _tileType.tileGrass, _tileType.tileWall, _tileType.tileKing, _tileType.tileGrass];
module.exports = {
  tileType: _tileType,
  gidToTileType: _gidToTileType
};

cc._RF.pop();