# style-hook

This is the main user-facing package. It contains the hooks: `useStyles()`, `useStyle()`, `useGlobalStyles()`.

Check out the [project readme](https://github.com/andywer/react-usestyles) for more information.


## Installation

```sh
$ npm install react@next @andywer/style-hook
```


## Usage

### `useStyles()`

```jsx
// Button.js
import { useStyles } from "@andywer/style-hook"
import React from "react"

export function Button (props) {
  const classNames = useStyles({
    button: {
      padding:   "0.6em 1.2em",
      border:    "none",
      boxShadow: "0 0 0.5em #b0b0b0",
      "&:hover": {
        boxShadow: "0 0 0.5em #e0e0e0"
      }
    }
  }, Button)

  return (
    <button className={classNames.button} onClick={props.onClick}>
      {props.children}
    </button>
  )
}
```

Will yield the following CSS:

```css
.button-0-1-2 {
  border: none;
  padding: 0.6em 1.2em;
  background: #3080ff;
  box-shadow: 0 0 0.5em #b0b0b0;
}
.button-0-1-2:hover {
  box-shadow: 0 0 0.5em #e0e0e0;
}
```


### `useStyle()`

This is a convenience function for when you just need to define one CSS class. This is a very frequent use case.

```jsx
// Button.js
import { useStyle } from "@andywer/style-hook"
import React from "react"

export function Button (props) {
  const className = useStyle({
    padding:   "0.6em 1.2em",
    border:    "none",
    boxShadow: "0 0 0.5em #b0b0b0",
    "&:hover": {
      boxShadow: "0 0 0.5em #e0e0e0"
    }
  }, Button)
  return (
    <button className={className} onClick={props.onClick}>
      {props.children}
    </button>
  )
}
```


### Dynamic styles & themes

```jsx
// Button.js
import { useStyles } from "@andywer/style-hook"
import React from "react"

export function Button (props) {
  const classNames = useStyles({
    button: {
      padding:    "0.6em 1.2em",
      background: theme => theme.button.default.background,
      color:      theme => theme.button.default.textColor,
      border:     () => props.border || "none",
      boxShadow:  "0 0 0.5em #b0b0b0",
      "&:hover": {
        boxShadow: "0 0 0.5em #e0e0e0"
      }
    },
    buttonPrimary: {
      background: theme => theme.button.primary.background,
      color:      theme => theme.button.primary.textColor
    }
  }, Button, [props.border])

  const className = [classNames.button, props.primary && classNames.buttonPrimary].join(" ")
  return (
    <button className={className} onClick={props.onClick}>
      {props.children}
    </button>
  )
}
```

All dynamic style rules (that means all rules in a style object that can potentially change during runtime) **MUST** have function values. Those functions receive the current theme (see `App` below) as argument and return the style rule value.

You might be wondering what the second argument, the array, passed to `useStyles()` is good for. It is an optimization that is common among React hooks: Pass a list of all variables that this style object's dynamic rules depend on.

If such an array is provided, the expensive CSS update will only be performed if one of those listed variables changed. The styles will always be updated if another theme is selected (see `App` below). Pass an empty array to indicate that a style update is only necessary on theme change.


### `useGlobalStyles()`

```jsx
// BodyStyles.js
import { useGlobalStyles } from "@andywer/style-hook"
import React from "react"

export function BodyStyles (props) {
  useGlobalStyles({
    "body": {
      margin:  0,
      padding: 0
    },
    "#app": {
      width:     "100%",
      height:    "100%",
      minHeight: "100vh"
    }
  }, BodyStyles, [])
  return props.children || null
}
```

### App

```jsx
// App.js
import { JssProvider } from "@andywer/style-api-jss"
import { ThemeContext } from "@andywer/style-hook"
import React from "react"
import ReactDOM from "react-dom"
import Button from "./Button"

const myTheme = {
  button: {
    default: {
      background: "#ffffff",
      textColor:  "#000000"
    },
    primary: {
      background: "#3080ff",
      textColor:  "#ffffff"
    }
  }
}

const App = () => (
  <JssProvider>
    <ThemeContext.Provider value={myTheme}>
      <Button>Click me!</Button>
    </ThemeContext.Provider>
  </JssProvider>
)

ReactDOM.render(<App />, document.getElementById("app"))
```

The `JssProvider` that renders the styles using [JSS](https://github.com/cssinjs/react-jss) has been implemented as a first proof-of-concept styling library integration.


### Server-side rendering

Works the same way as it always did with the styling library (in this case JSS) you use.

```jsx
// App.js
import { JssProvider, SheetsRegistry } from "@andywer/style-api-jss"
import React from "react"
import ReactDOM from "react-dom"

const registry = new SheetsRegistry()

const App = () => (
  <JssProvider registry={registry}>
    {/* ... */}
  </JssProvider>
)

const appHTML = ReactDOM.renderToString(<App />)
const appCSS = registry.toString()
```


## Open questions

### CSS injection order

A big topic in CSS-in-JS is the injection order: The order in which to write component styles to the stylesheets in the DOM. Even with plain old CSS styles you have to think about the order of your styles if multiple selectors might match the same element.

The default opinion in the community seems to be that an injection order based on component render order will not be stable enough and is likely to lead to styling issues. There are ways to define the injection order based on module resolution order instead, but they imply providing a less friendly API to the user.

So this project is build around the idea of injecting styles based on render order nevertheless. The same issue seemed to be [one of the earliest issues in styled-components](https://github.com/styled-components/styled-components/issues/1) as well, but at least at that time they came to the conclusion that those edge cases are only hurtful if the user tries to implement styling anti-patterns.

Only use the CSS class names returned by `useStyles()`, don't try to add selectors that match certain child tags. You should be fine 😉

Use the styling hook, use it in different scenarios and try to break it. If you manage to break it whithout implementing anti-patterns, please open an issue and share 🐛


## License

MIT
