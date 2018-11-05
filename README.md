# Unified React styling hook

Styling components using the newly introduced React hooks for fun and profit.

The hook does not only provide a clean and simple way to style components, but it is going one step further here:

Providing a unified styling hook that can work with any CSS-in-JS library out of the box!

##### Features

* Style components with `useStyles()`
* Single hook that works with JSS, emotion, styled components, ...
* Server Side Rendering
* Theming support out of the box
* Apply global styles using `useGlobalStyles()`

Status: ⚠️ Experimental

**Feedback very welcome! Open an issue or 🌟 the repo.**


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
      cursor: "pointer",
      border: "none",
      boxShadow: "0 0 0.5em #b0b0b0",
      fontSize: 14,
      "&:hover": {
        boxShadow: "0 0 0.5em #e0e0e0"
      },
      "&:focus": {
        boxShadow: "0 0 0.5em #e0e0e0",
        outline: "none"
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


### Dynamic styles

```jsx
// Button.js
import { useStyles } from "@andywer/style-hook"

export function Button (props) {
  const classNames = useStyles({
    button: {
      padding: "0.6em 1.2em",
      background: theme => (
        props.primary ? theme.button.primary.background : theme.button.default.background
      ),
      color: theme => (
        props.primary ? theme.button.primary.textColor : theme.button.default.textColor
      ),
      cursor: "pointer",
      border: "none",
      boxShadow: "0 0 0.5em #b0b0b0",
      fontSize: 14,
      "&:hover": {
        boxShadow: "0 0 0.5em #e0e0e0"
      },
      "&:focus": {
        boxShadow: "0 0 0.5em #e0e0e0",
        outline: "none"
      }
    }
  }, [props.primary])   // <- the array specifies that the styles only need to be
                        //    updated if one of the array element values change

  return (
    <button className={classNames.button} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

ReactDOM.render()
```

### Global styles

```jsx
// BodyStyles.js
import { useGlobalStyles } from "@andywer/style-hook"

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

Note that as of right now, the `JssProvider` that renders the styles using [JSS](https://github.com/cssinjs/react-jss) is the only styling library integration that comes out of the box.


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

Have a look at [./samples/app](./samples/app). You can clone this repository, `yarn install` and `yarn sample:serve` to play around with it.


## License

MIT
