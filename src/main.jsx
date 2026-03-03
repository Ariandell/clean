import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'
import { ErrorBoundary } from './components/ErrorBoundary'


const updateSW = registerSW({
    immediate: true,
    onRegistered(r) {
        console.log('SW Registered via virtual:pwa-register', r)
    },
    onRegisterError(error) {
        console.error('SW Registration error', error)
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
)
