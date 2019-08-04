import * as React from "react"
import { serializeStyles } from "@emotion/serialize"

export type Styles = React.CSSProperties | { [selector: string]: React.CSSProperties }

export function compileStylesToRule(styles: Styles): string {
  return serializeStyles([styles as any], null as any).styles
}
