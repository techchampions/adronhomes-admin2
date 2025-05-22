import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './components/Redux/store.ts'
import { PropertyProvider } from './MyContext/MyContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
     <Provider store={store}>
      <PropertyProvider>
    <App />
       </PropertyProvider>
    </Provider>
  </BrowserRouter>
  </StrictMode>,
)
