import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css' // import styles so Vite includes them in the build and rewrites the path with base

createRoot(document.getElementById('root')).render(<App />)
