import { Card, Form, Input, Checkbox, Button, message } from "antd"
import logo from "@/assets/filmhive.png"
import "./index.scss"
import { useStore } from "@/store"
import { useNavigate } from "react-router-dom"

function Login () {

  const { loginStore } = useStore()
  const navigate = useNavigate()

  function onFinish (values) {
    // console.log(values)
    loginStore.getToken({
      email: values.email,
      password: values.password
    })
    navigate('/', { replace: true })
    message.success('Login success')
  }

  // function onFinishFailed (errorInfo) {
  //   console.log(errorInfo)
  // }

  return (
    <div className="login">
      <Card className="login-container">
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
                // pattern: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63})$/,
                message: 'Wrong email format',
                validateTrigger: 'onBlur'
              },
              { required: true, message: 'Please input your email' }
            ]}
          >
            <Input size="large" placeholder="Your email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password' }
            ]}
          >
            <Input size="large" placeholder="Your password" />
          </Form.Item>
          <Form.Item>
            <Checkbox className="login-checkbox-label">
              I have read and agree to the User Agreement and Privacy Terms.
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login