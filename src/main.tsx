import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 開發模式下執行測試
if (import.meta.env.DEV) {
  import('./App.test.tsx').then(() => {
    console.log('測試已載入，請查看控制台');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
