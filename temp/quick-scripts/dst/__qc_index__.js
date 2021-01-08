
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