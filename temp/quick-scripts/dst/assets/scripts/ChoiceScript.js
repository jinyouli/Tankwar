
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/ChoiceScript.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'e3410Xfj7dGI7X2/mwrPXFs', 'ChoiceScript');
// scripts/ChoiceScript.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    // foo: {
    //    default: null,      // The default value will be used only when the component attaching
    //                           to a node for the first time
    //    url: cc.Texture2D,  // optional, default is typeof default
    //    serializable: true, // optional, default is true
    //    visible: true,      // optional, default is true
    //    displayName: 'Foo', // optional
    //    readonly: false,    // optional, default is false
    // },
    // ...
    curLevelLabel: cc.Label
  },
  // use this for initialization
  onLoad: function onLoad() {
    cc.gameData = {};
    cc.gameData.curLevel = 1;
    this.updateLevelLabel();
  },
  onPlay: function onPlay() {
    var self = this;

    cc.loader.onProgress = function (completedCount, totalCount, item) {
      console.log(completedCount + "/" + totalCount);
    };

    cc.director.preloadScene("CityScene" + cc.gameData.curLevel, function (assets, error) {
      //跳转到游戏界面
      cc.director.loadScene("CityScene" + cc.gameData.curLevel);
    });
  },
  onUp: function onUp() {
    if (cc.gameData.curLevel - 1 <= 0) {
      return;
    }

    cc.gameData.curLevel -= 1;
    this.updateLevelLabel();
  },
  onNext: function onNext() {
    if (cc.gameData.curLevel + 1 > 10) {
      return;
    }

    cc.gameData.curLevel += 1;
    this.updateLevelLabel();
  },
  updateLevelLabel: function updateLevelLabel() {
    this.curLevelLabel.string = "关卡 " + cc.gameData.curLevel;
  } // called every frame, uncomment this function to activate update callback
  // update: function (dt) {
  // },

});

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL0Nob2ljZVNjcmlwdC5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImN1ckxldmVsTGFiZWwiLCJMYWJlbCIsIm9uTG9hZCIsImdhbWVEYXRhIiwiY3VyTGV2ZWwiLCJ1cGRhdGVMZXZlbExhYmVsIiwib25QbGF5Iiwic2VsZiIsImxvYWRlciIsIm9uUHJvZ3Jlc3MiLCJjb21wbGV0ZWRDb3VudCIsInRvdGFsQ291bnQiLCJpdGVtIiwiY29uc29sZSIsImxvZyIsImRpcmVjdG9yIiwicHJlbG9hZFNjZW5lIiwiYXNzZXRzIiwiZXJyb3IiLCJsb2FkU2NlbmUiLCJvblVwIiwib25OZXh0Iiwic3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxJQUFBQSxhQUFhLEVBQUNKLEVBQUUsQ0FBQ0s7QUFYVCxHQUhQO0FBa0JMO0FBQ0FDLEVBQUFBLE1BQU0sRUFBRSxrQkFBWTtBQUNoQk4sSUFBQUEsRUFBRSxDQUFDTyxRQUFILEdBQWMsRUFBZDtBQUNBUCxJQUFBQSxFQUFFLENBQUNPLFFBQUgsQ0FBWUMsUUFBWixHQUF1QixDQUF2QjtBQUNBLFNBQUtDLGdCQUFMO0FBQ0gsR0F2Qkk7QUEwQkxDLEVBQUFBLE1BQU0sRUFBRSxrQkFBWTtBQUNoQixRQUFJQyxJQUFJLEdBQUcsSUFBWDs7QUFDQVgsSUFBQUEsRUFBRSxDQUFDWSxNQUFILENBQVVDLFVBQVYsR0FBdUIsVUFBVUMsY0FBVixFQUEwQkMsVUFBMUIsRUFBc0NDLElBQXRDLEVBQTJDO0FBQzlEQyxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUosY0FBYyxHQUFDLEdBQWYsR0FBbUJDLFVBQS9CO0FBQ0gsS0FGRDs7QUFHQWYsSUFBQUEsRUFBRSxDQUFDbUIsUUFBSCxDQUFZQyxZQUFaLENBQXlCLGNBQWFwQixFQUFFLENBQUNPLFFBQUgsQ0FBWUMsUUFBbEQsRUFBNEQsVUFBVWEsTUFBVixFQUFrQkMsS0FBbEIsRUFBd0I7QUFDaEY7QUFDQXRCLE1BQUFBLEVBQUUsQ0FBQ21CLFFBQUgsQ0FBWUksU0FBWixDQUFzQixjQUFhdkIsRUFBRSxDQUFDTyxRQUFILENBQVlDLFFBQS9DO0FBQ0gsS0FIRDtBQUlILEdBbkNJO0FBcUNMZ0IsRUFBQUEsSUFBSSxFQUFFLGdCQUFZO0FBQ2QsUUFBR3hCLEVBQUUsQ0FBQ08sUUFBSCxDQUFZQyxRQUFaLEdBQXFCLENBQXJCLElBQTBCLENBQTdCLEVBQStCO0FBQzNCO0FBQ0g7O0FBQ0RSLElBQUFBLEVBQUUsQ0FBQ08sUUFBSCxDQUFZQyxRQUFaLElBQXdCLENBQXhCO0FBQ0EsU0FBS0MsZ0JBQUw7QUFDSCxHQTNDSTtBQTZDTGdCLEVBQUFBLE1BQU0sRUFBRSxrQkFBWTtBQUNoQixRQUFHekIsRUFBRSxDQUFDTyxRQUFILENBQVlDLFFBQVosR0FBcUIsQ0FBckIsR0FBeUIsRUFBNUIsRUFBK0I7QUFDM0I7QUFDSDs7QUFDRFIsSUFBQUEsRUFBRSxDQUFDTyxRQUFILENBQVlDLFFBQVosSUFBd0IsQ0FBeEI7QUFDQSxTQUFLQyxnQkFBTDtBQUNILEdBbkRJO0FBcURMQSxFQUFBQSxnQkFBZ0IsRUFBRSw0QkFBWTtBQUMxQixTQUFLTCxhQUFMLENBQW1Cc0IsTUFBbkIsR0FBNEIsUUFBTTFCLEVBQUUsQ0FBQ08sUUFBSCxDQUFZQyxRQUE5QztBQUNILEdBdkRJLENBMERMO0FBQ0E7QUFFQTs7QUE3REssQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgY3VyTGV2ZWxMYWJlbDpjYy5MYWJlbCxcblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZ2FtZURhdGEgPSB7fTtcbiAgICAgICAgY2MuZ2FtZURhdGEuY3VyTGV2ZWwgPSAxO1xuICAgICAgICB0aGlzLnVwZGF0ZUxldmVsTGFiZWwoKTtcbiAgICB9LFxuXG4gICAgXG4gICAgb25QbGF5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgY2MubG9hZGVyLm9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoY29tcGxldGVkQ291bnQsIHRvdGFsQ291bnQsIGl0ZW0pe1xuICAgICAgICAgICAgY29uc29sZS5sb2coY29tcGxldGVkQ291bnQrXCIvXCIrdG90YWxDb3VudCk7XG4gICAgICAgIH07XG4gICAgICAgIGNjLmRpcmVjdG9yLnByZWxvYWRTY2VuZShcIkNpdHlTY2VuZVwiKyBjYy5nYW1lRGF0YS5jdXJMZXZlbCwgZnVuY3Rpb24gKGFzc2V0cywgZXJyb3Ipe1xuICAgICAgICAgICAgLy/ot7PovazliLDmuLjmiI/nlYzpnaJcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkNpdHlTY2VuZVwiKyBjYy5nYW1lRGF0YS5jdXJMZXZlbCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvblVwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmKGNjLmdhbWVEYXRhLmN1ckxldmVsLTEgPD0gMCl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2MuZ2FtZURhdGEuY3VyTGV2ZWwgLT0gMTsgXG4gICAgICAgIHRoaXMudXBkYXRlTGV2ZWxMYWJlbCgpO1xuICAgIH0sXG5cbiAgICBvbk5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoY2MuZ2FtZURhdGEuY3VyTGV2ZWwrMSA+IDEwKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYy5nYW1lRGF0YS5jdXJMZXZlbCArPSAxOyBcbiAgICAgICAgdGhpcy51cGRhdGVMZXZlbExhYmVsKCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZUxldmVsTGFiZWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jdXJMZXZlbExhYmVsLnN0cmluZyA9IFwi5YWz5Y2hIFwiK2NjLmdhbWVEYXRhLmN1ckxldmVsO1xuICAgIH0sXG5cblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiJdfQ==