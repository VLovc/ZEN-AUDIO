module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background": "#09090b", // zinc-950
        "on-background": "#ffffff",
        "surface": "#18181b", // zinc-900
        "on-surface": "#ffffff",
        "surface-variant": "#27272a", // zinc-800
        "on-surface-variant": "#a1a1aa", // zinc-400
        "surface-container-lowest": "rgba(0,0,0,1)",
        "surface-container-low": "rgba(255,255,255,0.02)",
        "surface-container": "rgba(255,255,255,0.05)",
        "surface-container-high": "rgba(255,255,255,0.1)",
        "surface-container-highest": "rgba(255,255,255,0.15)",
        "primary": "#ccff00", // neon green accent
        "on-primary": "#000000",
        "primary-container": "#ccff00",
        "on-primary-container": "#000000",
        "secondary": "#a1a1aa", // zinc-400
        "on-secondary": "#ffffff",
        "error": "#ef4444", // red-500
        "on-error": "#ffffff",
        "error-container": "#7f1d1d", // red-900
        "on-error-container": "#fca5a5", // red-300
        "outline": "#3f3f46", // zinc-700
        "outline-variant": "#27272a",
        "inverse-surface": "#ffffff",
        "inverse-on-surface": "#000000",
        "inverse-primary": "#506600",
      },
      fontFamily: {
        "label-pixel": ["Space Mono"],
        "body-md": ["Inter"],
        "headline-lg": ["Space Grotesk"],
        "control-num": ["Space Mono"]
      },
      fontSize: {
        "label-pixel": ["12px", { "lineHeight": "1.0", "letterSpacing": "0.1em", "fontWeight": "500" }],
        "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "headline-lg": ["32px", { "lineHeight": "1.2", "fontWeight": "600" }],
        "control-num": ["14px", { "lineHeight": "1.0", "fontWeight": "700" }]
      },
      animation: {
        "pulse-neon": "pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "tech-flicker": "tech-flicker 3s linear infinite",
        "eq-bar": "eq-bar 0.8s ease-in-out infinite alternate"
      },
      keyframes: {
        "pulse-neon": { "0%, 100%": { boxShadow: "0 0 0px rgba(171, 214, 0, 0)" }, "50%": { boxShadow: "0 0 15px rgba(171, 214, 0, 0.6)" } },
        "tech-flicker": { "0%, 19.9%, 22%, 62.9%, 65%, 100%": { opacity: "1" }, "20%, 21.9%, 63%, 64.9%": { opacity: "0.4" } },
        "eq-bar": { "0%": { height: "20%" }, "100%": { height: "100%" } }
      }
    }
  }
}