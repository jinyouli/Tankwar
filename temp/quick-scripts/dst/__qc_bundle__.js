
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
require('./assets/scripts/Zindex');

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
      //this.doubleFireBtn.getComponent(cc.Sprite).spriteFrame = this.doubleFireFrames[1];
      this.doubleFireBtn.opacity = 235;
    } else {
      //this.doubleFireBtn.getComponent(cc.Sprite).spriteFrame = this.doubleFireFrames[0];
      this.doubleFireBtn.opacity = 255;
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
        // this.mapLayer0.setTileGIDAt(0, 12, 25, 1);
        // this.mapLayer0.setTileGIDAt(0, 12, 24, 1);
        // this.mapLayer0.setTileGIDAt(0, 13, 25, 1);
        // this.mapLayer0.setTileGIDAt(0, 13, 24, 1);
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
      tank.position = this.bornPoses[this.bornPoses.length - 1]; //获取坦克控制组件

      var tankCtrl = tank.getComponent("TankScript"); //设置坦克属性

      tankCtrl.tankType = TankType.Player;
      tankCtrl.speed = this.tankSpeeds[this.tankSpeeds.length - 1];
      tankCtrl.fireTime = this.tankFireTimes[this.tankFireTimes.length - 1]; //tankCtrl.blood = this.tankBloods[this.tankBloods.length-1];
      //tankCtrl.blood = this.life ;

      tankCtrl.blood = 1;
      tankCtrl.die = false;
      tankCtrl.zIndex = -1;

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
      tankCtrl.zIndex = -1;

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

        if (this.doubleFire) {
          this.setDoubleFire();
        }
      } else {
        this.gameOver();
      }

      tank.getComponent("TankScript").blood = 1;
    } else {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQ2l0eVNjcmlwdC5qcyJdLCJuYW1lcyI6WyJUYW5rVHlwZSIsInJlcXVpcmUiLCJ0YW5rVHlwZSIsImFsZXJ0IiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJjdXJNYXAiLCJUaWxlZE1hcCIsInlhb2dhbiIsIk5vZGUiLCJidWxsZXQiLCJQcmVmYWIiLCJ0YW5rIiwidHlwZSIsIm1heENvdW50IiwibGlmZSIsImJvcm5Qb3NlcyIsIlZlYzIiLCJzcHJpdGVGcmFtZXMiLCJTcHJpdGVGcmFtZSIsInRhbmtTcGVlZHMiLCJGbG9hdCIsInRhbmtGaXJlVGltZXMiLCJ0YW5rQmxvb2RzIiwiSW50ZWdlciIsImVuZW15TnVtIiwiTGFiZWwiLCJsaWZlTnVtIiwiZG91YmxlRmlyZSIsImRvdWJsZUZpcmVCdG4iLCJkb3VibGVGaXJlRnJhbWVzIiwib25Mb2FkIiwiX2pveXN0aWNrQ3RybCIsImdldENvbXBvbmVudCIsIl90aWxlZE1hcCIsInN0cmluZyIsInN0YXJ0IiwiZXJyIiwiY3VyQW5nbGUiLCJzZWxmIiwicmVnaXN0ZXJJbnB1dEV2ZW50IiwiX3RpbGVkTWFwRGF0YSIsIl9jdXJNYXBUaWxlU2l6ZSIsImdldFRpbGVTaXplIiwiX2N1ck1hcFNpemUiLCJ2MiIsIm5vZGUiLCJ3aWR0aCIsImhlaWdodCIsImxvZyIsIm1hcExheWVyMCIsImdldExheWVyIiwiYnVsbGV0UG9vbCIsIk5vZGVQb29sIiwiaW5pdEJ1bGxldENvdW50IiwiaSIsImluc3RhbnRpYXRlIiwicHV0IiwidGFua1Bvb2wiLCJnYW1lRGF0YSIsInRlYW1JZCIsInNpbmdsZSIsInRhbmtMaXN0IiwiYnVsbGV0TGlzdCIsInRhbmtOb2RlIiwiZmluZCIsInBsYXllciIsImFkZFBsYXllclRhbmsiLCJfcGxheWVyVGFua0N0cmwiLCJzY2hlZHVsZSIsImFkZEFJVGFuayIsIm1hY3JvIiwiUkVQRUFUX0ZPUkVWRVIiLCJ1cGRhdGUiLCJkdCIsInN0YXJ0RmlyZSIsInNldERvdWJsZUZpcmUiLCJvcGFjaXR5IiwiYWRkSm95U3RpY2tUb3VjaENoYW5nZUxpc3RlbmVyIiwiYW5nbGUiLCJzdG9wTW92ZSIsInRhbmtNb3ZlU3RhcnQiLCJ0YW5rTW92ZVN0b3AiLCJzeXN0ZW1FdmVudCIsIm9uIiwiU3lzdGVtRXZlbnQiLCJFdmVudFR5cGUiLCJLRVlfRE9XTiIsImV2ZW50Iiwia2V5Q29kZSIsIktFWSIsInciLCJzIiwiYSIsImQiLCJrIiwiZmlyZUJ0bkNsaWNrIiwiS0VZX1VQIiwiY29sbGlzaW9uVGVzdCIsInJlY3QiLCJ4TWluIiwieCIsInhNYXgiLCJ5TWluIiwieSIsInlNYXgiLCJNaW5ZIiwiTWF4WSIsIk1pblgiLCJNYXhYIiwiTGVmdERvd24iLCJSaWdodERvd24iLCJMZWZ0VXAiLCJSaWdodFVwIiwiTWlkRG93biIsIk1pZFVwIiwiTWlkTGVmdCIsIk1pZFJpZ2h0IiwiX2NvbGxpc2lvblRlc3QiLCJwb2ludHMiLCJwb2ludCIsInNoaWZ0IiwiZ2lkIiwiZ2V0VGlsZUdJREF0IiwicGFyc2VJbnQiLCJnaWRUb1RpbGVUeXBlIiwidGlsZVR5cGUiLCJ0aWxlTm9uZSIsInRpbGVHcmFzcyIsInRpbGVXYWxsIiwic2V0VGlsZUdJREF0IiwidGlsZUtpbmciLCJnYW1lT3ZlciIsImxlbmd0aCIsInRhbmtDdHJsIiwidGFua1N0b3AiLCJzaG93IiwiY2FsbCIsImRpcmVjdG9yIiwibG9hZFNjZW5lIiwidGVhbSIsInNpemUiLCJnZXQiLCJTcHJpdGUiLCJzcHJpdGVGcmFtZSIsInBvc2l0aW9uIiwiUGxheWVyIiwic3BlZWQiLCJmaXJlVGltZSIsImJsb29kIiwiZGllIiwiekluZGV4IiwicGFyZW50IiwicHVzaCIsImluZGV4IiwiTWF0aCIsInJhbmRvbSIsImNvbGxpc2lvblRhbmsiLCJnZXRCb3VuZGluZ0JveCIsInRhbmtCb29tIiwidGFua051bSIsIk51bWJlciIsImN1ckxldmVsIiwiYXVkaW9FbmdpbmUiLCJwbGF5Iiwic2hvb3RBdWRpbyIsIm9uRGVzdHJveSIsInVuc2NoZWR1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsUUFBUSxHQUFHQyxPQUFPLENBQUMsVUFBRCxDQUFQLENBQW9CQyxRQUFuQzs7QUFDQSxJQUFJQyxLQUFLLEdBQUdGLE9BQU8sQ0FBQyxPQUFELENBQW5COztBQUdBRyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFFUjtBQUNBQyxJQUFBQSxNQUFNLEVBQUVKLEVBQUUsQ0FBQ0ssUUFISDtBQUlSO0FBQ0FDLElBQUFBLE1BQU0sRUFBRU4sRUFBRSxDQUFDTyxJQUxIO0FBT1I7QUFDQUMsSUFBQUEsTUFBTSxFQUFFUixFQUFFLENBQUNTLE1BUkg7QUFTUjtBQUNBQyxJQUFBQSxJQUFJLEVBQUU7QUFDRixpQkFBUyxJQURQO0FBRUZDLE1BQUFBLElBQUksRUFBRVgsRUFBRSxDQUFDUztBQUZQLEtBVkU7QUFjUjtBQUNBRyxJQUFBQSxRQUFRLEVBQUUsRUFmRjtBQWdCUkMsSUFBQUEsSUFBSSxFQUFFLENBaEJFO0FBaUJSO0FBQ0FDLElBQUFBLFNBQVMsRUFBRTtBQUNQLGlCQUFTLEVBREY7QUFFUEgsTUFBQUEsSUFBSSxFQUFFWCxFQUFFLENBQUNlO0FBRkYsS0FsQkg7QUFzQlI7QUFDQUMsSUFBQUEsWUFBWSxFQUFFO0FBQ1YsaUJBQVMsRUFEQztBQUVWTCxNQUFBQSxJQUFJLEVBQUVYLEVBQUUsQ0FBQ2lCO0FBRkMsS0F2Qk47QUEyQlI7QUFDQUMsSUFBQUEsVUFBVSxFQUFFO0FBQ1IsaUJBQVMsRUFERDtBQUVSUCxNQUFBQSxJQUFJLEVBQUVYLEVBQUUsQ0FBQ21CO0FBRkQsS0E1Qko7QUFnQ1I7QUFDQUMsSUFBQUEsYUFBYSxFQUFFO0FBQ1gsaUJBQVMsRUFERTtBQUVYVCxNQUFBQSxJQUFJLEVBQUVYLEVBQUUsQ0FBQ21CO0FBRkUsS0FqQ1A7QUFzQ1I7QUFDQUUsSUFBQUEsVUFBVSxFQUFFO0FBQ1IsaUJBQVMsRUFERDtBQUVSVixNQUFBQSxJQUFJLEVBQUVYLEVBQUUsQ0FBQ3NCO0FBRkQsS0F2Q0o7QUE0Q1JDLElBQUFBLFFBQVEsRUFBRTtBQUNOWixNQUFBQSxJQUFJLEVBQUVYLEVBQUUsQ0FBQ3dCLEtBREg7QUFFTixpQkFBUztBQUZILEtBNUNGO0FBZ0RSQyxJQUFBQSxPQUFPLEVBQUU7QUFDTGQsTUFBQUEsSUFBSSxFQUFFWCxFQUFFLENBQUN3QixLQURKO0FBRUwsaUJBQVM7QUFGSixLQWhERDtBQW9EUkUsSUFBQUEsVUFBVSxFQUFFLEtBcERKO0FBcURSQyxJQUFBQSxhQUFhLEVBQUU7QUFDWCxpQkFBUyxJQURFO0FBRVhoQixNQUFBQSxJQUFJLEVBQUVYLEVBQUUsQ0FBQ087QUFGRSxLQXJEUDtBQXlEUnFCLElBQUFBLGdCQUFnQixFQUFFO0FBQ2QsaUJBQVMsRUFESztBQUVkakIsTUFBQUEsSUFBSSxFQUFFWCxFQUFFLENBQUNpQjtBQUZLO0FBekRWLEdBSFA7QUFtRUw7QUFDQVksRUFBQUEsTUFBTSxFQUFFLGtCQUFZO0FBQ2hCO0FBQ0E7QUFDQSxTQUFLQyxhQUFMLEdBQXFCLEtBQUt4QixNQUFMLENBQVl5QixZQUFaLENBQXlCLGNBQXpCLENBQXJCLENBSGdCLENBSWhCOztBQUNBLFNBQUtDLFNBQUwsR0FBaUIsS0FBSzVCLE1BQUwsQ0FBWTJCLFlBQVosQ0FBeUIsYUFBekIsQ0FBakI7QUFDQSxTQUFLUixRQUFMLENBQWNVLE1BQWQsR0FBdUIsS0FBS3JCLFFBQUwsR0FBZ0IsRUFBdkM7QUFDQSxTQUFLYSxPQUFMLENBQWFRLE1BQWIsR0FBc0IsS0FBS3BCLElBQUwsR0FBWSxFQUFsQztBQUNILEdBNUVJO0FBOEVMcUIsRUFBQUEsS0FBSyxFQUFFLGVBQVNDLEdBQVQsRUFBYTtBQUNoQixRQUFHQSxHQUFILEVBQU87QUFDSDtBQUNILEtBSGUsQ0FLaEI7QUFFQTtBQUVBOzs7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBRUEsUUFBSUMsSUFBSSxHQUFHLElBQVgsQ0FaZ0IsQ0FhaEI7O0FBQ0EsU0FBS0Msa0JBQUwsR0FkZ0IsQ0FlaEI7O0FBQ0EsU0FBS0MsYUFBTCxHQUFxQjFDLE9BQU8sQ0FBQyxjQUFELENBQTVCLENBaEJnQixDQWtCaEI7O0FBQ0EsU0FBSzJDLGVBQUwsR0FBdUIsS0FBS1IsU0FBTCxDQUFlUyxXQUFmLEVBQXZCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQjFDLEVBQUUsQ0FBQzJDLEVBQUgsQ0FBTSxLQUFLWCxTQUFMLENBQWVZLElBQWYsQ0FBb0JDLEtBQTFCLEVBQWdDLEtBQUtiLFNBQUwsQ0FBZVksSUFBZixDQUFvQkUsTUFBcEQsQ0FBbkI7QUFDQTlDLElBQUFBLEVBQUUsQ0FBQytDLEdBQUgsQ0FBTywyQkFBMkIsS0FBS1AsZUFBdkM7QUFDQXhDLElBQUFBLEVBQUUsQ0FBQytDLEdBQUgsQ0FBTyx1QkFBdUIsS0FBS0wsV0FBbkMsRUF0QmdCLENBd0JoQjs7QUFDQSxTQUFLTSxTQUFMLEdBQWlCLEtBQUtoQixTQUFMLENBQWVpQixRQUFmLENBQXdCLFNBQXhCLENBQWpCLENBekJnQixDQTJCaEI7O0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixJQUFJbEQsRUFBRSxDQUFDbUQsUUFBUCxDQUFnQixjQUFoQixDQUFsQjtBQUNBLFFBQUlDLGVBQWUsR0FBRyxFQUF0Qjs7QUFDQSxTQUFJLElBQUlDLENBQUMsR0FBQyxDQUFWLEVBQWFBLENBQUMsR0FBQ0QsZUFBZixFQUFnQyxFQUFFQyxDQUFsQyxFQUFvQztBQUNoQyxVQUFJN0MsTUFBTSxHQUFHUixFQUFFLENBQUNzRCxXQUFILENBQWUsS0FBSzlDLE1BQXBCLENBQWI7QUFDQSxXQUFLMEMsVUFBTCxDQUFnQkssR0FBaEIsQ0FBb0IvQyxNQUFwQjtBQUNIOztBQUNELFNBQUtnRCxRQUFMLEdBQWdCLElBQUl4RCxFQUFFLENBQUNtRCxRQUFQLENBQWdCLFlBQWhCLENBQWhCOztBQUNBLFNBQUksSUFBSUUsQ0FBQyxHQUFDLENBQVYsRUFBYUEsQ0FBQyxHQUFDLEtBQUt6QyxRQUFwQixFQUE4QixFQUFFeUMsQ0FBaEMsRUFBa0M7QUFDOUIsVUFBSTNDLElBQUksR0FBR1YsRUFBRSxDQUFDc0QsV0FBSCxDQUFlLEtBQUs1QyxJQUFwQixDQUFYO0FBQ0EsV0FBSzhDLFFBQUwsQ0FBY0QsR0FBZCxDQUFrQjdDLElBQWxCO0FBQ0g7O0FBQ0QsUUFBRyxDQUFDVixFQUFFLENBQUN5RCxRQUFQLEVBQWdCO0FBQ1p6RCxNQUFBQSxFQUFFLENBQUN5RCxRQUFILEdBQWMsRUFBZDtBQUNILEtBekNlLENBMENoQjs7O0FBQ0F6RCxJQUFBQSxFQUFFLENBQUN5RCxRQUFILENBQVlDLE1BQVosR0FBcUIsQ0FBckIsQ0EzQ2dCLENBNENoQjs7QUFDQTFELElBQUFBLEVBQUUsQ0FBQ3lELFFBQUgsQ0FBWUUsTUFBWixHQUFxQixJQUFyQixDQTdDZ0IsQ0ErQ2hCOztBQUNBM0QsSUFBQUEsRUFBRSxDQUFDeUQsUUFBSCxDQUFZRyxRQUFaLEdBQXVCLEVBQXZCLENBaERnQixDQWlEaEI7O0FBQ0E1RCxJQUFBQSxFQUFFLENBQUN5RCxRQUFILENBQVlJLFVBQVosR0FBeUIsRUFBekIsQ0FsRGdCLENBb0RoQjs7QUFDQSxTQUFLQyxRQUFMLEdBQWdCOUQsRUFBRSxDQUFDK0QsSUFBSCxDQUFRLGFBQVIsQ0FBaEIsQ0FyRGdCLENBc0RoQjtBQUNBOztBQUNBLFNBQUtDLE1BQUwsR0FBYyxLQUFLQyxhQUFMLEVBQWQsQ0F4RGdCLENBeURoQjs7QUFDQSxTQUFLQyxlQUFMLEdBQXVCLEtBQUtGLE1BQUwsQ0FBWWpDLFlBQVosQ0FBeUIsWUFBekIsQ0FBdkIsQ0ExRGdCLENBNERoQjs7QUFDQSxTQUFLb0MsUUFBTCxDQUFjLEtBQUtDLFNBQW5CLEVBQTZCLENBQTdCLEVBQStCcEUsRUFBRSxDQUFDcUUsS0FBSCxDQUFTQyxjQUF4QyxFQUF1RCxDQUF2RDtBQUVILEdBN0lJO0FBK0lMO0FBQ0FDLEVBQUFBLE1BQU0sRUFBRSxnQkFBVUMsRUFBVixFQUFjO0FBQ2xCLFFBQUcsS0FBSzlDLFVBQVIsRUFBbUI7QUFDZixVQUFHLEtBQUt3QyxlQUFMLENBQXFCTyxTQUFyQixDQUErQixLQUFLdkIsVUFBcEMsQ0FBSCxFQUFtRCxDQUMvQztBQUNBO0FBQ0g7QUFDSjtBQUNKLEdBdkpJO0FBeUpMd0IsRUFBQUEsYUFBYSxFQUFFLHlCQUFZO0FBQ3ZCLFNBQUtoRCxVQUFMLEdBQWtCLENBQUMsS0FBS0EsVUFBeEI7O0FBRUEsUUFBRyxLQUFLQSxVQUFSLEVBQW1CO0FBQ2Y7QUFDQSxXQUFLQyxhQUFMLENBQW1CZ0QsT0FBbkIsR0FBNkIsR0FBN0I7QUFDSCxLQUhELE1BR0s7QUFDRDtBQUNBLFdBQUtoRCxhQUFMLENBQW1CZ0QsT0FBbkIsR0FBNkIsR0FBN0I7QUFDSDtBQUVKLEdBcEtJO0FBc0tMO0FBQ0FyQyxFQUFBQSxrQkFBa0IsRUFBRSw4QkFBWTtBQUU1QixRQUFJRCxJQUFJLEdBQUcsSUFBWDs7QUFFQSxTQUFLUCxhQUFMLENBQW1COEMsOEJBQW5CLENBQWtELFVBQVVDLEtBQVYsRUFBaUI7QUFFL0QsVUFBR0EsS0FBSyxJQUFJeEMsSUFBSSxDQUFDRCxRQUFkLElBQ0MsQ0FBQ0MsSUFBSSxDQUFDNkIsZUFBTCxDQUFxQlksUUFEMUIsRUFDb0M7QUFDaEM7QUFDSDs7QUFDRHpDLE1BQUFBLElBQUksQ0FBQ0QsUUFBTCxHQUFnQnlDLEtBQWhCOztBQUVBLFVBQUdBLEtBQUssSUFBRSxJQUFWLEVBQWU7QUFDWDtBQUNBeEMsUUFBQUEsSUFBSSxDQUFDNkIsZUFBTCxDQUFxQmEsYUFBckIsQ0FBbUNGLEtBQW5DO0FBQ0gsT0FIRCxNQUdNO0FBQ0Y7QUFDQXhDLFFBQUFBLElBQUksQ0FBQzZCLGVBQUwsQ0FBcUJjLFlBQXJCO0FBQ0g7QUFFSixLQWhCRCxFQUo0QixDQXFCNUI7OztBQUNBaEYsSUFBQUEsRUFBRSxDQUFDaUYsV0FBSCxDQUFlQyxFQUFmLENBQWtCbEYsRUFBRSxDQUFDbUYsV0FBSCxDQUFlQyxTQUFmLENBQXlCQyxRQUEzQyxFQUNnQixVQUFVQyxLQUFWLEVBQWlCO0FBQ2IsVUFBSVQsS0FBSyxHQUFHLElBQVo7O0FBQ0EsY0FBT1MsS0FBSyxDQUFDQyxPQUFiO0FBQ0ksYUFBS3ZGLEVBQUUsQ0FBQ3FFLEtBQUgsQ0FBU21CLEdBQVQsQ0FBYUMsQ0FBbEI7QUFDSVosVUFBQUEsS0FBSyxHQUFHLEVBQVI7QUFDQTs7QUFDSixhQUFLN0UsRUFBRSxDQUFDcUUsS0FBSCxDQUFTbUIsR0FBVCxDQUFhRSxDQUFsQjtBQUNJYixVQUFBQSxLQUFLLEdBQUcsR0FBUjtBQUNBOztBQUNKLGFBQUs3RSxFQUFFLENBQUNxRSxLQUFILENBQVNtQixHQUFULENBQWFHLENBQWxCO0FBQ0lkLFVBQUFBLEtBQUssR0FBRyxHQUFSO0FBQ0E7O0FBQ0osYUFBSzdFLEVBQUUsQ0FBQ3FFLEtBQUgsQ0FBU21CLEdBQVQsQ0FBYUksQ0FBbEI7QUFDSWYsVUFBQUEsS0FBSyxHQUFHLENBQVI7QUFDQTtBQVpSOztBQWNBLFVBQUdTLEtBQUssQ0FBQ0MsT0FBTixJQUFpQnZGLEVBQUUsQ0FBQ3FFLEtBQUgsQ0FBU21CLEdBQVQsQ0FBYUssQ0FBakMsRUFBbUM7QUFDL0IsYUFBS0MsWUFBTDtBQUNILE9BRkQsTUFFTTtBQUNGekQsUUFBQUEsSUFBSSxDQUFDNkIsZUFBTCxDQUFxQmMsWUFBckI7QUFDSDs7QUFDRCxVQUFHSCxLQUFLLElBQUUsSUFBVixFQUFlO0FBQ1g7QUFDQXhDLFFBQUFBLElBQUksQ0FBQzZCLGVBQUwsQ0FBcUJhLGFBQXJCLENBQW1DRixLQUFuQztBQUNIO0FBQ0osS0ExQmpCLEVBMEJtQixJQTFCbkIsRUF0QjRCLENBaUQ1Qjs7QUFDQTdFLElBQUFBLEVBQUUsQ0FBQ2lGLFdBQUgsQ0FBZUMsRUFBZixDQUFrQmxGLEVBQUUsQ0FBQ21GLFdBQUgsQ0FBZUMsU0FBZixDQUF5QlcsTUFBM0MsRUFDZ0IsVUFBVVQsS0FBVixFQUFnQjtBQUNaO0FBQ0EsVUFBR0EsS0FBSyxDQUFDQyxPQUFOLElBQWlCdkYsRUFBRSxDQUFDcUUsS0FBSCxDQUFTbUIsR0FBVCxDQUFhSyxDQUFqQyxFQUFtQztBQUMvQnhELFFBQUFBLElBQUksQ0FBQzZCLGVBQUwsQ0FBcUJjLFlBQXJCO0FBQ0g7QUFDSixLQU5qQixFQU1tQixJQU5uQjtBQVFILEdBak9JO0FBbU9MO0FBQ0FnQixFQUFBQSxhQUFhLEVBQUUsdUJBQVNDLElBQVQsRUFBZXpGLE1BQWYsRUFBc0I7QUFDakM7QUFDQSxRQUFJeUYsSUFBSSxDQUFDQyxJQUFMLElBQWEsQ0FBQyxLQUFLeEQsV0FBTCxDQUFpQnlELENBQWxCLEdBQW9CLENBQWpDLElBQXNDRixJQUFJLENBQUNHLElBQUwsSUFBYSxLQUFLMUQsV0FBTCxDQUFpQnlELENBQWpCLEdBQW1CLENBQXRFLElBQ05GLElBQUksQ0FBQ0ksSUFBTCxJQUFhLENBQUMsS0FBSzNELFdBQUwsQ0FBaUI0RCxDQUFsQixHQUFvQixDQUQzQixJQUNnQ0wsSUFBSSxDQUFDTSxJQUFMLElBQWEsS0FBSzdELFdBQUwsQ0FBaUI0RCxDQUFqQixHQUFtQixDQURwRSxFQUNzRTtBQUVsRSxhQUFPLElBQVA7QUFDSCxLQU5nQyxDQU9qQztBQUNBOzs7QUFDQSxRQUFJRSxJQUFJLEdBQUcsS0FBSzlELFdBQUwsQ0FBaUI0RCxDQUFqQixHQUFtQixDQUFuQixHQUF1QkwsSUFBSSxDQUFDSSxJQUF2QztBQUNILFFBQUlJLElBQUksR0FBRyxLQUFLL0QsV0FBTCxDQUFpQjRELENBQWpCLEdBQW1CLENBQW5CLEdBQXVCTCxJQUFJLENBQUNNLElBQXZDO0FBQ0csUUFBSUcsSUFBSSxHQUFHLEtBQUtoRSxXQUFMLENBQWlCeUQsQ0FBakIsR0FBbUIsQ0FBbkIsR0FBdUJGLElBQUksQ0FBQ0MsSUFBdkM7QUFDQSxRQUFJUyxJQUFJLEdBQUcsS0FBS2pFLFdBQUwsQ0FBaUJ5RCxDQUFqQixHQUFtQixDQUFuQixHQUF1QkYsSUFBSSxDQUFDRyxJQUF2QyxDQVppQyxDQWNqQzs7QUFDQSxRQUFJUSxRQUFRLEdBQUc1RyxFQUFFLENBQUMyQyxFQUFILENBQU0rRCxJQUFOLEVBQVlGLElBQVosQ0FBZjtBQUNBLFFBQUlLLFNBQVMsR0FBRzdHLEVBQUUsQ0FBQzJDLEVBQUgsQ0FBTWdFLElBQU4sRUFBWUgsSUFBWixDQUFoQjtBQUNBLFFBQUlNLE1BQU0sR0FBRzlHLEVBQUUsQ0FBQzJDLEVBQUgsQ0FBTStELElBQU4sRUFBWUQsSUFBWixDQUFiO0FBQ0EsUUFBSU0sT0FBTyxHQUFHL0csRUFBRSxDQUFDMkMsRUFBSCxDQUFNZ0UsSUFBTixFQUFZRixJQUFaLENBQWQsQ0FsQmlDLENBb0JqQzs7QUFDQSxRQUFJTyxPQUFPLEdBQUdoSCxFQUFFLENBQUMyQyxFQUFILENBQU0rRCxJQUFJLEdBQUMsQ0FBQ0MsSUFBSSxHQUFDRCxJQUFOLElBQVksQ0FBdkIsRUFBMEJGLElBQTFCLENBQWQ7QUFDQSxRQUFJUyxLQUFLLEdBQUdqSCxFQUFFLENBQUMyQyxFQUFILENBQU0rRCxJQUFJLEdBQUMsQ0FBQ0MsSUFBSSxHQUFDRCxJQUFOLElBQVksQ0FBdkIsRUFBMEJELElBQTFCLENBQVo7QUFDQSxRQUFJUyxPQUFPLEdBQUdsSCxFQUFFLENBQUMyQyxFQUFILENBQU0rRCxJQUFOLEVBQVlGLElBQUksR0FBQyxDQUFDQyxJQUFJLEdBQUNELElBQU4sSUFBWSxDQUE3QixDQUFkO0FBQ0EsUUFBSVcsUUFBUSxHQUFFbkgsRUFBRSxDQUFDMkMsRUFBSCxDQUFNZ0UsSUFBTixFQUFZSCxJQUFJLEdBQUMsQ0FBQ0MsSUFBSSxHQUFDRCxJQUFOLElBQVksQ0FBN0IsQ0FBZCxDQXhCaUMsQ0EwQmpDOztBQUNBLFdBQU8sS0FBS1ksY0FBTCxDQUFvQixDQUFDUixRQUFELEVBQVVDLFNBQVYsRUFBb0JDLE1BQXBCLEVBQTJCQyxPQUEzQixFQUNYQyxPQURXLEVBQ0hDLEtBREcsRUFDR0MsT0FESCxFQUNXQyxRQURYLENBQXBCLEVBRVMzRyxNQUZULENBQVA7QUFHSCxHQWxRSTtBQW9RTDtBQUNBNEcsRUFBQUEsY0FBYyxFQUFFLHdCQUFTQyxNQUFULEVBQWlCN0csTUFBakIsRUFBd0I7QUFDcEMsUUFBSThHLEtBQUssR0FBR0QsTUFBTSxDQUFDRSxLQUFQLEVBQVo7QUFDQSxRQUFJQyxHQUFHLEdBQUcsS0FBS3hFLFNBQUwsQ0FBZXlFLFlBQWYsQ0FBNEJ6SCxFQUFFLENBQUMyQyxFQUFILENBQU0rRSxRQUFRLENBQUNKLEtBQUssQ0FBQ25CLENBQU4sR0FBVSxLQUFLM0QsZUFBTCxDQUFxQkssS0FBaEMsQ0FBZCxFQUFxRDZFLFFBQVEsQ0FBQ0osS0FBSyxDQUFDaEIsQ0FBTixHQUFVLEtBQUs5RCxlQUFMLENBQXFCTSxNQUFoQyxDQUE3RCxDQUE1QixDQUFWOztBQUVBLFFBQUksS0FBS1AsYUFBTCxDQUFtQm9GLGFBQW5CLENBQWlDSCxHQUFqQyxLQUF5QyxLQUFLakYsYUFBTCxDQUFtQnFGLFFBQW5CLENBQTRCQyxRQUFyRSxJQUNBLEtBQUt0RixhQUFMLENBQW1Cb0YsYUFBbkIsQ0FBaUNILEdBQWpDLEtBQXlDLEtBQUtqRixhQUFMLENBQW1CcUYsUUFBbkIsQ0FBNEJFLFNBRHpFLEVBQ21GO0FBRy9FLFVBQUd0SCxNQUFNLElBQUksS0FBSytCLGFBQUwsQ0FBbUJvRixhQUFuQixDQUFpQ0gsR0FBakMsS0FBeUMsS0FBS2pGLGFBQUwsQ0FBbUJxRixRQUFuQixDQUE0QkcsUUFBbEYsRUFBMkY7QUFDdkYsYUFBSy9FLFNBQUwsQ0FBZWdGLFlBQWYsQ0FBNEIsQ0FBNUIsRUFBK0JOLFFBQVEsQ0FBQ0osS0FBSyxDQUFDbkIsQ0FBTixHQUFVLEtBQUszRCxlQUFMLENBQXFCSyxLQUFoQyxDQUF2QyxFQUE4RTZFLFFBQVEsQ0FBQ0osS0FBSyxDQUFDaEIsQ0FBTixHQUFVLEtBQUs5RCxlQUFMLENBQXFCTSxNQUFoQyxDQUF0RixFQUErSCxDQUEvSDtBQUNILE9BRkQsTUFHSyxJQUFHdEMsTUFBTSxJQUFJLEtBQUsrQixhQUFMLENBQW1Cb0YsYUFBbkIsQ0FBaUNILEdBQWpDLEtBQXlDLEtBQUtqRixhQUFMLENBQW1CcUYsUUFBbkIsQ0FBNEJLLFFBQWxGLEVBQTJGO0FBRTVGO0FBQ0E7QUFDQTtBQUNBO0FBRUEsYUFBS2pGLFNBQUwsQ0FBZWdGLFlBQWYsQ0FBNEIsQ0FBNUIsRUFBK0JOLFFBQVEsQ0FBQ0osS0FBSyxDQUFDbkIsQ0FBTixHQUFVLEtBQUszRCxlQUFMLENBQXFCSyxLQUFoQyxDQUF2QyxFQUE4RTZFLFFBQVEsQ0FBQ0osS0FBSyxDQUFDaEIsQ0FBTixHQUFVLEtBQUs5RCxlQUFMLENBQXFCTSxNQUFoQyxDQUF0RixFQUErSCxDQUEvSDtBQUVBLGFBQUtvRixRQUFMO0FBQ0g7O0FBQ0QsYUFBTyxJQUFQO0FBQ0g7O0FBQ0QsUUFBR2IsTUFBTSxDQUFDYyxNQUFQLEdBQWMsQ0FBakIsRUFBbUI7QUFDZixhQUFPLEtBQUtmLGNBQUwsQ0FBb0JDLE1BQXBCLEVBQTRCN0csTUFBNUIsQ0FBUDtBQUNILEtBRkQsTUFFSztBQUNELGFBQU8sS0FBUDtBQUNIO0FBQ0osR0FsU0k7QUFvU0wwSCxFQUFBQSxRQUFRLEVBQUUsb0JBQVU7QUFDaEIsU0FBS3hHLFVBQUwsR0FBa0IsS0FBbEI7O0FBQ0EsU0FBSSxJQUFJMkIsQ0FBQyxHQUFDLENBQVYsRUFBYUEsQ0FBQyxHQUFDckQsRUFBRSxDQUFDeUQsUUFBSCxDQUFZRyxRQUFaLENBQXFCdUUsTUFBcEMsRUFBNEM5RSxDQUFDLEVBQTdDLEVBQWdEO0FBQzVDLFVBQUkzQyxJQUFJLEdBQUdWLEVBQUUsQ0FBQ3lELFFBQUgsQ0FBWUcsUUFBWixDQUFxQlAsQ0FBckIsQ0FBWDtBQUNBLFVBQUkrRSxRQUFRLEdBQUcxSCxJQUFJLENBQUNxQixZQUFMLENBQWtCLFlBQWxCLENBQWY7QUFDQXFHLE1BQUFBLFFBQVEsQ0FBQ0MsUUFBVDtBQUNILEtBTmUsQ0FRaEI7OztBQUNBdEksSUFBQUEsS0FBSyxDQUFDdUksSUFBTixDQUFXQyxJQUFYLENBQWdCLElBQWhCLEVBQXNCLE1BQXRCLEVBQThCLFlBQVk7QUFDdEN2SSxNQUFBQSxFQUFFLENBQUN3SSxRQUFILENBQVlDLFNBQVosQ0FBc0IsWUFBdEI7QUFDSCxLQUZEO0FBR0gsR0FoVEk7QUFrVEw7QUFDQXhFLEVBQUFBLGFBQWEsRUFBRSx1QkFBU3lFLElBQVQsRUFBZTtBQUMxQixRQUFHLEtBQUtsRixRQUFMLENBQWNtRixJQUFkLEtBQXFCLENBQXhCLEVBQTBCO0FBQ3RCLFVBQUlqSSxJQUFJLEdBQUcsS0FBSzhDLFFBQUwsQ0FBY29GLEdBQWQsRUFBWDtBQUNBbEksTUFBQUEsSUFBSSxDQUFDcUIsWUFBTCxDQUFrQi9CLEVBQUUsQ0FBQzZJLE1BQXJCLEVBQTZCQyxXQUE3QixHQUEyQyxLQUFLOUgsWUFBTCxDQUFrQixLQUFLQSxZQUFMLENBQWtCbUgsTUFBbEIsR0FBeUIsQ0FBM0MsQ0FBM0M7QUFDQXpILE1BQUFBLElBQUksQ0FBQ3FJLFFBQUwsR0FBZ0IsS0FBS2pJLFNBQUwsQ0FBZSxLQUFLQSxTQUFMLENBQWVxSCxNQUFmLEdBQXNCLENBQXJDLENBQWhCLENBSHNCLENBSXRCOztBQUNBLFVBQUlDLFFBQVEsR0FBRzFILElBQUksQ0FBQ3FCLFlBQUwsQ0FBa0IsWUFBbEIsQ0FBZixDQUxzQixDQU10Qjs7QUFDQXFHLE1BQUFBLFFBQVEsQ0FBQ3RJLFFBQVQsR0FBb0JGLFFBQVEsQ0FBQ29KLE1BQTdCO0FBQ0FaLE1BQUFBLFFBQVEsQ0FBQ2EsS0FBVCxHQUFpQixLQUFLL0gsVUFBTCxDQUFnQixLQUFLQSxVQUFMLENBQWdCaUgsTUFBaEIsR0FBdUIsQ0FBdkMsQ0FBakI7QUFDQUMsTUFBQUEsUUFBUSxDQUFDYyxRQUFULEdBQW9CLEtBQUs5SCxhQUFMLENBQW1CLEtBQUtBLGFBQUwsQ0FBbUIrRyxNQUFuQixHQUEwQixDQUE3QyxDQUFwQixDQVRzQixDQVV0QjtBQUNBOztBQUNBQyxNQUFBQSxRQUFRLENBQUNlLEtBQVQsR0FBaUIsQ0FBakI7QUFDQWYsTUFBQUEsUUFBUSxDQUFDZ0IsR0FBVCxHQUFlLEtBQWY7QUFDQWhCLE1BQUFBLFFBQVEsQ0FBQ2lCLE1BQVQsR0FBa0IsQ0FBQyxDQUFuQjs7QUFFQSxVQUFHLENBQUNYLElBQUosRUFBUztBQUNMLFlBQUcxSSxFQUFFLENBQUN5RCxRQUFILENBQVlFLE1BQWYsRUFBc0I7QUFDbEI7QUFDQXlFLFVBQUFBLFFBQVEsQ0FBQ00sSUFBVCxHQUFnQixDQUFoQjtBQUNILFNBSEQsTUFHTTtBQUNGO0FBQ0FOLFVBQUFBLFFBQVEsQ0FBQ00sSUFBVCxHQUFnQixFQUFFMUksRUFBRSxDQUFDeUQsUUFBSCxDQUFZQyxNQUE5QjtBQUNIO0FBRUosT0FURCxNQVNNO0FBQ0Y7QUFDQTBFLFFBQUFBLFFBQVEsQ0FBQ00sSUFBVCxHQUFnQkEsSUFBaEI7QUFDSDs7QUFFRGhJLE1BQUFBLElBQUksQ0FBQzRJLE1BQUwsR0FBYyxLQUFLeEYsUUFBbkIsQ0E5QnNCLENBK0J0Qjs7QUFDQTlELE1BQUFBLEVBQUUsQ0FBQ3lELFFBQUgsQ0FBWUcsUUFBWixDQUFxQjJGLElBQXJCLENBQTBCN0ksSUFBMUI7QUFDQSxhQUFPQSxJQUFQO0FBQ0g7O0FBQ0QsV0FBTyxJQUFQO0FBQ0gsR0F4Vkk7QUEwVkw7QUFDQTBELEVBQUFBLFNBQVMsRUFBRSxtQkFBU0ksRUFBVCxFQUFha0UsSUFBYixFQUFtQjtBQUMxQixRQUFHLEtBQUtsRixRQUFMLENBQWNtRixJQUFkLEtBQXFCLENBQXJCLElBQTBCLEtBQUsvSCxRQUFMLEdBQWdCLENBQTdDLEVBQStDO0FBQzNDLFVBQUlGLElBQUksR0FBRyxLQUFLOEMsUUFBTCxDQUFjb0YsR0FBZCxFQUFYO0FBQ0EsVUFBSVksS0FBSyxHQUFHOUIsUUFBUSxDQUFDK0IsSUFBSSxDQUFDQyxNQUFMLEtBQWMsQ0FBZixFQUFrQixFQUFsQixDQUFwQixDQUYyQyxDQUczQzs7QUFDQSxVQUFJdEIsUUFBUSxHQUFHMUgsSUFBSSxDQUFDcUIsWUFBTCxDQUFrQixZQUFsQixDQUFmLENBSjJDLENBSzNDOztBQUNBckIsTUFBQUEsSUFBSSxDQUFDcUIsWUFBTCxDQUFrQi9CLEVBQUUsQ0FBQzZJLE1BQXJCLEVBQTZCQyxXQUE3QixHQUEyQyxLQUFLOUgsWUFBTCxDQUFrQndJLEtBQWxCLENBQTNDO0FBQ0E5SSxNQUFBQSxJQUFJLENBQUNxSSxRQUFMLEdBQWdCLEtBQUtqSSxTQUFMLENBQWUwSSxLQUFmLENBQWhCO0FBRUFwQixNQUFBQSxRQUFRLENBQUN0SSxRQUFULEdBQW9CMEosS0FBcEI7QUFDQXBCLE1BQUFBLFFBQVEsQ0FBQ2EsS0FBVCxHQUFpQixLQUFLL0gsVUFBTCxDQUFnQnNJLEtBQWhCLENBQWpCO0FBQ0FwQixNQUFBQSxRQUFRLENBQUNjLFFBQVQsR0FBb0IsS0FBSzlILGFBQUwsQ0FBbUJvSSxLQUFuQixDQUFwQjtBQUNBcEIsTUFBQUEsUUFBUSxDQUFDZSxLQUFULEdBQWlCLEtBQUs5SCxVQUFMLENBQWdCbUksS0FBaEIsQ0FBakI7QUFDQXBCLE1BQUFBLFFBQVEsQ0FBQ2dCLEdBQVQsR0FBZSxLQUFmO0FBQ0FoQixNQUFBQSxRQUFRLENBQUNpQixNQUFULEdBQWtCLENBQUMsQ0FBbkI7O0FBRUEsVUFBRyxDQUFDWCxJQUFKLEVBQVM7QUFDTCxZQUFHMUksRUFBRSxDQUFDeUQsUUFBSCxDQUFZRSxNQUFmLEVBQXNCO0FBQ2xCO0FBQ0F5RSxVQUFBQSxRQUFRLENBQUNNLElBQVQsR0FBZ0IsQ0FBaEI7QUFDSCxTQUhELE1BR007QUFDRjtBQUNBTixVQUFBQSxRQUFRLENBQUNNLElBQVQsR0FBZ0IsRUFBRTFJLEVBQUUsQ0FBQ3lELFFBQUgsQ0FBWUMsTUFBOUI7QUFDSDtBQUNKLE9BUkQsTUFRTTtBQUNGO0FBQ0EwRSxRQUFBQSxRQUFRLENBQUNNLElBQVQsR0FBZ0JBLElBQWhCO0FBQ0g7O0FBRUQsVUFBR2MsS0FBSyxJQUFJLENBQVosRUFBYztBQUNWOUksUUFBQUEsSUFBSSxDQUFDbUUsS0FBTCxHQUFhLEVBQWI7QUFDSCxPQUZELE1BRU0sSUFBRzJFLEtBQUssSUFBSSxDQUFaLEVBQWM7QUFDaEI5SSxRQUFBQSxJQUFJLENBQUNtRSxLQUFMLEdBQWEsR0FBYjtBQUNILE9BRkssTUFFQSxJQUFHMkUsS0FBSyxJQUFJLENBQVosRUFBYztBQUNoQjlJLFFBQUFBLElBQUksQ0FBQ21FLEtBQUwsR0FBYSxHQUFiO0FBQ0g7O0FBQ0QsVUFBR3VELFFBQVEsQ0FBQ3VCLGFBQVQsQ0FBdUJqSixJQUFJLENBQUNrSixjQUFMLEVBQXZCLENBQUgsRUFBaUQ7QUFDN0MsYUFBSSxJQUFJdkcsQ0FBQyxHQUFDLENBQVYsRUFBYUEsQ0FBQyxHQUFDLEtBQUt2QyxTQUFMLENBQWVxSCxNQUFmLEdBQXNCLENBQXJDLEVBQXdDOUUsQ0FBQyxFQUF6QyxFQUE0QztBQUN4QzNDLFVBQUFBLElBQUksQ0FBQ3FJLFFBQUwsR0FBZ0IsS0FBS2pJLFNBQUwsQ0FBZXVDLENBQWYsQ0FBaEI7O0FBQ0EsY0FBRyxDQUFDK0UsUUFBUSxDQUFDdUIsYUFBVCxDQUF1QmpKLElBQUksQ0FBQ2tKLGNBQUwsRUFBdkIsQ0FBSixFQUFrRDtBQUM5QztBQUNIO0FBQ0o7QUFDSjs7QUFFRGxKLE1BQUFBLElBQUksQ0FBQzRJLE1BQUwsR0FBYyxLQUFLeEYsUUFBbkIsQ0E3QzJDLENBOEMzQzs7QUFDQTlELE1BQUFBLEVBQUUsQ0FBQ3lELFFBQUgsQ0FBWUcsUUFBWixDQUFxQjJGLElBQXJCLENBQTBCN0ksSUFBMUI7QUFDQSxXQUFLRSxRQUFMO0FBQ0g7QUFDSixHQTlZSTtBQWdaTGlKLEVBQUFBLFFBQVEsRUFBRSxrQkFBU25KLElBQVQsRUFBZTtBQUNyQkEsSUFBQUEsSUFBSSxDQUFDNEksTUFBTCxHQUFjLElBQWQ7QUFDQTVJLElBQUFBLElBQUksQ0FBQ3FCLFlBQUwsQ0FBa0IsWUFBbEIsRUFBZ0NxSCxHQUFoQyxHQUFzQyxJQUF0QztBQUNBLFNBQUs1RixRQUFMLENBQWNELEdBQWQsQ0FBa0I3QyxJQUFsQjs7QUFDQSxRQUFHVixFQUFFLENBQUN5RCxRQUFILENBQVlFLE1BQVosSUFBc0JqRCxJQUFJLENBQUNxQixZQUFMLENBQWtCLFlBQWxCLEVBQWdDMkcsSUFBaEMsSUFBd0MsQ0FBakUsRUFBbUU7QUFDL0QsV0FBSzdILElBQUw7QUFDQSxXQUFLWSxPQUFMLENBQWFRLE1BQWIsR0FBc0IsS0FBS3BCLElBQUwsR0FBWSxFQUFsQzs7QUFFQSxVQUFHLEtBQUtBLElBQUwsR0FBWSxDQUFmLEVBQWlCO0FBQ2IsYUFBS29ELGFBQUw7O0FBQ0EsWUFBRyxLQUFLdkMsVUFBUixFQUFtQjtBQUNmLGVBQUtnRCxhQUFMO0FBQ0g7QUFDSixPQUxELE1BS0s7QUFDRCxhQUFLd0QsUUFBTDtBQUNIOztBQUNEeEgsTUFBQUEsSUFBSSxDQUFDcUIsWUFBTCxDQUFrQixZQUFsQixFQUFnQ29ILEtBQWhDLEdBQXdDLENBQXhDO0FBQ0gsS0FiRCxNQWNJO0FBQ0F6SSxNQUFBQSxJQUFJLENBQUM0SSxNQUFMLEdBQWMsSUFBZDtBQUNBNUksTUFBQUEsSUFBSSxDQUFDcUIsWUFBTCxDQUFrQixZQUFsQixFQUFnQ3FILEdBQWhDLEdBQXNDLElBQXRDO0FBQ0EsV0FBSzVGLFFBQUwsQ0FBY0QsR0FBZCxDQUFrQjdDLElBQWxCO0FBRUEsVUFBSW9KLE9BQU8sR0FBR0MsTUFBTSxDQUFDLEtBQUt4SSxRQUFMLENBQWNVLE1BQWYsQ0FBTixHQUErQixDQUE3QztBQUNBLFdBQUtWLFFBQUwsQ0FBY1UsTUFBZCxHQUF1QjZILE9BQU8sR0FBRyxFQUFqQzs7QUFDQSxVQUFHQSxPQUFPLElBQUksQ0FBZCxFQUFnQjtBQUNaLFlBQUc5SixFQUFFLENBQUN5RCxRQUFILENBQVl1RyxRQUFaLEdBQXVCLEVBQTFCLEVBQTZCO0FBQ3pCLFlBQUVoSyxFQUFFLENBQUN5RCxRQUFILENBQVl1RyxRQUFkO0FBQ0FoSyxVQUFBQSxFQUFFLENBQUN3SSxRQUFILENBQVlDLFNBQVosQ0FBc0IsY0FBYXpJLEVBQUUsQ0FBQ3lELFFBQUgsQ0FBWXVHLFFBQS9DO0FBQ0gsU0FIRCxNQUlJO0FBQ0EsZUFBS3RJLFVBQUwsR0FBa0IsS0FBbEI7QUFDQTNCLFVBQUFBLEtBQUssQ0FBQ3VJLElBQU4sQ0FBV0MsSUFBWCxDQUFnQixJQUFoQixFQUFzQixLQUF0QixFQUE2QixZQUFZO0FBQ3JDdkksWUFBQUEsRUFBRSxDQUFDd0ksUUFBSCxDQUFZQyxTQUFaLENBQXNCLFlBQXRCO0FBQ0gsV0FGRDtBQUdIO0FBQ0o7QUFDSjtBQUNKLEdBdGJJO0FBd2JMO0FBQ0EzQyxFQUFBQSxZQUFZLEVBQUUsd0JBQVU7QUFDcEIsUUFBRyxLQUFLNUIsZUFBTCxDQUFxQk8sU0FBckIsQ0FBK0IsS0FBS3ZCLFVBQXBDLENBQUgsRUFBbUQ7QUFDL0M7QUFDQWxELE1BQUFBLEVBQUUsQ0FBQ2lLLFdBQUgsQ0FBZUMsSUFBZixDQUFvQixLQUFLaEcsZUFBTCxDQUFxQmlHLFVBQXpDLEVBQXFELEtBQXJELEVBQTRELENBQTVEO0FBQ0g7QUFDSixHQTliSTtBQWdjTDtBQUNBQyxFQUFBQSxTQUFTLEVBQUUscUJBQVk7QUFDbkIsU0FBS0MsVUFBTCxDQUFnQixLQUFLakcsU0FBckIsRUFBK0IsSUFBL0I7QUFDSDtBQW5jSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgVGFua1R5cGUgPSByZXF1aXJlKFwiVGFua0RhdGFcIikudGFua1R5cGU7XHJcbmxldCBhbGVydCA9IHJlcXVpcmUoJ0FsZXJ0Jyk7XHJcblxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuXHJcbiAgICAgICAgLy/lnLDlm75cclxuICAgICAgICBjdXJNYXA6IGNjLlRpbGVkTWFwLFxyXG4gICAgICAgIC8v5pGH5p2GXHJcbiAgICAgICAgeWFvZ2FuOiBjYy5Ob2RlLFxyXG5cclxuICAgICAgICAvL+WtkOW8uemihOWItuS9k1xyXG4gICAgICAgIGJ1bGxldDogY2MuUHJlZmFiLFxyXG4gICAgICAgIC8v5Z2m5YWL6aKE5Yi25L2TXHJcbiAgICAgICAgdGFuazoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL+acgOWkp+aVsOmHj1xyXG4gICAgICAgIG1heENvdW50OiAxMCxcclxuICAgICAgICBsaWZlOiAzLFxyXG4gICAgICAgIC8v5Ye655Sf5ZywXHJcbiAgICAgICAgYm9yblBvc2VzOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5WZWMyLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/lnablhYvnmq7ogqRcclxuICAgICAgICBzcHJpdGVGcmFtZXM6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogW10sXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/lnablhYvnp7vliqjpgJ/luqZcclxuICAgICAgICB0YW5rU3BlZWRzOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5GbG9hdCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5Z2m5YWL5a2Q5by55Y+R5bCE6Ze06ZqU5pe26Ze0XHJcbiAgICAgICAgdGFua0ZpcmVUaW1lczoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcclxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXQsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy/lnablhYvooYDph49cclxuICAgICAgICB0YW5rQmxvb2RzOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXHJcbiAgICAgICAgZW5lbXlOdW06IHtcclxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsaWZlTnVtOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsLFxyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZG91YmxlRmlyZTogZmFsc2UsXHJcbiAgICAgICAgZG91YmxlRmlyZUJ0bjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkb3VibGVGaXJlRnJhbWVzOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBjYy5kaXJlY3Rvci5zZXREaXNwbGF5U3RhdHModHJ1ZSk7XHJcbiAgICAgICAgLy/ojrflj5bmkYfmnYbmjqfliLbnu4Tku7ZcclxuICAgICAgICB0aGlzLl9qb3lzdGlja0N0cmwgPSB0aGlzLnlhb2dhbi5nZXRDb21wb25lbnQoXCJKb3lzdGlja0N0cmxcIik7XHJcbiAgICAgICAgLy/ojrflj5blnLDlm74gVGlsZWRNYXAg57uE5Lu2XHJcbiAgICAgICAgdGhpcy5fdGlsZWRNYXAgPSB0aGlzLmN1ck1hcC5nZXRDb21wb25lbnQoJ2NjLlRpbGVkTWFwJyk7XHJcbiAgICAgICAgdGhpcy5lbmVteU51bS5zdHJpbmcgPSB0aGlzLm1heENvdW50ICsgXCJcIjtcclxuICAgICAgICB0aGlzLmxpZmVOdW0uc3RyaW5nID0gdGhpcy5saWZlICsgXCJcIjtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKGVycil7XHJcbiAgICAgICAgaWYoZXJyKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYWxlcnQuc2hvdy5jYWxsKHRoaXMsIFwi5YWz5Y2hXCIgKyBjYy5nYW1lRGF0YS5jdXJMZXZlbCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAvLyB9KTtcclxuXHJcbiAgICAgICAgLy/pu5jorqTop5LluqZcclxuICAgICAgICB0aGlzLmN1ckFuZ2xlID0gbnVsbDtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIC8v5rOo5YaM55uR5ZCs5LqL5Lu2XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlcklucHV0RXZlbnQoKTtcclxuICAgICAgICAvL+W8leWFpeWcsOWbvuaVsOaNrlxyXG4gICAgICAgIHRoaXMuX3RpbGVkTWFwRGF0YSA9IHJlcXVpcmUoXCJUaWxlZE1hcERhdGFcIik7XHJcblxyXG4gICAgICAgIC8v6I635Y+W5Zyw5Zu+5bC65a+4XHJcbiAgICAgICAgdGhpcy5fY3VyTWFwVGlsZVNpemUgPSB0aGlzLl90aWxlZE1hcC5nZXRUaWxlU2l6ZSgpO1xyXG4gICAgICAgIHRoaXMuX2N1ck1hcFNpemUgPSBjYy52Mih0aGlzLl90aWxlZE1hcC5ub2RlLndpZHRoLHRoaXMuX3RpbGVkTWFwLm5vZGUuaGVpZ2h0KTtcclxuICAgICAgICBjYy5sb2coXCJ0aGlzLl9jdXJNYXBUaWxlU2l6ZSA9XCIgKyB0aGlzLl9jdXJNYXBUaWxlU2l6ZSk7XHJcbiAgICAgICAgY2MubG9nKFwidGhpcy5fY3VyTWFwU2l6ZSA9XCIgKyB0aGlzLl9jdXJNYXBTaXplKTtcclxuICAgICAgICBcclxuICAgICAgICAvL+WcsOWbvuWimeWxglxyXG4gICAgICAgIHRoaXMubWFwTGF5ZXIwID0gdGhpcy5fdGlsZWRNYXAuZ2V0TGF5ZXIoXCJsYXllcl8wXCIpO1xyXG5cclxuICAgICAgICAvL+WIneWni+WMluWvueixoeaxoCjlj4LmlbDlv4XpobvkuLrlr7nlupTohJrmnKznmoTmlofku7blkI0pXHJcbiAgICAgICAgdGhpcy5idWxsZXRQb29sID0gbmV3IGNjLk5vZGVQb29sKFwiQnVsbGV0U2NyaXB0XCIpO1xyXG4gICAgICAgIHZhciBpbml0QnVsbGV0Q291bnQgPSAyMDtcclxuICAgICAgICBmb3IodmFyIGk9MDsgaTxpbml0QnVsbGV0Q291bnQ7ICsraSl7XHJcbiAgICAgICAgICAgIHZhciBidWxsZXQgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmJ1bGxldCk7XHJcbiAgICAgICAgICAgIHRoaXMuYnVsbGV0UG9vbC5wdXQoYnVsbGV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50YW5rUG9vbCA9IG5ldyBjYy5Ob2RlUG9vbChcIlRhbmtTY3JpcHRcIik7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8dGhpcy5tYXhDb3VudDsgKytpKXtcclxuICAgICAgICAgICAgdmFyIHRhbmsgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnRhbmspO1xyXG4gICAgICAgICAgICB0aGlzLnRhbmtQb29sLnB1dCh0YW5rKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIWNjLmdhbWVEYXRhKXtcclxuICAgICAgICAgICAgY2MuZ2FtZURhdGEgPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy/liJ3lp4vljJZcclxuICAgICAgICBjYy5nYW1lRGF0YS50ZWFtSWQgPSAwO1xyXG4gICAgICAgIC8v5Li05pe2XHJcbiAgICAgICAgY2MuZ2FtZURhdGEuc2luZ2xlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy/lnLDlm77lhoXlnablhYvliJfooahcclxuICAgICAgICBjYy5nYW1lRGF0YS50YW5rTGlzdCA9IFtdO1xyXG4gICAgICAgIC8v5Zyw5Zu+5YaF5a2Q5by55YiX6KGoXHJcbiAgICAgICAgY2MuZ2FtZURhdGEuYnVsbGV0TGlzdCA9IFtdO1xyXG5cclxuICAgICAgICAvL+iOt+WPlue7hOS7tlxyXG4gICAgICAgIHRoaXMudGFua05vZGUgPSBjYy5maW5kKFwiL0NhbnZhcy9NYXBcIik7XHJcbiAgICAgICAgLy90aGlzLnRhbmtOb2RlID0gY2MuZmluZChcIi9DYW52YXMvbWFwMS9sYXllcjBcIik7XHJcbiAgICAgICAgLy/liqDlhaVwbGF5ZXJcclxuICAgICAgICB0aGlzLnBsYXllciA9IHRoaXMuYWRkUGxheWVyVGFuaygpO1xyXG4gICAgICAgIC8v6I635Y+W5Z2m5YWL5o6n5Yi257uE5Lu2XHJcbiAgICAgICAgdGhpcy5fcGxheWVyVGFua0N0cmwgPSB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJUYW5rU2NyaXB0XCIpOyBcclxuXHJcbiAgICAgICAgLy/lkK/liqjlrprml7blmajvvIzmt7vliqDlnablhYtcclxuICAgICAgICB0aGlzLnNjaGVkdWxlKHRoaXMuYWRkQUlUYW5rLDMsY2MubWFjcm8uUkVQRUFUX0ZPUkVWRVIsMSk7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgICAgIGlmKHRoaXMuZG91YmxlRmlyZSl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX3BsYXllclRhbmtDdHJsLnN0YXJ0RmlyZSh0aGlzLmJ1bGxldFBvb2wpKXtcclxuICAgICAgICAgICAgICAgIC8v5pKt5pS+5bCE5Ye76Z+z5pWIXHJcbiAgICAgICAgICAgICAgICAvL2NjLmF1ZGlvRW5naW5lLnBsYXkodGhpcy5fcGxheWVyVGFua0N0cmwuc2hvb3RBdWRpbywgZmFsc2UsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzZXREb3VibGVGaXJlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5kb3VibGVGaXJlID0gIXRoaXMuZG91YmxlRmlyZTtcclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLmRvdWJsZUZpcmUpe1xyXG4gICAgICAgICAgICAvL3RoaXMuZG91YmxlRmlyZUJ0bi5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IHRoaXMuZG91YmxlRmlyZUZyYW1lc1sxXTtcclxuICAgICAgICAgICAgdGhpcy5kb3VibGVGaXJlQnRuLm9wYWNpdHkgPSAyMzVcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgLy90aGlzLmRvdWJsZUZpcmVCdG4uZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSB0aGlzLmRvdWJsZUZpcmVGcmFtZXNbMF07XHJcbiAgICAgICAgICAgIHRoaXMuZG91YmxlRmlyZUJ0bi5vcGFjaXR5ID0gMjU1XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICAvL+azqOWGjOi+k+WFpeS6i+S7tlxyXG4gICAgcmVnaXN0ZXJJbnB1dEV2ZW50OiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5fam95c3RpY2tDdHJsLmFkZEpveVN0aWNrVG91Y2hDaGFuZ2VMaXN0ZW5lcihmdW5jdGlvbiAoYW5nbGUpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKGFuZ2xlID09IHNlbGYuY3VyQW5nbGUgJiZcclxuICAgICAgICAgICAgICAgICFzZWxmLl9wbGF5ZXJUYW5rQ3RybC5zdG9wTW92ZSApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlbGYuY3VyQW5nbGUgPSBhbmdsZTtcclxuXHJcbiAgICAgICAgICAgIGlmKGFuZ2xlIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIC8v5byA5aeL5YmN6L+bXHJcbiAgICAgICAgICAgICAgICBzZWxmLl9wbGF5ZXJUYW5rQ3RybC50YW5rTW92ZVN0YXJ0KGFuZ2xlKTtcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy/lgZzmraLliY3ov5tcclxuICAgICAgICAgICAgICAgIHNlbGYuX3BsYXllclRhbmtDdHJsLnRhbmtNb3ZlU3RvcCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8v5oyJ6ZSu5oyJ5LiLXHJcbiAgICAgICAgY2Muc3lzdGVtRXZlbnQub24oY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYW5nbGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoKGV2ZW50LmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS53OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmdsZSA9IDkwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5zOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmdsZSA9IDI3MDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkuYTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGUgPSAxODA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgY2MubWFjcm8uS0VZLmQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ2xlID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihldmVudC5rZXlDb2RlID09IGNjLm1hY3JvLktFWS5rKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmVCdG5DbGljaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3BsYXllclRhbmtDdHJsLnRhbmtNb3ZlU3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoYW5nbGUhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5byA5aeL5YmN6L+bXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fcGxheWVyVGFua0N0cmwudGFua01vdmVTdGFydChhbmdsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgIC8v5oyJ6ZSu5oqs6LW3XHJcbiAgICAgICAgY2Muc3lzdGVtRXZlbnQub24oY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9VUCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChldmVudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WBnOatouWJjei/m1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZXZlbnQua2V5Q29kZSAhPSBjYy5tYWNyby5LRVkuayl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fcGxheWVyVGFua0N0cmwudGFua01vdmVTdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy/norDmkp7mo4DmtYtcclxuICAgIGNvbGxpc2lvblRlc3Q6IGZ1bmN0aW9uKHJlY3QsIGJ1bGxldCl7XHJcbiAgICAgICAgLy/liKTmlq3mmK/lkKbnorDliLDlnLDlm77ovrnnlYxcclxuICAgICAgICBpZiAocmVjdC54TWluIDw9IC10aGlzLl9jdXJNYXBTaXplLngvMiB8fCByZWN0LnhNYXggPj0gdGhpcy5fY3VyTWFwU2l6ZS54LzIgfHxcclxuXHRcdCAgICByZWN0LnlNaW4gPD0gLXRoaXMuX2N1ck1hcFNpemUueS8yIHx8IHJlY3QueU1heCA+PSB0aGlzLl9jdXJNYXBTaXplLnkvMil7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8v5Yik5pat5piv5ZCm5pKe5aKZXHJcbiAgICAgICAgLy/lsIblnZDmoIfovazmjaLkuLrlnLDlm77lnZDmoIfns7tcclxuICAgICAgICB2YXIgTWluWSA9IHRoaXMuX2N1ck1hcFNpemUueS8yIC0gcmVjdC55TWluO1xyXG5cdCAgICB2YXIgTWF4WSA9IHRoaXMuX2N1ck1hcFNpemUueS8yIC0gcmVjdC55TWF4O1xyXG4gICAgICAgIHZhciBNaW5YID0gdGhpcy5fY3VyTWFwU2l6ZS54LzIgKyByZWN0LnhNaW47XHJcbiAgICAgICAgdmFyIE1heFggPSB0aGlzLl9jdXJNYXBTaXplLngvMiArIHJlY3QueE1heDtcclxuXHJcbiAgICAgICAgLy/ojrflj5blm5vkuKrop5LnmoTpobbngrlcclxuICAgICAgICB2YXIgTGVmdERvd24gPSBjYy52MihNaW5YLCBNaW5ZKTtcclxuICAgICAgICB2YXIgUmlnaHREb3duID0gY2MudjIoTWF4WCwgTWluWSk7XHJcbiAgICAgICAgdmFyIExlZnRVcCA9IGNjLnYyKE1pblgsIE1heFkpO1xyXG4gICAgICAgIHZhciBSaWdodFVwID0gY2MudjIoTWF4WCwgTWF4WSk7XHJcblxyXG4gICAgICAgIC8v6I635Y+W5Zub5p2h6L6555qE5Lit5b+D54K5XHJcbiAgICAgICAgdmFyIE1pZERvd24gPSBjYy52MihNaW5YKyhNYXhYLU1pblgpLzIsIE1pblkpO1xyXG4gICAgICAgIHZhciBNaWRVcCA9IGNjLnYyKE1pblgrKE1heFgtTWluWCkvMiwgTWF4WSk7XHJcbiAgICAgICAgdmFyIE1pZExlZnQgPSBjYy52MihNaW5YLCBNaW5ZKyhNYXhZLU1pblkpLzIpO1xyXG4gICAgICAgIHZhciBNaWRSaWdodD0gY2MudjIoTWF4WCwgTWluWSsoTWF4WS1NaW5ZKS8yKTtcclxuXHJcbiAgICAgICAgLy/mo4DmtYvnorDmkp5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGlzaW9uVGVzdChbTGVmdERvd24sUmlnaHREb3duLExlZnRVcCxSaWdodFVwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBNaWREb3duLE1pZFVwLE1pZExlZnQsTWlkUmlnaHRdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWxsZXQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+WGhemDqOeisOaSnuajgOa1i+aWueazlVxyXG4gICAgX2NvbGxpc2lvblRlc3Q6IGZ1bmN0aW9uKHBvaW50cywgYnVsbGV0KXtcclxuICAgICAgICB2YXIgcG9pbnQgPSBwb2ludHMuc2hpZnQoKVxyXG4gICAgICAgIHZhciBnaWQgPSB0aGlzLm1hcExheWVyMC5nZXRUaWxlR0lEQXQoY2MudjIocGFyc2VJbnQocG9pbnQueCAvIHRoaXMuX2N1ck1hcFRpbGVTaXplLndpZHRoKSxwYXJzZUludChwb2ludC55IC8gdGhpcy5fY3VyTWFwVGlsZVNpemUuaGVpZ2h0KSkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fdGlsZWRNYXBEYXRhLmdpZFRvVGlsZVR5cGVbZ2lkXSAhPSB0aGlzLl90aWxlZE1hcERhdGEudGlsZVR5cGUudGlsZU5vbmUgJiYgXHJcbiAgICAgICAgICAgIHRoaXMuX3RpbGVkTWFwRGF0YS5naWRUb1RpbGVUeXBlW2dpZF0gIT0gdGhpcy5fdGlsZWRNYXBEYXRhLnRpbGVUeXBlLnRpbGVHcmFzcyl7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYoYnVsbGV0ICYmIHRoaXMuX3RpbGVkTWFwRGF0YS5naWRUb1RpbGVUeXBlW2dpZF0gPT0gdGhpcy5fdGlsZWRNYXBEYXRhLnRpbGVUeXBlLnRpbGVXYWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMubWFwTGF5ZXIwLnNldFRpbGVHSURBdCgwLCBwYXJzZUludChwb2ludC54IC8gdGhpcy5fY3VyTWFwVGlsZVNpemUud2lkdGgpLHBhcnNlSW50KHBvaW50LnkgLyB0aGlzLl9jdXJNYXBUaWxlU2l6ZS5oZWlnaHQpLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGJ1bGxldCAmJiB0aGlzLl90aWxlZE1hcERhdGEuZ2lkVG9UaWxlVHlwZVtnaWRdID09IHRoaXMuX3RpbGVkTWFwRGF0YS50aWxlVHlwZS50aWxlS2luZyl7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMubWFwTGF5ZXIwLnNldFRpbGVHSURBdCgwLCAxMiwgMjUsIDEpO1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5tYXBMYXllcjAuc2V0VGlsZUdJREF0KDAsIDEyLCAyNCwgMSk7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLm1hcExheWVyMC5zZXRUaWxlR0lEQXQoMCwgMTMsIDI1LCAxKTtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMubWFwTGF5ZXIwLnNldFRpbGVHSURBdCgwLCAxMywgMjQsIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMubWFwTGF5ZXIwLnNldFRpbGVHSURBdCgwLCBwYXJzZUludChwb2ludC54IC8gdGhpcy5fY3VyTWFwVGlsZVNpemUud2lkdGgpLHBhcnNlSW50KHBvaW50LnkgLyB0aGlzLl9jdXJNYXBUaWxlU2l6ZS5oZWlnaHQpLCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVPdmVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHBvaW50cy5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xsaXNpb25UZXN0KHBvaW50cywgYnVsbGV0KTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgZ2FtZU92ZXI6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5kb3VibGVGaXJlID0gZmFsc2U7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8Y2MuZ2FtZURhdGEudGFua0xpc3QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICB2YXIgdGFuayA9IGNjLmdhbWVEYXRhLnRhbmtMaXN0W2ldXHJcbiAgICAgICAgICAgIHZhciB0YW5rQ3RybCA9IHRhbmsuZ2V0Q29tcG9uZW50KFwiVGFua1NjcmlwdFwiKTtcclxuICAgICAgICAgICAgdGFua0N0cmwudGFua1N0b3AoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5by556qX6LCD55SoXHJcbiAgICAgICAgYWxlcnQuc2hvdy5jYWxsKHRoaXMsIFwi5ri45oiP57uT5p2fXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiU3RhcnRTY2VuZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLy/liqDlhaXnjqnlrrblnablhYtcclxuICAgIGFkZFBsYXllclRhbms6IGZ1bmN0aW9uKHRlYW0pIHtcclxuICAgICAgICBpZih0aGlzLnRhbmtQb29sLnNpemUoKT4wKXtcclxuICAgICAgICAgICAgdmFyIHRhbmsgPSB0aGlzLnRhbmtQb29sLmdldCgpO1xyXG4gICAgICAgICAgICB0YW5rLmdldENvbXBvbmVudChjYy5TcHJpdGUpLnNwcml0ZUZyYW1lID0gdGhpcy5zcHJpdGVGcmFtZXNbdGhpcy5zcHJpdGVGcmFtZXMubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICB0YW5rLnBvc2l0aW9uID0gdGhpcy5ib3JuUG9zZXNbdGhpcy5ib3JuUG9zZXMubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICAvL+iOt+WPluWdpuWFi+aOp+WItue7hOS7tlxyXG4gICAgICAgICAgICB2YXIgdGFua0N0cmwgPSB0YW5rLmdldENvbXBvbmVudChcIlRhbmtTY3JpcHRcIik7XHJcbiAgICAgICAgICAgIC8v6K6+572u5Z2m5YWL5bGe5oCnXHJcbiAgICAgICAgICAgIHRhbmtDdHJsLnRhbmtUeXBlID0gVGFua1R5cGUuUGxheWVyO1xyXG4gICAgICAgICAgICB0YW5rQ3RybC5zcGVlZCA9IHRoaXMudGFua1NwZWVkc1t0aGlzLnRhbmtTcGVlZHMubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICB0YW5rQ3RybC5maXJlVGltZSA9IHRoaXMudGFua0ZpcmVUaW1lc1t0aGlzLnRhbmtGaXJlVGltZXMubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICAvL3RhbmtDdHJsLmJsb29kID0gdGhpcy50YW5rQmxvb2RzW3RoaXMudGFua0Jsb29kcy5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgIC8vdGFua0N0cmwuYmxvb2QgPSB0aGlzLmxpZmUgO1xyXG4gICAgICAgICAgICB0YW5rQ3RybC5ibG9vZCA9IDE7XHJcbiAgICAgICAgICAgIHRhbmtDdHJsLmRpZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0YW5rQ3RybC56SW5kZXggPSAtMTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKCF0ZWFtKXtcclxuICAgICAgICAgICAgICAgIGlmKGNjLmdhbWVEYXRhLnNpbmdsZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/ljZXmnLrniYhcclxuICAgICAgICAgICAgICAgICAgICB0YW5rQ3RybC50ZWFtID0gMDtcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+Wkp+S5seaWl1xyXG4gICAgICAgICAgICAgICAgICAgIHRhbmtDdHJsLnRlYW0gPSArK2NjLmdhbWVEYXRhLnRlYW1JZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvL+e7hOmYn1xyXG4gICAgICAgICAgICAgICAgdGFua0N0cmwudGVhbSA9IHRlYW07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRhbmsucGFyZW50ID0gdGhpcy50YW5rTm9kZTtcclxuICAgICAgICAgICAgLy/liqDliLDliJfooahcclxuICAgICAgICAgICAgY2MuZ2FtZURhdGEudGFua0xpc3QucHVzaCh0YW5rKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRhbms7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+WKoOWFpUFJXHJcbiAgICBhZGRBSVRhbms6IGZ1bmN0aW9uKGR0LCB0ZWFtKSB7XHJcbiAgICAgICAgaWYodGhpcy50YW5rUG9vbC5zaXplKCk+MCAmJiB0aGlzLm1heENvdW50ID4gMCl7XHJcbiAgICAgICAgICAgIHZhciB0YW5rID0gdGhpcy50YW5rUG9vbC5nZXQoKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoTWF0aC5yYW5kb20oKSozLCAxMCk7XHJcbiAgICAgICAgICAgIC8v6I635Y+W5Z2m5YWL5o6n5Yi257uE5Lu2XHJcbiAgICAgICAgICAgIHZhciB0YW5rQ3RybCA9IHRhbmsuZ2V0Q29tcG9uZW50KFwiVGFua1NjcmlwdFwiKTtcclxuICAgICAgICAgICAgLy/orr7nva7lnablhYvlsZ7mgKdcclxuICAgICAgICAgICAgdGFuay5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IHRoaXMuc3ByaXRlRnJhbWVzW2luZGV4XTtcclxuICAgICAgICAgICAgdGFuay5wb3NpdGlvbiA9IHRoaXMuYm9yblBvc2VzW2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgIHRhbmtDdHJsLnRhbmtUeXBlID0gaW5kZXg7XHJcbiAgICAgICAgICAgIHRhbmtDdHJsLnNwZWVkID0gdGhpcy50YW5rU3BlZWRzW2luZGV4XTtcclxuICAgICAgICAgICAgdGFua0N0cmwuZmlyZVRpbWUgPSB0aGlzLnRhbmtGaXJlVGltZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICB0YW5rQ3RybC5ibG9vZCA9IHRoaXMudGFua0Jsb29kc1tpbmRleF07XHJcbiAgICAgICAgICAgIHRhbmtDdHJsLmRpZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0YW5rQ3RybC56SW5kZXggPSAtMTtcclxuXHJcbiAgICAgICAgICAgIGlmKCF0ZWFtKXtcclxuICAgICAgICAgICAgICAgIGlmKGNjLmdhbWVEYXRhLnNpbmdsZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/ljZXmnLrniYhcclxuICAgICAgICAgICAgICAgICAgICB0YW5rQ3RybC50ZWFtID0gMTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+Wkp+S5seaWl1xyXG4gICAgICAgICAgICAgICAgICAgIHRhbmtDdHJsLnRlYW0gPSArK2NjLmdhbWVEYXRhLnRlYW1JZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy/nu4TpmJ9cclxuICAgICAgICAgICAgICAgIHRhbmtDdHJsLnRlYW0gPSB0ZWFtO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleCA9PSAwKXtcclxuICAgICAgICAgICAgICAgIHRhbmsuYW5nbGUgPSA5MDtcclxuICAgICAgICAgICAgfWVsc2UgaWYoaW5kZXggPT0gMSl7XHJcbiAgICAgICAgICAgICAgICB0YW5rLmFuZ2xlID0gMTgwO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZihpbmRleCA9PSAyKXtcclxuICAgICAgICAgICAgICAgIHRhbmsuYW5nbGUgPSAyNzA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGFua0N0cmwuY29sbGlzaW9uVGFuayh0YW5rLmdldEJvdW5kaW5nQm94KCkpKXtcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPHRoaXMuYm9yblBvc2VzLmxlbmd0aC0xOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIHRhbmsucG9zaXRpb24gPSB0aGlzLmJvcm5Qb3Nlc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZighdGFua0N0cmwuY29sbGlzaW9uVGFuayh0YW5rLmdldEJvdW5kaW5nQm94KCkpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0YW5rLnBhcmVudCA9IHRoaXMudGFua05vZGU7XHJcbiAgICAgICAgICAgIC8v5Yqg5Yiw5YiX6KGoXHJcbiAgICAgICAgICAgIGNjLmdhbWVEYXRhLnRhbmtMaXN0LnB1c2godGFuayk7XHJcbiAgICAgICAgICAgIHRoaXMubWF4Q291bnQgLS07XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICB0YW5rQm9vbTogZnVuY3Rpb24odGFuaykge1xyXG4gICAgICAgIHRhbmsucGFyZW50ID0gbnVsbDtcclxuICAgICAgICB0YW5rLmdldENvbXBvbmVudChcIlRhbmtTY3JpcHRcIikuZGllID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnRhbmtQb29sLnB1dCh0YW5rKTtcclxuICAgICAgICBpZihjYy5nYW1lRGF0YS5zaW5nbGUgJiYgdGFuay5nZXRDb21wb25lbnQoXCJUYW5rU2NyaXB0XCIpLnRlYW0gPT0gMCl7XHJcbiAgICAgICAgICAgIHRoaXMubGlmZSAtLTtcclxuICAgICAgICAgICAgdGhpcy5saWZlTnVtLnN0cmluZyA9IHRoaXMubGlmZSArIFwiXCI7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmxpZmUgPiAwKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkUGxheWVyVGFuaygpO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5kb3VibGVGaXJlKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERvdWJsZUZpcmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVPdmVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGFuay5nZXRDb21wb25lbnQoXCJUYW5rU2NyaXB0XCIpLmJsb29kID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGFuay5wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgICAgICB0YW5rLmdldENvbXBvbmVudChcIlRhbmtTY3JpcHRcIikuZGllID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy50YW5rUG9vbC5wdXQodGFuayk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGFua051bSA9IE51bWJlcih0aGlzLmVuZW15TnVtLnN0cmluZykgLSAxO1xyXG4gICAgICAgICAgICB0aGlzLmVuZW15TnVtLnN0cmluZyA9IHRhbmtOdW0gKyBcIlwiO1xyXG4gICAgICAgICAgICBpZih0YW5rTnVtID09IDApe1xyXG4gICAgICAgICAgICAgICAgaWYoY2MuZ2FtZURhdGEuY3VyTGV2ZWwgPCAxMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgKytjYy5nYW1lRGF0YS5jdXJMZXZlbDtcclxuICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJDaXR5U2NlbmVcIisgY2MuZ2FtZURhdGEuY3VyTGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvdWJsZUZpcmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydC5zaG93LmNhbGwodGhpcywgXCLkvaDotaLkuoZcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJTdGFydFNjZW5lXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL+W8gOeBq+aMiemSrueCueWHu1xyXG4gICAgZmlyZUJ0bkNsaWNrOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKHRoaXMuX3BsYXllclRhbmtDdHJsLnN0YXJ0RmlyZSh0aGlzLmJ1bGxldFBvb2wpKXtcclxuICAgICAgICAgICAgLy/mkq3mlL7lsITlh7vpn7PmlYhcclxuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheSh0aGlzLl9wbGF5ZXJUYW5rQ3RybC5zaG9vdEF1ZGlvLCBmYWxzZSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL+mUgOavgeaXtuiwg+eUqFxyXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlKHRoaXMuYWRkQUlUYW5rLHRoaXMpO1xyXG4gICAgfSxcclxufSk7XHJcbiJdfQ==
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
    this.node.opacity = 255;
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
        //this.node.opacity = 50
        this.node.opacity = 255; //摇杆恢复位置

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
    //this.node.opacity = 50
    this.node.opacity = 255; //如果触摸类型为FOLLOW，离开触摸后隐藏

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcam95c3RpY2tcXHNjcmlwdHNcXEpveXN0aWNrQ3RybC5qcyJdLCJuYW1lcyI6WyJUb3VjaFR5cGUiLCJjYyIsIkVudW0iLCJERUZBVUxUIiwiRk9MTE9XIiwiRGlyZWN0aW9uVHlwZSIsIkZPVVIiLCJFSUdIVCIsIkFMTCIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImpveXN0aWNrQmFyIiwidHlwZSIsIk5vZGUiLCJqb3lzdGlja0JHIiwicmFkaXVzIiwidG91Y2hUeXBlIiwiZGlyZWN0aW9uVHlwZSIsImN1ckFuZ2xlIiwidmlzaWJsZSIsImRpc3RhbmNlIiwib25Mb2FkIiwid2lkdGgiLCJyZWdpc3RlcklucHV0IiwiaW5pdFBvcyIsIm5vZGUiLCJwb3NpdGlvbiIsImluaXRCYXJQb3MiLCJvcGFjaXR5IiwiYWRkSm95U3RpY2tUb3VjaENoYW5nZUxpc3RlbmVyIiwiY2FsbGJhY2siLCJhbmdsZUNoYW5nZSIsIm9uIiwiRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJvblRvdWNoQmVnYW4iLCJUT1VDSF9NT1ZFIiwib25Ub3VjaE1vdmVkIiwiVE9VQ0hfRU5EIiwib25Ub3VjaEVuZGVkIiwiVE9VQ0hfQ0FORUwiLCJldmVudCIsInRvdWNoUG9zIiwicGFyZW50IiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJnZXRMb2NhdGlvbiIsInNldFBvc2l0aW9uIiwic3ViIiwiVmVjMiIsIm1hZyIsIl9nZXRBbmdsZSIsIngiLCJNYXRoIiwiY29zIiwiX2dldFJhZGlhbiIsInkiLCJzaW4iLCJWZWMzIiwicG9pbnQiLCJfYW5nbGUiLCJmbG9vciIsIlBJIiwiX3VwZGF0ZUN1ckFuZ2xlIiwiY3VyWiIsInNxcnQiLCJwb3ciLCJfcmFkaWFuIiwiYWNvcyIsIl9mb3VyRGlyZWN0aW9ucyIsIl9laWdodERpcmVjdGlvbnMiLCJvbkRlc3Ryb3kiLCJvZmYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBSUEsU0FBUyxHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUNwQkMsRUFBQUEsT0FBTyxFQUFFLENBRFc7QUFFcEJDLEVBQUFBLE1BQU0sRUFBRTtBQUZZLENBQVIsQ0FBaEI7QUFLQSxJQUFJQyxhQUFhLEdBQUdKLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3hCSSxFQUFBQSxJQUFJLEVBQUUsQ0FEa0I7QUFFeEJDLEVBQUFBLEtBQUssRUFBRSxDQUZpQjtBQUd4QkMsRUFBQUEsR0FBRyxFQUFFO0FBSG1CLENBQVIsQ0FBcEI7QUFNQVAsRUFBRSxDQUFDUSxLQUFILENBQVM7QUFDTCxhQUFTUixFQUFFLENBQUNTLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLFdBQVcsRUFBRTtBQUNULGlCQUFTLElBREE7QUFFVEMsTUFBQUEsSUFBSSxFQUFFWixFQUFFLENBQUNhO0FBRkEsS0FETDtBQUlOO0FBQ0ZDLElBQUFBLFVBQVUsRUFBRTtBQUNSLGlCQUFTLElBREQ7QUFFUkYsTUFBQUEsSUFBSSxFQUFFWixFQUFFLENBQUNhO0FBRkQsS0FMSjtBQVFOO0FBQ0ZFLElBQUFBLE1BQU0sRUFBRSxDQVRBO0FBU0c7QUFDWEMsSUFBQUEsU0FBUyxFQUFFO0FBQ1AsaUJBQVNqQixTQUFTLENBQUNHLE9BRFo7QUFDcUI7QUFDNUJVLE1BQUFBLElBQUksRUFBRWI7QUFGQyxLQVZIO0FBY1JrQixJQUFBQSxhQUFhLEVBQUU7QUFDWCxpQkFBU2IsYUFBYSxDQUFDRyxHQURaO0FBQ2tCO0FBQzdCSyxNQUFBQSxJQUFJLEVBQUVSO0FBRkssS0FkUDtBQWtCUjtBQUNBYyxJQUFBQSxRQUFRLEVBQUU7QUFDTixpQkFBUyxDQURIO0FBRU5DLE1BQUFBLE9BQU8sRUFBRTtBQUZILEtBbkJGO0FBdUJSO0FBQ0FDLElBQUFBLFFBQVEsRUFBRTtBQUNOLGlCQUFTLENBREg7QUFFTkQsTUFBQUEsT0FBTyxFQUFFO0FBRkg7QUF4QkYsR0FIUDtBQWlDTDtBQUNBRSxFQUFBQSxNQUFNLEVBQUUsa0JBQVk7QUFDaEIsUUFBRyxLQUFLTixNQUFMLElBQWUsQ0FBbEIsRUFBb0I7QUFDaEIsV0FBS0EsTUFBTCxHQUFjLEtBQUtELFVBQUwsQ0FBZ0JRLEtBQWhCLEdBQXNCLENBQXBDO0FBQ0g7O0FBQ0QsU0FBS0MsYUFBTDtBQUNBLFNBQUtILFFBQUwsR0FBZ0IsQ0FBaEI7QUFDQSxTQUFLRixRQUFMLEdBQWdCLENBQWhCO0FBQ0EsU0FBS00sT0FBTCxHQUFlLEtBQUtDLElBQUwsQ0FBVUMsUUFBekI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLEtBQUtoQixXQUFMLENBQWlCZSxRQUFuQztBQUVBLFNBQUtELElBQUwsQ0FBVUcsT0FBVixHQUFvQixHQUFwQjtBQUNILEdBN0NJO0FBK0NMQyxFQUFBQSw4QkFBOEIsRUFBRSx3Q0FBU0MsUUFBVCxFQUFtQjtBQUMvQyxTQUFLQyxXQUFMLEdBQW1CRCxRQUFuQjtBQUNILEdBakRJO0FBbURMUCxFQUFBQSxhQUFhLEVBQUUseUJBQVc7QUFDdEIsU0FBS0UsSUFBTCxDQUFVTyxFQUFWLENBQWFoQyxFQUFFLENBQUNhLElBQUgsQ0FBUW9CLFNBQVIsQ0FBa0JDLFdBQS9CLEVBQTJDLEtBQUtDLFlBQWhELEVBQTZELElBQTdEO0FBQ0EsU0FBS1YsSUFBTCxDQUFVTyxFQUFWLENBQWFoQyxFQUFFLENBQUNhLElBQUgsQ0FBUW9CLFNBQVIsQ0FBa0JHLFVBQS9CLEVBQTBDLEtBQUtDLFlBQS9DLEVBQTRELElBQTVEO0FBQ0EsU0FBS1osSUFBTCxDQUFVTyxFQUFWLENBQWFoQyxFQUFFLENBQUNhLElBQUgsQ0FBUW9CLFNBQVIsQ0FBa0JLLFNBQS9CLEVBQXlDLEtBQUtDLFlBQTlDLEVBQTJELElBQTNEO0FBQ0EsU0FBS2QsSUFBTCxDQUFVTyxFQUFWLENBQWFoQyxFQUFFLENBQUNhLElBQUgsQ0FBUW9CLFNBQVIsQ0FBa0JPLFdBQS9CLEVBQTJDLEtBQUtELFlBQWhELEVBQTZELElBQTdEO0FBRUgsR0F6REk7QUEyRExKLEVBQUFBLFlBQVksRUFBRSxzQkFBU00sS0FBVCxFQUFnQjtBQUMxQjtBQUNBLFFBQUcsS0FBS3pCLFNBQUwsSUFBa0JqQixTQUFTLENBQUNJLE1BQS9CLEVBQ0E7QUFDSSxVQUFJdUMsUUFBUSxHQUFHLEtBQUtqQixJQUFMLENBQVVrQixNQUFWLENBQWlCQyxvQkFBakIsQ0FBc0NILEtBQUssQ0FBQ0ksV0FBTixFQUF0QyxDQUFmO0FBQ0EsV0FBS3BCLElBQUwsQ0FBVXFCLFdBQVYsQ0FBc0JKLFFBQXRCO0FBQ0EsYUFBTyxJQUFQO0FBQ0gsS0FMRCxNQU9BO0FBQ0k7QUFDQSxVQUFJQSxRQUFRLEdBQUcsS0FBS2pCLElBQUwsQ0FBVW1CLG9CQUFWLENBQStCSCxLQUFLLENBQUNJLFdBQU4sRUFBL0IsQ0FBZixDQUZKLENBR0k7QUFDQTs7QUFDQSxVQUFJekIsUUFBUSxHQUFHc0IsUUFBUSxDQUFDSyxHQUFULENBQWEvQyxFQUFFLENBQUNnRCxJQUFILENBQVEsQ0FBUixFQUFXLENBQVgsQ0FBYixFQUE0QkMsR0FBNUIsRUFBZixDQUxKLENBT0k7O0FBQ0EsVUFBRzdCLFFBQVEsR0FBRyxLQUFLTCxNQUFuQixFQUE0QjtBQUN4QixZQUFHSyxRQUFRLEdBQUMsRUFBWixFQUFlO0FBQ1gsZUFBS0ssSUFBTCxDQUFVRyxPQUFWLEdBQW9CLEdBQXBCO0FBQ0EsZUFBS2pCLFdBQUwsQ0FBaUJtQyxXQUFqQixDQUE2QkosUUFBN0IsRUFGVyxDQUdYOztBQUNBLGVBQUtRLFNBQUwsQ0FBZVIsUUFBZjtBQUNIOztBQUNELGVBQU8sSUFBUDtBQUNIO0FBQ0o7O0FBQ0QsV0FBTyxLQUFQO0FBQ0gsR0F2Rkk7QUF5RkxMLEVBQUFBLFlBQVksRUFBRSxzQkFBU0ksS0FBVCxFQUFnQjtBQUUxQjtBQUNBLFFBQUlDLFFBQVEsR0FBRyxLQUFLakIsSUFBTCxDQUFVbUIsb0JBQVYsQ0FBK0JILEtBQUssQ0FBQ0ksV0FBTixFQUEvQixDQUFmLENBSDBCLENBSTFCO0FBQ0E7O0FBQ0EsUUFBSXpCLFFBQVEsR0FBR3NCLFFBQVEsQ0FBQ0ssR0FBVCxDQUFhL0MsRUFBRSxDQUFDZ0QsSUFBSCxDQUFRLENBQVIsRUFBVyxDQUFYLENBQWIsRUFBNEJDLEdBQTVCLEVBQWYsQ0FOMEIsQ0FRMUI7O0FBQ0EsUUFBRyxLQUFLbEMsTUFBTCxJQUFlSyxRQUFsQixFQUEyQjtBQUN2QixVQUFHQSxRQUFRLEdBQUMsRUFBWixFQUFlO0FBQ1gsYUFBS0ssSUFBTCxDQUFVRyxPQUFWLEdBQW9CLEdBQXBCO0FBQ0EsYUFBS2pCLFdBQUwsQ0FBaUJtQyxXQUFqQixDQUE2QkosUUFBN0IsRUFGVyxDQUdYOztBQUNBLGFBQUtRLFNBQUwsQ0FBZVIsUUFBZjtBQUNILE9BTEQsTUFLTTtBQUNGO0FBQ0EsYUFBS2pCLElBQUwsQ0FBVUcsT0FBVixHQUFvQixHQUFwQixDQUZFLENBR0Y7O0FBQ0EsYUFBS2pCLFdBQUwsQ0FBaUJtQyxXQUFqQixDQUE2QjlDLEVBQUUsQ0FBQ2dELElBQUgsQ0FBUSxDQUFSLEVBQVUsQ0FBVixDQUE3QjtBQUVBLGFBQUs5QixRQUFMLEdBQWdCLElBQWhCLENBTkUsQ0FPRjs7QUFDQSxZQUFHLEtBQUthLFdBQVIsRUFBb0I7QUFDaEIsZUFBS0EsV0FBTCxDQUFpQixLQUFLYixRQUF0QjtBQUNIO0FBRUo7QUFDSixLQW5CRCxNQW1CSztBQUNEO0FBQ0EsVUFBSWlDLENBQUMsR0FBR0MsSUFBSSxDQUFDQyxHQUFMLENBQVMsS0FBS0MsVUFBTCxDQUFnQlosUUFBaEIsQ0FBVCxJQUFzQyxLQUFLM0IsTUFBbkQ7QUFDQSxVQUFJd0MsQ0FBQyxHQUFHSCxJQUFJLENBQUNJLEdBQUwsQ0FBUyxLQUFLRixVQUFMLENBQWdCWixRQUFoQixDQUFULElBQXNDLEtBQUszQixNQUFuRDs7QUFDQSxVQUFHMkIsUUFBUSxDQUFDUyxDQUFULEdBQVcsQ0FBWCxJQUFnQlQsUUFBUSxDQUFDYSxDQUFULEdBQVcsQ0FBOUIsRUFBZ0M7QUFDNUJBLFFBQUFBLENBQUMsSUFBSSxDQUFDLENBQU47QUFDSCxPQUZELE1BRU0sSUFBR2IsUUFBUSxDQUFDUyxDQUFULEdBQVcsQ0FBWCxJQUFnQlQsUUFBUSxDQUFDYSxDQUFULEdBQVcsQ0FBOUIsRUFBZ0M7QUFDbENBLFFBQUFBLENBQUMsSUFBSSxDQUFDLENBQU47QUFDSDs7QUFFRCxXQUFLNUMsV0FBTCxDQUFpQm1DLFdBQWpCLENBQTZCOUMsRUFBRSxDQUFDeUQsSUFBSCxDQUFRTixDQUFSLEVBQVdJLENBQVgsRUFBYyxDQUFkLENBQTdCLEVBVkMsQ0FXRDs7QUFDQSxXQUFLTCxTQUFMLENBQWVSLFFBQWY7QUFDSDtBQUVKLEdBcElJO0FBcUlMSCxFQUFBQSxZQUFZLEVBQUUsc0JBQVNFLEtBQVQsRUFBZ0I7QUFDMUI7QUFDQSxTQUFLaEIsSUFBTCxDQUFVRyxPQUFWLEdBQW9CLEdBQXBCLENBRjBCLENBSTFCOztBQUNBLFFBQUcsS0FBS1osU0FBTCxJQUFrQmpCLFNBQVMsQ0FBQ0ksTUFBL0IsRUFBc0M7QUFDbEMsV0FBS3NCLElBQUwsQ0FBVUMsUUFBVixHQUFxQixLQUFLRixPQUExQjtBQUNILEtBUHlCLENBUTFCOzs7QUFDQSxTQUFLYixXQUFMLENBQWlCbUMsV0FBakIsQ0FBNkIsS0FBS25CLFVBQWxDO0FBQ0EsU0FBS1QsUUFBTCxHQUFnQixJQUFoQixDQVYwQixDQVcxQjs7QUFDQSxRQUFHLEtBQUthLFdBQVIsRUFBb0I7QUFDaEIsV0FBS0EsV0FBTCxDQUFpQixLQUFLYixRQUF0QjtBQUNIO0FBQ0osR0FwSkk7QUF1Skw7QUFDQWdDLEVBQUFBLFNBQVMsRUFBRSxtQkFBU1EsS0FBVCxFQUNYO0FBQ0ksU0FBS0MsTUFBTCxHQUFlUCxJQUFJLENBQUNRLEtBQUwsQ0FBVyxLQUFLTixVQUFMLENBQWdCSSxLQUFoQixJQUF1QixHQUF2QixHQUEyQk4sSUFBSSxDQUFDUyxFQUEzQyxDQUFmOztBQUVBLFFBQUdILEtBQUssQ0FBQ1AsQ0FBTixHQUFRLENBQVIsSUFBYU8sS0FBSyxDQUFDSCxDQUFOLEdBQVEsQ0FBeEIsRUFBMEI7QUFDdEIsV0FBS0ksTUFBTCxHQUFjLE1BQU0sS0FBS0EsTUFBekI7QUFDSCxLQUZELE1BRU0sSUFBR0QsS0FBSyxDQUFDUCxDQUFOLEdBQVEsQ0FBUixJQUFhTyxLQUFLLENBQUNILENBQU4sR0FBUSxDQUF4QixFQUEwQjtBQUM1QixXQUFLSSxNQUFMLEdBQWMsTUFBTSxLQUFLQSxNQUF6QjtBQUNILEtBRkssTUFFQSxJQUFHRCxLQUFLLENBQUNQLENBQU4sR0FBUSxDQUFSLElBQWFPLEtBQUssQ0FBQ0gsQ0FBTixJQUFTLENBQXpCLEVBQTJCO0FBQzdCLFdBQUtJLE1BQUwsR0FBYyxHQUFkO0FBQ0gsS0FGSyxNQUVBLElBQUdELEtBQUssQ0FBQ1AsQ0FBTixHQUFRLENBQVIsSUFBYU8sS0FBSyxDQUFDSCxDQUFOLElBQVMsQ0FBekIsRUFBMkI7QUFDN0IsV0FBS0ksTUFBTCxHQUFjLENBQWQ7QUFDSCxLQUZLLE1BRUEsSUFBR0QsS0FBSyxDQUFDUCxDQUFOLElBQVMsQ0FBVCxJQUFjTyxLQUFLLENBQUNILENBQU4sR0FBUSxDQUF6QixFQUEyQjtBQUM3QixXQUFLSSxNQUFMLEdBQWMsRUFBZDtBQUNILEtBRkssTUFFQSxJQUFHRCxLQUFLLENBQUNQLENBQU4sSUFBUyxDQUFULElBQWNPLEtBQUssQ0FBQ0gsQ0FBTixHQUFRLENBQXpCLEVBQTJCO0FBQzdCLFdBQUtJLE1BQUwsR0FBYyxHQUFkO0FBQ0g7O0FBQ0QsU0FBS0csZUFBTDs7QUFDQSxXQUFPLEtBQUtILE1BQVo7QUFDSCxHQTNLSTtBQTZLTDtBQUNBTCxFQUFBQSxVQUFVLEVBQUUsb0JBQVNJLEtBQVQsRUFBZ0I7QUFDeEIsUUFBSUssSUFBSSxHQUFHWCxJQUFJLENBQUNZLElBQUwsQ0FBVVosSUFBSSxDQUFDYSxHQUFMLENBQVNQLEtBQUssQ0FBQ1AsQ0FBZixFQUFpQixDQUFqQixJQUFvQkMsSUFBSSxDQUFDYSxHQUFMLENBQVNQLEtBQUssQ0FBQ0gsQ0FBZixFQUFpQixDQUFqQixDQUE5QixDQUFYOztBQUNBLFFBQUdRLElBQUksSUFBRSxDQUFULEVBQVc7QUFDUCxXQUFLRyxPQUFMLEdBQWUsQ0FBZjtBQUNILEtBRkQsTUFFTTtBQUNGLFdBQUtBLE9BQUwsR0FBZWQsSUFBSSxDQUFDZSxJQUFMLENBQVVULEtBQUssQ0FBQ1AsQ0FBTixHQUFRWSxJQUFsQixDQUFmO0FBQ0g7O0FBQ0QsV0FBTyxLQUFLRyxPQUFaO0FBQ0gsR0F0TEk7QUF3TEw7QUFDQUosRUFBQUEsZUFBZSxFQUFFLDJCQUNqQjtBQUNJLFlBQVEsS0FBSzdDLGFBQWI7QUFFSSxXQUFLYixhQUFhLENBQUNDLElBQW5CO0FBQ0ksYUFBS2EsUUFBTCxHQUFnQixLQUFLa0QsZUFBTCxFQUFoQjtBQUNBOztBQUNKLFdBQUtoRSxhQUFhLENBQUNFLEtBQW5CO0FBQ0ksYUFBS1ksUUFBTCxHQUFnQixLQUFLbUQsZ0JBQUwsRUFBaEI7QUFDQTs7QUFDSixXQUFLakUsYUFBYSxDQUFDRyxHQUFuQjtBQUNJLGFBQUtXLFFBQUwsR0FBZ0IsS0FBS3lDLE1BQXJCO0FBQ0E7O0FBQ0o7QUFDSSxhQUFLekMsUUFBTCxHQUFnQixJQUFoQjtBQUNBO0FBYlIsS0FESixDQWdCSTs7O0FBQ0EsUUFBRyxLQUFLYSxXQUFSLEVBQW9CO0FBQ2hCLFdBQUtBLFdBQUwsQ0FBaUIsS0FBS2IsUUFBdEI7QUFDSDtBQUNKLEdBOU1JO0FBaU5MO0FBQ0FrRCxFQUFBQSxlQUFlLEVBQUUsMkJBQ2pCO0FBQ0ksUUFBRyxLQUFLVCxNQUFMLElBQWUsRUFBZixJQUFxQixLQUFLQSxNQUFMLElBQWUsR0FBdkMsRUFDQTtBQUNJLGFBQU8sRUFBUDtBQUNILEtBSEQsTUFJSyxJQUFHLEtBQUtBLE1BQUwsSUFBZSxHQUFmLElBQXNCLEtBQUtBLE1BQUwsSUFBZSxHQUF4QyxFQUNMO0FBQ0ksYUFBTyxHQUFQO0FBQ0gsS0FISSxNQUlBLElBQUcsS0FBS0EsTUFBTCxJQUFlLEdBQWYsSUFBc0IsS0FBS0EsTUFBTCxJQUFlLEdBQXJDLElBQTRDLEtBQUtBLE1BQUwsSUFBZSxHQUFmLElBQXNCLEtBQUtBLE1BQUwsSUFBZSxHQUFwRixFQUNMO0FBQ0ksYUFBTyxHQUFQO0FBQ0gsS0FISSxNQUlBLElBQUcsS0FBS0EsTUFBTCxJQUFlLEdBQWYsSUFBc0IsS0FBS0EsTUFBTCxJQUFlLEdBQXJDLElBQTRDLEtBQUtBLE1BQUwsSUFBZSxDQUFmLElBQW9CLEtBQUtBLE1BQUwsSUFBZSxFQUFsRixFQUNMO0FBQ0ksYUFBTyxDQUFQO0FBQ0g7QUFDSixHQXBPSTtBQXNPTDtBQUNBVSxFQUFBQSxnQkFBZ0IsRUFBRSw0QkFDbEI7QUFDSSxRQUFHLEtBQUtWLE1BQUwsSUFBZSxJQUFmLElBQXVCLEtBQUtBLE1BQUwsSUFBZSxLQUF6QyxFQUNBO0FBQ0ksYUFBTyxFQUFQO0FBQ0gsS0FIRCxNQUlLLElBQUcsS0FBS0EsTUFBTCxJQUFlLEtBQWYsSUFBd0IsS0FBS0EsTUFBTCxJQUFlLEtBQTFDLEVBQ0w7QUFDSSxhQUFPLEdBQVA7QUFDSCxLQUhJLE1BSUEsSUFBRyxLQUFLQSxNQUFMLElBQWUsS0FBZixJQUF3QixLQUFLQSxNQUFMLElBQWUsR0FBdkMsSUFBOEMsS0FBS0EsTUFBTCxJQUFlLEtBQWYsSUFBd0IsS0FBS0EsTUFBTCxJQUFlLEdBQXhGLEVBQ0w7QUFDSSxhQUFPLEdBQVA7QUFDSCxLQUhJLE1BSUEsSUFBRyxLQUFLQSxNQUFMLElBQWUsR0FBZixJQUFzQixLQUFLQSxNQUFMLElBQWUsS0FBckMsSUFBOEMsS0FBS0EsTUFBTCxJQUFlLENBQWYsSUFBb0IsS0FBS0EsTUFBTCxJQUFlLElBQXBGLEVBQ0w7QUFDSSxhQUFPLENBQVA7QUFDSCxLQUhJLE1BSUEsSUFBRyxLQUFLQSxNQUFMLElBQWUsS0FBZixJQUF3QixLQUFLQSxNQUFMLElBQWUsS0FBMUMsRUFDTDtBQUNJLGFBQU8sR0FBUDtBQUNILEtBSEksTUFJQSxJQUFHLEtBQUtBLE1BQUwsSUFBZSxJQUFmLElBQXVCLEtBQUtBLE1BQUwsSUFBZSxJQUF6QyxFQUNMO0FBQ0ksYUFBTyxFQUFQO0FBQ0gsS0FISSxNQUlBLElBQUcsS0FBS0EsTUFBTCxJQUFlLEtBQWYsSUFBd0IsS0FBS0EsTUFBTCxJQUFlLEtBQTFDLEVBQ0w7QUFDSSxhQUFPLEdBQVA7QUFDSCxLQUhJLE1BSUEsSUFBRyxLQUFLQSxNQUFMLElBQWUsS0FBZixJQUF3QixLQUFLQSxNQUFMLElBQWUsS0FBMUMsRUFDTDtBQUNJLGFBQU8sR0FBUDtBQUNIO0FBQ0osR0F6UUk7QUEyUUxXLEVBQUFBLFNBQVMsRUFBRSxxQkFDWDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBRUEsU0FBSzdDLElBQUwsQ0FBVThDLEdBQVYsQ0FBY3ZFLEVBQUUsQ0FBQ2EsSUFBSCxDQUFRb0IsU0FBUixDQUFrQkMsV0FBaEMsRUFBNEMsS0FBS0MsWUFBakQsRUFBOEQsSUFBOUQ7QUFDQSxTQUFLVixJQUFMLENBQVU4QyxHQUFWLENBQWN2RSxFQUFFLENBQUNhLElBQUgsQ0FBUW9CLFNBQVIsQ0FBa0JHLFVBQWhDLEVBQTJDLEtBQUtDLFlBQWhELEVBQTZELElBQTdEO0FBQ0EsU0FBS1osSUFBTCxDQUFVOEMsR0FBVixDQUFjdkUsRUFBRSxDQUFDYSxJQUFILENBQVFvQixTQUFSLENBQWtCSyxTQUFoQyxFQUEwQyxLQUFLQyxZQUEvQyxFQUE0RCxJQUE1RDtBQUNIO0FBclJJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG52YXIgVG91Y2hUeXBlID0gY2MuRW51bSh7XHJcbiAgICBERUZBVUxUOiAwLFxyXG4gICAgRk9MTE9XOiAxXHJcbn0pO1xyXG5cclxudmFyIERpcmVjdGlvblR5cGUgPSBjYy5FbnVtKHtcclxuICAgIEZPVVI6IDAsXHJcbiAgICBFSUdIVDogMSxcclxuICAgIEFMTDogMlxyXG59KTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgam95c3RpY2tCYXI6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxyXG4gICAgICAgIH0sLy/mjqfmnYZcclxuICAgICAgICBqb3lzdGlja0JHOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcclxuICAgICAgICB9LC8v5o6n5p2G6IOM5pmvXHJcbiAgICAgICAgcmFkaXVzOiAwLCAvL+WNiuW+hFxyXG4gICAgICAgIHRvdWNoVHlwZToge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBUb3VjaFR5cGUuREVGQVVMVCwgLy/op6bmkbjnsbvlnotcclxuICAgICAgICAgICAgdHlwZTogVG91Y2hUeXBlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkaXJlY3Rpb25UeXBlOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IERpcmVjdGlvblR5cGUuQUxMLCAgLy/mlrnlkJHnsbvlnotcclxuICAgICAgICAgICAgdHlwZTogRGlyZWN0aW9uVHlwZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/lvZPliY3op5LluqZcclxuICAgICAgICBjdXJBbmdsZToge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/lvZPliY3ot53nprtcclxuICAgICAgICBkaXN0YW5jZToge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZih0aGlzLnJhZGl1cyA9PSAwKXtcclxuICAgICAgICAgICAgdGhpcy5yYWRpdXMgPSB0aGlzLmpveXN0aWNrQkcud2lkdGgvMlxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlZ2lzdGVySW5wdXQoKVxyXG4gICAgICAgIHRoaXMuZGlzdGFuY2UgPSAwXHJcbiAgICAgICAgdGhpcy5jdXJBbmdsZSA9IDBcclxuICAgICAgICB0aGlzLmluaXRQb3MgPSB0aGlzLm5vZGUucG9zaXRpb25cclxuICAgICAgICB0aGlzLmluaXRCYXJQb3MgPSB0aGlzLmpveXN0aWNrQmFyLnBvc2l0aW9uXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAyNTVcclxuICAgIH0sXHJcblxyXG4gICAgYWRkSm95U3RpY2tUb3VjaENoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuYW5nbGVDaGFuZ2UgPSBjYWxsYmFjaztcclxuICAgIH0sXHJcblxyXG4gICAgcmVnaXN0ZXJJbnB1dDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULHRoaXMub25Ub3VjaEJlZ2FuLHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLHRoaXMub25Ub3VjaE1vdmVkLHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsdGhpcy5vblRvdWNoRW5kZWQsdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkVMLHRoaXMub25Ub3VjaEVuZGVkLHRoaXMpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgb25Ub3VjaEJlZ2FuOiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIC8v5aaC5p6c6Kem5pG457G75Z6L5Li6Rk9MTE9X77yM5YiZ5pGH5o6n5p2G55qE5L2N572u5Li66Kem5pG45L2N572uLOinpuaRuOW8gOWni+aXtuWAmeeOsOW9olxyXG4gICAgICAgIGlmKHRoaXMudG91Y2hUeXBlID09IFRvdWNoVHlwZS5GT0xMT1cpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgdG91Y2hQb3MgPSB0aGlzLm5vZGUucGFyZW50LmNvbnZlcnRUb05vZGVTcGFjZUFSKGV2ZW50LmdldExvY2F0aW9uKCkpXHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXRQb3NpdGlvbih0b3VjaFBvcyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8v5oqK6Kem5pG454K55Z2Q5qCH6L2s5o2i5Li655u45a+55LiO55uu5qCH55qE5qih5Z6L5Z2Q5qCHXHJcbiAgICAgICAgICAgIHZhciB0b3VjaFBvcyA9IHRoaXMubm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2VBUihldmVudC5nZXRMb2NhdGlvbigpKVxyXG4gICAgICAgICAgICAvL+eCueS4juWchuW/g+eahOi3neemu1xyXG4gICAgICAgICAgICAvL3ZhciBkaXN0YW5jZSA9IGNjLnBEaXN0YW5jZSh0b3VjaFBvcywgY2MuVmVjMigwLCAwKSk7XHJcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IHRvdWNoUG9zLnN1YihjYy5WZWMyKDAsIDApKS5tYWcoKTtcclxuXHJcbiAgICAgICAgICAgIC8v5aaC5p6c54K55LiO5ZyG5b+D6Led56a75bCP5LqO5ZyG55qE5Y2K5b6ELOi/lOWbnnRydWVcclxuICAgICAgICAgICAgaWYoZGlzdGFuY2UgPCB0aGlzLnJhZGl1cyApIHtcclxuICAgICAgICAgICAgICAgIGlmKGRpc3RhbmNlPjIwKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDI1NVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuam95c3RpY2tCYXIuc2V0UG9zaXRpb24odG91Y2hQb3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8v5pu05paw6KeS5bqmXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0QW5nbGUodG91Y2hQb3MpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uVG91Y2hNb3ZlZDogZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAvL+aKiuinpuaRuOeCueWdkOagh+i9rOaNouS4uuebuOWvueS4juebruagh+eahOaooeWei+WdkOagh1xyXG4gICAgICAgIHZhciB0b3VjaFBvcyA9IHRoaXMubm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2VBUihldmVudC5nZXRMb2NhdGlvbigpKVxyXG4gICAgICAgIC8v54K55LiO5ZyG5b+D55qE6Led56a7XFxcXFxyXG4gICAgICAgIC8vdmFyIGRpc3RhbmNlID0gY2MucERpc3RhbmNlKHRvdWNoUG9zLCBjYy5WZWMyKDAsIDApKTtcclxuICAgICAgICB2YXIgZGlzdGFuY2UgPSB0b3VjaFBvcy5zdWIoY2MuVmVjMigwLCAwKSkubWFnKCk7XHJcblxyXG4gICAgICAgIC8v5aaC5p6c54K55LiO5ZyG5b+D6Led56a75bCP5LqO5ZyG55qE5Y2K5b6ELOaOp+adhui3n+maj+inpuaRuOeCuVxyXG4gICAgICAgIGlmKHRoaXMucmFkaXVzID49IGRpc3RhbmNlKXtcclxuICAgICAgICAgICAgaWYoZGlzdGFuY2U+MjApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAyNTU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmpveXN0aWNrQmFyLnNldFBvc2l0aW9uKHRvdWNoUG9zKTtcclxuICAgICAgICAgICAgICAgIC8v5pu05paw6KeS5bqmXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nZXRBbmdsZSh0b3VjaFBvcylcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy90aGlzLm5vZGUub3BhY2l0eSA9IDUwXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDI1NVxyXG4gICAgICAgICAgICAgICAgLy/mkYfmnYbmgaLlpI3kvY3nva5cclxuICAgICAgICAgICAgICAgIHRoaXMuam95c3RpY2tCYXIuc2V0UG9zaXRpb24oY2MuVmVjMigwLDApKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1ckFuZ2xlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIC8v6LCD55So6KeS5bqm5Y+Y5YyW5Zue6LCDXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmFuZ2xlQ2hhbmdlKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuZ2xlQ2hhbmdlKHRoaXMuY3VyQW5nbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgLy/op6bmkbjnm5HlkKznm67moIdcclxuICAgICAgICAgICAgdmFyIHggPSBNYXRoLmNvcyh0aGlzLl9nZXRSYWRpYW4odG91Y2hQb3MpKSAqIHRoaXMucmFkaXVzO1xyXG4gICAgICAgICAgICB2YXIgeSA9IE1hdGguc2luKHRoaXMuX2dldFJhZGlhbih0b3VjaFBvcykpICogdGhpcy5yYWRpdXM7XHJcbiAgICAgICAgICAgIGlmKHRvdWNoUG9zLng+MCAmJiB0b3VjaFBvcy55PDApe1xyXG4gICAgICAgICAgICAgICAgeSAqPSAtMTtcclxuICAgICAgICAgICAgfWVsc2UgaWYodG91Y2hQb3MueDwwICYmIHRvdWNoUG9zLnk8MCl7XHJcbiAgICAgICAgICAgICAgICB5ICo9IC0xO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmpveXN0aWNrQmFyLnNldFBvc2l0aW9uKGNjLlZlYzMoeCwgeSwgMCkpO1xyXG4gICAgICAgICAgICAvL+abtOaWsOinkuW6plxyXG4gICAgICAgICAgICB0aGlzLl9nZXRBbmdsZSh0b3VjaFBvcylcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIG9uVG91Y2hFbmRlZDogZnVuY3Rpb24oZXZlbnQpIHsgICAgICAgIFxyXG4gICAgICAgIC8vdGhpcy5ub2RlLm9wYWNpdHkgPSA1MFxyXG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMjU1XHJcblxyXG4gICAgICAgIC8v5aaC5p6c6Kem5pG457G75Z6L5Li6Rk9MTE9X77yM56a75byA6Kem5pG45ZCO6ZqQ6JePXHJcbiAgICAgICAgaWYodGhpcy50b3VjaFR5cGUgPT0gVG91Y2hUeXBlLkZPTExPVyl7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5wb3NpdGlvbiA9IHRoaXMuaW5pdFBvc1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL+aRh+adhuaBouWkjeS9jee9rlxyXG4gICAgICAgIHRoaXMuam95c3RpY2tCYXIuc2V0UG9zaXRpb24odGhpcy5pbml0QmFyUG9zKTtcclxuICAgICAgICB0aGlzLmN1ckFuZ2xlID0gbnVsbFxyXG4gICAgICAgIC8v6LCD55So6KeS5bqm5Y+Y5YyW5Zue6LCDXHJcbiAgICAgICAgaWYodGhpcy5hbmdsZUNoYW5nZSl7XHJcbiAgICAgICAgICAgIHRoaXMuYW5nbGVDaGFuZ2UodGhpcy5jdXJBbmdsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy/orqHnrpfop5Lluqblubbov5Tlm55cclxuICAgIF9nZXRBbmdsZTogZnVuY3Rpb24ocG9pbnQpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fYW5nbGUgPSAgTWF0aC5mbG9vcih0aGlzLl9nZXRSYWRpYW4ocG9pbnQpKjE4MC9NYXRoLlBJKTtcclxuICAgICAgICBcclxuICAgICAgICBpZihwb2ludC54PjAgJiYgcG9pbnQueTwwKXtcclxuICAgICAgICAgICAgdGhpcy5fYW5nbGUgPSAzNjAgLSB0aGlzLl9hbmdsZTtcclxuICAgICAgICB9ZWxzZSBpZihwb2ludC54PDAgJiYgcG9pbnQueTwwKXtcclxuICAgICAgICAgICAgdGhpcy5fYW5nbGUgPSAzNjAgLSB0aGlzLl9hbmdsZTtcclxuICAgICAgICB9ZWxzZSBpZihwb2ludC54PDAgJiYgcG9pbnQueT09MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2FuZ2xlID0gMTgwO1xyXG4gICAgICAgIH1lbHNlIGlmKHBvaW50Lng+MCAmJiBwb2ludC55PT0wKXtcclxuICAgICAgICAgICAgdGhpcy5fYW5nbGUgPSAwO1xyXG4gICAgICAgIH1lbHNlIGlmKHBvaW50Lng9PTAgJiYgcG9pbnQueT4wKXtcclxuICAgICAgICAgICAgdGhpcy5fYW5nbGUgPSA5MDtcclxuICAgICAgICB9ZWxzZSBpZihwb2ludC54PT0wICYmIHBvaW50Lnk8MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2FuZ2xlID0gMjcwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl91cGRhdGVDdXJBbmdsZSgpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FuZ2xlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+iuoeeul+W8p+W6puW5tui/lOWbnlxyXG4gICAgX2dldFJhZGlhbjogZnVuY3Rpb24ocG9pbnQpIHtcclxuICAgICAgICB2YXIgY3VyWiA9IE1hdGguc3FydChNYXRoLnBvdyhwb2ludC54LDIpK01hdGgucG93KHBvaW50LnksMikpO1xyXG4gICAgICAgIGlmKGN1clo9PTApe1xyXG4gICAgICAgICAgICB0aGlzLl9yYWRpYW4gPSAwO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcmFkaWFuID0gTWF0aC5hY29zKHBvaW50LngvY3VyWik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yYWRpYW47XHJcbiAgICB9LFxyXG5cclxuICAgIC8v5pu05paw5b2T5YmN6KeS5bqmXHJcbiAgICBfdXBkYXRlQ3VyQW5nbGU6IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuZGlyZWN0aW9uVHlwZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uVHlwZS5GT1VSOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJBbmdsZSA9IHRoaXMuX2ZvdXJEaXJlY3Rpb25zKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb25UeXBlLkVJR0hUOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJBbmdsZSA9IHRoaXMuX2VpZ2h0RGlyZWN0aW9ucygpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uVHlwZS5BTEw6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1ckFuZ2xlID0gdGhpcy5fYW5nbGVcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VyQW5nbGUgPSBudWxsXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy/osIPnlKjop5Lluqblj5jljJblm57osINcclxuICAgICAgICBpZih0aGlzLmFuZ2xlQ2hhbmdlKXtcclxuICAgICAgICAgICAgdGhpcy5hbmdsZUNoYW5nZSh0aGlzLmN1ckFuZ2xlKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvL+Wbm+S4quaWueWQkeenu+WKqCjkuIrkuIvlt6blj7MpXHJcbiAgICBfZm91ckRpcmVjdGlvbnM6IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLl9hbmdsZSA+PSA0NSAmJiB0aGlzLl9hbmdsZSA8PSAxMzUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gOTBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLl9hbmdsZSA+PSAyMjUgJiYgdGhpcy5fYW5nbGUgPD0gMzE1KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIDI3MFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FuZ2xlIDw9IDIyNSAmJiB0aGlzLl9hbmdsZSA+PSAxODAgfHwgdGhpcy5fYW5nbGUgPj0gMTM1ICYmIHRoaXMuX2FuZ2xlIDw9IDE4MClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiAxODBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLl9hbmdsZSA8PSAzNjAgJiYgdGhpcy5fYW5nbGUgPj0gMzE1IHx8IHRoaXMuX2FuZ2xlID49IDAgJiYgdGhpcy5fYW5nbGUgPD0gNDUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gMFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy/lhavkuKrmlrnlkJHnp7vliqgo5LiK5LiL5bem5Y+z44CB5bem5LiK44CB5Y+z5LiK44CB5bem5LiL44CB5Y+z5LiLKVxyXG4gICAgX2VpZ2h0RGlyZWN0aW9uczogZnVuY3Rpb24oKVxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuX2FuZ2xlID49IDY3LjUgJiYgdGhpcy5fYW5nbGUgPD0gMTEyLjUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gOTBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLl9hbmdsZSA+PSAyNDcuNSAmJiB0aGlzLl9hbmdsZSA8PSAyOTIuNSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiAyNzBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLl9hbmdsZSA8PSAyMDIuNSAmJiB0aGlzLl9hbmdsZSA+PSAxODAgfHwgdGhpcy5fYW5nbGUgPj0gMTU3LjUgJiYgdGhpcy5fYW5nbGUgPD0gMTgwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE4MFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FuZ2xlIDw9IDM2MCAmJiB0aGlzLl9hbmdsZSA+PSAzMzcuNSB8fCB0aGlzLl9hbmdsZSA+PSAwICYmIHRoaXMuX2FuZ2xlIDw9IDIyLjUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FuZ2xlID49IDExMi41ICYmIHRoaXMuX2FuZ2xlIDw9IDE1Ny41KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIDEzNVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FuZ2xlID49IDIyLjUgJiYgdGhpcy5fYW5nbGUgPD0gNjcuNSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiA0NVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FuZ2xlID49IDIwMi41ICYmIHRoaXMuX2FuZ2xlIDw9IDI0Ny41KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIDIyNVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FuZ2xlID49IDI5Mi41ICYmIHRoaXMuX2FuZ2xlIDw9IDMzNy41KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIDMxNVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgLy9jYy5ldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5fbGlzdGVuZXIpO1xyXG4gICAgICAgIC8vIHRoaXMubm9kZS5vZmYoXCJ0b3VjaHN0YXJ0XCIpO1xyXG4gICAgICAgIC8vIHRoaXMubm9kZS5vZmYoXCJ0b3VjaG1vdmVcIik7XHJcbiAgICAgICAgLy8gdGhpcy5ub2RlLm9mZihcInRvdWNoZW5kXCIpO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULHRoaXMub25Ub3VjaEJlZ2FuLHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSx0aGlzLm9uVG91Y2hNb3ZlZCx0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCx0aGlzLm9uVG91Y2hFbmRlZCx0aGlzKTtcclxuICAgIH1cclxuXHJcbn0pO1xyXG4iXX0=
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


var _gidToTileType = [_tileType.tileNone, _tileType.tileNone, _tileType.tileWall, _tileType.tileWall, _tileType.tileWall, _tileType.tileWall, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileGrass, _tileType.tileGrass, _tileType.tileKing, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcVGlsZWRNYXBEYXRhLmpzIl0sIm5hbWVzIjpbIl90aWxlVHlwZSIsImNjIiwiRW51bSIsInRpbGVOb25lIiwidGlsZUdyYXNzIiwidGlsZVN0ZWVsIiwidGlsZVdhbGwiLCJ0aWxlUml2ZXIiLCJ0aWxlS2luZyIsIl9naWRUb1RpbGVUeXBlIiwibW9kdWxlIiwiZXhwb3J0cyIsInRpbGVUeXBlIiwiZ2lkVG9UaWxlVHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFJQSxTQUFTLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3BCQyxFQUFBQSxRQUFRLEVBQUUsQ0FEVTtBQUVwQkMsRUFBQUEsU0FBUyxFQUFFLENBRlM7QUFHdkJDLEVBQUFBLFNBQVMsRUFBRSxDQUhZO0FBSXBCQyxFQUFBQSxRQUFRLEVBQUUsQ0FKVTtBQUt2QkMsRUFBQUEsU0FBUyxFQUFFLENBTFk7QUFNcEJDLEVBQUFBLFFBQVEsRUFBRTtBQU5VLENBQVIsQ0FBaEIsRUFRQTs7O0FBRUEsSUFBSUMsY0FBYyxHQUFHLENBQ3BCVCxTQUFTLENBQUNHLFFBRFUsRUFFakJILFNBQVMsQ0FBQ0csUUFGTyxFQUVHSCxTQUFTLENBQUNNLFFBRmIsRUFFdUJOLFNBQVMsQ0FBQ00sUUFGakMsRUFFMkNOLFNBQVMsQ0FBQ00sUUFGckQsRUFFK0ROLFNBQVMsQ0FBQ00sUUFGekUsRUFFbUZOLFNBQVMsQ0FBQ08sU0FGN0YsRUFFd0dQLFNBQVMsQ0FBQ08sU0FGbEgsRUFFNkhQLFNBQVMsQ0FBQ08sU0FGdkksRUFFa0pQLFNBQVMsQ0FBQ08sU0FGNUosRUFFdUtQLFNBQVMsQ0FBQ0ksU0FGakwsRUFFNExKLFNBQVMsQ0FBQ0ksU0FGdE0sRUFFaU5KLFNBQVMsQ0FBQ1EsUUFGM04sRUFJakJSLFNBQVMsQ0FBQ0csUUFKTyxFQUtqQkgsU0FBUyxDQUFDRyxRQUxPLEVBS0dILFNBQVMsQ0FBQ0csUUFMYixFQUt1QkgsU0FBUyxDQUFDRyxRQUxqQyxFQUsyQ0gsU0FBUyxDQUFDRyxRQUxyRCxFQUsrREgsU0FBUyxDQUFDRyxRQUx6RSxFQUttRkgsU0FBUyxDQUFDRyxRQUw3RixFQUt1R0gsU0FBUyxDQUFDRyxRQUxqSCxFQUsySEgsU0FBUyxDQUFDRyxRQUxySSxFQUsrSUgsU0FBUyxDQUFDRyxRQUx6SixFQUttS0gsU0FBUyxDQUFDRyxRQUw3SyxFQUt1TEgsU0FBUyxDQUFDRyxRQUxqTSxDQUFyQjtBQVVBTyxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDYkMsRUFBQUEsUUFBUSxFQUFFWixTQURHO0FBRWJhLEVBQUFBLGFBQWEsRUFBRUo7QUFGRixDQUFqQiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbnZhciBfdGlsZVR5cGUgPSBjYy5FbnVtKHtcclxuICAgIHRpbGVOb25lOiAwLCBcclxuICAgIHRpbGVHcmFzczogMSwgXHJcblx0dGlsZVN0ZWVsOiAyLCBcclxuICAgIHRpbGVXYWxsOiAzLFxyXG5cdHRpbGVSaXZlcjogNCwgXHJcbiAgICB0aWxlS2luZzogNVxyXG59KTtcclxuLy9naWTku44x5byA5aeLXHJcblxyXG52YXIgX2dpZFRvVGlsZVR5cGUgPSBbXHJcblx0X3RpbGVUeXBlLnRpbGVOb25lLFxyXG4gICAgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZVdhbGwsIF90aWxlVHlwZS50aWxlV2FsbCwgX3RpbGVUeXBlLnRpbGVXYWxsLCBfdGlsZVR5cGUudGlsZVdhbGwsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlUml2ZXIsIF90aWxlVHlwZS50aWxlR3Jhc3MsIF90aWxlVHlwZS50aWxlR3Jhc3MsIF90aWxlVHlwZS50aWxlS2luZyxcclxuXHJcbiAgICBfdGlsZVR5cGUudGlsZU5vbmUsXHJcbiAgICBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZSwgX3RpbGVUeXBlLnRpbGVOb25lLCBfdGlsZVR5cGUudGlsZU5vbmUsIF90aWxlVHlwZS50aWxlTm9uZVxyXG4gICAgXHJcblxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB0aWxlVHlwZTogX3RpbGVUeXBlLFxyXG4gICAgZ2lkVG9UaWxlVHlwZTogX2dpZFRvVGlsZVR5cGVcclxufTtcclxuIl19
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
    //this.node.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[index];
    if (index == 0) {
      this.node.opacity = 55;
    } else {
      this.node.opacity = 255;
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcVGFua1NjcmlwdC5qcyJdLCJuYW1lcyI6WyJUYW5rVHlwZSIsInJlcXVpcmUiLCJ0YW5rVHlwZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiTm9ybWFsIiwidHlwZSIsInNwZWVkIiwiYnVsbGV0IiwiUHJlZmFiIiwiZmlyZVRpbWUiLCJibG9vZCIsInRlYW0iLCJibGFzdCIsInNob290QXVkaW8iLCJ1cmwiLCJBdWRpb0NsaXAiLCJzcHJpdGVGcmFtZXMiLCJTcHJpdGVGcmFtZSIsImRpZSIsInN0b3AiLCJvbkxvYWQiLCJfY2l0eUN0cmwiLCJmaW5kIiwiZ2V0Q29tcG9uZW50IiwiYnVsbGV0Tm9kZSIsInN0YXJ0Iiwic3RvcE1vdmUiLCJvZmZzZXQiLCJ2MiIsIlBsYXllciIsInNlbGYiLCJjYWxsYmFjayIsImNhbGxGdW5jIiwiYW5nbGVzIiwiaW5kZXgiLCJwYXJzZUludCIsIk1hdGgiLCJyYW5kb20iLCJ0YW5rTW92ZVN0YXJ0Iiwic3RhcnRGaXJlIiwiYnVsbGV0UG9vbCIsInNlcSIsInNlcXVlbmNlIiwiZGVsYXlUaW1lIiwibm9kZSIsInJ1bkFjdGlvbiIsInJlcGVhdEZvcmV2ZXIiLCJhbmdsZSIsImZsb29yIiwiY29zIiwiUEkiLCJzaW4iLCJjZWlsIiwidGFua01vdmVTdG9wIiwidGFua1N0b3AiLCJkaXJlY3RvciIsImdldEFjdGlvbk1hbmFnZXIiLCJwYXVzZUFsbFJ1bm5pbmdBY3Rpb25zIiwidXBkYXRlIiwiZHQiLCJib3VuZGluZ0JveCIsImdldEJvdW5kaW5nQm94IiwicmVjdCIsInhNaW4iLCJ4IiwieU1pbiIsInkiLCJzaXplIiwid2lkdGgiLCJoZWlnaHQiLCJjb2xsaXNpb25UZXN0IiwiY29sbGlzaW9uVGFuayIsInN0b3BGaXJlIiwiaSIsImdhbWVEYXRhIiwidGFua0xpc3QiLCJsZW5ndGgiLCJ0YW5rIiwiaW50ZXJzZWN0cyIsImdldCIsImluc3RhbnRpYXRlIiwicG9zIiwicG9zaXRpb24iLCJhZGQiLCJidWxsZXRNb3ZlIiwicGFyZW50IiwiY2FtcCIsImJ1bGxldExpc3QiLCJwdXNoIiwiYm9vbSIsImFuaW0iLCJBbmltYXRpb24iLCJwbGF5IiwidGFua0Jvb20iLCJ0dXJuR3JlZW4iLCJvcGFjaXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLElBQUlBLFFBQVEsR0FBR0MsT0FBTyxDQUFDLFVBQUQsQ0FBUCxDQUFvQkMsUUFBbkM7O0FBRUFDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUVSO0FBQ0FKLElBQUFBLFFBQVEsRUFBRTtBQUNOLGlCQUFTRixRQUFRLENBQUNPLE1BRFo7QUFFTkMsTUFBQUEsSUFBSSxFQUFFUjtBQUZBLEtBSEY7QUFPUjtBQUNBUyxJQUFBQSxLQUFLLEVBQUUsRUFSQztBQVNSO0FBQ0FDLElBQUFBLE1BQU0sRUFBRVAsRUFBRSxDQUFDUSxNQVZIO0FBV1I7QUFDQUMsSUFBQUEsUUFBUSxFQUFFLEdBWkY7QUFhUjtBQUNBQyxJQUFBQSxLQUFLLEVBQUUsQ0FkQztBQWVSO0FBQ0FDLElBQUFBLElBQUksRUFBRSxDQWhCRTtBQWlCUjtBQUNBQyxJQUFBQSxLQUFLLEVBQUVaLEVBQUUsQ0FBQ1EsTUFsQkY7QUFtQlI7QUFDQUssSUFBQUEsVUFBVSxFQUFFO0FBQ1IsaUJBQVMsSUFERDtBQUVSQyxNQUFBQSxHQUFHLEVBQUVkLEVBQUUsQ0FBQ2U7QUFGQSxLQXBCSjtBQXdCUjtBQUNBQyxJQUFBQSxZQUFZLEVBQUU7QUFDVixpQkFBUyxFQURDO0FBRVZYLE1BQUFBLElBQUksRUFBRUwsRUFBRSxDQUFDaUI7QUFGQyxLQXpCTjtBQThCUkMsSUFBQUEsR0FBRyxFQUFFLEtBOUJHO0FBK0JSQyxJQUFBQSxJQUFJLEVBQUU7QUEvQkUsR0FIUDtBQXNDTDtBQUNBQyxFQUFBQSxNQUFNLEVBQUUsa0JBQVk7QUFDaEI7QUFDQSxTQUFLQyxT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QUFDVyxZQUFOLENBQW1CdkIsRUFBRSxDQUFDMkYsU0FBdEIsQ0FBWDtBQUNBRCxJQUFBQSxJQUFJLENBQUNFLElBQUw7O0FBQ0EsU0FBS3ZFLFNBQUwsQ0FBZXdFLFFBQWYsQ0FBd0IsS0FBS2pELElBQTdCO0FBQ0gsR0F2Tkk7QUF5TkxrRCxFQUFBQSxTQUFTLEVBQUUsbUJBQVM1RCxLQUFULEVBQWU7QUFDdEI7QUFDQSxRQUFHQSxLQUFLLElBQUksQ0FBWixFQUFjO0FBQ1YsV0FBS1UsSUFBTCxDQUFVbUQsT0FBVixHQUFvQixFQUFwQjtBQUNILEtBRkQsTUFFSztBQUNELFdBQUtuRCxJQUFMLENBQVVtRCxPQUFWLEdBQW9CLEdBQXBCO0FBQ0g7QUFDSjtBQWhPSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIFRhbmtUeXBlID0gcmVxdWlyZShcIlRhbmtEYXRhXCIpLnRhbmtUeXBlO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuXHJcbiAgICAgICAgLy/lnablhYvnsbvlnotcclxuICAgICAgICB0YW5rVHlwZToge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBUYW5rVHlwZS5Ob3JtYWwsXHJcbiAgICAgICAgICAgIHR5cGU6IFRhbmtUeXBlXHJcbiAgICAgICAgfSwgXHJcbiAgICAgICAgLy/pgJ/luqZcclxuICAgICAgICBzcGVlZDogMjAsXHJcbiAgICAgICAgLy/lrZDlvLlcclxuICAgICAgICBidWxsZXQ6IGNjLlByZWZhYixcclxuICAgICAgICAvL+WPkeWwhOWtkOW8uemXtOmalOaXtumXtFxyXG4gICAgICAgIGZpcmVUaW1lOiAwLjUsXHJcbiAgICAgICAgLy/ooYDph49cclxuICAgICAgICBibG9vZDogMSxcclxuICAgICAgICAvL+aJgOWxnue7hOe7h1xyXG4gICAgICAgIHRlYW06IDAsXHJcbiAgICAgICAgLy/niIbngrjliqjnlLtcclxuICAgICAgICBibGFzdDogY2MuUHJlZmFiLFxyXG4gICAgICAgIC8v5bCE5Ye76Z+z5pWIXHJcbiAgICAgICAgc2hvb3RBdWRpbzoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5Z2m5YWL55qu6IKkXHJcbiAgICAgICAgc3ByaXRlRnJhbWVzOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkaWU6IGZhbHNlLFxyXG4gICAgICAgIHN0b3A6IGZhbHNlLFxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvL+iOt+WPlue7hOS7tlxyXG4gICAgICAgIHRoaXMuX2NpdHlDdHJsID0gY2MuZmluZChcIi9DaXR5U2NyaXB0XCIpLmdldENvbXBvbmVudChcIkNpdHlTY3JpcHRcIik7XHJcbiAgICAgICAgdGhpcy5idWxsZXROb2RlID0gY2MuZmluZChcIi9DYW52YXMvTWFwL2xheWVyXzBcIik7XHJcbiAgICAgICAgLy90aGlzLmJ1bGxldE5vZGUgPSBjYy5maW5kKFwiL0NhbnZhcy9tYXAxL2xheWVyMFwiKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8v5Yid5aeL5piv5YGc5q2i54q25oCB55qEXHJcbiAgICAgICAgdGhpcy5zdG9wTW92ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5zdG9wID0gZmFsc2U7XHJcbiAgICAgICAgLy/lgY/np7vph49cclxuICAgICAgICB0aGlzLm9mZnNldCA9IGNjLnYyKCk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMudGFua1R5cGUgIT0gVGFua1R5cGUuUGxheWVyKXtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAvL+a3u+WKoEFJXHJcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGNjLmNhbGxGdW5jKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgYW5nbGVzID0gWzAsIDkwLCAxODAsIDI3MF07XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludChNYXRoLnJhbmRvbSgpKjQsIDEwKTtcclxuICAgICAgICAgICAgICAgIHNlbGYudGFua01vdmVTdGFydChhbmdsZXNbaW5kZXhdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnN0YXJ0RmlyZShzZWxmLl9jaXR5Q3RybC5idWxsZXRQb29sKTtcclxuXHJcbiAgICAgICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKGNjLmRlbGF5VGltZSgwLjMpLCBjYWxsYmFjaywgY2MuZGVsYXlUaW1lKDEpKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5yZXBlYXRGb3JldmVyKHNlcSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8v5re75Yqg5Z2m5YWL56e75Yqo5Yqo5L2cXHJcbiAgICB0YW5rTW92ZVN0YXJ0OiBmdW5jdGlvbiAoYW5nbGUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLmFuZ2xlID0gYW5nbGUgLSA5MDtcclxuXHJcbiAgICAgICAgaWYoYW5nbGU9PTAgfHwgYW5nbGU9PTE4MCB8fCBhbmdsZT09OTApe1xyXG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IGNjLnYyKE1hdGguZmxvb3IoTWF0aC5jb3MoTWF0aC5QSS8xODAqYW5nbGUpKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5zaW4oTWF0aC5QSS8xODAqYW5nbGUpKSk7XHJcbiAgICAgICAgfWVsc2UgaWYoYW5nbGU9PTI3MCl7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IGNjLnYyKE1hdGguY2VpbChNYXRoLmNvcyhNYXRoLlBJLzE4MCphbmdsZSkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5zaW4oTWF0aC5QSS8xODAqYW5nbGUpKSk7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IGNjLnYyKE1hdGguY29zKE1hdGguUEkvMTgwKmFuZ2xlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNpbihNYXRoLlBJLzE4MCphbmdsZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zdG9wTW92ZSA9IGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+enu+mZpOWdpuWFi+enu+WKqOWKqOS9nFxyXG4gICAgdGFua01vdmVTdG9wOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wTW92ZSA9IHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIHRhbmtTdG9wOiBmdW5jdGlvbiAoKXtcclxuICAgICAgICB0aGlzLnN0b3AgPSB0cnVlO1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5wYXVzZUFsbFJ1bm5pbmdBY3Rpb25zKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgICAgICBpZih0aGlzLnN0b3Ape1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighdGhpcy5zdG9wTW92ZSl7XHJcbiAgICAgICAgICAgIHZhciBib3VuZGluZ0JveCA9IHRoaXMubm9kZS5nZXRCb3VuZGluZ0JveCgpO1xyXG4gICAgICAgICAgICB2YXIgcmVjdCA9IGNjLnJlY3QoYm91bmRpbmdCb3gueE1pbiArIHRoaXMub2Zmc2V0LngqdGhpcy5zcGVlZCpkdCoxLjUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3VuZGluZ0JveC55TWluICsgdGhpcy5vZmZzZXQueSp0aGlzLnNwZWVkKmR0KjEuNywgXHJcblx0XHQgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kaW5nQm94LnNpemUud2lkdGgsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRpbmdCb3guc2l6ZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9jaXR5Q3RybC5jb2xsaXNpb25UZXN0KHJlY3QpIC8v5qOA5rWL5LiO5Zyw5Zu+55qE56Kw5pKeXHJcbiAgICAgICAgICAgICAgICB8fCB0aGlzLmNvbGxpc2lvblRhbmsocmVjdClcclxuICAgICAgICAgICAgICAgICl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhbmtNb3ZlU3RvcCgpO1xyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCArPSB0aGlzLm9mZnNldC54KnRoaXMuc3BlZWQqZHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSArPSB0aGlzLm9mZnNldC55KnRoaXMuc3BlZWQqZHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5zdG9wRmlyZSl7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZVRpbWUgLT0gZHQ7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZmlyZVRpbWU8PTApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wRmlyZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy/liKTmlq3mmK/lkKbkuI7lhbbku5blnablhYvnorDmkp5cclxuICAgIGNvbGxpc2lvblRhbms6IGZ1bmN0aW9uKHJlY3QpIHtcclxuICAgICAgICBmb3IodmFyIGk9MDsgaTxjYy5nYW1lRGF0YS50YW5rTGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIHZhciB0YW5rID0gY2MuZ2FtZURhdGEudGFua0xpc3RbaV1cclxuICAgICAgICAgICAgaWYodGhpcy5ub2RlID09PSB0YW5rKXtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBib3VuZGluZ0JveCA9IHRhbmsuZ2V0Qm91bmRpbmdCb3goKTtcclxuICAgICAgICAgICAgLy8gaWYoY2MucmVjdEludGVyc2VjdHNSZWN0KHJlY3QsIGJvdW5kaW5nQm94KSl7XHJcbiAgICAgICAgICAgIGlmKHJlY3QuaW50ZXJzZWN0cyhib3VuZGluZ0JveCkpeyAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIC8v5byA54GrXHJcbiAgICBzdGFydEZpcmU6IGZ1bmN0aW9uIChidWxsZXRQb29sKXtcclxuICAgICAgICBpZih0aGlzLnN0b3BGaXJlKXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3BGaXJlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmZpcmVUaW1lID0gMC41O1xyXG5cclxuICAgICAgICB2YXIgYnVsbGV0ID0gbnVsbDtcclxuICAgICAgICBpZihidWxsZXRQb29sLnNpemUoKT4wKXtcclxuICAgICAgICAgICAgYnVsbGV0ID0gYnVsbGV0UG9vbC5nZXQoYnVsbGV0UG9vbCk7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICBidWxsZXQgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmJ1bGxldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8v6K6+572u5a2Q5by55L2N572uLOinkuW6plxyXG4gICAgICAgIGJ1bGxldC5hbmdsZSA9IHRoaXMubm9kZS5hbmdsZTtcclxuICAgICAgICB2YXIgcG9zID0gdGhpcy5ub2RlLnBvc2l0aW9uO1xyXG5cclxuICAgICAgICB2YXIgYW5nbGUgPSB0aGlzLm5vZGUuYW5nbGUgLSA5MDtcclxuICAgICAgICB2YXIgb2Zmc2V0ID0gY2MudjIoMCwgMCk7XHJcbiAgICAgICAgaWYoYW5nbGU9PTAgfHwgYW5nbGU9PTE4MCB8fCBhbmdsZT09OTApe1xyXG4gICAgICAgICAgICBvZmZzZXQgPSBjYy52MihNYXRoLmZsb29yKE1hdGguY29zKE1hdGguUEkvMTgwKmFuZ2xlKSksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5zaW4oTWF0aC5QSS8xODAqYW5nbGUpKSk7XHJcbiAgICAgICAgfWVsc2UgaWYoYW5nbGU9PTI3MCl7XHJcbiAgICAgICAgICAgIG9mZnNldCA9IGNjLnYyKE1hdGguY2VpbChNYXRoLmNvcyhNYXRoLlBJLzE4MCphbmdsZSkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5zaW4oTWF0aC5QSS8xODAqYW5nbGUpKSk7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICBvZmZzZXQgPSBjYy52MihNYXRoLmNvcyhNYXRoLlBJLzE4MCphbmdsZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5zaW4oTWF0aC5QSS8xODAqYW5nbGUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGFuZ2xlID09IC05MCl7XHJcbiAgICAgICAgICAgIC8vY2MubG9nKFwi5LiKXCIpO1xyXG4gICAgICAgICAgICBidWxsZXQucG9zaXRpb24gPSBwb3MuYWRkKGNjLnYyKDEwKm9mZnNldC54LCAxMCpvZmZzZXQueSArIDE1KSk7XHJcbiAgICAgICAgfWVsc2UgaWYoYW5nbGUgPT0gMCl7XHJcbiAgICAgICAgICAgIC8vY2MubG9nKFwi5bemXCIpO1xyXG4gICAgICAgICAgICBidWxsZXQucG9zaXRpb24gPSBwb3MuYWRkKGNjLnYyKDEwKm9mZnNldC54IC0gMTUsIDEwKm9mZnNldC55KSk7XHJcbiAgICAgICAgfWVsc2UgaWYoYW5nbGUgPT0gLTE4MCl7XHJcbiAgICAgICAgICAgIC8vY2MubG9nKFwi5Y+zXCIpO1xyXG4gICAgICAgICAgICBidWxsZXQucG9zaXRpb24gPSBwb3MuYWRkKGNjLnYyKDEwKm9mZnNldC54ICsgMTUsIDEwKm9mZnNldC55KSk7XHJcbiAgICAgICAgfWVsc2UgaWYoYW5nbGUgPT0gOTApe1xyXG4gICAgICAgICAgICAvL2NjLmxvZyhcIuS4i1wiKTtcclxuICAgICAgICAgICAgYnVsbGV0LnBvc2l0aW9uID0gcG9zLmFkZChjYy52MigxMCpvZmZzZXQueCwgMTAqb2Zmc2V0LnkgLSAxNSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYnVsbGV0LnBvc2l0aW9uID0gY2MucEFkZChwb3MsY2MudjIoMTAqb2Zmc2V0LngsIDEwKm9mZnNldC55KSk7XHJcblxyXG4gICAgICAgIGJ1bGxldC5nZXRDb21wb25lbnQoXCJCdWxsZXRTY3JpcHRcIikuYnVsbGV0TW92ZSgpO1xyXG4gICAgICAgIGJ1bGxldC5wYXJlbnQgPSB0aGlzLmJ1bGxldE5vZGU7XHJcbiAgICAgICAgLy/lrZDlvLnmoIforrBcclxuICAgICAgICBidWxsZXQuY2FtcCA9IHRoaXMudGVhbTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgLy/liqDliLDliJfooahcclxuICAgICAgICBjYy5nYW1lRGF0YS5idWxsZXRMaXN0LnB1c2goYnVsbGV0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8v54iG54K4XHJcbiAgICBib29tOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBibGFzdCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYmxhc3QpO1xyXG4gICAgICAgIGJsYXN0LnBhcmVudCA9IHRoaXMubm9kZS5wYXJlbnQ7XHJcbiAgICAgICAgYmxhc3QucG9zaXRpb24gPSB0aGlzLm5vZGUucG9zaXRpb247XHJcbiAgICAgICAgdmFyIGFuaW0gPSBibGFzdC5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcclxuICAgICAgICBhbmltLnBsYXkoKTtcclxuICAgICAgICB0aGlzLl9jaXR5Q3RybC50YW5rQm9vbSh0aGlzLm5vZGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICB0dXJuR3JlZW46IGZ1bmN0aW9uKGluZGV4KXtcclxuICAgICAgICAvL3RoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IHRoaXMuc3ByaXRlRnJhbWVzW2luZGV4XTtcclxuICAgICAgICBpZihpbmRleCA9PSAwKXtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSA1NVxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDI1NVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG59KTtcclxuIl19
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
    if (cc.gameData.curLevel <= 0) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQ2hvaWNlU2NyaXB0LmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiY3VyTGV2ZWxMYWJlbCIsIkxhYmVsIiwib25Mb2FkIiwiZ2FtZURhdGEiLCJjdXJMZXZlbCIsInVwZGF0ZUxldmVsTGFiZWwiLCJvblBsYXkiLCJzZWxmIiwibG9hZGVyIiwib25Qcm9ncmVzcyIsImNvbXBsZXRlZENvdW50IiwidG90YWxDb3VudCIsIml0ZW0iLCJjb25zb2xlIiwibG9nIiwiZGlyZWN0b3IiLCJwcmVsb2FkU2NlbmUiLCJhc3NldHMiLCJlcnJvciIsImxvYWRTY2VuZSIsIm9uVXAiLCJvbk5leHQiLCJzdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLElBQUFBLGFBQWEsRUFBQ0osRUFBRSxDQUFDSztBQVhULEdBSFA7QUFrQkw7QUFDQUMsRUFBQUEsTUFBTSxFQUFFLGtCQUFZO0FBQ2hCTixJQUFBQSxFQUFFLENBQUNPLFFBQUgsR0FBYyxFQUFkO0FBQ0FQLElBQUFBLEVBQUUsQ0FBQ08sUUFBSCxDQUFZQyxRQUFaLEdBQXVCLENBQXZCO0FBQ0EsU0FBS0MsZ0JBQUw7QUFDSCxHQXZCSTtBQTBCTEMsRUFBQUEsTUFBTSxFQUFFLGtCQUFZO0FBQ2hCLFFBQUlDLElBQUksR0FBRyxJQUFYOztBQUNBWCxJQUFBQSxFQUFFLENBQUNZLE1BQUgsQ0FBVUMsVUFBVixHQUF1QixVQUFVQyxjQUFWLEVBQTBCQyxVQUExQixFQUFzQ0MsSUFBdEMsRUFBMkM7QUFDOURDLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSixjQUFjLEdBQUMsR0FBZixHQUFtQkMsVUFBL0I7QUFDSCxLQUZEOztBQUdBZixJQUFBQSxFQUFFLENBQUNtQixRQUFILENBQVlDLFlBQVosQ0FBeUIsY0FBYXBCLEVBQUUsQ0FBQ08sUUFBSCxDQUFZQyxRQUFsRCxFQUE0RCxVQUFVYSxNQUFWLEVBQWtCQyxLQUFsQixFQUF3QjtBQUNoRjtBQUNBdEIsTUFBQUEsRUFBRSxDQUFDbUIsUUFBSCxDQUFZSSxTQUFaLENBQXNCLGNBQWF2QixFQUFFLENBQUNPLFFBQUgsQ0FBWUMsUUFBL0M7QUFDSCxLQUhEO0FBSUgsR0FuQ0k7QUFxQ0xnQixFQUFBQSxJQUFJLEVBQUUsZ0JBQVk7QUFDZCxRQUFHeEIsRUFBRSxDQUFDTyxRQUFILENBQVlDLFFBQVosSUFBd0IsQ0FBM0IsRUFBNkI7QUFDekI7QUFDSDs7QUFDRFIsSUFBQUEsRUFBRSxDQUFDTyxRQUFILENBQVlDLFFBQVosSUFBd0IsQ0FBeEI7QUFDQSxTQUFLQyxnQkFBTDtBQUNILEdBM0NJO0FBNkNMZ0IsRUFBQUEsTUFBTSxFQUFFLGtCQUFZO0FBQ2hCLFFBQUd6QixFQUFFLENBQUNPLFFBQUgsQ0FBWUMsUUFBWixHQUFxQixDQUFyQixHQUF5QixFQUE1QixFQUErQjtBQUMzQjtBQUNIOztBQUNEUixJQUFBQSxFQUFFLENBQUNPLFFBQUgsQ0FBWUMsUUFBWixJQUF3QixDQUF4QjtBQUNBLFNBQUtDLGdCQUFMO0FBQ0gsR0FuREk7QUFxRExBLEVBQUFBLGdCQUFnQixFQUFFLDRCQUFZO0FBQzFCLFNBQUtMLGFBQUwsQ0FBbUJzQixNQUFuQixHQUE0QixXQUFTMUIsRUFBRSxDQUFDTyxRQUFILENBQVlDLFFBQWpEO0FBQ0gsR0F2REksQ0EwREw7QUFDQTtBQUVBOztBQTdESyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIGZvbzoge1xyXG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcclxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgLy8gLi4uXHJcbiAgICAgICAgY3VyTGV2ZWxMYWJlbDpjYy5MYWJlbCxcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2MuZ2FtZURhdGEgPSB7fTtcclxuICAgICAgICBjYy5nYW1lRGF0YS5jdXJMZXZlbCA9IDE7XHJcbiAgICAgICAgdGhpcy51cGRhdGVMZXZlbExhYmVsKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIFxyXG4gICAgb25QbGF5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGNjLmxvYWRlci5vblByb2dyZXNzID0gZnVuY3Rpb24gKGNvbXBsZXRlZENvdW50LCB0b3RhbENvdW50LCBpdGVtKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY29tcGxldGVkQ291bnQrXCIvXCIrdG90YWxDb3VudCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjYy5kaXJlY3Rvci5wcmVsb2FkU2NlbmUoXCJDaXR5U2NlbmVcIisgY2MuZ2FtZURhdGEuY3VyTGV2ZWwsIGZ1bmN0aW9uIChhc3NldHMsIGVycm9yKXtcclxuICAgICAgICAgICAgLy/ot7PovazliLDmuLjmiI/nlYzpnaJcclxuICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiQ2l0eVNjZW5lXCIrIGNjLmdhbWVEYXRhLmN1ckxldmVsKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgb25VcDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmKGNjLmdhbWVEYXRhLmN1ckxldmVsIDw9IDApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNjLmdhbWVEYXRhLmN1ckxldmVsIC09IDE7IFxyXG4gICAgICAgIHRoaXMudXBkYXRlTGV2ZWxMYWJlbCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbk5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZihjYy5nYW1lRGF0YS5jdXJMZXZlbCsxID4gMTApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNjLmdhbWVEYXRhLmN1ckxldmVsICs9IDE7IFxyXG4gICAgICAgIHRoaXMudXBkYXRlTGV2ZWxMYWJlbCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cGRhdGVMZXZlbExhYmVsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJMZXZlbExhYmVsLnN0cmluZyA9IFwiUm91bmQgXCIrY2MuZ2FtZURhdGEuY3VyTGV2ZWw7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIl19
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
//------QC-SOURCE-SPLIT------
