import hashString from "./string-hash"
import { compileStylesToRule, Styles } from "./styles"

export interface GeneratedCssClass {
  css: string
  fingerprint: number
  referenceCounter: number
  decreaseRefCounter(): void
  increaseRefCounter(): void
}

const CssClassPrototype: Pick<GeneratedCssClass, "decreaseRefCounter" | "increaseRefCounter"> = {
  decreaseRefCounter(this: GeneratedCssClass) {
    this.referenceCounter--
  },
  increaseRefCounter(this: GeneratedCssClass) {
    this.referenceCounter++
  }
}

export function createCssClass(initialRefCounterValue: number, styles: Styles): GeneratedCssClass {
  const css = compileStylesToRule(styles)
  const fingerprint = hashString(css)

  return Object.assign(Object.create(CssClassPrototype) as typeof CssClassPrototype, {
    css,
    fingerprint,
    referenceCounter: initialRefCounterValue
  })
}
