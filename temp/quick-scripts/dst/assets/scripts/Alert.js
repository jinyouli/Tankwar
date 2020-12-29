
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQWxlcnQuanMiXSwibmFtZXMiOlsidGlwQWxlcnQiLCJfYWxlcnQiLCJfYW5pbVNwZWVkIiwic2hvdyIsInRpcFN0ciIsImNhbGxiYWNrIiwiY2MiLCJsb2FkZXIiLCJsb2FkUmVzIiwiUHJlZmFiIiwiZXJyb3IiLCJwcmVmYWIiLCJpbnN0YW50aWF0ZSIsImRpcmVjdG9yIiwiZ2V0U2NlbmUiLCJhZGRDaGlsZCIsImZpbmQiLCJnZXRDb21wb25lbnQiLCJMYWJlbCIsInN0cmluZyIsIm9uIiwiZXZlbnQiLCJkaXNtaXNzIiwicGFyZW50Iiwic3RhcnRGYWRlSW4iLCJzZXRTY2FsZSIsIm9wYWNpdHkiLCJjYkZhZGVJbiIsImNhbGxGdW5jIiwib25GYWRlSW5GaW5pc2giLCJhY3Rpb25GYWRlSW4iLCJzZXF1ZW5jZSIsInNwYXduIiwiZmFkZVRvIiwic2NhbGVUbyIsInJ1bkFjdGlvbiIsImNiRmFkZU91dCIsIm9uRmFkZU91dEZpbmlzaCIsImFjdGlvbkZhZGVPdXQiLCJvbkRlc3Ryb3kiLCJyZW1vdmVGcm9tUGFyZW50IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxRQUFRLEdBQUc7QUFDWEMsRUFBQUEsTUFBTSxFQUFFLElBREc7QUFDYTtBQUN4QkMsRUFBQUEsVUFBVSxFQUFFLEdBRkQsQ0FFYTs7QUFGYixDQUFmO0FBS0E7Ozs7Ozs7QUFNQSxJQUFJQyxJQUFJLEdBQUcsU0FBUEEsSUFBTyxDQUFVQyxNQUFWLEVBQWlCQyxRQUFqQixFQUEyQjtBQUNsQ0MsRUFBQUEsRUFBRSxDQUFDQyxNQUFILENBQVVDLE9BQVYsQ0FBa0IsYUFBbEIsRUFBZ0NGLEVBQUUsQ0FBQ0csTUFBbkMsRUFBMkMsVUFBVUMsS0FBVixFQUFpQkMsTUFBakIsRUFBd0I7QUFDL0QsUUFBSUQsS0FBSixFQUFVO0FBQ05KLE1BQUFBLEVBQUUsQ0FBQ0ksS0FBSCxDQUFTQSxLQUFUO0FBQ0E7QUFDSDs7QUFDRFYsSUFBQUEsUUFBUSxDQUFDQyxNQUFULEdBQWtCSyxFQUFFLENBQUNNLFdBQUgsQ0FBZUQsTUFBZixDQUFsQjtBQUNBTCxJQUFBQSxFQUFFLENBQUNPLFFBQUgsQ0FBWUMsUUFBWixHQUF1QkMsUUFBdkIsQ0FBZ0NmLFFBQVEsQ0FBQ0MsTUFBekMsRUFBZ0QsQ0FBaEQ7QUFDQUssSUFBQUEsRUFBRSxDQUFDVSxJQUFILENBQVEsZ0JBQVIsRUFBMEJDLFlBQTFCLENBQXVDWCxFQUFFLENBQUNZLEtBQTFDLEVBQWlEQyxNQUFqRCxHQUEwRGYsTUFBMUQ7O0FBQ0EsUUFBR0MsUUFBSCxFQUFZO0FBQ1JDLE1BQUFBLEVBQUUsQ0FBQ1UsSUFBSCxDQUFRLGFBQVIsRUFBdUJJLEVBQXZCLENBQTBCLE9BQTFCLEVBQW1DLFVBQVVDLEtBQVYsRUFBaUI7QUFDaERDLFFBQUFBLE9BQU87QUFDUGpCLFFBQUFBLFFBQVE7QUFDWCxPQUhELEVBR0csSUFISDtBQUlILEtBYjhELENBYy9EOzs7QUFDQUwsSUFBQUEsUUFBUSxDQUFDQyxNQUFULENBQWdCc0IsTUFBaEIsR0FBeUJqQixFQUFFLENBQUNVLElBQUgsQ0FBUSxRQUFSLENBQXpCO0FBQ0FRLElBQUFBLFdBQVc7QUFDZCxHQWpCRDtBQWtCSCxDQW5CRCxFQXFCQTs7O0FBQ0EsSUFBSUEsV0FBVyxHQUFHLFNBQWRBLFdBQWMsR0FBWTtBQUMxQjtBQUNBeEIsRUFBQUEsUUFBUSxDQUFDQyxNQUFULENBQWdCd0IsUUFBaEIsQ0FBeUIsQ0FBekI7O0FBQ0F6QixFQUFBQSxRQUFRLENBQUNDLE1BQVQsQ0FBZ0J5QixPQUFoQixHQUEwQixDQUExQjtBQUNBLE1BQUlDLFFBQVEsR0FBR3JCLEVBQUUsQ0FBQ3NCLFFBQUgsQ0FBWUMsY0FBWixFQUE0QixJQUE1QixDQUFmO0FBQ0EsTUFBSUMsWUFBWSxHQUFHeEIsRUFBRSxDQUFDeUIsUUFBSCxDQUFZekIsRUFBRSxDQUFDMEIsS0FBSCxDQUFTMUIsRUFBRSxDQUFDMkIsTUFBSCxDQUFVakMsUUFBUSxDQUFDRSxVQUFuQixFQUErQixHQUEvQixDQUFULEVBQThDSSxFQUFFLENBQUM0QixPQUFILENBQVdsQyxRQUFRLENBQUNFLFVBQXBCLEVBQWdDLEdBQWhDLENBQTlDLENBQVosRUFBaUd5QixRQUFqRyxDQUFuQjs7QUFDQTNCLEVBQUFBLFFBQVEsQ0FBQ0MsTUFBVCxDQUFnQmtDLFNBQWhCLENBQTBCTCxZQUExQjtBQUNILENBUEQsRUFVQTs7O0FBQ0EsSUFBSUQsY0FBYyxHQUFHLFNBQWpCQSxjQUFpQixHQUFZLENBQ2hDLENBREQsRUFHQTs7O0FBQ0EsSUFBSVAsT0FBTyxHQUFHLFNBQVZBLE9BQVUsR0FBWTtBQUN0QixNQUFJLENBQUN0QixRQUFRLENBQUNDLE1BQWQsRUFBc0I7QUFDbEI7QUFDSDs7QUFDRCxNQUFJbUMsU0FBUyxHQUFHOUIsRUFBRSxDQUFDc0IsUUFBSCxDQUFZUyxlQUFaLEVBQTZCLElBQTdCLENBQWhCO0FBQ0EsTUFBSUMsYUFBYSxHQUFHaEMsRUFBRSxDQUFDeUIsUUFBSCxDQUFZekIsRUFBRSxDQUFDMEIsS0FBSCxDQUFTMUIsRUFBRSxDQUFDMkIsTUFBSCxDQUFVakMsUUFBUSxDQUFDRSxVQUFuQixFQUErQixDQUEvQixDQUFULEVBQTRDSSxFQUFFLENBQUM0QixPQUFILENBQVdsQyxRQUFRLENBQUNFLFVBQXBCLEVBQWdDLEdBQWhDLENBQTVDLENBQVosRUFBK0ZrQyxTQUEvRixDQUFwQjs7QUFDQXBDLEVBQUFBLFFBQVEsQ0FBQ0MsTUFBVCxDQUFnQmtDLFNBQWhCLENBQTBCRyxhQUExQjtBQUNILENBUEQsRUFTQTs7O0FBQ0EsSUFBSUQsZUFBZSxHQUFHLFNBQWxCQSxlQUFrQixHQUFZO0FBQzlCRSxFQUFBQSxTQUFTO0FBQ1osQ0FGRDs7QUFJQSxJQUFJQSxTQUFTLEdBQUcsU0FBWkEsU0FBWSxHQUFZO0FBQ3hCLE1BQUl2QyxRQUFRLENBQUNDLE1BQVQsSUFBbUIsSUFBdkIsRUFBNkI7QUFDekJELElBQUFBLFFBQVEsQ0FBQ0MsTUFBVCxDQUFnQnVDLGdCQUFoQjs7QUFDQXhDLElBQUFBLFFBQVEsQ0FBQ0MsTUFBVCxHQUFrQixJQUFsQjtBQUNIO0FBQ0osQ0FMRDs7QUFPQXdDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFlO0FBQ2J2QyxFQUFBQSxJQUFJLEVBQUpBO0FBRGEsQ0FBZiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsibGV0IHRpcEFsZXJ0ID0ge1xyXG4gICAgX2FsZXJ0OiBudWxsLCAgICAgICAgICAgLy9wcmVmYWJcclxuICAgIF9hbmltU3BlZWQ6IDAuMywgICAgICAgIC8v5by556qX5Yqo55S76YCf5bqmXHJcbn07XHJcbiBcclxuLyoqXHJcbiAqIEBwYXJhbSB0aXBTdHJcclxuICogQHBhcmFtIGxlZnRTdHJcclxuICogQHBhcmFtIHJpZ2h0U3RyXHJcbiAqIEBwYXJhbSBjYWxsYmFja1xyXG4gKi9cclxubGV0IHNob3cgPSBmdW5jdGlvbiAodGlwU3RyLGNhbGxiYWNrKSB7XHJcbiAgICBjYy5sb2FkZXIubG9hZFJlcyhcIkFsZXJ0L0FsZXJ0XCIsY2MuUHJlZmFiLCBmdW5jdGlvbiAoZXJyb3IsIHByZWZhYil7XHJcbiAgICAgICAgaWYgKGVycm9yKXtcclxuICAgICAgICAgICAgY2MuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRpcEFsZXJ0Ll9hbGVydCA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XHJcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZCh0aXBBbGVydC5fYWxlcnQsMyk7XHJcbiAgICAgICAgY2MuZmluZChcIkFsZXJ0L2JnL3RpdGxlXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gdGlwU3RyO1xyXG4gICAgICAgIGlmKGNhbGxiYWNrKXtcclxuICAgICAgICAgICAgY2MuZmluZChcIkFsZXJ0L2JnL29rXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgZGlzbWlzcygpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8v6K6+572ucGFyZW50IOS4uuW9k+WJjeWcuuaZr+eahENhbnZhcyDvvIxwb3NpdGlvbui3n+maj+eItuiKgueCuVxyXG4gICAgICAgIHRpcEFsZXJ0Ll9hbGVydC5wYXJlbnQgPSBjYy5maW5kKFwiQ2FudmFzXCIpO1xyXG4gICAgICAgIHN0YXJ0RmFkZUluKCk7XHJcbiAgICB9KTtcclxufTtcclxuIFxyXG4vLyDmiafooYzlvLnov5vliqjnlLtcclxubGV0IHN0YXJ0RmFkZUluID0gZnVuY3Rpb24gKCkge1xyXG4gICAgLy/liqjnlLtcclxuICAgIHRpcEFsZXJ0Ll9hbGVydC5zZXRTY2FsZSgyKTtcclxuICAgIHRpcEFsZXJ0Ll9hbGVydC5vcGFjaXR5ID0gMDtcclxuICAgIGxldCBjYkZhZGVJbiA9IGNjLmNhbGxGdW5jKG9uRmFkZUluRmluaXNoLCB0aGlzKTtcclxuICAgIGxldCBhY3Rpb25GYWRlSW4gPSBjYy5zZXF1ZW5jZShjYy5zcGF3bihjYy5mYWRlVG8odGlwQWxlcnQuX2FuaW1TcGVlZCwgMjU1KSwgY2Muc2NhbGVUbyh0aXBBbGVydC5fYW5pbVNwZWVkLCAxLjApKSwgY2JGYWRlSW4pO1xyXG4gICAgdGlwQWxlcnQuX2FsZXJ0LnJ1bkFjdGlvbihhY3Rpb25GYWRlSW4pO1xyXG59O1xyXG4gXHJcbiBcclxuLy8g5by56L+b5Yqo55S75a6M5oiQ5Zue6LCDXHJcbmxldCBvbkZhZGVJbkZpbmlzaCA9IGZ1bmN0aW9uICgpIHtcclxufTtcclxuIFxyXG4vLyDmiafooYzlvLnlh7rliqjnlLtcclxubGV0IGRpc21pc3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoIXRpcEFsZXJ0Ll9hbGVydCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBjYkZhZGVPdXQgPSBjYy5jYWxsRnVuYyhvbkZhZGVPdXRGaW5pc2gsIHRoaXMpO1xyXG4gICAgbGV0IGFjdGlvbkZhZGVPdXQgPSBjYy5zZXF1ZW5jZShjYy5zcGF3bihjYy5mYWRlVG8odGlwQWxlcnQuX2FuaW1TcGVlZCwgMCksIGNjLnNjYWxlVG8odGlwQWxlcnQuX2FuaW1TcGVlZCwgMi4wKSksIGNiRmFkZU91dCk7XHJcbiAgICB0aXBBbGVydC5fYWxlcnQucnVuQWN0aW9uKGFjdGlvbkZhZGVPdXQpO1xyXG59O1xyXG4gXHJcbi8vIOW8ueWHuuWKqOeUu+WujOaIkOWbnuiwg1xyXG5sZXQgb25GYWRlT3V0RmluaXNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgb25EZXN0cm95KCk7XHJcbn07XHJcbiBcclxubGV0IG9uRGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aXBBbGVydC5fYWxlcnQgIT0gbnVsbCkge1xyXG4gICAgICAgIHRpcEFsZXJ0Ll9hbGVydC5yZW1vdmVGcm9tUGFyZW50KCk7XHJcbiAgICAgICAgdGlwQWxlcnQuX2FsZXJ0ID0gbnVsbDtcclxuICAgIH1cclxufTtcclxuIFxyXG5tb2R1bGUuZXhwb3J0cz17XHJcbiAgc2hvd1xyXG59O1xyXG4iXX0=