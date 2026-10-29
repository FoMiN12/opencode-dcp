import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["index.ts", "tui.tsx", "lib/opencode/rpc.ts"],
    format: ["esm"],
    dts: false,
    clean: true,
    sourcemap: true,
    noExternal: ["jsonc-parser", "@anthropic-ai/tokenizer"], // Bundle these; also keeps the output free of bare imports
    splitting: false, // single self-contained file so it can be installed as a local plugin
    banner: {
        // Bundled CJS (tiktoken via @anthropic-ai/tokenizer) uses require(),
        // __filename and __dirname; provide them in the ESM output.
        js: [
            'import { createRequire as __createRequire } from "module";',
            'import { fileURLToPath as __fileURLToPath } from "url";',
            'import { dirname as __dirnameOf } from "path";',
            "const require = __createRequire(import.meta.url);",
            "const __filename = __fileURLToPath(import.meta.url);",
            "const __dirname = __dirnameOf(__filename);",
        ].join(" "),
    },
})
