window.__require=function t(e,i,n){function a(o,s){if(!i[o]){if(!e[o]){var l=o.split("/");if(l=l[l.length-1],!e[l]){var r="function"==typeof __require&&__require;if(!s&&r)return r(l,!0);if(c)return c(l,!0);throw new Error("Cannot find module '"+o+"'")}o=l}var h=i[o]={exports:{}};e[o][0].call(h.exports,function(t){return a(e[o][1][t]||t)},h,h.exports,t,e,i,n)}return i[o].exports}for(var c="function"==typeof __require&&__require,o=0;o<n.length;o++)a(n[o]);return a}({AssetsLoadScript:[function(t,e,i){"use strict";cc._RF.push(e,"dbc42i0xlVKnap/Lbb+PPHz","AssetsLoadScript"),cc.Class({extends:cc.Component,properties:{numLabel:cc.Label},onLoad:function(){var t=this,e=[{id:"tank",url:cc.url.raw("resources/tank.plist")}];cc.LoadingItems.create(cc.loader,e,function(e,i,n){var a=(100*e/i).toFixed(2);cc.log(a+"%"),t.numLabel.string=Math.abs(a)+"%",console.log("=========="+n.url)},function(t,e){if(t)for(var i=0;i<t.length;++i)cc.log("Error url: "+t[i]+", error: "+e.getError(t[i]));else console.log(e.totalCount)})}}),cc._RF.pop()},{}],BlastScript:[function(t,e,i){"use strict";cc._RF.push(e,"5b5e1COo/dBsbkA/Ng9jaEv","BlastScript"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){},playFinish:function(){this.node.parent=null}}),cc._RF.pop()},{}],BulletScript:[function(t,e,i){"use strict";cc._RF.push(e,"f2438tTsclDlKMotV5yR31a","BulletScript");t("TankData").tankType;cc.Class({extends:cc.Component,properties:{speed:20,camp:0},onLoad:function(){this._cityCtrl=cc.find("/CityScript").getComponent("CityScript")},reuse:function(t){this.bulletPool=t},bulletMove:function(){var t=90-this.node.angle;this.offset=0==t||180==t||90==t?cc.v2(Math.floor(Math.cos(Math.PI/180*t)),Math.floor(Math.sin(Math.PI/180*t))):270==t?cc.v2(Math.ceil(Math.cos(Math.PI/180*t)),Math.floor(Math.sin(Math.PI/180*t))):cc.v2(Math.cos(Math.PI/180*t),Math.sin(Math.PI/180*t))},bulletBoom:function(){this.node.parent=null,this.bulletPool.put(this.node)},update:function(t){this.node.x+=this.offset.x*this.speed*t,this.node.y+=this.offset.y*this.speed*t;var e=this.node.getBoundingBox();(this._cityCtrl.collisionTest(e,!0)||this.collisionTank(e))&&this.bulletBoom()},collisionTank:function(t){for(var e=0;e<cc.gameData.tankList.length;e++){var i=cc.gameData.tankList[e],n=i.getComponent("TankScript");if(n.team!=this.node.camp&&!n.die){var a=i.getBoundingBox();if(t.intersects(a))return--n.blood<=0&&n.boom(),!0}}return!1}}),cc._RF.pop()},{TankData:"TankData"}],ChoiceScript:[function(t,e,i){"use strict";cc._RF.push(e,"e3410Xfj7dGI7X2/mwrPXFs","ChoiceScript"),cc.Class({extends:cc.Component,properties:{curLevelLabel:cc.Label},onLoad:function(){cc.gameData={},cc.gameData.curLevel=1,this.updateLevelLabel()},onPlay:function(){cc.loader.onProgress=function(t,e,i){console.log(t+"/"+e)},cc.director.preloadScene("CityScene"+cc.gameData.curLevel,function(t,e){cc.director.loadScene("CityScene"+cc.gameData.curLevel)})},onUp:function(){cc.gameData.curLevel-1<=0||(cc.gameData.curLevel-=1,this.updateLevelLabel())},onNext:function(){cc.gameData.curLevel+1>20||(cc.gameData.curLevel+=1,this.updateLevelLabel())},updateLevelLabel:function(){this.curLevelLabel.string="Round "+cc.gameData.curLevel}}),cc._RF.pop()},{}],CityScript:[function(t,e,i){"use strict";cc._RF.push(e,"7f0b08Dcw5F7oWFl36ggKRC","CityScript");var n=t("TankData").tankType;cc.Class({extends:cc.Component,properties:{curMap:cc.TiledMap,yaogan:cc.Node,bullet:cc.Prefab,tank:{default:null,type:cc.Prefab},maxCount:5,bornPoses:{default:[],type:cc.Vec2},spriteFrames:{default:[],type:cc.SpriteFrame},tankSpeeds:{default:[],type:cc.Float},tankFireTimes:{default:[],type:cc.Float},tankBloods:{default:[],type:cc.Integer}},onLoad:function(){this._joystickCtrl=this.yaogan.getComponent("JoystickCtrl"),this._tiledMap=this.curMap.getComponent("cc.TiledMap")},start:function(e){if(!e){this.curAngle=null;this.registerInputEvent(),this._tiledMapData=t("TiledMapData"),this._curMapTileSize=this._tiledMap.getTileSize(),this._curMapSize=cc.v2(this._tiledMap.node.width,this._tiledMap.node.height),this.mapLayer0=this._tiledMap.getLayer("layer_0"),this.bulletPool=new cc.NodePool("BulletScript");for(var i=0;i<20;++i){var n=cc.instantiate(this.bullet);this.bulletPool.put(n)}this.tankPool=new cc.NodePool("TankScript");for(i=0;i<this.maxCount;++i){var a=cc.instantiate(this.tank);this.tankPool.put(a)}cc.gameData||(cc.gameData={}),cc.gameData.teamId=0,cc.gameData.single=!0,cc.gameData.tankList=[],cc.gameData.bulletList=[],this.tankNode=cc.find("/Canvas/Map/tank"),this.player=this.addPlayerTank(),this._playerTankCtrl=this.player.getComponent("TankScript"),this.schedule(this.addAITank,3,cc.macro.REPEAT_FOREVER,1)}},registerInputEvent:function(){var t=this;this._joystickCtrl.addJoyStickTouchChangeListener(function(e){(e!=t.curAngle||t._playerTankCtrl.stopMove)&&(t.curAngle=e,null!=e?t._playerTankCtrl.tankMoveStart(e):t._playerTankCtrl.tankMoveStop())}),cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,function(e){var i=null;switch(e.keyCode){case cc.macro.KEY.w:i=90;break;case cc.macro.KEY.s:i=270;break;case cc.macro.KEY.a:i=180;break;case cc.macro.KEY.d:i=0}e.keyCode==cc.macro.KEY.k?this.fireBtnClick():t._playerTankCtrl.tankMoveStop(),null!=i&&t._playerTankCtrl.tankMoveStart(i)},this),cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,function(e){e.keyCode!=cc.macro.KEY.k&&t._playerTankCtrl.tankMoveStop()},this)},collisionTest:function(t,e){if(t.xMin<=-this._curMapSize.x/2||t.xMax>=this._curMapSize.x/2||t.yMin<=-this._curMapSize.y/2||t.yMax>=this._curMapSize.y/2)return!0;var i=this._curMapSize.y/2-t.yMin,n=this._curMapSize.y/2-t.yMax,a=this._curMapSize.x/2+t.xMin,c=this._curMapSize.x/2+t.xMax,o=cc.v2(a,i),s=cc.v2(c,i),l=cc.v2(a,n),r=cc.v2(c,n),h=cc.v2(a+(c-a)/2,i),p=cc.v2(a+(c-a)/2,n),u=cc.v2(a,i+(n-i)/2),d=cc.v2(c,i+(n-i)/2);return this._collisionTest([o,s,l,r,h,p,u,d],e)},_collisionTest:function(t,e){var i=t.shift(),n=this.mapLayer0.getTileGIDAt(cc.v2(parseInt(i.x/this._curMapTileSize.width),parseInt(i.y/this._curMapTileSize.height)));return this._tiledMapData.gidToTileType[n]!=this._tiledMapData.tileType.tileNone&&this._tiledMapData.gidToTileType[n]!=this._tiledMapData.tileType.tileGrass?(e&&this._tiledMapData.gidToTileType[n]==this._tiledMapData.tileType.tileWall&&this.mapLayer0.setTileGIDAt(0,parseInt(i.x/this._curMapTileSize.width),parseInt(i.y/this._curMapTileSize.height),1),!0):t.length>0&&this._collisionTest(t,e)},addPlayerTank:function(t){if(this.tankPool.size()>0){var e=this.tankPool.get();e.getComponent(cc.Sprite).spriteFrame=this.spriteFrames[this.spriteFrames.length-1],e.position=this.bornPoses[this.bornPoses.length-1];var i=e.getComponent("TankScript");return i.tankType=n.Player,i.speed=this.tankSpeeds[this.tankSpeeds.length-1],i.fireTime=this.tankFireTimes[this.tankFireTimes.length-1],i.blood=this.tankBloods[this.tankBloods.length-1],i.die=!1,t?i.team=t:cc.gameData.single?i.team=0:i.team=++cc.gameData.teamId,e.parent=this.tankNode,cc.gameData.tankList.push(e),e}return null},addAITank:function(t,e){if(this.tankPool.size()>0){var i=this.tankPool.get(),n=parseInt(3*Math.random(),10),a=i.getComponent("TankScript");if(i.getComponent(cc.Sprite).spriteFrame=this.spriteFrames[n],i.position=this.bornPoses[n],a.tankType=n,a.speed=this.tankSpeeds[n],a.fireTime=this.tankFireTimes[n],a.blood=this.tankBloods[n],a.die=!1,e?a.team=e:cc.gameData.single?a.team=1:a.team=++cc.gameData.teamId,0==n?i.angle=90:1==n?i.angle=180:2==n&&(i.angle=270),a.collisionTank(i.getBoundingBox()))for(var c=0;c<this.bornPoses.length-1&&(i.position=this.bornPoses[c],a.collisionTank(i.getBoundingBox()));c++);i.parent=this.tankNode,cc.gameData.tankList.push(i)}},tankBoom:function(t){t.parent=null,t.getComponent("TankScript").die=!0,this.tankPool.put(t),cc.gameData.single&&0==t.getComponent("TankScript").team&&cc.director.loadScene("StartScene")},fireBtnClick:function(){this._playerTankCtrl.startFire(this.bulletPool)&&cc.audioEngine.play(this._playerTankCtrl.shootAudio,!1,1)},onDestroy:function(){this.unschedule(this.addAITank,this)}}),cc._RF.pop()},{TankData:"TankData",TiledMapData:"TiledMapData"}],JoystickCtrl:[function(t,e,i){"use strict";cc._RF.push(e,"dae4fVvAkJBQYB/rfJD67I3","JoystickCtrl");var n=cc.Enum({DEFAULT:0,FOLLOW:1}),a=cc.Enum({FOUR:0,EIGHT:1,ALL:2});cc.Class({extends:cc.Component,properties:{joystickBar:{default:null,type:cc.Node},joystickBG:{default:null,type:cc.Node},radius:0,touchType:{default:n.DEFAULT,type:n},directionType:{default:a.ALL,type:a},curAngle:{default:0,visible:!1},distance:{default:0,visible:!1}},onLoad:function(){0==this.radius&&(this.radius=this.joystickBG.width/2),this.registerInput(),this.distance=0,this.curAngle=0,this.initPos=this.node.position,this.node.opacity=50},addJoyStickTouchChangeListener:function(t){this.angleChange=t},registerInput:function(){var t=this;this.node.on("touchstart",function(e){return t.onTouchBegan(e)},this),this.node.on("touchmove",function(e){return t.onTouchMoved(e)},this),this.node.on("touchend",function(){return t.onTouchEnded()},this)},onTouchBegan:function(t){if(this.touchType==n.FOLLOW){var e=this.node.parent.convertToNodeSpaceAR(t.getLocation());return this.node.setPosition(e),!0}e=this.node.convertToNodeSpaceAR(t.getLocation());var i=cc.v2(e,cc.Vec2(0,0));return i.mag(),i<this.radius&&(i>20&&(this.node.opacity=255,this.joystickBar.setPosition(e),this._getAngle(e)),!0)},onTouchMoved:function(t){var e=this.node.convertToNodeSpaceAR(t.getLocation()),i=cc.v2(e,cc.Vec2(0,0));if(i.mag(),this.radius>=i)i>20?(this.node.opacity=255,this.joystickBar.setPosition(e),this._getAngle(e)):(this.node.opacity=50,this.joystickBar.setPosition(cc.Vec2(0,0)),this.curAngle=null,this.angleChange&&this.angleChange(this.curAngle));else{var n=Math.cos(this._getRadian(e))*this.radius,a=Math.sin(this._getRadian(e))*this.radius;e.x>0&&e.y<0?a*=-1:e.x<0&&e.y<0&&(a*=-1),this.joystickBar.setPosition(cc.Vec2(n,a)),this._getAngle(e)}},onTouchEnded:function(){this.node.opacity=50,this.touchType==n.FOLLOW&&(this.node.position=this.initPos),this.joystickBar.setPosition(cc.Vec2(0,0)),this.curAngle=null,this.angleChange&&this.angleChange(this.curAngle)},_getAngle:function(t){return this._angle=Math.floor(180*this._getRadian(t)/Math.PI),t.x>0&&t.y<0?this._angle=360-this._angle:t.x<0&&t.y<0?this._angle=360-this._angle:t.x<0&&0==t.y?this._angle=180:t.x>0&&0==t.y?this._angle=0:0==t.x&&t.y>0?this._angle=90:0==t.x&&t.y<0&&(this._angle=270),this._updateCurAngle(),this._angle},_getRadian:function(t){var e=Math.sqrt(Math.pow(t.x,2)+Math.pow(t.y,2));return this._radian=0==e?0:Math.acos(t.x/e),this._radian},_updateCurAngle:function(){switch(this.directionType){case a.FOUR:this.curAngle=this._fourDirections();break;case a.EIGHT:this.curAngle=this._eightDirections();break;case a.ALL:this.curAngle=this._angle;break;default:this.curAngle=null}this.angleChange&&this.angleChange(this.curAngle)},_fourDirections:function(){return this._angle>=45&&this._angle<=135?90:this._angle>=225&&this._angle<=315?270:this._angle<=225&&this._angle>=180||this._angle>=135&&this._angle<=180?180:this._angle<=360&&this._angle>=315||this._angle>=0&&this._angle<=45?0:void 0},_eightDirections:function(){return this._angle>=67.5&&this._angle<=112.5?90:this._angle>=247.5&&this._angle<=292.5?270:this._angle<=202.5&&this._angle>=180||this._angle>=157.5&&this._angle<=180?180:this._angle<=360&&this._angle>=337.5||this._angle>=0&&this._angle<=22.5?0:this._angle>=112.5&&this._angle<=157.5?135:this._angle>=22.5&&this._angle<=67.5?45:this._angle>=202.5&&this._angle<=247.5?225:this._angle>=292.5&&this._angle<=337.5?315:void 0},onDestroy:function(){this.node.off("touchstart"),this.node.off("touchmove"),this.node.off("touchend")}}),cc._RF.pop()},{}],NoTouchScript:[function(t,e,i){"use strict";cc._RF.push(e,"006beoNQNNHAL+jJtWDR7Tw","NoTouchScript"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){this._listener=cc.eventManager.addListener({event:cc.EventListener.TOUCH_ONE_BY_ONE,onTouchBegan:function(t,e){return e.stopPropagation(),!0},onTouchMoved:function(t,e){e.stopPropagation()},onTouchEnded:function(t,e){e.stopPropagation()}},this.node),cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,function(t){t.stopPropagation()},this),cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,function(t){t.stopPropagation()},this)}}),cc._RF.pop()},{}],StartScript:[function(t,e,i){"use strict";cc._RF.push(e,"f8dfbi1cPZJIqQT0xgFEygS","StartScript"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){cc.globalData||(cc.globalData={})},loadChoiceScene:function(){cc.director.loadScene("ChoiceScene")}}),cc._RF.pop()},{}],TankData:[function(t,e,i){"use strict";cc._RF.push(e,"b9949Ww8jpJ1Kwi2x0Vtnnc","TankData");var n=cc.Enum({Normal:0,Speed:1,Armor:2,Player:3});e.exports={tankType:n},cc._RF.pop()},{}],TankScript:[function(t,e,i){"use strict";cc._RF.push(e,"6ce61tIUVFH+4QczJMrP1cD","TankScript");var n=t("TankData").tankType;cc.Class({extends:cc.Component,properties:{tankType:{default:n.Normal,type:n},speed:20,bullet:cc.Prefab,fireTime:.5,blood:1,team:0,blast:cc.Prefab,shootAudio:{default:null,url:cc.AudioClip},die:!1},onLoad:function(){this._cityCtrl=cc.find("/CityScript").getComponent("CityScript"),this.bulletNode=cc.find("/Canvas/Map/bullet")},start:function(){if(this.stopMove=!0,this.offset=cc.v2(),this.tankType!=n.Player){var t=this,e=cc.callFunc(function(){var e=parseInt(4*Math.random(),10);t.tankMoveStart([0,90,180,270][e]),t.startFire(t._cityCtrl.bulletPool)},this),i=cc.sequence(cc.delayTime(.3),e,cc.delayTime(1));this.node.runAction(cc.repeatForever(i))}},tankMoveStart:function(t){this.node.angle=90-t,this.offset=0==t||180==t||90==t?cc.v2(Math.floor(Math.cos(Math.PI/180*t)),Math.floor(Math.sin(Math.PI/180*t))):270==t?cc.v2(Math.ceil(Math.cos(Math.PI/180*t)),Math.floor(Math.sin(Math.PI/180*t))):cc.v2(Math.cos(Math.PI/180*t),Math.sin(Math.PI/180*t)),this.stopMove=!1},tankMoveStop:function(){this.stopMove=!0},update:function(t){if(!this.stopMove){var e=this.node.getBoundingBox(),i=cc.rect(e.xMin+this.offset.x*this.speed*t*1.5,e.yMin+this.offset.y*this.speed*t*1.7,e.size.width,e.size.height);this._cityCtrl.collisionTest(i)||this.collisionTank(i)?this.tankMoveStop():(this.node.x+=this.offset.x*this.speed*t,this.node.y+=this.offset.y*this.speed*t)}this.stopFire&&(this.fireTime-=t,this.fireTime<=0&&(this.stopFire=!1))},collisionTank:function(t){for(var e=0;e<cc.gameData.tankList.length;e++){var i=cc.gameData.tankList[e];if(this.node!==i){var n=i.getBoundingBox();if(t.intersects(n))return!0}}return!1},startFire:function(t){if(this.stopFire)return!1;this.stopFire=!0,this.fireTime=.5;var e=null;(e=t.size()>0?t.get(t):cc.instantiate(this.bullet)).angle=this.node.angle;var i=this.node.position,n=90-this.node.angle,a=cc.v2(0,0);return a=0==n||180==n||90==n?cc.v2(Math.floor(Math.cos(Math.PI/180*n)),Math.floor(Math.sin(Math.PI/180*n))):270==n?cc.v2(Math.ceil(Math.cos(Math.PI/180*n)),Math.floor(Math.sin(Math.PI/180*n))):cc.v2(Math.cos(Math.PI/180*n),Math.sin(Math.PI/180*n)),e.position=i.add(cc.v2(10*a.x,10*a.y)),e.getComponent("BulletScript").bulletMove(),e.parent=this.bulletNode,e.camp=this.team,cc.gameData.bulletList.push(e),!0},boom:function(){var t=cc.instantiate(this.blast);t.parent=this.node.parent,t.position=this.node.position,t.getComponent(cc.Animation).play(),this._cityCtrl.tankBoom(this.node)}}),cc._RF.pop()},{TankData:"TankData"}],TiledMapData:[function(t,e,i){"use strict";cc._RF.push(e,"e0850dHf3VMs6DaFbgNuP0k","TiledMapData");var n=cc.Enum({tileNone:0,tileGrass:1,tileSteel:2,tileWall:3,tileRiver:4,tileKing:5}),a=[n.tileNone,n.tileNone,n.tileNone,n.tileGrass,n.tileGrass,n.tileSteel,n.tileSteel,n.tileNone,n.tileNone,n.tileGrass,n.tileGrass,n.tileSteel,n.tileSteel,n.tileWall,n.tileWall,n.tileRiver,n.tileRiver,n.tileKing,n.tileKing,n.tileWall,n.tileWall,n.tileRiver,n.tileRiver,n.tileKing,n.tileKing,n.tileKing,n.tileKing,n.tileNone,n.tileNone,n.tileNone,n.tileNone,n.tileKing,n.tileKing,n.tileNone,n.tileNone,n.tileNone,n.tileNone];e.exports={tileType:n,gidToTileType:a},cc._RF.pop()},{}],"use_v2.0.x_cc.Toggle_event":[function(t,e,i){"use strict";cc._RF.push(e,"cc9b2AaqShElJcN9CviO1HM","use_v2.0.x_cc.Toggle_event"),cc.Toggle&&(cc.Toggle._triggerEventInScript_check=!0),cc._RF.pop()},{}]},{},["JoystickCtrl","use_v2.0.x_cc.Toggle_event","AssetsLoadScript","BlastScript","BulletScript","ChoiceScript","CityScript","NoTouchScript","StartScript","TankData","TankScript","TiledMapData"]);