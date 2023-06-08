import { Routes, Route} from 'react-router-dom'
import { Login } from '../page/Login/Index'
import { Register } from '../page/Register/Index'
import { Dashboard } from '../page/Dashboard'
import { Schedules } from '../page/Schedules/Index'
import { PrivateRoute } from './PrivateRoute'
import { EditProfile } from '../page/EditProfile/Index'

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
      <Route
        path='/dashboard'
        element={
        <PrivateRoute>
          <Dashboard/>
        </PrivateRoute> }
      />
      <Route
        path='/schedules'
        element={
          <PrivateRoute>
            <Schedules/>
          </PrivateRoute>
        }
      />
      <Route
        path='/edit-profile'
        element={
          <PrivateRoute>
            <EditProfile/>
          </PrivateRoute>
        }
      />

    </Routes>

  )
  
}