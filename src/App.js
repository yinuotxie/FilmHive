import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/pages/Layout'
import Login from '@/pages/Login'
import 'antd/dist/reset.css'

function App () {
  return (
    // router initilization
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* match router path and render component */}
          <Route path="/" element={<Layout />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
