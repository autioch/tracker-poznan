/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// webpack-livereload-plugin
/******/ 	(function() {
/******/ 	  if (typeof window === "undefined") { return };
/******/ 	  var id = "webpack-livereload-plugin-script";
/******/ 	  if (document.getElementById(id)) { return; }
/******/ 	  var el = document.createElement("script");
/******/ 	  el.id = id;
/******/ 	  el.async = true;
/******/ 	  el.src = "//" + location.hostname + ":35729/livereload.js";
/******/ 	  document.getElementsByTagName("head")[0].appendChild(el);
/******/ 	}());
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nSyntaxError: E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\src\\\\index.js: 'return' outside of function (19:2)\\n\\n\\u001b[0m \\u001b[90m 17 |\\u001b[39m   mapInstance\\u001b[33m.\\u001b[39msetView(latlng\\u001b[33m,\\u001b[39m zoom)\\u001b[33m;\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 18 |\\u001b[39m\\u001b[0m\\n\\u001b[0m\\u001b[31m\\u001b[1m>\\u001b[22m\\u001b[39m\\u001b[90m 19 |\\u001b[39m   \\u001b[36mreturn\\u001b[39m\\u001b[33m;\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m    |\\u001b[39m   \\u001b[31m\\u001b[1m^\\u001b[22m\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 20 |\\u001b[39m }\\u001b[0m\\n\\u001b[0m \\u001b[90m 21 |\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 22 |\\u001b[39m loadGroups()\\u001b[0m\\n    at Parser._raise (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:775:17)\\n    at Parser.raiseWithData (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:768:17)\\n    at Parser.raise (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:736:17)\\n    at Parser.parseReturnStatement (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12597:12)\\n    at Parser.parseStatementContent (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12284:21)\\n    at Parser.parseStatement (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12236:17)\\n    at Parser.parseBlockOrModuleBlockBody (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12816:25)\\n    at Parser.parseBlockBody (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12807:10)\\n    at Parser.parseBlock (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12791:10)\\n    at Parser.parseStatementContent (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12312:21)\\n    at Parser.parseStatement (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12236:17)\\n    at Parser.parseIfStatement (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12590:28)\\n    at Parser.parseStatementContent (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12281:21)\\n    at Parser.parseStatement (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12236:17)\\n    at Parser.parseBlockOrModuleBlockBody (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12816:25)\\n    at Parser.parseBlockBody (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12807:10)\\n    at Parser.parseProgram (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12171:10)\\n    at Parser.parseTopLevel (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:12162:25)\\n    at Parser.parse (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:13863:10)\\n    at parse (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:13915:38)\\n    at parser (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\parser\\\\index.js:54:34)\\n    at parser.next (<anonymous>)\\n    at normalizeFile (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\transformation\\\\normalize-file.js:93:38)\\n    at normalizeFile.next (<anonymous>)\\n    at run (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\transformation\\\\index.js:31:50)\\n    at run.next (<anonymous>)\\n    at Function.transform (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\transform.js:27:41)\\n    at transform.next (<anonymous>)\\n    at step (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\gensync\\\\index.js:261:32)\\n    at E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\gensync\\\\index.js:273:13\\n    at async.call.result.err.err (E:\\\\projects\\\\tracker-poznan\\\\webapp\\\\node_modules\\\\gensync\\\\index.js:223:11)\");\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });