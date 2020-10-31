
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/joystick/scripts/JoystickCtrl');
require('./assets/migration/use_v2.0.x_cc.Toggle_event');
require('./assets/scripts/Alert');
require('./assets/scripts/AssetsLoadScript');
require('./assets/scripts/BlastScript');
require('./assets/scripts/BulletScript');
require('./assets/scripts/ChoiceScript');
require('./assets/scripts/CityScript');
require('./assets/scripts/NoTouchScript');
require('./assets/scripts/StartScript');
require('./assets/scripts/TankData');
require('./assets/scripts/TankScript');
require('./assets/scripts/TiledMapData');

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/CityScript.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '7f0b08Dcw5F7oWFl36ggKRC', 'CityScript');
// scripts/CityScript.js

"use strict";

var TankType = require("TankData").tankType;

var alert = require('Alert');

cc.Class({
  "extends": cc.Component,
  properties: {
    //地图
    curMap: cc.TiledMap,
    //摇杆
    yaogan: cc.Node,
    //子弹预制体
    bullet: cc.Prefab,
    //坦克预制体
    tank: {
      "default": null,
      type: cc.Prefab
    },
    //最大数量
    maxCount: 10,
    life: 3,
    //出生地
    bornPoses: {
      "default": [],
      type: cc.Vec2
    },
    //坦克皮肤
    spriteFrames: {
      "default": [],
      type: cc.SpriteFrame
    },
    //坦克移动速度
    tankSpeeds: {
      "default": [],
      type: cc.Float
    },
    //坦克子弹发射间隔时间
    tankFireTimes: {
      "default": [],
      type: cc.Float
    },
    //坦克血量
    tankBloods: {
      "default": [],
      type: cc.Integer
    },
    enemyNum: {
      type: cc.Label,
      "default": null
    },
    lifeNum: {
      type: cc.Label,
      "default": null
    },
    doubleFire: false,
    doubleFireBtn: {
      "default": null,
      type: cc.Node
    },
    doubleFireFrames: {
      "default": [],
      type: cc.SpriteFrame
    }
  },
  // use this for initialization
  onLoad: function onLoad() {
    // cc.director.setDisplayStats(true);
    //获取摇杆控制组件
    this._joystickCtrl = this.yaogan.getComponent("JoystickCtrl"); //获取地图 TiledMap 组件

    this._tiledMap = this.curMap.getComponent('cc.TiledMap');
    this.enemyNum.string = this.maxCount + "";
    this.lifeNum.string = this.life + "";
  },
  start: function start(err) {
    if (err) {
      return;
    } // alert.show.call(this, "关卡" + cc.gameData.curLevel, function () {
    // });
    //默认角度


    this.curAngle = null;
    var self = this; //注册监听事件

    this.registerInputEvent(); //引入地图数据

    this._tiledMapData = require("TiledMapData"); //获取地图尺寸

    this._curMapTileSize = this._tiledMap.getTileSize();
    this._curMapSize = cc.v2(this._tiledMap.node.width, this._tiledMap.node.height);
    cc.log("this._curMapTileSize =" + this._curMapTileSize);
    cc.log("this._curMapSize =" + this._curMapSize); //地图墙层

    this.mapLayer0 = this._tiledMap.getLayer("layer0"); //初始化对象池(参数必须为对应脚本的文件名)

    this.bulletPool = new cc.NodePool("BulletScript");
    var initBulletCount = 20;

    for (var i = 0; i < initBulletCount; ++i) {
      var bullet = cc.instantiate(this.bullet);
      this.bulletPool.put(bullet);
    }

    this.tankPool = new cc.NodePool("TankScript");

    for (var i = 0; i < this.maxCount; ++i) {
      var tank = cc.instantiate(this.tank);
      this.tankPool.put(tank);
    }

    if (!cc.gameData) {
      cc.gameData = {};
    } //初始化


    cc.gameData.teamId = 0; //临时

    cc.gameData.single = true; //地图内坦克列表

    cc.gameData.tankList = []; //地图内子弹列表

    cc.gameData.bulletList = []; //获取组件
    //this.tankNode = cc.find("/Canvas/Map/tank");

    this.tankNode = cc.find("/Canvas/map1/layer0"); //加入player

    this.player = this.addPlayerTank(); //获取坦克控制组件

    this._playerTankCtrl = this.player.getComponent("TankScript"); //启动定时器，添加坦克

    this.schedule(this.addAITank, 3, cc.macro.REPEAT_FOREVER, 1);
  },
  // called every frame, uncomment this function to activate update callback
  update: function update(dt) {
    if (this.doubleFire) {
      if (this._playerTankCtrl.startFire(this.bulletPool)) {//播放射击音效
        //cc.audioEngine.play(this._playerTankCtrl.shootAudio, false, 1);
      }
    }
  },
  setDoubleFire: function setDoubleFire() {
    this.doubleFire = !this.doubleFire;

    if (this.doubleFire) {
      this.doubleFireBtn.getComponent(cc.Sprite).spriteFrame = this.doubleFireFrames[1];
    } else {
      this.doubleFireBtn.getComponent(cc.Sprite).spriteFrame = this.doubleFireFrames[0];
    }
  },
  //注册输入事件
  registerInputEvent: function registerInputEvent() {
    var self = this;

    this._joystickCtrl.addJoyStickTouchChangeListener(function (angle) {
      if (angle == self.curAngle && !self._playerTankCtrl.stopMove) {
        return;
      }

      self.curAngle = angle;

      if (angle != null) {
        //开始前进
        self._playerTankCtrl.tankMoveStart(angle);
      } else {
        //停止前进
        self._playerTankCtrl.tankMoveStop();
      }
    }); //按键按下


    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
      var angle = null;

      switch (event.keyCode) {
        case cc.macro.KEY.w:
          angle = 90;
          break;

        case cc.macro.KEY.s:
          angle = 270;
          break;

        case cc.macro.KEY.a:
          angle = 180;
          break;

        case cc.macro.KEY.d:
          angle = 0;
          break;
      }

      if (event.keyCode == cc.macro.KEY.k) {
        this.fireBtnClick();
      } else {
        self._playerTankCtrl.tankMoveStop();
      }

      if (angle != null) {
        //开始前进
        self._playerTankCtrl.tankMoveStart(angle);
      }
    }, this); //按键抬起

    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event) {
      //停止前进
      if (event.keyCode != cc.macro.KEY.k) {
        self._playerTankCtrl.tankMoveStop();
      }
    }, this);
  },
  //碰撞检测
  collisionTest: function collisionTest(rect, bullet) {
    //判断是否碰到地图边界
    if (rect.xMin <= -this._curMapSize.x / 2 || rect.xMax >= this._curMapSize.x / 2 || rect.yMin <= -this._curMapSize.y / 2 || rect.yMax >= this._curMapSize.y / 2) {
      return true;
    } //判断是否撞墙
    //将坐标转换为地图坐标系


    var MinY = this._curMapSize.y / 2 - rect.yMin;
    var MaxY = this._curMapSize.y / 2 - rect.yMax;
    var MinX = this._curMapSize.x / 2 + rect.xMin;
    var MaxX = this._curMapSize.x / 2 + rect.xMax; //获取四个角的顶点

    var LeftDown = cc.v2(MinX, MinY);
    var RightDown = cc.v2(MaxX, MinY);
    var LeftUp = cc.v2(MinX, MaxY);
    var RightUp = cc.v2(MaxX, MaxY); //获取四条边的中心点

    var MidDown = cc.v2(MinX + (MaxX - MinX) / 2, MinY);
    var MidUp = cc.v2(MinX + (MaxX - MinX) / 2, MaxY);
    var MidLeft = cc.v2(MinX, MinY + (MaxY - MinY) / 2);
    var MidRight = cc.v2(MaxX, MinY + (MaxY - MinY) / 2); //检测碰撞

    return this._collisionTest([LeftDown, RightDown, LeftUp, RightUp, MidDown, MidUp, MidLeft, MidRight], bullet);
  },
  //内部碰撞检测方法
  _collisionTest: function _collisionTest(points, bullet) {
    var point = points.shift();
    var gid = this.mapLayer0.getTileGIDAt(cc.v2(parseInt(point.x / this._curMapTileSize.width), parseInt(point.y / this._curMapTileSize.height)));

    if (this._tiledMapData.gidToTileType[gid] != this._tiledMapData.tileType.tileNone && this._tiledMapData.gidToTileType[gid] != this._tiledMapData.tileType.tileGrass) {
      if (bullet && this._tiledMapData.gidToTileType[gid] == this._tiledMapData.tileType.tileWall) {
        this.mapLayer0.setTileGIDAt(0, parseInt(point.x / this._curMapTileSize.width), parseInt(point.y / this._curMapTileSize.height), 1);
      } else if (bullet && this._tiledMapData.gidToTileType[gid] == this._tiledMapData.tileType.tileKing) {
        this.mapLayer0.setTileGIDAt(0, 12, 25, 1);
        this.mapLayer0.setTileGIDAt(0, 12, 24, 1);
        this.mapLayer0.setTileGIDAt(0, 13, 25, 1);
        this.mapLayer0.setTileGIDAt(0, 13, 24, 1);
        this.gameOver();
      }

      return true;
    }

    if (points.length > 0) {
      return this._collisionTest(points, bullet);
    } else {
      return false;
    }
  },
  gameOver: function gameOver() {
    this.doubleFire = false;

    for (var i = 0; i < cc.gameData.tankList.length; i++) {
      var tank = cc.gameData.tankList[i];
      var tankCtrl = tank.getComponent("TankScript");
      tankCtrl.tankStop();
    } //弹窗调用


    alert.show.call(this, "游戏结束", function () {
      cc.director.loadScene("StartScene");
    });
  },
  //加入玩家坦克
  addPlayerTank: function addPlayerTank(team) {
    if (this.tankPool.size() > 0) {
      var tank = this.tankPool.get();
      tank.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[this.spriteFrames.length - 1];
      tank.position = this.bornPoses[this.bornPoses.length - 1]; //获取坦克控制组件

      var tankCtrl = tank.getComponent("TankScript"); //设置坦克属性

      tankCtrl.tankType = TankType.Player;
      tankCtrl.speed = this.tankSpeeds[this.tankSpeeds.length - 1];
      tankCtrl.fireTime = this.tankFireTimes[this.tankFireTimes.length - 1]; //tankCtrl.blood = this.tankBloods[this.tankBloods.length-1];
      //tankCtrl.blood = this.life ;

      tankCtrl.blood = 1;
      tankCtrl.die = false;

      if (!team) {
        if (cc.gameData.single) {
          //单机版
          tankCtrl.team = 0;
        } else {
          //大乱斗
          tankCtrl.team = ++cc.gameData.teamId;
        }
      } else {
        //组队
        tankCtrl.team = team;
      }

      tank.parent = this.tankNode; //加到列表

      cc.gameData.tankList.push(tank);
      return tank;
    }

    return null;
  },
  //加入AI
  addAITank: function addAITank(dt, team) {
    if (this.tankPool.size() > 0 && this.maxCount > 0) {
      var tank = this.tankPool.get();
      var index = parseInt(Math.random() * 3, 10); //获取坦克控制组件

      var tankCtrl = tank.getComponent("TankScript"); //设置坦克属性

      tank.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[index];
      tank.position = this.bornPoses[index];
      tankCtrl.tankType = index;
      tankCtrl.speed = this.tankSpeeds[index];
      tankCtrl.fireTime = this.tankFireTimes[index];
      tankCtrl.blood = this.tankBloods[index];
      tankCtrl.die = false;

      if (!team) {
        if (cc.gameData.single) {
          //单机版
          tankCtrl.team = 1;
        } else {
          //大乱斗
          tankCtrl.team = ++cc.gameData.teamId;
        }
      } else {
        //组队
        tankCtrl.team = team;
      }

      if (index == 0) {
        tank.angle = 90;
      } else if (index == 1) {
        tank.angle = 180;
      } else if (index == 2) {
        tank.angle = 270;
      }

      if (tankCtrl.collisionTank(tank.getBoundingBox())) {
        for (var i = 0; i < this.bornPoses.length - 1; i++) {
          tank.position = this.bornPoses[i];

          if (!tankCtrl.collisionTank(tank.getBoundingBox())) {
            break;
          }
        }
      }

      tank.parent = this.tankNode; //加到列表

      cc.gameData.tankList.push(tank);
      this.maxCount--;
    }
  },
  tankBoom: function tankBoom(tank) {
    tank.parent = null;
    tank.getComponent("TankScript").die = true;
    this.tankPool.put(tank);

    if (cc.gameData.single && tank.getComponent("TankScript").team == 0) {
      this.life--;
      this.lifeNum.string = this.life + "";

      if (this.life > 0) {
        this.addPlayerTank();
      } else {
        this.gameOver();
      } // tank.getComponent("TankScript").blood = 1;

    } else {
      // tank.parent = null;
      // tank.getComponent("TankScript").die = true;
      // this.tankPool.put(tank);
      var tankNum = Number(this.enemyNum.string) - 1;
      this.enemyNum.string = tankNum + ""; // if(tankNum == 0){
      //     if(cc.gameData.curLevel < 10){
      //         ++cc.gameData.curLevel;
      //         cc.director.loadScene("CityScene"+ cc.gameData.curLevel);
      //     }
      //     else{
      //         this.doubleFire = false;
      //         alert.show.call(this, "你赢了", function () {
      //             cc.director.loadScene("StartScene");
      //         });
      //     }
      // }
    }
  },
  //开火按钮点击
  fireBtnClick: function fireBtnClick() {
    if (this._playerTankCtrl.startFire(this.bulletPool)) {
      //播放射击音效
      cc.audioEngine.play(this._playerTankCtrl.shootAudio, false, 1);
    }
  },
  //销毁时调用
  onDestroy: function onDestroy() {
    this.unschedule(this.addAITank, this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL0NpdHlTY3JpcHQuanMiXSwibmFtZXMiOlsiVGFua1R5cGUiLCJyZXF1aXJlIiwidGFua1R5cGUiLCJhbGVydCIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiY3VyTWFwIiwiVGlsZWRNYXAiLCJ5YW9nYW4iLCJOb2RlIiwiYnVsbGV0IiwiUHJlZmFiIiwidGFuayIsInR5cGUiLCJtYXhDb3VudCIsImxpZmUiLCJib3JuUG9zZXMiLCJWZWMyIiwic3ByaXRlRnJhbWVzIiwiU3ByaXRlRnJhbWUiLCJ0YW5rU3BlZWRzIiwiRmxvYXQiLCJ0YW5rRmlyZVRpbWVzIiwidGFua0Jsb29kcyIsIkludGVnZXIiLCJlbmVteU51bSIsIkxhYmVsIiwibGlmZU51bSIsImRvdWJsZUZpcmUiLCJkb3VibGVGaXJlQnRuIiwiZG91YmxlRmlyZUZyYW1lcyIsIm9uTG9hZCIsIl9qb3lzdGlja0N0cmwiLCJnZXRDb21wb25lbnQiLCJfdGlsZWRNYXAiLCJzdHJpbmciLCJzdGFydCIsImVyciIsImN1ckFuZ2xlIiwic2VsZiIsInJlZ2lzdGVySW5wdXRFdmVudCIsIl90aWxlZE1hcERhdGEiLCJfY3VyTWFwVGlsZVNpemUiLCJnZXRUaWxlU2l6ZSIsIl9jdXJNYXBTaXplIiwidjIiLCJub2RlIiwid2lkdGgiLCJoZWlnaHQiLCJsb2ciLCJtYXBMYXllcjAiLCJnZXRMYXllciIsImJ1bGxldFBvb2wiLCJOb2RlUG9vbCIsImluaXRCdWxsZXRDb3VudCIsImkiLCJpbnN0YW50aWF0ZSIsInB1dCIsInRhbmtQb29sIiwiZ2FtZURhdGEiLCJ0ZWFtSWQiLCJzaW5nbGUiLCJ0YW5rTGlzdCIsImJ1bGxldExpc3QiLCJ0YW5rTm9kZSIsImZpbmQiLCJwbGF5ZXIiLCJhZGRQbGF5ZXJUYW5rIiwiX3BsYXllclRhbmtDdHJsIiwic2NoZWR1bGUiLCJhZGRBSVRhbmsiLCJtYWNybyIsIlJFUEVBVF9GT1JFVkVSIiwidXBkYXRlIiwiZHQiLCJzdGFydEZpcmUiLCJzZXREb3VibGVGaXJlIiwiU3ByaXRlIiwic3ByaXRlRnJhbWUiLCJhZGRKb3lTdGlja1RvdWNoQ2hhbmdlTGlzdGVuZXIiLCJhbmdsZSIsInN0b3BNb3ZlIiwidGFua01vdmVTdGFydCIsInRhbmtNb3ZlU3RvcCIsInN5c3RlbUV2ZW50Iiwib24iLCJTeXN0ZW1FdmVudCIsIkV2ZW50VHlwZSIsIktFWV9ET1dOIiwiZXZlbnQiLCJrZXlDb2RlIiwiS0VZIiwidyIsInMiLCJhIiwiZCIsImsiLCJmaXJlQnRuQ2xpY2siLCJLRVlfVVAiLCJjb2xsaXNpb25UZXN0IiwicmVjdCIsInhNaW4iLCJ4IiwieE1heCIsInlNaW4iLCJ5IiwieU1heCIsIk1pblkiLCJNYXhZIiwiTWluWCIsIk1heFgiLCJMZWZ0RG93biIsIlJpZ2h0RG93biIsIkxlZnRVcCIsIlJpZ2h0VXAiLCJNaWREb3duIiwiTWlkVXAiLCJNaWRMZWZ0IiwiTWlkUmlnaHQiLCJfY29sbGlzaW9uVGVzdCIsInBvaW50cyIsInBvaW50Iiwic2hpZnQiLCJnaWQiLCJnZXRUaWxlR0lEQXQiLCJwYXJzZUludCIsImdpZFRvVGlsZVR5cGUiLCJ0aWxlVHlwZSIsInRpbGVOb25lIiwidGlsZUdyYXNzIiwidGlsZVdhbGwiLCJzZXRUaWxlR0lEQXQiLCJ0aWxlS2luZyIsImdhbWVPdmVyIiwibGVuZ3RoIiwidGFua0N0cmwiLCJ0YW5rU3RvcCIsInNob3ciLCJjYWxsIiwiZGlyZWN0b3IiLCJsb2FkU2NlbmUiLCJ0ZWFtIiwic2l6ZSIsImdldCIsInBvc2l0aW9uIiwiUGxheWVyIiwic3BlZWQiLCJmaXJlVGltZSIsImJsb29kIiwiZGllIiwicGFyZW50IiwicHVzaCIsImluZGV4IiwiTWF0aCIsInJhbmRvbSIsImNvbGxpc2lvblRhbmsiLCJnZXRCb3VuZGluZ0JveCIsInRhbmtCb29tIiwidGFua051bSIsIk51bWJlciIsImF1ZGlvRW5naW5lIiwicGxheSIsInNob290QXVkaW8iLCJvbkRlc3Ryb3kiLCJ1bnNjaGVkdWxl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WSxFQUFsQzs7QUFFQSxVQUFHLEtBQUtBLElBQUwsR0FBWSxDQUFmLEVBQWlCO0FBQ2IsYUFBS29ELGFBQUw7QUFDSCxPQUZELE1BRUs7QUFDRCxhQUFLa0UsUUFBTDtBQUNILE9BUjhELENBU2hFOztBQUNGLEtBVkQsTUFXSTtBQUNBO0FBQ0E7QUFDQTtBQUVBLFVBQUl5QixPQUFPLEdBQUdDLE1BQU0sQ0FBQyxLQUFLdEksUUFBTCxDQUFjVSxNQUFmLENBQU4sR0FBK0IsQ0FBN0M7QUFDQSxXQUFLVixRQUFMLENBQWNVLE1BQWQsR0FBdUIySCxPQUFPLEdBQUcsRUFBakMsQ0FOQSxDQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0osR0EzYUk7QUE2YUw7QUFDQTdELEVBQUFBLFlBQVksRUFBRSx3QkFBVTtBQUNwQixRQUFHLEtBQUs3QixlQUFMLENBQXFCTyxTQUFyQixDQUErQixLQUFLdkIsVUFBcEMsQ0FBSCxFQUFtRDtBQUMvQztBQUNBbEQsTUFBQUEsRUFBRSxDQUFDOEosV0FBSCxDQUFlQyxJQUFmLENBQW9CLEtBQUs3RixlQUFMLENBQXFCOEYsVUFBekMsRUFBcUQsS0FBckQsRUFBNEQsQ0FBNUQ7QUFDSDtBQUNKLEdBbmJJO0FBcWJMO0FBQ0FDLEVBQUFBLFNBQVMsRUFBRSxxQkFBWTtBQUNuQixTQUFLQyxVQUFMLENBQWdCLEtBQUs5RixTQUFyQixFQUErQixJQUEvQjtBQUNIO0FBeGJJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciBUYW5rVHlwZSA9IHJlcXVpcmUoXCJUYW5rRGF0YVwiKS50YW5rVHlwZTtcbmxldCBhbGVydCA9IHJlcXVpcmUoJ0FsZXJ0Jyk7XG5cblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICAvL+WcsOWbvlxuICAgICAgICBjdXJNYXA6IGNjLlRpbGVkTWFwLFxuICAgICAgICAvL+aRh+adhlxuICAgICAgICB5YW9nYW46IGNjLk5vZGUsXG5cbiAgICAgICAgLy/lrZDlvLnpooTliLbkvZNcbiAgICAgICAgYnVsbGV0OiBjYy5QcmVmYWIsXG4gICAgICAgIC8v5Z2m5YWL6aKE5Yi25L2TXG4gICAgICAgIHRhbms6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIC8v5pyA5aSn5pWw6YePXG4gICAgICAgIG1heENvdW50OiAxMCxcbiAgICAgICAgbGlmZTogMyxcbiAgICAgICAgLy/lh7rnlJ/lnLBcbiAgICAgICAgYm9yblBvc2VzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlZlYzIsXG4gICAgICAgIH0sXG4gICAgICAgIC8v5Z2m5YWL55qu6IKkXG4gICAgICAgIHNwcml0ZUZyYW1lczoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZSxcbiAgICAgICAgfSxcbiAgICAgICAgLy/lnablhYvnp7vliqjpgJ/luqZcbiAgICAgICAgdGFua1NwZWVkczoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5GbG9hdCxcbiAgICAgICAgfSxcbiAgICAgICAgLy/lnablhYvlrZDlvLnlj5HlsITpl7TpmpTml7bpl7RcbiAgICAgICAgdGFua0ZpcmVUaW1lczoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5GbG9hdCxcbiAgICAgICAgfSxcblxuICAgICAgICAvL+WdpuWFi+ihgOmHj1xuICAgICAgICB0YW5rQmxvb2RzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXIsXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBlbmVteU51bToge1xuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICB9LFxuICAgICAgICBsaWZlTnVtOiB7XG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIH0sXG4gICAgICAgIGRvdWJsZUZpcmU6IGZhbHNlLFxuICAgICAgICBkb3VibGVGaXJlQnRuOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICBkb3VibGVGaXJlRnJhbWVzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lLFxuICAgICAgICB9LFxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5zZXREaXNwbGF5U3RhdHModHJ1ZSk7XG4gICAgICAgIC8v6I635Y+W5pGH5p2G5o6n5Yi257uE5Lu2XG4gICAgICAgIHRoaXMuX2pveXN0aWNrQ3RybCA9IHRoaXMueWFvZ2FuLmdldENvbXBvbmVudChcIkpveXN0aWNrQ3RybFwiKTtcbiAgICAgICAgLy/ojrflj5blnLDlm74gVGlsZWRNYXAg57uE5Lu2XG4gICAgICAgIHRoaXMuX3RpbGVkTWFwID0gdGhpcy5jdXJNYXAuZ2V0Q29tcG9uZW50KCdjYy5UaWxlZE1hcCcpO1xuICAgICAgICB0aGlzLmVuZW15TnVtLnN0cmluZyA9IHRoaXMubWF4Q291bnQgKyBcIlwiO1xuICAgICAgICB0aGlzLmxpZmVOdW0uc3RyaW5nID0gdGhpcy5saWZlICsgXCJcIjtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKGVycil7XG4gICAgICAgIGlmKGVycil7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhbGVydC5zaG93LmNhbGwodGhpcywgXCLlhbPljaFcIiArIGNjLmdhbWVEYXRhLmN1ckxldmVsLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgLy/pu5jorqTop5LluqZcbiAgICAgICAgdGhpcy5jdXJBbmdsZSA9IG51bGw7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvL+azqOWGjOebkeWQrOS6i+S7tlxuICAgICAgICB0aGlzLnJlZ2lzdGVySW5wdXRFdmVudCgpO1xuICAgICAgICAvL+W8leWFpeWcsOWbvuaVsOaNrlxuICAgICAgICB0aGlzLl90aWxlZE1hcERhdGEgPSByZXF1aXJlKFwiVGlsZWRNYXBEYXRhXCIpO1xuXG4gICAgICAgIC8v6I635Y+W5Zyw5Zu+5bC65a+4XG4gICAgICAgIHRoaXMuX2N1ck1hcFRpbGVTaXplID0gdGhpcy5fdGlsZWRNYXAuZ2V0VGlsZVNpemUoKTtcbiAgICAgICAgdGhpcy5fY3VyTWFwU2l6ZSA9IGNjLnYyKHRoaXMuX3RpbGVkTWFwLm5vZGUud2lkdGgsdGhpcy5fdGlsZWRNYXAubm9kZS5oZWlnaHQpO1xuICAgICAgICBjYy5sb2coXCJ0aGlzLl9jdXJNYXBUaWxlU2l6ZSA9XCIgKyB0aGlzLl9jdXJNYXBUaWxlU2l6ZSk7XG4gICAgICAgIGNjLmxvZyhcInRoaXMuX2N1ck1hcFNpemUgPVwiICsgdGhpcy5fY3VyTWFwU2l6ZSk7XG4gICAgICAgIFxuICAgICAgICAvL+WcsOWbvuWimeWxglxuICAgICAgICB0aGlzLm1hcExheWVyMCA9IHRoaXMuX3RpbGVkTWFwLmdldExheWVyKFwibGF5ZXIwXCIpO1xuXG4gICAgICAgIC8v5Yid5aeL5YyW5a+56LGh5rGgKOWPguaVsOW/hemhu+S4uuWvueW6lOiEmuacrOeahOaWh+S7tuWQjSlcbiAgICAgICAgdGhpcy5idWxsZXRQb29sID0gbmV3IGNjLk5vZGVQb29sKFwiQnVsbGV0U2NyaXB0XCIpO1xuICAgICAgICB2YXIgaW5pdEJ1bGxldENvdW50ID0gMjA7XG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGluaXRCdWxsZXRDb3VudDsgKytpKXtcbiAgICAgICAgICAgIHZhciBidWxsZXQgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmJ1bGxldCk7XG4gICAgICAgICAgICB0aGlzLmJ1bGxldFBvb2wucHV0KGJ1bGxldCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YW5rUG9vbCA9IG5ldyBjYy5Ob2RlUG9vbChcIlRhbmtTY3JpcHRcIik7XG4gICAgICAgIGZvcih2YXIgaT0wOyBpPHRoaXMubWF4Q291bnQ7ICsraSl7XG4gICAgICAgICAgICB2YXIgdGFuayA9IGNjLmluc3RhbnRpYXRlKHRoaXMudGFuayk7XG4gICAgICAgICAgICB0aGlzLnRhbmtQb29sLnB1dCh0YW5rKTtcbiAgICAgICAgfVxuICAgICAgICBpZighY2MuZ2FtZURhdGEpe1xuICAgICAgICAgICAgY2MuZ2FtZURhdGEgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICAvL+WIneWni+WMllxuICAgICAgICBjYy5nYW1lRGF0YS50ZWFtSWQgPSAwO1xuICAgICAgICAvL+S4tOaXtlxuICAgICAgICBjYy5nYW1lRGF0YS5zaW5nbGUgPSB0cnVlO1xuXG4gICAgICAgIC8v5Zyw5Zu+5YaF5Z2m5YWL5YiX6KGoXG4gICAgICAgIGNjLmdhbWVEYXRhLnRhbmtMaXN0ID0gW107XG4gICAgICAgIC8v5Zyw5Zu+5YaF5a2Q5by55YiX6KGoXG4gICAgICAgIGNjLmdhbWVEYXRhLmJ1bGxldExpc3QgPSBbXTtcblxuICAgICAgICAvL+iOt+WPlue7hOS7tlxuICAgICAgICAvL3RoaXMudGFua05vZGUgPSBjYy5maW5kKFwiL0NhbnZhcy9NYXAvdGFua1wiKTtcbiAgICAgICAgdGhpcy50YW5rTm9kZSA9IGNjLmZpbmQoXCIvQ2FudmFzL21hcDEvbGF5ZXIwXCIpO1xuICAgICAgICAvL+WKoOWFpXBsYXllclxuICAgICAgICB0aGlzLnBsYXllciA9IHRoaXMuYWRkUGxheWVyVGFuaygpO1xuICAgICAgICAvL+iOt+WPluWdpuWFi+aOp+WItue7hOS7tlxuICAgICAgICB0aGlzLl9wbGF5ZXJUYW5rQ3RybCA9IHRoaXMucGxheWVyLmdldENvbXBvbmVudChcIlRhbmtTY3JpcHRcIik7IFxuXG4gICAgICAgIC8v5ZCv5Yqo5a6a5pe25Zmo77yM5re75Yqg5Z2m5YWLXG4gICAgICAgIHRoaXMuc2NoZWR1bGUodGhpcy5hZGRBSVRhbmssMyxjYy5tYWNyby5SRVBFQVRfRk9SRVZFUiwxKTtcbiAgICAgICAgXG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgaWYodGhpcy5kb3VibGVGaXJlKXtcbiAgICAgICAgICAgIGlmKHRoaXMuX3BsYXllclRhbmtDdHJsLnN0YXJ0RmlyZSh0aGlzLmJ1bGxldFBvb2wpKXtcbiAgICAgICAgICAgICAgICAvL+aSreaUvuWwhOWHu+mfs+aViFxuICAgICAgICAgICAgICAgIC8vY2MuYXVkaW9FbmdpbmUucGxheSh0aGlzLl9wbGF5ZXJUYW5rQ3RybC5zaG9vdEF1ZGlvLCBmYWxzZSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0RG91YmxlRmlyZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmRvdWJsZUZpcmUgPSAhdGhpcy5kb3VibGVGaXJlO1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5kb3VibGVGaXJlKXtcbiAgICAgICAgICAgIHRoaXMuZG91YmxlRmlyZUJ0bi5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IHRoaXMuZG91YmxlRmlyZUZyYW1lc1sxXTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmRvdWJsZUZpcmVCdG4uZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSB0aGlzLmRvdWJsZUZpcmVGcmFtZXNbMF07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSxcblxuICAgIC8v5rOo5YaM6L6T5YWl5LqL5Lu2XG4gICAgcmVnaXN0ZXJJbnB1dEV2ZW50OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuX2pveXN0aWNrQ3RybC5hZGRKb3lTdGlja1RvdWNoQ2hhbmdlTGlzdGVuZXIoZnVuY3Rpb24gKGFuZ2xlKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKGFuZ2xlID09IHNlbGYuY3VyQW5nbGUgJiZcbiAgICAgICAgICAgICAgICAhc2VsZi5fcGxheWVyVGFua0N0cmwuc3RvcE1vdmUgKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmN1ckFuZ2xlID0gYW5nbGU7XG5cbiAgICAgICAgICAgIGlmKGFuZ2xlIT1udWxsKXtcbiAgICAgICAgICAgICAgICAvL+W8gOWni+WJjei/m1xuICAgICAgICAgICAgICAgIHNlbGYuX3BsYXllclRhbmtDdHJsLnRhbmtNb3ZlU3RhcnQoYW5nbGUpO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIC8v5YGc5q2i5YmN6L+bXG4gICAgICAgICAgICAgICAgc2VsZi5fcGxheWVyVGFua0N0cmwudGFua01vdmVTdG9wKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgICAgIC8v5oyJ6ZSu5oyJ5LiLXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfRE9XTiwgXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYW5nbGUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgY2MubWFjcm8uS0VZLnc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmdsZSA9IDkwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgY2MubWFjcm8uS0VZLnM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmdsZSA9IDI3MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5hOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGUgPSAxODA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkuZDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ2xlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihldmVudC5rZXlDb2RlID09IGNjLm1hY3JvLktFWS5rKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlQnRuQ2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3BsYXllclRhbmtDdHJsLnRhbmtNb3ZlU3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihhbmdsZSE9bnVsbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5byA5aeL5YmN6L+bXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3BsYXllclRhbmtDdHJsLnRhbmtNb3ZlU3RhcnQoYW5nbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAvL+aMiemUruaKrOi1t1xuICAgICAgICBjYy5zeXN0ZW1FdmVudC5vbihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChldmVudCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lgZzmraLliY3ov5tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihldmVudC5rZXlDb2RlICE9IGNjLm1hY3JvLktFWS5rKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fcGxheWVyVGFua0N0cmwudGFua01vdmVTdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICB9LFxuXG4gICAgLy/norDmkp7mo4DmtYtcbiAgICBjb2xsaXNpb25UZXN0OiBmdW5jdGlvbihyZWN0LCBidWxsZXQpe1xuICAgICAgICAvL+WIpOaWreaYr+WQpueisOWIsOWcsOWbvui+ueeVjFxuICAgICAgICBpZiAocmVjdC54TWluIDw9IC10aGlzLl9jdXJNYXBTaXplLngvMiB8fCByZWN0LnhNYXggPj0gdGhpcy5fY3VyTWFwU2l6ZS54LzIgfHxcblx0XHQgICAgcmVjdC55TWluIDw9IC10aGlzLl9jdXJNYXBTaXplLnkvMiB8fCByZWN0LnlNYXggPj0gdGhpcy5fY3VyTWFwU2l6ZS55LzIpe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy/liKTmlq3mmK/lkKbmkp7loplcbiAgICAgICAgLy/lsIblnZDmoIfovazmjaLkuLrlnLDlm77lnZDmoIfns7tcbiAgICAgICAgdmFyIE1pblkgPSB0aGlzLl9jdXJNYXBTaXplLnkvMiAtIHJlY3QueU1pbjtcblx0ICAgIHZhciBNYXhZID0gdGhpcy5fY3VyTWFwU2l6ZS55LzIgLSByZWN0LnlNYXg7XG4gICAgICAgIHZhciBNaW5YID0gdGhpcy5fY3VyTWFwU2l6ZS54LzIgKyByZWN0LnhNaW47XG4gICAgICAgIHZhciBNYXhYID0gdGhpcy5fY3VyTWFwU2l6ZS54LzIgKyByZWN0LnhNYXg7XG5cbiAgICAgICAgLy/ojrflj5blm5vkuKrop5LnmoTpobbngrlcbiAgICAgICAgdmFyIExlZnREb3duID0gY2MudjIoTWluWCwgTWluWSk7XG4gICAgICAgIHZhciBSaWdodERvd24gPSBjYy52MihNYXhYLCBNaW5ZKTtcbiAgICAgICAgdmFyIExlZnRVcCA9IGNjLnYyKE1pblgsIE1heFkpO1xuICAgICAgICB2YXIgUmlnaHRVcCA9IGNjLnYyKE1heFgsIE1heFkpO1xuXG4gICAgICAgIC8v6I635Y+W5Zub5p2h6L6555qE5Lit5b+D54K5XG4gICAgICAgIHZhciBNaWREb3duID0gY2MudjIoTWluWCsoTWF4WC1NaW5YKS8yLCBNaW5ZKTtcbiAgICAgICAgdmFyIE1pZFVwID0gY2MudjIoTWluWCsoTWF4WC1NaW5YKS8yLCBNYXhZKTtcbiAgICAgICAgdmFyIE1pZExlZnQgPSBjYy52MihNaW5YLCBNaW5ZKyhNYXhZLU1pblkpLzIpO1xuICAgICAgICB2YXIgTWlkUmlnaHQ9IGNjLnYyKE1heFgsIE1pblkrKE1heFktTWluWSkvMik7XG5cbiAgICAgICAgLy/mo4DmtYvnorDmkp5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbGxpc2lvblRlc3QoW0xlZnREb3duLFJpZ2h0RG93bixMZWZ0VXAsUmlnaHRVcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIE1pZERvd24sTWlkVXAsTWlkTGVmdCxNaWRSaWdodF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBidWxsZXQpO1xuICAgIH0sXG5cbiAgICAvL+WGhemDqOeisOaSnuajgOa1i+aWueazlVxuICAgIF9jb2xsaXNpb25UZXN0OiBmdW5jdGlvbihwb2ludHMsIGJ1bGxldCl7XG4gICAgICAgIHZhciBwb2ludCA9IHBvaW50cy5zaGlmdCgpXG4gICAgICAgIHZhciBnaWQgPSB0aGlzLm1hcExheWVyMC5nZXRUaWxlR0lEQXQoY2MudjIocGFyc2VJbnQocG9pbnQueCAvIHRoaXMuX2N1ck1hcFRpbGVTaXplLndpZHRoKSxwYXJzZUludChwb2ludC55IC8gdGhpcy5fY3VyTWFwVGlsZVNpemUuaGVpZ2h0KSkpO1xuXG4gICAgICAgIGlmICh0aGlzLl90aWxlZE1hcERhdGEuZ2lkVG9UaWxlVHlwZVtnaWRdICE9IHRoaXMuX3RpbGVkTWFwRGF0YS50aWxlVHlwZS50aWxlTm9uZSAmJiBcbiAgICAgICAgICAgIHRoaXMuX3RpbGVkTWFwRGF0YS5naWRUb1RpbGVUeXBlW2dpZF0gIT0gdGhpcy5fdGlsZWRNYXBEYXRhLnRpbGVUeXBlLnRpbGVHcmFzcyl7XG4gICAgICAgICAgICBpZihidWxsZXQgJiYgdGhpcy5fdGlsZWRNYXBEYXRhLmdpZFRvVGlsZVR5cGVbZ2lkXSA9PSB0aGlzLl90aWxlZE1hcERhdGEudGlsZVR5cGUudGlsZVdhbGwpe1xuICAgICAgICAgICAgICAgIHRoaXMubWFwTGF5ZXIwLnNldFRpbGVHSURBdCgwLCBwYXJzZUludChwb2ludC54IC8gdGhpcy5fY3VyTWFwVGlsZVNpemUud2lkdGgpLHBhcnNlSW50KHBvaW50LnkgLyB0aGlzLl9jdXJNYXBUaWxlU2l6ZS5oZWlnaHQpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoYnVsbGV0ICYmIHRoaXMuX3RpbGVkTWFwRGF0YS5naWRUb1RpbGVUeXBlW2dpZF0gPT0gdGhpcy5fdGlsZWRNYXBEYXRhLnRpbGVUeXBlLnRpbGVLaW5nKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLm1hcExheWVyMC5zZXRUaWxlR0lEQXQoMCwgMTIsIDI1LCAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcExheWVyMC5zZXRUaWxlR0lEQXQoMCwgMTIsIDI0LCAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcExheWVyMC5zZXRUaWxlR0lEQXQoMCwgMTMsIDI1LCAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcExheWVyMC5zZXRUaWxlR0lEQXQoMCwgMTMsIDI0LCAxKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmKHBvaW50cy5sZW5ndGg+MCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29sbGlzaW9uVGVzdChwb2ludHMsIGJ1bGxldCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdhbWVPdmVyOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmRvdWJsZUZpcmUgPSBmYWxzZTtcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8Y2MuZ2FtZURhdGEudGFua0xpc3QubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgdmFyIHRhbmsgPSBjYy5nYW1lRGF0YS50YW5rTGlzdFtpXVxuICAgICAgICAgICAgdmFyIHRhbmtDdHJsID0gdGFuay5nZXRDb21wb25lbnQoXCJUYW5rU2NyaXB0XCIpO1xuICAgICAgICAgICAgdGFua0N0cmwudGFua1N0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8v5by556qX6LCD55SoXG4gICAgICAgIGFsZXJ0LnNob3cuY2FsbCh0aGlzLCBcIua4uOaIj+e7k+adn1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJTdGFydFNjZW5lXCIpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy/liqDlhaXnjqnlrrblnablhYtcbiAgICBhZGRQbGF5ZXJUYW5rOiBmdW5jdGlvbih0ZWFtKSB7XG4gICAgICAgIGlmKHRoaXMudGFua1Bvb2wuc2l6ZSgpPjApe1xuICAgICAgICAgICAgdmFyIHRhbmsgPSB0aGlzLnRhbmtQb29sLmdldCgpO1xuICAgICAgICAgICAgdGFuay5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IHRoaXMuc3ByaXRlRnJhbWVzW3RoaXMuc3ByaXRlRnJhbWVzLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIHRhbmsucG9zaXRpb24gPSB0aGlzLmJvcm5Qb3Nlc1t0aGlzLmJvcm5Qb3Nlcy5sZW5ndGgtMV07XG4gICAgICAgICAgICAvL+iOt+WPluWdpuWFi+aOp+WItue7hOS7tlxuICAgICAgICAgICAgdmFyIHRhbmtDdHJsID0gdGFuay5nZXRDb21wb25lbnQoXCJUYW5rU2NyaXB0XCIpO1xuICAgICAgICAgICAgLy/orr7nva7lnablhYvlsZ7mgKdcbiAgICAgICAgICAgIHRhbmtDdHJsLnRhbmtUeXBlID0gVGFua1R5cGUuUGxheWVyO1xuICAgICAgICAgICAgdGFua0N0cmwuc3BlZWQgPSB0aGlzLnRhbmtTcGVlZHNbdGhpcy50YW5rU3BlZWRzLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIHRhbmtDdHJsLmZpcmVUaW1lID0gdGhpcy50YW5rRmlyZVRpbWVzW3RoaXMudGFua0ZpcmVUaW1lcy5sZW5ndGgtMV07XG4gICAgICAgICAgICAvL3RhbmtDdHJsLmJsb29kID0gdGhpcy50YW5rQmxvb2RzW3RoaXMudGFua0Jsb29kcy5sZW5ndGgtMV07XG4gICAgICAgICAgICAvL3RhbmtDdHJsLmJsb29kID0gdGhpcy5saWZlIDtcbiAgICAgICAgICAgIHRhbmtDdHJsLmJsb29kID0gMTtcbiAgICAgICAgICAgIHRhbmtDdHJsLmRpZSA9IGZhbHNlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZighdGVhbSl7XG4gICAgICAgICAgICAgICAgaWYoY2MuZ2FtZURhdGEuc2luZ2xlKXtcbiAgICAgICAgICAgICAgICAgICAgLy/ljZXmnLrniYhcbiAgICAgICAgICAgICAgICAgICAgdGFua0N0cmwudGVhbSA9IDA7XG4gICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL+Wkp+S5seaWl1xuICAgICAgICAgICAgICAgICAgICB0YW5rQ3RybC50ZWFtID0gKytjYy5nYW1lRGF0YS50ZWFtSWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIC8v57uE6ZifXG4gICAgICAgICAgICAgICAgdGFua0N0cmwudGVhbSA9IHRlYW07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhbmsucGFyZW50ID0gdGhpcy50YW5rTm9kZTtcbiAgICAgICAgICAgIC8v5Yqg5Yiw5YiX6KGoXG4gICAgICAgICAgICBjYy5nYW1lRGF0YS50YW5rTGlzdC5wdXNoKHRhbmspO1xuICAgICAgICAgICAgcmV0dXJuIHRhbms7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8v5Yqg5YWlQUlcbiAgICBhZGRBSVRhbms6IGZ1bmN0aW9uKGR0LCB0ZWFtKSB7XG4gICAgICAgIGlmKHRoaXMudGFua1Bvb2wuc2l6ZSgpPjAgJiYgdGhpcy5tYXhDb3VudCA+IDApe1xuICAgICAgICAgICAgdmFyIHRhbmsgPSB0aGlzLnRhbmtQb29sLmdldCgpO1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoTWF0aC5yYW5kb20oKSozLCAxMCk7XG4gICAgICAgICAgICAvL+iOt+WPluWdpuWFi+aOp+WItue7hOS7tlxuICAgICAgICAgICAgdmFyIHRhbmtDdHJsID0gdGFuay5nZXRDb21wb25lbnQoXCJUYW5rU2NyaXB0XCIpO1xuICAgICAgICAgICAgLy/orr7nva7lnablhYvlsZ7mgKdcbiAgICAgICAgICAgIHRhbmsuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSB0aGlzLnNwcml0ZUZyYW1lc1tpbmRleF07XG4gICAgICAgICAgICB0YW5rLnBvc2l0aW9uID0gdGhpcy5ib3JuUG9zZXNbaW5kZXhdO1xuXG4gICAgICAgICAgICB0YW5rQ3RybC50YW5rVHlwZSA9IGluZGV4O1xuICAgICAgICAgICAgdGFua0N0cmwuc3BlZWQgPSB0aGlzLnRhbmtTcGVlZHNbaW5kZXhdO1xuICAgICAgICAgICAgdGFua0N0cmwuZmlyZVRpbWUgPSB0aGlzLnRhbmtGaXJlVGltZXNbaW5kZXhdO1xuICAgICAgICAgICAgdGFua0N0cmwuYmxvb2QgPSB0aGlzLnRhbmtCbG9vZHNbaW5kZXhdO1xuICAgICAgICAgICAgdGFua0N0cmwuZGllID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmKCF0ZWFtKXtcbiAgICAgICAgICAgICAgICBpZihjYy5nYW1lRGF0YS5zaW5nbGUpe1xuICAgICAgICAgICAgICAgICAgICAvL+WNleacuueJiFxuICAgICAgICAgICAgICAgICAgICB0YW5rQ3RybC50ZWFtID0gMTtcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8v5aSn5Lmx5paXXG4gICAgICAgICAgICAgICAgICAgIHRhbmtDdHJsLnRlYW0gPSArK2NjLmdhbWVEYXRhLnRlYW1JZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgLy/nu4TpmJ9cbiAgICAgICAgICAgICAgICB0YW5rQ3RybC50ZWFtID0gdGVhbTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoaW5kZXggPT0gMCl7XG4gICAgICAgICAgICAgICAgdGFuay5hbmdsZSA9IDkwO1xuICAgICAgICAgICAgfWVsc2UgaWYoaW5kZXggPT0gMSl7XG4gICAgICAgICAgICAgICAgdGFuay5hbmdsZSA9IDE4MDtcbiAgICAgICAgICAgIH1lbHNlIGlmKGluZGV4ID09IDIpe1xuICAgICAgICAgICAgICAgIHRhbmsuYW5nbGUgPSAyNzA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0YW5rQ3RybC5jb2xsaXNpb25UYW5rKHRhbmsuZ2V0Qm91bmRpbmdCb3goKSkpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPHRoaXMuYm9yblBvc2VzLmxlbmd0aC0xOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICB0YW5rLnBvc2l0aW9uID0gdGhpcy5ib3JuUG9zZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmKCF0YW5rQ3RybC5jb2xsaXNpb25UYW5rKHRhbmsuZ2V0Qm91bmRpbmdCb3goKSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhbmsucGFyZW50ID0gdGhpcy50YW5rTm9kZTtcbiAgICAgICAgICAgIC8v5Yqg5Yiw5YiX6KGoXG4gICAgICAgICAgICBjYy5nYW1lRGF0YS50YW5rTGlzdC5wdXNoKHRhbmspO1xuICAgICAgICAgICAgdGhpcy5tYXhDb3VudCAtLTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB0YW5rQm9vbTogZnVuY3Rpb24odGFuaykge1xuICAgICAgICB0YW5rLnBhcmVudCA9IG51bGw7XG4gICAgICAgIHRhbmsuZ2V0Q29tcG9uZW50KFwiVGFua1NjcmlwdFwiKS5kaWUgPSB0cnVlO1xuICAgICAgICB0aGlzLnRhbmtQb29sLnB1dCh0YW5rKTtcbiAgICAgICAgaWYoY2MuZ2FtZURhdGEuc2luZ2xlICYmIHRhbmsuZ2V0Q29tcG9uZW50KFwiVGFua1NjcmlwdFwiKS50ZWFtID09IDApe1xuICAgICAgICAgICAgdGhpcy5saWZlIC0tO1xuICAgICAgICAgICAgdGhpcy5saWZlTnVtLnN0cmluZyA9IHRoaXMubGlmZSArIFwiXCI7XG5cbiAgICAgICAgICAgIGlmKHRoaXMubGlmZSA+IDApe1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkUGxheWVyVGFuaygpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lT3ZlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAvLyB0YW5rLmdldENvbXBvbmVudChcIlRhbmtTY3JpcHRcIikuYmxvb2QgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICAvLyB0YW5rLnBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICAvLyB0YW5rLmdldENvbXBvbmVudChcIlRhbmtTY3JpcHRcIikuZGllID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIHRoaXMudGFua1Bvb2wucHV0KHRhbmspO1xuXG4gICAgICAgICAgICB2YXIgdGFua051bSA9IE51bWJlcih0aGlzLmVuZW15TnVtLnN0cmluZykgLSAxO1xuICAgICAgICAgICAgdGhpcy5lbmVteU51bS5zdHJpbmcgPSB0YW5rTnVtICsgXCJcIjtcbiAgICAgICAgICAgIC8vIGlmKHRhbmtOdW0gPT0gMCl7XG4gICAgICAgICAgICAvLyAgICAgaWYoY2MuZ2FtZURhdGEuY3VyTGV2ZWwgPCAxMCl7XG4gICAgICAgICAgICAvLyAgICAgICAgICsrY2MuZ2FtZURhdGEuY3VyTGV2ZWw7XG4gICAgICAgICAgICAvLyAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkNpdHlTY2VuZVwiKyBjYy5nYW1lRGF0YS5jdXJMZXZlbCk7XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gICAgIGVsc2V7XG4gICAgICAgICAgICAvLyAgICAgICAgIHRoaXMuZG91YmxlRmlyZSA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gICAgICAgICBhbGVydC5zaG93LmNhbGwodGhpcywgXCLkvaDotaLkuoZcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiU3RhcnRTY2VuZVwiKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8v5byA54Gr5oyJ6ZKu54K55Ye7XG4gICAgZmlyZUJ0bkNsaWNrOiBmdW5jdGlvbigpe1xuICAgICAgICBpZih0aGlzLl9wbGF5ZXJUYW5rQ3RybC5zdGFydEZpcmUodGhpcy5idWxsZXRQb29sKSl7XG4gICAgICAgICAgICAvL+aSreaUvuWwhOWHu+mfs+aViFxuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheSh0aGlzLl9wbGF5ZXJUYW5rQ3RybC5zaG9vdEF1ZGlvLCBmYWxzZSwgMSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy/plIDmr4Hml7bosIPnlKhcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlKHRoaXMuYWRkQUlUYW5rLHRoaXMpO1xuICAgIH0sXG59KTtcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/joystick/scripts/JoystickCtrl.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'dae4fVvAkJBQYB/rfJD67I3', 'JoystickCtrl');
// joystick/scripts/JoystickCtrl.js

"use strict";

var TouchType = cc.Enum({
  DEFAULT: 0,
  FOLLOW: 1
});
var DirectionType = cc.Enum({
  FOUR: 0,
  EIGHT: 1,
  ALL: 2
});
cc.Class({
  "extends": cc.Component,
  properties: {
    joystickBar: {
      "default": null,
      type: cc.Node
    },
    //控杆
    joystickBG: {
      "default": null,
      type: cc.Node
    },
    //控杆背景
    radius: 0,
    //半径
    touchType: {
      "default": TouchType.DEFAULT,
      //触摸类型
      type: TouchType
    },
    directionType: {
      "default": DirectionType.ALL,
      //方向类型
      type: DirectionType
    },
    //当前角度
    curAngle: {
      "default": 0,
      visible: false
    },
    //当前距离
    distance: {
      "default": 0,
      visible: false
    }
  },
  // use this for initialization
  onLoad: function onLoad() {
    if (this.radius == 0) {
      this.radius = this.joystickBG.width / 2;
    }

    this.registerInput();
    this.distance = 0;
    this.curAngle = 0;
    this.initPos = this.node.position;
    this.initBarPos = this.joystickBar.position;
    this.node.opacity = 50;
  },
  addJoyStickTouchChangeListener: function addJoyStickTouchChangeListener(callback) {
    this.angleChange = callback;
  },
  registerInput: function registerInput() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
    this.node.on(cc.Node.EventType.TOUCH_CANEL, this.onTouchEnded, this);
  },
  onTouchBegan: function onTouchBegan(event) {
    //如果触摸类型为FOLLOW，则摇控杆的位置为触摸位置,触摸开始时候现形
    if (this.touchType == TouchType.FOLLOW) {
      var touchPos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
      this.node.setPosition(touchPos);
      return true;
    } else {
      //把触摸点坐标转换为相对与目标的模型坐标
      var touchPos = this.node.convertToNodeSpaceAR(event.getLocation()); //点与圆心的距离
      //var distance = cc.pDistance(touchPos, cc.Vec2(0, 0));

      var distance = touchPos.sub(cc.Vec2(0, 0)).mag(); //如果点与圆心距离小于圆的半径,返回true

      if (distance < this.radius) {
        if (distance > 10) {
          this.node.opacity = 255;
          this.joystickBar.setPosition(touchPos); //更新角度

          this._getAngle(touchPos);
        }

        return true;
      }
    }

    return false;
  },
  onTouchMoved: function onTouchMoved(event) {
    //把触摸点坐标转换为相对与目标的模型坐标
    var touchPos = this.node.convertToNodeSpaceAR(event.getLocation()); //点与圆心的距离\\
    //var distance = cc.pDistance(touchPos, cc.Vec2(0, 0));

    var distance = touchPos.sub(cc.Vec2(0, 0)).mag(); //如果点与圆心距离小于圆的半径,控杆跟随触摸点

    if (this.radius >= distance) {
      if (distance > 10) {
        this.node.opacity = 255;
        this.joystickBar.setPosition(touchPos); //更新角度

        this._getAngle(touchPos);
      } else {
        this.node.opacity = 50; //摇杆恢复位置

        this.joystickBar.setPosition(cc.Vec2(0, 0));
        this.curAngle = null; //调用角度变化回调

        if (this.angleChange) {
          this.angleChange(this.curAngle);
        }
      }
    } else {
      //触摸监听目标
      var x = Math.cos(this._getRadian(touchPos)) * this.radius;
      var y = Math.sin(this._getRadian(touchPos)) * this.radius;

      if (touchPos.x > 0 && touchPos.y < 0) {
        y *= -1;
      } else if (touchPos.x < 0 && touchPos.y < 0) {
        y *= -1;
      }

      this.joystickBar.setPosition(cc.Vec3(x, y, 0)); //更新角度

      this._getAngle(touchPos);
    }
  },
  onTouchEnded: function onTouchEnded(event) {
    this.node.opacity = 50; //如果触摸类型为FOLLOW，离开触摸后隐藏

    if (this.touchType == TouchType.FOLLOW) {
      this.node.position = this.initPos;
    } //摇杆恢复位置


    this.joystickBar.setPosition(this.initBarPos);
    this.curAngle = null; //调用角度变化回调

    if (this.angleChange) {
      this.angleChange(this.curAngle);
    }
  },
  //计算角度并返回
  _getAngle: function _getAngle(point) {
    this._angle = Math.floor(this._getRadian(point) * 180 / Math.PI);

    if (point.x > 0 && point.y < 0) {
      this._angle = 360 - this._angle;
    } else if (point.x < 0 && point.y < 0) {
      this._angle = 360 - this._angle;
    } else if (point.x < 0 && point.y == 0) {
      this._angle = 180;
    } else if (point.x > 0 && point.y == 0) {
      this._angle = 0;
    } else if (point.x == 0 && point.y > 0) {
      this._angle = 90;
    } else if (point.x == 0 && point.y < 0) {
      this._angle = 270;
    }

    this._updateCurAngle();

    return this._angle;
  },
  //计算弧度并返回
  _getRadian: function _getRadian(point) {
    var curZ = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));

    if (curZ == 0) {
      this._radian = 0;
    } else {
      this._radian = Math.acos(point.x / curZ);
    }

    return this._radian;
  },
  //更新当前角度
  _updateCurAngle: function _updateCurAngle() {
    switch (this.directionType) {
      case DirectionType.FOUR:
        this.curAngle = this._fourDirections();
        break;

      case DirectionType.EIGHT:
        this.curAngle = this._eightDirections();
        break;

      case DirectionType.ALL:
        this.curAngle = this._angle;
        break;

      default:
        this.curAngle = null;
        break;
    } //调用角度变化回调


    if (this.angleChange) {
      this.angleChange(this.curAngle);
    }
  },
  //四个方向移动(上下左右)
  _fourDirections: function _fourDirections() {
    if (this._angle >= 45 && this._angle <= 135) {
      return 90;
    } else if (this._angle >= 225 && this._angle <= 315) {
      return 270;
    } else if (this._angle <= 225 && this._angle >= 180 || this._angle >= 135 && this._angle <= 180) {
      return 180;
    } else if (this._angle <= 360 && this._angle >= 315 || this._angle >= 0 && this._angle <= 45) {
      return 0;
    }
  },
  //八个方向移动(上下左右、左上、右上、左下、右下)
  _eightDirections: function _eightDirections() {
    if (this._angle >= 67.5 && this._angle <= 112.5) {
      return 90;
    } else if (this._angle >= 247.5 && this._angle <= 292.5) {
      return 270;
    } else if (this._angle <= 202.5 && this._angle >= 180 || this._angle >= 157.5 && this._angle <= 180) {
      return 180;
    } else if (this._angle <= 360 && this._angle >= 337.5 || this._angle >= 0 && this._angle <= 22.5) {
      return 0;
    } else if (this._angle >= 112.5 && this._angle <= 157.5) {
      return 135;
    } else if (this._angle >= 22.5 && this._angle <= 67.5) {
      return 45;
    } else if (this._angle >= 202.5 && this._angle <= 247.5) {
      return 225;
    } else if (this._angle >= 292.5 && this._angle <= 337.5) {
      return 315;
    }
  },
  onDestroy: function onDestroy() {
    //cc.eventManager.removeListener(this._listener);
    // this.node.off("touchstart");
    // this.node.off("touchmove");
    // this.node.off("touchend");
    this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9qb3lzdGljay9zY3JpcHRzL0pveXN0aWNrQ3RybC5qcyJdLCJuYW1lcyI6WyJUb3VjaFR5cGUiLCJjYyIsIkVudW0iLCJERUZBVUxUIiwiRk9MTE9XIiwiRGlyZWN0aW9uVHlwZSIsIkZPVVIiLCJFSUdIVCIsIkFMTCIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImpveXN0aWNrQmFyIiwidHlwZSIsIk5vZGUiLCJqb3lzdGlja0JHIiwicmFkaXVzIiwidG91Y2hUeXBlIiwiZGlyZWN0aW9uVHlwZSIsImN1ckFuZ2xlIiwidmlzaWJsZSIsImRpc3RhbmNlIiwib25Mb2FkIiwid2lkdGgiLCJyZWdpc3RlcklucHV0IiwiaW5pdFBvcyIsIm5vZGUiLCJwb3NpdGlvbiIsImluaXRCYXJQb3MiLCJvcGFjaXR5IiwiYWRkSm95U3RpY2tUb3VjaENoYW5nZUxpc3RlbmVyIiwiY2FsbGJhY2siLCJhbmdsZUNoYW5nZSIsIm9uIiwiRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJvblRvdWNoQmVnYW4iLCJUT1VDSF9NT1ZFIiwib25Ub3VjaE1vdmVkIiwiVE9VQ0hfRU5EIiwib25Ub3VjaEVuZGVkIiwiVE9VQ0hfQ0FORUwiLCJldmVudCIsInRvdWNoUG9zIiwicGFyZW50IiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJnZXRMb2NhdGlvbiIsInNldFBvc2l0aW9uIiwic3ViIiwiVmVjMiIsIm1hZyIsIl9nZXRBbmdsZSIsIngiLCJNYXRoIiwiY29zIiwiX2dldFJhZGlhbiIsInkiLCJzaW4iLCJWZWMzIiwicG9pbnQiLCJfYW5nbGUiLCJmbG9vciIsIlBJIiwiX3VwZGF0ZUN1ckFuZ2xlIiwiY3VyWiIsInNxcnQiLCJwb3ciLCJfcmFkaWFuIiwiYWNvcyIsIl9mb3VyRGlyZWN0aW9ucyIsIl9laWdodERpcmVjdGlvbnMiLCJvbkRlc3Ryb3kiLCJvZmYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBSUEsU0FBUyxH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QXdCLEtBQUtBLE1BQUwsSUFBZSxLQUExQyxFQUNMO0FBQ0ksYUFBTyxHQUFQO0FBQ0g7QUFDSixHQXZRSTtBQXlRTFcsRUFBQUEsU0FBUyxFQUFFLHFCQUNYO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFFQSxTQUFLN0MsSUFBTCxDQUFVOEMsR0FBVixDQUFjdkUsRUFBRSxDQUFDYSxJQUFILENBQVFvQixTQUFSLENBQWtCQyxXQUFoQyxFQUE0QyxLQUFLQyxZQUFqRCxFQUE4RCxJQUE5RDtBQUNBLFNBQUtWLElBQUwsQ0FBVThDLEdBQVYsQ0FBY3ZFLEVBQUUsQ0FBQ2EsSUFBSCxDQUFRb0IsU0FBUixDQUFrQkcsVUFBaEMsRUFBMkMsS0FBS0MsWUFBaEQsRUFBNkQsSUFBN0Q7QUFDQSxTQUFLWixJQUFMLENBQVU4QyxHQUFWLENBQWN2RSxFQUFFLENBQUNhLElBQUgsQ0FBUW9CLFNBQVIsQ0FBa0JLLFNBQWhDLEVBQTBDLEtBQUtDLFlBQS9DLEVBQTRELElBQTVEO0FBQ0g7QUFuUkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgVG91Y2hUeXBlID0gY2MuRW51bSh7XG4gICAgREVGQVVMVDogMCxcbiAgICBGT0xMT1c6IDFcbn0pO1xuXG52YXIgRGlyZWN0aW9uVHlwZSA9IGNjLkVudW0oe1xuICAgIEZPVVI6IDAsXG4gICAgRUlHSFQ6IDEsXG4gICAgQUxMOiAyXG59KTtcblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgam95c3RpY2tCYXI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sLy/mjqfmnYZcbiAgICAgICAgam95c3RpY2tCRzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSwvL+aOp+adhuiDjOaZr1xuICAgICAgICByYWRpdXM6IDAsIC8v5Y2K5b6EXG4gICAgICAgIHRvdWNoVHlwZToge1xuICAgICAgICAgICAgZGVmYXVsdDogVG91Y2hUeXBlLkRFRkFVTFQsIC8v6Kem5pG457G75Z6LXG4gICAgICAgICAgICB0eXBlOiBUb3VjaFR5cGVcbiAgICAgICAgfSxcbiAgICAgICAgZGlyZWN0aW9uVHlwZToge1xuICAgICAgICAgICAgZGVmYXVsdDogRGlyZWN0aW9uVHlwZS5BTEwsICAvL+aWueWQkeexu+Wei1xuICAgICAgICAgICAgdHlwZTogRGlyZWN0aW9uVHlwZVxuICAgICAgICB9LFxuICAgICAgICAvL+W9k+WJjeinkuW6plxuICAgICAgICBjdXJBbmdsZToge1xuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIC8v5b2T5YmN6Led56a7XG4gICAgICAgIGRpc3RhbmNlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYodGhpcy5yYWRpdXMgPT0gMCl7XG4gICAgICAgICAgICB0aGlzLnJhZGl1cyA9IHRoaXMuam95c3RpY2tCRy53aWR0aC8yXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZWdpc3RlcklucHV0KClcbiAgICAgICAgdGhpcy5kaXN0YW5jZSA9IDBcbiAgICAgICAgdGhpcy5jdXJBbmdsZSA9IDBcbiAgICAgICAgdGhpcy5pbml0UG9zID0gdGhpcy5ub2RlLnBvc2l0aW9uXG4gICAgICAgIHRoaXMuaW5pdEJhclBvcyA9IHRoaXMuam95c3RpY2tCYXIucG9zaXRpb25cbiAgICAgICAgXG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gNTBcbiAgICB9LFxuXG4gICAgYWRkSm95U3RpY2tUb3VjaENoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmFuZ2xlQ2hhbmdlID0gY2FsbGJhY2s7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVySW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsdGhpcy5vblRvdWNoQmVnYW4sdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLHRoaXMub25Ub3VjaE1vdmVkLHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELHRoaXMub25Ub3VjaEVuZGVkLHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FORUwsdGhpcy5vblRvdWNoRW5kZWQsdGhpcyk7XG5cbiAgICB9LFxuXG4gICAgb25Ub3VjaEJlZ2FuOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAvL+WmguaenOinpuaRuOexu+Wei+S4ukZPTExPV++8jOWImeaRh+aOp+adhueahOS9jee9ruS4uuinpuaRuOS9jee9rizop6bmkbjlvIDlp4vml7blgJnnjrDlvaJcbiAgICAgICAgaWYodGhpcy50b3VjaFR5cGUgPT0gVG91Y2hUeXBlLkZPTExPVylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHRvdWNoUG9zID0gdGhpcy5ub2RlLnBhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihldmVudC5nZXRMb2NhdGlvbigpKVxuICAgICAgICAgICAgdGhpcy5ub2RlLnNldFBvc2l0aW9uKHRvdWNoUG9zKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgeyAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAvL+aKiuinpuaRuOeCueWdkOagh+i9rOaNouS4uuebuOWvueS4juebruagh+eahOaooeWei+WdkOagh1xuICAgICAgICAgICAgdmFyIHRvdWNoUG9zID0gdGhpcy5ub2RlLmNvbnZlcnRUb05vZGVTcGFjZUFSKGV2ZW50LmdldExvY2F0aW9uKCkpXG4gICAgICAgICAgICAvL+eCueS4juWchuW/g+eahOi3neemu1xuICAgICAgICAgICAgLy92YXIgZGlzdGFuY2UgPSBjYy5wRGlzdGFuY2UodG91Y2hQb3MsIGNjLlZlYzIoMCwgMCkpO1xuICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gdG91Y2hQb3Muc3ViKGNjLlZlYzIoMCwgMCkpLm1hZygpO1xuXG4gICAgICAgICAgICAvL+WmguaenOeCueS4juWchuW/g+i3neemu+Wwj+S6juWchueahOWNiuW+hCzov5Tlm550cnVlXG4gICAgICAgICAgICBpZihkaXN0YW5jZSA8IHRoaXMucmFkaXVzICkge1xuICAgICAgICAgICAgICAgIGlmKGRpc3RhbmNlPjEwKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAyNTVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qb3lzdGlja0Jhci5zZXRQb3NpdGlvbih0b3VjaFBvcyk7XG4gICAgICAgICAgICAgICAgICAgIC8v5pu05paw6KeS5bqmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dldEFuZ2xlKHRvdWNoUG9zKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uVG91Y2hNb3ZlZDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIC8v5oqK6Kem5pG454K55Z2Q5qCH6L2s5o2i5Li655u45a+55LiO55uu5qCH55qE5qih5Z6L5Z2Q5qCHXG4gICAgICAgIHZhciB0b3VjaFBvcyA9IHRoaXMubm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2VBUihldmVudC5nZXRMb2NhdGlvbigpKVxuICAgICAgICAvL+eCueS4juWchuW/g+eahOi3neemu1xcXFxcbiAgICAgICAgLy92YXIgZGlzdGFuY2UgPSBjYy5wRGlzdGFuY2UodG91Y2hQb3MsIGNjLlZlYzIoMCwgMCkpO1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSB0b3VjaFBvcy5zdWIoY2MuVmVjMigwLCAwKSkubWFnKCk7XG5cbiAgICAgICAgLy/lpoLmnpzngrnkuI7lnIblv4Pot53nprvlsI/kuo7lnIbnmoTljYrlvoQs5o6n5p2G6Lef6ZqP6Kem5pG454K5XG4gICAgICAgIGlmKHRoaXMucmFkaXVzID49IGRpc3RhbmNlKXtcbiAgICAgICAgICAgIGlmKGRpc3RhbmNlPjEwKXtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgICAgICB0aGlzLmpveXN0aWNrQmFyLnNldFBvc2l0aW9uKHRvdWNoUG9zKTtcbiAgICAgICAgICAgICAgICAvL+abtOaWsOinkuW6plxuICAgICAgICAgICAgICAgIHRoaXMuX2dldEFuZ2xlKHRvdWNoUG9zKVxuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gNTBcbiAgICAgICAgICAgICAgICAvL+aRh+adhuaBouWkjeS9jee9rlxuICAgICAgICAgICAgICAgIHRoaXMuam95c3RpY2tCYXIuc2V0UG9zaXRpb24oY2MuVmVjMigwLDApKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuY3VyQW5nbGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIC8v6LCD55So6KeS5bqm5Y+Y5YyW5Zue6LCDXG4gICAgICAgICAgICAgICAgaWYodGhpcy5hbmdsZUNoYW5nZSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5nbGVDaGFuZ2UodGhpcy5jdXJBbmdsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIC8v6Kem5pG455uR5ZCs55uu5qCHXG4gICAgICAgICAgICB2YXIgeCA9IE1hdGguY29zKHRoaXMuX2dldFJhZGlhbih0b3VjaFBvcykpICogdGhpcy5yYWRpdXM7XG4gICAgICAgICAgICB2YXIgeSA9IE1hdGguc2luKHRoaXMuX2dldFJhZGlhbih0b3VjaFBvcykpICogdGhpcy5yYWRpdXM7XG4gICAgICAgICAgICBpZih0b3VjaFBvcy54PjAgJiYgdG91Y2hQb3MueTwwKXtcbiAgICAgICAgICAgICAgICB5ICo9IC0xO1xuICAgICAgICAgICAgfWVsc2UgaWYodG91Y2hQb3MueDwwICYmIHRvdWNoUG9zLnk8MCl7XG4gICAgICAgICAgICAgICAgeSAqPSAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5qb3lzdGlja0Jhci5zZXRQb3NpdGlvbihjYy5WZWMzKHgsIHksIDApKTtcbiAgICAgICAgICAgIC8v5pu05paw6KeS5bqmXG4gICAgICAgICAgICB0aGlzLl9nZXRBbmdsZSh0b3VjaFBvcylcbiAgICAgICAgfVxuXG4gICAgfSxcbiAgICBvblRvdWNoRW5kZWQ6IGZ1bmN0aW9uKGV2ZW50KSB7ICAgICAgICBcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSA1MFxuXG4gICAgICAgIC8v5aaC5p6c6Kem5pG457G75Z6L5Li6Rk9MTE9X77yM56a75byA6Kem5pG45ZCO6ZqQ6JePXG4gICAgICAgIGlmKHRoaXMudG91Y2hUeXBlID09IFRvdWNoVHlwZS5GT0xMT1cpe1xuICAgICAgICAgICAgdGhpcy5ub2RlLnBvc2l0aW9uID0gdGhpcy5pbml0UG9zXG4gICAgICAgIH1cbiAgICAgICAgLy/mkYfmnYbmgaLlpI3kvY3nva5cbiAgICAgICAgdGhpcy5qb3lzdGlja0Jhci5zZXRQb3NpdGlvbih0aGlzLmluaXRCYXJQb3MpO1xuICAgICAgICB0aGlzLmN1ckFuZ2xlID0gbnVsbFxuICAgICAgICAvL+iwg+eUqOinkuW6puWPmOWMluWbnuiwg1xuICAgICAgICBpZih0aGlzLmFuZ2xlQ2hhbmdlKXtcbiAgICAgICAgICAgIHRoaXMuYW5nbGVDaGFuZ2UodGhpcy5jdXJBbmdsZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG5cbiAgICAvL+iuoeeul+inkuW6puW5tui/lOWbnlxuICAgIF9nZXRBbmdsZTogZnVuY3Rpb24ocG9pbnQpXG4gICAge1xuICAgICAgICB0aGlzLl9hbmdsZSA9ICBNYXRoLmZsb29yKHRoaXMuX2dldFJhZGlhbihwb2ludCkqMTgwL01hdGguUEkpO1xuICAgICAgICBcbiAgICAgICAgaWYocG9pbnQueD4wICYmIHBvaW50Lnk8MCl7XG4gICAgICAgICAgICB0aGlzLl9hbmdsZSA9IDM2MCAtIHRoaXMuX2FuZ2xlO1xuICAgICAgICB9ZWxzZSBpZihwb2ludC54PDAgJiYgcG9pbnQueTwwKXtcbiAgICAgICAgICAgIHRoaXMuX2FuZ2xlID0gMzYwIC0gdGhpcy5fYW5nbGU7XG4gICAgICAgIH1lbHNlIGlmKHBvaW50Lng8MCAmJiBwb2ludC55PT0wKXtcbiAgICAgICAgICAgIHRoaXMuX2FuZ2xlID0gMTgwO1xuICAgICAgICB9ZWxzZSBpZihwb2ludC54PjAgJiYgcG9pbnQueT09MCl7XG4gICAgICAgICAgICB0aGlzLl9hbmdsZSA9IDA7XG4gICAgICAgIH1lbHNlIGlmKHBvaW50Lng9PTAgJiYgcG9pbnQueT4wKXtcbiAgICAgICAgICAgIHRoaXMuX2FuZ2xlID0gOTA7XG4gICAgICAgIH1lbHNlIGlmKHBvaW50Lng9PTAgJiYgcG9pbnQueTwwKXtcbiAgICAgICAgICAgIHRoaXMuX2FuZ2xlID0gMjcwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZUN1ckFuZ2xlKClcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FuZ2xlO1xuICAgIH0sXG5cbiAgICAvL+iuoeeul+W8p+W6puW5tui/lOWbnlxuICAgIF9nZXRSYWRpYW46IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgICAgIHZhciBjdXJaID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvaW50LngsMikrTWF0aC5wb3cocG9pbnQueSwyKSk7XG4gICAgICAgIGlmKGN1clo9PTApe1xuICAgICAgICAgICAgdGhpcy5fcmFkaWFuID0gMDtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcmFkaWFuID0gTWF0aC5hY29zKHBvaW50LngvY3VyWik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3JhZGlhbjtcbiAgICB9LFxuXG4gICAgLy/mm7TmlrDlvZPliY3op5LluqZcbiAgICBfdXBkYXRlQ3VyQW5nbGU6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5kaXJlY3Rpb25UeXBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvblR5cGUuRk9VUjpcbiAgICAgICAgICAgICAgICB0aGlzLmN1ckFuZ2xlID0gdGhpcy5fZm91ckRpcmVjdGlvbnMoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uVHlwZS5FSUdIVDpcbiAgICAgICAgICAgICAgICB0aGlzLmN1ckFuZ2xlID0gdGhpcy5fZWlnaHREaXJlY3Rpb25zKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvblR5cGUuQUxMOlxuICAgICAgICAgICAgICAgIHRoaXMuY3VyQW5nbGUgPSB0aGlzLl9hbmdsZVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJBbmdsZSA9IG51bGxcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICAvL+iwg+eUqOinkuW6puWPmOWMluWbnuiwg1xuICAgICAgICBpZih0aGlzLmFuZ2xlQ2hhbmdlKXtcbiAgICAgICAgICAgIHRoaXMuYW5nbGVDaGFuZ2UodGhpcy5jdXJBbmdsZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG5cbiAgICAvL+Wbm+S4quaWueWQkeenu+WKqCjkuIrkuIvlt6blj7MpXG4gICAgX2ZvdXJEaXJlY3Rpb25zOiBmdW5jdGlvbigpXG4gICAge1xuICAgICAgICBpZih0aGlzLl9hbmdsZSA+PSA0NSAmJiB0aGlzLl9hbmdsZSA8PSAxMzUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiA5MFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5fYW5nbGUgPj0gMjI1ICYmIHRoaXMuX2FuZ2xlIDw9IDMxNSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIDI3MFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5fYW5nbGUgPD0gMjI1ICYmIHRoaXMuX2FuZ2xlID49IDE4MCB8fCB0aGlzLl9hbmdsZSA+PSAxMzUgJiYgdGhpcy5fYW5nbGUgPD0gMTgwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gMTgwXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLl9hbmdsZSA8PSAzNjAgJiYgdGhpcy5fYW5nbGUgPj0gMzE1IHx8IHRoaXMuX2FuZ2xlID49IDAgJiYgdGhpcy5fYW5nbGUgPD0gNDUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy/lhavkuKrmlrnlkJHnp7vliqgo5LiK5LiL5bem5Y+z44CB5bem5LiK44CB5Y+z5LiK44CB5bem5LiL44CB5Y+z5LiLKVxuICAgIF9laWdodERpcmVjdGlvbnM6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIGlmKHRoaXMuX2FuZ2xlID49IDY3LjUgJiYgdGhpcy5fYW5nbGUgPD0gMTEyLjUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiA5MFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5fYW5nbGUgPj0gMjQ3LjUgJiYgdGhpcy5fYW5nbGUgPD0gMjkyLjUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAyNzBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FuZ2xlIDw9IDIwMi41ICYmIHRoaXMuX2FuZ2xlID49IDE4MCB8fCB0aGlzLl9hbmdsZSA+PSAxNTcuNSAmJiB0aGlzLl9hbmdsZSA8PSAxODApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAxODBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FuZ2xlIDw9IDM2MCAmJiB0aGlzLl9hbmdsZSA+PSAzMzcuNSB8fCB0aGlzLl9hbmdsZSA+PSAwICYmIHRoaXMuX2FuZ2xlIDw9IDIyLjUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLl9hbmdsZSA+PSAxMTIuNSAmJiB0aGlzLl9hbmdsZSA8PSAxNTcuNSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIDEzNVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5fYW5nbGUgPj0gMjIuNSAmJiB0aGlzLl9hbmdsZSA8PSA2Ny41KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gNDVcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FuZ2xlID49IDIwMi41ICYmIHRoaXMuX2FuZ2xlIDw9IDI0Ny41KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gMjI1XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLl9hbmdsZSA+PSAyOTIuNSAmJiB0aGlzLl9hbmdsZSA8PSAzMzcuNSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIDMxNVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgLy9jYy5ldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5fbGlzdGVuZXIpO1xuICAgICAgICAvLyB0aGlzLm5vZGUub2ZmKFwidG91Y2hzdGFydFwiKTtcbiAgICAgICAgLy8gdGhpcy5ub2RlLm9mZihcInRvdWNobW92ZVwiKTtcbiAgICAgICAgLy8gdGhpcy5ub2RlLm9mZihcInRvdWNoZW5kXCIpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsdGhpcy5vblRvdWNoQmVnYW4sdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSx0aGlzLm9uVG91Y2hNb3ZlZCx0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsdGhpcy5vblRvdWNoRW5kZWQsdGhpcyk7XG4gICAgfVxuXG59KTtcbiJdfQ==
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/migration/use_v2.0.x_cc.Toggle_event.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'cc9b2AaqShElJcN9CviO1HM', 'use_v2.0.x_cc.Toggle_event');
// migration/use_v2.0.x_cc.Toggle_event.js

"use strict";

/*
 * This script is automatically generated by Cocos Creator and is only compatible with projects prior to v2.1.0.
 * You do not need to manually add this script in any other project.
 * If you don't use cc.Toggle in your project, you can delete this script directly.
 * If your project is hosted in VCS such as git, submit this script together.
 *
 * 此脚本由 Cocos Creator 自动生成，仅用于兼容 v2.1.0 之前版本的工程，
 * 你无需在任何其它项目中手动添加此脚本。
 * 如果你的项目中没用到 Toggle，可直接删除该脚本。
 * 如果你的项目有托管于 git 等版本库，请将此脚本一并上传。
 */
if (cc.Toggle) {
  // Whether the 'toggle' and 'checkEvents' events are fired when 'toggle.check() / toggle.uncheck()' is called in the code
  // 在代码中调用 'toggle.check() / toggle.uncheck()' 时是否触发 'toggle' 与 'checkEvents' 事件
  cc.Toggle._triggerEventInScript_check = true;
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9taWdyYXRpb24vdXNlX3YyLjAueF9jYy5Ub2dnbGVfZXZlbnQuanMiXSwibmFtZXMiOlsiY2MiLCJUb2dnbGUiLCJfdHJpZ2dlckV2ZW50SW5TY3JpcHRfY2hlY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7O0FBWUEsSUFBSUEsRUFBRSxDQUFDQyxNQUFQLEVBQWU7QUFDWDtBQUNBO0FBQ0FELEVBQUFBLEVBQUUsQ0FBQ0MsTUFBSCxDQUFVQywyQkFBVixHQUF3QyxJQUF4QztBQUNIIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogVGhpcyBzY3JpcHQgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgQ29jb3MgQ3JlYXRvciBhbmQgaXMgb25seSBjb21wYXRpYmxlIHdpdGggcHJvamVjdHMgcHJpb3IgdG8gdjIuMS4wLlxuICogWW91IGRvIG5vdCBuZWVkIHRvIG1hbnVhbGx5IGFkZCB0aGlzIHNjcmlwdCBpbiBhbnkgb3RoZXIgcHJvamVjdC5cbiAqIElmIHlvdSBkb24ndCB1c2UgY2MuVG9nZ2xlIGluIHlvdXIgcHJvamVjdCwgeW91IGNhbiBkZWxldGUgdGhpcyBzY3JpcHQgZGlyZWN0bHkuXG4gKiBJZiB5b3VyIHByb2plY3QgaXMgaG9zdGVkIGluIFZDUyBzdWNoIGFzIGdpdCwgc3VibWl0IHRoaXMgc2NyaXB0IHRvZ2V0aGVyLlxuICpcbiAqIOatpOiEmuacrOeUsSBDb2NvcyBDcmVhdG9yIOiHquWKqOeUn+aIkO+8jOS7heeUqOS6juWFvOWuuSB2Mi4xLjAg5LmL5YmN54mI5pys55qE5bel56iL77yMXG4gKiDkvaDml6DpnIDlnKjku7vkvZXlhbblroPpobnnm67kuK3miYvliqjmt7vliqDmraTohJrmnKzjgIJcbiAqIOWmguaenOS9oOeahOmhueebruS4reayoeeUqOWIsCBUb2dnbGXvvIzlj6/nm7TmjqXliKDpmaTor6XohJrmnKzjgIJcbiAqIOWmguaenOS9oOeahOmhueebruacieaJmOeuoeS6jiBnaXQg562J54mI5pys5bqT77yM6K+35bCG5q2k6ISa5pys5LiA5bm25LiK5Lyg44CCXG4gKi9cblxuaWYgKGNjLlRvZ2dsZSkge1xuICAgIC8vIFdoZXRoZXIgdGhlICd0b2dnbGUnIGFuZCAnY2hlY2tFdmVudHMnIGV2ZW50cyBhcmUgZmlyZWQgd2hlbiAndG9nZ2xlLmNoZWNrKCkgLyB0b2dnbGUudW5jaGVjaygpJyBpcyBjYWxsZWQgaW4gdGhlIGNvZGVcbiAgICAvLyDlnKjku6PnoIHkuK3osIPnlKggJ3RvZ2dsZS5jaGVjaygpIC8gdG9nZ2xlLnVuY2hlY2soKScg5pe25piv5ZCm6Kem5Y+RICd0b2dnbGUnIOS4jiAnY2hlY2tFdmVudHMnIOS6i+S7tlxuICAgIGNjLlRvZ2dsZS5fdHJpZ2dlckV2ZW50SW5TY3JpcHRfY2hlY2sgPSB0cnVlO1xufVxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/BlastScript.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '5b5e1COo/dBsbkA/Ng9jaEv', 'BlastScript');
// scripts/BlastScript.js

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
  onLoad: function onLoad() {},
  playFinish: function playFinish() {
    this.node.parent = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL0JsYXN0U2NyaXB0LmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwib25Mb2FkIiwicGxheUZpbmlzaCIsIm5vZGUiLCJwYXJlbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRSxDQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVlEsR0FIUDtBQWdCTDtBQUNBQyxFQUFBQSxNQUFNLEVBQUUsa0JBQVksQ0FFbkIsQ0FuQkk7QUFxQkxDLEVBQUFBLFVBQVUsRUFBRSxzQkFBWTtBQUNwQixTQUFLQyxJQUFMLENBQVVDLE1BQVYsR0FBbUIsSUFBbkI7QUFDSCxHQXZCSSxDQXlCTDtBQUNBO0FBRUE7O0FBNUJLLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcblxuICAgIHBsYXlGaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLnBhcmVudCA9IG51bGw7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiJdfQ==
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL0J1bGxldFNjcmlwdC5qcyJdLCJuYW1lcyI6WyJUYW5rVHlwZSIsInJlcXVpcmUiLCJ0YW5rVHlwZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwic3BlZWQiLCJjYW1wIiwib25Mb2FkIiwiX2NpdHlDdHJsIiwiZmluZCIsImdldENvbXBvbmVudCIsInJldXNlIiwiYnVsbGV0UG9vbCIsImJ1bGxldE1vdmUiLCJhbmdsZSIsIm5vZGUiLCJvZmZzZXQiLCJ2MiIsIk1hdGgiLCJmbG9vciIsImNvcyIsIlBJIiwic2luIiwiY2VpbCIsImJ1bGxldEJvb20iLCJwYXJlbnQiLCJwdXQiLCJ1cGRhdGUiLCJkdCIsIngiLCJ5IiwicmVjdCIsImdldEJvdW5kaW5nQm94IiwiY29sbGlzaW9uVGVzdCIsImNvbGxpc2lvblRhbmsiLCJpIiwiZ2FtZURhdGEiLCJ0YW5rTGlzdCIsImxlbmd0aCIsInRhbmsiLCJ0YW5rQ3RybCIsInRlYW0iLCJkaWUiLCJib3VuZGluZ0JveCIsImludGVyc2VjdHMiLCJibG9vZCIsImJvb20iLCJ0dXJuR3JlZW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsUUFBUSxHQUFHQyxPQUFPLENBQUMsVUFBRCxDQUFQLENBQW9CQyxRQUFuQzs7QUFFQUMsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsSUFBQUEsS0FBSyxFQUFFLEVBWEM7QUFZUkMsSUFBQUEsSUFBSSxFQUFHO0FBWkMsR0FIUDtBQW1CTDtBQUNBQyxFQUFBQSxNQUFNLEVBQUUsa0JBQVk7QUFDaEIsU0FBS0MsU0FBTCxHQUFpQlAsRUFBRSxDQUFDUSxJQUFILENBQVEsYUFBUixFQUF1QkMsWUFBdkIsQ0FBb0MsWUFBcEMsQ0FBakI7QUFDSCxHQXRCSTtBQXdCTDtBQUNBQyxFQUFBQSxLQUFLLEVBQUUsZUFBVUMsVUFBVixFQUFzQjtBQUN6QixTQUFLQSxVQUFMLEdBQWtCQSxVQUFsQixDQUR5QixDQUNLO0FBQ2pDLEdBM0JJO0FBNkJMO0FBQ0FDLEVBQUFBLFVBQVUsRUFBRSxzQkFBWTtBQUNwQjtBQUNBLFFBQUlDLEtBQUssR0FBRyxLQUFLQyxJQUFMLENBQVVELEtBQVYsR0FBa0IsRUFBOUI7O0FBQ0EsUUFBR0EsS0FBSyxJQUFFLENBQVAsSUFBWUEsS0FBSyxJQUFFLEdBQW5CLElBQTBCQSxLQUFLLElBQUUsRUFBcEMsRUFBdUM7QUFDbkMsV0FBS0UsTUFBTCxHQUFjZixFQUFFLENBQUNnQixFQUFILENBQU1DLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLEdBQUwsQ0FBU0YsSUFBSSxDQUFDRyxFQUFMLEdBQVEsR0FBUixHQUFZUCxLQUFyQixDQUFYLENBQU4sRUFDTUksSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0ksR0FBTCxDQUFTSixJQUFJLENBQUNHLEVBQUwsR0FBUSxHQUFSLEdBQVlQLEtBQXJCLENBQVgsQ0FETixDQUFkO0FBRUgsS0FIRCxNQUdNLElBQUdBLEtBQUssSUFBRSxHQUFWLEVBQWM7QUFDaEIsV0FBS0UsTUFBTCxHQUFjZixFQUFFLENBQUNnQixFQUFILENBQU1DLElBQUksQ0FBQ0ssSUFBTCxDQUFVTCxJQUFJLENBQUNFLEdBQUwsQ0FBU0YsSUFBSSxDQUFDRyxFQUFMLEdBQVEsR0FBUixHQUFZUCxLQUFyQixDQUFWLENBQU4sRUFDTUksSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0ksR0FBTCxDQUFTSixJQUFJLENBQUNHLEVBQUwsR0FBUSxHQUFSLEdBQVlQLEtBQXJCLENBQVgsQ0FETixDQUFkO0FBRUgsS0FISyxNQUdBO0FBQ0YsV0FBS0UsTUFBTCxHQUFjZixFQUFFLENBQUNnQixFQUFILENBQU1DLElBQUksQ0FBQ0UsR0FBTCxDQUFTRixJQUFJLENBQUNHLEVBQUwsR0FBUSxHQUFSLEdBQVlQLEtBQXJCLENBQU4sRUFDTUksSUFBSSxDQUFDSSxHQUFMLENBQVNKLElBQUksQ0FBQ0csRUFBTCxHQUFRLEdBQVIsR0FBWVAsS0FBckIsQ0FETixDQUFkO0FBRUg7QUFDSixHQTNDSTtBQTZDTDtBQUNBVSxFQUFBQSxVQUFVLEVBQUUsc0JBQVk7QUFDcEIsU0FBS1QsSUFBTCxDQUFVVSxNQUFWLEdBQW1CLElBQW5CO0FBQ0EsU0FBS2IsVUFBTCxDQUFnQmMsR0FBaEIsQ0FBb0IsS0FBS1gsSUFBekI7QUFDSCxHQWpESTtBQW1ETDtBQUNBWSxFQUFBQSxNQUFNLEVBQUUsZ0JBQVVDLEVBQVYsRUFBYztBQUNsQjtBQUNBLFNBQUtiLElBQUwsQ0FBVWMsQ0FBVixJQUFlLEtBQUtiLE1BQUwsQ0FBWWEsQ0FBWixHQUFjLEtBQUt4QixLQUFuQixHQUF5QnVCLEVBQXhDO0FBQ0EsU0FBS2IsSUFBTCxDQUFVZSxDQUFWLElBQWUsS0FBS2QsTUFBTCxDQUFZYyxDQUFaLEdBQWMsS0FBS3pCLEtBQW5CLEdBQXlCdUIsRUFBeEMsQ0FIa0IsQ0FLbEI7O0FBQ0EsUUFBSUcsSUFBSSxHQUFHLEtBQUtoQixJQUFMLENBQVVpQixjQUFWLEVBQVg7O0FBQ0EsUUFBRyxLQUFLeEIsU0FBTCxDQUFleUIsYUFBZixDQUE2QkYsSUFBN0IsRUFBbUMsSUFBbkMsS0FDSSxLQUFLRyxhQUFMLENBQW1CSCxJQUFuQixDQURQLEVBQ2dDO0FBQzVCO0FBQ0EsV0FBS1AsVUFBTDtBQUNIO0FBRUosR0FqRUk7QUFtRUw7QUFDQVUsRUFBQUEsYUFBYSxFQUFFLHVCQUFTSCxJQUFULEVBQWU7QUFDMUIsU0FBSSxJQUFJSSxDQUFDLEdBQUMsQ0FBVixFQUFhQSxDQUFDLEdBQUNsQyxFQUFFLENBQUNtQyxRQUFILENBQVlDLFFBQVosQ0FBcUJDLE1BQXBDLEVBQTRDSCxDQUFDLEVBQTdDLEVBQWdEO0FBQzVDLFVBQUlJLElBQUksR0FBR3RDLEVBQUUsQ0FBQ21DLFFBQUgsQ0FBWUMsUUFBWixDQUFxQkYsQ0FBckIsQ0FBWDtBQUNBLFVBQUlLLFFBQVEsR0FBR0QsSUFBSSxDQUFDN0IsWUFBTCxDQUFrQixZQUFsQixDQUFmOztBQUNBLFVBQUc4QixRQUFRLENBQUNDLElBQVQsSUFBaUIsS0FBSzFCLElBQUwsQ0FBVVQsSUFBM0IsSUFBbUNrQyxRQUFRLENBQUNFLEdBQS9DLEVBQW1EO0FBQy9DO0FBQ0E7QUFDSDs7QUFDRCxVQUFJQyxXQUFXLEdBQUdKLElBQUksQ0FBQ1AsY0FBTCxFQUFsQjs7QUFDQSxVQUFHRCxJQUFJLENBQUNhLFVBQUwsQ0FBZ0JELFdBQWhCLENBQUgsRUFBZ0M7QUFDNUIsWUFBRyxFQUFFSCxRQUFRLENBQUNLLEtBQVgsSUFBb0IsQ0FBdkIsRUFBeUI7QUFDckJMLFVBQUFBLFFBQVEsQ0FBQ00sSUFBVDtBQUNILFNBRkQsTUFHSTtBQUNBTixVQUFBQSxRQUFRLENBQUNPLFNBQVQsQ0FBbUJQLFFBQVEsQ0FBQ0ssS0FBNUI7QUFDSDs7QUFDRCxlQUFPLElBQVA7QUFDSDtBQUNKOztBQUNELFdBQU8sS0FBUDtBQUNIO0FBeEZJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciBUYW5rVHlwZSA9IHJlcXVpcmUoXCJUYW5rRGF0YVwiKS50YW5rVHlwZTtcblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgc3BlZWQ6IDIwLFxuICAgICAgICBjYW1wIDogMCxcblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fY2l0eUN0cmwgPSBjYy5maW5kKFwiL0NpdHlTY3JpcHRcIikuZ2V0Q29tcG9uZW50KFwiQ2l0eVNjcmlwdFwiKTtcbiAgICB9LFxuXG4gICAgLy/lr7nosaHmsaBnZXTojrflj5blr7nosaHmmK/kvJrosIPnlKjmraTmlrnms5VcbiAgICByZXVzZTogZnVuY3Rpb24gKGJ1bGxldFBvb2wpIHtcbiAgICAgICAgdGhpcy5idWxsZXRQb29sID0gYnVsbGV0UG9vbDsgLy8gZ2V0IOS4reS8oOWFpeeahOWtkOW8ueWvueixoeaxoFxuICAgIH0sXG5cbiAgICAvL+WtkOW8ueenu+WKqFxuICAgIGJ1bGxldE1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy/lgY/np7tcbiAgICAgICAgdmFyIGFuZ2xlID0gdGhpcy5ub2RlLmFuZ2xlICsgOTA7XG4gICAgICAgIGlmKGFuZ2xlPT0wIHx8IGFuZ2xlPT0xODAgfHwgYW5nbGU9PTkwKXtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gY2MudjIoTWF0aC5mbG9vcihNYXRoLmNvcyhNYXRoLlBJLzE4MCphbmdsZSkpLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnNpbihNYXRoLlBJLzE4MCphbmdsZSkpKTtcbiAgICAgICAgfWVsc2UgaWYoYW5nbGU9PTI3MCl7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IGNjLnYyKE1hdGguY2VpbChNYXRoLmNvcyhNYXRoLlBJLzE4MCphbmdsZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKE1hdGguc2luKE1hdGguUEkvMTgwKmFuZ2xlKSkpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IGNjLnYyKE1hdGguY29zKE1hdGguUEkvMTgwKmFuZ2xlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5zaW4oTWF0aC5QSS8xODAqYW5nbGUpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvL+WtkOW8ueeIhueCuFxuICAgIGJ1bGxldEJvb206IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuYnVsbGV0UG9vbC5wdXQodGhpcy5ub2RlKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuICAgICAgICAvL+enu+WKqFxuICAgICAgICB0aGlzLm5vZGUueCArPSB0aGlzLm9mZnNldC54KnRoaXMuc3BlZWQqZHQ7XG4gICAgICAgIHRoaXMubm9kZS55ICs9IHRoaXMub2Zmc2V0LnkqdGhpcy5zcGVlZCpkdDtcblxuICAgICAgICAvL+ajgOa1i+eisOaSnlxuICAgICAgICB2YXIgcmVjdCA9IHRoaXMubm9kZS5nZXRCb3VuZGluZ0JveCgpO1xuICAgICAgICBpZih0aGlzLl9jaXR5Q3RybC5jb2xsaXNpb25UZXN0KHJlY3QsIHRydWUpXG4gICAgICAgICAgICB8fCB0aGlzLmNvbGxpc2lvblRhbmsocmVjdCkpe1xuICAgICAgICAgICAgLy/lrZDlvLnniIbngrhcbiAgICAgICAgICAgIHRoaXMuYnVsbGV0Qm9vbSgpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy/liKTmlq3kuI7lnablhYvnorDmkp5cbiAgICBjb2xsaXNpb25UYW5rOiBmdW5jdGlvbihyZWN0KSB7XG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGNjLmdhbWVEYXRhLnRhbmtMaXN0Lmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHZhciB0YW5rID0gY2MuZ2FtZURhdGEudGFua0xpc3RbaV1cbiAgICAgICAgICAgIHZhciB0YW5rQ3RybCA9IHRhbmsuZ2V0Q29tcG9uZW50KFwiVGFua1NjcmlwdFwiKTtcbiAgICAgICAgICAgIGlmKHRhbmtDdHJsLnRlYW0gPT0gdGhpcy5ub2RlLmNhbXAgfHwgdGFua0N0cmwuZGllKXtcbiAgICAgICAgICAgICAgICAvL+WQjOS4gOmYn+S4jeS6kuebuOS8pOWus1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJvdW5kaW5nQm94ID0gdGFuay5nZXRCb3VuZGluZ0JveCgpO1xuICAgICAgICAgICAgaWYocmVjdC5pbnRlcnNlY3RzKGJvdW5kaW5nQm94KSl7XG4gICAgICAgICAgICAgICAgaWYoLS10YW5rQ3RybC5ibG9vZCA8PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgdGFua0N0cmwuYm9vbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB0YW5rQ3RybC50dXJuR3JlZW4odGFua0N0cmwuYmxvb2QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxufSk7XG4iXX0=
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/StartScript.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f8dfbi1cPZJIqQT0xgFEygS', 'StartScript');
// scripts/StartScript.js

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
    //全局数据
    if (!cc.globalData) {
      cc.globalData = {};
    }
  },
  loadChoiceScene: function loadChoiceScene() {
    cc.director.loadScene("ChoiceScene"); //cc.director.loadScene("CityScene1");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL1N0YXJ0U2NyaXB0LmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwib25Mb2FkIiwiZ2xvYmFsRGF0YSIsImxvYWRDaG9pY2VTY2VuZSIsImRpcmVjdG9yIiwibG9hZFNjZW5lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUNBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUUsQ0FDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZRLEdBSFA7QUFnQkw7QUFDQUMsRUFBQUEsTUFBTSxFQUFFLGtCQUFZO0FBQ2hCO0FBQ0EsUUFBRyxDQUFDSixFQUFFLENBQUNLLFVBQVAsRUFBa0I7QUFDZEwsTUFBQUEsRUFBRSxDQUFDSyxVQUFILEdBQWdCLEVBQWhCO0FBQ0g7QUFFSixHQXZCSTtBQXlCTEMsRUFBQUEsZUFBZSxFQUFFLDJCQUFXO0FBQ3hCTixJQUFBQSxFQUFFLENBQUNPLFFBQUgsQ0FBWUMsU0FBWixDQUFzQixhQUF0QixFQUR3QixDQUV4QjtBQUNILEdBNUJJLENBOEJMO0FBQ0E7QUFFQTs7QUFqQ0ssQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy/lhajlsYDmlbDmja5cbiAgICAgICAgaWYoIWNjLmdsb2JhbERhdGEpe1xuICAgICAgICAgICAgY2MuZ2xvYmFsRGF0YSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBsb2FkQ2hvaWNlU2NlbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJDaG9pY2VTY2VuZVwiKTtcbiAgICAgICAgLy9jYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJDaXR5U2NlbmUxXCIpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iXX0=
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/TiledMapData.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'e0850dHf3VMs6DaFbgNuP0k', 'TiledMapData');
// scripts/TiledMapData.js

"use strict";

var _tileType = cc.Enum({
  tileNone: 0,
  tileGrass: 1,
  tileSteel: 2,
  tileWall: 3,
  tileRiver: 4,
  tileKing: 5
}); //gid从1开始


var _gidToTileType = [_tileType.tileNone, _tileType.tileNone, _tileType.tileSteel, _tileType.tileRiver, _tileType.tileGrass, _tileType.tileWall, _tileType.tileKing, _tileType.tileGrass];
module.exports = {
  tileType: _tileType,
  gidToTileType: _gidToTileType
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL1RpbGVkTWFwRGF0YS5qcyJdLCJuYW1lcyI6WyJfdGlsZVR5cGUiLCJjYyIsIkVudW0iLCJ0aWxlTm9uZSIsInRpbGVHcmFzcyIsInRpbGVTdGVlbCIsInRpbGVXYWxsIiwidGlsZVJpdmVyIiwidGlsZUtpbmciLCJfZ2lkVG9UaWxlVHlwZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0aWxlVHlwZSIsImdpZFRvVGlsZVR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBSUEsU0FBUyxHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUNwQkMsRUFBQUEsUUFBUSxFQUFFLENBRFU7QUFFcEJDLEVBQUFBLFNBQVMsRUFBRSxDQUZTO0FBR3ZCQyxFQUFBQSxTQUFTLEVBQUUsQ0FIWTtBQUlwQkMsRUFBQUEsUUFBUSxFQUFFLENBSlU7QUFLdkJDLEVBQUFBLFNBQVMsRUFBRSxDQUxZO0FBTXBCQyxFQUFBQSxRQUFRLEVBQUU7QUFOVSxDQUFSLENBQWhCLEVBUUE7OztBQUNBLElBQUlDLGNBQWMsR0FBRyxDQUNwQlQsU0FBUyxDQUFDRyxRQURVLEVBR3BCSCxTQUFTLENBQUNHLFFBSFUsRUFHQUgsU0FBUyxDQUFDSyxTQUhWLEVBR3FCTCxTQUFTLENBQUNPLFNBSC9CLEVBRzBDUCxTQUFTLENBQUNJLFNBSHBELEVBRytESixTQUFTLENBQUNNLFFBSHpFLEVBR21GTixTQUFTLENBQUNRLFFBSDdGLEVBR3NHUixTQUFTLENBQUNJLFNBSGhILENBQXJCO0FBT0FNLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNiQyxFQUFBQSxRQUFRLEVBQUVaLFNBREc7QUFFYmEsRUFBQUEsYUFBYSxFQUFFSjtBQUZGLENBQWpCIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBfdGlsZVR5cGUgPSBjYy5FbnVtKHtcbiAgICB0aWxlTm9uZTogMCwgXG4gICAgdGlsZUdyYXNzOiAxLCBcblx0dGlsZVN0ZWVsOiAyLCBcbiAgICB0aWxlV2FsbDogMyxcblx0dGlsZVJpdmVyOiA0LCBcbiAgICB0aWxlS2luZzogNVxufSk7XG4vL2dpZOS7jjHlvIDlp4tcbnZhciBfZ2lkVG9UaWxlVHlwZSA9IFtcblx0X3RpbGVUeXBlLnRpbGVOb25lLFxuXHRcblx0X3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZVN0ZWVsLCBfdGlsZVR5cGUudGlsZVJpdmVyLCBfdGlsZVR5cGUudGlsZUdyYXNzLCBfdGlsZVR5cGUudGlsZVdhbGwsIF90aWxlVHlwZS50aWxlS2luZyxfdGlsZVR5cGUudGlsZUdyYXNzXG5cbl07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHRpbGVUeXBlOiBfdGlsZVR5cGUsXG4gICAgZ2lkVG9UaWxlVHlwZTogX2dpZFRvVGlsZVR5cGVcbn07XG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/TankScript.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '6ce61tIUVFH+4QczJMrP1cD', 'TankScript');
// scripts/TankScript.js

"use strict";

var TankType = require("TankData").tankType;

cc.Class({
  "extends": cc.Component,
  properties: {
    //坦克类型
    tankType: {
      "default": TankType.Normal,
      type: TankType
    },
    //速度
    speed: 20,
    //子弹
    bullet: cc.Prefab,
    //发射子弹间隔时间
    fireTime: 0.5,
    //血量
    blood: 1,
    //所属组织
    team: 0,
    //爆炸动画
    blast: cc.Prefab,
    //射击音效
    shootAudio: {
      "default": null,
      url: cc.AudioClip
    },
    //坦克皮肤
    spriteFrames: {
      "default": [],
      type: cc.SpriteFrame
    },
    die: false,
    stop: false
  },
  // use this for initialization
  onLoad: function onLoad() {
    //获取组件
    this._cityCtrl = cc.find("/CityScript").getComponent("CityScript"); //this.bulletNode = cc.find("/Canvas/Map/bullet");

    this.bulletNode = cc.find("/Canvas/map1/layer0");
  },
  start: function start() {
    //初始是停止状态的
    this.stopMove = true;
    this.stop = false; //偏移量

    this.offset = cc.v2();

    if (this.tankType != TankType.Player) {
      var self = this; //添加AI

      var callback = cc.callFunc(function () {
        var angles = [0, 90, 180, 270];
        var index = parseInt(Math.random() * 4, 10);
        self.tankMoveStart(angles[index]);
        self.startFire(self._cityCtrl.bulletPool);
      }, this);
      var seq = cc.sequence(cc.delayTime(0.3), callback, cc.delayTime(1));
      this.node.runAction(cc.repeatForever(seq));
    }
  },
  //添加坦克移动动作
  tankMoveStart: function tankMoveStart(angle) {
    this.node.angle = angle - 90;

    if (angle == 0 || angle == 180 || angle == 90) {
      this.offset = cc.v2(Math.floor(Math.cos(Math.PI / 180 * angle)), Math.floor(Math.sin(Math.PI / 180 * angle)));
    } else if (angle == 270) {
      this.offset = cc.v2(Math.ceil(Math.cos(Math.PI / 180 * angle)), Math.floor(Math.sin(Math.PI / 180 * angle)));
    } else {
      this.offset = cc.v2(Math.cos(Math.PI / 180 * angle), Math.sin(Math.PI / 180 * angle));
    }

    this.stopMove = false;
  },
  //移除坦克移动动作
  tankMoveStop: function tankMoveStop() {
    this.stopMove = true;
  },
  tankStop: function tankStop() {
    this.stop = true;
    cc.director.getActionManager().pauseAllRunningActions();
  },
  // called every frame, uncomment this function to activate update callback
  update: function update(dt) {
    if (this.stop) {
      return;
    }

    if (!this.stopMove) {
      var boundingBox = this.node.getBoundingBox();
      var rect = cc.rect(boundingBox.xMin + this.offset.x * this.speed * dt * 1.5, boundingBox.yMin + this.offset.y * this.speed * dt * 1.7, boundingBox.size.width, boundingBox.size.height);

      if (this._cityCtrl.collisionTest(rect) //检测与地图的碰撞
      || this.collisionTank(rect)) {
        this.tankMoveStop();
      } else {
        this.node.x += this.offset.x * this.speed * dt;
        this.node.y += this.offset.y * this.speed * dt;
      }
    }

    if (this.stopFire) {
      this.fireTime -= dt;

      if (this.fireTime <= 0) {
        this.stopFire = false;
      }
    }
  },
  //判断是否与其他坦克碰撞
  collisionTank: function collisionTank(rect) {
    for (var i = 0; i < cc.gameData.tankList.length; i++) {
      var tank = cc.gameData.tankList[i];

      if (this.node === tank) {
        continue;
      }

      var boundingBox = tank.getBoundingBox(); // if(cc.rectIntersectsRect(rect, boundingBox)){

      if (rect.intersects(boundingBox)) {
        return true;
      }
    }

    return false;
  },
  //开火
  startFire: function startFire(bulletPool) {
    if (this.stopFire) {
      return false;
    }

    this.stopFire = true;
    this.fireTime = 0.5;
    var bullet = null;

    if (bulletPool.size() > 0) {
      bullet = bulletPool.get(bulletPool);
    } else {
      bullet = cc.instantiate(this.bullet);
    } //设置子弹位置,角度


    bullet.angle = this.node.angle;
    var pos = this.node.position;
    var angle = this.node.angle - 90;
    var offset = cc.v2(0, 0);

    if (angle == 0 || angle == 180 || angle == 90) {
      offset = cc.v2(Math.floor(Math.cos(Math.PI / 180 * angle)), Math.floor(Math.sin(Math.PI / 180 * angle)));
    } else if (angle == 270) {
      offset = cc.v2(Math.ceil(Math.cos(Math.PI / 180 * angle)), Math.floor(Math.sin(Math.PI / 180 * angle)));
    } else {
      offset = cc.v2(Math.cos(Math.PI / 180 * angle), Math.sin(Math.PI / 180 * angle));
    }

    if (angle == -90) {
      //cc.log("上");
      bullet.position = pos.add(cc.v2(10 * offset.x, 10 * offset.y + 15));
    } else if (angle == 0) {
      //cc.log("左");
      bullet.position = pos.add(cc.v2(10 * offset.x - 15, 10 * offset.y));
    } else if (angle == -180) {
      //cc.log("右");
      bullet.position = pos.add(cc.v2(10 * offset.x + 15, 10 * offset.y));
    } else if (angle == 90) {
      //cc.log("下");
      bullet.position = pos.add(cc.v2(10 * offset.x, 10 * offset.y - 15));
    } // bullet.position = cc.pAdd(pos,cc.v2(10*offset.x, 10*offset.y));


    bullet.getComponent("BulletScript").bulletMove();
    bullet.parent = this.bulletNode; //子弹标记

    bullet.camp = this.team; //加到列表

    cc.gameData.bulletList.push(bullet);
    return true;
  },
  //爆炸
  boom: function boom() {
    var blast = cc.instantiate(this.blast);
    blast.parent = this.node.parent;
    blast.position = this.node.position;
    var anim = blast.getComponent(cc.Animation);
    anim.play();

    this._cityCtrl.tankBoom(this.node);
  },
  turnGreen: function turnGreen(index) {
    this.node.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[index];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL1RhbmtTY3JpcHQuanMiXSwibmFtZXMiOlsiVGFua1R5cGUiLCJyZXF1aXJlIiwidGFua1R5cGUiLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsIk5vcm1hbCIsInR5cGUiLCJzcGVlZCIsImJ1bGxldCIsIlByZWZhYiIsImZpcmVUaW1lIiwiYmxvb2QiLCJ0ZWFtIiwiYmxhc3QiLCJzaG9vdEF1ZGlvIiwidXJsIiwiQXVkaW9DbGlwIiwic3ByaXRlRnJhbWVzIiwiU3ByaXRlRnJhbWUiLCJkaWUiLCJzdG9wIiwib25Mb2FkIiwiX2NpdHlDdHJsIiwiZmluZCIsImdldENvbXBvbmVudCIsImJ1bGxldE5vZGUiLCJzdGFydCIsInN0b3BNb3ZlIiwib2Zmc2V0IiwidjIiLCJQbGF5ZXIiLCJzZWxmIiwiY2FsbGJhY2siLCJjYWxsRnVuYyIsImFuZ2xlcyIsImluZGV4IiwicGFyc2VJbnQiLCJNYXRoIiwicmFuZG9tIiwidGFua01vdmVTdGFydCIsInN0YXJ0RmlyZSIsImJ1bGxldFBvb2wiLCJzZXEiLCJzZXF1ZW5jZSIsImRlbGF5VGltZSIsIm5vZGUiLCJydW5BY3Rpb24iLCJyZXBlYXRGb3JldmVyIiwiYW5nbGUiLCJmbG9vciIsImNvcyIsIlBJIiwic2luIiwiY2VpbCIsInRhbmtNb3ZlU3RvcCIsInRhbmtTdG9wIiwiZGlyZWN0b3IiLCJnZXRBY3Rpb25NYW5hZ2VyIiwicGF1c2VBbGxSdW5uaW5nQWN0aW9ucyIsInVwZGF0ZSIsImR0IiwiYm91bmRpbmdCb3giLCJnZXRCb3VuZGluZ0JveCIsInJlY3QiLCJ4TWluIiwieCIsInlNaW4iLCJ5Iiwic2l6ZSIsIndpZHRoIiwiaGVpZ2h0IiwiY29sbGlzaW9uVGVzdCIsImNvbGxpc2lvblRhbmsiLCJzdG9wRmlyZSIsImkiLCJnYW1lRGF0YSIsInRhbmtMaXN0IiwibGVuZ3RoIiwidGFuayIsImludGVyc2VjdHMiLCJnZXQiLCJpbnN0YW50aWF0ZSIsInBvcyIsInBvc2l0aW9uIiwiYWRkIiwiYnVsbGV0TW92ZSIsInBhcmVudCIsImNhbXAiLCJidWxsZXRMaXN0IiwicHVzaCIsImJvb20iLCJhbmltIiwiQW5pbWF0aW9uIiwicGxheSIsInRhbmtCb29tIiwidHVybkdyZWVuIiwiU3ByaXRlIiwic3ByaXRlRnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBSUEsUUFBUSxHQUFHQyxPQUFPLENBQUMsVUFBRCxDQUFQLENBQW9CQyxRQUFuQzs7QUFFQUMsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBRVI7QUFDQUosSUFBQUEsUUFBUSxFQUFFO0FBQ04saUJBQVNGLFFBQVEsQ0FBQ08sTUFEWjtBQUVOQyxNQUFBQSxJQUFJLEVBQUVSO0FBRkEsS0FIRjtBQU9SO0FBQ0FTLElBQUFBLEtBQUssRUFBRSxFQVJDO0FBU1I7QUFDQUMsSUFBQUEsTUFBTSxFQUFFUCxFQUFFLENBQUNRLE1BVkg7QUFXUjtBQUNBQyxJQUFBQSxRQUFRLEVBQUUsR0FaRjtBQWFSO0FBQ0FDLElBQUFBLEtBQUssRUFBRSxDQWRDO0FBZVI7QUFDQUMsSUFBQUEsSUFBSSxFQUFFLENBaEJFO0FBaUJSO0FBQ0FDLElBQUFBLEtBQUssRUFBRVosRUFBRSxDQUFDUSxNQWxCRjtBQW1CUjtBQUNBSyxJQUFBQSxVQUFVLEVBQUU7QUFDUixpQkFBUyxJQUREO0FBRVJDLE1BQUFBLEdBQUcsRUFBRWQsRUFBRSxDQUFDZTtBQUZBLEtBcEJKO0FBd0JSO0FBQ0FDLElBQUFBLFlBQVksRUFBRTtBQUNWLGlCQUFTLEVBREM7QUFFVlgsTUFBQUEsSUFBSSxFQUFFTCxFQUFFLENBQUNpQjtBQUZDLEtBekJOO0FBOEJSQyxJQUFBQSxHQUFHLEVBQUUsS0E5Qkc7QUErQlJDLElBQUFBLElBQUksRUFBRTtBQS9CRSxHQUhQO0FBc0NMO0FBQ0FDLEVBQUFBLE1BQU0sRUFBRSxrQkFBWTtBQUNoQjtBQUNBLFNBQUtDLFNBQUwsR0FBaUJyQixFQUFFLENBQUNzQixJQUFILENBQVEsYUFBUixFQUF1QkMsWUFBdkIsQ0FBb0MsWUFBcEMsQ0FBakIsQ0FGZ0IsQ0FHaEI7O0FBQ0EsU0FBS0MsVUFBTCxHQUFrQnhCLEVBQUUsQ0FBQ3NCLElBQUgsQ0FBUSxxQkFBUixDQUFsQjtBQUNILEdBNUNJO0FBOENMRyxFQUFBQSxLQUFLLEVBQUUsaUJBQVc7QUFDZDtBQUNBLFNBQUtDLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxTQUFLUCxJQUFMLEdBQVksS0FBWixDQUhjLENBSWQ7O0FBQ0EsU0FBS1EsTUFBTCxHQUFjM0IsRUFBRSxDQUFDNEIsRUFBSCxFQUFkOztBQUVBLFFBQUcsS0FBSzdCLFFBQUwsSUFBaUJGLFFBQVEsQ0FBQ2dDLE1BQTdCLEVBQW9DO0FBQ2hDLFVBQUlDLElBQUksR0FBRyxJQUFYLENBRGdDLENBRWhDOztBQUNBLFVBQUlDLFFBQVEsR0FBRy9CLEVBQUUsQ0FBQ2dDLFFBQUgsQ0FBWSxZQUFVO0FBQ2pDLFlBQUlDLE1BQU0sR0FBRyxDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsR0FBUixFQUFhLEdBQWIsQ0FBYjtBQUNBLFlBQUlDLEtBQUssR0FBR0MsUUFBUSxDQUFDQyxJQUFJLENBQUNDLE1BQUwsS0FBYyxDQUFmLEVBQWtCLEVBQWxCLENBQXBCO0FBQ0FQLFFBQUFBLElBQUksQ0FBQ1EsYUFBTCxDQUFtQkwsTUFBTSxDQUFDQyxLQUFELENBQXpCO0FBRUFKLFFBQUFBLElBQUksQ0FBQ1MsU0FBTCxDQUFlVCxJQUFJLENBQUNULFNBQUwsQ0FBZW1CLFVBQTlCO0FBRUgsT0FQYyxFQU9aLElBUFksQ0FBZjtBQVNBLFVBQUlDLEdBQUcsR0FBR3pDLEVBQUUsQ0FBQzBDLFFBQUgsQ0FBWTFDLEVBQUUsQ0FBQzJDLFNBQUgsQ0FBYSxHQUFiLENBQVosRUFBK0JaLFFBQS9CLEVBQXlDL0IsRUFBRSxDQUFDMkMsU0FBSCxDQUFhLENBQWIsQ0FBekMsQ0FBVjtBQUNBLFdBQUtDLElBQUwsQ0FBVUMsU0FBVixDQUFvQjdDLEVBQUUsQ0FBQzhDLGFBQUgsQ0FBaUJMLEdBQWpCLENBQXBCO0FBQ0g7QUFFSixHQXJFSTtBQXVFTDtBQUNBSCxFQUFBQSxhQUFhLEVBQUUsdUJBQVVTLEtBQVYsRUFBaUI7QUFFNUIsU0FBS0gsSUFBTCxDQUFVRyxLQUFWLEdBQWtCQSxLQUFLLEdBQUcsRUFBMUI7O0FBRUEsUUFBR0EsS0FBSyxJQUFFLENBQVAsSUFBWUEsS0FBSyxJQUFFLEdBQW5CLElBQTBCQSxLQUFLLElBQUUsRUFBcEMsRUFBdUM7QUFDbkMsV0FBS3BCLE1BQUwsR0FBYzNCLEVBQUUsQ0FBQzRCLEVBQUgsQ0FBTVEsSUFBSSxDQUFDWSxLQUFMLENBQVdaLElBQUksQ0FBQ2EsR0FBTCxDQUFTYixJQUFJLENBQUNjLEVBQUwsR0FBUSxHQUFSLEdBQVlILEtBQXJCLENBQVgsQ0FBTixFQUNDWCxJQUFJLENBQUNZLEtBQUwsQ0FBV1osSUFBSSxDQUFDZSxHQUFMLENBQVNmLElBQUksQ0FBQ2MsRUFBTCxHQUFRLEdBQVIsR0FBWUgsS0FBckIsQ0FBWCxDQURELENBQWQ7QUFFSCxLQUhELE1BR00sSUFBR0EsS0FBSyxJQUFFLEdBQVYsRUFBYztBQUVoQixXQUFLcEIsTUFBTCxHQUFjM0IsRUFBRSxDQUFDNEIsRUFBSCxDQUFNUSxJQUFJLENBQUNnQixJQUFMLENBQVVoQixJQUFJLENBQUNhLEdBQUwsQ0FBU2IsSUFBSSxDQUFDYyxFQUFMLEdBQVEsR0FBUixHQUFZSCxLQUFyQixDQUFWLENBQU4sRUFDTVgsSUFBSSxDQUFDWSxLQUFMLENBQVdaLElBQUksQ0FBQ2UsR0FBTCxDQUFTZixJQUFJLENBQUNjLEVBQUwsR0FBUSxHQUFSLEdBQVlILEtBQXJCLENBQVgsQ0FETixDQUFkO0FBRUgsS0FKSyxNQUlBO0FBQ0YsV0FBS3BCLE1BQUwsR0FBYzNCLEVBQUUsQ0FBQzRCLEVBQUgsQ0FBTVEsSUFBSSxDQUFDYSxHQUFMLENBQVNiLElBQUksQ0FBQ2MsRUFBTCxHQUFRLEdBQVIsR0FBWUgsS0FBckIsQ0FBTixFQUNNWCxJQUFJLENBQUNlLEdBQUwsQ0FBU2YsSUFBSSxDQUFDYyxFQUFMLEdBQVEsR0FBUixHQUFZSCxLQUFyQixDQUROLENBQWQ7QUFFSDs7QUFFRCxTQUFLckIsUUFBTCxHQUFnQixLQUFoQjtBQUNILEdBekZJO0FBMkZMO0FBQ0EyQixFQUFBQSxZQUFZLEVBQUUsd0JBQVk7QUFDdEIsU0FBSzNCLFFBQUwsR0FBZ0IsSUFBaEI7QUFDSCxHQTlGSTtBQWdHTDRCLEVBQUFBLFFBQVEsRUFBRSxvQkFBVztBQUNqQixTQUFLbkMsSUFBTCxHQUFZLElBQVo7QUFDQW5CLElBQUFBLEVBQUUsQ0FBQ3VELFFBQUgsQ0FBWUMsZ0JBQVosR0FBK0JDLHNCQUEvQjtBQUNILEdBbkdJO0FBcUdMO0FBQ0FDLEVBQUFBLE1BQU0sRUFBRSxnQkFBVUMsRUFBVixFQUFjO0FBRWxCLFFBQUcsS0FBS3hDLElBQVIsRUFBYTtBQUNUO0FBQ0g7O0FBRUQsUUFBRyxDQUFDLEtBQUtPLFFBQVQsRUFBa0I7QUFDZCxVQUFJa0MsV0FBVyxHQUFHLEtBQUtoQixJQUFMLENBQVVpQixjQUFWLEVBQWxCO0FBQ0EsVUFBSUMsSUFBSSxHQUFHOUQsRUFBRSxDQUFDOEQsSUFBSCxDQUFRRixXQUFXLENBQUNHLElBQVosR0FBbUIsS0FBS3BDLE1BQUwsQ0FBWXFDLENBQVosR0FBYyxLQUFLMUQsS0FBbkIsR0FBeUJxRCxFQUF6QixHQUE0QixHQUF2RCxFQUNRQyxXQUFXLENBQUNLLElBQVosR0FBbUIsS0FBS3RDLE1BQUwsQ0FBWXVDLENBQVosR0FBYyxLQUFLNUQsS0FBbkIsR0FBeUJxRCxFQUF6QixHQUE0QixHQUR2RCxFQUVFQyxXQUFXLENBQUNPLElBQVosQ0FBaUJDLEtBRm5CLEVBR1FSLFdBQVcsQ0FBQ08sSUFBWixDQUFpQkUsTUFIekIsQ0FBWDs7QUFJQSxVQUFHLEtBQUtoRCxTQUFMLENBQWVpRCxhQUFmLENBQTZCUixJQUE3QixFQUFtQztBQUFuQyxTQUNJLEtBQUtTLGFBQUwsQ0FBbUJULElBQW5CLENBRFAsRUFFSztBQUNELGFBQUtULFlBQUw7QUFDSCxPQUpELE1BSU07QUFDRixhQUFLVCxJQUFMLENBQVVvQixDQUFWLElBQWUsS0FBS3JDLE1BQUwsQ0FBWXFDLENBQVosR0FBYyxLQUFLMUQsS0FBbkIsR0FBeUJxRCxFQUF4QztBQUNBLGFBQUtmLElBQUwsQ0FBVXNCLENBQVYsSUFBZSxLQUFLdkMsTUFBTCxDQUFZdUMsQ0FBWixHQUFjLEtBQUs1RCxLQUFuQixHQUF5QnFELEVBQXhDO0FBQ0g7QUFDSjs7QUFDRCxRQUFHLEtBQUthLFFBQVIsRUFBaUI7QUFDYixXQUFLL0QsUUFBTCxJQUFpQmtELEVBQWpCOztBQUNBLFVBQUcsS0FBS2xELFFBQUwsSUFBZSxDQUFsQixFQUFvQjtBQUNoQixhQUFLK0QsUUFBTCxHQUFnQixLQUFoQjtBQUNIO0FBQ0o7QUFFSixHQWxJSTtBQW9JTDtBQUNBRCxFQUFBQSxhQUFhLEVBQUUsdUJBQVNULElBQVQsRUFBZTtBQUMxQixTQUFJLElBQUlXLENBQUMsR0FBQyxDQUFWLEVBQWFBLENBQUMsR0FBQ3pFLEVBQUUsQ0FBQzBFLFFBQUgsQ0FBWUMsUUFBWixDQUFxQkMsTUFBcEMsRUFBNENILENBQUMsRUFBN0MsRUFBZ0Q7QUFDNUMsVUFBSUksSUFBSSxHQUFHN0UsRUFBRSxDQUFDMEUsUUFBSCxDQUFZQyxRQUFaLENBQXFCRixDQUFyQixDQUFYOztBQUNBLFVBQUcsS0FBSzdCLElBQUwsS0FBY2lDLElBQWpCLEVBQXNCO0FBQ2xCO0FBQ0g7O0FBQ0QsVUFBSWpCLFdBQVcsR0FBR2lCLElBQUksQ0FBQ2hCLGNBQUwsRUFBbEIsQ0FMNEMsQ0FNNUM7O0FBQ0EsVUFBR0MsSUFBSSxDQUFDZ0IsVUFBTCxDQUFnQmxCLFdBQWhCLENBQUgsRUFBZ0M7QUFDNUIsZUFBTyxJQUFQO0FBQ0g7QUFDSjs7QUFDRCxXQUFPLEtBQVA7QUFDSCxHQWxKSTtBQW9KTDtBQUNBckIsRUFBQUEsU0FBUyxFQUFFLG1CQUFVQyxVQUFWLEVBQXFCO0FBQzVCLFFBQUcsS0FBS2dDLFFBQVIsRUFBaUI7QUFDYixhQUFPLEtBQVA7QUFDSDs7QUFDRCxTQUFLQSxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsU0FBSy9ELFFBQUwsR0FBZ0IsR0FBaEI7QUFFQSxRQUFJRixNQUFNLEdBQUcsSUFBYjs7QUFDQSxRQUFHaUMsVUFBVSxDQUFDMkIsSUFBWCxLQUFrQixDQUFyQixFQUF1QjtBQUNuQjVELE1BQUFBLE1BQU0sR0FBR2lDLFVBQVUsQ0FBQ3VDLEdBQVgsQ0FBZXZDLFVBQWYsQ0FBVDtBQUNILEtBRkQsTUFFTTtBQUNGakMsTUFBQUEsTUFBTSxHQUFHUCxFQUFFLENBQUNnRixXQUFILENBQWUsS0FBS3pFLE1BQXBCLENBQVQ7QUFDSCxLQVoyQixDQWE1Qjs7O0FBQ0FBLElBQUFBLE1BQU0sQ0FBQ3dDLEtBQVAsR0FBZSxLQUFLSCxJQUFMLENBQVVHLEtBQXpCO0FBQ0EsUUFBSWtDLEdBQUcsR0FBRyxLQUFLckMsSUFBTCxDQUFVc0MsUUFBcEI7QUFFQSxRQUFJbkMsS0FBSyxHQUFHLEtBQUtILElBQUwsQ0FBVUcsS0FBVixHQUFrQixFQUE5QjtBQUNBLFFBQUlwQixNQUFNLEdBQUczQixFQUFFLENBQUM0QixFQUFILENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBYjs7QUFDQSxRQUFHbUIsS0FBSyxJQUFFLENBQVAsSUFBWUEsS0FBSyxJQUFFLEdBQW5CLElBQTBCQSxLQUFLLElBQUUsRUFBcEMsRUFBdUM7QUFDbkNwQixNQUFBQSxNQUFNLEdBQUczQixFQUFFLENBQUM0QixFQUFILENBQU1RLElBQUksQ0FBQ1ksS0FBTCxDQUFXWixJQUFJLENBQUNhLEdBQUwsQ0FBU2IsSUFBSSxDQUFDYyxFQUFMLEdBQVEsR0FBUixHQUFZSCxLQUFyQixDQUFYLENBQU4sRUFDV1gsSUFBSSxDQUFDWSxLQUFMLENBQVdaLElBQUksQ0FBQ2UsR0FBTCxDQUFTZixJQUFJLENBQUNjLEVBQUwsR0FBUSxHQUFSLEdBQVlILEtBQXJCLENBQVgsQ0FEWCxDQUFUO0FBRUgsS0FIRCxNQUdNLElBQUdBLEtBQUssSUFBRSxHQUFWLEVBQWM7QUFDaEJwQixNQUFBQSxNQUFNLEdBQUczQixFQUFFLENBQUM0QixFQUFILENBQU1RLElBQUksQ0FBQ2dCLElBQUwsQ0FBVWhCLElBQUksQ0FBQ2EsR0FBTCxDQUFTYixJQUFJLENBQUNjLEVBQUwsR0FBUSxHQUFSLEdBQVlILEtBQXJCLENBQVYsQ0FBTixFQUNXWCxJQUFJLENBQUNZLEtBQUwsQ0FBV1osSUFBSSxDQUFDZSxHQUFMLENBQVNmLElBQUksQ0FBQ2MsRUFBTCxHQUFRLEdBQVIsR0FBWUgsS0FBckIsQ0FBWCxDQURYLENBQVQ7QUFFSCxLQUhLLE1BR0E7QUFDRnBCLE1BQUFBLE1BQU0sR0FBRzNCLEVBQUUsQ0FBQzRCLEVBQUgsQ0FBTVEsSUFBSSxDQUFDYSxHQUFMLENBQVNiLElBQUksQ0FBQ2MsRUFBTCxHQUFRLEdBQVIsR0FBWUgsS0FBckIsQ0FBTixFQUNXWCxJQUFJLENBQUNlLEdBQUwsQ0FBU2YsSUFBSSxDQUFDYyxFQUFMLEdBQVEsR0FBUixHQUFZSCxLQUFyQixDQURYLENBQVQ7QUFFSDs7QUFFRCxRQUFHQSxLQUFLLElBQUksQ0FBQyxFQUFiLEVBQWdCO0FBQ1o7QUFDQXhDLE1BQUFBLE1BQU0sQ0FBQzJFLFFBQVAsR0FBa0JELEdBQUcsQ0FBQ0UsR0FBSixDQUFRbkYsRUFBRSxDQUFDNEIsRUFBSCxDQUFNLEtBQUdELE1BQU0sQ0FBQ3FDLENBQWhCLEVBQW1CLEtBQUdyQyxNQUFNLENBQUN1QyxDQUFWLEdBQWMsRUFBakMsQ0FBUixDQUFsQjtBQUNILEtBSEQsTUFHTSxJQUFHbkIsS0FBSyxJQUFJLENBQVosRUFBYztBQUNoQjtBQUNBeEMsTUFBQUEsTUFBTSxDQUFDMkUsUUFBUCxHQUFrQkQsR0FBRyxDQUFDRSxHQUFKLENBQVFuRixFQUFFLENBQUM0QixFQUFILENBQU0sS0FBR0QsTUFBTSxDQUFDcUMsQ0FBVixHQUFjLEVBQXBCLEVBQXdCLEtBQUdyQyxNQUFNLENBQUN1QyxDQUFsQyxDQUFSLENBQWxCO0FBQ0gsS0FISyxNQUdBLElBQUduQixLQUFLLElBQUksQ0FBQyxHQUFiLEVBQWlCO0FBQ25CO0FBQ0F4QyxNQUFBQSxNQUFNLENBQUMyRSxRQUFQLEdBQWtCRCxHQUFHLENBQUNFLEdBQUosQ0FBUW5GLEVBQUUsQ0FBQzRCLEVBQUgsQ0FBTSxLQUFHRCxNQUFNLENBQUNxQyxDQUFWLEdBQWMsRUFBcEIsRUFBd0IsS0FBR3JDLE1BQU0sQ0FBQ3VDLENBQWxDLENBQVIsQ0FBbEI7QUFDSCxLQUhLLE1BR0EsSUFBR25CLEtBQUssSUFBSSxFQUFaLEVBQWU7QUFDakI7QUFDQXhDLE1BQUFBLE1BQU0sQ0FBQzJFLFFBQVAsR0FBa0JELEdBQUcsQ0FBQ0UsR0FBSixDQUFRbkYsRUFBRSxDQUFDNEIsRUFBSCxDQUFNLEtBQUdELE1BQU0sQ0FBQ3FDLENBQWhCLEVBQW1CLEtBQUdyQyxNQUFNLENBQUN1QyxDQUFWLEdBQWMsRUFBakMsQ0FBUixDQUFsQjtBQUNILEtBMUMyQixDQTRDNUI7OztBQUVBM0QsSUFBQUEsTUFBTSxDQUFDZ0IsWUFBUCxDQUFvQixjQUFwQixFQUFvQzZELFVBQXBDO0FBQ0E3RSxJQUFBQSxNQUFNLENBQUM4RSxNQUFQLEdBQWdCLEtBQUs3RCxVQUFyQixDQS9DNEIsQ0FnRDVCOztBQUNBakIsSUFBQUEsTUFBTSxDQUFDK0UsSUFBUCxHQUFjLEtBQUszRSxJQUFuQixDQWpENEIsQ0FvRDVCOztBQUNBWCxJQUFBQSxFQUFFLENBQUMwRSxRQUFILENBQVlhLFVBQVosQ0FBdUJDLElBQXZCLENBQTRCakYsTUFBNUI7QUFFQSxXQUFPLElBQVA7QUFDSCxHQTdNSTtBQStNTDtBQUNBa0YsRUFBQUEsSUFBSSxFQUFFLGdCQUFVO0FBQ1osUUFBSTdFLEtBQUssR0FBR1osRUFBRSxDQUFDZ0YsV0FBSCxDQUFlLEtBQUtwRSxLQUFwQixDQUFaO0FBQ0FBLElBQUFBLEtBQUssQ0FBQ3lFLE1BQU4sR0FBZSxLQUFLekMsSUFBTCxDQUFVeUMsTUFBekI7QUFDQXpFLElBQUFBLEtBQUssQ0FBQ3NFLFFBQU4sR0FBaUIsS0FBS3RDLElBQUwsQ0FBVXNDLFFBQTNCO0FBQ0EsUUFBSVEsSUFBSSxHQUFHOUUsS0FBSyxDQUFDVyxZQUFOLENBQW1CdkIsRUFBRSxDQUFDMkYsU0FBdEIsQ0FBWDtBQUNBRCxJQUFBQSxJQUFJLENBQUNFLElBQUw7O0FBQ0EsU0FBS3ZFLFNBQUwsQ0FBZXdFLFFBQWYsQ0FBd0IsS0FBS2pELElBQTdCO0FBQ0gsR0F2Tkk7QUF5TkxrRCxFQUFBQSxTQUFTLEVBQUUsbUJBQVM1RCxLQUFULEVBQWU7QUFDdEIsU0FBS1UsSUFBTCxDQUFVckIsWUFBVixDQUF1QnZCLEVBQUUsQ0FBQytGLE1BQTFCLEVBQWtDQyxXQUFsQyxHQUFnRCxLQUFLaEYsWUFBTCxDQUFrQmtCLEtBQWxCLENBQWhEO0FBQ0g7QUEzTkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgVGFua1R5cGUgPSByZXF1aXJlKFwiVGFua0RhdGFcIikudGFua1R5cGU7XG5cbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgLy/lnablhYvnsbvlnotcbiAgICAgICAgdGFua1R5cGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFRhbmtUeXBlLk5vcm1hbCxcbiAgICAgICAgICAgIHR5cGU6IFRhbmtUeXBlXG4gICAgICAgIH0sIFxuICAgICAgICAvL+mAn+W6plxuICAgICAgICBzcGVlZDogMjAsXG4gICAgICAgIC8v5a2Q5by5XG4gICAgICAgIGJ1bGxldDogY2MuUHJlZmFiLFxuICAgICAgICAvL+WPkeWwhOWtkOW8uemXtOmalOaXtumXtFxuICAgICAgICBmaXJlVGltZTogMC41LFxuICAgICAgICAvL+ihgOmHj1xuICAgICAgICBibG9vZDogMSxcbiAgICAgICAgLy/miYDlsZ7nu4Tnu4dcbiAgICAgICAgdGVhbTogMCxcbiAgICAgICAgLy/niIbngrjliqjnlLtcbiAgICAgICAgYmxhc3Q6IGNjLlByZWZhYixcbiAgICAgICAgLy/lsITlh7vpn7PmlYhcbiAgICAgICAgc2hvb3RBdWRpbzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwLFxuICAgICAgICB9LFxuICAgICAgICAvL+WdpuWFi+earuiCpFxuICAgICAgICBzcHJpdGVGcmFtZXM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWUsXG4gICAgICAgIH0sXG5cbiAgICAgICAgZGllOiBmYWxzZSxcbiAgICAgICAgc3RvcDogZmFsc2UsXG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8v6I635Y+W57uE5Lu2XG4gICAgICAgIHRoaXMuX2NpdHlDdHJsID0gY2MuZmluZChcIi9DaXR5U2NyaXB0XCIpLmdldENvbXBvbmVudChcIkNpdHlTY3JpcHRcIik7XG4gICAgICAgIC8vdGhpcy5idWxsZXROb2RlID0gY2MuZmluZChcIi9DYW52YXMvTWFwL2J1bGxldFwiKTtcbiAgICAgICAgdGhpcy5idWxsZXROb2RlID0gY2MuZmluZChcIi9DYW52YXMvbWFwMS9sYXllcjBcIik7XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy/liJ3lp4vmmK/lgZzmraLnirbmgIHnmoRcbiAgICAgICAgdGhpcy5zdG9wTW92ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuc3RvcCA9IGZhbHNlO1xuICAgICAgICAvL+WBj+enu+mHj1xuICAgICAgICB0aGlzLm9mZnNldCA9IGNjLnYyKCk7XG5cbiAgICAgICAgaWYodGhpcy50YW5rVHlwZSAhPSBUYW5rVHlwZS5QbGF5ZXIpe1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgLy/mt7vliqBBSVxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gY2MuY2FsbEZ1bmMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgYW5nbGVzID0gWzAsIDkwLCAxODAsIDI3MF07XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoTWF0aC5yYW5kb20oKSo0LCAxMCk7XG4gICAgICAgICAgICAgICAgc2VsZi50YW5rTW92ZVN0YXJ0KGFuZ2xlc1tpbmRleF0pO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5zdGFydEZpcmUoc2VsZi5fY2l0eUN0cmwuYnVsbGV0UG9vbCk7XG5cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoY2MuZGVsYXlUaW1lKDAuMyksIGNhbGxiYWNrLCBjYy5kZWxheVRpbWUoMSkpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5yZXBlYXRGb3JldmVyKHNlcSkpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy/mt7vliqDlnablhYvnp7vliqjliqjkvZxcbiAgICB0YW5rTW92ZVN0YXJ0OiBmdW5jdGlvbiAoYW5nbGUpIHtcblxuICAgICAgICB0aGlzLm5vZGUuYW5nbGUgPSBhbmdsZSAtIDkwO1xuXG4gICAgICAgIGlmKGFuZ2xlPT0wIHx8IGFuZ2xlPT0xODAgfHwgYW5nbGU9PTkwKXtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gY2MudjIoTWF0aC5mbG9vcihNYXRoLmNvcyhNYXRoLlBJLzE4MCphbmdsZSkpLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5zaW4oTWF0aC5QSS8xODAqYW5nbGUpKSk7XG4gICAgICAgIH1lbHNlIGlmKGFuZ2xlPT0yNzApe1xuXG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IGNjLnYyKE1hdGguY2VpbChNYXRoLmNvcyhNYXRoLlBJLzE4MCphbmdsZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKE1hdGguc2luKE1hdGguUEkvMTgwKmFuZ2xlKSkpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IGNjLnYyKE1hdGguY29zKE1hdGguUEkvMTgwKmFuZ2xlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5zaW4oTWF0aC5QSS8xODAqYW5nbGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RvcE1vdmUgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy/np7vpmaTlnablhYvnp7vliqjliqjkvZxcbiAgICB0YW5rTW92ZVN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zdG9wTW92ZSA9IHRydWU7XG4gICAgfSxcblxuICAgIHRhbmtTdG9wOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgdGhpcy5zdG9wID0gdHJ1ZTtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLnBhdXNlQWxsUnVubmluZ0FjdGlvbnMoKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgICAgIGlmKHRoaXMuc3RvcCl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZighdGhpcy5zdG9wTW92ZSl7XG4gICAgICAgICAgICB2YXIgYm91bmRpbmdCb3ggPSB0aGlzLm5vZGUuZ2V0Qm91bmRpbmdCb3goKTtcbiAgICAgICAgICAgIHZhciByZWN0ID0gY2MucmVjdChib3VuZGluZ0JveC54TWluICsgdGhpcy5vZmZzZXQueCp0aGlzLnNwZWVkKmR0KjEuNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3VuZGluZ0JveC55TWluICsgdGhpcy5vZmZzZXQueSp0aGlzLnNwZWVkKmR0KjEuNywgXG5cdFx0ICAgICAgICAgICAgICAgICAgICAgICBib3VuZGluZ0JveC5zaXplLndpZHRoLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3VuZGluZ0JveC5zaXplLmhlaWdodCk7XG4gICAgICAgICAgICBpZih0aGlzLl9jaXR5Q3RybC5jb2xsaXNpb25UZXN0KHJlY3QpIC8v5qOA5rWL5LiO5Zyw5Zu+55qE56Kw5pKeXG4gICAgICAgICAgICAgICAgfHwgdGhpcy5jb2xsaXNpb25UYW5rKHJlY3QpXG4gICAgICAgICAgICAgICAgKXtcbiAgICAgICAgICAgICAgICB0aGlzLnRhbmtNb3ZlU3RvcCgpO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS54ICs9IHRoaXMub2Zmc2V0LngqdGhpcy5zcGVlZCpkdDtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSArPSB0aGlzLm9mZnNldC55KnRoaXMuc3BlZWQqZHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5zdG9wRmlyZSl7XG4gICAgICAgICAgICB0aGlzLmZpcmVUaW1lIC09IGR0O1xuICAgICAgICAgICAgaWYodGhpcy5maXJlVGltZTw9MCl7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wRmlyZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy/liKTmlq3mmK/lkKbkuI7lhbbku5blnablhYvnorDmkp5cbiAgICBjb2xsaXNpb25UYW5rOiBmdW5jdGlvbihyZWN0KSB7XG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGNjLmdhbWVEYXRhLnRhbmtMaXN0Lmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHZhciB0YW5rID0gY2MuZ2FtZURhdGEudGFua0xpc3RbaV1cbiAgICAgICAgICAgIGlmKHRoaXMubm9kZSA9PT0gdGFuayl7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYm91bmRpbmdCb3ggPSB0YW5rLmdldEJvdW5kaW5nQm94KCk7XG4gICAgICAgICAgICAvLyBpZihjYy5yZWN0SW50ZXJzZWN0c1JlY3QocmVjdCwgYm91bmRpbmdCb3gpKXtcbiAgICAgICAgICAgIGlmKHJlY3QuaW50ZXJzZWN0cyhib3VuZGluZ0JveCkpeyAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvL+W8gOeBq1xuICAgIHN0YXJ0RmlyZTogZnVuY3Rpb24gKGJ1bGxldFBvb2wpe1xuICAgICAgICBpZih0aGlzLnN0b3BGaXJlKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0b3BGaXJlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5maXJlVGltZSA9IDAuNTtcblxuICAgICAgICB2YXIgYnVsbGV0ID0gbnVsbDtcbiAgICAgICAgaWYoYnVsbGV0UG9vbC5zaXplKCk+MCl7XG4gICAgICAgICAgICBidWxsZXQgPSBidWxsZXRQb29sLmdldChidWxsZXRQb29sKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgYnVsbGV0ID0gY2MuaW5zdGFudGlhdGUodGhpcy5idWxsZXQpO1xuICAgICAgICB9XG4gICAgICAgIC8v6K6+572u5a2Q5by55L2N572uLOinkuW6plxuICAgICAgICBidWxsZXQuYW5nbGUgPSB0aGlzLm5vZGUuYW5nbGU7XG4gICAgICAgIHZhciBwb3MgPSB0aGlzLm5vZGUucG9zaXRpb247XG5cbiAgICAgICAgdmFyIGFuZ2xlID0gdGhpcy5ub2RlLmFuZ2xlIC0gOTA7XG4gICAgICAgIHZhciBvZmZzZXQgPSBjYy52MigwLCAwKTtcbiAgICAgICAgaWYoYW5nbGU9PTAgfHwgYW5nbGU9PTE4MCB8fCBhbmdsZT09OTApe1xuICAgICAgICAgICAgb2Zmc2V0ID0gY2MudjIoTWF0aC5mbG9vcihNYXRoLmNvcyhNYXRoLlBJLzE4MCphbmdsZSkpLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnNpbihNYXRoLlBJLzE4MCphbmdsZSkpKTtcbiAgICAgICAgfWVsc2UgaWYoYW5nbGU9PTI3MCl7XG4gICAgICAgICAgICBvZmZzZXQgPSBjYy52MihNYXRoLmNlaWwoTWF0aC5jb3MoTWF0aC5QSS8xODAqYW5nbGUpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnNpbihNYXRoLlBJLzE4MCphbmdsZSkpKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgb2Zmc2V0ID0gY2MudjIoTWF0aC5jb3MoTWF0aC5QSS8xODAqYW5nbGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNpbihNYXRoLlBJLzE4MCphbmdsZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoYW5nbGUgPT0gLTkwKXtcbiAgICAgICAgICAgIC8vY2MubG9nKFwi5LiKXCIpO1xuICAgICAgICAgICAgYnVsbGV0LnBvc2l0aW9uID0gcG9zLmFkZChjYy52MigxMCpvZmZzZXQueCwgMTAqb2Zmc2V0LnkgKyAxNSkpO1xuICAgICAgICB9ZWxzZSBpZihhbmdsZSA9PSAwKXtcbiAgICAgICAgICAgIC8vY2MubG9nKFwi5bemXCIpO1xuICAgICAgICAgICAgYnVsbGV0LnBvc2l0aW9uID0gcG9zLmFkZChjYy52MigxMCpvZmZzZXQueCAtIDE1LCAxMCpvZmZzZXQueSkpO1xuICAgICAgICB9ZWxzZSBpZihhbmdsZSA9PSAtMTgwKXtcbiAgICAgICAgICAgIC8vY2MubG9nKFwi5Y+zXCIpO1xuICAgICAgICAgICAgYnVsbGV0LnBvc2l0aW9uID0gcG9zLmFkZChjYy52MigxMCpvZmZzZXQueCArIDE1LCAxMCpvZmZzZXQueSkpO1xuICAgICAgICB9ZWxzZSBpZihhbmdsZSA9PSA5MCl7XG4gICAgICAgICAgICAvL2NjLmxvZyhcIuS4i1wiKTtcbiAgICAgICAgICAgIGJ1bGxldC5wb3NpdGlvbiA9IHBvcy5hZGQoY2MudjIoMTAqb2Zmc2V0LngsIDEwKm9mZnNldC55IC0gMTUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJ1bGxldC5wb3NpdGlvbiA9IGNjLnBBZGQocG9zLGNjLnYyKDEwKm9mZnNldC54LCAxMCpvZmZzZXQueSkpO1xuXG4gICAgICAgIGJ1bGxldC5nZXRDb21wb25lbnQoXCJCdWxsZXRTY3JpcHRcIikuYnVsbGV0TW92ZSgpO1xuICAgICAgICBidWxsZXQucGFyZW50ID0gdGhpcy5idWxsZXROb2RlO1xuICAgICAgICAvL+WtkOW8ueagh+iusFxuICAgICAgICBidWxsZXQuY2FtcCA9IHRoaXMudGVhbTtcbiAgICAgICAgXG5cbiAgICAgICAgLy/liqDliLDliJfooahcbiAgICAgICAgY2MuZ2FtZURhdGEuYnVsbGV0TGlzdC5wdXNoKGJ1bGxldCk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIC8v54iG54K4XG4gICAgYm9vbTogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGJsYXN0ID0gY2MuaW5zdGFudGlhdGUodGhpcy5ibGFzdCk7XG4gICAgICAgIGJsYXN0LnBhcmVudCA9IHRoaXMubm9kZS5wYXJlbnQ7XG4gICAgICAgIGJsYXN0LnBvc2l0aW9uID0gdGhpcy5ub2RlLnBvc2l0aW9uO1xuICAgICAgICB2YXIgYW5pbSA9IGJsYXN0LmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICBhbmltLnBsYXkoKTtcbiAgICAgICAgdGhpcy5fY2l0eUN0cmwudGFua0Jvb20odGhpcy5ub2RlKTtcbiAgICB9LFxuXG4gICAgdHVybkdyZWVuOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICAgIHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IHRoaXMuc3ByaXRlRnJhbWVzW2luZGV4XTtcbiAgICB9LFxuXG59KTtcbiJdfQ==
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------
