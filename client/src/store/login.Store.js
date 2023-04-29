// login module
import { makeAutoObservable } from "mobx"
// import { http } from "@/utils"

class LoginStore {

  token = '';

  constructor() {
    makeAutoObservable(this)
  }

  setToken = (token) => {
    console.log(token)
    this.token = token
  }
}

export default LoginStore