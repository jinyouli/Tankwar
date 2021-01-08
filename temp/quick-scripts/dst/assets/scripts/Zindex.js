
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/Zindex.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a8f5awhVoxIkZF+abLdrnzb', 'Zindex');
// scripts/Zindex.js

"use strict";

/**
*SetZIndex.js 控制组件
**/
cc.Class({
  "extends": cc.Component,
  //编辑器属性定义
  properties: {
    zIndex: {
      type: cc.Integer,
      //使用整型定义
      "default": 0,
      //使用notify函数监听属性变化
      notify: function notify(oldValue) {
        //减少无效赋值
        if (oldValue === this.zIndex) {
          return;
        }

        this.node.zIndex = this.zIndex;
      }
    }
  },
  onLoad: function onLoad() {
    this.node.zIndex = this.zIndex;
  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcWmluZGV4LmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiekluZGV4IiwidHlwZSIsIkludGVnZXIiLCJub3RpZnkiLCJvbGRWYWx1ZSIsIm5vZGUiLCJvbkxvYWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztBQUdBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUVMO0FBQ0FDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxNQUFNLEVBQUU7QUFDSkMsTUFBQUEsSUFBSSxFQUFFTCxFQUFFLENBQUNNLE9BREw7QUFDYztBQUNsQixpQkFBUyxDQUZMO0FBR0o7QUFDQUMsTUFBQUEsTUFKSSxrQkFJR0MsUUFKSCxFQUlhO0FBQ2I7QUFDQSxZQUFJQSxRQUFRLEtBQUssS0FBS0osTUFBdEIsRUFBOEI7QUFDMUI7QUFDSDs7QUFDRCxhQUFLSyxJQUFMLENBQVVMLE1BQVYsR0FBbUIsS0FBS0EsTUFBeEI7QUFDSDtBQVZHO0FBREEsR0FIUDtBQWlCTE0sRUFBQUEsTUFqQkssb0JBaUJLO0FBQ04sU0FBS0QsSUFBTCxDQUFVTCxNQUFWLEdBQW1CLEtBQUtBLE1BQXhCO0FBQ0g7QUFuQkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbipTZXRaSW5kZXguanMg5o6n5Yi257uE5Lu2XHJcbioqL1xyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsICAgIFxyXG4gICAgLy/nvJbovpHlmajlsZ7mgKflrprkuYlcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICB6SW5kZXg6IHtcclxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlciwgLy/kvb/nlKjmlbTlnovlrprkuYlcclxuICAgICAgICAgICAgZGVmYXVsdDogMCwgICAgICAgICAgICBcclxuICAgICAgICAgICAgLy/kvb/nlKhub3RpZnnlh73mlbDnm5HlkKzlsZ7mgKflj5jljJZcclxuICAgICAgICAgICAgbm90aWZ5KG9sZFZhbHVlKSB7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy/lh4/lsJHml6DmlYjotYvlgLxcclxuICAgICAgICAgICAgICAgIGlmIChvbGRWYWx1ZSA9PT0gdGhpcy56SW5kZXgpIHsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuekluZGV4ID0gdGhpcy56SW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgb25Mb2FkICgpIHsgICAgICAgIFxyXG4gICAgICAgIHRoaXMubm9kZS56SW5kZXggPSB0aGlzLnpJbmRleDtcclxuICAgIH1cclxufSk7Il19