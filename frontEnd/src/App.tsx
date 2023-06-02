import './global.css'
import {BrowserRouter} from 'react-router-dom'
import { RouteApp } from './routes/Index'
function App() {
  return (
    <BrowserRouter>
      <RouteApp/>
    </BrowserRouter>
  )
}

export default App
