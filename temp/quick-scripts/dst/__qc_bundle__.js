
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
    }

    alert.show.call(this, "关卡" + cc.gameData.curLevel, function () {}); //默认角度

    this.curAngle = null;
    var self = this; //注册监听事件

    this.registerInputEvent(); //引入地图数据

    this._tiledMapData = require("TiledMapData"); //获取地图尺寸

    this._curMapTileSize = this._tiledMap.getTileSize();
    this._curMapSize = cc.v2(this._tiledMap.node.width, this._tiledMap.node.height);
    cc.log("this._curMapTileSize =" + this._curMapTileSize);
    cc.log("this._curMapSize =" + this._curMapSize); //地图墙层

    this.mapLayer0 = this._tiledMap.getLayer("layer_0"); //初始化对象池(参数必须为对应脚本的文件名)

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

    this.tankNode = cc.find("/Canvas/Map"); //this.tankNode = cc.find("/Canvas/map1/layer0");
    //加入player

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
      this.doubleFireBtn.opacity = 240; //this.doubleFireBtn.getComponent(cc.Sprite).spriteFrame = this.doubleFireFrames[1];
    } else {
      this.doubleFireBtn.opacity = 255; //this.doubleFireBtn.getComponent(cc.Sprite).spriteFrame = this.doubleFireFrames[0];
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
        var num = parseInt(Math.random() * (13 - 10 + 1) + 10, 10);
        this.mapLayer0.setTileGIDAt(num, parseInt(point.x / this._curMapTileSize.width), parseInt(point.y / this._curMapTileSize.height), 1);
      } else if (bullet && this._tiledMapData.gidToTileType[gid] == this._tiledMapData.tileType.tileKing) {
        this.mapLayer0.setTileGIDAt(0, parseInt(point.x / this._curMapTileSize.width), parseInt(point.y / this._curMapTileSize.height), 1);
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
      tank.position = this.bornPoses[this.bornPoses.length - 1];
      tank.zIndex = -1; //获取坦克控制组件

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
      tank.zIndex = -1;
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
    if (cc.gameData.single && tank.getComponent("TankScript").team == 0) {// this.life --;
      // this.lifeNum.string = this.life + "";
      // if(this.life > 0){
      //     this.addPlayerTank();
      // }else{
      //     this.gameOver();
      // }
      // tank.getComponent("TankScript").blood = 1;
    } else {
      tank.parent = null;
      tank.getComponent("TankScript").die = true;
      this.tankPool.put(tank);
      tank.parent = null;
      tank.getComponent("TankScript").die = true;
      this.tankPool.put(tank);
      var tankNum = Number(this.enemyNum.string) - 1;
      this.enemyNum.string = tankNum + "";

      if (tankNum == 0) {
        if (cc.gameData.curLevel < 10) {
          ++cc.gameData.curLevel;
          cc.director.loadScene("CityScene" + cc.gameData.curLevel);
        } else {
          this.doubleFire = false;
          alert.show.call(this, "你赢了", function () {
            cc.director.loadScene("StartScene");
          });
        }
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQ2l0eVNjcmlwdC5qcyJdLCJuYW1lcyI6WyJUYW5rVHlwZSIsInJlcXVpcmUiLCJ0YW5rVHlwZSIsImFsZXJ0IiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJjdXJNYXAiLCJUaWxlZE1hcCIsInlhb2dhbiIsIk5vZGUiLCJidWxsZXQiLCJQcmVmYWIiLCJ0YW5rIiwidHlwZSIsIm1heENvdW50IiwibGlmZSIsImJvcm5Qb3NlcyIsIlZlYzIiLCJzcHJpdGVGcmFtZXMiLCJTcHJpdGVGcmFtZSIsInRhbmtTcGVlZHMiLCJGbG9hdCIsInRhbmtGaXJlVGltZXMiLCJ0YW5rQmxvb2RzIiwiSW50ZWdlciIsImVuZW15TnVtIiwiTGFiZWwiLCJsaWZlTnVtIiwiZG91YmxlRmlyZSIsImRvdWJsZUZpcmVCdG4iLCJkb3VibGVGaXJlRnJhbWVzIiwib25Mb2FkIiwiX2pveXN0aWNrQ3RybCIsImdldENvbXBvbmVudCIsIl90aWxlZE1hcCIsInN0cmluZyIsInN0YXJ0IiwiZXJyIiwic2hvdyIsImNhbGwiLCJnYW1lRGF0YSIsImN1ckxldmVsIiwiY3VyQW5nbGUiLCJzZWxmIiwicmVnaXN0ZXJJbnB1dEV2ZW50IiwiX3RpbGVkTWFwRGF0YSIsIl9jdXJNYXBUaWxlU2l6ZSIsImdldFRpbGVTaXplIiwiX2N1ck1hcFNpemUiLCJ2MiIsIm5vZGUiLCJ3aWR0aCIsImhlaWdodCIsImxvZyIsIm1hcExheWVyMCIsImdldExheWVyIiwiYnVsbGV0UG9vbCIsIk5vZGVQb29sIiwiaW5pdEJ1bGxldENvdW50IiwiaSIsImluc3RhbnRpYXRlIiwicHV0IiwidGFua1Bvb2wiLCJ0ZWFtSWQiLCJzaW5nbGUiLCJ0YW5rTGlzdCIsImJ1bGxldExpc3QiLCJ0YW5rTm9kZSIsImZpbmQiLCJwbGF5ZXIiLCJhZGRQbGF5ZXJUYW5rIiwiX3BsYXllclRhbmtDdHJsIiwic2NoZWR1bGUiLCJhZGRBSVRhbmsiLCJtYWNybyIsIlJFUEVBVF9GT1JFVkVSIiwidXBkYXRlIiwiZHQiLCJzdGFydEZpcmUiLCJzZXREb3VibGVGaXJlIiwib3BhY2l0eSIsImFkZEpveVN0aWNrVG91Y2hDaGFuZ2VMaXN0ZW5lciIsImFuZ2xlIiwic3RvcE1vdmUiLCJ0YW5rTW92ZVN0YXJ0IiwidGFua01vdmVTdG9wIiwic3lzdGVtRXZlbnQiLCJvbiIsIlN5c3RlbUV2ZW50IiwiRXZlbnRUeXBlIiwiS0VZX0RPV04iLCJldmVudCIsImtleUNvZGUiLCJLRVkiLCJ3IiwicyIsImEiLCJkIiwiayIsImZpcmVCdG5DbGljayIsIktFWV9VUCIsImNvbGxpc2lvblRlc3QiLCJyZWN0IiwieE1pbiIsIngiLCJ4TWF4IiwieU1pbiIsInkiLCJ5TWF4IiwiTWluWSIsIk1heFkiLCJNaW5YIiwiTWF4WCIsIkxlZnREb3duIiwiUmlnaHREb3duIiwiTGVmdFVwIiwiUmlnaHRVcCIsIk1pZERvd24iLCJNaWRVcCIsIk1pZExlZnQiLCJNaWRSaWdodCIsIl9jb2xsaXNpb25UZXN0IiwicG9pbnRzIiwicG9pbnQiLCJzaGlmdCIsImdpZCIsImdldFRpbGVHSURBdCIsInBhcnNlSW50IiwiZ2lkVG9UaWxlVHlwZSIsInRpbGVUeXBlIiwidGlsZU5vbmUiLCJ0aWxlR3Jhc3MiLCJ0aWxlV2FsbCIsIm51bSIsIk1hdGgiLCJyYW5kb20iLCJzZXRUaWxlR0lEQXQiLCJ0aWxlS2luZyIsImdhbWVPdmVyIiwibGVuZ3RoIiwidGFua0N0cmwiLCJ0YW5rU3RvcCIsImRpcmVjdG9yIiwibG9hZFNjZW5lIiwidGVhbSIsInNpemUiLCJnZXQiLCJTcHJpdGUiLCJzcHJpdGVGcmFtZSIsInBvc2l0aW9uIiwiekluZGV4IiwiUGxheWVyIiwic3BlZWQiLCJmaXJlVGltZSIsImJsb29kIiwiZGllIiwicGFyZW50IiwicHVzaCIsImluZGV4IiwiY29sbGlzaW9uVGFuayIsImdldEJvdW5kaW5nQm94IiwidGFua0Jvb20iLCJ0YW5rTnVtIiwiTnVtYmVyIiwiYXVkaW9FbmdpbmUiLCJwbGF5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LENBQStCLEtBQUt0QixVQUFwQyxDQUFILEVBQW1EO0FBQy9DO0FBQ0F0RCxNQUFBQSxFQUFFLENBQUNrSyxXQUFILENBQWVDLElBQWYsQ0FBb0IsS0FBSzlGLGVBQUwsQ0FBcUIrRixVQUF6QyxFQUFxRCxLQUFyRCxFQUE0RCxDQUE1RDtBQUNIO0FBQ0osR0ExYkk7QUE0Ykw7QUFDQUMsRUFBQUEsU0FBUyxFQUFFLHFCQUFZO0FBQ25CLFNBQUtDLFVBQUwsQ0FBZ0IsS0FBSy9GLFNBQXJCLEVBQStCLElBQS9CO0FBQ0g7QUEvYkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFRhbmtUeXBlID0gcmVxdWlyZShcIlRhbmtEYXRhXCIpLnRhbmtUeXBlO1xyXG5sZXQgYWxlcnQgPSByZXF1aXJlKCdBbGVydCcpO1xyXG5cclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcblxyXG4gICAgICAgIC8v5Zyw5Zu+XHJcbiAgICAgICAgY3VyTWFwOiBjYy5UaWxlZE1hcCxcclxuICAgICAgICAvL+aRh+adhlxyXG4gICAgICAgIHlhb2dhbjogY2MuTm9kZSxcclxuXHJcbiAgICAgICAgLy/lrZDlvLnpooTliLbkvZNcclxuICAgICAgICBidWxsZXQ6IGNjLlByZWZhYixcclxuICAgICAgICAvL+WdpuWFi+mihOWItuS9k1xyXG4gICAgICAgIHRhbms6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/mnIDlpKfmlbDph49cclxuICAgICAgICBtYXhDb3VudDogMTAsXHJcbiAgICAgICAgbGlmZTogMyxcclxuICAgICAgICAvL+WHuueUn+WcsFxyXG4gICAgICAgIGJvcm5Qb3Nlczoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcclxuICAgICAgICAgICAgdHlwZTogY2MuVmVjMixcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5Z2m5YWL55qu6IKkXHJcbiAgICAgICAgc3ByaXRlRnJhbWVzOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5Z2m5YWL56e75Yqo6YCf5bqmXHJcbiAgICAgICAgdGFua1NwZWVkczoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcclxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXQsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL+WdpuWFi+WtkOW8ueWPkeWwhOmXtOmalOaXtumXtFxyXG4gICAgICAgIHRhbmtGaXJlVGltZXM6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogW10sXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8v5Z2m5YWL6KGA6YePXHJcbiAgICAgICAgdGFua0Jsb29kczoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcclxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlcixcclxuICAgICAgICB9LFxyXG4gICAgICAgIFxyXG4gICAgICAgIGVuZW15TnVtOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsLFxyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGlmZU51bToge1xyXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRvdWJsZUZpcmU6IGZhbHNlLFxyXG4gICAgICAgIGRvdWJsZUZpcmVCdG46IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZG91YmxlRmlyZUZyYW1lczoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcclxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWUsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gY2MuZGlyZWN0b3Iuc2V0RGlzcGxheVN0YXRzKHRydWUpO1xyXG4gICAgICAgIC8v6I635Y+W5pGH5p2G5o6n5Yi257uE5Lu2XHJcbiAgICAgICAgdGhpcy5fam95c3RpY2tDdHJsID0gdGhpcy55YW9nYW4uZ2V0Q29tcG9uZW50KFwiSm95c3RpY2tDdHJsXCIpO1xyXG4gICAgICAgIC8v6I635Y+W5Zyw5Zu+IFRpbGVkTWFwIOe7hOS7tlxyXG4gICAgICAgIHRoaXMuX3RpbGVkTWFwID0gdGhpcy5jdXJNYXAuZ2V0Q29tcG9uZW50KCdjYy5UaWxlZE1hcCcpO1xyXG4gICAgICAgIHRoaXMuZW5lbXlOdW0uc3RyaW5nID0gdGhpcy5tYXhDb3VudCArIFwiXCI7XHJcbiAgICAgICAgdGhpcy5saWZlTnVtLnN0cmluZyA9IHRoaXMubGlmZSArIFwiXCI7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0OiBmdW5jdGlvbihlcnIpe1xyXG4gICAgICAgIGlmKGVycil7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFsZXJ0LnNob3cuY2FsbCh0aGlzLCBcIuWFs+WNoVwiICsgY2MuZ2FtZURhdGEuY3VyTGV2ZWwsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8v6buY6K6k6KeS5bqmXHJcbiAgICAgICAgdGhpcy5jdXJBbmdsZSA9IG51bGw7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAvL+azqOWGjOebkeWQrOS6i+S7tlxyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnB1dEV2ZW50KCk7XHJcbiAgICAgICAgLy/lvJXlhaXlnLDlm77mlbDmja5cclxuICAgICAgICB0aGlzLl90aWxlZE1hcERhdGEgPSByZXF1aXJlKFwiVGlsZWRNYXBEYXRhXCIpO1xyXG5cclxuICAgICAgICAvL+iOt+WPluWcsOWbvuWwuuWvuFxyXG4gICAgICAgIHRoaXMuX2N1ck1hcFRpbGVTaXplID0gdGhpcy5fdGlsZWRNYXAuZ2V0VGlsZVNpemUoKTtcclxuICAgICAgICB0aGlzLl9jdXJNYXBTaXplID0gY2MudjIodGhpcy5fdGlsZWRNYXAubm9kZS53aWR0aCx0aGlzLl90aWxlZE1hcC5ub2RlLmhlaWdodCk7XHJcbiAgICAgICAgY2MubG9nKFwidGhpcy5fY3VyTWFwVGlsZVNpemUgPVwiICsgdGhpcy5fY3VyTWFwVGlsZVNpemUpO1xyXG4gICAgICAgIGNjLmxvZyhcInRoaXMuX2N1ck1hcFNpemUgPVwiICsgdGhpcy5fY3VyTWFwU2l6ZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy/lnLDlm77lopnlsYJcclxuICAgICAgICB0aGlzLm1hcExheWVyMCA9IHRoaXMuX3RpbGVkTWFwLmdldExheWVyKFwibGF5ZXJfMFwiKTtcclxuXHJcbiAgICAgICAgLy/liJ3lp4vljJblr7nosaHmsaAo5Y+C5pWw5b+F6aG75Li65a+55bqU6ISa5pys55qE5paH5Lu25ZCNKVxyXG4gICAgICAgIHRoaXMuYnVsbGV0UG9vbCA9IG5ldyBjYy5Ob2RlUG9vbChcIkJ1bGxldFNjcmlwdFwiKTtcclxuICAgICAgICB2YXIgaW5pdEJ1bGxldENvdW50ID0gMjA7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8aW5pdEJ1bGxldENvdW50OyArK2kpe1xyXG4gICAgICAgICAgICB2YXIgYnVsbGV0ID0gY2MuaW5zdGFudGlhdGUodGhpcy5idWxsZXQpO1xyXG4gICAgICAgICAgICB0aGlzLmJ1bGxldFBvb2wucHV0KGJ1bGxldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGFua1Bvb2wgPSBuZXcgY2MuTm9kZVBvb2woXCJUYW5rU2NyaXB0XCIpO1xyXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPHRoaXMubWF4Q291bnQ7ICsraSl7XHJcbiAgICAgICAgICAgIHZhciB0YW5rID0gY2MuaW5zdGFudGlhdGUodGhpcy50YW5rKTtcclxuICAgICAgICAgICAgdGhpcy50YW5rUG9vbC5wdXQodGFuayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFjYy5nYW1lRGF0YSl7XHJcbiAgICAgICAgICAgIGNjLmdhbWVEYXRhID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8v5Yid5aeL5YyWXHJcbiAgICAgICAgY2MuZ2FtZURhdGEudGVhbUlkID0gMDtcclxuICAgICAgICAvL+S4tOaXtlxyXG4gICAgICAgIGNjLmdhbWVEYXRhLnNpbmdsZSA9IHRydWU7XHJcblxyXG4gICAgICAgIC8v5Zyw5Zu+5YaF5Z2m5YWL5YiX6KGoXHJcbiAgICAgICAgY2MuZ2FtZURhdGEudGFua0xpc3QgPSBbXTtcclxuICAgICAgICAvL+WcsOWbvuWGheWtkOW8ueWIl+ihqFxyXG4gICAgICAgIGNjLmdhbWVEYXRhLmJ1bGxldExpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgLy/ojrflj5bnu4Tku7ZcclxuICAgICAgICB0aGlzLnRhbmtOb2RlID0gY2MuZmluZChcIi9DYW52YXMvTWFwXCIpO1xyXG4gICAgICAgIC8vdGhpcy50YW5rTm9kZSA9IGNjLmZpbmQoXCIvQ2FudmFzL21hcDEvbGF5ZXIwXCIpO1xyXG4gICAgICAgIC8v5Yqg5YWlcGxheWVyXHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSB0aGlzLmFkZFBsYXllclRhbmsoKTtcclxuICAgICAgICAvL+iOt+WPluWdpuWFi+aOp+WItue7hOS7tlxyXG4gICAgICAgIHRoaXMuX3BsYXllclRhbmtDdHJsID0gdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwiVGFua1NjcmlwdFwiKTsgXHJcblxyXG4gICAgICAgIC8v5ZCv5Yqo5a6a5pe25Zmo77yM5re75Yqg5Z2m5YWLXHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZSh0aGlzLmFkZEFJVGFuaywzLGNjLm1hY3JvLlJFUEVBVF9GT1JFVkVSLDEpO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICBpZih0aGlzLmRvdWJsZUZpcmUpe1xyXG4gICAgICAgICAgICBpZih0aGlzLl9wbGF5ZXJUYW5rQ3RybC5zdGFydEZpcmUodGhpcy5idWxsZXRQb29sKSl7XHJcbiAgICAgICAgICAgICAgICAvL+aSreaUvuWwhOWHu+mfs+aViFxyXG4gICAgICAgICAgICAgICAgLy9jYy5hdWRpb0VuZ2luZS5wbGF5KHRoaXMuX3BsYXllclRhbmtDdHJsLnNob290QXVkaW8sIGZhbHNlLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc2V0RG91YmxlRmlyZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZG91YmxlRmlyZSA9ICF0aGlzLmRvdWJsZUZpcmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5kb3VibGVGaXJlKXtcclxuICAgICAgICAgICAgdGhpcy5kb3VibGVGaXJlQnRuLm9wYWNpdHkgPSAyNDBcclxuICAgICAgICAgICAgLy90aGlzLmRvdWJsZUZpcmVCdG4uZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSB0aGlzLmRvdWJsZUZpcmVGcmFtZXNbMV07XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuZG91YmxlRmlyZUJ0bi5vcGFjaXR5ID0gMjU1XHJcbiAgICAgICAgICAgIC8vdGhpcy5kb3VibGVGaXJlQnRuLmdldENvbXBvbmVudChjYy5TcHJpdGUpLnNwcml0ZUZyYW1lID0gdGhpcy5kb3VibGVGaXJlRnJhbWVzWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgLy/ms6jlhozovpPlhaXkuovku7ZcclxuICAgIHJlZ2lzdGVySW5wdXRFdmVudDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuX2pveXN0aWNrQ3RybC5hZGRKb3lTdGlja1RvdWNoQ2hhbmdlTGlzdGVuZXIoZnVuY3Rpb24gKGFuZ2xlKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihhbmdsZSA9PSBzZWxmLmN1ckFuZ2xlICYmXHJcbiAgICAgICAgICAgICAgICAhc2VsZi5fcGxheWVyVGFua0N0cmwuc3RvcE1vdmUgKXtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWxmLmN1ckFuZ2xlID0gYW5nbGU7XHJcblxyXG4gICAgICAgICAgICBpZihhbmdsZSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAvL+W8gOWni+WJjei/m1xyXG4gICAgICAgICAgICAgICAgc2VsZi5fcGxheWVyVGFua0N0cmwudGFua01vdmVTdGFydChhbmdsZSk7XHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIC8v5YGc5q2i5YmN6L+bXHJcbiAgICAgICAgICAgICAgICBzZWxmLl9wbGF5ZXJUYW5rQ3RybC50YW5rTW92ZVN0b3AoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICAvL+aMiemUruaMieS4i1xyXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfRE9XTiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFuZ2xlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaChldmVudC5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkudzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGUgPSA5MDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkuczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGUgPSAyNzA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgY2MubWFjcm8uS0VZLmE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ2xlID0gMTgwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5kOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmdsZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZXZlbnQua2V5Q29kZSA9PSBjYy5tYWNyby5LRVkuayl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlQnRuQ2xpY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9wbGF5ZXJUYW5rQ3RybC50YW5rTW92ZVN0b3AoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGFuZ2xlIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W8gOWni+WJjei/m1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3BsYXllclRhbmtDdHJsLnRhbmtNb3ZlU3RhcnQoYW5nbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICAvL+aMiemUruaKrOi1t1xyXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXZlbnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lgZzmraLliY3ov5tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGV2ZW50LmtleUNvZGUgIT0gY2MubWFjcm8uS0VZLmspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3BsYXllclRhbmtDdHJsLnRhbmtNb3ZlU3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8v56Kw5pKe5qOA5rWLXHJcbiAgICBjb2xsaXNpb25UZXN0OiBmdW5jdGlvbihyZWN0LCBidWxsZXQpe1xyXG4gICAgICAgIC8v5Yik5pat5piv5ZCm56Kw5Yiw5Zyw5Zu+6L6555WMXHJcbiAgICAgICAgaWYgKHJlY3QueE1pbiA8PSAtdGhpcy5fY3VyTWFwU2l6ZS54LzIgfHwgcmVjdC54TWF4ID49IHRoaXMuX2N1ck1hcFNpemUueC8yIHx8XHJcblx0XHQgICAgcmVjdC55TWluIDw9IC10aGlzLl9jdXJNYXBTaXplLnkvMiB8fCByZWN0LnlNYXggPj0gdGhpcy5fY3VyTWFwU2l6ZS55LzIpe1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL+WIpOaWreaYr+WQpuaSnuWimVxyXG4gICAgICAgIC8v5bCG5Z2Q5qCH6L2s5o2i5Li65Zyw5Zu+5Z2Q5qCH57O7XHJcbiAgICAgICAgdmFyIE1pblkgPSB0aGlzLl9jdXJNYXBTaXplLnkvMiAtIHJlY3QueU1pbjtcclxuXHQgICAgdmFyIE1heFkgPSB0aGlzLl9jdXJNYXBTaXplLnkvMiAtIHJlY3QueU1heDtcclxuICAgICAgICB2YXIgTWluWCA9IHRoaXMuX2N1ck1hcFNpemUueC8yICsgcmVjdC54TWluO1xyXG4gICAgICAgIHZhciBNYXhYID0gdGhpcy5fY3VyTWFwU2l6ZS54LzIgKyByZWN0LnhNYXg7XHJcblxyXG4gICAgICAgIC8v6I635Y+W5Zub5Liq6KeS55qE6aG254K5XHJcbiAgICAgICAgdmFyIExlZnREb3duID0gY2MudjIoTWluWCwgTWluWSk7XHJcbiAgICAgICAgdmFyIFJpZ2h0RG93biA9IGNjLnYyKE1heFgsIE1pblkpO1xyXG4gICAgICAgIHZhciBMZWZ0VXAgPSBjYy52MihNaW5YLCBNYXhZKTtcclxuICAgICAgICB2YXIgUmlnaHRVcCA9IGNjLnYyKE1heFgsIE1heFkpO1xyXG5cclxuICAgICAgICAvL+iOt+WPluWbm+adoei+ueeahOS4reW/g+eCuVxyXG4gICAgICAgIHZhciBNaWREb3duID0gY2MudjIoTWluWCsoTWF4WC1NaW5YKS8yLCBNaW5ZKTtcclxuICAgICAgICB2YXIgTWlkVXAgPSBjYy52MihNaW5YKyhNYXhYLU1pblgpLzIsIE1heFkpO1xyXG4gICAgICAgIHZhciBNaWRMZWZ0ID0gY2MudjIoTWluWCwgTWluWSsoTWF4WS1NaW5ZKS8yKTtcclxuICAgICAgICB2YXIgTWlkUmlnaHQ9IGNjLnYyKE1heFgsIE1pblkrKE1heFktTWluWSkvMik7XHJcblxyXG4gICAgICAgIC8v5qOA5rWL56Kw5pKeXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbGxpc2lvblRlc3QoW0xlZnREb3duLFJpZ2h0RG93bixMZWZ0VXAsUmlnaHRVcCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWlkRG93bixNaWRVcCxNaWRMZWZ0LE1pZFJpZ2h0XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVsbGV0KTtcclxuICAgIH0sXHJcblxyXG4gICAgLy/lhoXpg6jnorDmkp7mo4DmtYvmlrnms5VcclxuICAgIF9jb2xsaXNpb25UZXN0OiBmdW5jdGlvbihwb2ludHMsIGJ1bGxldCl7XHJcbiAgICAgICAgdmFyIHBvaW50ID0gcG9pbnRzLnNoaWZ0KClcclxuICAgICAgICB2YXIgZ2lkID0gdGhpcy5tYXBMYXllcjAuZ2V0VGlsZUdJREF0KGNjLnYyKHBhcnNlSW50KHBvaW50LnggLyB0aGlzLl9jdXJNYXBUaWxlU2l6ZS53aWR0aCkscGFyc2VJbnQocG9pbnQueSAvIHRoaXMuX2N1ck1hcFRpbGVTaXplLmhlaWdodCkpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3RpbGVkTWFwRGF0YS5naWRUb1RpbGVUeXBlW2dpZF0gIT0gdGhpcy5fdGlsZWRNYXBEYXRhLnRpbGVUeXBlLnRpbGVOb25lICYmIFxyXG4gICAgICAgICAgICB0aGlzLl90aWxlZE1hcERhdGEuZ2lkVG9UaWxlVHlwZVtnaWRdICE9IHRoaXMuX3RpbGVkTWFwRGF0YS50aWxlVHlwZS50aWxlR3Jhc3Mpe1xyXG5cclxuICAgICAgICAgICAgaWYoYnVsbGV0ICYmIHRoaXMuX3RpbGVkTWFwRGF0YS5naWRUb1RpbGVUeXBlW2dpZF0gPT0gdGhpcy5fdGlsZWRNYXBEYXRhLnRpbGVUeXBlLnRpbGVXYWxsKXtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbnVtID0gcGFyc2VJbnQoTWF0aC5yYW5kb20oKSooMTMtMTArMSkrMTAsMTApO1xyXG4gXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hcExheWVyMC5zZXRUaWxlR0lEQXQobnVtLCBwYXJzZUludChwb2ludC54IC8gdGhpcy5fY3VyTWFwVGlsZVNpemUud2lkdGgpLHBhcnNlSW50KHBvaW50LnkgLyB0aGlzLl9jdXJNYXBUaWxlU2l6ZS5oZWlnaHQpLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGJ1bGxldCAmJiB0aGlzLl90aWxlZE1hcERhdGEuZ2lkVG9UaWxlVHlwZVtnaWRdID09IHRoaXMuX3RpbGVkTWFwRGF0YS50aWxlVHlwZS50aWxlS2luZyl7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXBMYXllcjAuc2V0VGlsZUdJREF0KDAsIHBhcnNlSW50KHBvaW50LnggLyB0aGlzLl9jdXJNYXBUaWxlU2l6ZS53aWR0aCkscGFyc2VJbnQocG9pbnQueSAvIHRoaXMuX2N1ck1hcFRpbGVTaXplLmhlaWdodCksIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lT3ZlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocG9pbnRzLmxlbmd0aD4wKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbGxpc2lvblRlc3QocG9pbnRzLCBidWxsZXQpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBnYW1lT3ZlcjogZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLmRvdWJsZUZpcmUgPSBmYWxzZTtcclxuICAgICAgICBmb3IodmFyIGk9MDsgaTxjYy5nYW1lRGF0YS50YW5rTGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIHZhciB0YW5rID0gY2MuZ2FtZURhdGEudGFua0xpc3RbaV1cclxuICAgICAgICAgICAgdmFyIHRhbmtDdHJsID0gdGFuay5nZXRDb21wb25lbnQoXCJUYW5rU2NyaXB0XCIpO1xyXG4gICAgICAgICAgICB0YW5rQ3RybC50YW5rU3RvcCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/lvLnnqpfosIPnlKhcclxuICAgICAgICBhbGVydC5zaG93LmNhbGwodGhpcywgXCLmuLjmiI/nu5PmnZ9cIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJTdGFydFNjZW5lXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+WKoOWFpeeOqeWutuWdpuWFi1xyXG4gICAgYWRkUGxheWVyVGFuazogZnVuY3Rpb24odGVhbSkge1xyXG4gICAgICAgIGlmKHRoaXMudGFua1Bvb2wuc2l6ZSgpPjApe1xyXG4gICAgICAgICAgICB2YXIgdGFuayA9IHRoaXMudGFua1Bvb2wuZ2V0KCk7XHJcbiAgICAgICAgICAgIHRhbmsuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSB0aGlzLnNwcml0ZUZyYW1lc1t0aGlzLnNwcml0ZUZyYW1lcy5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgIHRhbmsucG9zaXRpb24gPSB0aGlzLmJvcm5Qb3Nlc1t0aGlzLmJvcm5Qb3Nlcy5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgIHRhbmsuekluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIC8v6I635Y+W5Z2m5YWL5o6n5Yi257uE5Lu2XHJcbiAgICAgICAgICAgIHZhciB0YW5rQ3RybCA9IHRhbmsuZ2V0Q29tcG9uZW50KFwiVGFua1NjcmlwdFwiKTtcclxuICAgICAgICAgICAgLy/orr7nva7lnablhYvlsZ7mgKdcclxuICAgICAgICAgICAgdGFua0N0cmwudGFua1R5cGUgPSBUYW5rVHlwZS5QbGF5ZXI7XHJcbiAgICAgICAgICAgIHRhbmtDdHJsLnNwZWVkID0gdGhpcy50YW5rU3BlZWRzW3RoaXMudGFua1NwZWVkcy5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgIHRhbmtDdHJsLmZpcmVUaW1lID0gdGhpcy50YW5rRmlyZVRpbWVzW3RoaXMudGFua0ZpcmVUaW1lcy5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgIC8vdGFua0N0cmwuYmxvb2QgPSB0aGlzLnRhbmtCbG9vZHNbdGhpcy50YW5rQmxvb2RzLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgLy90YW5rQ3RybC5ibG9vZCA9IHRoaXMubGlmZSA7XHJcbiAgICAgICAgICAgIHRhbmtDdHJsLmJsb29kID0gMTtcclxuICAgICAgICAgICAgdGFua0N0cmwuZGllID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZighdGVhbSl7XHJcbiAgICAgICAgICAgICAgICBpZihjYy5nYW1lRGF0YS5zaW5nbGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIC8v5Y2V5py654mIXHJcbiAgICAgICAgICAgICAgICAgICAgdGFua0N0cmwudGVhbSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/lpKfkubHmlpdcclxuICAgICAgICAgICAgICAgICAgICB0YW5rQ3RybC50ZWFtID0gKytjYy5nYW1lRGF0YS50ZWFtSWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy/nu4TpmJ9cclxuICAgICAgICAgICAgICAgIHRhbmtDdHJsLnRlYW0gPSB0ZWFtO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0YW5rLnBhcmVudCA9IHRoaXMudGFua05vZGU7XHJcbiAgICAgICAgICAgIC8v5Yqg5Yiw5YiX6KGoXHJcbiAgICAgICAgICAgIGNjLmdhbWVEYXRhLnRhbmtMaXN0LnB1c2godGFuayk7XHJcbiAgICAgICAgICAgIHJldHVybiB0YW5rO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0sXHJcblxyXG4gICAgLy/liqDlhaVBSVxyXG4gICAgYWRkQUlUYW5rOiBmdW5jdGlvbihkdCwgdGVhbSkge1xyXG4gICAgICAgIGlmKHRoaXMudGFua1Bvb2wuc2l6ZSgpPjAgJiYgdGhpcy5tYXhDb3VudCA+IDApe1xyXG4gICAgICAgICAgICB2YXIgdGFuayA9IHRoaXMudGFua1Bvb2wuZ2V0KCk7XHJcbiAgICAgICAgICAgIHRhbmsuekluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KE1hdGgucmFuZG9tKCkqMywgMTApO1xyXG4gICAgICAgICAgICAvL+iOt+WPluWdpuWFi+aOp+WItue7hOS7tlxyXG4gICAgICAgICAgICB2YXIgdGFua0N0cmwgPSB0YW5rLmdldENvbXBvbmVudChcIlRhbmtTY3JpcHRcIik7XHJcbiAgICAgICAgICAgIC8v6K6+572u5Z2m5YWL5bGe5oCnXHJcbiAgICAgICAgICAgIHRhbmsuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSB0aGlzLnNwcml0ZUZyYW1lc1tpbmRleF07XHJcbiAgICAgICAgICAgIHRhbmsucG9zaXRpb24gPSB0aGlzLmJvcm5Qb3Nlc1tpbmRleF07XHJcblxyXG4gICAgICAgICAgICB0YW5rQ3RybC50YW5rVHlwZSA9IGluZGV4O1xyXG4gICAgICAgICAgICB0YW5rQ3RybC5zcGVlZCA9IHRoaXMudGFua1NwZWVkc1tpbmRleF07XHJcbiAgICAgICAgICAgIHRhbmtDdHJsLmZpcmVUaW1lID0gdGhpcy50YW5rRmlyZVRpbWVzW2luZGV4XTtcclxuICAgICAgICAgICAgdGFua0N0cmwuYmxvb2QgPSB0aGlzLnRhbmtCbG9vZHNbaW5kZXhdO1xyXG4gICAgICAgICAgICB0YW5rQ3RybC5kaWUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmKCF0ZWFtKXtcclxuICAgICAgICAgICAgICAgIGlmKGNjLmdhbWVEYXRhLnNpbmdsZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/ljZXmnLrniYhcclxuICAgICAgICAgICAgICAgICAgICB0YW5rQ3RybC50ZWFtID0gMTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+Wkp+S5seaWl1xyXG4gICAgICAgICAgICAgICAgICAgIHRhbmtDdHJsLnRlYW0gPSArK2NjLmdhbWVEYXRhLnRlYW1JZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy/nu4TpmJ9cclxuICAgICAgICAgICAgICAgIHRhbmtDdHJsLnRlYW0gPSB0ZWFtO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleCA9PSAwKXtcclxuICAgICAgICAgICAgICAgIHRhbmsuYW5nbGUgPSA5MDtcclxuICAgICAgICAgICAgfWVsc2UgaWYoaW5kZXggPT0gMSl7XHJcbiAgICAgICAgICAgICAgICB0YW5rLmFuZ2xlID0gMTgwO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZihpbmRleCA9PSAyKXtcclxuICAgICAgICAgICAgICAgIHRhbmsuYW5nbGUgPSAyNzA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGFua0N0cmwuY29sbGlzaW9uVGFuayh0YW5rLmdldEJvdW5kaW5nQm94KCkpKXtcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPHRoaXMuYm9yblBvc2VzLmxlbmd0aC0xOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIHRhbmsucG9zaXRpb24gPSB0aGlzLmJvcm5Qb3Nlc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZighdGFua0N0cmwuY29sbGlzaW9uVGFuayh0YW5rLmdldEJvdW5kaW5nQm94KCkpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0YW5rLnBhcmVudCA9IHRoaXMudGFua05vZGU7XHJcbiAgICAgICAgICAgIC8v5Yqg5Yiw5YiX6KGoXHJcbiAgICAgICAgICAgIGNjLmdhbWVEYXRhLnRhbmtMaXN0LnB1c2godGFuayk7XHJcbiAgICAgICAgICAgIHRoaXMubWF4Q291bnQgLS07XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICB0YW5rQm9vbTogZnVuY3Rpb24odGFuaykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGNjLmdhbWVEYXRhLnNpbmdsZSAmJiB0YW5rLmdldENvbXBvbmVudChcIlRhbmtTY3JpcHRcIikudGVhbSA9PSAwKXtcclxuICAgICAgICAgICAgLy8gdGhpcy5saWZlIC0tO1xyXG4gICAgICAgICAgICAvLyB0aGlzLmxpZmVOdW0uc3RyaW5nID0gdGhpcy5saWZlICsgXCJcIjtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmKHRoaXMubGlmZSA+IDApe1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5hZGRQbGF5ZXJUYW5rKCk7XHJcbiAgICAgICAgICAgIC8vIH1lbHNle1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5nYW1lT3ZlcigpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIHRhbmsuZ2V0Q29tcG9uZW50KFwiVGFua1NjcmlwdFwiKS5ibG9vZCA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHRhbmsucGFyZW50ID0gbnVsbDtcclxuICAgICAgICB0YW5rLmdldENvbXBvbmVudChcIlRhbmtTY3JpcHRcIikuZGllID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnRhbmtQb29sLnB1dCh0YW5rKTtcclxuXHJcbiAgICAgICAgICAgIHRhbmsucGFyZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgdGFuay5nZXRDb21wb25lbnQoXCJUYW5rU2NyaXB0XCIpLmRpZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMudGFua1Bvb2wucHV0KHRhbmspO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRhbmtOdW0gPSBOdW1iZXIodGhpcy5lbmVteU51bS5zdHJpbmcpIC0gMTtcclxuICAgICAgICAgICAgdGhpcy5lbmVteU51bS5zdHJpbmcgPSB0YW5rTnVtICsgXCJcIjtcclxuICAgICAgICAgICAgaWYodGFua051bSA9PSAwKXtcclxuICAgICAgICAgICAgICAgIGlmKGNjLmdhbWVEYXRhLmN1ckxldmVsIDwgMTApe1xyXG4gICAgICAgICAgICAgICAgICAgICsrY2MuZ2FtZURhdGEuY3VyTGV2ZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiQ2l0eVNjZW5lXCIrIGNjLmdhbWVEYXRhLmN1ckxldmVsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb3VibGVGaXJlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQuc2hvdy5jYWxsKHRoaXMsIFwi5L2g6LWi5LqGXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiU3RhcnRTY2VuZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy/lvIDngavmjInpkq7ngrnlh7tcclxuICAgIGZpcmVCdG5DbGljazogZnVuY3Rpb24oKXtcclxuICAgICAgICBpZih0aGlzLl9wbGF5ZXJUYW5rQ3RybC5zdGFydEZpcmUodGhpcy5idWxsZXRQb29sKSl7XHJcbiAgICAgICAgICAgIC8v5pKt5pS+5bCE5Ye76Z+z5pWIXHJcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXkodGhpcy5fcGxheWVyVGFua0N0cmwuc2hvb3RBdWRpbywgZmFsc2UsIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy/plIDmr4Hml7bosIPnlKhcclxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLmFkZEFJVGFuayx0aGlzKTtcclxuICAgIH0sXHJcbn0pO1xyXG4iXX0=
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
    this.node.opacity = 240;
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
        if (distance > 20) {
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
      if (distance > 20) {
        this.node.opacity = 255;
        this.joystickBar.setPosition(touchPos); //更新角度

        this._getAngle(touchPos);
      } else {
        this.node.opacity = 240; //摇杆恢复位置

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
    this.node.opacity = 240; //如果触摸类型为FOLLOW，离开触摸后隐藏

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcam95c3RpY2tcXHNjcmlwdHNcXEpveXN0aWNrQ3RybC5qcyJdLCJuYW1lcyI6WyJUb3VjaFR5cGUiLCJjYyIsIkVudW0iLCJERUZBVUxUIiwiRk9MTE9XIiwiRGlyZWN0aW9uVHlwZSIsIkZPVVIiLCJFSUdIVCIsIkFMTCIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImpveXN0aWNrQmFyIiwidHlwZSIsIk5vZGUiLCJqb3lzdGlja0JHIiwicmFkaXVzIiwidG91Y2hUeXBlIiwiZGlyZWN0aW9uVHlwZSIsImN1ckFuZ2xlIiwidmlzaWJsZSIsImRpc3RhbmNlIiwib25Mb2FkIiwid2lkdGgiLCJyZWdpc3RlcklucHV0IiwiaW5pdFBvcyIsIm5vZGUiLCJwb3NpdGlvbiIsImluaXRCYXJQb3MiLCJvcGFjaXR5IiwiYWRkSm95U3RpY2tUb3VjaENoYW5nZUxpc3RlbmVyIiwiY2FsbGJhY2siLCJhbmdsZUNoYW5nZSIsIm9uIiwiRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJvblRvdWNoQmVnYW4iLCJUT1VDSF9NT1ZFIiwib25Ub3VjaE1vdmVkIiwiVE9VQ0hfRU5EIiwib25Ub3VjaEVuZGVkIiwiVE9VQ0hfQ0FORUwiLCJldmVudCIsInRvdWNoUG9zIiwicGFyZW50IiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJnZXRMb2NhdGlvbiIsInNldFBvc2l0aW9uIiwic3ViIiwiVmVjMiIsIm1hZyIsIl9nZXRBbmdsZSIsIngiLCJNYXRoIiwiY29zIiwiX2dldFJhZGlhbiIsInkiLCJzaW4iLCJWZWMzIiwicG9pbnQiLCJfYW5nbGUiLCJmbG9vciIsIlBJIiwiX3VwZGF0ZUN1ckFuZ2xlIiwiY3VyWiIsInNxcnQiLCJwb3ciLCJfcmFkaWFuIiwiYWNvcyIsIl9mb3VyRGlyZWN0aW9ucyIsIl9laWdodERpcmVjdGlvbnMiLCJvbkRlc3Ryb3kiLCJvZmYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBSUEsU0FBUyxHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUNwQkMsRUFBQUEsT0FBTyxFQUFFLENBRFc7QUFFcEJDLEVBQUFBLE1BQU0sRUFBRTtBQUZZLENBQVIsQ0FBaEI7QUFLQSxJQUFJQyxhQUFhLEdBQUdKLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3hCSSxFQUFBQSxJQUFJLEVBQUUsQ0FEa0I7QUFFeEJDLEVBQUFBLEtBQUssRUFBRSxDQUZpQjtBQUd4QkMsRUFBQUEsR0FBRyxFQUFFO0FBSG1CLENBQVIsQ0FBcEI7QUFNQVAsRUFBRSxDQUFDUSxLQUFILENBQVM7QUFDTCxhQUFTUixFQUFFLENBQUNTLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLFdBQVcsRUFBRTtBQUNULGlCQUFTLElBREE7QUFFVEMsTUFBQUEsSUFBSSxFQUFFWixFQUFFLENBQUNhO0FBRkEsS0FETDtBQUlOO0FBQ0ZDLElBQUFBLFVBQVUsRUFBRTtBQUNSLGlCQUFTLElBREQ7QUFFUkYsTUFBQUEsSUFBSSxFQUFFWixFQUFFLENBQUNhO0FBRkQsS0FMSjtBQVFOO0FBQ0ZFLElBQUFBLE1BQU0sRUFBRSxDQVRBO0FBU0c7QUFDWEMsSUFBQUEsU0FBUyxFQUFFO0FBQ1AsaUJBQVNqQixTQUFTLENBQUNHLE9BRFo7QUFDcUI7QUFDNUJVLE1BQUFBLElBQUksRUFBRWI7QUFGQyxLQVZIO0FBY1JrQixJQUFBQSxhQUFhLEVBQUU7QUFDWCxpQkFBU2IsYUFBYSxDQUFDRyxHQURaO0FBQ2tCO0FBQzdCSyxNQUFBQSxJQUFJLEVBQUVSO0FBRkssS0FkUDtBQWtCUjtBQUNBYyxJQUFBQSxRQUFRLEVBQUU7QUFDTixpQkFBUyxDQURIO0FBRU5DLE1BQUFBLE9BQU8sRUFBRTtBQUZILEtBbkJGO0FBdUJSO0FBQ0FDLElBQUFBLFFBQVEsRUFBRTtBQUNOLGlCQUFTLENBREg7QUFFTkQsTUFBQUEsT0FBTyxFQUFFO0FBRkg7QUF4QkYsR0FIUDtBQWlDTDtBQUNBRSxFQUFBQSxNQUFNLEVBQUUsa0JBQVk7QUFDaEIsUUFBRyxLQUFLTixNQUFMLElBQWUsQ0FBbEIsRUFBb0I7QUFDaEIsV0FBS0EsTUFBTCxHQUFjLEtBQUtELFVBQUwsQ0FBZ0JRLEtBQWhCLEdBQXNCLENBQXBDO0FBQ0g7O0FBQ0QsU0FBS0MsYUFBTDtBQUNBLFNBQUtILFFBQUwsR0FBZ0IsQ0FBaEI7QUFDQSxTQUFLRixRQUFMLEdBQWdCLENBQWhCO0FBQ0EsU0FBS00sT0FBTCxHQUFlLEtBQUtDLElBQUwsQ0FBVUMsUUFBekI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLEtBQUtoQixXQUFMLENBQWlCZSxRQUFuQztBQUVBLFNBQUtELElBQUwsQ0FBVUcsT0FBVixHQUFvQixHQUFwQjtBQUNILEdBN0NJO0FBK0NMQyxFQUFBQSw4QkFBOEIsRUFBRSx3Q0FBU0MsUUFBVCxFQUFtQjtBQUMvQyxTQUFLQyxXQUFMLEdBQW1CRCxRQUFuQjtBQUNILEdBakRJO0FBbURMUCxFQUFBQSxhQUFhLEVBQUUseUJBQVc7QUFDdEIsU0FBS0UsSUFBTCxDQUFVTyxFQUFWLENBQWFoQyxFQUFFLENBQUNhLElBQUgsQ0FBUW9CLFNBQVIsQ0FBa0JDLFdBQS9CLEVBQTJDLEtBQUtDLFlBQWhELEVBQTZELElBQTdEO0FBQ0EsU0FBS1YsSUFBTCxDQUFVTyxFQUFWLENBQWFoQyxFQUFFLENBQUNhLElBQUgsQ0FBUW9CLFNBQVIsQ0FBa0JHLFVBQS9CLEVBQTBDLEtBQUtDLFlBQS9DLEVBQTRELElBQTVEO0FBQ0EsU0FBS1osSUFBTCxDQUFVTyxFQUFWLENBQWFoQyxFQUFFLENBQUNhLElBQUgsQ0FBUW9CLFNBQVIsQ0FBa0JLLFNBQS9CLEVBQXlDLEtBQUtDLFlBQTlDLEVBQTJELElBQTNEO0FBQ0EsU0FBS2QsSUFBTCxDQUFVTyxFQUFWLENBQWFoQyxFQUFFLENBQUNhLElBQUgsQ0FBUW9CLFNBQVIsQ0FBa0JPLFdBQS9CLEVBQTJDLEtBQUtELFlBQWhELEVBQTZELElBQTdEO0FBRUgsR0F6REk7QUEyRExKLEVBQUFBLFlBQVksRUFBRSxzQkFBU00sS0FBVCxFQUFnQjtBQUMxQjtBQUNBLFFBQUcsS0FBS3pCLFNBQUwsSUFBa0JqQixTQUFTLENBQUNJLE1BQS9CLEVBQ0E7QUFDSSxVQUFJdUMsUUFBUSxHQUFHLEtBQUtqQixJQUFMLENBQVVrQixNQUFWLENBQWlCQyxvQkFBakIsQ0FBc0NILEtBQUssQ0FBQ0ksV0FBTixFQUF0QyxDQUFmO0FBQ0EsV0FBS3BCLElBQUwsQ0FBVXFCLFdBQVYsQ0FBc0JKLFFBQXRCO0FBQ0EsYUFBTyxJQUFQO0FBQ0gsS0FMRCxNQU9BO0FBQ0k7QUFDQSxVQUFJQSxRQUFRLEdBQUcsS0FBS2pCLElBQUwsQ0FBVW1CLG9CQUFWLENBQStCSCxLQUFLLENBQUNJLFdBQU4sRUFBL0IsQ0FBZixDQUZKLENBR0k7QUFDQTs7QUFDQSxVQUFJekIsUUFBUSxHQUFHc0IsUUFBUSxDQUFDSyxHQUFULENBQWEvQyxFQUFFLENBQUNnRCxJQUFILENBQVEsQ0FBUixFQUFXLENBQVgsQ0FBYixFQUE0QkMsR0FBNUIsRUFBZixDQUxKLENBT0k7O0FBQ0EsVUFBRzdCLFFBQVEsR0FBRyxLQUFLTCxNQUFuQixFQUE0QjtBQUN4QixZQUFHSyxRQUFRLEdBQUMsRUFBWixFQUFlO0FBQ1gsZUFBS0ssSUFBTCxDQUFVRyxPQUFWLEdBQW9CLEdBQXBCO0FBQ0EsZUFBS2pCLFdBQUwsQ0FBaUJtQyxXQUFqQixDQUE2QkosUUFBN0IsRUFGVyxDQUdYOztBQUNBLGVBQUtRLFNBQUwsQ0FBZVIsUUFBZjtBQUNIOztBQUNELGVBQU8sSUFBUDtBQUNIO0FBQ0o7O0FBQ0QsV0FBTyxLQUFQO0FBQ0gsR0F2Rkk7QUF5RkxMLEVBQUFBLFlBQVksRUFBRSxzQkFBU0ksS0FBVCxFQUFnQjtBQUUxQjtBQUNBLFFBQUlDLFFBQVEsR0FBRyxLQUFLakIsSUFBTCxDQUFVbUIsb0JBQVYsQ0FBK0JILEtBQUssQ0FBQ0ksV0FBTixFQUEvQixDQUFmLENBSDBCLENBSTFCO0FBQ0E7O0FBQ0EsUUFBSXpCLFFBQVEsR0FBR3NCLFFBQVEsQ0FBQ0ssR0FBVCxDQUFhL0MsRUFBRSxDQUFDZ0QsSUFBSCxDQUFRLENBQVIsRUFBVyxDQUFYLENBQWIsRUFBNEJDLEdBQTVCLEVBQWYsQ0FOMEIsQ0FRMUI7O0FBQ0EsUUFBRyxLQUFLbEMsTUFBTCxJQUFlSyxRQUFsQixFQUEyQjtBQUN2QixVQUFHQSxRQUFRLEdBQUMsRUFBWixFQUFlO0FBQ1gsYUFBS0ssSUFBTCxDQUFVRyxPQUFWLEdBQW9CLEdBQXBCO0FBQ0EsYUFBS2pCLFdBQUwsQ0FBaUJtQyxXQUFqQixDQUE2QkosUUFBN0IsRUFGVyxDQUdYOztBQUNBLGFBQUtRLFNBQUwsQ0FBZVIsUUFBZjtBQUNILE9BTEQsTUFLTTtBQUNGLGFBQUtqQixJQUFMLENBQVVHLE9BQVYsR0FBb0IsR0FBcEIsQ0FERSxDQUVGOztBQUNBLGFBQUtqQixXQUFMLENBQWlCbUMsV0FBakIsQ0FBNkI5QyxFQUFFLENBQUNnRCxJQUFILENBQVEsQ0FBUixFQUFVLENBQVYsQ0FBN0I7QUFFQSxhQUFLOUIsUUFBTCxHQUFnQixJQUFoQixDQUxFLENBTUY7O0FBQ0EsWUFBRyxLQUFLYSxXQUFSLEVBQW9CO0FBQ2hCLGVBQUtBLFdBQUwsQ0FBaUIsS0FBS2IsUUFBdEI7QUFDSDtBQUVKO0FBQ0osS0FsQkQsTUFrQks7QUFDRDtBQUNBLFVBQUlpQyxDQUFDLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTLEtBQUtDLFVBQUwsQ0FBZ0JaLFFBQWhCLENBQVQsSUFBc0MsS0FBSzNCLE1BQW5EO0FBQ0EsVUFBSXdDLENBQUMsR0FBR0gsSUFBSSxDQUFDSSxHQUFMLENBQVMsS0FBS0YsVUFBTCxDQUFnQlosUUFBaEIsQ0FBVCxJQUFzQyxLQUFLM0IsTUFBbkQ7O0FBQ0EsVUFBRzJCLFFBQVEsQ0FBQ1MsQ0FBVCxHQUFXLENBQVgsSUFBZ0JULFFBQVEsQ0FBQ2EsQ0FBVCxHQUFXLENBQTlCLEVBQWdDO0FBQzVCQSxRQUFBQSxDQUFDLElBQUksQ0FBQyxDQUFOO0FBQ0gsT0FGRCxNQUVNLElBQUdiLFFBQVEsQ0FBQ1MsQ0FBVCxHQUFXLENBQVgsSUFBZ0JULFFBQVEsQ0FBQ2EsQ0FBVCxHQUFXLENBQTlCLEVBQWdDO0FBQ2xDQSxRQUFBQSxDQUFDLElBQUksQ0FBQyxDQUFOO0FBQ0g7O0FBRUQsV0FBSzVDLFdBQUwsQ0FBaUJtQyxXQUFqQixDQUE2QjlDLEVBQUUsQ0FBQ3lELElBQUgsQ0FBUU4sQ0FBUixFQUFXSSxDQUFYLEVBQWMsQ0FBZCxDQUE3QixFQVZDLENBV0Q7O0FBQ0EsV0FBS0wsU0FBTCxDQUFlUixRQUFmO0FBQ0g7QUFFSixHQW5JSTtBQW9JTEgsRUFBQUEsWUFBWSxFQUFFLHNCQUFTRSxLQUFULEVBQWdCO0FBQzFCLFNBQUtoQixJQUFMLENBQVVHLE9BQVYsR0FBb0IsR0FBcEIsQ0FEMEIsQ0FHMUI7O0FBQ0EsUUFBRyxLQUFLWixTQUFMLElBQWtCakIsU0FBUyxDQUFDSSxNQUEvQixFQUFzQztBQUNsQyxXQUFLc0IsSUFBTCxDQUFVQyxRQUFWLEdBQXFCLEtBQUtGLE9BQTFCO0FBQ0gsS0FOeUIsQ0FPMUI7OztBQUNBLFNBQUtiLFdBQUwsQ0FBaUJtQyxXQUFqQixDQUE2QixLQUFLbkIsVUFBbEM7QUFDQSxTQUFLVCxRQUFMLEdBQWdCLElBQWhCLENBVDBCLENBVTFCOztBQUNBLFFBQUcsS0FBS2EsV0FBUixFQUFvQjtBQUNoQixXQUFLQSxXQUFMLENBQWlCLEtBQUtiLFFBQXRCO0FBQ0g7QUFDSixHQWxKSTtBQXFKTDtBQUNBZ0MsRUFBQUEsU0FBUyxFQUFFLG1CQUFTUSxLQUFULEVBQ1g7QUFDSSxTQUFLQyxNQUFMLEdBQWVQLElBQUksQ0FBQ1EsS0FBTCxDQUFXLEtBQUtOLFVBQUwsQ0FBZ0JJLEtBQWhCLElBQXVCLEdBQXZCLEdBQTJCTixJQUFJLENBQUNTLEVBQTNDLENBQWY7O0FBRUEsUUFBR0gsS0FBSyxDQUFDUCxDQUFOLEdBQVEsQ0FBUixJQUFhTyxLQUFLLENBQUNILENBQU4sR0FBUSxDQUF4QixFQUEwQjtBQUN0QixXQUFLSSxNQUFMLEdBQWMsTUFBTSxLQUFLQSxNQUF6QjtBQUNILEtBRkQsTUFFTSxJQUFHRCxLQUFLLENBQUNQLENBQU4sR0FBUSxDQUFSLElBQWFPLEtBQUssQ0FBQ0gsQ0FBTixHQUFRLENBQXhCLEVBQTBCO0FBQzVCLFdBQUtJLE1BQUwsR0FBYyxNQUFNLEtBQUtBLE1BQXpCO0FBQ0gsS0FGSyxNQUVBLElBQUdELEtBQUssQ0FBQ1AsQ0FBTixHQUFRLENBQVIsSUFBYU8sS0FBSyxDQUFDSCxDQUFOLElBQVMsQ0FBekIsRUFBMkI7QUFDN0IsV0FBS0ksTUFBTCxHQUFjLEdBQWQ7QUFDSCxLQUZLLE1BRUEsSUFBR0QsS0FBSyxDQUFDUCxDQUFOLEdBQVEsQ0FBUixJQUFhTyxLQUFLLENBQUNILENBQU4sSUFBUyxDQUF6QixFQUEyQjtBQUM3QixXQUFLSSxNQUFMLEdBQWMsQ0FBZDtBQUNILEtBRkssTUFFQSxJQUFHRCxLQUFLLENBQUNQLENBQU4sSUFBUyxDQUFULElBQWNPLEtBQUssQ0FBQ0gsQ0FBTixHQUFRLENBQXpCLEVBQTJCO0FBQzdCLFdBQUtJLE1BQUwsR0FBYyxFQUFkO0FBQ0gsS0FGSyxNQUVBLElBQUdELEtBQUssQ0FBQ1AsQ0FBTixJQUFTLENBQVQsSUFBY08sS0FBSyxDQUFDSCxDQUFOLEdBQVEsQ0FBekIsRUFBMkI7QUFDN0IsV0FBS0ksTUFBTCxHQUFjLEdBQWQ7QUFDSDs7QUFDRCxTQUFLRyxlQUFMOztBQUNBLFdBQU8sS0FBS0gsTUFBWjtBQUNILEdBektJO0FBMktMO0FBQ0FMLEVBQUFBLFVBQVUsRUFBRSxvQkFBU0ksS0FBVCxFQUFnQjtBQUN4QixRQUFJSyxJQUFJLEdBQUdYLElBQUksQ0FBQ1ksSUFBTCxDQUFVWixJQUFJLENBQUNhLEdBQUwsQ0FBU1AsS0FBSyxDQUFDUCxDQUFmLEVBQWlCLENBQWpCLElBQW9CQyxJQUFJLENBQUNhLEdBQUwsQ0FBU1AsS0FBSyxDQUFDSCxDQUFmLEVBQWlCLENBQWpCLENBQTlCLENBQVg7O0FBQ0EsUUFBR1EsSUFBSSxJQUFFLENBQVQsRUFBVztBQUNQLFdBQUtHLE9BQUwsR0FBZSxDQUFmO0FBQ0gsS0FGRCxNQUVNO0FBQ0YsV0FBS0EsT0FBTCxHQUFlZCxJQUFJLENBQUNlLElBQUwsQ0FBVVQsS0FBSyxDQUFDUCxDQUFOLEdBQVFZLElBQWxCLENBQWY7QUFDSDs7QUFDRCxXQUFPLEtBQUtHLE9BQVo7QUFDSCxHQXBMSTtBQXNMTDtBQUNBSixFQUFBQSxlQUFlLEVBQUUsMkJBQ2pCO0FBQ0ksWUFBUSxLQUFLN0MsYUFBYjtBQUVJLFdBQUtiLGFBQWEsQ0FBQ0MsSUFBbkI7QUFDSSxhQUFLYSxRQUFMLEdBQWdCLEtBQUtrRCxlQUFMLEVBQWhCO0FBQ0E7O0FBQ0osV0FBS2hFLGFBQWEsQ0FBQ0UsS0FBbkI7QUFDSSxhQUFLWSxRQUFMLEdBQWdCLEtBQUttRCxnQkFBTCxFQUFoQjtBQUNBOztBQUNKLFdBQUtqRSxhQUFhLENBQUNHLEdBQW5CO0FBQ0ksYUFBS1csUUFBTCxHQUFnQixLQUFLeUMsTUFBckI7QUFDQTs7QUFDSjtBQUNJLGFBQUt6QyxRQUFMLEdBQWdCLElBQWhCO0FBQ0E7QUFiUixLQURKLENBZ0JJOzs7QUFDQSxRQUFHLEtBQUthLFdBQVIsRUFBb0I7QUFDaEIsV0FBS0EsV0FBTCxDQUFpQixLQUFLYixRQUF0QjtBQUNIO0FBQ0osR0E1TUk7QUErTUw7QUFDQWtELEVBQUFBLGVBQWUsRUFBRSwyQkFDakI7QUFDSSxRQUFHLEtBQUtULE1BQUwsSUFBZSxFQUFmLElBQXFCLEtBQUtBLE1BQUwsSUFBZSxHQUF2QyxFQUNBO0FBQ0ksYUFBTyxFQUFQO0FBQ0gsS0FIRCxNQUlLLElBQUcsS0FBS0EsTUFBTCxJQUFlLEdBQWYsSUFBc0IsS0FBS0EsTUFBTCxJQUFlLEdBQXhDLEVBQ0w7QUFDSSxhQUFPLEdBQVA7QUFDSCxLQUhJLE1BSUEsSUFBRyxLQUFLQSxNQUFMLElBQWUsR0FBZixJQUFzQixLQUFLQSxNQUFMLElBQWUsR0FBckMsSUFBNEMsS0FBS0EsTUFBTCxJQUFlLEdBQWYsSUFBc0IsS0FBS0EsTUFBTCxJQUFlLEdBQXBGLEVBQ0w7QUFDSSxhQUFPLEdBQVA7QUFDSCxLQUhJLE1BSUEsSUFBRyxLQUFLQSxNQUFMLElBQWUsR0FBZixJQUFzQixLQUFLQSxNQUFMLElBQWUsR0FBckMsSUFBNEMsS0FBS0EsTUFBTCxJQUFlLENBQWYsSUFBb0IsS0FBS0EsTUFBTCxJQUFlLEVBQWxGLEVBQ0w7QUFDSSxhQUFPLENBQVA7QUFDSDtBQUNKLEdBbE9JO0FBb09MO0FBQ0FVLEVBQUFBLGdCQUFnQixFQUFFLDRCQUNsQjtBQUNJLFFBQUcsS0FBS1YsTUFBTCxJQUFlLElBQWYsSUFBdUIsS0FBS0EsTUFBTCxJQUFlLEtBQXpDLEVBQ0E7QUFDSSxhQUFPLEVBQVA7QUFDSCxLQUhELE1BSUssSUFBRyxLQUFLQSxNQUFMLElBQWUsS0FBZixJQUF3QixLQUFLQSxNQUFMLElBQWUsS0FBMUMsRUFDTDtBQUNJLGFBQU8sR0FBUDtBQUNILEtBSEksTUFJQSxJQUFHLEtBQUtBLE1BQUwsSUFBZSxLQUFmLElBQXdCLEtBQUtBLE1BQUwsSUFBZSxHQUF2QyxJQUE4QyxLQUFLQSxNQUFMLElBQWUsS0FBZixJQUF3QixLQUFLQSxNQUFMLElBQWUsR0FBeEYsRUFDTDtBQUNJLGFBQU8sR0FBUDtBQUNILEtBSEksTUFJQSxJQUFHLEtBQUtBLE1BQUwsSUFBZSxHQUFmLElBQXNCLEtBQUtBLE1BQUwsSUFBZSxLQUFyQyxJQUE4QyxLQUFLQSxNQUFMLElBQWUsQ0FBZixJQUFvQixLQUFLQSxNQUFMLElBQWUsSUFBcEYsRUFDTDtBQUNJLGFBQU8sQ0FBUDtBQUNILEtBSEksTUFJQSxJQUFHLEtBQUtBLE1BQUwsSUFBZSxLQUFmLElBQXdCLEtBQUtBLE1BQUwsSUFBZSxLQUExQyxFQUNMO0FBQ0ksYUFBTyxHQUFQO0FBQ0gsS0FISSxNQUlBLElBQUcsS0FBS0EsTUFBTCxJQUFlLElBQWYsSUFBdUIsS0FBS0EsTUFBTCxJQUFlLElBQXpDLEVBQ0w7QUFDSSxhQUFPLEVBQVA7QUFDSCxLQUhJLE1BSUEsSUFBRyxLQUFLQSxNQUFMLElBQWUsS0FBZixJQUF3QixLQUFLQSxNQUFMLElBQWUsS0FBMUMsRUFDTDtBQUNJLGFBQU8sR0FBUDtBQUNILEtBSEksTUFJQSxJQUFHLEtBQUtBLE1BQUwsSUFBZSxLQUFmLElBQXdCLEtBQUtBLE1BQUwsSUFBZSxLQUExQyxFQUNMO0FBQ0ksYUFBTyxHQUFQO0FBQ0g7QUFDSixHQXZRSTtBQXlRTFcsRUFBQUEsU0FBUyxFQUFFLHFCQUNYO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFFQSxTQUFLN0MsSUFBTCxDQUFVOEMsR0FBVixDQUFjdkUsRUFBRSxDQUFDYSxJQUFILENBQVFvQixTQUFSLENBQWtCQyxXQUFoQyxFQUE0QyxLQUFLQyxZQUFqRCxFQUE4RCxJQUE5RDtBQUNBLFNBQUtWLElBQUwsQ0FBVThDLEdBQVYsQ0FBY3ZFLEVBQUUsQ0FBQ2EsSUFBSCxDQUFRb0IsU0FBUixDQUFrQkcsVUFBaEMsRUFBMkMsS0FBS0MsWUFBaEQsRUFBNkQsSUFBN0Q7QUFDQSxTQUFLWixJQUFMLENBQVU4QyxHQUFWLENBQWN2RSxFQUFFLENBQUNhLElBQUgsQ0FBUW9CLFNBQVIsQ0FBa0JLLFNBQWhDLEVBQTBDLEtBQUtDLFlBQS9DLEVBQTRELElBQTVEO0FBQ0g7QUFuUkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbnZhciBUb3VjaFR5cGUgPSBjYy5FbnVtKHtcclxuICAgIERFRkFVTFQ6IDAsXHJcbiAgICBGT0xMT1c6IDFcclxufSk7XHJcblxyXG52YXIgRGlyZWN0aW9uVHlwZSA9IGNjLkVudW0oe1xyXG4gICAgRk9VUjogMCxcclxuICAgIEVJR0hUOiAxLFxyXG4gICAgQUxMOiAyXHJcbn0pO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBqb3lzdGlja0Jhcjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXHJcbiAgICAgICAgfSwvL+aOp+adhlxyXG4gICAgICAgIGpveXN0aWNrQkc6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxyXG4gICAgICAgIH0sLy/mjqfmnYbog4zmma9cclxuICAgICAgICByYWRpdXM6IDAsIC8v5Y2K5b6EXHJcbiAgICAgICAgdG91Y2hUeXBlOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFRvdWNoVHlwZS5ERUZBVUxULCAvL+inpuaRuOexu+Wei1xyXG4gICAgICAgICAgICB0eXBlOiBUb3VjaFR5cGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRpcmVjdGlvblR5cGU6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogRGlyZWN0aW9uVHlwZS5BTEwsICAvL+aWueWQkeexu+Wei1xyXG4gICAgICAgICAgICB0eXBlOiBEaXJlY3Rpb25UeXBlXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL+W9k+WJjeinkuW6plxyXG4gICAgICAgIGN1ckFuZ2xlOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXHJcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL+W9k+WJjei3neemu1xyXG4gICAgICAgIGRpc3RhbmNlOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXHJcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmKHRoaXMucmFkaXVzID09IDApe1xyXG4gICAgICAgICAgICB0aGlzLnJhZGl1cyA9IHRoaXMuam95c3RpY2tCRy53aWR0aC8yXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnB1dCgpXHJcbiAgICAgICAgdGhpcy5kaXN0YW5jZSA9IDBcclxuICAgICAgICB0aGlzLmN1ckFuZ2xlID0gMFxyXG4gICAgICAgIHRoaXMuaW5pdFBvcyA9IHRoaXMubm9kZS5wb3NpdGlvblxyXG4gICAgICAgIHRoaXMuaW5pdEJhclBvcyA9IHRoaXMuam95c3RpY2tCYXIucG9zaXRpb25cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDI0MFxyXG4gICAgfSxcclxuXHJcbiAgICBhZGRKb3lTdGlja1RvdWNoQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5hbmdsZUNoYW5nZSA9IGNhbGxiYWNrO1xyXG4gICAgfSxcclxuXHJcbiAgICByZWdpc3RlcklucHV0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsdGhpcy5vblRvdWNoQmVnYW4sdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsdGhpcy5vblRvdWNoTW92ZWQsdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCx0aGlzLm9uVG91Y2hFbmRlZCx0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FORUwsdGhpcy5vblRvdWNoRW5kZWQsdGhpcyk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBvblRvdWNoQmVnYW46IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgLy/lpoLmnpzop6bmkbjnsbvlnovkuLpGT0xMT1fvvIzliJnmkYfmjqfmnYbnmoTkvY3nva7kuLrop6bmkbjkvY3nva4s6Kem5pG45byA5aeL5pe25YCZ546w5b2iXHJcbiAgICAgICAgaWYodGhpcy50b3VjaFR5cGUgPT0gVG91Y2hUeXBlLkZPTExPVylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB0b3VjaFBvcyA9IHRoaXMubm9kZS5wYXJlbnQuY29udmVydFRvTm9kZVNwYWNlQVIoZXZlbnQuZ2V0TG9jYXRpb24oKSlcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnNldFBvc2l0aW9uKHRvdWNoUG9zKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgLy/miorop6bmkbjngrnlnZDmoIfovazmjaLkuLrnm7jlr7nkuI7nm67moIfnmoTmqKHlnovlnZDmoIdcclxuICAgICAgICAgICAgdmFyIHRvdWNoUG9zID0gdGhpcy5ub2RlLmNvbnZlcnRUb05vZGVTcGFjZUFSKGV2ZW50LmdldExvY2F0aW9uKCkpXHJcbiAgICAgICAgICAgIC8v54K55LiO5ZyG5b+D55qE6Led56a7XHJcbiAgICAgICAgICAgIC8vdmFyIGRpc3RhbmNlID0gY2MucERpc3RhbmNlKHRvdWNoUG9zLCBjYy5WZWMyKDAsIDApKTtcclxuICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gdG91Y2hQb3Muc3ViKGNjLlZlYzIoMCwgMCkpLm1hZygpO1xyXG5cclxuICAgICAgICAgICAgLy/lpoLmnpzngrnkuI7lnIblv4Pot53nprvlsI/kuo7lnIbnmoTljYrlvoQs6L+U5ZuedHJ1ZVxyXG4gICAgICAgICAgICBpZihkaXN0YW5jZSA8IHRoaXMucmFkaXVzICkge1xyXG4gICAgICAgICAgICAgICAgaWYoZGlzdGFuY2U+MjApe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMjU1XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qb3lzdGlja0Jhci5zZXRQb3NpdGlvbih0b3VjaFBvcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/mm7TmlrDop5LluqZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRBbmdsZSh0b3VjaFBvcylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgb25Ub3VjaE1vdmVkOiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIC8v5oqK6Kem5pG454K55Z2Q5qCH6L2s5o2i5Li655u45a+55LiO55uu5qCH55qE5qih5Z6L5Z2Q5qCHXHJcbiAgICAgICAgdmFyIHRvdWNoUG9zID0gdGhpcy5ub2RlLmNvbnZlcnRUb05vZGVTcGFjZUFSKGV2ZW50LmdldExvY2F0aW9uKCkpXHJcbiAgICAgICAgLy/ngrnkuI7lnIblv4PnmoTot53nprtcXFxcXHJcbiAgICAgICAgLy92YXIgZGlzdGFuY2UgPSBjYy5wRGlzdGFuY2UodG91Y2hQb3MsIGNjLlZlYzIoMCwgMCkpO1xyXG4gICAgICAgIHZhciBkaXN0YW5jZSA9IHRvdWNoUG9zLnN1YihjYy5WZWMyKDAsIDApKS5tYWcoKTtcclxuXHJcbiAgICAgICAgLy/lpoLmnpzngrnkuI7lnIblv4Pot53nprvlsI/kuo7lnIbnmoTljYrlvoQs5o6n5p2G6Lef6ZqP6Kem5pG454K5XHJcbiAgICAgICAgaWYodGhpcy5yYWRpdXMgPj0gZGlzdGFuY2Upe1xyXG4gICAgICAgICAgICBpZihkaXN0YW5jZT4yMCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDI1NTtcclxuICAgICAgICAgICAgICAgIHRoaXMuam95c3RpY2tCYXIuc2V0UG9zaXRpb24odG91Y2hQb3MpO1xyXG4gICAgICAgICAgICAgICAgLy/mm7TmlrDop5LluqZcclxuICAgICAgICAgICAgICAgIHRoaXMuX2dldEFuZ2xlKHRvdWNoUG9zKVxyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDI0MFxyXG4gICAgICAgICAgICAgICAgLy/mkYfmnYbmgaLlpI3kvY3nva5cclxuICAgICAgICAgICAgICAgIHRoaXMuam95c3RpY2tCYXIuc2V0UG9zaXRpb24oY2MuVmVjMigwLDApKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1ckFuZ2xlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIC8v6LCD55So6KeS5bqm5Y+Y5YyW5Zue6LCDXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmFuZ2xlQ2hhbmdlKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuZ2xlQ2hhbmdlKHRoaXMuY3VyQW5nbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgLy/op6bmkbjnm5HlkKznm67moIdcclxuICAgICAgICAgICAgdmFyIHggPSBNYXRoLmNvcyh0aGlzLl9nZXRSYWRpYW4odG91Y2hQb3MpKSAqIHRoaXMucmFkaXVzO1xyXG4gICAgICAgICAgICB2YXIgeSA9IE1hdGguc2luKHRoaXMuX2dldFJhZGlhbih0b3VjaFBvcykpICogdGhpcy5yYWRpdXM7XHJcbiAgICAgICAgICAgIGlmKHRvdWNoUG9zLng+MCAmJiB0b3VjaFBvcy55PDApe1xyXG4gICAgICAgICAgICAgICAgeSAqPSAtMTtcclxuICAgICAgICAgICAgfWVsc2UgaWYodG91Y2hQb3MueDwwICYmIHRvdWNoUG9zLnk8MCl7XHJcbiAgICAgICAgICAgICAgICB5ICo9IC0xO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmpveXN0aWNrQmFyLnNldFBvc2l0aW9uKGNjLlZlYzMoeCwgeSwgMCkpO1xyXG4gICAgICAgICAgICAvL+abtOaWsOinkuW6plxyXG4gICAgICAgICAgICB0aGlzLl9nZXRBbmdsZSh0b3VjaFBvcylcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIG9uVG91Y2hFbmRlZDogZnVuY3Rpb24oZXZlbnQpIHsgICAgICAgIFxyXG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMjQwXHJcblxyXG4gICAgICAgIC8v5aaC5p6c6Kem5pG457G75Z6L5Li6Rk9MTE9X77yM56a75byA6Kem5pG45ZCO6ZqQ6JePXHJcbiAgICAgICAgaWYodGhpcy50b3VjaFR5cGUgPT0gVG91Y2hUeXBlLkZPTExPVyl7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IHRoaXMuaW5pdFBvc1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL+aRh+adhuaBouWkjeS9jee9rlxyXG4gICAgICAgIHRoaXMuam95c3RpY2tCYXIuc2V0UG9zaXRpb24odGhpcy5pbml0QmFyUG9zKTtcclxuICAgICAgICB0aGlzLmN1ckFuZ2xlID0gbnVsbFxyXG4gICAgICAgIC8v6LCD55So6KeS5bqm5Y+Y5YyW5Zue6LCDXHJcbiAgICAgICAgaWYodGhpcy5hbmdsZUNoYW5nZSl7XHJcbiAgICAgICAgICAgIHRoaXMuYW5nbGVDaGFuZ2UodGhpcy5jdXJBbmdsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy/orqHnrpfop5Lluqblubbov5Tlm55cclxuICAgIF9nZXRBbmdsZTogZnVuY3Rpb24ocG9pbnQpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fYW5nbGUgPSAgTWF0aC5mbG9vcih0aGlzLl9nZXRSYWRpYW4ocG9pbnQpKjE4MC9NYXRoLlBJKTtcclxuICAgICAgICBcclxuICAgICAgICBpZihwb2ludC54PjAgJiYgcG9pbnQueTwwKXtcclxuICAgICAgICAgICAgdGhpcy5fYW5nbGUgPSAzNjAgLSB0aGlzLl9hbmdsZTtcclxuICAgICAgICB9ZWxzZSBpZihwb2ludC54PDAgJiYgcG9pbnQueTwwKXtcclxuICAgICAgICAgICAgdGhpcy5fYW5nbGUgPSAzNjAgLSB0aGlzLl9hbmdsZTtcclxuICAgICAgICB9ZWxzZSBpZihwb2ludC54PDAgJiYgcG9pbnQueT09MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2FuZ2xlID0gMTgwO1xyXG4gICAgICAgIH1lbHNlIGlmKHBvaW50Lng+MCAmJiBwb2ludC55PT0wKXtcclxuICAgICAgICAgICAgdGhpcy5fYW5nbGUgPSAwO1xyXG4gICAgICAgIH1lbHNlIGlmKHBvaW50Lng9PTAgJiYgcG9pbnQueT4wKXtcclxuICAgICAgICAgICAgdGhpcy5fYW5nbGUgPSA5MDtcclxuICAgICAgICB9ZWxzZSBpZihwb2ludC54PT0wICYmIHBvaW50Lnk8MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2FuZ2xlID0gMjcwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl91cGRhdGVDdXJBbmdsZSgpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FuZ2xlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+iuoeeul+W8p+W6puW5tui/lOWbnlxyXG4gICAgX2dldFJhZGlhbjogZnVuY3Rpb24ocG9pbnQpIHtcclxuICAgICAgICB2YXIgY3VyWiA9IE1hdGguc3FydChNYXRoLnBvdyhwb2ludC54LDIpK01hdGgucG93KHBvaW50LnksMikpO1xyXG4gICAgICAgIGlmKGN1clo9PTApe1xyXG4gICAgICAgICAgICB0aGlzLl9yYWRpYW4gPSAwO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcmFkaWFuID0gTWF0aC5hY29zKHBvaW50LngvY3VyWik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yYWRpYW47XHJcbiAgICB9LFxyXG5cclxuICAgIC8v5pu05paw5b2T5YmN6KeS5bqmXHJcbiAgICBfdXBkYXRlQ3VyQW5nbGU6IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuZGlyZWN0aW9uVHlwZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uVHlwZS5GT1VSOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJBbmdsZSA9IHRoaXMuX2ZvdXJEaXJlY3Rpb25zKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb25UeXBlLkVJR0hUOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJBbmdsZSA9IHRoaXMuX2VpZ2h0RGlyZWN0aW9ucygpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uVHlwZS5BTEw6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1ckFuZ2xlID0gdGhpcy5fYW5nbGVcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VyQW5nbGUgPSBudWxsXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy/osIPnlKjop5Lluqblj5jljJblm57osINcclxuICAgICAgICBpZih0aGlzLmFuZ2xlQ2hhbmdlKXtcclxuICAgICAgICAgICAgdGhpcy5hbmdsZUNoYW5nZSh0aGlzLmN1ckFuZ2xlKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvL+Wbm+S4quaWueWQkeenu+WKqCjkuIrkuIvlt6blj7MpXHJcbiAgICBfZm91ckRpcmVjdGlvbnM6IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLl9hbmdsZSA+PSA0NSAmJiB0aGlzLl9hbmdsZSA8PSAxMzUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gOTBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLl9hbmdsZSA+PSAyMjUgJiYgdGhpcy5fYW5nbGUgPD0gMzE1KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIDI3MFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FuZ2xlIDw9IDIyNSAmJiB0aGlzLl9hbmdsZSA+PSAxODAgfHwgdGhpcy5fYW5nbGUgPj0gMTM1ICYmIHRoaXMuX2FuZ2xlIDw9IDE4MClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiAxODBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLl9hbmdsZSA8PSAzNjAgJiYgdGhpcy5fYW5nbGUgPj0gMzE1IHx8IHRoaXMuX2FuZ2xlID49IDAgJiYgdGhpcy5fYW5nbGUgPD0gNDUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gMFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy/lhavkuKrmlrnlkJHnp7vliqgo5LiK5LiL5bem5Y+z44CB5bem5LiK44CB5Y+z5LiK44CB5bem5LiL44CB5Y+z5LiLKVxyXG4gICAgX2VpZ2h0RGlyZWN0aW9uczogZnVuY3Rpb24oKVxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuX2FuZ2xlID49IDY3LjUgJiYgdGhpcy5fYW5nbGUgPD0gMTEyLjUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gOTBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLl9hbmdsZSA+PSAyNDcuNSAmJiB0aGlzLl9hbmdsZSA8PSAyOTIuNSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiAyNzBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLl9hbmdsZSA8PSAyMDIuNSAmJiB0aGlzLl9hbmdsZSA+PSAxODAgfHwgdGhpcy5fYW5nbGUgPj0gMTU3LjUgJiYgdGhpcy5fYW5nbGUgPD0gMTgwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE4MFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FuZ2xlIDw9IDM2MCAmJiB0aGlzLl9hbmdsZSA+PSAzMzcuNSB8fCB0aGlzLl9hbmdsZSA+PSAwICYmIHRoaXMuX2FuZ2xlIDw9IDIyLjUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FuZ2xlID49IDExMi41ICYmIHRoaXMuX2FuZ2xlIDw9IDE1Ny41KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIDEzNVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FuZ2xlID49IDIyLjUgJiYgdGhpcy5fYW5nbGUgPD0gNjcuNSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiA0NVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FuZ2xlID49IDIwMi41ICYmIHRoaXMuX2FuZ2xlIDw9IDI0Ny41KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIDIyNVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FuZ2xlID49IDI5Mi41ICYmIHRoaXMuX2FuZ2xlIDw9IDMzNy41KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIDMxNVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgLy9jYy5ldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5fbGlzdGVuZXIpO1xyXG4gICAgICAgIC8vIHRoaXMubm9kZS5vZmYoXCJ0b3VjaHN0YXJ0XCIpO1xyXG4gICAgICAgIC8vIHRoaXMubm9kZS5vZmYoXCJ0b3VjaG1vdmVcIik7XHJcbiAgICAgICAgLy8gdGhpcy5ub2RlLm9mZihcInRvdWNoZW5kXCIpO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULHRoaXMub25Ub3VjaEJlZ2FuLHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSx0aGlzLm9uVG91Y2hNb3ZlZCx0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCx0aGlzLm9uVG91Y2hFbmRlZCx0aGlzKTtcclxuICAgIH1cclxuXHJcbn0pO1xyXG4iXX0=
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQXNzZXRzTG9hZFNjcmlwdC5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsIm51bUxhYmVsIiwiTGFiZWwiLCJvbkxvYWQiLCJzZWxmIiwidXJscyIsImlkIiwidXJsIiwicmF3IiwiTG9hZGluZ0l0ZW1zIiwiY3JlYXRlIiwibG9hZGVyIiwiY29tcGxldGVkQ291bnQiLCJ0b3RhbENvdW50IiwiaXRlbSIsInByb2dyZXNzIiwidG9GaXhlZCIsImxvZyIsInN0cmluZyIsIk1hdGgiLCJhYnMiLCJjb25zb2xlIiwiZXJyb3JzIiwiaXRlbXMiLCJpIiwibGVuZ3RoIiwiZ2V0RXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLElBQUFBLFFBQVEsRUFBRUosRUFBRSxDQUFDSztBQVhMLEdBSFA7QUFrQkw7QUFDQUMsRUFBQUEsTUFBTSxFQUFFLGtCQUFZO0FBRWhCLFFBQUlDLElBQUksR0FBRyxJQUFYO0FBRUEsUUFBSUMsSUFBSSxHQUFHLENBQ1A7QUFDSUMsTUFBQUEsRUFBRSxFQUFFLE1BRFI7QUFFSUMsTUFBQUEsR0FBRyxFQUFFVixFQUFFLENBQUNVLEdBQUgsQ0FBT0MsR0FBUCxDQUFXLHNCQUFYO0FBRlQsS0FETyxDQUFYO0FBT0FYLElBQUFBLEVBQUUsQ0FBQ1ksWUFBSCxDQUFnQkMsTUFBaEIsQ0FBdUJiLEVBQUUsQ0FBQ2MsTUFBMUIsRUFBa0NOLElBQWxDLEVBQXdDLFVBQVVPLGNBQVYsRUFBMEJDLFVBQTFCLEVBQXNDQyxJQUF0QyxFQUE0QztBQUNoRixVQUFJQyxRQUFRLEdBQUcsQ0FBQyxNQUFNSCxjQUFOLEdBQXVCQyxVQUF4QixFQUFvQ0csT0FBcEMsQ0FBNEMsQ0FBNUMsQ0FBZjtBQUNBbkIsTUFBQUEsRUFBRSxDQUFDb0IsR0FBSCxDQUFPRixRQUFRLEdBQUcsR0FBbEI7QUFDQVgsTUFBQUEsSUFBSSxDQUFDSCxRQUFMLENBQWNpQixNQUFkLEdBQXVCQyxJQUFJLENBQUNDLEdBQUwsQ0FBU0wsUUFBVCxJQUFxQixHQUE1QztBQUNBTSxNQUFBQSxPQUFPLENBQUNKLEdBQVIsQ0FBWSxlQUFhSCxJQUFJLENBQUNQLEdBQTlCO0FBRUgsS0FORCxFQU1HLFVBQVVlLE1BQVYsRUFBa0JDLEtBQWxCLEVBQXlCO0FBQ3hCLFVBQUlELE1BQUosRUFBWTtBQUNSLGFBQUssSUFBSUUsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsTUFBTSxDQUFDRyxNQUEzQixFQUFtQyxFQUFFRCxDQUFyQyxFQUF3QztBQUNwQzNCLFVBQUFBLEVBQUUsQ0FBQ29CLEdBQUgsQ0FBTyxnQkFBZ0JLLE1BQU0sQ0FBQ0UsQ0FBRCxDQUF0QixHQUE0QixXQUE1QixHQUEwQ0QsS0FBSyxDQUFDRyxRQUFOLENBQWVKLE1BQU0sQ0FBQ0UsQ0FBRCxDQUFyQixDQUFqRDtBQUNIO0FBQ0osT0FKRCxNQUtLO0FBQ0RILFFBQUFBLE9BQU8sQ0FBQ0osR0FBUixDQUFZTSxLQUFLLENBQUNWLFVBQWxCO0FBRUg7QUFDSixLQWhCRDtBQW1CSCxHQWpESSxDQW1ETDtBQUNBO0FBRUE7O0FBdERLLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuICAgICAgICBudW1MYWJlbDogY2MuTGFiZWwsXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciB1cmxzID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogXCJ0YW5rXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvdGFuay5wbGlzdFwiKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgY2MuTG9hZGluZ0l0ZW1zLmNyZWF0ZShjYy5sb2FkZXIsIHVybHMsIGZ1bmN0aW9uIChjb21wbGV0ZWRDb3VudCwgdG90YWxDb3VudCwgaXRlbSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvZ3Jlc3MgPSAoMTAwICogY29tcGxldGVkQ291bnQgLyB0b3RhbENvdW50KS50b0ZpeGVkKDIpO1xyXG4gICAgICAgICAgICBjYy5sb2cocHJvZ3Jlc3MgKyAnJScpO1xyXG4gICAgICAgICAgICBzZWxmLm51bUxhYmVsLnN0cmluZyA9IE1hdGguYWJzKHByb2dyZXNzKSArICclJztcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT09XCIraXRlbS51cmwpO1xyXG5cclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3JzLCBpdGVtcykge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZygnRXJyb3IgdXJsOiAnICsgZXJyb3JzW2ldICsgJywgZXJyb3I6ICcgKyBpdGVtcy5nZXRFcnJvcihlcnJvcnNbaV0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW1zLnRvdGFsQ291bnQpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iXX0=
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcbWlncmF0aW9uXFx1c2VfdjIuMC54X2NjLlRvZ2dsZV9ldmVudC5qcyJdLCJuYW1lcyI6WyJjYyIsIlRvZ2dsZSIsIl90cmlnZ2VyRXZlbnRJblNjcmlwdF9jaGVjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7QUFZQSxJQUFJQSxFQUFFLENBQUNDLE1BQVAsRUFBZTtBQUNYO0FBQ0E7QUFDQUQsRUFBQUEsRUFBRSxDQUFDQyxNQUFILENBQVVDLDJCQUFWLEdBQXdDLElBQXhDO0FBQ0giLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIFRoaXMgc2NyaXB0IGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGJ5IENvY29zIENyZWF0b3IgYW5kIGlzIG9ubHkgY29tcGF0aWJsZSB3aXRoIHByb2plY3RzIHByaW9yIHRvIHYyLjEuMC5cclxuICogWW91IGRvIG5vdCBuZWVkIHRvIG1hbnVhbGx5IGFkZCB0aGlzIHNjcmlwdCBpbiBhbnkgb3RoZXIgcHJvamVjdC5cclxuICogSWYgeW91IGRvbid0IHVzZSBjYy5Ub2dnbGUgaW4geW91ciBwcm9qZWN0LCB5b3UgY2FuIGRlbGV0ZSB0aGlzIHNjcmlwdCBkaXJlY3RseS5cclxuICogSWYgeW91ciBwcm9qZWN0IGlzIGhvc3RlZCBpbiBWQ1Mgc3VjaCBhcyBnaXQsIHN1Ym1pdCB0aGlzIHNjcmlwdCB0b2dldGhlci5cclxuICpcclxuICog5q2k6ISa5pys55SxIENvY29zIENyZWF0b3Ig6Ieq5Yqo55Sf5oiQ77yM5LuF55So5LqO5YW85a65IHYyLjEuMCDkuYvliY3niYjmnKznmoTlt6XnqIvvvIxcclxuICog5L2g5peg6ZyA5Zyo5Lu75L2V5YW25a6D6aG555uu5Lit5omL5Yqo5re75Yqg5q2k6ISa5pys44CCXHJcbiAqIOWmguaenOS9oOeahOmhueebruS4reayoeeUqOWIsCBUb2dnbGXvvIzlj6/nm7TmjqXliKDpmaTor6XohJrmnKzjgIJcclxuICog5aaC5p6c5L2g55qE6aG555uu5pyJ5omY566h5LqOIGdpdCDnrYnniYjmnKzlupPvvIzor7flsIbmraTohJrmnKzkuIDlubbkuIrkvKDjgIJcclxuICovXHJcblxyXG5pZiAoY2MuVG9nZ2xlKSB7XHJcbiAgICAvLyBXaGV0aGVyIHRoZSAndG9nZ2xlJyBhbmQgJ2NoZWNrRXZlbnRzJyBldmVudHMgYXJlIGZpcmVkIHdoZW4gJ3RvZ2dsZS5jaGVjaygpIC8gdG9nZ2xlLnVuY2hlY2soKScgaXMgY2FsbGVkIGluIHRoZSBjb2RlXHJcbiAgICAvLyDlnKjku6PnoIHkuK3osIPnlKggJ3RvZ2dsZS5jaGVjaygpIC8gdG9nZ2xlLnVuY2hlY2soKScg5pe25piv5ZCm6Kem5Y+RICd0b2dnbGUnIOS4jiAnY2hlY2tFdmVudHMnIOS6i+S7tlxyXG4gICAgY2MuVG9nZ2xlLl90cmlnZ2VyRXZlbnRJblNjcmlwdF9jaGVjayA9IHRydWU7XHJcbn1cclxuIl19
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQmxhc3RTY3JpcHQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJvbkxvYWQiLCJwbGF5RmluaXNoIiwibm9kZSIsInBhcmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFLENBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWUSxHQUhQO0FBZ0JMO0FBQ0FDLEVBQUFBLE1BQU0sRUFBRSxrQkFBWSxDQUVuQixDQW5CSTtBQXFCTEMsRUFBQUEsVUFBVSxFQUFFLHNCQUFZO0FBQ3BCLFNBQUtDLElBQUwsQ0FBVUMsTUFBVixHQUFtQixJQUFuQjtBQUNILEdBdkJJLENBeUJMO0FBQ0E7QUFFQTs7QUE1QkssQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvLyBmb286IHtcclxuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XHJcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxyXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIC8vIC4uLlxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgcGxheUZpbmlzaDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5wYXJlbnQgPSBudWxsO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIl19
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQnVsbGV0U2NyaXB0LmpzIl0sIm5hbWVzIjpbIlRhbmtUeXBlIiwicmVxdWlyZSIsInRhbmtUeXBlIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJzcGVlZCIsImNhbXAiLCJvbkxvYWQiLCJfY2l0eUN0cmwiLCJmaW5kIiwiZ2V0Q29tcG9uZW50IiwicmV1c2UiLCJidWxsZXRQb29sIiwiYnVsbGV0TW92ZSIsImFuZ2xlIiwibm9kZSIsIm9mZnNldCIsInYyIiwiTWF0aCIsImZsb29yIiwiY29zIiwiUEkiLCJzaW4iLCJjZWlsIiwiYnVsbGV0Qm9vbSIsInBhcmVudCIsInB1dCIsInVwZGF0ZSIsImR0IiwieCIsInkiLCJyZWN0IiwiZ2V0Qm91bmRpbmdCb3giLCJjb2xsaXNpb25UZXN0IiwiY29sbGlzaW9uVGFuayIsImkiLCJnYW1lRGF0YSIsInRhbmtMaXN0IiwibGVuZ3RoIiwidGFuayIsInRhbmtDdHJsIiwidGVhbSIsImRpZSIsImJvdW5kaW5nQm94IiwiaW50ZXJzZWN0cyIsImJsb29kIiwiYm9vbSIsInR1cm5HcmVlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxRQUFRLEdBQUdDLE9BQU8sQ0FBQyxVQUFELENBQVAsQ0FBb0JDLFFBQW5DOztBQUVBQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxJQUFBQSxLQUFLLEVBQUUsRUFYQztBQVlSQyxJQUFBQSxJQUFJLEVBQUc7QUFaQyxHQUhQO0FBbUJMO0FBQ0FDLEVBQUFBLE1BQU0sRUFBRSxrQkFBWTtBQUNoQixTQUFLQyxTQUFMLEdBQWlCUCxFQUFFLENBQUNRLElBQUgsQ0FBUSxhQUFSLEVBQXVCQyxZQUF2QixDQUFvQyxZ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LENBQXFCRixDQUFyQixDQUFYO0FBQ0EsVUFBSUssUUFBUSxHQUFHRCxJQUFJLENBQUM3QixZQUFMLENBQWtCLFlBQWxCLENBQWY7O0FBQ0EsVUFBRzhCLFFBQVEsQ0FBQ0MsSUFBVCxJQUFpQixLQUFLMUIsSUFBTCxDQUFVVCxJQUEzQixJQUFtQ2tDLFFBQVEsQ0FBQ0UsR0FBL0MsRUFBbUQ7QUFDL0M7QUFDQTtBQUNIOztBQUNELFVBQUlDLFdBQVcsR0FBR0osSUFBSSxDQUFDUCxjQUFMLEVBQWxCOztBQUNBLFVBQUdELElBQUksQ0FBQ2EsVUFBTCxDQUFnQkQsV0FBaEIsQ0FBSCxFQUFnQztBQUM1QixZQUFHLEVBQUVILFFBQVEsQ0FBQ0ssS0FBWCxJQUFvQixDQUF2QixFQUF5QjtBQUNyQkwsVUFBQUEsUUFBUSxDQUFDTSxJQUFUO0FBQ0gsU0FGRCxNQUdJO0FBQ0FOLFVBQUFBLFFBQVEsQ0FBQ08sU0FBVCxDQUFtQlAsUUFBUSxDQUFDSyxLQUE1QjtBQUNIOztBQUNELGVBQU8sSUFBUDtBQUNIO0FBQ0o7O0FBQ0QsV0FBTyxLQUFQO0FBQ0g7QUF4RkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFRhbmtUeXBlID0gcmVxdWlyZShcIlRhbmtEYXRhXCIpLnRhbmtUeXBlO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvLyBmb286IHtcclxuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XHJcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxyXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIC8vIC4uLlxyXG4gICAgICAgIHNwZWVkOiAyMCxcclxuICAgICAgICBjYW1wIDogMCxcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fY2l0eUN0cmwgPSBjYy5maW5kKFwiL0NpdHlTY3JpcHRcIikuZ2V0Q29tcG9uZW50KFwiQ2l0eVNjcmlwdFwiKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy/lr7nosaHmsaBnZXTojrflj5blr7nosaHmmK/kvJrosIPnlKjmraTmlrnms5VcclxuICAgIHJldXNlOiBmdW5jdGlvbiAoYnVsbGV0UG9vbCkge1xyXG4gICAgICAgIHRoaXMuYnVsbGV0UG9vbCA9IGJ1bGxldFBvb2w7IC8vIGdldCDkuK3kvKDlhaXnmoTlrZDlvLnlr7nosaHmsaBcclxuICAgIH0sXHJcblxyXG4gICAgLy/lrZDlvLnnp7vliqhcclxuICAgIGJ1bGxldE1vdmU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvL+WBj+enu1xyXG4gICAgICAgIHZhciBhbmdsZSA9IHRoaXMubm9kZS5hbmdsZSArIDkwO1xyXG4gICAgICAgIGlmKGFuZ2xlPT0wIHx8IGFuZ2xlPT0xODAgfHwgYW5nbGU9PTkwKXtcclxuICAgICAgICAgICAgdGhpcy5vZmZzZXQgPSBjYy52MihNYXRoLmZsb29yKE1hdGguY29zKE1hdGguUEkvMTgwKmFuZ2xlKSksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5zaW4oTWF0aC5QSS8xODAqYW5nbGUpKSk7XHJcbiAgICAgICAgfWVsc2UgaWYoYW5nbGU9PTI3MCl7XHJcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gY2MudjIoTWF0aC5jZWlsKE1hdGguY29zKE1hdGguUEkvMTgwKmFuZ2xlKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnNpbihNYXRoLlBJLzE4MCphbmdsZSkpKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gY2MudjIoTWF0aC5jb3MoTWF0aC5QSS8xODAqYW5nbGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguc2luKE1hdGguUEkvMTgwKmFuZ2xlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL+WtkOW8ueeIhueCuFxyXG4gICAgYnVsbGV0Qm9vbTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuYnVsbGV0UG9vbC5wdXQodGhpcy5ub2RlKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgLy/np7vliqhcclxuICAgICAgICB0aGlzLm5vZGUueCArPSB0aGlzLm9mZnNldC54KnRoaXMuc3BlZWQqZHQ7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgKz0gdGhpcy5vZmZzZXQueSp0aGlzLnNwZWVkKmR0O1xyXG5cclxuICAgICAgICAvL+ajgOa1i+eisOaSnlxyXG4gICAgICAgIHZhciByZWN0ID0gdGhpcy5ub2RlLmdldEJvdW5kaW5nQm94KCk7XHJcbiAgICAgICAgaWYodGhpcy5fY2l0eUN0cmwuY29sbGlzaW9uVGVzdChyZWN0LCB0cnVlKVxyXG4gICAgICAgICAgICB8fCB0aGlzLmNvbGxpc2lvblRhbmsocmVjdCkpe1xyXG4gICAgICAgICAgICAvL+WtkOW8ueeIhueCuFxyXG4gICAgICAgICAgICB0aGlzLmJ1bGxldEJvb20oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvL+WIpOaWreS4juWdpuWFi+eisOaSnlxyXG4gICAgY29sbGlzaW9uVGFuazogZnVuY3Rpb24ocmVjdCkge1xyXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGNjLmdhbWVEYXRhLnRhbmtMaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgdmFyIHRhbmsgPSBjYy5nYW1lRGF0YS50YW5rTGlzdFtpXVxyXG4gICAgICAgICAgICB2YXIgdGFua0N0cmwgPSB0YW5rLmdldENvbXBvbmVudChcIlRhbmtTY3JpcHRcIik7XHJcbiAgICAgICAgICAgIGlmKHRhbmtDdHJsLnRlYW0gPT0gdGhpcy5ub2RlLmNhbXAgfHwgdGFua0N0cmwuZGllKXtcclxuICAgICAgICAgICAgICAgIC8v5ZCM5LiA6Zif5LiN5LqS55u45Lyk5a6zXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYm91bmRpbmdCb3ggPSB0YW5rLmdldEJvdW5kaW5nQm94KCk7XHJcbiAgICAgICAgICAgIGlmKHJlY3QuaW50ZXJzZWN0cyhib3VuZGluZ0JveCkpe1xyXG4gICAgICAgICAgICAgICAgaWYoLS10YW5rQ3RybC5ibG9vZCA8PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICB0YW5rQ3RybC5ib29tKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHRhbmtDdHJsLnR1cm5HcmVlbih0YW5rQ3RybC5ibG9vZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxufSk7XHJcbiJdfQ==
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
    if (cc.gameData.curLevel <= 1) {
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
    this.curLevelLabel.string = "Round " + cc.gameData.curLevel;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQ2hvaWNlU2NyaXB0LmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiY3VyTGV2ZWxMYWJlbCIsIkxhYmVsIiwib25Mb2FkIiwiZ2FtZURhdGEiLCJjdXJMZXZlbCIsInVwZGF0ZUxldmVsTGFiZWwiLCJvblBsYXkiLCJzZWxmIiwibG9hZGVyIiwib25Qcm9ncmVzcyIsImNvbXBsZXRlZENvdW50IiwidG90YWxDb3VudCIsIml0ZW0iLCJjb25zb2xlIiwibG9nIiwiZGlyZWN0b3IiLCJwcmVsb2FkU2NlbmUiLCJhc3NldHMiLCJlcnJvciIsImxvYWRTY2VuZSIsIm9uVXAiLCJvbk5leHQiLCJzdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLElBQUFBLGFBQWEsRUFBQ0osRUFBRSxDQUFDSztBQVhULEdBSFA7QUFrQkw7QUFDQUMsRUFBQUEsTUFBTSxFQUFFLGtCQUFZO0FBQ2hCTixJQUFBQSxFQUFFLENBQUNPLFFBQUgsR0FBYyxFQUFkO0FBQ0FQLElBQUFBLEVBQUUsQ0FBQ08sUUFBSCxDQUFZQyxRQUFaLEdBQXVCLENBQXZCO0FBQ0EsU0FBS0MsZ0JBQUw7QUFDSCxHQXZCSTtBQTBCTEMsRUFBQUEsTUFBTSxFQUFFLGtCQUFZO0FBQ2hCLFFBQUlDLElBQUksR0FBRyxJQUFYOztBQUNBWCxJQUFBQSxFQUFFLENBQUNZLE1BQUgsQ0FBVUMsVUFBVixHQUF1QixVQUFVQyxjQUFWLEVBQTBCQyxVQUExQixFQUFzQ0MsSUFBdEMsRUFBMkM7QUFDOURDLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSixjQUFjLEdBQUMsR0FBZixHQUFtQkMsVUFBL0I7QUFDSCxLQUZEOztBQUdBZixJQUFBQSxFQUFFLENBQUNtQixRQUFILENBQVlDLFlBQVosQ0FBeUIsY0FBYXBCLEVBQUUsQ0FBQ08sUUFBSCxDQUFZQyxRQUFsRCxFQUE0RCxVQUFVYSxNQUFWLEVBQWtCQyxLQUFsQixFQUF3QjtBQUNoRjtBQUNBdEIsTUFBQUEsRUFBRSxDQUFDbUIsUUFBSCxDQUFZSSxTQUFaLENBQXNCLGNBQWF2QixFQUFFLENBQUNPLFFBQUgsQ0FBWUMsUUFBL0M7QUFDSCxLQUhEO0FBSUgsR0FuQ0k7QUFxQ0xnQixFQUFBQSxJQUFJLEVBQUUsZ0JBQVk7QUFDZCxRQUFHeEIsRUFBRSxDQUFDTyxRQUFILENBQVlDLFFBQVosSUFBd0IsQ0FBM0IsRUFBNkI7QUFDekI7QUFDSDs7QUFDRFIsSUFBQUEsRUFBRSxDQUFDTyxRQUFILENBQVlDLFFBQVosSUFBd0IsQ0FBeEI7QUFDQSxTQUFLQyxnQkFBTDtBQUNILEdBM0NJO0FBNkNMZ0IsRUFBQUEsTUFBTSxFQUFFLGtCQUFZO0FBQ2hCLFFBQUd6QixFQUFFLENBQUNPLFFBQUgsQ0FBWUMsUUFBWixHQUFxQixDQUFyQixHQUF5QixFQUE1QixFQUErQjtBQUMzQjtBQUNIOztBQUNEUixJQUFBQSxFQUFFLENBQUNPLFFBQUgsQ0FBWUMsUUFBWixJQUF3QixDQUF4QjtBQUNBLFNBQUtDLGdCQUFMO0FBQ0gsR0FuREk7QUFxRExBLEVBQUFBLGdCQUFnQixFQUFFLDRCQUFZO0FBQzFCLFNBQUtMLGFBQUwsQ0FBbUJzQixNQUFuQixHQUE0QixXQUFTMUIsRUFBRSxDQUFDTyxRQUFILENBQVlDLFFBQWpEO0FBQ0gsR0F2REksQ0EwREw7QUFDQTtBQUVBOztBQTdESyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIGZvbzoge1xyXG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcclxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgLy8gLi4uXHJcbiAgICAgICAgY3VyTGV2ZWxMYWJlbDpjYy5MYWJlbCxcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2MuZ2FtZURhdGEgPSB7fTtcclxuICAgICAgICBjYy5nYW1lRGF0YS5jdXJMZXZlbCA9IDE7XHJcbiAgICAgICAgdGhpcy51cGRhdGVMZXZlbExhYmVsKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIFxyXG4gICAgb25QbGF5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGNjLmxvYWRlci5vblByb2dyZXNzID0gZnVuY3Rpb24gKGNvbXBsZXRlZENvdW50LCB0b3RhbENvdW50LCBpdGVtKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY29tcGxldGVkQ291bnQrXCIvXCIrdG90YWxDb3VudCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjYy5kaXJlY3Rvci5wcmVsb2FkU2NlbmUoXCJDaXR5U2NlbmVcIisgY2MuZ2FtZURhdGEuY3VyTGV2ZWwsIGZ1bmN0aW9uIChhc3NldHMsIGVycm9yKXtcclxuICAgICAgICAgICAgLy/ot7PovazliLDmuLjmiI/nlYzpnaJcclxuICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiQ2l0eVNjZW5lXCIrIGNjLmdhbWVEYXRhLmN1ckxldmVsKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgb25VcDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmKGNjLmdhbWVEYXRhLmN1ckxldmVsIDw9IDEpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNjLmdhbWVEYXRhLmN1ckxldmVsIC09IDE7IFxyXG4gICAgICAgIHRoaXMudXBkYXRlTGV2ZWxMYWJlbCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbk5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZihjYy5nYW1lRGF0YS5jdXJMZXZlbCsxID4gMTApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNjLmdhbWVEYXRhLmN1ckxldmVsICs9IDE7IFxyXG4gICAgICAgIHRoaXMudXBkYXRlTGV2ZWxMYWJlbCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cGRhdGVMZXZlbExhYmVsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJMZXZlbExhYmVsLnN0cmluZyA9IFwiUm91bmQgXCIrY2MuZ2FtZURhdGEuY3VyTGV2ZWw7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIl19
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcTm9Ub3VjaFNjcmlwdC5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsIm9uTG9hZCIsInNlbGYiLCJfbGlzdGVuZXIiLCJldmVudE1hbmFnZXIiLCJhZGRMaXN0ZW5lciIsImV2ZW50IiwiRXZlbnRMaXN0ZW5lciIsIlRPVUNIX09ORV9CWV9PTkUiLCJvblRvdWNoQmVnYW4iLCJ0b3VjaCIsInN0b3BQcm9wYWdhdGlvbiIsIm9uVG91Y2hNb3ZlZCIsIm9uVG91Y2hFbmRlZCIsIm5vZGUiLCJzeXN0ZW1FdmVudCIsIm9uIiwiU3lzdGVtRXZlbnQiLCJFdmVudFR5cGUiLCJLRVlfRE9XTiIsIktFWV9VUCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFLENBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWUSxHQUhQO0FBZ0JMO0FBQ0FDLEVBQUFBLE1BQU0sRUFBRSxrQkFBWTtBQUVoQixRQUFJQyxJQUFJLEdBQUcsSUFBWCxDQUZnQixDQUdoQjs7QUFDQSxTQUFLQyxTQUFMLEdBQWlCTixFQUFFLENBQUNPLFlBQUgsQ0FBZ0JDLFdBQWhCLENBQTRCO0FBQ3pDQyxNQUFBQSxLQUFLLEVBQUVULEVBQUUsQ0FBQ1UsYUFBSCxDQUFpQkMsZ0JBRGlCO0FBRXpDQyxNQUFBQSxZQUFZLEVBQUUsc0JBQVNDLEtBQVQsRUFBZ0JKLEtBQWhCLEVBQXVCO0FBQ2pDO0FBQ0FBLFFBQUFBLEtBQUssQ0FBQ0ssZUFBTjtBQUNBLGVBQU8sSUFBUDtBQUNILE9BTndDO0FBT3pDQyxNQUFBQSxZQUFZLEVBQUUsc0JBQVNGLEtBQVQsRUFBZ0JKLEtBQWhCLEVBQXVCO0FBQ2pDO0FBQ0FBLFFBQUFBLEtBQUssQ0FBQ0ssZUFBTjtBQUNILE9BVndDO0FBV3pDRSxNQUFBQSxZQUFZLEVBQUUsc0JBQVNILEtBQVQsRUFBZ0JKLEtBQWhCLEVBQXVCO0FBQ2pDO0FBQ0FBLFFBQUFBLEtBQUssQ0FBQ0ssZUFBTjtBQUNIO0FBZHdDLEtBQTVCLEVBZWRULElBQUksQ0FBQ1ksSUFmUyxDQUFqQixDQUpnQixDQXFCaEI7O0FBQ0FqQixJQUFBQSxFQUFFLENBQUNrQixXQUFILENBQWVDLEVBQWYsQ0FBa0JuQixFQUFFLENBQUNvQixXQUFILENBQWVDLFNBQWYsQ0FBeUJDLFFBQTNDLEVBQ2dCLFVBQVViLEtBQVYsRUFBaUI7QUFDYjtBQUNBQSxNQUFBQSxLQUFLLENBQUNLLGVBQU47QUFDSCxLQUpqQixFQUltQixJQUpuQixFQXRCZ0IsQ0EyQmhCOztBQUNBZCxJQUFBQSxFQUFFLENBQUNrQixXQUFILENBQWVDLEVBQWYsQ0FBa0JuQixFQUFFLENBQUNvQixXQUFILENBQWVDLFNBQWYsQ0FBeUJFLE1BQTNDLEVBQ2dCLFVBQVVkLEtBQVYsRUFBZ0I7QUFDWjtBQUNBQSxNQUFBQSxLQUFLLENBQUNLLGVBQU47QUFDSCxLQUpqQixFQUltQixJQUpuQjtBQU1ILEdBbkRJLENBcURMO0FBQ0E7QUFFQTs7QUF4REssQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvLyBmb286IHtcclxuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XHJcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxyXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIC8vIC4uLlxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgLy8gdG91Y2ggaW5wdXRcclxuICAgICAgICB0aGlzLl9saXN0ZW5lciA9IGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih7XHJcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLlRPVUNIX09ORV9CWV9PTkUsXHJcbiAgICAgICAgICAgIG9uVG91Y2hCZWdhbjogZnVuY3Rpb24odG91Y2gsIGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAvL+aIquiOt+S6i+S7tlxyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25Ub3VjaE1vdmVkOiBmdW5jdGlvbih0b3VjaCwgZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIC8v5oiq6I635LqL5Lu2XHJcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25Ub3VjaEVuZGVkOiBmdW5jdGlvbih0b3VjaCwgZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIC8v5oiq6I635LqL5Lu2XHJcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHNlbGYubm9kZSk7XHJcblxyXG4gICAgICAgIC8v5oyJ6ZSu5oyJ5LiLXHJcbiAgICAgICAgY2Muc3lzdGVtRXZlbnQub24oY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIquiOt+S6i+S7tlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgIC8v5oyJ6ZSu5oqs6LW3XHJcbiAgICAgICAgY2Muc3lzdGVtRXZlbnQub24oY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9VUCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChldmVudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIquiOt+S6i+S7tlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiJdfQ==
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcU3RhcnRTY3JpcHQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJvbkxvYWQiLCJnbG9iYWxEYXRhIiwibG9hZENob2ljZVNjZW5lIiwiZGlyZWN0b3IiLCJsb2FkU2NlbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0FBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRSxDQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVlEsR0FIUDtBQWdCTDtBQUNBQyxFQUFBQSxNQUFNLEVBQUUsa0JBQVk7QUFDaEI7QUFDQSxRQUFHLENBQUNKLEVBQUUsQ0FBQ0ssVUFBUCxFQUFrQjtBQUNkTCxNQUFBQSxFQUFFLENBQUNLLFVBQUgsR0FBZ0IsRUFBaEI7QUFDSDtBQUVKLEdBdkJJO0FBeUJMQyxFQUFBQSxlQUFlLEVBQUUsMkJBQVc7QUFDeEJOLElBQUFBLEVBQUUsQ0FBQ08sUUFBSCxDQUFZQyxTQUFaLENBQXNCLGFBQXRCLEVBRHdCLENBRXhCO0FBQ0gsR0E1QkksQ0E4Qkw7QUFDQTtBQUVBOztBQWpDSyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvLyBmb286IHtcclxuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XHJcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxyXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIC8vIC4uLlxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8v5YWo5bGA5pWw5o2uXHJcbiAgICAgICAgaWYoIWNjLmdsb2JhbERhdGEpe1xyXG4gICAgICAgICAgICBjYy5nbG9iYWxEYXRhID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkQ2hvaWNlU2NlbmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkNob2ljZVNjZW5lXCIpO1xyXG4gICAgICAgIC8vY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiQ2l0eVNjZW5lMVwiKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiJdfQ==
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
    this._cityCtrl = cc.find("/CityScript").getComponent("CityScript");
    this.bulletNode = cc.find("/Canvas/Map/layer_0"); //this.bulletNode = cc.find("/Canvas/map1/layer0");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcVGFua1NjcmlwdC5qcyJdLCJuYW1lcyI6WyJUYW5rVHlwZSIsInJlcXVpcmUiLCJ0YW5rVHlwZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiTm9ybWFsIiwidHlwZSIsInNwZWVkIiwiYnVsbGV0IiwiUHJlZmFiIiwiZmlyZVRpbWUiLCJibG9vZCIsInRlYW0iLCJibGFzdCIsInNob290QXVkaW8iLCJ1cmwiLCJBdWRpb0NsaXAiLCJzcHJpdGVGcmFtZXMiLCJTcHJpdGVGcmFtZSIsImRpZSIsInN0b3AiLCJvbkxvYWQiLCJfY2l0eUN0cmwiLCJmaW5kIiwiZ2V0Q29tcG9uZW50IiwiYnVsbGV0Tm9kZSIsInN0YXJ0Iiwic3RvcE1vdmUiLCJvZmZzZXQiLCJ2MiIsIlBsYXllciIsInNlbGYiLCJjYWxsYmFjayIsImNhbGxGdW5jIiwiYW5nbGVzIiwiaW5kZXgiLCJwYXJzZUludCIsIk1hdGgiLCJyYW5kb20iLCJ0YW5rTW92ZVN0YXJ0Iiwic3RhcnRGaXJlIiwiYnVsbGV0UG9vbCIsInNlcSIsInNlcXVlbmNlIiwiZGVsYXlUaW1lIiwibm9kZSIsInJ1bkFjdGlvbiIsInJlcGVhdEZvcmV2ZXIiLCJhbmdsZSIsImZsb29yIiwiY29zIiwiUEkiLCJzaW4iLCJjZWlsIiwidGFua01vdmVTdG9wIiwidGFua1N0b3AiLCJkaXJlY3RvciIsImdldEFjdGlvbk1hbmFnZXIiLCJwYXVzZUFsbFJ1bm5pbmdBY3Rpb25zIiwidXBkYXRlIiwiZHQiLCJib3VuZGluZ0JveCIsImdldEJvdW5kaW5nQm94IiwicmVjdCIsInhNaW4iLCJ4IiwieU1pbiIsInkiLCJzaXplIiwid2lkdGgiLCJoZWlnaHQiLCJjb2xsaXNpb25UZXN0IiwiY29sbGlzaW9uVGFuayIsInN0b3BGaXJlIiwiaSIsImdhbWVEYXRhIiwidGFua0xpc3QiLCJsZW5ndGgiLCJ0YW5rIiwiaW50ZXJzZWN0cyIsImdldCIsImluc3RhbnRpYXRlIiwicG9zIiwicG9zaXRpb24iLCJhZGQiLCJidWxsZXRNb3ZlIiwicGFyZW50IiwiY2FtcCIsImJ1bGxldExpc3QiLCJwdXNoIiwiYm9vbSIsImFuaW0iLCJBbmltYXRpb24iLCJwbGF5IiwidGFua0Jvb20iLCJ0dXJuR3JlZW4iLCJTcHJpdGUiLCJzcHJpdGVGcmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFJQSxRQUFRLEdBQUdDLE9BQU8sQ0FBQyxVQUFELENBQVAsQ0FBb0JDLFFBQW5DOztBQUVBQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFFUjtBQUNBSixJQUFBQSxRQUFRLEVBQUU7QUFDTixpQkFBU0YsUUFBUSxDQUFDTyxNQURaO0FBRU5DLE1BQUFBLElBQUksRUFBRVI7QUFGQSxLQUhGO0FBT1I7QUFDQVMsSUFBQUEsS0FBSyxFQUFFLEVBUkM7QUFTUjtBQUNBQyxJQUFBQSxNQUFNLEVBQUVQLEVBQUUsQ0FBQ1EsTUFWSDtBQVdSO0FBQ0FDLElBQUFBLFFBQVEsRUFBRSxHQVpGO0FBYVI7QUFDQUMsSUFBQUEsS0FBSyxFQUFFLENBZEM7QUFlUjtBQUNBQyxJQUFBQSxJQUFJLEVBQUUsQ0FoQkU7QUFpQlI7QUFDQUMsSUFBQUEsS0FBSyxFQUFFWixFQUFFLENBQUNRLE1BbEJGO0FBbUJSO0FBQ0FLLElBQUFBLFVBQVUsRUFBRTtBQUNSLGlCQUFTLElBREQ7QUFFUkMsTUFBQUEsR0FBRyxFQUFFZCxFQUFFLENBQUNlO0FBRkEsS0FwQko7QUF3QlI7QUFDQUMsSUFBQUEsWUFBWSxFQUFFO0FBQ1YsaUJBQVMsRUFEQztBQUVWWCxNQUFBQSxJQUFJLEVBQUVMLEVBQUUsQ0FBQ2lCO0FBRkMsS0F6Qk47QUE4QlJDLElBQUFBLEdBQUcsRUFBRSxLQTlCRztBQStCUkMsSUFBQUEsSUFBSSxFQUFFO0FBL0JFLEdBSFA7QUFzQ0w7QUFDQUMsRUFBQUEsTUFBTSxFQUFFLGtCQUFZO0FBQ2hCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQnJCLEVBQUUsQ0FBQ3NCLElBQUgsQ0FBUSxhQUFSLEVBQXVCQyxZQUF2QixDQUFvQyxZQUFwQyxDQUFqQjtBQUNBLFNBQUtDLFVBQUwsR0FBa0J4QixFQUFFLENBQUNzQixJQUFILENBQVEscUJBQVIsQ0FBbEIsQ0FIZ0IsQ0FJaEI7QUFDSCxHQTVDSTtBQThDTEcsRUFBQUEsS0FBSyxFQUFFLGlCQUFXO0FBQ2Q7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsU0FBS1AsSUFBTCxHQUFZLEtBQVosQ0FIYyxDQUlkOztBQUNBLFNBQUtRLE1BQUwsR0FBYzNCLEVBQUUsQ0FBQzRCLEVBQUgsRUFBZDs7QUFFQSxRQUFHLEtBQUs3QixRQUFMLElBQWlCRixRQUFRLENBQUNnQyxNQUE3QixFQUFvQztBQUNoQyxVQUFJQyxJQUFJLEdBQUcsSUFBWCxDQURnQyxDQUVoQzs7QUFDQSxVQUFJQyxRQUFRLEdBQUcvQixFQUFFLENBQUNnQyxRQUFILENBQVksWUFBVTtBQUNqQyxZQUFJQyxNQUFNLEdBQUcsQ0FBQyxDQUFELEVBQUksRUFBSixFQUFRLEdBQVIsRUFBYSxHQUFiLENBQWI7QUFDQSxZQUFJQyxLQUFLLEdBQUdDLFFBQVEsQ0FBQ0MsSUFBSSxDQUFDQyxNQUFMLEtBQWMsQ0FBZixFQUFrQixFQUFsQixDQUFwQjtBQUNBUCxRQUFBQSxJQUFJLENBQUNRLGFBQUwsQ0FBbUJMLE1BQU0sQ0FBQ0MsS0FBRCxDQUF6QjtBQUVBSixRQUFBQSxJQUFJLENBQUNTLFNBQUwsQ0FBZVQsSUFBSSxDQUFDVCxTQUFMLENBQWVtQixVQUE5QjtBQUVILE9BUGMsRUFPWixJQVBZLENBQWY7QUFTQSxVQUFJQyxHQUFHLEdBQUd6QyxFQUFFLENBQUMwQyxRQUFILENBQVkxQyxFQUFFLENBQUMyQyxTQUFILENBQWEsR0FBYixDQUFaLEVBQStCWixRQUEvQixFQUF5Qy9CLEVBQUUsQ0FBQzJDLFNBQUgsQ0FBYSxDQUFiLENBQXpDLENBQVY7QUFDQSxXQUFLQyxJQUFMLENBQVVDLFNBQVYsQ0FBb0I3QyxFQUFFLENBQUM4QyxhQUFILENBQWlCTCxHQUFqQixDQUFwQjtBQUNIO0FBRUosR0FyRUk7QUF1RUw7QUFDQUgsRUFBQUEsYUFBYSxFQUFFLHVCQUFVUyxLQUFWLEVBQWlCO0FBRTVCLFNBQUtILElBQUwsQ0FBVUcsS0FBVixHQUFrQkEsS0FBSyxHQUFHLEVBQTFCOztBQUVBLFFBQUdBLEtBQUssSUFBRSxDQUFQLElBQVlBLEtBQUssSUFBRSxHQUFuQixJQUEwQkEsS0FBSyxJQUFFLEVBQXBDLEVBQXVDO0FBQ25DLFdBQUtwQixNQUFMLEdBQWMzQixFQUFFLENBQUM0QixFQUFILENBQU1RLElBQUksQ0FBQ1ksS0FBTCxDQUFXWixJQUFJLENBQUNhLEdBQUwsQ0FBU2IsSUFBSSxDQUFDYyxFQUFMLEdBQVEsR0FBUixHQUFZSCxLQUFyQixDQUFYLENBQU4sRUFDQ1gsSUFBSSxDQUFDWSxLQUFMLENBQVdaLElBQUksQ0FBQ2UsR0FBTCxDQUFTZixJQUFJLENBQUNjLEVBQUwsR0FBUSxHQUFSLEdBQVlILEtBQXJCLENBQVgsQ0FERCxDQUFkO0FBRUgsS0FIRCxNQUdNLElBQUdBLEtBQUssSUFBRSxHQUFWLEVBQWM7QUFFaEIsV0FBS3BCLE1BQUwsR0FBYzNCLEVBQUUsQ0FBQzRCLEVBQUgsQ0FBTVEsSUFBSSxDQUFDZ0IsSUFBTCxDQUFVaEIsSUFBSSxDQUFDYSxHQUFMLENBQVNiLElBQUksQ0FBQ2MsRUFBTCxHQUFRLEdBQVIsR0FBWUgsS0FBckIsQ0FBVixDQUFOLEVBQ01YLElBQUksQ0FBQ1ksS0FBTCxDQUFXWixJQUFJLENBQUNlLEdBQUwsQ0FBU2YsSUFBSSxDQUFDYyxFQUFMLEdBQVEsR0FBUixHQUFZSCxLQUFyQixDQUFYLENBRE4sQ0FBZDtBQUVILEtBSkssTUFJQTtBQUNGLFdBQUtwQixNQUFMLEdBQWMzQixFQUFFLENBQUM0QixFQUFILENBQU1RLElBQUksQ0FBQ2EsR0FBTCxDQUFTYixJQUFJLENBQUNjLEVBQUwsR0FBUSxHQUFSLEdBQVlILEtBQXJCLENBQU4sRUFDTVgsSUFBSSxDQUFDZSxHQUFMLENBQVNmLElBQUksQ0FBQ2MsRUFBTCxHQUFRLEdBQVIsR0FBWUgsS0FBckIsQ0FETixDQUFkO0FBRUg7O0FBRUQsU0FBS3JCLFFBQUwsR0FBZ0IsS0FBaEI7QUFDSCxHQXpGSTtBQTJGTDtBQUNBMkIsRUFBQUEsWUFBWSxFQUFFLHdCQUFZO0FBQ3RCLFNBQUszQixRQUFMLEdBQWdCLElBQWhCO0FBQ0gsR0E5Rkk7QUFnR0w0QixFQUFBQSxRQUFRLEVBQUUsb0JBQVc7QUFDakIsU0FBS25DLElBQUwsR0FBWSxJQUFaO0FBQ0FuQixJQUFBQSxFQUFFLENBQUN1RCxRQUFILENBQVlDLGdCQUFaLEdBQStCQyxzQkFBL0I7QUFDSCxHQW5HSTtBQXFHTDtBQUNBQyxFQUFBQSxNQUFNLEVBQUUsZ0JBQVVDLEVBQVYsRUFBYztBQUVsQixRQUFHLEtBQUt4QyxJQUFSLEVBQWE7QUFDVDtBQUNIOztBQUVELFFBQUcsQ0FBQyxLQUFLTyxRQUFULEVBQWtCO0FBQ2QsVUFBSWtDLFdBQVcsR0FBRyxLQUFLaEIsSUFBTCxDQUFVaUIsY0FBVixFQUFsQjtBQUNBLFVBQUlDLElBQUksR0FBRzlELEVBQUUsQ0FBQzhELElBQUgsQ0FBUUYsV0FBVyxDQUFDRyxJQUFaLEdBQW1CLEtBQUtwQyxNQUFMLENBQVlxQyxDQUFaLEdBQWMsS0FBSzFELEtBQW5CLEdBQXlCcUQsRUFBekIsR0FBNEIsR0FBdkQsRUFDUUMsV0FBVyxDQUFDSyxJQUFaLEdBQW1CLEtBQUt0QyxNQUFMLENBQVl1QyxDQUFaLEdBQWMsS0FBSzVELEtBQW5CLEdBQXlCcUQsRUFBekIsR0FBNEIsR0FEdkQsRUFFRUMsV0FBVyxDQUFDTyxJQUFaLENBQWlCQyxLQUZuQixFQUdRUixXQUFXLENBQUNPLElBQVosQ0FBaUJFLE1BSHpCLENBQVg7O0FBSUEsVUFBRyxLQUFLaEQsU0FBTCxDQUFlaUQsYUFBZixDQUE2QlIsSUFBN0IsRUFBbUM7QUFBbkMsU0FDSSxLQUFLUyxhQUFMLENBQW1CVCxJQUFuQixDQURQLEVBRUs7QUFDRCxhQUFLVCxZQUFMO0FBQ0gsT0FKRCxNQUlNO0FBQ0YsYUFBS1QsSUFBTCxDQUFVb0IsQ0FBVixJQUFlLEtBQUtyQyxNQUFMLENBQVlxQyxDQUFaLEdBQWMsS0FBSzFELEtBQW5CLEdBQXlCcUQsRUFBeEM7QUFDQSxhQUFLZixJQUFMLENBQVVzQixDQUFWLElBQWUsS0FBS3ZDLE1BQUwsQ0FBWXVDLENBQVosR0FBYyxLQUFLNUQsS0FBbkIsR0FBeUJxRCxFQUF4QztBQUNIO0FBQ0o7O0FBQ0QsUUFBRyxLQUFLYSxRQUFSLEVBQWlCO0FBQ2IsV0FBSy9ELFFBQUwsSUFBaUJrRCxFQUFqQjs7QUFDQSxVQUFHLEtBQUtsRCxRQUFMLElBQWUsQ0FBbEIsRUFBb0I7QUFDaEIsYUFBSytELFFBQUwsR0FBZ0IsS0FBaEI7QUFDSDtBQUNKO0FBRUosR0FsSUk7QUFvSUw7QUFDQUQsRUFBQUEsYUFBYSxFQUFFLHVCQUFTVCxJQUFULEVBQWU7QUFDMUIsU0FBSSxJQUFJVyxDQUFDLEdBQUMsQ0FBVixFQUFhQSxDQUFDLEdBQUN6RSxFQUFFLENBQUMwRSxRQUFILENBQVlDLFFBQVosQ0FBcUJDLE1BQXBDLEVBQTRDSCxDQUFDLEVBQTdDLEVBQWdEO0FBQzVDLFVBQUlJLElBQUksR0FBRzdFLEVBQUUsQ0FBQzBFLFFBQUgsQ0FBWUMsUUFBWixDQUFxQkYsQ0FBckIsQ0FBWDs7QUFDQSxVQUFHLEtBQUs3QixJQUFMLEtBQWNpQyxJQUFqQixFQUFzQjtBQUNsQjtBQUNIOztBQUNELFVBQUlqQixXQUFXLEdBQUdpQixJQUFJLENBQUNoQixjQUFMLEVBQWxCLENBTDRDLENBTTVDOztBQUNBLFVBQUdDLElBQUksQ0FBQ2dCLFVBQUwsQ0FBZ0JsQixXQUFoQixDQUFILEVBQWdDO0FBQzVCLGVBQU8sSUFBUDtBQUNIO0FBQ0o7O0FBQ0QsV0FBTyxLQUFQO0FBQ0gsR0FsSkk7QUFvSkw7QUFDQXJCLEVBQUFBLFNBQVMsRUFBRSxtQkFBVUMsVUFBVixFQUFxQjtBQUM1QixRQUFHLEtBQUtnQyxRQUFSLEVBQWlCO0FBQ2IsYUFBTyxLQUFQO0FBQ0g7O0FBQ0QsU0FBS0EsUUFBTCxHQUFnQixJQUFoQjtBQUNBLFNBQUsvRCxRQUFMLEdBQWdCLEdBQWhCO0FBRUEsUUFBSUYsTUFBTSxHQUFHLElBQWI7O0FBQ0EsUUFBR2lDLFVBQVUsQ0FBQzJCLElBQVgsS0FBa0IsQ0FBckIsRUFBdUI7QUFDbkI1RCxNQUFBQSxNQUFNLEdBQUdpQyxVQUFVLENBQUN1QyxHQUFYLENBQWV2QyxVQUFmLENBQVQ7QUFDSCxLQUZELE1BRU07QUFDRmpDLE1BQUFBLE1BQU0sR0FBR1AsRUFBRSxDQUFDZ0YsV0FBSCxDQUFlLEtBQUt6RSxNQUFwQixDQUFUO0FBQ0gsS0FaMkIsQ0FhNUI7OztBQUNBQSxJQUFBQSxNQUFNLENBQUN3QyxLQUFQLEdBQWUsS0FBS0gsSUFBTCxDQUFVRyxLQUF6QjtBQUNBLFFBQUlrQyxHQUFHLEdBQUcsS0FBS3JDLElBQUwsQ0FBVXNDLFFBQXBCO0FBRUEsUUFBSW5DLEtBQUssR0FBRyxLQUFLSCxJQUFMLENBQVVHLEtBQVYsR0FBa0IsRUFBOUI7QUFDQSxRQUFJcEIsTUFBTSxHQUFHM0IsRUFBRSxDQUFDNEIsRUFBSCxDQUFNLENBQU4sRUFBUyxDQUFULENBQWI7O0FBQ0EsUUFBR21CLEtBQUssSUFBRSxDQUFQLElBQVlBLEtBQUssSUFBRSxHQUFuQixJQUEwQkEsS0FBSyxJQUFFLEVBQXBDLEVBQXVDO0FBQ25DcEIsTUFBQUEsTUFBTSxHQUFHM0IsRUFBRSxDQUFDNEIsRUFBSCxDQUFNUSxJQUFJLENBQUNZLEtBQUwsQ0FBV1osSUFBSSxDQUFDYSxHQUFMLENBQVNiLElBQUksQ0FBQ2MsRUFBTCxHQUFRLEdBQVIsR0FBWUgsS0FBckIsQ0FBWCxDQUFOLEVBQ1dYLElBQUksQ0FBQ1ksS0FBTCxDQUFXWixJQUFJLENBQUNlLEdBQUwsQ0FBU2YsSUFBSSxDQUFDYyxFQUFMLEdBQVEsR0FBUixHQUFZSCxLQUFyQixDQUFYLENBRFgsQ0FBVDtBQUVILEtBSEQsTUFHTSxJQUFHQSxLQUFLLElBQUUsR0FBVixFQUFjO0FBQ2hCcEIsTUFBQUEsTUFBTSxHQUFHM0IsRUFBRSxDQUFDNEIsRUFBSCxDQUFNUSxJQUFJLENBQUNnQixJQUFMLENBQVVoQixJQUFJLENBQUNhLEdBQUwsQ0FBU2IsSUFBSSxDQUFDYyxFQUFMLEdBQVEsR0FBUixHQUFZSCxLQUFyQixDQUFWLENBQU4sRUFDV1gsSUFBSSxDQUFDWSxLQUFMLENBQVdaLElBQUksQ0FBQ2UsR0FBTCxDQUFTZixJQUFJLENBQUNjLEVBQUwsR0FBUSxHQUFSLEdBQVlILEtBQXJCLENBQVgsQ0FEWCxDQUFUO0FBRUgsS0FISyxNQUdBO0FBQ0ZwQixNQUFBQSxNQUFNLEdBQUczQixFQUFFLENBQUM0QixFQUFILENBQU1RLElBQUksQ0FBQ2EsR0FBTCxDQUFTYixJQUFJLENBQUNjLEVBQUwsR0FBUSxHQUFSLEdBQVlILEtBQXJCLENBQU4sRUFDV1gsSUFBSSxDQUFDZSxHQUFMLENBQVNmLElBQUksQ0FBQ2MsRUFBTCxHQUFRLEdBQVIsR0FBWUgsS0FBckIsQ0FEWCxDQUFUO0FBRUg7O0FBRUQsUUFBR0EsS0FBSyxJQUFJLENBQUMsRUFBYixFQUFnQjtBQUNaO0FBQ0F4QyxNQUFBQSxNQUFNLENBQUMyRSxRQUFQLEdBQWtCRCxHQUFHLENBQUNFLEdBQUosQ0FBUW5GLEVBQUUsQ0FBQzRCLEVBQUgsQ0FBTSxLQUFHRCxNQUFNLENBQUNxQyxDQUFoQixFQUFtQixLQUFHckMsTUFBTSxDQUFDdUMsQ0FBVixHQUFjLEVBQWpDLENBQVIsQ0FBbEI7QUFDSCxLQUhELE1BR00sSUFBR25CLEtBQUssSUFBSSxDQUFaLEVBQWM7QUFDaEI7QUFDQXhDLE1BQUFBLE1BQU0sQ0FBQzJFLFFBQVAsR0FBa0JELEdBQUcsQ0FBQ0UsR0FBSixDQUFRbkYsRUFBRSxDQUFDNEIsRUFBSCxDQUFNLEtBQUdELE1BQU0sQ0FBQ3FDLENBQVYsR0FBYyxFQUFwQixFQUF3QixLQUFHckMsTUFBTSxDQUFDdUMsQ0FBbEMsQ0FBUixDQUFsQjtBQUNILEtBSEssTUFHQSxJQUFHbkIsS0FBSyxJQUFJLENBQUMsR0FBYixFQUFpQjtBQUNuQjtBQUNBeEMsTUFBQUEsTUFBTSxDQUFDMkUsUUFBUCxHQUFrQkQsR0FBRyxDQUFDRSxHQUFKLENBQVFuRixFQUFFLENBQUM0QixFQUFILENBQU0sS0FBR0QsTUFBTSxDQUFDcUMsQ0FBVixHQUFjLEVBQXBCLEVBQXdCLEtBQUdyQyxNQUFNLENBQUN1QyxDQUFsQyxDQUFSLENBQWxCO0FBQ0gsS0FISyxNQUdBLElBQUduQixLQUFLLElBQUksRUFBWixFQUFlO0FBQ2pCO0FBQ0F4QyxNQUFBQSxNQUFNLENBQUMyRSxRQUFQLEdBQWtCRCxHQUFHLENBQUNFLEdBQUosQ0FBUW5GLEVBQUUsQ0FBQzRCLEVBQUgsQ0FBTSxLQUFHRCxNQUFNLENBQUNxQyxDQUFoQixFQUFtQixLQUFHckMsTUFBTSxDQUFDdUMsQ0FBVixHQUFjLEVBQWpDLENBQVIsQ0FBbEI7QUFDSCxLQTFDMkIsQ0E0QzVCOzs7QUFFQTNELElBQUFBLE1BQU0sQ0FBQ2dCLFlBQVAsQ0FBb0IsY0FBcEIsRUFBb0M2RCxVQUFwQztBQUNBN0UsSUFBQUEsTUFBTSxDQUFDOEUsTUFBUCxHQUFnQixLQUFLN0QsVUFBckIsQ0EvQzRCLENBZ0Q1Qjs7QUFDQWpCLElBQUFBLE1BQU0sQ0FBQytFLElBQVAsR0FBYyxLQUFLM0UsSUFBbkIsQ0FqRDRCLENBb0Q1Qjs7QUFDQVgsSUFBQUEsRUFBRSxDQUFDMEUsUUFBSCxDQUFZYSxVQUFaLENBQXVCQyxJQUF2QixDQUE0QmpGLE1BQTVCO0FBRUEsV0FBTyxJQUFQO0FBQ0gsR0E3TUk7QUErTUw7QUFDQWtGLEVBQUFBLElBQUksRUFBRSxnQkFBVTtBQUNaLFFBQUk3RSxLQUFLLEdBQUdaLEVBQUUsQ0FBQ2dGLFdBQUgsQ0FBZSxLQUFLcEUsS0FBcEIsQ0FBWjtBQUNBQSxJQUFBQSxLQUFLLENBQUN5RSxNQUFOLEdBQWUsS0FBS3pDLElBQUwsQ0FBVXlDLE1BQXpCO0FBQ0F6RSxJQUFBQSxLQUFLLENBQUNzRSxRQUFOLEdBQWlCLEtBQUt0QyxJQUFMLENBQVVzQyxRQUEzQjtBQUNBLFFBQUlRLElBQUksR0FBRzlFLEtBQUssQ0FBQ1csWUFBTixDQUFtQnZCLEVBQUUsQ0FBQzJGLFNBQXRCLENBQVg7QUFDQUQsSUFBQUEsSUFBSSxDQUFDRSxJQUFMOztBQUNBLFNBQUt2RSxTQUFMLENBQWV3RSxRQUFmLENBQXdCLEtBQUtqRCxJQUE3QjtBQUNILEdBdk5JO0FBeU5Ma0QsRUFBQUEsU0FBUyxFQUFFLG1CQUFTNUQsS0FBVCxFQUFlO0FBQ3RCLFNBQUtVLElBQUwsQ0FBVXJCLFlBQVYsQ0FBdUJ2QixFQUFFLENBQUMrRixNQUExQixFQUFrQ0MsV0FBbEMsR0FBZ0QsS0FBS2hGLFlBQUwsQ0FBa0JrQixLQUFsQixDQUFoRDtBQUNIO0FBM05JLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG52YXIgVGFua1R5cGUgPSByZXF1aXJlKFwiVGFua0RhdGFcIikudGFua1R5cGU7XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG5cclxuICAgICAgICAvL+WdpuWFi+exu+Wei1xyXG4gICAgICAgIHRhbmtUeXBlOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFRhbmtUeXBlLk5vcm1hbCxcclxuICAgICAgICAgICAgdHlwZTogVGFua1R5cGVcclxuICAgICAgICB9LCBcclxuICAgICAgICAvL+mAn+W6plxyXG4gICAgICAgIHNwZWVkOiAyMCxcclxuICAgICAgICAvL+WtkOW8uVxyXG4gICAgICAgIGJ1bGxldDogY2MuUHJlZmFiLFxyXG4gICAgICAgIC8v5Y+R5bCE5a2Q5by56Ze06ZqU5pe26Ze0XHJcbiAgICAgICAgZmlyZVRpbWU6IDAuNSxcclxuICAgICAgICAvL+ihgOmHj1xyXG4gICAgICAgIGJsb29kOiAxLFxyXG4gICAgICAgIC8v5omA5bGe57uE57uHXHJcbiAgICAgICAgdGVhbTogMCxcclxuICAgICAgICAvL+eIhueCuOWKqOeUu1xyXG4gICAgICAgIGJsYXN0OiBjYy5QcmVmYWIsXHJcbiAgICAgICAgLy/lsITlh7vpn7PmlYhcclxuICAgICAgICBzaG9vdEF1ZGlvOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/lnablhYvnmq7ogqRcclxuICAgICAgICBzcHJpdGVGcmFtZXM6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogW10sXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRpZTogZmFsc2UsXHJcbiAgICAgICAgc3RvcDogZmFsc2UsXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8v6I635Y+W57uE5Lu2XHJcbiAgICAgICAgdGhpcy5fY2l0eUN0cmwgPSBjYy5maW5kKFwiL0NpdHlTY3JpcHRcIikuZ2V0Q29tcG9uZW50KFwiQ2l0eVNjcmlwdFwiKTtcclxuICAgICAgICB0aGlzLmJ1bGxldE5vZGUgPSBjYy5maW5kKFwiL0NhbnZhcy9NYXAvbGF5ZXJfMFwiKTtcclxuICAgICAgICAvL3RoaXMuYnVsbGV0Tm9kZSA9IGNjLmZpbmQoXCIvQ2FudmFzL21hcDEvbGF5ZXIwXCIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdGFydDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy/liJ3lp4vmmK/lgZzmraLnirbmgIHnmoRcclxuICAgICAgICB0aGlzLnN0b3BNb3ZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnN0b3AgPSBmYWxzZTtcclxuICAgICAgICAvL+WBj+enu+mHj1xyXG4gICAgICAgIHRoaXMub2Zmc2V0ID0gY2MudjIoKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy50YW5rVHlwZSAhPSBUYW5rVHlwZS5QbGF5ZXIpe1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIC8v5re75YqgQUlcclxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gY2MuY2FsbEZ1bmMoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHZhciBhbmdsZXMgPSBbMCwgOTAsIDE4MCwgMjcwXTtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KE1hdGgucmFuZG9tKCkqNCwgMTApO1xyXG4gICAgICAgICAgICAgICAgc2VsZi50YW5rTW92ZVN0YXJ0KGFuZ2xlc1tpbmRleF0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuc3RhcnRGaXJlKHNlbGYuX2NpdHlDdHJsLmJ1bGxldFBvb2wpO1xyXG5cclxuICAgICAgICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoY2MuZGVsYXlUaW1lKDAuMyksIGNhbGxiYWNrLCBjYy5kZWxheVRpbWUoMSkpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnJlcGVhdEZvcmV2ZXIoc2VxKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy/mt7vliqDlnablhYvnp7vliqjliqjkvZxcclxuICAgIHRhbmtNb3ZlU3RhcnQ6IGZ1bmN0aW9uIChhbmdsZSkge1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUuYW5nbGUgPSBhbmdsZSAtIDkwO1xyXG5cclxuICAgICAgICBpZihhbmdsZT09MCB8fCBhbmdsZT09MTgwIHx8IGFuZ2xlPT05MCl7XHJcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gY2MudjIoTWF0aC5mbG9vcihNYXRoLmNvcyhNYXRoLlBJLzE4MCphbmdsZSkpLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnNpbihNYXRoLlBJLzE4MCphbmdsZSkpKTtcclxuICAgICAgICB9ZWxzZSBpZihhbmdsZT09MjcwKXtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gY2MudjIoTWF0aC5jZWlsKE1hdGguY29zKE1hdGguUEkvMTgwKmFuZ2xlKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnNpbihNYXRoLlBJLzE4MCphbmdsZSkpKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gY2MudjIoTWF0aC5jb3MoTWF0aC5QSS8xODAqYW5nbGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguc2luKE1hdGguUEkvMTgwKmFuZ2xlKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnN0b3BNb3ZlID0gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIC8v56e76Zmk5Z2m5YWL56e75Yqo5Yqo5L2cXHJcbiAgICB0YW5rTW92ZVN0b3A6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnN0b3BNb3ZlID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgdGFua1N0b3A6IGZ1bmN0aW9uICgpe1xyXG4gICAgICAgIHRoaXMuc3RvcCA9IHRydWU7XHJcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLnBhdXNlQWxsUnVubmluZ0FjdGlvbnMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuc3RvcCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCF0aGlzLnN0b3BNb3ZlKXtcclxuICAgICAgICAgICAgdmFyIGJvdW5kaW5nQm94ID0gdGhpcy5ub2RlLmdldEJvdW5kaW5nQm94KCk7XHJcbiAgICAgICAgICAgIHZhciByZWN0ID0gY2MucmVjdChib3VuZGluZ0JveC54TWluICsgdGhpcy5vZmZzZXQueCp0aGlzLnNwZWVkKmR0KjEuNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kaW5nQm94LnlNaW4gKyB0aGlzLm9mZnNldC55KnRoaXMuc3BlZWQqZHQqMS43LCBcclxuXHRcdCAgICAgICAgICAgICAgICAgICAgICAgYm91bmRpbmdCb3guc2l6ZS53aWR0aCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3VuZGluZ0JveC5zaXplLmhlaWdodCk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NpdHlDdHJsLmNvbGxpc2lvblRlc3QocmVjdCkgLy/mo4DmtYvkuI7lnLDlm77nmoTnorDmkp5cclxuICAgICAgICAgICAgICAgIHx8IHRoaXMuY29sbGlzaW9uVGFuayhyZWN0KVxyXG4gICAgICAgICAgICAgICAgKXtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFua01vdmVTdG9wKCk7XHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS54ICs9IHRoaXMub2Zmc2V0LngqdGhpcy5zcGVlZCpkdDtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55ICs9IHRoaXMub2Zmc2V0LnkqdGhpcy5zcGVlZCpkdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnN0b3BGaXJlKXtcclxuICAgICAgICAgICAgdGhpcy5maXJlVGltZSAtPSBkdDtcclxuICAgICAgICAgICAgaWYodGhpcy5maXJlVGltZTw9MCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BGaXJlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvL+WIpOaWreaYr+WQpuS4juWFtuS7luWdpuWFi+eisOaSnlxyXG4gICAgY29sbGlzaW9uVGFuazogZnVuY3Rpb24ocmVjdCkge1xyXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGNjLmdhbWVEYXRhLnRhbmtMaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgdmFyIHRhbmsgPSBjYy5nYW1lRGF0YS50YW5rTGlzdFtpXVxyXG4gICAgICAgICAgICBpZih0aGlzLm5vZGUgPT09IHRhbmspe1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGJvdW5kaW5nQm94ID0gdGFuay5nZXRCb3VuZGluZ0JveCgpO1xyXG4gICAgICAgICAgICAvLyBpZihjYy5yZWN0SW50ZXJzZWN0c1JlY3QocmVjdCwgYm91bmRpbmdCb3gpKXtcclxuICAgICAgICAgICAgaWYocmVjdC5pbnRlcnNlY3RzKGJvdW5kaW5nQm94KSl7ICBcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgLy/lvIDngatcclxuICAgIHN0YXJ0RmlyZTogZnVuY3Rpb24gKGJ1bGxldFBvb2wpe1xyXG4gICAgICAgIGlmKHRoaXMuc3RvcEZpcmUpe1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RvcEZpcmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZmlyZVRpbWUgPSAwLjU7XHJcblxyXG4gICAgICAgIHZhciBidWxsZXQgPSBudWxsO1xyXG4gICAgICAgIGlmKGJ1bGxldFBvb2wuc2l6ZSgpPjApe1xyXG4gICAgICAgICAgICBidWxsZXQgPSBidWxsZXRQb29sLmdldChidWxsZXRQb29sKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIGJ1bGxldCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYnVsbGV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy/orr7nva7lrZDlvLnkvY3nva4s6KeS5bqmXHJcbiAgICAgICAgYnVsbGV0LmFuZ2xlID0gdGhpcy5ub2RlLmFuZ2xlO1xyXG4gICAgICAgIHZhciBwb3MgPSB0aGlzLm5vZGUucG9zaXRpb247XHJcblxyXG4gICAgICAgIHZhciBhbmdsZSA9IHRoaXMubm9kZS5hbmdsZSAtIDkwO1xyXG4gICAgICAgIHZhciBvZmZzZXQgPSBjYy52MigwLCAwKTtcclxuICAgICAgICBpZihhbmdsZT09MCB8fCBhbmdsZT09MTgwIHx8IGFuZ2xlPT05MCl7XHJcbiAgICAgICAgICAgIG9mZnNldCA9IGNjLnYyKE1hdGguZmxvb3IoTWF0aC5jb3MoTWF0aC5QSS8xODAqYW5nbGUpKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnNpbihNYXRoLlBJLzE4MCphbmdsZSkpKTtcclxuICAgICAgICB9ZWxzZSBpZihhbmdsZT09MjcwKXtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gY2MudjIoTWF0aC5jZWlsKE1hdGguY29zKE1hdGguUEkvMTgwKmFuZ2xlKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnNpbihNYXRoLlBJLzE4MCphbmdsZSkpKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIG9mZnNldCA9IGNjLnYyKE1hdGguY29zKE1hdGguUEkvMTgwKmFuZ2xlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNpbihNYXRoLlBJLzE4MCphbmdsZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoYW5nbGUgPT0gLTkwKXtcclxuICAgICAgICAgICAgLy9jYy5sb2coXCLkuIpcIik7XHJcbiAgICAgICAgICAgIGJ1bGxldC5wb3NpdGlvbiA9IHBvcy5hZGQoY2MudjIoMTAqb2Zmc2V0LngsIDEwKm9mZnNldC55ICsgMTUpKTtcclxuICAgICAgICB9ZWxzZSBpZihhbmdsZSA9PSAwKXtcclxuICAgICAgICAgICAgLy9jYy5sb2coXCLlt6ZcIik7XHJcbiAgICAgICAgICAgIGJ1bGxldC5wb3NpdGlvbiA9IHBvcy5hZGQoY2MudjIoMTAqb2Zmc2V0LnggLSAxNSwgMTAqb2Zmc2V0LnkpKTtcclxuICAgICAgICB9ZWxzZSBpZihhbmdsZSA9PSAtMTgwKXtcclxuICAgICAgICAgICAgLy9jYy5sb2coXCLlj7NcIik7XHJcbiAgICAgICAgICAgIGJ1bGxldC5wb3NpdGlvbiA9IHBvcy5hZGQoY2MudjIoMTAqb2Zmc2V0LnggKyAxNSwgMTAqb2Zmc2V0LnkpKTtcclxuICAgICAgICB9ZWxzZSBpZihhbmdsZSA9PSA5MCl7XHJcbiAgICAgICAgICAgIC8vY2MubG9nKFwi5LiLXCIpO1xyXG4gICAgICAgICAgICBidWxsZXQucG9zaXRpb24gPSBwb3MuYWRkKGNjLnYyKDEwKm9mZnNldC54LCAxMCpvZmZzZXQueSAtIDE1KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBidWxsZXQucG9zaXRpb24gPSBjYy5wQWRkKHBvcyxjYy52MigxMCpvZmZzZXQueCwgMTAqb2Zmc2V0LnkpKTtcclxuXHJcbiAgICAgICAgYnVsbGV0LmdldENvbXBvbmVudChcIkJ1bGxldFNjcmlwdFwiKS5idWxsZXRNb3ZlKCk7XHJcbiAgICAgICAgYnVsbGV0LnBhcmVudCA9IHRoaXMuYnVsbGV0Tm9kZTtcclxuICAgICAgICAvL+WtkOW8ueagh+iusFxyXG4gICAgICAgIGJ1bGxldC5jYW1wID0gdGhpcy50ZWFtO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvL+WKoOWIsOWIl+ihqFxyXG4gICAgICAgIGNjLmdhbWVEYXRhLmJ1bGxldExpc3QucHVzaChidWxsZXQpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgLy/niIbngrhcclxuICAgIGJvb206IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGJsYXN0ID0gY2MuaW5zdGFudGlhdGUodGhpcy5ibGFzdCk7XHJcbiAgICAgICAgYmxhc3QucGFyZW50ID0gdGhpcy5ub2RlLnBhcmVudDtcclxuICAgICAgICBibGFzdC5wb3NpdGlvbiA9IHRoaXMubm9kZS5wb3NpdGlvbjtcclxuICAgICAgICB2YXIgYW5pbSA9IGJsYXN0LmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xyXG4gICAgICAgIGFuaW0ucGxheSgpO1xyXG4gICAgICAgIHRoaXMuX2NpdHlDdHJsLnRhbmtCb29tKHRoaXMubm9kZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHR1cm5HcmVlbjogZnVuY3Rpb24oaW5kZXgpe1xyXG4gICAgICAgIHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IHRoaXMuc3ByaXRlRnJhbWVzW2luZGV4XTtcclxuICAgIH0sXHJcblxyXG59KTtcclxuIl19
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcVGFua0RhdGEuanMiXSwibmFtZXMiOlsiX3RhbmtUeXBlIiwiY2MiLCJFbnVtIiwiTm9ybWFsIiwiU3BlZWQiLCJBcm1vciIsIlBsYXllciIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0YW5rVHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxTQUFTLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3BCQyxFQUFBQSxNQUFNLEVBQUUsQ0FEWTtBQUVwQkMsRUFBQUEsS0FBSyxFQUFFLENBRmE7QUFHcEJDLEVBQUFBLEtBQUssRUFBRSxDQUhhO0FBSXBCQyxFQUFBQSxNQUFNLEVBQUU7QUFKWSxDQUFSLENBQWhCOztBQU9BQyxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDYkMsRUFBQUEsUUFBUSxFQUFFVDtBQURHLENBQWpCIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX3RhbmtUeXBlID0gY2MuRW51bSh7XHJcbiAgICBOb3JtYWw6IDAsXHJcbiAgICBTcGVlZDogMSxcclxuICAgIEFybW9yOiAyLFxyXG4gICAgUGxheWVyOiAzXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB0YW5rVHlwZTogX3RhbmtUeXBlXHJcbn07Il19
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


var _gidToTileType = [_tileType.tileNone, _tileType.tileNone, _tileType.tileWall, _tileType.tileWall, _tileType.tileWall, _tileType.tileWall, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileGrass, _tileType.tileGrass, _tileType.tileGrass, _tileType.tileGrass, _tileType.tileKing, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcVGlsZWRNYXBEYXRhLmpzIl0sIm5hbWVzIjpbIl90aWxlVHlwZSIsImNjIiwiRW51bSIsInRpbGVOb25lIiwidGlsZUdyYXNzIiwidGlsZVN0ZWVsIiwidGlsZVdhbGwiLCJ0aWxlUml2ZXIiLCJ0aWxlS2luZyIsIl9naWRUb1RpbGVUeXBlIiwibW9kdWxlIiwiZXhwb3J0cyIsInRpbGVUeXBlIiwiZ2lkVG9UaWxlVHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFJQSxTQUFTLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3BCQyxFQUFBQSxRQUFRLEVBQUUsQ0FEVTtBQUVwQkMsRUFBQUEsU0FBUyxFQUFFLENBRlM7QUFHdkJDLEVBQUFBLFNBQVMsRUFBRSxDQUhZO0FBSXBCQyxFQUFBQSxRQUFRLEVBQUUsQ0FKVTtBQUt2QkMsRUFBQUEsU0FBUyxFQUFFLENBTFk7QUFNcEJDLEVBQUFBLFFBQVEsRUFBRTtBQU5VLENBQVIsQ0FBaEIsRUFRQTs7O0FBRUEsSUFBSUMsY0FBYyxHQUFHLENBQ3BCVCxTQUFTLENBQUNHLFFBRFUsRUFFakJILFNBQVMsQ0FBQ0csUUFGTyxFQUdqQkgsU0FBUyxDQUFDTSxRQUhPLEVBR0dOLFNBQVMsQ0FBQ00sUUFIYixFQUd1Qk4sU0FBUyxDQUFDTSxRQUhqQyxFQUcyQ04sU0FBUyxDQUFDTSxRQUhyRCxFQUlqQk4sU0FBUyxDQUFDTyxTQUpPLEVBSUlQLFNBQVMsQ0FBQ08sU0FKZCxFQUl5QlAsU0FBUyxDQUFDTyxTQUpuQyxFQUk4Q1AsU0FBUyxDQUFDTyxTQUp4RCxFQUltRVAsU0FBUyxDQUFDSSxTQUo3RSxFQUl3RkosU0FBUyxDQUFDSSxTQUpsRyxFQUk2R0osU0FBUyxDQUFDSSxTQUp2SCxFQUlrSUosU0FBUyxDQUFDSSxTQUo1SSxFQUlzSkosU0FBUyxDQUFDUSxRQUpoSyxFQU1qQlIsU0FBUyxDQUFDRyxRQU5PLEVBT2pCSCxTQUFTLENBQUNHLFFBUE8sRUFPR0gsU0FBUyxDQUFDRyxRQVBiLEVBT3VCSCxTQUFTLENBQUNHLFFBUGpDLEVBTzJDSCxTQUFTLENBQUNHLFFBUHJELEVBTytESCxTQUFTLENBQUNHLFFBUHpFLEVBT21GSCxTQUFTLENBQUNHLFFBUDdGLEVBT3VHSCxTQUFTLENBQUNHLFFBUGpILEVBTzJISCxTQUFTLENBQUNHLFFBUHJJLEVBTytJSCxTQUFTLENBQUNHLFFBUHpKLEVBT21LSCxTQUFTLENBQUNHLFFBUDdLLEVBT3VMSCxTQUFTLENBQUNHLFFBUGpNLENBQXJCO0FBWUFPLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNiQyxFQUFBQSxRQUFRLEVBQUVaLFNBREc7QUFFYmEsRUFBQUEsYUFBYSxFQUFFSjtBQUZGLENBQWpCIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIF90aWxlVHlwZSA9IGNjLkVudW0oe1xyXG4gICAgdGlsZU5vbmU6IDAsIFxyXG4gICAgdGlsZUdyYXNzOiAxLCBcclxuXHR0aWxlU3RlZWw6IDIsIFxyXG4gICAgdGlsZVdhbGw6IDMsXHJcblx0dGlsZVJpdmVyOiA0LCBcclxuICAgIHRpbGVLaW5nOiA1XHJcbn0pO1xyXG4vL2dpZOS7jjHlvIDlp4tcclxuXHJcbnZhciBfZ2lkVG9UaWxlVHlwZSA9IFtcclxuXHRfdGlsZVR5cGUudGlsZU5vbmUsXHJcbiAgICBfdGlsZVR5cGUudGlsZU5vbmUsIFxyXG4gICAgX3RpbGVUeXBlLnRpbGVXYWxsLCBfdGlsZVR5cGUudGlsZVdhbGwsIF90aWxlVHlwZS50aWxlV2FsbCwgX3RpbGVUeXBlLnRpbGVXYWxsLCBcclxuICAgIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlR3Jhc3MsIF90aWxlVHlwZS50aWxlR3Jhc3MsIF90aWxlVHlwZS50aWxlR3Jhc3MsIF90aWxlVHlwZS50aWxlR3Jhc3MsX3RpbGVUeXBlLnRpbGVLaW5nLFxyXG5cclxuICAgIF90aWxlVHlwZS50aWxlTm9uZSxcclxuICAgIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lXHJcbiAgICBcclxuXHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHRpbGVUeXBlOiBfdGlsZVR5cGUsXHJcbiAgICBnaWRUb1RpbGVUeXBlOiBfZ2lkVG9UaWxlVHlwZVxyXG59O1xyXG4iXX0=
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQWxlcnQuanMiXSwibmFtZXMiOlsidGlwQWxlcnQiLCJfYWxlcnQiLCJfYW5pbVNwZWVkIiwic2hvdyIsInRpcFN0ciIsImNhbGxiYWNrIiwiY2MiLCJsb2FkZXIiLCJsb2FkUmVzIiwiUHJlZmFiIiwiZXJyb3IiLCJwcmVmYWIiLCJpbnN0YW50aWF0ZSIsImRpcmVjdG9yIiwiZ2V0U2NlbmUiLCJhZGRDaGlsZCIsImZpbmQiLCJnZXRDb21wb25lbnQiLCJMYWJlbCIsInN0cmluZyIsIm9uIiwiZXZlbnQiLCJkaXNtaXNzIiwicGFyZW50Iiwic3RhcnRGYWRlSW4iLCJzZXRTY2FsZSIsIm9wYWNpdHkiLCJjYkZhZGVJbiIsImNhbGxGdW5jIiwib25GYWRlSW5GaW5pc2giLCJhY3Rpb25GYWRlSW4iLCJzZXF1ZW5jZSIsInNwYXduIiwiZmFkZVRvIiwic2NhbGVUbyIsInJ1bkFjdGlvbiIsImNiRmFkZU91dCIsIm9uRmFkZU91dEZpbmlzaCIsImFjdGlvbkZhZGVPdXQiLCJvbkRlc3Ryb3kiLCJyZW1vdmVGcm9tUGFyZW50IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxRQUFRLEdBQUc7QUFDWEMsRUFBQUEsTUFBTSxFQUFFLElBREc7QUFDYTtBQUN4QkMsRUFBQUEsVUFBVSxFQUFFLEdBRkQsQ0FFYTs7QUFGYixDQUFmO0FBS0E7Ozs7Ozs7QUFNQSxJQUFJQyxJQUFJLEdBQUcsU0FBUEEsSUFBTyxDQUFVQyxNQUFWLEVBQWlCQyxRQUFqQixFQUEyQjtBQUNsQ0MsRUFBQUEsRUFBRSxDQUFDQyxNQUFILENBQVVDLE9BQVYsQ0FBa0IsYUFBbEIsRUFBZ0NGLEVBQUUsQ0FBQ0csTUFBbkMsRUFBMkMsVUFBVUMsS0FBVixFQUFpQkMsTUFBakIsRUFBd0I7QUFDL0QsUUFBSUQsS0FBSixFQUFVO0FBQ05KLE1BQUFBLEVBQUUsQ0FBQ0ksS0FBSCxDQUFTQSxLQUFUO0FB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Qjs7QUFDQXhDLElBQUFBLFFBQVEsQ0FBQ0MsTUFBVCxHQUFrQixJQUFsQjtBQUNIO0FBQ0osQ0FMRDs7QUFPQXdDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFlO0FBQ2J2QyxFQUFBQSxJQUFJLEVBQUpBO0FBRGEsQ0FBZiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsibGV0IHRpcEFsZXJ0ID0ge1xyXG4gICAgX2FsZXJ0OiBudWxsLCAgICAgICAgICAgLy9wcmVmYWJcclxuICAgIF9hbmltU3BlZWQ6IDAuMywgICAgICAgIC8v5by556qX5Yqo55S76YCf5bqmXHJcbn07XHJcbiBcclxuLyoqXHJcbiAqIEBwYXJhbSB0aXBTdHJcclxuICogQHBhcmFtIGxlZnRTdHJcclxuICogQHBhcmFtIHJpZ2h0U3RyXHJcbiAqIEBwYXJhbSBjYWxsYmFja1xyXG4gKi9cclxubGV0IHNob3cgPSBmdW5jdGlvbiAodGlwU3RyLGNhbGxiYWNrKSB7XHJcbiAgICBjYy5sb2FkZXIubG9hZFJlcyhcIkFsZXJ0L0FsZXJ0XCIsY2MuUHJlZmFiLCBmdW5jdGlvbiAoZXJyb3IsIHByZWZhYil7XHJcbiAgICAgICAgaWYgKGVycm9yKXtcclxuICAgICAgICAgICAgY2MuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRpcEFsZXJ0Ll9hbGVydCA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XHJcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZCh0aXBBbGVydC5fYWxlcnQsMyk7XHJcbiAgICAgICAgY2MuZmluZChcIkFsZXJ0L2JnL3RpdGxlXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gdGlwU3RyO1xyXG4gICAgICAgIGlmKGNhbGxiYWNrKXtcclxuICAgICAgICAgICAgY2MuZmluZChcIkFsZXJ0L2JnL29rXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgZGlzbWlzcygpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8v6K6+572ucGFyZW50IOS4uuW9k+WJjeWcuuaZr+eahENhbnZhcyDvvIxwb3NpdGlvbui3n+maj+eItuiKgueCuVxyXG4gICAgICAgIHRpcEFsZXJ0Ll9hbGVydC5wYXJlbnQgPSBjYy5maW5kKFwiQ2FudmFzXCIpO1xyXG4gICAgICAgIHN0YXJ0RmFkZUluKCk7XHJcbiAgICB9KTtcclxufTtcclxuIFxyXG4vLyDmiafooYzlvLnov5vliqjnlLtcclxubGV0IHN0YXJ0RmFkZUluID0gZnVuY3Rpb24gKCkge1xyXG4gICAgLy/liqjnlLtcclxuICAgIHRpcEFsZXJ0Ll9hbGVydC5zZXRTY2FsZSgyKTtcclxuICAgIHRpcEFsZXJ0Ll9hbGVydC5vcGFjaXR5ID0gMDtcclxuICAgIGxldCBjYkZhZGVJbiA9IGNjLmNhbGxGdW5jKG9uRmFkZUluRmluaXNoLCB0aGlzKTtcclxuICAgIGxldCBhY3Rpb25GYWRlSW4gPSBjYy5zZXF1ZW5jZShjYy5zcGF3bihjYy5mYWRlVG8odGlwQWxlcnQuX2FuaW1TcGVlZCwgMjU1KSwgY2Muc2NhbGVUbyh0aXBBbGVydC5fYW5pbVNwZWVkLCAxLjApKSwgY2JGYWRlSW4pO1xyXG4gICAgdGlwQWxlcnQuX2FsZXJ0LnJ1bkFjdGlvbihhY3Rpb25GYWRlSW4pO1xyXG59O1xyXG4gXHJcbiBcclxuLy8g5by56L+b5Yqo55S75a6M5oiQ5Zue6LCDXHJcbmxldCBvbkZhZGVJbkZpbmlzaCA9IGZ1bmN0aW9uICgpIHtcclxufTtcclxuIFxyXG4vLyDmiafooYzlvLnlh7rliqjnlLtcclxubGV0IGRpc21pc3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoIXRpcEFsZXJ0Ll9hbGVydCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBjYkZhZGVPdXQgPSBjYy5jYWxsRnVuYyhvbkZhZGVPdXRGaW5pc2gsIHRoaXMpO1xyXG4gICAgbGV0IGFjdGlvbkZhZGVPdXQgPSBjYy5zZXF1ZW5jZShjYy5zcGF3bihjYy5mYWRlVG8odGlwQWxlcnQuX2FuaW1TcGVlZCwgMCksIGNjLnNjYWxlVG8odGlwQWxlcnQuX2FuaW1TcGVlZCwgMi4wKSksIGNiRmFkZU91dCk7XHJcbiAgICB0aXBBbGVydC5fYWxlcnQucnVuQWN0aW9uKGFjdGlvbkZhZGVPdXQpO1xyXG59O1xyXG4gXHJcbi8vIOW8ueWHuuWKqOeUu+WujOaIkOWbnuiwg1xyXG5sZXQgb25GYWRlT3V0RmluaXNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgb25EZXN0cm95KCk7XHJcbn07XHJcbiBcclxubGV0IG9uRGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aXBBbGVydC5fYWxlcnQgIT0gbnVsbCkge1xyXG4gICAgICAgIHRpcEFsZXJ0Ll9hbGVydC5yZW1vdmVGcm9tUGFyZW50KCk7XHJcbiAgICAgICAgdGlwQWxlcnQuX2FsZXJ0ID0gbnVsbDtcclxuICAgIH1cclxufTtcclxuIFxyXG5tb2R1bGUuZXhwb3J0cz17XHJcbiAgc2hvd1xyXG59O1xyXG4iXX0=
//------QC-SOURCE-SPLIT------
