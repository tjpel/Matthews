"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/set-function-name@2.0.1";
exports.ids = ["vendor-chunks/set-function-name@2.0.1"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/set-function-name@2.0.1/node_modules/set-function-name/index.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/.pnpm/set-function-name@2.0.1/node_modules/set-function-name/index.js ***!
  \********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar define = __webpack_require__(/*! define-data-property */ \"(ssr)/./node_modules/.pnpm/define-data-property@1.1.1/node_modules/define-data-property/index.js\");\nvar hasDescriptors = __webpack_require__(/*! has-property-descriptors */ \"(ssr)/./node_modules/.pnpm/has-property-descriptors@1.0.1/node_modules/has-property-descriptors/index.js\")();\nvar functionsHaveConfigurableNames = (__webpack_require__(/*! functions-have-names */ \"(ssr)/./node_modules/.pnpm/functions-have-names@1.2.3/node_modules/functions-have-names/index.js\").functionsHaveConfigurableNames)();\n\nvar $TypeError = TypeError;\n\nmodule.exports = function setFunctionName(fn, name) {\n\tif (typeof fn !== 'function') {\n\t\tthrow new $TypeError('`fn` is not a function');\n\t}\n\tvar loose = arguments.length > 2 && !!arguments[2];\n\tif (!loose || functionsHaveConfigurableNames) {\n\t\tif (hasDescriptors) {\n\t\t\tdefine(fn, 'name', name, true, true);\n\t\t} else {\n\t\t\tdefine(fn, 'name', name);\n\t\t}\n\t}\n\treturn fn;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vc2V0LWZ1bmN0aW9uLW5hbWVAMi4wLjEvbm9kZV9tb2R1bGVzL3NldC1mdW5jdGlvbi1uYW1lL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViLGFBQWEsbUJBQU8sQ0FBQyw4SEFBc0I7QUFDM0MscUJBQXFCLG1CQUFPLENBQUMsMElBQTBCO0FBQ3ZELHFDQUFxQyxvTEFBOEQ7O0FBRW5HOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL21mdmFsdWUtZnJvbnRlbmQvLi9ub2RlX21vZHVsZXMvLnBucG0vc2V0LWZ1bmN0aW9uLW5hbWVAMi4wLjEvbm9kZV9tb2R1bGVzL3NldC1mdW5jdGlvbi1uYW1lL2luZGV4LmpzPzNlNjciXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVmaW5lID0gcmVxdWlyZSgnZGVmaW5lLWRhdGEtcHJvcGVydHknKTtcbnZhciBoYXNEZXNjcmlwdG9ycyA9IHJlcXVpcmUoJ2hhcy1wcm9wZXJ0eS1kZXNjcmlwdG9ycycpKCk7XG52YXIgZnVuY3Rpb25zSGF2ZUNvbmZpZ3VyYWJsZU5hbWVzID0gcmVxdWlyZSgnZnVuY3Rpb25zLWhhdmUtbmFtZXMnKS5mdW5jdGlvbnNIYXZlQ29uZmlndXJhYmxlTmFtZXMoKTtcblxudmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0RnVuY3Rpb25OYW1lKGZuLCBuYW1lKSB7XG5cdGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcblx0XHR0aHJvdyBuZXcgJFR5cGVFcnJvcignYGZuYCBpcyBub3QgYSBmdW5jdGlvbicpO1xuXHR9XG5cdHZhciBsb29zZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmICEhYXJndW1lbnRzWzJdO1xuXHRpZiAoIWxvb3NlIHx8IGZ1bmN0aW9uc0hhdmVDb25maWd1cmFibGVOYW1lcykge1xuXHRcdGlmIChoYXNEZXNjcmlwdG9ycykge1xuXHRcdFx0ZGVmaW5lKGZuLCAnbmFtZScsIG5hbWUsIHRydWUsIHRydWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkZWZpbmUoZm4sICduYW1lJywgbmFtZSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBmbjtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/set-function-name@2.0.1/node_modules/set-function-name/index.js\n");

/***/ })

};
;