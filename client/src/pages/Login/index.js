import { Card, Form, Input, Checkbox, Button, message } from "antd"
import { useStore } from "@/store"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import logo from "@/assets/filmhive.png"
import "./index.scss"
import axios from "axios"
import ParticlesBg from "particles-bg"

const config = require('../../config.json')

function Login () {

  const { loginStore } = useStore()
  const navigate = useNavigate()

  const [emailValue, setEmailValue] = useState('')
  const [pwdValue, setPwdValue] = useState('')
  const [agreementChecked, setAgreementChecked] = useState(false)

  function onFinish (values) {
    axios.get(`http://${config.server_host}:${config.server_port}/login`, {
      params: {
        email: values.email,
        password: values.password,
      },
    }).then((response) => {
      const token = response.data[0]
      loginStore.setToken(token)
      navigate('/home', { replace: true })
      message.success('Login success')
    }).catch((error) => {
      console.log(error)
      message.error('Invalid email or password')
    })
  }

  const handleRegister = () => {
    window.location.href = '/register'
  }

  return (
    <>
      <div className="login">
        <Card className="login-container" style={{ height: "430px" }}>
          <img className="login-logo" src={logo} alt="" />
          <Form
            validateTrigger={['onBlur', 'onChange']}
            onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          // initialValues={{
          //   remember: true,
          //   email: 'initialvalue',
          //   password: 'initialvalue'
          // }}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  type: "email",
                  message: 'Wrong email format',
                  validateTrigger: 'onBlur'
                },
                { required: true, message: 'Please input your email' }
              ]}
            >
              <Input size="large" placeholder="Your email" onChange={(e) => setEmailValue(e.target.value)} />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password' }
              ]}
            >
              <Input size="large" placeholder="Your password" onChange={(e) => setPwdValue(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Checkbox className="login-checkbox-label" onChange={(e) => setAgreementChecked(e.target.checked)}>
                I have read and agree to the User Agreement and Privacy Terms.
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block disabled={!agreementChecked || !emailValue || !pwdValue}>
                LOGIN
              </Button>
            </Form.Item>
          </Form>
          <Button type="primary" htmlType="submit" size="large" block onClick={handleRegister}>
            SIGN UP
          </Button>
        </Card>
      </div >
      <ParticlesBg type="color" bg={false} />
    </>
  )
}

export default Login