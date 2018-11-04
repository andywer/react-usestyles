import React, { useState } from "react"
import { create, SheetsManager } from "jss"
import defaultPreset from "jss-preset-default"
import { CssInJsProvider } from "./unified-cssinjs"

/**
 * Depending on sheetOptions.restyleOnPropChange & sheetOptions.restyleOnThemeChange,
 * create a key for the sheet, so that other useStyles() hook invocations working
 * with the same styles and updating in the same situations, share a key.
 *
 * That approach ensures that we can safely mutate the stylesheets.
 */
function createSheetKey (styles, themeID, sheetOptions) {
  const { restyleOnPropChange = true, restyleOnThemeChange= true } = sheetOptions
  const randomSheetID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  if (restyleOnPropChange) {
    // Return always-unique key, since prop changes are unique to every React element
    return randomSheetID
  } else if (!restyleOnPropChange && restyleOnThemeChange) {
    // Return a key that is the same for all similarly-styled React elements that use the same theme
    return JSON.stringify(themeID) + ":" + JSON.stringify(styles)
  } else if (!restyleOnPropChange && !restyleOnThemeChange) {
    // Static styles that never change: Use stringified styles as key
    return JSON.stringify(styles)
  }

  return randomSheetID
}

function mutateJssSheet (jssSheet, updatedStyles) {
  const prevClassNames = Object.keys(jssSheet.classes)

  // TODO: Update only the rules that changed

  for (const prevClassName of prevClassNames) {
    jssSheet.deleteRule(prevClassName)
  }

  jssSheet.addRules(updatedStyles)
}

function createUnifiedSheet (sheetKey, jss, manager, styles, jssSheetOptions) {
  const jssSheet = manager.get(sheetKey) || jss.createStyleSheet(styles, jssSheetOptions || {})

  manager.add(sheetKey, jssSheet)

  const sheet = {
    attached: false,
    cacheKeys: {
      sheet: sheetKey,
      styles: JSON.stringify(styles)
    },
    styles,

    attach () {
      manager.manage(sheetKey)
      sheet.attached = true
    },
    detach () {
      manager.unmanage(sheetKey)
      sheet.attached = false
    },
    getClassNames () {
      return jssSheet.classes
    },
    toString () {
      return jssSheet.toString()
    },
    update (updatedStyles) {
      if (updatedStyles === sheet.styles) return

      const updatedStylesCacheKey = JSON.stringify(updatedStyles)
      if (updatedStylesCacheKey === sheet.cacheKeys.styles) return

      mutateJssSheet(jssSheet, updatedStyles)

      sheet.cacheKeys.styles = updatedStylesCacheKey
      sheet.styles = updatedStyles
    }
  }
  return sheet
}

export function JssProvider (props) {
  const [{ jss, manager }] = useState({
    jss: create(defaultPreset()),
    manager: new SheetsManager()
  })

  const createSheet = (styles, themeID, sheetOptions = {}) => {
    const sheetKey = createSheetKey(styles, themeID, sheetOptions)
    return createUnifiedSheet(sheetKey, jss, manager, styles, props.sheetOptions || {})
  }

  return (
    <CssInJsProvider createSheet={createSheet}>
      {props.children}
    </CssInJsProvider>
  )
}
