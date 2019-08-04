/// <reference lib="dom" />

import nanoid from "nanoid"
import * as React from "react"
import { createCssClass, GeneratedCssClass } from "./css-class"
import { createStylesheet, GeneratedStylesheet } from "./css-sheet"
import { Styles } from "./styles"

export interface StylingContextType {
  createCssClass(refCounter: number, styles: Styles): GeneratedCssClass
  createStylesheet<ClassNames extends string = string>(
    injectionPosition: number
  ): GeneratedStylesheet<ClassNames>
  generateCssClassName(friendlyName?: string): string
}

const generateCssClassName = (friendlyName?: string) => {
  return friendlyName
    ? `${friendlyName}-${nanoid(6)}`
    : nanoid(6)
}

export const StylingContext = React.createContext<StylingContextType>({
  createCssClass,
  createStylesheet: (injectionPosition: number) => createStylesheet(injectionPosition, generateCssClassName),
  generateCssClassName
})
