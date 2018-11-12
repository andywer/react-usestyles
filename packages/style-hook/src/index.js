import { CssInJsContext } from "@andywer/style-api"
import { useContext, useMemo, useMutationEffect, useState } from "react"
import { ThemeContext } from "theming"

export { ThemeContext }

function useStylesInternal (styles, component, inputs) {
  const cssInJs = useContext(CssInJsContext)
  const theme = useContext(ThemeContext) || {}

  if (!cssInJs) {
    throw new Error("No CSS-in-JS implementation found in context.")
  }
  if (component && typeof component !== "function") {
    throw new Error("Second argument passed to the styling hook is supposed to be the component.")
  }
  if (!theme._id) {
    // Hacky! Just give every theme we see an ID, so we can tell them apart easily
    theme._id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  }

  const [sheet] = useState(() => cssInJs.createSheet(styles, theme._id, theme, component, inputs))

  useMutationEffect(() => {
    sheet.attach()
    return () => sheet.detach()
  }, [])

  // Misusing useMemo here to synchronously sheet.update() only if styles or theme changed
  useMemo(() => {
    if (sheet.attached) {
      sheet.update(styles, theme)
    }
  }, inputs ? [theme, ...inputs] : [theme, Math.random()])

  return sheet.getClassNames()
}

function transformIntoGlobalStyles (styles) {
  const transformed = {}

  for (const key of Object.keys(styles)) {
    transformed[`@global ${key}`] = styles[key]
  }

  return transformed
}

export function useStyles (styles, component = undefined, inputs = undefined) {
  return useStylesInternal(styles, component, inputs)
}

export function useStyle (style, component = undefined, inputs = undefined) {
  return useStylesInternal({ style }, component, inputs).style
}

export function useGlobalStyles (styles, component = undefined, inputs = undefined) {
  const transformedStyles = transformIntoGlobalStyles(styles)
  useStylesInternal(transformedStyles, component, inputs)
}
