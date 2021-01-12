
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


var _gidToTileType = [_tileType.tileNone, _tileType.tileNone, _tileType.tileWall, _tileType.tileWall, _tileType.tileWall, _tileType.tileWall, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileGrass, _tileType.tileGrass, _tileType.tileGrass, _tileType.tileGrass, _tileType.tileKing, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcVGlsZWRNYXBEYXRhLmpzIl0sIm5hbWVzIjpbIl90aWxlVHlwZSIsImNjIiwiRW51bSIsInRpbGVOb25lIiwidGlsZUdyYXNzIiwidGlsZVN0ZWVsIiwidGlsZVdhbGwiLCJ0aWxlUml2ZXIiLCJ0aWxlS2luZyIsIl9naWRUb1RpbGVUeXBlIiwibW9kdWxlIiwiZXhwb3J0cyIsInRpbGVUeXBlIiwiZ2lkVG9UaWxlVHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFJQSxTQUFTLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3BCQyxFQUFBQSxRQUFRLEVBQUUsQ0FEVTtBQUVwQkMsRUFBQUEsU0FBUyxFQUFFLENBRlM7QUFHdkJDLEVBQUFBLFNBQVMsRUFBRSxDQUhZO0FBSXBCQyxFQUFBQSxRQUFRLEVBQUUsQ0FKVTtBQUt2QkMsRUFBQUEsU0FBUyxFQUFFLENBTFk7QUFNcEJDLEVBQUFBLFFBQVEsRUFBRTtBQU5VLENBQVIsQ0FBaEIsRUFRQTs7O0FBRUEsSUFBSUMsY0FBYyxHQUFHLENBQ3BCVCxTQUFTLENBQUNHLFFBRFUsRUFFakJILFNBQVMsQ0FBQ0csUUFGTyxFQUdqQkgsU0FBUyxDQUFDTSxRQUhPLEVBR0dOLFNBQVMsQ0FBQ00sUUFIYixFQUd1Qk4sU0FBUyxDQUFDTSxRQUhqQyxFQUcyQ04sU0FBUyxDQUFDTSxRQUhyRCxFQUlqQk4sU0FBUyxDQUFDTyxTQUpPLEVBSUlQLFNBQVMsQ0FBQ08sU0FKZCxFQUl5QlAsU0FBUyxDQUFDTyxTQUpuQyxFQUk4Q1AsU0FBUyxDQUFDTyxTQUp4RCxFQUltRVAsU0FBUyxDQUFDSSxTQUo3RSxFQUl3RkosU0FBUyxDQUFDSSxTQUpsRyxFQUk2R0osU0FBUyxDQUFDSSxTQUp2SCxFQUlrSUosU0FBUyxDQUFDSSxTQUo1SSxFQUlzSkosU0FBUyxDQUFDUSxRQUpoSyxFQU1qQlIsU0FBUyxDQUFDRyxRQU5PLEVBT2pCSCxTQUFTLENBQUNHLFFBUE8sRUFPR0gsU0FBUyxDQUFDRyxRQVBiLEVBT3VCSCxTQUFTLENBQUNHLFFBUGpDLEVBTzJDSCxTQUFTLENBQUNHLFFBUHJELEVBTytESCxTQUFTLENBQUNHLFFBUHpFLEVBT21GSCxTQUFTLENBQUNHLFFBUDdGLEVBT3VHSCxTQUFTLENBQUNHLFFBUGpILEVBTzJISCxTQUFTLENBQUNHLFFBUHJJLEVBTytJSCxTQUFTLENBQUNHLFFBUHpKLEVBT21LSCxTQUFTLENBQUNHLFFBUDdLLEVBT3VMSCxTQUFTLENBQUNHLFFBUGpNLENBQXJCO0FBWUFPLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNiQyxFQUFBQSxRQUFRLEVBQUVaLFNBREc7QUFFYmEsRUFBQUEsYUFBYSxFQUFFSjtBQUZGLENBQWpCIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIF90aWxlVHlwZSA9IGNjLkVudW0oe1xyXG4gICAgdGlsZU5vbmU6IDAsIFxyXG4gICAgdGlsZUdyYXNzOiAxLCBcclxuXHR0aWxlU3RlZWw6IDIsIFxyXG4gICAgdGlsZVdhbGw6IDMsXHJcblx0dGlsZVJpdmVyOiA0LCBcclxuICAgIHRpbGVLaW5nOiA1XHJcbn0pO1xyXG4vL2dpZOS7jjHlvIDlp4tcclxuXHJcbnZhciBfZ2lkVG9UaWxlVHlwZSA9IFtcclxuXHRfdGlsZVR5cGUudGlsZU5vbmUsXHJcbiAgICBfdGlsZVR5cGUudGlsZU5vbmUsIFxyXG4gICAgX3RpbGVUeXBlLnRpbGVXYWxsLCBfdGlsZVR5cGUudGlsZVdhbGwsIF90aWxlVHlwZS50aWxlV2FsbCwgX3RpbGVUeXBlLnRpbGVXYWxsLCBcclxuICAgIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlR3Jhc3MsIF90aWxlVHlwZS50aWxlR3Jhc3MsIF90aWxlVHlwZS50aWxlR3Jhc3MsIF90aWxlVHlwZS50aWxlR3Jhc3MsX3RpbGVUeXBlLnRpbGVLaW5nLFxyXG5cclxuICAgIF90aWxlVHlwZS50aWxlTm9uZSxcclxuICAgIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lXHJcbiAgICBcclxuXHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHRpbGVUeXBlOiBfdGlsZVR5cGUsXHJcbiAgICBnaWRUb1RpbGVUeXBlOiBfZ2lkVG9UaWxlVHlwZVxyXG59O1xyXG4iXX0=