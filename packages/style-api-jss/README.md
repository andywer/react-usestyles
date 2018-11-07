# style-api-jss

This package provides the glue to render the styles defined using the hooks using [JSS](http://cssinjs.org/).

Check out the [project readme](https://github.com/andywer/react-usestyles) for more information.


## Installation

```sh
$ npm install react@next react-dom@next @andywer/style-hook @andywer/style-api-jss
```


## Usage

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

## Server-side rendering

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


## License

MIT
