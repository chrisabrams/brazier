'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./src/controllers/base');

var _base2 = _interopRequireDefault(_base);

var _dispatcher = require('./src/dispatcher');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _prompt = require('./src/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _router = require('./src/router');

var _router2 = _interopRequireDefault(_router);

var _util = require('./src/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Brazier = {
  Controller: _base2.default,
  Dispatcher: _dispatcher2.default,
  Prompt: _prompt2.default,
  Router: _router2.default,
  util: _util2.default
};

exports.default = Brazier;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BrazierDispatcher = function () {
  function BrazierDispatcher() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BrazierDispatcher);

    this.options = options;

    this.controllerPath = options.controllerPath;

    if (typeof this.controllerPath != 'string') {
      throw new Error('options.controllerPath must be defined.');
      return;
    }
  }

  _createClass(BrazierDispatcher, [{
    key: 'dispatch',
    value: function dispatch(routeOptions) {

      var Controller = this.getController(routeOptions);
      var controller = this.controller = new Controller();
      var action = this.action = controller[routeOptions.action](routeOptions);
    }
  }, {
    key: 'getController',
    value: function getController(routeOptions) {

      return require(_path2.default.join(this.controllerPath, routeOptions.controller)).default;
    }
  }]);

  return BrazierDispatcher;
}();

exports.default = BrazierDispatcher;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _readlineSync = require('readline-sync');

var _readlineSync2 = _interopRequireDefault(_readlineSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BrazierPrompt = function () {
  function BrazierPrompt() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BrazierPrompt);
  }

  _createClass(BrazierPrompt, [{
    key: 'line',
    value: function line() {

      console.log.apply(this, arguments);
    }

    /* NOTE:
    At the moment, a question can only be a single argument string. This is a limitation of readline.
    */

  }, {
    key: 'question',
    value: function question(string) {

      string = string + ' '; // Add space between question and prompt answer

      var answer = _readlineSync2.default.question(string);

      return answer;
    }
  }]);

  return BrazierPrompt;
}();

exports.default = BrazierPrompt;
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require('events').EventEmitter;

function arraysEqual(a1, a2) {

  return JSON.stringify(a1) == JSON.stringify(a2);
}

var BrazierRouter = function () {
  function BrazierRouter() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BrazierRouter);

    if (_typeof(options.argv) != 'object') {
      throw new Error('options.argv must be provided to router.');
      return;
    }

    // TODO: Figure out why you have to do this instead of Object.assign/util.inherits
    EventEmitter.call(this);
    this.emit = EventEmitter.prototype.emit;
    this.on = EventEmitter.prototype.on;

    var argv = options.argv;

    // Delete the app name from the list of commands, if it is included
    if (options.appName && argv._.indexOf(options.appName) > -1) {
      argv._.splice(argv._.indexOf(options.appName), 1);
    }

    // For when there are no commands
    if (arraysEqual(argv._, [])) {
      argv._ = [''];
    }

    this.argv = argv;

    var keys = Object.assign({}, this.argv);

    if (keys._) {
      delete keys._;
    }

    this.keys = keys;

    this.appCommands = [];
    this.routes = options.routes;
    this.routesMatched = 0;
  }

  _createClass(BrazierRouter, [{
    key: 'isMatch',
    value: function isMatch(options) {

      // If the commands match
      if (this.argv._ && options.commands && arraysEqual(this.argv._, options.commands)) {

        return true;
      }

      return false;
    }
  }, {
    key: 'match',
    value: function match(options) {

      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) != 'object') {
        throw new Error('Options should be an object.');
        return;
      }

      var tempDest = options.dest.split('#');

      if (tempDest.length < 2) {
        throw new Error('Destination must include controller and action.');
        return;
      }

      var controller = tempDest[0],
          action = tempDest[1];

      var isMatched = this.isMatch(options);
      //console.log("isMatch?", "argv:", this.argv, "route:", options.commands, isMatched)
      if (isMatched) {

        this.routesMatched++;

        this.emit('route:matched', {
          action: action,
          appCommands: this.appCommands,
          controller: controller,
          keys: this.keys
        });
      }
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      this.routes.forEach(function (route) {

        // Don't include default/catch-all route for now; maybe later
        if (!arraysEqual(route.commands, [''])) {
          _this.appCommands.push({ commands: route.commands, desc: route.desc });
        }

        _this.match(route);
      });
    }
  }]);

  return BrazierRouter;
}();

/* TODO: Figure out why this doesn't work
Object.assign(BrazierRouter.prototype, EventEmitter)
*/

exports.default = BrazierRouter;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var fs = require('fs'),
    Handlebars = require('handlebars'),
    mkdirp = require('mkdirp'),
    path = require('path');

var Util = {};

Util.lowerCaseFirstLetter = function (s) {
  return s.charAt(0).toLowerCase() + s.slice(1);
};
Util.singularCase = function (s) {
  return s.substring(0, s.length - 1);
};
Util.upperCaseFirstLetter = function (s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/*
TODO: This could definitely be better optimized
*/
Util.copyFiles = function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (options instanceof Array) {

    options.forEach(function (item) {

      var destDir = item.dest.substring(0, item.dest.lastIndexOf('/'));

      var template = fs.readFileSync(item.src, 'utf8');

      /*
      TODO: Ideally, only make the same path once.
      */
      mkdirp(destDir);

      if (item.data) {
        template = Handlebars.compile(template);
        template = template(item.data);
      }

      fs.writeFileSync(item.dest, template, 'utf8');
    });
  } else {

    var destCwd = options.destCwd,
        files = options.files,
        srcCwd = options.srcCwd;

    files.forEach(function (item) {

      var destDir = item.dest.substring(0, item.dest.lastIndexOf('/'));

      var template = fs.readFileSync(path.join(srcCwd, item.src), 'utf8');

      /*
      TODO: Ideally, only make the same path once.
      */
      mkdirp(path.join(destCwd, destDir));

      if (item.data) {
        template = Handlebars.compile(template);
        template = template(item.data);
      }

      fs.writeFileSync(path.join(destCwd, item.dest), template, 'utf8');
    });
  }
};

Handlebars.registerHelper('lowerCase', function (s) {

  return Util.lowerCaseFirstLetter(s);
});

Handlebars.registerHelper('singularCase', function (s) {

  return Util.singularCase(s);
});

Handlebars.registerHelper('upperCase', function (s) {

  return Util.upperCaseFirstLetter(s);
});

exports.default = Util;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _prompt = require('../prompt');

var _prompt2 = _interopRequireDefault(_prompt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var execSync = require('child_process').execSync;

var BrazierController = function () {
  function BrazierController() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BrazierController);

    this.options = options;

    this.initialize();
  }

  _createClass(BrazierController, [{
    key: 'initialize',
    value: function initialize() {}
  }, {
    key: 'getGitUserEmail',
    value: function getGitUserEmail() {

      var email = execSync('git config user.email').toString();

      if (email) {
        email = email.replace(/\n/g, '');
      } else {
        email = '';
      }

      return email;
    }
  }, {
    key: 'getGitUserName',
    value: function getGitUserName() {

      var name = execSync('git config user.name').toString();

      if (name) {
        name = name.replace(/\n/g, '');
      } else {
        name = '';
      }

      return name;
    }
  }, {
    key: 'isStringEmpty',
    value: function isStringEmpty(entry) {

      /*
      TODO: strip spaces
      */
      if (typeof entry == 'undefined' || entry == null || typeof entry == 'string' && entry == '') {

        return true;
      }

      return false;
    }
  }, {
    key: 'prompt',
    value: function prompt() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var prompt = new _prompt2.default();

      var defaultValue = options.default,
          key = options.key,
          promptLabel = options.label,
          value = defaultValue;

      var promptValue = prompt.question(promptLabel + ': (' + defaultValue + ')');

      // Store the entered value
      this.store[key] = promptValue;

      // Possible scenarios that change the value stored

      // Y/n prompts
      if (options.valueAsBoolean) {

        if (promptValue == '') {

          promptValue = defaultValue;
        }

        switch (promptValue) {

          case true:
          case 'y':
          case 'Y':

            value = true;

            break;

          default:

            value = false;

        }

        this.store[key] = value;
      }

      // Nothing returned, nothing default
      if (this.isStringEmpty(promptValue) && !defaultValue) {

        value = promptValue;
        this.store[key] = value;
      }

      if (options.binFile) {

        this.generateBinFile(this.store[key], this.cwd);
      }
    }
  }]);

  return BrazierController;
}();

BrazierController.prototype.cwd = process.cwd();
BrazierController.prototype.matchRegex = /{{([^}}]+)}}/g;
BrazierController.prototype.store = {};

exports.default = BrazierController;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = [{
  commands: ['destroy'],
  desc: 'Destroy a project',
  dest: 'main#destroy'
}, {
  commands: ['init'],
  desc: 'Initialize an application',
  dest: 'main#init'
}, {
  commands: [''],
  dest: 'default#help'
}];
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BootController = function (_Brazier$Controller) {
  _inherits(BootController, _Brazier$Controller);

  function BootController() {
    _classCallCheck(this, BootController);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(BootController).apply(this, arguments));
  }

  _createClass(BootController, [{
    key: 'initialize',
    value: function initialize() {

      _get(Object.getPrototypeOf(BootController.prototype), 'initialize', this).call(this);

      if (_typeof(this.options.argv) != 'object') {
        throw new Error('options.argv is required for BootController.');
        return;
      }

      if (_typeof(this.options.pkg) != 'object') {
        throw new Error('options.pkg is required for BootController.');
        return;
      }

      if (_typeof(this.options.routes) != 'object') {
        throw new Error('options.routes is required for BootController.');
        return;
      }
    }
  }, {
    key: 'capitaliseFirstLetter',
    value: function capitaliseFirstLetter(string) {

      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }, {
    key: 'greeting',
    value: function greeting() {

      var options = this.options;

      var pkg = options.pkg,
          name = this.capitaliseFirstLetter(pkg.name),
          version = pkg.version;

      var prompt = new _index2.default.Prompt();

      prompt.line(_chalk2.default.green('\n%s command-line generator version %s\n'), name, version);
    }
  }, {
    key: 'up',
    value: function up() {

      var options = this.options;

      var pkg = options.pkg,
          name = pkg.name;

      this.greeting();

      var router = new _index2.default.Router({
        appName: name,
        argv: options.argv,
        routes: options.routes
      });

      router.on('route:matched', function (data) {

        var dispatcher = new _index2.default.Dispatcher({
          controllerPath: options.controllerPath || _path2.default.join(__dirname, './')
        });

        dispatcher.dispatch(data);
      });

      router.start();
    }
  }]);

  return BootController;
}(_index2.default.Controller);

exports.default = BootController;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DefaultController = function (_Brazier$Controller) {
  _inherits(DefaultController, _Brazier$Controller);

  function DefaultController() {
    _classCallCheck(this, DefaultController);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DefaultController).apply(this, arguments));
  }

  _createClass(DefaultController, [{
    key: 'help',
    value: function help() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      // The default is [] instead of [''] because the forEach loop below doesn't need to run when there are no commands
      var appCommands = options.appCommands || [];

      var prompt = new _index2.default.Prompt();

      prompt.line('Commands\n');

      appCommands.forEach(function (appCommand) {

        var commands = appCommand.commands.join(' ');

        prompt.line('\t', commands, '\t', appCommand.desc);
      });

      prompt.line('\n');
    }
  }]);

  return DefaultController;
}(_index2.default.Controller);

exports.default = DefaultController;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var exec = require('child_process').exec,
    execSync = require('child_process').execSync;

var InitController = function (_Brazier$Controller) {
  _inherits(InitController, _Brazier$Controller);

  function InitController() {
    _classCallCheck(this, InitController);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(InitController).call(this));
  }

  _createClass(InitController, [{
    key: 'copyFiles',
    value: function copyFiles(cb) {
      var _this3 = this;

      var projectCwd = _path2.default.join(__dirname, '../../'),
          destCwd = this.cwd;

      var filesToCopy = [{
        src: _path2.default.join(projectCwd, './template/bin/controllers/boot.js'),
        dest: _path2.default.join(destCwd, './bin/controllers/boot.js')
      }, {
        src: _path2.default.join(projectCwd, './template/bin/controllers/default.js'),
        dest: _path2.default.join(destCwd, './bin/controllers/default.js')
      }, {
        src: _path2.default.join(projectCwd, './template/bin/controllers/main.js'),
        dest: _path2.default.join(destCwd, './bin/controllers/main.js')
      }, {
        src: _path2.default.join(projectCwd, './bin/routes.js'),
        dest: _path2.default.join(destCwd, './bin/routes.js')
      }, {
        src: _path2.default.join(projectCwd, './template/package.json'),
        dest: _path2.default.join(destCwd, './package.json')
      }, {
        src: _path2.default.join(projectCwd, '.babelrc'),
        dest: _path2.default.join(destCwd, '.babelrc')
      }];

      var filesToCopyLength = filesToCopy.length,
          filesCopiedCount = 0;

      filesToCopy.forEach(function (item) {

        var destDir = item.dest.substring(0, item.dest.lastIndexOf('/')),
            _this = _this3;

        (0, _mkdirp2.default)(destDir);

        var fileSrc = _fs2.default.readFileSync(item.src, 'utf8'),
            template = _handlebars2.default.compile(fileSrc);

        _fs2.default.writeFileSync(item.dest, template(_this3.store), 'utf8');
      });

      cb();
    }

    /*
    TODO: provide some validation that this is the project to destroy
    */

  }, {
    key: 'destroy',
    value: function destroy() {

      execSync('rm -rf ' + this.cwd + '/*');
    }
  }, {
    key: 'generateBinFile',
    value: function generateBinFile(name) {

      var binFile = _fs2.default.readFileSync(_path2.default.join(__dirname, '../brazier'), 'utf8');
      _mkdirp2.default.sync(this.cwd + '/bin');
      _fs2.default.writeFileSync(this.cwd + '/bin/' + name, binFile, 'utf8');
    }
  }, {
    key: 'init',
    value: function init() {
      var _this4 = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.prompt({
        binFile: true,
        key: 'appName',
        default: this.cwd.split('/').pop(),
        label: 'App Name'
      });

      this.prompt({
        key: 'authorName',
        default: this.getGitUserName(),
        label: 'Author Name'
      });

      this.prompt({
        key: 'authorEmail',
        default: this.getGitUserEmail(),
        label: 'Author Email'
      });

      this.prompt({
        key: 'license',
        default: 'MIT',
        label: 'License'
      });

      this.copyFiles(function () {
        _this4.link(function (err) {

          if (err) {
            process.exit(1);
          } else {
            process.exit(0);
          }
        });
      });
    }
  }, {
    key: 'link',
    value: function link(cb) {

      console.log("\nSetting up link and npm installing..");
      // TODO: look into using spawn() here
      exec('npm link', function (err, stdout, stderr) {

        if (err) {
          console.error(err);
          console.error(stderr);
          cb();
        } else {
          console.log(stdout);
          cb();
        }
      });
    }
  }]);

  return InitController;
}(_index2.default.Controller);

exports.default = InitController;