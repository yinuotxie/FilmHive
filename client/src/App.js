import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/pages/Layout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import 'antd/dist/reset.css'
import Home from './pages/Home'
import Movie from './pages/Movie'
import Crew from './pages/Crew'

function App () {
  return (
    // router initilization
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* match router path and render component */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />}></Route>
            <Route path="/movie" element={<Movie />}></Route>
            <Route path="/crew" element={<Crew />}></Route>
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
