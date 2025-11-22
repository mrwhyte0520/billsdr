
import { BrowserRouter } from 'react-router-dom'
import { Suspense } from 'react'
import { AppRoutes } from './router'

function App() {
  return (
    <BrowserRouter basename={__BASE_PATH__}>
      <Suspense fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-100 font-medium tracking-wide">Cargando BILLS DR...</p>
          </div>
        </div>
      }>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
