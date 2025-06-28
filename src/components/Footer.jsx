import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">
        &copy; {new Date().getFullYear()} Light's Portfolio. All rights reserved.
      </p>
    </footer>
  )
}