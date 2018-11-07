# Unified React styling hook

Style your components using [React hooks](https://reactjs.org/docs/hooks-intro.html) for fun and profit!

A hook is not only a clean and elegant way to style components, but this one takes CSS in React a big step further:

This is a unified `useStyles()` hook that **is not bound to a particular CSS-in-JS library**, making the choice between Emotion, styled components, JSS or another styling implementation merely an afterthought!

#### Features

💅 Style components with `useStyles()`<br />
💡 Uncouple components from styling library<br />
🌅 Server side rendering<br />
🌈 Theming support out of the box<br />

<br />

**Feedback very welcome! Open an issue or 🌟 the repo.**

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


## Usage

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

```jsx
// App.js
import { JssProvider } from "@andywer/style-api-jss"
import React from "react"
import ReactDOM from "react-dom"
import Button from "./Button"

const App = () => (
  <JssProvider>
    <Button>Click me!</Button>
  </JssProvider>
)

ReactDOM.render(<App />, document.getElementById("app"))
```


## Details

**For more details about the API and usage instructions, check out the [`style-hook` package readme](./packages/style-hook/README.md).**


## Samples

Visit this [demo code sandbox](https://codesandbox.io/s/zx4o632n8l) to see it in action and play around with the code.

You can also have a look at [./samples/app](./samples/app). Clone this repository, `yarn install` and `yarn sample:serve` to play around with it.


## Packages

- [`style-hook`](./packages/style-hook) - The main package providing the hooks
- [`style-api`](./packages/style-api) - Defines the API between styling library provider and hooks (internal)
- [`style-api-jss`](./packages/style-api-jss) - The styling library provider for [JSS](http://cssinjs.org/)


## License

MIT
