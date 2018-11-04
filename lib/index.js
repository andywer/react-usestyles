import { useContext, useMemo, useMutationEffect, useState } from "react"
import { ThemeContext } from "theming"
import { CssInJsContext } from "./unified-cssinjs"

export function useStyles (stylesOrCallback, props = {}) {
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
