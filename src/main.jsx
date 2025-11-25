import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ConfigProvider } from 'antd'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ConfigProvider
  theme={{
    token: {
      colorPrimary: '#f97316',
    },
    components: {
      Layout: {
        siderBg: '#fff7ed',
      },
      Menu: {
        colorItemBg: '#fff7ed',
        colorItemBgHover: '#fed7aa',
        colorItemBgSelected: '#f97316',
        colorItemText: '#7c2d12',
        colorItemTextSelected: '#fff',
      },
    },
  }}
>
  <App />
</ConfigProvider>

</StrictMode>

)
