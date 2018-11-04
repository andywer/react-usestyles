import { useContext, useMemo, useMutationEffect, useState } from "react"
import { ThemeContext } from "theming"
import { CssInJsContext } from "./unified-cssinjs"

function useStylesInternal (stylesOrCallback, props) {
  const cssInJs = useContext(CssInJsContext)
  const theme = useContext(ThemeContext) || {}

  if (!cssInJs) {
    throw new Error("No CSS-in-JS implementation found in context.")
  }
  if (!theme._id) {
    // Hacky! Just give every theme we see an ID, so we can tell them apart easily
    theme._id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  }

  const sheetOptions = {
    restyleOnPropChange: typeof stylesOrCallback === "function" && stylesOrCallback.length >= 2,
    restyleOnThemeChange: typeof stylesOrCallback === "function" && stylesOrCallback.length >= 1
  }

  const styles = typeof stylesOrCallback === "function"
    ? stylesOrCallback(theme, props)
    : stylesOrCallback

  const [sheet] = useState(() => cssInJs.createSheet(styles, theme._id, sheetOptions))

  useMutationEffect(() => {
    sheet.attach()
    return () => sheet.detach()
  }, [])

  // Misusing useMemo here to synchronously sheet.update() only if styles or theme changed
  useMemo(() => {
    if (sheet.attached) {
      sheet.update(styles)
    }
  }, [JSON.stringify(styles), theme])

  return sheet.getClassNames()
}

function transformIntoGlobalStyles (styles) {
  const transformed = {}

  for (const key of Object.keys(styles)) {
    transformed[`@global ${key}`] = styles[key]
  }

  return transformed
}

function wrapStyleCallback (styleCallback, transformStyles) {
  // Don't just pass-through arbitrary arguments, since we check function.length in useStyles()
  if (styleCallback.length === 0) {
    return () => transformStyles(styleCallback())
  } else if (styleCallback.length === 1) {
    return (theme) => transformStyles(styleCallback(theme))
  } else if (styleCallback.length === 2) {
    return (theme, props) => transformStyles(styleCallback(theme, props))
  } else {
    return (...args) => transformStyles(styleCallback(...args))
  }
}

export function useStyles (stylesOrCallback, props = {}) {
  return useStylesInternal(stylesOrCallback, props)
}

export function useGlobalStyles (stylesOrCallback, props = {}) {
  stylesOrCallback = typeof stylesOrCallback === "function"
    ? wrapStyleCallback(stylesOrCallback, transformIntoGlobalStyles)
    : transformIntoGlobalStyles(stylesOrCallback)

  useStylesInternal(stylesOrCallback, props)
}
