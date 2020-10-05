
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL1RpbGVkTWFwRGF0YS5qcyJdLCJuYW1lcyI6WyJfdGlsZVR5cGUiLCJjYyIsIkVudW0iLCJ0aWxlTm9uZSIsInRpbGVHcmFzcyIsInRpbGVTdGVlbCIsInRpbGVXYWxsIiwidGlsZVJpdmVyIiwidGlsZUtpbmciLCJfZ2lkVG9UaWxlVHlwZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0aWxlVHlwZSIsImdpZFRvVGlsZVR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBSUEsU0FBUyxHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUNwQkMsRUFBQUEsUUFBUSxFQUFFLENBRFU7QUFFcEJDLEVBQUFBLFNBQVMsRUFBRSxDQUZTO0FBR3ZCQyxFQUFBQSxTQUFTLEVBQUUsQ0FIWTtBQUlwQkMsRUFBQUEsUUFBUSxFQUFFLENBSlU7QUFLdkJDLEVBQUFBLFNBQVMsRUFBRSxDQUxZO0FBTXBCQyxFQUFBQSxRQUFRLEVBQUU7QUFOVSxDQUFSLENBQWhCLEVBUUE7OztBQUNBLElBQUlDLGNBQWMsR0FBRyxDQUNwQlQsU0FBUyxDQUFDRyxRQURVLEVBR3BCSCxTQUFTLENBQUNHLFFBSFUsRUFHQUgsU0FBUyxDQUFDRyxRQUhWLEVBR29CSCxTQUFTLENBQUNJLFNBSDlCLEVBR3lDSixTQUFTLENBQUNJLFNBSG5ELEVBRzhESixTQUFTLENBQUNLLFNBSHhFLEVBR21GTCxTQUFTLENBQUNLLFNBSDdGLEVBSXBCTCxTQUFTLENBQUNHLFFBSlUsRUFJQUgsU0FBUyxDQUFDRyxRQUpWLEVBSW9CSCxTQUFTLENBQUNJLFNBSjlCLEVBSXlDSixTQUFTLENBQUNJLFNBSm5ELEVBSThESixTQUFTLENBQUNLLFNBSnhFLEVBSW1GTCxTQUFTLENBQUNLLFNBSjdGLEVBTXBCTCxTQUFTLENBQUNNLFFBTlUsRUFNQU4sU0FBUyxDQUFDTSxRQU5WLEVBTW9CTixTQUFTLENBQUNPLFNBTjlCLEVBTXlDUCxTQUFTLENBQUNPLFNBTm5ELEVBTThEUCxTQUFTLENBQUNRLFFBTnhFLEVBTWtGUixTQUFTLENBQUNRLFFBTjVGLEVBT3BCUixTQUFTLENBQUNNLFFBUFUsRUFPQU4sU0FBUyxDQUFDTSxRQVBWLEVBT29CTixTQUFTLENBQUNPLFNBUDlCLEVBT3lDUCxTQUFTLENBQUNPLFNBUG5ELEVBTzhEUCxTQUFTLENBQUNRLFFBUHhFLEVBT2tGUixTQUFTLENBQUNRLFFBUDVGLEVBU3BCUixTQUFTLENBQUNRLFFBVFUsRUFTQVIsU0FBUyxDQUFDUSxRQVRWLEVBU29CUixTQUFTLENBQUNHLFFBVDlCLEVBU3dDSCxTQUFTLENBQUNHLFFBVGxELEVBUzRESCxTQUFTLENBQUNHLFFBVHRFLEVBU2dGSCxTQUFTLENBQUNHLFFBVDFGLEVBVXBCSCxTQUFTLENBQUNRLFFBVlUsRUFVQVIsU0FBUyxDQUFDUSxRQVZWLEVBVW9CUixTQUFTLENBQUNHLFFBVjlCLEVBVXdDSCxTQUFTLENBQUNHLFFBVmxELEVBVTRESCxTQUFTLENBQUNHLFFBVnRFLEVBVWdGSCxTQUFTLENBQUNHLFFBVjFGLENBQXJCO0FBYUFPLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNiQyxFQUFBQSxRQUFRLEVBQUVaLFNBREc7QUFFYmEsRUFBQUEsYUFBYSxFQUFFSjtBQUZGLENBQWpCIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBfdGlsZVR5cGUgPSBjYy5FbnVtKHtcbiAgICB0aWxlTm9uZTogMCwgXG4gICAgdGlsZUdyYXNzOiAxLCBcblx0dGlsZVN0ZWVsOiAyLCBcbiAgICB0aWxlV2FsbDogMyxcblx0dGlsZVJpdmVyOiA0LCBcbiAgICB0aWxlS2luZzogNVxufSk7XG4vL2dpZOS7jjHlvIDlp4tcbnZhciBfZ2lkVG9UaWxlVHlwZSA9IFtcblx0X3RpbGVUeXBlLnRpbGVOb25lLFxuXHRcblx0X3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlR3Jhc3MsIF90aWxlVHlwZS50aWxlR3Jhc3MsIF90aWxlVHlwZS50aWxlU3RlZWwsIF90aWxlVHlwZS50aWxlU3RlZWwsIFxuXHRfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVHcmFzcywgX3RpbGVUeXBlLnRpbGVHcmFzcywgX3RpbGVUeXBlLnRpbGVTdGVlbCwgX3RpbGVUeXBlLnRpbGVTdGVlbCxcblxuXHRfdGlsZVR5cGUudGlsZVdhbGwsIF90aWxlVHlwZS50aWxlV2FsbCwgX3RpbGVUeXBlLnRpbGVSaXZlciwgX3RpbGVUeXBlLnRpbGVSaXZlciwgX3RpbGVUeXBlLnRpbGVLaW5nLCBfdGlsZVR5cGUudGlsZUtpbmcsXG5cdF90aWxlVHlwZS50aWxlV2FsbCwgX3RpbGVUeXBlLnRpbGVXYWxsLCBfdGlsZVR5cGUudGlsZVJpdmVyLCBfdGlsZVR5cGUudGlsZVJpdmVyLCBfdGlsZVR5cGUudGlsZUtpbmcsIF90aWxlVHlwZS50aWxlS2luZyxcblxuXHRfdGlsZVR5cGUudGlsZUtpbmcsIF90aWxlVHlwZS50aWxlS2luZywgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLFxuXHRfdGlsZVR5cGUudGlsZUtpbmcsIF90aWxlVHlwZS50aWxlS2luZywgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lXG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB0aWxlVHlwZTogX3RpbGVUeXBlLFxuICAgIGdpZFRvVGlsZVR5cGU6IF9naWRUb1RpbGVUeXBlXG59O1xuIl19