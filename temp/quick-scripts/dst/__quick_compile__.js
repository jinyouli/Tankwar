
(function () {
<<<<<<< HEAD
<<<<<<< HEAD
var scripts = [{"deps":{"./assets/scripts/AssetsLoadScript":2,"./assets/scripts/BlastScript":8,"./assets/scripts/BulletScript":5,"./assets/scripts/ChoiceScript":12,"./assets/scripts/CityScript":1,"./assets/scripts/NoTouchScript":6,"./assets/scripts/StartScript":9,"./assets/scripts/TankData":7,"./assets/scripts/TankScript":11,"./assets/scripts/TiledMapData":10,"./assets/scripts/Zindex":14,"./assets/scripts/Alert":13,"./assets/joystick/scripts/JoystickCtrl":3,"./assets/migration/use_v2.0.x_cc.Toggle_event":4},"path":"preview-scripts/__qc_index__.js"},{"deps":{"TankData":7,"Alert":13,"TiledMapData":10},"path":"preview-scripts/assets/scripts/CityScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/AssetsLoadScript.js"},{"deps":{},"path":"preview-scripts/assets/joystick/scripts/JoystickCtrl.js"},{"deps":{},"path":"preview-scripts/assets/migration/use_v2.0.x_cc.Toggle_event.js"},{"deps":{"TankData":7},"path":"preview-scripts/assets/scripts/BulletScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/NoTouchScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/TankData.js"},{"deps":{},"path":"preview-scripts/assets/scripts/BlastScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/StartScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/TiledMapData.js"},{"deps":{"TankData":7},"path":"preview-scripts/assets/scripts/TankScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/ChoiceScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/Alert.js"},{"deps":{},"path":"preview-scripts/assets/scripts/Zindex.js"}];
=======
var scripts = [{"deps":{"./assets/scripts/AssetsLoadScript":3,"./assets/scripts/BlastScript":5,"./assets/scripts/BulletScript":6,"./assets/scripts/ChoiceScript":7,"./assets/scripts/CityScript":2,"./assets/scripts/NoTouchScript":8,"./assets/scripts/TankData":11,"./assets/scripts/StartScript":10,"./assets/scripts/TankScript":9,"./assets/scripts/TiledMapData":12,"./assets/scripts/Alert":13,"./assets/joystick/scripts/JoystickCtrl":4,"./assets/migration/use_v2.0.x_cc.Toggle_event":1},"path":"preview-scripts/__qc_index__.js"},{"deps":{},"path":"preview-scripts/assets/migration/use_v2.0.x_cc.Toggle_event.js"},{"deps":{"TankData":11,"Alert":13,"TiledMapData":12},"path":"preview-scripts/assets/scripts/CityScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/AssetsLoadScript.js"},{"deps":{},"path":"preview-scripts/assets/joystick/scripts/JoystickCtrl.js"},{"deps":{},"path":"preview-scripts/assets/scripts/BlastScript.js"},{"deps":{"TankData":11},"path":"preview-scripts/assets/scripts/BulletScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/ChoiceScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/NoTouchScript.js"},{"deps":{"TankData":11},"path":"preview-scripts/assets/scripts/TankScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/StartScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/TankData.js"},{"deps":{},"path":"preview-scripts/assets/scripts/TiledMapData.js"},{"deps":{},"path":"preview-scripts/assets/scripts/Alert.js"}];
>>>>>>> parent of 9f66940... save
=======
var scripts = [{"deps":{"./assets/scripts/AssetsLoadScript":2,"./assets/scripts/BulletScript":5,"./assets/scripts/BlastScript":4,"./assets/scripts/CityScript":1,"./assets/scripts/ChoiceScript":7,"./assets/scripts/NoTouchScript":8,"./assets/scripts/StartScript":9,"./assets/scripts/TankData":13,"./assets/scripts/TankScript":10,"./assets/scripts/TiledMapData":11,"./assets/scripts/Alert":12,"./assets/joystick/scripts/JoystickCtrl":3,"./assets/migration/use_v2.0.x_cc.Toggle_event":6},"path":"preview-scripts/__qc_index__.js"},{"deps":{"TankData":13,"Alert":12,"TiledMapData":11},"path":"preview-scripts/assets/scripts/CityScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/AssetsLoadScript.js"},{"deps":{},"path":"preview-scripts/assets/joystick/scripts/JoystickCtrl.js"},{"deps":{},"path":"preview-scripts/assets/scripts/BlastScript.js"},{"deps":{"TankData":13},"path":"preview-scripts/assets/scripts/BulletScript.js"},{"deps":{},"path":"preview-scripts/assets/migration/use_v2.0.x_cc.Toggle_event.js"},{"deps":{},"path":"preview-scripts/assets/scripts/ChoiceScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/NoTouchScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/StartScript.js"},{"deps":{"TankData":13},"path":"preview-scripts/assets/scripts/TankScript.js"},{"deps":{},"path":"preview-scripts/assets/scripts/TiledMapData.js"},{"deps":{},"path":"preview-scripts/assets/scripts/Alert.js"},{"deps":{},"path":"preview-scripts/assets/scripts/TankData.js"}];
>>>>>>> parent of ae1aa1c... 完成
var entries = ["preview-scripts/__qc_index__.js"];
var bundleScript = 'preview-scripts/__qc_bundle__.js';

/**
 * Notice: This file can not use ES6 (for IE 11)
 */
var modules = {};
var name2path = {};

// Will generated by module.js plugin
// var scripts = ${scripts};
// var entries = ${entries};
// var bundleScript = ${bundleScript};

if (typeof global === 'undefined') {
    window.global = window;
}

var isJSB = typeof jsb !== 'undefined';

function getXMLHttpRequest () {
    return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP');
}

function downloadText(url, callback) {
    if (isJSB) {
        var result = jsb.fileUtils.getStringFromFile(url);
        callback(null, result);
        return;
    }

    var xhr = getXMLHttpRequest(),
        errInfo = 'Load text file failed: ' + url;
    xhr.open('GET', url, true);
    if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8');
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 0) {
                callback(null, xhr.responseText);
            }
            else {
                callback({status:xhr.status, errorMessage:errInfo + ', status: ' + xhr.status});
            }
        }
        else {
            callback({status:xhr.status, errorMessage:errInfo + '(wrong readyState)'});
        }
    };
    xhr.onerror = function(){
        callback({status:xhr.status, errorMessage:errInfo + '(error)'});
    };
    xhr.ontimeout = function(){
        callback({status:xhr.status, errorMessage:errInfo + '(time out)'});
    };
    xhr.send(null);
};

function loadScript (src, cb) {
    if (typeof require !== 'undefined') {
        require(src);
        return cb();
    }

    // var timer = 'load ' + src;
    // console.time(timer);

    var scriptElement = document.createElement('script');

    function done() {
        // console.timeEnd(timer);
        // deallocation immediate whatever
        scriptElement.remove();
    }

    scriptElement.onload = function () {
        done();
        cb();
    };
    scriptElement.onerror = function () {
        done();
        var error = 'Failed to load ' + src;
        console.error(error);
        cb(new Error(error));
    };
    scriptElement.setAttribute('type','text/javascript');
    scriptElement.setAttribute('charset', 'utf-8');
    scriptElement.setAttribute('src', src);

    document.head.appendChild(scriptElement);
}

function loadScripts (srcs, cb) {
    var n = srcs.length;

    srcs.forEach(function (src) {
        loadScript(src, function () {
            n--;
            if (n === 0) {
                cb();
            }
        });
    })
}

function formatPath (path) {
    let destPath = window.__quick_compile_project__.destPath;
    if (destPath) {
        let prefix = 'preview-scripts';
        if (destPath[destPath.length - 1] === '/') {
            prefix += '/';
        }
        path = path.replace(prefix, destPath);
    }
    return path;
}

window.__quick_compile_project__ = {
    destPath: '',

    registerModule: function (path, module) {
        path = formatPath(path);
        modules[path].module = module;
    },

    registerModuleFunc: function (path, func) {
        path = formatPath(path);
        modules[path].func = func;

        var sections = path.split('/');
        var name = sections[sections.length - 1];
        name = name.replace(/\.(?:js|ts|json)$/i, '');
        name2path[name] = path;
    },

    require: function (request, path) {
        var m, requestScript;

        path = formatPath(path);
        if (path) {
            m = modules[path];
            if (!m) {
                console.warn('Can not find module for path : ' + path);
                return null;
            }
        }

        if (m) {
            let depIndex = m.deps[request];
            // dependence script was excluded
            if (depIndex === -1) {
                return null;
            }
            else {
                requestScript = scripts[ m.deps[request] ];
            }
        }
        
        let requestPath = '';
        if (!requestScript) {
            // search from name2path when request is a dynamic module name
            if (/^[\w- .]*$/.test(request)) {
                requestPath = name2path[request];
            }

            if (!requestPath) {
                if (CC_JSB) {
                    return require(request);
                }
                else {
                    console.warn('Can not find deps [' + request + '] for path : ' + path);
                    return null;
                }
            }
        }
        else {
            requestPath = formatPath(requestScript.path);
        }

        let requestModule = modules[requestPath];
        if (!requestModule) {
            console.warn('Can not find request module for path : ' + requestPath);
            return null;
        }

        if (!requestModule.module && requestModule.func) {
            requestModule.func();
        }

        if (!requestModule.module) {
            console.warn('Can not find requestModule.module for path : ' + path);
            return null;
        }

        return requestModule.module.exports;
    },

    run: function () {
        entries.forEach(function (entry) {
            entry = formatPath(entry);
            var module = modules[entry];
            if (!module.module) {
                module.func();
            }
        });
    },

    load: function (cb) {
        var self = this;

        var srcs = scripts.map(function (script) {
            var path = formatPath(script.path);
            modules[path] = script;

            if (script.mtime) {
                path += ("?mtime=" + script.mtime);
            }
            return path;
        });

        console.time && console.time('load __quick_compile_project__');
        // jsb can not analysis sourcemap, so keep separate files.
        if (bundleScript && !isJSB) {
            downloadText(formatPath(bundleScript), function (err, bundleSource) {
                console.timeEnd && console.timeEnd('load __quick_compile_project__');
                if (err) {
                    console.error(err);
                    return;
                }

                let evalTime = 'eval __quick_compile_project__ : ' + srcs.length + ' files';
                console.time && console.time(evalTime);
                var sources = bundleSource.split('\n//------QC-SOURCE-SPLIT------\n');
                for (var i = 0; i < sources.length; i++) {
                    if (sources[i]) {
                        window.eval(sources[i]);
                        // not sure why new Function cannot set breakpoints precisely
                        // new Function(sources[i])()
                    }
                }
                self.run();
                console.timeEnd && console.timeEnd(evalTime);
                cb();
            })
        }
        else {
            loadScripts(srcs, function () {
                self.run();
                console.timeEnd && console.timeEnd('load __quick_compile_project__');
                cb();
            });
        }
    }
};

// Polyfill for IE 11
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
})();
    