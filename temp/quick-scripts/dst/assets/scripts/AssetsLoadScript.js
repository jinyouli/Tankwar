
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/AssetsLoadScript.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'dbc42i0xlVKnap/Lbb+PPHz', 'AssetsLoadScript');
// scripts/AssetsLoadScript.js

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
    numLabel: cc.Label
  },
  // use this for initialization
  onLoad: function onLoad() {
    var self = this;
    var urls = [{
      id: "tank",
      url: cc.url.raw("resources/tank.plist")
    }];
    cc.LoadingItems.create(cc.loader, urls, function (completedCount, totalCount, item) {
      var progress = (100 * completedCount / totalCount).toFixed(2);
      cc.log(progress + '%');
      self.numLabel.string = Math.abs(progress) + '%';
      console.log("==========" + item.url);
    }, function (errors, items) {
      if (errors) {
        for (var i = 0; i < errors.length; ++i) {
          cc.log('Error url: ' + errors[i] + ', error: ' + items.getError(errors[i]));
        }
      } else {
        console.log(items.totalCount);
      }
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQXNzZXRzTG9hZFNjcmlwdC5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsIm51bUxhYmVsIiwiTGFiZWwiLCJvbkxvYWQiLCJzZWxmIiwidXJscyIsImlkIiwidXJsIiwicmF3IiwiTG9hZGluZ0l0ZW1zIiwiY3JlYXRlIiwibG9hZGVyIiwiY29tcGxldGVkQ291bnQiLCJ0b3RhbENvdW50IiwiaXRlbSIsInByb2dyZXNzIiwidG9GaXhlZCIsImxvZyIsInN0cmluZyIsIk1hdGgiLCJhYnMiLCJjb25zb2xlIiwiZXJyb3JzIiwiaXRlbXMiLCJpIiwibGVuZ3RoIiwiZ2V0RXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLElBQUFBLFFBQVEsRUFBRUosRUFBRSxDQUFDSztBQVhMLEdBSFA7QUFrQkw7QUFDQUMsRUFBQUEsTUFBTSxFQUFFLGtCQUFZO0FBRWhCLFFBQUlDLElBQUksR0FBRyxJQUFYO0FBRUEsUUFBSUMsSUFBSSxHQUFHLENBQ1A7QUFDSUMsTUFBQUEsRUFBRSxFQUFFLE1BRFI7QUFFSUMsTUFBQUEsR0FBRyxFQUFFVixFQUFFLENBQUNVLEdBQUgsQ0FBT0MsR0FBUCxDQUFXLHNCQUFYO0FBRlQsS0FETyxDQUFYO0FBT0FYLElBQUFBLEVBQUUsQ0FBQ1ksWUFBSCxDQUFnQkMsTUFBaEIsQ0FBdUJiLEVBQUUsQ0FBQ2MsTUFBMUIsRUFBa0NOLElBQWxDLEVBQXdDLFVBQVVPLGNBQVYsRUFBMEJDLFVBQTFCLEVBQXNDQyxJQUF0QyxFQUE0QztBQUNoRixVQUFJQyxRQUFRLEdBQUcsQ0FBQyxNQUFNSCxjQUFOLEdBQXVCQyxVQUF4QixFQUFvQ0csT0FBcEMsQ0FBNEMsQ0FBNUMsQ0FBZjtBQUNBbkIsTUFBQUEsRUFBRSxDQUFDb0IsR0FBSCxDQUFPRixRQUFRLEdBQUcsR0FBbEI7QUFDQVgsTUFBQUEsSUFBSSxDQUFDSCxRQUFMLENBQWNpQixNQUFkLEdBQXVCQyxJQUFJLENBQUNDLEdBQUwsQ0FBU0wsUUFBVCxJQUFxQixHQUE1QztBQUNBTSxNQUFBQSxPQUFPLENBQUNKLEdBQVIsQ0FBWSxlQUFhSCxJQUFJLENBQUNQLEdBQTlCO0FBRUgsS0FORCxFQU1HLFVBQVVlLE1BQVYsRUFBa0JDLEtBQWxCLEVBQXlCO0FBQ3hCLFVBQUlELE1BQUosRUFBWTtBQUNSLGFBQUssSUFBSUUsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsTUFBTSxDQUFDRyxNQUEzQixFQUFtQyxFQUFFRCxDQUFyQyxFQUF3QztBQUNwQzNCLFVBQUFBLEVBQUUsQ0FBQ29CLEdBQUgsQ0FBTyxnQkFBZ0JLLE1BQU0sQ0FBQ0UsQ0FBRCxDQUF0QixHQUE0QixXQUE1QixHQUEwQ0QsS0FBSyxDQUFDRyxRQUFOLENBQWVKLE1BQU0sQ0FBQ0UsQ0FBRCxDQUFyQixDQUFqRDtBQUNIO0FBQ0osT0FKRCxNQUtLO0FBQ0RILFFBQUFBLE9BQU8sQ0FBQ0osR0FBUixDQUFZTSxLQUFLLENBQUNWLFVBQWxCO0FBRUg7QUFDSixLQWhCRDtBQW1CSCxHQWpESSxDQW1ETDtBQUNBO0FBRUE7O0FBdERLLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuICAgICAgICBudW1MYWJlbDogY2MuTGFiZWwsXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciB1cmxzID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogXCJ0YW5rXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvdGFuay5wbGlzdFwiKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgY2MuTG9hZGluZ0l0ZW1zLmNyZWF0ZShjYy5sb2FkZXIsIHVybHMsIGZ1bmN0aW9uIChjb21wbGV0ZWRDb3VudCwgdG90YWxDb3VudCwgaXRlbSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvZ3Jlc3MgPSAoMTAwICogY29tcGxldGVkQ291bnQgLyB0b3RhbENvdW50KS50b0ZpeGVkKDIpO1xyXG4gICAgICAgICAgICBjYy5sb2cocHJvZ3Jlc3MgKyAnJScpO1xyXG4gICAgICAgICAgICBzZWxmLm51bUxhYmVsLnN0cmluZyA9IE1hdGguYWJzKHByb2dyZXNzKSArICclJztcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT09XCIraXRlbS51cmwpO1xyXG5cclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3JzLCBpdGVtcykge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZygnRXJyb3IgdXJsOiAnICsgZXJyb3JzW2ldICsgJywgZXJyb3I6ICcgKyBpdGVtcy5nZXRFcnJvcihlcnJvcnNbaV0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW1zLnRvdGFsQ291bnQpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iXX0=