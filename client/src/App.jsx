import './App.css'
import RegisterPage from './Pages/RegisterPage'
import LoginPage from './Pages/LoginPage'
import Dashboard from './Pages/Dashboard'
import { Routes, Route } from 'react-router'
function App() {

  return (
    <>
      <Routes>

        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />


        <Route path='/' element={<Dashboard />} />
        
        
    
      </Routes>
    </>
  )
}

export default App
