import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { ThemeContext } from "theming"
import { useStyles } from "../lib/index"
import { JssProvider } from "../lib/jss"

const themeDark = {
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

function Button (props) {
  const classNames = useStyles(theme => ({
    button: {
      padding: "0.6em 1.2em",
      background: props.primary ? theme.button.primary.background : theme.button.default.background,
      color: props.primary ? theme.button.primary.textColor : theme.button.default.textColor,
      cursor: "pointer",
      border: "none",
      boxShadow: "0 0 0.5em #b0b0b0",
      fontSize: 14,
      "&:hover": {
        boxShadow: "0 0 0.5em #e0e0e0"
      }
    }
  }))
  return (
    <button className={[classNames.button, props.className || ""].join(" ")} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

function StrangeButton (props) {
  const classNames = useStyles({
    strangeButton: {
      background: "green"
    }
  })
  return (
    <Button className={classNames.strangeButton}>
      {props.children}
    </Button>
  )
}

function Container (props) {
  const classNames = useStyles({
    container: props.css
  })
  return (
    <div className={classNames.container}>
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
    <JssProvider>
      <ThemeContext.Provider value={themeName === "light" ? themeLight : themeDark}>
        <FullSizeContainer css={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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

ReactDOM.render(<App />, document.getElementById("app"))
