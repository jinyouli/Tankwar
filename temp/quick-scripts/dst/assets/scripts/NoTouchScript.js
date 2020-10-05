
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/NoTouchScript.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '006beoNQNNHAL+jJtWDR7Tw', 'NoTouchScript');
// scripts/NoTouchScript.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {// foo: {
    //    default: null,      // The default value will be used only when the component attaching
    //                           to a node for the first time
    //    url: cc.Texture2D,  // optional, default is typeof default
    //    serializable: true, // optional, default is true
    //    visible: true,      // optional, default is true
    //    displayName: 'Foo', // optional
    //    readonly: false,    // optional, default is false
    // },
    // ...
  },
  // use this for initialization
  onLoad: function onLoad() {
    var self = this; // touch input

    this._listener = cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: function onTouchBegan(touch, event) {
        //截获事件
        event.stopPropagation();
        return true;
      },
      onTouchMoved: function onTouchMoved(touch, event) {
        //截获事件
        event.stopPropagation();
      },
      onTouchEnded: function onTouchEnded(touch, event) {
        //截获事件
        event.stopPropagation();
      }
    }, self.node); //按键按下

    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
      //截获事件
      event.stopPropagation();
    }, this); //按键抬起

    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event) {
      //截获事件
      event.stopPropagation();
    }, this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL05vVG91Y2hTY3JpcHQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJvbkxvYWQiLCJzZWxmIiwiX2xpc3RlbmVyIiwiZXZlbnRNYW5hZ2VyIiwiYWRkTGlzdGVuZXIiLCJldmVudCIsIkV2ZW50TGlzdGVuZXIiLCJUT1VDSF9PTkVfQllfT05FIiwib25Ub3VjaEJlZ2FuIiwidG91Y2giLCJzdG9wUHJvcGFnYXRpb24iLCJvblRvdWNoTW92ZWQiLCJvblRvdWNoRW5kZWQiLCJub2RlIiwic3lzdGVtRXZlbnQiLCJvbiIsIlN5c3RlbUV2ZW50IiwiRXZlbnRUeXBlIiwiS0VZX0RPV04iLCJLRVlfVVAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRSxDQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVlEsR0FIUDtBQWdCTDtBQUNBQyxFQUFBQSxNQUFNLEVBQUUsa0JBQVk7QUFFaEIsUUFBSUMsSUFBSSxHQUFHLElBQVgsQ0FGZ0IsQ0FHaEI7O0FBQ0EsU0FBS0MsU0FBTCxHQUFpQk4sRUFBRSxDQUFDTyxZQUFILENBQWdCQyxXQUFoQixDQUE0QjtBQUN6Q0MsTUFBQUEsS0FBSyxFQUFFVCxFQUFFLENBQUNVLGFBQUgsQ0FBaUJDLGdCQURpQjtBQUV6Q0MsTUFBQUEsWUFBWSxFQUFFLHNCQUFTQyxLQUFULEVBQWdCSixLQUFoQixFQUF1QjtBQUNqQztBQUNBQSxRQUFBQSxLQUFLLENBQUNLLGVBQU47QUFDQSxlQUFPLElBQVA7QUFDSCxPQU53QztBQU96Q0MsTUFBQUEsWUFBWSxFQUFFLHNCQUFTRixLQUFULEVBQWdCSixLQUFoQixFQUF1QjtBQUNqQztBQUNBQSxRQUFBQSxLQUFLLENBQUNLLGVBQU47QUFDSCxPQVZ3QztBQVd6Q0UsTUFBQUEsWUFBWSxFQUFFLHNCQUFTSCxLQUFULEVBQWdCSixLQUFoQixFQUF1QjtBQUNqQztBQUNBQSxRQUFBQSxLQUFLLENBQUNLLGVBQU47QUFDSDtBQWR3QyxLQUE1QixFQWVkVCxJQUFJLENBQUNZLElBZlMsQ0FBakIsQ0FKZ0IsQ0FxQmhCOztBQUNBakIsSUFBQUEsRUFBRSxDQUFDa0IsV0FBSCxDQUFlQyxFQUFmLENBQWtCbkIsRUFBRSxDQUFDb0IsV0FBSCxDQUFlQyxTQUFmLENBQXlCQyxRQUEzQyxFQUNnQixVQUFVYixLQUFWLEVBQWlCO0FBQ2I7QUFDQUEsTUFBQUEsS0FBSyxDQUFDSyxlQUFOO0FBQ0gsS0FKakIsRUFJbUIsSUFKbkIsRUF0QmdCLENBMkJoQjs7QUFDQWQsSUFBQUEsRUFBRSxDQUFDa0IsV0FBSCxDQUFlQyxFQUFmLENBQWtCbkIsRUFBRSxDQUFDb0IsV0FBSCxDQUFlQyxTQUFmLENBQXlCRSxNQUEzQyxFQUNnQixVQUFVZCxLQUFWLEVBQWdCO0FBQ1o7QUFDQUEsTUFBQUEsS0FBSyxDQUFDSyxlQUFOO0FBQ0gsS0FKakIsRUFJbUIsSUFKbkI7QUFNSCxHQW5ESSxDQXFETDtBQUNBO0FBRUE7O0FBeERLLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gdG91Y2ggaW5wdXRcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoe1xuICAgICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfT05FX0JZX09ORSxcbiAgICAgICAgICAgIG9uVG91Y2hCZWdhbjogZnVuY3Rpb24odG91Y2gsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy/miKrojrfkuovku7ZcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvblRvdWNoTW92ZWQ6IGZ1bmN0aW9uKHRvdWNoLCBldmVudCkge1xuICAgICAgICAgICAgICAgIC8v5oiq6I635LqL5Lu2XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25Ub3VjaEVuZGVkOiBmdW5jdGlvbih0b3VjaCwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAvL+aIquiOt+S6i+S7tlxuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBzZWxmLm5vZGUpO1xuXG4gICAgICAgIC8v5oyJ6ZSu5oyJ5LiLXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfRE9XTiwgXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIquiOt+S6i+S7tlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIC8v5oyJ6ZSu5oqs6LW3XG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGV2ZW50KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIquiOt+S6i+S7tlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIl19