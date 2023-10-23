/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/point-in-polygon@1.1.0";
exports.ids = ["vendor-chunks/point-in-polygon@1.1.0"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/point-in-polygon@1.1.0/node_modules/point-in-polygon/flat.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/.pnpm/point-in-polygon@1.1.0/node_modules/point-in-polygon/flat.js ***!
  \*****************************************************************************************/
/***/ ((module) => {

eval("module.exports = function pointInPolygonFlat (point, vs, start, end) {\n    var x = point[0], y = point[1];\n    var inside = false;\n    if (start === undefined) start = 0;\n    if (end === undefined) end = vs.length;\n    var len = (end-start)/2;\n    for (var i = 0, j = len - 1; i < len; j = i++) {\n        var xi = vs[start+i*2+0], yi = vs[start+i*2+1];\n        var xj = vs[start+j*2+0], yj = vs[start+j*2+1];\n        var intersect = ((yi > y) !== (yj > y))\n            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);\n        if (intersect) inside = !inside;\n    }\n    return inside;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vcG9pbnQtaW4tcG9seWdvbkAxLjEuMC9ub2RlX21vZHVsZXMvcG9pbnQtaW4tcG9seWdvbi9mbGF0LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxTQUFTO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZnZhbHVlLWZyb250ZW5kLy4vbm9kZV9tb2R1bGVzLy5wbnBtL3BvaW50LWluLXBvbHlnb25AMS4xLjAvbm9kZV9tb2R1bGVzL3BvaW50LWluLXBvbHlnb24vZmxhdC5qcz8xMWU3Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcG9pbnRJblBvbHlnb25GbGF0IChwb2ludCwgdnMsIHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgeCA9IHBvaW50WzBdLCB5ID0gcG9pbnRbMV07XG4gICAgdmFyIGluc2lkZSA9IGZhbHNlO1xuICAgIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSBzdGFydCA9IDA7XG4gICAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSBlbmQgPSB2cy5sZW5ndGg7XG4gICAgdmFyIGxlbiA9IChlbmQtc3RhcnQpLzI7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSBsZW4gLSAxOyBpIDwgbGVuOyBqID0gaSsrKSB7XG4gICAgICAgIHZhciB4aSA9IHZzW3N0YXJ0K2kqMiswXSwgeWkgPSB2c1tzdGFydCtpKjIrMV07XG4gICAgICAgIHZhciB4aiA9IHZzW3N0YXJ0K2oqMiswXSwgeWogPSB2c1tzdGFydCtqKjIrMV07XG4gICAgICAgIHZhciBpbnRlcnNlY3QgPSAoKHlpID4geSkgIT09ICh5aiA+IHkpKVxuICAgICAgICAgICAgJiYgKHggPCAoeGogLSB4aSkgKiAoeSAtIHlpKSAvICh5aiAtIHlpKSArIHhpKTtcbiAgICAgICAgaWYgKGludGVyc2VjdCkgaW5zaWRlID0gIWluc2lkZTtcbiAgICB9XG4gICAgcmV0dXJuIGluc2lkZTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/point-in-polygon@1.1.0/node_modules/point-in-polygon/flat.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/.pnpm/point-in-polygon@1.1.0/node_modules/point-in-polygon/index.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/.pnpm/point-in-polygon@1.1.0/node_modules/point-in-polygon/index.js ***!
  \******************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var pointInPolygonFlat = __webpack_require__(/*! ./flat.js */ \"(ssr)/./node_modules/.pnpm/point-in-polygon@1.1.0/node_modules/point-in-polygon/flat.js\")\nvar pointInPolygonNested = __webpack_require__(/*! ./nested.js */ \"(ssr)/./node_modules/.pnpm/point-in-polygon@1.1.0/node_modules/point-in-polygon/nested.js\")\n\nmodule.exports = function pointInPolygon (point, vs, start, end) {\n    if (vs.length > 0 && Array.isArray(vs[0])) {\n        return pointInPolygonNested(point, vs, start, end);\n    } else {\n        return pointInPolygonFlat(point, vs, start, end);\n    }\n}\nmodule.exports.nested = pointInPolygonNested\nmodule.exports.flat = pointInPolygonFlat\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vcG9pbnQtaW4tcG9seWdvbkAxLjEuMC9ub2RlX21vZHVsZXMvcG9pbnQtaW4tcG9seWdvbi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQSx5QkFBeUIsbUJBQU8sQ0FBQywwR0FBVztBQUM1QywyQkFBMkIsbUJBQU8sQ0FBQyw4R0FBYTs7QUFFaEQ7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixtQkFBbUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZnZhbHVlLWZyb250ZW5kLy4vbm9kZV9tb2R1bGVzLy5wbnBtL3BvaW50LWluLXBvbHlnb25AMS4xLjAvbm9kZV9tb2R1bGVzL3BvaW50LWluLXBvbHlnb24vaW5kZXguanM/NzkyZiJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcG9pbnRJblBvbHlnb25GbGF0ID0gcmVxdWlyZSgnLi9mbGF0LmpzJylcbnZhciBwb2ludEluUG9seWdvbk5lc3RlZCA9IHJlcXVpcmUoJy4vbmVzdGVkLmpzJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwb2ludEluUG9seWdvbiAocG9pbnQsIHZzLCBzdGFydCwgZW5kKSB7XG4gICAgaWYgKHZzLmxlbmd0aCA+IDAgJiYgQXJyYXkuaXNBcnJheSh2c1swXSkpIHtcbiAgICAgICAgcmV0dXJuIHBvaW50SW5Qb2x5Z29uTmVzdGVkKHBvaW50LCB2cywgc3RhcnQsIGVuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBvaW50SW5Qb2x5Z29uRmxhdChwb2ludCwgdnMsIHN0YXJ0LCBlbmQpO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzLm5lc3RlZCA9IHBvaW50SW5Qb2x5Z29uTmVzdGVkXG5tb2R1bGUuZXhwb3J0cy5mbGF0ID0gcG9pbnRJblBvbHlnb25GbGF0XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/point-in-polygon@1.1.0/node_modules/point-in-polygon/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/.pnpm/point-in-polygon@1.1.0/node_modules/point-in-polygon/nested.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/.pnpm/point-in-polygon@1.1.0/node_modules/point-in-polygon/nested.js ***!
  \*******************************************************************************************/
/***/ ((module) => {

eval("// ray-casting algorithm based on\n// https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html\n\nmodule.exports = function pointInPolygonNested (point, vs, start, end) {\n    var x = point[0], y = point[1];\n    var inside = false;\n    if (start === undefined) start = 0;\n    if (end === undefined) end = vs.length;\n    var len = end - start;\n    for (var i = 0, j = len - 1; i < len; j = i++) {\n        var xi = vs[i+start][0], yi = vs[i+start][1];\n        var xj = vs[j+start][0], yj = vs[j+start][1];\n        var intersect = ((yi > y) !== (yj > y))\n            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);\n        if (intersect) inside = !inside;\n    }\n    return inside;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vcG9pbnQtaW4tcG9seWdvbkAxLjEuMC9ub2RlX21vZHVsZXMvcG9pbnQtaW4tcG9seWdvbi9uZXN0ZWQuanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsU0FBUztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWZ2YWx1ZS1mcm9udGVuZC8uL25vZGVfbW9kdWxlcy8ucG5wbS9wb2ludC1pbi1wb2x5Z29uQDEuMS4wL25vZGVfbW9kdWxlcy9wb2ludC1pbi1wb2x5Z29uL25lc3RlZC5qcz8zMGI3Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIHJheS1jYXN0aW5nIGFsZ29yaXRobSBiYXNlZCBvblxuLy8gaHR0cHM6Ly93cmYuZWNzZS5ycGkuZWR1L1Jlc2VhcmNoL1Nob3J0X05vdGVzL3BucG9seS5odG1sXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcG9pbnRJblBvbHlnb25OZXN0ZWQgKHBvaW50LCB2cywgc3RhcnQsIGVuZCkge1xuICAgIHZhciB4ID0gcG9pbnRbMF0sIHkgPSBwb2ludFsxXTtcbiAgICB2YXIgaW5zaWRlID0gZmFsc2U7XG4gICAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHN0YXJ0ID0gMDtcbiAgICBpZiAoZW5kID09PSB1bmRlZmluZWQpIGVuZCA9IHZzLmxlbmd0aDtcbiAgICB2YXIgbGVuID0gZW5kIC0gc3RhcnQ7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSBsZW4gLSAxOyBpIDwgbGVuOyBqID0gaSsrKSB7XG4gICAgICAgIHZhciB4aSA9IHZzW2krc3RhcnRdWzBdLCB5aSA9IHZzW2krc3RhcnRdWzFdO1xuICAgICAgICB2YXIgeGogPSB2c1tqK3N0YXJ0XVswXSwgeWogPSB2c1tqK3N0YXJ0XVsxXTtcbiAgICAgICAgdmFyIGludGVyc2VjdCA9ICgoeWkgPiB5KSAhPT0gKHlqID4geSkpXG4gICAgICAgICAgICAmJiAoeCA8ICh4aiAtIHhpKSAqICh5IC0geWkpIC8gKHlqIC0geWkpICsgeGkpO1xuICAgICAgICBpZiAoaW50ZXJzZWN0KSBpbnNpZGUgPSAhaW5zaWRlO1xuICAgIH1cbiAgICByZXR1cm4gaW5zaWRlO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/point-in-polygon@1.1.0/node_modules/point-in-polygon/nested.js\n");

/***/ })

};
;