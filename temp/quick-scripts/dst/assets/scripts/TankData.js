
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/TankData.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'b9949Ww8jpJ1Kwi2x0Vtnnc', 'TankData');
// scripts/TankData.js

"use strict";

var _tankType = cc.Enum({
  Normal: 0,
  Speed: 1,
  Armor: 2,
  Player: 3
});

module.exports = {
  tankType: _tankType
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcVGFua0RhdGEuanMiXSwibmFtZXMiOlsiX3RhbmtUeXBlIiwiY2MiLCJFbnVtIiwiTm9ybWFsIiwiU3BlZWQiLCJBcm1vciIsIlBsYXllciIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0YW5rVHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxTQUFTLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3BCQyxFQUFBQSxNQUFNLEVBQUUsQ0FEWTtBQUVwQkMsRUFBQUEsS0FBSyxFQUFFLENBRmE7QUFHcEJDLEVBQUFBLEtBQUssRUFBRSxDQUhhO0FBSXBCQyxFQUFBQSxNQUFNLEVBQUU7QUFKWSxDQUFSLENBQWhCOztBQU9BQyxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDYkMsRUFBQUEsUUFBUSxFQUFFVDtBQURHLENBQWpCIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX3RhbmtUeXBlID0gY2MuRW51bSh7XHJcbiAgICBOb3JtYWw6IDAsXHJcbiAgICBTcGVlZDogMSxcclxuICAgIEFybW9yOiAyLFxyXG4gICAgUGxheWVyOiAzXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB0YW5rVHlwZTogX3RhbmtUeXBlXHJcbn07Il19