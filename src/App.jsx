import React from 'react'
import Header from './components/Header'
import About from './components/About'
import Portfolio from './components/Portfolio'
import Connect from './components/Connect'
import Footer from './components/Footer'
import './App.css'

function App() {
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