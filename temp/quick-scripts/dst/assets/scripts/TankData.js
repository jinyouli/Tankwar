
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL1RhbmtEYXRhLmpzIl0sIm5hbWVzIjpbIl90YW5rVHlwZSIsImNjIiwiRW51bSIsIk5vcm1hbCIsIlNwZWVkIiwiQXJtb3IiLCJQbGF5ZXIiLCJtb2R1bGUiLCJleHBvcnRzIiwidGFua1R5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsU0FBUyxHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUNwQkMsRUFBQUEsTUFBTSxFQUFFLENBRFk7QUFFcEJDLEVBQUFBLEtBQUssRUFBRSxDQUZhO0FBR3BCQyxFQUFBQSxLQUFLLEVBQUUsQ0FIYTtBQUlwQkMsRUFBQUEsTUFBTSxFQUFFO0FBSlksQ0FBUixDQUFoQjs7QUFPQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2JDLEVBQUFBLFFBQVEsRUFBRVQ7QUFERyxDQUFqQiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF90YW5rVHlwZSA9IGNjLkVudW0oe1xuICAgIE5vcm1hbDogMCxcbiAgICBTcGVlZDogMSxcbiAgICBBcm1vcjogMixcbiAgICBQbGF5ZXI6IDNcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB0YW5rVHlwZTogX3RhbmtUeXBlXG59OyJdfQ==