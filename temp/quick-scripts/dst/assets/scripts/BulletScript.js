
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/BulletScript.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f2438tTsclDlKMotV5yR31a', 'BulletScript');
// scripts/BulletScript.js

"use strict";

var TankType = require("TankData").tankType;

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
    speed: 20,
    camp: 0
  },
  // use this for initialization
  onLoad: function onLoad() {
    this._cityCtrl = cc.find("/CityScript").getComponent("CityScript");
  },
  //对象池get获取对象是会调用此方法
  reuse: function reuse(bulletPool) {
    this.bulletPool = bulletPool; // get 中传入的子弹对象池
  },
  //子弹移动
  bulletMove: function bulletMove() {
    //偏移
    var angle = this.node.angle + 90;

    if (angle == 0 || angle == 180 || angle == 90) {
      this.offset = cc.v2(Math.floor(Math.cos(Math.PI / 180 * angle)), Math.floor(Math.sin(Math.PI / 180 * angle)));
    } else if (angle == 270) {
      this.offset = cc.v2(Math.ceil(Math.cos(Math.PI / 180 * angle)), Math.floor(Math.sin(Math.PI / 180 * angle)));
    } else {
      this.offset = cc.v2(Math.cos(Math.PI / 180 * angle), Math.sin(Math.PI / 180 * angle));
    }
  },
  //子弹爆炸
  bulletBoom: function bulletBoom() {
    this.node.parent = null;
    this.bulletPool.put(this.node);
  },
  // called every frame, uncomment this function to activate update callback
  update: function update(dt) {
    //移动
    this.node.x += this.offset.x * this.speed * dt;
    this.node.y += this.offset.y * this.speed * dt; //检测碰撞

    var rect = this.node.getBoundingBox();

    if (this._cityCtrl.collisionTest(rect, true) || this.collisionTank(rect)) {
      //子弹爆炸
      this.bulletBoom();
    }
  },
  //判断与坦克碰撞
  collisionTank: function collisionTank(rect) {
    for (var i = 0; i < cc.gameData.tankList.length; i++) {
      var tank = cc.gameData.tankList[i];
      var tankCtrl = tank.getComponent("TankScript");

      if (tankCtrl.team == this.node.camp || tankCtrl.die) {
        //同一队不互相伤害
        continue;
      }

      var boundingBox = tank.getBoundingBox();

      if (rect.intersects(boundingBox)) {
        if (--tankCtrl.blood <= 0) {
          tankCtrl.boom();
        } else {
          tankCtrl.turnGreen(tankCtrl.blood);
        }

        return true;
      }
    }

    return false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL0J1bGxldFNjcmlwdC5qcyJdLCJuYW1lcyI6WyJUYW5rVHlwZSIsInJlcXVpcmUiLCJ0YW5rVHlwZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwic3BlZWQiLCJjYW1wIiwib25Mb2FkIiwiX2NpdHlDdHJsIiwiZmluZCIsImdldENvbXBvbmVudCIsInJldXNlIiwiYnVsbGV0UG9vbCIsImJ1bGxldE1vdmUiLCJhbmdsZSIsIm5vZGUiLCJvZmZzZXQiLCJ2MiIsIk1hdGgiLCJmbG9vciIsImNvcyIsIlBJIiwic2luIiwiY2VpbCIsImJ1bGxldEJvb20iLCJwYXJlbnQiLCJwdXQiLCJ1cGRhdGUiLCJkdCIsIngiLCJ5IiwicmVjdCIsImdldEJvdW5kaW5nQm94IiwiY29sbGlzaW9uVGVzdCIsImNvbGxpc2lvblRhbmsiLCJpIiwiZ2FtZURhdGEiLCJ0YW5rTGlzdCIsImxlbmd0aCIsInRhbmsiLCJ0YW5rQ3RybCIsInRlYW0iLCJkaWUiLCJib3VuZGluZ0JveCIsImludGVyc2VjdHMiLCJibG9vZCIsImJvb20iLCJ0dXJuR3JlZW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsUUFBUSxHQUFHQyxPQUFPLENBQUMsVUFBRCxDQUFQLENBQW9CQyxRQUFuQzs7QUFFQUMsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsSUFBQUEsS0FBSyxFQUFFLEVBWEM7QUFZUkMsSUFBQUEsSUFBSSxFQUFHO0FBWkMsR0FIUDtBQW1CTDtBQUNBQyxFQUFBQSxNQUFNLEVBQUUsa0JBQVk7QUFDaEIsU0FBS0MsU0FBTCxHQUFpQlAsRUFBRSxDQUFDUSxJQUFILENBQVEsYUFBUixFQUF1QkMsWUFBdkIsQ0FBb0MsWUFB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QUFxQkYsQ0FBckIsQ0FBWDtBQUNBLFVBQUlLLFFBQVEsR0FBR0QsSUFBSSxDQUFDN0IsWUFBTCxDQUFrQixZQUFsQixDQUFmOztBQUNBLFVBQUc4QixRQUFRLENBQUNDLElBQVQsSUFBaUIsS0FBSzFCLElBQUwsQ0FBVVQsSUFBM0IsSUFBbUNrQyxRQUFRLENBQUNFLEdBQS9DLEVBQW1EO0FBQy9DO0FBQ0E7QUFDSDs7QUFDRCxVQUFJQyxXQUFXLEdBQUdKLElBQUksQ0FBQ1AsY0FBTCxFQUFsQjs7QUFDQSxVQUFHRCxJQUFJLENBQUNhLFVBQUwsQ0FBZ0JELFdBQWhCLENBQUgsRUFBZ0M7QUFDNUIsWUFBRyxFQUFFSCxRQUFRLENBQUNLLEtBQVgsSUFBb0IsQ0FBdkIsRUFBeUI7QUFDckJMLFVBQUFBLFFBQVEsQ0FBQ00sSUFBVDtBQUNILFNBRkQsTUFHSTtBQUNBTixVQUFBQSxRQUFRLENBQUNPLFNBQVQsQ0FBbUJQLFFBQVEsQ0FBQ0ssS0FBNUI7QUFDSDs7QUFDRCxlQUFPLElBQVA7QUFDSDtBQUNKOztBQUNELFdBQU8sS0FBUDtBQUNIO0FBeEZJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciBUYW5rVHlwZSA9IHJlcXVpcmUoXCJUYW5rRGF0YVwiKS50YW5rVHlwZTtcblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgc3BlZWQ6IDIwLFxuICAgICAgICBjYW1wIDogMCxcblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fY2l0eUN0cmwgPSBjYy5maW5kKFwiL0NpdHlTY3JpcHRcIikuZ2V0Q29tcG9uZW50KFwiQ2l0eVNjcmlwdFwiKTtcbiAgICB9LFxuXG4gICAgLy/lr7nosaHmsaBnZXTojrflj5blr7nosaHmmK/kvJrosIPnlKjmraTmlrnms5VcbiAgICByZXVzZTogZnVuY3Rpb24gKGJ1bGxldFBvb2wpIHtcbiAgICAgICAgdGhpcy5idWxsZXRQb29sID0gYnVsbGV0UG9vbDsgLy8gZ2V0IOS4reS8oOWFpeeahOWtkOW8ueWvueixoeaxoFxuICAgIH0sXG5cbiAgICAvL+WtkOW8ueenu+WKqFxuICAgIGJ1bGxldE1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy/lgY/np7tcbiAgICAgICAgdmFyIGFuZ2xlID0gdGhpcy5ub2RlLmFuZ2xlICsgOTA7XG4gICAgICAgIGlmKGFuZ2xlPT0wIHx8IGFuZ2xlPT0xODAgfHwgYW5nbGU9PTkwKXtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gY2MudjIoTWF0aC5mbG9vcihNYXRoLmNvcyhNYXRoLlBJLzE4MCphbmdsZSkpLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnNpbihNYXRoLlBJLzE4MCphbmdsZSkpKTtcbiAgICAgICAgfWVsc2UgaWYoYW5nbGU9PTI3MCl7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IGNjLnYyKE1hdGguY2VpbChNYXRoLmNvcyhNYXRoLlBJLzE4MCphbmdsZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKE1hdGguc2luKE1hdGguUEkvMTgwKmFuZ2xlKSkpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IGNjLnYyKE1hdGguY29zKE1hdGguUEkvMTgwKmFuZ2xlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5zaW4oTWF0aC5QSS8xODAqYW5nbGUpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvL+WtkOW8ueeIhueCuFxuICAgIGJ1bGxldEJvb206IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuYnVsbGV0UG9vbC5wdXQodGhpcy5ub2RlKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuICAgICAgICAvL+enu+WKqFxuICAgICAgICB0aGlzLm5vZGUueCArPSB0aGlzLm9mZnNldC54KnRoaXMuc3BlZWQqZHQ7XG4gICAgICAgIHRoaXMubm9kZS55ICs9IHRoaXMub2Zmc2V0LnkqdGhpcy5zcGVlZCpkdDtcblxuICAgICAgICAvL+ajgOa1i+eisOaSnlxuICAgICAgICB2YXIgcmVjdCA9IHRoaXMubm9kZS5nZXRCb3VuZGluZ0JveCgpO1xuICAgICAgICBpZih0aGlzLl9jaXR5Q3RybC5jb2xsaXNpb25UZXN0KHJlY3QsIHRydWUpXG4gICAgICAgICAgICB8fCB0aGlzLmNvbGxpc2lvblRhbmsocmVjdCkpe1xuICAgICAgICAgICAgLy/lrZDlvLnniIbngrhcbiAgICAgICAgICAgIHRoaXMuYnVsbGV0Qm9vbSgpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy/liKTmlq3kuI7lnablhYvnorDmkp5cbiAgICBjb2xsaXNpb25UYW5rOiBmdW5jdGlvbihyZWN0KSB7XG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGNjLmdhbWVEYXRhLnRhbmtMaXN0Lmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHZhciB0YW5rID0gY2MuZ2FtZURhdGEudGFua0xpc3RbaV1cbiAgICAgICAgICAgIHZhciB0YW5rQ3RybCA9IHRhbmsuZ2V0Q29tcG9uZW50KFwiVGFua1NjcmlwdFwiKTtcbiAgICAgICAgICAgIGlmKHRhbmtDdHJsLnRlYW0gPT0gdGhpcy5ub2RlLmNhbXAgfHwgdGFua0N0cmwuZGllKXtcbiAgICAgICAgICAgICAgICAvL+WQjOS4gOmYn+S4jeS6kuebuOS8pOWus1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJvdW5kaW5nQm94ID0gdGFuay5nZXRCb3VuZGluZ0JveCgpO1xuICAgICAgICAgICAgaWYocmVjdC5pbnRlcnNlY3RzKGJvdW5kaW5nQm94KSl7XG4gICAgICAgICAgICAgICAgaWYoLS10YW5rQ3RybC5ibG9vZCA8PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgdGFua0N0cmwuYm9vbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB0YW5rQ3RybC50dXJuR3JlZW4odGFua0N0cmwuYmxvb2QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxufSk7XG4iXX0=