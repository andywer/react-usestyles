import nanoid from "nanoid"
import React from "react"
import { StylingContext } from "./context"
import hashString from "./string-hash"
import { GeneratedStylesheet } from "./css-sheet"
import { Styles } from "./styles"

type CSSFunction = (styles: Styles) => string

export type StyleClasses<ClassNames extends string> = {
  [selectors in ClassNames]: Styles
}

export interface StylingHooks {
  useCSS(): CSSFunction
  useGlobalStyles(styles: StyleClasses<string>, selectors: any[]): void
  useStyle(styles: Styles, selectors: any[]): string
  useStyles<ClassNames extends string>(styles: StyleClasses<ClassNames>, selectors: any[]): { [key in ClassNames]: string }
}

function useCSSEffect(fn: () => void, selectors?: any[]) {
  // Not using React.useLayoutEffect, since it would not be executed in SSR
  if (selectors) {
    React.useMemo(fn, selectors)
  } else {
    fn()
  }
}

function useMountEffect(fn: () => (() => void) | void) {
  // TODO: Should it be React.useLayoutEffect() if not in SSR?
  React.useEffect(fn, [])
}

function createUseCSS(firstInjectionPosition: number): StylingHooks["useCSS"] {
  let nextInjectionPosition = firstInjectionPosition
  let stylesheet: GeneratedStylesheet
  let stylesheetReferences = 0

  return function useCSS(): CSSFunction {
    const { createCssClass, createStylesheet, generateCssClassName } = React.useContext(StylingContext)

    const [instanceData] = React.useState<{ prevRenderingClassNames: string[] }>({
      prevRenderingClassNames: []
    })

    if (!stylesheet) {
      stylesheet = createStylesheet(nextInjectionPosition++)
    }

    // Array of [className, styles]
    let currentRenderingCssCalls: { [className: string]: Styles } = {}

    useCSSEffect(() => {
      stylesheet.update(currentRenderingCssCalls)

      if (!stylesheet.isAttached) {
        stylesheet.attach()
      }

      instanceData.prevRenderingClassNames = Object.keys(currentRenderingCssCalls)

      // Make sure data gets garbage-collected
      currentRenderingCssCalls = Object.create(null)
    })

    useMountEffect(() => {
      stylesheetReferences++

      return () => {
        if (--stylesheetReferences === 0) {
          stylesheet.detach()
        }
      }
    })

    return function css(styles: Styles): string {
      // Quick & dirty way to match useCSS() calls to previous calls
      const callerID = (new Error("-")).stack!.split("\n")[1]
      const className = "c" + String(hashString(callerID))

      currentRenderingCssCalls[className] = styles

      if (!stylesheet.classNames.has(className)) {
        const cssClass = createCssClass(0, styles)
        stylesheet.addClass(className, className, cssClass)
      }
      return stylesheet.rewrittenClassNames[className]
    }
  }
}

function createUseStyles(firstInjectionPosition: number): Pick<StylingHooks, "useGlobalStyles" | "useStyles"> {
  let nextInjectionPosition = firstInjectionPosition

  function useGlobalStyles<ClassNames extends string>(
    styles: { [selector in ClassNames | string]: Styles },
    selectors: any[]
  ): void {
    const { createCssClass, createStylesheet, generateCssClassName } = React.useContext(StylingContext)
    const injectionPosition = React.useMemo(() => nextInjectionPosition++, [])

    const stylesheet = React.useMemo(
      () => createStylesheet(injectionPosition),
      []
    )

    for (const className in styles) {
      stylesheet.addClass(className, className, createCssClass(1, styles[className]))
    }

    useCSSEffect(() => {
      if (!stylesheet.isAttached) {
        // Initial call
        stylesheet.attach()
      } else {
        stylesheet.update(styles)
      }
    }, selectors)

    useMountEffect(() => {
      return () => {
        stylesheet.detach()
        stylesheet.destroy()
      }
    })
  }

  function useStyles<ClassNames extends string>(
    styles: { [className in ClassNames]: Styles },
    selectors: any[]
  ): { [key in keyof StyleClasses<ClassNames>]: string } {
    const { createCssClass, createStylesheet, generateCssClassName } = React.useContext(StylingContext)
    const injectionPosition = React.useMemo(() => nextInjectionPosition++, [])

    const stylesheet = React.useMemo(
      () => createStylesheet<ClassNames>(injectionPosition),
      []
    )

    useCSSEffect(() => {
      if (!stylesheet.isAttached) {
        // Initial call
        for (const className in styles) {
          const generatedClassName = generateCssClassName(className)
          stylesheet.addClass(className, generatedClassName, createCssClass(1, styles[className]))
        }
        stylesheet.attach()
      } else {
        stylesheet.update(styles)
      }
    }, selectors)

    useMountEffect(() => {
      return () => {
        stylesheet.detach()
        stylesheet.destroy()
      }
    })

    // FIXME: Will return wrong class names if classes change during runtime
    return stylesheet.rewrittenClassNames
  }

  return {
    useGlobalStyles,
    useStyles
  }
}

const maxStylesheetsPerInstantiatedHooks = 1000
let nextHooksInjectionPosition: number = 0

export default function createStyleHooks(): StylingHooks {
  const injectionPosition = nextHooksInjectionPosition
  nextHooksInjectionPosition += maxStylesheetsPerInstantiatedHooks

  const useCSS = createUseCSS(injectionPosition)
  const { useGlobalStyles, useStyles } = createUseStyles(injectionPosition)

  const useStyle = (styles: Styles, selectors: any[]) => {
    const className = React.useMemo(() => nanoid(4), [])
    const classNames = useStyles({ [className]: styles }, selectors)
    return classNames[className]
  }

  return {
    useCSS,
    useGlobalStyles,
    useStyle,
    useStyles
  }
}
