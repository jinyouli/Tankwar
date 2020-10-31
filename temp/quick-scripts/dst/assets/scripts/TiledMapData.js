
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/TiledMapData.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL1RpbGVkTWFwRGF0YS5qcyJdLCJuYW1lcyI6WyJfdGlsZVR5cGUiLCJjYyIsIkVudW0iLCJ0aWxlTm9uZSIsInRpbGVHcmFzcyIsInRpbGVTdGVlbCIsInRpbGVXYWxsIiwidGlsZVJpdmVyIiwidGlsZUtpbmciLCJfZ2lkVG9UaWxlVHlwZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0aWxlVHlwZSIsImdpZFRvVGlsZVR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBSUEsU0FBUyxHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUNwQkMsRUFBQUEsUUFBUSxFQUFFLENBRFU7QUFFcEJDLEVBQUFBLFNBQVMsRUFBRSxDQUZTO0FBR3ZCQyxFQUFBQSxTQUFTLEVBQUUsQ0FIWTtBQUlwQkMsRUFBQUEsUUFBUSxFQUFFLENBSlU7QUFLdkJDLEVBQUFBLFNBQVMsRUFBRSxDQUxZO0FBTXBCQyxFQUFBQSxRQUFRLEVBQUU7QUFOVSxDQUFSLENBQWhCLEVBUUE7OztBQUNBLElBQUlDLGNBQWMsR0FBRyxDQUNwQlQsU0FBUyxDQUFDRyxRQURVLEVBR3BCSCxTQUFTLENBQUNHLFFBSFUsRUFHQUgsU0FBUyxDQUFDSyxTQUhWLEVBR3FCTCxTQUFTLENBQUNPLFNBSC9CLEVBRzBDUCxTQUFTLENBQUNJLFNBSHBELEVBRytESixTQUFTLENBQUNNLFFBSHpFLEVBR21GTixTQUFTLENBQUNRLFFBSDdGLEVBR3NHUixTQUFTLENBQUNJLFNBSGhILENBQXJCO0FBT0FNLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNiQyxFQUFBQSxRQUFRLEVBQUVaLFNBREc7QUFFYmEsRUFBQUEsYUFBYSxFQUFFSjtBQUZGLENBQWpCIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBfdGlsZVR5cGUgPSBjYy5FbnVtKHtcbiAgICB0aWxlTm9uZTogMCwgXG4gICAgdGlsZUdyYXNzOiAxLCBcblx0dGlsZVN0ZWVsOiAyLCBcbiAgICB0aWxlV2FsbDogMyxcblx0dGlsZVJpdmVyOiA0LCBcbiAgICB0aWxlS2luZzogNVxufSk7XG4vL2dpZOS7jjHlvIDlp4tcbnZhciBfZ2lkVG9UaWxlVHlwZSA9IFtcblx0X3RpbGVUeXBlLnRpbGVOb25lLFxuXHRcblx0X3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZVN0ZWVsLCBfdGlsZVR5cGUudGlsZVJpdmVyLCBfdGlsZVR5cGUudGlsZUdyYXNzLCBfdGlsZVR5cGUudGlsZVdhbGwsIF90aWxlVHlwZS50aWxlS2luZyxfdGlsZVR5cGUudGlsZUdyYXNzXG5cbl07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHRpbGVUeXBlOiBfdGlsZVR5cGUsXG4gICAgZ2lkVG9UaWxlVHlwZTogX2dpZFRvVGlsZVR5cGVcbn07XG4iXX0=