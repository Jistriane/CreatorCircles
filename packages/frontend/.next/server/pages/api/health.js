"use strict";
(() => {
var exports = {};
exports.id = 837;
exports.ids = [837];
exports.modules = {

/***/ 1402:
/***/ ((module) => {

module.exports = import("@mysten/sui.js/client");;

/***/ }),

/***/ 810:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _mysten_sui_js_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1402);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_mysten_sui_js_client__WEBPACK_IMPORTED_MODULE_0__]);
_mysten_sui_js_client__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
// Health check endpoint Next.js

const client = new _mysten_sui_js_client__WEBPACK_IMPORTED_MODULE_0__.SuiClient({
    url: process.env.SUI_RPC_URL
});
async function handler(req, res) {
    const checks = {
        sui_rpc: false,
        ipfs_gateway: false,
        database: false
    };
    try {
        // Check 1: Sui RPC
        const chainId = await client.getChainIdentifier();
        checks.sui_rpc = chainId !== null;
        // Check 2: IPFS Gateway
        const ipfsResponse = await fetch("https://gateway.pinata.cloud/ipfs/QmTest");
        checks.ipfs_gateway = ipfsResponse.ok;
        // Check 3: Database (se usar)
        // const dbPing = await db.ping();
        checks.database = true; // placeholder
        const allHealthy = Object.values(checks).every((status)=>status);
        res.status(allHealthy ? 200 : 503).json({
            status: allHealthy ? "healthy" : "degraded",
            checks,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: typeof error === "object" && error !== null && "message" in error ? error.message : String(error),
            checks
        });
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(810));
module.exports = __webpack_exports__;

})();