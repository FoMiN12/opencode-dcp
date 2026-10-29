import { RGBA } from "@opentui/core"
import type { Theme, TuiApi, TuiContext } from "./types"

/**
 * Map OpenCode 2 semantic theme tokens (ResolvedTheme) onto the flat palette
 * used by the dialogs.
 *
 * Token shape per @opencode/theme `ResolvedThemeTokens`: colors are RGBA
 * values; action colors are stateful (`base`/`state({...})`); raised surfaces
 * live under `background.raised`. Unknown shapes (older or future hosts) fall
 * back to terminal defaults instead of crashing the TUI render tree.
 */
function mapTheme(theme: TuiContext["theme"]): Theme {
    return {
        primary: theme.text.action.primary.base,
        secondary: theme.text.action.secondary.base,
        accent: theme.text.action.primary.base,
        text: theme.text.base,
        textMuted: theme.text.muted,
        background: theme.background.base,
        backgroundElement: theme.background.raised.base,
        borderSubtle: theme.border.base,
        selectedListItemText: theme.text.action.primary.state({ selected: true }),
        success: theme.text.feedback.success.base,
        warning: theme.text.feedback.warning.base,
        error: theme.text.feedback.error.base,
        info: theme.text.feedback.info.base,
    }
}

let fallbackTheme: Theme | undefined

function getFallbackTheme(): Theme {
    if (!fallbackTheme) {
        fallbackTheme = {
            primary: RGBA.fromHex("#5fafff"),
            secondary: RGBA.fromHex("#87afd7"),
            accent: RGBA.fromHex("#5fafff"),
            text: RGBA.defaultForeground(),
            textMuted: RGBA.fromHex("#9e9e9e"),
            background: RGBA.defaultBackground(),
            backgroundElement: RGBA.fromHex("#262626"),
            borderSubtle: RGBA.fromHex("#444444"),
            selectedListItemText: RGBA.fromHex("#ffffff"),
            success: RGBA.fromHex("#5faf5f"),
            warning: RGBA.fromHex("#ffaf5f"),
            error: RGBA.fromHex("#ff5f5f"),
            info: RGBA.fromHex("#5fafff"),
        }
    }
    return fallbackTheme
}

export function flattenTheme(theme: TuiContext["theme"]): Theme {
    try {
        return mapTheme(theme)
    } catch {
        return getFallbackTheme()
    }
}

export function createTuiApi(context: TuiContext): TuiApi {
    return {
        context,
        theme: {
            get current() {
                return flattenTheme(context.theme)
            },
        },
        ui: {
            dialog: {
                clear: () => context.ui.dialog.clear(),
            },
        },
    }
}
