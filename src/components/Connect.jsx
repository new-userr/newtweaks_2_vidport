import React from 'react'
import { motion } from 'framer-motion'
import { FaInstagram, FaYoutube, FaLinkedin, FaTwitter, FaEnvelope, FaLock } from 'react-icons/fa'
import './Connect.css'

export default function Connect() {
  const socialLinks = [
    { name: 'Instagram', icon: FaInstagram, url: 'https://www.instagram.com/howvidhant' },
    { name: 'YouTube', icon: FaYoutube, url: 'https://youtube.com/@mightyxmind' },
    { name: 'LinkedIn', icon: FaLinkedin, url: 'https://www.linkedin.com/in/vidhant-gurav-564389220' },
    { name: 'Twitter', icon: FaTwitter, url: 'https://twitter.com/GuravVidhant' },
    { name: 'Email', icon: FaEnvelope, url: 'mailto:whyvidhant@gmail.com' },
  ]

  return (
    <motion.section 
      className="connect-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="connect-container">
        <div className="connect-header">
          <FaLock className="connect-lock-icon" />
          <h2 className="connect-title">Connect With Me</h2>
        </div>
        <ul className="connect-links">
          {socialLinks.map((link, index) => (
            <motion.li 
              key={link.name}
              className="connect-link-item"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="connect-link"
              >
                <div className="connect-icon-wrapper">
                  <link.icon className="connect-icon" />
                  <motion.div 
                    className="connect-tooltip"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.name}
                  </motion.div>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  )
}