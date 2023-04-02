import React from 'react'
import LoginStore from "./login.Store"

class RootStore {
  constructor() {
    this.loginStore = new LoginStore()
    // ...
  }
}

const rootStore = new RootStore()
const context = React.createContext(rootStore)
const useStore = () => React.useContext(context)

export { useStore }