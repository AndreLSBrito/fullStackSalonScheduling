import { Routes, Route} from 'react-router-dom'
import { Login } from '../page/Login/Index'
import { Register } from '../page/Register/Index'

export const RouteApp = () =>{
  return(
   
    <Routes>
      <Route
        path='/'
        element={<Login/>}
      />
      <Route
        path='/register'
        element={<Register/>}
      />

    </Routes>

  )
  
}