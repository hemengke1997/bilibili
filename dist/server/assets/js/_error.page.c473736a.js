import { j as jsxDEV, F as Fragment } from "./jsx-dev-runtime.4cb7c876.js";
import "react/jsx-dev-runtime";
var _jsxFileName = "E:\\github\\vite-react-ssr-boilerplate\\renderer\\_error.page.tsx";
function Page({
  is404,
  errorInfo
}) {
  if (is404) {
    return /* @__PURE__ */ jsxDEV(Fragment, {
      children: [/* @__PURE__ */ jsxDEV("h1", {
        children: "404 Page Not Found"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 7,
        columnNumber: 9
      }, this), /* @__PURE__ */ jsxDEV("p", {
        children: "[vite-ssr]: This page could not be found!"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 8,
        columnNumber: 9
      }, this), /* @__PURE__ */ jsxDEV("p", {
        children: errorInfo
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 9,
        columnNumber: 9
      }, this)]
    }, void 0, true);
  } else {
    return /* @__PURE__ */ jsxDEV(Fragment, {
      children: [/* @__PURE__ */ jsxDEV("h1", {
        children: "500 Internal Server Error"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 15,
        columnNumber: 9
      }, this), /* @__PURE__ */ jsxDEV("p", {
        children: "[vite-ssr]: Something went wrong!"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 16,
        columnNumber: 9
      }, this)]
    }, void 0, true);
  }
}
export {
  Page
};
