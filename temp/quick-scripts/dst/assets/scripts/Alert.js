
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/Alert.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '4786fHi3FlEdqZSU/txRECg', 'Alert');
// scripts/Alert.js

"use strict";

var tipAlert = {
  _alert: null,
  //prefab
  _animSpeed: 0.3 //弹窗动画速度

};
/**
 * @param tipStr
 * @param leftStr
 * @param rightStr
 * @param callback
 */

var show = function show(tipStr, callback) {
  cc.loader.loadRes("Alert/Alert", cc.Prefab, function (error, prefab) {
    if (error) {
      cc.error(error);
      return;
    }

    tipAlert._alert = cc.instantiate(prefab);
    cc.director.getScene().addChild(tipAlert._alert, 3);
    cc.find("Alert/bg/title").getComponent(cc.Label).string = tipStr;

    if (callback) {
      cc.find("Alert/bg/ok").on('click', function (event) {
        dismiss();
        callback();
      }, this);
    } //设置parent 为当前场景的Canvas ，position跟随父节点


    tipAlert._alert.parent = cc.find("Canvas");
    startFadeIn();
  });
}; // 执行弹进动画


var startFadeIn = function startFadeIn() {
  //动画
  tipAlert._alert.setScale(2);

  tipAlert._alert.opacity = 0;
  var cbFadeIn = cc.callFunc(onFadeInFinish, this);
  var actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(tipAlert._animSpeed, 255), cc.scaleTo(tipAlert._animSpeed, 1.0)), cbFadeIn);

  tipAlert._alert.runAction(actionFadeIn);
}; // 弹进动画完成回调


var onFadeInFinish = function onFadeInFinish() {}; // 执行弹出动画


var dismiss = function dismiss() {
  if (!tipAlert._alert) {
    return;
  }

  var cbFadeOut = cc.callFunc(onFadeOutFinish, this);
  var actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(tipAlert._animSpeed, 0), cc.scaleTo(tipAlert._animSpeed, 2.0)), cbFadeOut);

  tipAlert._alert.runAction(actionFadeOut);
}; // 弹出动画完成回调


var onFadeOutFinish = function onFadeOutFinish() {
  onDestroy();
};

var onDestroy = function onDestroy() {
  if (tipAlert._alert != null) {
    tipAlert._alert.removeFromParent();

    tipAlert._alert = null;
  }
};

module.exports = {
  show: show
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL0FsZXJ0LmpzIl0sIm5hbWVzIjpbInRpcEFsZXJ0IiwiX2FsZXJ0IiwiX2FuaW1TcGVlZCIsInNob3ciLCJ0aXBTdHIiLCJjYWxsYmFjayIsImNjIiwibG9hZGVyIiwibG9hZFJlcyIsIlByZWZhYiIsImVycm9yIiwicHJlZmFiIiwiaW5zdGFudGlhdGUiLCJkaXJlY3RvciIsImdldFNjZW5lIiwiYWRkQ2hpbGQiLCJmaW5kIiwiZ2V0Q29tcG9uZW50IiwiTGFiZWwiLCJzdHJpbmciLCJvbiIsImV2ZW50IiwiZGlzbWlzcyIsInBhcmVudCIsInN0YXJ0RmFkZUluIiwic2V0U2NhbGUiLCJvcGFjaXR5IiwiY2JGYWRlSW4iLCJjYWxsRnVuYyIsIm9uRmFkZUluRmluaXNoIiwiYWN0aW9uRmFkZUluIiwic2VxdWVuY2UiLCJzcGF3biIsImZhZGVUbyIsInNjYWxlVG8iLCJydW5BY3Rpb24iLCJjYkZhZGVPdXQiLCJvbkZhZGVPdXRGaW5pc2giLCJhY3Rpb25GYWRlT3V0Iiwib25EZXN0cm95IiwicmVtb3ZlRnJvbVBhcmVudCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsUUFBUSxHQUFHO0FBQ1hDLEVBQUFBLE1BQU0sRUFBRSxJQURHO0FBQ2E7QUFDeEJDLEVBQUFBLFVBQVUsRUFBRSxHQUZELENBRWE7O0FBRmIsQ0FBZjtBQUtBOzs7Ozs7O0FBTUEsSUFBSUMsSUFBSSxHQUFHLFNBQVBBLElBQU8sQ0FBVUMsTUFBVixFQUFpQkMsUUFBakIsRUFBMkI7QUFDbENDLEVBQUFBLEVBQUUsQ0FBQ0MsTUFBSCxDQUFVQyxPQUFWLENBQWtCLGFBQWxCLEVBQWdDRixFQUFFLENBQUNHLE1BQW5DLEVBQTJDLFVBQVVDLEtBQVYsRUFBaUJDLE1BQWpCLEVBQXdCO0FBQy9ELFFBQUlELEtBQUosRUFBVTtBQUNOSixNQUFBQSxFQUFFLENBQUNJLEtBQUgsQ0FBU0EsS0FBVDtBQUNB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O0FBQ0F4QyxJQUFBQSxRQUFRLENBQUNDLE1BQVQsR0FBa0IsSUFBbEI7QUFDSDtBQUNKLENBTEQ7O0FBT0F3QyxNQUFNLENBQUNDLE9BQVAsR0FBZTtBQUNidkMsRUFBQUEsSUFBSSxFQUFKQTtBQURhLENBQWYiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImxldCB0aXBBbGVydCA9IHtcbiAgICBfYWxlcnQ6IG51bGwsICAgICAgICAgICAvL3ByZWZhYlxuICAgIF9hbmltU3BlZWQ6IDAuMywgICAgICAgIC8v5by556qX5Yqo55S76YCf5bqmXG59O1xuIFxuLyoqXG4gKiBAcGFyYW0gdGlwU3RyXG4gKiBAcGFyYW0gbGVmdFN0clxuICogQHBhcmFtIHJpZ2h0U3RyXG4gKiBAcGFyYW0gY2FsbGJhY2tcbiAqL1xubGV0IHNob3cgPSBmdW5jdGlvbiAodGlwU3RyLGNhbGxiYWNrKSB7XG4gICAgY2MubG9hZGVyLmxvYWRSZXMoXCJBbGVydC9BbGVydFwiLGNjLlByZWZhYiwgZnVuY3Rpb24gKGVycm9yLCBwcmVmYWIpe1xuICAgICAgICBpZiAoZXJyb3Ipe1xuICAgICAgICAgICAgY2MuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRpcEFsZXJ0Ll9hbGVydCA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQodGlwQWxlcnQuX2FsZXJ0LDMpO1xuICAgICAgICBjYy5maW5kKFwiQWxlcnQvYmcvdGl0bGVcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSB0aXBTdHI7XG4gICAgICAgIGlmKGNhbGxiYWNrKXtcbiAgICAgICAgICAgIGNjLmZpbmQoXCJBbGVydC9iZy9va1wiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBkaXNtaXNzKCk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIC8v6K6+572ucGFyZW50IOS4uuW9k+WJjeWcuuaZr+eahENhbnZhcyDvvIxwb3NpdGlvbui3n+maj+eItuiKgueCuVxuICAgICAgICB0aXBBbGVydC5fYWxlcnQucGFyZW50ID0gY2MuZmluZChcIkNhbnZhc1wiKTtcbiAgICAgICAgc3RhcnRGYWRlSW4oKTtcbiAgICB9KTtcbn07XG4gXG4vLyDmiafooYzlvLnov5vliqjnlLtcbmxldCBzdGFydEZhZGVJbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAvL+WKqOeUu1xuICAgIHRpcEFsZXJ0Ll9hbGVydC5zZXRTY2FsZSgyKTtcbiAgICB0aXBBbGVydC5fYWxlcnQub3BhY2l0eSA9IDA7XG4gICAgbGV0IGNiRmFkZUluID0gY2MuY2FsbEZ1bmMob25GYWRlSW5GaW5pc2gsIHRoaXMpO1xuICAgIGxldCBhY3Rpb25GYWRlSW4gPSBjYy5zZXF1ZW5jZShjYy5zcGF3bihjYy5mYWRlVG8odGlwQWxlcnQuX2FuaW1TcGVlZCwgMjU1KSwgY2Muc2NhbGVUbyh0aXBBbGVydC5fYW5pbVNwZWVkLCAxLjApKSwgY2JGYWRlSW4pO1xuICAgIHRpcEFsZXJ0Ll9hbGVydC5ydW5BY3Rpb24oYWN0aW9uRmFkZUluKTtcbn07XG4gXG4gXG4vLyDlvLnov5vliqjnlLvlrozmiJDlm57osINcbmxldCBvbkZhZGVJbkZpbmlzaCA9IGZ1bmN0aW9uICgpIHtcbn07XG4gXG4vLyDmiafooYzlvLnlh7rliqjnlLtcbmxldCBkaXNtaXNzID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGlwQWxlcnQuX2FsZXJ0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGNiRmFkZU91dCA9IGNjLmNhbGxGdW5jKG9uRmFkZU91dEZpbmlzaCwgdGhpcyk7XG4gICAgbGV0IGFjdGlvbkZhZGVPdXQgPSBjYy5zZXF1ZW5jZShjYy5zcGF3bihjYy5mYWRlVG8odGlwQWxlcnQuX2FuaW1TcGVlZCwgMCksIGNjLnNjYWxlVG8odGlwQWxlcnQuX2FuaW1TcGVlZCwgMi4wKSksIGNiRmFkZU91dCk7XG4gICAgdGlwQWxlcnQuX2FsZXJ0LnJ1bkFjdGlvbihhY3Rpb25GYWRlT3V0KTtcbn07XG4gXG4vLyDlvLnlh7rliqjnlLvlrozmiJDlm57osINcbmxldCBvbkZhZGVPdXRGaW5pc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgb25EZXN0cm95KCk7XG59O1xuIFxubGV0IG9uRGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGlwQWxlcnQuX2FsZXJ0ICE9IG51bGwpIHtcbiAgICAgICAgdGlwQWxlcnQuX2FsZXJ0LnJlbW92ZUZyb21QYXJlbnQoKTtcbiAgICAgICAgdGlwQWxlcnQuX2FsZXJ0ID0gbnVsbDtcbiAgICB9XG59O1xuIFxubW9kdWxlLmV4cG9ydHM9e1xuICBzaG93XG59O1xuIl19