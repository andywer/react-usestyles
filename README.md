# Unified React styling hook

Style your components using [React hooks](https://reactjs.org/docs/hooks-intro.html) for fun and profit.

Using a hook is not only a clean and elegant way to style components, but this one takes CSS in React one big step further:

This is a unified `useStyles()` hook that **is not bound to a particular CSS-in-JS library**, making the choice between Emotion, styled components, JSS or another styling implementation merely an afterthought!

#### Features

* Style components with `useStyles()`
* Single hook that works with JSS, Emotion, styled components, ...
* Server Side Rendering
* Theming support out of the box
* Apply global styles using `useGlobalStyles()`

**Feedback very welcome! Open an issue or 🌟 the repo.**

⚠️ Attention: Bleeding edge ahead. Don't use this in production.


## Installation

```sh
$ npm install react@next react-dom@next @andywer/style-hook @andywer/style-api-jss
```


## Usage

### Basic

```jsx
// Button.js
import { useStyles } from "@andywer/style-hook"
import React from "react"

export function Button (props) {
  const classNames = useStyles({
    button: {
      padding: "0.6em 1.2em",
      border: "none",
      boxShadow: "0 0 0.5em #b0b0b0",
      "&:hover": {
        boxShadow: "0 0 0.5em #e0e0e0"
      }
    }
  })

  return (
    <button className={classNames.button} onClick={props.onClick}>
      {props.children}
    </button>
  )
}
```


### Dynamic styles & using themes

```jsx
// Button.js
import { useStyles } from "@andywer/style-hook"
import React from "react"

export function Button (props) {
  const classNames = useStyles({
    button: {
      padding: "0.6em 1.2em",
      background: theme => theme.button.default.background,
      color: theme => theme.button.default.textColor,
      border: () => props.border || "none",
      boxShadow: "0 0 0.5em #b0b0b0",
      "&:hover": {
        boxShadow: "0 0 0.5em #e0e0e0"
      }
    },
    buttonPrimary: {
      background: theme => theme.button.primary.background,
      color: theme => theme.button.primary.textColor      
    }
  }, [props.border])

  const className = [classNames.button, props.primary && classNames.buttonPrimary].join(" ")
  return (
    <button className={className} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

ReactDOM.render()
```

All dynamic style rules (that means all rules in a style object that can potentially change during runtime) **MUST** have function values. Those functions receive the current theme (see `App` below) as argument and return the style rule value.

You might be wondering what the second argument, the array, passed to `useStyles()` is good for. It is an optimization that is common among React hooks: Pass a list of all variables that this style object's dynamic rules depend on.

If such an array is provided, the expensive CSS update will only be performed if one of those listed variables changed. The styles will always be updated if another theme is selected (see `App` below). Pass an empty array to indicate that a style update is only necessary on theme change.

### Global styles

```jsx
// BodyStyles.js
import { useGlobalStyles } from "@andywer/style-hook"
import React from "react"

export function BodyStyles (props) {
  useGlobalStyles({
    "body": {
      margin: 0,
      padding: 0
    },
    "#app": {
      width: "100%",
      height: "100%",
      minHeight: "100vh"
    }
  }, [])
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
      textColor: "#000000"
    },
    primary: {
      background: "#3080ff",
      textColor: "#ffffff"
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

## Samples

Visit this [demo code sandbox](https://codesandbox.io/s/zx4o632n8l) to see it in action and play around with the code.

You can also have a look at [./samples/app](./samples/app). Clone this repository, `yarn install` and `yarn sample:serve` to play around with it.


## License

MIT
