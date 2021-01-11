
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


var _gidToTileType = [_tileType.tileNone, _tileType.tileNone, _tileType.tileWall, _tileType.tileWall, _tileType.tileWall, _tileType.tileWall, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileGrass, _tileType.tileGrass, _tileType.tileGrass, _tileType.tileKing, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcVGlsZWRNYXBEYXRhLmpzIl0sIm5hbWVzIjpbIl90aWxlVHlwZSIsImNjIiwiRW51bSIsInRpbGVOb25lIiwidGlsZUdyYXNzIiwidGlsZVN0ZWVsIiwidGlsZVdhbGwiLCJ0aWxlUml2ZXIiLCJ0aWxlS2luZyIsIl9naWRUb1RpbGVUeXBlIiwibW9kdWxlIiwiZXhwb3J0cyIsInRpbGVUeXBlIiwiZ2lkVG9UaWxlVHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFJQSxTQUFTLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3BCQyxFQUFBQSxRQUFRLEVBQUUsQ0FEVTtBQUVwQkMsRUFBQUEsU0FBUyxFQUFFLENBRlM7QUFHdkJDLEVBQUFBLFNBQVMsRUFBRSxDQUhZO0FBSXBCQyxFQUFBQSxRQUFRLEVBQUUsQ0FKVTtBQUt2QkMsRUFBQUEsU0FBUyxFQUFFLENBTFk7QUFNcEJDLEVBQUFBLFFBQVEsRUFBRTtBQU5VLENBQVIsQ0FBaEIsRUFRQTs7O0FBRUEsSUFBSUMsY0FBYyxHQUFHLENBQ3BCVCxTQUFTLENBQUNHLFFBRFUsRUFFakJILFNBQVMsQ0FBQ0csUUFGTyxFQUVHSCxTQUFTLENBQUNNLFFBRmIsRUFFdUJOLFNBQVMsQ0FBQ00sUUFGakMsRUFFMkNOLFNBQVMsQ0FBQ00sUUFGckQsRUFFK0ROLFNBQVMsQ0FBQ00sUUFGekUsRUFFbUZOLFNBQVMsQ0FBQ08sU0FGN0YsRUFFd0dQLFNBQVMsQ0FBQ08sU0FGbEgsRUFFNkhQLFNBQVMsQ0FBQ08sU0FGdkksRUFFa0pQLFNBQVMsQ0FBQ08sU0FGNUosRUFFdUtQLFNBQVMsQ0FBQ0ksU0FGakwsRUFFNExKLFNBQVMsQ0FBQ0ksU0FGdE0sRUFFaU5KLFNBQVMsQ0FBQ0ksU0FGM04sRUFFc09KLFNBQVMsQ0FBQ1EsUUFGaFAsRUFJakJSLFNBQVMsQ0FBQ0csUUFKTyxFQUtqQkgsU0FBUyxDQUFDRyxRQUxPLEVBS0dILFNBQVMsQ0FBQ0csUUFMYixFQUt1QkgsU0FBUyxDQUFDRyxRQUxqQyxFQUsyQ0gsU0FBUyxDQUFDRyxRQUxyRCxFQUsrREgsU0FBUyxDQUFDRyxRQUx6RSxFQUttRkgsU0FBUyxDQUFDRyxRQUw3RixFQUt1R0gsU0FBUyxDQUFDRyxRQUxqSCxFQUsySEgsU0FBUyxDQUFDRyxRQUxySSxFQUsrSUgsU0FBUyxDQUFDRyxRQUx6SixFQUttS0gsU0FBUyxDQUFDRyxRQUw3SyxFQUt1TEgsU0FBUyxDQUFDRyxRQUxqTSxDQUFyQjtBQVVBTyxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDYkMsRUFBQUEsUUFBUSxFQUFFWixTQURHO0FBRWJhLEVBQUFBLGFBQWEsRUFBRUo7QUFGRixDQUFqQiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbnZhciBfdGlsZVR5cGUgPSBjYy5FbnVtKHtcclxuICAgIHRpbGVOb25lOiAwLCBcclxuICAgIHRpbGVHcmFzczogMSwgXHJcblx0dGlsZVN0ZWVsOiAyLCBcclxuICAgIHRpbGVXYWxsOiAzLFxyXG5cdHRpbGVSaXZlcjogNCwgXHJcbiAgICB0aWxlS2luZzogNVxyXG59KTtcclxuLy9naWTku44x5byA5aeLXHJcblxyXG52YXIgX2dpZFRvVGlsZVR5cGUgPSBbXHJcblx0X3RpbGVUeXBlLnRpbGVOb25lLFxyXG4gICAgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZVdhbGwsIF90aWxlVHlwZS50aWxlV2FsbCwgX3RpbGVUeXBlLnRpbGVXYWxsLCBfdGlsZVR5cGUudGlsZVdhbGwsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlR3Jhc3MsIF90aWxlVHlwZS50aWxlR3Jhc3MsIF90aWxlVHlwZS50aWxlR3Jhc3MsIF90aWxlVHlwZS50aWxlS2luZyxcclxuXHJcbiAgICBfdGlsZVR5cGUudGlsZU5vbmUsXHJcbiAgICBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZVxyXG4gICAgXHJcblxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB0aWxlVHlwZTogX3RpbGVUeXBlLFxyXG4gICAgZ2lkVG9UaWxlVHlwZTogX2dpZFRvVGlsZVR5cGVcclxufTtcclxuIl19