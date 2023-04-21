import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/pages/Layout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import 'antd/dist/reset.css'
import Home from './pages/Home'
import Movie from './pages/Movie'
import Actor from './pages/Actor'
import Director from './pages/Director'

function App () {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />}></Route>
            <Route path="/movie" element={<Movie />}></Route>
            <Route path="/actor" element={<Actor />}></Route>
            <Route path="/director" element={<Director />}></Route>

          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
