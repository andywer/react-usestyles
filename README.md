# Unified React styling hook

Leveraging the [React Hooks API](https://reactjs.org/docs/hooks-intro.html) to provide an elegant, unified styling API.

One simple API based on the hooks API to style all components. Suddenly it does not matter anymore if you are using Emotion, Styled Components or JSS - the styling becomes transparent.

Great for component libraries: Don't force your users into a particular styling library! Style with universal hooks and let the users plug-in the styling library that works best for them.

#### Features

💅 Style components with `useStyles()`<br />
💡 Uncouple components from styling library<br />
🌅 Server side rendering<br />
🌈 Theming support out of the box<br />

<br />

**Any feedback welcome! Leave [a comment](https://github.com/andywer/react-usestyles/issues/2) or 🌟 the repo.**

⚠️&nbsp;&nbsp;Attention: Bleeding edge ahead. Don't use this in production.


## Installation

In your app:

```sh
$ npm install react@next react-dom@next @andywer/style-hook @andywer/style-api-jss
```

In a component package you only need this:

```sh
$ npm install react@next @andywer/style-hook
```


## Live Playgrounds

Here are some code sandboxes to see the style hooks in action. You can also see the source code and live-edit it:

😸 Basics - <https://codesandbox.io/s/zx4o632n8l><br />
🖥 Material-UI / Simple Hacker News client - <https://codesandbox.io/s/myo47mvjw9><br />


## Usage

### `useStyles()`

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
      border:     "none",
      boxShadow:  "0 0 0.5em #b0b0b0",
      "&:hover": {
        boxShadow: "0 0 0.5em #e0e0e0"
      }
    },
    buttonPrimary: {
      background: theme => theme.button.primary.background,
      color:      theme => theme.button.primary.textColor
    }
  })

  const className = `${classNames.button} ${props.primary ? classNames.buttonPrimary : ""}`
  return (
    <button className={className} onClick={props.onClick}>
      {props.children}
    </button>
  )
}
```

Rendering your app with style hook support is easy:
Add a provider for the styling library at the top of your app.

```jsx
// App.js
import { JssProvider } from "@andywer/style-api-jss"
import React from "react"
import ReactDOM from "react-dom"

const App = () => (
  <JssProvider>
    {/* ... */}
  </JssProvider>
)

ReactDOM.render(<App />, document.getElementById("app"))
```

### `useStyle()`

This is a convenience function to define a single CSS class.

```jsx
import { useStyle } from "@andywer/style-hook"
import React from "react"

export function Button (props) {
  const className = useStyle({
    padding:   "0.6em 1.2em",
    boxShadow: "0 0 0.5em #b0b0b0",
    "&:hover": {
      boxShadow: "0 0 0.5em #e0e0e0"
    }
  })
  return (
    <button className={className} onClick={props.onClick}>
      {props.children}
    </button>
  )
}
```

### Theming & props

```jsx
import { useStyles } from "@andywer/style-hook"
import React from "react"

export function Button (props) {
  const classNames = useStyles({
    button: {
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
  }, [props.border])

  const className = `${classNames.button} ${props.primary ? classNames.buttonPrimary : ""}`
  return (
    <button className={className} onClick={props.onClick}>
      {props.children}
    </button>
  )
}
```

For details see the [`style-hook` package readme](https://github.com/andywer/react-usestyles/blob/master/packages/style-hook/README.md).


## Details

**For more details about the API and usage instructions, check out the [`style-hook` package readme](./packages/style-hook/README.md).**


## API

- [`style-hook`](./packages/style-hook) - The main package providing the hooks
- [`style-api`](./packages/style-api) - Defines the API between styling library provider and hooks (internal)
- [`style-api-jss`](./packages/style-api-jss) - The styling library provider for [JSS](http://cssinjs.org/)


## License

MIT
