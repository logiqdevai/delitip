(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/node_modules/@base-ui/utils/addEventListener.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Adds an event listener and returns a cleanup function to remove it.
 */ __turbopack_context__.s([
    "addEventListener",
    ()=>addEventListener
]);
function addEventListener(target, type, listener, options) {
    target.addEventListener(type, listener, options);
    return ()=>{
        target.removeEventListener(type, listener, options);
    };
}
}),
"[project]/app/node_modules/@base-ui/utils/empty.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EMPTY_ARRAY",
    ()=>EMPTY_ARRAY,
    "EMPTY_OBJECT",
    ()=>EMPTY_OBJECT,
    "NOOP",
    ()=>NOOP
]);
function NOOP() {}
const EMPTY_ARRAY = Object.freeze([]);
const EMPTY_OBJECT = Object.freeze({});
}),
"[project]/app/node_modules/@base-ui/utils/error.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "error",
    ()=>error,
    "reset",
    ()=>reset
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
let set;
if ("TURBOPACK compile-time truthy", 1) {
    set = new Set();
}
function error(...messages) {
    if ("TURBOPACK compile-time truthy", 1) {
        const messageKey = messages.join(' ');
        if (!set.has(messageKey)) {
            set.add(messageKey);
            console.error(`Base UI: ${messageKey}`);
        }
    }
}
function reset() {
    set?.clear();
}
}),
"[project]/app/node_modules/@base-ui/utils/fastHooks.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fastComponent",
    ()=>fastComponent,
    "fastComponentRef",
    ()=>fastComponentRef,
    "getInstance",
    ()=>getInstance,
    "register",
    ()=>register,
    "setInstance",
    ()=>setInstance
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/useRefWithInit.mjs [app-client] (ecmascript)");
;
;
const hooks = [];
let currentInstance = undefined;
function getInstance() {
    return currentInstance;
}
function setInstance(instance) {
    currentInstance = instance;
}
function register(hook) {
    hooks.push(hook);
}
function fastComponent(fn) {
    const FastComponent = (props, forwardedRef)=>{
        const instance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRefWithInit"])(createInstance).current;
        let result;
        try {
            currentInstance = instance;
            for (const hook of hooks){
                hook.before(instance);
            }
            result = fn(props, forwardedRef);
            for (const hook of hooks){
                hook.after(instance);
            }
            instance.didInitialize = true;
        } finally{
            currentInstance = undefined;
        }
        return result;
    };
    FastComponent.displayName = fn.displayName || fn.name;
    return FastComponent;
}
function fastComponentRef(fn) {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](fastComponent(fn));
}
function createInstance() {
    return {
        didInitialize: false
    };
}
}),
"[project]/app/node_modules/@base-ui/utils/generateId.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateId",
    ()=>generateId
]);
let counter = 0;
function generateId(prefix) {
    counter += 1;
    return `${prefix}-${Math.random().toString(36).slice(2, 6)}-${counter}`;
}
}),
"[project]/app/node_modules/@base-ui/utils/getReactElementRef.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getReactElementRef",
    ()=>getReactElementRef
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$reactVersion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/reactVersion.mjs [app-client] (ecmascript)");
;
;
function getReactElementRef(element) {
    if (!/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](element)) {
        return null;
    }
    const reactElement = element;
    const propsWithRef = reactElement.props;
    return ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$reactVersion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isReactVersionAtLeast"])(19) ? propsWithRef?.ref : reactElement.ref) ?? null;
}
}),
"[project]/app/node_modules/@base-ui/utils/inertValue.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "inertValue",
    ()=>inertValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$reactVersion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/reactVersion.mjs [app-client] (ecmascript)");
;
function inertValue(value) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$reactVersion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isReactVersionAtLeast"])(19)) {
        return value;
    }
    // compatibility with React < 19
    return value ? 'true' : undefined;
}
}),
"[project]/app/node_modules/@base-ui/utils/mergeCleanups.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Combines multiple cleanup functions into a single cleanup function.
 */ __turbopack_context__.s([
    "mergeCleanups",
    ()=>mergeCleanups
]);
function mergeCleanups(...cleanups) {
    return ()=>{
        for(let i = 0; i < cleanups.length; i += 1){
            const cleanup = cleanups[i];
            if (cleanup) {
                cleanup();
            }
        }
    };
}
}),
"[project]/app/node_modules/@base-ui/utils/mergeObjects.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mergeObjects",
    ()=>mergeObjects
]);
function mergeObjects(a, b) {
    if (a && !b) {
        return a;
    }
    if (!a && b) {
        return b;
    }
    if (a || b) {
        return {
            ...a,
            ...b
        };
    }
    return undefined;
}
}),
"[project]/app/node_modules/@base-ui/utils/owner.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ownerDocument",
    ()=>ownerDocument
]);
;
function ownerDocument(node) {
    return node?.ownerDocument || document;
}
}),
"[project]/app/node_modules/@base-ui/utils/platform/engine.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "blink",
    ()=>blink,
    "gecko",
    ()=>gecko,
    "webkit",
    ()=>webkit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$shared$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/platform/shared.mjs [app-client] (ecmascript)");
;
const webkit = typeof CSS !== 'undefined' && !!CSS.supports?.('-webkit-backdrop-filter:none');
const gecko = !webkit && __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$shared$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowerUserAgent"].includes('firefox');
const blink = !webkit && __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$shared$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowerUserAgent"].includes('chrom');
}),
"[project]/app/node_modules/@base-ui/utils/platform/env.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "jsdom",
    ()=>jsdom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$shared$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/platform/shared.mjs [app-client] (ecmascript)");
;
const jsdom = /jsdom|happydom/.test(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$shared$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowerUserAgent"]);
}),
"[project]/app/node_modules/@base-ui/utils/platform/os.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "android",
    ()=>android,
    "apple",
    ()=>apple,
    "ios",
    ()=>ios,
    "linux",
    ()=>linux,
    "mac",
    ()=>mac,
    "windows",
    ()=>windows
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$shared$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/platform/shared.mjs [app-client] (ecmascript)");
;
const ios = /^i(os$|p)/.test(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$shared$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowerPlatform"]) || __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$shared$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowerPlatform"] === 'macintel' && __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$shared$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maxTouchPoints"] > 1;
/** Android phones, tablets, and embedded Android browsers. */ const ANDROID_STRING = 'android';
const android = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$shared$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowerPlatform"] === ANDROID_STRING || __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$shared$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowerUserAgent"].includes(ANDROID_STRING);
const mac = !ios && __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$shared$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowerPlatform"].startsWith('mac');
const windows = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$shared$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowerPlatform"].startsWith('win');
const linux = !android && /^(linux|chrome os)/.test(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$shared$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowerPlatform"]);
const apple = mac || ios;
}),
"[project]/app/node_modules/@base-ui/utils/platform/parts.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "engine",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$engine$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__,
    "env",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$env$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__,
    "os",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$os$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__,
    "screenReader",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$screen$2d$reader$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/platform/parts.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$os$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/platform/os.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$engine$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/platform/engine.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$screen$2d$reader$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/platform/screen-reader.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$env$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/platform/env.mjs [app-client] (ecmascript)");
}),
"[project]/app/node_modules/@base-ui/utils/platform/parts.mjs [app-client] (ecmascript) <export * as platform>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "platform",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/platform/parts.mjs [app-client] (ecmascript)");
}),
"[project]/app/node_modules/@base-ui/utils/platform/parts.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
}),
"[project]/app/node_modules/@base-ui/utils/platform/screen-reader.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "voiceOver",
    ()=>voiceOver
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$os$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/platform/os.mjs [app-client] (ecmascript)");
;
const voiceOver = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$os$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apple"];
}),
"[project]/app/node_modules/@base-ui/utils/platform/shared.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "lowerPlatform",
    ()=>lowerPlatform,
    "lowerUserAgent",
    ()=>lowerUserAgent,
    "maxTouchPoints",
    ()=>maxTouchPoints
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * Reads `navigator.userAgent` / `navigator.platform` (legacy but universally
 * supported) into a normalized shape. In development, prefers the modern
 * `navigator.userAgentData` API on Chromium to avoid DevTools warnings about
 * the deprecated reads; that branch is dead-code-eliminated in production
 * builds to keep the bundle small.
 *
 * Returns empty/zero values when `navigator` is undefined (SSR), so every
 * derived flag safely evaluates to `false`.
 */ function readRawData() {
    if (typeof navigator === 'undefined') {
        return {
            userAgent: '',
            platform: '',
            maxTouchPoints: 0
        };
    }
    if ("TURBOPACK compile-time truthy", 1) {
        const uaData = navigator.userAgentData;
        if (uaData && Array.isArray(uaData.brands)) {
            return {
                userAgent: uaData.brands.map(({ brand, version })=>`${brand}/${version}`).join(' '),
                platform: uaData.platform ?? navigator.platform ?? '',
                maxTouchPoints: navigator.maxTouchPoints ?? 0
            };
        }
    }
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform ?? '',
        maxTouchPoints: navigator.maxTouchPoints ?? 0
    };
}
const { userAgent, platform, maxTouchPoints } = readRawData();
const lowerUserAgent = userAgent.toLowerCase();
const lowerPlatform = platform.toLowerCase();
;
}),
"[project]/app/node_modules/@base-ui/utils/reactVersion.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isReactVersionAtLeast",
    ()=>isReactVersionAtLeast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
const majorVersion = parseInt(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"], 10);
function isReactVersionAtLeast(reactVersionToCheck) {
    return majorVersion >= reactVersionToCheck;
}
}),
"[project]/app/node_modules/@base-ui/utils/safeReact.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SafeReact",
    ()=>SafeReact
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
const SafeReact = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__
};
}),
"[project]/app/node_modules/@base-ui/utils/store/ReactStore.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReactStore",
    ()=>ReactStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$Store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/store/Store.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/empty.mjs [app-client] (ecmascript)");
/* False positives - ESLint thinks we're calling a hook from a class component. */ /* eslint-disable react-hooks/rules-of-hooks */ 'use client';
;
;
;
;
;
;
class ReactStore extends __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$Store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Store"] {
    /**
   * Creates a new ReactStore instance.
   *
   * @param state Initial state of the store.
   * @param context Non-reactive context values.
   * @param selectors Optional selectors for use with `useState`.
   */ constructor(state, context = {}, selectors){
        super(state);
        this.context = context;
        this.selectors = selectors;
    }
    /**
   * Non-reactive values such as refs, callbacks, etc.
   */ /**
   * Synchronizes a single external value into the store.
   *
   * Note that the while the value in `state` is updated immediately, the value returned
   * by `useState` is updated before the next render (similarly to React's `useState`).
   */ useSyncedValue(key, value) {
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebugValue"](key);
        // eslint-disable-next-line consistent-this
        const store = this;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])(()=>{
            if (store.state[key] !== value) {
                store.set(key, value);
            }
        }, [
            store,
            key,
            value
        ]);
    }
    /**
   * Synchronizes a single external value into the store and
   * cleans it up (sets to `undefined`) on unmount.
   *
   * Note that the while the value in `state` is updated immediately, the value returned
   * by `useState` is updated before the next render (similarly to React's `useState`).
   */ useSyncedValueWithCleanup(key, value) {
        // eslint-disable-next-line consistent-this
        const store = this;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])(()=>{
            if (store.state[key] !== value) {
                store.set(key, value);
            }
            return ()=>{
                store.set(key, undefined);
            };
        }, [
            store,
            key,
            value
        ]);
    }
    /**
   * Synchronizes multiple external values into the store.
   *
   * Note that the while the values in `state` are updated immediately, the values returned
   * by `useState` are updated before the next render (similarly to React's `useState`).
   */ useSyncedValues(statePart) {
        // eslint-disable-next-line consistent-this
        const store = this;
        if ("TURBOPACK compile-time truthy", 1) {
            // Check that an object with the same shape is passed on every render
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebugValue"](statePart, (p)=>Object.keys(p));
            const keys = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](Object.keys(statePart)).current;
            const nextKeys = Object.keys(statePart);
            if (keys.length !== nextKeys.length || keys.some((key, index)=>key !== nextKeys[index])) {
                console.error('ReactStore.useSyncedValues expects the same prop keys on every render. Keys should be stable.');
            }
        }
        const dependencies = Object.values(statePart);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])(()=>{
            store.update(statePart);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [
            store,
            ...dependencies
        ]);
    }
    /**
   * Registers a controllable prop pair (`controlled`, `defaultValue`) for a specific key. If `controlled`
   * is non-undefined, the store's state at `key` is updated to match `controlled`.
   */ useControlledProp(key, controlled) {
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebugValue"](key);
        // eslint-disable-next-line consistent-this
        const store = this;
        const isControlled = controlled !== undefined;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])(()=>{
            if (isControlled && !Object.is(store.state[key], controlled)) {
                // Set the internal state to match the controlled value.
                store.setState({
                    ...store.state,
                    [key]: controlled
                });
            }
        }, [
            store,
            key,
            controlled,
            isControlled
        ]);
        if ("TURBOPACK compile-time truthy", 1) {
            // eslint-disable-next-line
            const cache = this.controlledValues ??= new Map();
            if (!cache.has(key)) {
                cache.set(key, isControlled);
            }
            const previouslyControlled = cache.get(key);
            if (previouslyControlled !== undefined && previouslyControlled !== isControlled) {
                console.error(`A component is changing the ${isControlled ? '' : 'un'}controlled state of ${key.toString()} to be ${isControlled ? 'un' : ''}controlled. Elements should not switch from uncontrolled to controlled (or vice versa).`);
            }
        }
    }
    /** Gets the current value from the store using a selector with the provided key.
   *
   * @param key Key of the selector to use.
   */ select(key, a1, a2, a3) {
        const selector = this.selectors[key];
        return selector(this.state, a1, a2, a3);
    }
    /**
   * Returns a value from the store's state using a selector function.
   * Used to subscribe to specific parts of the state.
   * This methods causes a rerender whenever the selected state changes.
   *
   * @param key Key of the selector to use.
   */ useState(key, a1, a2, a3) {
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebugValue"](key);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(this, this.selectors[key], a1, a2, a3);
    }
    /**
   * Wraps a function with `useStableCallback` to ensure it has a stable reference
   * and assigns it to the context.
   *
   * @param key Key of the event callback. Must be a function in the context.
   * @param fn Function to assign.
   */ useContextCallback(key, fn) {
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebugValue"](key);
        const stableFunction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])(fn ?? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"]);
        this.context[key] = stableFunction;
    }
    /**
   * Returns a stable setter function for a specific key in the store's state.
   * It's commonly used to pass as a ref callback to React elements.
   *
   * @param key Key of the state to set.
   */ useStateSetter(key) {
        const ref = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](undefined);
        if (ref.current === undefined) {
            ref.current = (value)=>{
                this.set(key, value);
            };
        }
        return ref.current;
    }
    /**
   * Observes changes derived from the store's selectors and calls the listener when the selected value changes.
   *
   * @param key Key of the selector to observe.
   * @param listener Listener function called when the selector result changes.
   */ observe(selector, listener) {
        let selectFn;
        if (typeof selector === 'function') {
            selectFn = selector;
        } else {
            selectFn = this.selectors[selector];
        }
        let prevValue = selectFn(this.state);
        listener(prevValue, prevValue, this);
        return this.subscribe((nextState)=>{
            const nextValue = selectFn(nextState);
            if (!Object.is(prevValue, nextValue)) {
                const oldValue = prevValue;
                prevValue = nextValue;
                listener(nextValue, oldValue, this);
            }
        });
    }
}
}),
"[project]/app/node_modules/@base-ui/utils/store/Store.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Store",
    ()=>Store
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
;
class Store {
    /**
   * The current state of the store.
   * This property is updated immediately when the state changes as a result of calling {@link setState}, {@link update}, or {@link set}.
   * To subscribe to state changes, use the {@link useState} method. The value returned by {@link useState} is updated after the component renders (similarly to React's useState).
   * The values can be used directly (to avoid subscribing to the store) in effects or event handlers.
   *
   * Do not modify properties in state directly. Instead, use the provided methods to ensure proper state management and listener notification.
   */ // Internal state to handle recursive `setState()` calls
    constructor(state){
        this.state = state;
        this.listeners = new Set();
        this.updateTick = 0;
    }
    /**
   * Registers a listener that will be called whenever the store's state changes.
   *
   * @param fn The listener function to be called on state changes.
   * @returns A function to unsubscribe the listener.
   */ subscribe = (fn)=>{
        this.listeners.add(fn);
        return ()=>{
            this.listeners.delete(fn);
        };
    };
    /**
   * Returns the current state of the store.
   */ getSnapshot = ()=>{
        return this.state;
    };
    /**
   * Updates the entire store's state and notifies all registered listeners.
   *
   * @param newState The new state to set for the store.
   */ setState(newState) {
        if (this.state === newState) {
            return;
        }
        this.state = newState;
        this.updateTick += 1;
        const currentTick = this.updateTick;
        for (const listener of this.listeners){
            if (currentTick !== this.updateTick) {
                // If the tick has changed, a recursive `setState` call has been made,
                // and it has already notified all listeners.
                return;
            }
            listener(newState);
        }
    }
    /**
   * Merges the provided changes into the current state and notifies listeners if there are changes.
   *
   * @param changes An object containing the changes to apply to the current state.
   */ update(changes) {
        for(const key in changes){
            if (!Object.is(this.state[key], changes[key])) {
                this.setState({
                    ...this.state,
                    ...changes
                });
                return;
            }
        }
    }
    /**
   * Sets a specific key in the store's state to a new value and notifies listeners if the value has changed.
   *
   * @param key The key in the store's state to update.
   * @param value The new value to set for the specified key.
   */ set(key, value) {
        if (!Object.is(this.state[key], value)) {
            this.setState({
                ...this.state,
                [key]: value
            });
        }
    }
    /**
   * Gives the state a new reference and updates all registered listeners.
   */ notifyAll() {
        const newState = {
            ...this.state
        };
        this.setState(newState);
    }
    use(selector, a1, a2, a3) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(this, selector, a1, a2, a3);
    }
}
}),
"[project]/app/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
/* We need to import the shim because React 17 does not support the `useSyncExternalStore` API.
 * More info: https://github.com/mui/mui-x/issues/18303#issuecomment-2958392341 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/use-sync-external-store/shim/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$with$2d$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/use-sync-external-store/shim/with-selector.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$reactVersion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/reactVersion.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$fastHooks$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/fastHooks.mjs [app-client] (ecmascript)");
;
;
;
;
;
/* Some tests fail in R18 with the raw useSyncExternalStore. It may be possible to make it work
 * but for now we only enable it for R19+. */ const canUseRawUseSyncExternalStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$reactVersion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isReactVersionAtLeast"])(19);
const useStoreImplementation = canUseRawUseSyncExternalStore ? useStoreFast : useStoreLegacy;
function useStore(store, selector, a1, a2, a3) {
    return useStoreImplementation(store, selector, a1, a2, a3);
}
function useStoreR19(store, selector, a1, a2, a3) {
    const getSelection = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useStoreR19.useCallback[getSelection]": ()=>selector(store.getSnapshot(), a1, a2, a3)
    }["useStoreR19.useCallback[getSelection]"], [
        store,
        selector,
        a1,
        a2,
        a3
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(store.subscribe, getSelection, getSelection);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$fastHooks$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])({
    before (instance) {
        instance.syncIndex = 0;
        if (!instance.didInitialize) {
            instance.syncTick = 1;
            instance.syncHooks = [];
            instance.didChangeStore = true;
            instance.getSnapshot = ()=>{
                let didChange = false;
                for(let i = 0; i < instance.syncHooks.length; i += 1){
                    const hook = instance.syncHooks[i];
                    const value = hook.selector(hook.store.state, hook.a1, hook.a2, hook.a3);
                    if (!Object.is(hook.value, value)) {
                        didChange = true;
                        hook.value = value;
                    }
                }
                if (didChange) {
                    instance.syncTick += 1;
                }
                return instance.syncTick;
            };
        }
    },
    after (instance) {
        if (instance.syncHooks.length > 0) {
            if (instance.didChangeStore) {
                instance.didChangeStore = false;
                instance.subscribe = (onStoreChange)=>{
                    const stores = new Set();
                    for (const hook of instance.syncHooks){
                        stores.add(hook.store);
                    }
                    const unsubscribes = [];
                    for (const store of stores){
                        unsubscribes.push(store.subscribe(onStoreChange));
                    }
                    return ()=>{
                        for (const unsubscribe of unsubscribes){
                            unsubscribe();
                        }
                    };
                };
            }
            // eslint-disable-next-line react-hooks/rules-of-hooks
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(instance.subscribe, instance.getSnapshot, instance.getSnapshot);
        }
    }
});
function useStoreFast(store, selector, a1, a2, a3) {
    const instance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$fastHooks$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInstance"])();
    if (!instance) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useStoreR19(store, selector, a1, a2, a3);
    }
    const index = instance.syncIndex;
    instance.syncIndex += 1;
    let hook;
    if (!instance.didInitialize) {
        hook = {
            store,
            selector,
            a1,
            a2,
            a3,
            value: selector(store.getSnapshot(), a1, a2, a3)
        };
        instance.syncHooks.push(hook);
    } else {
        hook = instance.syncHooks[index];
        if (hook.store !== store || hook.selector !== selector || !Object.is(hook.a1, a1) || !Object.is(hook.a2, a2) || !Object.is(hook.a3, a3)) {
            if (hook.store !== store) {
                instance.didChangeStore = true;
            }
            hook.store = store;
            hook.selector = selector;
            hook.a1 = a1;
            hook.a2 = a2;
            hook.a3 = a3;
            hook.value = selector(store.getSnapshot(), a1, a2, a3);
        }
    }
    return hook.value;
}
function useStoreLegacy(store, selector, a1, a2, a3) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$with$2d$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStoreWithSelector"])(store.subscribe, store.getSnapshot, store.getSnapshot, {
        "useStoreLegacy.useSyncExternalStoreWithSelector": (state)=>selector(state, a1, a2, a3)
    }["useStoreLegacy.useSyncExternalStoreWithSelector"]);
}
}),
"[project]/app/node_modules/@base-ui/utils/useAnimationFrame.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnimationFrame",
    ()=>AnimationFrame,
    "resetAnimationFrameScheduler",
    ()=>resetAnimationFrameScheduler,
    "useAnimationFrame",
    ()=>useAnimationFrame
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/useRefWithInit.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useOnMount$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/useOnMount.mjs [app-client] (ecmascript)");
'use client';
;
;
/** Unlike `setTimeout`, rAF doesn't guarantee a positive integer return value, so we can't have
 * a monomorphic `uint` type with `0` meaning empty.
 * See warning note at:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame#return_value */ const EMPTY = null;
let LAST_RAF = globalThis.requestAnimationFrame;
class Scheduler {
    /* This implementation uses an array as a backing data-structure for frame callbacks.
   * It allows `O(1)` callback cancelling by inserting a `null` in the array, though it
   * never calls the native `cancelAnimationFrame` if there are no frames left. This can
   * be much more efficient if there is a call pattern that alterns as
   * "request-cancel-request-cancel-…".
   * But in the case of "request-request-…-cancel-cancel-…", it leaves the final animation
   * frame to run anyway. We turn that frame into a `O(1)` no-op via `callbacksCount`. */ callbacks = [];
    callbacksCount = 0;
    nextId = 1;
    startId = 1;
    isScheduled = false;
    tick = (timestamp)=>{
        this.isScheduled = false;
        const currentCallbacks = this.callbacks;
        const currentCallbacksCount = this.callbacksCount;
        // Update these before iterating, callbacks could call `requestAnimationFrame` again.
        this.callbacks = [];
        this.callbacksCount = 0;
        this.startId = this.nextId;
        if (currentCallbacksCount > 0) {
            for(let i = 0; i < currentCallbacks.length; i += 1){
                currentCallbacks[i]?.(timestamp);
            }
        }
    };
    request(fn) {
        const id = this.nextId;
        this.nextId += 1;
        this.callbacks.push(fn);
        this.callbacksCount += 1;
        /* In a test environment with fake timers, a fake `requestAnimationFrame` can be called
     * but there's no guarantee that the animation frame will actually run before the fake
     * timers are teared, which leaves `isScheduled` set, but won't run our `tick()`. */ const didRAFChange = ("TURBOPACK compile-time value", "development") !== 'production' && LAST_RAF !== requestAnimationFrame && (LAST_RAF = requestAnimationFrame, true);
        if (!this.isScheduled || didRAFChange) {
            requestAnimationFrame(this.tick);
            this.isScheduled = true;
        }
        return id;
    }
    cancel(id) {
        const index = id - this.startId;
        if (index < 0 || index >= this.callbacks.length) {
            return;
        }
        this.callbacks[index] = null;
        this.callbacksCount -= 1;
    }
}
let scheduler = new Scheduler();
function resetAnimationFrameScheduler() {
    const previous = scheduler;
    scheduler = new Scheduler();
    // Continue the id sequence so `cancel()` calls from `AnimationFrame` instances created before the
    // reset cannot cancel callbacks scheduled after it.
    scheduler.nextId = previous.nextId;
    scheduler.startId = previous.nextId;
    // A frame requested before the reset may still be pending and holds the previous scheduler's
    // `tick`; empty its queue in place so that frame runs nothing when it eventually fires.
    previous.callbacks = [];
    previous.callbacksCount = 0;
}
class AnimationFrame {
    static create() {
        return new AnimationFrame();
    }
    static request(fn) {
        return scheduler.request(fn);
    }
    static cancel(id) {
        return scheduler.cancel(id);
    }
    currentId = EMPTY;
    /**
   * Executes `fn` after `delay`, clearing any previously scheduled call.
   */ request(fn) {
        this.cancel();
        this.currentId = scheduler.request(()=>{
            this.currentId = EMPTY;
            fn();
        });
    }
    cancel = ()=>{
        if (this.currentId !== EMPTY) {
            scheduler.cancel(this.currentId);
            this.currentId = EMPTY;
        }
    };
    disposeEffect = ()=>{
        return this.cancel;
    };
}
function useAnimationFrame() {
    const timeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRefWithInit"])(AnimationFrame.create).current;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useOnMount$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnMount"])(timeout.disposeEffect);
    return timeout;
}
}),
"[project]/app/node_modules/@base-ui/utils/useId.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useId",
    ()=>useId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$safeReact$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/safeReact.mjs [app-client] (ecmascript)");
'use client';
;
;
let globalId = 0;
// TODO React 17: Remove `useGlobalId` once React 17 support is removed
function useGlobalId(idOverride, prefix = 'mui') {
    const [defaultId, setDefaultId] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](idOverride);
    const id = idOverride || defaultId;
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useGlobalId.useEffect": ()=>{
            if (defaultId == null) {
                // Fallback to this default id when possible.
                // Use the incrementing value for client-side rendering only.
                // We can't use it server-side.
                // If you want to use random values please consider the Birthday Problem: https://en.wikipedia.org/wiki/Birthday_problem
                globalId += 1;
                setDefaultId(`${prefix}-${globalId}`);
            }
        }
    }["useGlobalId.useEffect"], [
        defaultId,
        prefix
    ]);
    return id;
}
const maybeReactUseId = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$safeReact$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SafeReact"].useId;
function useId(idOverride, prefix) {
    // React.useId() is only available from React 17.0.0.
    if (maybeReactUseId !== undefined) {
        const reactId = maybeReactUseId();
        return idOverride ?? (prefix ? `${prefix}-${reactId}` : reactId);
    }
    // TODO: uncomment once we enable eslint-plugin-react-compiler // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/rules-of-hooks -- `React.useId` is invariant at runtime.
    return useGlobalId(idOverride, prefix);
}
}),
"[project]/app/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useIsoLayoutEffect",
    ()=>useIsoLayoutEffect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
const noop = ()=>{};
const useIsoLayoutEffect = typeof document !== 'undefined' ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"] : noop;
}),
"[project]/app/node_modules/@base-ui/utils/useMergedRefs.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMergedRefs",
    ()=>useMergedRefs,
    "useMergedRefsN",
    ()=>useMergedRefsN
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/useRefWithInit.mjs [app-client] (ecmascript)");
;
function useMergedRefs(a, b, c, d) {
    const forkRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRefWithInit"])(createForkRef).current;
    if (didChange(forkRef, a, b, c, d)) {
        update(forkRef, [
            a,
            b,
            c,
            d
        ]);
    }
    return forkRef.callback;
}
function useMergedRefsN(refs) {
    const forkRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRefWithInit"])(createForkRef).current;
    if (didChangeN(forkRef, refs)) {
        update(forkRef, refs);
    }
    return forkRef.callback;
}
function createForkRef() {
    return {
        callback: null,
        cleanup: null,
        refs: []
    };
}
function didChange(forkRef, a, b, c, d) {
    // prettier-ignore
    return forkRef.refs[0] !== a || forkRef.refs[1] !== b || forkRef.refs[2] !== c || forkRef.refs[3] !== d;
}
function didChangeN(forkRef, newRefs) {
    return forkRef.refs.length !== newRefs.length || forkRef.refs.some((ref, index)=>ref !== newRefs[index]);
}
function update(forkRef, refs) {
    forkRef.refs = refs;
    if (refs.every((ref)=>ref == null)) {
        forkRef.callback = null;
        return;
    }
    forkRef.callback = (instance)=>{
        if (forkRef.cleanup) {
            forkRef.cleanup();
            forkRef.cleanup = null;
        }
        if (instance != null) {
            const cleanupCallbacks = Array(refs.length).fill(null);
            for(let i = 0; i < refs.length; i += 1){
                const ref = refs[i];
                if (ref == null) {
                    continue;
                }
                switch(typeof ref){
                    case 'function':
                        {
                            const refCleanup = ref(instance);
                            if (typeof refCleanup === 'function') {
                                cleanupCallbacks[i] = refCleanup;
                            }
                            break;
                        }
                    case 'object':
                        {
                            ref.current = instance;
                            break;
                        }
                    default:
                }
            }
            forkRef.cleanup = ()=>{
                for(let i = 0; i < refs.length; i += 1){
                    const ref = refs[i];
                    if (ref == null) {
                        continue;
                    }
                    switch(typeof ref){
                        case 'function':
                            {
                                const cleanupCallback = cleanupCallbacks[i];
                                if (typeof cleanupCallback === 'function') {
                                    cleanupCallback();
                                } else {
                                    // Legacy ref with no attach-time cleanup: detach by calling it with `null`.
                                    // It returns nothing; React 19 cleanups are handled in the branch above.
                                    void ref(null);
                                }
                                break;
                            }
                        case 'object':
                            {
                                ref.current = null;
                                break;
                            }
                        default:
                    }
                }
            };
        }
    };
}
}),
"[project]/app/node_modules/@base-ui/utils/useOnMount.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOnMount",
    ()=>useOnMount
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/empty.mjs [app-client] (ecmascript)");
'use client';
;
;
function useOnMount(fn) {
    // TODO: uncomment once we enable eslint-plugin-react-compiler // eslint-disable-next-line react-compiler/react-compiler -- no need to put `fn` in the dependency array
    /* eslint-disable react-hooks/exhaustive-deps */ __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"](fn, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_ARRAY"]);
/* eslint-enable react-hooks/exhaustive-deps */ }
}),
"[project]/app/node_modules/@base-ui/utils/usePreviousValue.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePreviousValue",
    ()=>usePreviousValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
function usePreviousValue(value) {
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        current: value,
        previous: null
    });
    if (!Object.is(value, state.current)) {
        setState({
            current: value,
            previous: state.current
        });
    }
    return state.previous;
}
}),
"[project]/app/node_modules/@base-ui/utils/useRefWithInit.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useRefWithInit",
    ()=>useRefWithInit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
const UNINITIALIZED = {};
function useRefWithInit(init, initArg) {
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](UNINITIALIZED);
    if (ref.current === UNINITIALIZED) {
        ref.current = init(initArg);
    }
    return ref;
}
}),
"[project]/app/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStableCallback",
    ()=>useStableCallback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$safeReact$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/safeReact.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/useRefWithInit.mjs [app-client] (ecmascript)");
'use client';
;
;
const useInsertionEffect = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$safeReact$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SafeReact"].useInsertionEffect;
const useSafeInsertionEffect = // React 17 doesn't have useInsertionEffect.
useInsertionEffect && // Preact replaces useInsertionEffect with useLayoutEffect and fires too late.
useInsertionEffect !== __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$safeReact$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SafeReact"].useLayoutEffect ? useInsertionEffect : (fn)=>fn();
function useStableCallback(callback) {
    const stable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRefWithInit"])(createStableCallback).current;
    stable.next = callback;
    useSafeInsertionEffect(stable.effect);
    return stable.trampoline;
}
function createStableCallback() {
    const stable = {
        next: undefined,
        callback: assertNotCalled,
        trampoline: (...args)=>stable.callback?.(...args),
        effect: ()=>{
            stable.callback = stable.next;
        }
    };
    return stable;
}
function assertNotCalled() {
    if ("TURBOPACK compile-time truthy", 1) {
        // TODO: fix mui/no-guarded-throw
        // eslint-disable-next-line mui/no-guarded-throw
        throw /* minify-error-disabled */ new Error('Base UI: Cannot call an event handler while rendering.');
    }
}
}),
"[project]/app/node_modules/@base-ui/utils/useTimeout.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Timeout",
    ()=>Timeout,
    "useTimeout",
    ()=>useTimeout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/useRefWithInit.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useOnMount$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/useOnMount.mjs [app-client] (ecmascript)");
'use client';
;
;
const EMPTY = 0;
class Timeout {
    static create() {
        return new Timeout();
    }
    currentId = EMPTY;
    /**
   * Executes `fn` after `delay`, clearing any previously scheduled call.
   */ start(delay, fn) {
        this.clear();
        this.currentId = setTimeout(()=>{
            this.currentId = EMPTY;
            fn();
        }, delay); /* Node.js types are enabled in development */ 
    }
    isStarted() {
        return this.currentId !== EMPTY;
    }
    clear = ()=>{
        if (this.currentId !== EMPTY) {
            clearTimeout(this.currentId);
            this.currentId = EMPTY;
        }
    };
    disposeEffect = ()=>{
        return this.clear;
    };
}
function useTimeout() {
    const timeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRefWithInit"])(Timeout.create).current;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useOnMount$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnMount"])(timeout.disposeEffect);
    return timeout;
}
}),
"[project]/app/node_modules/@base-ui/utils/useValueAsRef.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useValueAsRef",
    ()=>useValueAsRef
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/utils/useRefWithInit.mjs [app-client] (ecmascript)");
'use client';
;
;
function useValueAsRef(value) {
    const latest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRefWithInit"])(createLatestRef, value).current;
    latest.next = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])(latest.effect);
    return latest;
}
function createLatestRef(value) {
    const latest = {
        current: value,
        next: value,
        effect: ()=>{
            latest.current = latest.next;
        }
    };
    return latest;
}
}),
"[project]/app/node_modules/@base-ui/utils/visuallyHidden.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "visuallyHidden",
    ()=>visuallyHidden,
    "visuallyHiddenInput",
    ()=>visuallyHiddenInput
]);
const visuallyHiddenBase = {
    clipPath: 'inset(50%)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    border: 0,
    padding: 0,
    width: 1,
    height: 1,
    margin: -1
};
const visuallyHidden = {
    ...visuallyHiddenBase,
    position: 'fixed',
    top: 0,
    left: 0
};
const visuallyHiddenInput = {
    ...visuallyHiddenBase,
    position: 'absolute'
};
}),
"[project]/app/node_modules/@base-ui/utils/warn.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "warn",
    ()=>warn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
let set;
if ("TURBOPACK compile-time truthy", 1) {
    set = new Set();
}
function warn(...messages) {
    if ("TURBOPACK compile-time truthy", 1) {
        const messageKey = messages.join(' ');
        if (!set.has(messageKey)) {
            set.add(messageKey);
            console.warn(`Base UI: ${messageKey}`);
        }
    }
}
}),
"[project]/app/node_modules/@floating-ui/core/dist/floating-ui.core.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "arrow",
    ()=>arrow,
    "autoPlacement",
    ()=>autoPlacement,
    "computePosition",
    ()=>computePosition,
    "detectOverflow",
    ()=>detectOverflow,
    "flip",
    ()=>flip,
    "hide",
    ()=>hide,
    "inline",
    ()=>inline,
    "limitShift",
    ()=>limitShift,
    "offset",
    ()=>offset,
    "shift",
    ()=>shift,
    "size",
    ()=>size
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs [app-client] (ecmascript)");
;
;
function computeCoordsFromPlacement(_ref, placement, rtl) {
    let { reference, floating } = _ref;
    const sideAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSideAxis"])(placement);
    const alignmentAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlignmentAxis"])(placement);
    const alignLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAxisLength"])(alignmentAxis);
    const side = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSide"])(placement);
    const isVertical = sideAxis === 'y';
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
    let coords;
    switch(side){
        case 'top':
            coords = {
                x: commonX,
                y: reference.y - floating.height
            };
            break;
        case 'bottom':
            coords = {
                x: commonX,
                y: reference.y + reference.height
            };
            break;
        case 'right':
            coords = {
                x: reference.x + reference.width,
                y: commonY
            };
            break;
        case 'left':
            coords = {
                x: reference.x - floating.width,
                y: commonY
            };
            break;
        default:
            coords = {
                x: reference.x,
                y: reference.y
            };
    }
    const alignment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlignment"])(placement);
    if (alignment) {
        coords[alignmentAxis] += commonAlign * (alignment === 'end' ? 1 : -1) * (rtl && isVertical ? -1 : 1);
    }
    return coords;
}
/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */ async function detectOverflow(state, options) {
    var _await$platform$isEle;
    if (options === void 0) {
        options = {};
    }
    const { x, y, platform, rects, elements, strategy } = state;
    const { boundary = 'clippingAncestors', rootBoundary = 'viewport', elementContext = 'floating', altBoundary = false, padding = 0 } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["evaluate"])(options, state);
    const paddingObject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPaddingObject"])(padding);
    const altContext = elementContext === 'floating' ? 'reference' : 'floating';
    const element = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rectToClientRect"])(await platform.getClippingRect({
        element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating)),
        boundary,
        rootBoundary,
        strategy
    }));
    const rect = elementContext === 'floating' ? {
        x,
        y,
        width: rects.floating.width,
        height: rects.floating.height
    } : rects.reference;
    const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
    const offsetScale = await (platform.isElement == null ? void 0 : platform.isElement(offsetParent)) && await (platform.getScale == null ? void 0 : platform.getScale(offsetParent)) || {
        x: 1,
        y: 1
    };
    const elementClientRect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rectToClientRect"])(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
        elements,
        rect,
        offsetParent,
        strategy
    }) : rect);
    return {
        top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
        bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
        left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
        right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
}
// Maximum number of resets that can occur before bailing to avoid infinite reset loops.
const MAX_RESET_COUNT = 50;
/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */ const computePosition = async (reference, floating, config)=>{
    const { placement = 'bottom', strategy = 'absolute', middleware = [], platform } = config;
    const platformWithDetectOverflow = platform.detectOverflow ? platform : {
        ...platform,
        detectOverflow
    };
    const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
    let rects = await platform.getElementRects({
        reference,
        floating,
        strategy
    });
    let { x, y } = computeCoordsFromPlacement(rects, placement, rtl);
    let statefulPlacement = placement;
    let resetCount = 0;
    const middlewareData = {};
    for(let i = 0; i < middleware.length; i++){
        const currentMiddleware = middleware[i];
        if (!currentMiddleware) {
            continue;
        }
        const { name, fn } = currentMiddleware;
        const { x: nextX, y: nextY, data, reset } = await fn({
            x,
            y,
            initialPlacement: placement,
            placement: statefulPlacement,
            strategy,
            middlewareData,
            rects,
            platform: platformWithDetectOverflow,
            elements: {
                reference,
                floating
            }
        });
        x = nextX != null ? nextX : x;
        y = nextY != null ? nextY : y;
        middlewareData[name] = {
            ...middlewareData[name],
            ...data
        };
        if (reset && resetCount < MAX_RESET_COUNT) {
            resetCount++;
            if (typeof reset === 'object') {
                if (reset.placement) {
                    statefulPlacement = reset.placement;
                }
                if (reset.rects) {
                    rects = reset.rects === true ? await platform.getElementRects({
                        reference,
                        floating,
                        strategy
                    }) : reset.rects;
                }
                ({ x, y } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
            }
            i = -1;
        }
    }
    return {
        x,
        y,
        placement: statefulPlacement,
        strategy,
        middlewareData
    };
};
/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */ const arrow = (options)=>({
        name: 'arrow',
        options,
        async fn (state) {
            const { x, y, placement, rects, platform, elements, middlewareData } = state;
            // Since `element` is required, we don't Partial<> the type.
            const { element, padding = 0 } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["evaluate"])(options, state) || {};
            if (element == null) {
                return {};
            }
            const paddingObject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPaddingObject"])(padding);
            const coords = {
                x,
                y
            };
            const axis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlignmentAxis"])(placement);
            const length = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAxisLength"])(axis);
            const arrowDimensions = await platform.getDimensions(element);
            const isYAxis = axis === 'y';
            const minProp = isYAxis ? 'top' : 'left';
            const maxProp = isYAxis ? 'bottom' : 'right';
            const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
            const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
            const startDiff = coords[axis] - rects.reference[axis];
            const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
            let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
            // DOM platform can return `window` as the `offsetParent`.
            if (!clientSize || !await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent))) {
                clientSize = elements.floating[clientProp] || rects.floating[length];
            }
            const centerToReference = endDiff / 2 - startDiff / 2;
            // If the padding is large enough that it causes the arrow to no longer be
            // centered, modify the padding so that it is centered.
            const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
            const minPadding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"])(paddingObject[minProp], largestPossiblePadding);
            const maxPadding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"])(paddingObject[maxProp], largestPossiblePadding);
            // Make sure the arrow doesn't overflow the floating element if the center
            // point is outside the floating element's bounds.
            const max = clientSize - arrowDimensions[length] - maxPadding;
            const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
            const offset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(minPadding, center, max);
            // If the reference is small enough that the arrow's padding causes it to
            // to point to nothing for an aligned placement, adjust the offset of the
            // floating element itself. To ensure `shift()` continues to take action,
            // a single reset is performed when this is true.
            const shouldAddOffset = !middlewareData.arrow && (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlignment"])(placement) != null && center !== offset && rects.reference[length] / 2 - (center < minPadding ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
            const alignmentOffset = shouldAddOffset ? center < minPadding ? center - minPadding : center - max : 0;
            return {
                [axis]: coords[axis] + alignmentOffset,
                data: {
                    [axis]: offset,
                    centerOffset: center - offset - alignmentOffset,
                    ...shouldAddOffset && {
                        alignmentOffset
                    }
                },
                reset: shouldAddOffset
            };
        }
    });
function getPlacementList(alignment, autoAlignment, allowedPlacements) {
    const allowedPlacementsSortedByAlignment = alignment ? [
        ...allowedPlacements.filter((placement)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlignment"])(placement) === alignment),
        ...allowedPlacements.filter((placement)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlignment"])(placement) !== alignment)
    ] : allowedPlacements.filter((placement)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSide"])(placement) === placement);
    return allowedPlacementsSortedByAlignment.filter((placement)=>{
        if (alignment) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlignment"])(placement) === alignment || (autoAlignment ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOppositeAlignmentPlacement"])(placement) !== placement : false);
        }
        return true;
    });
}
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */ const autoPlacement = function(options) {
    if (options === void 0) {
        options = {};
    }
    return {
        name: 'autoPlacement',
        options,
        async fn (state) {
            var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
            const { rects, middlewareData, placement, platform, elements } = state;
            const { crossAxis = false, alignment, allowedPlacements = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["placements"], autoAlignment = true, ...detectOverflowOptions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["evaluate"])(options, state);
            const placements$1 = alignment !== undefined || allowedPlacements === __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["placements"] ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
            const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
            const currentPlacement = placements$1[currentIndex];
            if (currentPlacement == null) {
                return {};
            }
            // Make `computeCoords` start from the right place.
            if (placement !== currentPlacement) {
                return {
                    reset: {
                        placement: placements$1[0]
                    }
                };
            }
            const overflow = await platform.detectOverflow(state, detectOverflowOptions);
            const alignmentSides = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlignmentSides"])(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));
            const currentOverflows = [
                overflow[(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSide"])(currentPlacement)],
                overflow[alignmentSides[0]],
                overflow[alignmentSides[1]]
            ];
            const allOverflows = [
                ...((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || [],
                {
                    placement: currentPlacement,
                    overflows: currentOverflows
                }
            ];
            const nextPlacement = placements$1[currentIndex + 1];
            // There are more placements to check.
            if (nextPlacement) {
                return {
                    data: {
                        index: currentIndex + 1,
                        overflows: allOverflows
                    },
                    reset: {
                        placement: nextPlacement
                    }
                };
            }
            const placementsSortedByMostSpace = allOverflows.map((d)=>{
                const alignment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlignment"])(d.placement);
                return [
                    d.placement,
                    alignment && crossAxis ? // Check along the mainAxis and main crossAxis side.
                    d.overflows.slice(0, 2).reduce((acc, v)=>acc + v, 0) : // Check only the mainAxis.
                    d.overflows[0],
                    d.overflows
                ];
            }).sort((a, b)=>a[1] - b[1]);
            const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter((d)=>d[2].slice(0, // Aligned placements should not check their opposite crossAxis
                // side.
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlignment"])(d[0]) ? 2 : 3).every((v)=>v <= 0));
            const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
            if (resetPlacement !== placement) {
                return {
                    data: {
                        index: currentIndex + 1,
                        overflows: allOverflows
                    },
                    reset: {
                        placement: resetPlacement
                    }
                };
            }
            return {};
        }
    };
};
/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */ const flip = function(options) {
    if (options === void 0) {
        options = {};
    }
    return {
        name: 'flip',
        options,
        async fn (state) {
            var _middlewareData$arrow, _middlewareData$flip;
            const { placement, middlewareData, rects, initialPlacement, platform, elements } = state;
            const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true, fallbackPlacements: specifiedFallbackPlacements, fallbackStrategy = 'bestFit', fallbackAxisSideDirection = 'none', flipAlignment = true, ...detectOverflowOptions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["evaluate"])(options, state);
            // If a reset by the arrow was caused due to an alignment offset being
            // added, we should skip any logic now since `flip()` has already done its
            // work.
            // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
            if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
                return {};
            }
            const side = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSide"])(placement);
            const initialSideAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSideAxis"])(initialPlacement);
            const isBasePlacement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSide"])(initialPlacement) === initialPlacement;
            const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
            const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOppositePlacement"])(initialPlacement)
            ] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getExpandedPlacements"])(initialPlacement));
            const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
            if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
                fallbackPlacements.push(...(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOppositeAxisPlacements"])(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
            }
            const placements = [
                initialPlacement,
                ...fallbackPlacements
            ];
            const overflow = await platform.detectOverflow(state, detectOverflowOptions);
            const overflows = [];
            let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
            if (checkMainAxis) {
                overflows.push(overflow[side]);
            }
            if (checkCrossAxis) {
                const sides = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlignmentSides"])(placement, rects, rtl);
                overflows.push(overflow[sides[0]], overflow[sides[1]]);
            }
            overflowsData = [
                ...overflowsData,
                {
                    placement,
                    overflows
                }
            ];
            // One or more sides is overflowing.
            if (!overflows.every((side)=>side <= 0)) {
                var _middlewareData$flip2, _overflowsData$filter;
                const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
                const nextPlacement = placements[nextIndex];
                if (nextPlacement) {
                    const ignoreCrossAxisOverflow = checkCrossAxis === 'alignment' ? initialSideAxis !== (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSideAxis"])(nextPlacement) : false;
                    if (!ignoreCrossAxisOverflow || // We leave the current main axis only if every placement on that axis
                    // overflows the main axis.
                    overflowsData.every((d)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSideAxis"])(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
                        // Try next placement and re-run the lifecycle.
                        return {
                            data: {
                                index: nextIndex,
                                overflows: overflowsData
                            },
                            reset: {
                                placement: nextPlacement
                            }
                        };
                    }
                }
                // First, find the candidates that fit on the mainAxis side of overflow,
                // then find the placement that fits the best on the main crossAxis side.
                let resetPlacement = (_overflowsData$filter = overflowsData.filter((d)=>d.overflows[0] <= 0).sort((a, b)=>a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
                // Otherwise fallback.
                if (!resetPlacement) {
                    switch(fallbackStrategy){
                        case 'bestFit':
                            {
                                var _overflowsData$filter2;
                                const placement = (_overflowsData$filter2 = overflowsData.filter((d)=>{
                                    if (hasFallbackAxisSideDirection) {
                                        const currentSideAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSideAxis"])(d.placement);
                                        return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                                        // reading directions favoring greater width.
                                        currentSideAxis === 'y';
                                    }
                                    return true;
                                }).map((d)=>[
                                        d.placement,
                                        d.overflows.filter((overflow)=>overflow > 0).reduce((acc, overflow)=>acc + overflow, 0)
                                    ]).sort((a, b)=>a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                                if (placement) {
                                    resetPlacement = placement;
                                }
                                break;
                            }
                        case 'initialPlacement':
                            resetPlacement = initialPlacement;
                            break;
                    }
                }
                if (placement !== resetPlacement) {
                    return {
                        reset: {
                            placement: resetPlacement
                        }
                    };
                }
            }
            return {};
        }
    };
};
function getSideOffsets(overflow, rect) {
    return {
        top: overflow.top - rect.height,
        right: overflow.right - rect.width,
        bottom: overflow.bottom - rect.height,
        left: overflow.left - rect.width
    };
}
function isAnySideFullyClipped(overflow) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sides"].some((side)=>overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */ const hide = function(options) {
    if (options === void 0) {
        options = {};
    }
    return {
        name: 'hide',
        options,
        async fn (state) {
            const { rects, platform } = state;
            const { strategy = 'referenceHidden', ...detectOverflowOptions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["evaluate"])(options, state);
            switch(strategy){
                case 'referenceHidden':
                    {
                        const overflow = await platform.detectOverflow(state, {
                            ...detectOverflowOptions,
                            elementContext: 'reference'
                        });
                        const offsets = getSideOffsets(overflow, rects.reference);
                        return {
                            data: {
                                referenceHiddenOffsets: offsets,
                                referenceHidden: isAnySideFullyClipped(offsets)
                            }
                        };
                    }
                case 'escaped':
                    {
                        const overflow = await platform.detectOverflow(state, {
                            ...detectOverflowOptions,
                            altBoundary: true
                        });
                        const offsets = getSideOffsets(overflow, rects.floating);
                        return {
                            data: {
                                escapedOffsets: offsets,
                                escaped: isAnySideFullyClipped(offsets)
                            }
                        };
                    }
                default:
                    {
                        return {};
                    }
            }
        }
    };
};
function getBoundingRect(rects) {
    const minX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"])(...rects.map((rect)=>rect.left));
    const minY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"])(...rects.map((rect)=>rect.top));
    const maxX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["max"])(...rects.map((rect)=>rect.right));
    const maxY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["max"])(...rects.map((rect)=>rect.bottom));
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}
function getRectsByLine(rects) {
    const sortedRects = rects.slice().sort((a, b)=>a.y - b.y);
    const groups = [];
    let prevRect = null;
    for(let i = 0; i < sortedRects.length; i++){
        const rect = sortedRects[i];
        if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
            groups.push([
                rect
            ]);
        } else {
            groups[groups.length - 1].push(rect);
        }
        prevRect = rect;
    }
    return groups.map((rect)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rectToClientRect"])(getBoundingRect(rect)));
}
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */ const inline = function(options) {
    if (options === void 0) {
        options = {};
    }
    return {
        name: 'inline',
        options,
        async fn (state) {
            const { placement, elements, rects, platform, strategy } = state;
            // A MouseEvent's client{X,Y} coords can be up to 2 pixels off a
            // ClientRect's bounds, despite the event listener being triggered. A
            // padding of 2 seems to handle this issue.
            const { padding = 2, x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["evaluate"])(options, state);
            const nativeClientRects = Array.from(await (platform.getClientRects == null ? void 0 : platform.getClientRects(elements.reference)) || []);
            // No rects (e.g. a hidden or detached reference, or a collapsed range) —
            // keep the existing reference rect rather than resetting to an invalid
            // one with non-finite values.
            if (!nativeClientRects.length) {
                return {};
            }
            const clientRects = getRectsByLine(nativeClientRects);
            const fallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rectToClientRect"])(getBoundingRect(nativeClientRects));
            const paddingObject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPaddingObject"])(padding);
            function getBoundingClientRect() {
                // There are two rects and they are disjoined.
                if (clientRects.length === 2 && (clientRects[0].left > clientRects[1].right || clientRects[1].left > clientRects[0].right) && x != null && y != null) {
                    // Find the first rect in which the point is fully inside.
                    return clientRects.find((rect)=>x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
                }
                // There are 2 or more connected rects.
                if (clientRects.length >= 2) {
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSideAxis"])(placement) === 'y') {
                        const firstRect = clientRects[0];
                        const lastRect = clientRects[clientRects.length - 1];
                        const isTop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSide"])(placement) === 'top';
                        const top = firstRect.top;
                        const bottom = lastRect.bottom;
                        const left = isTop ? firstRect.left : lastRect.left;
                        const right = isTop ? firstRect.right : lastRect.right;
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rectToClientRect"])({
                            x: left,
                            y: top,
                            width: right - left,
                            height: bottom - top
                        });
                    }
                    const isLeftSide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSide"])(placement) === 'left';
                    const maxRight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["max"])(...clientRects.map((rect)=>rect.right));
                    const minLeft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"])(...clientRects.map((rect)=>rect.left));
                    const measureRects = clientRects.filter((rect)=>isLeftSide ? rect.left === minLeft : rect.right === maxRight);
                    const top = measureRects[0].top;
                    const bottom = measureRects[measureRects.length - 1].bottom;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rectToClientRect"])({
                        x: minLeft,
                        y: top,
                        width: maxRight - minLeft,
                        height: bottom - top
                    });
                }
                return fallback;
            }
            const resetRects = await platform.getElementRects({
                reference: {
                    getBoundingClientRect
                },
                floating: elements.floating,
                strategy
            });
            if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
                return {
                    reset: {
                        rects: resetRects
                    }
                };
            }
            return {};
        }
    };
};
const originSides = /*#__PURE__*/ new Set([
    'left',
    'top'
]);
// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.
async function convertValueToCoords(state, options) {
    const { placement, platform, elements } = state;
    const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
    const side = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSide"])(placement);
    const alignment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlignment"])(placement);
    const isVertical = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSideAxis"])(placement) === 'y';
    const mainAxisMulti = originSides.has(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["evaluate"])(options, state);
    // eslint-disable-next-line prefer-const
    let { mainAxis, crossAxis, alignmentAxis } = typeof rawValue === 'number' ? {
        mainAxis: rawValue,
        crossAxis: 0,
        alignmentAxis: null
    } : {
        mainAxis: rawValue.mainAxis || 0,
        crossAxis: rawValue.crossAxis || 0,
        alignmentAxis: rawValue.alignmentAxis
    };
    if (alignment && typeof alignmentAxis === 'number') {
        crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
    }
    return isVertical ? {
        x: crossAxis * crossAxisMulti,
        y: mainAxis * mainAxisMulti
    } : {
        x: mainAxis * mainAxisMulti,
        y: crossAxis * crossAxisMulti
    };
}
/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */ const offset = function(options) {
    if (options === void 0) {
        options = 0;
    }
    return {
        name: 'offset',
        options,
        async fn (state) {
            var _middlewareData$offse, _middlewareData$arrow;
            const { x, y, placement, middlewareData } = state;
            const diffCoords = await convertValueToCoords(state, options);
            // If the placement is the same and the arrow caused an alignment offset
            // then we don't need to change the positioning coordinates.
            if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
                return {};
            }
            return {
                x: x + diffCoords.x,
                y: y + diffCoords.y,
                data: {
                    ...diffCoords,
                    placement
                }
            };
        }
    };
};
/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */ const shift = function(options) {
    if (options === void 0) {
        options = {};
    }
    return {
        name: 'shift',
        options,
        async fn (state) {
            const { x, y, placement, platform } = state;
            const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = false, limiter = {
                fn: (_ref)=>{
                    let { x, y } = _ref;
                    return {
                        x,
                        y
                    };
                }
            }, ...detectOverflowOptions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["evaluate"])(options, state);
            const coords = {
                x,
                y
            };
            const overflow = await platform.detectOverflow(state, detectOverflowOptions);
            const crossAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSideAxis"])(placement);
            const mainAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOppositeAxis"])(crossAxis);
            let mainAxisCoord = coords[mainAxis];
            let crossAxisCoord = coords[crossAxis];
            const clampCoord = (axis, coord)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(coord + overflow[axis === 'y' ? 'top' : 'left'], coord, coord - overflow[axis === 'y' ? 'bottom' : 'right']);
            if (checkMainAxis) {
                mainAxisCoord = clampCoord(mainAxis, mainAxisCoord);
            }
            if (checkCrossAxis) {
                crossAxisCoord = clampCoord(crossAxis, crossAxisCoord);
            }
            const limitedCoords = limiter.fn({
                ...state,
                [mainAxis]: mainAxisCoord,
                [crossAxis]: crossAxisCoord
            });
            return {
                ...limitedCoords,
                data: {
                    x: limitedCoords.x - x,
                    y: limitedCoords.y - y,
                    enabled: {
                        [mainAxis]: checkMainAxis,
                        [crossAxis]: checkCrossAxis
                    }
                }
            };
        }
    };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */ const limitShift = function(options) {
    if (options === void 0) {
        options = {};
    }
    return {
        options,
        fn (state) {
            var _rawOffset$mainAxis, _rawOffset$crossAxis;
            const { x, y, placement, rects, middlewareData } = state;
            const { offset = 0, mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["evaluate"])(options, state);
            const coords = {
                x,
                y
            };
            const crossAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSideAxis"])(placement);
            const mainAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOppositeAxis"])(crossAxis);
            let mainAxisCoord = coords[mainAxis];
            let crossAxisCoord = coords[crossAxis];
            const rawOffset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["evaluate"])(offset, state);
            const computedOffset = typeof rawOffset === 'number' ? {
                mainAxis: rawOffset,
                crossAxis: 0
            } : {
                mainAxis: (_rawOffset$mainAxis = rawOffset.mainAxis) != null ? _rawOffset$mainAxis : 0,
                crossAxis: (_rawOffset$crossAxis = rawOffset.crossAxis) != null ? _rawOffset$crossAxis : 0
            };
            if (checkMainAxis) {
                const len = mainAxis === 'y' ? 'height' : 'width';
                const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
                const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
                if (mainAxisCoord < limitMin) {
                    mainAxisCoord = limitMin;
                } else if (mainAxisCoord > limitMax) {
                    mainAxisCoord = limitMax;
                }
            }
            if (checkCrossAxis) {
                var _middlewareData$offse, _middlewareData$offse2;
                const len = mainAxis === 'y' ? 'width' : 'height';
                const isOriginSide = originSides.has((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSide"])(placement));
                const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
                const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
                if (crossAxisCoord < limitMin) {
                    crossAxisCoord = limitMin;
                } else if (crossAxisCoord > limitMax) {
                    crossAxisCoord = limitMax;
                }
            }
            return {
                [mainAxis]: mainAxisCoord,
                [crossAxis]: crossAxisCoord
            };
        }
    };
};
// Method syntax keeps callback parameters bivariant, but expressing the
// explicit `| undefined` required by `exactOptionalPropertyTypes` needs
// property syntax, which is contravariant under `strictFunctionTypes`.
// Extracting the function from a method position restores that bivariance so
// consumers can still assign callbacks with narrower parameter types.
/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */ const size = function(options) {
    if (options === void 0) {
        options = {};
    }
    return {
        name: 'size',
        options,
        async fn (state) {
            const { placement, rects, platform, elements } = state;
            const { apply = ()=>{}, ...detectOverflowOptions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["evaluate"])(options, state);
            const overflow = await platform.detectOverflow(state, detectOverflowOptions);
            const side = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSide"])(placement);
            const alignment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlignment"])(placement);
            const isYAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSideAxis"])(placement) === 'y';
            const { width, height } = rects.floating;
            let heightSide;
            let widthSide;
            if (side === 'top' || side === 'bottom') {
                heightSide = side;
                widthSide = alignment === (await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)) ? 'start' : 'end') ? 'left' : 'right';
            } else {
                widthSide = side;
                heightSide = alignment === 'end' ? 'top' : 'bottom';
            }
            const maximumClippingHeight = height - overflow.top - overflow.bottom;
            const maximumClippingWidth = width - overflow.left - overflow.right;
            const overflowAvailableHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"])(height - overflow[heightSide], maximumClippingHeight);
            const overflowAvailableWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"])(width - overflow[widthSide], maximumClippingWidth);
            const shiftData = state.middlewareData.shift;
            const noShift = !shiftData;
            let availableHeight = overflowAvailableHeight;
            let availableWidth = overflowAvailableWidth;
            if (shiftData != null && shiftData.enabled.x) {
                availableWidth = maximumClippingWidth;
            }
            if (shiftData != null && shiftData.enabled.y) {
                availableHeight = maximumClippingHeight;
            }
            if (noShift && !alignment) {
                if (isYAxis) {
                    availableWidth = width - 2 * (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["max"])(overflow.left, overflow.right);
                } else {
                    availableHeight = height - 2 * (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["max"])(overflow.top, overflow.bottom);
                }
            }
            await apply({
                ...state,
                availableWidth,
                availableHeight
            });
            const nextDimensions = await platform.getDimensions(elements.floating);
            if (width !== nextDimensions.width || height !== nextDimensions.height) {
                return {
                    reset: {
                        rects: true
                    }
                };
            }
            return {};
        }
    };
};
;
}),
"[project]/app/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "arrow",
    ()=>arrow,
    "autoPlacement",
    ()=>autoPlacement,
    "autoUpdate",
    ()=>autoUpdate,
    "computePosition",
    ()=>computePosition,
    "detectOverflow",
    ()=>detectOverflow,
    "flip",
    ()=>flip,
    "hide",
    ()=>hide,
    "inline",
    ()=>inline,
    "limitShift",
    ()=>limitShift,
    "offset",
    ()=>offset,
    "platform",
    ()=>platform,
    "shift",
    ()=>shift,
    "size",
    ()=>size
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$core$2f$dist$2f$floating$2d$ui$2e$core$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/node_modules/@floating-ui/core/dist/floating-ui.core.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript)");
;
;
;
;
function getCssDimensions(element) {
    const css = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getComputedStyle"])(element);
    // In testing environments, the `width` and `height` properties are empty
    // strings for SVG elements, returning NaN. Fallback to `0` in this case.
    let width = parseFloat(css.width) || 0;
    let height = parseFloat(css.height) || 0;
    const hasOffset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHTMLElement"])(element);
    const offsetWidth = hasOffset ? element.offsetWidth : width;
    const offsetHeight = hasOffset ? element.offsetHeight : height;
    const shouldFallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(width) !== offsetWidth || (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(height) !== offsetHeight;
    if (shouldFallback) {
        width = offsetWidth;
        height = offsetHeight;
    }
    return {
        width,
        height,
        $: shouldFallback
    };
}
function unwrapElement(element) {
    return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isElement"])(element) ? element.contextElement : element;
}
function getScale(element) {
    const domElement = unwrapElement(element);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHTMLElement"])(domElement)) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCoords"])(1);
    }
    const rect = domElement.getBoundingClientRect();
    const { width, height, $ } = getCssDimensions(domElement);
    let x = ($ ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(rect.width) : rect.width) / width;
    let y = ($ ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(rect.height) : rect.height) / height;
    // 0, NaN, or Infinity should always fallback to 1.
    if (!x || !Number.isFinite(x)) {
        x = 1;
    }
    if (!y || !Number.isFinite(y)) {
        y = 1;
    }
    return {
        x,
        y
    };
}
const noOffsets = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCoords"])(0);
function getVisualOffsets(element) {
    const win = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWindow"])(element);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWebKit"])() || !win.visualViewport) {
        return noOffsets;
    }
    return {
        x: win.visualViewport.offsetLeft,
        y: win.visualViewport.offsetTop
    };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
    if (isFixed === void 0) {
        isFixed = false;
    }
    return !!floatingOffsetParent && isFixed && floatingOffsetParent === (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWindow"])(element);
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
    if (includeScale === void 0) {
        includeScale = false;
    }
    if (isFixedStrategy === void 0) {
        isFixedStrategy = false;
    }
    const clientRect = element.getBoundingClientRect();
    const domElement = unwrapElement(element);
    let scale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCoords"])(1);
    if (includeScale) {
        if (offsetParent) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isElement"])(offsetParent)) {
                scale = getScale(offsetParent);
            }
        } else {
            scale = getScale(element);
        }
    }
    const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCoords"])(0);
    let x = (clientRect.left + visualOffsets.x) / scale.x;
    let y = (clientRect.top + visualOffsets.y) / scale.y;
    let width = clientRect.width / scale.x;
    let height = clientRect.height / scale.y;
    if (domElement && offsetParent) {
        const win = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWindow"])(domElement);
        const offsetWin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isElement"])(offsetParent) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWindow"])(offsetParent) : offsetParent;
        let currentWin = win;
        let currentIFrame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFrameElement"])(currentWin);
        while(currentIFrame && offsetWin !== currentWin){
            const iframeScale = getScale(currentIFrame);
            const iframeRect = currentIFrame.getBoundingClientRect();
            const css = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getComputedStyle"])(currentIFrame);
            const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
            const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
            x *= iframeScale.x;
            y *= iframeScale.y;
            width *= iframeScale.x;
            height *= iframeScale.y;
            x += left;
            y += top;
            currentWin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWindow"])(currentIFrame);
            currentIFrame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFrameElement"])(currentWin);
        }
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rectToClientRect"])({
        width,
        height,
        x,
        y
    });
}
// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
function getWindowScrollBarX(element, rect) {
    const leftScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNodeScroll"])(element).scrollLeft;
    if (!rect) {
        return getBoundingClientRect((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocumentElement"])(element)).left + leftScroll;
    }
    return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll) {
    const htmlRect = documentElement.getBoundingClientRect();
    const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
    const y = htmlRect.top + scroll.scrollTop;
    return {
        x,
        y
    };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let { elements, rect, offsetParent, strategy } = _ref;
    const isFixed = strategy === 'fixed';
    const documentElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocumentElement"])(offsetParent);
    const topLayer = elements ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTopLayer"])(elements.floating) : false;
    if (offsetParent === documentElement || topLayer && isFixed) {
        return rect;
    }
    let scroll = {
        scrollLeft: 0,
        scrollTop: 0
    };
    let scale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCoords"])(1);
    const offsets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCoords"])(0);
    const isOffsetParentAnElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHTMLElement"])(offsetParent);
    if (isOffsetParentAnElement || !isFixed) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNodeName"])(offsetParent) !== 'body' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOverflowElement"])(documentElement)) {
            scroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNodeScroll"])(offsetParent);
        }
        if (isOffsetParentAnElement) {
            const offsetRect = getBoundingClientRect(offsetParent);
            scale = getScale(offsetParent);
            offsets.x = offsetRect.x + offsetParent.clientLeft;
            offsets.y = offsetRect.y + offsetParent.clientTop;
        }
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCoords"])(0);
    return {
        width: rect.width * scale.x,
        height: rect.height * scale.y,
        x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
        y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
    };
}
function getClientRects(element) {
    return element.getClientRects ? Array.from(element.getClientRects()) : [];
}
// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(html) {
    const scroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNodeScroll"])(html);
    const body = html.ownerDocument.body;
    const width = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["max"])(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
    const height = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["max"])(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
    let x = -scroll.scrollLeft + getWindowScrollBarX(html);
    const y = -scroll.scrollTop;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getComputedStyle"])(body).direction === 'rtl') {
        x += (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["max"])(html.clientWidth, body.clientWidth) - width;
    }
    return {
        width,
        height,
        x,
        y
    };
}
// Safety check: ensure the scrollbar space is reasonable in case this
// calculation is affected by unusual styles.
// Most scrollbars leave 15-18px of space.
const SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy, rootBoundary) {
    if (rootBoundary === void 0) {
        rootBoundary = 'viewport';
    }
    const isLayoutViewport = rootBoundary === 'layoutViewport';
    const win = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWindow"])(element);
    const html = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocumentElement"])(element);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x = 0;
    let y = 0;
    if (visualViewport) {
        // Client coordinates are relative to the layout viewport, except in
        // WebKit with an `absolute` strategy, where they are relative to the
        // visual viewport.
        const layoutRelativeClientCoords = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWebKit"])() || strategy === 'fixed';
        if (isLayoutViewport) {
            if (!layoutRelativeClientCoords) {
                x = -visualViewport.offsetLeft;
                y = -visualViewport.offsetTop;
            }
        } else {
            width = visualViewport.width;
            height = visualViewport.height;
            if (layoutRelativeClientCoords) {
                x = visualViewport.offsetLeft;
                y = visualViewport.offsetTop;
            }
        }
    }
    const windowScrollbarX = getWindowScrollBarX(html);
    // `scrollbar-gutter: stable` on the <html> reserves gutter space that shrinks
    // the visual width but isn't reflected in `html.clientWidth`, so subtract it.
    // Only the inline-end (right) gutter can hold the scrollbar; `both-edges` also
    // reserves an empty inline-start gutter that clips nothing, so exclude just
    // the one scrollbar-side gutter — halve the measured (two-gutter) total. A
    // left-side scrollbar (`windowScrollbarX > 0`) is already handled by
    // `getHTMLOffset`/`visualViewport.width`; skip it here.
    if (windowScrollbarX <= 0) {
        const doc = html.ownerDocument;
        const body = doc.body;
        const bodyStyles = getComputedStyle(body);
        const bodyMarginInline = doc.compatMode === 'CSS1Compat' ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
        const reservedWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
        const gutter = getComputedStyle(html).scrollbarGutter === 'stable both-edges' ? reservedWidth / 2 : reservedWidth;
        if (gutter <= SCROLLBAR_MAX) {
            width -= gutter;
        }
    }
    return {
        width,
        height,
        x,
        y
    };
}
// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
    const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;
    const scale = getScale(element);
    const width = element.clientWidth * scale.x;
    const height = element.clientHeight * scale.y;
    const x = left * scale.x;
    const y = top * scale.y;
    return {
        width,
        height,
        x,
        y
    };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
    let rect;
    if (clippingAncestor === 'viewport' || clippingAncestor === 'layoutViewport') {
        rect = getViewportRect(element, strategy, clippingAncestor);
    } else if (clippingAncestor === 'document') {
        rect = getDocumentRect((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocumentElement"])(element));
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isElement"])(clippingAncestor)) {
        rect = getInnerBoundingClientRect(clippingAncestor, strategy);
    } else {
        const visualOffsets = getVisualOffsets(element);
        rect = {
            x: clippingAncestor.x - visualOffsets.x,
            y: clippingAncestor.y - visualOffsets.y,
            width: clippingAncestor.width,
            height: clippingAncestor.height
        };
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rectToClientRect"])(rect);
}
// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
    const cachedResult = cache.get(element);
    if (cachedResult) {
        return cachedResult;
    }
    let result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOverflowAncestors"])(element, [], false).filter((el)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isElement"])(el) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNodeName"])(el) !== 'body');
    let lastKeptComputedStyle = null;
    const elementIsFixed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getComputedStyle"])(element).position === 'fixed';
    let currentNode = elementIsFixed ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getParentNode"])(element) : element;
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
    while((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isElement"])(currentNode) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLastTraversableNode"])(currentNode)){
        const computedStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getComputedStyle"])(currentNode);
        const currentNodeIsContaining = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isContainingBlock"])(currentNode);
        // Position of the containing block chain below the current node. A fixed
        // element whose containing block hasn't been found yet is a fixed chain.
        const lastPosition = lastKeptComputedStyle ? lastKeptComputedStyle.position : elementIsFixed ? 'fixed' : '';
        // A non-containing ancestor does not clip the element when the chain
        // below it escapes it: a fixed chain escapes all ancestors up to the
        // next containing block, an absolute chain escapes static ancestors.
        const shouldDropCurrentNode = !currentNodeIsContaining && (lastPosition === 'fixed' || lastPosition === 'absolute' && computedStyle.position === 'static');
        if (shouldDropCurrentNode) {
            // Drop non-containing blocks.
            result = result.filter((ancestor)=>ancestor !== currentNode);
        } else {
            // The kept node carries the chain position for the next iteration.
            lastKeptComputedStyle = computedStyle;
        }
        currentNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getParentNode"])(currentNode);
    }
    cache.set(element, result);
    return result;
}
// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
    let { element, boundary, rootBoundary, strategy } = _ref;
    const elementClippingAncestors = boundary === 'clippingAncestors' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTopLayer"])(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
    const clippingAncestors = [
        ...elementClippingAncestors,
        rootBoundary
    ];
    const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
    let top = firstRect.top;
    let right = firstRect.right;
    let bottom = firstRect.bottom;
    let left = firstRect.left;
    for(let i = 1; i < clippingAncestors.length; i++){
        const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
        top = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["max"])(rect.top, top);
        right = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"])(rect.right, right);
        bottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"])(rect.bottom, bottom);
        left = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["max"])(rect.left, left);
    }
    return {
        width: right - left,
        height: bottom - top,
        x: left,
        y: top
    };
}
function getDimensions(element) {
    const { width, height } = getCssDimensions(element);
    return {
        width,
        height
    };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
    const isOffsetParentAnElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHTMLElement"])(offsetParent);
    const documentElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocumentElement"])(offsetParent);
    const isFixed = strategy === 'fixed';
    const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
    let scroll = {
        scrollLeft: 0,
        scrollTop: 0
    };
    const offsets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCoords"])(0);
    if (isOffsetParentAnElement || !isFixed) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNodeName"])(offsetParent) !== 'body' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOverflowElement"])(documentElement)) {
            scroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNodeScroll"])(offsetParent);
        }
        if (isOffsetParentAnElement) {
            const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
            offsets.x = offsetRect.x + offsetParent.clientLeft;
            offsets.y = offsetRect.y + offsetParent.clientTop;
        }
    }
    // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
    // Firefox with layout.scrollbar.side = 3 in about:config to test this.
    if (!isOffsetParentAnElement && documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCoords"])(0);
    const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
    const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
    return {
        x,
        y,
        width: rect.width,
        height: rect.height
    };
}
function isStaticPositioned(element) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getComputedStyle"])(element).position === 'static';
}
function getTrueOffsetParent(element, polyfill) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHTMLElement"])(element) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getComputedStyle"])(element).position === 'fixed') {
        return null;
    }
    if (polyfill) {
        return polyfill(element);
    }
    let rawOffsetParent = element.offsetParent;
    // Firefox returns the <html> element as the offsetParent if it's non-static,
    // while Chrome and Safari return the <body> element. The <body> element must
    // be used to perform the correct calculations even if the <html> element is
    // non-static.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocumentElement"])(element) === rawOffsetParent) {
        rawOffsetParent = rawOffsetParent.ownerDocument.body;
    }
    return rawOffsetParent;
}
// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
    const win = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWindow"])(element);
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTopLayer"])(element)) {
        return win;
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHTMLElement"])(element)) {
        let svgOffsetParent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getParentNode"])(element);
        while(svgOffsetParent && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLastTraversableNode"])(svgOffsetParent)){
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isElement"])(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
                return svgOffsetParent;
            }
            svgOffsetParent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getParentNode"])(svgOffsetParent);
        }
        return win;
    }
    let offsetParent = getTrueOffsetParent(element, polyfill);
    while(offsetParent && (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTableElement"])(offsetParent) && isStaticPositioned(offsetParent)){
        offsetParent = getTrueOffsetParent(offsetParent, polyfill);
    }
    if (offsetParent && (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLastTraversableNode"])(offsetParent) && isStaticPositioned(offsetParent) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isContainingBlock"])(offsetParent)) {
        return win;
    }
    return offsetParent || (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getContainingBlock"])(element) || win;
}
const getElementRects = async function(data) {
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    const floatingDimensions = await getDimensionsFn(data.floating);
    return {
        reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
        floating: {
            x: 0,
            y: 0,
            width: floatingDimensions.width,
            height: floatingDimensions.height
        }
    };
};
function isRTL(element) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getComputedStyle"])(element).direction === 'rtl';
}
const platform = {
    convertOffsetParentRelativeRectToViewportRelativeRect,
    getDocumentElement: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocumentElement"],
    getClippingRect,
    getOffsetParent,
    getElementRects,
    getClientRects,
    getDimensions,
    getScale,
    isElement: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isElement"],
    isRTL
};
function rectsAreEqual(a, b) {
    return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove, ancestorResize) {
    let io = null;
    let timeoutId;
    const root = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocumentElement"])(element);
    function cleanup() {
        var _io;
        clearTimeout(timeoutId);
        (_io = io) == null || _io.disconnect();
        io = null;
    }
    function refresh(skip, threshold) {
        if (skip === void 0) {
            skip = false;
        }
        if (threshold === void 0) {
            threshold = 1;
        }
        cleanup();
        const elementRectForRootMargin = element.getBoundingClientRect();
        const { left, top, width, height } = elementRectForRootMargin;
        if (!skip) {
            onMove();
        }
        if (!width || !height) {
            return;
        }
        const insetTop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floor"])(top);
        const insetRight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floor"])(root.clientWidth - (left + width));
        const insetBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floor"])(root.clientHeight - (top + height));
        const insetLeft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floor"])(left);
        const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
        const options = {
            rootMargin,
            threshold: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["max"])(0, (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"])(1, threshold)) || 1
        };
        let isFirstUpdate = true;
        function handleObserve(entries) {
            const ratio = entries[0].intersectionRatio;
            // The entry is a snapshot, so the reference may have moved since the
            // intersection was computed (under performance constraints, or between
            // consecutive frames of a multi-frame layout shift). The reported ratio
            // and the observed area are stale in that case and cannot be trusted to
            // detect subsequent movement, so refresh regardless of the ratio.
            if (!rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
                return refresh();
            }
            if (ratio !== threshold) {
                if (!isFirstUpdate) {
                    return refresh();
                }
                if (!ratio) {
                    // If the reference is clipped in place, the ratio is 0. Throttle
                    // the refresh to prevent an infinite loop of updates.
                    timeoutId = setTimeout(()=>{
                        refresh(false, 1e-7);
                    }, 1000);
                } else {
                    refresh(false, ratio);
                }
            }
            isFirstUpdate = false;
        }
        // Older browsers don't support a `document` as the root and will throw an
        // error.
        try {
            io = new IntersectionObserver(handleObserve, {
                ...options,
                // Handle <iframe>s
                root: root.ownerDocument
            });
        } catch (_e) {
            io = new IntersectionObserver(handleObserve, options);
        }
        io.observe(element);
    }
    const win = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWindow"])(element);
    // The window is a resize ancestor, so when `ancestorResize` is enabled its
    // listener already runs the update on resize. Here we only need to rebuild
    // the `IntersectionObserver` for the new root size, skipping a redundant
    // update. When `ancestorResize` is disabled, this becomes the sole update.
    const handleResize = ()=>refresh(ancestorResize);
    win.addEventListener('resize', handleResize);
    refresh(true);
    return ()=>{
        win.removeEventListener('resize', handleResize);
        cleanup();
    };
}
/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */ function autoUpdate(reference, floating, update, options) {
    if (options === void 0) {
        options = {};
    }
    const { ancestorScroll = true, ancestorResize = true, elementResize = typeof ResizeObserver === 'function', layoutShift = typeof IntersectionObserver === 'function', animationFrame = false } = options;
    const referenceEl = unwrapElement(reference);
    const ancestors = ancestorScroll || ancestorResize ? [
        ...referenceEl ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOverflowAncestors"])(referenceEl) : [],
        ...floating ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOverflowAncestors"])(floating) : []
    ] : [];
    ancestors.forEach((ancestor)=>{
        ancestorScroll && ancestor.addEventListener('scroll', update);
        ancestorResize && ancestor.addEventListener('resize', update);
    });
    const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update, ancestorResize) : null;
    let reobserveFrame = -1;
    let resizeObserver = null;
    if (elementResize) {
        resizeObserver = new ResizeObserver((_ref)=>{
            let [firstEntry] = _ref;
            if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
                // Prevent update loops when using the `size` middleware.
                // https://github.com/floating-ui/floating-ui/issues/1740
                resizeObserver.unobserve(floating);
                cancelAnimationFrame(reobserveFrame);
                reobserveFrame = requestAnimationFrame(()=>{
                    var _resizeObserver;
                    (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
                });
            }
            update();
        });
        if (referenceEl && !animationFrame) {
            resizeObserver.observe(referenceEl);
        }
        if (floating) {
            resizeObserver.observe(floating);
        }
    }
    let frameId;
    let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
    if (animationFrame) {
        frameLoop();
    }
    function frameLoop() {
        const nextRefRect = getBoundingClientRect(reference);
        if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
            update();
        }
        prevRefRect = nextRefRect;
        frameId = requestAnimationFrame(frameLoop);
    }
    update();
    return ()=>{
        var _resizeObserver2;
        ancestors.forEach((ancestor)=>{
            ancestorScroll && ancestor.removeEventListener('scroll', update);
            ancestorResize && ancestor.removeEventListener('resize', update);
        });
        cleanupIo == null || cleanupIo();
        (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
        resizeObserver = null;
        if (animationFrame) {
            cancelAnimationFrame(frameId);
        }
    };
}
/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */ const detectOverflow = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$core$2f$dist$2f$floating$2d$ui$2e$core$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["detectOverflow"];
/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */ const offset = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$core$2f$dist$2f$floating$2d$ui$2e$core$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["offset"];
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */ const autoPlacement = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$core$2f$dist$2f$floating$2d$ui$2e$core$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["autoPlacement"];
/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */ const shift = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$core$2f$dist$2f$floating$2d$ui$2e$core$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shift"];
/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */ const flip = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$core$2f$dist$2f$floating$2d$ui$2e$core$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["flip"];
/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */ const size = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$core$2f$dist$2f$floating$2d$ui$2e$core$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["size"];
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */ const hide = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$core$2f$dist$2f$floating$2d$ui$2e$core$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["hide"];
/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */ const arrow = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$core$2f$dist$2f$floating$2d$ui$2e$core$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["arrow"];
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */ const inline = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$core$2f$dist$2f$floating$2d$ui$2e$core$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["inline"];
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */ const limitShift = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$core$2f$dist$2f$floating$2d$ui$2e$core$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["limitShift"];
/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */ const computePosition = (reference, floating, options)=>{
    // This caches the expensive `getClippingElementAncestors` function so that
    // multiple lifecycle resets re-use the same result. It only lives for a
    // single call. If other functions become expensive, we can add them as well.
    const cache = new Map();
    const mergedOptions = options != null ? options : {};
    const platformWithCache = {
        ...platform,
        ...mergedOptions.platform,
        _c: cache
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$core$2f$dist$2f$floating$2d$ui$2e$core$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["computePosition"])(reference, floating, {
        ...mergedOptions,
        platform: platformWithCache
    });
};
;
}),
"[project]/app/node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "arrow",
    ()=>arrow,
    "autoPlacement",
    ()=>autoPlacement,
    "flip",
    ()=>flip,
    "hide",
    ()=>hide,
    "inline",
    ()=>inline,
    "limitShift",
    ()=>limitShift,
    "offset",
    ()=>offset,
    "shift",
    ()=>shift,
    "size",
    ()=>size,
    "useFloating",
    ()=>useFloating
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
;
;
;
;
;
var isClient = typeof document !== 'undefined';
var noop = function noop() {};
var index = isClient ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"] : noop;
// Fork of `fast-deep-equal` that only does the comparisons we need and compares
// functions
function deepEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (typeof a !== typeof b) {
        return false;
    }
    if (typeof a === 'function' && a.toString() === b.toString()) {
        return true;
    }
    let length;
    let i;
    let keys;
    if (a && b && typeof a === 'object') {
        if (Array.isArray(a)) {
            length = a.length;
            if (length !== b.length) return false;
            for(i = length; i-- !== 0;){
                if (!deepEqual(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) {
            return false;
        }
        for(i = length; i-- !== 0;){
            if (!({}).hasOwnProperty.call(b, keys[i])) {
                return false;
            }
        }
        for(i = length; i-- !== 0;){
            const key = keys[i];
            if (key === '_owner' && a.$$typeof) {
                continue;
            }
            if (!deepEqual(a[key], b[key])) {
                return false;
            }
        }
        return true;
    }
    return a !== a && b !== b;
}
function getDPR(element) {
    if (typeof window === 'undefined') {
        return 1;
    }
    const win = element.ownerDocument.defaultView || window;
    return win.devicePixelRatio || 1;
}
function roundByDPR(element, value) {
    const dpr = getDPR(element);
    return Math.round(value * dpr) / dpr;
}
function useLatestRef(value) {
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](value);
    index(()=>{
        ref.current = value;
    });
    return ref;
}
/**
 * Provides data to position a floating element.
 * @see https://floating-ui.com/docs/useFloating
 */ function useFloating(options) {
    if (options === void 0) {
        options = {};
    }
    const { placement = 'bottom', strategy = 'absolute', middleware = [], platform, elements: { reference: externalReference, floating: externalFloating } = {}, transform = true, whileElementsMounted, open } = options;
    const [data, setData] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        x: 0,
        y: 0,
        strategy,
        placement,
        middlewareData: {},
        isPositioned: false
    });
    const [latestMiddleware, setLatestMiddleware] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](middleware);
    if (!deepEqual(latestMiddleware, middleware)) {
        setLatestMiddleware(middleware);
    }
    const [_reference, _setReference] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [_floating, _setFloating] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const setReference = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useFloating.useCallback[setReference]": (node)=>{
            if (node !== referenceRef.current) {
                referenceRef.current = node;
                _setReference(node);
            }
        }
    }["useFloating.useCallback[setReference]"], []);
    const setFloating = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useFloating.useCallback[setFloating]": (node)=>{
            if (node !== floatingRef.current) {
                floatingRef.current = node;
                _setFloating(node);
            }
        }
    }["useFloating.useCallback[setFloating]"], []);
    const referenceEl = externalReference || _reference;
    const floatingEl = externalFloating || _floating;
    const referenceRef = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const floatingRef = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const dataRef = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](data);
    const hasWhileElementsMounted = whileElementsMounted != null;
    const whileElementsMountedRef = useLatestRef(whileElementsMounted);
    const platformRef = useLatestRef(platform);
    const openRef = useLatestRef(open);
    const update = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useFloating.useCallback[update]": ()=>{
            if (!referenceRef.current || !floatingRef.current) {
                return;
            }
            const config = {
                placement,
                strategy,
                middleware: latestMiddleware
            };
            if (platformRef.current) {
                config.platform = platformRef.current;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["computePosition"])(referenceRef.current, floatingRef.current, config).then({
                "useFloating.useCallback[update]": (data)=>{
                    const fullData = {
                        ...data,
                        // The floating element's position may be recomputed while it's closed
                        // but still mounted (such as when transitioning out). To ensure
                        // `isPositioned` will be `false` initially on the next open, avoid
                        // setting it to `true` when `open === false` (must be specified).
                        isPositioned: openRef.current !== false
                    };
                    if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
                        dataRef.current = fullData;
                        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushSync"]({
                            "useFloating.useCallback[update]": ()=>{
                                setData(fullData);
                            }
                        }["useFloating.useCallback[update]"]);
                    }
                }
            }["useFloating.useCallback[update]"]);
        }
    }["useFloating.useCallback[update]"], [
        latestMiddleware,
        placement,
        strategy,
        platformRef,
        openRef
    ]);
    index(()=>{
        if (open === false && dataRef.current.isPositioned) {
            dataRef.current.isPositioned = false;
            setData((data)=>({
                    ...data,
                    isPositioned: false
                }));
        }
    }, [
        open
    ]);
    const isMountedRef = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    index(()=>{
        isMountedRef.current = true;
        return ()=>{
            isMountedRef.current = false;
        };
    }, []);
    index(()=>{
        if (referenceEl) referenceRef.current = referenceEl;
        if (floatingEl) floatingRef.current = floatingEl;
        if (referenceEl && floatingEl) {
            if (whileElementsMountedRef.current) {
                return whileElementsMountedRef.current(referenceEl, floatingEl, update);
            }
            update();
        }
    }, [
        referenceEl,
        floatingEl,
        update,
        whileElementsMountedRef,
        hasWhileElementsMounted
    ]);
    const refs = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useFloating.useMemo[refs]": ()=>({
                reference: referenceRef,
                floating: floatingRef,
                setReference,
                setFloating
            })
    }["useFloating.useMemo[refs]"], [
        setReference,
        setFloating
    ]);
    const elements = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useFloating.useMemo[elements]": ()=>({
                reference: referenceEl,
                floating: floatingEl
            })
    }["useFloating.useMemo[elements]"], [
        referenceEl,
        floatingEl
    ]);
    const floatingStyles = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useFloating.useMemo[floatingStyles]": ()=>{
            const initialStyles = {
                position: strategy,
                left: 0,
                top: 0
            };
            if (!elements.floating) {
                return initialStyles;
            }
            const x = roundByDPR(elements.floating, data.x);
            const y = roundByDPR(elements.floating, data.y);
            if (transform) {
                return {
                    ...initialStyles,
                    transform: "translate(" + x + "px, " + y + "px)",
                    ...getDPR(elements.floating) >= 1.5 && {
                        willChange: 'transform'
                    }
                };
            }
            return {
                position: strategy,
                left: x,
                top: y
            };
        }
    }["useFloating.useMemo[floatingStyles]"], [
        strategy,
        transform,
        elements.floating,
        data.x,
        data.y
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useFloating.useMemo": ()=>({
                ...data,
                update,
                refs,
                elements,
                floatingStyles
            })
    }["useFloating.useMemo"], [
        data,
        update,
        refs,
        elements,
        floatingStyles
    ]);
}
/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */ const arrow$1 = (options)=>{
    function isRef(value) {
        return ({}).hasOwnProperty.call(value, 'current');
    }
    return {
        name: 'arrow',
        options,
        fn (state) {
            const { element, padding } = typeof options === 'function' ? options(state) : options;
            if (element && isRef(element)) {
                if (element.current != null) {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["arrow"])({
                        element: element.current,
                        padding
                    }).fn(state);
                }
                return {};
            }
            if (element) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["arrow"])({
                    element,
                    padding
                }).fn(state);
            }
            return {};
        }
    };
};
/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */ const offset = (options, deps)=>{
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["offset"])(options);
    return {
        name: result.name,
        fn: result.fn,
        options: [
            options,
            deps
        ]
    };
};
/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */ const shift = (options, deps)=>{
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shift"])(options);
    return {
        name: result.name,
        fn: result.fn,
        options: [
            options,
            deps
        ]
    };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */ const limitShift = (options, deps)=>{
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["limitShift"])(options);
    return {
        fn: result.fn,
        options: [
            options,
            deps
        ]
    };
};
/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */ const flip = (options, deps)=>{
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["flip"])(options);
    return {
        name: result.name,
        fn: result.fn,
        options: [
            options,
            deps
        ]
    };
};
/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */ const size = (options, deps)=>{
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["size"])(options);
    return {
        name: result.name,
        fn: result.fn,
        options: [
            options,
            deps
        ]
    };
};
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */ const autoPlacement = (options, deps)=>{
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["autoPlacement"])(options);
    return {
        name: result.name,
        fn: result.fn,
        options: [
            options,
            deps
        ]
    };
};
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */ const hide = (options, deps)=>{
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["hide"])(options);
    return {
        name: result.name,
        fn: result.fn,
        options: [
            options,
            deps
        ]
    };
};
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */ const inline = (options, deps)=>{
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["inline"])(options);
    return {
        name: result.name,
        fn: result.fn,
        options: [
            options,
            deps
        ]
    };
};
/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */ const arrow = (options, deps)=>{
    const result = arrow$1(options);
    return {
        name: result.name,
        fn: result.fn,
        options: [
            options,
            deps
        ]
    };
};
;
}),
"[project]/app/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getComputedStyle",
    ()=>getComputedStyle,
    "getContainingBlock",
    ()=>getContainingBlock,
    "getDocumentElement",
    ()=>getDocumentElement,
    "getFrameElement",
    ()=>getFrameElement,
    "getNearestOverflowAncestor",
    ()=>getNearestOverflowAncestor,
    "getNodeName",
    ()=>getNodeName,
    "getNodeScroll",
    ()=>getNodeScroll,
    "getOverflowAncestors",
    ()=>getOverflowAncestors,
    "getParentNode",
    ()=>getParentNode,
    "getWindow",
    ()=>getWindow,
    "isContainingBlock",
    ()=>isContainingBlock,
    "isElement",
    ()=>isElement,
    "isHTMLElement",
    ()=>isHTMLElement,
    "isLastTraversableNode",
    ()=>isLastTraversableNode,
    "isNode",
    ()=>isNode,
    "isOverflowElement",
    ()=>isOverflowElement,
    "isShadowRoot",
    ()=>isShadowRoot,
    "isTableElement",
    ()=>isTableElement,
    "isTopLayer",
    ()=>isTopLayer,
    "isWebKit",
    ()=>isWebKit
]);
function hasWindow() {
    return typeof window !== 'undefined';
}
function getNodeName(node) {
    if (isNode(node)) {
        return (node.nodeName || '').toLowerCase();
    }
    // Mocked nodes in testing environments may not be instances of Node. By
    // returning `#document` an infinite loop won't occur.
    // https://github.com/floating-ui/floating-ui/issues/2317
    return '#document';
}
function getWindow(node) {
    var _node$ownerDocument;
    return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
    var _ref;
    return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
    if (!hasWindow()) {
        return false;
    }
    return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
    if (!hasWindow()) {
        return false;
    }
    return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
    if (!hasWindow()) {
        return false;
    }
    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
    if (!hasWindow() || typeof ShadowRoot === 'undefined') {
        return false;
    }
    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
    const { overflow, overflowX, overflowY, display } = getComputedStyle(element);
    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== 'inline' && display !== 'contents';
}
function isTableElement(element) {
    return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
    try {
        if (element.matches(':popover-open')) {
            return true;
        }
    } catch (_e) {
    // no-op
    }
    try {
        return element.matches(':modal');
    } catch (_e) {
        return false;
    }
}
const willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
const containRe = /paint|layout|strict|content/;
const isNotNone = (value)=>!!value && value !== 'none';
let isWebKitValue;
function isContainingBlock(elementOrCss) {
    const css = isElement(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
    // https://drafts.csswg.org/css-transforms-2/#individual-transforms
    return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || '') || containRe.test(css.contain || '');
}
function getContainingBlock(element) {
    let currentNode = getParentNode(element);
    while(isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)){
        if (isContainingBlock(currentNode)) {
            return currentNode;
        } else if (isTopLayer(currentNode)) {
            return null;
        }
        currentNode = getParentNode(currentNode);
    }
    return null;
}
function isWebKit() {
    if (isWebKitValue == null) {
        isWebKitValue = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('-webkit-backdrop-filter', 'none');
    }
    return isWebKitValue;
}
function isLastTraversableNode(node) {
    return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle(element) {
    return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
    if (isElement(element)) {
        return {
            scrollLeft: element.scrollLeft,
            scrollTop: element.scrollTop
        };
    }
    return {
        scrollLeft: element.scrollX,
        scrollTop: element.scrollY
    };
}
function getParentNode(node) {
    if (getNodeName(node) === 'html') {
        return node;
    }
    const result = // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node);
    return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
    const parentNode = getParentNode(node);
    if (isLastTraversableNode(parentNode)) {
        return (node.ownerDocument || node).body;
    }
    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
        return parentNode;
    }
    return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
    var _node$ownerDocument2;
    if (list === void 0) {
        list = [];
    }
    if (traverseIframes === void 0) {
        traverseIframes = true;
    }
    const scrollableAncestor = getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
    const win = getWindow(scrollableAncestor);
    if (isBody) {
        const frameElement = getFrameElement(win);
        return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
    } else {
        return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
    }
}
function getFrameElement(win) {
    return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
;
}),
"[project]/app/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript) <export getWindow as ownerWindow>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ownerWindow",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWindow"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript)");
}),
"[project]/app/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "alignments",
    ()=>alignments,
    "clamp",
    ()=>clamp,
    "createCoords",
    ()=>createCoords,
    "evaluate",
    ()=>evaluate,
    "expandPaddingObject",
    ()=>expandPaddingObject,
    "floor",
    ()=>floor,
    "getAlignment",
    ()=>getAlignment,
    "getAlignmentAxis",
    ()=>getAlignmentAxis,
    "getAlignmentSides",
    ()=>getAlignmentSides,
    "getAxisLength",
    ()=>getAxisLength,
    "getExpandedPlacements",
    ()=>getExpandedPlacements,
    "getOppositeAlignmentPlacement",
    ()=>getOppositeAlignmentPlacement,
    "getOppositeAxis",
    ()=>getOppositeAxis,
    "getOppositeAxisPlacements",
    ()=>getOppositeAxisPlacements,
    "getOppositePlacement",
    ()=>getOppositePlacement,
    "getPaddingObject",
    ()=>getPaddingObject,
    "getSide",
    ()=>getSide,
    "getSideAxis",
    ()=>getSideAxis,
    "max",
    ()=>max,
    "min",
    ()=>min,
    "placements",
    ()=>placements,
    "rectToClientRect",
    ()=>rectToClientRect,
    "round",
    ()=>round,
    "sides",
    ()=>sides
]);
/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */ const sides = [
    'top',
    'right',
    'bottom',
    'left'
];
const alignments = [
    'start',
    'end'
];
const placements = /*#__PURE__*/ sides.reduce((acc, side)=>acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v)=>({
        x: v,
        y: v
    });
const oppositeSideMap = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
};
function clamp(start, value, end) {
    return max(start, min(value, end));
}
function evaluate(value, param) {
    return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
    return placement.split('-')[0];
}
function getAlignment(placement) {
    return placement.split('-')[1];
}
function getOppositeAxis(axis) {
    return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
    return axis === 'y' ? 'height' : 'width';
}
function getSideAxis(placement) {
    const firstChar = placement[0];
    return firstChar === 't' || firstChar === 'b' ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
    return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
    if (rtl === void 0) {
        rtl = false;
    }
    const alignment = getAlignment(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const length = getAxisLength(alignmentAxis);
    let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
    if (rects.reference[length] > rects.floating[length]) {
        mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
    }
    return [
        mainAlignmentSide,
        getOppositePlacement(mainAlignmentSide)
    ];
}
function getExpandedPlacements(placement) {
    const oppositePlacement = getOppositePlacement(placement);
    return [
        getOppositeAlignmentPlacement(placement),
        oppositePlacement,
        getOppositeAlignmentPlacement(oppositePlacement)
    ];
}
function getOppositeAlignmentPlacement(placement) {
    return placement.includes('start') ? placement.replace('start', 'end') : placement.replace('end', 'start');
}
const lrPlacement = [
    'left',
    'right'
];
const rlPlacement = [
    'right',
    'left'
];
const tbPlacement = [
    'top',
    'bottom'
];
const btPlacement = [
    'bottom',
    'top'
];
function getSideList(side, isStart, rtl) {
    switch(side){
        case 'top':
        case 'bottom':
            if (rtl) return isStart ? rlPlacement : lrPlacement;
            return isStart ? lrPlacement : rlPlacement;
        case 'left':
        case 'right':
            return isStart ? tbPlacement : btPlacement;
        default:
            return [];
    }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
    const alignment = getAlignment(placement);
    let list = getSideList(getSide(placement), direction === 'start', rtl);
    if (alignment) {
        list = list.map((side)=>side + "-" + alignment);
        if (flipAlignment) {
            list = list.concat(list.map(getOppositeAlignmentPlacement));
        }
    }
    return list;
}
function getOppositePlacement(placement) {
    const side = getSide(placement);
    return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
    var _padding$top, _padding$right, _padding$bottom, _padding$left;
    return {
        top: (_padding$top = padding.top) != null ? _padding$top : 0,
        right: (_padding$right = padding.right) != null ? _padding$right : 0,
        bottom: (_padding$bottom = padding.bottom) != null ? _padding$bottom : 0,
        left: (_padding$left = padding.left) != null ? _padding$left : 0
    };
}
function getPaddingObject(padding) {
    return typeof padding !== 'number' ? expandPaddingObject(padding) : {
        top: padding,
        right: padding,
        bottom: padding,
        left: padding
    };
}
function rectToClientRect(rect) {
    const { x, y, width, height } = rect;
    return {
        width,
        height,
        top: y,
        left: x,
        right: x + width,
        bottom: y + height,
        x,
        y
    };
}
;
}),
"[project]/app/node_modules/@formatjs/fast-memoize/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "memoize",
    ()=>memoize,
    "strategies",
    ()=>strategies
]);
//#region packages/fast-memoize/index.ts
function memoize(fn, options) {
    const cache = options && options.cache ? options.cache : cacheDefault;
    const serializer = options && options.serializer ? options.serializer : serializerDefault;
    return (options && options.strategy ? options.strategy : strategyDefault)(fn, {
        cache,
        serializer
    });
}
function isPrimitive(value) {
    return value == null || typeof value === "number" || typeof value === "boolean";
}
function monadic(fn, cache, serializer, arg) {
    const cacheKey = isPrimitive(arg) ? arg : serializer(arg);
    let computedValue = cache.get(cacheKey);
    if (typeof computedValue === "undefined") {
        computedValue = fn.call(this, arg);
        cache.set(cacheKey, computedValue);
    }
    return computedValue;
}
function variadic(fn, cache, serializer) {
    const args = Array.prototype.slice.call(arguments, 3);
    const cacheKey = serializer(args);
    let computedValue = cache.get(cacheKey);
    if (typeof computedValue === "undefined") {
        computedValue = fn.apply(this, args);
        cache.set(cacheKey, computedValue);
    }
    return computedValue;
}
function assemble(fn, context, strategy, cache, serialize) {
    return strategy.bind(context, fn, cache, serialize);
}
function strategyDefault(fn, options) {
    const strategy = fn.length === 1 ? monadic : variadic;
    return assemble(fn, this, strategy, options.cache.create(), options.serializer);
}
function strategyVariadic(fn, options) {
    return assemble(fn, this, variadic, options.cache.create(), options.serializer);
}
function strategyMonadic(fn, options) {
    return assemble(fn, this, monadic, options.cache.create(), options.serializer);
}
const serializerDefault = function() {
    return JSON.stringify(arguments);
};
var ObjectWithoutPrototypeCache = class {
    constructor(){
        this.cache = Object.create(null);
    }
    get(key) {
        return this.cache[key];
    }
    set(key, value) {
        this.cache[key] = value;
    }
};
const cacheDefault = {
    create: function create() {
        return new ObjectWithoutPrototypeCache();
    }
};
const strategies = {
    variadic: strategyVariadic,
    monadic: strategyMonadic
};
;
}),
"[project]/app/node_modules/@formatjs/icu-messageformat-parser/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SKELETON_TYPE",
    ()=>SKELETON_TYPE,
    "TYPE",
    ()=>TYPE,
    "_Parser",
    ()=>_Parser,
    "createLiteralElement",
    ()=>createLiteralElement,
    "createNumberElement",
    ()=>createNumberElement,
    "isArgumentElement",
    ()=>isArgumentElement,
    "isDateElement",
    ()=>isDateElement,
    "isDateTimeSkeleton",
    ()=>isDateTimeSkeleton,
    "isLiteralElement",
    ()=>isLiteralElement,
    "isNumberElement",
    ()=>isNumberElement,
    "isNumberSkeleton",
    ()=>isNumberSkeleton,
    "isPluralElement",
    ()=>isPluralElement,
    "isPoundElement",
    ()=>isPoundElement,
    "isSelectElement",
    ()=>isSelectElement,
    "isStructurallySame",
    ()=>isStructurallySame,
    "isTagElement",
    ()=>isTagElement,
    "isTimeElement",
    ()=>isTimeElement,
    "parse",
    ()=>parse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$skeleton$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@formatjs/icu-skeleton-parser/index.js [app-client] (ecmascript)");
;
//#region packages/icu-messageformat-parser/error.ts
let ErrorKind = /* @__PURE__ */ function(ErrorKind) {
    /** Argument is unclosed (e.g. `{0`) */ ErrorKind[ErrorKind["EXPECT_ARGUMENT_CLOSING_BRACE"] = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE";
    /** Argument is empty (e.g. `{}`). */ ErrorKind[ErrorKind["EMPTY_ARGUMENT"] = 2] = "EMPTY_ARGUMENT";
    /** Argument is malformed (e.g. `{foo!}``) */ ErrorKind[ErrorKind["MALFORMED_ARGUMENT"] = 3] = "MALFORMED_ARGUMENT";
    /** Expect an argument type (e.g. `{foo,}`) */ ErrorKind[ErrorKind["EXPECT_ARGUMENT_TYPE"] = 4] = "EXPECT_ARGUMENT_TYPE";
    /** Unsupported argument type (e.g. `{foo,foo}`) */ ErrorKind[ErrorKind["INVALID_ARGUMENT_TYPE"] = 5] = "INVALID_ARGUMENT_TYPE";
    /** Expect an argument style (e.g. `{foo, number, }`) */ ErrorKind[ErrorKind["EXPECT_ARGUMENT_STYLE"] = 6] = "EXPECT_ARGUMENT_STYLE";
    /** The number skeleton is invalid. */ ErrorKind[ErrorKind["INVALID_NUMBER_SKELETON"] = 7] = "INVALID_NUMBER_SKELETON";
    /** The date time skeleton is invalid. */ ErrorKind[ErrorKind["INVALID_DATE_TIME_SKELETON"] = 8] = "INVALID_DATE_TIME_SKELETON";
    /** Exepct a number skeleton following the `::` (e.g. `{foo, number, ::}`) */ ErrorKind[ErrorKind["EXPECT_NUMBER_SKELETON"] = 9] = "EXPECT_NUMBER_SKELETON";
    /** Exepct a date time skeleton following the `::` (e.g. `{foo, date, ::}`) */ ErrorKind[ErrorKind["EXPECT_DATE_TIME_SKELETON"] = 10] = "EXPECT_DATE_TIME_SKELETON";
    /** Unmatched apostrophes in the argument style (e.g. `{foo, number, 'test`) */ ErrorKind[ErrorKind["UNCLOSED_QUOTE_IN_ARGUMENT_STYLE"] = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE";
    /** Missing select argument options (e.g. `{foo, select}`) */ ErrorKind[ErrorKind["EXPECT_SELECT_ARGUMENT_OPTIONS"] = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS";
    /** Expecting an offset value in `plural` or `selectordinal` argument (e.g `{foo, plural, offset}`) */ ErrorKind[ErrorKind["EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE"] = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE";
    /** Offset value in `plural` or `selectordinal` is invalid (e.g. `{foo, plural, offset: x}`) */ ErrorKind[ErrorKind["INVALID_PLURAL_ARGUMENT_OFFSET_VALUE"] = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE";
    /** Expecting a selector in `select` argument (e.g `{foo, select}`) */ ErrorKind[ErrorKind["EXPECT_SELECT_ARGUMENT_SELECTOR"] = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR";
    /** Expecting a selector in `plural` or `selectordinal` argument (e.g `{foo, plural}`) */ ErrorKind[ErrorKind["EXPECT_PLURAL_ARGUMENT_SELECTOR"] = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR";
    /** Expecting a message fragment after the `select` selector (e.g. `{foo, select, apple}`) */ ErrorKind[ErrorKind["EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT"] = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT";
    /**
	* Expecting a message fragment after the `plural` or `selectordinal` selector
	* (e.g. `{foo, plural, one}`)
	*/ ErrorKind[ErrorKind["EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT"] = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT";
    /** Selector in `plural` or `selectordinal` is malformed (e.g. `{foo, plural, =x {#}}`) */ ErrorKind[ErrorKind["INVALID_PLURAL_ARGUMENT_SELECTOR"] = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR";
    /**
	* Duplicate selectors in `plural` or `selectordinal` argument.
	* (e.g. {foo, plural, one {#} one {#}})
	*/ ErrorKind[ErrorKind["DUPLICATE_PLURAL_ARGUMENT_SELECTOR"] = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR";
    /** Duplicate selectors in `select` argument.
	* (e.g. {foo, select, apple {apple} apple {apple}})
	*/ ErrorKind[ErrorKind["DUPLICATE_SELECT_ARGUMENT_SELECTOR"] = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR";
    /** Plural or select argument option must have `other` clause. */ ErrorKind[ErrorKind["MISSING_OTHER_CLAUSE"] = 22] = "MISSING_OTHER_CLAUSE";
    /** The tag is malformed. (e.g. `<bold!>foo</bold!>) */ ErrorKind[ErrorKind["INVALID_TAG"] = 23] = "INVALID_TAG";
    /** The tag name is invalid. (e.g. `<123>foo</123>`) */ ErrorKind[ErrorKind["INVALID_TAG_NAME"] = 25] = "INVALID_TAG_NAME";
    /** The closing tag does not match the opening tag. (e.g. `<bold>foo</italic>`) */ ErrorKind[ErrorKind["UNMATCHED_CLOSING_TAG"] = 26] = "UNMATCHED_CLOSING_TAG";
    /** The opening tag has unmatched closing tag. (e.g. `<bold>foo`) */ ErrorKind[ErrorKind["UNCLOSED_TAG"] = 27] = "UNCLOSED_TAG";
    return ErrorKind;
}({});
//#endregion
//#region packages/icu-messageformat-parser/types.ts
let TYPE = /* @__PURE__ */ function(TYPE) {
    /**
	* Raw text
	*/ TYPE[TYPE["literal"] = 0] = "literal";
    /**
	* Variable w/o any format, e.g `var` in `this is a {var}`
	*/ TYPE[TYPE["argument"] = 1] = "argument";
    /**
	* Variable w/ number format
	*/ TYPE[TYPE["number"] = 2] = "number";
    /**
	* Variable w/ date format
	*/ TYPE[TYPE["date"] = 3] = "date";
    /**
	* Variable w/ time format
	*/ TYPE[TYPE["time"] = 4] = "time";
    /**
	* Variable w/ select format
	*/ TYPE[TYPE["select"] = 5] = "select";
    /**
	* Variable w/ plural format
	*/ TYPE[TYPE["plural"] = 6] = "plural";
    /**
	* Only possible within plural argument.
	* This is the `#` symbol that will be substituted with the count.
	*/ TYPE[TYPE["pound"] = 7] = "pound";
    /**
	* XML-like tag
	*/ TYPE[TYPE["tag"] = 8] = "tag";
    return TYPE;
}({});
let SKELETON_TYPE = /* @__PURE__ */ function(SKELETON_TYPE) {
    SKELETON_TYPE[SKELETON_TYPE["number"] = 0] = "number";
    SKELETON_TYPE[SKELETON_TYPE["dateTime"] = 1] = "dateTime";
    return SKELETON_TYPE;
}({});
/**
* Type Guards
*/ function isLiteralElement(el) {
    return el.type === 0;
}
function isArgumentElement(el) {
    return el.type === 1;
}
function isNumberElement(el) {
    return el.type === 2;
}
function isDateElement(el) {
    return el.type === 3;
}
function isTimeElement(el) {
    return el.type === 4;
}
function isSelectElement(el) {
    return el.type === 5;
}
function isPluralElement(el) {
    return el.type === 6;
}
function isPoundElement(el) {
    return el.type === 7;
}
function isTagElement(el) {
    return el.type === 8;
}
function isNumberSkeleton(el) {
    return !!(el && typeof el === "object" && el.type === 0);
}
function isDateTimeSkeleton(el) {
    return !!(el && typeof el === "object" && el.type === 1);
}
function createLiteralElement(value) {
    return {
        type: 0,
        value
    };
}
function createNumberElement(value, style) {
    return {
        type: 2,
        value,
        style
    };
}
//#endregion
//#region node_modules/.aspect_rules_js/@formatjs_generated+unicode@0.0.0/node_modules/@formatjs_generated/unicode/icu-messageformat-parser-regex.js
const SPACE_SEPARATOR_REGEX = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;
//#endregion
//#region node_modules/.aspect_rules_js/@formatjs_generated+cldr.core@0.0.0/node_modules/@formatjs_generated/cldr.core/time-data.js
const timeData = {
    "001": [
        "H",
        "h"
    ],
    "419": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "AC": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "AD": [
        "H",
        "hB"
    ],
    "AE": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "AF": [
        "H",
        "hb",
        "hB",
        "h"
    ],
    "AG": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "AI": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "AL": [
        "h",
        "H",
        "hB"
    ],
    "AM": [
        "H",
        "hB"
    ],
    "AO": [
        "H",
        "hB"
    ],
    "AR": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "AS": [
        "h",
        "H"
    ],
    "AT": [
        "H",
        "hB"
    ],
    "AU": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "AW": [
        "H",
        "hB"
    ],
    "AX": [
        "H"
    ],
    "AZ": [
        "H",
        "hB",
        "h"
    ],
    "BA": [
        "H",
        "hB",
        "h"
    ],
    "BB": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "BD": [
        "h",
        "hB",
        "H"
    ],
    "BE": [
        "H",
        "hB"
    ],
    "BF": [
        "H",
        "hB"
    ],
    "BG": [
        "H",
        "hB",
        "h"
    ],
    "BH": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "BI": [
        "H",
        "h"
    ],
    "BJ": [
        "H",
        "hB"
    ],
    "BL": [
        "H",
        "hB"
    ],
    "BM": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "BN": [
        "hb",
        "hB",
        "h",
        "H"
    ],
    "BO": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "BQ": [
        "H"
    ],
    "BR": [
        "H",
        "hB"
    ],
    "BS": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "BT": [
        "h",
        "H"
    ],
    "BW": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "BY": [
        "H",
        "h"
    ],
    "BZ": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "CA": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "CC": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "CD": [
        "hB",
        "H"
    ],
    "CF": [
        "H",
        "h",
        "hB"
    ],
    "CG": [
        "H",
        "hB"
    ],
    "CH": [
        "H",
        "hB",
        "h"
    ],
    "CI": [
        "H",
        "hB"
    ],
    "CK": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "CL": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "CM": [
        "H",
        "h",
        "hB"
    ],
    "CN": [
        "H",
        "hB",
        "hb",
        "h"
    ],
    "CO": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "CP": [
        "H"
    ],
    "CR": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "CU": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "CV": [
        "H",
        "hB"
    ],
    "CW": [
        "H",
        "hB"
    ],
    "CX": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "CY": [
        "h",
        "H",
        "hb",
        "hB"
    ],
    "CZ": [
        "H"
    ],
    "DE": [
        "H",
        "hB"
    ],
    "DG": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "DJ": [
        "h",
        "H"
    ],
    "DK": [
        "H"
    ],
    "DM": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "DO": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "DZ": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "EA": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "EC": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "EE": [
        "H",
        "hB"
    ],
    "EG": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "EH": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "ER": [
        "h",
        "H"
    ],
    "ES": [
        "H",
        "hB",
        "h",
        "hb"
    ],
    "ET": [
        "hB",
        "hb",
        "h",
        "H"
    ],
    "FI": [
        "H"
    ],
    "FJ": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "FK": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "FM": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "FO": [
        "H",
        "h"
    ],
    "FR": [
        "H",
        "hB"
    ],
    "GA": [
        "H",
        "hB"
    ],
    "GB": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "GD": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "GE": [
        "H",
        "hB",
        "h"
    ],
    "GF": [
        "H",
        "hB"
    ],
    "GG": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "GH": [
        "h",
        "H"
    ],
    "GI": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "GL": [
        "H",
        "h"
    ],
    "GM": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "GN": [
        "H",
        "hB"
    ],
    "GP": [
        "H",
        "hB"
    ],
    "GQ": [
        "H",
        "hB",
        "h",
        "hb"
    ],
    "GR": [
        "h",
        "H",
        "hb",
        "hB"
    ],
    "GS": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "GT": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "GU": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "GW": [
        "H",
        "hB"
    ],
    "GY": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "HK": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "HN": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "HR": [
        "H",
        "hB"
    ],
    "HU": [
        "H",
        "h"
    ],
    "IC": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "ID": [
        "H"
    ],
    "IE": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "IL": [
        "H",
        "hB"
    ],
    "IM": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "IN": [
        "h",
        "H"
    ],
    "IO": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "IQ": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "IR": [
        "hB",
        "H"
    ],
    "IS": [
        "H"
    ],
    "IT": [
        "H",
        "hB"
    ],
    "JE": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "JM": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "JO": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "JP": [
        "H",
        "K",
        "h"
    ],
    "KE": [
        "hB",
        "hb",
        "H",
        "h"
    ],
    "KG": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "KH": [
        "hB",
        "h",
        "H",
        "hb"
    ],
    "KI": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "KM": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "KN": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "KP": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "KR": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "KW": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "KY": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "KZ": [
        "H",
        "hB"
    ],
    "LA": [
        "H",
        "hb",
        "hB",
        "h"
    ],
    "LB": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "LC": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "LI": [
        "H",
        "hB",
        "h"
    ],
    "LK": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "LR": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "LS": [
        "h",
        "H"
    ],
    "LT": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "LU": [
        "H",
        "h",
        "hB"
    ],
    "LV": [
        "H",
        "hB",
        "hb",
        "h"
    ],
    "LY": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "MA": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "MC": [
        "H",
        "hB"
    ],
    "MD": [
        "H",
        "hB"
    ],
    "ME": [
        "H",
        "hB",
        "h"
    ],
    "MF": [
        "H",
        "hB"
    ],
    "MG": [
        "H",
        "h"
    ],
    "MH": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "MK": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "ML": [
        "H"
    ],
    "MM": [
        "hB",
        "hb",
        "H",
        "h"
    ],
    "MN": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "MO": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "MP": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "MQ": [
        "H",
        "hB"
    ],
    "MR": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "MS": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "MT": [
        "H",
        "h"
    ],
    "MU": [
        "H",
        "h"
    ],
    "MV": [
        "H",
        "h"
    ],
    "MW": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "MX": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "MY": [
        "hb",
        "hB",
        "h",
        "H"
    ],
    "MZ": [
        "H",
        "hB"
    ],
    "NA": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "NC": [
        "H",
        "hB"
    ],
    "NE": [
        "H"
    ],
    "NF": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "NG": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "NI": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "NL": [
        "H",
        "hB"
    ],
    "NO": [
        "H",
        "h"
    ],
    "NP": [
        "H",
        "h",
        "hB"
    ],
    "NR": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "NU": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "NZ": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "OM": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "PA": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "PE": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "PF": [
        "H",
        "h",
        "hB"
    ],
    "PG": [
        "h",
        "H"
    ],
    "PH": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "PK": [
        "h",
        "hB",
        "H"
    ],
    "PL": [
        "H",
        "h"
    ],
    "PM": [
        "H",
        "hB"
    ],
    "PN": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "PR": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "PS": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "PT": [
        "H",
        "hB"
    ],
    "PW": [
        "h",
        "H"
    ],
    "PY": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "QA": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "RE": [
        "H",
        "hB"
    ],
    "RO": [
        "H",
        "hB"
    ],
    "RS": [
        "H",
        "hB",
        "h"
    ],
    "RU": [
        "H"
    ],
    "RW": [
        "H",
        "h"
    ],
    "SA": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "SB": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "SC": [
        "H",
        "h",
        "hB"
    ],
    "SD": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "SE": [
        "H"
    ],
    "SG": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "SH": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "SI": [
        "H",
        "hB"
    ],
    "SJ": [
        "H"
    ],
    "SK": [
        "H"
    ],
    "SL": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "SM": [
        "H",
        "h",
        "hB"
    ],
    "SN": [
        "H",
        "h",
        "hB"
    ],
    "SO": [
        "h",
        "H"
    ],
    "SR": [
        "H",
        "hB"
    ],
    "SS": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "ST": [
        "H",
        "hB"
    ],
    "SV": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "SX": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "SY": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "SZ": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "TA": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "TC": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "TD": [
        "h",
        "H",
        "hB"
    ],
    "TF": [
        "H",
        "h",
        "hB"
    ],
    "TG": [
        "H",
        "hB"
    ],
    "TH": [
        "H",
        "h"
    ],
    "TJ": [
        "H",
        "h"
    ],
    "TL": [
        "H",
        "hB",
        "hb",
        "h"
    ],
    "TM": [
        "H",
        "h"
    ],
    "TN": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "TO": [
        "h",
        "H"
    ],
    "TR": [
        "H",
        "hB"
    ],
    "TT": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "TW": [
        "hB",
        "hb",
        "h",
        "H"
    ],
    "TZ": [
        "hB",
        "hb",
        "H",
        "h"
    ],
    "UA": [
        "H",
        "hB",
        "h"
    ],
    "UG": [
        "hB",
        "hb",
        "H",
        "h"
    ],
    "UM": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "US": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "UY": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "UZ": [
        "H",
        "hB",
        "h"
    ],
    "VA": [
        "H",
        "h",
        "hB"
    ],
    "VC": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "VE": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "VG": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "VI": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "VN": [
        "H",
        "h"
    ],
    "VU": [
        "h",
        "H"
    ],
    "WF": [
        "H",
        "hB"
    ],
    "WS": [
        "h",
        "H"
    ],
    "XK": [
        "H",
        "hB",
        "h"
    ],
    "YE": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "YT": [
        "H",
        "hB"
    ],
    "ZA": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "ZM": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "ZW": [
        "H",
        "h"
    ],
    "af-ZA": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "ar-001": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "ca-ES": [
        "H",
        "h",
        "hB"
    ],
    "en-001": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "en-HK": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "en-IL": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "en-MY": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "es-BR": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "es-ES": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "es-GQ": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "fr-CA": [
        "H",
        "h",
        "hB"
    ],
    "gl-ES": [
        "H",
        "h",
        "hB"
    ],
    "gu-IN": [
        "hB",
        "hb",
        "h",
        "H"
    ],
    "hi-IN": [
        "hB",
        "h",
        "H"
    ],
    "it-CH": [
        "H",
        "h",
        "hB"
    ],
    "it-IT": [
        "H",
        "h",
        "hB"
    ],
    "kn-IN": [
        "hB",
        "h",
        "H"
    ],
    "ku-SY": [
        "H",
        "hB"
    ],
    "ml-IN": [
        "hB",
        "h",
        "H"
    ],
    "mr-IN": [
        "hB",
        "hb",
        "h",
        "H"
    ],
    "pa-IN": [
        "hB",
        "hb",
        "h",
        "H"
    ],
    "ta-IN": [
        "hB",
        "h",
        "hb",
        "H"
    ],
    "te-IN": [
        "hB",
        "h",
        "H"
    ],
    "zu-ZA": [
        "H",
        "hB",
        "hb",
        "h"
    ]
};
//#endregion
//#region packages/icu-messageformat-parser/date-time-pattern-generator.ts
/**
* Returns the best matching date time pattern if a date time skeleton
* pattern is provided with a locale. Follows the Unicode specification:
* https://www.unicode.org/reports/tr35/tr35-dates.html#table-mapping-requested-time-skeletons-to-patterns
* @param skeleton date time skeleton pattern that possibly includes j, J or C
* @param locale
*/ function getBestPattern(skeleton, locale) {
    let skeletonCopy = "";
    for(let patternPos = 0; patternPos < skeleton.length; patternPos++){
        const patternChar = skeleton.charAt(patternPos);
        if (patternChar === "j") {
            let extraLength = 0;
            while(patternPos + 1 < skeleton.length && skeleton.charAt(patternPos + 1) === patternChar){
                extraLength++;
                patternPos++;
            }
            let hourLen = 1 + (extraLength & 1);
            let dayPeriodLen = extraLength < 2 ? 1 : 3 + (extraLength >> 1);
            let dayPeriodChar = "a";
            let hourChar = getDefaultHourSymbolFromLocale(locale);
            if (hourChar == "H" || hourChar == "k") dayPeriodLen = 0;
            while(dayPeriodLen-- > 0)skeletonCopy += dayPeriodChar;
            while(hourLen-- > 0)skeletonCopy = hourChar + skeletonCopy;
        } else if (patternChar === "J") skeletonCopy += "H";
        else skeletonCopy += patternChar;
    }
    return skeletonCopy;
}
/**
* Maps the [hour cycle type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/hourCycle)
* of the given `locale` to the corresponding time pattern.
* @param locale
*/ function getDefaultHourSymbolFromLocale(locale) {
    let hourCycle = locale.hourCycle;
    if (hourCycle === void 0) {
        const localeWithHourCycles = locale;
        hourCycle = localeWithHourCycles.getHourCycles?.()[0] ?? localeWithHourCycles.hourCycles?.[0];
    }
    if (hourCycle) switch(hourCycle){
        case "h24":
            return "k";
        case "h23":
            return "H";
        case "h12":
            return "h";
        case "h11":
            return "K";
        default:
            throw new Error("Invalid hourCycle");
    }
    const languageTag = locale.language;
    let regionTag;
    if (languageTag !== "root") regionTag = locale.maximize().region;
    return (timeData[`${languageTag}-${regionTag}`] || timeData[regionTag || ""] || timeData[languageTag || ""] || timeData[`${languageTag}-001`] || timeData["001"])[0].charAt(0);
}
//#endregion
//#region packages/icu-messageformat-parser/parser.ts
const SPACE_SEPARATOR_START_REGEX = new RegExp(`^${SPACE_SEPARATOR_REGEX.source}*`);
const SPACE_SEPARATOR_END_REGEX = new RegExp(`${SPACE_SEPARATOR_REGEX.source}*$`);
function createLocation(start, end) {
    return {
        start,
        end
    };
}
const hasNativeFromEntries = !!Object.fromEntries;
const hasTrimStart = !!String.prototype.trimStart;
const hasTrimEnd = !!String.prototype.trimEnd;
const fromEntries = hasNativeFromEntries ? Object.fromEntries : function fromEntries(entries) {
    const obj = {};
    for (const [k, v] of entries)obj[k] = v;
    return obj;
};
const trimStart = hasTrimStart ? function trimStart(s) {
    return s.trimStart();
} : function trimStart(s) {
    return s.replace(SPACE_SEPARATOR_START_REGEX, "");
};
const trimEnd = hasTrimEnd ? function trimEnd(s) {
    return s.trimEnd();
} : function trimEnd(s) {
    return s.replace(SPACE_SEPARATOR_END_REGEX, "");
};
const IDENTIFIER_PREFIX_RE = new RegExp("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
function matchIdentifierAtIndex(s, index) {
    IDENTIFIER_PREFIX_RE.lastIndex = index;
    return IDENTIFIER_PREFIX_RE.exec(s)[1] ?? "";
}
function plainTopLevelEndPosition(message) {
    if (message.length === 0) return null;
    let line = 1;
    let column = 1;
    for(let offset = 0; offset < message.length;){
        const code = message.charCodeAt(offset);
        switch(code){
            case 35:
            case 39:
            case 60:
            case 123:
            case 125:
                return null;
        }
        if (code === 10) {
            line++;
            column = 1;
            offset++;
        } else {
            column++;
            if (code >= 55296 && code <= 56319 && offset + 1 < message.length) {
                const next = message.charCodeAt(offset + 1);
                offset += next >= 56320 && next <= 57343 ? 2 : 1;
            } else offset++;
        }
    }
    return {
        offset: message.length,
        line,
        column
    };
}
var Parser = class {
    constructor(message, options = {}){
        this.message = message;
        this.position = {
            offset: 0,
            line: 1,
            column: 1
        };
        this.ignoreTag = !!options.ignoreTag;
        this.locale = options.locale;
        this.requiresOtherClause = !!options.requiresOtherClause;
        this.shouldParseSkeletons = !!options.shouldParseSkeletons;
    }
    parse() {
        if (this.offset() !== 0) throw Error("parser can only be used once");
        if (this.message.length > 0) {
            const firstCode = this.message.charCodeAt(0);
            if (firstCode !== 35 && firstCode !== 39 && firstCode !== 60 && firstCode !== 123 && firstCode !== 125) {
                const plainEndPosition = plainTopLevelEndPosition(this.message);
                if (plainEndPosition) {
                    const start = this.clonePosition();
                    this.position = plainEndPosition;
                    return {
                        val: [
                            {
                                type: 0,
                                value: this.message,
                                location: createLocation(start, this.clonePosition())
                            }
                        ],
                        err: null
                    };
                }
            }
        }
        return this.parseMessage(0, "", false);
    }
    parseMessage(nestingLevel, parentArgType, expectingCloseTag) {
        let elements = [];
        while(!this.isEOF()){
            const char = this.char();
            if (char === 123) {
                const result = this.parseArgument(nestingLevel, expectingCloseTag);
                if (result.err) return result;
                elements.push(result.val);
            } else if (char === 125 && nestingLevel > 0) break;
            else if (char === 35 && (parentArgType === "plural" || parentArgType === "selectordinal")) {
                const position = this.clonePosition();
                this.bump();
                elements.push({
                    type: 7,
                    location: createLocation(position, this.clonePosition())
                });
            } else if (char === 60 && !this.ignoreTag && this.peek() === 47) {
                if (expectingCloseTag) break;
                else return this.error(26, createLocation(this.clonePosition(), this.clonePosition()));
            } else if (char === 60 && !this.ignoreTag && _isAlpha(this.peek() || 0)) {
                const result = this.parseTag(nestingLevel, parentArgType);
                if (result.err) return result;
                elements.push(result.val);
            } else {
                const result = this.parseLiteral(nestingLevel, parentArgType);
                if (result.err) return result;
                elements.push(result.val);
            }
        }
        return {
            val: elements,
            err: null
        };
    }
    /**
	* A tag name must start with an ASCII lower/upper case letter. The grammar is based on the
	* [custom element name][] except that a dash is NOT always mandatory and uppercase letters
	* are accepted:
	*
	* ```
	* tag ::= "<" tagName (whitespace)* "/>" | "<" tagName (whitespace)* ">" message "</" tagName (whitespace)* ">"
	* tagName ::= [a-z] (PENChar)*
	* PENChar ::=
	*     "-" | "." | [0-9] | "_" | [a-z] | [A-Z] | #xB7 | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x37D] |
	*     [#x37F-#x1FFF] | [#x200C-#x200D] | [#x203F-#x2040] | [#x2070-#x218F] | [#x2C00-#x2FEF] |
	*     [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
	* ```
	*
	* [custom element name]: https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
	* NOTE: We're a bit more lax here since HTML technically does not allow uppercase HTML element but we do
	* since other tag-based engines like React allow it
	*/ parseTag(nestingLevel, parentArgType) {
        const startPosition = this.clonePosition();
        this.bump();
        const tagName = this.parseTagName();
        this.bumpSpace();
        if (this.bumpIf("/>")) return {
            val: {
                type: 0,
                value: `<${tagName}/>`,
                location: createLocation(startPosition, this.clonePosition())
            },
            err: null
        };
        else if (this.bumpIf(">")) {
            const childrenResult = this.parseMessage(nestingLevel + 1, parentArgType, true);
            if (childrenResult.err) return childrenResult;
            const children = childrenResult.val;
            const endTagStartPosition = this.clonePosition();
            if (this.bumpIf("</")) {
                if (this.isEOF() || !_isAlpha(this.char())) return this.error(23, createLocation(endTagStartPosition, this.clonePosition()));
                const closingTagNameStartPosition = this.clonePosition();
                if (tagName !== this.parseTagName()) return this.error(26, createLocation(closingTagNameStartPosition, this.clonePosition()));
                this.bumpSpace();
                if (!this.bumpIf(">")) return this.error(23, createLocation(endTagStartPosition, this.clonePosition()));
                return {
                    val: {
                        type: 8,
                        value: tagName,
                        children,
                        location: createLocation(startPosition, this.clonePosition())
                    },
                    err: null
                };
            } else return this.error(27, createLocation(startPosition, this.clonePosition()));
        } else return this.error(23, createLocation(startPosition, this.clonePosition()));
    }
    /**
	* This method assumes that the caller has peeked ahead for the first tag character.
	*/ parseTagName() {
        const startOffset = this.offset();
        this.bump();
        while(!this.isEOF() && _isPotentialElementNameChar(this.char()))this.bump();
        return this.message.slice(startOffset, this.offset());
    }
    parseLiteral(nestingLevel, parentArgType) {
        const start = this.clonePosition();
        let value = "";
        while(true){
            const parseQuoteResult = this.tryParseQuote(parentArgType);
            if (parseQuoteResult) {
                value += parseQuoteResult;
                continue;
            }
            const parseUnquotedResult = this.tryParseUnquoted(nestingLevel, parentArgType);
            if (parseUnquotedResult) {
                value += parseUnquotedResult;
                continue;
            }
            const parseLeftAngleResult = this.tryParseLeftAngleBracket();
            if (parseLeftAngleResult) {
                value += parseLeftAngleResult;
                continue;
            }
            break;
        }
        const location = createLocation(start, this.clonePosition());
        return {
            val: {
                type: 0,
                value,
                location
            },
            err: null
        };
    }
    tryParseLeftAngleBracket() {
        if (!this.isEOF() && this.char() === 60 && (this.ignoreTag || !_isAlphaOrSlash(this.peek() || 0))) {
            this.bump();
            return "<";
        }
        return null;
    }
    /**
	* Starting with ICU 4.8, an ASCII apostrophe only starts quoted text if it immediately precedes
	* a character that requires quoting (that is, "only where needed"), and works the same in
	* nested messages as on the top level of the pattern. The new behavior is otherwise compatible.
	*/ tryParseQuote(parentArgType) {
        if (this.isEOF() || this.char() !== 39) return null;
        switch(this.peek()){
            case 39:
                this.bump();
                this.bump();
                return "'";
            case 123:
            case 60:
            case 62:
            case 125:
                break;
            case 35:
                if (parentArgType === "plural" || parentArgType === "selectordinal") break;
                return null;
            default:
                return null;
        }
        this.bump();
        const codePoints = [
            this.char()
        ];
        this.bump();
        while(!this.isEOF()){
            const ch = this.char();
            if (ch === 39) {
                if (this.peek() === 39) {
                    codePoints.push(39);
                    this.bump();
                } else {
                    this.bump();
                    break;
                }
            } else codePoints.push(ch);
            this.bump();
        }
        return String.fromCodePoint(...codePoints);
    }
    tryParseUnquoted(nestingLevel, parentArgType) {
        if (this.isEOF()) return null;
        const ch = this.char();
        if (ch === 60 || ch === 123 || ch === 35 && (parentArgType === "plural" || parentArgType === "selectordinal") || ch === 125 && nestingLevel > 0) return null;
        else {
            this.bump();
            return String.fromCodePoint(ch);
        }
    }
    parseArgument(nestingLevel, expectingCloseTag) {
        const openingBracePosition = this.clonePosition();
        this.bump();
        this.bumpSpace();
        if (this.isEOF()) return this.error(1, createLocation(openingBracePosition, this.clonePosition()));
        if (this.char() === 125) {
            this.bump();
            return this.error(2, createLocation(openingBracePosition, this.clonePosition()));
        }
        let value = this.parseIdentifierIfPossible().value;
        if (!value) return this.error(3, createLocation(openingBracePosition, this.clonePosition()));
        this.bumpSpace();
        if (this.isEOF()) return this.error(1, createLocation(openingBracePosition, this.clonePosition()));
        switch(this.char()){
            case 125:
                this.bump();
                return {
                    val: {
                        type: 1,
                        value,
                        location: createLocation(openingBracePosition, this.clonePosition())
                    },
                    err: null
                };
            case 44:
                this.bump();
                this.bumpSpace();
                if (this.isEOF()) return this.error(1, createLocation(openingBracePosition, this.clonePosition()));
                return this.parseArgumentOptions(nestingLevel, expectingCloseTag, value, openingBracePosition);
            default:
                return this.error(3, createLocation(openingBracePosition, this.clonePosition()));
        }
    }
    /**
	* Advance the parser until the end of the identifier, if it is currently on
	* an identifier character. Return an empty string otherwise.
	*/ parseIdentifierIfPossible() {
        const startingPosition = this.clonePosition();
        const startOffset = this.offset();
        const value = matchIdentifierAtIndex(this.message, startOffset);
        const endOffset = startOffset + value.length;
        this.bumpTo(endOffset);
        return {
            value,
            location: createLocation(startingPosition, this.clonePosition())
        };
    }
    parseArgumentOptions(nestingLevel, expectingCloseTag, value, openingBracePosition) {
        let typeStartPosition = this.clonePosition();
        let argType = this.parseIdentifierIfPossible().value;
        let typeEndPosition = this.clonePosition();
        switch(argType){
            case "":
                return this.error(4, createLocation(typeStartPosition, typeEndPosition));
            case "number":
            case "date":
            case "time":
                {
                    this.bumpSpace();
                    let styleAndLocation = null;
                    if (this.bumpIf(",")) {
                        this.bumpSpace();
                        const styleStartPosition = this.clonePosition();
                        const result = this.parseSimpleArgStyleIfPossible();
                        if (result.err) return result;
                        const style = trimEnd(result.val);
                        if (style.length === 0) return this.error(6, createLocation(this.clonePosition(), this.clonePosition()));
                        styleAndLocation = {
                            style,
                            styleLocation: createLocation(styleStartPosition, this.clonePosition())
                        };
                    }
                    const argCloseResult = this.tryParseArgumentClose(openingBracePosition);
                    if (argCloseResult.err) return argCloseResult;
                    const location = createLocation(openingBracePosition, this.clonePosition());
                    if (styleAndLocation && styleAndLocation.style.startsWith("::")) {
                        let skeleton = trimStart(styleAndLocation.style.slice(2));
                        if (argType === "number") {
                            const result = this.parseNumberSkeletonFromString(skeleton, styleAndLocation.styleLocation);
                            if (result.err) return result;
                            return {
                                val: {
                                    type: 2,
                                    value,
                                    location,
                                    style: result.val
                                },
                                err: null
                            };
                        } else {
                            if (skeleton.length === 0) return this.error(10, location);
                            let dateTimePattern = skeleton;
                            if (this.locale) dateTimePattern = getBestPattern(skeleton, this.locale);
                            const style = {
                                type: 1,
                                pattern: dateTimePattern,
                                location: styleAndLocation.styleLocation,
                                parsedOptions: this.shouldParseSkeletons ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$skeleton$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseDateTimeSkeleton"])(dateTimePattern) : {}
                            };
                            return {
                                val: {
                                    type: argType === "date" ? 3 : 4,
                                    value,
                                    location,
                                    style
                                },
                                err: null
                            };
                        }
                    }
                    return {
                        val: {
                            type: argType === "number" ? 2 : argType === "date" ? 3 : 4,
                            value,
                            location,
                            style: styleAndLocation?.style ?? null
                        },
                        err: null
                    };
                }
            case "plural":
            case "selectordinal":
            case "select":
                {
                    const typeEndPosition = this.clonePosition();
                    this.bumpSpace();
                    if (!this.bumpIf(",")) return this.error(12, createLocation(typeEndPosition, {
                        ...typeEndPosition
                    }));
                    this.bumpSpace();
                    let identifierAndLocation = this.parseIdentifierIfPossible();
                    let pluralOffset = 0;
                    if (argType !== "select" && identifierAndLocation.value === "offset") {
                        if (!this.bumpIf(":")) return this.error(13, createLocation(this.clonePosition(), this.clonePosition()));
                        this.bumpSpace();
                        const result = this.tryParseDecimalInteger(13, 14);
                        if (result.err) return result;
                        this.bumpSpace();
                        identifierAndLocation = this.parseIdentifierIfPossible();
                        pluralOffset = result.val;
                    }
                    const optionsResult = this.tryParsePluralOrSelectOptions(nestingLevel, argType, expectingCloseTag, identifierAndLocation);
                    if (optionsResult.err) return optionsResult;
                    const argCloseResult = this.tryParseArgumentClose(openingBracePosition);
                    if (argCloseResult.err) return argCloseResult;
                    const location = createLocation(openingBracePosition, this.clonePosition());
                    if (argType === "select") return {
                        val: {
                            type: 5,
                            value,
                            options: fromEntries(optionsResult.val),
                            location
                        },
                        err: null
                    };
                    else return {
                        val: {
                            type: 6,
                            value,
                            options: fromEntries(optionsResult.val),
                            offset: pluralOffset,
                            pluralType: argType === "plural" ? "cardinal" : "ordinal",
                            location
                        },
                        err: null
                    };
                }
            default:
                return this.error(5, createLocation(typeStartPosition, typeEndPosition));
        }
    }
    tryParseArgumentClose(openingBracePosition) {
        if (this.isEOF() || this.char() !== 125) return this.error(1, createLocation(openingBracePosition, this.clonePosition()));
        this.bump();
        return {
            val: true,
            err: null
        };
    }
    /**
	* See: https://github.com/unicode-org/icu/blob/af7ed1f6d2298013dc303628438ec4abe1f16479/icu4c/source/common/messagepattern.cpp#L659
	*/ parseSimpleArgStyleIfPossible() {
        let nestedBraces = 0;
        const startPosition = this.clonePosition();
        while(!this.isEOF())switch(this.char()){
            case 39:
                {
                    this.bump();
                    let apostrophePosition = this.clonePosition();
                    if (!this.bumpUntil("'")) return this.error(11, createLocation(apostrophePosition, this.clonePosition()));
                    this.bump();
                    break;
                }
            case 123:
                nestedBraces += 1;
                this.bump();
                break;
            case 125:
                if (nestedBraces > 0) nestedBraces -= 1;
                else return {
                    val: this.message.slice(startPosition.offset, this.offset()),
                    err: null
                };
                break;
            default:
                this.bump();
        }
        return {
            val: this.message.slice(startPosition.offset, this.offset()),
            err: null
        };
    }
    parseNumberSkeletonFromString(skeleton, location) {
        let tokens = [];
        try {
            tokens = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$skeleton$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseNumberSkeletonFromString"])(skeleton);
        } catch  {
            return this.error(7, location);
        }
        return {
            val: {
                type: 0,
                tokens,
                location,
                parsedOptions: this.shouldParseSkeletons ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$skeleton$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseNumberSkeleton"])(tokens) : {}
            },
            err: null
        };
    }
    /**
	* @param nesting_level The current nesting level of messages.
	*     This can be positive when parsing message fragment in select or plural argument options.
	* @param parent_arg_type The parent argument's type.
	* @param parsed_first_identifier If provided, this is the first identifier-like selector of
	*     the argument. It is a by-product of a previous parsing attempt.
	* @param expecting_close_tag If true, this message is directly or indirectly nested inside
	*     between a pair of opening and closing tags. The nested message will not parse beyond
	*     the closing tag boundary.
	*/ tryParsePluralOrSelectOptions(nestingLevel, parentArgType, expectCloseTag, parsedFirstIdentifier) {
        let hasOtherClause = false;
        const options = [];
        const parsedSelectors = /* @__PURE__ */ new Set();
        let { value: selector, location: selectorLocation } = parsedFirstIdentifier;
        while(true){
            if (selector.length === 0) {
                const startPosition = this.clonePosition();
                if (parentArgType !== "select" && this.bumpIf("=")) {
                    const result = this.tryParseDecimalInteger(16, 19);
                    if (result.err) return result;
                    selectorLocation = createLocation(startPosition, this.clonePosition());
                    selector = this.message.slice(startPosition.offset, this.offset());
                } else break;
            }
            if (parsedSelectors.has(selector)) return this.error(parentArgType === "select" ? 21 : 20, selectorLocation);
            if (selector === "other") hasOtherClause = true;
            this.bumpSpace();
            const openingBracePosition = this.clonePosition();
            if (!this.bumpIf("{")) return this.error(parentArgType === "select" ? 17 : 18, createLocation(this.clonePosition(), this.clonePosition()));
            const fragmentResult = this.parseMessage(nestingLevel + 1, parentArgType, expectCloseTag);
            if (fragmentResult.err) return fragmentResult;
            const argCloseResult = this.tryParseArgumentClose(openingBracePosition);
            if (argCloseResult.err) return argCloseResult;
            options.push([
                selector,
                {
                    value: fragmentResult.val,
                    location: createLocation(openingBracePosition, this.clonePosition())
                }
            ]);
            parsedSelectors.add(selector);
            this.bumpSpace();
            ({ value: selector, location: selectorLocation } = this.parseIdentifierIfPossible());
        }
        if (options.length === 0) return this.error(parentArgType === "select" ? 15 : 16, createLocation(this.clonePosition(), this.clonePosition()));
        if (this.requiresOtherClause && !hasOtherClause) return this.error(22, createLocation(this.clonePosition(), this.clonePosition()));
        return {
            val: options,
            err: null
        };
    }
    tryParseDecimalInteger(expectNumberError, invalidNumberError) {
        let sign = 1;
        const startingPosition = this.clonePosition();
        if (this.bumpIf("+")) {} else if (this.bumpIf("-")) sign = -1;
        let hasDigits = false;
        let decimal = 0;
        while(!this.isEOF()){
            const ch = this.char();
            if (ch >= 48 && ch <= 57) {
                hasDigits = true;
                decimal = decimal * 10 + (ch - 48);
                this.bump();
            } else break;
        }
        const location = createLocation(startingPosition, this.clonePosition());
        if (!hasDigits) return this.error(expectNumberError, location);
        decimal *= sign;
        if (!Number.isSafeInteger(decimal)) return this.error(invalidNumberError, location);
        return {
            val: decimal,
            err: null
        };
    }
    offset() {
        return this.position.offset;
    }
    isEOF() {
        return this.offset() === this.message.length;
    }
    clonePosition() {
        return {
            offset: this.position.offset,
            line: this.position.line,
            column: this.position.column
        };
    }
    /**
	* Return the code point at the current position of the parser.
	* Throws if the index is out of bound.
	*/ char() {
        const offset = this.position.offset;
        if (offset >= this.message.length) throw Error("out of bound");
        const code = this.message.codePointAt(offset);
        if (code === void 0) throw Error(`Offset ${offset} is at invalid UTF-16 code unit boundary`);
        return code;
    }
    error(kind, location) {
        return {
            val: null,
            err: {
                kind,
                message: this.message,
                location
            }
        };
    }
    /** Bump the parser to the next UTF-16 code unit. */ bump() {
        if (this.isEOF()) return;
        const code = this.char();
        if (code === 10) {
            this.position.line += 1;
            this.position.column = 1;
            this.position.offset += 1;
        } else {
            this.position.column += 1;
            this.position.offset += code < 65536 ? 1 : 2;
        }
    }
    /**
	* If the substring starting at the current position of the parser has
	* the given prefix, then bump the parser to the character immediately
	* following the prefix and return true. Otherwise, don't bump the parser
	* and return false.
	*/ bumpIf(prefix) {
        if (this.message.startsWith(prefix, this.offset())) {
            for(let i = 0; i < prefix.length; i++)this.bump();
            return true;
        }
        return false;
    }
    /**
	* Bump the parser until the pattern character is found and return `true`.
	* Otherwise bump to the end of the file and return `false`.
	*/ bumpUntil(pattern) {
        const currentOffset = this.offset();
        const index = this.message.indexOf(pattern, currentOffset);
        if (index >= 0) {
            this.bumpTo(index);
            return true;
        } else {
            this.bumpTo(this.message.length);
            return false;
        }
    }
    /**
	* Bump the parser to the target offset.
	* If target offset is beyond the end of the input, bump the parser to the end of the input.
	*/ bumpTo(targetOffset) {
        if (this.offset() > targetOffset) throw Error(`targetOffset ${targetOffset} must be greater than or equal to the current offset ${this.offset()}`);
        targetOffset = Math.min(targetOffset, this.message.length);
        while(true){
            const offset = this.offset();
            if (offset === targetOffset) break;
            if (offset > targetOffset) throw Error(`targetOffset ${targetOffset} is at invalid UTF-16 code unit boundary`);
            this.bump();
            if (this.isEOF()) break;
        }
    }
    /** advance the parser through all whitespace to the next non-whitespace code unit. */ bumpSpace() {
        while(!this.isEOF() && _isWhiteSpace(this.char()))this.bump();
    }
    /**
	* Peek at the *next* Unicode codepoint in the input without advancing the parser.
	* If the input has been exhausted, then this returns null.
	*/ peek() {
        if (this.isEOF()) return null;
        const code = this.char();
        const offset = this.offset();
        return this.message.charCodeAt(offset + (code >= 65536 ? 2 : 1)) ?? null;
    }
};
/**
* This check if codepoint is alphabet (lower & uppercase)
* @param codepoint
* @returns
*/ function _isAlpha(codepoint) {
    return codepoint >= 97 && codepoint <= 122 || codepoint >= 65 && codepoint <= 90;
}
function _isAlphaOrSlash(codepoint) {
    return _isAlpha(codepoint) || codepoint === 47;
}
/** See `parseTag` function docs. */ function _isPotentialElementNameChar(c) {
    return c === 45 || c === 46 || c >= 48 && c <= 57 || c === 95 || c >= 97 && c <= 122 || c >= 65 && c <= 90 || c == 183 || c >= 192 && c <= 214 || c >= 216 && c <= 246 || c >= 248 && c <= 893 || c >= 895 && c <= 8191 || c >= 8204 && c <= 8205 || c >= 8255 && c <= 8256 || c >= 8304 && c <= 8591 || c >= 11264 && c <= 12271 || c >= 12289 && c <= 55295 || c >= 63744 && c <= 64975 || c >= 65008 && c <= 65533 || c >= 65536 && c <= 983039;
}
/**
* Code point equivalent of regex `\p{White_Space}`.
* From: https://www.unicode.org/Public/UCD/latest/ucd/PropList.txt
*/ function _isWhiteSpace(c) {
    return c >= 9 && c <= 13 || c === 32 || c === 133 || c >= 8206 && c <= 8207 || c === 8232 || c === 8233;
}
//#endregion
//#region packages/icu-messageformat-parser/manipulator.ts
/**
* Collect all variables in an AST to Record<string, TYPE>
* @param ast AST to collect variables from
* @param vars Record of variable name to variable type
*/ function collectVariables(ast, vars = /* @__PURE__ */ new Map()) {
    ast.forEach((el)=>{
        if (isArgumentElement(el) || isDateElement(el) || isTimeElement(el) || isNumberElement(el)) {
            if (vars.has(el.value)) {
                const existingType = vars.get(el.value);
                if (existingType !== el.type && existingType !== 6 && existingType !== 5) throw new Error(`Variable ${el.value} has conflicting types`);
            } else vars.set(el.value, el.type);
        }
        if (isPluralElement(el) || isSelectElement(el)) {
            vars.set(el.value, el.type);
            Object.keys(el.options).forEach((k)=>{
                collectVariables(el.options[k].value, vars);
            });
        }
        if (isTagElement(el)) {
            vars.set(el.value, el.type);
            collectVariables(el.children, vars);
        }
    });
}
/**
* Check if 2 ASTs are structurally the same. This primarily means that
* they have the same variables with the same type
* @param a
* @param b
* @returns
*/ function isStructurallySame(a, b) {
    const aVars = /* @__PURE__ */ new Map();
    const bVars = /* @__PURE__ */ new Map();
    collectVariables(a, aVars);
    collectVariables(b, bVars);
    if (aVars.size !== bVars.size) return {
        success: false,
        error: /* @__PURE__ */ new Error(`Different number of variables: [${Array.from(aVars.keys()).join(", ")}] vs [${Array.from(bVars.keys()).join(", ")}]`)
    };
    return Array.from(aVars.entries()).reduce((result, [key, type])=>{
        if (!result.success) return result;
        const bType = bVars.get(key);
        if (bType == null) return {
            success: false,
            error: /* @__PURE__ */ new Error(`Missing variable ${key} in message`)
        };
        if (bType !== type) return {
            success: false,
            error: /* @__PURE__ */ new Error(`Variable ${key} has conflicting types: ${TYPE[type]} vs ${TYPE[bType]}`)
        };
        return result;
    }, {
        success: true
    });
}
//#endregion
//#region packages/icu-messageformat-parser/index.ts
function pruneLocation(els) {
    els.forEach((el)=>{
        delete el.location;
        if (isSelectElement(el) || isPluralElement(el)) for(const k in el.options){
            delete el.options[k].location;
            pruneLocation(el.options[k].value);
        }
        else if (isNumberElement(el) && isNumberSkeleton(el.style)) delete el.style.location;
        else if ((isDateElement(el) || isTimeElement(el)) && isDateTimeSkeleton(el.style)) delete el.style.location;
        else if (isTagElement(el)) pruneLocation(el.children);
    });
}
function parse(message, opts = {}) {
    opts = {
        shouldParseSkeletons: true,
        requiresOtherClause: true,
        ...opts
    };
    const result = new Parser(message, opts).parse();
    if (result.err) {
        const error = SyntaxError(ErrorKind[result.err.kind]);
        error.location = result.err.location;
        error.originalMessage = result.err.message;
        throw error;
    }
    if (!opts?.captureLocation) pruneLocation(result.val);
    return result.val;
}
const _Parser = Parser;
;
}),
"[project]/app/node_modules/@formatjs/icu-skeleton-parser/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseDateTimeSkeleton",
    ()=>parseDateTimeSkeleton,
    "parseNumberSkeleton",
    ()=>parseNumberSkeleton,
    "parseNumberSkeletonFromString",
    ()=>parseNumberSkeletonFromString
]);
//#region packages/icu-skeleton-parser/date-time.ts
/**
* https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
* Credit: https://github.com/caridy/intl-datetimeformat-pattern/blob/master/index.js
* with some tweaks
*/ const DATE_TIME_REGEX = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
/**
* Parse Date time skeleton into Intl.DateTimeFormatOptions
* Ref: https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
* @public
* @param skeleton skeleton string
*/ function parseDateTimeSkeleton(skeleton) {
    const result = {};
    skeleton.replace(DATE_TIME_REGEX, (match)=>{
        const len = match.length;
        switch(match[0]){
            case "G":
                result.era = len === 4 ? "long" : len === 5 ? "narrow" : "short";
                break;
            case "y":
                result.year = len === 2 ? "2-digit" : "numeric";
                break;
            case "Y":
            case "u":
            case "U":
            case "r":
                throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");
            case "q":
            case "Q":
                throw new RangeError("`q/Q` (quarter) patterns are not supported");
            case "M":
            case "L":
                result.month = [
                    "numeric",
                    "2-digit",
                    "short",
                    "long",
                    "narrow"
                ][len - 1];
                break;
            case "w":
            case "W":
                throw new RangeError("`w/W` (week) patterns are not supported");
            case "d":
                result.day = [
                    "numeric",
                    "2-digit"
                ][len - 1];
                break;
            case "D":
            case "F":
            case "g":
                throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
            case "E":
                result.weekday = len === 4 ? "long" : len === 5 ? "narrow" : "short";
                break;
            case "e":
                if (len < 4) throw new RangeError("`e..eee` (weekday) patterns are not supported");
                result.weekday = [
                    "short",
                    "long",
                    "narrow",
                    "short"
                ][len - 3];
                break;
            case "c":
                if (len < 4) throw new RangeError("`c..ccc` (weekday) patterns are not supported");
                result.weekday = [
                    "short",
                    "long",
                    "narrow",
                    "short"
                ][len - 3];
                break;
            case "a":
                result.hour12 = true;
                break;
            case "b":
            case "B":
                throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");
            case "h":
                result.hourCycle = "h12";
                result.hour = [
                    "numeric",
                    "2-digit"
                ][len - 1];
                break;
            case "H":
                result.hourCycle = "h23";
                result.hour = [
                    "numeric",
                    "2-digit"
                ][len - 1];
                break;
            case "K":
                result.hourCycle = "h11";
                result.hour = [
                    "numeric",
                    "2-digit"
                ][len - 1];
                break;
            case "k":
                result.hourCycle = "h24";
                result.hour = [
                    "numeric",
                    "2-digit"
                ][len - 1];
                break;
            case "j":
            case "J":
            case "C":
                throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
            case "m":
                result.minute = [
                    "numeric",
                    "2-digit"
                ][len - 1];
                break;
            case "s":
                result.second = [
                    "numeric",
                    "2-digit"
                ][len - 1];
                break;
            case "S":
            case "A":
                throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");
            case "z":
                result.timeZoneName = len < 4 ? "short" : "long";
                break;
            case "Z":
            case "O":
            case "v":
            case "V":
            case "X":
            case "x":
                throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");
        }
        return "";
    });
    return result;
}
//#endregion
//#region node_modules/.aspect_rules_js/@formatjs_generated+unicode@0.0.0/node_modules/@formatjs_generated/unicode/icu-skeleton-parser-regex.js
const WHITE_SPACE_REGEX = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
//#endregion
//#region packages/icu-skeleton-parser/number.ts
function parseNumberSkeletonFromString(skeleton) {
    if (skeleton.length === 0) throw new Error("Number skeleton cannot be empty");
    const stringTokens = skeleton.split(WHITE_SPACE_REGEX).filter((x)=>x.length > 0);
    const tokens = [];
    for (const stringToken of stringTokens){
        let stemAndOptions = stringToken.split("/");
        if (stemAndOptions.length === 0) throw new Error("Invalid number skeleton");
        const [stem, ...options] = stemAndOptions;
        for (const option of options)if (option.length === 0) throw new Error("Invalid number skeleton");
        tokens.push({
            stem,
            options
        });
    }
    return tokens;
}
function icuUnitToEcma(unit) {
    return unit.replace(/^(.*?)-/, "");
}
const FRACTION_PRECISION_REGEX = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g;
const SIGNIFICANT_PRECISION_REGEX = /^(@+)?(\+|#+)?[rs]?$/g;
const INTEGER_WIDTH_REGEX = /(\*)(0+)|(#+)(0+)|(0+)/g;
const CONCISE_INTEGER_WIDTH_REGEX = /^(0+)$/;
function parseSignificantPrecision(str) {
    const result = {};
    if (str[str.length - 1] === "r") result.roundingPriority = "morePrecision";
    else if (str[str.length - 1] === "s") result.roundingPriority = "lessPrecision";
    str.replace(SIGNIFICANT_PRECISION_REGEX, function(_, g1, g2) {
        if (typeof g2 !== "string") {
            result.minimumSignificantDigits = g1.length;
            result.maximumSignificantDigits = g1.length;
        } else if (g2 === "+") result.minimumSignificantDigits = g1.length;
        else if (g1[0] === "#") result.maximumSignificantDigits = g1.length;
        else {
            result.minimumSignificantDigits = g1.length;
            result.maximumSignificantDigits = g1.length + (typeof g2 === "string" ? g2.length : 0);
        }
        return "";
    });
    return result;
}
function parseSign(str) {
    switch(str){
        case "sign-auto":
            return {
                signDisplay: "auto"
            };
        case "sign-accounting":
        case "()":
            return {
                currencySign: "accounting"
            };
        case "sign-always":
        case "+!":
            return {
                signDisplay: "always"
            };
        case "sign-accounting-always":
        case "()!":
            return {
                signDisplay: "always",
                currencySign: "accounting"
            };
        case "sign-except-zero":
        case "+?":
            return {
                signDisplay: "exceptZero"
            };
        case "sign-accounting-except-zero":
        case "()?":
            return {
                signDisplay: "exceptZero",
                currencySign: "accounting"
            };
        case "sign-never":
        case "+_":
            return {
                signDisplay: "never"
            };
    }
}
function parseConciseScientificAndEngineeringStem(stem) {
    let result;
    if (stem[0] === "E" && stem[1] === "E") {
        result = {
            notation: "engineering"
        };
        stem = stem.slice(2);
    } else if (stem[0] === "E") {
        result = {
            notation: "scientific"
        };
        stem = stem.slice(1);
    }
    if (result) {
        const signDisplay = stem.slice(0, 2);
        if (signDisplay === "+!") {
            result.signDisplay = "always";
            stem = stem.slice(2);
        } else if (signDisplay === "+?") {
            result.signDisplay = "exceptZero";
            stem = stem.slice(2);
        }
        if (!CONCISE_INTEGER_WIDTH_REGEX.test(stem)) throw new Error("Malformed concise eng/scientific notation");
        result.minimumIntegerDigits = stem.length;
    }
    return result;
}
function parseNotationOptions(opt) {
    const result = {};
    const signOpts = parseSign(opt);
    if (signOpts) return signOpts;
    return result;
}
/**
* https://github.com/unicode-org/icu/blob/master/docs/userguide/format_parse/numbers/skeletons.md#skeleton-stems-and-options
*/ function parseNumberSkeleton(tokens) {
    let result = {};
    for (const token of tokens){
        switch(token.stem){
            case "percent":
            case "%":
                result.style = "percent";
                continue;
            case "%x100":
                result.style = "percent";
                result.scale = 100;
                continue;
            case "currency":
                result.style = "currency";
                result.currency = token.options[0];
                continue;
            case "group-off":
            case ",_":
                result.useGrouping = false;
                continue;
            case "precision-integer":
            case ".":
                result.maximumFractionDigits = 0;
                continue;
            case "measure-unit":
            case "unit":
                result.style = "unit";
                result.unit = icuUnitToEcma(token.options[0]);
                continue;
            case "compact-short":
            case "K":
                result.notation = "compact";
                result.compactDisplay = "short";
                continue;
            case "compact-long":
            case "KK":
                result.notation = "compact";
                result.compactDisplay = "long";
                continue;
            case "scientific":
                result = {
                    ...result,
                    notation: "scientific",
                    ...token.options.reduce((all, opt)=>({
                            ...all,
                            ...parseNotationOptions(opt)
                        }), {})
                };
                continue;
            case "engineering":
                result = {
                    ...result,
                    notation: "engineering",
                    ...token.options.reduce((all, opt)=>({
                            ...all,
                            ...parseNotationOptions(opt)
                        }), {})
                };
                continue;
            case "notation-simple":
                result.notation = "standard";
                continue;
            case "unit-width-narrow":
                result.currencyDisplay = "narrowSymbol";
                result.unitDisplay = "narrow";
                continue;
            case "unit-width-short":
                result.currencyDisplay = "code";
                result.unitDisplay = "short";
                continue;
            case "unit-width-full-name":
                result.currencyDisplay = "name";
                result.unitDisplay = "long";
                continue;
            case "unit-width-iso-code":
                result.currencyDisplay = "symbol";
                continue;
            case "scale":
                result.scale = parseFloat(token.options[0]);
                continue;
            case "rounding-mode-floor":
                result.roundingMode = "floor";
                continue;
            case "rounding-mode-ceiling":
                result.roundingMode = "ceil";
                continue;
            case "rounding-mode-down":
                result.roundingMode = "trunc";
                continue;
            case "rounding-mode-up":
                result.roundingMode = "expand";
                continue;
            case "rounding-mode-half-even":
                result.roundingMode = "halfEven";
                continue;
            case "rounding-mode-half-down":
                result.roundingMode = "halfTrunc";
                continue;
            case "rounding-mode-half-up":
                result.roundingMode = "halfExpand";
                continue;
            case "integer-width":
                if (token.options.length > 1) throw new RangeError("integer-width stems only accept a single optional option");
                token.options[0].replace(INTEGER_WIDTH_REGEX, function(_, g1, g2, g3, g4, g5) {
                    if (g1) result.minimumIntegerDigits = g2.length;
                    else if (g3 && g4) throw new Error("We currently do not support maximum integer digits");
                    else if (g5) throw new Error("We currently do not support exact integer digits");
                    return "";
                });
                continue;
        }
        if (CONCISE_INTEGER_WIDTH_REGEX.test(token.stem)) {
            result.minimumIntegerDigits = token.stem.length;
            continue;
        }
        if (FRACTION_PRECISION_REGEX.test(token.stem)) {
            if (token.options.length > 1) throw new RangeError("Fraction-precision stems only accept a single optional option");
            token.stem.replace(FRACTION_PRECISION_REGEX, function(_, g1, g2, g3, g4, g5) {
                if (g2 === "*") result.minimumFractionDigits = g1.length;
                else if (g3 && g3[0] === "#") result.maximumFractionDigits = g3.length;
                else if (g4 && g5) {
                    result.minimumFractionDigits = g4.length;
                    result.maximumFractionDigits = g4.length + g5.length;
                } else {
                    result.minimumFractionDigits = g1.length;
                    result.maximumFractionDigits = g1.length;
                }
                return "";
            });
            const opt = token.options[0];
            if (opt === "w") result = {
                ...result,
                trailingZeroDisplay: "stripIfInteger"
            };
            else if (opt) result = {
                ...result,
                ...parseSignificantPrecision(opt)
            };
            continue;
        }
        if (SIGNIFICANT_PRECISION_REGEX.test(token.stem)) {
            result = {
                ...result,
                ...parseSignificantPrecision(token.stem)
            };
            continue;
        }
        const signOpts = parseSign(token.stem);
        if (signOpts) result = {
            ...result,
            ...signOpts
        };
        const conciseScientificAndEngineeringOpts = parseConciseScientificAndEngineeringStem(token.stem);
        if (conciseScientificAndEngineeringOpts) result = {
            ...result,
            ...conciseScientificAndEngineeringOpts
        };
    }
    return result;
}
;
}),
"[project]/app/node_modules/@tanstack/query-core/build/modern/environmentManager.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "environmentManager",
    ()=>environmentManager,
    "isServer",
    ()=>isServer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
;
//#region src/environmentManager.ts
let isServerFn = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isServer"];
/**
* Returns whether the current runtime should be treated as a server environment.
*/ const isServer = ()=>isServerFn();
/**
* Manages environment detection used by TanStack Query internals.
*/ const environmentManager = {
    isServer,
    /**
	* Overrides the server check globally.
	*/ setIsServer (isServerValue) {
        isServerFn = isServerValue;
    }
};
;
}),
"[project]/app/node_modules/@tanstack/query-core/build/modern/focusManager.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FocusManager",
    ()=>FocusManager,
    "focusManager",
    ()=>focusManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/subscribable.js [app-client] (ecmascript)");
;
//#region src/focusManager.ts
var FocusManager = class extends __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subscribable"] {
    #focused;
    #cleanup;
    #setup;
    constructor(){
        super();
        this.#setup = (onFocus)=>{
            if (typeof window !== "undefined" && window.addEventListener) {
                const listener = ()=>onFocus();
                window.addEventListener("visibilitychange", listener, false);
                return ()=>{
                    window.removeEventListener("visibilitychange", listener);
                };
            }
        };
    }
    onSubscribe() {
        if (!this.#cleanup) this.setEventListener(this.#setup);
    }
    onUnsubscribe() {
        if (!this.hasListeners()) {
            this.#cleanup?.();
            this.#cleanup = void 0;
        }
    }
    setEventListener(setup) {
        this.#setup = setup;
        this.#cleanup?.();
        this.#cleanup = setup((focused)=>{
            if (typeof focused === "boolean") this.setFocused(focused);
            else this.onFocus();
        });
    }
    setFocused(focused) {
        if (this.#focused !== focused) {
            this.#focused = focused;
            this.onFocus();
        }
    }
    onFocus() {
        const isFocused = this.isFocused();
        this.listeners.forEach((listener)=>{
            listener(isFocused);
        });
    }
    isFocused() {
        if (typeof this.#focused === "boolean") return this.#focused;
        return globalThis.document?.visibilityState !== "hidden";
    }
};
const focusManager = new FocusManager();
;
}),
"[project]/app/node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasNextPage",
    ()=>hasNextPage,
    "hasPreviousPage",
    ()=>hasPreviousPage,
    "infiniteQueryBehavior",
    ()=>infiniteQueryBehavior
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
;
//#region src/infiniteQueryBehavior.ts
function infiniteQueryBehavior(pages) {
    return {
        onFetch: (context, query)=>{
            const options = context.options;
            const direction = context.fetchOptions?.meta?.fetchMore?.direction;
            const oldPages = context.state.data?.pages || [];
            const oldPageParams = context.state.data?.pageParams || [];
            let result = {
                pages: [],
                pageParams: []
            };
            let currentPage = 0;
            const fetchFn = async ()=>{
                let cancelled = false;
                const addSignalProperty = (object)=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addConsumeAwareSignal"])(object, ()=>context.signal, ()=>cancelled = true);
                };
                const queryFn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureQueryFn"])(context.options, context.fetchOptions);
                const fetchPage = async (data, param, previous)=>{
                    if (cancelled) return Promise.reject(context.signal.reason);
                    if (param == null && data.pages.length) return Promise.resolve(data);
                    const createQueryFnContext = ()=>{
                        const queryFnContext = {
                            client: context.client,
                            queryKey: context.queryKey,
                            pageParam: param,
                            direction: previous ? "backward" : "forward",
                            meta: context.options.meta
                        };
                        addSignalProperty(queryFnContext);
                        return queryFnContext;
                    };
                    const queryFnContext = createQueryFnContext();
                    const page = await queryFn(queryFnContext);
                    const { maxPages } = context.options;
                    const addTo = previous ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addToStart"] : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addToEnd"];
                    return {
                        pages: addTo(data.pages, page, maxPages),
                        pageParams: addTo(data.pageParams, param, maxPages)
                    };
                };
                if (direction && oldPages.length) {
                    const previous = direction === "backward";
                    const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
                    const oldData = {
                        pages: oldPages,
                        pageParams: oldPageParams
                    };
                    result = await fetchPage(oldData, pageParamFn(options, oldData), previous);
                } else {
                    const remainingPages = pages ?? oldPages.length;
                    do {
                        const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
                        if (currentPage > 0 && param == null) break;
                        result = await fetchPage(result, param);
                        currentPage++;
                    }while (currentPage < remainingPages)
                }
                return result;
            };
            if (context.options.persister) context.fetchFn = ()=>{
                return context.options.persister?.(fetchFn, {
                    client: context.client,
                    queryKey: context.queryKey,
                    meta: context.options.meta,
                    signal: context.signal
                }, query);
            };
            else context.fetchFn = fetchFn;
        }
    };
}
function getNextPageParam(options, { pages, pageParams }) {
    const lastIndex = pages.length - 1;
    return pages.length > 0 ? options.getNextPageParam(pages[lastIndex], pages, pageParams[lastIndex], pageParams) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
    return pages.length > 0 ? options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
}
/**
* Checks if there is a next page.
*/ function hasNextPage(options, data) {
    if (!data) return false;
    return getNextPageParam(options, data) != null;
}
/**
* Checks if there is a previous page.
*/ function hasPreviousPage(options, data) {
    if (!data || !options.getPreviousPageParam) return false;
    return getPreviousPageParam(options, data) != null;
}
;
}),
"[project]/app/node_modules/@tanstack/query-core/build/modern/mutation.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Mutation",
    ()=>Mutation,
    "getDefaultState",
    ()=>getDefaultState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/retryer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$removable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/removable.js [app-client] (ecmascript)");
;
;
;
//#region src/mutation.ts
var Mutation = class extends __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$removable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Removable"] {
    #client;
    #observers;
    #mutationCache;
    #retryer;
    constructor(config){
        super();
        this.#client = config.client;
        this.mutationId = config.mutationId;
        this.#mutationCache = config.mutationCache;
        this.#observers = [];
        this.state = config.state || getDefaultState();
        this.setOptions(config.options);
        this.scheduleGc();
    }
    setOptions(options) {
        this.options = options;
        this.updateGcTime(this.options.gcTime);
    }
    get meta() {
        return this.options.meta;
    }
    addObserver(observer) {
        if (!this.#observers.includes(observer)) {
            this.#observers.push(observer);
            this.clearGcTimeout();
            this.#mutationCache.notify({
                type: "observerAdded",
                mutation: this,
                observer
            });
        }
    }
    removeObserver(observer) {
        this.#observers = this.#observers.filter((x)=>x !== observer);
        this.scheduleGc();
        this.#mutationCache.notify({
            type: "observerRemoved",
            mutation: this,
            observer
        });
    }
    optionalRemove() {
        if (!this.#observers.length) {
            if (this.state.status === "pending") this.scheduleGc();
            else this.#mutationCache.remove(this);
        }
    }
    continue() {
        return this.#retryer?.continue() ?? (this.state.status === "pending" ? this.execute(this.state.variables) : Promise.resolve());
    }
    async execute(variables) {
        const onContinue = ()=>{
            this.#dispatch({
                type: "continue"
            });
        };
        const mutationFnContext = {
            client: this.#client,
            meta: this.options.meta,
            mutationKey: this.options.mutationKey
        };
        const retryer = this.#retryer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRetryer"])({
            fn: ()=>{
                if (!this.options.mutationFn) return Promise.reject(/* @__PURE__ */ new Error("No mutationFn found"));
                return this.options.mutationFn(variables, mutationFnContext);
            },
            onFail: (failureCount, error)=>{
                this.#dispatch({
                    type: "failed",
                    failureCount,
                    error
                });
            },
            onPause: ()=>{
                this.#dispatch({
                    type: "pause"
                });
            },
            onContinue,
            retry: this.options.retry ?? 0,
            retryDelay: this.options.retryDelay,
            networkMode: this.options.networkMode,
            canRun: ()=>this.#mutationCache.canRun(this)
        });
        const restored = this.state.status === "pending";
        const isPaused = !retryer.canStart();
        try {
            if (restored) onContinue();
            else {
                this.#dispatch({
                    type: "pending",
                    variables,
                    isPaused
                });
                if (this.#mutationCache.config.onMutate) await this.#mutationCache.config.onMutate(variables, this, mutationFnContext);
                const context = await this.options.onMutate?.(variables, mutationFnContext);
                if (context !== this.state.context) this.#dispatch({
                    type: "pending",
                    context,
                    variables,
                    isPaused
                });
            }
            const data = await retryer.start();
            await this.#mutationCache.config.onSuccess?.(data, variables, this.state.context, this, mutationFnContext);
            await this.options.onSuccess?.(data, variables, this.state.context, mutationFnContext);
            await this.#mutationCache.config.onSettled?.(data, null, this.state.variables, this.state.context, this, mutationFnContext);
            await this.options.onSettled?.(data, null, variables, this.state.context, mutationFnContext);
            this.#dispatch({
                type: "success",
                data
            });
            return data;
        } catch (error) {
            try {
                await this.#mutationCache.config.onError?.(error, variables, this.state.context, this, mutationFnContext);
            } catch (e) {
                Promise.reject(e);
            }
            try {
                await this.options.onError?.(error, variables, this.state.context, mutationFnContext);
            } catch (e) {
                Promise.reject(e);
            }
            try {
                await this.#mutationCache.config.onSettled?.(void 0, error, this.state.variables, this.state.context, this, mutationFnContext);
            } catch (e) {
                Promise.reject(e);
            }
            try {
                await this.options.onSettled?.(void 0, error, variables, this.state.context, mutationFnContext);
            } catch (e) {
                Promise.reject(e);
            }
            this.#dispatch({
                type: "error",
                error
            });
            throw error;
        } finally{
            if (this.#retryer === retryer) this.#retryer = void 0;
            this.#mutationCache.runNext(this);
        }
    }
    #dispatch(action) {
        const reducer = (state)=>{
            switch(action.type){
                case "failed":
                    return {
                        ...state,
                        failureCount: action.failureCount,
                        failureReason: action.error
                    };
                case "pause":
                    return {
                        ...state,
                        isPaused: true
                    };
                case "continue":
                    return {
                        ...state,
                        isPaused: false
                    };
                case "pending":
                    return {
                        ...state,
                        context: action.context,
                        data: void 0,
                        failureCount: 0,
                        failureReason: null,
                        error: null,
                        isPaused: action.isPaused,
                        status: "pending",
                        variables: action.variables,
                        submittedAt: Date.now()
                    };
                case "success":
                    return {
                        ...state,
                        data: action.data,
                        failureCount: 0,
                        failureReason: null,
                        error: null,
                        status: "success",
                        isPaused: false
                    };
                case "error":
                    return {
                        ...state,
                        data: void 0,
                        error: action.error,
                        failureCount: state.failureCount + 1,
                        failureReason: action.error,
                        isPaused: false,
                        status: "error"
                    };
            }
        };
        this.state = reducer(this.state);
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.#observers.forEach((observer)=>{
                observer.onMutationUpdate(action);
            });
            this.#mutationCache.notify({
                mutation: this,
                type: "updated",
                action
            });
        });
    }
};
function getDefaultState() {
    return {
        context: void 0,
        data: void 0,
        error: null,
        failureCount: 0,
        failureReason: null,
        isPaused: false,
        status: "idle",
        variables: void 0,
        submittedAt: 0
    };
}
;
}),
"[project]/app/node_modules/@tanstack/query-core/build/modern/mutationCache.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MutationCache",
    ()=>MutationCache
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/subscribable.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$mutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/mutation.js [app-client] (ecmascript)");
;
;
;
;
//#region src/mutationCache.ts
var MutationCache = class extends __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subscribable"] {
    #mutations;
    #scopes;
    #mutationId;
    constructor(config = {}){
        super();
        this.config = config;
        this.#mutations = /* @__PURE__ */ new Set();
        this.#scopes = /* @__PURE__ */ new Map();
        this.#mutationId = 0;
    }
    build(client, options, state) {
        const mutation = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$mutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mutation"]({
            client,
            mutationCache: this,
            mutationId: ++this.#mutationId,
            options: client.defaultMutationOptions(options),
            state
        });
        this.add(mutation);
        return mutation;
    }
    add(mutation) {
        this.#mutations.add(mutation);
        const scope = scopeFor(mutation);
        if (typeof scope === "string") {
            const scopedMutations = this.#scopes.get(scope);
            if (scopedMutations) scopedMutations.push(mutation);
            else this.#scopes.set(scope, [
                mutation
            ]);
        }
        this.notify({
            type: "added",
            mutation
        });
    }
    remove(mutation) {
        if (this.#mutations.delete(mutation)) {
            const scope = scopeFor(mutation);
            if (typeof scope === "string") {
                const scopedMutations = this.#scopes.get(scope);
                if (scopedMutations) {
                    if (scopedMutations.length > 1) {
                        const index = scopedMutations.indexOf(mutation);
                        if (index !== -1) scopedMutations.splice(index, 1);
                    } else if (scopedMutations[0] === mutation) this.#scopes.delete(scope);
                }
            }
        }
        this.notify({
            type: "removed",
            mutation
        });
    }
    canRun(mutation) {
        const scope = scopeFor(mutation);
        if (typeof scope === "string") {
            const firstPendingMutation = this.#scopes.get(scope)?.find((m)=>m.state.status === "pending");
            return !firstPendingMutation || firstPendingMutation === mutation;
        } else return true;
    }
    runNext(mutation) {
        const scope = scopeFor(mutation);
        if (typeof scope === "string") return this.#scopes.get(scope)?.find((m)=>m !== mutation && m.state.isPaused)?.continue() ?? Promise.resolve();
        else return Promise.resolve();
    }
    clear() {
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.#mutations.forEach((mutation)=>{
                this.notify({
                    type: "removed",
                    mutation
                });
            });
            this.#mutations.clear();
            this.#scopes.clear();
        });
    }
    getAll() {
        return Array.from(this.#mutations);
    }
    find(filters) {
        const defaultedFilters = {
            exact: true,
            ...filters
        };
        return this.getAll().find((mutation)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["matchMutation"])(defaultedFilters, mutation));
    }
    findAll(filters = {}) {
        return this.getAll().filter((mutation)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["matchMutation"])(filters, mutation));
    }
    notify(event) {
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.listeners.forEach((listener)=>{
                listener(event);
            });
        });
    }
    resumePausedMutations() {
        const pausedMutations = this.getAll().filter((x)=>x.state.isPaused);
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>Promise.all(pausedMutations.map((mutation)=>mutation.continue().catch(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]))));
    }
};
function scopeFor(mutation) {
    return mutation.options.scope?.id;
}
;
}),
"[project]/app/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createNotifyManager",
    ()=>createNotifyManager,
    "defaultScheduler",
    ()=>defaultScheduler,
    "notifyManager",
    ()=>notifyManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/timeoutManager.js [app-client] (ecmascript)");
;
//#region src/notifyManager.ts
const defaultScheduler = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["systemSetTimeoutZero"];
function createNotifyManager() {
    let queue = [];
    let transactions = 0;
    let notifyFn = (callback)=>{
        callback();
    };
    let batchNotifyFn = (callback)=>{
        callback();
    };
    let scheduleFn = defaultScheduler;
    const schedule = (callback)=>{
        if (transactions) queue.push(callback);
        else scheduleFn(()=>{
            notifyFn(callback);
        });
    };
    const flush = ()=>{
        const originalQueue = queue;
        queue = [];
        if (originalQueue.length) scheduleFn(()=>{
            batchNotifyFn(()=>{
                originalQueue.forEach((callback)=>{
                    notifyFn(callback);
                });
            });
        });
    };
    return {
        batch: (callback)=>{
            let result;
            transactions++;
            try {
                result = callback();
            } finally{
                transactions--;
                if (!transactions) flush();
            }
            return result;
        },
        /**
		* All calls to the wrapped function will be batched.
		*/ batchCalls: (callback)=>{
            return (...args)=>{
                schedule(()=>{
                    callback(...args);
                });
            };
        },
        schedule,
        /**
		* Use this method to set a custom notify function.
		* This can be used to for example wrap notifications with `React.act` while running tests.
		*/ setNotifyFunction: (fn)=>{
            notifyFn = fn;
        },
        /**
		* Use this method to set a custom function to batch notifications together into a single tick.
		* By default React Query will use the batch function provided by ReactDOM or React Native.
		*/ setBatchNotifyFunction: (fn)=>{
            batchNotifyFn = fn;
        },
        setScheduler: (fn)=>{
            scheduleFn = fn;
        }
    };
}
const notifyManager = createNotifyManager();
;
}),
"[project]/app/node_modules/@tanstack/query-core/build/modern/onlineManager.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OnlineManager",
    ()=>OnlineManager,
    "onlineManager",
    ()=>onlineManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/subscribable.js [app-client] (ecmascript)");
;
//#region src/onlineManager.ts
var OnlineManager = class extends __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subscribable"] {
    #online = true;
    #cleanup;
    #setup;
    constructor(){
        super();
        this.#setup = (onOnline)=>{
            if (typeof window !== "undefined" && window.addEventListener) {
                const onlineListener = ()=>onOnline(true);
                const offlineListener = ()=>onOnline(false);
                window.addEventListener("online", onlineListener, false);
                window.addEventListener("offline", offlineListener, false);
                return ()=>{
                    window.removeEventListener("online", onlineListener);
                    window.removeEventListener("offline", offlineListener);
                };
            }
        };
    }
    onSubscribe() {
        if (!this.#cleanup) this.setEventListener(this.#setup);
    }
    onUnsubscribe() {
        if (!this.hasListeners()) {
            this.#cleanup?.();
            this.#cleanup = void 0;
        }
    }
    setEventListener(setup) {
        this.#setup = setup;
        this.#cleanup?.();
        this.#cleanup = setup(this.setOnline.bind(this));
    }
    setOnline(online) {
        if (this.#online !== online) {
            this.#online = online;
            this.listeners.forEach((listener)=>{
                listener(online);
            });
        }
    }
    isOnline() {
        return this.#online;
    }
};
const onlineManager = new OnlineManager();
;
}),
"[project]/app/node_modules/@tanstack/query-core/build/modern/query.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Query",
    ()=>Query,
    "fetchState",
    ()=>fetchState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/retryer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$removable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/removable.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$infiniteQueryBehavior$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.js [app-client] (ecmascript)");
;
;
;
;
;
//#region src/query.ts
var Query = class extends __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$removable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Removable"] {
    #queryType;
    #initialState;
    #revertState;
    #cache;
    #client;
    #retryer;
    #defaultOptions;
    #abortSignalConsumed;
    constructor(config){
        super();
        this.#abortSignalConsumed = false;
        this.#defaultOptions = config.defaultOptions;
        this.setOptions(config.options);
        this.observers = [];
        this.#client = config.client;
        this.#cache = this.#client.getQueryCache();
        this.queryKey = config.queryKey;
        this.queryHash = config.queryHash;
        this.#initialState = getDefaultState(this.options);
        this.state = config.state ?? this.#initialState;
        this.scheduleGc();
    }
    get meta() {
        return this.options.meta;
    }
    get queryType() {
        return this.#queryType;
    }
    get promise() {
        return this.#retryer?.promise;
    }
    setOptions(options) {
        this.options = {
            ...this.#defaultOptions,
            ...options
        };
        if (options?._type) this.#queryType = options._type;
        this.updateGcTime(this.options.gcTime);
        if (this.state && this.state.data === void 0) {
            const defaultState = getDefaultState(this.options);
            if (defaultState.data !== void 0) {
                this.setState(successState(defaultState.data, defaultState.dataUpdatedAt));
                this.#initialState = defaultState;
            }
        }
    }
    optionalRemove() {
        if (!this.observers.length && this.state.fetchStatus === "idle") this.#cache.remove(this);
    }
    setData(newData, options) {
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["replaceData"])(this.state.data, newData, this.options);
        this.#dispatch({
            data,
            type: "success",
            dataUpdatedAt: options?.updatedAt,
            manual: options?.manual
        });
        return data;
    }
    setState(state) {
        this.#dispatch({
            type: "setState",
            state
        });
    }
    cancel(options) {
        const promise = this.#retryer?.promise;
        this.#retryer?.cancel(options);
        return promise ? promise.then(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]).catch(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]) : Promise.resolve();
    }
    destroy() {
        super.destroy();
        this.cancel({
            silent: true
        });
    }
    get resetState() {
        return this.#initialState;
    }
    reset() {
        this.destroy();
        this.setState(this.resetState);
    }
    isActive() {
        return this.observers.some((observer)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveQueryValue"])(observer.options.enabled, this) !== false);
    }
    isDisabled() {
        if (this.getObserversCount() > 0) return !this.isActive();
        return this.options.queryFn === __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["skipToken"] || !this.isFetched();
    }
    isFetched() {
        return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
    }
    isStatic() {
        if (this.getObserversCount() > 0) return this.observers.some((observer)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveQueryValue"])(observer.options.staleTime, this) === "static");
        return false;
    }
    isStale() {
        if (this.getObserversCount() > 0) return this.observers.some((observer)=>observer.getCurrentResult().isStale);
        return this.state.data === void 0 || this.state.isInvalidated;
    }
    isStaleByTime(staleTime = 0) {
        if (this.state.data === void 0) return true;
        if (staleTime === "static") return false;
        if (this.state.isInvalidated) return true;
        return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeUntilStale"])(this.state.dataUpdatedAt, staleTime);
    }
    onFocus() {
        this.observers.find((x)=>x.shouldFetchOnWindowFocus())?.refetch({
            cancelRefetch: false
        });
        this.#retryer?.continue();
    }
    onOnline() {
        this.observers.find((x)=>x.shouldFetchOnReconnect())?.refetch({
            cancelRefetch: false
        });
        this.#retryer?.continue();
    }
    addObserver(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
            this.clearGcTimeout();
            this.#cache.notify({
                type: "observerAdded",
                query: this,
                observer
            });
        }
    }
    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
            if (!this.observers.length) {
                if (this.#retryer) {
                    if (this.#abortSignalConsumed || this.state.fetchStatus === "paused" && this.state.status === "pending") this.#retryer.cancel({
                        revert: true
                    });
                    else this.#retryer.cancelRetry();
                }
                this.scheduleGc();
            }
            this.#cache.notify({
                type: "observerRemoved",
                query: this,
                observer
            });
        }
    }
    getObserversCount() {
        return this.observers.length;
    }
    invalidate() {
        if (!this.state.isInvalidated) this.#dispatch({
            type: "invalidate"
        });
    }
    async fetch(options, fetchOptions) {
        if (this.state.fetchStatus !== "idle" && this.#retryer?.status() !== "rejected") {
            if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) this.cancel({
                silent: true
            });
            else if (this.#retryer) {
                this.#retryer.continueRetry();
                return this.#retryer.promise;
            }
        }
        if (options) this.setOptions(options);
        if (!this.options.queryFn) {
            const observer = this.observers.find((x)=>x.options.queryFn);
            if (observer) this.setOptions(observer.options);
        }
        if ("TURBOPACK compile-time truthy", 1) {
            if (!Array.isArray(this.options.queryKey)) console.error(`As of v4, queryKey needs to be an Array. If you are using a string like 'repoData', please change it to an Array, e.g. ['repoData']`);
        }
        const abortController = new AbortController();
        const addSignalProperty = (object)=>{
            Object.defineProperty(object, "signal", {
                enumerable: true,
                get: ()=>{
                    this.#abortSignalConsumed = true;
                    return abortController.signal;
                }
            });
        };
        const fetchFn = ()=>{
            const queryFn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureQueryFn"])(this.options, fetchOptions);
            const createQueryFnContext = ()=>{
                const queryFnContext = {
                    client: this.#client,
                    queryKey: this.queryKey,
                    meta: this.meta
                };
                addSignalProperty(queryFnContext);
                return queryFnContext;
            };
            const queryFnContext = createQueryFnContext();
            this.#abortSignalConsumed = false;
            if (this.options.persister) return this.options.persister(queryFn, queryFnContext, this);
            return queryFn(queryFnContext);
        };
        const createFetchContext = ()=>{
            const context = {
                fetchOptions,
                options: this.options,
                queryKey: this.queryKey,
                client: this.#client,
                state: this.state,
                fetchFn
            };
            addSignalProperty(context);
            return context;
        };
        const context = createFetchContext();
        (this.#queryType === "infinite" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$infiniteQueryBehavior$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["infiniteQueryBehavior"])(this.options.pages) : this.options.behavior)?.onFetch(context, this);
        this.#revertState = this.state;
        if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) this.#dispatch({
            type: "fetch",
            meta: context.fetchOptions?.meta
        });
        const retryer = this.#retryer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRetryer"])({
            initialPromise: fetchOptions?.initialPromise,
            fn: context.fetchFn,
            onCancel: (error)=>{
                if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CancelledError"] && error.revert) this.setState({
                    ...this.#revertState,
                    fetchStatus: "idle"
                });
                abortController.abort();
            },
            onFail: (failureCount, error)=>{
                this.#dispatch({
                    type: "failed",
                    failureCount,
                    error
                });
            },
            onPause: ()=>{
                this.#dispatch({
                    type: "pause"
                });
            },
            onContinue: ()=>{
                this.#dispatch({
                    type: "continue"
                });
            },
            retry: context.options.retry,
            retryDelay: context.options.retryDelay,
            networkMode: context.options.networkMode,
            canRun: ()=>true
        });
        try {
            const data = await retryer.start();
            if (data === void 0) {
                if ("TURBOPACK compile-time truthy", 1) console.error(`Query data cannot be undefined. Please make sure to return a value other than undefined from your query function. Affected query key: ${this.queryHash}`);
                throw new Error(`${this.queryHash} data is undefined`);
            }
            this.setData(data);
            this.#cache.config.onSuccess?.(data, this);
            this.#cache.config.onSettled?.(data, this.state.error, this);
            return data;
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CancelledError"]) {
                if (error.silent) return this.#retryer.promise;
                else if (error.revert) {
                    if (this.state.data === void 0) throw error;
                    return this.state.data;
                }
            }
            this.#dispatch({
                type: "error",
                error
            });
            this.#cache.config.onError?.(error, this);
            this.#cache.config.onSettled?.(this.state.data, error, this);
            throw error;
        } finally{
            if (this.#retryer === retryer) this.#retryer = void 0;
            this.scheduleGc();
        }
    }
    #dispatch(action) {
        const reducer = (state)=>{
            switch(action.type){
                case "failed":
                    return {
                        ...state,
                        fetchFailureCount: action.failureCount,
                        fetchFailureReason: action.error
                    };
                case "pause":
                    return {
                        ...state,
                        fetchStatus: "paused"
                    };
                case "continue":
                    return {
                        ...state,
                        fetchStatus: "fetching"
                    };
                case "fetch":
                    return {
                        ...state,
                        ...fetchState(state.data, this.options),
                        fetchMeta: action.meta ?? null
                    };
                case "success":
                    const newState = {
                        ...state,
                        ...successState(action.data, action.dataUpdatedAt),
                        dataUpdateCount: state.dataUpdateCount + 1,
                        ...!action.manual && {
                            fetchStatus: "idle",
                            fetchFailureCount: 0,
                            fetchFailureReason: null
                        }
                    };
                    this.#revertState = action.manual ? newState : void 0;
                    return newState;
                case "error":
                    const error = action.error;
                    return {
                        ...state,
                        error,
                        errorUpdateCount: state.errorUpdateCount + 1,
                        errorUpdatedAt: Date.now(),
                        fetchFailureCount: state.fetchFailureCount + 1,
                        fetchFailureReason: error,
                        fetchStatus: "idle",
                        status: "error",
                        isInvalidated: true
                    };
                case "invalidate":
                    return {
                        ...state,
                        isInvalidated: true
                    };
                case "setState":
                    return {
                        ...state,
                        ...action.state
                    };
            }
        };
        this.state = reducer(this.state);
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.observers.slice().forEach((observer)=>{
                observer.onQueryUpdate();
            });
            this.#cache.notify({
                query: this,
                type: "updated",
                action
            });
        });
    }
};
function fetchState(data, options) {
    return {
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchStatus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canFetch"])(options.networkMode) ? "fetching" : "paused",
        ...data === void 0 && {
            error: null,
            status: "pending"
        }
    };
}
function successState(data, dataUpdatedAt) {
    return {
        data,
        dataUpdatedAt: dataUpdatedAt ?? Date.now(),
        error: null,
        isInvalidated: false,
        status: "success"
    };
}
function getDefaultState(options) {
    const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
    const hasData = data !== void 0;
    const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
    return {
        data,
        dataUpdateCount: 0,
        dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchMeta: null,
        isInvalidated: false,
        status: hasData ? "success" : "pending",
        fetchStatus: "idle"
    };
}
;
}),
"[project]/app/node_modules/@tanstack/query-core/build/modern/queryCache.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryCache",
    ()=>QueryCache
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/subscribable.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$query$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/query.js [app-client] (ecmascript)");
;
;
;
;
//#region src/queryCache.ts
var QueryCache = class extends __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subscribable"] {
    #queries;
    constructor(config = {}){
        super();
        this.config = config;
        this.#queries = /* @__PURE__ */ new Map();
    }
    build(client, options, state) {
        const queryKey = options.queryKey;
        const queryHash = options.queryHash ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hashQueryKeyByOptions"])(queryKey, options);
        let query = this.get(queryHash);
        if (!query) {
            query = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$query$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"]({
                client,
                queryKey,
                queryHash,
                options: client.defaultQueryOptions(options),
                state,
                defaultOptions: client.getQueryDefaults(queryKey)
            });
            this.add(query);
        }
        return query;
    }
    add(query) {
        if (!this.#queries.has(query.queryHash)) {
            this.#queries.set(query.queryHash, query);
            this.notify({
                type: "added",
                query
            });
        }
    }
    remove(query) {
        const queryInMap = this.#queries.get(query.queryHash);
        if (queryInMap) {
            query.destroy();
            if (queryInMap === query) this.#queries.delete(query.queryHash);
            this.notify({
                type: "removed",
                query
            });
        }
    }
    clear() {
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.getAll().forEach((query)=>{
                this.remove(query);
            });
        });
    }
    get(queryHash) {
        return this.#queries.get(queryHash);
    }
    getAll() {
        return [
            ...this.#queries.values()
        ];
    }
    find(filters) {
        const defaultedFilters = {
            exact: true,
            ...filters
        };
        return this.getAll().find((query)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["matchQuery"])(defaultedFilters, query));
    }
    findAll(filters = {}) {
        const queries = this.getAll();
        return Object.keys(filters).length > 0 ? queries.filter((query)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["matchQuery"])(filters, query)) : queries;
    }
    notify(event) {
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.listeners.forEach((listener)=>{
                listener(event);
            });
        });
    }
    onFocus() {
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.getAll().forEach((query)=>{
                query.onFocus();
            });
        });
    }
    onOnline() {
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.getAll().forEach((query)=>{
                query.onOnline();
            });
        });
    }
};
;
}),
"[project]/app/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryClient",
    ()=>QueryClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$focusManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/focusManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/onlineManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$mutationCache$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/mutationCache.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryCache$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/queryCache.js [app-client] (ecmascript)");
;
;
;
;
;
;
//#region src/queryClient.ts
var QueryClient = class {
    #queryCache;
    #mutationCache;
    #defaultOptions;
    #queryDefaults;
    #mutationDefaults;
    #mountCount;
    #unsubscribeFocus;
    #unsubscribeOnline;
    constructor(config = {}){
        this.#queryCache = config.queryCache || new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryCache$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryCache"]();
        this.#mutationCache = config.mutationCache || new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$mutationCache$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MutationCache"]();
        this.#defaultOptions = config.defaultOptions || {};
        this.#queryDefaults = /* @__PURE__ */ new Map();
        this.#mutationDefaults = /* @__PURE__ */ new Map();
        this.#mountCount = 0;
    }
    mount() {
        this.#mountCount++;
        if (this.#mountCount !== 1) return;
        this.#unsubscribeFocus = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$focusManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["focusManager"].subscribe(async (focused)=>{
            if (focused) {
                await this.resumePausedMutations();
                this.#queryCache.onFocus();
            }
        });
        this.#unsubscribeOnline = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onlineManager"].subscribe(async (online)=>{
            if (online) {
                await this.resumePausedMutations();
                this.#queryCache.onOnline();
            }
        });
    }
    unmount() {
        this.#mountCount--;
        if (this.#mountCount !== 0) return;
        this.#unsubscribeFocus?.();
        this.#unsubscribeFocus = void 0;
        this.#unsubscribeOnline?.();
        this.#unsubscribeOnline = void 0;
    }
    isFetching(filters) {
        return this.#queryCache.findAll({
            ...filters,
            fetchStatus: "fetching"
        }).length;
    }
    isMutating(filters) {
        return this.#mutationCache.findAll({
            ...filters,
            status: "pending"
        }).length;
    }
    /**
	* Imperative (non-reactive) way to retrieve data for a QueryKey.
	* Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
	*
	* Hint: Do not use this function inside a component, because it won't receive updates.
	* Use `useQuery` to create a `QueryObserver` that subscribes to changes.
	*/ getQueryData(queryKey) {
        const options = this.defaultQueryOptions({
            queryKey
        });
        return this.#queryCache.get(options.queryHash)?.state.data;
    }
    /**
	* @deprecated Use queryClient.query({ ...options, staleTime: 'static' }) instead. This method will be removed in the next major version.
	*/ ensureQueryData(options) {
        const defaultedOptions = this.defaultQueryOptions(options);
        const query = this.#queryCache.build(this, defaultedOptions);
        const cachedData = query.state.data;
        if (cachedData === void 0) return this.fetchQuery(options);
        if (options.revalidateIfStale && query.isStaleByTime((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveQueryValue"])(defaultedOptions.staleTime, query))) this.prefetchQuery(defaultedOptions);
        return Promise.resolve(cachedData);
    }
    getQueriesData(filters) {
        return this.#queryCache.findAll(filters).map(({ queryKey, state })=>{
            return [
                queryKey,
                state.data
            ];
        });
    }
    setQueryData(queryKey, updater, options) {
        const defaultedOptions = this.defaultQueryOptions({
            queryKey
        });
        const prevData = this.#queryCache.get(defaultedOptions.queryHash)?.state.data;
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["functionalUpdate"])(updater, prevData);
        if (data === void 0) return;
        return this.#queryCache.build(this, defaultedOptions).setData(data, {
            ...options,
            manual: true
        });
    }
    setQueriesData(filters, updater, options) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>this.#queryCache.findAll(filters).map(({ queryKey })=>[
                    queryKey,
                    this.setQueryData(queryKey, updater, options)
                ]));
    }
    getQueryState(queryKey) {
        const options = this.defaultQueryOptions({
            queryKey
        });
        return this.#queryCache.get(options.queryHash)?.state;
    }
    removeQueries(filters) {
        const queryCache = this.#queryCache;
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            queryCache.findAll(filters).forEach((query)=>{
                queryCache.remove(query);
            });
        });
    }
    resetQueries(filters, options) {
        const queryCache = this.#queryCache;
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            const matched = queryCache.findAll(filters);
            const queriesToRefetch = new Set(matched);
            matched.forEach((query)=>{
                query.reset();
            });
            return this.refetchQueries({
                type: "active",
                predicate: (query)=>queriesToRefetch.has(query)
            }, options);
        });
    }
    cancelQueries(filters, cancelOptions = {}) {
        const defaultedCancelOptions = {
            revert: true,
            ...cancelOptions
        };
        const promises = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>this.#queryCache.findAll(filters).map((query)=>query.cancel(defaultedCancelOptions)));
        return Promise.all(promises).then(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]).catch(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]);
    }
    invalidateQueries(filters, options = {}) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.#queryCache.findAll(filters).forEach((query)=>{
                query.invalidate();
            });
            if (filters?.refetchType === "none") return Promise.resolve();
            return this.refetchQueries({
                ...filters,
                type: filters?.refetchType ?? filters?.type ?? "active"
            }, options);
        });
    }
    refetchQueries(filters, options = {}) {
        const fetchOptions = {
            ...options,
            cancelRefetch: options.cancelRefetch ?? true
        };
        const promises = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>this.#queryCache.findAll(filters).filter((query)=>!query.isDisabled() && !query.isStatic()).map((query)=>{
                let promise = query.fetch(void 0, fetchOptions);
                if (!fetchOptions.throwOnError) promise = promise.catch(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]);
                return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
            }));
        return Promise.all(promises).then(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]);
    }
    async query(options) {
        const defaultedOptions = this.defaultQueryOptions(options);
        if (defaultedOptions.retry === void 0) defaultedOptions.retry = false;
        const query = this.#queryCache.build(this, defaultedOptions);
        const queryData = query.isStaleByTime((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveQueryValue"])(defaultedOptions.staleTime, query)) ? await query.fetch(defaultedOptions) : query.state.data;
        const select = defaultedOptions.select;
        if (select) return select(queryData);
        return queryData;
    }
    /**
	* @deprecated Use queryClient.query(options) instead. This method will be removed in the next major version.
	*/ fetchQuery(options) {
        const defaultedOptions = this.defaultQueryOptions(options);
        if (defaultedOptions.retry === void 0) defaultedOptions.retry = false;
        const query = this.#queryCache.build(this, defaultedOptions);
        return query.isStaleByTime((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveQueryValue"])(defaultedOptions.staleTime, query)) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
    }
    /**
	* @deprecated Use queryClient.query(options) instead. You can swallow errors with `.catch(noop)`. This method will be removed in the next major version.
	*/ prefetchQuery(options) {
        return this.fetchQuery(options).then(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]).catch(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]);
    }
    infiniteQuery(options) {
        options._type = "infinite";
        return this.query(options);
    }
    /**
	* @deprecated Use queryClient.infiniteQuery(options) instead. This method will be removed in the next major version.
	*/ fetchInfiniteQuery(options) {
        options._type = "infinite";
        return this.fetchQuery(options);
    }
    /**
	* @deprecated Use queryClient.infiniteQuery(options) instead. You can swallow errors with `.catch(noop)`. This method will be removed in the next major version.
	*/ prefetchInfiniteQuery(options) {
        return this.fetchInfiniteQuery(options).then(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]).catch(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]);
    }
    /**
	* @deprecated Use queryClient.infiniteQuery({ ...options, staleTime: 'static' }) instead. This method will be removed in the next major version.
	*/ ensureInfiniteQueryData(options) {
        options._type = "infinite";
        return this.ensureQueryData(options);
    }
    resumePausedMutations() {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onlineManager"].isOnline()) return this.#mutationCache.resumePausedMutations();
        return Promise.resolve();
    }
    getQueryCache() {
        return this.#queryCache;
    }
    getMutationCache() {
        return this.#mutationCache;
    }
    getDefaultOptions() {
        return this.#defaultOptions;
    }
    setDefaultOptions(options) {
        this.#defaultOptions = options;
    }
    setQueryDefaults(queryKey, options) {
        this.#queryDefaults.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hashKey"])(queryKey), {
            queryKey,
            defaultOptions: options
        });
    }
    getQueryDefaults(queryKey) {
        const defaults = [
            ...this.#queryDefaults.values()
        ];
        const result = {};
        defaults.forEach((queryDefault)=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["partialMatchKey"])(queryKey, queryDefault.queryKey)) Object.assign(result, queryDefault.defaultOptions);
        });
        return result;
    }
    setMutationDefaults(mutationKey, options) {
        this.#mutationDefaults.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hashKey"])(mutationKey), {
            mutationKey,
            defaultOptions: options
        });
    }
    getMutationDefaults(mutationKey) {
        const defaults = [
            ...this.#mutationDefaults.values()
        ];
        const result = {};
        defaults.forEach((queryDefault)=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["partialMatchKey"])(mutationKey, queryDefault.mutationKey)) Object.assign(result, queryDefault.defaultOptions);
        });
        return result;
    }
    defaultQueryOptions(options) {
        if (options._defaulted) return options;
        const defaultedOptions = {
            ...this.#defaultOptions.queries,
            ...this.getQueryDefaults(options.queryKey),
            ...options,
            _defaulted: true
        };
        if (!defaultedOptions.queryHash) defaultedOptions.queryHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hashQueryKeyByOptions"])(defaultedOptions.queryKey, defaultedOptions);
        if (defaultedOptions.refetchOnReconnect === void 0) defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
        if (defaultedOptions.throwOnError === void 0) defaultedOptions.throwOnError = !!defaultedOptions.suspense;
        if (!defaultedOptions.networkMode && defaultedOptions.persister) defaultedOptions.networkMode = "offlineFirst";
        if (defaultedOptions.queryFn === __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["skipToken"]) defaultedOptions.enabled = false;
        return defaultedOptions;
    }
    defaultMutationOptions(options) {
        if (options?._defaulted) return options;
        return {
            ...this.#defaultOptions.mutations,
            ...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
            ...options,
            _defaulted: true
        };
    }
    clear() {
        this.#queryCache.clear();
        this.#mutationCache.clear();
    }
};
;
}),
"[project]/app/node_modules/@tanstack/query-core/build/modern/removable.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Removable",
    ()=>Removable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/timeoutManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$environmentManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/environmentManager.js [app-client] (ecmascript)");
;
;
;
//#region src/removable.ts
var Removable = class {
    #gcTimeout;
    destroy() {
        this.clearGcTimeout();
    }
    scheduleGc() {
        this.clearGcTimeout();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidTimeout"])(this.gcTime)) this.#gcTimeout = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeoutManager"].setTimeout(()=>{
            this.optionalRemove();
        }, this.gcTime);
    }
    updateGcTime(newGcTime) {
        this.gcTime = Math.max(this.gcTime || 0, newGcTime ?? ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$environmentManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isServer"])() ? Infinity : 3e5));
    }
    clearGcTimeout() {
        if (this.#gcTimeout !== void 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeoutManager"].clearTimeout(this.#gcTimeout);
            this.#gcTimeout = void 0;
        }
    }
};
;
}),
"[project]/app/node_modules/@tanstack/query-core/build/modern/retryer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CancelledError",
    ()=>CancelledError,
    "canFetch",
    ()=>canFetch,
    "createRetryer",
    ()=>createRetryer,
    "isCancelledError",
    ()=>isCancelledError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$environmentManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/environmentManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$focusManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/focusManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/onlineManager.js [app-client] (ecmascript)");
;
;
;
;
//#region src/retryer.ts
function defaultRetryDelay(failureCount) {
    return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
    return (networkMode ?? "online") === "online" ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onlineManager"].isOnline() : true;
}
var CancelledError = class extends Error {
    constructor(options){
        super("CancelledError");
        this.revert = options?.revert;
        this.silent = options?.silent;
    }
};
/**
* @deprecated Use instanceof `CancelledError` instead.
*/ function isCancelledError(value) {
    return value instanceof CancelledError;
}
function createRetryer(config) {
    let isRetryCancelled = false;
    let failureCount = 0;
    let continueFn;
    let status = "pending";
    let promiseResolve;
    let promiseReject;
    const promise = new Promise((resolve, reject)=>{
        promiseResolve = resolve;
        promiseReject = reject;
    });
    promise.catch(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]);
    const isResolved = ()=>status !== "pending";
    const cancel = (cancelOptions)=>{
        if (!isResolved()) {
            const error = new CancelledError(cancelOptions);
            reject(error);
            config.onCancel?.(error);
        }
    };
    const cancelRetry = ()=>{
        isRetryCancelled = true;
    };
    const continueRetry = ()=>{
        isRetryCancelled = false;
    };
    const canContinue = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$focusManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["focusManager"].isFocused() && (config.networkMode === "always" || __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onlineManager"].isOnline()) && config.canRun();
    const canStart = ()=>canFetch(config.networkMode) && config.canRun();
    const resolve = (value)=>{
        if (!isResolved()) {
            continueFn?.();
            status = "resolved";
            promiseResolve(value);
        }
    };
    const reject = (value)=>{
        if (!isResolved()) {
            continueFn?.();
            status = "rejected";
            promiseReject(value);
        }
    };
    const pause = ()=>{
        return new Promise((continueResolve)=>{
            continueFn = (value)=>{
                if (isResolved() || canContinue()) continueResolve(value);
            };
            config.onPause?.();
        }).then(()=>{
            continueFn = void 0;
            if (!isResolved()) config.onContinue?.();
        });
    };
    const run = ()=>{
        if (isResolved()) return;
        let promiseOrValue;
        const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
        try {
            promiseOrValue = initialPromise ?? config.fn();
        } catch (error) {
            promiseOrValue = Promise.reject(error);
        }
        Promise.resolve(promiseOrValue).then(resolve).catch((error)=>{
            if (isResolved()) return;
            const retry = config.retry ?? ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$environmentManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isServer"])() ? 0 : 3);
            const retryDelay = config.retryDelay ?? defaultRetryDelay;
            const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
            const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
            if (isRetryCancelled || !shouldRetry) {
                reject(error);
                return;
            }
            failureCount++;
            config.onFail?.(failureCount, error);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sleep"])(delay).then(()=>{
                return canContinue() ? void 0 : pause();
            }).then(()=>{
                if (isRetryCancelled) reject(error);
                else run();
            });
        });
    };
    return {
        promise,
        status: ()=>status,
        cancel,
        continue: ()=>{
            continueFn?.();
            return promise;
        },
        cancelRetry,
        continueRetry,
        canStart,
        start: ()=>{
            if (canStart()) run();
            else pause().then(run);
            return promise;
        }
    };
}
;
}),
"[project]/app/node_modules/@tanstack/query-core/build/modern/subscribable.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Subscribable",
    ()=>Subscribable
]);
//#region src/subscribable.ts
var Subscribable = class {
    constructor(){
        this.listeners = /* @__PURE__ */ new Set();
        this.subscribe = this.subscribe.bind(this);
    }
    subscribe(listener) {
        this.listeners.add(listener);
        this.onSubscribe();
        return ()=>{
            this.listeners.delete(listener);
            this.onUnsubscribe();
        };
    }
    hasListeners() {
        return this.listeners.size > 0;
    }
    onSubscribe() {}
    onUnsubscribe() {}
};
;
}),
"[project]/app/node_modules/@tanstack/query-core/build/modern/timeoutManager.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TimeoutManager",
    ()=>TimeoutManager,
    "defaultTimeoutProvider",
    ()=>defaultTimeoutProvider,
    "systemSetTimeoutZero",
    ()=>systemSetTimeoutZero,
    "timeoutManager",
    ()=>timeoutManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
//#region src/timeoutManager.ts
const defaultTimeoutProvider = {
    setTimeout: (callback, delay)=>setTimeout(callback, delay),
    clearTimeout: (timeoutId)=>clearTimeout(timeoutId),
    setInterval: (callback, delay)=>setInterval(callback, delay),
    clearInterval: (intervalId)=>clearInterval(intervalId)
};
/**
* Allows customization of how timeouts are created.
*
* @tanstack/query-core makes liberal use of timeouts to implement `staleTime`
* and `gcTime`. The default TimeoutManager provider uses the platform's global
* `setTimeout` implementation, which is known to have scalability issues with
* thousands of timeouts on the event loop.
*
* If you hit this limitation, consider providing a custom TimeoutProvider that
* coalesces timeouts.
*/ var TimeoutManager = class {
    #provider = defaultTimeoutProvider;
    #providerCalled = false;
    setTimeoutProvider(provider) {
        if ("TURBOPACK compile-time truthy", 1) {
            if (this.#providerCalled && provider !== this.#provider) console.error(`[timeoutManager]: Switching provider after calls to previous provider might result in unexpected behavior.`, {
                previous: this.#provider,
                provider
            });
        }
        this.#provider = provider;
        if (("TURBOPACK compile-time value", "development") !== "production") this.#providerCalled = false;
    }
    setTimeout(callback, delay) {
        if (("TURBOPACK compile-time value", "development") !== "production") this.#providerCalled = true;
        return this.#provider.setTimeout(callback, delay);
    }
    clearTimeout(timeoutId) {
        this.#provider.clearTimeout(timeoutId);
    }
    setInterval(callback, delay) {
        if (("TURBOPACK compile-time value", "development") !== "production") this.#providerCalled = true;
        return this.#provider.setInterval(callback, delay);
    }
    clearInterval(intervalId) {
        this.#provider.clearInterval(intervalId);
    }
};
const timeoutManager = new TimeoutManager();
/**
* In many cases code wants to delay to the next event loop tick; this is not
* mediated by {@link timeoutManager}.
*
* This function is provided to make auditing the `tanstack/query-core` for
* incorrect use of system `setTimeout` easier.
*/ function systemSetTimeoutZero(callback) {
    setTimeout(callback, 0);
}
;
}),
"[project]/app/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addConsumeAwareSignal",
    ()=>addConsumeAwareSignal,
    "addToEnd",
    ()=>addToEnd,
    "addToStart",
    ()=>addToStart,
    "ensureQueryFn",
    ()=>ensureQueryFn,
    "functionalUpdate",
    ()=>functionalUpdate,
    "hashKey",
    ()=>hashKey,
    "hashQueryKeyByOptions",
    ()=>hashQueryKeyByOptions,
    "isPlainArray",
    ()=>isPlainArray,
    "isPlainObject",
    ()=>isPlainObject,
    "isServer",
    ()=>isServer,
    "isValidTimeout",
    ()=>isValidTimeout,
    "keepPreviousData",
    ()=>keepPreviousData,
    "matchMutation",
    ()=>matchMutation,
    "matchQuery",
    ()=>matchQuery,
    "noop",
    ()=>noop,
    "partialMatchKey",
    ()=>partialMatchKey,
    "replaceData",
    ()=>replaceData,
    "replaceEqualDeep",
    ()=>replaceEqualDeep,
    "resolveQueryValue",
    ()=>resolveQueryValue,
    "shallowEqualObjects",
    ()=>shallowEqualObjects,
    "shouldThrowError",
    ()=>shouldThrowError,
    "skipToken",
    ()=>skipToken,
    "sleep",
    ()=>sleep,
    "timeUntilStale",
    ()=>timeUntilStale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/query-core/build/modern/timeoutManager.js [app-client] (ecmascript)");
;
//#region src/utils.ts
/** @deprecated
* use `environmentManager.isServer()` instead.
*/ const isServer = typeof window === "undefined" || "Deno" in globalThis;
function noop() {}
function functionalUpdate(updater, input) {
    return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
    return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
    return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveQueryValue(value, query) {
    return typeof value === "function" ? value(query) : value;
}
function matchQuery(filters, query) {
    const { type = "all", exact, fetchStatus, predicate, queryKey, stale } = filters;
    if (queryKey) {
        if (exact) {
            if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) return false;
        } else if (!partialMatchKey(query.queryKey, queryKey)) return false;
    }
    if (type !== "all") {
        const isActive = query.isActive();
        if (type === "active" && !isActive) return false;
        if (type === "inactive" && isActive) return false;
    }
    if (typeof stale === "boolean" && query.isStale() !== stale) return false;
    if (fetchStatus && fetchStatus !== query.state.fetchStatus) return false;
    if (predicate && !predicate(query)) return false;
    return true;
}
function matchMutation(filters, mutation) {
    const { exact, status, predicate, mutationKey } = filters;
    if (mutationKey) {
        if (!mutation.options.mutationKey) return false;
        if (exact) {
            if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) return false;
        } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) return false;
    }
    if (status && mutation.state.status !== status) return false;
    if (predicate && !predicate(mutation)) return false;
    return true;
}
function hashQueryKeyByOptions(queryKey, options) {
    return (options?.queryKeyHashFn || hashKey)(queryKey);
}
/**
* Default query & mutation keys hash function.
* Hashes the value into a stable hash.
*/ function hashKey(queryKey) {
    return JSON.stringify(queryKey, (_, val)=>isPlainObject(val) ? Object.keys(val).sort().reduce((result, key)=>{
            result[key] = val[key];
            return result;
        }, {}) : val);
}
function partialMatchKey(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a && b && typeof a === "object" && typeof b === "object") {
        if (Array.isArray(a) && Array.isArray(b)) {
            for(let i = 0; i < b.length; i++)if (!partialMatchKey(a[i], b[i])) return false;
            return true;
        }
        const bKeys = Object.keys(b);
        for (const key of bKeys)if (!partialMatchKey(a[key], b[key])) return false;
        return true;
    }
    return false;
}
const hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b, depth = 0) {
    if (a === b) return a;
    if (depth > 500) return b;
    const array = isPlainArray(a) && isPlainArray(b);
    if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
    const aSize = (array ? a : Object.keys(a)).length;
    const bItems = array ? b : Object.keys(b);
    const bSize = bItems.length;
    const copy = array ? new Array(bSize) : {};
    let equalItems = 0;
    for(let i = 0; i < bSize; i++){
        const key = array ? i : bItems[i];
        const aItem = a[key];
        const bItem = b[key];
        if (aItem === bItem) {
            copy[key] = aItem;
            if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
            continue;
        }
        if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
            copy[key] = bItem;
            continue;
        }
        const v = replaceEqualDeep(aItem, bItem, depth + 1);
        copy[key] = v;
        if (v === aItem) equalItems++;
    }
    return aSize === bSize && equalItems === aSize ? a : copy;
}
/**
* Shallow compare objects.
*/ function shallowEqualObjects(a, b) {
    if (!b || Object.keys(a).length !== Object.keys(b).length) return false;
    for(const key in a)if (a[key] !== b[key]) return false;
    return true;
}
function isPlainArray(value) {
    return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
    if (!hasObjectPrototype(o)) return false;
    const ctor = o.constructor;
    if (ctor === void 0) return true;
    const prot = ctor.prototype;
    if (!hasObjectPrototype(prot)) return false;
    if (!prot.hasOwnProperty("isPrototypeOf")) return false;
    if (Object.getPrototypeOf(o) !== Object.prototype) return false;
    return true;
}
function hasObjectPrototype(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
    return new Promise((resolve)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeoutManager"].setTimeout(resolve, timeout);
    });
}
function replaceData(prevData, data, options) {
    if (typeof options.structuralSharing === "function") return options.structuralSharing(prevData, data);
    else if (options.structuralSharing !== false) {
        if ("TURBOPACK compile-time truthy", 1) try {
            return replaceEqualDeep(prevData, data);
        } catch (error) {
            console.error(`Structural sharing requires data to be JSON serializable. To fix this, turn off structuralSharing or return JSON-serializable data from your queryFn. [${options.queryHash}]: ${error}`);
            throw error;
        }
        return replaceEqualDeep(prevData, data);
    }
    return data;
}
function keepPreviousData(previousData) {
    return previousData;
}
function addToEnd(items, item, max = 0) {
    const newItems = [
        ...items,
        item
    ];
    return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
    const newItems = [
        item,
        ...items
    ];
    return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
const skipToken = Symbol();
function ensureQueryFn(options, fetchOptions) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (options.queryFn === skipToken) console.error(`Attempted to invoke queryFn when set to skipToken. This is likely a configuration error. Query hash: '${options.queryHash}'`);
    }
    if (!options.queryFn && fetchOptions?.initialPromise) return ()=>fetchOptions.initialPromise;
    if (!options.queryFn || options.queryFn === skipToken) return ()=>Promise.reject(/* @__PURE__ */ new Error(`Missing queryFn: '${options.queryHash}'`));
    return options.queryFn;
}
function shouldThrowError(throwOnError, params) {
    if (typeof throwOnError === "function") return throwOnError(...params);
    return !!throwOnError;
}
function addConsumeAwareSignal(object, getSignal, onCancelled) {
    let consumed = false;
    let signal;
    Object.defineProperty(object, "signal", {
        enumerable: true,
        get: ()=>{
            signal ??= getSignal();
            if (consumed) return signal;
            consumed = true;
            if (signal.aborted) onCancelled();
            else signal.addEventListener("abort", onCancelled, {
                once: true
            });
            return signal;
        }
    });
    return object;
}
;
}),
"[project]/app/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryClientContext",
    ()=>QueryClientContext,
    "QueryClientProvider",
    ()=>QueryClientProvider,
    "useQueryClient",
    ()=>useQueryClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
;
;
//#region src/QueryClientProvider.tsx
const QueryClientContext = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](void 0);
const useQueryClient = (queryClient)=>{
    const client = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](QueryClientContext);
    if (queryClient) return queryClient;
    if (!client) throw new Error("No QueryClient set, use QueryClientProvider to set one");
    return client;
};
const QueryClientProvider = ({ client, children })=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "QueryClientProvider.useEffect": ()=>{
            client.mount();
            return ({
                "QueryClientProvider.useEffect": ()=>{
                    client.unmount();
                }
            })["QueryClientProvider.useEffect"];
        }
    }["QueryClientProvider.useEffect"], [
        client
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(QueryClientContext.Provider, {
        value: client,
        children
    });
};
;
}),
"[project]/app/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cva",
    ()=>cva,
    "cx",
    ()=>cx
]);
/**
 * Copyright 2022 Joe Bell. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR REPRESENTATIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
const falsyToString = (value)=>typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
const cx = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"];
const cva = (base, config)=>(props)=>{
        var _config_compoundVariants;
        if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
        const { variants, defaultVariants } = config;
        const getVariantClassNames = Object.keys(variants).map((variant)=>{
            const variantProp = props === null || props === void 0 ? void 0 : props[variant];
            const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
            if (variantProp === null) return null;
            const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
            return variants[variant][variantKey];
        });
        const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param)=>{
            let [key, value] = param;
            if (value === undefined) {
                return acc;
            }
            acc[key] = value;
            return acc;
        }, {});
        const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param)=>{
            let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
            return Object.entries(compoundVariantOptions).every((param)=>{
                let [key, value] = param;
                return Array.isArray(value) ? value.includes({
                    ...defaultVariants,
                    ...propsWithoutUndefined
                }[key]) : ({
                    ...defaultVariants,
                    ...propsWithoutUndefined
                })[key] === value;
            }) ? [
                ...acc,
                cvClass,
                cvClassName
            ] : acc;
        }, []);
        return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
    };
}),
"[project]/app/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clsx",
    ()=>clsx,
    "default",
    ()=>__TURBOPACK__default__export__
]);
function r(e) {
    var t, f, n = "";
    if ("string" == typeof e || "number" == typeof e) n += e;
    else if ("object" == typeof e) if (Array.isArray(e)) {
        var o = e.length;
        for(t = 0; t < o; t++)e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
    } else for(f in e)e[f] && (n && (n += " "), n += f);
    return n;
}
function clsx() {
    for(var e, t, f = 0, n = "", o = arguments.length; f < o; f++)(e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
    return n;
}
const __TURBOPACK__default__export__ = clsx;
}),
"[project]/app/node_modules/intl-messageformat/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorCode",
    ()=>ErrorCode,
    "FormatError",
    ()=>FormatError,
    "IntlMessageFormat",
    ()=>IntlMessageFormat,
    "InvalidValueError",
    ()=>InvalidValueError,
    "InvalidValueTypeError",
    ()=>InvalidValueTypeError,
    "MissingValueError",
    ()=>MissingValueError,
    "PART_TYPE",
    ()=>PART_TYPE,
    "default",
    ()=>intl_messageformat_default,
    "formatToParts",
    ()=>formatToParts,
    "isFormatXMLElementFn",
    ()=>isFormatXMLElementFn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$fast$2d$memoize$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@formatjs/fast-memoize/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$messageformat$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@formatjs/icu-messageformat-parser/index.js [app-client] (ecmascript)");
;
;
//#region packages/intl-messageformat/error.ts
let ErrorCode = /* @__PURE__ */ function(ErrorCode) {
    ErrorCode["MISSING_VALUE"] = "MISSING_VALUE";
    ErrorCode["INVALID_VALUE"] = "INVALID_VALUE";
    ErrorCode["MISSING_INTL_API"] = "MISSING_INTL_API";
    return ErrorCode;
}({});
var FormatError = class extends Error {
    constructor(msg, code, originalMessage){
        super(msg);
        this.code = code;
        this.originalMessage = originalMessage;
    }
    toString() {
        return `[formatjs Error: ${this.code}] ${this.message}`;
    }
};
var InvalidValueError = class extends FormatError {
    constructor(variableId, value, options, originalMessage){
        super(`Invalid values for "${variableId}": "${value}". Options are "${Object.keys(options).join("\", \"")}"`, "INVALID_VALUE", originalMessage);
    }
};
var InvalidValueTypeError = class extends FormatError {
    constructor(value, type, originalMessage){
        super(`Value for "${value}" must be of type ${type}`, "INVALID_VALUE", originalMessage);
    }
};
var MissingValueError = class extends FormatError {
    constructor(variableId, originalMessage){
        super(`The intl string context variable "${variableId}" was not provided to the string "${originalMessage}"`, "MISSING_VALUE", originalMessage);
    }
};
//#endregion
//#region packages/intl-messageformat/formatters.ts
let PART_TYPE = /* @__PURE__ */ function(PART_TYPE) {
    PART_TYPE[PART_TYPE["literal"] = 0] = "literal";
    PART_TYPE[PART_TYPE["object"] = 1] = "object";
    return PART_TYPE;
}({});
function mergeLiteral(parts) {
    if (parts.length < 2) return parts;
    return parts.reduce((all, part)=>{
        const lastPart = all[all.length - 1];
        if (!lastPart || lastPart.type !== 0 || part.type !== 0) all.push(part);
        else lastPart.value += part.value;
        return all;
    }, []);
}
function isFormatXMLElementFn(el) {
    return typeof el === "function";
}
function formatToParts(els, locales, formatters, formats, values, currentPluralValue, originalMessage) {
    if (els.length === 1 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$messageformat$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLiteralElement"])(els[0])) return [
        {
            type: 0,
            value: els[0].value
        }
    ];
    const result = [];
    for (const el of els){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$messageformat$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLiteralElement"])(el)) {
            result.push({
                type: 0,
                value: el.value
            });
            continue;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$messageformat$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPoundElement"])(el)) {
            if (typeof currentPluralValue === "number") result.push({
                type: 0,
                value: formatters.getNumberFormat(locales).format(currentPluralValue)
            });
            continue;
        }
        const { value: varName } = el;
        if (!(values && varName in values)) throw new MissingValueError(varName, originalMessage);
        let value = values[varName];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$messageformat$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArgumentElement"])(el)) {
            if (!value || typeof value === "string" || typeof value === "number" || typeof value === "bigint") value = typeof value === "string" || typeof value === "number" || typeof value === "bigint" ? String(value) : "";
            result.push({
                type: typeof value === "string" ? 0 : 1,
                value
            });
            continue;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$messageformat$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateElement"])(el)) {
            const style = typeof el.style === "string" ? formats.date[el.style] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$messageformat$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateTimeSkeleton"])(el.style) ? el.style.parsedOptions : void 0;
            result.push({
                type: 0,
                value: formatters.getDateTimeFormat(locales, style).format(value)
            });
            continue;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$messageformat$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTimeElement"])(el)) {
            const style = typeof el.style === "string" ? formats.time[el.style] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$messageformat$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateTimeSkeleton"])(el.style) ? el.style.parsedOptions : formats.time.medium;
            result.push({
                type: 0,
                value: formatters.getDateTimeFormat(locales, style).format(value)
            });
            continue;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$messageformat$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumberElement"])(el)) {
            const style = typeof el.style === "string" ? formats.number[el.style] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$messageformat$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumberSkeleton"])(el.style) ? el.style.parsedOptions : void 0;
            if (style && style.scale) {
                const scale = style.scale || 1;
                if (typeof value === "bigint") {
                    if (!Number.isInteger(scale)) throw new TypeError(`Cannot apply fractional scale ${scale} to bigint value. Scale must be an integer when formatting bigint.`);
                    value = value * BigInt(scale);
                } else value = value * scale;
            }
            result.push({
                type: 0,
                value: formatters.getNumberFormat(locales, style).format(value)
            });
            continue;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$messageformat$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTagElement"])(el)) {
            const { children, value } = el;
            const formatFn = values[value];
            if (!isFormatXMLElementFn(formatFn)) throw new InvalidValueTypeError(value, "function", originalMessage);
            let chunks = formatFn(formatToParts(children, locales, formatters, formats, values, currentPluralValue).map((p)=>p.value));
            if (!Array.isArray(chunks)) chunks = [
                chunks
            ];
            result.push(...chunks.map((c)=>{
                return {
                    type: typeof c === "string" ? 0 : 1,
                    value: c
                };
            }));
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$messageformat$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSelectElement"])(el)) {
            const key = value;
            const opt = (Object.prototype.hasOwnProperty.call(el.options, key) ? el.options[key] : void 0) || el.options.other;
            if (!opt) throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
            result.push(...formatToParts(opt.value, locales, formatters, formats, values));
            continue;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$messageformat$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPluralElement"])(el)) {
            const exactKey = `=${value}`;
            let opt = Object.prototype.hasOwnProperty.call(el.options, exactKey) ? el.options[exactKey] : void 0;
            if (!opt) {
                if (!Intl.PluralRules) throw new FormatError(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`, "MISSING_INTL_API", originalMessage);
                const numericValue = typeof value === "bigint" ? Number(value) : value;
                const rule = formatters.getPluralRules(locales, {
                    type: el.pluralType
                }).select(numericValue - (el.offset || 0));
                opt = (Object.prototype.hasOwnProperty.call(el.options, rule) ? el.options[rule] : void 0) || el.options.other;
            }
            if (!opt) throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
            const numericValue = typeof value === "bigint" ? Number(value) : value;
            result.push(...formatToParts(opt.value, locales, formatters, formats, values, numericValue - (el.offset || 0)));
            continue;
        }
    }
    return mergeLiteral(result);
}
//#endregion
//#region packages/intl-messageformat/core.ts
function mergeConfig(c1, c2) {
    if (!c2) return c1;
    return {
        ...c1,
        ...c2,
        ...Object.keys(c1).reduce((all, k)=>{
            all[k] = {
                ...c1[k],
                ...c2[k]
            };
            return all;
        }, {})
    };
}
function mergeConfigs(defaultConfig, configs) {
    if (!configs) return defaultConfig;
    return Object.keys(defaultConfig).reduce((all, k)=>{
        all[k] = mergeConfig(defaultConfig[k], configs[k]);
        return all;
    }, {
        ...defaultConfig
    });
}
function createFastMemoizeCache(store) {
    return {
        create () {
            return {
                get (key) {
                    return store[key];
                },
                set (key, value) {
                    store[key] = value;
                }
            };
        }
    };
}
function createDefaultFormatters(cache = {
    number: {},
    dateTime: {},
    pluralRules: {}
}) {
    return {
        getNumberFormat: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$fast$2d$memoize$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memoize"])((...args)=>new Intl.NumberFormat(...args), {
            cache: createFastMemoizeCache(cache.number),
            strategy: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$fast$2d$memoize$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["strategies"].variadic
        }),
        getDateTimeFormat: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$fast$2d$memoize$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memoize"])((...args)=>new Intl.DateTimeFormat(...args), {
            cache: createFastMemoizeCache(cache.dateTime),
            strategy: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$fast$2d$memoize$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["strategies"].variadic
        }),
        getPluralRules: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$fast$2d$memoize$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memoize"])((...args)=>new Intl.PluralRules(...args), {
            cache: createFastMemoizeCache(cache.pluralRules),
            strategy: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$fast$2d$memoize$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["strategies"].variadic
        })
    };
}
var IntlMessageFormat = class IntlMessageFormat {
    constructor(message, locales = IntlMessageFormat.defaultLocale, overrideFormats, opts){
        this.formatterCache = {
            number: {},
            dateTime: {},
            pluralRules: {}
        };
        this.format = (values)=>{
            const parts = this.formatToParts(values);
            if (parts.length === 1) return parts[0].value;
            const result = parts.reduce((all, part)=>{
                if (!all.length || part.type !== 0 || typeof all[all.length - 1] !== "string") all.push(part.value);
                else all[all.length - 1] += part.value;
                return all;
            }, []);
            if (result.length <= 1) return result[0] || "";
            return result;
        };
        this.formatToParts = (values)=>formatToParts(this.ast, this.locales, this.formatters, this.formats, values, void 0, this.message);
        this.resolvedOptions = ()=>({
                locale: this.resolvedLocale?.toString() || Intl.NumberFormat.supportedLocalesOf(this.locales)[0]
            });
        this.getAst = ()=>this.ast;
        this.locales = locales;
        this.resolvedLocale = IntlMessageFormat.resolveLocale(locales);
        if (typeof message === "string") {
            this.message = message;
            if (!IntlMessageFormat.__parse) throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
            const { ...parseOpts } = opts || {};
            this.ast = IntlMessageFormat.__parse(message, {
                ...parseOpts,
                locale: this.resolvedLocale
            });
        } else this.ast = message;
        if (!Array.isArray(this.ast)) throw new TypeError("A message must be provided as a String or AST.");
        this.formats = mergeConfigs(IntlMessageFormat.formats, overrideFormats);
        this.formatters = opts && opts.formatters || createDefaultFormatters(this.formatterCache);
    }
    static{
        this.memoizedDefaultLocale = null;
    }
    static get defaultLocale() {
        if (!IntlMessageFormat.memoizedDefaultLocale) IntlMessageFormat.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale;
        return IntlMessageFormat.memoizedDefaultLocale;
    }
    static{
        this.resolveLocale = (locales)=>{
            if (typeof Intl.Locale === "undefined") return;
            const supportedLocales = Intl.NumberFormat.supportedLocalesOf(locales);
            if (supportedLocales.length > 0) return new Intl.Locale(supportedLocales[0]);
            return new Intl.Locale(typeof locales === "string" ? locales : locales[0]);
        };
    }
    static{
        this.__parse = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$icu$2d$messageformat$2d$parser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parse"];
    }
    static{
        this.formats = {
            number: {
                integer: {
                    maximumFractionDigits: 0
                },
                currency: {
                    style: "currency"
                },
                percent: {
                    style: "percent"
                }
            },
            date: {
                short: {
                    month: "numeric",
                    day: "numeric",
                    year: "2-digit"
                },
                medium: {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                },
                long: {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                },
                full: {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }
            },
            time: {
                short: {
                    hour: "numeric",
                    minute: "numeric"
                },
                medium: {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric"
                },
                long: {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    timeZoneName: "short"
                },
                full: {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    timeZoneName: "short"
                }
            }
        };
    }
};
//#endregion
//#region packages/intl-messageformat/index.ts
var intl_messageformat_default = IntlMessageFormat;
;
}),
"[project]/app/node_modules/lucide-react/dist/esm/Icon.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Icon
]);
/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/defaultAttributes.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$hasA11yProp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$context$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/context.mjs [app-client] (ecmascript)");
"use strict";
"use client";
;
;
;
;
;
const Icon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ color, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref)=>{
    const { size: contextSize = 24, strokeWidth: contextStrokeWidth = 2, absoluteStrokeWidth: contextAbsoluteStrokeWidth = false, color: contextColor = "currentColor", className: contextClass = "" } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$context$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLucideContext"])() ?? {};
    const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("svg", {
        ref,
        ...__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        width: size ?? contextSize ?? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].width,
        height: size ?? contextSize ?? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].height,
        stroke: color ?? contextColor,
        strokeWidth: calculatedStrokeWidth,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])("lucide", contextClass, className),
        ...!children && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$hasA11yProp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasA11yProp"])(rest) && {
            "aria-hidden": "true"
        },
        ...rest
    }, [
        ...iconNode.map(([tag, attrs])=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(tag, attrs)),
        ...Array.isArray(children) ? children : [
            children
        ]
    ]);
});
;
}),
"[project]/app/node_modules/lucide-react/dist/esm/context.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LucideProvider",
    ()=>LucideProvider,
    "useLucideContext",
    ()=>useLucideContext
]);
/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use strict";
"use client";
;
const LucideContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({});
function LucideProvider({ children, size, color, strokeWidth, absoluteStrokeWidth, className }) {
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LucideProvider.useMemo[value]": ()=>({
                size,
                color,
                strokeWidth,
                absoluteStrokeWidth,
                className
            })
    }["LucideProvider.useMemo[value]"], [
        size,
        color,
        strokeWidth,
        absoluteStrokeWidth,
        className
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(LucideContext.Provider, {
        value
    }, children);
}
const useLucideContext = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(LucideContext);
;
}),
"[project]/app/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>createLucideIcon
]);
/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toKebabCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toPascalCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/Icon.mjs [app-client] (ecmascript)");
;
;
;
;
;
const createLucideIcon = (iconName, iconNode)=>{
    const Component = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            ref,
            iconNode,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])(`lucide-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toKebabCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toKebabCase"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toPascalCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName))}`, `lucide-${iconName}`, className),
            ...props
        }));
    Component.displayName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toPascalCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName);
    return Component;
};
;
}),
"[project]/app/node_modules/lucide-react/dist/esm/defaultAttributes.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>defaultAttributes
]);
/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
;
}),
"[project]/app/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>CircleCheck
]);
/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ],
    [
        "path",
        {
            d: "m9 12 2 2 4-4",
            key: "dzmm74"
        }
    ]
];
const CircleCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("circle-check", __iconNode);
;
}),
"[project]/app/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript) <export default as CircleCheckIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CircleCheckIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript)");
}),
"[project]/app/node_modules/lucide-react/dist/esm/icons/info.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Info
]);
/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ],
    [
        "path",
        {
            d: "M12 16v-4",
            key: "1dtifu"
        }
    ],
    [
        "path",
        {
            d: "M12 8h.01",
            key: "e9boi3"
        }
    ]
];
const Info = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("info", __iconNode);
;
}),
"[project]/app/node_modules/lucide-react/dist/esm/icons/info.mjs [app-client] (ecmascript) <export default as InfoIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InfoIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/info.mjs [app-client] (ecmascript)");
}),
"[project]/app/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>LoaderCircle
]);
/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M21 12a9 9 0 1 1-6.219-8.56",
            key: "13zald"
        }
    ]
];
const LoaderCircle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("loader-circle", __iconNode);
;
}),
"[project]/app/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2Icon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Loader2Icon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript)");
}),
"[project]/app/node_modules/lucide-react/dist/esm/icons/octagon-x.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>OctagonX
]);
/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m15 9-6 6",
            key: "1uzhvr"
        }
    ],
    [
        "path",
        {
            d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
            key: "2d38gg"
        }
    ],
    [
        "path",
        {
            d: "m9 9 6 6",
            key: "z0biqf"
        }
    ]
];
const OctagonX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("octagon-x", __iconNode);
;
}),
"[project]/app/node_modules/lucide-react/dist/esm/icons/octagon-x.mjs [app-client] (ecmascript) <export default as OctagonXIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OctagonXIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$octagon$2d$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$octagon$2d$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/octagon-x.mjs [app-client] (ecmascript)");
}),
"[project]/app/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>TriangleAlert
]);
/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
            key: "wmoenq"
        }
    ],
    [
        "path",
        {
            d: "M12 9v4",
            key: "juzpu7"
        }
    ],
    [
        "path",
        {
            d: "M12 17h.01",
            key: "p32p05"
        }
    ]
];
const TriangleAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("triangle-alert", __iconNode);
;
}),
"[project]/app/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-client] (ecmascript) <export default as TriangleAlertIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TriangleAlertIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-client] (ecmascript)");
}),
"[project]/app/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>X
]);
/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M18 6 6 18",
            key: "1bl5f8"
        }
    ],
    [
        "path",
        {
            d: "m6 6 12 12",
            key: "d8bk6v"
        }
    ]
];
const X = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("x", __iconNode);
;
}),
"[project]/app/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as XIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "XIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript)");
}),
"[project]/app/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasA11yProp",
    ()=>hasA11yProp
]);
/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const hasA11yProp = (props)=>{
    for(const prop in props){
        if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
            return true;
        }
    }
    return false;
};
;
}),
"[project]/app/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mergeClasses",
    ()=>mergeClasses
]);
/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const mergeClasses = (...classes)=>classes.filter((className, index, array)=>{
        return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
;
}),
"[project]/app/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toCamelCase",
    ()=>toCamelCase
]);
/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toCamelCase = (string)=>string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2)=>p2 ? p2.toUpperCase() : p1.toLowerCase());
;
}),
"[project]/app/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toKebabCase",
    ()=>toKebabCase
]);
/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toKebabCase = (string)=>string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
;
}),
"[project]/app/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toPascalCase",
    ()=>toPascalCase
]);
/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toCamelCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs [app-client] (ecmascript)");
;
const toPascalCase = (string)=>{
    const camelCase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toCamelCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toCamelCase"])(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
;
}),
"[project]/app/node_modules/next-intl/dist/esm/development/shared/NextIntlClientProvider.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NextIntlClientProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/use-intl/dist/esm/development/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
;
;
function NextIntlClientProvider({ locale, ...rest }) {
    if (!locale) {
        throw new Error("Couldn't infer the `locale` prop in `NextIntlClientProvider`, please provide it explicitly.\n\nSee https://next-intl.dev/docs/configuration#locale");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IntlProvider"], {
        locale: locale,
        ...rest
    });
}
;
}),
"[project]/app/node_modules/next/dist/client/request-idle-callback.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    cancelIdleCallback: null,
    requestIdleCallback: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    cancelIdleCallback: function() {
        return cancelIdleCallback;
    },
    requestIdleCallback: function() {
        return requestIdleCallback;
    }
});
const requestIdleCallback = typeof self !== 'undefined' && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(cb) {
    let start = Date.now();
    return self.setTimeout(function() {
        cb({
            didTimeout: false,
            timeRemaining: function() {
                return Math.max(0, 50 - (Date.now() - start));
            }
        });
    }, 1);
};
const cancelIdleCallback = typeof self !== 'undefined' && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function(id) {
    return clearTimeout(id);
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/app/node_modules/next/dist/client/script.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    handleClientScriptLoad: null,
    initScriptLoader: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    handleClientScriptLoad: function() {
        return handleClientScriptLoad;
    },
    initScriptLoader: function() {
        return initScriptLoader;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/app/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _interop_require_wildcard = __turbopack_context__.r("[project]/app/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/app/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _reactdom = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/app/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)"));
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _headmanagercontextsharedruntime = __turbopack_context__.r("[project]/app/node_modules/next/dist/shared/lib/head-manager-context.shared-runtime.js [app-client] (ecmascript)");
const _setattributesfromprops = __turbopack_context__.r("[project]/app/node_modules/next/dist/client/set-attributes-from-props.js [app-client] (ecmascript)");
const _requestidlecallback = __turbopack_context__.r("[project]/app/node_modules/next/dist/client/request-idle-callback.js [app-client] (ecmascript)");
const _htmlescape = __turbopack_context__.r("[project]/app/node_modules/next/dist/shared/lib/htmlescape.js [app-client] (ecmascript)");
const ScriptCache = new Map();
const LoadCache = new Set();
const insertStylesheets = (stylesheets)=>{
    // Case 1: Styles for afterInteractive/lazyOnload with appDir injected via handleClientScriptLoad
    //
    // Using ReactDOM.preinit to feature detect appDir and inject styles
    // Stylesheets might have already been loaded if initialized with Script component
    // Re-inject styles here to handle scripts loaded via handleClientScriptLoad
    // ReactDOM.preinit handles dedup and ensures the styles are loaded only once
    if (_reactdom.default.preinit) {
        stylesheets.forEach((stylesheet)=>{
            _reactdom.default.preinit(stylesheet, {
                as: 'style'
            });
        });
        return;
    }
    // Case 2: Styles for afterInteractive/lazyOnload with pages injected via handleClientScriptLoad
    //
    // We use this function to load styles when appdir is not detected
    // TODO: Use React float APIs to load styles once available for pages dir
    if (typeof window !== 'undefined') {
        let head = document.head;
        stylesheets.forEach((stylesheet)=>{
            let link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = stylesheet;
            head.appendChild(link);
        });
    }
};
const loadScript = (props)=>{
    const { src, id, onLoad = ()=>{}, onReady = null, dangerouslySetInnerHTML, children = '', strategy = 'afterInteractive', onError, stylesheets } = props;
    const cacheKey = id || src;
    // Script has already loaded
    if (cacheKey && LoadCache.has(cacheKey)) {
        return;
    }
    // Contents of this script are already loading/loaded
    if (ScriptCache.has(src)) {
        LoadCache.add(cacheKey);
        // It is possible that multiple `next/script` components all have same "src", but has different "onLoad"
        // This is to make sure the same remote script will only load once, but "onLoad" are executed in order
        ScriptCache.get(src).then(onLoad, onError);
        return;
    }
    /** Execute after the script first loaded */ const afterLoad = ()=>{
        // Run onReady for the first time after load event
        if (onReady) {
            onReady();
        }
        // add cacheKey to LoadCache when load successfully
        LoadCache.add(cacheKey);
    };
    const el = document.createElement('script');
    const loadPromise = new Promise((resolve, reject)=>{
        el.addEventListener('load', function(e) {
            resolve();
            if (onLoad) {
                onLoad.call(this, e);
            }
            afterLoad();
        });
        el.addEventListener('error', function(e) {
            reject(e);
        });
    }).catch(function(e) {
        if (onError) {
            onError(e);
        }
    });
    if (dangerouslySetInnerHTML) {
        // Casting since lib.dom.d.ts doesn't have TrustedHTML yet.
        el.innerHTML = dangerouslySetInnerHTML.__html || '';
        afterLoad();
    } else if (children) {
        el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
        afterLoad();
    } else if (src) {
        el.src = src;
        // do not add cacheKey into LoadCache for remote script here
        // cacheKey will be added to LoadCache when it is actually loaded (see loadPromise above)
        ScriptCache.set(src, loadPromise);
    }
    (0, _setattributesfromprops.setAttributesFromProps)(el, props);
    if (strategy === 'worker') {
        el.setAttribute('type', 'text/partytown');
    }
    el.setAttribute('data-nscript', strategy);
    // Load styles associated with this script
    if (stylesheets) {
        insertStylesheets(stylesheets);
    }
    document.body.appendChild(el);
};
function handleClientScriptLoad(props) {
    const { strategy = 'afterInteractive' } = props;
    if (strategy === 'lazyOnload') {
        window.addEventListener('load', ()=>{
            (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
        });
    } else {
        loadScript(props);
    }
}
function loadLazyScript(props) {
    if (document.readyState === 'complete') {
        (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
    } else {
        window.addEventListener('load', ()=>{
            (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
        });
    }
}
function addBeforeInteractiveToCache() {
    const scripts = [
        ...document.querySelectorAll('[data-nscript="beforeInteractive"]'),
        ...document.querySelectorAll('[data-nscript="beforePageRender"]')
    ];
    scripts.forEach((script)=>{
        const cacheKey = script.id || script.getAttribute('src');
        LoadCache.add(cacheKey);
    });
}
function initScriptLoader(scriptLoaderItems) {
    scriptLoaderItems.forEach(handleClientScriptLoad);
    addBeforeInteractiveToCache();
}
/**
 * Load a third-party scripts in an optimized way.
 *
 * Read more: [Next.js Docs: `next/script`](https://nextjs.org/docs/app/api-reference/components/script)
 */ function Script(props) {
    const { id, src = '', onLoad = ()=>{}, onReady = null, strategy = 'afterInteractive', onError, stylesheets, ...restProps } = props;
    // Context is available only during SSR
    let { updateScripts, scripts, getIsSsr, appDir, nonce } = (0, _react.useContext)(_headmanagercontextsharedruntime.HeadManagerContext);
    // if a nonce is explicitly passed to the script tag, favor that over the automatic handling
    nonce = restProps.nonce || nonce;
    /**
   * - First mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script hasn't loaded yet (not in LoadCache)
   *      onReady is skipped, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. hasLoadScriptEffectCalled.current is false, loadScript executes
   *      Once the script is loaded, the onLoad and onReady will be called by then
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   *
   * - Second mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script has already loaded (found in LoadCache)
   *      onReady is called, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. The script is already loaded, loadScript bails out
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   */ const hasOnReadyEffectCalled = (0, _react.useRef)(false);
    (0, _react.useEffect)(()=>{
        const cacheKey = id || src;
        if (!hasOnReadyEffectCalled.current) {
            // Run onReady if script has loaded before but component is re-mounted
            if (onReady && cacheKey && LoadCache.has(cacheKey)) {
                onReady();
            }
            hasOnReadyEffectCalled.current = true;
        }
    }, [
        onReady,
        id,
        src
    ]);
    const hasLoadScriptEffectCalled = (0, _react.useRef)(false);
    (0, _react.useEffect)(()=>{
        if (!hasLoadScriptEffectCalled.current) {
            if (strategy === 'afterInteractive') {
                loadScript(props);
            } else if (strategy === 'lazyOnload') {
                loadLazyScript(props);
            }
            hasLoadScriptEffectCalled.current = true;
        }
    }, [
        props,
        strategy
    ]);
    if (strategy === 'beforeInteractive' || strategy === 'worker') {
        if (updateScripts) {
            scripts[strategy] = (scripts[strategy] || []).concat([
                {
                    id,
                    src,
                    onLoad,
                    onReady,
                    onError,
                    ...restProps,
                    nonce
                }
            ]);
            updateScripts(scripts);
        } else if (getIsSsr && getIsSsr()) {
            // Script has already loaded during SSR
            LoadCache.add(id || src);
        } else if (getIsSsr && !getIsSsr()) {
            loadScript({
                ...props,
                nonce
            });
        }
    }
    // For the app directory, we need React Float to preload these scripts.
    if (appDir) {
        // Injecting stylesheets here handles beforeInteractive and worker scripts correctly
        // For other strategies injecting here ensures correct stylesheet order
        // ReactDOM.preinit handles loading the styles in the correct order,
        // also ensures the stylesheet is loaded only once and in a consistent manner
        //
        // Case 1: Styles for beforeInteractive/worker with appDir - handled here
        // Case 2: Styles for beforeInteractive/worker with pages dir - Not handled yet
        // Case 3: Styles for afterInteractive/lazyOnload with appDir - handled here
        // Case 4: Styles for afterInteractive/lazyOnload with pages dir - handled in insertStylesheets function
        if (stylesheets) {
            stylesheets.forEach((styleSrc)=>{
                _reactdom.default.preinit(styleSrc, {
                    as: 'style'
                });
            });
        }
        // Before interactive scripts need to be loaded by Next.js' runtime instead
        // of native <script> tags, because they no longer have `defer`.
        if (strategy === 'beforeInteractive') {
            if (!src) {
                // For inlined scripts, we put the content in `children`.
                if (restProps.dangerouslySetInnerHTML) {
                    // Casting since lib.dom.d.ts doesn't have TrustedHTML yet.
                    restProps.children = restProps.dangerouslySetInnerHTML.__html;
                    delete restProps.dangerouslySetInnerHTML;
                }
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                    nonce: nonce,
                    dangerouslySetInnerHTML: {
                        __html: `(self.__next_s=self.__next_s||[]).push(${(0, _htmlescape.htmlEscapeJsonString)(JSON.stringify([
                            0,
                            {
                                ...restProps,
                                id
                            }
                        ]))})`
                    }
                });
            } else {
                // @ts-ignore
                _reactdom.default.preload(src, restProps.integrity ? {
                    as: 'script',
                    integrity: restProps.integrity,
                    nonce,
                    crossOrigin: restProps.crossOrigin
                } : {
                    as: 'script',
                    nonce,
                    crossOrigin: restProps.crossOrigin
                });
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                    nonce: nonce,
                    dangerouslySetInnerHTML: {
                        __html: `(self.__next_s=self.__next_s||[]).push(${(0, _htmlescape.htmlEscapeJsonString)(JSON.stringify([
                            src,
                            {
                                ...restProps,
                                id
                            }
                        ]))})`
                    }
                });
            }
        } else if (strategy === 'afterInteractive') {
            if (src) {
                // @ts-ignore
                _reactdom.default.preload(src, restProps.integrity ? {
                    as: 'script',
                    integrity: restProps.integrity,
                    nonce,
                    crossOrigin: restProps.crossOrigin
                } : {
                    as: 'script',
                    nonce,
                    crossOrigin: restProps.crossOrigin
                });
            }
        }
    }
    return null;
}
Object.defineProperty(Script, '__nextScript', {
    value: true
});
const _default = Script;
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/app/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/app/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/app/node_modules/next/dist/shared/lib/htmlescape.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This utility is based on https://github.com/zertosh/htmlescape
// License: https://github.com/zertosh/htmlescape/blob/0527ca7156a524d256101bb310a9f970f63078ad/LICENSE
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ESCAPE_REGEX: null,
    htmlEscapeAttributeString: null,
    htmlEscapeJsonString: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ESCAPE_REGEX: function() {
        return ESCAPE_REGEX;
    },
    htmlEscapeAttributeString: function() {
        return htmlEscapeAttributeString;
    },
    htmlEscapeJsonString: function() {
        return htmlEscapeJsonString;
    }
});
const ESCAPE_LOOKUP = {
    '&': '\\u0026',
    '>': '\\u003e',
    '<': '\\u003c',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};
const ESCAPE_REGEX = /[&><\u2028\u2029]/g;
const ATTRIBUTE_ESCAPE_LOOKUP = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;',
    '<': '&lt;',
    '>': '&gt;'
};
const ATTRIBUTE_ESCAPE_REGEX = /[&"'<>]/g;
function htmlEscapeJsonString(str) {
    return str.replace(ESCAPE_REGEX, (match)=>ESCAPE_LOOKUP[match]);
}
function htmlEscapeAttributeString(str) {
    return str.replace(ATTRIBUTE_ESCAPE_REGEX, (match)=>ATTRIBUTE_ESCAPE_LOOKUP[match]);
}
}),
"[project]/app/node_modules/next/script.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/app/node_modules/next/dist/client/script.js [app-client] (ecmascript)");
}),
"[project]/app/node_modules/use-intl/dist/esm/development/core.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTranslator",
    ()=>createTranslator,
    "hasLocale",
    ()=>hasLocale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/use-intl/dist/esm/development/formatters-r4aAmsMP.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$initializeConfig$2d$CUsOI8u2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/use-intl/dist/esm/development/initializeConfig-CUsOI8u2.js [app-client] (ecmascript)");
;
;
;
;
function createTranslatorImpl({ messages, namespace, ...rest }, namespacePrefix) {
    // The `namespacePrefix` is part of the type system.
    // See the comment in the function invocation.
    messages = messages[namespacePrefix];
    namespace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$initializeConfig$2d$CUsOI8u2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["r"])(namespace, namespacePrefix);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$initializeConfig$2d$CUsOI8u2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"])({
        ...rest,
        messages,
        namespace
    });
}
// This type is slightly more loose than `AbstractIntlMessages`
// in order to avoid a type error.
/**
 * @private Not intended for direct use.
 */ /**
 * Translates messages from the given namespace by using the ICU syntax.
 * See https://formatjs.io/docs/core-concepts/icu-syntax.
 *
 * If no namespace is provided, all available messages are returned.
 * The namespace can also indicate nesting by using a dot
 * (e.g. `namespace.Component`).
 */ function createTranslator({ _cache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["b"])(), _formatters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(_cache), getMessageFallback = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$initializeConfig$2d$CUsOI8u2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"], messages, namespace, onError = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$initializeConfig$2d$CUsOI8u2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["b"], ...rest }) {
    // We have to wrap the actual function so the type inference for the optional
    // namespace works correctly. See https://stackoverflow.com/a/71529575/343045
    // The prefix ("!") is arbitrary.
    // @ts-expect-error Use the explicit annotation instead
    return createTranslatorImpl({
        ...rest,
        onError,
        cache: _cache,
        formatters: _formatters,
        getMessageFallback,
        // @ts-expect-error `messages` is allowed to be `undefined` here and will be handled internally
        messages: {
            '!': messages
        },
        namespace: namespace ? `!.${namespace}` : '!'
    }, '!');
}
/**
 * Checks if a locale exists in a list of locales.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale
 */ function hasLocale(locales, candidate) {
    return locales.includes(candidate);
}
;
}),
"[project]/app/node_modules/use-intl/dist/esm/development/format-message/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>formatMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$intl$2d$messageformat$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/intl-messageformat/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/use-intl/dist/esm/development/formatters-r4aAmsMP.js [app-client] (ecmascript)");
;
;
;
/**
 * `intl-messageformat` uses separate keys for `date` and `time`, but there's
 * only one native API: `Intl.DateTimeFormat`. Additionally you might want to
 * include both a time and a date in a value, therefore the separation doesn't
 * seem so useful. We offer a single `dateTime` namespace instead, but we have
 * to convert the format before `intl-messageformat` can be used.
 */ function convertFormatsToIntlMessageFormat(globalFormats, inlineFormats, timeZone) {
    const mfDateDefaults = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$intl$2d$messageformat$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IntlMessageFormat"].formats.date;
    const mfTimeDefaults = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$intl$2d$messageformat$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IntlMessageFormat"].formats.time;
    const dateTimeFormats = {
        ...globalFormats?.dateTime,
        ...inlineFormats?.dateTime
    };
    const allFormats = {
        date: {
            ...mfDateDefaults,
            ...dateTimeFormats
        },
        time: {
            ...mfTimeDefaults,
            ...dateTimeFormats
        },
        number: {
            ...globalFormats?.number,
            ...inlineFormats?.number
        }
    };
    if (timeZone) {
        // The only way to set a time zone with `intl-messageformat` is to merge it into the formats
        // https://github.com/formatjs/formatjs/blob/8256c5271505cf2606e48e3c97ecdd16ede4f1b5/packages/intl/src/message.ts#L15
        [
            'date',
            'time'
        ].forEach((property)=>{
            const formats = allFormats[property];
            for (const [key, value] of Object.entries(formats)){
                formats[key] = {
                    timeZone,
                    ...value
                };
            }
        });
    }
    return allFormats;
}
// Placed here for improved tree shaking. Somehow when this is placed in
// `formatters.tsx`, then it can't be shaken off from `next-intl`.
function createMessageFormatter(cache, intlFormatters) {
    const getMessageFormat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["m"])((...args)=>new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$intl$2d$messageformat$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IntlMessageFormat"](args[0], args[1], args[2], {
            formatters: intlFormatters,
            ...args[3]
        }), cache.message);
    return getMessageFormat;
}
function getPlainMessage(candidate, values) {
    // To improve runtime performance, only compile message if:
    return(// 1. Values are provided
    values || // 2. There are ICU escape sequences (e.g. "'{name'}")
    /'[{}<#|']/.test(candidate) || // 3. There are missing arguments or tags (dev-only error handling)
    /<|{/.test(candidate) ? undefined // Compile
     : candidate // Don't compile
    );
}
/**
 * Compiles and formats an ICU message at runtime using intl-messageformat.
 * This is the default implementation used when messages are not precompiled.
 */ function formatMessage(/** The raw ICU message string (or precompiled message, though this implementation ignores precompilation) */ ...[key, message, values, options]) {
    if (Array.isArray(message)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"](__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].INVALID_MESSAGE, `Message at \`${key}\` resolved to an array, but only strings are supported. See https://next-intl.dev/docs/usage/translations#arrays-of-messages`);
    }
    if (typeof message === 'object') {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"](__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].INSUFFICIENT_PATH, `Message at \`${key}\` resolved to \`${typeof message}\`, but only strings are supported. Use a \`.\` to retrieve nested messages. See https://next-intl.dev/docs/usage/translations#structuring-messages`);
    }
    // Hot path that avoids creating an `IntlMessageFormat` instance
    if (typeof message === 'string') {
        const plainMessage = getPlainMessage(message, values);
        if (plainMessage) return plainMessage;
    }
    const { cache, formats, formatters, globalFormats, locale, timeZone } = options;
    // Lazy init the message formatter for better tree
    // shaking in case message formatting is not used.
    if (!formatters.getMessageFormat) {
        formatters.getMessageFormat = createMessageFormatter(cache, formatters);
    }
    let messageFormat;
    try {
        messageFormat = formatters.getMessageFormat(message, locale, convertFormatsToIntlMessageFormat(globalFormats, formats, timeZone), {
            formatters: {
                ...formatters,
                getDateTimeFormat (locales, dateTimeOptions) {
                    // Workaround for https://github.com/formatjs/formatjs/issues/4279
                    return formatters.getDateTimeFormat(locales, {
                        ...dateTimeOptions,
                        timeZone: dateTimeOptions?.timeZone ?? timeZone
                    });
                }
            }
        });
    } catch (error) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"](__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].INVALID_MESSAGE, `${error.message} (${error.originalMessage})`);
    }
    const formattedMessage = messageFormat.format(// @ts-expect-error `intl-messageformat` expects a different format
    // for rich text elements since a recent minor update. This
    // needs to be evaluated in detail, possibly also in regard
    // to be able to format to parts.
    values);
    // Limit the function signature to return strings or React elements
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(formattedMessage) || // Arrays of React elements
    Array.isArray(formattedMessage) || typeof formattedMessage === 'string' ? formattedMessage : String(formattedMessage);
}
// `t.raw` is supported
formatMessage.raw = true;
;
}),
"[project]/app/node_modules/use-intl/dist/esm/development/formatters-r4aAmsMP.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "I",
    ()=>IntlError,
    "a",
    ()=>IntlErrorCode,
    "b",
    ()=>createCache,
    "c",
    ()=>createIntlFormatters,
    "m",
    ()=>memoFn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$fast$2d$memoize$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@formatjs/fast-memoize/index.js [app-client] (ecmascript)");
;
class IntlError extends Error {
    constructor(code, originalMessage){
        let message = code;
        if (originalMessage) {
            message += ': ' + originalMessage;
        }
        super(message);
        this.code = code;
        if (originalMessage) {
            this.originalMessage = originalMessage;
        }
    }
}
var IntlErrorCode = /*#__PURE__*/ function(IntlErrorCode) {
    IntlErrorCode["MISSING_MESSAGE"] = "MISSING_MESSAGE";
    IntlErrorCode["MISSING_FORMAT"] = "MISSING_FORMAT";
    IntlErrorCode["ENVIRONMENT_FALLBACK"] = "ENVIRONMENT_FALLBACK";
    IntlErrorCode["INSUFFICIENT_PATH"] = "INSUFFICIENT_PATH";
    IntlErrorCode["INVALID_MESSAGE"] = "INVALID_MESSAGE";
    IntlErrorCode["INVALID_KEY"] = "INVALID_KEY";
    IntlErrorCode["FORMATTING_ERROR"] = "FORMATTING_ERROR";
    return IntlErrorCode;
}(IntlErrorCode || {});
function createCache() {
    return {
        dateTime: {},
        number: {},
        message: {},
        relativeTime: {},
        pluralRules: {},
        list: {},
        displayNames: {}
    };
}
function createMemoCache(store) {
    return {
        create () {
            return {
                get (key) {
                    return store[key];
                },
                set (key, value) {
                    store[key] = value;
                }
            };
        }
    };
}
function memoFn(fn, cache) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$fast$2d$memoize$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memoize"])(fn, {
        cache: createMemoCache(cache),
        strategy: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$formatjs$2f$fast$2d$memoize$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["strategies"].variadic
    });
}
function memoConstructor(ConstructorFn, cache) {
    return memoFn((...args)=>new ConstructorFn(...args), cache);
}
function createIntlFormatters(cache) {
    const getDateTimeFormat = memoConstructor(Intl.DateTimeFormat, cache.dateTime);
    const getNumberFormat = memoConstructor(Intl.NumberFormat, cache.number);
    const getPluralRules = memoConstructor(Intl.PluralRules, cache.pluralRules);
    const getRelativeTimeFormat = memoConstructor(Intl.RelativeTimeFormat, cache.relativeTime);
    const getListFormat = memoConstructor(Intl.ListFormat, cache.list);
    const getDisplayNames = memoConstructor(Intl.DisplayNames, cache.displayNames);
    return {
        getDateTimeFormat,
        getNumberFormat,
        getPluralRules,
        getRelativeTimeFormat,
        getListFormat,
        getDisplayNames
    };
}
;
}),
"[project]/app/node_modules/use-intl/dist/esm/development/initializeConfig-CUsOI8u2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>createBaseTranslator,
    "b",
    ()=>defaultOnError,
    "c",
    ()=>createFormatter,
    "d",
    ()=>defaultGetMessageFallback,
    "i",
    ()=>initializeConfig,
    "r",
    ()=>resolveNamespace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$format$2d$message$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/use-intl/dist/esm/development/format-message/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/use-intl/dist/esm/development/formatters-r4aAmsMP.js [app-client] (ecmascript)");
;
;
;
function joinPath(...parts) {
    return parts.filter(Boolean).join('.');
}
/**
 * Contains defaults that are used for all entry points into the core.
 * See also `InitializedIntlConfiguration`.
 */ function defaultGetMessageFallback(props) {
    return joinPath(props.namespace, props.key);
}
function defaultOnError(error) {
    console.error(error);
}
function prepareTranslationValues(values) {
    // Related to https://github.com/formatjs/formatjs/issues/1467
    const transformedValues = {};
    Object.keys(values).forEach((key)=>{
        let index = 0;
        const value = values[key];
        let transformed;
        if (typeof value === 'function') {
            transformed = (chunks)=>{
                const result = value(chunks);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(result) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"])(result, {
                    key: key + index++
                }) : result;
            };
        } else {
            transformed = value;
        }
        transformedValues[key] = transformed;
    });
    return transformedValues;
}
function resolvePath(locale, messages, key, namespace) {
    const fullKey = joinPath(namespace, key);
    if (!messages) {
        throw new Error(`No messages available at \`${namespace}\`.`);
    }
    let message = messages;
    key.split('.').forEach((part)=>{
        const next = message[part];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (part == null || next == null) {
            throw new Error(`Could not resolve \`${fullKey}\` in messages for locale \`${locale}\`.`);
        }
        message = next;
    });
    return message;
}
function getMessagesOrError(locale, messages, namespace) {
    try {
        if (!messages) {
            throw new Error(`No messages were configured.`);
        }
        const retrievedMessages = namespace ? resolvePath(locale, messages, namespace) : messages;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!retrievedMessages) {
            throw new Error(`No messages for namespace \`${namespace}\` found.`);
        }
        return retrievedMessages;
    } catch (error) {
        const intlError = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"](__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].MISSING_MESSAGE, error.message);
        return intlError;
    }
}
function createBaseTranslator(config) {
    const messagesOrError = getMessagesOrError(config.locale, config.messages, config.namespace);
    return createBaseTranslatorImpl({
        ...config,
        messagesOrError
    });
}
function createBaseTranslatorImpl({ cache, formats: globalFormats, formatters, getMessageFallback = defaultGetMessageFallback, locale, messagesOrError, namespace, onError, timeZone }) {
    const hasMessagesError = messagesOrError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"];
    function getFallbackFromErrorAndNotify(key, code, message, fallback) {
        const error = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"](code, message);
        onError(error);
        return fallback ?? getMessageFallback({
            error,
            key,
            namespace
        });
    }
    function translateBaseFn(/** Use a dot to indicate a level of nesting (e.g. `namespace.nestedLabel`). */ key, /** Key value pairs for values to interpolate into the message. */ values, /** Provide custom formats for numbers, dates and times. */ formats, _fallback) {
        const fallback = _fallback;
        let message;
        if (hasMessagesError) {
            if (fallback) {
                message = fallback;
            } else {
                onError(messagesOrError);
                return getMessageFallback({
                    error: messagesOrError,
                    key,
                    namespace
                });
            }
        } else {
            const messages = messagesOrError;
            try {
                message = resolvePath(locale, messages, key, namespace);
            } catch (error) {
                if (fallback) {
                    message = fallback;
                } else {
                    return getFallbackFromErrorAndNotify(key, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].MISSING_MESSAGE, error.message, fallback);
                }
            }
        }
        try {
            const messagePath = joinPath(namespace, key);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$format$2d$message$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(messagePath, // @ts-expect-error -- We have additional validation either in `compile-format.tsx` or in case of `format-only.tsx` in the loader
            message, values ? prepareTranslationValues(values) : values, {
                cache,
                formatters,
                globalFormats,
                formats,
                locale,
                timeZone
            });
        } catch (error) {
            let errorCode, errorMessage;
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"]) {
                errorCode = error.code;
                errorMessage = error.originalMessage;
            } else {
                errorCode = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].FORMATTING_ERROR;
                errorMessage = error.message;
            }
            return getFallbackFromErrorAndNotify(key, errorCode, errorMessage, fallback);
        }
    }
    function translateFn(/** Use a dot to indicate a level of nesting (e.g. `namespace.nestedLabel`). */ key, /** Key value pairs for values to interpolate into the message. */ values, /** Custom formats for numbers, dates and times. */ formats, _fallback) {
        const result = translateBaseFn(key, values, formats, _fallback);
        if (typeof result !== 'string') {
            return getFallbackFromErrorAndNotify(key, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].INVALID_MESSAGE, `The message \`${key}\` in ${namespace ? `namespace \`${namespace}\`` : 'messages'} didn't resolve to a string. If you want to format rich text, use \`t.rich\` instead.`);
        }
        return result;
    }
    translateFn.rich = translateBaseFn;
    // Augment `translateBaseFn` to return plain strings
    translateFn.markup = (key, values, formats, _fallback)=>{
        const result = translateBaseFn(key, // @ts-expect-error -- `MarkupTranslationValues` is practically a sub type
        // of `RichTranslationValues` but TypeScript isn't smart enough here.
        values, formats, _fallback);
        if (typeof result !== 'string') {
            const error = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"](__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].FORMATTING_ERROR, "`t.markup` only accepts functions for formatting that receive and return strings.\n\nE.g. t.markup('markup', {b: (chunks) => `<b>${chunks}</b>`})");
            onError(error);
            return getMessageFallback({
                error,
                key,
                namespace
            });
        }
        return result;
    };
    translateFn.raw = (key)=>{
        {
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$format$2d$message$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].raw) {
                throw new Error('`t.raw` is not supported when messages are precompiled.');
            }
        }
        if (hasMessagesError) {
            onError(messagesOrError);
            return getMessageFallback({
                error: messagesOrError,
                key,
                namespace
            });
        }
        const messages = messagesOrError;
        try {
            return resolvePath(locale, messages, key, namespace);
        } catch (error) {
            return getFallbackFromErrorAndNotify(key, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].MISSING_MESSAGE, error.message);
        }
    };
    translateFn.has = (key)=>{
        if (hasMessagesError) {
            return false;
        }
        try {
            resolvePath(locale, messagesOrError, key, namespace);
            return true;
        } catch  {
            return false;
        }
    };
    return translateFn;
}
/**
 * For the strictly typed messages to work we have to wrap the namespace into
 * a mandatory prefix. See https://stackoverflow.com/a/71529575/343045
 */ function resolveNamespace(namespace, namespacePrefix) {
    return namespace === namespacePrefix ? undefined : namespace.slice((namespacePrefix + '.').length);
}
const SECOND = 1;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * (365 / 12); // Approximation
const QUARTER = MONTH * 3;
const YEAR = DAY * 365;
const UNIT_SECONDS = {
    second: SECOND,
    seconds: SECOND,
    minute: MINUTE,
    minutes: MINUTE,
    hour: HOUR,
    hours: HOUR,
    day: DAY,
    days: DAY,
    week: WEEK,
    weeks: WEEK,
    month: MONTH,
    months: MONTH,
    quarter: QUARTER,
    quarters: QUARTER,
    year: YEAR,
    years: YEAR
};
function resolveRelativeTimeUnit(seconds) {
    const absValue = Math.abs(seconds);
    if (absValue < MINUTE) {
        return 'second';
    } else if (absValue < HOUR) {
        return 'minute';
    } else if (absValue < DAY) {
        return 'hour';
    } else if (absValue < WEEK) {
        return 'day';
    } else if (absValue < MONTH) {
        return 'week';
    } else if (absValue < YEAR) {
        return 'month';
    }
    return 'year';
}
function calculateRelativeTimeValue(seconds, unit) {
    // We have to round the resulting values, as `Intl.RelativeTimeFormat`
    // will include fractions like '2.1 hours ago'.
    return Math.round(seconds / UNIT_SECONDS[unit]);
}
function createFormatter(props) {
    const { _cache: cache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["b"])(), _formatters: formatters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(cache), formats, locale, onError = defaultOnError, timeZone: globalTimeZone } = props;
    function applyTimeZone(options) {
        if (!options?.timeZone) {
            if (globalTimeZone) {
                options = {
                    ...options,
                    timeZone: globalTimeZone
                };
            } else {
                onError(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"](__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].ENVIRONMENT_FALLBACK, `The \`timeZone\` parameter wasn't provided and there is no global default configured. Consider adding a global default to avoid markup mismatches caused by environment differences. Learn more: https://next-intl.dev/docs/configuration#time-zone`));
            }
        }
        return options;
    }
    function resolveFormatOrOptions(typeFormats, formatOrOptions, overrides) {
        let options;
        if (typeof formatOrOptions === 'string') {
            const formatName = formatOrOptions;
            options = typeFormats?.[formatName];
            if (!options) {
                const error = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"](__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].MISSING_FORMAT, `Format \`${formatName}\` is not available.`);
                onError(error);
                throw error;
            }
        } else {
            options = formatOrOptions;
        }
        if (overrides) {
            options = {
                ...options,
                ...overrides
            };
        }
        return options;
    }
    function getFormattedValue(formatOrOptions, overrides, typeFormats, formatter, getFallback) {
        let options;
        try {
            options = resolveFormatOrOptions(typeFormats, formatOrOptions, overrides);
        } catch  {
            return getFallback();
        }
        try {
            return formatter(options);
        } catch (error) {
            onError(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"](__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].FORMATTING_ERROR, error.message));
            return getFallback();
        }
    }
    function dateTime(value, formatOrOptions, overrides) {
        return getFormattedValue(formatOrOptions, overrides, formats?.dateTime, (options)=>{
            options = applyTimeZone(options);
            return formatters.getDateTimeFormat(locale, options).format(value);
        }, ()=>String(value));
    }
    function dateTimeRange(start, end, formatOrOptions, overrides) {
        return getFormattedValue(formatOrOptions, overrides, formats?.dateTime, (options)=>{
            options = applyTimeZone(options);
            return formatters.getDateTimeFormat(locale, options).formatRange(start, end);
        }, ()=>[
                dateTime(start),
                dateTime(end)
            ].join(' – '));
    }
    function number(value, formatOrOptions, overrides) {
        return getFormattedValue(formatOrOptions, overrides, formats?.number, (options)=>formatters.getNumberFormat(locale, options).format(value), ()=>String(value));
    }
    function getGlobalNow() {
        // Only read when necessary to avoid triggering a `dynamicIO` error
        // unnecessarily (`now` is only needed for `format.relativeTime`)
        if (props.now) {
            return props.now;
        } else {
            onError(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"](__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].ENVIRONMENT_FALLBACK, `The \`now\` parameter wasn't provided to \`relativeTime\` and there is no global default configured, therefore the current time will be used as a fallback. See https://next-intl.dev/docs/usage/dates-times#relative-times-usenow`));
            return new Date();
        }
    }
    function relativeTime(date, nowOrOptions) {
        try {
            let nowDate, unit;
            const opts = {};
            if (nowOrOptions instanceof Date || typeof nowOrOptions === 'number') {
                nowDate = new Date(nowOrOptions);
            } else if (nowOrOptions) {
                if (nowOrOptions.now != null) {
                    nowDate = new Date(nowOrOptions.now);
                } else {
                    nowDate = getGlobalNow();
                }
                unit = nowOrOptions.unit;
                opts.style = nowOrOptions.style;
                // @ts-expect-error -- Types are slightly outdated
                opts.numberingSystem = nowOrOptions.numberingSystem;
            }
            if (!nowDate) {
                nowDate = getGlobalNow();
            }
            const dateDate = new Date(date);
            const seconds = (dateDate.getTime() - nowDate.getTime()) / 1000;
            if (!unit) {
                unit = resolveRelativeTimeUnit(seconds);
            }
            // `numeric: 'auto'` can theoretically produce output like "yesterday",
            // but it only works with integers. E.g. -1 day will produce "yesterday",
            // but -1.1 days will produce "-1.1 days". Rounding before formatting is
            // not desired, as the given dates might cross a threshold were the
            // output isn't correct anymore. Example: 2024-01-08T23:00:00.000Z and
            // 2024-01-08T01:00:00.000Z would produce "yesterday", which is not the
            // case. By using `always` we can ensure correct output. The only exception
            // is the formatting of times <1 second as "now".
            opts.numeric = unit === 'second' ? 'auto' : 'always';
            const value = calculateRelativeTimeValue(seconds, unit);
            return formatters.getRelativeTimeFormat(locale, opts).format(value, unit);
        } catch (error) {
            onError(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"](__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].FORMATTING_ERROR, error.message));
            return String(date);
        }
    }
    function list(value, formatOrOptions, overrides) {
        const serializedValue = [];
        const richValues = new Map();
        // `formatToParts` only accepts strings, therefore we have to temporarily
        // replace React elements with a placeholder ID that can be used to retrieve
        // the original value afterwards.
        let index = 0;
        for (const item of value){
            let serializedItem;
            if (typeof item === 'object') {
                serializedItem = String(index);
                richValues.set(serializedItem, item);
            } else {
                serializedItem = String(item);
            }
            serializedValue.push(serializedItem);
            index++;
        }
        return getFormattedValue(formatOrOptions, overrides, formats?.list, // @ts-expect-error -- `richValues.size` is used to determine the return type, but TypeScript can't infer the meaning of this correctly
        (options)=>{
            const result = formatters.getListFormat(locale, options).formatToParts(serializedValue).map((part)=>part.type === 'literal' ? part.value : richValues.get(part.value) || part.value);
            if (richValues.size > 0) {
                return result;
            } else {
                return result.join('');
            }
        }, ()=>String(value));
    }
    function displayName(value, formatOrOptions, overrides) {
        return getFormattedValue(formatOrOptions, overrides, formats?.displayName, (options)=>// `options` is guaranteed non-null because our overloads require
            // either inline options or a named format that resolves to options.
            formatters.getDisplayNames(locale, options).of(value), ()=>value);
    }
    return {
        dateTime,
        number,
        relativeTime,
        list,
        dateTimeRange,
        displayName
    };
}
function validateMessagesSegment(messages, invalidKeyLabels, parentPath) {
    Object.entries(messages).forEach(([key, messageOrMessages])=>{
        if (key.includes('.')) {
            let keyLabel = key;
            if (parentPath) keyLabel += ` (at ${parentPath})`;
            invalidKeyLabels.push(keyLabel);
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (messageOrMessages != null && typeof messageOrMessages === 'object') {
            validateMessagesSegment(messageOrMessages, invalidKeyLabels, joinPath(parentPath, key));
        }
    });
}
function validateMessages(messages, onError) {
    const invalidKeyLabels = [];
    validateMessagesSegment(messages, invalidKeyLabels);
    if (invalidKeyLabels.length > 0) {
        onError(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"](__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].INVALID_KEY, `Namespace keys cannot contain the character "." as this is used to express nesting. Please remove it or replace it with another character.

Invalid ${invalidKeyLabels.length === 1 ? 'key' : 'keys'}: ${invalidKeyLabels.join(', ')}

If you're migrating from a flat structure, you can convert your messages as follows:

import {set} from "lodash";

const input = {
  "one.one": "1.1",
  "one.two": "1.2",
  "two.one.one": "2.1.1"
};

const output = Object.entries(input).reduce(
  (acc, [key, value]) => set(acc, key, value),
  {}
);

// Output:
//
// {
//   "one": {
//     "one": "1.1",
//     "two": "1.2"
//   },
//   "two": {
//     "one": {
//       "one": "2.1.1"
//     }
//   }
// }
`));
    }
}
/**
 * Enhances the incoming props with defaults.
 */ function initializeConfig({ formats, getMessageFallback, messages, onError, ...rest }) {
    const finalOnError = onError || defaultOnError;
    const finalGetMessageFallback = getMessageFallback || defaultGetMessageFallback;
    {
        if (messages) {
            validateMessages(messages, finalOnError);
        }
    }
    return {
        ...rest,
        formats: formats || undefined,
        messages: messages || undefined,
        onError: finalOnError,
        getMessageFallback: finalGetMessageFallback
    };
}
;
}),
"[project]/app/node_modules/use-intl/dist/esm/development/react.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IntlProvider",
    ()=>IntlProvider,
    "_useExtracted",
    ()=>useExtracted,
    "useFormatter",
    ()=>useFormatter,
    "useLocale",
    ()=>useLocale,
    "useMessages",
    ()=>useMessages,
    "useNow",
    ()=>useNow,
    "useTimeZone",
    ()=>useTimeZone,
    "useTranslations",
    ()=>useTranslations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/use-intl/dist/esm/development/formatters-r4aAmsMP.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$initializeConfig$2d$CUsOI8u2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/use-intl/dist/esm/development/initializeConfig-CUsOI8u2.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
;
const IntlContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function IntlProvider({ children, formats, getMessageFallback, locale, messages, now, onError, timeZone }) {
    const prevContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(IntlContext);
    // The formatter cache is released when the locale changes. For
    // long-running apps with a persistent `IntlProvider` at the root,
    // this can reduce the memory footprint (e.g. in React Native).
    const cache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "IntlProvider.useMemo[cache]": ()=>{
            return prevContext?.cache || (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["b"])();
        }
    }["IntlProvider.useMemo[cache]"], [
        locale,
        prevContext?.cache
    ]);
    const formatters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "IntlProvider.useMemo[formatters]": ()=>prevContext?.formatters || (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(cache)
    }["IntlProvider.useMemo[formatters]"], [
        cache,
        prevContext?.formatters
    ]);
    // Memoizing this value helps to avoid triggering a re-render of all
    // context consumers in case the configuration didn't change. However,
    // if some of the non-primitive values change, a re-render will still
    // be triggered. Note that there's no need to put `memo` on `IntlProvider`
    // itself, because the `children` typically change on every render.
    // There's some burden on the consumer side if it's important to reduce
    // re-renders, put that's how React works.
    // See: https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/#context-updates-and-render-optimizations
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "IntlProvider.useMemo[value]": ()=>({
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$initializeConfig$2d$CUsOI8u2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])({
                    locale,
                    // (required by provider)
                    formats: formats === undefined ? prevContext?.formats : formats,
                    getMessageFallback: getMessageFallback || prevContext?.getMessageFallback,
                    messages: messages === undefined ? prevContext?.messages : messages,
                    now: now || prevContext?.now,
                    onError: onError || prevContext?.onError,
                    timeZone: timeZone || prevContext?.timeZone
                }),
                formatters,
                cache
            })
    }["IntlProvider.useMemo[value]"], [
        cache,
        formats,
        formatters,
        getMessageFallback,
        locale,
        messages,
        now,
        onError,
        prevContext,
        timeZone
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(IntlContext.Provider, {
        value: value,
        children: children
    });
}
function useIntlContext() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(IntlContext);
    if (!context) {
        throw new Error('No intl context found. Have you configured the provider? See https://next-intl.dev/docs/usage/configuration#server-client-components');
    }
    return context;
}
let hasWarnedForMissingTimezone = false;
const isServer = typeof window === 'undefined';
function useTranslationsImpl(allMessagesPrefixed, namespacePrefixed, namespacePrefix) {
    const { cache, formats: globalFormats, formatters, getMessageFallback, locale, onError, timeZone } = useIntlContext();
    // The `namespacePrefix` is part of the type system.
    // See the comment in the hook invocation.
    const allMessages = allMessagesPrefixed[namespacePrefix];
    const namespace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$initializeConfig$2d$CUsOI8u2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["r"])(namespacePrefixed, namespacePrefix);
    if (!timeZone && !hasWarnedForMissingTimezone && isServer) {
        // eslint-disable-next-line react-compiler/react-compiler
        hasWarnedForMissingTimezone = true;
        onError(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"](__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$formatters$2d$r4aAmsMP$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].ENVIRONMENT_FALLBACK, `There is no \`timeZone\` configured, this can lead to markup mismatches caused by environment differences. Consider adding a global default: https://next-intl.dev/docs/configuration#time-zone`));
    }
    const translate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useTranslationsImpl.useMemo[translate]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$initializeConfig$2d$CUsOI8u2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"])({
                cache,
                formatters,
                getMessageFallback,
                messages: allMessages,
                namespace,
                onError,
                formats: globalFormats,
                locale,
                timeZone
            })
    }["useTranslationsImpl.useMemo[translate]"], [
        cache,
        formatters,
        getMessageFallback,
        allMessages,
        namespace,
        onError,
        globalFormats,
        locale,
        timeZone
    ]);
    return translate;
}
/**
 * Translates messages from the given namespace by using the ICU syntax.
 * See https://formatjs.io/docs/core-concepts/icu-syntax.
 *
 * If no namespace is provided, all available messages are returned.
 * The namespace can also indicate nesting by using a dot
 * (e.g. `namespace.Component`).
 */ function useTranslations(namespace) {
    const context = useIntlContext();
    const messages = context.messages;
    // We have to wrap the actual hook so the type inference for the optional
    // namespace works correctly. See https://stackoverflow.com/a/71529575/343045
    // The prefix ("!") is arbitrary.
    // @ts-expect-error Use the explicit annotation instead
    return useTranslationsImpl({
        '!': messages
    }, // @ts-expect-error
    namespace ? `!.${namespace}` : '!', '!');
}
function useLocale() {
    return useIntlContext().locale;
}
function getNow() {
    return new Date();
}
/**
 * @see https://next-intl.dev/docs/usage/dates-times#relative-times-usenow
 */ function useNow(options) {
    const updateInterval = options?.updateInterval;
    const { now: globalNow } = useIntlContext();
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(globalNow || getNow());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useNow.useEffect": ()=>{
            if (!updateInterval) return;
            const intervalId = setInterval({
                "useNow.useEffect.intervalId": ()=>{
                    setNow(getNow());
                }
            }["useNow.useEffect.intervalId"], updateInterval);
            return ({
                "useNow.useEffect": ()=>{
                    clearInterval(intervalId);
                }
            })["useNow.useEffect"];
        }
    }["useNow.useEffect"], [
        globalNow,
        updateInterval
    ]);
    return updateInterval == null && globalNow ? globalNow : now;
}
function useTimeZone() {
    return useIntlContext().timeZone;
}
function useMessages() {
    const context = useIntlContext();
    if (!context.messages) {
        throw new Error('No messages found. Have you configured them correctly? See https://next-intl.dev/docs/configuration#messages');
    }
    return context.messages;
}
function useFormatter() {
    const { formats, formatters, locale, now: globalNow, onError, timeZone } = useIntlContext();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useFormatter.useMemo": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$initializeConfig$2d$CUsOI8u2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])({
                formats,
                locale,
                now: globalNow,
                onError,
                timeZone,
                _formatters: formatters
            })
    }["useFormatter.useMemo"], [
        formats,
        formatters,
        globalNow,
        locale,
        onError,
        timeZone
    ]);
}
function getArgs(messageOrParams, ...rest) {
    let message, values, formats;
    if (typeof messageOrParams === 'string') {
        message = messageOrParams;
        values = rest[0];
        formats = rest[1];
    } else {
        message = messageOrParams.message;
        values = messageOrParams.values;
        formats = messageOrParams.formats;
    // `description` is not used at runtime
    }
    // @ts-expect-error -- Secret fallback parameter
    return [
        undefined,
        // Always use fallback if not compiled
        values,
        formats,
        message
    ];
}
// Note: This API is usually compiled into `useTranslations`,
// but there is some fallback handling which allows this hook
// to still work when not being compiled.
//
// This is relevant for:
// - Isolated environments like tests, Storybook, etc.
// - Fallbacks in case an extracted message is not yet available
function useExtracted(namespace) {
    const t = useTranslations(namespace);
    function translateFn(...params) {
        // @ts-expect-error -- Passing `undefined` as an ID is secretly allowed here
        return t(...getArgs(...params));
    }
    translateFn.rich = (...params)=>// @ts-expect-error -- Passing `undefined` as an ID is secretly allowed here
        t.rich(...getArgs(...params));
    translateFn.markup = (...params)=>// @ts-expect-error -- Passing `undefined` as an ID is secretly allowed here
        t.markup(...getArgs(...params));
    translateFn.has = function translateHasFn(// eslint-disable-next-line @typescript-eslint/no-unused-vars
    message) {
        // Not really something better we can do here
        return true;
    };
    return translateFn;
}
;
}),
"[project]/app/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function is(x, y) {
        return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    function useSyncExternalStore$2(subscribe, getSnapshot) {
        didWarnOld18Alpha || void 0 === React.startTransition || (didWarnOld18Alpha = !0, console.error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));
        var value = getSnapshot();
        if (!didWarnUncachedGetSnapshot) {
            var cachedValue = getSnapshot();
            objectIs(value, cachedValue) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), didWarnUncachedGetSnapshot = !0);
        }
        cachedValue = useState({
            inst: {
                value: value,
                getSnapshot: getSnapshot
            }
        });
        var inst = cachedValue[0].inst, forceUpdate = cachedValue[1];
        useLayoutEffect({
            "useSyncExternalStore$2.useLayoutEffect": function() {
                inst.value = value;
                inst.getSnapshot = getSnapshot;
                checkIfSnapshotChanged(inst) && forceUpdate({
                    inst: inst
                });
            }
        }["useSyncExternalStore$2.useLayoutEffect"], [
            subscribe,
            value,
            getSnapshot
        ]);
        useEffect({
            "useSyncExternalStore$2.useEffect": function() {
                checkIfSnapshotChanged(inst) && forceUpdate({
                    inst: inst
                });
                return subscribe({
                    "useSyncExternalStore$2.useEffect": function() {
                        checkIfSnapshotChanged(inst) && forceUpdate({
                            inst: inst
                        });
                    }
                }["useSyncExternalStore$2.useEffect"]);
            }
        }["useSyncExternalStore$2.useEffect"], [
            subscribe
        ]);
        useDebugValue(value);
        return value;
    }
    function checkIfSnapshotChanged(inst) {
        var latestGetSnapshot = inst.getSnapshot;
        inst = inst.value;
        try {
            var nextValue = latestGetSnapshot();
            return !objectIs(inst, nextValue);
        } catch (error) {
            return !0;
        }
    }
    function useSyncExternalStore$1(subscribe, getSnapshot) {
        return getSnapshot();
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = __turbopack_context__.r("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), objectIs = "function" === typeof Object.is ? Object.is : is, useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue, didWarnOld18Alpha = !1, didWarnUncachedGetSnapshot = !1, shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
    exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
}();
}),
"[project]/app/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function is(x, y) {
        return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = __turbopack_context__.r("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), shim = __turbopack_context__.r("[project]/app/node_modules/use-sync-external-store/shim/index.js [app-client] (ecmascript)"), objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue = React.useDebugValue;
    exports.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
        var instRef = useRef(null);
        if (null === instRef.current) {
            var inst = {
                hasValue: !1,
                value: null
            };
            instRef.current = inst;
        } else inst = instRef.current;
        instRef = useMemo(function() {
            function memoizedSelector(nextSnapshot) {
                if (!hasMemo) {
                    hasMemo = !0;
                    memoizedSnapshot = nextSnapshot;
                    nextSnapshot = selector(nextSnapshot);
                    if (void 0 !== isEqual && inst.hasValue) {
                        var currentSelection = inst.value;
                        if (isEqual(currentSelection, nextSnapshot)) return memoizedSelection = currentSelection;
                    }
                    return memoizedSelection = nextSnapshot;
                }
                currentSelection = memoizedSelection;
                if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
                var nextSelection = selector(nextSnapshot);
                if (void 0 !== isEqual && isEqual(currentSelection, nextSelection)) return memoizedSnapshot = nextSnapshot, currentSelection;
                memoizedSnapshot = nextSnapshot;
                return memoizedSelection = nextSelection;
            }
            var hasMemo = !1, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
            return [
                function() {
                    return memoizedSelector(getSnapshot());
                },
                null === maybeGetServerSnapshot ? void 0 : function() {
                    return memoizedSelector(maybeGetServerSnapshot());
                }
            ];
        }, [
            getSnapshot,
            getServerSnapshot,
            selector,
            isEqual
        ]);
        var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
        useEffect(function() {
            inst.hasValue = !0;
            inst.value = value;
        }, [
            value
        ]);
        useDebugValue(value);
        return value;
    };
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
}();
}),
"[project]/app/node_modules/use-sync-external-store/shim/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/app/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js [app-client] (ecmascript)");
}
}),
"[project]/app/node_modules/use-sync-external-store/shim/with-selector.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/app/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js [app-client] (ecmascript)");
}
}),
"[project]/app/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "combine",
    ()=>combine,
    "createJSONStorage",
    ()=>createJSONStorage,
    "devtools",
    ()=>devtools,
    "persist",
    ()=>persist,
    "redux",
    ()=>redux,
    "subscribeWithSelector",
    ()=>subscribeWithSelector,
    "unstable_ssrSafe",
    ()=>ssrSafe
]);
var __TURBOPACK__import$2e$meta__ = {
    get url () {
        return __turbopack_context__.F("app/node_modules/zustand/esm/middleware.mjs");
    },
    env: {
        DEV: true,
        PROD: false,
        MODE: "development",
        BASE_URL: "/",
        SSR: false
    },
    get turbopackHot () {
        return __turbopack_context__.m.hot;
    }
};
const reduxImpl = (reducer, initial)=>(set, _get, api)=>{
        api.dispatch = (action)=>{
            set((state)=>reducer(state, action), false, action);
            return action;
        };
        api.dispatchFromDevtools = true;
        return {
            dispatch: (...args)=>api.dispatch(...args),
            ...initial
        };
    };
const redux = reduxImpl;
const shouldDispatchFromDevtools = (api)=>!!api.dispatchFromDevtools && typeof api.dispatch === "function";
const trackedConnections = /* @__PURE__ */ new Map();
const getTrackedConnectionState = (name)=>{
    const api = trackedConnections.get(name);
    if (!api) return {};
    return Object.fromEntries(Object.entries(api.stores).map(([key, api2])=>[
            key,
            api2.getState()
        ]));
};
const extractConnectionInformation = (store, extensionConnector, options)=>{
    if (store === void 0) {
        return {
            type: "untracked",
            connection: extensionConnector.connect(options)
        };
    }
    const existingConnection = trackedConnections.get(options.name);
    if (existingConnection) {
        return {
            type: "tracked",
            store,
            ...existingConnection
        };
    }
    const newConnection = {
        connection: extensionConnector.connect(options),
        stores: {}
    };
    trackedConnections.set(options.name, newConnection);
    return {
        type: "tracked",
        store,
        ...newConnection
    };
};
const removeStoreFromTrackedConnections = (name, store)=>{
    if (store === void 0) return;
    const connectionInfo = trackedConnections.get(name);
    if (!connectionInfo) return;
    delete connectionInfo.stores[store];
    if (Object.keys(connectionInfo.stores).length === 0) {
        trackedConnections.delete(name);
    }
};
const v8StackLineRe = /^at (?:new |async )?(.+?) \(/;
const geckoStackLineRe = /^([^@]+)@/;
function findCallerName(stack) {
    var _a, _b, _c;
    if (!stack) return void 0;
    const traceLines = stack.split("\n");
    const apiSetStateLineIndex = traceLines.findIndex((traceLine)=>traceLine.includes("api.setState"));
    if (apiSetStateLineIndex < 0) return void 0;
    const callerLine = ((_a = traceLines[apiSetStateLineIndex + 1]) == null ? void 0 : _a.trim()) || "";
    return ((_b = v8StackLineRe.exec(callerLine)) == null ? void 0 : _b[1]) || ((_c = geckoStackLineRe.exec(callerLine)) == null ? void 0 : _c[1]);
}
const devtoolsImpl = (fn, devtoolsOptions = {})=>(set, get, api)=>{
        const { enabled, anonymousActionType, store, ...options } = devtoolsOptions;
        let extensionConnector;
        try {
            extensionConnector = (enabled != null ? enabled : (("TURBOPACK compile-time truthy", 1) ? __TURBOPACK__import$2e$meta__.env.MODE : "TURBOPACK unreachable") !== "production") && window.__REDUX_DEVTOOLS_EXTENSION__;
        } catch (e) {}
        if (!extensionConnector) {
            return fn(set, get, api);
        }
        const { connection, ...connectionInformation } = extractConnectionInformation(store, extensionConnector, options);
        let isRecording = true;
        api.setState = (state, replace, nameOrAction)=>{
            const r = set(state, replace);
            if (!isRecording) return r;
            const action = nameOrAction === void 0 ? {
                type: anonymousActionType || findCallerName(new Error().stack) || "anonymous"
            } : typeof nameOrAction === "string" ? {
                type: nameOrAction
            } : nameOrAction;
            if (store === void 0) {
                connection == null ? void 0 : connection.send(action, get());
                return r;
            }
            connection == null ? void 0 : connection.send({
                ...action,
                type: `${store}/${action.type}`
            }, {
                ...getTrackedConnectionState(options.name),
                [store]: api.getState()
            });
            return r;
        };
        api.devtools = {
            cleanup: ()=>{
                if (connection && typeof connection.unsubscribe === "function") {
                    connection.unsubscribe();
                }
                removeStoreFromTrackedConnections(options.name, store);
            }
        };
        const setStateFromDevtools = (...a)=>{
            const originalIsRecording = isRecording;
            isRecording = false;
            set(...a);
            isRecording = originalIsRecording;
        };
        const initialState = fn(api.setState, get, api);
        if (connectionInformation.type === "untracked") {
            connection == null ? void 0 : connection.init(initialState);
        } else {
            connectionInformation.stores[connectionInformation.store] = api;
            connection == null ? void 0 : connection.init(Object.fromEntries(Object.entries(connectionInformation.stores).map(([key, store2])=>[
                    key,
                    key === connectionInformation.store ? initialState : store2.getState()
                ])));
        }
        if (shouldDispatchFromDevtools(api)) {
            let didWarnAboutReservedActionType = false;
            const originalDispatch = api.dispatch;
            api.dispatch = (...args)=>{
                if ((("TURBOPACK compile-time truthy", 1) ? __TURBOPACK__import$2e$meta__.env.MODE : "TURBOPACK unreachable") !== "production" && args[0].type === "__setState" && !didWarnAboutReservedActionType) {
                    console.warn('[zustand devtools middleware] "__setState" action type is reserved to set state from the devtools. Avoid using it.');
                    didWarnAboutReservedActionType = true;
                }
                originalDispatch(...args);
            };
        }
        connection.subscribe((message)=>{
            var _a;
            switch(message.type){
                case "ACTION":
                    if (typeof message.payload !== "string") {
                        console.error("[zustand devtools middleware] Unsupported action format");
                        return;
                    }
                    return parseJsonThen(message.payload, (action)=>{
                        if (action.type === "__setState") {
                            if (store === void 0) {
                                setStateFromDevtools(action.state);
                                return;
                            }
                            if (Object.keys(action.state).length !== 1) {
                                console.error(`
                    [zustand devtools middleware] Unsupported __setState action format.
                    When using 'store' option in devtools(), the 'state' should have only one key, which is a value of 'store' that was passed in devtools(),
                    and value of this only key should be a state object. Example: { "type": "__setState", "state": { "abc123Store": { "foo": "bar" } } }
                    `);
                            }
                            const stateFromDevtools = action.state[store];
                            if (stateFromDevtools === void 0 || stateFromDevtools === null) {
                                return;
                            }
                            if (JSON.stringify(api.getState()) !== JSON.stringify(stateFromDevtools)) {
                                setStateFromDevtools(stateFromDevtools);
                            }
                            return;
                        }
                        if (shouldDispatchFromDevtools(api)) {
                            api.dispatch(action);
                        }
                    });
                case "DISPATCH":
                    switch(message.payload.type){
                        case "RESET":
                            setStateFromDevtools(initialState);
                            if (store === void 0) {
                                return connection == null ? void 0 : connection.init(api.getState());
                            }
                            return connection == null ? void 0 : connection.init(getTrackedConnectionState(options.name));
                        case "COMMIT":
                            if (store === void 0) {
                                connection == null ? void 0 : connection.init(api.getState());
                                return;
                            }
                            return connection == null ? void 0 : connection.init(getTrackedConnectionState(options.name));
                        case "ROLLBACK":
                            return parseJsonThen(message.state, (state)=>{
                                if (store === void 0) {
                                    setStateFromDevtools(state);
                                    connection == null ? void 0 : connection.init(api.getState());
                                    return;
                                }
                                setStateFromDevtools(state[store]);
                                connection == null ? void 0 : connection.init(getTrackedConnectionState(options.name));
                            });
                        case "JUMP_TO_STATE":
                        case "JUMP_TO_ACTION":
                            return parseJsonThen(message.state, (state)=>{
                                if (store === void 0) {
                                    setStateFromDevtools(state);
                                    return;
                                }
                                if (JSON.stringify(api.getState()) !== JSON.stringify(state[store])) {
                                    setStateFromDevtools(state[store]);
                                }
                            });
                        case "IMPORT_STATE":
                            {
                                const { nextLiftedState } = message.payload;
                                const lastComputedState = (_a = nextLiftedState.computedStates.slice(-1)[0]) == null ? void 0 : _a.state;
                                if (!lastComputedState) return;
                                if (store === void 0) {
                                    setStateFromDevtools(lastComputedState);
                                } else {
                                    setStateFromDevtools(lastComputedState[store]);
                                }
                                connection == null ? void 0 : connection.send(null, // FIXME no-any
                                nextLiftedState);
                                return;
                            }
                        case "PAUSE_RECORDING":
                            return isRecording = !isRecording;
                    }
                    return;
            }
        });
        return initialState;
    };
const devtools = devtoolsImpl;
const parseJsonThen = (stringified, fn)=>{
    let parsed;
    try {
        parsed = JSON.parse(stringified);
    } catch (e) {
        console.error("[zustand devtools middleware] Could not parse the received json", e);
    }
    if (parsed !== void 0) fn(parsed);
};
const subscribeWithSelectorImpl = (fn)=>(set, get, api)=>{
        const origSubscribe = api.subscribe;
        api.subscribe = (selector, optListener, options)=>{
            let listener = selector;
            if (optListener) {
                const equalityFn = (options == null ? void 0 : options.equalityFn) || Object.is;
                let currentSlice = selector(api.getState());
                listener = (state)=>{
                    const nextSlice = selector(state);
                    if (!equalityFn(currentSlice, nextSlice)) {
                        const previousSlice = currentSlice;
                        optListener(currentSlice = nextSlice, previousSlice);
                    }
                };
                if (options == null ? void 0 : options.fireImmediately) {
                    optListener(currentSlice, currentSlice);
                }
            }
            return origSubscribe(listener);
        };
        const initialState = fn(set, get, api);
        return initialState;
    };
const subscribeWithSelector = subscribeWithSelectorImpl;
function combine(initialState, create) {
    return (...args)=>Object.assign({}, initialState, create(...args));
}
function createJSONStorage(getStorage, options) {
    let storage;
    try {
        storage = getStorage();
    } catch (e) {
        return;
    }
    const persistStorage = {
        getItem: (name)=>{
            var _a;
            const parse = (str2)=>{
                if (str2 === null) {
                    return null;
                }
                return JSON.parse(str2, options == null ? void 0 : options.reviver);
            };
            const str = (_a = storage.getItem(name)) != null ? _a : null;
            if (str instanceof Promise) {
                return str.then(parse);
            }
            return parse(str);
        },
        setItem: (name, newValue)=>storage.setItem(name, JSON.stringify(newValue, options == null ? void 0 : options.replacer)),
        removeItem: (name)=>storage.removeItem(name)
    };
    return persistStorage;
}
const toThenable = (fn)=>(input)=>{
        try {
            const result = fn(input);
            if (result instanceof Promise) {
                return result;
            }
            return {
                then (onFulfilled) {
                    return toThenable(onFulfilled)(result);
                },
                catch (_onRejected) {
                    return this;
                }
            };
        } catch (e) {
            return {
                then (_onFulfilled) {
                    return this;
                },
                catch (onRejected) {
                    return toThenable(onRejected)(e);
                }
            };
        }
    };
const persistImpl = (config, baseOptions)=>(set, get, api)=>{
        let options = {
            storage: createJSONStorage(()=>window.localStorage),
            partialize: (state)=>state,
            version: 0,
            merge: (persistedState, currentState)=>({
                    ...currentState,
                    ...persistedState
                }),
            ...baseOptions
        };
        let hasHydrated = false;
        let hydrationVersion = 0;
        const hydrationListeners = /* @__PURE__ */ new Set();
        const finishHydrationListeners = /* @__PURE__ */ new Set();
        let storage = options.storage;
        if (!storage) {
            return config((...args)=>{
                console.warn(`[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`);
                set(...args);
            }, get, api);
        }
        const setItem = ()=>{
            const state = options.partialize({
                ...get()
            });
            return storage.setItem(options.name, {
                state,
                version: options.version
            });
        };
        const savedSetState = api.setState;
        api.setState = (state, replace)=>{
            savedSetState(state, replace);
            return setItem();
        };
        const configResult = config((...args)=>{
            set(...args);
            return setItem();
        }, get, api);
        api.getInitialState = ()=>configResult;
        let stateFromStorage;
        const hydrate = ()=>{
            var _a, _b;
            if (!storage) return;
            const currentVersion = ++hydrationVersion;
            hasHydrated = false;
            hydrationListeners.forEach((cb)=>{
                var _a2;
                return cb((_a2 = get()) != null ? _a2 : configResult);
            });
            const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
            return toThenable(storage.getItem.bind(storage))(options.name).then((deserializedStorageValue)=>{
                if (deserializedStorageValue) {
                    if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
                        if (options.migrate) {
                            const migration = options.migrate(deserializedStorageValue.state, deserializedStorageValue.version);
                            if (migration instanceof Promise) {
                                return migration.then((result)=>[
                                        true,
                                        result
                                    ]);
                            }
                            return [
                                true,
                                migration
                            ];
                        }
                        console.error(`State loaded from storage couldn't be migrated since no migrate function was provided`);
                    } else {
                        return [
                            false,
                            deserializedStorageValue.state
                        ];
                    }
                }
                return [
                    false,
                    void 0
                ];
            }).then((migrationResult)=>{
                var _a2;
                if (currentVersion !== hydrationVersion) {
                    return;
                }
                const [migrated, migratedState] = migrationResult;
                stateFromStorage = options.merge(migratedState, (_a2 = get()) != null ? _a2 : configResult);
                set(stateFromStorage, true);
                if (migrated) {
                    return setItem();
                }
            }).then(()=>{
                if (currentVersion !== hydrationVersion) {
                    return;
                }
                postRehydrationCallback == null ? void 0 : postRehydrationCallback(get(), void 0);
                stateFromStorage = get();
                hasHydrated = true;
                finishHydrationListeners.forEach((cb)=>cb(stateFromStorage));
            }).catch((e)=>{
                if (currentVersion !== hydrationVersion) {
                    return;
                }
                postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
            });
        };
        api.persist = {
            setOptions: (newOptions)=>{
                options = {
                    ...options,
                    ...newOptions
                };
                if (newOptions.storage) {
                    storage = newOptions.storage;
                }
            },
            clearStorage: ()=>{
                ++hydrationVersion;
                storage == null ? void 0 : storage.removeItem(options.name);
            },
            getOptions: ()=>options,
            rehydrate: ()=>hydrate(),
            hasHydrated: ()=>hasHydrated,
            onHydrate: (cb)=>{
                hydrationListeners.add(cb);
                return ()=>{
                    hydrationListeners.delete(cb);
                };
            },
            onFinishHydration: (cb)=>{
                finishHydrationListeners.add(cb);
                return ()=>{
                    finishHydrationListeners.delete(cb);
                };
            }
        };
        if (!options.skipHydration) {
            hydrate();
        }
        return stateFromStorage || configResult;
    };
const persist = persistImpl;
function ssrSafe(config, isSSR = typeof window === "undefined") {
    return (set, get, api)=>{
        if (!isSSR) {
            return config(set, get, api);
        }
        const ssrSet = ()=>{
            throw new Error("Cannot set state of Zustand store in SSR");
        };
        api.setState = ssrSet;
        return config(ssrSet, get, api);
    };
}
;
}),
"[project]/app/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "create",
    ()=>create,
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/zustand/esm/vanilla.mjs [app-client] (ecmascript)");
;
;
const identity = (arg)=>arg;
function useStore(api, selector = identity) {
    const slice = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useSyncExternalStore(api.subscribe, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "useStore.useSyncExternalStore[slice]": ()=>selector(api.getState())
    }["useStore.useSyncExternalStore[slice]"], [
        api,
        selector
    ]), __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "useStore.useSyncExternalStore[slice]": ()=>selector(api.getInitialState())
    }["useStore.useSyncExternalStore[slice]"], [
        api,
        selector
    ]));
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useDebugValue(slice);
    return slice;
}
const createImpl = (createState)=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createStore"])(createState);
    const useBoundStore = (selector)=>useStore(api, selector);
    Object.assign(useBoundStore, api);
    return useBoundStore;
};
const create = (createState)=>createState ? createImpl(createState) : createImpl;
;
}),
"[project]/app/node_modules/zustand/esm/vanilla.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createStore",
    ()=>createStore
]);
const createStoreImpl = (createState)=>{
    let state;
    const listeners = /* @__PURE__ */ new Set();
    const setState = (partial, replace)=>{
        const nextState = typeof partial === "function" ? partial(state) : partial;
        if (!Object.is(nextState, state)) {
            const previousState = state;
            state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
            listeners.forEach((listener)=>listener(state, previousState));
        }
    };
    const getState = ()=>state;
    const getInitialState = ()=>initialState;
    const subscribe = (listener)=>{
        listeners.add(listener);
        return ()=>listeners.delete(listener);
    };
    const api = {
        setState,
        getState,
        getInitialState,
        subscribe
    };
    const initialState = state = createState(setState, getState, api);
    return api;
};
const createStore = (createState)=>createState ? createStoreImpl(createState) : createStoreImpl;
;
}),
]);

//# sourceMappingURL=18pm_1gu5jyv._.js.map