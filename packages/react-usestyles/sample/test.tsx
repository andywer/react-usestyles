import * as React from "react"
import ReactDOM from "react-dom"
import createStyleHooks, { cx } from "../src/index"

const { useCSS, useGlobalStyles, useStyles } = createStyleHooks()

const limit = (value: number, limits: [number, number]) => Math.max(Math.min(value, limits[1]), limits[0])

function Counter() {
  const [counter, setCounter] = React.useState(0)

  const decrement = React.useCallback(() => setCounter(ctr => ctr - 1), [])
  const increment = React.useCallback(() => setCounter(ctr => ctr + 1), [])

  const css = useCSS()
  const classes = useStyles({
    button: {
      marginLeft: 8,
      marginRight: 8
    },
    buttonOutOfBounds: {
      background: "red",
      color: "white"
    }
  }, [counter])

  const hue = limit(50 + counter * 10, [0, 100])

  return (
    <span className={css({ color: `hsl(${hue}, 100%, 50%)`, marginTop: 16 })}>
      Counter:&nbsp;{counter}&nbsp;&nbsp;
      <button className={cx(classes.button, counter < -5 && classes.buttonOutOfBounds)} onClick={decrement}>
        -
      </button>
      <button className={cx(classes.button, counter > 5 && classes.buttonOutOfBounds)} onClick={increment}>
        +
      </button>
    </span>
  )
}

function App() {
  useGlobalStyles({
    "html, body": {
      background: "#333",
      color: "white",
      font: "14px Avenir, sans-serif"
    },
    "main": {
      textAlign: "center"
    }
  }, [])

  return (
    <main>
      <p>
        Test, test
      </p>
      <p>
        <Counter />
      </p>
    </main>
  )
}

ReactDOM.render(<App />, document.getElementById("app"))
