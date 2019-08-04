import { createCssClass, GeneratedCssClass } from "./css-class"
import { Styles } from "./styles"

const $generateClassName = Symbol("generateClassName")

export interface GeneratedStylesheet<ClassNames extends string = string> {
  /** Maps `originalClassName` => `generatedClassName` */
  classes: { [originalClassName in ClassNames]: GeneratedCssClass }
  classNames: Set<ClassNames>
  classRuleIndexes: { [originalClassName in ClassNames]: number }
  rewrittenClassNames: { [originalClassName in ClassNames]: string }
  // TODO: topLevelRules?: GeneratedCssClass
  injectionPosition: number
  isAttached: boolean
  styleElement: HTMLStyleElement

  attach(): void
  destroy(): void
  detach(): void
  addClass(originalClassName: ClassNames, rewrittenClassName: string, cssClass: GeneratedCssClass): void
  removeClass(originalClassName: ClassNames): void
  removeUnusedClasses(): void
  update(updatedStyles: { [className in ClassNames]: Styles }): void

  [$generateClassName](originalClassName: string): string
}

function insertRule(styleTag: HTMLStyleElement, sheet: CSSStyleSheet, content: string): number {
  if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "production") {
    return sheet.insertRule(content)
  } else {
    styleTag.appendChild(document.createTextNode(content))
    return styleTag.childNodes.length - 1
  }
}

function deleteRule(styleTag: HTMLStyleElement, sheet: CSSStyleSheet, index: number) {
  if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "production") {
    sheet.removeRule(index)
  } else {
    styleTag.childNodes[index].remove()
  }
}

const StylesheetPrototype: Pick<GeneratedStylesheet<string>, "attach" | "destroy" | "detach" | "addClass" | "removeClass" | "removeUnusedClasses" | "update"> = {
  attach(this: GeneratedStylesheet<string>) {
    const sheetNeedsInit = !this.styleElement.sheet
    if (this.isAttached) return

    document.head.appendChild(this.styleElement)
    const sheet = this.styleElement.sheet as CSSStyleSheet
    this.isAttached = true

    if (sheet && sheetNeedsInit) {
      for (const className of this.classNames) {
        const cssClass = this.classes[className]
        const rewrittenClassName = this.rewrittenClassNames[className]
        this.classRuleIndexes[className] = insertRule(this.styleElement, sheet, `.${rewrittenClassName}{${cssClass.css}}\n`)
      }
    }
  },
  destroy(this: GeneratedStylesheet<string>) {
    if (this.isAttached) {
      this.detach()
    }
    // TODO
  },
  detach(this: GeneratedStylesheet<string>) {
    if (!this.isAttached) return
    document.head.removeChild(this.styleElement)
    this.isAttached = false
  },
  addClass(this: GeneratedStylesheet<string>, originalClassName: string, rewrittenClassName: string, cssClass: GeneratedCssClass) {
    const sheet = this.styleElement.sheet as CSSStyleSheet
    this.classes[originalClassName] = cssClass
    this.rewrittenClassNames[originalClassName] = rewrittenClassName
    this.classNames.add(originalClassName)

    if (sheet) {
      this.classRuleIndexes[originalClassName] = insertRule(this.styleElement, sheet, `.${rewrittenClassName}{${cssClass.css}}\n`)
    }
  },
  removeClass(this: GeneratedStylesheet<string>, originalClassName: string) {
    const sheet = this.styleElement.sheet as CSSStyleSheet

    if (sheet) {
      deleteRule(this.styleElement, sheet, this.classRuleIndexes[originalClassName])
    }

    // TODO: Check performance of `delete`
    delete this.classes[originalClassName]
    delete this.classRuleIndexes[originalClassName]
    delete this.rewrittenClassNames[originalClassName]
    this.classNames.delete(originalClassName)
  },
  removeUnusedClasses(this: GeneratedStylesheet<string>) {
    for (const className in this.classes) {
      const cssClass = this.classes[className]
      if (cssClass.referenceCounter < 1) {
        this.removeClass(className)
      }
    }
  },
  update(this: GeneratedStylesheet<string>, updatedStyles: { [className: string]: Styles }) {
    const prevClassNames = Array.from(this.classNames)
    const nextClassNames = Object.keys(updatedStyles)

    const classNamesToAdd = nextClassNames.filter(className => prevClassNames.indexOf(className) === -1)
    const classNamesToRemove = prevClassNames.filter(className => nextClassNames.indexOf(className) === -1)
    const classNamesToUpdate = prevClassNames.filter(className => nextClassNames.indexOf(className) > -1)

    for (const className of classNamesToAdd) {
      const cssClass = createCssClass(1, updatedStyles[className])
      const generatedClassName = this[$generateClassName](className)
      this.addClass(className, generatedClassName, cssClass)
    }
    for (const className of classNamesToRemove) {
      this.removeClass(className)
    }
    for (const className of classNamesToUpdate) {
      const cssClass = createCssClass(1, updatedStyles[className])

      if (cssClass.fingerprint !== this.classes[className].fingerprint) {
console.log(">>", className)
        const generatedClassName = this.rewrittenClassNames[className]
        this.removeClass(className)
        this.addClass(className, generatedClassName, cssClass)
      }
    }
  }
}

export function createStylesheet<ClassNames extends string = string>(
  injectionPosition: number,
  generateClassName: (originalName: string) => string
): GeneratedStylesheet<ClassNames> {
  const styleElement = document.createElement("style")
  return Object.assign(Object.create(StylesheetPrototype) as typeof StylesheetPrototype, {
    [$generateClassName]: generateClassName,
    classes: {} as GeneratedStylesheet<ClassNames>["classes"],
    classNames: new Set<ClassNames>(),
    classRuleIndexes: {} as GeneratedStylesheet<ClassNames>["classRuleIndexes"],
    rewrittenClassNames: {} as GeneratedStylesheet<ClassNames>["rewrittenClassNames"],
    injectionPosition,
    isAttached: false,
    styleElement
  })
}
