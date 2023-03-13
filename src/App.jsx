import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './layouts/Landing';
import Usuarios from './layouts/Usuarios';
import Administrador from './layouts/Administrador';
import Error from './layouts/Error';

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Landing></Landing>}></Route>
      <Route path='/usuarios' element={<Usuarios></Usuarios>}></Route>
      <Route path='/administrador' element={<Administrador></Administrador>}></Route>
      <Route path='/404' element={<Error></Error>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
