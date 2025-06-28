import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Light's Portfolio. All rights reserved.
        </p>
        <p className="footer-credit">
          Design and Developed by{' '}
          <a 
            href="https://ashutosh-ranjan.onrender.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="developer-link"
          >
            Ashutosh Ranjan
          </a>
        </p>
      </div>
    </footer>
  )
}