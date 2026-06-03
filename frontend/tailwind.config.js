module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-secondary-fixed-variant": "#474746",
        "on-primary-container": "#5b7300",
        "on-primary-fixed-variant": "#3c4d00",
        "on-error": "#ffffff",
        "tertiary-container": "#ededed",
        "surface-container": "#efeded",
        "primary-fixed-dim": "#abd600",
        "on-secondary-container": "#636262",
        "on-primary": "#ffffff",
        "surface-variant": "#e3e2e2",
        "inverse-on-surface": "#f2f0f0",
        "outline": "#747a60",
        "on-tertiary-container": "#6a6b6b",
        "surface-container-highest": "#e3e2e2",
        "on-tertiary-fixed-variant": "#454747",
        "inverse-surface": "#303031",
        "on-tertiary": "#ffffff",
        "error-container": "#ffdad6",
        "surface-bright": "#faf9f9",
        "tertiary": "#5d5f5f",
        "surface-dim": "#dbdad9",
        "secondary-container": "#e2dfde",
        "on-primary-fixed": "#161e00",
        "background": "#faf9f9",
        "secondary": "#5f5e5e",
        "primary": "#506600",
        "inverse-primary": "#abd600",
        "on-surface": "#1b1c1c",
        "tertiary-fixed": "#e2e2e2",
        "primary-container": "#ccff00",
        "error": "#ba1a1a",
        "on-background": "#1b1c1c",
        "surface-container-high": "#e9e8e8",
        "surface": "#faf9f9",
        "on-secondary": "#ffffff",
        "surface-tint": "#506600",
        "secondary-fixed-dim": "#c8c6c5",
        "on-tertiary-fixed": "#1a1c1c",
        "surface-container-low": "#f5f3f3",
        "surface-container-lowest": "#ffffff",
        "on-error-container": "#93000a",
        "on-secondary-fixed": "#1c1b1b",
        "on-surface-variant": "#444933",
        "tertiary-fixed-dim": "#c6c6c7",
        "outline-variant": "#c4c9ac",
        "secondary-fixed": "#e5e2e1",
        "primary-fixed": "#c3f400"
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