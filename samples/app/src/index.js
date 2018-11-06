import { useGlobalStyles, useStyle, useStyles, ThemeContext } from "@andywer/style-hook"
import { JssProvider, SheetsRegistry } from "@andywer/style-api-jss"
import React, { useState } from "react"
import ReactDOM from "react-dom"

const themeDark = {
  body: {
    background: "#505050"
  },
  button: {
    default: {
      background: "#303030",
      textColor: "#ffffff"
    },
    primary: {
      background: "#303030",
      textColor: "#f65151"
    }
  }
}

const themeLight = {
  body: {
    background: "#ffffff"
  },
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

function GlobalStyles () {
  useGlobalStyles({
    "body": {
      margin: 0,
      padding: 0,
      background: theme => theme.body.background,
      transition: "background .2s"
    },
    "#app": {
      width: "100%",
      height: "100%",
      minHeight: "100vh"
    }
  }, [])
  return null
}

function Button (props) {
  const classNames = useStyles({
    default: {
      padding: "0.6em 1.2em",
      background: theme => theme.button.default.background,
      color: theme => theme.button.default.textColor,
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
    },
    primary: {
      background: theme => theme.button.primary.background,
      color: theme => theme.button.primary.textColor
    }
  }, [])

  const className = [
    classNames.default,
    props.primary && classNames.primary,
    props.className || ""
  ].join(" ")
  return (
    <button className={className} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

function StrangeButton (props) {
  const className = useStyle({ background: "green" })
  return (
    <Button className={className}>
      {props.children}
    </Button>
  )
}

function Container (props) {
  const className = useStyle(() => props.css, [props.css])
  return (
    <div className={className}>
      {props.children}
    </div>
  )
}

function FullSizeContainer (props) {
  return (
    <Container css={{ width: "100%", height: "100%", minHeight: "100vh", ...props.css }}>
      {props.children}
    </Container>
  )
}

function App () {
  const [themeName, setActiveTheme] = useState("light")
  const toggleTheme = () => setActiveTheme(themeName === "light" ? "dark" : "light")
  return (
    <JssProvider registry={window.registry}>
      <ThemeContext.Provider value={themeName === "light" ? themeLight : themeDark}>
        <FullSizeContainer css={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <GlobalStyles />
          <StrangeButton>
            Strange button
          </StrangeButton>
          <Button primary onClick={toggleTheme}>
            Switch to {themeName === "light" ? "dark" : "light"} theme
          </Button>
          <Button>
            Default button
          </Button>
        </FullSizeContainer>
      </ThemeContext.Provider>
    </JssProvider>
  )
}

window.registry = new SheetsRegistry()

ReactDOM.render(<App />, document.getElementById("app"))

console.log("Aggregated styles for SSR:\n", window.registry.toString())
