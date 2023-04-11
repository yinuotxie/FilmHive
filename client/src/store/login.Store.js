// login module
import { makeAutoObservable } from "mobx"
import { http } from "@/utils"

class LoginStore {

  // data definition
  token = '';

  //reactive
  constructor() {
    makeAutoObservable(this)
  }

  //actions
  getToken = async ({ email, password }) => {
    console.log(email, password)
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', { email, password })
    this.token = res.data.token
  }
}

export default LoginStore