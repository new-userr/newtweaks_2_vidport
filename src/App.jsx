import React from 'react'
import Header from './components/Header'
import About from './components/About'
import Portfolio from './components/Portfolio'
import Connect from './components/Connect'
import Footer from './components/Footer'
import { useCursor } from './hooks/useCursor'
import './App.css'
import './styles/cursor.css'

function App() {
  // Initialize custom cursor
  const { setLoadingState } = useCursor()

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <About />
        <Portfolio />
      </main>
      <Connect />
      <Footer />
    </div>
  )
}

export default App