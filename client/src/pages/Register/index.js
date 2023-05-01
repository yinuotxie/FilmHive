import { Card, Form, Input, Checkbox, Button, message, Select } from "antd"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import logo from "@/assets/filmhive.png"
import "./index.scss"
import axios from "axios"
import ParticlesBg from "particles-bg"

const config = require('../../config.json')

function Register () {

  const { Option } = Select
  const navigate = useNavigate()

  const [nameValue, setNameValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [pwdValue, setPwdValue] = useState('')
  const [favoriteGenresValue, setFavoriteGenresValue] = useState([])
  const [agreementChecked, setAgreementChecked] = useState(false)

  async function onFinish (values) {

    const userInfo = {
      username: values.username,
      email: values.email,
      password: values.password,
      favoriteGenres: values.favoriteGenres
    }

    try {
      await axios.get(`http://${config.server_host}:${config.server_port}/register`, { params: userInfo })
      navigate('/', { replace: true })
      message.success('Sign up success')
    } catch (error) {
      console.error(error)
      message.error('Error signing up')
    }
  }

  return (
    <>
      <div className="signup">
        <Card className="signup-container" style={{ width: "600px", height: "600px" }}>
          <img className="signup-logo" src={logo} alt="" />
          <div className="form-container">
            <Form
              validateTrigger={['onBlur', 'onChange']}
              onFinish={onFinish}
            >
              <Form.Item
                className="form-item-container"
                name="username"
                label="Username"
                rules={[
                  { required: true, message: 'Please input your username' }
                ]}
              >
                <Input size="large" placeholder="Your username" onChange={(e) => setNameValue(e.target.value)} />
              </Form.Item>
              <Form.Item
                className="form-item-container"
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
                className="form-item-container"
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please input your password' }
                ]}
              >
                <Input size="large" placeholder="Your password" onChange={(e) => setPwdValue(e.target.value)} />
              </Form.Item>
              <Form.Item
                className="form-item-container"
                name="favoriteGenres"
                label="Favorite movie genres"
                rules={[
                  { required: true, type: 'array', min: 3, max: 5, message: 'Please select 3-5 favorite movie genres' }
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Select 3-5 favorite movie genres"
                  onChange={(value) => setFavoriteGenresValue(value)}
                >
                  <Option value="action">Action</Option>
                  <Option value="adult">Adult</Option>
                  <Option value="adventure">Adventure</Option>
                  <Option value="animation">Animation</Option>
                  <Option value="biography">Biography</Option>
                  <Option value="comedy">Comedy</Option>
                  <Option value="crime">Crime</Option>
                  <Option value="documentary">Documentary</Option>
                  <Option value="drama">Drama</Option>
                  <Option value="family">Family</Option>
                  <Option value="fantasy">Fantasy</Option>
                  <Option value="film-noir">Film-Noir</Option>
                  <Option value="game-show">Game-Show</Option>
                  <Option value="history">History</Option>
                  <Option value="horror">Horror</Option>
                  <Option value="music">Music</Option>
                  <Option value="musical">Musical</Option>
                  <Option value="mystery">Mystery</Option>
                  <Option value="news">News</Option>
                  <Option value="reality-tv">Reality-TV</Option>
                  <Option value="romance">Romance</Option>
                  <Option value="sci-fi">Sci-Fi</Option>
                  <Option value="short">Short</Option>
                  <Option value="sport">Sport</Option>
                  <Option value="talk-show">Talk-Show</Option>
                  <Option value="thriller">Thriller</Option>
                  <Option value="war">War</Option>
                  <Option value="western">Western</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Checkbox className="signup-checkbox-label" checked={agreementChecked} onChange={(e) => setAgreementChecked(e.target.checked)}>
                  Please note that by signing up for FilmHive, you agree to abide by our terms and conditions. This includes refraining from sharing or distributing copyrighted content without permission, and using our platform only for lawful purposes. Violation of these terms may result in account suspension or termination. We strongly advise you to review our terms and conditions before proceeding with your registration.
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block disabled={!nameValue || !emailValue || !pwdValue || !favoriteGenresValue || favoriteGenresValue.length < 3 || favoriteGenresValue.length > 5 || !agreementChecked}>
                  SIGN UP TO FILMHIVE!
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
      <ParticlesBg type='lines' bg={true} />
    </>
  )
}

export default Register