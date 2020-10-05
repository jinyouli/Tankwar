
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL0Fzc2V0c0xvYWRTY3JpcHQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJudW1MYWJlbCIsIkxhYmVsIiwib25Mb2FkIiwic2VsZiIsInVybHMiLCJpZCIsInVybCIsInJhdyIsIkxvYWRpbmdJdGVtcyIsImNyZWF0ZSIsImxvYWRlciIsImNvbXBsZXRlZENvdW50IiwidG90YWxDb3VudCIsIml0ZW0iLCJwcm9ncmVzcyIsInRvRml4ZWQiLCJsb2ciLCJzdHJpbmciLCJNYXRoIiwiYWJzIiwiY29uc29sZSIsImVycm9ycyIsIml0ZW1zIiwiaSIsImxlbmd0aCIsImdldEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxJQUFBQSxRQUFRLEVBQUVKLEVBQUUsQ0FBQ0s7QUFYTCxHQUhQO0FBa0JMO0FBQ0FDLEVBQUFBLE1BQU0sRUFBRSxrQkFBWTtBQUVoQixRQUFJQyxJQUFJLEdBQUcsSUFBWDtBQUVBLFFBQUlDLElBQUksR0FBRyxDQUNQO0FBQ0lDLE1BQUFBLEVBQUUsRUFBRSxNQURSO0FBRUlDLE1BQUFBLEdBQUcsRUFBRVYsRUFBRSxDQUFDVSxHQUFILENBQU9DLEdBQVAsQ0FBVyxzQkFBWDtBQUZULEtBRE8sQ0FBWDtBQU9BWCxJQUFBQSxFQUFFLENBQUNZLFlBQUgsQ0FBZ0JDLE1BQWhCLENBQXVCYixFQUFFLENBQUNjLE1BQTFCLEVBQWtDTixJQUFsQyxFQUF3QyxVQUFVTyxjQUFWLEVBQTBCQyxVQUExQixFQUFzQ0MsSUFBdEMsRUFBNEM7QUFDaEYsVUFBSUMsUUFBUSxHQUFHLENBQUMsTUFBTUgsY0FBTixHQUF1QkMsVUFBeEIsRUFBb0NHLE9BQXBDLENBQTRDLENBQTVDLENBQWY7QUFDQW5CLE1BQUFBLEVBQUUsQ0FBQ29CLEdBQUgsQ0FBT0YsUUFBUSxHQUFHLEdBQWxCO0FBQ0FYLE1BQUFBLElBQUksQ0FBQ0gsUUFBTCxDQUFjaUIsTUFBZCxHQUF1QkMsSUFBSSxDQUFDQyxHQUFMLENBQVNMLFFBQVQsSUFBcUIsR0FBNUM7QUFDQU0sTUFBQUEsT0FBTyxDQUFDSixHQUFSLENBQVksZUFBYUgsSUFBSSxDQUFDUCxHQUE5QjtBQUVILEtBTkQsRUFNRyxVQUFVZSxNQUFWLEVBQWtCQyxLQUFsQixFQUF5QjtBQUN4QixVQUFJRCxNQUFKLEVBQVk7QUFDUixhQUFLLElBQUlFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdGLE1BQU0sQ0FBQ0csTUFBM0IsRUFBbUMsRUFBRUQsQ0FBckMsRUFBd0M7QUFDcEMzQixVQUFBQSxFQUFFLENBQUNvQixHQUFILENBQU8sZ0JBQWdCSyxNQUFNLENBQUNFLENBQUQsQ0FBdEIsR0FBNEIsV0FBNUIsR0FBMENELEtBQUssQ0FBQ0csUUFBTixDQUFlSixNQUFNLENBQUNFLENBQUQsQ0FBckIsQ0FBakQ7QUFDSDtBQUNKLE9BSkQsTUFLSztBQUNESCxRQUFBQSxPQUFPLENBQUNKLEdBQVIsQ0FBWU0sS0FBSyxDQUFDVixVQUFsQjtBQUVIO0FBQ0osS0FoQkQ7QUFtQkgsR0FqREksQ0FtREw7QUFDQTtBQUVBOztBQXRESyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBudW1MYWJlbDogY2MuTGFiZWwsXG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHZhciB1cmxzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiBcInRhbmtcIixcbiAgICAgICAgICAgICAgICB1cmw6IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvdGFuay5wbGlzdFwiKVxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuXG4gICAgICAgIGNjLkxvYWRpbmdJdGVtcy5jcmVhdGUoY2MubG9hZGVyLCB1cmxzLCBmdW5jdGlvbiAoY29tcGxldGVkQ291bnQsIHRvdGFsQ291bnQsIGl0ZW0pIHtcbiAgICAgICAgICAgIHZhciBwcm9ncmVzcyA9ICgxMDAgKiBjb21wbGV0ZWRDb3VudCAvIHRvdGFsQ291bnQpLnRvRml4ZWQoMik7XG4gICAgICAgICAgICBjYy5sb2cocHJvZ3Jlc3MgKyAnJScpO1xuICAgICAgICAgICAgc2VsZi5udW1MYWJlbC5zdHJpbmcgPSBNYXRoLmFicyhwcm9ncmVzcykgKyAnJSc7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09PT09PT1cIitpdGVtLnVybCk7XG5cbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9ycywgaXRlbXMpIHtcbiAgICAgICAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ0Vycm9yIHVybDogJyArIGVycm9yc1tpXSArICcsIGVycm9yOiAnICsgaXRlbXMuZ2V0RXJyb3IoZXJyb3JzW2ldKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbXMudG90YWxDb3VudCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cblxuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iXX0=