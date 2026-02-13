import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
// tomar las rutas del router 
import { router } from './routes/router.jsx'
import { Router } from 'react-router'
import { RouterProvider } from 'react-router-dom'


function App() {
  return (
    <>
      <RouterProvider router={router} />
      <h1 className='bg-surface text-ink p-6 text-1xl'>Mundo Cupones</h1>
    </>
  )
}

export default App
