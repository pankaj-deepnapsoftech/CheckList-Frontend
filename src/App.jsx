import { Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './component/Login';
function App() {
 

  return (
    <>
      <h1 class="text-3xl text-red-400 font-bold underline">Hello world!</h1>

      <Routes>
        <Route path="/login" element={<Login/>} />
      </Routes>
    </>
  );
}

export default App
