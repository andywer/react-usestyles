export function cx(...classNames: Array<string | false | null | undefined>): string
export function cx(classNames: string[]): string
export function cx(map: { [className: string]: boolean }): string
export function cx(first: unknown, ...others: any[]): string {
  if (typeof first === "string" || !first) {
    const classNames: string[] = [first, ...others]
    return classNames.filter(className => !!className).join(" ")
  } else if (Array.isArray(first)) {
    return cx(...first)
  } else if (typeof first === "object") {
    const array: string[] = []
    for (const className in first) {
      if ((first as any)[className]) {
        array.push(className)
      }
    }
    return cx(...array)
  }
  throw Error(`Unexpected first argument to cx(): ${first} (typeof ${typeof first})\n  Expected a string, an array or an object.`)
}
