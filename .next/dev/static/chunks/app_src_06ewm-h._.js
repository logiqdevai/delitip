(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/src/app/auth/components/auth-employee-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthEmployeeForm",
    ()=>AuthEmployeeForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/react-hook-form/dist/index.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@hookform/resolvers/zod/dist/zod.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/info.mjs [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$validation$2d$schemas$2f$auth$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/features/auth/validation-schemas/auth.schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/features/auth/hooks/use-auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/routes/routes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$action$2d$button$2d$with$2d$pending$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/components/ui/action-button-with-pending.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$password$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/components/ui/password-input.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
const authFieldClassName = "h-12 rounded-2xl border-zinc-200 bg-zinc-50/70 px-4 text-sm shadow-none";
const AuthEmployeeForm = ()=>{
    _s();
    const loginEmployee = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLoginEmployee"])();
    const { register, control, handleSubmit, formState: { errors } } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodResolver"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$validation$2d$schemas$2f$auth$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["employeeSignInSchema"]),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    const isPending = loginEmployee.isPending;
    const onSubmit = handleSubmit((values)=>{
        loginEmployee.mutate(values);
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "auth-fade-enter flex flex-1 flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 hidden lg:block",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold tracking-tight text-ink-charcoal",
                        children: "Employee Portal"
                    }, void 0, false, {
                        fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-xs text-zinc-500",
                        children: "Check your personal tip earnings, payouts, and customer reviews."
                    }, void 0, false, {
                        fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: onSubmit,
                className: "space-y-5 lg:space-y-4",
                noValidate: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "employee-email",
                                className: "mb-2 block text-sm font-bold text-ink-charcoal lg:mb-1.5 lg:text-xs lg:font-semibold lg:text-zinc-700",
                                children: "Email"
                            }, void 0, false, {
                                fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                id: "employee-email",
                                type: "email",
                                autoComplete: "email",
                                placeholder: "maria@artisancafe.com",
                                "aria-invalid": !!errors.email,
                                className: `${authFieldClassName} lg:h-(--control-height-default) lg:rounded-xl lg:px-3.5`,
                                ...register("email")
                            }, void 0, false, {
                                fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            errors.email ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 text-caption text-red-600 lg:mt-1 lg:text-xs",
                                children: errors.email.message
                            }, void 0, false, {
                                fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-2 flex items-center justify-between gap-3 lg:mb-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "employee-password",
                                        className: "text-sm font-bold text-ink-charcoal lg:text-xs lg:font-semibold lg:text-zinc-700",
                                        children: "Password"
                                    }, void 0, false, {
                                        fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                                        lineNumber: 80,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].auth.forgot_password}?role=employee`,
                                        className: "text-caption font-semibold text-brand-700 hover:underline",
                                        children: "Forgot password?"
                                    }, void 0, false, {
                                        fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                                        lineNumber: 86,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Controller"], {
                                name: "password",
                                control: control,
                                render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$password$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasswordInput"], {
                                        id: "employee-password",
                                        autoComplete: "current-password",
                                        placeholder: "••••••••••••",
                                        "aria-invalid": !!errors.password,
                                        groupClassName: `${authFieldClassName} lg:h-(--control-height-default) lg:rounded-xl lg:px-3.5`,
                                        ...field
                                    }, void 0, false, {
                                        fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                                        lineNumber: 97,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            errors.password ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 text-caption text-red-600 lg:mt-1 lg:text-xs",
                                children: errors.password.message
                            }, void 0, false, {
                                fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                                lineNumber: 108,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-2 rounded-2xl border border-brand-200/60 bg-brand-50/60 px-4 py-3.5 text-caption text-brand-900 lg:rounded-xl lg:p-3 lg:text-xs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                className: "mt-0.5 size-4 shrink-0 text-electric-lime",
                                strokeWidth: 2
                            }, void 0, false, {
                                fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Use the email and password from your invitation email."
                            }, void 0, false, {
                                fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$action$2d$button$2d$with$2d$pending$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButtonWithPending"], {
                        type: "submit",
                        isPending: isPending,
                        className: "w-full rounded-xl bg-electric-lime font-bold text-ink-charcoal",
                        children: [
                            "Access My Tip Profile",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                "data-icon": "inline-end",
                                className: "size-3.5"
                            }, void 0, false, {
                                fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                                lineNumber: 130,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-auto pt-8 text-center lg:mt-0 lg:pt-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-zinc-500 lg:text-xs",
                    children: [
                        "Are you an employer?",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].auth.sign_in,
                            className: "font-bold text-brand-800 hover:underline lg:text-brand-700",
                            children: "Business sign in"
                        }, void 0, false, {
                            fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                            lineNumber: 137,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                    lineNumber: 135,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/src/app/auth/components/auth-employee-form.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthEmployeeForm, "Gge76atDA75duU24dmc77K7p0Gc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLoginEmployee"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"]
    ];
});
_c = AuthEmployeeForm;
var _c;
__turbopack_context__.k.register(_c, "AuthEmployeeForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/app/auth/components/auth-role-switcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthRoleSwitcher",
    ()=>AuthRoleSwitcher,
    "AuthRoles",
    ()=>AuthRoles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/store.mjs [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/user.mjs [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
const AuthRoles = {
    BUSINESS: "business",
    EMPLOYEE: "employee"
};
const AuthRoleSwitcher = ({ activeRole, onSelectBusiness, onSelectEmployee })=>{
    const isBusiness = activeRole === AuthRoles.BUSINESS;
    const isEmployee = activeRole === AuthRoles.EMPLOYEE;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mb-7 flex w-full border-b border-zinc-200", "lg:mb-6 lg:rounded-xl lg:border lg:border-zinc-200/60 lg:bg-neutral-fill lg:p-1"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onSelectBusiness,
                "aria-label": "Business Account",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex min-w-0 flex-1 items-center justify-center gap-2 pb-3.5 text-sm transition", "lg:gap-1.5 lg:rounded-lg lg:px-3.5 lg:py-1.5 lg:pb-1.5 lg:text-xs lg:whitespace-nowrap", isBusiness ? "font-bold text-ink-charcoal lg:bg-white lg:shadow-xs" : "font-semibold text-zinc-400 hover:text-zinc-600 lg:text-zinc-500 lg:hover:text-ink-charcoal"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("size-4 shrink-0 lg:size-3.5", isBusiness ? "text-electric-lime" : "text-zinc-400"),
                        strokeWidth: 2.25
                    }, void 0, false, {
                        fileName: "[project]/app/src/app/auth/components/auth-role-switcher.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "truncate",
                        children: "Business Account"
                    }, void 0, false, {
                        fileName: "[project]/app/src/app/auth/components/auth-role-switcher.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    isBusiness ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-electric-lime lg:hidden"
                    }, void 0, false, {
                        fileName: "[project]/app/src/app/auth/components/auth-role-switcher.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)) : null
                ]
            }, void 0, true, {
                fileName: "[project]/app/src/app/auth/components/auth-role-switcher.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onSelectEmployee,
                "aria-label": "Staff Access",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex min-w-0 flex-1 items-center justify-center gap-2 pb-3.5 text-sm transition", "lg:gap-1.5 lg:rounded-lg lg:px-3.5 lg:py-1.5 lg:pb-1.5 lg:text-xs lg:whitespace-nowrap", isEmployee ? "font-bold text-ink-charcoal lg:bg-white lg:shadow-xs" : "font-semibold text-zinc-400 hover:text-zinc-600 lg:text-zinc-500 lg:hover:text-ink-charcoal"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("size-4 shrink-0 lg:size-3.5", isEmployee ? "text-electric-lime" : "text-zinc-400"),
                        strokeWidth: 2.25
                    }, void 0, false, {
                        fileName: "[project]/app/src/app/auth/components/auth-role-switcher.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "truncate",
                        children: "Staff Access"
                    }, void 0, false, {
                        fileName: "[project]/app/src/app/auth/components/auth-role-switcher.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    isEmployee ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-electric-lime lg:hidden"
                    }, void 0, false, {
                        fileName: "[project]/app/src/app/auth/components/auth-role-switcher.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)) : null
                ]
            }, void 0, true, {
                fileName: "[project]/app/src/app/auth/components/auth-role-switcher.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/src/app/auth/components/auth-role-switcher.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = AuthRoleSwitcher;
var _c;
__turbopack_context__.k.register(_c, "AuthRoleSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/app/auth/components/auth-sign-in-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthSignInForm",
    ()=>AuthSignInForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/react-hook-form/dist/index.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@hookform/resolvers/zod/dist/zod.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$validation$2d$schemas$2f$auth$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/features/auth/validation-schemas/auth.schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/features/auth/hooks/use-auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/routes/routes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$action$2d$button$2d$with$2d$pending$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/components/ui/action-button-with-pending.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$password$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/components/ui/password-input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
const authFieldClassName = "h-12 rounded-2xl border-zinc-200 bg-zinc-50/70 px-4 text-sm shadow-none";
const AuthSignInForm = ()=>{
    _s();
    const loginBusiness = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLoginBusiness"])();
    const { register, control, handleSubmit, formState: { errors } } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodResolver"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$validation$2d$schemas$2f$auth$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["businessSignInSchema"]),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    const isPending = loginBusiness.isPending;
    const onSubmit = handleSubmit((values)=>{
        loginBusiness.mutate(values);
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "auth-fade-enter flex flex-1 flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 hidden lg:block",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-extrabold tracking-[-0.03em] text-ink-charcoal",
                        children: "Welcome back"
                    }, void 0, false, {
                        fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 max-w-sm text-sm leading-relaxed text-zinc-500",
                        children: "Sign in to manage your team, tips, and live customer reviews."
                    }, void 0, false, {
                        fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: onSubmit,
                className: "space-y-5 lg:space-y-4",
                noValidate: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "sign-in-email",
                                className: "mb-2 block text-sm font-bold text-ink-charcoal lg:mb-1.5 lg:text-xs lg:font-semibold lg:text-zinc-700",
                                children: "Business Email"
                            }, void 0, false, {
                                fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                id: "sign-in-email",
                                type: "email",
                                autoComplete: "email",
                                placeholder: "manager@artisancafe.com",
                                "aria-invalid": !!errors.email,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(authFieldClassName, "lg:h-(--control-height-default) lg:rounded-xl lg:px-3.5"),
                                ...register("email")
                            }, void 0, false, {
                                fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            errors.email ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 text-caption text-red-600 lg:mt-1 lg:text-xs",
                                children: errors.email.message
                            }, void 0, false, {
                                fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-2 flex items-center justify-between gap-3 lg:mb-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "sign-in-password",
                                        className: "text-sm font-bold text-ink-charcoal lg:text-xs lg:font-semibold lg:text-zinc-700",
                                        children: "Password"
                                    }, void 0, false, {
                                        fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                                        lineNumber: 81,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].auth.forgot_password,
                                        className: "text-caption font-semibold text-brand-700 hover:underline",
                                        children: "Forgot password?"
                                    }, void 0, false, {
                                        fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                                        lineNumber: 87,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Controller"], {
                                name: "password",
                                control: control,
                                render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$password$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasswordInput"], {
                                        id: "sign-in-password",
                                        autoComplete: "current-password",
                                        placeholder: "••••••••••••",
                                        "aria-invalid": !!errors.password,
                                        groupClassName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(authFieldClassName, "lg:h-(--control-height-default) lg:rounded-xl lg:px-3.5"),
                                        ...field
                                    }, void 0, false, {
                                        fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                                        lineNumber: 98,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            errors.password ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 text-caption text-red-600 lg:mt-1 lg:text-xs",
                                children: errors.password.message
                            }, void 0, false, {
                                fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                                lineNumber: 112,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$action$2d$button$2d$with$2d$pending$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionButtonWithPending"], {
                        type: "submit",
                        isPending: isPending,
                        className: "w-full rounded-xl bg-electric-lime font-bold text-ink-charcoal",
                        children: [
                            "Sign in to delitip",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                "data-icon": "inline-end",
                                className: "size-3.5"
                            }, void 0, false, {
                                fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                                lineNumber: 124,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-auto pt-8 text-center lg:mt-0 lg:pt-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-zinc-500 lg:text-xs",
                    children: [
                        "New to delitip?",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].auth.sign_up,
                            className: "font-bold text-brand-800 hover:underline lg:text-brand-700",
                            children: "Create a business account"
                        }, void 0, false, {
                            fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                    lineNumber: 129,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/src/app/auth/components/auth-sign-in-form.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthSignInForm, "gWV4wuJv1CFHz4T0KwE6j/Kg/+o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLoginBusiness"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"]
    ];
});
_c = AuthSignInForm;
var _c;
__turbopack_context__.k.register(_c, "AuthSignInForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/app/auth/components/auth-sign-in-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthSignInPanel",
    ()=>AuthSignInPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/routes/routes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$app$2f$auth$2f$components$2f$auth$2d$employee$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/app/auth/components/auth-employee-form.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$app$2f$auth$2f$components$2f$auth$2d$role$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/app/auth/components/auth-role-switcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$app$2f$auth$2f$components$2f$auth$2d$sign$2d$in$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/app/auth/components/auth-sign-in-form.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const AuthSignInPanel = ()=>{
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const role = searchParams.get("role") === __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$app$2f$auth$2f$components$2f$auth$2d$role$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthRoles"].EMPLOYEE ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$app$2f$auth$2f$components$2f$auth$2d$role$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthRoles"].EMPLOYEE : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$app$2f$auth$2f$components$2f$auth$2d$role$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthRoles"].BUSINESS;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-1 flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$app$2f$auth$2f$components$2f$auth$2d$role$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthRoleSwitcher"], {
                activeRole: role,
                onSelectBusiness: ()=>{
                    router.replace(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].auth.sign_in);
                },
                onSelectEmployee: ()=>{
                    router.replace(`${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].auth.sign_in}?role=employee`);
                }
            }, void 0, false, {
                fileName: "[project]/app/src/app/auth/components/auth-sign-in-panel.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            role === __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$app$2f$auth$2f$components$2f$auth$2d$role$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthRoles"].EMPLOYEE ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$app$2f$auth$2f$components$2f$auth$2d$employee$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthEmployeeForm"], {}, void 0, false, {
                fileName: "[project]/app/src/app/auth/components/auth-sign-in-panel.tsx",
                lineNumber: 34,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$app$2f$auth$2f$components$2f$auth$2d$sign$2d$in$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthSignInForm"], {}, void 0, false, {
                fileName: "[project]/app/src/app/auth/components/auth-sign-in-panel.tsx",
                lineNumber: 36,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/src/app/auth/components/auth-sign-in-panel.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthSignInPanel, "+JhyKI/TCt/o3i650dm/GAytAZk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthSignInPanel;
var _c;
__turbopack_context__.k.register(_c, "AuthSignInPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/components/ui/action-button-with-pending.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionButtonWithPending",
    ()=>ActionButtonWithPending
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/components/ui/spinner.tsx [app-client] (ecmascript)");
"use client";
;
;
;
const ActionButtonWithPending = ({ isPending = false, disabled, children, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        disabled: disabled || isPending,
        ...props,
        children: [
            isPending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Spinner"], {
                "data-icon": "inline-start"
            }, void 0, false, {
                fileName: "[project]/app/src/components/ui/action-button-with-pending.tsx",
                lineNumber: 19,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0)) : null,
            children
        ]
    }, void 0, true, {
        fileName: "[project]/app/src/components/ui/action-button-with-pending.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = ActionButtonWithPending;
var _c;
__turbopack_context__.k.register(_c, "ActionButtonWithPending");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/components/ui/input-group.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InputGroup",
    ()=>InputGroup,
    "InputGroupAddon",
    ()=>InputGroupAddon,
    "InputGroupButton",
    ()=>InputGroupButton,
    "InputGroupInput",
    ()=>InputGroupInput,
    "InputGroupText",
    ()=>InputGroupText,
    "InputGroupTextarea",
    ()=>InputGroupTextarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/components/ui/textarea.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
function InputGroup({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "input-group",
        role: "group",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group/input-group relative flex h-(--control-height-default) w-full min-w-0 items-center rounded-lg border border-input ring-3 ring-transparent transition-[border-color,box-shadow] duration-200 ease-out outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:bg-input/50 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/src/components/ui/input-group.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = InputGroup;
const inputGroupAddonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4", {
    variants: {
        align: {
            "inline-start": "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
            "inline-end": "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
            "block-start": "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
            "block-end": "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2"
        }
    },
    defaultVariants: {
        align: "inline-start"
    }
});
function InputGroupAddon({ className, align = "inline-start", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "group",
        "data-slot": "input-group-addon",
        "data-align": align,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(inputGroupAddonVariants({
            align
        }), className),
        onClick: (e)=>{
            if (e.target.closest("button")) {
                return;
            }
            e.currentTarget.parentElement?.querySelector("input")?.focus();
        },
        ...props
    }, void 0, false, {
        fileName: "[project]/app/src/components/ui/input-group.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c1 = InputGroupAddon;
const inputGroupButtonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("flex items-center gap-2 text-sm shadow-none", {
    variants: {
        size: {
            xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
            sm: "",
            "icon-xs": "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
            "icon-sm": "size-8 p-0 has-[>svg]:p-0"
        }
    },
    defaultVariants: {
        size: "xs"
    }
});
function InputGroupButton({ className, type = "button", variant = "ghost", size = "xs", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        type: type,
        "data-size": size,
        variant: variant,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(inputGroupButtonVariants({
            size
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/src/components/ui/input-group.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_c2 = InputGroupButton;
function InputGroupText({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/src/components/ui/input-group.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_c3 = InputGroupText;
function InputGroupInput({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
        "data-slot": "input-group-control",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-full min-h-0 flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/src/components/ui/input-group.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_c4 = InputGroupInput;
function InputGroupTextarea({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
        "data-slot": "input-group-control",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/src/components/ui/input-group.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
_c5 = InputGroupTextarea;
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "InputGroup");
__turbopack_context__.k.register(_c1, "InputGroupAddon");
__turbopack_context__.k.register(_c2, "InputGroupButton");
__turbopack_context__.k.register(_c3, "InputGroupText");
__turbopack_context__.k.register(_c4, "InputGroupInput");
__turbopack_context__.k.register(_c5, "InputGroupTextarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$react$2f$input$2f$Input$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@base-ui/react/input/Input.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$base$2d$ui$2f$react$2f$input$2f$Input$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-(--control-height-default) w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base ring-3 ring-transparent transition-[border-color,box-shadow] duration-200 ease-out outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/src/components/ui/input.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/components/ui/password-input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PasswordInput",
    ()=>PasswordInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeIcon$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/eye.mjs [app-client] (ecmascript) <export default as EyeIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOffIcon$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/eye-off.mjs [app-client] (ecmascript) <export default as EyeOffIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/components/ui/input-group.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const PasswordInput = ({ groupClassName, ...props })=>{
    _s();
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputGroup"], {
        className: groupClassName,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputGroupInput"], {
                type: visible ? "text" : "password",
                ...props
            }, void 0, false, {
                fileName: "[project]/app/src/components/ui/password-input.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputGroupAddon"], {
                align: "inline-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    type: "button",
                    variant: "ghost",
                    size: "icon-sm",
                    "aria-label": visible ? "Hide password" : "Show password",
                    onClick: ()=>setVisible((current)=>!current),
                    children: visible ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOffIcon$3e$__["EyeOffIcon"], {}, void 0, false, {
                        fileName: "[project]/app/src/components/ui/password-input.tsx",
                        lineNumber: 36,
                        columnNumber: 22
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeIcon$3e$__["EyeIcon"], {}, void 0, false, {
                        fileName: "[project]/app/src/components/ui/password-input.tsx",
                        lineNumber: 36,
                        columnNumber: 39
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/src/components/ui/password-input.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/src/components/ui/password-input.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/src/components/ui/password-input.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(PasswordInput, "OGsIWlGlwYpVUqIrDReJ1GWx7rw=");
_c = PasswordInput;
var _c;
__turbopack_context__.k.register(_c, "PasswordInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/components/ui/spinner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Spinner",
    ()=>Spinner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2Icon$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2Icon>");
;
;
;
function Spinner({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2Icon$3e$__["Loader2Icon"], {
        "data-slot": "spinner",
        role: "status",
        "aria-label": "Loading",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("size-4 animate-spin", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/src/components/ui/spinner.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
_c = Spinner;
;
var _c;
__turbopack_context__.k.register(_c, "Spinner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/components/ui/textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function Textarea({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        "data-slot": "textarea",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base ring-3 ring-transparent transition-[border-color,box-shadow] duration-200 ease-out outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/src/components/ui/textarea.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Textarea;
;
var _c;
__turbopack_context__.k.register(_c, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/config/api/axios.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/lib/api-error.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$environments$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/config/environments/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/routes/routes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/stores/auth.store.ts [app-client] (ecmascript)");
;
;
;
;
;
const axiosInstance = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$environments$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["environments"].apiUrl
});
axiosInstance.interceptors.request.use((config)=>{
    const { accessToken } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthStoreState"])();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});
const isPublicGuestPath = (path)=>path === __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].home || path === __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].contact || path.startsWith("/legal/") || /\/[^/]+\/q\/[^/]+/.test(path);
axiosInstance.interceptors.response.use((response)=>response, (error)=>{
    if (error.response?.status === 401 && ("TURBOPACK compile-time value", "object") !== "undefined") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthStoreState"])().clearSession();
        const path = window.location.pathname;
        if (!isPublicGuestPath(path) && path !== __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].auth.sign_in && path !== __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].auth.sign_up && path !== __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].auth.forgot_password && path !== __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].auth.reset_password) {
            window.location.href = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].auth.sign_in;
        }
    }
    // Raw axios text ("Request failed with status code 500", "Network Error")
    // must never reach a user, whichever component ends up showing it.
    if (error instanceof Error) {
        error.message = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error);
    }
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = axiosInstance;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/config/api/routes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiRoutes",
    ()=>ApiRoutes
]);
const ApiRoutes = {
    health: {
        prefix: "/health"
    },
    contact: "/contact",
    auth: {
        email: {
            register: "/auth/email/register",
            login: "/auth/email/login",
            waitlist: "/auth/email/waitlist"
        },
        forgotPassword: "/auth/forgot-password",
        resetPassword: "/auth/reset-password",
        resetPasswordInfo: "/auth/reset-password/info",
        changePassword: "/auth/change-password"
    },
    users: {
        prefix: "/users",
        me: "/users/me",
        meAccounts: "/users/me/accounts",
        byId: (id)=>`/users/${id}`,
        mePayoutAccount: "/users/me/payout-account",
        mePayoutAccountRefreshStatus: "/users/me/payout-account/refresh-status"
    },
    organizations: {
        prefix: "/organizations",
        byId: (id)=>`/organizations/${id}`,
        members: (organizationId)=>`/organizations/${organizationId}/members`,
        member: (organizationId, memberId)=>`/organizations/${organizationId}/members/${memberId}`,
        stores: (organizationId)=>`/organizations/${organizationId}/stores`,
        subscription: (organizationId)=>`/organizations/${organizationId}/subscription`,
        subscriptionCancel: (organizationId)=>`/organizations/${organizationId}/subscription/cancel`,
        dashboard: {
            overview: (organizationId)=>`/organizations/${organizationId}/dashboard/overview`,
            trends: (organizationId)=>`/organizations/${organizationId}/dashboard/trends`,
            employeesPerformance: (organizationId)=>`/organizations/${organizationId}/dashboard/employees-performance`,
            storesPerformance: (organizationId)=>`/organizations/${organizationId}/dashboard/stores-performance`,
            experienceScore: (organizationId)=>`/organizations/${organizationId}/dashboard/experience-score`
        }
    },
    stores: {
        byId: (id)=>`/stores/${id}`,
        employees: (storeId)=>`/stores/${storeId}/employees`,
        qrCodes: (storeId)=>`/stores/${storeId}/qr-codes`,
        qrTemplateCustomization: (storeId, templateId)=>`/stores/${storeId}/qr-template-customizations/${templateId}`,
        spots: (storeId)=>`/stores/${storeId}/spots`,
        distributionRules: (storeId)=>`/stores/${storeId}/distribution-rules`,
        defaultDistributionRule: (storeId)=>`/stores/${storeId}/default-distribution-rule`,
        tips: (storeId)=>`/stores/${storeId}/tips`,
        tipsExport: (storeId)=>`/stores/${storeId}/tips/export`,
        settlements: (storeId)=>`/stores/${storeId}/settlements`,
        settlementBalances: (storeId)=>`/stores/${storeId}/settlements/balances`,
        settlementOwedDistributions: (storeId)=>`/stores/${storeId}/settlements/owed-distributions`,
        settlementAdjustments: (storeId)=>`/stores/${storeId}/settlements/adjustments`,
        settlementsExport: (storeId)=>`/stores/${storeId}/settlements/export`,
        reviews: (storeId)=>`/stores/${storeId}/reviews`,
        reviewCategories: (storeId)=>`/stores/${storeId}/review-categories`,
        reviewCategory: (storeId, id)=>`/stores/${storeId}/review-categories/${id}`,
        reviewTags: (storeId)=>`/stores/${storeId}/review-tags`,
        reviewTag: (storeId, id)=>`/stores/${storeId}/review-tags/${id}`,
        feedbackQuestions: (storeId)=>`/stores/${storeId}/feedback-questions`,
        feedbackQuestion: (storeId, id)=>`/stores/${storeId}/feedback-questions/${id}`,
        refunds: (storeId)=>`/stores/${storeId}/refunds`,
        payoutAccount: (storeId)=>`/stores/${storeId}/payout-account`,
        payoutAccountRefreshStatus: (storeId)=>`/stores/${storeId}/payout-account/refresh-status`,
        payouts: (storeId)=>`/stores/${storeId}/payouts`,
        payoutsRun: (storeId)=>`/stores/${storeId}/payouts/run`,
        payoutsPreview: (storeId)=>`/stores/${storeId}/payouts/preview`,
        distributions: (storeId)=>`/stores/${storeId}/distributions`,
        payoutRequests: (storeId)=>`/stores/${storeId}/payout-requests`,
        payoutRequestsPreview: (storeId)=>`/stores/${storeId}/payout-requests/preview`,
        payoutRequest: (storeId, id)=>`/stores/${storeId}/payout-requests/${id}`,
        payoutRequestInvoiceUrl: (storeId, id)=>`/stores/${storeId}/payout-requests/${id}/invoice-url`,
        payoutRequestCancel: (storeId, id)=>`/stores/${storeId}/payout-requests/${id}/cancel`,
        alerts: (storeId)=>`/stores/${storeId}/alerts`,
        alertsReadAll: (storeId)=>`/stores/${storeId}/alerts/read-all`,
        alertPreferences: (storeId)=>`/stores/${storeId}/alert-preferences`,
        alertPreference: (storeId, alertType)=>`/stores/${storeId}/alert-preferences/${alertType}`,
        analyticsTips: (storeId)=>`/stores/${storeId}/analytics/tips`,
        insights: (storeId)=>`/stores/${storeId}/insights`,
        insightsGenerate: (storeId)=>`/stores/${storeId}/insights/generate`
    },
    employees: {
        byId: (id)=>`/employees/${id}`,
        resendInvite: (id)=>`/employees/${id}/resend-invite`,
        dashboard: (id)=>`/employees/${id}/dashboard`,
        settlements: (id)=>`/employees/${id}/settlements`,
        settlementBalance: (id)=>`/employees/${id}/settlement-balance`,
        qrCode: (id)=>`/employees/${id}/qr-code`,
        tips: (id)=>`/employees/${id}/tips`,
        reviews: (id)=>`/employees/${id}/reviews`,
        payouts: (id)=>`/employees/${id}/payouts`,
        payoutAccount: (id)=>`/employees/${id}/payout-account`,
        payoutAccountRefreshStatus: (id)=>`/employees/${id}/payout-account/refresh-status`
    },
    qrCodes: {
        byId: (id)=>`/qr-codes/${id}`,
        stats: (id)=>`/qr-codes/${id}/stats`
    },
    spots: {
        byId: (id)=>`/spots/${id}`
    },
    settlements: {
        reverse: (id)=>`/settlements/${id}/reverse`,
        confirm: (id)=>`/settlements/${id}/confirm`
    },
    distributionRules: {
        byId: (id)=>`/distribution-rules/${id}`,
        payoutModeImpact: (id)=>`/distribution-rules/${id}/payout-mode-impact`
    },
    tips: {
        byId: (id)=>`/tips/${id}`
    },
    reviews: {
        byId: (id)=>`/reviews/${id}`
    },
    refunds: {
        prefix: "/refunds",
        byId: (id)=>`/refunds/${id}`
    },
    alerts: {
        markRead: (id)=>`/alerts/${id}/read`
    },
    documents: {
        prefix: "/documents",
        me: "/documents/me",
        byId: (id)=>`/documents/${id}`
    },
    public: {
        qr: (code)=>`/public/qr/${code}`,
        tips: "/public/tips",
        tipStatus: (id)=>`/public/tips/${id}/status`,
        tipByOrderCode: (orderCode)=>`/public/tips/by-order-code/${orderCode}`,
        tipRefundRequest: (tipId)=>`/public/tips/${tipId}/refund-request`,
        store: (slug)=>`/public/stores/${slug}`,
        storeReviewConfig: (slug)=>`/public/stores/${slug}/review-config`,
        reviews: "/public/reviews"
    },
    googleMaps: {
        timezone: "/google-maps/timezone"
    },
    appConfig: {
        vatRate: "/app-config/vat-rate",
        payoutPolicy: "/app-config/payout-policy"
    },
    admin: {
        stores: "/admin/stores",
        appConfig: "/admin/app-config",
        payments: {
            prefix: "/admin/payments",
            reconcile: "/admin/payments/reconcile"
        },
        webhookEvents: {
            prefix: "/admin/webhook-events"
        },
        payoutAccounts: {
            reconcile: "/admin/payout-accounts/reconcile"
        },
        payouts: {
            prefix: "/admin/payouts",
            manual: "/admin/payouts/manual",
            byId: (id)=>`/admin/payouts/${id}`
        },
        payoutRequests: {
            prefix: "/admin/payout-requests",
            pendingCount: "/admin/payout-requests/pending-count",
            byId: (id)=>`/admin/payout-requests/${id}`,
            invoiceUrl: (id)=>`/admin/payout-requests/${id}/invoice-url`,
            approve: (id)=>`/admin/payout-requests/${id}/approve`,
            reject: (id)=>`/admin/payout-requests/${id}/reject`,
            recheck: (id)=>`/admin/payout-requests/${id}/recheck`
        },
        analytics: {
            overview: "/admin/analytics/overview",
            trends: "/admin/analytics/trends"
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/features/auth/hooks/use-auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authQueryKeys",
    ()=>authQueryKeys,
    "useAcceptInvite",
    ()=>useAcceptInvite,
    "useChangePassword",
    ()=>useChangePassword,
    "useForgotPassword",
    ()=>useForgotPassword,
    "useInviteInfo",
    ()=>useInviteInfo,
    "useLoginBusiness",
    ()=>useLoginBusiness,
    "useLoginEmployee",
    ()=>useLoginEmployee,
    "useLoginWithEmail",
    ()=>useLoginWithEmail,
    "useLogout",
    ()=>useLogout,
    "useRegisterBusiness",
    ()=>useRegisterBusiness,
    "useRegisterWithEmail",
    ()=>useRegisterWithEmail,
    "useResetPassword",
    ()=>useResetPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$services$2f$auth$2e$services$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/features/auth/services/auth.services.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$users$2f$services$2f$users$2e$services$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/features/users/services/users.services.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/stores/auth.store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/routes/routes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/components/ui/toast.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$analytics$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/lib/analytics/analytics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$constants$2f$analytics$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/config/constants/analytics-events.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/lib/api-error.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
const authQueryKeys = {
    root: [
        "auth"
    ],
    session: [
        "auth",
        "session"
    ]
};
// Remembers which sign-in tab (business vs. employee) a forgot-password
// request came from, since that context is otherwise lost once the person
// leaves the app to open the reset link from their email.
const AUTH_ROLE_HINT_STORAGE_KEY = "delitip-auth-role-hint";
const rememberAuthRoleHint = (role)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.setItem(AUTH_ROLE_HINT_STORAGE_KEY, role);
};
const consumeAuthRoleHint = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const hint = window.localStorage.getItem(AUTH_ROLE_HINT_STORAGE_KEY);
    if (hint) window.localStorage.removeItem(AUTH_ROLE_HINT_STORAGE_KEY);
    return hint === "employee" ? "employee" : null;
};
const splitFullName = (fullName)=>{
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    const first_name = parts[0] ?? "";
    const last_name = parts.slice(1).join(" ") || undefined;
    return {
        first_name,
        last_name
    };
};
const useLoginWithEmail = ()=>{
    _s();
    const setSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "useLoginWithEmail.useAuthStore[setSession]": (state)=>state.setSession
    }["useLoginWithEmail.useAuthStore[setSession]"]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useLoginWithEmail.useMutation": (payload)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$services$2f$auth$2e$services$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loginWithEmail"])(payload)
        }["useLoginWithEmail.useMutation"],
        onSuccess: {
            "useLoginWithEmail.useMutation": (data)=>{
                setSession({
                    accessToken: data.access_token,
                    user: data.user
                });
            }
        }["useLoginWithEmail.useMutation"]
    });
};
_s(useLoginWithEmail, "OyqSY3F/knQy+cMskqPu61JVW1s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useLoginBusiness = ()=>{
    _s1();
    const setSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "useLoginBusiness.useAuthStore[setSession]": (state)=>state.setSession
    }["useLoginBusiness.useAuthStore[setSession]"]);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useLoginBusiness.useMutation": (payload)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$services$2f$auth$2e$services$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loginWithEmail"])(payload)
        }["useLoginBusiness.useMutation"],
        onSuccess: {
            "useLoginBusiness.useMutation": (data)=>{
                setSession({
                    accessToken: data.access_token,
                    user: data.user
                });
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$analytics$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackEvent"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$constants$2f$analytics$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnalyticsEvents"].loginCompleted, {
                    method: "email",
                    account_type: "business"
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].add({
                    title: "Signed in",
                    description: "Welcome back to delitip.",
                    type: "success"
                });
                router.push(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].dashboard.root);
            }
        }["useLoginBusiness.useMutation"],
        onError: {
            "useLoginBusiness.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].add({
                    title: "Could not sign in",
                    description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error),
                    type: "error"
                });
            }
        }["useLoginBusiness.useMutation"]
    });
};
_s1(useLoginBusiness, "VIrdENn/k/2ZAQFtTXcsJ54D/E4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useLoginEmployee = ()=>{
    _s2();
    const setSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "useLoginEmployee.useAuthStore[setSession]": (state)=>state.setSession
    }["useLoginEmployee.useAuthStore[setSession]"]);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useLoginEmployee.useMutation": (payload)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$services$2f$auth$2e$services$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loginWithEmail"])(payload)
        }["useLoginEmployee.useMutation"],
        onSuccess: {
            "useLoginEmployee.useMutation": (data)=>{
                setSession({
                    accessToken: data.access_token,
                    user: data.user
                });
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$analytics$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackEvent"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$constants$2f$analytics$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnalyticsEvents"].loginCompleted, {
                    method: "email",
                    account_type: "employee"
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].add({
                    title: "Signed in",
                    description: "Welcome to your tip profile.",
                    type: "success"
                });
                router.push(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].employee.root);
            }
        }["useLoginEmployee.useMutation"],
        onError: {
            "useLoginEmployee.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].add({
                    title: "Could not sign in",
                    description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error),
                    type: "error"
                });
            }
        }["useLoginEmployee.useMutation"]
    });
};
_s2(useLoginEmployee, "VIrdENn/k/2ZAQFtTXcsJ54D/E4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useRegisterWithEmail = ()=>{
    _s3();
    const setSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "useRegisterWithEmail.useAuthStore[setSession]": (state)=>state.setSession
    }["useRegisterWithEmail.useAuthStore[setSession]"]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useRegisterWithEmail.useMutation": (payload)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$services$2f$auth$2e$services$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerWithEmail"])(payload)
        }["useRegisterWithEmail.useMutation"],
        onSuccess: {
            "useRegisterWithEmail.useMutation": (data)=>{
                setSession({
                    accessToken: data.access_token,
                    user: data.user
                });
            }
        }["useRegisterWithEmail.useMutation"]
    });
};
_s3(useRegisterWithEmail, "OyqSY3F/knQy+cMskqPu61JVW1s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useRegisterBusiness = ()=>{
    _s4();
    const setSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "useRegisterBusiness.useAuthStore[setSession]": (state)=>state.setSession
    }["useRegisterBusiness.useAuthStore[setSession]"]);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useRegisterBusiness.useMutation": async (payload)=>{
                const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$services$2f$auth$2e$services$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerWithEmail"])({
                    email: payload.email,
                    password: payload.password
                });
                setSession({
                    accessToken: auth.access_token,
                    user: auth.user
                });
                const { first_name, last_name } = splitFullName(payload.fullName);
                if (first_name) {
                    try {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$users$2f$services$2f$users$2e$services$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateMe"])({
                            first_name,
                            last_name
                        });
                    } catch  {}
                }
                return auth;
            }
        }["useRegisterBusiness.useMutation"],
        onSuccess: {
            "useRegisterBusiness.useMutation": ()=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$analytics$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackEvent"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$constants$2f$analytics$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnalyticsEvents"].signUpCompleted, {
                    method: "email",
                    account_type: "business"
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].add({
                    title: "Account created",
                    description: "Finish a few details to open your dashboard.",
                    type: "success"
                });
                router.push(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].onboarding);
            }
        }["useRegisterBusiness.useMutation"],
        onError: {
            "useRegisterBusiness.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].add({
                    title: "Could not create account",
                    description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error),
                    type: "error"
                });
            }
        }["useRegisterBusiness.useMutation"]
    });
};
_s4(useRegisterBusiness, "VIrdENn/k/2ZAQFtTXcsJ54D/E4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useForgotPassword = ()=>{
    _s5();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useForgotPassword.useMutation": (payload)=>{
                if (payload.role === "employee") rememberAuthRoleHint("employee");
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$services$2f$auth$2e$services$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forgotPassword"])({
                    email: payload.email
                });
            }
        }["useForgotPassword.useMutation"],
        onSuccess: {
            "useForgotPassword.useMutation": ()=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$analytics$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackEvent"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$constants$2f$analytics$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnalyticsEvents"].passwordResetRequested);
            }
        }["useForgotPassword.useMutation"],
        onError: {
            "useForgotPassword.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].add({
                    title: "Could not send reset email",
                    description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error),
                    type: "error"
                });
            }
        }["useForgotPassword.useMutation"]
    });
};
_s5(useForgotPassword, "wwwtpB20p0aLiHIvSy5P98MwIUg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useResetPassword = ()=>{
    _s6();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useResetPassword.useMutation": (payload)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$services$2f$auth$2e$services$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resetPassword"])(payload)
        }["useResetPassword.useMutation"],
        onSuccess: {
            "useResetPassword.useMutation": ()=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$analytics$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackEvent"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$constants$2f$analytics$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnalyticsEvents"].passwordResetCompleted);
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].add({
                    title: "Password updated",
                    description: "You can sign in with your new password.",
                    type: "success"
                });
                const roleHint = consumeAuthRoleHint();
                router.push(roleHint === "employee" ? `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].auth.sign_in}?role=employee` : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].auth.sign_in);
            }
        }["useResetPassword.useMutation"],
        onError: {
            "useResetPassword.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].add({
                    title: "Could not reset password",
                    description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error),
                    type: "error"
                });
            }
        }["useResetPassword.useMutation"]
    });
};
_s6(useResetPassword, "lHfbI+rOT8+gOePqabn4rxRzacM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useInviteInfo = (token)=>{
    _s7();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            ...authQueryKeys.root,
            "invite-info",
            token
        ],
        queryFn: {
            "useInviteInfo.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$services$2f$auth$2e$services$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getResetTokenInfo"])(token)
        }["useInviteInfo.useQuery"],
        enabled: !!token,
        retry: false
    });
};
_s7(useInviteInfo, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
const useAcceptInvite = ()=>{
    _s8();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useAcceptInvite.useMutation": (payload)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$services$2f$auth$2e$services$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resetPassword"])(payload)
        }["useAcceptInvite.useMutation"],
        onSuccess: {
            "useAcceptInvite.useMutation": ()=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$analytics$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackEvent"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$constants$2f$analytics$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnalyticsEvents"].inviteAccepted);
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].add({
                    title: "Account activated",
                    description: "You can now sign in with your new password.",
                    type: "success"
                });
                router.push(`${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].auth.sign_in}?role=employee`);
            }
        }["useAcceptInvite.useMutation"],
        onError: {
            "useAcceptInvite.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].add({
                    title: "Could not activate account",
                    description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error),
                    type: "error"
                });
            }
        }["useAcceptInvite.useMutation"]
    });
};
_s8(useAcceptInvite, "lHfbI+rOT8+gOePqabn4rxRzacM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useChangePassword = ()=>{
    _s9();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useChangePassword.useMutation": (payload)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$features$2f$auth$2f$services$2f$auth$2e$services$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["changePassword"])(payload)
        }["useChangePassword.useMutation"],
        onSuccess: {
            "useChangePassword.useMutation": ()=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$analytics$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackEvent"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$constants$2f$analytics$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnalyticsEvents"].passwordChanged);
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].add({
                    title: "Password updated",
                    description: "Your password has been changed.",
                    type: "success"
                });
            }
        }["useChangePassword.useMutation"],
        onError: {
            "useChangePassword.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].add({
                    title: "Could not change password",
                    description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error),
                    type: "error"
                });
            }
        }["useChangePassword.useMutation"]
    });
};
_s9(useChangePassword, "wwwtpB20p0aLiHIvSy5P98MwIUg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useLogout = ()=>{
    _s10();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const clearSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "useLogout.useAuthStore[clearSession]": (state)=>state.clearSession
    }["useLogout.useAuthStore[clearSession]"]);
    return (options)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$analytics$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackEvent"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$constants$2f$analytics$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnalyticsEvents"].logoutCompleted);
        clearSession();
        queryClient.clear();
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].add({
            title: "Signed out",
            description: "You have been signed out of delitip.",
            type: "success"
        });
        router.replace(options?.redirectTo ?? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$routes$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"].auth.sign_in);
    };
};
_s10(useLogout, "Cga0K+wDd0lzMo+J8/dqvVvzwO4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$stores$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/features/auth/services/auth.services.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "changePassword",
    ()=>changePassword,
    "forgotPassword",
    ()=>forgotPassword,
    "getResetTokenInfo",
    ()=>getResetTokenInfo,
    "joinWaitlist",
    ()=>joinWaitlist,
    "loginWithEmail",
    ()=>loginWithEmail,
    "registerWithEmail",
    ()=>registerWithEmail,
    "resetPassword",
    ()=>resetPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/config/api/axios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/config/api/routes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/lib/api-error.ts [app-client] (ecmascript)");
;
;
;
const loginWithEmail = async (payload)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiRoutes"].auth.email.login, payload);
        return response.data;
    } catch (error) {
        throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error, "We couldn't sign you in. Please check your email and password."));
    }
};
const registerWithEmail = async (payload)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiRoutes"].auth.email.register, payload);
        return response.data;
    } catch (error) {
        throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error, "We couldn't create account. Please try again."));
    }
};
const joinWaitlist = async (payload)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiRoutes"].auth.email.waitlist, payload);
        return response.data;
    } catch (error) {
        throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error, "We couldn't join waitlist. Please try again."));
    }
};
const forgotPassword = async (payload)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiRoutes"].auth.forgotPassword, payload);
        return response.data;
    } catch (error) {
        throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error, "We couldn't request password reset. Please try again."));
    }
};
const resetPassword = async (payload)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiRoutes"].auth.resetPassword, payload);
        return response.data;
    } catch (error) {
        throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error, "We couldn't reset password. Please try again."));
    }
};
const getResetTokenInfo = async (token)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiRoutes"].auth.resetPasswordInfo, {
            params: {
                token
            }
        });
        return response.data;
    } catch (error) {
        throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error, "This link is invalid or has expired."));
    }
};
const changePassword = async (payload)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiRoutes"].auth.changePassword, payload);
        return response.data;
    } catch (error) {
        throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error, "We couldn't change password. Please try again."));
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/features/auth/validation-schemas/auth.schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "businessSignInSchema",
    ()=>businessSignInSchema,
    "businessSignUpSchema",
    ()=>businessSignUpSchema,
    "changePasswordSchema",
    ()=>changePasswordSchema,
    "employeeSignInSchema",
    ()=>employeeSignInSchema,
    "forgotPasswordSchema",
    ()=>forgotPasswordSchema,
    "resetPasswordSchema",
    ()=>resetPasswordSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/app/node_modules/zod/v3/external.js [app-client] (ecmascript) <export * as z>");
;
const businessSignUpSchema = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    fullName: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, "Full name is required"),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().email("Enter a valid work email"),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8, "Password must be at least 8 characters")
});
const businessSignInSchema = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().email("Enter a valid work email"),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Password is required")
});
const employeeSignInSchema = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().email("Enter a valid email"),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Password is required")
});
const forgotPasswordSchema = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().email("Enter a valid email")
});
const resetPasswordSchema = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    password: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8, "Password must be at least 8 characters"),
    confirmPassword: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Confirm your password")
}).refine((data)=>data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: [
        "confirmPassword"
    ]
});
const changePasswordSchema = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    current_password: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Current password is required"),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8, "Password must be at least 8 characters"),
    confirmPassword: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Confirm your new password")
}).refine((data)=>data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: [
        "confirmPassword"
    ]
}).refine((data)=>data.password !== data.current_password, {
    message: "New password must be different from your current password",
    path: [
        "password"
    ]
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/features/users/services/users.services.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteUser",
    ()=>deleteUser,
    "getMe",
    ()=>getMe,
    "getMyAccounts",
    ()=>getMyAccounts,
    "listUsers",
    ()=>listUsers,
    "updateMe",
    ()=>updateMe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/config/api/axios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/config/api/routes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/src/lib/api-error.ts [app-client] (ecmascript)");
;
;
;
const getMe = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiRoutes"].users.me);
        return response.data;
    } catch (error) {
        throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error, "We couldn't load your profile. Please try again."));
    }
};
const updateMe = async (payload)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiRoutes"].users.me, payload);
        return response.data;
    } catch (error) {
        throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error, "We couldn't update your profile. Please try again."));
    }
};
const listUsers = async (query)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiRoutes"].users.prefix, {
            params: query
        });
        return response.data;
    } catch (error) {
        throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error, "We couldn't load users. Please try again."));
    }
};
const deleteUser = async (id)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiRoutes"].users.byId(id));
        return response.data;
    } catch (error) {
        // The API explains why a delete is refused (own account, protected role,
        // payout invoice in use), so surface its message instead of a generic one.
        throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error, "We couldn't delete this user. Please try again."));
    }
};
const getMyAccounts = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$config$2f$api$2f$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiRoutes"].users.meAccounts);
        return response.data;
    } catch (error) {
        throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$src$2f$lib$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getErrorMessage"])(error, "We couldn't load your accounts. Please try again."));
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/src/lib/api-error.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GENERIC_ERROR_MESSAGE",
    ()=>GENERIC_ERROR_MESSAGE,
    "NETWORK_ERROR_MESSAGE",
    ()=>NETWORK_ERROR_MESSAGE,
    "SERVER_ERROR_MESSAGE",
    ()=>SERVER_ERROR_MESSAGE,
    "TRANSFER_FAILED_MESSAGE",
    ()=>TRANSFER_FAILED_MESSAGE,
    "UNREACHABLE_SERVICE_MESSAGE",
    ()=>UNREACHABLE_SERVICE_MESSAGE,
    "getErrorMessage",
    ()=>getErrorMessage,
    "getFriendlyMessage",
    ()=>getFriendlyMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/node_modules/axios/index.js [app-client] (ecmascript) <locals>");
;
const NETWORK_ERROR_MESSAGE = "We couldn't reach delitip. Please check your internet connection and try again.";
const SERVER_ERROR_MESSAGE = "Something went wrong on our side. Please try again in a moment.";
const UNREACHABLE_SERVICE_MESSAGE = "We're having trouble connecting to delitip right now. Please try again in a moment.";
const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";
const STATUS_MESSAGES = {
    400: "Some of the information isn't valid. Please check it and try again.",
    401: "Your session has expired. Please sign in again.",
    403: "You don't have permission to do that.",
    404: "We couldn't find what you were looking for.",
    405: UNREACHABLE_SERVICE_MESSAGE,
    408: NETWORK_ERROR_MESSAGE,
    409: "This conflicts with something that already exists. Please refresh the page and try again.",
    413: "That file is too large. Please choose a smaller one.",
    415: "That file type isn't supported.",
    422: "Some of the information isn't valid. Please check it and try again.",
    429: "Too many attempts. Please wait a moment and try again.",
    502: UNREACHABLE_SERVICE_MESSAGE,
    503: UNREACHABLE_SERVICE_MESSAGE,
    504: UNREACHABLE_SERVICE_MESSAGE
};
/** Statuses where the status text beats an action-specific fallback. */ const STATUS_OVERRIDES_FALLBACK = new Set([
    401,
    403,
    413,
    415,
    429
]);
/** Known API messages that are technical or leak provider internals. */ const REWRITES = [
    [
        /^invalid credentials$/i,
        "The email or password is incorrect."
    ],
    [
        /^invalid token$/i,
        "Your session has expired. Please sign in again."
    ],
    [
        /invalid or expired reset token/i,
        "This reset link is invalid or has expired. Please request a new one."
    ],
    [
        /password login is not set up/i,
        "This account doesn't use a password. Try signing in another way."
    ],
    [
        /user with this email already exists/i,
        "An account with this email already exists. Try signing in instead."
    ],
    [
        /unable to .*payment processor|failed to refund payment/i,
        "We couldn't complete this with our payment provider. Please try again in a moment."
    ],
    [
        /not configured|VIVA_/i,
        "This isn't available yet. Please contact support if it keeps happening."
    ],
    [
        /failed to send message/i,
        "We couldn't send your message. Please try again."
    ],
    [
        /failed to send (bulk )?email/i,
        "We couldn't send the email. Please try again in a moment."
    ],
    [
        /employee_id is required for EMPLOYEE recipients/i,
        "Choose an employee for every employee recipient."
    ],
    [
        /employee_id must not be set for STORE recipients/i,
        "A store recipient can't have an employee selected."
    ],
    [
        /sender ip not allowed/i,
        UNREACHABLE_SERVICE_MESSAGE
    ]
];
/** Text that is only meaningful to a developer. */ const TECHNICAL_PATTERNS = [
    /^cannot (get|post|put|patch|delete|head|options)\b/i,
    /^(internal server error|bad request|unauthorized|forbidden( resource)?|not found|conflict|bad gateway|service unavailable|gateway timeout|unprocessable entity|too many requests|payload too large|method not allowed|network error|error|failed|undefined|null)\.?$/i,
    /request failed with status code/i,
    /timeout of \d+ms exceeded/i,
    /^(ECONN\w+|ETIMEDOUT|ENOTFOUND|EAI_AGAIN)\b/,
    /\b(ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND)\b/,
    /validation failed|invalid query parameters/i,
    /webhook error/i,
    /^failed to (get|change) /i,
    /invalid (alert type|template id)/i,
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i,
    /cannot read propert|is not a function|is not defined|unexpected token|is not valid json|\[object |failed to fetch|fetch failed|load failed|networkerror|aborterror|aborted|stack|prisma|\bsql\b|\bnull\b|\bundefined\b|\bNaN\b/i
];
const isTechnical = (text)=>TECHNICAL_PATTERNS.some((pattern)=>pattern.test(text.trim()));
const humanizeField = (field)=>field.replace(/\[\d+\]/g, "").split(".").pop().replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
const capitalize = (text)=>text.charAt(0).toUpperCase() + text.slice(1);
/**
 * class-validator style messages: "email must be an email",
 * "password must be longer than or equal to 8 characters".
 * Returns null when the text isn't one.
 */ const humanizeValidation = (text)=>{
    const match = text.match(/^([\w.[\]]+) (.+)$/);
    if (!match) return null;
    const [, rawField, rule] = match;
    const field = humanizeField(rawField);
    if (/must be an email/i.test(rule)) {
        return "Please enter a valid email address.";
    }
    if (/should not be empty|must not be empty/i.test(rule)) {
        return `Please fill in the ${field} field.`;
    }
    const longer = rule.match(/must be longer than or equal to (\d+) characters/i);
    if (longer) return `${capitalize(field)} must be at least ${longer[1]} characters long.`;
    const shorter = rule.match(/must be shorter than or equal to (\d+) characters/i);
    if (shorter) return `${capitalize(field)} can be at most ${shorter[1]} characters long.`;
    const min = rule.match(/must not be less than (\d+)/i);
    if (min) return `${capitalize(field)} must be at least ${min[1]}.`;
    const max = rule.match(/must not be greater than (\d+)/i);
    if (max) return `${capitalize(field)} can be at most ${max[1]}.`;
    if (/must be (a|an|one of|a valid|a positive|a boolean|an array|a url|a uuid|a string|a number|an integer|a date|an iso)|should not exist|must contain|must match/i.test(rule)) {
        return `Please check the ${field} field and try again.`;
    }
    return null;
};
const cleanServerMessage = (raw)=>{
    const text = Array.isArray(raw) ? raw.find((m)=>typeof m === "string") : raw;
    if (typeof text !== "string" || text.trim().length === 0) return null;
    const trimmed = text.trim();
    for (const [pattern, replacement] of REWRITES){
        if (pattern.test(trimmed)) return replacement;
    }
    const validation = humanizeValidation(trimmed);
    if (validation) return validation;
    if (isTechnical(trimmed)) return null;
    return trimmed;
};
const messageFromStatus = (status, fallback)=>{
    if (STATUS_OVERRIDES_FALLBACK.has(status)) return STATUS_MESSAGES[status];
    if (fallback) return fallback;
    if (STATUS_MESSAGES[status]) return STATUS_MESSAGES[status];
    if (status >= 500) return SERVER_ERROR_MESSAGE;
    return GENERIC_ERROR_MESSAGE;
};
const getErrorMessage = (error, fallback)=>{
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isAxiosError"])(error)) {
        const serverMessage = cleanServerMessage(error.response?.data?.message);
        if (serverMessage) return serverMessage;
        const status = error.response?.status;
        if (status === undefined) {
            // Never reached the server: offline, DNS, CORS, timeout.
            return NETWORK_ERROR_MESSAGE;
        }
        const rawMessage = error.response?.data?.message;
        const rawText = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
        if (status === 404 && typeof rawText === "string" && /^cannot (get|post|put|patch|delete)\b/i.test(rawText)) {
            // The route doesn't exist: the app can't reach a matching API.
            return UNREACHABLE_SERVICE_MESSAGE;
        }
        return messageFromStatus(status, fallback);
    }
    if (error instanceof Error) {
        const cleaned = cleanServerMessage(error.message);
        if (cleaned) return cleaned;
    } else if (typeof error === "string") {
        const cleaned = cleanServerMessage(error);
        if (cleaned) return cleaned;
    }
    return fallback ?? GENERIC_ERROR_MESSAGE;
};
const getFriendlyMessage = (raw, fallback)=>cleanServerMessage(raw) ?? fallback;
const TRANSFER_FAILED_MESSAGE = "The bank transfer didn't go through. Please try again, or contact support if it keeps happening.";
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_src_06ewm-h._.js.map