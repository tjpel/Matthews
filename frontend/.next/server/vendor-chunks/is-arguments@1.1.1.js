"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-arguments@1.1.1";
exports.ids = ["vendor-chunks/is-arguments@1.1.1"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/is-arguments@1.1.1/node_modules/is-arguments/index.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/is-arguments@1.1.1/node_modules/is-arguments/index.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar hasToStringTag = __webpack_require__(/*! has-tostringtag/shams */ \"(ssr)/./node_modules/.pnpm/has-tostringtag@1.0.0/node_modules/has-tostringtag/shams.js\")();\nvar callBound = __webpack_require__(/*! call-bind/callBound */ \"(ssr)/./node_modules/.pnpm/call-bind@1.0.5/node_modules/call-bind/callBound.js\");\n\nvar $toString = callBound('Object.prototype.toString');\n\nvar isStandardArguments = function isArguments(value) {\n\tif (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {\n\t\treturn false;\n\t}\n\treturn $toString(value) === '[object Arguments]';\n};\n\nvar isLegacyArguments = function isArguments(value) {\n\tif (isStandardArguments(value)) {\n\t\treturn true;\n\t}\n\treturn value !== null &&\n\t\ttypeof value === 'object' &&\n\t\ttypeof value.length === 'number' &&\n\t\tvalue.length >= 0 &&\n\t\t$toString(value) !== '[object Array]' &&\n\t\t$toString(value.callee) === '[object Function]';\n};\n\nvar supportsStandardArguments = (function () {\n\treturn isStandardArguments(arguments);\n}());\n\nisStandardArguments.isLegacyArguments = isLegacyArguments; // for tests\n\nmodule.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vaXMtYXJndW1lbnRzQDEuMS4xL25vZGVfbW9kdWxlcy9pcy1hcmd1bWVudHMvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWIscUJBQXFCLG1CQUFPLENBQUMscUhBQXVCO0FBQ3BELGdCQUFnQixtQkFBTyxDQUFDLDJHQUFxQjs7QUFFN0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQsMkRBQTJEOztBQUUzRCIsInNvdXJjZXMiOlsid2VicGFjazovL21mdmFsdWUtZnJvbnRlbmQvLi9ub2RlX21vZHVsZXMvLnBucG0vaXMtYXJndW1lbnRzQDEuMS4xL25vZGVfbW9kdWxlcy9pcy1hcmd1bWVudHMvaW5kZXguanM/N2Y5YyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBoYXNUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJ2hhcy10b3N0cmluZ3RhZy9zaGFtcycpKCk7XG52YXIgY2FsbEJvdW5kID0gcmVxdWlyZSgnY2FsbC1iaW5kL2NhbGxCb3VuZCcpO1xuXG52YXIgJHRvU3RyaW5nID0gY2FsbEJvdW5kKCdPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nJyk7XG5cbnZhciBpc1N0YW5kYXJkQXJndW1lbnRzID0gZnVuY3Rpb24gaXNBcmd1bWVudHModmFsdWUpIHtcblx0aWYgKGhhc1RvU3RyaW5nVGFnICYmIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnIGluIHZhbHVlKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHJldHVybiAkdG9TdHJpbmcodmFsdWUpID09PSAnW29iamVjdCBBcmd1bWVudHNdJztcbn07XG5cbnZhciBpc0xlZ2FjeUFyZ3VtZW50cyA9IGZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG5cdGlmIChpc1N0YW5kYXJkQXJndW1lbnRzKHZhbHVlKSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAnbnVtYmVyJyAmJlxuXHRcdHZhbHVlLmxlbmd0aCA+PSAwICYmXG5cdFx0JHRvU3RyaW5nKHZhbHVlKSAhPT0gJ1tvYmplY3QgQXJyYXldJyAmJlxuXHRcdCR0b1N0cmluZyh2YWx1ZS5jYWxsZWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufTtcblxudmFyIHN1cHBvcnRzU3RhbmRhcmRBcmd1bWVudHMgPSAoZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gaXNTdGFuZGFyZEFyZ3VtZW50cyhhcmd1bWVudHMpO1xufSgpKTtcblxuaXNTdGFuZGFyZEFyZ3VtZW50cy5pc0xlZ2FjeUFyZ3VtZW50cyA9IGlzTGVnYWN5QXJndW1lbnRzOyAvLyBmb3IgdGVzdHNcblxubW9kdWxlLmV4cG9ydHMgPSBzdXBwb3J0c1N0YW5kYXJkQXJndW1lbnRzID8gaXNTdGFuZGFyZEFyZ3VtZW50cyA6IGlzTGVnYWN5QXJndW1lbnRzO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/is-arguments@1.1.1/node_modules/is-arguments/index.js\n");

/***/ })

};
;