
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
  tileRiver: 4 // tileKing: 5

}); //gid从1开始


var _gidToTileType = [_tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileGrass, _tileType.tileGrass, _tileType.tileSteel, _tileType.tileSteel, _tileType.tileNone, _tileType.tileNone, _tileType.tileGrass, _tileType.tileGrass, _tileType.tileSteel, _tileType.tileSteel, _tileType.tileWall, _tileType.tileWall, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileKing, _tileType.tileKing, _tileType.tileWall, _tileType.tileWall, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileKing, _tileType.tileKing, _tileType.tileKing, _tileType.tileKing, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileKing, _tileType.tileKing, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcVGlsZWRNYXBEYXRhLmpzIl0sIm5hbWVzIjpbIl90aWxlVHlwZSIsImNjIiwiRW51bSIsInRpbGVOb25lIiwidGlsZUdyYXNzIiwidGlsZVN0ZWVsIiwidGlsZVdhbGwiLCJ0aWxlUml2ZXIiLCJfZ2lkVG9UaWxlVHlwZSIsInRpbGVLaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsInRpbGVUeXBlIiwiZ2lkVG9UaWxlVHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFJQSxTQUFTLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3BCQyxFQUFBQSxRQUFRLEVBQUUsQ0FEVTtBQUVwQkMsRUFBQUEsU0FBUyxFQUFFLENBRlM7QUFHdkJDLEVBQUFBLFNBQVMsRUFBRSxDQUhZO0FBSXBCQyxFQUFBQSxRQUFRLEVBQUUsQ0FKVTtBQUt2QkMsRUFBQUEsU0FBUyxFQUFFLENBTFksQ0FNcEI7O0FBTm9CLENBQVIsQ0FBaEIsRUFRQTs7O0FBQ0EsSUFBSUMsY0FBYyxHQUFHLENBQ3BCUixTQUFTLENBQUNHLFFBRFUsRUFHcEJILFNBQVMsQ0FBQ0csUUFIVSxFQUdBSCxTQUFTLENBQUNHLFFBSFYsRUFHb0JILFNBQVMsQ0FBQ0ksU0FIOUIsRUFHeUNKLFNBQVMsQ0FBQ0ksU0FIbkQsRUFHOERKLFNBQVMsQ0FBQ0ssU0FIeEUsRUFHbUZMLFNBQVMsQ0FBQ0ssU0FIN0YsRUFJakJMLFNBQVMsQ0FBQ0csUUFKTyxFQUlHSCxTQUFTLENBQUNHLFFBSmIsRUFJdUJILFNBQVMsQ0FBQ0ksU0FKakMsRUFJNENKLFNBQVMsQ0FBQ0ksU0FKdEQsRUFJaUVKLFNBQVMsQ0FBQ0ssU0FKM0UsRUFJc0ZMLFNBQVMsQ0FBQ0ssU0FKaEcsRUFNakJMLFNBQVMsQ0FBQ00sUUFOTyxFQU1HTixTQUFTLENBQUNNLFFBTmIsRUFNdUJOLFNBQVMsQ0FBQ08sU0FOakMsRUFNNENQLFNBQVMsQ0FBQ08sU0FOdEQsRUFNaUVQLFNBQVMsQ0FBQ1MsUUFOM0UsRUFNcUZULFNBQVMsQ0FBQ1MsUUFOL0YsRUFPcEJULFNBQVMsQ0FBQ00sUUFQVSxFQU9BTixTQUFTLENBQUNNLFFBUFYsRUFPb0JOLFNBQVMsQ0FBQ08sU0FQOUIsRUFPeUNQLFNBQVMsQ0FBQ08sU0FQbkQsRUFPOERQLFNBQVMsQ0FBQ1MsUUFQeEUsRUFPa0ZULFNBQVMsQ0FBQ1MsUUFQNUYsRUFTcEJULFNBQVMsQ0FBQ1MsUUFUVSxFQVNBVCxTQUFTLENBQUNTLFFBVFYsRUFTb0JULFNBQVMsQ0FBQ0csUUFUOUIsRUFTd0NILFNBQVMsQ0FBQ0csUUFUbEQsRUFTNERILFNBQVMsQ0FBQ0csUUFUdEUsRUFTZ0ZILFNBQVMsQ0FBQ0csUUFUMUYsRUFVcEJILFNBQVMsQ0FBQ1MsUUFWVSxFQVVBVCxTQUFTLENBQUNTLFFBVlYsRUFVb0JULFNBQVMsQ0FBQ0csUUFWOUIsRUFVd0NILFNBQVMsQ0FBQ0csUUFWbEQsRUFVNERILFNBQVMsQ0FBQ0csUUFWdEUsRUFVZ0ZILFNBQVMsQ0FBQ0csUUFWMUYsQ0FBckI7QUFjQU8sTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2JDLEVBQUFBLFFBQVEsRUFBRVosU0FERztBQUViYSxFQUFBQSxhQUFhLEVBQUVMO0FBRkYsQ0FBakIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG52YXIgX3RpbGVUeXBlID0gY2MuRW51bSh7XHJcbiAgICB0aWxlTm9uZTogMCwgXHJcbiAgICB0aWxlR3Jhc3M6IDEsIFxyXG5cdHRpbGVTdGVlbDogMiwgXHJcbiAgICB0aWxlV2FsbDogMyxcclxuXHR0aWxlUml2ZXI6IDQsIFxyXG4gICAgLy8gdGlsZUtpbmc6IDVcclxufSk7XHJcbi8vZ2lk5LuOMeW8gOWni1xyXG52YXIgX2dpZFRvVGlsZVR5cGUgPSBbXHJcblx0X3RpbGVUeXBlLnRpbGVOb25lLFxyXG5cdFxyXG5cdF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZUdyYXNzLCBfdGlsZVR5cGUudGlsZUdyYXNzLCBfdGlsZVR5cGUudGlsZVN0ZWVsLCBfdGlsZVR5cGUudGlsZVN0ZWVsLCBcclxuICAgIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZUdyYXNzLCBfdGlsZVR5cGUudGlsZUdyYXNzLCBfdGlsZVR5cGUudGlsZVN0ZWVsLCBfdGlsZVR5cGUudGlsZVN0ZWVsLFxyXG4gICAgXHJcbiAgICBfdGlsZVR5cGUudGlsZVdhbGwsIF90aWxlVHlwZS50aWxlV2FsbCwgX3RpbGVUeXBlLnRpbGVSaXZlciwgX3RpbGVUeXBlLnRpbGVSaXZlciwgX3RpbGVUeXBlLnRpbGVLaW5nLCBfdGlsZVR5cGUudGlsZUtpbmcsXHJcblx0X3RpbGVUeXBlLnRpbGVXYWxsLCBfdGlsZVR5cGUudGlsZVdhbGwsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlS2luZywgX3RpbGVUeXBlLnRpbGVLaW5nLFxyXG5cclxuXHRfdGlsZVR5cGUudGlsZUtpbmcsIF90aWxlVHlwZS50aWxlS2luZywgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLFxyXG5cdF90aWxlVHlwZS50aWxlS2luZywgX3RpbGVUeXBlLnRpbGVLaW5nLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmVcclxuXHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHRpbGVUeXBlOiBfdGlsZVR5cGUsXHJcbiAgICBnaWRUb1RpbGVUeXBlOiBfZ2lkVG9UaWxlVHlwZVxyXG59O1xyXG4iXX0=