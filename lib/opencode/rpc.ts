/**
 * DCP RPC contract shared by the server plugin (`index.ts`) and the CLI plugin
 * (`tui.tsx`). The server emits `toast` events; the TUI renders them.
 */
/**
 * Vendored equivalent of `Rpc.define` from `@opencode/plugin/rpc`
 * (upstream: `define<const D extends Definition>(definition: D): D`).
 * The helper is a validation passthrough; inlining it keeps this bundle free
 * of runtime `@opencode-ai/*` imports (those pull in pinned schema builds
 * that crash against the host's aliased `effect/*` modules).
 */
function defineRpc<const D extends { methods: Record<string, { errors?: Record<string, unknown> }> }>(
    definition: D,
): D {
    const reserved = Object.values(definition.methods)
        .flatMap((method) => Object.keys(method.errors ?? {}))
        .find((name) => name.startsWith("rpc."));
    if (reserved)
        throw new Error(`RPC error names starting with "rpc." are reserved: ${reserved}`);
    return definition;
}

export interface DcpToastEvent {
    title: string
    message: string
    variant: "info" | "success" | "warning" | "error"
    duration: number
}

export const DcpRpc = defineRpc({
    id: "dcp",
    methods: {},
    events: {
        toast: {
            schema: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    message: { type: "string" },
                    variant: { type: "string", enum: ["info", "success", "warning", "error"] },
                    duration: { type: "number" },
                },
                required: ["title", "message", "variant", "duration"],
                additionalProperties: false,
            },
        },
    },
})
