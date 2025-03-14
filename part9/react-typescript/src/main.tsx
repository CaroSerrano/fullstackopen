import { createRoot } from 'react-dom/client'
import App from './App.tsx'



//El motivo de '!' es que la declaración podría devolver null pero createRoot no acepta null como parámetro. Con el operador !, es posible afirmarle al compilador de TypeScript que el valor no es null.
createRoot(document.getElementById('root')!).render(
  <App />
)
